using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using MVC_TMED.Infrastructure;
using MVC_TMED.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace MVC_TMED.Controllers
{
    public class HotelsMapController : Controller
    {
        private readonly AppSettings _appSettings;
        private readonly DapperWrap _dapperWrap;
        public HotelsMapController(IOptions<AppSettings> appSettings, DapperWrap dapperWrap)
        {
            _appSettings = appSettings.Value;
            _dapperWrap = dapperWrap;
        }

        [HttpGet("/{country}/{city}/HotelsMap", Name = "HotelsMap_Route")]
        [HttpHead("/{country}/{city}/HotelsMap", Name = "HotelsMap_Route")]
        [HttpPost("/{country}/{city}/HotelsMap", Name = "HotelsMap_Route")]
        public async Task<IActionResult> Index(string city, string country)
        {
            Models.ViewModels.HotelsMapViewModel viewModelTemplate = new Models.ViewModels.HotelsMapViewModel();
            //viewModelTemplate.plcID = plcID;
            //viewModelTemplate.plcNA = plcNA;
            //viewModelTemplate.couID = couID;
            //viewModelTemplate.couNA = couNA;

            ViewBag.tmpagetype = "hotelsmap";
            ViewBag.tmpagetypeinstance = "";
            ViewBag.tmrowid = "";
            ViewBag.tmadstatus = "";
            ViewBag.tmregion = "europe";
            ViewBag.tmcountry = country;
            ViewBag.tmdestination = city;

            var result1 = await _dapperWrap.GetRecords<PlaceInfoByName>(SqlCalls.SQL_GetPlaceInfoByName(city));
            viewModelTemplate.hotelInfo = result1.ToList();
            viewModelTemplate.plcNA = viewModelTemplate.hotelInfo.FirstOrDefault().plcNA;

            var jsonResult = await _dapperWrap.pgJsonGetRecordsAsync<HotelsByPlaceID_PG>(PostgresCalls.PG_Func_Hotelsbyplaceid(true), 4, new { PlaceId = viewModelTemplate.hotelInfo.FirstOrDefault().plcID });
            if (string.IsNullOrWhiteSpace(jsonResult))
            {
                return NotFound();
            }
            HotelsByPlaceID_PG resultObject = JsonSerializer.Deserialize<HotelsByPlaceID_PG>(jsonResult);
            viewModelTemplate.allHotels = resultObject;

            List<ListOfAllHotels> listCityZones = viewModelTemplate.allHotels.hotels.Select(x => new ListOfAllHotels { CityZone = x.cityzone, GIPH_TNZoneID = x.giph_tnzoneid }).OrderBy(y => y.CityZone).ToList();
            var _listCityZones = listCityZones.GroupBy(z => z.CityZone);
            foreach (var c in _listCityZones)
            {
                viewModelTemplate.listCityZones.Add(new ListCityZones { cityzone = c.Key, giph_tnzoneid = c.First().GIPH_TNZoneID });
            }

            foreach (var d in viewModelTemplate.allHotels.list_ratings)
            {
                viewModelTemplate.listRatings.Add(new ListRatings { giph_tntournetrating = d.giph_tntournetrating, CountRat = d.CountRat });
            }

            var reviews = viewModelTemplate.allHotels.list_reviews.OrderByDescending(x => x.ghs_finalscore).GroupBy(z => z.ghs_finalscore);
            StringBuilder strReview = new StringBuilder();
            List<Tuple<string, string, string>> listRev = new List<Tuple<string, string, string>>();
            strReview.Append("");
            foreach (var rev in reviews)
            {
                if (rev.Key >= 4.5m && rev.Key <= 5)
                {
                    if (strReview.ToString().IndexOf("Excellent") < 0)
                    {
                        strReview.Append("Excellent");
                    }
                }
                if (rev.Key >= 4 && rev.Key <= 4.49m)
                {
                    if (strReview.ToString().IndexOf("Very") < 0)
                    {
                        strReview.Append("|Very");
                    }
                }
                if (rev.Key >= 3.5m && rev.Key <= 3.99m)
                {
                    if (strReview.ToString().IndexOf("Good") < 0)
                    {
                        strReview.Append("|Good");
                    }
                }
                if (rev.Key >= 3 && rev.Key <= 3.49m)
                {
                    if (strReview.ToString().IndexOf("Fair") < 0)
                    {
                        strReview.Append("|Fair");
                    }
                }
                if (rev.Key >= 0 && rev.Key <= 2.99m)
                {
                    if (strReview.ToString().IndexOf("Poor") < 0)
                    {
                        strReview.Append("|Poor");
                    }
                }
            }
            viewModelTemplate.strReview = strReview;

            var pgTitle = "Hotels Map " + viewModelTemplate.hotelInfo.FirstOrDefault().plcNA + " | Tripmasters";
            string pageMetaDesc = "Hotels in " + viewModelTemplate.hotelInfo.FirstOrDefault().plcNA + ": the best hotels in " + viewModelTemplate.hotelInfo.FirstOrDefault().plcNA;
            string pageMetaKey = "Europe vacations, European tours, Europe tour packages, vacation packages, to Europe, hotel deals, online booking, pricing, information, hotel travel, hotel, resort, accommodations, Europe, France, Paris, England, London, Netherlands, Italy, Spain";

            ViewBag.pageMetaDesc = pageMetaDesc;
            ViewBag.pageMetaKey = pageMetaKey;
            ViewBag.PageTitle = pgTitle;
            return View("HotelsMap", viewModelTemplate);

        }
    }
}
