using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CarGoSimulator.Models.Dtos
{
    public class CustomerDriveResult : DriveResult
    {
        public string VehiclePlateId { get; set; }

        public string VehicleModel { get; set; }
    }
}
