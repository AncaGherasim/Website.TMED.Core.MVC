using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MVC_TMED.Infrastructure;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using MVC_TMED.Models.ViewModels;
using MVC_TMED.Models;
using Dapper;
using System.Diagnostics.Metrics;
using System;

namespace MVC_TMED.Controllers
{
    public class TripsTakenController : Controller
    {
        private readonly AppSettings _appSettings;
        private readonly DapperWrap _dapperWrap;
        private readonly AWSParameterStoreService _awsParameterStoreService;

        public TripsTakenController(IOptions<AppSettings> appSettings, DapperWrap dapperWrap, AWSParameterStoreService awsParameterStoreService)
        {
            _appSettings = appSettings.Value;
            _dapperWrap = dapperWrap;
            _awsParameterStoreService = awsParameterStoreService;
        }

        [HttpGet("{countryname}/Trips_Taken_By_Travelers", Name = "TripsTaken_Route")]
        [HttpHead("{countryname}/Trips_Taken_By_Travelers", Name = "TripsTaken_Route")]
        [HttpPost("{countryname}/Trips_Taken_By_Travelers", Name = "TripsTaken_Route")]
        public async Task<IActionResult> Index(string countryname)
        {
            HttpContext.Response.Headers.Add("_utPg", "TKBY");

            TripsTakenViewModel tripstakenViewModel = new TripsTakenViewModel();
            Int32 currentUser_ID = Int32.Parse(_appSettings.ApplicationSettings.userID);
            string division = _appSettings.ApplicationSettings.SiteName;
            //Get Place Info
            var result1 = await _dapperWrap.GetRecords<PlaceInfo_By_PlaceName_TripsTaken>(SqlCalls.SQL_PlaceInfo_By_PlaceName_TripsTaken(countryname));
            tripstakenViewModel.placeInfo = result1.ToList();

            if (tripstakenViewModel.placeInfo.Count == 0)
            {
                return NotFound();
            }
            if (tripstakenViewModel.placeInfo.Count == 1)
            {
                division = tripstakenViewModel.placeInfo.First().STR_UserID == 243 ? "/europe" : tripstakenViewModel.placeInfo.First().STR_UserID == 182 ? "/latin" : tripstakenViewModel.placeInfo.First().STR_UserID == 595 ? "/asia" : _appSettings.ApplicationSettings.SiteName;
            }
            else
            {
                if (tripstakenViewModel.placeInfo.Where(x => x.STR_PlacePriority == 1).Count() > 0)
                {
                    if (tripstakenViewModel.placeInfo.Where(x => x.STR_PlacePriority == 1 && x.STR_UserID == currentUser_ID).Count() == 0)
                    {
                        int Priority1STR_UserID = tripstakenViewModel.placeInfo.Where(x => x.STR_PlacePriority == 1).First().STR_UserID;
                        division = Priority1STR_UserID == 243 ? "/europe" : Priority1STR_UserID == 182 ? "/latin" : Priority1STR_UserID == 595 ? "/asia" : _appSettings.ApplicationSettings.SiteName;
                    }
                }
            }

            if (division != _appSettings.ApplicationSettings.SiteName && _appSettings.ApplicationSettings.SiteName != "")
            {
                return RedirectPermanent(division + "/" + countryname + "/trips_taken_by_travelers");
            }
            if (tripstakenViewModel.placeInfo.FirstOrDefault().CountryNA == "none")
            {
                tripstakenViewModel.CountryName = tripstakenViewModel.placeInfo.FirstOrDefault().STR_PlaceTitle;
                tripstakenViewModel.CountryId = tripstakenViewModel.placeInfo.FirstOrDefault().STR_PlaceID;
                tripstakenViewModel.NoCountryId = -1;
            }
            else
            {
                tripstakenViewModel.CountryName = tripstakenViewModel.placeInfo.FirstOrDefault().CountryNA;
                tripstakenViewModel.CountryId = tripstakenViewModel.placeInfo.FirstOrDefault().CountryID;
                tripstakenViewModel.NoCountryId = tripstakenViewModel.placeInfo.FirstOrDefault().STR_PlaceID;
            }

            tripstakenViewModel.destination = Utilities.UppercaseFirstLetter(countryname.Replace("_", " "));

            if (Utilities.CheckMobileDevice() == false)
            {
                //Best Sellers
                var result2 = await _dapperWrap.GetRecords<BestSeller>(SqlCalls.SQL_BestSellers());
                tripstakenViewModel.packs = result2.ToList();

                //Country Most Popular Packages
                var result3 = await _dapperWrap.GetRecords<PackOnInterestPriority>(SqlCalls.SQL_Country_Top3MostPopularPackages(tripstakenViewModel.CountryId.ToString()));
                tripstakenViewModel.topPacks = result3.ToList();

                //Country Highlights
                var result4 = await _dapperWrap.GetRecords<PlaceHighlight>(SqlCalls.SQL_PlaceHighlights(tripstakenViewModel.CountryId.ToString(), "1623"));
                tripstakenViewModel.countryHighlights = result4.ToList();

                //Country Places from travel
                var result5 = await _dapperWrap.GetRecords<Country_PlacesFromTravel>(SqlCalls.SQL_PlaceHighlights(tripstakenViewModel.CountryId.ToString()));
                List<Country_PlacesFromTravel> dvCities = result5.ToList();
                if (dvCities.Count > 0)
                {
                    tripstakenViewModel.citiesFromCountry = dvCities.Where(x => x.CountryId == tripstakenViewModel.CountryId).ToList();
                    tripstakenViewModel.citiesRankLessThan5 = dvCities.Where(x => x.Rank < 3).ToList();
                }

                //MODIFY OR REMOVE/ADD DINAMICALLY Title and meta on Master Page
                string pageTitle = tripstakenViewModel.destination + " - trips taken by previous travelers | Feedbacks " + tripstakenViewModel.destination + " Travel trips | Tripmasters";
                tripstakenViewModel.pageMetaDesc = tripstakenViewModel.destination + " Trips- Browse past itineraries, read travelers reviews, feedbacks, and customize your own trip. Book today and save!";
                tripstakenViewModel.pageMetaKey = tripstakenViewModel.destination + " travel, " + tripstakenViewModel.destination + " travelers, " + tripstakenViewModel.destination + " vacations, online booking, pricing, information, hotel travel, recommendations, resort, accommodations, Europe";
                var Result6 = await _dapperWrap.GetRecords<Place_Info>(SqlCalls.SQL_Place_Info(tripstakenViewModel.CountryId.ToString()));
                List<Place_Info> dvDAT = Result6.ToList();
                //if (dvDAT.Count > 0)
                //{
                //    pageTitle = dvDAT[0].SEO_PageTitle ?? pageTitle;
                //    tripstakenViewModel.pageMetaDesc = dvDAT[0].SEO_MetaDescription ?? tripstakenViewModel.pageMetaDesc;
                //    tripstakenViewModel.pageMetaKey = dvDAT[0].SEO_MetaKeyword ?? tripstakenViewModel.pageMetaKey;
                //}
                //--- MODIFY ---
                //????????????????
                ViewBag.PageTitle = pageTitle;
                ViewBag.pageMetaDesc = tripstakenViewModel.pageMetaDesc;
                ViewBag.pageMetaKey = tripstakenViewModel.pageMetaKey;
                ViewBag.tmpagetype = "tripstaken";
                ViewBag.tmpagetypeinstance = "";
                ViewBag.tmrowid = "";
                ViewBag.tmadstatus = "";
                ViewBag.tmregion = "europe";
                ViewBag.tmcountry = "";
                ViewBag.tmdestination = countryname;

                return View("TripsTaken", tripstakenViewModel);
            }
            else
            {
                //Best Sellers
                var result2 = await _dapperWrap.GetRecords<BestSeller>(SqlCalls.SQL_BestSellers());
                tripstakenViewModel.packs = result2.ToList();

                //Country Most Popular Packages
                var result3 = await _dapperWrap.GetRecords<PackOnInterestPriority>(SqlCalls.SQL_Country_Top3MostPopularPackages(tripstakenViewModel.CountryId.ToString()));
                tripstakenViewModel.topPacks = result3.ToList();

                //Country Highlights
                var result4 = await _dapperWrap.GetRecords<PlaceHighlight>(SqlCalls.SQL_PlaceHighlights(tripstakenViewModel.CountryId.ToString(), "1623"));
                tripstakenViewModel.countryHighlights = result4.ToList();

                //MODIFY OR REMOVE/ADD DINAMICALLY Title and meta on Master Page
                string pageTitle = tripstakenViewModel.destination + " - trips taken to " + tripstakenViewModel.destination + " by previous travelers | Tripmasters";
                tripstakenViewModel.pageMetaDesc = tripstakenViewModel.destination + " Trips- Browse past itineraries, read traveler feedbacks, and customize your own trip. Book today and save!";
                tripstakenViewModel.pageMetaKey = tripstakenViewModel.destination + " travel, " + tripstakenViewModel.destination + " travelers, " + tripstakenViewModel.destination + " vacations, online booking, pricing, information, hotel travel, recommendations, resort, accommodations, Europe";
                var Result6 = await _dapperWrap.GetRecords<Place_Info>(SqlCalls.SQL_Place_Info(tripstakenViewModel.CountryId.ToString()));
                List<Place_Info> dvDAT = Result6.ToList();
                //if (dvDAT.Count > 0)
                //{
                //    pageTitle = dvDAT[0].SEO_PageTitle ?? pageTitle;
                //    tripstakenViewModel.pageMetaDesc = dvDAT[0].SEO_MetaDescription ?? tripstakenViewModel.pageMetaDesc;
                //    tripstakenViewModel.pageMetaKey = dvDAT[0].SEO_MetaKeyword ?? tripstakenViewModel.pageMetaKey;
                //}
                //--- MODIFY ---
                //????????????????
                ViewBag.PageTitle = pageTitle;
                ViewBag.pageMetaDesc = tripstakenViewModel.pageMetaDesc;
                ViewBag.pageMetaKey = tripstakenViewModel.pageMetaKey;
                ViewBag.tmpagetype = "tripstaken";
                ViewBag.tmpagetypeinstance = "";
                ViewBag.tmrowid = "";
                ViewBag.tmadstatus = "";
                ViewBag.tmregion = "europe";
                ViewBag.tmcountry = "";
                ViewBag.tmdestination = countryname;

                return View("Tripstaken_Mob", tripstakenViewModel);
            }
        }


        //[HttpGet("/package/GetCustFeed/{tabType}/{page}/{id}", Name = "CustFeed_Route")]
        //public IActionResult GetCustFeed(string tabType, Int32 page, string id)
        //{
        //    IDbConnection dbConn = new SqlConnection(_appSettings.ConnectionStrings.sqlConnStr);
        //    List<CustomerFeedback> ListCustFeed = dbConn.Query<CustomerFeedback>(SqlCalls.SQL_CustomerFeedbacks_By_Page(tabType, page, id)).ToList();

        //    return View("Get_CustomerFeedBackPage", ListCustFeed);
        //}
        [HttpPost("TripsTakenCustomerFeedbacks")]
        public async Task<IActionResult> GET_TripsTakenCustomerFeedbacks([FromBody] SSData sSData)
        {
            List<TripsTakenCustomerFeedback> dvFeeds = new List<TripsTakenCustomerFeedback>();
            var result = await _dapperWrap.GetRecords<TripsTakenCustomerFeedback>(SqlCalls.SQL_TripsTakenCustomerFeedbacksSorted(sSData.SSFilter, sSData.Ids));
            dvFeeds = result.ToList();

            List<TripsTakenFeedback> tripsTaken = dvFeeds.Select(x => new TripsTakenFeedback { PCC_Comment = x.PCC_Comment, PCC_CustomerName = x.PCC_CustomerName, PCC_Itinerary = x.PCC_Itinerary, PCCID = x.PCCID }).ToList().Distinct(new TripsTakenFeedbackComparer()).ToList();
            foreach (var t in tripsTaken)
            {
                string tripTakenId = t.PCCID;
                string countryName_ = dvFeeds.Where(x => x.PCCID == tripTakenId && x.STR_PlaceTypeID == 5).Select(y => y.STR_PlaceTitle).ToList().FirstOrDefault();
                t.Package = dvFeeds.Where(x => x.PCCID == tripTakenId).Select(x => new PackOnInterestPriority { PDLID = x.PDLID, PDL_Title = x.PDL_Title, STP_Save = x.STP_Save, NoOfFeed = x.NoOfFeed, CountryName = countryName_ }).ToList();
                t.Places = dvFeeds.Where(x => x.PCCID == tripTakenId).Select(x => new Place { Id = x.STR_PlaceID, Name = x.STR_PlaceTitle, PlaceType = x.STR_PlaceTypeID }).ToList();
            }

            return View("GET_TripsTakenFreeds", tripsTaken); ;
        }
    }
}
