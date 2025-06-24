using MVC_TMED.Infrastructure;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace MVC_TMED.Controllers
{
    public class CheckBookingForReviewController : Controller
    {
        private readonly AppSettings _appSettings;
        private readonly DapperWrap _dapperWrap;

        public CheckBookingForReviewController(IOptions<AppSettings> appsettings, DapperWrap dapperWrap)
        {
            _appSettings = appsettings.Value;
            _dapperWrap = dapperWrap;
        }

        [HttpGet("CheckBookingForReview")]
        [HttpHead("CheckBookingForReview")]
        [HttpPost("CheckBookingForReview")]
        public IActionResult Index()
        {
            //if (Utilities.CheckMobileDevice() == false)
            //{
            return Desktop();
            //}
            //else
            //{
            //    return await Mobile(country, pack, id);
            //}
        }

        public IActionResult Desktop()
        {
            if (Utilities.CheckMobileDevice() == false)
            {
                ViewBag.Mobile = 0;
            }
            else
            {
                ViewBag.Mobile = 1;
            }
            return View("CheckBookingForReview");

        }

    }
}
