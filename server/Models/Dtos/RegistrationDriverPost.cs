using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace CarGoSimulator.Models.Dtos
{
    public class RegistrationDriverPost : RegistrationPost
    {
        [Required]
        public override string FirstName { get; set; }

        [Required]
        public override string LastName { get; set; }

        [Required]
        public string RealId { get; set; }

        [Required]
        public string DateOfBirth { get; set; }

        [Required]
        public string City { get; set; }

        [Required]
        public string Address { get; set; }

        [Required]
        public string VehiclePlateId { get; set; }

        [Required]
        public string VehicleModel { get; set; }
    }
}