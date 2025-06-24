using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MVC_TMED.Infrastructure;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using MVC_TMED.Models;
using MVC_TMED.Models.ViewModels;
using System.Xml;
using System.Text;
using Dapper;
using System.Data;
using System.Data.SqlClient;

namespace MVC_TMED.Controllers
{
    public class GP_MultiCountryClass
    {
        private readonly IOptions<AppSettings> _appSettings;
        private readonly DapperWrap _dapperWrap;

        public GP_MultiCountryClass(DapperWrap dapperWrap, IOptions<AppSettings> appSettings)
        {
            _appSettings = appSettings;
            _dapperWrap = dapperWrap;
        }

        //[HttpGet("GP_MultiCountry/{MultiCou}", Name = "GP_MultiCountry_Route")]
        public async Task<GP2_MultiCountryViewModel> GP_MultiCou(string MultiCou)
        {
            
            GP2_MultiCountryViewModel gP2_MultiCountryViewModel = new GP2_MultiCountryViewModel();

            gP2_MultiCountryViewModel.multicountryNa = MultiCou;
            List<PlaceInfo_By_PlaceName> dvPlace;
            List<Feedback> dvCustomFeed;
            List<PackOnInterestPriority> dvPackOnCty;
            List<DisplayArea> managerDisplay;
            List<DisplayArea> centerDisplay;
            List<NumberofCustomerFeedbacks> overAllReviews;
            List<weightItin> objItineraries;

            //SQL STRING QUERIES TO RETRIEVE ALL PAGE INFO NEEDED.
            var Result1 = await _dapperWrap.GetRecords<PlaceInfo_By_PlaceName>(SqlCalls.SQL_PlaceInfo_By_PlaceName(MultiCou));
            dvPlace = Result1.ToList();
            if (dvPlace.Count == 0)
            { throw new Exception("Customer Feedbacks by City ID."); }
            gP2_MultiCountryViewModel.multicountryID = dvPlace[0].STRID;
            gP2_MultiCountryViewModel.multicountryDES = dvPlace[0].STR_PlaceShortInfo;
            gP2_MultiCountryViewModel.multicountryNa = dvPlace[0].STR_PlaceTitle;
            gP2_MultiCountryViewModel.multiCountryPLC = dvPlace[0].STR_PlaceID;

            //Packages Priority List
            var Result2 = await _dapperWrap.GetRecords<weightItin>(SqlCalls.SQL_PackOnInterestPriorityList(gP2_MultiCountryViewModel.multicountryID.ToString(), "0"));
            objItineraries = Result2.ToList();
            gP2_MultiCountryViewModel.boxFeaturPacks = objItineraries.FindAll(p => p.SPPW_Weight < 999);
            if (gP2_MultiCountryViewModel.boxFeaturPacks.Count < 4)
            {
                gP2_MultiCountryViewModel.boxFeaturPacks = objItineraries.FindAll(p => p.PDL_SequenceNo < 9);
            }
            foreach (var v in gP2_MultiCountryViewModel.boxFeaturPacks)
            {
                gP2_MultiCountryViewModel.otherFeat = gP2_MultiCountryViewModel.otherFeat + "," + v.PDLID.ToString();
            }
            gP2_MultiCountryViewModel.otherFeat = gP2_MultiCountryViewModel.otherFeat.Substring(1, gP2_MultiCountryViewModel.otherFeat.Length - 1);
            //var first3 = objItineraries.Take(3).ToList();
            //var packid3 = "";
            //var iC = 0;
            //foreach (var d in first3)
            //{
            //    if (iC < first3.Count - 1) { packid3 = packid3 + "'" + d.PDLID + "', "; } else { packid3 = packid3 + "'" + d.PDLID + "'"; };
            //    iC++;
            //};


            //CONTENT LIKE MANAGER SELECTION
            var Result3 = await _dapperWrap.GetRecords<DisplayArea>(SqlCalls.SQL_ManagerDisplayArea(gP2_MultiCountryViewModel.multiCountryPLC));
            List<DisplayArea> dvCustDly = Result3.ToList();
            gP2_MultiCountryViewModel.leftDisplay = dvCustDly.FindAll(c => c.SDP_DisplayProdKindID == 1877).ToList();
            //centerDisplay = managerDisplay.FindAll(c => c.SDP_DisplayProdKindID == 1878).ToList();

            //Boxes Content
            var Result4 = await _dapperWrap.GetRecords<BoxContent>(SqlCalls.SQL_BoxesContentArea(gP2_MultiCountryViewModel.multicountryID));
            gP2_MultiCountryViewModel.boxContent = Result4.ToList();
            foreach (var b in gP2_MultiCountryViewModel.boxContent)
            {
                b.STX_URL = b.STX_URL.Replace("https://www.tripmasters.com/europe", "").Replace("http://www.tripmasters.com/europe", "");
            }

            //if (centerDisplay.Count > 0)
            //{
            //    List<BoxContent> topCenterOnPage = gP2_MultiCountryViewModel.boxContent.FindAll(c => c.STX_ProdKindID == 1983).ToList();
            //    gP2_MultiCountryViewModel.allTopDisplay = topCenterOnPage.Join(centerDisplay, b => b.STX_ProdKindID, d => d.SDP_GroupProdKindID, (b, d) =>
            //         new DisplayBox
            //         {
            //             CMS_Content = b.CMS_Content,
            //             STX_CMSID = b.STX_CMSID,
            //             STX_Description = b.STX_Description
            //            ,
            //             STX_PictureHeightpx = b.STX_PictureHeightpx,
            //             STX_PictureURL = b.STX_PictureURL
            //            ,
            //             STX_PictureWidthpx = b.STX_PictureWidthpx,
            //             STX_Priority = b.STX_Priority
            //            ,
            //             STX_ProdKindID = b.STX_ProdKindID,
            //             STX_Title = b.STX_Title
            //            ,
            //             STX_URL = b.STX_URL,
            //             SDP_DisplayTitle = d.SDP_DisplayTitle,
            //             SDP_TitleBGColor = d.SDP_TitleBGColor
            //         }).ToList();
            //    Int32 allTop = gP2_MultiCountryViewModel.allTopDisplay.Count;
            //}
            //gP2_MultiCountryViewModel.bannerOnPage = gP2_MultiCountryViewModel.boxContent.FindAll(bn => bn.STX_ProdKindID == 1624).ToList();

            //TO KNOW WEIGHT CITIES AND COUNTRIES
            var Result5 = await _dapperWrap.GetRecords<WeightPlace>(SqlCalls.SQL_weightPlacesByIntID(0, gP2_MultiCountryViewModel.multicountryID));
            gP2_MultiCountryViewModel.placesOnWeight = Result5.ToList();

            //Customer Feedbacks by Country ID
            string _countries = "";
            foreach (var c in gP2_MultiCountryViewModel.placesOnWeight.FindAll(x => x.STR_PlaceTypeID == 5))
            {
                _countries = _countries + "," + c.STR_PlaceID.ToString();
            }
            var Result6 = await _dapperWrap.GetRecords<CustomReviews>(SqlCalls.SQL_MultiCouFeedback(_countries.Substring(1, _countries.Length - 1)));
            gP2_MultiCountryViewModel.CountriesFeeds = Result6.ToList();

            //DECLARE TITLE AND METAS TO THIS PAGE
            string pageTitle = gP2_MultiCountryViewModel.multicountryNa + " Vacations | Customize" + gP2_MultiCountryViewModel.multicountryNa + " Vacation Packages & Tours";
            gP2_MultiCountryViewModel.pageMetaDesc = "Customize " + gP2_MultiCountryViewModel.multicountryNa + " vacations online. Search,  Plan, and Customize vacation itineraries in seconds. Build your own trip online or call toll-free: 1-800-430-0484.";
            gP2_MultiCountryViewModel.pageMetaKey = gP2_MultiCountryViewModel.multicountryNa + " air and hotel stays, sightseeing tours, hotel packages, deals, rail, images, online booking, pricing, information, hotel travel, recommendations, resort, accommodations, Europe";
            gP2_MultiCountryViewModel.pageHeaderText = gP2_MultiCountryViewModel.multicountryNa;

            //ViewBag.PageTitle = pageTitle;
            //ViewBag.pageMetaDesc = gP2_MultiCountryViewModel.pageMetaDesc;
            //ViewBag.pageMetaKey = gP2_MultiCountryViewModel.pageMetaKey;
            //List<Interest_Info> dvTl = dbConn.QueryAsync<Interest_Info>(SqlCalls.SQL_Interest_Info(viewModelTemplate.intNA)).Result.ToList();
            var result7 = await _dapperWrap.GetRecords<Interest_Info>(SqlCalls.SQL_Interest_Info(gP2_MultiCountryViewModel.multicountryNa));
            List<Interest_Info> dvTl = result7.ToList();
            if (dvTl.Count > 0)
            {
                pageTitle = dvTl[0].SEO_PageTitle ?? pageTitle;
                gP2_MultiCountryViewModel.pageMetaDesc = dvTl[0].SEO_MetaDescription ?? gP2_MultiCountryViewModel.pageMetaDesc;
                gP2_MultiCountryViewModel.pageMetaKey = dvTl[0].SEO_MetaKeyword ?? gP2_MultiCountryViewModel.pageMetaKey;
                gP2_MultiCountryViewModel.pageHeaderText = dvTl[0].SEO_HeaderText ?? gP2_MultiCountryViewModel.pageHeaderText;
            }
            //MODIFY OR REMOVE/ADD DINAMICALLY Title and meta on Master Page
            //??????????????????????????????????????????????????????????????
            //ViewBag.PageType = "ListingPage";
            //ViewBag.CriteoIDs = packid3;

            return gP2_MultiCountryViewModel;
        }

        //public async Task<IActionResult> Desktop(string MultiCou)
        //{
        //    GP2_MultiCountryViewModel gP2_MultiCountryViewModel = new GP2_MultiCountryViewModel();

        //    gP2_MultiCountryViewModel.multicountryNa = MultiCou;
        //    List<PlaceInfo_By_PlaceName> dvPlace;
        //    List<Feedback> dvCustomFeed;
        //    List<PackOnInterestPriority> dvPackOnCty;
        //    List<DisplayArea> managerDisplay;
        //    List<DisplayArea> centerDisplay;
        //    List<NumberofCustomerFeedbacks> overAllReviews;
        //    List<weightItin> objItineraries;

        //    //SQL STRING QUERIES TO RETRIEVE ALL PAGE INFO NEEDED.
        //    var Result1 = await _dapperWrap.GetRecords<PlaceInfo_By_PlaceName>(SqlCalls.SQL_PlaceInfo_By_PlaceName(MultiCou));
        //    dvPlace = Result1.ToList();
        //    if (dvPlace.Count == 0)
        //    { throw new Exception("Customer Feedbacks by City ID."); }
        //    gP2_MultiCountryViewModel.multicountryID = dvPlace[0].STRID;
        //    gP2_MultiCountryViewModel.multicountryDES = dvPlace[0].STR_PlaceShortInfo;
        //    gP2_MultiCountryViewModel.multicountryNa = dvPlace[0].STR_PlaceTitle;
        //    gP2_MultiCountryViewModel.multiCountryPLC = dvPlace[0].STR_PlaceID;

        //    //Packages Priority List
        //    var Result2 = await _dapperWrap.GetRecords<weightItin>(SqlCalls.SQL_PackOnInterestPriorityList(gP2_MultiCountryViewModel.multicountryID.ToString(), "0"));
        //    objItineraries = Result2.ToList();
        //    gP2_MultiCountryViewModel.boxFeaturPacks = objItineraries.FindAll(p => p.SPPW_Weight < 999);
        //    if (gP2_MultiCountryViewModel.boxFeaturPacks.Count < 4)
        //    {
        //        gP2_MultiCountryViewModel.boxFeaturPacks = objItineraries.FindAll(p => p.PDL_SequenceNo < 9);
        //    }
        //    foreach (var v in gP2_MultiCountryViewModel.boxFeaturPacks)
        //    {
        //        gP2_MultiCountryViewModel.otherFeat = gP2_MultiCountryViewModel.otherFeat + "," + v.PDLID.ToString();
        //    }
        //    gP2_MultiCountryViewModel.otherFeat = gP2_MultiCountryViewModel.otherFeat.Substring(1, gP2_MultiCountryViewModel.otherFeat.Length - 1);
        //    //var first3 = objItineraries.Take(3).ToList();
        //    //var packid3 = "";
        //    //var iC = 0;
        //    //foreach (var d in first3)
        //    //{
        //    //    if (iC < first3.Count - 1) { packid3 = packid3 + "'" + d.PDLID + "', "; } else { packid3 = packid3 + "'" + d.PDLID + "'"; };
        //    //    iC++;
        //    //};


        //    //CONTENT LIKE MANAGER SELECTION
        //    var Result3 = await _dapperWrap.GetRecords<DisplayArea>(SqlCalls.SQL_ManagerDisplayArea(gP2_MultiCountryViewModel.multiCountryPLC));
        //    List<DisplayArea> dvCustDly = Result3.ToList();
        //    gP2_MultiCountryViewModel.leftDisplay = dvCustDly.FindAll(c => c.SDP_DisplayProdKindID == 1877).ToList();
        //    //centerDisplay = managerDisplay.FindAll(c => c.SDP_DisplayProdKindID == 1878).ToList();

        //    //Boxes Content
        //    var Result4 = await _dapperWrap.GetRecords<BoxContent>(SqlCalls.SQL_BoxesContentArea(gP2_MultiCountryViewModel.multicountryID));
        //    gP2_MultiCountryViewModel.boxContent = Result4.ToList();
        //    //if (centerDisplay.Count > 0)
        //    //{
        //    //    List<BoxContent> topCenterOnPage = gP2_MultiCountryViewModel.boxContent.FindAll(c => c.STX_ProdKindID == 1983).ToList();
        //    //    gP2_MultiCountryViewModel.allTopDisplay = topCenterOnPage.Join(centerDisplay, b => b.STX_ProdKindID, d => d.SDP_GroupProdKindID, (b, d) =>
        //    //         new DisplayBox
        //    //         {
        //    //             CMS_Content = b.CMS_Content,
        //    //             STX_CMSID = b.STX_CMSID,
        //    //             STX_Description = b.STX_Description
        //    //            ,
        //    //             STX_PictureHeightpx = b.STX_PictureHeightpx,
        //    //             STX_PictureURL = b.STX_PictureURL
        //    //            ,
        //    //             STX_PictureWidthpx = b.STX_PictureWidthpx,
        //    //             STX_Priority = b.STX_Priority
        //    //            ,
        //    //             STX_ProdKindID = b.STX_ProdKindID,
        //    //             STX_Title = b.STX_Title
        //    //            ,
        //    //             STX_URL = b.STX_URL,
        //    //             SDP_DisplayTitle = d.SDP_DisplayTitle,
        //    //             SDP_TitleBGColor = d.SDP_TitleBGColor
        //    //         }).ToList();
        //    //    Int32 allTop = gP2_MultiCountryViewModel.allTopDisplay.Count;
        //    //}
        //    //gP2_MultiCountryViewModel.bannerOnPage = gP2_MultiCountryViewModel.boxContent.FindAll(bn => bn.STX_ProdKindID == 1624).ToList();

        //    //TO KNOW WEIGHT CITIES AND COUNTRIES
        //    var Result5 = await _dapperWrap.GetRecords<WeightPlace>(SqlCalls.SQL_weightPlacesByIntID(0, gP2_MultiCountryViewModel.multicountryID));
        //    gP2_MultiCountryViewModel.placesOnWeight = Result5.ToList();

        //    //Customer Feedbacks by Country ID
        //    string _countries = "";
        //    foreach (var c in gP2_MultiCountryViewModel.placesOnWeight.FindAll(x => x.STR_PlaceTypeID == 5))
        //    {
        //        _countries = _countries + "," + c.STR_PlaceID.ToString();
        //    }
        //    var Result6 = await _dapperWrap.GetRecords<CustomReviews>(SqlCalls.SQL_MultiCouFeedback(_countries.Substring(1, _countries.Length - 1)));
        //    gP2_MultiCountryViewModel.CountriesFeeds = Result6.ToList();

        //    //DECLARE TITLE AND METAS TO THIS PAGE
        //    string pageTitle = "Book the Best " + gP2_MultiCountryViewModel.multicountryNa + " Vacations | " + gP2_MultiCountryViewModel.multicountryNa + " Flexible trips | " + gP2_MultiCountryViewModel.multicountryNa + " Itineraries";
        //    gP2_MultiCountryViewModel.pageMetaDesc = "Customize " + gP2_MultiCountryViewModel.multicountryNa + " vacations online. Search,  Plan, and Customize vacation itineraries in seconds. Build your own trip online or call toll-free: 1-877-267-2247.";
        //    gP2_MultiCountryViewModel.pageMetaKey = gP2_MultiCountryViewModel.multicountryNa + " air and hotel stays, sightseeing tours, hotel packages, deals, rail, images, online booking, pricing, information, hotel travel, recommendations, resort, accommodations, Europe";
        //    gP2_MultiCountryViewModel.pageHeaderText = gP2_MultiCountryViewModel.multicountryNa;

        //    //ViewBag.PageTitle = pageTitle;
        //    //ViewBag.pageMetaDesc = gP2_MultiCountryViewModel.pageMetaDesc;
        //    //ViewBag.pageMetaKey = gP2_MultiCountryViewModel.pageMetaKey;
        //    //List<Interest_Info> dvTl = dbConn.QueryAsync<Interest_Info>(SqlCalls.SQL_Interest_Info(viewModelTemplate.intNA)).Result.ToList();
        //    var result7 = await _dapperWrap.GetRecords<Interest_Info>(SqlCalls.SQL_Interest_Info(gP2_MultiCountryViewModel.multicountryNa));
        //    List<Interest_Info> dvTl = result7.ToList();
        //    if (dvTl.Count > 0)
        //    {
        //        pageTitle = dvTl[0].SEO_PageTitle ?? pageTitle;
        //        gP2_MultiCountryViewModel.pageMetaDesc = dvTl[0].SEO_MetaDescription ?? gP2_MultiCountryViewModel.pageMetaDesc;
        //        gP2_MultiCountryViewModel.pageMetaKey = dvTl[0].SEO_MetaKeyword ?? gP2_MultiCountryViewModel.pageMetaKey;
        //        gP2_MultiCountryViewModel.pageHeaderText = dvTl[0].SEO_HeaderText ?? gP2_MultiCountryViewModel.pageHeaderText;
        //    }
        //    //MODIFY OR REMOVE/ADD DINAMICALLY Title and meta on Master Page
        //    //??????????????????????????????????????????????????????????????
        //    //ViewBag.PageType = "ListingPage";
        //    //ViewBag.CriteoIDs = packid3;

        //    return gP2_MultiCountryViewModel;
        //}

        //public async Task<IActionResult> Mobile(string MultiCou)
        //{
        //    GP2_MultiCountryViewModel gP2_MultiCountryViewModel = new GP2_MultiCountryViewModel();

        //    gP2_MultiCountryViewModel.multicountryNa = MultiCou;
        //    List<PlaceInfo_By_PlaceName> dvPlace = new List<PlaceInfo_By_PlaceName>();
        //    List<weightItin> objItineraries = new List<weightItin>();

        //    //SQL STRING QUERIES TO RETRIEVE ALL PAGE INFO NEEDED.
        //    var Result1 = await _dapperWrap.GetRecords<PlaceInfo_By_PlaceName>(SqlCalls.SQL_PlaceInfo_By_PlaceName(MultiCou));
        //    dvPlace = Result1.ToList();
        //    if (dvPlace.Count == 0)
        //    { throw new Exception("Customer Feedbacks by City ID."); }
        //    gP2_MultiCountryViewModel.multicountryIDs = dvPlace[0].STRID;
        //    gP2_MultiCountryViewModel.multicountryDES = dvPlace[0].STR_PlaceShortInfo;
        //    gP2_MultiCountryViewModel.intNA = dvPlace[0].STR_PlaceTitle;
        //    gP2_MultiCountryViewModel.multicountryID = dvPlace[0].STR_PlaceID;

        //    //Packages Priority List
        //    var Result2 = await _dapperWrap.GetRecords<weightItin>(SqlCalls.SQL_PackOnInterestPriorityList(gP2_MultiCountryViewModel.multicountryIDs.ToString(), "0"));
        //    objItineraries = Result2.ToList();
        //    gP2_MultiCountryViewModel.boxFeaturPacks = objItineraries.FindAll(p => p.SPPW_Weight < 999);
        //    if (gP2_MultiCountryViewModel.boxFeaturPacks.Count == 0)
        //    {
        //        gP2_MultiCountryViewModel.boxFeaturPacks = objItineraries.FindAll(p => p.PDL_SequenceNo < 9);
        //    }

        //    //CONTENT LIKE MANAGER SELECTION
        //    var Result3 = await _dapperWrap.GetRecords<DisplayArea>(SqlCalls.SQL_ManagerDisplayArea(gP2_MultiCountryViewModel.multicountryID));
        //    gP2_MultiCountryViewModel.managerDisplay = Result3.ToList();

        //    //Boxes Content
        //    var Result4 = await _dapperWrap.GetRecords<BoxContent>(SqlCalls.SQL_BoxesContentArea(gP2_MultiCountryViewModel.multicountryIDs));
        //    gP2_MultiCountryViewModel.boxContent = Result4.ToList();

        //    gP2_MultiCountryViewModel.centerDsp = gP2_MultiCountryViewModel.boxContent.FindAll(c => c.STX_ProdKindID == 1912).ToList();

        //    //DECLARE TITLE AND METAS TO THIS PAGE
        //    string pageTitle = "Book the Best " + gP2_MultiCountryViewModel.intNA + " Vacations | " + gP2_MultiCountryViewModel.intNA + " Flexible trips | " + gP2_MultiCountryViewModel.intNA + " Itineraries";
        //    gP2_MultiCountryViewModel.pageMetaDesc = "Customize " + gP2_MultiCountryViewModel.intNA + " vacations online. Search,  Plan, and Customize vacation itineraries in seconds. Build your own trip online or call toll-free: 1-877-267-2247.";
        //    gP2_MultiCountryViewModel.pageMetaKey = gP2_MultiCountryViewModel.intNA + " air and hotel stays, sightseeing tours, hotel packages, deals, rail, images, online booking, pricing, information, hotel travel, recommendations, resort, accommodations, Europe";
        //    gP2_MultiCountryViewModel.pageHeaderText = gP2_MultiCountryViewModel.intNA;
        //    //ViewBag.PageTitle = pageTitle;
        //    //ViewBag.pageMetaDesc = gP2_MultiCountryViewModel.pageMetaDesc;
        //    //ViewBag.pageMetaKey = gP2_MultiCountryViewModel.pageMetaKey;

        //    var result7 = await _dapperWrap.GetRecords<Interest_Info>(SqlCalls.SQL_Interest_Info(gP2_MultiCountryViewModel.intNA));
        //    List<Interest_Info> dvTl = result7.ToList();
        //    if (dvTl.Count > 0)
        //    {
        //        pageTitle = dvTl[0].SEO_PageTitle ?? pageTitle;
        //        gP2_MultiCountryViewModel.pageMetaDesc = dvTl[0].SEO_MetaDescription ?? gP2_MultiCountryViewModel.pageMetaDesc;
        //        gP2_MultiCountryViewModel.pageMetaKey = dvTl[0].SEO_MetaKeyword ?? gP2_MultiCountryViewModel.pageMetaKey;
        //        gP2_MultiCountryViewModel.pageHeaderText = dvTl[0].SEO_HeaderText ?? gP2_MultiCountryViewModel.pageHeaderText;
        //    }
        //    ViewBag.PageType = "ListingPage";

        //    return View("GP_MultiCountry_Mob", gP2_MultiCountryViewModel);
        //}
    }
}
