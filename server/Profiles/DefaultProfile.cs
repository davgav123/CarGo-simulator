using AutoMapper;
using CarGoSimulator.Models.DBModels;
using CarGoSimulator.Models.Dtos;
using CarGoSimulator.Models.Utility;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CarGoSimulator.Profiles
{
    public class DefaultProfile : Profile
    {
        public DefaultProfile()
        {

            CreateMap<RegistrationPost, ApplicationUser>()
                .Include<RegistrationCustomerPost, ApplicationUser>()
                .Include<RegistrationDriverPost, ApplicationUser>()
                .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.Email));

            CreateMap<RegistrationCustomerPost, ApplicationUser>();

            CreateMap<RegistrationDriverPost, ApplicationUser>();

            CreateMap<RegistrationPost, User>()
                .Include<RegistrationCustomerPost, Customer>()
                .Include<RegistrationDriverPost, Driver>();

            CreateMap<RegistrationCustomerPost, Customer>();

            CreateMap<RegistrationDriverPost, Driver>()
                .ForMember(dest => dest.DateOfBirth, opt => opt.MapFrom(src => DateTime.Parse(src.DateOfBirth)));

        }
        
    }
}
