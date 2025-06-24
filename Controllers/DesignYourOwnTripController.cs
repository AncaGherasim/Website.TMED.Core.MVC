using Microsoft.AspNetCore.Mvc;
using MVC_TMED.Infrastructure;
using Microsoft.Extensions.Options;

namespace MVC_TMED.Controllers
{
    public class DesignYourOwnTripController : Controller
    {
        private readonly AppSettings _appSettings;
        private readonly DapperWrap _dapperWrap;

        public DesignYourOwnTripController(IOptions<AppSettings> appsettings, DapperWrap dapperWrap)
        {
            _appSettings = appsettings.Value;
            _dapperWrap = dapperWrap;
        }

        [HttpGet("DesignYourOwnTrip", Name = "DesignYourOwnTrip_Route")]
        [HttpHead("DesignYourOwnTrip", Name = "DesignYourOwnTrip_Route")]
        [HttpPost("DesignYourOwnTrip", Name = "DesignYourOwnTrip_Route")]
        public IActionResult Index() 
        {
            return View("../Design");
        }
    }
}
