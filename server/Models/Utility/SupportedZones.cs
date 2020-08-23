using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CarGoSimulator.Models.Utility
{
    public class SupportedZones
    {
        public static readonly IEnumerable<string> supportedCities = new List<string> { "Beograd", "Novi Sad" };
        public static readonly string supportedCountry = "RS";
    }
}
