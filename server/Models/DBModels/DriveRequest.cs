using CarGoSimulator.Interfaces;
using CarGoSimulator.Models.Dtos;
using CarGoSimulator.Models.Utility;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace CarGoSimulator.Models.DBModels
{
    [Table("DriveRequests")]
    public class DriveRequest : Entity
    {
        [Required]
        public string UserId { get; set; }

        public string DriveId { get; set; }

        [Required]
        public string Cordinates { get; set; }

        [Required]
        public string Locality { get; set; }

        [Required]
        public string SubLocality { get; set; }

        public enum RequestStatus
        {
            Open,
            Cancelled,
            Answered
        }

        [Required]
        public RequestStatus Status { get; set; } = RequestStatus.Open;
    }
}
