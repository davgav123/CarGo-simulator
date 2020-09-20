using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using CarGoSimulator.Data;
using CarGoSimulator.Interfaces;
using CarGoSimulator.Models.DBModels;
using CarGoSimulator.Models.Dtos;
using CarGoSimulator.Models.Utility;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Cors;

namespace CarGoSimulator.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors("MyPolicy")]
    public class RegistrationController : ControllerBase
    {
        private readonly IUserRepositoryManager<Customer> customerRepositoryManager;
        private readonly IUserRepositoryManager<Driver> driverRepositoryManager;
        private readonly IMapper mapper;
        private readonly IMailService mailService;
        private readonly IConfiguration configuration;
        private readonly UserManager<ApplicationUser> userManager;

        public RegistrationController(IUserRepositoryManager<Customer> customerRepositoryManager, IUserRepositoryManager<Driver> driverRepositoryManager, 
            IMapper mapper, IMailService mailService, IConfiguration configuration, UserManager<ApplicationUser> userManager)
        {
            this.customerRepositoryManager = customerRepositoryManager;
            this.driverRepositoryManager = driverRepositoryManager;
            this.mapper = mapper;
            this.mailService = mailService;
            this.configuration = configuration;
            this.userManager = userManager;
        }

        [HttpPost("[action]")]
        [AllowAnonymous]
        public async Task<IActionResult> Customer([Bind("Email,Password,PhoneNumber,FirstName,LastName")][FromBody] RegistrationCustomerPost model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ErrorEnum.InvalidModelState);

            return await RegisterAsync(model, "Customer", customerRepositoryManager);
        }

        [HttpPost("[action]")]
        [AllowAnonymous]
        public async Task<IActionResult> Driver([Bind("Email,Password,PhoneNumber,FirstName,LastName" + 
                                                      "RealId,DateOfBirth,City,Address,VehiclePlateId,VehicleModel")][FromBody] RegistrationDriverPost model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ErrorEnum.InvalidModelState);

            if (null != await driverRepositoryManager.UserRepository.GetFirstByConditionAsync(d => d.RealId == model.RealId && 
                d.Status == Models.DBModels.User.AccountStatus.Open))
                return BadRequest(ErrorEnum.RealIdAlreadyRegistered);

            return await RegisterAsync(model, "Driver", driverRepositoryManager);
        }

        [NonAction]
        private async Task<IActionResult> RegisterAsync<TUser, TModel>(TModel model, string role, IUserRepositoryManager<TUser> userRepositoryManager) where TUser : User
                                                                                                                                                       where TModel : RegistrationPost
        { 
            var applicationUser = mapper.Map<ApplicationUser>(model);

            TUser user;
            try
            {
                user = mapper.Map<TUser>(model);
            }
            catch
            {
                return BadRequest(ErrorEnum.InvalidModelState);
            }

            if (!(await userRepositoryManager.CreateAsync(applicationUser, user, model.Password, role)).Succeeded)
                return BadRequest(ErrorEnum.EmailAlreadyRegistered);

            await SendConfirmationEmail(applicationUser);

            return Ok();
        }

        [HttpGet("[action]")]
        [AllowAnonymous]
        public async Task<IActionResult> ReconfirmEmail(string email)
        {
            if (string.IsNullOrWhiteSpace(email))
                return NotFound(ErrorEnum.InvalidModelState);

            var user = await userManager.FindByEmailAsync(email);

            if (user == null)
                return BadRequest(ErrorEnum.EmailNotRegistered);

            var timeNow = DateTime.Now;
            if (timeNow < user.ConfirmationEmailBlockTime) 
                return Unauthorized(ErrorEnum.ConfirmationEmailBlock);

            await SendConfirmationEmail(user);

            user.ConfirmationEmailBlockTime = timeNow.AddMinutes(5.0);

            await userManager.UpdateAsync(user);
            return Ok();
        }

        [NonAction]
        private async Task SendConfirmationEmail(ApplicationUser user)
        {
            var confirmEmailToken = await userManager.GenerateEmailConfirmationTokenAsync(user);

            var encodedEmailToken = Encoding.UTF8.GetBytes(confirmEmailToken);

            var validEmailToken = WebEncoders.Base64UrlEncode(encodedEmailToken);

            // var url = $"{configuration["ApplicationApiUrl"]}/api/auth/confirmemail?userid={user.Id}&token={validEmailToken}";
            var url = $"http://localhost:3000/prijavljivanjePrvo/{user.Id}/{validEmailToken}";
            // var url = $"localhost:3000/prijavljivanjePrvo/{user.Id}/{validEmailToken}";
            var email = user.Email;
            await mailService.SendEmailAsync(email, "Imejl potvrda - CallAndGo", $"<h1>Dobrodošli u CallAndGo zajednicu</h1>" +
                                $"<p>Molimo Vas, potvrdite Vašu imejl adresu tako što <a href='{url}'>Kliknete ovde </a></p>.");
        }
    }
}