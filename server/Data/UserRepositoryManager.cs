using AutoMapper;
using CarGoSimulator.Interfaces;
using CarGoSimulator.Models.DBModels;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;

namespace CarGoSimulator.Data
{
    public class UserRepositoryManager<TUser> : IUserRepositoryManager<TUser> where TUser : User
    {
        private readonly UserManager<ApplicationUser> userManager;
        private readonly IRepository<TUser> userRepository;
        private readonly IMapper mapper;

        public UserRepositoryManager(UserManager<ApplicationUser> userManager, IRepository<TUser> userRepository, IMapper mapper)
        {
            this.userManager = userManager;
            this.userRepository = userRepository;
            this.mapper = mapper;
        }

        public UserManager<ApplicationUser> UserManager { get => userManager; }

        public IRepository<TUser> UserRepository { get => userRepository; }

        public async Task<IdentityResult> CreateAsync(ApplicationUser applicationUser, TUser user, string password, string role)
        {
            applicationUser.Id = user.Id;

            var result = await userManager.CreateAsync(applicationUser, password);
            if (result.Succeeded)
            {
                try
                {
                    await userManager.AddToRoleAsync(applicationUser, role);

                    user.Id = applicationUser.Id;

                    userRepository.Insert(user);
                }
                catch
                {
                    await userManager.DeleteAsync(applicationUser);
                    throw;
                }

                await userRepository.ApplyChangesAsync();
            }
            return result;
        }

        public async Task<IdentityResult> UpdateAsync(ApplicationUser applicationUser, TUser user)
        {
            userRepository.Update(user);

            var result = await userManager.UpdateAsync(applicationUser);

            if (!result.Succeeded)
                return result;

            await userRepository.ApplyChangesAsync();
            return IdentityResult.Success;
        }

        public async Task DeleteAsync(ApplicationUser applicationUser, TUser user)
        {
            var result = await userManager.DeleteAsync(applicationUser);

            Debug.Assert(result.Succeeded);

            user.Status = Models.DBModels.User.AccountStatus.Cancelled;

            userRepository.Update(user);

            await userRepository.ApplyChangesAsync();
        }
    }
}
