using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MVC_TMED.Infrastructure;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using MVC_TMED.Models;
using System.Diagnostics.Metrics;

namespace MVC_TMED.Controllers
{
    public class CmsController : Controller
    {

        private readonly AppSettings _appSettings;
        private readonly DapperWrap _dapperWrap;

        public CmsController(IOptions<AppSettings> appSettings, DapperWrap dapperWrap)
        {
            _appSettings = appSettings.Value;
            _dapperWrap = dapperWrap;
        }

        [HttpGet("/Cms/{id}", Name = "Cms_Route")] //cms/1117
        [HttpHead("/Cms/{id}", Name = "Cms_Route")] //cms/1117
        [HttpPost("/Cms/{id}", Name = "Cms_Route")] //cms/1117
        public async Task<IActionResult> Index(string id)
        {
            int intId = int.Parse(id);

            Models.ViewModels.CmsViewModel viewModelTemplate = new Models.ViewModels.CmsViewModel();
            var result1 = await _dapperWrap.GetRecords<CMSContent>(SqlCalls.SQL_CMSContent(intId.ToString()));
            List<CMSContent> dvCMScontent = result1.ToList();
            if (dvCMScontent.Count > 0)
            {
                viewModelTemplate.CMSwebContentStr = dvCMScontent[dvCMScontent.Count - 1].CMS_Content;
            }
            else
            {
                viewModelTemplate.CMSwebContentStr = "TripMasters's team is working to fix this issue";
            }

            viewModelTemplate.cmsID = intId.ToString();
            viewModelTemplate.pageTitle = "CMS - Website Content";
            viewModelTemplate.pageMetaDesc = "Plan an unforgettable vacation to Europe with Tripmasters today. Find custom multi-city, multi-country vacation packages that are sure to suit every travelers desire.";
            viewModelTemplate.pageMetaKey = "Europe vacations, European tours, Europe tour packages, vacation packages, to Europe, hotel deals, online booking, pricing, information, hotel travel, hotel, resort, accommodations, Europe, France, Paris, England, London, Netherlands, Italy, Spain";
            ViewBag.PageTitle = viewModelTemplate.pageTitle;
            ViewBag.pageMetaDesc = viewModelTemplate.pageMetaDesc;
            ViewBag.pageMetaKey = viewModelTemplate.pageMetaKey;
            ViewBag.tmpagetype = "cms";
            ViewBag.tmpagetypeinstance = "";
            ViewBag.tmrowid = "";
            ViewBag.tmadstatus = "";
            ViewBag.tmregion = "europe";
            ViewBag.tmcountry = "";
            ViewBag.tmdestination = "";


            if (Utilities.CheckMobileDevice() == false)
            {
                return View("Cms", viewModelTemplate);
            }
            else
            {
                return View("Cms", viewModelTemplate);
            }


        }


    }
}
