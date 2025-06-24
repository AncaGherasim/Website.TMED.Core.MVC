using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using MVC_TMED.Models;
using MVC_TMED.Infrastructure;
using Microsoft.AspNetCore.Hosting;
using MVC_TMED.Controllers.VacationTemplates;
using System.Text.RegularExpressions;


namespace MVC_TMED.Controllers
{
    public class VacationsController : Controller
    {
        private readonly IOptions<AppSettings> _appSettings;
        private readonly DapperWrap _dapperWrap;
        private readonly IWebHostEnvironment _hostingEnvironment;
        private readonly AWSParameterStoreService _awsParameterStoreService;
        private readonly CachedDataService _cachedDataService;
        public IWebHostEnvironment Env { get; }
        public VacationsController(IOptions<AppSettings> appsettings, DapperWrap dapperWrap, IWebHostEnvironment hostingEnvironment, AWSParameterStoreService awsParameterStoreService, CachedDataService cachedDataService)
        {
            _appSettings = appsettings;
            _dapperWrap = dapperWrap;
            _hostingEnvironment = hostingEnvironment;
            _awsParameterStoreService = awsParameterStoreService;
            _cachedDataService = cachedDataService;
        }
        [TypeFilter(typeof(CheckCacheFilter))]
        [AcceptVerbs("GET", "HEAD", "POST")]
        [Route("{placeName}/vacations", Name = "Vacation_Route")]
        [Route("{placeName}/vacation-packages", Name = "VacationPack_Route")]
        public async Task<IActionResult> IndexAsync(string placeName)
        {
            var request = HttpContext.Request;
            var path = request.Path.Value?.ToLower();
            string division = _appSettings.Value.ApplicationSettings.SiteName;
            if (placeName == "portugal" && path.EndsWith("/vacations"))
            {
                var scheme = request.Scheme;
                var host = request.Host.Value;
                var queryString = request.QueryString.Value;
                var newPath = path.Replace("/vacations", "/vacation-packages");
                var newUrl = $"{division}{newPath}{queryString}";
                //return Content($"Value: {newUrl}");
                return RedirectPermanent(newUrl);
            }

            string CityRegCou;
            CityRegCou = placeName;

            List<PlacesHierarchy> placesHierarchies = new List<PlacesHierarchy>();
            var plcHierarchy = await _dapperWrap.GetRecords<PlacesHierarchy>(SqlCalls.SQL_Vacations_Places_Hierarchy_Priority(CityRegCou));
            placesHierarchies = plcHierarchy.ToList();
            if (placesHierarchies.Count == 0)
            {
                return NotFound();
            }
            Int32 currentUser_ID = Int32.Parse(_appSettings.Value.ApplicationSettings.userID);

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
                    case "Vacation_Route":
                        return RedirectPermanent(division + "/" + placeName + "/vacations");
                    case "VacationPack_Route":
                        return RedirectPermanent(division + "/" + placeName + "/vacation-packages");
                    default:
                        // code block
                        break;
                }
            }
            string placeType = "";
            string pageTemplate = "";
            PlacesHierarchy currentPlacesHierarchy = placesHierarchies.Where(x => x.STR_UserID == currentUser_ID).First();
            if (currentPlacesHierarchy.STR_PlacePriority == 1)
            {
                switch (currentPlacesHierarchy.STR_PlaceTypeID)
                {
                    case 1:
                    case 25:
                        {
                            if (!new string[] { "Vacation_Route", "VacationPack_Route" }.Contains(ControllerContext.ActionDescriptor.AttributeRouteInfo.Name))
                            {
                                return new NotFoundResult();
                            }
                            HttpContext.Response.Headers.Add("_utPg", "CTY");
                            HttpContext.Response.Headers.Add("plcID", currentPlacesHierarchy.STR_PlaceID.ToString());
                            placeType = "City";
                            if (currentPlacesHierarchy.STR_PageTemplate.IndexOf("GP3") > 0)
                            {
                                var initClass = new GP3CityClass(_dapperWrap, _appSettings, Env);
                                var model = await initClass.GP3_City(currentPlacesHierarchy.STR_PlaceID);
                                ViewBag.PageTitle = model.pageTitle;
                                ViewBag.pageMetaDesc = model.pageMetaDesc;
                                ViewBag.pageMetaKey = model.pageMetaKey;
                                ViewBag.image = model.image;
                                ViewBag.viewUsedName = "GP3_City";
                                ViewBag.tmpagetype = "city";
                                ViewBag.tmpagetypeinstance = "gp3";
                                ViewBag.tmrowid = "";
                                ViewBag.tmadstatus = "";
                                ViewBag.tmregion = "europe";
                                ViewBag.tmcountry = "";
                                ViewBag.tmdestination = placeName.Replace("_", " ");

                                if (Utilities.CheckMobileDevice() == false)
                                {
                                    return View("~/Views/GP3_City/GP3_City.cshtml", model);
                                }
                                else
                                {
                                    return View("~/Views/GP3_City/GP3_City_Mob.cshtml", model);
                                }
                            }
                            else if (currentPlacesHierarchy.STR_PageTemplate.IndexOf("GP2") > 0)
                            {
                                var initClass = new GP2CityClass(_dapperWrap, _appSettings);
                                var model = await initClass.GP2_City(CityRegCou);
                                ViewBag.PageTitle = model.pageTitle;
                                ViewBag.pageMetaDesc = model.pageMetaDesc;
                                ViewBag.pageMetaKey = model.pageMetaKey;
                                ViewBag.viewUsedName = "GP2_City";
                                ViewBag.tmpagetype = "city";
                                ViewBag.tmpagetypeinstance = "gp2";
                                ViewBag.tmrowid = "";
                                ViewBag.tmadstatus = "";
                                ViewBag.tmregion = "europe";
                                ViewBag.tmcountry = "";
                                ViewBag.tmdestination = placeName.Replace("_", " ");

                                if (Utilities.CheckMobileDevice() == false)
                                {
                                    return View("~/Views/GP2_City/GP2_City.cshtml", model);
                                }
                                else
                                {
                                    return View("~/Views/GP2_City/GP2_City_Mob.cshtml", model);
                                }
                            }
                            else
                            {
                                pageTemplate = "GP";
                            }
                            break;
                        }
                    case 5:
                        {
                            if (!new string[] { "Vacation_Route", "VacationPack_Route" }.Contains(ControllerContext.ActionDescriptor.AttributeRouteInfo.Name))
                            {
                                return new NotFoundResult();
                            }
                            HttpContext.Response.Headers.Add("_utPg", "COU");
                            HttpContext.Response.Headers.Add("plcID", currentPlacesHierarchy.STR_PlaceID.ToString());
                            var urlpath = HttpContext.Request.Path.Value.Split("/");
                            switch (currentPlacesHierarchy.STR_PageTemplate)
                            {
                                case "T3":
                                    {
                                        pageTemplate = "T3";
                                        break;
                                    }
                                case "T4":
                                    {
                                        var initClass = new CountryT4Class(_dapperWrap, _appSettings, _awsParameterStoreService, _cachedDataService);
                                        var model = await initClass.Country_T4(placeName, currentPlacesHierarchy.STR_PlaceID, currentPlacesHierarchy.STRID);
                                        ViewBag.PageTitle = model.pageTitle;
                                        ViewBag.pageMetaDesc = model.pageMetaDesc;
                                        ViewBag.pageMetaKey = model.pageMetaKey;
                                        ViewBag.image = model.image;
                                        ViewBag.viewUsedName = "Country_T4";
                                        ViewBag.tmpagetype = "country";
                                        ViewBag.tmpagetypeinstance = "t4";
                                        ViewBag.tmrowid = "";
                                        ViewBag.tmadstatus = "";
                                        ViewBag.tmregion = "europe";
                                        ViewBag.tmcountry = "";
                                        ViewBag.tmdestination = placeName.Replace("_", " ");
                                        //pageTemplate = "T4";
                                        return View("~/Views/Country_T4/Country_T4.cshtml", model);
                                    }
                                case "T5":
                                    {
                                        var initClass = new CountryT5Class(_dapperWrap, _appSettings, _awsParameterStoreService, _cachedDataService);
                                        var model = await initClass.Country_T5(placeName, currentPlacesHierarchy.STR_PlaceID, currentPlacesHierarchy.STRID, currentPlacesHierarchy.STR_PlaceExtra);
                                        ViewBag.PageTitle = model.pageTitle;
                                        ViewBag.pageMetaDesc = model.pageMetaDesc;
                                        ViewBag.pageMetaKey = model.pageMetaKey;
                                        ViewBag.image = model.image;
                                        ViewBag.viewUsedName = "Country_T5";
                                        ViewBag.tmpagetype = "country";
                                        ViewBag.tmpagetypeinstance = "t5";
                                        ViewBag.tmrowid = "";
                                        ViewBag.tmadstatus = "";
                                        ViewBag.tmregion = "europe";
                                        ViewBag.tmcountry = "";
                                        ViewBag.tmdestination = placeName.Replace("_", " ");

                                        return View("~/Views/Country_T5/Country_T5.cshtml", model);
                                    }
                            }
                            break;
                        }
                    case 28:
                        {
                            return RedirectPermanent(division + "/" + placeName + "/multicountry/vacations");

                        }
                    case 6:
                        {
                            return RedirectPermanent(division + "/" + placeName + "/area/vacations");
                        }
                }
            }
            else if (currentPlacesHierarchy.STR_PlacePriority == 2)
            {
                var initClass = new GP3_SecondaryDestinationClass(_dapperWrap);
                var model = await initClass.GP3_SecondaryDestination(CityRegCou);
                ViewBag.PageTitle = model.pageTitle;
                ViewBag.pageMetaDesc = model.pageMetaDesc;
                ViewBag.pageMetaKey = model.pageMetaKey;
                ViewBag.viewUsedName = "GP3_SecondaryDestination";
                ViewBag.tmpagetype = "secondary";
                ViewBag.tmpagetypeinstance = "gp3";
                ViewBag.tmrowid = "";
                ViewBag.tmadstatus = "";
                ViewBag.tmregion = "europe";
                ViewBag.tmcountry = "";
                ViewBag.tmdestination = placeName.Replace("_", " ");

                return View("~/Views/GP3_SecondaryDestination/GP3_SecondaryDestination.cshtml", model);
            }
            return BadRequest();
        }
    }
}
