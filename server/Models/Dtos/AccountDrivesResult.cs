using CarGoSimulator.Models.DBModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CarGoSimulator.Models.Dtos
{
    public class AccountDrivesResult
    {
        public List<string> Dates { get; set; }

        public List<string> Ids { get; set; }

    }
}
