using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CarGoSimulator.Models.Dtos
{
    public class DriverInfoResult : InfoResult
    {
        public string RealId { get; set; }

        public DateTime DateOfBirth { get; set; }

        public string City { get; set; }

        public string Address { get; set; }

        public string VehiclePlateId { get; set; }

        public string VehicleModel { get; set; }

        public float? Rating { get; set; }

        public uint RatingCount { get; set; }
    }
}
