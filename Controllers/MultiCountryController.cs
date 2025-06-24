using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using MVC_TMED.Infrastructure;
using MVC_TMED.Models;
using System.Collections.Generic;
using System.Linq;
using System;
using System.Threading.Tasks;
using MVC_TMED.Models.ViewModels;
using MVC_TMED.Controllers.VacationTemplates;

namespace MVC_TMED.Controllers
{
    public class MultiCountryController : Controller
    {
        private readonly IOptions<AppSettings> _appSettings;
        private readonly DapperWrap _dapperWrap;
        public MultiCountryController(IOptions<AppSettings> appSettings, DapperWrap dapperWrap)
        {
            _appSettings = appSettings;
            _dapperWrap = dapperWrap;
        }
        [TypeFilter(typeof(CheckCacheFilter))]
        [HttpGet("{placeName}/multicountry/vacations", Name = "MultiCountry_Vacation_Route")]
        [HttpPost("{placeName}/multicountry/vacations", Name = "MultiCountry_Vacation_Route")]
        [HttpHead("{placeName}/multicountry/vacations", Name = "MultiCountry_Vacation_Route")]
        public async Task<IActionResult> Index(string placeName)
        {
            List<PlacesHierarchy> placesHierarchies = new List<PlacesHierarchy>();
            var plcHierarchy = await _dapperWrap.GetRecords<PlacesHierarchy>(SqlCalls.SQL_Vacations_Places_Hierarchy_Priority(placeName));
            placesHierarchies = plcHierarchy.ToList();

            if (placesHierarchies.Count == 0)
            {
                return NotFound();
            }
            Int32 currentUser_ID = Int32.Parse(_appSettings.Value.ApplicationSettings.userID);
            string division = _appSettings.Value.ApplicationSettings.SiteName;
            if (placesHierarchies.Count == 1)
            {
                division = placesHierarchies.First().STR_UserID == 243 ? "/europe" : placesHierarchies.First().STR_UserID == 182 ? "/latin" : placesHierarchies.First().STR_UserID == 595 ? "/asia" : _appSettings.Value.ApplicationSettings.SiteName;
            }
            else
            {
                if (placesHierarchies.Where(x => x.STR_PlacePriority == 1).Count() > 0)
                {
                    if (placesHierarchies.Where(x => x.STR_PlacePriority == 1 && x.STR_UserID == currentUser_ID).Count() == 0)
                    {
                        int Priority1STR_UserID = placesHierarchies.Where(x => x.STR_PlacePriority == 1).FirstOrDefault().STR_UserID;
                        division = Priority1STR_UserID == 243 ? "/europe" : Priority1STR_UserID == 182 ? "/latin" : Priority1STR_UserID == 595 ? "/asia" : _appSettings.Value.ApplicationSettings.SiteName;
                    }
                }
            }

            switch (placesHierarchies.First().STR_ProdKindID)
            {
                case 1:
                case 5:
                case 25:
                    return RedirectPermanent(division + "/" + placeName + "/vacations");
                case 6:
                    return RedirectPermanent(division + "/" + placeName + "/area/vacations");

            }

            if (division != _appSettings.Value.ApplicationSettings.SiteName && _appSettings.Value.ApplicationSettings.SiteName != "")
            {
                return RedirectPermanent(division + "/" + placeName + "/multicountry/vacations");
            }

            if (placesHierarchies.First().STR_PlacePriority == 1)
            {
                if (placesHierarchies.First().STR_PageTemplate.IndexOf("GP3") > 0)
                {
                    GP3_MultiCountryViewModel gP3_MultiCountryViewModel = new GP3_MultiCountryViewModel();
                    //MultiCou = Utilities.UppercaseFirstLetter(MultiCou.Replace("_", " "));
                    List<PlaceInfo_By_PlaceName> dvPlace;
                    List<Feedback> dvCustomFeed;
                    List<PackOnInterestPriority> dvPackOnCty;
                    List<DisplayArea> managerDisplay = new List<DisplayArea>();
                    List<weightItin> objItineraries = new List<weightItin>();
                    List<NumberofCustomerFeedbacks> overAllReviews;
                    List<Place_Info> interestInfo = new List<Place_Info>();
                    Int32 placeId = placesHierarchies.First().STR_PlaceID;

                    //SQL STRING QUERIES TO RETRIEVE ALL PAGE INFO NEEDED.
                    var Result1 = await _dapperWrap.GetRecords<PlaceInfo_By_PlaceName>(SqlCalls.SQL_PlaceInfo_By_PlaceId(placeId));
                    dvPlace = Result1.ToList();
                    if (dvPlace.Count == 0)
                    { throw new Exception("Customer Feedbacks by City ID."); }
                    gP3_MultiCountryViewModel.multicountryIDs = dvPlace[0].STRID;
                    gP3_MultiCountryViewModel.intNA = dvPlace[0].STR_PlaceTitle;
                    gP3_MultiCountryViewModel.multicountryID = dvPlace[0].STR_PlaceID;
                    gP3_MultiCountryViewModel.multicountryNa = dvPlace[0].CountryNA;
                    gP3_MultiCountryViewModel.CountryID = dvPlace[0].CountryID;

                    var types = new Type[] { typeof(weightItin), typeof(DisplayArea), typeof(BoxContent), typeof(WeightPlace), typeof(Place_Info), typeof(CMSPage), typeof(WeightPlace) };
                    string queries = SqlCalls.SQL_PackOnInterestPriorityList(gP3_MultiCountryViewModel.multicountryIDs.ToString(), "0") + @";" + SqlCalls.SQL_ManagerDisplayArea(gP3_MultiCountryViewModel.multicountryID) + @";"
                                    + SqlCalls.SQL_BoxesContentArea(gP3_MultiCountryViewModel.multicountryIDs) + @";" + SqlCalls.SQL_weightPlacesByIntID(0, gP3_MultiCountryViewModel.multicountryIDs) + @";"
                                    + SqlCalls.SQL_Place_Info(gP3_MultiCountryViewModel.multicountryID.ToString()) + @";" + SqlCalls.SQL_PlaceCMSByplaceID(gP3_MultiCountryViewModel.multicountryID.ToString()) + @";"
                                    + SqlCalls.SQL_CountryCitiesByplcID(0, gP3_MultiCountryViewModel.multicountryIDs) + @";";
                    var results = await _dapperWrap.GetMultipleRecords(queries, 4, null, types);

                    var count = 1;
                    if (results != null)
                    {
                        foreach (var resultSet in results)
                        {
                            switch (count)
                            {
                                case 1:
                                    objItineraries = ((List<object>)resultSet).Cast<weightItin>().ToList();
                                    break;
                                case 2:
                                    managerDisplay = ((List<object>)resultSet).Cast<DisplayArea>().ToList();
                                    break;
                                case 3:
                                    gP3_MultiCountryViewModel.boxContent = ((List<object>)resultSet).Cast<BoxContent>().ToList();
                                    break;
                                case 4:
                                    gP3_MultiCountryViewModel.placesOnWeight = ((List<object>)resultSet).Cast<WeightPlace>().ToList();
                                    break;
                                case 5:
                                    interestInfo = ((List<object>)resultSet).Cast<Place_Info>().ToList();
                                    break;
                                case 6:
                                    gP3_MultiCountryViewModel.leftCMS = ((List<object>)resultSet).Cast<CMSPage>().ToList();
                                    break;
                                case 7:
                                    gP3_MultiCountryViewModel.placesOnCountry = ((List<object>)resultSet).Cast<WeightPlace>().ToList();
                                    break;
                                default:
                                    break;
                            }
                            count++;
                        }
                    }

                    //Packages Priority List
                    //var Result2 = await _dapperWrap.GetRecords<weightItin>(SqlCalls.SQL_PackOnInterestPriorityList(gP3_MultiCountryViewModel.multicountryIDs.ToString(), "0"));
                    //objItineraries = Result2.ToList();

                    gP3_MultiCountryViewModel.boxFeaturPacks = objItineraries.FindAll(p => p.SPPW_Weight < 999);

                    if (gP3_MultiCountryViewModel.boxFeaturPacks.Count == 0)
                    {
                        gP3_MultiCountryViewModel.boxFeaturPacks = objItineraries.FindAll(p => p.PDL_SequenceNo < 9);
                    }
                    gP3_MultiCountryViewModel.listFeatItin = gP3_MultiCountryViewModel.boxFeaturPacks;
                    foreach (var pk in gP3_MultiCountryViewModel.boxFeaturPacks)
                    {
                        gP3_MultiCountryViewModel.featPack.Add(pk.PDLID + "|" + pk.PDL_Title + "|" + pk.SPD_Description + "|" + pk.PDL_Duration + "|" + pk.STP_Save_ + "|" + pk.PDL_Content + "|" + pk.NoOfFeed + "|" + pk.SPD_InternalComments + "|" + pk.IMG_Path_URL + "|" + pk.CountryName);
                        gP3_MultiCountryViewModel.strPlcsIDs.Append(pk.PDL_Places);
                    }
                    gP3_MultiCountryViewModel.bestPackages1 = gP3_MultiCountryViewModel.boxFeaturPacks.Skip(1).Take(2);
                    gP3_MultiCountryViewModel.bestPackages2 = gP3_MultiCountryViewModel.boxFeaturPacks.Skip(3).Take(2);
                    gP3_MultiCountryViewModel.listFeatured = gP3_MultiCountryViewModel.boxFeaturPacks.Take(1).ToList();
                    gP3_MultiCountryViewModel.otherFeatured = gP3_MultiCountryViewModel.boxFeaturPacks.Skip(1).Take(4).ToList();
                    gP3_MultiCountryViewModel.suggestedPackages = gP3_MultiCountryViewModel.boxFeaturPacks.Skip(5).ToList();

                    var first3 = objItineraries.Take(3).ToList();
                    var packid3 = "";
                    var iC = 0;
                    foreach (var d in first3)
                    {
                        if (iC < first3.Count - 1) { packid3 = packid3 + "'" + d.PDLID + "', "; } else { packid3 = packid3 + "'" + d.PDLID + "'"; };
                        iC++;
                    };

                    //CONTENT LIKE MANAGER SELECTION
                    //var Result3 = await _dapperWrap.GetRecords<DisplayArea>(SqlCalls.SQL_ManagerDisplayArea(gP3_MultiCountryViewModel.multicountryID));
                    //managerDisplay = Result3.ToList();
                    gP3_MultiCountryViewModel.leftDisplay = managerDisplay.FindAll(c => c.SDP_DisplayProdKindID == 1877).ToList();
                    gP3_MultiCountryViewModel.centerDisplay = managerDisplay.FindAll(c => c.SDP_DisplayProdKindID == 1878).ToList();
                    gP3_MultiCountryViewModel.areaHighlightOrientation = gP3_MultiCountryViewModel.leftDisplay.FindAll(d => d.SDP_GroupProdKindID == 1623 || d.SDP_GroupProdKindID == 1619 || d.SDP_GroupProdKindID == 1912 || d.SDP_GroupProdKindID == 1620 || d.SDP_GroupProdKindID == 2478 || d.SDP_GroupProdKindID == 2470).ToList();

                    //Boxes Content
                    //var Result4 = await _dapperWrap.GetRecords<BoxContent>(SqlCalls.SQL_BoxesContentArea(gP3_MultiCountryViewModel.multicountryIDs));
                    //gP3_MultiCountryViewModel.boxContent = Result4.ToList();
                    foreach (var b in gP3_MultiCountryViewModel.boxContent)
                    {
                        b.STX_URL = b.STX_URL.Replace("https://www.tripmasters.com/europe", "").Replace("http://www.tripmasters.com/europe", "");
                    }

                    if (gP3_MultiCountryViewModel.centerDisplay.Count > 0)
                    {
                        List<BoxContent> topCenterOnPage = gP3_MultiCountryViewModel.boxContent.FindAll(c => c.STX_ProdKindID == 1983).ToList();
                        gP3_MultiCountryViewModel.allTopDisplay = topCenterOnPage.Join(gP3_MultiCountryViewModel.centerDisplay, b => b.STX_ProdKindID, d => d.SDP_GroupProdKindID, (b, d) =>
                             new DisplayBox
                             {
                                 CMS_Content = b.CMS_Content,
                                 STX_CMSID = b.STX_CMSID,
                                 STX_Description = b.STX_Description,
                                 STX_PictureHeightpx = b.STX_PictureHeightpx,
                                 STX_PictureURL = b.STX_PictureURL,
                                 STX_PictureWidthpx = b.STX_PictureWidthpx,
                                 STX_Priority = b.STX_Priority,
                                 STX_ProdKindID = b.STX_ProdKindID,
                                 STX_Title = b.STX_Title,
                                 STX_URL = b.STX_URL,
                                 SDP_DisplayTitle = d.SDP_DisplayTitle,
                                 SDP_TitleBGColor = d.SDP_TitleBGColor
                             }).ToList();
                        gP3_MultiCountryViewModel.allTop = gP3_MultiCountryViewModel.allTopDisplay.Count;
                    }
                    gP3_MultiCountryViewModel.bannerOnPage = gP3_MultiCountryViewModel.boxContent.FindAll(bn => bn.STX_ProdKindID == 1624).ToList();

                    //TO KNOW WEIGHT CITIES AND COUNTRIES
                    //var Result5 = await _dapperWrap.GetRecords<WeightPlace>(SqlCalls.SQL_weightPlacesByIntID(0, gP3_MultiCountryViewModel.multicountryIDs));
                    //gP3_MultiCountryViewModel.placesOnWeight = Result5.ToList();

                    //Customer Feedbacks by Country ID
                    string _countries = "";
                    foreach (var c in gP3_MultiCountryViewModel.placesOnWeight.FindAll(x => x.STR_PlaceTypeID == 5))
                    {
                        _countries = _countries + "," + c.STR_PlaceID.ToString();
                    }
                    string _cities = "";
                    foreach (var ci in gP3_MultiCountryViewModel.placesOnWeight.FindAll(x => x.STR_PlaceTypeID == 25 || x.STR_PlaceTypeID == 1))
                    {
                        _cities = _cities + "," + ci.STR_PlaceID.ToString();
                    }
                    var Result6 = await _dapperWrap.GetRecords<CustomReviews>(SqlCalls.SQL_MultiCouFeedback(_countries.Substring(1, _countries.Length - 1)));
                    gP3_MultiCountryViewModel.CountriesFeeds = Result6.ToList();

                    //DECLARE TITLE AND METAS TO THIS PAGE
                    gP3_MultiCountryViewModel.pageTitle = "Book the Best " + gP3_MultiCountryViewModel.intNA + " Vacations | " + gP3_MultiCountryViewModel.intNA + " Flexible trips | " + gP3_MultiCountryViewModel.intNA + " Itineraries";
                    gP3_MultiCountryViewModel.pageMetaDesc = "Customize " + gP3_MultiCountryViewModel.intNA + " vacations online. Search,  Plan, and Customize vacation itineraries in seconds. Build your own trip online or call toll-free: 1-800-430-0484.";
                    gP3_MultiCountryViewModel.pageMetaKey = gP3_MultiCountryViewModel.intNA + " air and hotel stays, sightseeing tours, hotel packages, deals, rail, images, online booking, pricing, information, hotel travel, recommendations, resort, accommodations, Europe, Africa vacation packages, Middle East vacation packages";
                    gP3_MultiCountryViewModel.pageHeaderText = gP3_MultiCountryViewModel.multicountryNa;

                    //var result7 = await _dapperWrap.GetRecords<Place_Info>(SqlCalls.SQL_Place_Info(gP3_MultiCountryViewModel.multicountryID.ToString()));
                    //List<Place_Info> dvTl = result7.ToList();
                    if (interestInfo.Count > 0)
                    {
                        gP3_MultiCountryViewModel.pageTitle = interestInfo[0].SEO_PageTitle ?? gP3_MultiCountryViewModel.pageTitle;
                        gP3_MultiCountryViewModel.pageMetaDesc = interestInfo[0].SEO_MetaDescription ?? gP3_MultiCountryViewModel.pageMetaDesc;
                        gP3_MultiCountryViewModel.pageMetaKey = interestInfo[0].SEO_MetaKeyword ?? gP3_MultiCountryViewModel.pageMetaKey;
                        gP3_MultiCountryViewModel.pageHeaderText = interestInfo[0].SEO_HeaderText ?? gP3_MultiCountryViewModel.pageHeaderText;
                    }
                    //MODIFY OR REMOVE/ADD DINAMICALLY Title and meta on Master Page
                    //??????????????????????????????????????????????????????????????
                    gP3_MultiCountryViewModel.PageType = "ListingPage";
                    gP3_MultiCountryViewModel.CriteoIDs = packid3;

                    if (Utilities.CheckMobileDevice() == false)
                    {
                        return View("~/Views/GP3_MultiCountry/GP3_MultiCountry.cshtml", gP3_MultiCountryViewModel);
                    }
                    else
                    {
                        return View("~/Views/GP3_MultiCountry/GP3_MultiCountry_Mob.cshtml", gP3_MultiCountryViewModel);
                    }
                }
                else if (placesHierarchies.First().STR_PageTemplate.IndexOf("GP2") > 0)
                {
                    Int32 placeId = placesHierarchies.First().STR_PlaceID;
                    if (Utilities.CheckMobileDevice() == false)
                    {
                        GP2_MultiCountryViewModel gP2_MultiCountryViewModel = new GP2_MultiCountryViewModel();

                        //gP2_MultiCountryViewModel.multicountryNa = MultiCou;
                        List<PlaceInfo_By_PlaceName> dvPlace;
                        List<Feedback> dvCustomFeed;
                        List<PackOnInterestPriority> dvPackOnCty;
                        List<DisplayArea> managerDisplay;
                        List<DisplayArea> centerDisplay;
                        List<NumberofCustomerFeedbacks> overAllReviews;
                        List<weightItin> objItineraries;

                        //SQL STRING QUERIES TO RETRIEVE ALL PAGE INFO NEEDED.
                        var Result1 = await _dapperWrap.GetRecords<PlaceInfo_By_PlaceName>(SqlCalls.SQL_PlaceInfo_By_PlaceId(placeId));
                        dvPlace = Result1.ToList();
                        if (dvPlace.Count == 0)
                        { throw new Exception("Customer Feedbacks by City ID."); }
                        gP2_MultiCountryViewModel.multicountryIDs = dvPlace[0].STRID;
                        gP2_MultiCountryViewModel.multicountryDES = dvPlace[0].STR_PlaceShortInfo;
                        gP2_MultiCountryViewModel.intNA = dvPlace[0].STR_PlaceTitle;
                        gP2_MultiCountryViewModel.multicountryID = dvPlace[0].STR_PlaceID;

                        //Packages Priority List
                        var Result2 = await _dapperWrap.GetRecords<weightItin>(SqlCalls.SQL_PackOnInterestPriorityList(gP2_MultiCountryViewModel.multicountryIDs.ToString(), "0"));
                        objItineraries = Result2.ToList();
                        gP2_MultiCountryViewModel.boxFeaturPacks = objItineraries.FindAll(p => p.SPPW_Weight < 999);
                        if (gP2_MultiCountryViewModel.boxFeaturPacks.Count == 0)
                        {
                            gP2_MultiCountryViewModel.boxFeaturPacks = objItineraries.FindAll(p => p.PDL_SequenceNo < 9);
                        }
                        foreach (var v in gP2_MultiCountryViewModel.boxFeaturPacks)
                        {
                            gP2_MultiCountryViewModel.strPlcsIDs.Append(v.PDL_Places);
                        }

                        var first3 = objItineraries.Take(3).ToList();
                        var packid3 = "";
                        var iC = 0;
                        foreach (var d in first3)
                        {
                            if (iC < first3.Count - 1) { packid3 = packid3 + "'" + d.PDLID + "', "; } else { packid3 = packid3 + "'" + d.PDLID + "'"; };
                            iC++;
                        };


                        //CONTENT LIKE MANAGER SELECTION
                        var Result3 = await _dapperWrap.GetRecords<DisplayArea>(SqlCalls.SQL_ManagerDisplayArea(gP2_MultiCountryViewModel.multicountryID));
                        managerDisplay = Result3.ToList();
                        gP2_MultiCountryViewModel.leftDisplay = managerDisplay.FindAll(c => c.SDP_DisplayProdKindID == 1877).ToList();
                        centerDisplay = managerDisplay.FindAll(c => c.SDP_DisplayProdKindID == 1878).ToList();

                        //Boxes Content
                        var Result4 = await _dapperWrap.GetRecords<BoxContent>(SqlCalls.SQL_BoxesContentArea(gP2_MultiCountryViewModel.multicountryIDs));
                        gP2_MultiCountryViewModel.boxContent = Result4.ToList();
                        foreach (var b in gP2_MultiCountryViewModel.boxContent)
                        {
                            b.STX_URL = b.STX_URL.Replace("https://www.tripmasters.com/europe", "").Replace("http://www.tripmasters.com/europe", "");
                        }
                        if (centerDisplay.Count > 0)
                        {
                            List<BoxContent> topCenterOnPage = gP2_MultiCountryViewModel.boxContent.FindAll(c => c.STX_ProdKindID == 1983).ToList();
                            gP2_MultiCountryViewModel.allTopDisplay = topCenterOnPage.Join(centerDisplay, b => b.STX_ProdKindID, d => d.SDP_GroupProdKindID, (b, d) =>
                                 new DisplayBox
                                 {
                                     CMS_Content = b.CMS_Content,
                                     STX_CMSID = b.STX_CMSID,
                                     STX_Description = b.STX_Description,
                                     STX_PictureHeightpx = b.STX_PictureHeightpx,
                                     STX_PictureURL = b.STX_PictureURL,
                                     STX_PictureWidthpx = b.STX_PictureWidthpx,
                                     STX_Priority = b.STX_Priority,
                                     STX_ProdKindID = b.STX_ProdKindID,
                                     STX_Title = b.STX_Title,
                                     STX_URL = b.STX_URL,
                                     SDP_DisplayTitle = d.SDP_DisplayTitle,
                                     SDP_TitleBGColor = d.SDP_TitleBGColor
                                 }).ToList();
                            Int32 allTop = gP2_MultiCountryViewModel.allTopDisplay.Count;
                        }
                        gP2_MultiCountryViewModel.bannerOnPage = gP2_MultiCountryViewModel.boxContent.FindAll(bn => bn.STX_ProdKindID == 1624).ToList();

                        //TO KNOW WEIGHT CITIES AND COUNTRIES
                        var Result5 = await _dapperWrap.GetRecords<WeightPlace>(SqlCalls.SQL_weightPlacesByIntID(0, gP2_MultiCountryViewModel.multicountryIDs));
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
                        gP2_MultiCountryViewModel.pageTitle = "Book the Best " + gP2_MultiCountryViewModel.intNA + " Vacations | " + gP2_MultiCountryViewModel.intNA + " Flexible trips | " + gP2_MultiCountryViewModel.intNA + " Itineraries";
                        gP2_MultiCountryViewModel.pageMetaDesc = "Customize " + gP2_MultiCountryViewModel.intNA + " vacations online. Search,  Plan, and Customize vacation itineraries in seconds. Build your own trip online or call toll-free: 1-800-430-0484.";
                        gP2_MultiCountryViewModel.pageMetaKey = gP2_MultiCountryViewModel.intNA + " air and hotel stays, sightseeing tours, hotel packages, deals, rail, images, online booking, pricing, information, hotel travel, recommendations, resort, accommodations, Europe";
                        gP2_MultiCountryViewModel.pageHeaderText = gP2_MultiCountryViewModel.multicountryNa;

                        //ViewBag.PageTitle = pageTitle;
                        //ViewBag.pageMetaDesc = gP2_MultiCountryViewModel.pageMetaDesc;
                        //ViewBag.pageMetaKey = gP2_MultiCountryViewModel.pageMetaKey;
                        //List<Interest_Info> dvTl = dbConn.QueryAsync<Interest_Info>(SqlCalls.SQL_Interest_Info(viewModelTemplate.intNA)).Result.ToList();
                        var result7 = await _dapperWrap.GetRecords<Interest_Info>(SqlCalls.SQL_Interest_Info(gP2_MultiCountryViewModel.intNA));
                        List<Interest_Info> dvTl = result7.ToList();
                        if (dvTl.Count > 0)
                        {
                            gP2_MultiCountryViewModel.pageTitle = dvTl[0].SEO_PageTitle ?? gP2_MultiCountryViewModel.pageTitle;
                            gP2_MultiCountryViewModel.pageMetaDesc = dvTl[0].SEO_MetaDescription ?? gP2_MultiCountryViewModel.pageMetaDesc;
                            gP2_MultiCountryViewModel.pageMetaKey = dvTl[0].SEO_MetaKeyword ?? gP2_MultiCountryViewModel.pageMetaKey;
                            gP2_MultiCountryViewModel.pageHeaderText = dvTl[0].SEO_HeaderText ?? gP2_MultiCountryViewModel.pageHeaderText;
                        }
                        //MODIFY OR REMOVE/ADD DINAMICALLY Title and meta on Master Page
                        //??????????????????????????????????????????????????????????????
                        gP2_MultiCountryViewModel.PageType = "ListingPage";
                        gP2_MultiCountryViewModel.CriteoIDs = packid3;

                        Int32 countryID = -1;
                        var result9 = await _dapperWrap.GetRecords<WeightPlace>(SqlCalls.SQL_CountryCitiesByplcID(0, gP2_MultiCountryViewModel.multicountryIDs));
                        gP2_MultiCountryViewModel.placesOnCountry = result9.ToList();
                        gP2_MultiCountryViewModel.countryCities = gP2_MultiCountryViewModel.placesOnCountry.FindAll(c => c.CountryID == countryID).ToList();

                        
                        return View("~/Views/GP2_MultiCountry/GP2_MultiCountry.cshtml", gP2_MultiCountryViewModel);
                    }
                    else
                    {
                        GP2_MultiCountryViewModel gP2_MultiCountryViewModel = new GP2_MultiCountryViewModel();

                        //gP2_MultiCountryViewModel.multicountryNa = MultiCou;
                        List<PlaceInfo_By_PlaceName> dvPlace = new List<PlaceInfo_By_PlaceName>();
                        List<weightItin> objItineraries = new List<weightItin>();

                        //SQL STRING QUERIES TO RETRIEVE ALL PAGE INFO NEEDED.
                        var Result1 = await _dapperWrap.GetRecords<PlaceInfo_By_PlaceName>(SqlCalls.SQL_PlaceInfo_By_PlaceId(placeId));
                        dvPlace = Result1.ToList();
                        if (dvPlace.Count == 0)
                        { throw new Exception("Customer Feedbacks by City ID."); }
                        gP2_MultiCountryViewModel.multicountryIDs = dvPlace[0].STRID;
                        gP2_MultiCountryViewModel.multicountryDES = dvPlace[0].STR_PlaceShortInfo;
                        gP2_MultiCountryViewModel.intNA = dvPlace[0].STR_PlaceTitle;
                        gP2_MultiCountryViewModel.multicountryID = dvPlace[0].STR_PlaceID;

                        //Packages Priority List
                        var Result2 = await _dapperWrap.GetRecords<weightItin>(SqlCalls.SQL_PackOnInterestPriorityList(gP2_MultiCountryViewModel.multicountryIDs.ToString(), "0"));
                        objItineraries = Result2.ToList();
                        gP2_MultiCountryViewModel.boxFeaturPacks = objItineraries.FindAll(p => p.SPPW_Weight < 999);
                        if (gP2_MultiCountryViewModel.boxFeaturPacks.Count == 0)
                        {
                            gP2_MultiCountryViewModel.boxFeaturPacks = objItineraries.FindAll(p => p.PDL_SequenceNo < 9);
                        }
                        var first3 = objItineraries.Take(3).ToList();
                        var packid3 = "";
                        var iC = 0;
                        foreach (var d in first3)
                        {
                            if (iC < first3.Count - 1) { packid3 = packid3 + "'" + d.PDLID + "', "; } else { packid3 = packid3 + "'" + d.PDLID + "'"; };
                            iC++;
                        };

                        //CONTENT LIKE MANAGER SELECTION
                        var Result3 = await _dapperWrap.GetRecords<DisplayArea>(SqlCalls.SQL_ManagerDisplayArea(gP2_MultiCountryViewModel.multicountryID));
                        gP2_MultiCountryViewModel.managerDisplay = Result3.ToList();

                        //Boxes Content
                        var Result4 = await _dapperWrap.GetRecords<BoxContent>(SqlCalls.SQL_BoxesContentArea(gP2_MultiCountryViewModel.multicountryIDs));
                        gP2_MultiCountryViewModel.boxContent = Result4.ToList();

                        gP2_MultiCountryViewModel.centerDsp = gP2_MultiCountryViewModel.boxContent.FindAll(c => c.STX_ProdKindID == 1983).ToList();

                        //DECLARE TITLE AND METAS TO THIS PAGE
                        gP2_MultiCountryViewModel.pageTitle = "Book the Best " + gP2_MultiCountryViewModel.intNA + " Vacations | " + gP2_MultiCountryViewModel.intNA + " Flexible trips | " + gP2_MultiCountryViewModel.intNA + " Itineraries";
                        gP2_MultiCountryViewModel.pageMetaDesc = "Customize " + gP2_MultiCountryViewModel.intNA + " vacations online. Search,  Plan, and Customize vacation itineraries in seconds. Build your own trip online or call toll-free: 1-877-267-2247.";
                        gP2_MultiCountryViewModel.pageMetaKey = gP2_MultiCountryViewModel.intNA + " air and hotel stays, sightseeing tours, hotel packages, deals, rail, images, online booking, pricing, information, hotel travel, recommendations, resort, accommodations, Europe";
                        gP2_MultiCountryViewModel.pageHeaderText = gP2_MultiCountryViewModel.intNA;
                        //ViewBag.PageTitle = pageTitle;
                        //ViewBag.pageMetaDesc = gP2_MultiCountryViewModel.pageMetaDesc;
                        //ViewBag.pageMetaKey = gP2_MultiCountryViewModel.pageMetaKey;

                        //List<Interest_Info> dvTl = dbConn.QueryAsync<Interest_Info>(SqlCalls.SQL_Interest_Info(viewModelTemplate.intNA)).Result.ToList();
                        var result5 = await _dapperWrap.GetRecords<Interest_Info>(SqlCalls.SQL_Interest_Info(gP2_MultiCountryViewModel.intNA));
                        List<Interest_Info> dvTl = result5.ToList();
                        if (dvTl.Count > 0)
                        {
                            gP2_MultiCountryViewModel.pageTitle = dvTl[0].SEO_PageTitle ?? gP2_MultiCountryViewModel.pageTitle;
                            gP2_MultiCountryViewModel.pageMetaDesc = dvTl[0].SEO_MetaDescription ?? gP2_MultiCountryViewModel.pageMetaDesc;
                            gP2_MultiCountryViewModel.pageMetaKey = dvTl[0].SEO_MetaKeyword ?? gP2_MultiCountryViewModel.pageMetaKey;
                            gP2_MultiCountryViewModel.pageHeaderText = dvTl[0].SEO_HeaderText ?? gP2_MultiCountryViewModel.pageHeaderText;
                        }
                        gP2_MultiCountryViewModel.PageType = "ListingPage";
                        gP2_MultiCountryViewModel.CriteoIDs = packid3;

                        Int32 countryID = -1;
                        var result9 = await _dapperWrap.GetRecords<WeightPlace>(SqlCalls.SQL_CountryCitiesByplcID(0, gP2_MultiCountryViewModel.multicountryIDs));
                        gP2_MultiCountryViewModel.placesOnCountry = result9.ToList();
                        gP2_MultiCountryViewModel.countryCities = gP2_MultiCountryViewModel.placesOnCountry.FindAll(c => c.CountryID == countryID).ToList();

                        return View("~/Views/GP2_MultiCountry/GP2_MultiCountry_Mob.cshtml", gP2_MultiCountryViewModel);
                    }
                }
            }
            else
            {
                var initClass = new GP3_SecondaryDestinationClass(_dapperWrap);
                var model = await initClass.GP3_SecondaryDestination(placeName);
                ViewBag.PageTitle = model.pageTitle;
                ViewBag.pageMetaDesc = model.pageMetaDesc;
                ViewBag.pageMetaKey = model.pageMetaKey;
                ViewBag.viewUsedName = "GP3_SecondaryDestination";
                ViewBag.tmpagetype = "secondary";
                ViewBag.tmpagetypeinstance = "gp3";
                ViewBag.tmrowid = "";
                ViewBag.tmadstatus = "";
                ViewBag.tmregion = "latin";
                ViewBag.tmcountry = "";
                ViewBag.tmdestination = placeName.Replace("_", " ");
                return View("~/Views/GP3_SecondaryDestination/GP3_SecondaryDestination.cshtml", model);
            }

            return BadRequest();
        }
    }
}
