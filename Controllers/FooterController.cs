using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MVC_TMED.Infrastructure;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Options;
using MVC_TMED.Models;
using System.Data;



// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace MVC_TMED.Controllers
{
    public class FooterController : Controller
    {
        private readonly AppSettings _appSettings;
        private readonly DapperWrap _dapperWrap;
        private readonly IWebHostEnvironment _hostingEnvironment;

        public FooterController(IOptions<AppSettings> appsettings, DapperWrap dapperWrap, IWebHostEnvironment hostingEnvironment)
        {
            _appSettings = appsettings.Value;
            _dapperWrap = dapperWrap;
            _hostingEnvironment = hostingEnvironment;
        }

        //// GET: /<controller>/
        [HttpGet("{country}/Destinations", Name = "CountryDestinations_Route")]
        [HttpHead("{country}/Destinations", Name = "CountryDestinations_Route")]
        [HttpPost("{country}/Destinations", Name = "CountryDestinations_Route")]
        public async Task<IActionResult> CountryDestinations(string country)
        {
            if (Utilities.CheckMobileDevice() == false)
            {
                ViewBag.Mobile = 0;
            }
            else
            {
                ViewBag.Mobile = 1;
            }

            Models.ViewModels.DestinationsViewModel viewModelTemplateCity = new Models.ViewModels.DestinationsViewModel();
            viewModelTemplateCity.placeNA = country;
            List<cityDestinations> dvCity;
            var result1 = await _dapperWrap.GetRecords<cityDestinations>(SqlCalls.SQL_ctyBycon(country));
            dvCity = result1.ToList();
            viewModelTemplateCity.listcities = dvCity;
            if (dvCity.Count > 0)
            {
                viewModelTemplateCity.cityID = dvCity[0].CYID;
                viewModelTemplateCity.cityName = dvCity[0].CYName;
                viewModelTemplateCity.cityType = dvCity[0].CYType;
                viewModelTemplateCity.cityInfo = dvCity[0].CYInfo;
            }
            for (int dt=0; dt < dvCity.Count; dt++)
            {
                viewModelTemplateCity.boxCtyinCon.Add(dvCity[dt].CYID + "|" + dvCity[dt].CYInfo + "|" + dvCity[dt].CYName + "|" +dvCity[dt].CYType);
            }
            viewModelTemplateCity.listcity = dvCity.OrderBy(n => n.CYName).ToList();

            return View("CityDestinations", viewModelTemplateCity);
        }

    }
}
