using AutoMapper;
using CarGoSimulator.Data;
using CarGoSimulator.Interfaces;
using CarGoSimulator.Models.DBModels;
using CarGoSimulator.Models.Dtos;
using CarGoSimulator.Models.Utility;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace CarGoSimulator.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DriveController : ControllerBase
    {
        private readonly IConfiguration configuration;
        private readonly UserManager<ApplicationUser> userManager;
        private readonly IDriveService driveService;
        private readonly IUrlService urlService;
        private readonly IMapper mapper;
        private readonly IRepository<Drive> drivesRepository;
        private readonly IRepository<Driver> driversRepository;
        private readonly IRepository<Customer> customersRepository;
        private readonly IRepository<DriveRequest> requestsRepository;
        private readonly CarGoSimulatorDBContext context;

        public DriveController(IConfiguration configuration, UserManager<ApplicationUser> userManager, 
            IDriveService driveService, IUrlService urlService, IMapper mapper, 
            IRepository<Drive> drivesRepository, IRepository<Driver> driversRepository, IRepository<Customer> customersRepository, 
            IRepository<DriveRequest> requestsRepository,
            CarGoSimulatorDBContext context)
        {
            this.configuration = configuration;
            this.userManager = userManager;
            this.driveService = driveService;
            this.urlService = urlService;
            this.mapper = mapper;
            this.drivesRepository = drivesRepository;
            this.driversRepository = driversRepository;
            this.customersRepository = customersRepository;
            this.requestsRepository = requestsRepository;
            this.context = context;
        }

        [HttpGet("[action]")]
        [Authorize]
        public IActionResult Cities()
        {
            return Ok(SupportedZones.supportedCities.ToList());
        }

        [HttpPost("[action]")]
        [Authorize(Roles = "Customer")]
        public async Task<IActionResult> Customer([Bind("StartAddress,Locality,EndAddress")][FromBody] CustomerDrivePost model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ErrorEnum.InvalidModelState);

            var userName = User.Identity.Name;
            if (userName == null)
                return Unauthorized(ErrorEnum.NoUserLogIn);

            var user = await userManager.FindByNameAsync(userName);

            Debug.Assert(user != null);

            var userId = user.Id;
            var lastRequest = await GetLastRequestAsync(userId);

            if (lastRequest != null)
            {
                var lastDrive = await drivesRepository.GetFirstByConditionAsync(d => d.CustomerRequestId == lastRequest.Id);

                if (lastDrive != null && lastDrive.Status == Drive.DriveStatus.Open)
                    BadRequest(ErrorEnum.DriveAlreadyOpen);
            }

            var driveRequest = await FormatRequestAsync(model.StartAddress, model.Locality, userId);

            if (driveRequest == null)
                return BadRequest(ErrorEnum.InvalidStartAddress);

            var endLocation = await FormatSimpleRequestAsync(model.EndAddress, model.Locality);

            if (endLocation == null)
                return BadRequest(ErrorEnum.InvalidEndAddress);

            var startCordinates = driveRequest.Cordinates;
            var endCordinates = endLocation.Cordinates;

            var directionsUrl = @"https://maps.googleapis.com/maps/api/directions/json?" + $"origin={startCordinates}" +
                    $"&destination={endCordinates}&avoid=ferries&units=metric&key={configuration["Maps:Key"]}";

            var directionsResponse = await urlService.SendRequestAsync(directionsUrl);

            var directionsRoot = JsonConvert.DeserializeObject<DirectionsRoot.RootObject>(directionsResponse);
            if (directionsRoot.status != "OK")
                return BadRequest(ErrorEnum.InvalidRoute);

            var directions = mapper.Map<Directions>(directionsRoot);

            requestsRepository.Insert(driveRequest);

            await requestsRepository.ApplyChangesAsync();

            var drive = await driveService.WaitForDriverAsync(driveRequest, directions);

            driveRequest.Status = drive == null ? DriveRequest.RequestStatus.Cancelled : DriveRequest.RequestStatus.Answered;

            requestsRepository.Update(driveRequest);

            await requestsRepository.ApplyChangesAsync();

            if (drive == null)
                return NotFound();

            var driverRequest = await requestsRepository.GetByIdAsync(drive.DriverRequestId);

            Debug.Assert(driverRequest != null);

            var driver = await driversRepository.GetByIdAsync(driverRequest.UserId);

            Debug.Assert(driver != null);

            var applicationDriver = await userManager.FindByIdAsync(driver.Id);

            Debug.Assert(applicationDriver != null);

            var result = mapper.Map<CustomerDriveResult>(drive);

            mapper.Map(driver, result);

            mapper.Map(applicationDriver, result);
            return Ok(result);
        }
        
        [HttpPost("[action]")]
        [Authorize(Roles = "Driver")]
        public async Task<IActionResult> Driver([Bind("StartAddress,Locality")][FromBody] DriverDrivePost model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ErrorEnum.InvalidModelState);

            var userName = User.Identity.Name;
            if (userName == null)
                return Unauthorized(ErrorEnum.NoUserLogIn);

            var user = await userManager.FindByNameAsync(User.Identity.Name);

            Debug.Assert(user != null);

            var userId = user.Id;
            var lastRequest = await GetLastRequestAsync(userId);

            if (lastRequest != null)
            {
                var lastDrive = await drivesRepository.GetFirstByConditionAsync(d => d.DriverRequestId == lastRequest.Id);

                if (lastDrive != null && lastDrive.Status == Drive.DriveStatus.Open)
                    BadRequest(ErrorEnum.DriveAlreadyOpen);
            }

            var driverRequest = await FormatRequestAsync(model.StartAddress, model.Locality, userId);

            if (driverRequest == null)
                return BadRequest(ErrorEnum.InvalidStartAddress);

            requestsRepository.Insert(driverRequest);

            await requestsRepository.ApplyChangesAsync();

            var drive = await driveService.WaitForCustomerAsync(driverRequest);

            driverRequest.Status = drive == null ? DriveRequest.RequestStatus.Cancelled : DriveRequest.RequestStatus.Answered;

            requestsRepository.Update(driverRequest);

            await requestsRepository.ApplyChangesAsync();

            if (drive == null)
                return NotFound();

            var customerRequest = await requestsRepository.GetByIdAsync(drive.CustomerRequestId);

            Debug.Assert(customerRequest != null);

            var applicationCustomer = await userManager.FindByIdAsync(customerRequest.UserId);

            Debug.Assert(applicationCustomer != null);

            var customer = await customersRepository.GetByIdAsync(customerRequest.UserId);

            Debug.Assert(customer != null);

            var result = mapper.Map<DriverDriveResult>(drive);

            mapper.Map(customer, result);

            mapper.Map(applicationCustomer, result);

            drivesRepository.Insert(drive);

            await drivesRepository.ApplyChangesAsync();

            return Ok(result);
        }

        [NonAction]
        private async Task<DriveRequest> GetLastRequestAsync(string userId)
        {
            var requests = context.Set<DriveRequest>();

            var userRequests = requests.Where(d => d.UserId == userId);
            return await userRequests.Where(d => d.CreateDateTime == userRequests.Max(d => d.CreateDateTime)).FirstOrDefaultAsync();
        }

        [NonAction]
        private async Task<DriveRequest> FormatRequestAsync(string address, string locality, string userId)
        {
            var simpleRequest = await FormatSimpleRequestAsync(address, locality);

            if (simpleRequest == null)
                return null;

            var result = mapper.Map<DriveRequest>(simpleRequest);

            result.UserId = userId;
            return result;
        }

        [NonAction]
        private async Task<SimpleDriveRequest> FormatSimpleRequestAsync(string address, string locality)
        {
            var preparedAddress = urlService.PrepareString(address);
            var preparedLocality = urlService.PrepareString(locality);

            var url = @"https://maps.googleapis.com/maps/api/geocode/json?" +
                $"address={preparedAddress}&components=country:{SupportedZones.supportedCountry}&locality:{preparedLocality}&region={SupportedZones.supportedCountry}&key={configuration["Maps:Key"]}";

            var response = await urlService.SendRequestAsync(url);
            var root = JsonConvert.DeserializeObject<GeocodingRoot.RootObject>(response);

            if (root.status != "OK")
                return null;

            GeocodingRoot.Result finalResult = null; 
            string finalSubLocality = null;

            foreach (var result in root.results)
            {
                if (!result.types.Contains("street_address"))
                    continue;

                string subLocality = "Unknown";

                foreach (var addressComponent in result.address_components)
                {
                    foreach (var type in addressComponent.types)
                        if (type == "locality")
                        {
                            if (addressComponent.long_name != locality)
                                goto SkipResult;
                            else if (finalResult != null)
                                return null;
                            else
                                finalResult = result;
                        }
                        else if (type == "sublocality")
                            subLocality = addressComponent.long_name;
                }

                if (finalResult == null)
                    continue;

                finalSubLocality = subLocality;

            SkipResult: continue;
            }

            return finalResult == null ? null : new SimpleDriveRequest
            {
                Cordinates = finalResult.geometry.location.lat.ToString() + "," + finalResult.geometry.location.lng.ToString(),
                Locality = locality,
                SubLocality = finalSubLocality
            };
        }

        [HttpPost("[action]")]
        [Authorize]
        public async Task<IActionResult> Cancel()
        {
            var userName = User.Identity.Name;
            if (userName == null)
                return Unauthorized(ErrorEnum.NoUserLogIn);

            var user = await userManager.FindByNameAsync(userName);

            Debug.Assert(user != null);

            var userId = user.Id;
            var lastRequest = await GetLastRequestAsync(userId);

            if (lastRequest == null || lastRequest.Status != DriveRequest.RequestStatus.Open)
                return NotFound(ErrorEnum.InvalidRequestCancellation);

            if (!await driveService.CancelRequestAsync(lastRequest.Id))
                return NotFound();

            lastRequest.Status = DriveRequest.RequestStatus.Cancelled;

            requestsRepository.Update(lastRequest);

            await requestsRepository.ApplyChangesAsync();
            return Ok();
        }

        [HttpPost("[action]")]
        [Authorize(Roles = "Driver")]
        public async Task<IActionResult> Close()
        {
            var userName = User.Identity.Name;
            if (userName == null)
                return Unauthorized(ErrorEnum.NoUserLogIn);

            var driver = await userManager.FindByNameAsync(userName);

            Debug.Assert(driver != null);

            var driverId = driver.Id;
            var lastRequest = await GetLastRequestAsync(driverId);

            if (lastRequest == null || lastRequest.Status != DriveRequest.RequestStatus.Answered)
                return NotFound(ErrorEnum.InvalidDriveClose);

            var drive = await drivesRepository.GetFirstByConditionAsync(d => d.DriverRequestId == lastRequest.Id);

            Debug.Assert(drive != null);

            if (drive.Status != Drive.DriveStatus.Open)
                return NotFound(ErrorEnum.InvalidDriveClose);

            drive.Status = Drive.DriveStatus.Closed;

            drivesRepository.Update(drive);
            
            await drivesRepository.ApplyChangesAsync();
            return Ok();
        }

        [HttpPost("[action]")]
        [Authorize(Roles = "Customer")]
        public async Task<IActionResult> Rate(int rating)
        {
            if (rating < 1 || rating > 5)
                return BadRequest(ErrorEnum.InvalidDriverRating);

            var userName = User.Identity.Name;
            if (userName == null)
                return Unauthorized(ErrorEnum.NoUserLogIn);

            var customer = await userManager.FindByNameAsync(userName);

            Debug.Assert(customer != null);

            var customerId = customer.Id;
            var lastRequest = await GetLastRequestAsync(customerId);

            if (lastRequest == null || lastRequest.Status != DriveRequest.RequestStatus.Answered)
                return NotFound(ErrorEnum.InvalidDriveRating);

            var drive = await drivesRepository.GetFirstByConditionAsync(d => d.CustomerRequestId == lastRequest.Id);

            if (drive == null || drive.Status != Drive.DriveStatus.Closed)
                return NotFound(ErrorEnum.InvalidDriveRating);

            if (drive.Rating != null)
                return NotFound(ErrorEnum.DriveAlreadyRated);

            var driverRequest = await requestsRepository.GetByIdAsync(drive.DriverRequestId);

            Debug.Assert(driverRequest != null);

            var driver = await driversRepository.GetByIdAsync(driverRequest.UserId);

            Debug.Assert(driver != null);

            drive.Rating = rating;

            drivesRepository.Update(drive);

            if (driver.Rating == null)
                driver.Rating = (ulong)rating;
            else
                driver.Rating += (ulong)rating;

            driver.RatingCount += 1;

            driversRepository.Update(driver);

            await context.SaveChangesAsync();
            return Ok();
        }
    }
}
