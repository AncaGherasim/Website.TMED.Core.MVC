using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MVC_TMED.Infrastructure;
using System.Data;
using Newtonsoft.Json;
using MVC_TMED.Models;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Options;
using System.Diagnostics;
using System;
using System.Drawing;

namespace MVC_TMED.Controllers
{
    public class HomeController : Controller
    {
        private readonly AppSettings _appSettings;
        private readonly DapperWrap _dapperWrap;
        private readonly IWebHostEnvironment _webHostEnvironment;

        public HomeController(IOptions<AppSettings> appSettings, DapperWrap dapperWrap, IWebHostEnvironment webHostEnvironment)
        {
            _appSettings = appSettings.Value;
            _dapperWrap = dapperWrap;
            _webHostEnvironment = webHostEnvironment;
        }

        [TypeFilter(typeof(CheckCacheFilter))]
        [HttpGet("/", Name = "Home_Route")]
        [HttpHead("/", Name = "Home_Route")]
        [HttpPost("/", Name = "Home_Route")]
        public async Task<IActionResult> Index()
        {
            Console.WriteLine("****** Home Root Path: " + _webHostEnvironment.ContentRootPath + " | Home wwwroot Path: " + _webHostEnvironment.WebRootPath);

            if (HttpContext.Response.Headers.ContainsKey("_utPg"))
            {
                ViewBag._utPg = "BYO";               
            }
            else
            {
                HttpContext.Response.Headers.Add("_utPg", "DFLT");
                ViewBag._utPg = "DFLT";
            }

            Models.ViewModels.HomeViewModel viewmodelHome = new Models.ViewModels.HomeViewModel();

            List<NumberofCustomerFeedbacks> overAllReviews;

            var Result1 = await _dapperWrap.GetRecords<FeatItins>(SqlCalls.SQL_FeaturedItinerariesByUserID());
            viewmodelHome.objAllItineraries = Result1.ToList();

            var Result2 = await _dapperWrap.GetRecords<NumberofCustomerFeedbacks>(SqlCalls.SQL_Get_NumberofCustomerFeedbacks_OverAllScore());
            overAllReviews = Result2.ToList();
            viewmodelHome.NumComments = overAllReviews.First().NumComments;
            viewmodelHome.Score = overAllReviews.First().Score;

            var Result3 = await _dapperWrap.GetRecords<CustCommentsUserId>(SqlCalls.SQL_GetCustomerCommentsByuserID(_appSettings.ApplicationSettings.defaultMostPop));
            viewmodelHome.listReviews = Result3.ToList();

            var jsonHighlights = "";
            if (_webHostEnvironment.EnvironmentName == "Development")
            {
                jsonHighlights = System.IO.File.ReadAllText(_webHostEnvironment.ContentRootPath + "/highlights_dev.json");
            }
            else
            {
                jsonHighlights = System.IO.File.ReadAllText(_webHostEnvironment.ContentRootPath + "/highlights.json");
            }
            viewmodelHome.listHighlights = JsonConvert.DeserializeObject<List<Highlights>>(jsonHighlights);

            var Result4 = await _dapperWrap.GetRecords<SpotLight>(SqlCalls.SQL_SpotLights_Home(_appSettings.ApplicationSettings.spotLight));
            viewmodelHome.listSpotLights = Result4.ToList();
            viewmodelHome.spotLightBann = viewmodelHome.listSpotLights.Select(x => x.CountryNA).Distinct().ToList();
            foreach (var cty in viewmodelHome.listSpotLights.Select(x => new { x.CountryNA, x.city }).Distinct().ToList())
            {
                if (!viewmodelHome.ctyDictionary.ContainsKey(cty.CountryNA))
                {
                    viewmodelHome.ctyDictionary.Add(cty.CountryNA, cty.city);
                }
            }

            ViewBag.PageType = "HomePage";
            ViewBag.PageTitle = "European Vacations | Europe Vacation Packages | Tripmasters";
            ViewBag.pageMetaDesc = "European Vacations: build custom multi-city, multi-country europe vacation packages. Best Europe Vacation Packages - Rome - Florence - Venice by Train. Europe Tour Packages.";
            ViewBag.pageMetaKey = "Europe vacations, European tours, Europe tour packages,european vacation, Africa vacation packages, Middle East vacation packages, to Europe, hotel deals, online booking, pricing, information, hotel travel, hotel, resort, accommodations, Europe, France, Paris, England, London, Netherlands, Italy, Spain";
            ViewBag.image = "https://pictures.tripmasters.com/siteassets/d/tmed_home-min.jpg";
            ViewBag.tmpagetype = "homepage";
            ViewBag.tmpagetypeinstance = "";
            ViewBag.tmrowid ="";
            ViewBag.tmadstatus ="";
            ViewBag.tmregion ="europe";
            ViewBag.tmcountry ="";
            ViewBag.tmdestination ="";

                var Result5 = await _dapperWrap.GetRecords<ExploreDest>(SqlCalls.SQL_AllDestinos());
                viewmodelHome.listexploreDest = Result5.ToList();

                return View("Home", viewmodelHome);
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
