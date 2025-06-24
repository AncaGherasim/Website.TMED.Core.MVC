using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MVC_TMED.Infrastructure;
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
    public class GP2_AreaClass
    {
        private readonly IOptions<AppSettings> _appSettings;
        private readonly DapperWrap _dapperWrap;

        //[ResponseCache(Duration = 30, Location = ResponseCacheLocation.Client)]
        public GP2_AreaClass(DapperWrap dapperWrap, IOptions<AppSettings> appSettings)
        {
            _appSettings = appSettings;
            _dapperWrap = dapperWrap;
        }

        //[HttpGet("Area/{name}/Vacations", Name = "GP2_Area_Route")]
        public async Task<GP2AreaViewModel> GP2_Area(string name)  
        {
            name = name.Replace("_", " ");
            string PackageView = "";
            MVC_TMED.Models.ViewModels.GP2AreaViewModel viewModelTemplate = new Models.ViewModels.GP2AreaViewModel();
            
            //SQL STRING QUERIES TO RETRIEVE ALL PAGE INFO NEEDED.
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

            //ViewBag.PageTitle = viewModelTemplate.areaNA;
            
            //DECLARE TITLE AND METAS TO THIS PAGE
            string pageTitle = "Book the Best " + viewModelTemplate.areaNA + " Vacations | " + viewModelTemplate.areaNA + " Flexible trips | " + viewModelTemplate.areaNA + " Itineraries";
            viewModelTemplate.pageMetaDesc = viewModelTemplate.areaNA + " Vacations travel experts since 1984. Compare and save on " + viewModelTemplate.areaNA + " hotels, packages, sightseeing tours. Fast and easy online booking.";
            viewModelTemplate.pageMetaKey = viewModelTemplate.areaNA + " air and hotel stays, sightseeing tours, hotel packages, deals, images, online booking, pricing, information, hotel travel, recommendations, resort, accommodations";
            viewModelTemplate.pageBannerText = "US based|Price & Book in seconds|Discounted Air included";
            viewModelTemplate.pageHeaderText = viewModelTemplate.areaNA;
            viewModelTemplate.pageDescriptionCity = viewModelTemplate.pageMetaDesc;

            //ViewBag.PageTitle = pageTitle;
            //ViewBag.pageMetaDesc = viewModelTemplate.pageMetaDesc;
            //ViewBag.pageMetaKey = viewModelTemplate.pageMetaKey;

            //MODIFY OR REMOVE/ADD DINAMICALLY Title and meta on Master Page
            var Result2 = await _dapperWrap.GetRecords<Place_Info>(SqlCalls.SQL_Place_Info(viewModelTemplate.areaID.ToString()));
            List<Place_Info> dvDAT = Result2.ToList();
            if (dvDAT.Count > 0)
            {
                pageTitle = dvDAT[0].SEO_PageTitle ?? pageTitle;
                viewModelTemplate.pageMetaDesc = dvDAT[0].SEO_MetaDescription ?? viewModelTemplate.pageMetaDesc;
               
            }
            //--- MODIFY ---
            //????????????????

            //Customer Feedbacks by Area ID
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

            //Packages Priority List
            var Result4 = await _dapperWrap.GetRecords<PackOnInterestPriority>(SqlCalls.SQL_PackOnInterestPriorityList(viewModelTemplate.areaIDs.ToString(), "0"));
            viewModelTemplate.dvPackOnCty = Result4.ToList();
            viewModelTemplate.featPack = viewModelTemplate.dvPackOnCty.FindAll(n => n.SPPW_Weight < 999);

            if (viewModelTemplate.featPack.Count == 0)
            {
                viewModelTemplate.featPack = viewModelTemplate.featPack.FindAll(n => n.PDL_SequenceNo < 9);
            }
            viewModelTemplate.listFeatItin = viewModelTemplate.featPack;
            viewModelTemplate.listFeatured = viewModelTemplate.dvPackOnCty.Take(1).ToList();
            viewModelTemplate.otherFeatured = viewModelTemplate.dvPackOnCty.Skip(1).Take(4).ToList();
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

            //CONTENT LIKE MANAGER SELECTION
            var Result5 = await _dapperWrap.GetRecords<DisplayArea>(SqlCalls.SQL_ManagerDisplayArea(viewModelTemplate.areaID));
            List<DisplayArea> managerDisplay = Result5.ToList();
            viewModelTemplate.leftDisplay = managerDisplay.FindAll(c => c.SDP_DisplayProdKindID == 1877).ToList();
            List<DisplayArea> centerDisplay = managerDisplay.FindAll(c => c.SDP_DisplayProdKindID == 1878).ToList();

            //Boxes Content
            var Result6 = await _dapperWrap.GetRecords<BoxContent>(SqlCalls.SQL_BoxesContentArea(viewModelTemplate.areaIDs));
            viewModelTemplate.boxContent = Result6.ToList();
            foreach (var b in viewModelTemplate.boxContent)
            {
                b.STX_URL = b.STX_URL.Replace("https://www.tripmasters.com/europe", "").Replace("http://www.tripmasters.com/europe", "");
            }

            //TOP DISPLAY ON CENTER COLUMN
            if (centerDisplay.Count > 0)
            {
                viewModelTemplate.topCenterOnPage = viewModelTemplate.boxContent.FindAll(c => c.STX_ProdKindID == 1983).ToList();
                viewModelTemplate.allTopDisplay = viewModelTemplate.topCenterOnPage.Join(centerDisplay, b => b.STX_ProdKindID, d => d.SDP_GroupProdKindID, (b, d) =>
                        new DisplayBox
                        {
                            CMS_Content = b.CMS_Content,
                            STX_CMSID = b.STX_CMSID,
                            STX_Description = b.STX_Description
                        ,
                            STX_PictureHeightpx = b.STX_PictureHeightpx,
                            STX_PictureURL = b.STX_PictureURL
                        ,
                            STX_PictureWidthpx = b.STX_PictureWidthpx,
                            STX_Priority = b.STX_Priority
                        ,
                            STX_ProdKindID = b.STX_ProdKindID,
                            STX_Title = b.STX_Title
                        ,
                            STX_URL = b.STX_URL,
                            SDP_DisplayTitle = d.SDP_DisplayTitle,
                            SDP_TitleBGColor = d.SDP_TitleBGColor
                        }).ToList();
                Int32 allTop = viewModelTemplate.allTopDisplay.Count;
            }

            //BANNERS TO DISPLAY ON CENTER COLUMN - PACKAGES LIST
            viewModelTemplate.bannerOnPage = viewModelTemplate.boxContent.FindAll(bn => bn.STX_ProdKindID == 1624).ToList();

            //TO KNOW CITIES ON COUNTRY
            var Result7 = await _dapperWrap.GetRecords<WeightPlace>(SqlCalls.SQL_weightPlacesByIntID(0, viewModelTemplate.areaIDs));
            viewModelTemplate.placesOnWeight = Result7.ToList();
            viewModelTemplate.citesOnWeight = viewModelTemplate.placesOnWeight.FindAll(c => c.CountryID == viewModelTemplate.countryID).ToList();
            viewModelTemplate.citesnotOnWeight = viewModelTemplate.placesOnWeight.FindAll(c => c.CountryID != viewModelTemplate.countryID).ToList();

            //TO KNOW CITIES ON COUNTRY
            var Result8 = await _dapperWrap.GetRecords<WeightPlace>(SqlCalls.SQL_CountryCitiesByplcID(0, viewModelTemplate.countryID));
            viewModelTemplate.placesOnCountry = Result8.ToList();
            viewModelTemplate.citesOnCountry = viewModelTemplate.placesOnCountry.FindAll(c => c.CountryID == viewModelTemplate.countryID).ToList();

            //CUSTOMER REVIEW Total
            var Result9 = await _dapperWrap.GetRecords<NumberofCustomerFeedbacks>(SqlCalls.SQL_Get_NumberofCustomerFeedbacks_OverAllScore());
            List<NumberofCustomerFeedbacks> overAllReviews = Result9.ToList();
            viewModelTemplate.NumComments = overAllReviews.FirstOrDefault().NumComments;
            viewModelTemplate.Score = overAllReviews.FirstOrDefault().Score;
            //ViewBag.PageType = "ListingPage";
            //ViewBag.CriteoIDs = packid3;

            //var Result10 = await _dapperWrap.GetRecords<BoxContent>(SqlCalls.SQL_BoxesContentArea(viewModelTemplate.areaIDs));
            //viewModelTemplate.boxContent = Result6.ToList();

            //viewModelTemplate.centerDsp = viewModelTemplate.boxContent.FindAll(x => x.STX_ProdKindID == 1983).ToList();

            return viewModelTemplate;
            
        }

        //public async Task<IActionResult> Desktop(string name)
        //{
        //    name = name.Replace("_", " ");
        //    string PackageView = "";
        //    MVC_TMED.Models.ViewModels.AreaViewModel viewModelTemplate = new Models.ViewModels.AreaViewModel();
        //    var Result1 = await _dapperWrap.GetRecords<CMS_WebsiteContent>(SqlCalls.SQL_PageTemplate_Places_Hierarchy("6", name));
        //    List<CMS_WebsiteContent> dvArea = Result1.ToList();
        //    if (dvArea.Count == 0)
        //    {
        //        PackageView = "A_Area";
        //        return View(PackageView, viewModelTemplate);
        //    }

        //    //SQL STRING QUERIES TO RETRIEVE ALL PAGE INFO NEEDED.
        //    var Result2 = await _dapperWrap.GetRecords<PlaceInfo_By_PlaceName>(SqlCalls.SQL_PlaceInfo_By_PlaceName(name));
        //    List<PlaceInfo_By_PlaceName> dvPlace = Result2.ToList();
        //    if (dvPlace.Count == 0)
        //    { throw new Exception("No area informations by name."); }
        //    if (dvPlace.Count > 1)
        //    {
        //        dvPlace = dvPlace.FindAll(x => x.STR_PlaceTypeID == 6);
        //    }
        //    viewModelTemplate.countryNA = dvPlace[0].CountryNA;
        //    viewModelTemplate.areaIDs = dvPlace[0].STRID;
        //    viewModelTemplate.areaDES = dvPlace[0].STR_PlaceShortInfo;
        //    viewModelTemplate.areaID = dvPlace[0].STR_PlaceID;
        //    viewModelTemplate.intNA = dvPlace[0].STR_PlaceTitle;
        //    viewModelTemplate.countryID = dvPlace[0].CountryID;
        //    viewModelTemplate.cityPLC = dvPlace[0].STR_PlaceID;
        //    viewModelTemplate.areaNA = name.Trim();

        //    ViewBag.PageTitle = viewModelTemplate.areaNA;
        //    if ((dvArea[0].CMS_Content).Contains("GP2"))
        //    {
        //        //DECLARE TITLE AND METAS TO THIS PAGE
        //        string pageTitle = "Book the Best " + viewModelTemplate.areaNA + " Vacations | " + viewModelTemplate.areaNA + " Flexible trips | " + viewModelTemplate.areaNA + " Itineraries";
        //        viewModelTemplate.pageMetaDesc = viewModelTemplate.areaNA + " Vacations travel experts since 1984. Compare and save on " + viewModelTemplate.areaNA + " hotels, packages, sightseeing tours. Fast and easy online booking.";
        //        viewModelTemplate.pageMetaKey = viewModelTemplate.areaNA + " air and hotel stays, sightseeing tours, hotel packages, deals, images, online booking, pricing, information, hotel travel, recommendations, resort, accommodations";
        //        viewModelTemplate.pageBannerText = "US based|Price & Book in seconds|Discounted Air included";
        //        viewModelTemplate.pageHeaderText = viewModelTemplate.areaNA;
        //        viewModelTemplate.pageDescriptionCity = viewModelTemplate.pageMetaDesc;

        //        ViewBag.PageTitle = pageTitle;
        //        ViewBag.pageMetaDesc = viewModelTemplate.pageMetaDesc;
        //        ViewBag.pageMetaKey = viewModelTemplate.pageMetaKey;

        //        //MODIFY OR REMOVE/ADD DINAMICALLY Title and meta on Master Page
        //        var Result3 = await _dapperWrap.GetRecords<Place_Info>(SqlCalls.SQL_Place_Info(viewModelTemplate.areaID.ToString()));
        //        List<Place_Info> dvDAT = Result3.ToList();
        //        if (dvDAT.Count > 0)
        //        {
        //            pageTitle = dvDAT[0].SEO_PageTitle ?? pageTitle;
        //            viewModelTemplate.pageMetaDesc = dvDAT[0].SEO_MetaDescription ?? viewModelTemplate.pageMetaDesc;
        //            viewModelTemplate.pageMetaKey = dvDAT[0].SEO_MetaKeyword ?? viewModelTemplate.pageMetaKey;
        //            viewModelTemplate.pageHeaderText = dvDAT[0].SEO_HeaderText ?? viewModelTemplate.pageHeaderText;
        //        }
        //        //--- MODIFY ---
        //        //????????????????

        //        //Customer Feedbacks by Area ID
        //        var Result4 = await _dapperWrap.GetRecords<Feedback>(SqlCalls.SQL_FeedbacksByPlaceID(viewModelTemplate.areaID));
        //        List<Feedback> dvCustomFeed = Result4.ToList();
        //        foreach (var f in dvCustomFeed)
        //        {
        //            viewModelTemplate.boxCustomFeed.Add(Utilities.FormatCustomerComment(f.PCC_Comment, 150) + "||" + f.dep_date.ToString() + "|" + f.CountryName + "|" + f.PCC_PDLID + "|" + f.PDL_Title);
        //        }
        //        if (dvCustomFeed.Count > 0)
        //        {
        //            viewModelTemplate.packFeedCountCity = dvCustomFeed[0].NoOfComments;
        //        }

        //        //Packages Priority List
        //        var Result5 = await _dapperWrap.GetRecords<PackOnInterestPriority>(SqlCalls.SQL_PackOnInterestPriorityList(viewModelTemplate.areaIDs.ToString(), "0"));
        //        List<PackOnInterestPriority> dvPackOnCty = Result5.ToList();
        //        List<PackOnInterestPriority> featPack = dvPackOnCty.FindAll(n => n.SPPW_Weight < 999);

        //        if (featPack.Count == 0)
        //        {
        //            featPack = featPack.FindAll(n => n.PDL_SequenceNo < 9);
        //        }
        //        viewModelTemplate.listFeatItin = featPack;
        //        viewModelTemplate.listFeatured = dvPackOnCty.Take(1).ToList();
        //        viewModelTemplate.otherFeatured = dvPackOnCty.Skip(1).Take(4).ToList();
        //        foreach (var pk in featPack)
        //        {
        //            viewModelTemplate.boxFeaturPacks.Add(pk.PDLID + "|" + pk.PDL_Title + "|" + pk.SPD_Description + "|" + pk.PDL_Duration + "|" + pk.STP_Save_ + "|" + pk.PDL_Content + "|" + pk.NoOfFeed + "|" + pk.SPD_InternalComments + "|" + pk.IMG_Path_URL);
        //            viewModelTemplate.strPlcsIDs.Append(pk.PDL_Places);
        //        }
        //        var first3 = featPack.Take(3).ToList();
        //        var packid3 = "";
        //        var iC = 0;
        //        foreach (var d in first3)
        //        {
        //            if (iC < first3.Count - 1) { packid3 = packid3 + "'" + d.PDLID + "', "; } else { packid3 = packid3 + "'" + d.PDLID + "'"; };
        //            iC++;
        //        };

        //        //CONTENT LIKE MANAGER SELECTION
        //        var Result6 = await _dapperWrap.GetRecords<DisplayArea>(SqlCalls.SQL_ManagerDisplayArea(viewModelTemplate.areaID));
        //        List<DisplayArea> managerDisplay = Result6.ToList();
        //        viewModelTemplate.leftDisplay = managerDisplay.FindAll(c => c.SDP_DisplayProdKindID == 1877).ToList();
        //        List<DisplayArea> centerDisplay = managerDisplay.FindAll(c => c.SDP_DisplayProdKindID == 1878).ToList();

        //        //Boxes Content
        //        var Result7 = await _dapperWrap.GetRecords<BoxContent>(SqlCalls.SQL_BoxesContentArea(viewModelTemplate.areaIDs));
        //        viewModelTemplate.boxContent = Result7.ToList();

        //        //TOP DISPLAY ON CENTER COLUMN
        //        if (centerDisplay.Count > 0)
        //        {
        //            List<BoxContent> topCenterOnPage = viewModelTemplate.boxContent.FindAll(c => c.STX_ProdKindID == 1983).ToList();
        //            viewModelTemplate.allTopDisplay = topCenterOnPage.Join(centerDisplay, b => b.STX_ProdKindID, d => d.SDP_GroupProdKindID, (b, d) =>
        //                 new DisplayBox
        //                 {
        //                     CMS_Content = b.CMS_Content,
        //                     STX_CMSID = b.STX_CMSID,
        //                     STX_Description = b.STX_Description
        //                    ,
        //                     STX_PictureHeightpx = b.STX_PictureHeightpx,
        //                     STX_PictureURL = b.STX_PictureURL
        //                    ,
        //                     STX_PictureWidthpx = b.STX_PictureWidthpx,
        //                     STX_Priority = b.STX_Priority
        //                    ,
        //                     STX_ProdKindID = b.STX_ProdKindID,
        //                     STX_Title = b.STX_Title
        //                    ,
        //                     STX_URL = b.STX_URL,
        //                     SDP_DisplayTitle = d.SDP_DisplayTitle,
        //                     SDP_TitleBGColor = d.SDP_TitleBGColor
        //                 }).ToList();
        //            Int32 allTop = viewModelTemplate.allTopDisplay.Count;
        //        }

        //        //BANNERS TO DISPLAY ON CENTER COLUMN - PACKAGES LIST
        //        viewModelTemplate.bannerOnPage = viewModelTemplate.boxContent.FindAll(bn => bn.STX_ProdKindID == 1624).ToList();

        //        //TO KNOW CITIES ON COUNTRY
        //        var Result8 = await _dapperWrap.GetRecords<WeightPlace>(SqlCalls.SQL_weightPlacesByIntID(0, viewModelTemplate.areaIDs));
        //        viewModelTemplate.placesOnWeight = Result8.ToList();
        //        viewModelTemplate.citesOnWeight = viewModelTemplate.placesOnWeight.FindAll(c => c.CountryID == viewModelTemplate.countryID).ToList();
        //        viewModelTemplate.citesnotOnWeight = viewModelTemplate.placesOnWeight.FindAll(c => c.CountryID != viewModelTemplate.countryID).ToList();

        //        //TO KNOW CITIES ON COUNTRY
        //        var Result9 = await _dapperWrap.GetRecords<WeightPlace>(SqlCalls.SQL_CountryCitiesByplcID(0, viewModelTemplate.countryID));
        //        viewModelTemplate.placesOnCountry = Result9.ToList();
        //        viewModelTemplate.citesOnCountry = viewModelTemplate.placesOnCountry.FindAll(c => c.CountryID == viewModelTemplate.countryID).ToList();

        //        //CUSTOMER REVIEW Total
        //        var Result10 = await _dapperWrap.GetRecords<NumberofCustomerFeedbacks>(SqlCalls.SQL_Get_NumberofCustomerFeedbacks_OverAllScore());
        //        List<NumberofCustomerFeedbacks> overAllReviews = Result10.ToList();
        //        viewModelTemplate.NumComments = overAllReviews.FirstOrDefault().NumComments;
        //        viewModelTemplate.Score = overAllReviews.FirstOrDefault().Score;
        //        ViewBag.PageType = "ListingPage";
        //        ViewBag.CriteoIDs = packid3;

        //        PackageView = "GP2_Area";


        //    }
        //    else
        //    {
        //        var result11 = await _dapperWrap.GetRecords<plcExtension>(SqlCalls.SQL_GetHiglightsByPlaceID(viewModelTemplate.areaID.ToString(), true));
        //        viewModelTemplate.Highlights = result11.ToList().FindAll(x => x.STX_ProdKindID > 1618 && x.STX_ProdKindID < 1624);

        //        var result12 = await _dapperWrap.GetRecords<PlacesInterest>(SqlCalls.SQL_GetCitiesAArea(viewModelTemplate.areaID.ToString()));
        //        viewModelTemplate.Cities = result12.ToList();
        //        string CityIDS = "";
        //        foreach (var c in viewModelTemplate.Cities)
        //        {
        //            if (CityIDS == "")
        //            {
        //                CityIDS = c.STR_PlaceID.ToString();
        //            }
        //            else
        //            {
        //                CityIDS = CityIDS + "," + c.STR_PlaceID.ToString();
        //            }
        //        }

        //        var Result13 = await _dapperWrap.GetRecords<CitiesRelatedItin>(SqlCalls.SQL_GetItinAArea(CityIDS, 1));
        //        viewModelTemplate.CitiesRelatedItin = Result13.ToList();
        //        var first3 = viewModelTemplate.CitiesRelatedItin.Take(3).ToList();
        //        var packid3 = "";
        //        var iC = 0;
        //        foreach (var d in first3)
        //        {
        //            if (iC < first3.Count - 1) { packid3 = packid3 + "'" + d.PDLID + "', "; } else { packid3 = packid3 + "'" + d.PDLID + "'"; };
        //            iC++;
        //        };

        //        var result14 = await _dapperWrap.GetRecords<CMS_WebsiteContent>(SqlCalls.SQL_GetAreaCitiesCombine(viewModelTemplate.areaID.ToString()));
        //        List<CMS_WebsiteContent> allPlacesON = result14.ToList();
        //        string sXML = "<Cities>";
        //        foreach (var n in allPlacesON)
        //        {
        //            string[] ids = n.CMS_Content.Split(",");
        //            for (Int32 i = 0; i < ids.Length; i++)
        //            {
        //                if (ids[i].Trim() != "")
        //                {
        //                    sXML = sXML + "<id>" + ids[i].Trim() + "</id>";
        //                }
        //            }
        //        }
        //        sXML = sXML + "</Cities>";
        //        var result15 = await _dapperWrap.GetRecords<PlaceInfo_By_PlaceName>(SqlCalls.SQL_AreaCombineFromXML(sXML, 1, ""));
        //        viewModelTemplate.dvTopPlaces = result15.ToList();

        //        var result16 = await _dapperWrap.GetRecords<CustomerFeed>(SqlCalls.SQL_AAreaFeedback(viewModelTemplate.areaID.ToString()));
        //        List<CustomerFeed> dvCustFeed = result16.ToList();
        //        viewModelTemplate.TotalCustFeed = dvCustFeed.Count;
        //        ViewBag.PageType = "ListingPage";
        //        ViewBag.CriteoIDs = packid3;

        //        //Cookie for marketing Compain
        //        string strURL = HttpContext.Request.Path;
        //        string sCampaignCode = "";
        //        if (HttpContext.Request.Query["utm_campaign"] != "")
        //        {
        //            sCampaignCode = HttpContext.Request.Query["utm_campaign"];
        //        }
        //        else
        //        {
        //            if (strURL.Contains("utm_campaign"))
        //            {
        //                sCampaignCode = strURL.Replace(strURL.Substring(1, strURL.IndexOf("utm_campaign=") - 1), "");
        //                sCampaignCode = sCampaignCode.Replace("utm_campaign=", "");
        //                if (sCampaignCode.Contains("&"))
        //                {
        //                    string[] strParts = sCampaignCode.Split("&");
        //                    sCampaignCode = strParts[0];
        //                }
        //            }
        //        }
        //        if (sCampaignCode == null)
        //        {
        //            if (HttpContext.Request.Cookies["utmcampaign"] == null)
        //            {
        //                sCampaignCode = "eurodesk-bp";
        //            }
        //            else
        //            {
        //                string _utmcampaign = HttpContext.Request.Cookies["utmcampaign"];
        //                if (HttpContext.Request.Cookies["utmcampaign"].StartsWith("a="))
        //                {
        //                    _utmcampaign = HttpContext.Request.Cookies["utmcampaign"].Substring(2, _utmcampaign.Length - 2);
        //                }
        //                sCampaignCode = System.Text.Encodings.Web.HtmlEncoder.Default.Encode(_utmcampaign);
        //            }
        //        }
        //        Microsoft.AspNetCore.Http.CookieOptions optionUtmCampaign = new Microsoft.AspNetCore.Http.CookieOptions();
        //        optionUtmCampaign.Domain = ".tripmasters.com";
        //        optionUtmCampaign.IsEssential = true;
        //        optionUtmCampaign.Expires = DateTime.Now.AddDays(365);
        //        HttpContext.Response.Cookies.Append("utmcampaign", sCampaignCode, optionUtmCampaign);

        //        PackageView = "A_Area";
        //    }
        //    return View(PackageView, viewModelTemplate);
        //}

        //public async Task<IActionResult> Mobile(string name)
        //{
        //    name = name.Replace("_", " ");
        //    var Result1 = await _dapperWrap.GetRecords<CMS_WebsiteContent>(SqlCalls.SQL_PageTemplate_Places_Hierarchy("6", name));
        //    List<CMS_WebsiteContent> dvArea = Result1.ToList();
        //    if (dvArea.Count == 0)
        //    {
        //        throw new Exception("Area " + name + " no Template row.");
        //    }
        //    string PackageView = "";
        //    MVC_TMED.Models.ViewModels.AreaViewModel viewModelTemplate = new Models.ViewModels.AreaViewModel();

        //    //SQL STRING QUERIES TO RETRIEVE ALL PAGE INFO NEEDED.
        //    var Result2 = await _dapperWrap.GetRecords<PlaceInfo_By_PlaceName>(SqlCalls.SQL_PlaceInfo_By_PlaceName(name));
        //    List<PlaceInfo_By_PlaceName> dvPlace = Result2.ToList();
        //    if (dvPlace.Count == 0)
        //    { throw new Exception("No area informations by name."); }

        //    viewModelTemplate.countryNA = dvPlace[0].CountryNA;
        //    viewModelTemplate.areaIDs = dvPlace[0].STRID;
        //    viewModelTemplate.areaID = dvPlace[0].STR_PlaceID;
        //    viewModelTemplate.intNA = dvPlace[0].STR_PlaceTitle;
        //    viewModelTemplate.countryID = dvPlace[0].CountryID;
        //    viewModelTemplate.areaNA = name.Trim();
        //    if ((dvArea[0].CMS_Content).Contains("GP2"))
        //    {
        //        //DECLARE TITLE AND METAS TO THIS PAGE
        //        string pageTitle = "Book the Best " + viewModelTemplate.areaNA + " Vacations | " + viewModelTemplate.areaNA + " Flexible trips | " + viewModelTemplate.areaNA + " Itineraries";
        //        viewModelTemplate.pageMetaDesc = viewModelTemplate.areaNA + " Vacations travel experts since 1984. Compare and save on " + viewModelTemplate.areaNA + " hotels, packages, sightseeing tours. Fast and easy online booking.";
        //        viewModelTemplate.pageMetaKey = viewModelTemplate.areaNA + " air and hotel stays, sightseeing tours, hotel packages, deals, images, online booking, pricing, information, hotel travel, recommendations, resort, accommodations";
        //        viewModelTemplate.pageBannerText = "US based|Price & Book in seconds|Discounted Air included";
        //        viewModelTemplate.pageHeaderText = viewModelTemplate.areaNA;
        //        viewModelTemplate.pageDescriptionCity = viewModelTemplate.pageMetaDesc;

        //        ViewBag.PageTitle = pageTitle;
        //        ViewBag.pageMetaDesc = viewModelTemplate.pageMetaDesc;
        //        ViewBag.pageMetaKey = viewModelTemplate.pageMetaKey;

        //        //MODIFY OR REMOVE/ADD DINAMICALLY Title and meta on Master Page
        //        var Result3 = await _dapperWrap.GetRecords<Place_Info>(SqlCalls.SQL_Place_Info(viewModelTemplate.areaID.ToString()));
        //        List<Place_Info> dvDAT = Result3.ToList();
        //        if (dvDAT.Count > 0)
        //        {
        //            pageTitle = dvDAT[0].SEO_PageTitle ?? pageTitle;
        //            viewModelTemplate.pageMetaDesc = dvDAT[0].SEO_MetaDescription ?? viewModelTemplate.pageMetaDesc;
        //            viewModelTemplate.pageMetaKey = dvDAT[0].SEO_MetaKeyword ?? viewModelTemplate.pageMetaKey;
        //            viewModelTemplate.pageHeaderText = dvDAT[0].SEO_HeaderText ?? viewModelTemplate.pageHeaderText;
        //        }
        //        //Packages Priority List
        //        var Result4 = await _dapperWrap.GetRecords<PackOnInterestPriority>(SqlCalls.SQL_PackOnInterestPriorityList(viewModelTemplate.areaIDs.ToString(), "0"));
        //        List<PackOnInterestPriority> dvPackOnCty = Result4.ToList();
        //        viewModelTemplate.featPack = dvPackOnCty.FindAll(n => n.SPPW_Weight < 999);
        //        if (viewModelTemplate.featPack.Count == 0)
        //        {
        //            viewModelTemplate.featPack = dvPackOnCty.FindAll(n => n.PDL_SequenceNo < 9);
        //        }
        //        viewModelTemplate.listFeatItin = viewModelTemplate.featPack;
        //        foreach (var pk in viewModelTemplate.featPack)
        //        {
        //            viewModelTemplate.boxFeaturPacks.Add(pk.PDLID + "|" + pk.PDL_Title + "|" + pk.SPD_Description + "|" + pk.PDL_Duration + "|" + pk.STP_Save_ + "|" + pk.PDL_Content + "|" + pk.NoOfFeed + "|" + pk.SPD_InternalComments + "|" + pk.IMG_Path_URL);
        //            viewModelTemplate.strPlcsIDs.Append(pk.PDL_Places);
        //        }
        //        var first3 = viewModelTemplate.featPack.Take(3).ToList();
        //        var packid3 = "";
        //        var iC = 0;
        //        foreach (var d in first3)
        //        {
        //            if (iC < first3.Count - 1) { packid3 = packid3 + "'" + d.PDLID + "', "; } else { packid3 = packid3 + "'" + d.PDLID + "'"; };
        //            iC++;
        //        };

        //        //CONTENT LIKE MANAGER SELECTION
        //        var Result5 = await _dapperWrap.GetRecords<DisplayArea>(SqlCalls.SQL_ManagerDisplayArea(viewModelTemplate.areaID));
        //        viewModelTemplate.managerDisplay = Result5.ToList();



        //        //TO KNOW CITIES ON COUNTRY
        //        var Result7 = await _dapperWrap.GetRecords<WeightPlace>(SqlCalls.SQL_CountryCitiesByplcID(0, viewModelTemplate.countryID));
        //        viewModelTemplate.placesOnCountry = Result7.ToList();
        //        viewModelTemplate.citesOnCountry = viewModelTemplate.placesOnCountry.FindAll(c => c.CountryID == viewModelTemplate.countryID).ToList();


        //        // CUSTOMER REVIEW Total
        //        var Result8 = await _dapperWrap.GetRecords<NumberofCustomerFeedbacks>(SqlCalls.SQL_Get_NumberofCustomerFeedbacks_OverAllScore());
        //        List<NumberofCustomerFeedbacks> overAllReviews = Result8.ToList();
        //        viewModelTemplate.NumComments = overAllReviews.FirstOrDefault().NumComments;
        //        viewModelTemplate.Score = overAllReviews.FirstOrDefault().Score;

        //        //Customer Feedbacks by Area ID
        //        var Result9 = await _dapperWrap.GetRecords<Feedback>(SqlCalls.SQL_FeedbacksByPlaceID(viewModelTemplate.areaID));
        //        viewModelTemplate.listReviews = Result9.ToList();
        //        foreach (var f in viewModelTemplate.listReviews)
        //        {
        //            viewModelTemplate.boxCustomFeed.Add(Utilities.FormatCustomerComment(f.PCC_Comment, 150) + "||" + f.dep_date.ToString() + "|" + f.CountryName + "|" + f.PCC_PDLID + "|" + f.PDL_Title);
        //        }
        //        if (viewModelTemplate.listReviews.Count > 0)
        //        {
        //            viewModelTemplate.packFeedCountCity = viewModelTemplate.listReviews[0].NoOfComments;
        //        }
        //        ViewBag.PageType = "ListingPage";
        //        ViewBag.CriteoIDs = packid3;

        //        PackageView = "GP2_Area_Mob";
        //    }
        //    else
        //    {
        //        var result11 = await _dapperWrap.GetRecords<plcExtension>(SqlCalls.SQL_GetHiglightsByPlaceID(viewModelTemplate.areaID.ToString(), true));
        //        viewModelTemplate.Highlights = result11.ToList().FindAll(x => x.STX_ProdKindID > 1618 && x.STX_ProdKindID < 1624);

        //        var result12 = await _dapperWrap.GetRecords<PlacesInterest>(SqlCalls.SQL_GetCitiesAArea(viewModelTemplate.areaID.ToString()));
        //        viewModelTemplate.Cities = result12.ToList();
        //        string CityIDS = "";
        //        foreach (var c in viewModelTemplate.Cities)
        //        {
        //            if (CityIDS == "")
        //            {
        //                CityIDS = c.STR_PlaceID.ToString();
        //            }
        //            else
        //            {
        //                CityIDS = CityIDS + "," + c.STR_PlaceID.ToString();
        //            }
        //        }

        //        var Result13 = await _dapperWrap.GetRecords<CitiesRelatedItin>(SqlCalls.SQL_GetItinAArea(CityIDS, 1));
        //        viewModelTemplate.CitiesRelatedItin = Result13.ToList();
        //        var first3 = viewModelTemplate.CitiesRelatedItin.Take(3).ToList();
        //        var packid3 = "";
        //        var iC = 0;
        //        foreach (var d in first3)
        //        {
        //            if (iC < first3.Count - 1) { packid3 = packid3 + "'" + d.PDLID + "', "; } else { packid3 = packid3 + "'" + d.PDLID + "'"; };
        //            iC++;
        //        };

        //        var result14 = await _dapperWrap.GetRecords<CMS_WebsiteContent>(SqlCalls.SQL_GetAreaCitiesCombine(viewModelTemplate.areaID.ToString()));
        //        List<CMS_WebsiteContent> allPlacesON = result14.ToList();
        //        string sXML = "<Cities>";
        //        foreach (var n in allPlacesON)
        //        {
        //            string[] ids = n.CMS_Content.Split(",");
        //            for (Int32 i = 0; i < ids.Length; i++)
        //            {
        //                if (ids[i].Trim() != "")
        //                {
        //                    sXML = sXML + "<id>" + ids[i].Trim() + "</id>";
        //                }
        //            }
        //        }
        //        sXML = sXML + "</Cities>";
        //        var result15 = await _dapperWrap.GetRecords<PlaceInfo_By_PlaceName>(SqlCalls.SQL_AreaCombineFromXML(sXML, 1, ""));
        //        viewModelTemplate.dvTopPlaces = result15.ToList();

        //        var result16 = await _dapperWrap.GetRecords<CustomerFeed>(SqlCalls.SQL_AAreaFeedback(viewModelTemplate.areaID.ToString()));
        //        List<CustomerFeed> dvCustFeed = result16.ToList();
        //        viewModelTemplate.TotalCustFeed = dvCustFeed.Count;
        //        ViewBag.PageType = "ListingPage";
        //        ViewBag.CriteoIDs = packid3;

        //        PackageView = "A_Area";
        //    }

        //    return View(PackageView, viewModelTemplate);
        //}
    }
}
