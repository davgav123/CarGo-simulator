﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace CarGoSimulator.Models.Dtos
{
    public class ChangePasswordPost
    {
        [Required]
        public string OldPassword { get; set; }

        [Required]
        [MinLength(8)]
        public string NewPassword { get; set; }
    }
}
