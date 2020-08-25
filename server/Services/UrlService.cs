using CarGoSimulator.Interfaces;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace CarGoSimulator.Services
{
    public class UrlService : IUrlService
    {
        public string PrepareString(string oldString)
        {
            return System.Text.RegularExpressions.Regex.Replace(oldString.Trim(), @"\s+", "+");
        }

        public async Task<string> SendRequestAsync(string url)
        {
            WebRequest request = WebRequest.Create(url);
            string responseFromServer = null;

            using (WebResponse response = await request.GetResponseAsync())
            {
                Stream data = response.GetResponseStream();

                StreamReader reader = new StreamReader(data);

                responseFromServer = await reader.ReadToEndAsync();
            }

            return responseFromServer;
        }

        public string SendRequest(string url)
        {
            WebRequest request = WebRequest.Create(url);
            string responseFromServer = null;

            using (WebResponse response = request.GetResponse())
            {
                Stream data = response.GetResponseStream();

                StreamReader reader = new StreamReader(data);

                responseFromServer = reader.ReadToEnd();
            }

            return responseFromServer;
        }
    }
}
