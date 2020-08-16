using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace CarGoSimulator.Models.DBModels
{
    public class ApplicationUser : IdentityUser
    { 
        public string RefreshToken { get; set; }

        public DateTime RefreshTokenExpiryTime { get; set; }

        public DateTime AccountActivationTime { get; set; }

        public DateTime ConfirmationEmailBlockTime { get; set; }

        public DateTime PasswordResetBlockTime { get; set; }
    }
}
