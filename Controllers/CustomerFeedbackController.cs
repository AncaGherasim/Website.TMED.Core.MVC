using System;
using System.Linq;
using System.Threading.Tasks;
using MVC_TMED.Models;
using MVC_TMED.Models.ViewModels;
using MVC_TMED.Infrastructure;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace MVC_TMED.Controllers
{
    public class CustomerFeedbackController : Controller
    {
        private readonly AppSettings _appSettings;
        private readonly DapperWrap _dapperWrap;
        private readonly AWSParameterStoreService _awsParameterStoreService;

        public CustomerFeedbackController(IOptions<AppSettings> appsettings, DapperWrap dapperWrap, AWSParameterStoreService awsParameterStoreService)
        {
            _appSettings = appsettings.Value;
            _dapperWrap = dapperWrap;
            _awsParameterStoreService = awsParameterStoreService;
        }

        [HttpGet("{country}/{pack}/feedback-{id}", Name = "Feedback_Route")]////{site}/{countryName}/{Title}/feedback-{Id}
        [HttpHead("{country}/{pack}/feedback-{id}", Name = "Feedback_Route")]////{site}/{countryName}/{Title}/feedback-{Id}
        [HttpPost("{country}/{pack}/feedback-{id}", Name = "Feedback_Route")]////{site}/{countryName}/{Title}/feedback-{Id}
        public async Task<IActionResult> Index(string country, string pack, int id)
        {
            CustomerFeedbackViewModel viewModel = new CustomerFeedbackViewModel();

            var result1 = await _dapperWrap.GetRecords<PackMediumInfo>(SqlCalls.SQL_PackageMediumInformation(id));
            viewModel.packInfo = result1.ToList();
            if (viewModel.packInfo.Count == 0)
            {
                return NotFound();
            }

            string division = _appSettings.ApplicationSettings.SiteName == "" ? "" : viewModel.packInfo.First().SPD_InternalComments.Contains(":.ED") ? "/europe" : viewModel.packInfo.First().SPD_InternalComments.Contains(":LD") ? "/latin" : viewModel.packInfo.First().SPD_InternalComments.Contains(":.TW") ? "/asia" : _appSettings.ApplicationSettings.SiteName;
            if (country.Replace(" ", "_").ToLower() != (viewModel.packInfo.First().CountryName ?? country).Replace(" ", "_").ToLower() || pack.Replace(" ", "_").ToLower() != viewModel.packInfo.First().PDL_Title.Replace(" ", "_").ToLower() || division != _appSettings.ApplicationSettings.SiteName)
            {
                return RedirectPermanent(division + "/" + (viewModel.packInfo.First().CountryName ?? country).Replace(" ", "_").ToLower() + "/" + viewModel.packInfo.First().PDL_Title.Replace(" ", "_").ToLower() + "/feedback-" + id);
            }

            var result2 = await _dapperWrap.GetRecords<BestSeller>(SqlCalls.SQL_BestSellers());
            viewModel.bestSell = result2.ToList();

            var result3 = await _dapperWrap.GetRecords<PlaceNames>(SqlCalls.SQL_PlaceNames(viewModel.packInfo.FirstOrDefault().PDL_Places.Substring(0, viewModel.packInfo.FirstOrDefault().PDL_Places.Length - 1)));
            viewModel.placeNames = result3.ToList();

            var result4 = await _dapperWrap.GetRecords<PlaceHighlight>(SqlCalls.SQL_PlaceHighlights(viewModel.packInfo.FirstOrDefault().CountryId.ToString(), "1619,1621,1623"));
            viewModel.placeHighlights = result4.ToList();

            var result5 = await _dapperWrap.GetRecords<PackOnInterestPriority>(SqlCalls.SQL_Country_Top3MostPopularPackages(viewModel.packInfo.FirstOrDefault().CountryId.ToString()));
            viewModel.mostPop = result5.ToList();

            var result6 = await _dapperWrap.GetRecords<NameObject>(SqlCalls.SQL_Get_NumberOfPackageFeedbacks_Per_OverAllScore(viewModel.packInfo.FirstOrDefault().PDLID));
            viewModel.scores = result6.ToList();

            string cities = "";
            foreach (var c in viewModel.placeNames.Where(x => x.PlaceType == 25 || x.PlaceType == 1))
            {
                cities = cities + c.Id + ",";
            }
            if (cities.Length >= 1)
            {
                cities = cities.Substring(0, cities.Length - 1);
            }
            var result7 = await _dapperWrap.GetRecords<SimilarPackages>(SqlCalls.SQL_PackageSimilarPackages(viewModel.packInfo.FirstOrDefault().PDLID, cities, viewModel.packInfo.FirstOrDefault().CountryId));
            viewModel.similarPacks = result7.ToList();
            string Country = Utilities.UppercaseFirstLetter(country.Replace("_", " "));

            string pgTitle = Country + " travel - trips taken to " + Country + " by previous travelers";
            string pageMetaDesc = Country + " Trips- Browse past itineraries, read traveler feedbacks, and customize your own trip. Book today and save!";
            string pageMetaKey = Country + " travel, " + Country + " travelers, " + Country + " vacations, online booking, pricing, information, hotel travel, recommendations, resort, accommodations, Europe";
            ViewBag.PageTitle = pgTitle;
            ViewBag.pageMetaDesc = pageMetaDesc;
            ViewBag.pageMetaKey = pageMetaKey;
            ViewBag.tmpagetype = "customerfeedback";
            ViewBag.tmpagetypeinstance = "";
            ViewBag.tmrowid = "";
            ViewBag.tmadstatus = "";
            ViewBag.tmregion = "europe";
            ViewBag.tmcountry = "";
            ViewBag.tmdestination = "";

            if (Utilities.CheckMobileDevice() == false)
            {
                return View("CustomerFeedback", viewModel);
            }
            else
            {
                return View("CustomerFeedback_Mob", viewModel);
            }
        }

        [HttpPost("/CustomerFeedbacksByPage", Name = "CustomerFeedbacksByPage_Route")]
        public async Task<IActionResult> GetCustomerFeedbacksByPage([FromBody] CustomerFeedbacksByPageParams customerFeedbacksByPage)
        {
            CustomerFeedbackByPageParamsViewModel customerFeedbackByPageParamsViewModel = new CustomerFeedbackByPageParamsViewModel();

            var result1 = await _dapperWrap.GetRecords<CustomerFeedback>(SqlCalls.SQL_CustomerFeedbacksSortedByPage(customerFeedbacksByPage.packId, customerFeedbacksByPage.page, customerFeedbacksByPage.order, customerFeedbacksByPage.rating));
            customerFeedbackByPageParamsViewModel.cfs = result1.ToList();

            var result2 = await _dapperWrap.GetRecords<PlaceNames>(SqlCalls.SQL_PlaceNames(customerFeedbacksByPage.PlacesIDs.Substring(0, customerFeedbacksByPage.PlacesIDs.Length - 1)));
            customerFeedbackByPageParamsViewModel.packPlaces = result2.ToList();

            customerFeedbackByPageParamsViewModel.PDLID = Int32.Parse(customerFeedbacksByPage.packId);
            customerFeedbackByPageParamsViewModel.CountryName = customerFeedbacksByPage.CountryName;
            customerFeedbackByPageParamsViewModel.PDL_Title = customerFeedbacksByPage.PDL_Title;

            return View("Get_CustomerFeedBacksByPage", customerFeedbackByPageParamsViewModel);
        }

    }
}