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

namespace MVC_TMED.Controllers
{
    public class ErrorController : Controller
    {
        private readonly IHostingEnvironment hostingEnvironment;
        private readonly ILogger<ErrorController> logger;
        private readonly IHttpContextAccessor httpContextAccessor;
        public ErrorController(IHostingEnvironment _hostingEnvironment, ILogger<ErrorController> _logger, IHttpContextAccessor _httpContextAccessor)
        {
            logger = _logger;
            hostingEnvironment = _hostingEnvironment;
            httpContextAccessor = _httpContextAccessor;
        }

        //[Route("Error")]
        public IActionResult HandleError(int? statusCode = null)
        {
            if (statusCode == null)
            {
                statusCode = HttpContext.Response.StatusCode;
                ViewBag.ErrorType = statusCode.ToString() + " error";
                ViewBag.ErrorMessage = "";
            }
            else if (statusCode == 404)
            {
                ViewBag.ErrorType = statusCode.ToString() + " error";
                ViewBag.ErrorMessage = "";
            }
            else
            {
                ViewBag.ErrorType = statusCode.ToString() + " error";
            }
            return View("Error");
        }
    }
}
