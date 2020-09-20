using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using CarGoSimulator.Data;
using CarGoSimulator.Interfaces;
using CarGoSimulator.Models.DBModels;
using CarGoSimulator.Models.Dtos;
using CarGoSimulator.Services;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Cors;

namespace CarGoSimulator
{
    public class Startup
    {
        public IConfiguration Configuration { get; }

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers();

            services.AddDbContext<CarGoSimulatorDBContext>(options => options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection")));

            services.AddIdentity<ApplicationUser, IdentityRole>(options =>
            {
                options.SignIn.RequireConfirmedEmail = true; //true
                options.User.RequireUniqueEmail = true;
                options.Password.RequireUppercase = false;
                options.Password.RequireNonAlphanumeric = false;
            }).AddEntityFrameworkStores<CarGoSimulatorDBContext>()
              .AddDefaultTokenProviders();

            services.AddAuthentication(auth =>
            {
                auth.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                auth.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
                {
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ValidAudience = Configuration["Jwt:Audience"],
                    ValidIssuer = Configuration["Jwt:Issuer"],
                    RequireExpirationTime = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["Jwt:Key"])),
                    ValidateIssuerSigningKey = true
                };

            });

            services.Configure<ApiBehaviorOptions>(options =>
            {
                options.SuppressModelStateInvalidFilter = true;
            });

            services.AddAutoMapper(typeof(Startup));

            services.AddTransient<IRepository<Customer>, Repository<Customer>>();

            services.AddTransient<IRepository<Driver>, Repository<Driver>>();

            services.AddTransient<IRepository<DriveRequest>, Repository<DriveRequest>>();

            services.AddTransient<IRepository<Drive>, Repository<Drive>>();

            services.AddTransient<IUserRepositoryManager<Customer>, UserRepositoryManager<Customer>>();

            services.AddTransient<IUserRepositoryManager<Driver>, UserRepositoryManager<Driver>>();

            services.AddSingleton<ITokenService, TokenService>();

            services.AddSingleton<IMailService, SendGridMailService>();

            services.AddSingleton<IUrlService, UrlService>();

            services.AddSingleton<IDriveService, DriveService>();

            // services.AddCors();
                services.AddCors(o => o.AddPolicy("MyPolicy", builder =>
                {
                    builder.AllowAnyOrigin()
                        .AllowAnyMethod()
                        .AllowAnyHeader();
                }));
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, IServiceProvider serviceProvider, 
            IRepository<Drive> drivesRepository, IRepository<DriveRequest> requestsRepository)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseRouting();

            app.UseAuthentication();

            app.UseAuthorization();
            app.UseCors(builder => 
                builder.WithOrigins("http://localhost:49943")
            );
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });

            FinalizeConfiguration(serviceProvider, drivesRepository, requestsRepository);
        }

        private void FinalizeConfiguration(IServiceProvider serviceProvider, IRepository<Drive> drivesRepository, IRepository<DriveRequest> requestsRepository)
        {
            CreateRoles(serviceProvider);

            TerminateDrives(drivesRepository);

            CancelRequests(requestsRepository);
        }

        private void CreateRoles(IServiceProvider serviceProvider)
        {
            var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();
            string[] roles = { "Customer", "Driver" };

            foreach (var role in roles)
            {
                var roleExists = roleManager.RoleExistsAsync(role);
                roleExists.Wait();

                if (!roleExists.Result)
                {
                    var roleResult = roleManager.CreateAsync(new IdentityRole(role));
                    roleResult.Wait();

                    Debug.Assert(roleResult.Result.Succeeded);
                }
            }
        }

        private void TerminateDrives(IRepository<Drive> drivesRepository)
        {
            var drives = drivesRepository.GetAllAsync();
            drives.Wait();

            foreach (var drive in drives.Result) 
                if (drive.Status == Drive.DriveStatus.Open)
                {
                    drive.Status = Drive.DriveStatus.Terminated;

                    drivesRepository.Update(drive);
                }

            drivesRepository.ApplyChangesAsync().Wait();
        }

        private void CancelRequests(IRepository<DriveRequest> requestsRepository)
        {
            var requests = requestsRepository.GetAllAsync();
            requests.Wait();

            foreach (var request in requests.Result)
                if (request.Status == DriveRequest.RequestStatus.Open)
                {
                    request.Status = DriveRequest.RequestStatus.Cancelled;

                    requestsRepository.Update(request);
                }

            requestsRepository.ApplyChangesAsync().Wait();
        }

    }
}
