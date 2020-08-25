using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using CarGoSimulator.Interfaces;
using CarGoSimulator.Models.DBModels;
using CarGoSimulator.Models.Dtos;
using CarGoSimulator.Models.Utility;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace CarGoSimulator.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TokenController : ControllerBase
    {
        readonly UserManager<ApplicationUser> userManager;
        readonly ITokenService tokenService;

        public TokenController(UserManager<ApplicationUser> userManager, ITokenService tokenService)
        {
            this.userManager = userManager;
            this.tokenService = tokenService;
        }

        [HttpPost("[action]")]
        [AllowAnonymous]
        public async Task<IActionResult> Refresh([Bind("AccessToken,RefreshToken")][FromBody] TokenRefreshPost model)
        {
            if (!ModelState.IsValid)
                return NotFound(ErrorEnum.InvalidModelState);

            var userName = User.Identity.Name;
            if (userName == null)
                return Unauthorized(ErrorEnum.NoUserLogIn);

            var accessToken = model.AccessToken;
            var refreshToken = model.RefreshToken;

            var principal = tokenService.GetPrincipalFromExpiredToken(accessToken);
            if (principal == null)
                return BadRequest(ErrorEnum.InvalidAccessToken);
            
            var user = await userManager.FindByNameAsync(userName);

            Debug.Assert(user != null);

            var passwordHasher = userManager.PasswordHasher;

            if (user.RefreshTokenHash == null || user.RefreshTokenExpiryTime <= DateTime.Now || 
                passwordHasher.VerifyHashedPassword(user, user.RefreshTokenHash, refreshToken) == PasswordVerificationResult.Failed)
                return BadRequest(ErrorEnum.InvalidRefreshToken);

            var newAccessToken = tokenService.GenerateAccessToken(principal.Claims);

            var newRefreshToken = tokenService.GenerateRefreshToken();

            var newRefreshTokenHash = passwordHasher.HashPassword(user, newRefreshToken);

            user.RefreshTokenHash = newRefreshTokenHash;

            await userManager.UpdateAsync(user);
            return Ok(new
            {
                accessToken = newAccessToken,
                refreshToken = newRefreshToken
            });
        }

        [HttpPost("[action]")] 
        [Authorize]
        public async Task<IActionResult> Revoke()
        {
            var userName = User.Identity.Name;
            if (userName == null)
                return Unauthorized(ErrorEnum.NoUserLogIn);

            var user = await userManager.FindByNameAsync(userName);

            if (user == null)
                return BadRequest(ErrorEnum.EmailNotRegistered);

            user.RefreshTokenHash = null;
            user.RefreshTokenExpiryTime = DateTime.Now;

            await userManager.UpdateAsync(user);
            return Ok();
        }
    }
}
