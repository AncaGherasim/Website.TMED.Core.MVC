using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;
using MVC_TMED;
using System;
using System.Globalization;

namespace MVC_TMED
{
    public class Program
    {
        public static void Main(string[] args)
        {
            CultureInfo.DefaultThreadCurrentCulture = new CultureInfo("en-US");
            CreateHostBuilder(args).Build().Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    if (Environment.GetEnvironmentVariable("ContainerMode") == "Fargate")
                        webBuilder.UseUrls("http://0.0.0.0:5002");
                        webBuilder.UseStartup<Startup>();
                });
    }
}
