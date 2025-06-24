using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using MVC_TMED.Infrastructure;
using MVC_TMED.Models.ViewModels;
using MVC_TMED.Models;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System;
using System.Threading.Tasks;
using static Mysqlx.Datatypes.Scalar.Types;
using System.Collections;
using static MVC_TMED.Models.ViewModels.Country_T5ViewModel;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using MySqlX.XDevAPI.Common;
using static Google.Protobuf.Reflection.FieldOptions.Types;

namespace MVC_TMED.Controllers
{
    public class AllPackagesController : Controller
    {
        private readonly IOptions<AppSettings> _appSettings;
        private readonly DapperWrap _dapperWrap;
        public AllPackagesController(IOptions<AppSettings> appSettings, DapperWrap dapperWrap)
        {
            _appSettings = appSettings;
            _dapperWrap = dapperWrap;
        }
        [HttpGet("{placeName}/all_vacation_packages", Name = "All_Packages_Route")]
        [HttpGet("{placeName}/{cityAllPackName}/all_vacation_packages", Name = "City_AllPackages_Route")]
        [HttpHead("{placeName}/all_vacation_packages", Name = "All_Packages_Route")]
        [HttpHead("{placeName}/{cityAllPackName}/all_vacation_packages", Name = "City_AllPackages_Route")]
        [HttpPost("{placeName}/all_vacation_packages", Name = "All_Packages_Route")]
        [HttpPost("{placeName}/{cityAllPackName}/all_vacation_packages", Name = "City_AllPackages_Route")]
        public async Task<IActionResult> Index(string placeName, string cityAllPackName)
        {
            string CityRegCou;
            CityRegCou = placeName;
            if (ControllerContext.ActionDescriptor.AttributeRouteInfo.Name == "City_AllPackages_Route")
            {
                CityRegCou = cityAllPackName;
            }
            List<PlacesHierarchy> placesHierarchies = new List<PlacesHierarchy>();
            var plcHierarchy = await _dapperWrap.GetRecords<PlacesHierarchy>(SqlCalls.SQL_Vacations_Places_Hierarchy(CityRegCou));
            placesHierarchies = plcHierarchy.ToList();

            if (placesHierarchies.Count == 0)
            {
                return NotFound();
            }

            Int32 currentUser_ID = Int32.Parse(_appSettings.Value.ApplicationSettings.userID);
            string division = _appSettings.Value.ApplicationSettings.SiteName;
            if (placesHierarchies.Count == 1)
            {
                division = placesHierarchies.First().STR_UserID == 243 ? "/europe" : placesHierarchies.First().STR_UserID == 182 ? "/latin" : placesHierarchies.First().STR_UserID == 595 ? "/asia" : _appSettings.Value.ApplicationSettings.SiteName;
            }
            else
            {
                if (placesHierarchies.Where(x => x.STR_PlacePriority == 1).Count() > 0)
                {
                    if (placesHierarchies.Where(x => x.STR_PlacePriority == 1 && x.STR_UserID == currentUser_ID).Count() == 0)
                    {
                        int Priority1STR_UserID = placesHierarchies.Where(x => x.STR_PlacePriority == 1).FirstOrDefault().STR_UserID;
                        division = Priority1STR_UserID == 243 ? "/europe" : Priority1STR_UserID == 182 ? "/latin" : Priority1STR_UserID == 595 ? "/asia" : _appSettings.Value.ApplicationSettings.SiteName;
                    }
                }
            }
            if (division != _appSettings.Value.ApplicationSettings.SiteName && _appSettings.Value.ApplicationSettings.SiteName != "")
            {
                switch (ControllerContext.ActionDescriptor.AttributeRouteInfo.Name)
                {
                    case "All_Packages_Route":
                        return RedirectPermanent(division + "/" + placeName + "/all_vacation_packages");
                    case "City_AllPackages_Route":
                        return RedirectPermanent(division + "/" + placeName + "/" + cityAllPackName + "/all_vacation_packages");
                    default:
                        // code block
                        break;
                }
            }
            PlacesHierarchy currentPlacesHierarchy = placesHierarchies.Where(x => x.STR_UserID == currentUser_ID).First();
            string place = CityRegCou;
            int plcID = currentPlacesHierarchy.STR_PlaceID;
            int StrID = currentPlacesHierarchy.STRID;
            string couAllPackName = placeName;

            Models.ViewModels.AllPackagesViewModel model = new Models.ViewModels.AllPackagesViewModel();
            var result2 = await _dapperWrap.GetRecords<Hierarchy>(SqlCalls.SQL_Hierarchy(plcID));
            model.listHierarchy = result2.ToList();

            var jsonResult = await _dapperWrap.pgJsonGetRecordsAsync<PacksByPlaceID_PG>(PostgresCalls.PG_Func_Packagesbyplaceid(), 4, new { UserId = 243, PlaceId = plcID });
            if (string.IsNullOrWhiteSpace(jsonResult))
            {
                return NotFound();
            }
            PacksByPlaceID_PG resultObject = JsonConvert.DeserializeObject<PacksByPlaceID_PG>(jsonResult);
            model.allPackages = resultObject;

            model.Countries = model.allPackages.cities
                .GroupBy(c => new { c.counid, c.counname })
                .Select(g => new CountryWithCitiesPG
                {
                    counid = g.Key.counid,
                    counname = g.Key.counname,
                    cities = g.Select(c => new CityPG
                    {
                        str_placeid = c.str_placeid,
                        str_placetitle = c.str_placetitle,
                        plcrk = c.plcrk
                    }).ToList()
                }).OrderBy(x => x.counname)
                .ToList();
            model.thisCountry = model.Countries.Where(x => x.counname.Replace(" ", "_").ToLower() == couAllPackName.Replace(" ", "_").ToLower()).Select(x => new CountryWithCitiesPG { counid = x.counid, counname = x.counname }).ToList().FirstOrDefault();
            model.thisCountry.cities = model.allPackages.cities.Where(x => x.counname.Replace(" ", "_").ToLower() == couAllPackName.Replace(" ", "_").ToLower()).OrderBy(x => x.plcrk).Select(x => new CityPG { str_placeid = x.str_placeid, str_placetitle = x.str_placetitle }).Distinct(new CityObjectComparer()).ToList();

            List<Place_Info> placeInfo = new List<Place_Info>();
            List<Hierarchy> placeHierarchy = new List<Hierarchy>();

            model.placeNA = Utilities.UppercaseFirstLetter(place.Replace("_", " "));
            model.placeID = plcID;
            model.placeSTR = StrID;
            model.couNA = Utilities.UppercaseFirstLetter(couAllPackName.Replace("_", " "));

            string pageTitle = model.placeNA + " Vacations | Independent Travel to " + model.placeNA + " | Flexible Multi-City Trips to " + model.placeNA;
            string pageMetaDesc = model.placeNA + " Customize Multi-City Asia Vacations: " + model.placeNA + " Vacations, Flexible " + model.placeNA + " Travel Packages, Customizable Tours to " + model.placeNA + ", all in seconds! Read glowing reviews from our travelers and see what other travelers have done on their " + model.placeNA + " vacation package. Book and customize vacation packages online or call toll-free: 1-800-430-0484";
            string pageMetaKey = model.placeNA + " vacations, " + model.placeNA + " vacation packages, discount " + model.placeNA + " vacations, discount vacations, vacation packages, vacations, vacation deals, travel, travel packages, travel deals, asia destinations, independent tours, customizable packages, tourism, bargain vacations, discount hotels, discount airfare, travel guides, fly drive, honeymoon vacations, holiday vacations, last minute travel, online reservations, Asia, South Pacific deals";

            ViewBag.PageTitle = pageTitle;
            ViewBag.pageMetaDesc = pageMetaDesc;
            ViewBag.pageMetaKey = pageMetaKey;

            //Filters generation
            List<NameObject> priceList;
            List<NameObject> lengthsList;

            return View("~/Views/All_Packages/All_Packages.cshtml", model);
        }
    }
}
