using CarGoSimulator.Models.DBModels;
using CarGoSimulator.Models.Dtos;
using CarGoSimulator.Models.Utility;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CarGoSimulator.Interfaces
{
    public interface IDriveService
    {
        public Task<Drive> WaitForDriverAsync(DriveRequest customerLocation, Directions directions);

        public Task<Drive> WaitForCustomerAsync(DriveRequest driverLocation);

        public Task<bool> CancelRequestAsync(string requestId);

    }
}
