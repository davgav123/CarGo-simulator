using AutoMapper;
using CarGoSimulator.Interfaces;
using CarGoSimulator.Models.DBModels;
using CarGoSimulator.Models.Dtos;
using CarGoSimulator.Models.Utility;
using CarGoSimulator.Services;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace CarGoSimulator.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LogInController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> userManager;
        private readonly ITokenService tokenService;
        private readonly IMailService mailService;
        private readonly IConfiguration configuration;

        public LogInController(UserManager<ApplicationUser> userManager, ITokenService tokenService, IMailService mailService, IConfiguration configuration)
        {
            this.userManager = userManager;
            this.tokenService = tokenService;
            this.mailService = mailService;
            this.configuration = configuration;
        }

        [HttpPost("[action]")]
        [AllowAnonymous]
        public async Task<IActionResult> Customer([Bind("Email,Password")][FromBody] LogInPost model)
        {
            return await LogInAsync(model, "Customer");
        }

        [HttpPost("[action]")]
        [AllowAnonymous]
        public async Task<IActionResult> Driver([Bind("Email,Password")][FromBody] LogInPost model)
        {
            return await LogInAsync(model, "Driver");
        }

        [NonAction]
        private async Task<IActionResult> LogInAsync(LogInPost model, string role)
        {
            if (!ModelState.IsValid)
                return BadRequest(ErrorEnum.InvalidModelState);

            var user = await userManager.FindByNameAsync(model.Email);
            if (user == null)
                return BadRequest(ErrorEnum.EmailNotRegistered);

            if (DateTime.Now < user.AccountActivationTime)
                return Unauthorized(ErrorEnum.AccountActivationBlock);

            var email = user.Email;

            if (!await userManager.CheckPasswordAsync(user, model.Password))
            {
                await mailService.SendEmailAsync(email, "Unsuccessful Login - CallAndGo", "Unsuccessful login at " + DateTime.Now + ".");
                return BadRequest(ErrorEnum.InvalidPassword);
            }

            if (userManager.Options.SignIn.RequireConfirmedEmail && !await userManager.IsEmailConfirmedAsync(user))
                return Unauthorized(ErrorEnum.EmailNotConfirmed);

            var claims = new[]
            {
                    new Claim(ClaimTypes.Name, user.UserName),
                    new Claim(ClaimTypes.NameIdentifier, user.Id),
                    new Claim(ClaimTypes.Role, role)
            };

            var passwordHasher = userManager.PasswordHasher;

            var accessToken = tokenService.GenerateAccessToken(claims);

            var refreshToken = tokenService.GenerateRefreshToken();

            var refreshTokenExpiryTime = DateTime.Now.AddDays(7);

            var refreshTokenHash = passwordHasher.HashPassword(user, refreshToken);

            user.RefreshTokenHash = refreshTokenHash;
            user.RefreshTokenExpiryTime = refreshTokenExpiryTime;

            await userManager.UpdateAsync(user);

            await mailService.SendEmailAsync(email, "Successful Login - CallAndGo", "Successful login at " + DateTime.Now + ".");
            return Ok(new
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken,
                RefreshTokenExpiryTime = refreshTokenExpiryTime
            });
        }

        [HttpPost("[action]")]
        [AllowAnonymous]
        public async Task<IActionResult> Reset(string email)
        {
            if (string.IsNullOrWhiteSpace(email))
                return NotFound(ErrorEnum.InvalidModelState);

            var user = await userManager.FindByEmailAsync(email);

            if (user == null)
                return BadRequest(ErrorEnum.EmailNotRegistered);

            if (DateTime.Now < user.AccountActivationTime)
                return Unauthorized(ErrorEnum.AccountActivationBlock);

            var timeNow = DateTime.Now;
            if (timeNow < user.PasswordResetBlockTime)
                return Unauthorized(ErrorEnum.PasswordResetBlock);

            var resetToken = await userManager.GeneratePasswordResetTokenAsync(user);

            var encodedResetToken = Encoding.UTF8.GetBytes(resetToken);

            var validResetToken = WebEncoders.Base64UrlEncode(encodedResetToken);

            var url = $"{configuration["ApplicationWebUrl"]}/ResetPassword?email={email}&token={validResetToken}";

            await mailService.SendEmailAsync(email, "Reset Password - CallAndGo", "<h1>Follow the instructions to reset your password</h1>" +
                $"<p>To reset your password <a href='{url}'>Click here</a></p>");

            user.PasswordResetBlockTime = timeNow.AddMinutes(5.0);

            await userManager.UpdateAsync(user);
            return Ok();
        }
    }
}