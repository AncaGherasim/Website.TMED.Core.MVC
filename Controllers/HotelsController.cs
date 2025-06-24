using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MVC_TMED.Infrastructure;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using MVC_TMED.Models;
using MVC_TMED.Models.ViewModels;
using System.Data;
using System.Text.Json;
using static MVC_TMED.Models.ViewModels.HotelsViewModel;
using System.Text;

namespace MVC_TMED.Controllers
{
    public class HotelsController : Controller
    {
        private readonly AppSettings _appSettings;
        private readonly DapperWrap _dapperWrap;
        public HotelsController(IOptions<AppSettings> appSettings, DapperWrap dapperWrap)
        {
            _appSettings = appSettings.Value;
            _dapperWrap = dapperWrap;
        }

        [HttpGet("/{country}/{city}/Hotels", Name = "Hotels_Route")]   //Amsterdam/Hotels
        [HttpHead("/{country}/{city}/Hotels", Name = "Hotels_Route")]   //Amsterdam/Hotels
        [HttpPost("/{country}/{city}/Hotels", Name = "Hotels_Route")]   //Amsterdam/Hotels
        public async Task<IActionResult> Index(string country, string city)
        {
            HttpContext.Response.Headers.Add("_utPg", "HOTonPLC");
            List<HotelsSummaryNew> hotsum;
            List<HotelsSummaryNew> listReview = new List<HotelsSummaryNew>();
            MVC_TMED.Models.ViewModels.HotelsViewModel hotelvm = new HotelsViewModel();
            var result1 = await _dapperWrap.GetRecords<PlaceInfoByName>(SqlCalls.SQL_GetPlaceInfoByName(city));
            hotelvm.hotelInfo = result1.ToList();

            var jsonResult = await _dapperWrap.pgJsonGetRecordsAsync<HotelsByPlaceID_PG>(PostgresCalls.PG_Func_Hotelsbyplaceid(), 4, new { PlaceId = hotelvm.hotelInfo.First().plcID });
            if (string.IsNullOrWhiteSpace(jsonResult))
            {
                return NotFound();
            }
            HotelsByPlaceID_PG resultObject = JsonSerializer.Deserialize<HotelsByPlaceID_PG>(jsonResult);
            hotelvm.allHotels = resultObject;

            var reviews = hotelvm.allHotels.list_reviews.OrderByDescending(x => x.ghs_finalscore).GroupBy(z => z.ghs_finalscore);
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
            hotelvm.strReview = strReview;

            var cylat = new List<double>();
            var cylon = new List<double>();
            foreach (var hotel in hotelvm.allHotels.hotels)
            {
                cylat.Add(Convert.ToDouble(hotel.giphlatitude));
                cylon.Add(Convert.ToDouble(hotel.giphlongitude));
            }
            var maxLat = cylat.Max();
            var minLat = cylat.Min();
            var maxLon = cylon.Max();
            var minLon = cylon.Min();
            var midLat = ((maxLat - minLat) / 2) + minLat;
            var midLon = ((maxLon - minLon) / 2) + minLon;
            var distLats = HotelsByPlaceID_PG.getDistanceFromLatLonInKm(maxLat, maxLon, minLat, minLon);
            hotelvm.ctyLatLong = $"{midLat}|{midLon}";

            var pgTitle = "Hotels in " + hotelvm.hotelInfo.First().plcNA + " | Best " + hotelvm.hotelInfo.First().plcNA + " hotels | Tripmasters";
            string pageMetaDesc = "Hotels in " + hotelvm.hotelInfo.First().plcNA + ": the best " + hotelvm.hotelInfo.First().plcNA + " hotels with flexible options for booking.";
            string pageMetaKey = "Europe vacations, European tours, Europe tour packages, vacation packages, to Europe, hotel deals, online booking, pricing, information, hotel travel, hotel, resort, accommodations, Europe, France, Paris, England, London, Netherlands, Italy, Spain";
            ViewBag.pageMetaDesc = pageMetaDesc;
            ViewBag.pageMetaKey = pageMetaKey;
            ViewBag.PageTitle = pgTitle;
            ViewBag.tmpagetype = "hotels";
            ViewBag.tmpagetypeinstance = "";
            ViewBag.tmrowid = "";
            ViewBag.tmadstatus = "";
            ViewBag.tmregion = "europe";
            ViewBag.tmcountry = country;
            ViewBag.tmdestination = city;

            return View("Hotels", hotelvm);

        }
    }
}
