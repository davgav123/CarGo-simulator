using CarGoSimulator.Interfaces;
using Microsoft.Extensions.Configuration;
using SendGrid;
using SendGrid.Helpers.Mail;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CarGoSimulator.Services
{
    public class SendGridMailService : IMailService
    {
        private readonly IConfiguration configuration;

        public SendGridMailService(IConfiguration configuration)
        {
            this.configuration = configuration;
        }

        public async Task SendEmailAsync(string toEmail, string subject, string content)
        {
            var apiKey = configuration["SendGrid:Key"];
            var client = new SendGridClient(apiKey);
            var from = new EmailAddress(configuration["SendGrid:from"]);
            var to = new EmailAddress(toEmail);

            var msg = MailHelper.CreateSingleEmail(from, to, subject, content, content);
            await client.SendEmailAsync(msg);
        }
    }
}
