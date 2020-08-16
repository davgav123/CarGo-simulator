using CarGoSimulator.Models.Utility;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace CarGoSimulator.Models.DBModels
{
    [Table("Drives")]
    public class Drive : Entity
    {
        [Required]
        public string CustomerRequestId { get; set; }

        [Required]
        public string DriverRequestId { get; set; }

        public enum DriveStatus
        {
            Open,
            Closed,
            Terminated
        }

        [Required]
        public DriveStatus Status { get; set; } = DriveStatus.Open;

        public float? Rating { get; set; }

        [Required]
        public string FirstPolyline { get; set; }

        [Required]
        public string SecondPolyline { get; set; }

        [Required]
        public string FirstDistance { get; set; }

        [Required]
        public string FirstDuration { get; set; }

        [Required]
        public string SecondDistance { get; set; }

        [Required]
        public string SecondDuration { get; set; }
    }
}
