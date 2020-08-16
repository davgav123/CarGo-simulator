using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace CarGoSimulator.Models.DBModels
{
    [Table("Drivers")]
    public class Driver : User
    {
        [Required]
        public string RealId { get; set; }

        [Required]
        [DataType(DataType.Date)]
        public DateTime DateOfBirth { get; set; }

        [Required]
        public override string FirstName { get; set; }

        [Required]
        public override string LastName { get; set; }

        [Required]
        public string City { get; set; }

        [Required]
        public string Address { get; set; }

        [Required]
        public string VehiclePlateId { get; set; }

        [Required]
        public string VehicleModel { get; set; }

        public ulong? Rating { get; set; }

        public uint RatingCount { get; set; } = 0;
    }
}
