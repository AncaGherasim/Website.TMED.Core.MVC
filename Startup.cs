using System;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using MVC_TMED.Infrastructure;
using Microsoft.Extensions.Options;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Routing;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.Extensions.FileProviders;
using System.IO;
using static System.Net.WebRequestMethods;
using Amazon.SimpleSystemsManagement;
using Amazon.SimpleSystemsManagement.Model;
using System.Text.Json.Nodes;
using System.Collections.Generic;
using System.Linq;
using Microsoft.Extensions.Logging;

namespace MVC_TMED
{
    public class Startup
    {
        public IConfiguration Configuration { get; }
        public IWebHostEnvironment Env { get; }
        public static IConfiguration StaticConfig { get; private set; }
        public AWSParameterStoreService AWSParameterStoreService { get; private set; }

        public Startup(IConfiguration configuration, IWebHostEnvironment env)
        {
            this.AWSParameterStoreService = new AWSParameterStoreService();
            Configuration = configuration;
            StaticConfig = configuration;
            Env = env;
            var builder = new ConfigurationBuilder()
                .SetBasePath(env.ContentRootPath)
                .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
                .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true)
                .AddEnvironmentVariables();
            Configuration = builder.Build();
            Env = env;
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddSingleton<AWSParameterStoreService>();

            services.AddControllersWithViews();

            services.AddAWSService<IAmazonSimpleSystemsManagement>();

            services.Configure<ForwardedHeadersOptions>(options =>
            {
                options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
            });

            services.AddHttpContextAccessor();

            services.AddScoped<Infrastructure.DapperWrap>();

            services.AddSingleton<CachedDataService>();
           

            services.Configure<AppSettings>(Configuration);

            services.Configure<AWSParameterStoreService>(Configuration);

            services.AddSession(options =>
            {
                // Set a short timeout for easy testing.
                options.IdleTimeout = TimeSpan.FromSeconds(10);
                options.Cookie.HttpOnly = true;
                // Make the session cookie essential
                options.Cookie.IsEssential = true;
            });

            services.Configure<RouteOptions>(options => options.LowercaseUrls = true);

            services.AddMemoryCache();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, IServiceProvider serviceProvider, DapperWrap dapperWrap, CachedDataService cachedDataService, ILogger<Startup> logger)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(AWSParameterStoreService.SqlConnectionString) || string.IsNullOrWhiteSpace(AWSParameterStoreService.MySqlConnectionString) || string.IsNullOrWhiteSpace(AWSParameterStoreService.PostgresConnectionString))
                {
                    int retryCount = 0;
                    bool success = false;
                    while (retryCount < 5 && !success)
                    {
                        using (var scope = app.ApplicationServices.CreateScope())
                        {
                            var ssmClient = scope.ServiceProvider.GetRequiredService<IAmazonSimpleSystemsManagement>();
                            var parameterStoreService = scope.ServiceProvider.GetRequiredService<AWSParameterStoreService>();
                            // Access Parameter Store value
                            var parameterNames = new List<string> {
                                            "/WEB/Tournet/SqlConn",
                                            "/WEB/Tournet/AuroraConn",
                                            "/WEB/Tournet/PostgresConn"
                            };
                            var request = new GetParametersRequest
                            {
                                Names = parameterNames,
                                WithDecryption = true,
                            };

                            var response = ssmClient.GetParametersAsync(request);

                            if (response.Result.Parameters.Count > 0)
                            {
                                foreach (var parameter in response.Result.Parameters)
                                {
                                    if (parameter.Name == "/WEB/Tournet/AuroraConn")
                                    {
                                        dynamic? parameterStore = JsonObject.Parse(parameter.Value);
                                        var host = parameterStore["Host"];
                                        var database = parameterStore["Database"];
                                        var user = parameterStore["Username"];
                                        var password = parameterStore["Password"];
                                        var maxPool = parameterStore["MaxPool"];
                                        parameterStoreService.MySqlConnectionString = $"SERVER={host};DATABASE={database};UID={user};PWD={password};Max Pool Size={maxPool};Allow User Variables=True";

                                    }
                                    if (parameter.Name == "/WEB/Tournet/SqlConn")
                                    {
                                        dynamic? parameterStore = JsonObject.Parse(parameter.Value);
                                        var host = parameterStore["Host"];
                                        var database = parameterStore["Database"];
                                        var user = parameterStore["Username"];
                                        var password = parameterStore["Password"];
                                        var maxPool = parameterStore["MaxPool"];
                                        parameterStoreService.SqlConnectionString = $"SERVER={host};DATABASE={database};UID={user};PWD={password};Max Pool Size={maxPool};TrustServerCertificate=True";
                                    }
                                    if (parameter.Name == "/WEB/Tournet/PostgresConn")
                                    {
                                        dynamic? parameterStore = JsonObject.Parse(parameter.Value);
                                        var host = parameterStore["Host"];
                                        var hostRo = parameterStore["HostRO"];
                                        var database = parameterStore["Database"];
                                        var user = parameterStore["Username"];
                                        var password = parameterStore["Password"];
                                        parameterStoreService.PostgresConnectionString = $"SERVER={hostRo};DATABASE={database};Username={user};Password={password}";
                                    }
                                }
                                var logResponseInfo = $"****** Site: TMED | Secrets Read AWS Parameter Store | SQLParameterStore: {AWSParameterStoreService.SqlConnectionString} | MySQLParameterStore: {AWSParameterStoreService.MySqlConnectionString} | PostgresSQLParameterStore: {AWSParameterStoreService.PostgresConnectionString}";
                                logger.LogInformation(logResponseInfo);

                                success = true;
                            }
                            else
                            {
                                throw new Exception("Failed to retreive AWS parameter store values. Response is null.");
                            }
                            retryCount++;
                        }
                        if (retryCount == 5)
                        {
                            throw new Exception("Exceeded number of tries to retrieve the parameters store values");
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                var logError = $"****** Site: TMED | Error reading AWS Parameter Store values. | {ex.Message}";
                logger.LogError(logError);
                throw new Exception("Could not retrieve AWS Parameter Store values");
            }

            app.UseForwardedHeaders();

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/europe/Error/HandleError");
                app.UseStatusCodePagesWithReExecute("/europe/Error/HandleError", "?statusCode={0}");  //for 404 error
                app.UseHsts();
            }

            app.Use(async (context, next) =>
            {
                Regex reg = new Regex(@"^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$");
                Boolean secureLH = context.Request.Host.Host.ToString().Contains("localhost");
                Boolean secureIP = reg.IsMatch(context.Request.Host.Host.ToString());
                Boolean secureURL = false;
                var urlRaw = context.Request.Path.Value;
                var fullUrl = "://" + context.Request.Host;
                string queryString = context.Request.QueryString.HasValue ? context.Request.QueryString.Value : string.Empty;
                Regex inj = new Regex(@"XOR\(|if\(|now\(|sysdate\(|sleep\(|\)XOR");
                Boolean injectSTRING = inj.IsMatch(urlRaw);
                if (injectSTRING)
                {
                    var rejectURL = "https://www.tripmasters.com/europe/error";
                    context.Response.Redirect(rejectURL, true);
                    await context.Response.WriteAsync(injectSTRING + " | " + rejectURL);
                }

                if (!urlRaw.Contains("/europe"))
                {
                    urlRaw = "/europe" + urlRaw;
                }
                if (secureLH == false && secureIP == false) { secureURL = true; };
                if (secureURL == true)
                {
                    if (Regex.IsMatch(fullUrl, "://tripmasters.com", RegexOptions.IgnoreCase) == true) 
                    {
                        var www = "https://www." + context.Request.Host + urlRaw + queryString;
                        context.Response.Redirect(www, true);
                    }
                    else
                    {
                        if (context.Request.IsHttps || context.Request.Headers["X-Forwarded-Proto"] == Uri.UriSchemeHttps)
                        {
                            Regex portu = new Regex(@"portugal/vacations", RegexOptions.IgnoreCase);
                            if (portu.IsMatch(urlRaw) && urlRaw.Any(char.IsUpper))
                            {
                                var www = "https://" + context.Request.Host + urlRaw.ToLower() + queryString;
                                context.Response.Redirect(www, true);
                            }
                            else
                            {
                                await next();
                            }
                        }
                        else
                        {
                            var https = "https://" + context.Request.Host + urlRaw + queryString;
                            context.Response.Redirect(https, true);
                        }
                    }
                }
                else
                {
                    await next();
                }
            });

            app.UseHttpsRedirection();

            if (Environment.GetEnvironmentVariable("ContainerMode") == "Fargate")
            {
                app.UseStaticFiles("/europe");
                app.UsePathBase("/europe");
            }
            else
                app.UseStaticFiles();

            Utilities.Configure(app.ApplicationServices.GetRequiredService<IHttpContextAccessor>(), app.ApplicationServices.GetRequiredService<IOptions<AppSettings>>(), app.ApplicationServices.GetRequiredService<AWSParameterStoreService>(), dapperWrap);

            app.UseRouting();

            app.UseSession();

            //app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                   name: "default",
                   pattern: "{controller=Home}/{action=Index}/{id?}");
                endpoints.MapControllerRoute(
                    name: "Aspx1",
                    pattern: "{urlpath1}.aspx",
                    defaults: new { controler = "LegacyRedirection", action = "FancyUrlRedirect1" });
                endpoints.MapControllerRoute(
                   name: "Aspx2",
                   pattern: "{urlpath1}/{urlpath2}.aspx",
                   defaults: new { controler = "LegacyRedirection", action = "FancyUrlRedirect2" });              
                endpoints.MapControllerRoute(
                   name: "Aspx3",
                   pattern: "/cms/{urlpath1}/{urlpath2}.aspx",
                   defaults: new { controler = "LegacyRedirection", action = "FancyUrlRedirect3" });
                endpoints.MapControllerRoute(
                   name: "SEO1",
                   pattern: "/s/{urlpath1}",
                   defaults: new { controler = "LegacyRedirection", action = "FancyUrlRedirect4" });
                endpoints.MapControllerRoute(
                   name: "SEO2",
                   pattern: "/s/{urlpath1}/{urlpath2}",
                   defaults: new { controler = "LegacyRedirection", action = "FancyUrlRedirect5" });
                endpoints.MapControllerRoute(
                   name: "Aspx4",
                   pattern: "/Interest/{urlpath1}/{urlpath2}/{urlpath3}.aspx",
                   defaults: new { controler = "LegacyRedirection", action = "FancyUrlRedirect6" });
                endpoints.MapControllerRoute(
                 name: "Aspx7",
                 pattern: "{urlpath1}/{urlpath2}/{urlpath3}.aspx",
                 defaults: new { controler = "LegacyRedirection", action = "FancyUrlRedirect7" });
            });
        }
    }
}
