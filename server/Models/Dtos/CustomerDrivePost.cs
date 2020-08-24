using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace CarGoSimulator.Models.Dtos
{
    public class CustomerDrivePost : DrivePost
    {
        [Required]
        public string EndAddress { get; set; }
    }
}
