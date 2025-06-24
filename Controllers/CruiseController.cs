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


namespace MVC_TMED.Controllers
{
    public class CruiseController : Controller
    {
        private readonly AppSettings _appSettings;
        private readonly DapperWrap _dapperWrap;

        public CruiseController(IOptions<AppSettings> appSettings, DapperWrap dapperWrap)
        {
            _appSettings = appSettings.Value;
            _dapperWrap = dapperWrap;
        }

        [HttpGet("{country}/cruise", Name = "Cruise_Route")] //australia/cruise  
        [HttpHead("{country}/cruise", Name = "Cruise_Route")] //australia/cruise  
        [HttpPost("{country}/cruise", Name = "Cruise_Route")] //australia/cruise  
        public async Task<IActionResult> Index(string country)
        {
            HttpContext.Response.Headers.Add("_utPg", "CRUS");

            MVC_TMED.Models.ViewModels.CruiseViewModel cruisevm = new CruiseViewModel();
            cruisevm.PlaceName = country;
            var result1 = await _dapperWrap.GetRecords<PlacesHierarchy>(SqlCalls.SQL_Vacations_Places_Hierarchy(country));
            cruisevm.PlaceID = result1.ToList().First().STR_PlaceID;

            var result2 = await _dapperWrap.GetRecords<CruisePacks>(SqlCalls.SQL_CruisePacks(cruisevm.PlaceID.ToString()));
            cruisevm.listNoFilterCruise = result2.ToList();
            cruisevm.listAllCruise = cruisevm.listNoFilterCruise.FindAll(x => x.SPD_StarRatingSysCode == 1266);
            cruisevm.TotalAllCruise = cruisevm.listAllCruise.Count;

            var result3 = await _dapperWrap.GetRecords<NameObject>(SqlCalls.SQL_CruiseInterestContent(cruisevm.PlaceID.ToString()));
            cruisevm.intContent = result3.ToList().First().Name;

            if (Utilities.CheckMobileDevice() == false)
            {
                ViewBag.Mobile = 0;
            }
            else
            {
                ViewBag.Mobile = 1;
            }
            return View("Cruise", cruisevm);
        }

        [HttpPost("ImagForProducts")] 
        public async Task<IActionResult> ImagForProducts([FromBody] CruisePics_Params cruisePics_Params) //Name, Ship, Imag0
        {
            ViewBag.ProdID = cruisePics_Params.Name.Replace("anchor", "");
            ViewBag.ShipNa = cruisePics_Params.Ship;
            ViewBag.img0 = cruisePics_Params.Imag0;

            var result1 = await _dapperWrap.GetRecords<CruisePicsPackage>(SqlCalls.SQL_CruisePicsForPack(cruisePics_Params.Name.Replace("anchor", "")));
            ViewBag.dvpicProd = result1.ToList();

            ViewBag.TotaldvpicProd = ViewBag.dvpicProd.Count;

            string imageArray = "<script>" + "\r\n" + "var picture=new Array();" + "\r\n" + "var picname=new Array();" + "\r\n" + "var num=0;" + "\r\n";
            for (Int32 i = 0; i <= ViewBag.TotaldvpicProd - 1; i++) {
                imageArray = imageArray + "picture[" + i + "]='https://pictures.tripmasters.com" + ViewBag.dvpicProd[i].IMG_Path_URL + "';" + "\r\n";
                imageArray = imageArray + "picture[" + i + "]='https://pictures.tripmasters.com" + ViewBag.dvpicProd[i].IMG_Title + "';" + "\r\n";
            }
            imageArray = imageArray + "</script>" + "\r\n";
            ViewBag.imageArray = imageArray;

            return View("CruiseImages");
        }

        [HttpPost("CruiseInfo")]
        public async Task<IActionResult> CruiseInfo([FromBody] CruiseInfo_Params cruiseInfo_Params) //PackID, PlaceID, PgType
        {
            ViewBag.PageType = cruiseInfo_Params.PgType;
            var result1 = await _dapperWrap.GetRecords<NameObject>(SqlCalls.SQL_CruiseName(cruiseInfo_Params.PlaceID));
            ViewBag.PlaceName = result1.ToList().First().Name;

            var result2 = await _dapperWrap.GetRecords<CruisePackInfo>(SqlCalls.SQL_CruisePackInfo(cruiseInfo_Params.PackID.ToString()));
            ViewBag.dvPackInfo = result2.ToList();
            ViewBag.TotalPackInfo = ViewBag.dvPackInfo.Count;

            var result3 = await _dapperWrap.GetRecords<CruisePackRelated>(SqlCalls.SQL_CruiseRelatedPacks(cruiseInfo_Params.PackID.ToString()));
            ViewBag.dvRelPack = result3.ToList();
            ViewBag.TotRelPack = ViewBag.dvRelPack.Count;

            ViewBag.TotPCustFeed = 0;

            return View("CruiseInfo");
        }
    }
}
