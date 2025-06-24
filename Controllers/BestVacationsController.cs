using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using MVC_TMED.Infrastructure;
using Microsoft.Extensions.Options;
using MVC_TMED.Models;
using MVC_TMED.Models.ViewModels;
using Dapper;
using System.Data;
using System.Data.SqlClient;
using System.Globalization;
using System.Diagnostics.Metrics;
using System.Threading.Tasks;
// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace MVC_TMED.Controllers
{
    public class BestVacationsController : Controller
    {
        private readonly AppSettings _appSettings;
        private readonly DapperWrap _dapperWrap;

        public BestVacationsController(IOptions<AppSettings> appsettings, DapperWrap dapperWrap)
        {
            _appSettings = appsettings.Value;
            _dapperWrap = dapperWrap;
        }

        [TypeFilter(typeof(CheckCacheFilter))]
        [HttpGet("/{Vacation}/best_vacations", Name = "Best_Vacations_Route", Order = 2)]
        [HttpHead("/{Vacation}/best_vacations", Name = "Best_Vacations_Route", Order = 2)]
        [HttpPost("/{Vacation}/best_vacations", Name = "Best_Vacations_Route", Order = 2)]

        public async Task<IActionResult> Index(string Vacation)
        {
            if (Utilities.CheckMobileDevice() == false)
            {
                return await Desktop(Vacation);
            }
            else
            {
                return await Mobile(Vacation);
            }
        }
        public async Task<IActionResult> Desktop(string Vacation)
        {
            //throw new Exception("big error");
            string GP_Name = Vacation.Replace("_", " ");
            GP_Name = GP_Name.IndexOf("?") > 0 ? GP_Name.Substring(0, GP_Name.IndexOf("?")) : GP_Name;
            
            List<MasterInterestContentTemplate> dvBest_Vacations = new List<MasterInterestContentTemplate>();
            var result1 = await _dapperWrap.GetRecords<MasterInterestContentTemplate>(SqlCalls.SQL_PageTemplate_MasterInterestContent("607", GP_Name));
            dvBest_Vacations = result1.ToList();
            if (dvBest_Vacations.Count == 0)
            { throw new Exception("Best Vacation " + Vacation + " no Template row."); }
            string tmpVAL = dvBest_Vacations[0].SMC_Template;

            string PackageView = "";

            Models.ViewModels.GP_BestVacationsViewModel viewModelTemplate = new Models.ViewModels.GP_BestVacationsViewModel();

            viewModelTemplate.bstNA = GP_Name;
            string nameBestVac = CultureInfo.CurrentCulture.TextInfo.ToTitleCase(GP_Name.ToLower());

            string pageTitle = nameBestVac + " Vacations Packages | Custom Vacation Packages to " + nameBestVac + " | Multi-City Trips to " + nameBestVac + " | Tripmasters";
            viewModelTemplate.pageMetaDesc = "Best " + nameBestVac + " vacation packages, custom " + nameBestVac + " vacation packages, flexible trips to " + nameBestVac + ". Book " + nameBestVac + " packages online";
            viewModelTemplate.pageMetaKey = nameBestVac + " vacations, " + nameBestVac + " vacation packages, discount " + nameBestVac + " vacations, discount vacations, vacation packages, vacations, vacation deals, travel, travel packages, travel deals, europe destinations, independent tours, customizable packages, tourism, bargain vacations, discount hotels, discount airfare, travel guides, fly drive, honeymoon vacations, holiday vacations, last minute travel, online reservations, Europe deals";
            viewModelTemplate.pageHeaderText = nameBestVac;
            string intNA = "";
            ViewBag.PageTitle = pageTitle;
            ViewBag.pageMetaDesc = viewModelTemplate.pageMetaDesc;
            ViewBag.pageMetaKey = viewModelTemplate.pageMetaKey;
            ViewBag.tmpagetype = "bestvacations";
            ViewBag.tmpagetypeinstance = "";
            ViewBag.tmrowid = "";
            ViewBag.tmadstatus = "";
            ViewBag.tmregion = "europe";
            ViewBag.tmcountry = "";
            ViewBag.tmdestination = "";

            List<Interest_Info> dvIC = new List<Interest_Info>();
            var result2 = await _dapperWrap.GetRecords<Interest_Info>(SqlCalls.SQL_Interest_Info(GP_Name));
            dvIC = result2.ToList();
            if (dvIC.Count > 0)
            {
                viewModelTemplate.bstID = dvIC[0].SMCID;
                viewModelTemplate.bstDES = dvIC[0].SMC_Content;
                viewModelTemplate.bstPLC = dvIC[0].SMC_PlaceHierarchyID;
                intNA = dvIC[0].SMC_Title;
            }

            //MODIFY OR REMOVE/ADD DINAMICALLY Title and meta on Master Page
            //Master.Page.Title = pageTitle
            //Master.Page.MetaDescription = pageMetaDesc
            //Master.Page.MetaKeywords = pageMetaKey

            //MOST POPULAR ITINERARIES
            var result3 = await _dapperWrap.GetRecords<CustCommentsUserId>(SqlCalls.SQL_GetCustomerCommentsByuserID(_appSettings.ApplicationSettings.defaultMostPop));
            viewModelTemplate.listReviews = result3.ToList();
            //for (int fed = 0; fed < 3; fed++)
            //{
            //    viewModelTemplate.boxCustomFeed.Add(Utilities.FormatCustomerComment(listReviews[fed].Comment, 110) + "||" + listReviews[fed].dep_date + "|" + listReviews[fed].CountryName + "|" + listReviews[fed].PDLID + "|" + listReviews[fed].PDL_Title + "|" + listReviews[fed].IMG_Path_URL + "|" + listReviews[fed].STP_Save + "|" + listReviews[fed].STP_NumOfNights);
            //}

            //COUNTRIES - TRIPS TAKEN BY OTHERS
            List<CountriesComments> listCustFeed = new List<CountriesComments>();
            var result4 = await _dapperWrap.GetRecords<CountriesComments>(SqlCalls.SQL_CountriesWCommentsByDeptID());
            listCustFeed = result4.ToList();
            for (int c = 0; c < listCustFeed.Count; c++)
            {
                if (listCustFeed[c].CountryName != null)
                {
                    viewModelTemplate.boxCountries.Add(listCustFeed[c].CountryName + "|" + listCustFeed[c].CountryID);
                }
            }

            //Packages Priority List.
            List<PackOnInterestPriority> dvPackOnInt = new List<PackOnInterestPriority>();
            var result5 = await _dapperWrap.GetRecords<PackOnInterestPriority>(SqlCalls.SQL_PackOnBstVacPriorityList(viewModelTemplate.bstID));
            dvPackOnInt = result5.ToList();
            viewModelTemplate.featPack = dvPackOnInt.FindAll(n => n.SPPW_Weight < 999);
            viewModelTemplate.listFeatItin = viewModelTemplate.featPack.Take(1);
            viewModelTemplate.otherFeatured = viewModelTemplate.featPack.Skip(1).Take(4);
            viewModelTemplate.suggetstedFeatured = viewModelTemplate.featPack.Skip(5).ToList();
            if (viewModelTemplate.featPack.Count < 4)
            {
                viewModelTemplate.featPack = dvPackOnInt.FindAll(n => n.PDL_SequenceNo < 9);
                viewModelTemplate.featPack.Sort(
                        delegate (PackOnInterestPriority p1, PackOnInterestPriority p2)
                        {
                            return p1.PDL_SequenceNo.CompareTo(p2.PDL_SequenceNo);
                        });
            }
            for (int p = 0; p < viewModelTemplate.featPack.Count; p++)
            {
                viewModelTemplate.strPlcsIDs.Append(viewModelTemplate.featPack[p].PDL_Places);
                if (p == 0)
                {
                    viewModelTemplate.featItin = viewModelTemplate.featPack[p].PDLID;
                }
                if (p > 0 && p < 4)
                {
                    if (p == 1)
                    {
                        viewModelTemplate.otherFeat = viewModelTemplate.featPack[p].PDLID.ToString();
                    }
                    if (p > 1)
                    {
                        viewModelTemplate.otherFeat = viewModelTemplate.otherFeat + "," + viewModelTemplate.featPack[p].PDLID.ToString();
                    }
                }
            }
            foreach (var pk in viewModelTemplate.featPack)
            {
                viewModelTemplate.boxFeaturPacks.Add(pk.PDLID + "|" + pk.PDL_Title + "|" + pk.SPD_Description + "|" + pk.PDL_Duration + "|" + pk.STP_Save + "|" + pk.PDL_Content + "|" + pk.NoOfFeed + "|" + pk.SPD_InternalComments + "|" + pk.IMG_Path_URL + "|" + pk.CountryName);
                viewModelTemplate.strPlcsIDs.Append(pk.PDL_Places);
            }
            foreach (var pk in viewModelTemplate.otherFeatured)
            {
                viewModelTemplate.boxO.Add(pk.PDLID + "|" + pk.PDL_Title + "|" + pk.SPD_Description + "|" + pk.PDL_Duration + "|" + pk.STP_Save + "|" + pk.PDL_Content + "|" + pk.NoOfFeed + "|" + pk.SPD_InternalComments + "|" + pk.IMG_Path_URL + "|" + pk.CountryName);
            
            }
            foreach (var pk in viewModelTemplate.suggetstedFeatured)
            {
                viewModelTemplate.boxSugg.Add(pk.PDLID + "|" + pk.PDL_Title + "|" + pk.SPD_Description + "|" + pk.PDL_Duration + "|" + pk.STP_Save + "|" + pk.PDL_Content + "|" + pk.NoOfFeed + "|" + pk.SPD_InternalComments + "|" + pk.IMG_Path_URL + "|" + pk.CountryName);

            }


            var first3 = viewModelTemplate.featPack.Take(3).ToList();
            var packid3 = "";
            var iC = 0;
            foreach (var d in first3)
            {
                if (iC < first3.Count - 1) { packid3 = packid3 + "'" + d.PDLID + "', "; } else { packid3 = packid3 + "'" + d.PDLID + "'"; };
                iC++;
            };

            //Boxes Content
            var result6 = await _dapperWrap.GetRecords<DisplayArea>(SqlCalls.SQL_ManagerDisplay(viewModelTemplate.bstID));
            viewModelTemplate.listCustDly = result6.ToList();

            //BANNERS TO DISPLAY ON CENTER COLUMN - PACKAGES LIST
            var result7 = await _dapperWrap.GetRecords<BoxContent>(SqlCalls.SQL_BoxesContent(viewModelTemplate.bstID));
            viewModelTemplate.boxContent = result7.ToList();
            viewModelTemplate.boxContent1624 = viewModelTemplate.boxContent.FindAll(n => n.STX_ProdKindID == 1624);
            //for (int b = 0; b < boxContent1624.Count; b++)
            //{
            //    viewModelTemplate.arrBanner.Add(boxContent1624[b].STX_Title + "|" + boxContent1624[b].STX_URL + "|" + boxContent1624[b].STX_PictureURL);
            //}

            //TO KNOW WEIGHT CITIES AND COUNTRIES
            var result8 = await _dapperWrap.GetRecords<WeightPlace>(SqlCalls.SQL_weightPlacesByIntID(viewModelTemplate.bstID, viewModelTemplate.bstPLC));
            viewModelTemplate.placesOnWeight = result8.ToList();
            viewModelTemplate.placesOnWeightCity = viewModelTemplate.placesOnWeight.FindAll(n => n.STR_PlaceTypeID == 1 || n.STR_PlaceTypeID == 25);
            if (viewModelTemplate.placesOnWeightCity.Count > 0)
            {
                viewModelTemplate.plcsR = 1;
            }
            for (int plw = 0; plw < viewModelTemplate.placesOnWeightCity.Count; plw++)
            {
                viewModelTemplate.arrCitiesOnW.Add(viewModelTemplate.placesOnWeightCity[plw].STR_PlaceTitle + "|" + viewModelTemplate.placesOnWeightCity[plw].STR_PlaceID + "|" + viewModelTemplate.placesOnWeightCity[plw].STR_PlaceShortInfo + "|" + viewModelTemplate.placesOnWeightCity[plw].STR_PlaceTypeID);
            }
            List<WeightPlace> placesOnWeightCountries = viewModelTemplate.placesOnWeight.FindAll(n => n.STR_PlaceTypeID == 5);
            if (placesOnWeightCountries.Count > 0)
            {
                viewModelTemplate.plcsR = 1;
            }
            for (int plw = 0; plw < placesOnWeightCountries.Count; plw++)
            {
                viewModelTemplate.arrCountriesOnW.Add(viewModelTemplate.placesOnWeightCity[plw].STR_PlaceTitle + "|" + viewModelTemplate.placesOnWeightCity[plw].STR_PlaceID + "|" + viewModelTemplate.placesOnWeightCity[plw].STR_PlaceShortInfo + "|" + viewModelTemplate.placesOnWeightCity[plw].STR_PlaceTypeID);
            }
            if (tmpVAL.IndexOf(",GP3,") >= 0)
            {
                ViewBag.PageType = "ListingPage";
                ViewBag.CriteoIDs = packid3;
                ViewBag.viewUsedName = "GP3_BestVacations";

                PackageView = "GP3_BestVacationsDesktop";
                viewModelTemplate.leftDisplay = viewModelTemplate.listCustDly.FindAll(c => c.SDP_DisplayProdKindID == 1877);
                List<DisplayArea> centerDisplay = viewModelTemplate.listCustDly.FindAll(c => c.SDP_DisplayProdKindID == 1878).ToList();
                List<BoxContent> topCenterOnPage = viewModelTemplate.boxContent.FindAll(bn => bn.STX_ProdKindID == 1983);
                viewModelTemplate.bannerOnPage = viewModelTemplate.boxContent.FindAll(n => n.STX_ProdKindID == 1624);
                viewModelTemplate.areaHighlightOrientation = viewModelTemplate.leftDisplay.FindAll(ah => ah.SDP_GroupProdKindID == 1623 || ah.SDP_GroupProdKindID == 1619 || ah.SDP_GroupProdKindID == 1620 || ah.SDP_GroupProdKindID == 1621 || ah.SDP_GroupProdKindID == 1912 || ah.SDP_GroupProdKindID == 2478 || ah.SDP_GroupProdKindID == 2470);
                viewModelTemplate.allTopDisplay = topCenterOnPage.Join(centerDisplay, b => b.STX_ProdKindID, d => d.SDP_GroupProdKindID, (b, d) =>
                   
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
                viewModelTemplate.allTop = viewModelTemplate.allTopDisplay.Count;
                viewModelTemplate.placesOnWeightCountry = viewModelTemplate.placesOnWeight.FindAll(n => n.STR_PlaceTypeID == 5);
                viewModelTemplate.citesOnWeight = viewModelTemplate.placesOnWeight.FindAll(c => c.STR_PlaceTypeID == 1 || c.STR_PlaceTypeID == 25);
            }

            else if (tmpVAL.IndexOf(",GP2,") >= 0)
            {
                ViewBag.PageType = "ListingPage";
                ViewBag.CriteoIDs = packid3;
                ViewBag.viewUsedName = "GP2_BestVacations";

                PackageView = "GP2_BestVacations";

                List<DisplayArea> centerDisplay = viewModelTemplate.listCustDly.FindAll(c => c.SDP_DisplayProdKindID == 1878).ToList();
                List<BoxContent> topCenterOnPage = viewModelTemplate.boxContent.FindAll(bn => bn.STX_ProdKindID == 1983);
                viewModelTemplate.allTopDisplay = topCenterOnPage.Join(centerDisplay, b => b.STX_ProdKindID, d => d.SDP_GroupProdKindID, (b, d) =>
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
            else
            {
                if (tmpVAL.IndexOf(",GP,") >= 0)
                {
                    ViewBag.PageType = "ListingPage";
                    ViewBag.CriteoIDs = packid3;
                    ViewBag.viewUsedName = "GP_BestVacations";
                    PackageView = "GP_BestVacations";
                }
            }

            return View(PackageView, viewModelTemplate);
        }

        public async Task<IActionResult> Mobile(string Vacation)
        {
            List<DisplayArea> managerDisplay;
            Models.ViewModels.GP_BestVacationsViewModel viewModelTemplate = new Models.ViewModels.GP_BestVacationsViewModel();
            string template;
            string GP_Name = Vacation.Replace("_", " ");
            GP_Name = GP_Name.IndexOf("?") > 0 ? GP_Name.Substring(0, GP_Name.IndexOf("?")) : GP_Name;
            viewModelTemplate.bstNA = GP_Name;
            viewModelTemplate.pageHeaderText = viewModelTemplate.bstNA;


            List<Interest_Info> listIntCont = new List<Interest_Info>();
            var result1 = await _dapperWrap.GetRecords<Interest_Info>(SqlCalls.SQL_Interest_Info(GP_Name));
            listIntCont = result1.ToList();
            if (listIntCont.Count == 0)
            {
                throw new Exception("Best Vacation " + Vacation + " no Template row.");
            }
            else if (listIntCont.Count > 0)
            {
                viewModelTemplate.bstNA = GP_Name;
                viewModelTemplate.bstID = listIntCont[0].SMCID;
                viewModelTemplate.bstDES = listIntCont[0].SMC_Content;
                viewModelTemplate.bstPLC = listIntCont[0].SMC_PlaceHierarchyID;
            }
            viewModelTemplate.bstNA = GP_Name;
            string nameBestVac = CultureInfo.CurrentCulture.TextInfo.ToTitleCase(GP_Name.ToLower());

            string pageTitle = nameBestVac + " Vacation Packages | Custom Vacation Packages to " + nameBestVac + " | Multi-City Trips to " + nameBestVac + " | Tripmasters";
            viewModelTemplate.pageMetaDesc = "Best " + nameBestVac + " vacation packages, custom " + nameBestVac + " vacation packages, flexible trips to " + nameBestVac + ". Book " + nameBestVac + " packages online";
            viewModelTemplate.pageMetaKey = nameBestVac + " vacations, " + nameBestVac + " vacation packages, discount " + nameBestVac + " vacations, discount vacations, vacation packages, vacations, vacation deals, travel, travel packages, travel deals, europe destinations, independent tours, customizable packages, tourism, bargain vacations, discount hotels, discount airfare, travel guides, fly drive, honeymoon vacations, holiday vacations, last minute travel, online reservations, Europe deals";
            viewModelTemplate.pageHeaderText = nameBestVac;
            string intNA = "";

            ViewBag.PageTitle = pageTitle;
            ViewBag.pageMetaDesc = viewModelTemplate.pageMetaDesc;
            ViewBag.pageMetaKey = viewModelTemplate.pageMetaKey;
            ViewBag.tmpagetype = "bestvacations";
            ViewBag.tmpagetypeinstance = "";
            ViewBag.tmrowid = "";
            ViewBag.tmadstatus = "";
            ViewBag.tmregion = "europe";
            ViewBag.tmcountry = "";
            ViewBag.tmdestination = "";

            //MOST POPULAR ITINERARIES
            var result2 = await _dapperWrap.GetRecords<CustCommentsUserId>(SqlCalls.SQL_GetCustomerCommentsByuserID(_appSettings.ApplicationSettings.defaultMostPop));
            viewModelTemplate.listReviews = result2.ToList();
            //Packages Priority List.
            List<PackOnInterestPriority> listPackOnInt = new List<PackOnInterestPriority>();
            var result3 = await _dapperWrap.GetRecords<PackOnInterestPriority>(SqlCalls.SQL_PackOnBstVacPriorityList(viewModelTemplate.bstID));
            listPackOnInt = result3.ToList();
            viewModelTemplate.featPack = listPackOnInt.FindAll(x => x.SPPW_Weight < 999);
            viewModelTemplate.listFeatItin = viewModelTemplate.featPack.Take(1);
            viewModelTemplate.otherFeatured = viewModelTemplate.featPack.Skip(1).Take(4);
            viewModelTemplate.suggetstedFeatured = viewModelTemplate.featPack.Skip(5).ToList();

            if (viewModelTemplate.featPack.Count == 0)
            {
                viewModelTemplate.featPack = viewModelTemplate.featPack.FindAll(x => x.PDL_SequenceNo < 9);
            }
            var first3 = viewModelTemplate.featPack.Take(3).ToList();
            var packid3 = "";
            var iC = 0;
            foreach (var d in first3)
            {
                if (iC < first3.Count - 1) { packid3 = packid3 + "'" + d.PDLID + "', "; } else { packid3 = packid3 + "'" + d.PDLID + "'"; };
                iC++;
            };
            foreach (var pk in viewModelTemplate.featPack)
            {
                viewModelTemplate.boxFeaturPacks.Add(pk.PDLID + "|" + pk.PDL_Title + "|" + pk.SPD_Description + "|" + pk.PDL_Duration + "|" + pk.STP_Save + "|" + pk.PDL_Content + "|" + pk.NoOfFeed + "|" + pk.SPD_InternalComments + "|" + pk.IMG_Path_URL + "|" + pk.CountryName);
                viewModelTemplate.strPlcsIDs.Append(pk.PDL_Places);
            }
            foreach (var pk in viewModelTemplate.otherFeatured)
            {
                viewModelTemplate.boxO.Add(pk.PDLID + "|" + pk.PDL_Title + "|" + pk.SPD_Description + "|" + pk.PDL_Duration + "|" + pk.STP_Save + "|" + pk.PDL_Content + "|" + pk.NoOfFeed + "|" + pk.SPD_InternalComments + "|" + pk.IMG_Path_URL + "|" + pk.CountryName);

            }
            foreach (var pk in viewModelTemplate.suggetstedFeatured)
            {
                viewModelTemplate.boxSugg.Add(pk.PDLID + "|" + pk.PDL_Title + "|" + pk.SPD_Description + "|" + pk.PDL_Duration + "|" + pk.STP_Save + "|" + pk.PDL_Content + "|" + pk.NoOfFeed + "|" + pk.SPD_InternalComments + "|" + pk.IMG_Path_URL + "|" + pk.CountryName);

            }

            //Content like Manager Selection
            var result4 = await _dapperWrap.GetRecords<DisplayArea>(SqlCalls.SQL_ManagerDisplay(viewModelTemplate.bstID));
            viewModelTemplate.listCustDly = result4.ToList();
            //List Box Content
            var result5 = await _dapperWrap.GetRecords<BoxContent>(SqlCalls.SQL_BoxesContent(viewModelTemplate.bstID));
            viewModelTemplate.boxContent = result5.ToList();
            if (listIntCont[0].SMC_Template.Contains(",GP3,") == true)
            {
                ViewBag.PageType = "ListingPage";
                ViewBag.CriteoIDs = packid3;
                ViewBag.viewUsedName = "GP3_BestVacations_Mob";

                template = "GP3_BestVactions_Mob";
                viewModelTemplate.leftDisplay = viewModelTemplate.listCustDly.FindAll(c => c.SDP_DisplayProdKindID == 1877);
                List<DisplayArea> centerDisplay = viewModelTemplate.listCustDly.FindAll(c => c.SDP_DisplayProdKindID == 1878).ToList();
                List<BoxContent> topCenterOnPage = viewModelTemplate.boxContent.FindAll(bn => bn.STX_ProdKindID == 1983);
                viewModelTemplate.bannerOnPage = viewModelTemplate.boxContent.FindAll(n => n.STX_ProdKindID == 1624);
                viewModelTemplate.areaHighlightOrientation = viewModelTemplate.leftDisplay.FindAll(ah => ah.SDP_GroupProdKindID == 1623 || ah.SDP_GroupProdKindID == 1619 || ah.SDP_GroupProdKindID == 1620 || ah.SDP_GroupProdKindID == 1621 || ah.SDP_GroupProdKindID == 1912 || ah.SDP_GroupProdKindID == 2470);
                viewModelTemplate.allTopDisplay = topCenterOnPage.Join(centerDisplay, b => b.STX_ProdKindID, d => d.SDP_GroupProdKindID, (b, d) =>

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
                viewModelTemplate.allTop = viewModelTemplate.allTopDisplay.Count;
            }

            else if (listIntCont[0].SMC_Template.Contains(",GP2,") == true)
            {
                ViewBag.PageType = "ListingPage";
                ViewBag.CriteoIDs = packid3;
                ViewBag.viewUsedName = "GP2_BestVacations_Mob";

                template = "GP2_BestVacations_Mob";
                viewModelTemplate.centerDsp = viewModelTemplate.boxContent.FindAll(x => x.STX_ProdKindID == 1983).ToList();
            }
            else
            {
                ViewBag.PageType = "ListingPage";
                ViewBag.CriteoIDs = packid3;
                ViewBag.viewUsedName = "GP_BestVacations_Mob";

                template = "GP_BestVacations_Mob";
                viewModelTemplate.centerDsp = viewModelTemplate.boxContent.FindAll(x => x.STX_ProdKindID == 1912).ToList();
            }
            //TO KNOW WEIGHT CITIES AND COUNTRIES
            //viewModelTemplate.placesOnWeight = dbConn.QueryAsync<WeightPlace>(SqlCalls.SQL_weightPlacesByIntID(viewModelTemplate.bstID, viewModelTemplate.bstPLC)).Result.ToList();
            //viewModelTemplate.placesOnWeightCountry = viewModelTemplate.placesOnWeight.FindAll(n => n.STR_PlaceTypeID == 5);
            //viewModelTemplate.citesOnWeight = viewModelTemplate.placesOnWeight.FindAll(c => c.STR_PlaceTypeID == 1 || c.STR_PlaceTypeID == 25);
            return View(template, viewModelTemplate);
        }
    }
}
