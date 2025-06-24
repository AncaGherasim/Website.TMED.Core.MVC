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
using System.Xml;
using System.Xml.Linq;


namespace MVC_TMED.Controllers
{
    public class HotelController : Controller
    {
        private readonly AppSettings _appSettings;
        private readonly DapperWrap _dapperWrap;

        public HotelController(IOptions<AppSettings> appSettings, DapperWrap dapperWrap)
        {
            _appSettings = appSettings.Value;
            _dapperWrap = dapperWrap;
        }

        [HttpGet("{country}/{city}/{title}/hotel-{id}", Name = "Hotel_Route")] //Costa_Rica/Arenal_Vocano/El_Silencio_del_Campo/hotel-123308
        [HttpHead("{country}/{city}/{title}/hotel-{id}", Name = "Hotel_Route")] //Costa_Rica/Arenal_Vocano/El_Silencio_del_Campo/hotel-123308
        [HttpPost("{country}/{city}/{title}/hotel-{id}", Name = "Hotel_Route")] //Costa_Rica/Arenal_Vocano/El_Silencio_del_Campo/hotel-123308
        public async Task<IActionResult> Index(string country, string city, string title, string id)
        {
            HttpContext.Response.Headers.Add("_utPg", "HOT");

            MVC_TMED.Models.ViewModels.HotelViewModel hotelvm = new HotelViewModel();
            List<HotelInfo> dvthisHot = new List<HotelInfo>();
            List<HotelFacilities> dvthisFac = new List<HotelFacilities>();
            List<HotelRoomCategories> dvthisRoom = new List<HotelRoomCategories>();
            ViewBag.hotID = id;
            ViewBag.cityNA = city;

            //Get Place Info
            var result0 = await _dapperWrap.GetRecords<PlaceInfo_By_PlaceName>(SqlCalls.SQL_PlaceInfo_By_PlaceName(city));
            if (result0.ToList().Count == 0)
            {
                return NotFound();
            }
            hotelvm.couName = result0.ToList()[0].CountryNA;
            hotelvm.SPD_StatePlaceID = result0.ToList()[0].STRID.ToString();
            hotelvm.STR_PlaceID = result0.ToList()[0].STR_PlaceID.ToString();

            var result1 = await _dapperWrap.GetRecords<HotelInfo>(SqlCalls.SQL_HotelInfoFromController(), new { hotelID = id });
            dvthisHot = result1.ToList();
            if (dvthisHot.Count == 0)
            {
                return NotFound();
            }
            hotelvm.hotNa = dvthisHot[0].Name;
            hotelvm.plcNA = dvthisHot[0].PLC_Title;
            hotelvm.STR_PlaceTitle = dvthisHot[0].STR_PlaceTitle;


            var types = new Type[] { typeof(HotelFacilities), typeof(HotelRoomCategories), typeof(HotelInfo) };
            var results = await _dapperWrap.GetMultipleRecords(SqlCalls.SQL_HotelFacilities() + @";" + SqlCalls.SQL_HotelRoomCategories() + @";" + SqlCalls.SQL_HotelOneImages() + @";", 4, new { hotelID = id }, types);
            var count = 1;
            foreach (var resultSet in results)
            {
                switch (count)
                {
                    case 1:
                        dvthisFac = ((List<object>)resultSet).Cast<HotelFacilities>().ToList();
                        break;
                    case 2:
                        dvthisRoom = ((List<object>)resultSet).Cast<HotelRoomCategories>().ToList();
                        break;
                    case 3:
                        hotelvm.imageHotel = ((List<object>)resultSet).Cast<HotelInfo>().FirstOrDefault().IMG_Path_URL;
                        break;
                    default:
                        break;
                }
                count++;
            }

            string pgTitle = hotelvm.hotNa + " in " + dvthisHot[0].STR_PlaceTitle + ", " + hotelvm.couName + " | Tripmasters Hotels";
            string pageMetaDesc = "Book the "+ hotelvm.hotNa + " in "+ dvthisHot[0].STR_PlaceTitle + ", "+ hotelvm.couName + " and get great deals.";
            string pageMetaKey = "Europe vacations, European tours, Europe tour packages, vacation packages, to Europe, hotel deals, online booking, pricing, information, hotel travel, hotel, resort, accommodations, Europe, France, Paris, England, London, Netherlands, Italy, Spain";
            ViewBag.PageTitle = pgTitle;
            ViewBag.pageMetaDesc = pageMetaDesc;
            ViewBag.pageMetaKey = pageMetaKey;
            ViewBag.viewUsedName = "Hotel";
            ViewBag.tmpagetype = "hotel";
            ViewBag.tmpagetypeinstance = "";
            ViewBag.tmrowid = "";
            ViewBag.tmadstatus = "";
            ViewBag.tmregion = "europe";
            ViewBag.tmcountry = country;
            ViewBag.tmdestination = city;

            hotelvm.hotelInfo = dvthisHot.First<HotelInfo>();
            switch (hotelvm.hotelInfo.GHS_FinalScore)
            {
                case decimal n when (n >= 4.5m && n <= 5):
                    hotelvm.clsNA = "EX";
                    hotelvm.solNA = "Excellent";
                    break;
                case decimal n when (n >= 4 && n <= 4.49m):
                    hotelvm.clsNA = "VG";
                    hotelvm.solNA = "Very Good";
                    break;
                case decimal n when (n >= 3.5m && n <= 3.99m):
                    hotelvm.clsNA = "GD";
                    hotelvm.solNA = "Good";
                    break;
                case decimal n when (n >= 3 && n <= 3.49m):
                    hotelvm.clsNA = "FR";
                    hotelvm.solNA = "Fair";
                    break;
                case decimal n when (n >= 0 && n <= 2.99m):
                    hotelvm.clsNA = "PO";
                    hotelvm.solNA = "Poor";
                    break;
            }
            hotelvm.facilitiesTypes = dvthisFac.Select(x => new NameObject { Id = x.FacilityType, Name = x.FacilityStrType }).Distinct(new NamedObjectComparer()).OrderBy(h => h.Name).ToList();
            hotelvm.facilities = dvthisFac.Select(x => new NameObject { Id = x.FacilityType, Name = x.FacilityName }).ToList();

            hotelvm.dvCat = dvthisRoom;

            if ((hotelvm.hotelInfo.GIPH_TNContentSource.EndsWith("tournet content") || hotelvm.hotelInfo.GIPH_TNUseTournetContent) 
                && (hotelvm.hotelInfo.GIPH_AddressLine1 ?? "").Trim() == "" && (hotelvm.hotelInfo.GIPH_AddressLine2 ?? "").Trim() == "" && (hotelvm.hotelInfo.GIPH_AddressLine3 ?? "").Trim() == "")
            {
                hotelvm.hotelInfo.HotelAddress = hotelvm.hotelInfo.PTY_Address ?? "";
            }
            else
            {
                hotelvm.hotelInfo.HotelAddress = (hotelvm.hotelInfo.GIPH_AddressLine1 ?? "").Trim() + ((hotelvm.hotelInfo.GIPH_AddressLine2 is null) ? "" : ", " + hotelvm.hotelInfo.GIPH_AddressLine2.Trim()) + ((hotelvm.hotelInfo.GIPH_AddressLine3 is null) ? "" : ", " + hotelvm.hotelInfo.GIPH_AddressLine3.Trim()) + ((hotelvm.hotelInfo.GIPH_AddressLine4 is null) ? "" : ", " + hotelvm.hotelInfo.GIPH_AddressLine4.Trim()) + ((hotelvm.hotelInfo.GIPH_AddressLine5 is null) ? "" : ", " + hotelvm.hotelInfo.GIPH_AddressLine5.Trim()) + ((hotelvm.hotelInfo.GIPH_AddressLine6 is null) ? "" : ", " + hotelvm.hotelInfo.GIPH_AddressLine6.Trim());
            }

            hotelvm.hotelInfo.HotelDescription = "";
            hotelvm.hotelInfo.RoomDescr = "";
            if (hotelvm.hotelInfo.GIPH_TNContentSource == "giata/giata content" && !hotelvm.hotelInfo.GIPH_TNUseTournetContent)
            {
                hotelvm.hotelInfo.HotelDescription = (hotelvm.hotelInfo.GHGT_Text100 ?? "") + "</br></br>" + (hotelvm.hotelInfo.GHGT_Text101 ?? "");
                hotelvm.hotelInfo.RoomDescr = hotelvm.hotelInfo.GHGT_Text102 ?? "";
            }
            else
            {
                XDocument xmlDoc = XDocument.Parse(hotelvm.hotelInfo.GIPH_TNTournetContent);
                XElement node1Element = xmlDoc.Descendants("Property").FirstOrDefault();
                if (node1Element is not null)
                {
                    if (node1Element.Element("Description") is not null) { hotelvm.hotelInfo.HotelDescription = node1Element.Element("Description").Value; }
                    if (node1Element.Element("RoomDesc") is not null) { hotelvm.hotelInfo.RoomDescr = node1Element.Element("RoomDesc").Value; }
                }
            }

            if (Utilities.CheckMobileDevice() == false)
            {
                ViewBag.Mobile = 0;
            }
            else
            {
                ViewBag.Mobile = 1;
            }
            return View("Hotel", hotelvm);
        }
    }
}
