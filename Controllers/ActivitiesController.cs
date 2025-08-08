using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MVC_TMED.Infrastructure;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using MVC_TMED.Models.ViewModels;
using MVC_TMED.Models;
using System.Text;
using System.Text.Json;

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
            HttpContext.Response.Headers.Add("_utPg", "SS");

            ActivitiesViewModel activitiesViewModel = new ActivitiesViewModel();

            ViewBag.PageType = "Activities";
            ViewBag.tmpagetype = "activities";
            ViewBag.tmpagetypeinstance = "";
            ViewBag.tmrowid = "";
            ViewBag.tmadstatus = "";
            ViewBag.tmregion = "europe";
            ViewBag.tmcountry = country;
            ViewBag.tmdestination = city;

            activitiesViewModel.isMobileDevice = Utilities.CheckMobileDevice();
            var jsonResult = await _dapperWrap.pgJsonGetRecordsAsync<ActivitiesByPlaceID_PG>(
                PostgresCalls.PG_Func_Activitiesbyplaceid(),
                4,
                new { PlaceName = city, UserId = 243, NoPageItems = (activitiesViewModel.isMobileDevice ? 12 : 24) }
            );
            if (string.IsNullOrWhiteSpace(jsonResult))
            {
                return NotFound();
            }
            ActivitiesByPlaceID_PG resultObject = JsonSerializer.Deserialize<ActivitiesByPlaceID_PG>(jsonResult);
            if (resultObject == null)
            {
                return NotFound();
            }
            activitiesViewModel.allActivities = resultObject;

            activitiesViewModel.activitiesType = activitiesViewModel.allActivities.categories != null
                ? activitiesViewModel.allActivities.categories.OrderBy(c => c.name).ToList()
                : new List<ActivitiesType>();

            if (activitiesViewModel.allActivities.place_hierarchy == null || activitiesViewModel.allActivities.place_hierarchy.Count == 0)
            {
                return NotFound();
            }

            ViewBag.PageTitle = "Things to do in " + activitiesViewModel.allActivities.place_hierarchy[0].str_placetitle + " | Best " + activitiesViewModel.allActivities.place_hierarchy[0].str_placetitle + " activities | Tripmasters";
            ViewBag.pageMetaDesc = "Things to do in " + activitiesViewModel.allActivities.place_hierarchy[0].str_placetitle + ", the best of " + activitiesViewModel.allActivities.place_hierarchy[0].str_placetitle + "'s activities. Most-seen attractions and sightseeing tours " + activitiesViewModel.allActivities.place_hierarchy[0].str_placetitle + ", " + activitiesViewModel.allActivities.place_hierarchy[0].countryna;

            return View("Activities", activitiesViewModel);
        }
    }
}