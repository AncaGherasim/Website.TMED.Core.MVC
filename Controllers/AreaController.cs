using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using MVC_TMED.Models;
using MVC_TMED.Infrastructure;
using Microsoft.AspNetCore.Hosting;
using MVC_TMED.Controllers.VacationTemplates;
using MVC_TMED.Models.ViewModels;
using System.Text.RegularExpressions;
using System.Text;
using System.Xml.Linq;
using System.Security.Policy;
using static Mysqlx.Crud.Order.Types;

namespace MVC_TMED.Controllers
{
    public class AreaController : Controller
    {
        private readonly IOptions<AppSettings> _appSettings;
        private readonly DapperWrap _dapperWrap;
        private readonly IWebHostEnvironment _hostingEnvironment;
        private readonly AWSParameterStoreService _awsParameterStoreService;
        public IWebHostEnvironment Env { get; }
        public AreaController(IOptions<AppSettings> appsettings, DapperWrap dapperWrap, IWebHostEnvironment hostingEnvironment, AWSParameterStoreService awsParameterStoreService)
        {
            _appSettings = appsettings;
            _dapperWrap = dapperWrap;
            _hostingEnvironment = hostingEnvironment;
            _awsParameterStoreService = awsParameterStoreService;
        }
        [TypeFilter(typeof(CheckCacheFilter))]
        [HttpGet("{placeName}/area/vacations", Name = "Area_Route")]
        [HttpHead("{placeName}/area/vacations", Name = "Area_Route")]
        [HttpPost("{placeName}/area/vacations", Name = "Area_Route")]
        public async Task<IActionResult> IndexAsync(string placeName)
        {
            string CityRegCou;
            CityRegCou = placeName;
            List<PlacesHierarchy> placesHierarchies = new List<PlacesHierarchy>();
            var plcHierarchy = await _dapperWrap.GetRecords<PlacesHierarchy>(SqlCalls.SQL_Vacations_Places_Hierarchy_Priority(CityRegCou));
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
            switch (placesHierarchies.First().STR_PlaceTypeID)
            {
                case 1:
                case 25:
                case 5:
                    {
                        return RedirectPermanent(division + "/" + placeName + "/vacations");
                    }
                case 28:
                    {
                        return RedirectPermanent(division + "/" + placeName + "/multicountry/vacations");
                    }
            }
            if (division != _appSettings.Value.ApplicationSettings.SiteName && _appSettings.Value.ApplicationSettings.SiteName != "")
            {
                return RedirectPermanent(division + "/" + placeName + "/area/vacations");
            }
            if (placesHierarchies.First().STR_PlacePriority == 1)
            {
                if (placesHierarchies.FirstOrDefault().STR_PageTemplate.IndexOf("GP3") > 0)
                {
                    Int32 placeId = placesHierarchies.FirstOrDefault().STR_PlaceID;
                    GP3_AreaViewModel gP3_AreaViewModel = new GP3_AreaViewModel();
                    List<PlaceInfo_By_PlaceName> place;
                    List<Feedback> customerFeedbacks = new List<Feedback>();
                    List<PackOnInterestPriority> dvPackOnCty;
                    List<DisplayArea> managerDisplay = new List<DisplayArea>();
                    List<Place_Info> placeInfo = new List<Place_Info>();
                    List<NumberofCustomerFeedbacks> overAllReviews;
                    var Result2 = await _dapperWrap.GetRecords<PlaceInfo_By_PlaceName>(SqlCalls.SQL_PlaceInfo_By_PlaceId(placeId));
                    place = Result2.ToList();
                    if (place.Count == 0)
                    { throw new Exception("No area informations by name."); }
                    if (place.Count() > 1)
                    {
                        place = place.FindAll(x => x.STR_PlaceTypeID == 6);
                    }
                    gP3_AreaViewModel.countryNA = place[0].CountryNA;
                    gP3_AreaViewModel.areaIDs = place[0].STRID;
                    gP3_AreaViewModel.areaID = place[0].STR_PlaceID;
                    gP3_AreaViewModel.intNA = place[0].STR_PlaceTitle;
                    gP3_AreaViewModel.countryID = place[0].CountryID;
                    gP3_AreaViewModel.areaNA = Utilities.UppercaseFirstLetter(place.FirstOrDefault().STR_PlaceTitle);
                    var types = new Type[] { typeof(Place_Info), typeof(Feedback) };
                    var results = await _dapperWrap.GetMultipleRecords(SqlCalls.SQL_Place_Info(gP3_AreaViewModel.areaID.ToString()) + @";" + SqlCalls.SQL_FeedbacksByPlaceId(gP3_AreaViewModel.areaID) + @";", 4, null, types);
                    placeInfo.Add(results.FirstOrDefault()[0]);
                    foreach (var resultSet in results.Skip(1))
                    {
                        foreach (var result in resultSet)
                        {
                            customerFeedbacks.Add(result);
                        }
                    }
                    if (placeInfo[0].SEO_PageTitle != null)
                    {
                        gP3_AreaViewModel.pageTitle = placeInfo[0].SEO_PageTitle;
                    }
                    else
                    {
                        gP3_AreaViewModel.pageTitle = gP3_AreaViewModel.areaNA + " Vacation Packages | Vacations to " + gP3_AreaViewModel.areaNA + " | Tripmasters";
                    }

                    if (placeInfo[0].SEO_MetaDescription != null)
                    {
                        gP3_AreaViewModel.pageMetaDesc = placeInfo[0].SEO_MetaDescription;
                    }
                    else
                    {
                        gP3_AreaViewModel.pageMetaDesc = gP3_AreaViewModel.areaNA + " Vacations, custom vacations to " + gP3_AreaViewModel.areaNA + ", best " + gP3_AreaViewModel.areaNA + " vacation packages. Travel to " + gP3_AreaViewModel.areaNA + ". " + gP3_AreaViewModel.areaNA + " online booking.";
                    }
                    gP3_AreaViewModel.pageMetaKey = gP3_AreaViewModel.areaNA + " air and hotel stays, sightseeing tours, hotel packages, deals, images, online booking, pricing, information, hotel travel, recommendations, resort, accommodations";
                    gP3_AreaViewModel.pageBannerText = "US based|Price & Book in seconds|Discounted Air included";
                    gP3_AreaViewModel.pageHeaderText = gP3_AreaViewModel.areaNA + " Vacation Packages";
                    gP3_AreaViewModel.pageDescriptionC = gP3_AreaViewModel.pageMetaDesc;
                    ViewBag.PageTitle = gP3_AreaViewModel.pageTitle;
                    ViewBag.pageMetaDesc = gP3_AreaViewModel.pageMetaDesc;
                    ViewBag.pageMetaKey = gP3_AreaViewModel.pageMetaKey;
                    for (var f = 0; f < customerFeedbacks.Count() - 1; f++)
                    {
                        if (f == 3)
                        {
                            f = customerFeedbacks.Count() - 1;
                        }
                        gP3_AreaViewModel.boxCustomFeed.Add(Utilities.FormatCustomerComment(customerFeedbacks[f].PCC_Comment, 150) + "||" + customerFeedbacks[f].dep_date.ToString() + "|" + customerFeedbacks[f].CountryName + "|" + customerFeedbacks[f].PCC_PDLID + "|" + customerFeedbacks[f].PDL_Title);
                    }
                    if (customerFeedbacks.Count > 0)
                    {
                        gP3_AreaViewModel.packFeedCountC = customerFeedbacks[0].NoOfComments;
                        gP3_AreaViewModel.packFeedCountCity = customerFeedbacks.Count();
                    }
                    List<PackOnInterestPriority> packsOnInterestPriority = new List<PackOnInterestPriority>();
                    var types2 = new Type[] { typeof(PackOnInterestPriority), typeof(DisplayArea), typeof(BoxContent), typeof(WeightPlace), typeof(CMSPage) };
                    string sqlQuerys = SqlCalls.SQL_PackOnInterestPriorityList(gP3_AreaViewModel.areaIDs.ToString(), "0") + @";" + SqlCalls.SQL_ManagerDisplayArea(gP3_AreaViewModel.areaID) + @";" + SqlCalls.SQL_BoxesContentArea(gP3_AreaViewModel.areaIDs) + @";" + SqlCalls.SQL_CountryCitiesByplcID(0, gP3_AreaViewModel.countryID) + @";"
                                        + SqlCalls.SQL_CMS_onGPpages("PlcH", 0, gP3_AreaViewModel.areaIDs) + @";";
                    var resultsSets = await _dapperWrap.GetMultipleRecords(sqlQuerys, 4, null, types2);
                    if (resultsSets != null)
                    {
                        foreach (var resultSet in resultsSets.FirstOrDefault())
                        {
                            packsOnInterestPriority.Add(resultSet);
                        }
                        foreach (var resultSet in resultsSets.Take(1..2))
                        {
                            foreach (var result in resultSet)
                            {
                                managerDisplay.Add(result);
                            }
                        }
                        foreach (var resultSet in resultsSets.Take(2..3))
                        {
                            foreach (var result in resultSet)
                            {
                                gP3_AreaViewModel.boxContent.Add(result);
                            }
                        }
                        foreach (var resultSet in resultsSets.Take(3..4))
                        {
                            foreach (var result in resultSet)
                            {
                                gP3_AreaViewModel.placesOnCountry.Add(result);
                            }
                        }
                        foreach (var resultSet in resultsSets.Take(4..5))
                        {
                            foreach (var result in resultSet)
                            {
                                gP3_AreaViewModel.leftCMS.Add(result);
                            }
                        }
                    }
                    gP3_AreaViewModel.featPack = packsOnInterestPriority.FindAll(n => n.SPPW_Weight < 999);
                    if (gP3_AreaViewModel.featPack.Count == 0)
                    {
                        gP3_AreaViewModel.featPack = gP3_AreaViewModel.featPack.FindAll(n => n.PDL_SequenceNo < 9);
                    }
                    gP3_AreaViewModel.listFeatItin = gP3_AreaViewModel.featPack;
                    foreach (var pk in gP3_AreaViewModel.featPack)
                    {
                        gP3_AreaViewModel.boxFeaturPacks.Add(pk.PDLID + "|" + pk.PDL_Title + "|" + pk.SPD_Description + "|" + pk.PDL_Duration + "|" + pk.STP_Save_ + "|" + pk.PDL_Content + "|" + pk.NoOfFeed + "|" + pk.SPD_InternalComments + "|" + pk.IMG_Path_URL);
                        gP3_AreaViewModel.strPlcsIDs.Append(pk.PDL_Places);
                    }
                    gP3_AreaViewModel.bestPackages1 = gP3_AreaViewModel.featPack.Take(2);
                    gP3_AreaViewModel.bestPackages2 = gP3_AreaViewModel.featPack.Take(2..4);
                    gP3_AreaViewModel.listFeatured = gP3_AreaViewModel.featPack.Take(1).ToList();
                    gP3_AreaViewModel.otherFeatured = gP3_AreaViewModel.featPack.Take(1..5).ToList();
                    gP3_AreaViewModel.suggestedPackages = gP3_AreaViewModel.featPack.Skip(5).ToList();
                    var first3 = gP3_AreaViewModel.featPack.Take(3).ToList();
                    var packid3 = "";
                    var iC = 0;
                    foreach (var d in first3)
                    {
                        if (iC < first3.Count - 1) { packid3 = packid3 + "'" + d.PDLID + "', "; } else { packid3 = packid3 + "'" + d.PDLID + "'"; };
                        iC++;
                    };
                    gP3_AreaViewModel.leftDisplay = managerDisplay.FindAll(c => c.SDP_DisplayProdKindID == 1877).ToList();
                    gP3_AreaViewModel.centerDisplay = managerDisplay.FindAll(c => c.SDP_DisplayProdKindID == 1878).ToList();
                    gP3_AreaViewModel.areaHighlightOrientation = gP3_AreaViewModel.leftDisplay.FindAll(d => d.SDP_GroupProdKindID == 1623 || d.SDP_GroupProdKindID == 1619 || d.SDP_GroupProdKindID == 1912 || d.SDP_GroupProdKindID == 1620 || d.SDP_GroupProdKindID == 2470 || d.SDP_GroupProdKindID == 2478).ToList();
                    if (gP3_AreaViewModel.centerDisplay.Count > 0)
                    {
                        List<BoxContent> topCenterOnPage = gP3_AreaViewModel.boxContent.FindAll(c => c.STX_ProdKindID == 1983).ToList();
                        gP3_AreaViewModel.allTopDisplay = topCenterOnPage.Join(gP3_AreaViewModel.centerDisplay, b => b.STX_ProdKindID, d => d.SDP_GroupProdKindID, (b, d) =>
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
                        gP3_AreaViewModel.allTop = gP3_AreaViewModel.allTopDisplay.Count();
                    }
                    gP3_AreaViewModel.bannerOnPage = gP3_AreaViewModel.boxContent.FindAll(bn => bn.STX_ProdKindID == 1624).ToList();
                    gP3_AreaViewModel.isWhatExpect = gP3_AreaViewModel.boxContent.FindAll(bn => bn.STX_ProdKindID == 1622).ToList();
                    if (gP3_AreaViewModel.isWhatExpect.Count() > 0)
                    {
                        StringBuilder isExpect = new StringBuilder();
                        foreach (var bx in gP3_AreaViewModel.isWhatExpect)
                        {
                            isExpect.Append("," + Regex.Match(bx.STX_URL, @"\d+").Value);
                        }
                        var Result7 = await _dapperWrap.GetRecords<CMScity>(SqlCalls.SQL_CMSContent(isExpect.ToString().Substring(1)));
                        List<CMScity> expectSMS = Result7.ToList();
                        gP3_AreaViewModel.WhatExpect =
                                           from c in expectSMS
                                           select new CMScity
                                           {
                                               CMSID = c.CMSID,
                                               CMS_Title = c.CMS_Title,
                                               CMS_Description = (c.CMS_Description ?? "none") + "|" //to complete with GetSingleCMSTitle(isWhatExpect, c.CMSID)})
                                           };
                    }
                    gP3_AreaViewModel.citesOnCountry = gP3_AreaViewModel.placesOnCountry.FindAll(c => c.CountryID == gP3_AreaViewModel.countryID).ToList();
                    List<WeightPlace> leftlist = new List<WeightPlace>();
                    Int32 lfc = 0;
                    for (Int32 lf = 0; lf < gP3_AreaViewModel.citesOnCountry.Count() - 1; lf++)
                    {
                        if (lf == 0 & gP3_AreaViewModel.citesOnCountry[lf].STR_PlaceAIID < 1000)
                        {
                            leftlist.Add(new WeightPlace() { STR_PlaceTitle = "Popular Cities", STR_PlaceID = 0, STR_PlaceShortInfo = "none" });
                        }
                        if (lf > 0 & gP3_AreaViewModel.citesOnCountry[lf].STR_PlaceAIID == 1000)
                        {
                            lfc = lfc + 1;
                            if (lfc == 1)
                            {
                                leftlist.Add(new WeightPlace() { STR_PlaceTitle = "Other Cities", STR_PlaceID = 0, STR_PlaceShortInfo = "none" });
                            }
                        }
                        leftlist.Add(new WeightPlace() { STR_PlaceTitle = gP3_AreaViewModel.citesOnCountry[lf].STR_PlaceTitle, STR_PlaceID = gP3_AreaViewModel.citesOnCountry[lf].STR_PlaceID, STR_PlaceShortInfo = gP3_AreaViewModel.citesOnCountry[lf].STR_PlaceShortInfo });
                    }
                    gP3_AreaViewModel.leftCountryCityList = leftlist.ToList();
                    string placesIDs = gP3_AreaViewModel.strPlcsIDs.ToString();
                    Int32 _placesIDs = placesIDs.Count() - 1;
                    if (_placesIDs >= 0)
                    {
                        if (placesIDs.Substring(_placesIDs, 1) == ",")
                        {
                            placesIDs = placesIDs.Substring(0, _placesIDs);
                        }
                        List<CombineCountries> dvPlacesToComb = new List<CombineCountries>();
                        var Result9 = await _dapperWrap.GetRecords<CombineCountries>(SqlCalls.SQL_CombineCountries(placesIDs));
                        dvPlacesToComb = Result9.ToList();
                        string chkNA = "";
                        for (var c = 0; c < dvPlacesToComb.Count(); c++)
                        {
                            if (dvPlacesToComb[c].CouID != gP3_AreaViewModel.countryID)
                            {
                                if (dvPlacesToComb[c].CouNA != chkNA)
                                {
                                    gP3_AreaViewModel.arrpCombCountry.Add(dvPlacesToComb[c].CouID + "|" + dvPlacesToComb[c].CouNA);
                                    chkNA = dvPlacesToComb[c].CouNA;
                                }
                            }
                        }
                    }
                    var Result10 = await _dapperWrap.GetRecords<NumberofCustomerFeedbacks>(SqlCalls.SQL_Get_NumberofCustomerFeedbacks_OverAllScore());
                    overAllReviews = Result10.ToList();
                    gP3_AreaViewModel.NumComments = overAllReviews.FirstOrDefault().NumComments;
                    gP3_AreaViewModel.Score = overAllReviews.FirstOrDefault().Score;
                    gP3_AreaViewModel.listReviews = overAllReviews.ToList();

                    ViewBag.PageTitle = gP3_AreaViewModel.pageTitle;
                    ViewBag.pageMetaDesc = gP3_AreaViewModel.pageMetaDesc;
                    ViewBag.pageMetaKey = gP3_AreaViewModel.pageMetaKey;
                    ViewBag.viewUsedName = "GP3_Area";
                    ViewBag.tmpagetype = "area";
                    ViewBag.tmpagetypeinstance = "gp3";
                    ViewBag.tmrowid = "";
                    ViewBag.tmadstatus = "";
                    ViewBag.tmregion = "europe";
                    ViewBag.tmcountry = "";
                    ViewBag.tmdestination = placeName.Replace("_", " ");
                    if (Utilities.CheckMobileDevice() == false)
                    {
                        return View("~/Views/GP3_Area/GP3_Area.cshtml", gP3_AreaViewModel);
                    }
                    else
                    {
                        return View("~/Views/GP3_Area/GP3_Area_Mob.cshtml", gP3_AreaViewModel);
                    }
                }
                else if (placesHierarchies.FirstOrDefault().STR_PageTemplate.IndexOf("GP2") > 0)
                {
                    string name = CityRegCou.Replace("_", " ");
                    MVC_TMED.Models.ViewModels.GP2AreaViewModel viewModelTemplate = new Models.ViewModels.GP2AreaViewModel();
                    var Result1 = await _dapperWrap.GetRecords<PlaceInfo_By_PlaceName>(SqlCalls.SQL_PlaceInfo_By_PlaceName(name));
                    List<PlaceInfo_By_PlaceName> dvPlace = Result1.ToList();
                    if (dvPlace.Count == 0)
                    { throw new Exception("No area informations by name."); }
                    if (dvPlace.Count > 1)
                    {
                        dvPlace = dvPlace.FindAll(x => x.STR_PlaceTypeID == 6);
                    }
                    viewModelTemplate.countryNA = dvPlace[0].CountryNA;
                    viewModelTemplate.areaIDs = dvPlace[0].STRID;
                    viewModelTemplate.areaDES = dvPlace[0].STR_PlaceShortInfo;
                    viewModelTemplate.areaID = dvPlace[0].STR_PlaceID;
                    viewModelTemplate.intNA = dvPlace[0].STR_PlaceTitle;
                    viewModelTemplate.countryID = dvPlace[0].CountryID;
                    viewModelTemplate.cityPLC = dvPlace[0].STR_PlaceID;
                    viewModelTemplate.areaNA = name.Trim();
                    string pageTitle = "Book the Best " + viewModelTemplate.areaNA + " Vacations | " + viewModelTemplate.areaNA + " Flexible trips | " + viewModelTemplate.areaNA + " Itineraries";
                    viewModelTemplate.pageTitle = "Book the Best " + viewModelTemplate.areaNA + " Vacations | " + viewModelTemplate.areaNA + " Flexible trips | " + viewModelTemplate.areaNA + " Itineraries";
                    viewModelTemplate.pageMetaDesc = viewModelTemplate.areaNA + " Vacations travel experts since 1984. Compare and save on " + viewModelTemplate.areaNA + " hotels, packages, sightseeing tours. Fast and easy online booking.";
                    viewModelTemplate.pageMetaKey = viewModelTemplate.areaNA + " air and hotel stays, sightseeing tours, hotel packages, deals, images, online booking, pricing, information, hotel travel, recommendations, resort, accommodations";
                    viewModelTemplate.pageBannerText = "US based|Price & Book in seconds|Discounted Air included";
                    viewModelTemplate.pageHeaderText = viewModelTemplate.areaNA + " Vacation Packages";
                    viewModelTemplate.pageDescriptionCity = viewModelTemplate.pageMetaDesc;
                    var Result2 = await _dapperWrap.GetRecords<Place_Info>(SqlCalls.SQL_Place_Info(viewModelTemplate.areaID.ToString()));
                    List<Place_Info> dvDAT = Result2.ToList();
                    if (dvDAT.Count > 0)
                    {
                        pageTitle = dvDAT[0].SEO_PageTitle ?? pageTitle;
                        viewModelTemplate.pageMetaDesc = dvDAT[0].SEO_MetaDescription ?? viewModelTemplate.pageMetaDesc;
                        viewModelTemplate.pageMetaKey = dvDAT[0].SEO_MetaKeyword ?? viewModelTemplate.pageMetaKey;
                        viewModelTemplate.pageHeaderText = dvDAT[0].SEO_HeaderText ?? viewModelTemplate.pageHeaderText;
                    }
                    var Result3 = await _dapperWrap.GetRecords<Feedback>(SqlCalls.SQL_FeedbacksByPlaceID(viewModelTemplate.areaID));
                    viewModelTemplate.dvCustomFeed = Result3.ToList();
                    foreach (var f in viewModelTemplate.dvCustomFeed)
                    {
                        viewModelTemplate.boxCustomFeed.Add(Utilities.FormatCustomerComment(f.PCC_Comment, 150) + "||" + f.dep_date.ToString() + "|" + f.CountryName + "|" + f.PCC_PDLID + "|" + f.PDL_Title);
                    }
                    if (viewModelTemplate.dvCustomFeed.Count > 0)
                    {
                        viewModelTemplate.packFeedCountCity = viewModelTemplate.dvCustomFeed[0].NoOfComments;
                    }
                    var Result4 = await _dapperWrap.GetRecords<PackOnInterestPriority>(SqlCalls.SQL_PackOnInterestPriorityList(viewModelTemplate.areaIDs.ToString(), "0"));
                    viewModelTemplate.dvPackOnCty = Result4.ToList();
                    viewModelTemplate.featPack = viewModelTemplate.dvPackOnCty.FindAll(n => n.SPPW_Weight < 999);
                    if (viewModelTemplate.featPack.Count == 0)
                    {
                        viewModelTemplate.featPack = viewModelTemplate.featPack.FindAll(n => n.PDL_SequenceNo < 9);
                    }
                    viewModelTemplate.listFeatItin = viewModelTemplate.featPack;
                    viewModelTemplate.listFeatured = viewModelTemplate.dvPackOnCty.Take(1).ToList();
                    viewModelTemplate.otherFeatured = viewModelTemplate.dvPackOnCty.Take(1..5).ToList();
                    foreach (var pk in viewModelTemplate.featPack)
                    {
                        viewModelTemplate.boxFeaturPacks.Add(pk.PDLID + "|" + pk.PDL_Title + "|" + pk.SPD_Description + "|" + pk.PDL_Duration + "|" + pk.STP_Save_ + "|" + pk.PDL_Content + "|" + pk.NoOfFeed + "|" + pk.SPD_InternalComments + "|" + pk.IMG_Path_URL);
                        viewModelTemplate.strPlcsIDs.Append(pk.PDL_Places);
                    }
                    var first3 = viewModelTemplate.featPack.Take(3).ToList();
                    var packid3 = "";
                    var iC = 0;
                    foreach (var d in first3)
                    {
                        if (iC < first3.Count - 1) { packid3 = packid3 + "'" + d.PDLID + "', "; } else { packid3 = packid3 + "'" + d.PDLID + "'"; };
                        iC++;
                    };
                    var Result5 = await _dapperWrap.GetRecords<DisplayArea>(SqlCalls.SQL_ManagerDisplayArea(viewModelTemplate.areaID));
                    List<DisplayArea> managerDisplay = Result5.ToList();
                    viewModelTemplate.leftDisplay = managerDisplay.FindAll(c => c.SDP_DisplayProdKindID == 1877).ToList();
                    List<DisplayArea> centerDisplay = managerDisplay.FindAll(c => c.SDP_DisplayProdKindID == 1878).ToList();
                    var Result6 = await _dapperWrap.GetRecords<BoxContent>(SqlCalls.SQL_BoxesContentArea(viewModelTemplate.areaIDs));
                    viewModelTemplate.boxContent = Result6.ToList();
                    foreach (var b in viewModelTemplate.boxContent)
                    {
                        b.STX_URL = b.STX_URL.Replace("https://www.tripmasters.com/europe", "").Replace("http://www.tripmasters.com/europe", "");
                    }
                    if (centerDisplay.Count > 0)
                    {
                        viewModelTemplate.topCenterOnPage = viewModelTemplate.boxContent.FindAll(c => c.STX_ProdKindID == 1983).ToList();
                        viewModelTemplate.allTopDisplay = viewModelTemplate.topCenterOnPage.Join(centerDisplay, b => b.STX_ProdKindID, d => d.SDP_GroupProdKindID, (b, d) =>
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
                        Int32 allTop = viewModelTemplate.allTopDisplay.Count;
                    }
                    viewModelTemplate.bannerOnPage = viewModelTemplate.boxContent.FindAll(bn => bn.STX_ProdKindID == 1624).ToList();
                    var Result7 = await _dapperWrap.GetRecords<WeightPlace>(SqlCalls.SQL_weightPlacesByIntID(0, viewModelTemplate.areaIDs));
                    viewModelTemplate.placesOnWeight = Result7.ToList();
                    viewModelTemplate.citesOnWeight = viewModelTemplate.placesOnWeight.FindAll(c => c.CountryID == viewModelTemplate.countryID).ToList();
                    viewModelTemplate.citesnotOnWeight = viewModelTemplate.placesOnWeight.FindAll(c => c.CountryID != viewModelTemplate.countryID).ToList();
                    var Result8 = await _dapperWrap.GetRecords<WeightPlace>(SqlCalls.SQL_CountryCitiesByplcID(0, viewModelTemplate.countryID));
                    viewModelTemplate.placesOnCountry = Result8.ToList();
                    viewModelTemplate.citesOnCountry = viewModelTemplate.placesOnCountry.FindAll(c => c.CountryID == viewModelTemplate.countryID).ToList();
                    var Result9 = await _dapperWrap.GetRecords<NumberofCustomerFeedbacks>(SqlCalls.SQL_Get_NumberofCustomerFeedbacks_OverAllScore());
                    List<NumberofCustomerFeedbacks> overAllReviews = Result9.ToList();
                    viewModelTemplate.NumComments = overAllReviews.FirstOrDefault().NumComments;
                    viewModelTemplate.Score = overAllReviews.FirstOrDefault().Score;

                    ViewBag.PageTitle = viewModelTemplate.pageTitle;
                    ViewBag.pageMetaDesc = viewModelTemplate.pageMetaDesc;
                    ViewBag.pageMetaKey = viewModelTemplate.pageMetaKey;
                    ViewBag.viewUsedName = "GP2_Area";
                    ViewBag.tmpagetype = "area";
                    ViewBag.tmpagetypeinstance = "gp2";
                    ViewBag.tmrowid = "";
                    ViewBag.tmadstatus = "";
                    ViewBag.tmregion = "europe";
                    ViewBag.tmcountry = "";
                    ViewBag.tmdestination = placeName.Replace("_", " ");
                    if (Utilities.CheckMobileDevice() == false)
                    {
                        return View("~/Views/GP2_Area/GP2_Area.cshtml", viewModelTemplate);
                    }
                    else
                    {
                        return View("~/Views/GP2_Area/GP2_Area_Mob.cshtml", viewModelTemplate);
                    }
                }
            }
            else if (placesHierarchies.First().STR_PlacePriority == 2)
            {
                var initClass = new GP3_SecondaryDestinationClass(_dapperWrap);
                var model = await initClass.GP3_SecondaryDestination(CityRegCou);
                ViewBag.PageTitle = model.pageTitle;
                ViewBag.pageMetaDesc = model.pageMetaDesc;
                ViewBag.pageMetaKey = model.pageMetaKey;
                ViewBag.viewUsedName = "GP3_SecondaryDestination";
                ViewBag.tmpagetype = "secondary";
                ViewBag.tmpagetypeinstance = "gp3";
                ViewBag.tmrowid = "";
                ViewBag.tmadstatus = "";
                ViewBag.tmregion = "europe";
                ViewBag.tmcountry = "";
                ViewBag.tmdestination = placeName.Replace("_", " ");
                return View("~/Views/GP3_SecondaryDestination/GP3_SecondaryDestination.cshtml", model);
            }
            return BadRequest();
        }
    }
}