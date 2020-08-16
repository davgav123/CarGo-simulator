using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace CarGoSimulator.Models.DBModels
{
    public abstract class User : Entity
    {
        public virtual string FirstName { get; set; }

        public virtual string LastName { get; set; }
    }
}
