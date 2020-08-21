using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CarGoSimulator.Interfaces
{
    public interface IMailService
    {
        Task SendEmailAsync(string to, string subject, string content);
    }
}
