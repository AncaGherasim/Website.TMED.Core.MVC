using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using MVC_TMED.Infrastructure;
using System.Data;
using MVC_TMED.Models.ViewModels;
using MVC_TMED.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Hosting;
using System.Text.RegularExpressions;
using static MVC_TMED.Models.ViewModels.ToursViewModel;
using System.Globalization;

namespace MVC_TMED.Controllers
{
    public class ToursController : Controller
    {

        private readonly IOptions<AppSettings> _appSettings;
        private readonly DapperWrap _dapperWrap;
        private readonly IWebHostEnvironment _webHostEnvironment;
        private readonly AWSParameterStoreService _awsParameterStoreService;
        private readonly CachedDataService _cachedDataService;
        public ToursController(IOptions<AppSettings> appSettings, DapperWrap dapperWrap, IWebHostEnvironment webHostEnvironment, AWSParameterStoreService awsParameterStoreService, CachedDataService cachedDataService)
        {
            _appSettings = appSettings;
            _dapperWrap = dapperWrap;
            _webHostEnvironment = webHostEnvironment;
            _awsParameterStoreService = awsParameterStoreService;
            _cachedDataService = cachedDataService;
        }

        [HttpGet("{country}/tours", Name = "Tours")]
        [HttpGet("{country}/trips", Name = "Trips")]
        [HttpGet("{country}/holidays", Name = "Holidays")]
        [HttpGet("{country}/travel", Name = "Travel")]
        [HttpGet("{country}/visit", Name = "Visit")]
        [HttpHead("{country}/tours", Name = "Tours")]
        [HttpHead("{country}/trips", Name = "Trips")]
        [HttpHead("{country}/holidays", Name = "Holidays")]
        [HttpHead("{country}/travel", Name = "Travel")]
        [HttpHead("{country}/visit", Name = "Visit")]
        [HttpPost("{country}/tours", Name = "Tours")]
        [HttpPost("{country}/trips", Name = "Trips")]
        [HttpPost("{country}/holidays", Name = "Holidays")]
        [HttpPost("{country}/travel", Name = "Travel")]
        [HttpPost("{country}/visit", Name = "Visit")]
        public async Task<IActionResult> Index(string country)
        {
            string ViewName = "";
            country = country.Replace(".", "");
            ToursViewModel toursViewModel = new ToursViewModel();
            List<PlacesHierarchy> placesHierarchies;
            List<EachCity> objCitiesOn;
            string nameCountry = CultureInfo.CurrentCulture.TextInfo.ToTitleCase(country.ToLower());
            toursViewModel.UserID = 243;
            toursViewModel.allItineraries = 0;

            toursViewModel.imageCountryPath = "https://pictures.tripmasters.com/images/web/ed/places/";
            var Result1 = await _dapperWrap.GetRecords<PlacesHierarchy>(SqlCalls.SQL_Vacations_Places_Hierarchy(country));
            placesHierarchies = Result1.ToList();
            toursViewModel.placeNA = placesHierarchies[0].STR_PlaceTitle;
            toursViewModel.placeID = placesHierarchies[0].STR_PlaceID;
            toursViewModel.placeShortInfo = placesHierarchies[0].STR_PlaceShortInfo;

            var result2 = await _dapperWrap.GetRecords<EachCity>(SqlCalls.SQL_CitiesOnCountrySEO(toursViewModel.placeID.ToString()));
            objCitiesOn = result2.ToList();
            //latin
            toursViewModel.listCitiesOn = objCitiesOn.FindAll(x => x.STR_PlaceAIID < 15).Take(8).ToList();
            toursViewModel.listCities = objCitiesOn.FindAll(x => x.STR_PlaceAIID < 15).ToList();
            toursViewModel.listCitiesMore = objCitiesOn.FindAll(x => x.STR_PlaceAIID > 14).ToList();

            // europe and asia
            //
            //    toursViewModel.listCitiesOn = objCitiesOn.FindAll(x => x.STR_PlaceAIID < 15).Take(8).ToList();
            //    toursViewModel.listCities = objCitiesOn.FindAll(x => x.STR_PlaceAIID < 15).ToList();
            //    toursViewModel.listCitiesMore = objCitiesOn.FindAll(x => x.STR_PlaceAIID > 14).ToList();
            //

            if (ControllerContext.ActionDescriptor.AttributeRouteInfo.Name.ToLower() == "trips")
            {
                var result3 = await _dapperWrap.GetRecords<weightItinCountry>(SqlCalls.SQL_TripsItinByPlaceID(toursViewModel.placeID.ToString()));
                toursViewModel.objItineraries = result3.ToList();
            }
            else
            {
                var result3 = await _dapperWrap.GetRecords<weightItinCountry>(SqlCalls.SQL_ToursItinByPlaceID(toursViewModel.placeID.ToString()));
                toursViewModel.objItineraries = result3.ToList();
            }

            toursViewModel.bulletList = toursViewModel.objItineraries.FindAll(x => x.NoOfCountries == 1).Take(4).ToList();

            toursViewModel.listFeatured = toursViewModel.objItineraries.FindAll(x => x.NoOfCountries == 1).Take(1).ToList();
            if (toursViewModel.listFeatured.Count > 0)
            {
                toursViewModel.otherFeatured = toursViewModel.objItineraries.FindAll(x => x.NoOfCountries == 1).Skip(1).Take(4).ToList();
                toursViewModel.otherFeatured1 = toursViewModel.objItineraries.FindAll(x => x.NoOfCountries == 1).Skip(1).Take(2).ToList();
                toursViewModel.otherFeatured2 = toursViewModel.objItineraries.FindAll(x => x.NoOfCountries == 1).Skip(3).Take(2).ToList();
                toursViewModel.suggestedItin = toursViewModel.objItineraries.FindAll(x => x.NoOfCountries == 1).Skip(4).Take(8).ToList();
                toursViewModel.moreItin = toursViewModel.objItineraries.FindAll(x => x.NoOfCountries > 1).ToList();
                toursViewModel.moreItinHolidays = toursViewModel.objItineraries.FindAll(x => x.NoOfCountries > 1).Take(9).ToList();
                toursViewModel.bestPackages = toursViewModel.objItineraries.FindAll(x => x.NoOfCountries == 1).Take(4).ToList();

            }
            else
            {
                toursViewModel.listFeatured = toursViewModel.objItineraries.FindAll(x => x.NoOfCountries == 2).Take(1).ToList();
                toursViewModel.otherFeatured = toursViewModel.objItineraries.FindAll(x => x.NoOfCountries == 2).Skip(1).Take(4).ToList();
                toursViewModel.otherFeatured1 = toursViewModel.objItineraries.FindAll(x => x.NoOfCountries == 2).Skip(1).Take(2).ToList();
                toursViewModel.otherFeatured2 = toursViewModel.objItineraries.FindAll(x => x.NoOfCountries == 2).Skip(3).Take(2).ToList();
                toursViewModel.suggestedItin = toursViewModel.objItineraries.FindAll(x => x.NoOfCountries == 2).Skip(4).Take(8).ToList();
                toursViewModel.moreItin = toursViewModel.objItineraries.FindAll(x => x.NoOfCountries > 2).ToList();
                toursViewModel.moreItinHolidays = toursViewModel.objItineraries.FindAll(x => x.NoOfCountries > 2).Take(9).ToList();
                toursViewModel.bestPackages = toursViewModel.objItineraries.FindAll(x => x.NoOfCountries == 2).Take(4).ToList();

            }
            var first = toursViewModel.objItineraries.FindAll(x => x.NoOfCountries > 0).Take(1).ToList();
            var iC = 0;
            foreach (var d in first)
            {
                if (iC < first.Count - 1) { toursViewModel.packid = toursViewModel.packid + "'" + d.PDLID + "', "; } else { toursViewModel.packid = toursViewModel.packid + "'" + d.PDLID + "'"; };
                iC++;
            };

            if (ControllerContext.ActionDescriptor.AttributeRouteInfo.Name.ToLower() == "tours")
            {
                //var result4 = await _dapperWrap.GetRecords<TopSellersPackFeedback>(SqlCalls.SQL_SEOFeedCommentsByPlaceID(toursViewModel.placeID.ToString()));
                //toursViewModel.listReviews = result4.ToList();
            }
            else
            {
                var result4 = await _dapperWrap.GetRecords<TopSellersPackFeedback>(SqlCalls.SQL_FeedCommentsByPlaceID(toursViewModel.placeID.ToString()));
                toursViewModel.listReviews = result4.ToList();
            }

            var result5 = await _dapperWrap.GetRecords<NumberofCustomerFeedbacks>(SqlCalls.SQL_Get_NumberofCustomerFeedbacks_OverAllScore());
            List<NumberofCustomerFeedbacks> overAllReviews = result5.ToList();
            Int32 NumComments = 0;
            Decimal overAllAvg = 0;
            if (overAllReviews.Count > 0)
            {
                NumComments = overAllReviews[0].NumComments;
                toursViewModel.Score = overAllReviews[0].Score;
                overAllAvg = Decimal.Round(toursViewModel.Score, 1);
            }
            var result6 = await _dapperWrap.GetRecords<CountryFeedback>(SqlCalls.SQL_CustomerFeedbacks_For_CountriesC(toursViewModel.placeID.ToString()));
            List<CountryFeedback> CountriesFeeds = result6.ToList();
            if (CountriesFeeds.Count > 0)
            {
                toursViewModel.packFeedCountC = CountriesFeeds[0].NoOfFeedbacks;
            }
            else
            {
                toursViewModel.packFeedCountC = 0;
            }

            //ViewBag.PageTitle = country + " Tours | Best " + country + " Tours | Tripmasters";
            //ViewBag.MetaDescription = country + " Tours, best tours to " + country + ", book your " + country + " vacation with Tripmasters. Build " + country + " vacations packages to visit " + country;
            //ViewBag.MetaKeywords = "Europe, Vacation, Travel, Tours, Packages, " + country;
            //if (Utilities.CheckMobileDevice() == false)
            //{
            //    ViewName = "~/Views/Tours/Tours.cshtml";
            //}
            //else
            //{
            //    ViewName = "ToursMob";
            //}

            if (ControllerContext.ActionDescriptor.AttributeRouteInfo.Name.ToLower() == "tours")
            {
                var actionDescriptor = ControllerContext.ActionDescriptor;
                var routeName = actionDescriptor.AttributeRouteInfo.Name;
                var routeTemplate = actionDescriptor.AttributeRouteInfo.Template;
                var route = HttpContext.Request.Path.Value;

                ViewBag.PageTitle = nameCountry + " Tours | Best " + nameCountry + " Tours | Tripmasters";
                ViewBag.pageMetaDesc = "Tour Package " + nameCountry + ", best tours to " + nameCountry + ", book your " + nameCountry + " tour with Tripmasters. Build tour " + nameCountry + " packages to visit " + nameCountry + ". Top " + nameCountry + " Tours and Packages";
                ViewBag.pageMetaKey = "Europe, Vacation, Travel, Tours, Packages,Top tours " + nameCountry; 
                ViewBag.tmpagetype = "tours";
                ViewBag.tmpagetypeinstance = "";
                ViewBag.tmrowid = "";
                ViewBag.tmadstatus = "";
                ViewBag.tmregion = "europe";
                ViewBag.tmcountry = "";
                ViewBag.tmdestination = nameCountry;

                ViewName = "~/Views/Tours/Tours_DM.cshtml";
            }
            else if (ControllerContext.ActionDescriptor.AttributeRouteInfo.Name.ToLower() == "trips")
            {
                ViewBag.PageTitle = "Trips to " + nameCountry + " | Best Trips to " + nameCountry + " | Tripmasters";
                ViewBag.pageMetaDesc = "Trips to " + nameCountry + " , best trips to " + nameCountry + ", book your " + nameCountry + " vacation with Tripmasters. Build " + nameCountry + " vacations packages to visit " + nameCountry;
                ViewBag.pageMetaKey = "Europe, Vacation, Travel, Tours, Packages, Trips " + nameCountry;

                string plsIDs = String.Join("", toursViewModel.objItineraries.Select(x => x.PDL_Places).ToArray()).Trim();
                if (plsIDs.EndsWith(","))
                {
                    plsIDs = plsIDs.Substring(0, plsIDs.Count() - 1);
                }
                List<CombineCoun> objCombineCoun = new List<CombineCoun>();
                var result7 = await _dapperWrap.GetRecords<CombineCoun>(SqlCalls.SQL_PlacesFromSTR(plsIDs));
                objCombineCoun = result7.ToList();
                objCombineCoun = objCombineCoun.FindAll(x => x.CouNA != country).ToList();
                objCombineCoun = objCombineCoun.OrderByDescending(p => p.CouNA).ToList();
                toursViewModel.listCombineCou = objCombineCoun;

                var result8 = await _dapperWrap.GetRecords<CMSCountry>(SqlCalls.SQL_PlaceCMSByplaceID(toursViewModel.placeID.ToString()));
                toursViewModel.listCMS = result8.ToList();


                ViewName = "~/Views/Trips/Trips_DM.cshtml";


            }
            else if (ControllerContext.ActionDescriptor.AttributeRouteInfo.Name.ToLower() == "holidays")
            {
                if (toursViewModel.listFeatured.Count > 0)
                {
                    toursViewModel.suggestedItin = toursViewModel.objItineraries.FindAll(x => x.NoOfCountries == 1).Skip(5).Take(9).ToList();
                }
                else
                {
                    toursViewModel.suggestedItin = toursViewModel.objItineraries.FindAll(x => x.NoOfCountries == 2).Skip(5).Take(9).ToList();
                }
                ViewBag.PageTitle = " Holidays in " + nameCountry + " | Tripmasters";
                ViewBag.pageMetaDesc = " Holidays in " + ", celebrate Christmas or New Year's Eve, Easter or any holiday traveling to " + nameCountry + ". Build your holiday trip with us.";

                ViewName = "~/Views/Holidays/Holidays_DM.cshtml";

            }
            else if (ControllerContext.ActionDescriptor.AttributeRouteInfo.Name.ToLower() == "travel")
            {
                if (toursViewModel.listFeatured.Count > 0)
                {
                    toursViewModel.suggestedItin = toursViewModel.objItineraries.FindAll(x => x.NoOfCountries == 1).Skip(5).Take(9).ToList();
                }
                else
                {
                    toursViewModel.suggestedItin = toursViewModel.objItineraries.FindAll(x => x.NoOfCountries == 2).Skip(5).Take(9).ToList();
                }

                List<PackInfo> packinfo = new List<PackInfo>();
                var Result9 = await _dapperWrap.GetRecords<PackInfo>(SqlCalls.SQL_PackageInformation(toursViewModel.packid));

                packinfo = Result9.ToList();
                if (packinfo.Count == 0)
                {
                    return NotFound();
                }

                toursViewModel.packNA = packinfo.First().PDL_Title;
                toursViewModel.packNoNts = packinfo.First().STP_NumOfNights;
                if (toursViewModel.packNoNts == 0)
                    toursViewModel.packNoNts = packinfo.First().PDL_Duration;
                toursViewModel.packPrice = packinfo.First().STP_Save;
                if (toursViewModel.packPrice != null)
                    toursViewModel.packPriceD = Decimal.Parse(toursViewModel.packPrice);
                toursViewModel.packDepartureNA = packinfo.First().PLC_Title;
                toursViewModel.packKinds = packinfo.First().SPD_InternalComments;
                toursViewModel.packType = packinfo.First().SPD_StarRatingSysCode;
                toursViewModel.packInterestON = packinfo.First().SPD_Features;
                toursViewModel.packSamplePrice = packinfo.First().STP_MiniTitle ?? "";
                toursViewModel.packStartTravel = packinfo.First().STP_StartTravelDate;
                toursViewModel.packIncluded = packinfo.First().PDL_Content;
                toursViewModel.packCountryNA = packinfo.First().STR_PlaceTitle;
                toursViewModel.packCountryID = packinfo.First().STR_PlaceID;
                toursViewModel.packCityNA = packinfo.First().CityNA;
                toursViewModel.packCityID = packinfo.First().CityID;
                toursViewModel.packDescription = packinfo.First().SPD_Description;
                toursViewModel.packSpecialCode = packinfo.First().PDL_SpecialCode;
                toursViewModel.packDayXday = packinfo.First().PDL_Description;
                toursViewModel.packAccomoda = packinfo.First().PDL_Notes;
                toursViewModel.packDistances = packinfo.First().PDL_Description;
                toursViewModel.packProdID = packinfo.First().PDL_ProductID;
                toursViewModel.packCityEID = packinfo.First().CityEID;
                toursViewModel.packCityENA = packinfo.First().CityENA;
                toursViewModel.ntsString = toursViewModel.GetNights();

                ViewBag.PageTitle = nameCountry + " Travel | Best " + nameCountry + " Travel | Tripmasters";
                ViewBag.pageMetaDesc = nameCountry + " Travel, best travel to " + nameCountry + ", book your " + nameCountry + " vacation with Tripmasters. Build " + nameCountry + " vacations packages to visit " + nameCountry;
                ViewBag.pageMetaKey = "Europe, Vacation, Travel, Tours, Packages, " + nameCountry;

                var result10 = await _dapperWrap.GetRecords<CMSCountry>(SqlCalls.SQL_PlaceCMSByplaceID(toursViewModel.placeID.ToString()));
                toursViewModel.listCMS = result10.ToList();

                toursViewModel.FaqList.Add(new FaqQR() { FaqQuestion = "none", FaqResponse = "none" });

                foreach (var cms in toursViewModel.listCMS)
                {
                    string hrefURL = "";
                    if (cms.CMS_Description != "none")
                    {
                        if (Regex.IsMatch(cms.CMS_Description, "FAQ", RegexOptions.IgnoreCase))
                            toursViewModel.cmsfaqID = cms.CMSW_RelatedCmsID;
                    }
                    else
                    {
                        if (Regex.IsMatch(cms.CMSW_Title, "FAQ", RegexOptions.IgnoreCase))
                            toursViewModel.cmsfaqID = cms.CMSW_RelatedCmsID;
                    }

                }
                if (toursViewModel.cmsfaqID > 0)
                {
                    toursViewModel.FaqList.Clear();
                    MVC_TMED.API.PackagesController packagesController = new API.PackagesController(this._appSettings, this._dapperWrap, this._cachedDataService);


                    toursViewModel.FaqList = packagesController.SqlFaqCms(toursViewModel.cmsfaqID).Result.ToList();


                }

                ViewName = "~/Views/Travel/Travel_DM.cshtml";

            }
            else
            {
                List<CountryHighlights> objCountryMostVisited = new List<CountryHighlights>();
                var result11 = await _dapperWrap.GetRecords<CountryHighlights>(SqlCalls.SQL_CountryHighlights(toursViewModel.placeID.ToString()));
                objCountryMostVisited = result11.ToList();
                if (objCountryMostVisited.Count() > 0)
                {
                    toursViewModel.listCountryHighlights = objCountryMostVisited.FindAll(x => x.STX_ProdKindID != 1624).ToList();
                }
                var result12 = await _dapperWrap.GetRecords<CustomerReviewVisit>(SqlCalls.SQL_CustomerFeedbackByPlaceIDVisit(toursViewModel.placeID.ToString()));
                toursViewModel.listReviewsVisit = result12.ToList();

                toursViewModel.listItineraries = toursViewModel.objItineraries.FindAll(x => x.NoOfCountries == 1).Take(1).ToList();
                if (toursViewModel.listItineraries.Count > 0)
                {
                    toursViewModel.listMoreItin = toursViewModel.objItineraries.FindAll(x => x.NoOfCountries == 1).Take(8).ToList();
                    toursViewModel.listCombine = toursViewModel.objItineraries.FindAll(x => x.NoOfCountries > 1).Take(9).ToList();
                }

                ViewBag.PageTitle = "Visit " + nameCountry + " | " + nameCountry + " Vacations | Tripmasters";
                ViewBag.pageMetaDesc = "Visit " + nameCountry + " building your own " + nameCountry + " Vacation Package combining multiple cities, and book it in minutes.";
                ViewBag.pageMetaKey = "Europe, Travel, Tours, Packages, " + nameCountry;

                ViewName = "~/Views/Visit/Visit.cshtml";

            }

            return View(ViewName, toursViewModel);
        }
    }
}

