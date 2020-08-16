using CarGoSimulator.Models.DBModels;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CarGoSimulator.Interfaces
{
    public interface IUserRepositoryManager<TUser> where TUser : User
    {
        public UserManager<ApplicationUser> UserManager { get;}

        public IRepository<TUser> UserRepository { get; }

        public Task<IdentityResult> CreateAsync(ApplicationUser applicationUser, TUser user, string password, string role);

        public Task<IdentityResult> UpdateAsync(ApplicationUser applicationUser, TUser user);
    }
}
