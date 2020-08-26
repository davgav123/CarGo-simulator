using CarGoSimulator.Models.Utility;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CarGoSimulator.Models.Dtos
{
    public abstract class DriveResult
    {
        public string FirstName { get; set; }

        public string PhoneNumber { get; set; }

        public string FirstPolyline { get; set; }

        public string SecondPolyline { get; set; }

        public string FirstDistance { get; set; }

        public string SecondDistance { get; set; }

        public string FirstDuration { get; set; }

        public string SecondDuration { get; set; }
    }
}
