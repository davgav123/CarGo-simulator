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

            CreateMap<IdentityUser, InfoResult>()
                .Include<ApplicationUser, CustomerInfoResult>()
                .Include<ApplicationUser, DriverInfoResult>();

            CreateMap<ApplicationUser, CustomerInfoResult>();

            CreateMap<ApplicationUser, DriverInfoResult>();

            CreateMap<User, InfoResult>()
                .Include<Customer, CustomerInfoResult>()
                .Include<Driver, DriverInfoResult>();

            CreateMap<Customer, CustomerInfoResult>();

            CreateMap<Driver, DriverInfoResult>()
                .ForMember(dest => dest.Rating, opt => opt.MapFrom(src => src.Rating == null ? (float?)null : (float)Math.Round(((float)src.Rating) / src.RatingCount, 2, MidpointRounding.AwayFromZero)));

            CreateMap<UpdatePost, ApplicationUser>()
                .Include<UpdateCustomerPost, ApplicationUser>()
                .Include<UpdateDriverPost, ApplicationUser>()
                .ForAllMembers(opt => opt.Condition((src, dest, srcMember) => srcMember != null));

            CreateMap<UpdateCustomerPost, ApplicationUser>();

            CreateMap<UpdateDriverPost, ApplicationUser>();

            CreateMap<UpdatePost, User>()
                .Include<UpdateCustomerPost, Customer>()
                .Include<UpdateDriverPost, Driver>()
                .ForAllMembers(opt => opt.Condition((src, dest, srcMember) => srcMember != null));

            CreateMap<UpdateCustomerPost, Customer>();

            CreateMap<UpdateDriverPost, Driver>();

            CreateMap<SimpleDriveRequest, DriveRequest>();

            CreateMap<DirectionsRoot.RootObject, Directions>()
                .ForMember(dest => dest.Polyline, opt => opt.MapFrom(src => src.routes.First().overview_polyline.points))
                .ForMember(dest => dest.Distance, opt => opt.MapFrom(src => src.routes.First().legs.First().distance.text))
                .ForMember(dest => dest.Duration, opt => opt.MapFrom(src => src.routes.First().legs.First().duration.text));

            CreateMap<Drive, DriveResult>()
                .Include<Drive, CustomerDriveResult>()
                .Include<Drive, DriverDriveResult>();

            CreateMap<Drive, CustomerDriveResult>();

            CreateMap<Drive, DriverDriveResult>();

            CreateMap<User, DriveResult>()
                .Include<Driver, CustomerDriveResult>()
                .Include<Customer, DriverDriveResult>();

            CreateMap<Driver, CustomerDriveResult>();

            CreateMap<Customer, DriverDriveResult>();

            CreateMap<IEnumerable<Drive>, AccountDrivesResult>()
                .ForMember(dest => dest.Dates, opt => opt.MapFrom(src => src.Select(d => d.CreateDateTime).ToList()))
                .ForMember(dest => dest.Ids, opt => opt.MapFrom(src => src.Select(d => d.Id).ToList()));

            CreateMap<Drive, AccountDriveResult>()
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToString()));

            CreateMap<IdentityUser, DriveResult>()
                .Include<ApplicationUser, CustomerDriveResult>()
                .Include<ApplicationUser, DriverDriveResult>();

            CreateMap<ApplicationUser, CustomerDriveResult>();

            CreateMap<ApplicationUser, DriverDriveResult>();
        }
        
    }
}
