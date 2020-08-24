using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace CarGoSimulator.Models.Dtos
{
    public abstract class DrivePost
    {
        [Required]
        public string StartAddress { get; set; }

        [Required]
        public string Locality { get; set; }
    }
}
