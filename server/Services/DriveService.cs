using AutoMapper;
using CarGoSimulator.Interfaces;
using CarGoSimulator.Models.DBModels;
using CarGoSimulator.Models.Utility;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace CarGoSimulator.Services
{
    public class DriveService : IDriveService
    {
        private SemaphoreSlim requestsSemaphore = new SemaphoreSlim(0);

        private readonly ConcurrentQueue<(DriveRequest, Directions)> userRequests = new ConcurrentQueue<(DriveRequest, Directions)>();

        private readonly ConcurrentDictionary<string, SemaphoreSlim> userLocks = new ConcurrentDictionary<string, SemaphoreSlim>();

        private readonly ConcurrentDictionary<string, Drive> userResponses = new ConcurrentDictionary<string, Drive>();

        private readonly SemaphoreSlim cancellationLock = new SemaphoreSlim(1, 1);

        private readonly IUrlService urlService;
        private readonly IMapper mapper;
        private readonly IConfiguration configuration;

        public DriveService(IUrlService urlService, IMapper mapper, IConfiguration configuration)
        {
            this.urlService = urlService;
            this.mapper = mapper;
            this.configuration = configuration;

            new Thread(() => ForeverHandleRequests().Wait()).Start(); 
        }

        public async Task<Drive> WaitForCustomerAsync(DriveRequest driverRequest)
        {
            return await WaitForUserAsync(driverRequest);
        }

        public async Task<Drive> WaitForDriverAsync(DriveRequest customerRequest, Directions directions)
        {
            return await WaitForUserAsync(customerRequest, directions);
        }

        private async Task<Drive> WaitForUserAsync(DriveRequest userRequest, Directions directions = null)
        {
            var newLock = new SemaphoreSlim(0, 1);
            userLocks[userRequest.Id] = newLock;

            userResponses[userRequest.Id] = null;

            userRequests.Enqueue((userRequest, directions));

            requestsSemaphore.Release();

            if (directions == null)
            {
                await newLock.WaitAsync();
            }
            else if(!await newLock.WaitAsync(60000))
            { 
                Drive autoWakeUpResponse;
                try
                {
                    await cancellationLock.WaitAsync();

                    userLocks.TryRemove(userRequest.Id, out var _);

                    userResponses.TryRemove(userRequest.Id, out autoWakeUpResponse);
                }
                finally
                {
                    cancellationLock.Release();
                }
                return autoWakeUpResponse;
            }
            
            userResponses.TryRemove(userRequest.Id, out var response);
            return response;
        }

        private async Task ForeverHandleRequests()
        {
            var pendingDriversRequests = new Dictionary<string, ConcurrentDictionary<string, LinkedList<DriveRequest>>>();

            var localitySubLocalityLocks = new Dictionary<string, ConcurrentDictionary<string, SemaphoreSlim>>();

            foreach (var supportedCity in SupportedZones.supportedCities)
            {
                pendingDriversRequests.Add(supportedCity, new ConcurrentDictionary<string, LinkedList<DriveRequest>>());

                localitySubLocalityLocks.Add(supportedCity, new ConcurrentDictionary<string, SemaphoreSlim>());
            }

            while (true)
            {
                await requestsSemaphore.WaitAsync();

                var _ = Task.Run(() => RespondToRequest(pendingDriversRequests, localitySubLocalityLocks)).ConfigureAwait(false);
            }
        }

        private async Task RespondToRequest(Dictionary<string, ConcurrentDictionary<string, LinkedList<DriveRequest>>> pendingDriversRequests,
            Dictionary<string, ConcurrentDictionary<string, SemaphoreSlim>> localitySubLocalityLocks)
        {
            userRequests.TryDequeue(out var userRequestTypePair);

            var userRequest = userRequestTypePair.Item1;
            var directions = userRequestTypePair.Item2;

            if (!await IsActiveAsync(userRequest.Id))
                return;

            var subLocalityLocks = localitySubLocalityLocks[userRequest.Locality];

            SemaphoreSlim subLocalityLock = new SemaphoreSlim(1, 1);
            subLocalityLock = subLocalityLocks.GetOrAdd(userRequest.SubLocality, subLocalityLock);

            try
            {
                await subLocalityLock.WaitAsync();

                if (directions == null)
                    PutDriver(pendingDriversRequests, userRequest);
                else
                    await ServeCustomerAsync(pendingDriversRequests, userRequest, directions);
            }
            finally
            {
                subLocalityLock.Release();
            }
        }

        private void PutDriver(Dictionary<string, ConcurrentDictionary<string, LinkedList<DriveRequest>>> pendingDriversRequests, DriveRequest driverRequest)
        {
            var subLocalityRequestLists = pendingDriversRequests[driverRequest.Locality];

            var subLocality = driverRequest.SubLocality;
            if (subLocalityRequestLists.ContainsKey(subLocality))
                subLocalityRequestLists[subLocality].AddLast(driverRequest);
            else
            {
                var subLocalityRequests = new LinkedList<DriveRequest>();
                subLocalityRequestLists[subLocality] = subLocalityRequests;

                subLocalityRequests.AddLast(driverRequest);
            }
        }

        private async Task ServeCustomerAsync(Dictionary<string, ConcurrentDictionary<string, 
            LinkedList<DriveRequest>>> pendingDriversRequests, DriveRequest customerRequest, Directions directions)
        {
            if (!await IsActiveAsync(customerRequest.Id))
                return;

            if (!pendingDriversRequests[customerRequest.Locality].TryGetValue(customerRequest.SubLocality, out var subLocalityRequests))
            {
                userRequests.Enqueue((customerRequest, directions));

                requestsSemaphore.Release();
                return;
            }

            var customerCordinates = customerRequest.Cordinates;

            var node = subLocalityRequests.First;
            for (LinkedListNode<DriveRequest> nextNode; node != null; node = nextNode)
            {
                nextNode = node.Next;

                var driverRequestId = node.Value.Id;
                if (!await IsActiveAsync(driverRequestId))
                {
                    subLocalityRequests.Remove(node);
                    continue;
                }

                var driverRequest = node.Value;
                var driverCordinates = driverRequest.Cordinates;

                var distanceUrl = @"https://maps.googleapis.com/maps/api/distancematrix/json?" + $"origins={driverCordinates}" +
                    $"&destinations={customerCordinates}&avoid=ferries&units=metric&key={configuration["Maps:Key"]}";

                var distanceResponse = await urlService.SendRequestAsync(distanceUrl);

                var distanceRoot = JsonConvert.DeserializeObject<DistanceRoot.RootObject>(distanceResponse);
                if (distanceRoot.status != "OK" ||
                        distanceRoot.rows.First().elements.First().status != "OK" ||
                        distanceRoot.rows.First().elements.First().duration.value / 60.0 > 20.0)
                    continue;

                var directionsUrl = @"https://maps.googleapis.com/maps/api/directions/json?" + $"origin={driverCordinates}" +
                    $"&destination={customerCordinates}&avoid=ferries&units=metric&key={configuration["Maps:Key"]}";

                var directionsResponse = await urlService.SendRequestAsync(directionsUrl);

                var directionsRoot = JsonConvert.DeserializeObject<DirectionsRoot.RootObject>(directionsResponse);
                if (directionsRoot.status != "OK")
                    continue;

                try
                {
                    await cancellationLock.WaitAsync();

                    var isDriverActive = userResponses.TryGetValue(driverRequestId, out var _);

                    var isCustomerActive = userResponses.TryGetValue(customerRequest.Id, out var _);

                    if (!isCustomerActive && isDriverActive)
                        return;

                    subLocalityRequests.Remove(node);

                    if (!isDriverActive && isCustomerActive)
                        continue;

                    if (!isDriverActive && !isCustomerActive)
                        return;

                    if (isCustomerActive && isDriverActive)
                    {
                        var secondDirections = mapper.Map<Directions>(directionsRoot);

                        var result = new Drive
                        {
                            CustomerRequestId = customerRequest.Id,
                            DriverRequestId = driverRequest.Id,
                            FirstPolyline = directions.Polyline,
                            SecondPolyline = secondDirections.Polyline,
                            FirstDistance = directions.Distance,
                            SecondDistance = secondDirections.Distance,
                            FirstDuration = directions.Duration,
                            SecondDuration = secondDirections.Duration
                        };

                        var driveId = result.Id;

                        customerRequest.DriveId = driveId;
                        driverRequest.DriveId = driveId;

                        userResponses[customerRequest.Id] = result;
                        userResponses[driverRequestId] = result;
                    }

                    userLocks.TryRemove(driverRequestId, out var driverLock);

                    userLocks.TryRemove(customerRequest.Id, out var customerLock);

                    customerLock.Release();

                    driverLock.Release();
                }
                finally
                {
                    cancellationLock.Release();
                }
                return;
            }

            userRequests.Enqueue((customerRequest, directions));

            requestsSemaphore.Release();
        }

        private async Task<bool> IsActiveAsync(string userDriveRequestId)
        {
            bool result;
            try
            {
                await cancellationLock.WaitAsync();

                result = userResponses.TryGetValue(userDriveRequestId, out var _);
            }
            finally
            {
                cancellationLock.Release();
            }
            return result;
        }

        public async Task<bool> CancelRequestAsync(string userDriveRequestId)
        {
            try
            {
                await cancellationLock.WaitAsync();

                if (userResponses.TryGetValue(userDriveRequestId, out var directionsResult) && directionsResult == null)
                {
                    userResponses.TryRemove(userDriveRequestId, out _);

                    userLocks.TryRemove(userDriveRequestId, out var oldLock);

                    oldLock.Release();
                    return true;
                }
            }
            finally
            {
                cancellationLock.Release();
            }
            return false;
        }

    }
}
