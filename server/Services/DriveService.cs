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

        private readonly ConcurrentDictionary<string, SemaphoreSlim> cancellationLocks = new ConcurrentDictionary<string, SemaphoreSlim>();

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
            var userRequestId = userRequest.Id;

            var userLock = new SemaphoreSlim(0, 1);
            userLocks[userRequestId] = userLock;

            userResponses[userRequestId] = null;

            var cancellationLock = new SemaphoreSlim(1, 1);
            cancellationLocks[userRequestId] = cancellationLock;

            userRequests.Enqueue((userRequest, directions));

            requestsSemaphore.Release();

            if (directions == null)
                await userLock.WaitAsync();
            else
                await userLock.WaitAsync(59000);

            try
            {
                await cancellationLock.WaitAsync();

                userLocks.TryRemove(userRequestId, out var _);

                userResponses.TryRemove(userRequestId, out var response);

                cancellationLocks.TryRemove(userRequestId, out var _);

                return response;
            }
            finally
            {
                cancellationLock.Release();
            }
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

            var userRequestId = userRequest.Id;

            if (!await IsActiveAsync(userRequestId))
                return;

            var subLocalityLocks = localitySubLocalityLocks[userRequest.Locality];

            SemaphoreSlim subLocalityLock = new SemaphoreSlim(1, 1);
            subLocalityLock = subLocalityLocks.GetOrAdd(userRequest.SubLocality, subLocalityLock);

            try
            {
                await subLocalityLock.WaitAsync();

                if (!await IsActiveAsync(userRequestId))
                    return;

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

                var customerRequestId = customerRequest.Id;
                if (!cancellationLocks.TryGetValue(customerRequestId, out var customerCancellationLock))
                    return;

                try
                {
                    await customerCancellationLock.WaitAsync();

                    if (!userResponses.ContainsKey(customerRequestId))
                        return;

                    subLocalityRequests.Remove(node);

                    if (!cancellationLocks.TryRemove(driverRequestId, out var driverCancellationLock))
                        continue;

                    try
                    {
                        await driverCancellationLock.WaitAsync();

                        if (!userResponses.ContainsKey(driverRequestId))
                            continue;

                        var firstDirections = mapper.Map<Directions>(directionsRoot);

                        var result = new Drive
                        {
                            CustomerRequestId = customerRequest.Id,
                            DriverRequestId = driverRequest.Id,
                            FirstPolyline = firstDirections.Polyline,
                            SecondPolyline = directions.Polyline,
                            FirstDistance = firstDirections.Distance,
                            SecondDistance = directions.Distance,
                            FirstDuration = firstDirections.Duration,
                            SecondDuration = directions.Duration
                        };

                        var driveId = result.Id;

                        customerRequest.DriveId = driveId;
                        driverRequest.DriveId = driveId;

                        userResponses[customerRequest.Id] = result;
                        userResponses[driverRequestId] = result;

                        userLocks.TryRemove(driverRequestId, out var driverLock);

                        userLocks.TryRemove(customerRequest.Id, out var customerLock);

                        driverLock.Release();

                        customerLock.Release();
                        return;
                    }
                    catch(SemaphoreFullException)
                    {
                        return;
                    }
                    finally
                    {
                        driverCancellationLock.Release();
                    }
                }
                finally
                {
                    customerCancellationLock.Release();
                }
            }

            userRequests.Enqueue((customerRequest, directions));

            requestsSemaphore.Release();
        }

        private async Task<bool> IsActiveAsync(string userDriveRequestId)
        {
            if (!cancellationLocks.TryGetValue(userDriveRequestId, out var cancellationLock))
                return false;

            try
            {
                await cancellationLock.WaitAsync();

                return userResponses.ContainsKey(userDriveRequestId);
            }
            finally
            {
                cancellationLock.Release();
            }
        }

        public async Task<bool> CancelRequestAsync(string userDriveRequestId)
        {
            if (!cancellationLocks.TryGetValue(userDriveRequestId, out var cancellationLock))
                return false;

            try
            {
                await cancellationLock.WaitAsync();

                if (!userResponses.TryGetValue(userDriveRequestId, out var directionsResult) || directionsResult != null)
                    return false;

                userLocks.TryRemove(userDriveRequestId, out var oldLock);

                userResponses.TryRemove(userDriveRequestId, out _);

                cancellationLocks.TryRemove(userDriveRequestId, out _);

                oldLock.Release();
                return true;
            }
            catch(SemaphoreFullException)
            {
                return true;
            }
            finally
            {
                cancellationLock.Release();
            }
        }

    }
}
