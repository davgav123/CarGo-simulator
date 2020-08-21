using CarGoSimulator.Models.DBModels;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace CarGoSimulator.Data
{
    public class CarGoSimulatorDBContext : IdentityDbContext<ApplicationUser>
    {
        public CarGoSimulatorDBContext(DbContextOptions<CarGoSimulatorDBContext> options) : base(options)
        {
        }

        public DbSet<ApplicationUser> ApplicationUsers { get; set; }

        public DbSet<Customer> Customers { get; set; }

        public DbSet<Driver> Drivers { get; set; }

        public DbSet<Drive> Drives { get; set; }

        public DbSet<DriveRequest> DriveRequests { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            var driveStatusConverter = new EnumToStringConverter<Drive.DriveStatus>();
            var requestStatusConverter = new EnumToStringConverter<DriveRequest.RequestStatus>();

            modelBuilder.Entity<Drive>().Property(e => e.Status).HasConversion(driveStatusConverter);

            modelBuilder.Entity<DriveRequest>().Property(e => e.Status).HasConversion(requestStatusConverter);

            base.OnModelCreating(modelBuilder);
        }

        public override int SaveChanges()
        {
            SetDateTimes();
            return base.SaveChanges();
        }

        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            SetDateTimes();
            return await base.SaveChangesAsync(cancellationToken);
        }

        private void SetDateTimes()
        {
            var changedEntriesCopy = ChangeTracker.Entries()
                        .Where(e => e.State == EntityState.Added ||
                        e.State == EntityState.Modified)
                        .ToList();

            var saveTime = DateTime.Now;

            foreach (var entityEntry in changedEntriesCopy)
            {
                if (entityEntry.Metadata.FindProperty("CreateDateTime") != null && entityEntry.Property("CreateDateTime").CurrentValue == null)
                    entityEntry.Property("CreateDateTime").CurrentValue = saveTime;

                if (entityEntry.Metadata.FindProperty("UpdateDateTime") != null)
                    entityEntry.Property("UpdateDateTime").CurrentValue = saveTime;
            }
        }
    }
}
