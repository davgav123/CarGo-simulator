using AutoMapper;
using CarGoSimulator.Interfaces;
using CarGoSimulator.Models.DBModels;
using CarGoSimulator.Models.Dtos;
using CarGoSimulator.Models.Utility;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Cors;

namespace CarGoSimulator.Controllers
{
    [Route("api/[controller]")]
    [ApiController]    
    [EnableCors("MyPolicy")]
    public class AccountController : ControllerBase
    {
        private readonly IUserRepositoryManager<Customer> customerRepositoryManager; 
        private readonly IUserRepositoryManager<Driver> driverRepositoryManager;
        private readonly UserManager<ApplicationUser> userManager;
        private readonly IRepository<Drive> driveRepository;
        private readonly IRepository<DriveRequest> requestRepository;
        private readonly IMapper mapper;

        public AccountController(IUserRepositoryManager<Customer> customerRepositoryManager, 
            IUserRepositoryManager<Driver> driverRepositoryManager, UserManager<ApplicationUser> userManager, IMapper mapper,
            IRepository<Drive> driveRepository, IRepository<DriveRequest> requestRepository)
        {
            this.customerRepositoryManager = customerRepositoryManager;
            this.driverRepositoryManager = driverRepositoryManager;
            this.userManager = userManager;
            this.mapper = mapper;
            this.driveRepository = driveRepository;
            this.requestRepository = requestRepository;
        }

        [HttpGet("[action]")]
        [Authorize(Roles = "Customer")]
        public async Task<IActionResult> CustomerInfo()
        {
            return await Info<CustomerInfoResult, Customer>(customerRepositoryManager.UserRepository);

        }

        [HttpGet("[action]")]
        [Authorize(Roles = "Driver")]
        public async Task<IActionResult> DriverInfo()
        {
            return await Info<DriverInfoResult, Driver>(driverRepositoryManager.UserRepository);
        }

        [NonAction]
        private async Task<IActionResult> Info<TModel, TUser>(IRepository<TUser> userRepository) where TUser : User
                                                                                                 where TModel : InfoResult
        {
            var userName = User.Identity.Name;
            if (userName == null)
                return Unauthorized(ErrorEnum.NoUserLogIn);

            var applicationUser = await userManager.FindByNameAsync(userName);

            var user = await userRepository.GetByIdAsync(applicationUser.Id);

            var result = mapper.Map<TModel>(applicationUser);

            mapper.Map(user, result);
            return Ok(result);
        }

        [HttpPost("[action]")]
        [Authorize(Roles = "Customer")]
        public async Task<IActionResult> CustomerUpdate([Bind("PhoneNumber,FirstName,LastName")][FromBody] UpdateCustomerPost model)
        {
            return await UserAsync(model, customerRepositoryManager);
        }

        [HttpPost("[action]")]
        [Authorize(Roles = "Driver")]
        public async Task<IActionResult> DriverUpdate([Bind("PhoneNumber,FirstName,LastName")][FromBody] UpdateDriverPost model)
        {
            return await UserAsync(model, driverRepositoryManager);
        }

        [NonAction]
        private async Task<IActionResult> UserAsync<TUser, TModel>(TModel model, IUserRepositoryManager<TUser> userRepositoryManager) where TModel : UpdatePost
                                                                                                                                      where TUser : User
        {
            if (!ModelState.IsValid)
                return BadRequest(ErrorEnum.InvalidModelState);

            var userName = User.Identity.Name;
            if (userName == null) 
                return Unauthorized(ErrorEnum.NoUserLogIn);

            var applicationUser = await userManager.FindByNameAsync(userName);

            Debug.Assert(applicationUser != null);

            var user = await userRepositoryManager.UserRepository.GetByIdAsync(applicationUser.Id);

            Debug.Assert(user != null);

            mapper.Map(model, applicationUser);

            mapper.Map(model, user);

            var result = await userRepositoryManager.UpdateAsync(applicationUser, user);

            Debug.Assert(result.Succeeded);
            return Ok();
        }

        [HttpPost("[action]")]
        [Authorize]
        public async Task<IActionResult> ChangePassword([Bind("OldPassword,NewPassword")][FromBody] ChangePasswordPost model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ErrorEnum.InvalidModelState);

            var userName = User.Identity.Name;
            if (userName == null)
                return Unauthorized(ErrorEnum.NoUserLogIn);

            var user = await userManager.FindByNameAsync(User.Identity.Name);

            Debug.Assert(user != null);

            if (!await userManager.CheckPasswordAsync(user, model.OldPassword))
                return BadRequest(ErrorEnum.InvalidPassword);
            
            var token = await userManager.GeneratePasswordResetTokenAsync(user);

            var result = await userManager.ResetPasswordAsync(user, token, model.NewPassword);

            Debug.Assert(result.Succeeded);
            return Ok();
        }

        [HttpPost("[action]")]
        [Authorize]
        public async Task<IActionResult> Delete(string password)
        {
            if (string.IsNullOrWhiteSpace(password))
                return NotFound(ErrorEnum.InvalidModelState);

            var userName = User.Identity.Name;
            if (userName == null)
                return Unauthorized(ErrorEnum.NoUserLogIn);

            var applicationUser = await userManager.FindByNameAsync(userName);

            Debug.Assert(applicationUser != null);

            if (!await userManager.CheckPasswordAsync(applicationUser, password))
                return BadRequest(ErrorEnum.InvalidDeletePassword);

            if (User.IsInRole("Driver"))
                await DeleteUser(driverRepositoryManager, applicationUser);
            else
                await DeleteUser(customerRepositoryManager, applicationUser);
            return Ok();
        }

        [NonAction]
        private async Task DeleteUser<TUser>(IUserRepositoryManager<TUser> repositoryManager, ApplicationUser applicationUser) where TUser : User
        {
            var user = await repositoryManager.UserRepository.GetByIdAsync(applicationUser.Id);

            Debug.Assert(user != null);

            await repositoryManager.DeleteAsync(applicationUser, user);
        }

        [HttpGet("[action]")]
        [Authorize]
        public async Task<IActionResult> Drives(string date)
        {
            if (string.IsNullOrWhiteSpace(date))
                return NotFound(ErrorEnum.InvalidModelState);

            var userName = User.Identity.Name;
            if (userName == null)
                return Unauthorized(ErrorEnum.NoUserLogIn);

            var user = await userManager.FindByNameAsync(userName);

            Debug.Assert(user != null);

            var userId = user.Id;

            DateTime dateTime;
            try
            {
                dateTime = DateTime.Parse(date);
            }
            catch (FormatException)
            {
                return BadRequest(ErrorEnum.InvalidDateFormat);
            }

            var driveIds = (await requestRepository.GetByConditionAsync(r => r.UserId == userId && r.UpdateDateTime.Value.Date == dateTime.Date &&
                r.Status == DriveRequest.RequestStatus.Answered)).Select(r => r.DriveId).ToList();

            var drives = (await driveRepository.GetByConditionAsync(d => driveIds.Contains(d.Id) && d.Status != Models.DBModels.Drive.DriveStatus.Open)).ToList();

            drives.Sort((dx, dy) => DateTime.Compare(dx.CreateDateTime.Value, dy.CreateDateTime.Value));

            return Ok(mapper.Map<AccountDrivesResult>(drives));
        }

        [HttpGet("[action]")]
        [Authorize]
        public async Task<IActionResult> Drive(string driveId)
        {
            if (string.IsNullOrWhiteSpace(driveId))
                return NotFound(ErrorEnum.InvalidModelState);

            var drive = await driveRepository.GetFirstByConditionAsync(d => d.Id == driveId);

            if (drive == null || drive.Status == Models.DBModels.Drive.DriveStatus.Open)
                return NotFound(ErrorEnum.InvalidDriveId);

            return Ok(mapper.Map<AccountDriveResult>(drive));
        }
    }
}
