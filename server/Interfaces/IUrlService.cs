using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace CarGoSimulator.Interfaces
{
    public interface IUrlService
    {
        string PrepareString(string oldString);

        Task<string> SendRequestAsync(string url);
    }
}
