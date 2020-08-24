using CarGoSimulator.Interfaces;
using CarGoSimulator.Models.DBModels;
using CarGoSimulator.Models.Dtos;
using CarGoSimulator.Models.Utility;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CarGoSimulator.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> userManager;

        public AuthController(UserManager<ApplicationUser> userManager)
        {
            this.userManager = userManager;
        }

        [HttpGet("[action]")]
        [AllowAnonymous]
        public async Task<IActionResult> ConfirmEmail(string userId, string token)
        {
            if (string.IsNullOrWhiteSpace(userId) || string.IsNullOrWhiteSpace(token))
                return NotFound(ErrorEnum.InvalidModelState);

            var user = await userManager.FindByIdAsync(userId);
            if (user == null)
                return BadRequest(ErrorEnum.EmailNotRegistered);

            var decodedToken = WebEncoders.Base64UrlDecode(token);

            var normalToken = Encoding.UTF8.GetString(decodedToken);

            var result = await userManager.ConfirmEmailAsync(user, normalToken);

            if (!result.Succeeded)
                return BadRequest(ErrorEnum.InvalidEmailConfirmationToken);
            return Ok();
        }

        [HttpPost("[action]")]
        [AllowAnonymous]
        public async Task<IActionResult> ResetPassword([Bind("Token,Password")][FromBody]ResetPasswordPost model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ErrorEnum.InvalidModelState);

            var user = await userManager.FindByEmailAsync(model.Email);
            if (user == null)
                return BadRequest(ErrorEnum.EmailNotRegistered);

            var decodedToken = WebEncoders.Base64UrlDecode(model.Token);

            var normalToken = Encoding.UTF8.GetString(decodedToken);

            var result = await userManager.ResetPasswordAsync(user, normalToken, model.Password);

            if (!result.Succeeded)
                return BadRequest(ErrorEnum.InvalidPasswordResetToken);

            if (!await userManager.IsEmailConfirmedAsync(user))
            {
                var emailConfirmToken = await userManager.GenerateEmailConfirmationTokenAsync(user);

                var confirmEmail = await userManager.ConfirmEmailAsync(user, emailConfirmToken);

                Debug.Assert(confirmEmail.Succeeded);
            }
            return Ok();
        }
    }
}
