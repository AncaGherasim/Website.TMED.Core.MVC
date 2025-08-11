using System;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http.Features;
using System.IO;
using System.Net;
using System.Net.Sockets;
using Microsoft.Extensions.Logging;
using MVC_TMED.Infrastructure;

namespace MVC_TMED.Controllers
{
    public class ErrorController : Controller
    {
        private readonly IWebHostEnvironment hostingEnvironment;
        private readonly ILogger<ErrorController> logger;
        private readonly IHttpContextAccessor httpContextAccessor;
        public ErrorController(IWebHostEnvironment _hostingEnvironment, ILogger<ErrorController> _logger, IHttpContextAccessor _httpContextAccessor)
        {
            logger = _logger;
            hostingEnvironment = _hostingEnvironment;
            httpContextAccessor = _httpContextAccessor;
        }

        [Route("Error/HandleError")]
        public IActionResult HandleError(int? statusCode = null)
        {
            var req = HttpContext.Request;
            var ctx = HttpContext;
            var rawBody = ctx.Items["RawRequestBody"] as string ?? "";
            var exceptionFeature = HttpContext.Features.Get<IExceptionHandlerFeature>();
            var isApi = exceptionFeature != null && exceptionFeature.Path?.Contains("/Api/", StringComparison.OrdinalIgnoreCase) == true;
            var clientIp = ClientInfo.GetClientIp(HttpContext);
            if (exceptionFeature?.Error != null)
            {
                var origQuery = HttpContext.Items["OriginalQueryString"] as string;
                if (isApi)
                {
                    logger.LogInformation($"****** Site: TMED | ClientIP: {clientIp} | Request {exceptionFeature?.Error.Message} returned status code {HttpContext.Response.StatusCode} on {req.Method} {exceptionFeature?.Path} {origQuery ?? ""}. Payload: {rawBody ?? ""}");
                }
                else
                {
                    logger.LogInformation($"****** Site: TMED | ClientIP: {clientIp} | Request {exceptionFeature?.Error.Message} returned status code {HttpContext.Response.StatusCode} on {req.Method} {exceptionFeature?.Path} {origQuery ?? ""}. (no payload logged)");
                }
                ViewBag.ErrorType = "500 error";
                ViewBag.ErrorMessage = exceptionFeature?.Error.Message;
            }
            else
            {
                var code = statusCode ?? HttpContext.Response.StatusCode;
                var statusFeat = HttpContext.Features.Get<IStatusCodeReExecuteFeature>();
                var origPath = statusFeat?.OriginalPath;
                var origQuery = statusFeat?.OriginalQueryString;
                if (isApi)
                {
                    logger.LogInformation($"****** Site: TMED | ClientIP: {clientIp} | Request {exceptionFeature?.Error.Message} returned status code {code} on {req.Method} {origPath ?? ""} {origQuery ?? ""}. Payload: {rawBody ?? ""}");
                }
                else
                {
                    logger.LogInformation($"****** Site: TMED | ClientIP: {clientIp} | Request {exceptionFeature?.Error.Message} returned status code {code} on {req.Method} {origPath ?? ""} {origQuery ?? ""}.");
                }

                ViewBag.ErrorType = $"{code} error";
                ViewBag.ErrorMessage = code == 404 ? "Page not found." : "";
            }

            return View("Error");
        }
    }
}