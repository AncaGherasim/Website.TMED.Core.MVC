using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MVC_TMED.Infrastructure;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using MVC_TMED.Models.ViewModels;
using MVC_TMED.Models;
using System.Text;

namespace MVC_TMED.Controllers
{
    public class ActivitiesController : Controller
    {
        private readonly AppSettings _appSettings;
        private readonly DapperWrap _dapperWrap;

        public ActivitiesController(IOptions<AppSettings> appSettings, DapperWrap dapperWrap)
        {
            _appSettings = appSettings.Value;
            _dapperWrap = dapperWrap;
        }
        [HttpGet("/{country}/{city}/Activities", Name = "Activities_Route")] //www.tripmasters.com/latin/Costa_Rica/Arenal_Volcano/activities
        [HttpHead("/{country}/{city}/Activities", Name = "Activities_Route")] //www.tripmasters.com/latin/Costa_Rica/Arenal_Volcano/activities
        [HttpPost("/{country}/{city}/Activities", Name = "Activities_Route")] //www.tripmasters.com/latin/Costa_Rica/Arenal_Volcano/activities
        public async Task<IActionResult> Index(string city, string country)
        {
            ActivitiesViewModel activitiesViewModel = new ActivitiesViewModel();
            //Get Place Info
            var result1 = await _dapperWrap.GetRecords<PlaceInfo_By_PlaceName>(SqlCalls.SQL_PlaceInfo_By_PlaceName(city));
            activitiesViewModel.placeInfo = result1.ToList();

            ViewBag.PageType = "Activities";
            ViewBag.PageTitle = "Things to do in " + activitiesViewModel.placeInfo.FirstOrDefault().STR_PlaceTitle + " | Best " + activitiesViewModel.placeInfo.FirstOrDefault().STR_PlaceTitle + " activities | Tripmasters";
            ViewBag.pageMetaDesc = "Things to do in " + activitiesViewModel.placeInfo.FirstOrDefault().STR_PlaceTitle + ", the best of " + activitiesViewModel.placeInfo.FirstOrDefault().STR_PlaceTitle + "'s activities. Most-seen attractions and sightseeing tours " + activitiesViewModel.placeInfo.FirstOrDefault().STR_PlaceTitle + ", " + activitiesViewModel.placeInfo.FirstOrDefault().CountryNA;
            ViewBag.tmpagetype = "activities";
            ViewBag.tmpagetypeinstance = "";
            ViewBag.tmrowid = "";
            ViewBag.tmadstatus = "";
            ViewBag.tmregion = "europe";
            ViewBag.tmcountry = country;
            ViewBag.tmdestination = city;

            //Get CMS for Place
            var result2 = await _dapperWrap.GetRecords<CityCMS>(SqlCalls.SQL_CityCMS(activitiesViewModel.placeInfo.FirstOrDefault().STR_PlaceID.ToString()));
            activitiesViewModel.cityCMS = result2.ToList();

            //Get Featured Itineraries by Place
            var result3 = await _dapperWrap.GetRecords<CityFeaturedItineraries>(SqlCalls.SQL_City_FeaturedItineraries(activitiesViewModel.placeInfo.FirstOrDefault().STRID.ToString()));
            List<CityFeaturedItineraries> featPackList = result3.ToList();

            activitiesViewModel.featuredItineraries = featPackList.Where(x => x.SPPW_Weight < 999).ToList();
            if (activitiesViewModel.featuredItineraries.Count < 4)
            {
                activitiesViewModel.featuredItineraries = featPackList.Where(x => x.SPPW_Weight < 9).ToList();
            }

            //Get Display Content by Place
            var result4 = await _dapperWrap.GetRecords<PlaceDisplayContent>(SqlCalls.SQL_PlaceDisplayContent(activitiesViewModel.placeInfo.FirstOrDefault().STRID.ToString(), 1619));
            activitiesViewModel.displayContents = result4.ToList();

            //Get All Activities Types
            var result5 = await _dapperWrap.GetRecords<ActivitiesType>(SqlCalls.SQL_ActivitiesType(activitiesViewModel.placeInfo.FirstOrDefault().STR_PlaceID.ToString()));
            List<ActivitiesType> ssType = result5.ToList();
            StringBuilder ssIds_builder_ = new StringBuilder();
            foreach (var dr in ssType)
            {
                ssIds_builder_.Append(dr.SSId + "I");
            }
            activitiesViewModel.ssIds = ssIds_builder_.ToString();
            if (activitiesViewModel.ssIds != "")
            {
                activitiesViewModel.ssIds = activitiesViewModel.ssIds.Substring(0, activitiesViewModel.ssIds.Length - 1);
            }

            activitiesViewModel.activitiesType = ssType.GroupBy(x => x.Name, (key, g) => g.Select(x => x).First()).OrderBy(x => x.Name).ToList();

            return View("Activities", activitiesViewModel);
        }

    }
}