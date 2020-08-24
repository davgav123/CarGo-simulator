using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace CarGoSimulator.Models.Dtos
{
    public class UpdateDriverPost : UpdatePost
    {
        public string City { get; set; }

        public string Address { get; set; }

        public string VehiclePlateId { get; set; }

        public string VehicleModel { get; set; }
    }
}
