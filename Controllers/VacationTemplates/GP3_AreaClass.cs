using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MVC_TMED.Models;
using MVC_TMED.Infrastructure;
using MVC_TMED.Models.ViewModels;
using System.Xml;
using System.Text;
using System.Text.RegularExpressions;
using Dapper;
using System.Data;
using System.Data.SqlClient;
using Microsoft.Extensions.Options;
using Microsoft.AspNetCore.Hosting;

namespace MVC_TMED.Controllers
{
    public class GP3_AreaClass : Controller
    {
        private readonly IOptions<AppSettings> _appSettings;
        private readonly DapperWrap _dapperWrap;

        public GP3_AreaClass(DapperWrap dapperWrap, IOptions<AppSettings> appSettings)
        {
            _appSettings = appSettings;
            _dapperWrap = dapperWrap;
        }
        //[HttpGet("GP3_Area/{name}/Vacations", Name = "GP3_Area_Route")]

        public async Task<GP3_AreaViewModel> GP3_Area(Int32 placeId)
        {
            //name = Utilities.UppercaseFirstLetter(name.Replace("_", " "));
            GP3_AreaViewModel gP3_AreaViewModel = new GP3_AreaViewModel();
            List<PlaceInfo_By_PlaceName> place;
            List<Feedback> customerFeedbacks = new List<Feedback>();
            List<PackOnInterestPriority> dvPackOnCty;
            List<DisplayArea> managerDisplay = new List<DisplayArea>();
            List<Place_Info> placeInfo = new List<Place_Info>();
            List<NumberofCustomerFeedbacks> overAllReviews = new List<NumberofCustomerFeedbacks>();        
            //var Result1 = await _dapperWrap.GetRecords<CMS_WebsiteContent>(SqlCalls.SQL_PageTemplate_Places_Hierarchy("6", name));
            //List<CMS_WebsiteContent> dvArea = Result1.ToList();
         

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
            gP3_AreaViewModel.areaNA = Utilities.UppercaseFirstLetter(place.First().STR_PlaceTitle);

            //ViewBag.PageTitle = gP3_AreaViewModel.areaNA;

            var types = new Type[] { typeof(Place_Info), typeof(Feedback) };
            var results = await _dapperWrap.GetMultipleRecords(SqlCalls.SQL_Place_Info(gP3_AreaViewModel.areaID.ToString()) + @";" + SqlCalls.SQL_FeedbacksByPlaceId(gP3_AreaViewModel.areaID) + @";", 4, null ,types);
            placeInfo.Add(results.FirstOrDefault()[0]);
            foreach (var resultSet in results.Skip(1))
            {
                foreach (var result in resultSet)
                {
                    customerFeedbacks.Add(result);
                }
            }

            //gP3_AreaViewModel.pageTitle = gP3_AreaViewModel.areaNA + " Vacation Packages | Vacations to " + gP3_AreaViewModel.areaNA + " | Tripmasters";
            //string pageTitle = gP3_AreaViewModel.areaNA + " Vacation Packages | Vacations to " + gP3_AreaViewModel.areaNA + " | Tripmasters";
            //gP3_AreaViewModel.pageMetaDesc = gP3_AreaViewModel.areaNA + " Vacations, custom vacations to " + gP3_AreaViewModel.areaNA + ", best " + gP3_AreaViewModel.areaNA + " vacation packages. Travel to " + gP3_AreaViewModel.areaNA + ". " + gP3_AreaViewModel.areaNA + " online booking.";

            //var Result11 = await _dapperWrap.GetRecords<Place_Info>(SqlCalls.SQL_Place_Info(gP3_AreaViewModel.cityPLC.ToString()));
			//List<Place_Info> dvDAT = Result11.ToList();
			if (placeInfo[0].SEO_PageTitle != null)
			{
                gP3_AreaViewModel.pageTitle = placeInfo[0].SEO_PageTitle;
			}
            else { 
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

            //Customer Feedbacks by Area ID
            //var Result3 = await _dapperWrap.GetRecords<Feedback>(SqlCalls.SQL_FeedbacksByPlaceID(gP3_AreaViewModel.areaID));
            //dvCustomFeed = Result3.ToList();
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

            //Added new functionality to run multiple queries at the same time with the new function GetMultipleRecords
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
                foreach (var resultSet in resultsSets.Skip(1).Take(1))
                {
                    foreach (var result in resultSet)
                    {
                        managerDisplay.Add(result);
                    }
                }
                foreach (var resultSet in resultsSets.Skip(2).Take(1))
                {
                    foreach (var result in resultSet)
                    {
                        gP3_AreaViewModel.boxContent.Add(result);
                    }
                }
                foreach (var resultSet in resultsSets.Skip(3).Take(1))
                {
                    foreach (var result in resultSet)
                    {
                        gP3_AreaViewModel.placesOnCountry.Add(result);
                    }
                }
                foreach (var resultSet in resultsSets.Skip(4).Take(1))
                {
                    foreach (var result in resultSet)
                    {
                        gP3_AreaViewModel.leftCMS.Add(result);
                    }
                }
            }

            //packages Priority List

            //var Result4 = await _dapperWrap.GetRecords<PackOnInterestPriority>(SqlCalls.SQL_PackOnInterestPriorityList(gP3_AreaViewModel.areaIDs.ToString(), "0"));
            //List<PackOnInterestPriority> dvPackOnC = Result4.ToList();
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
            gP3_AreaViewModel.bestPackages2 = gP3_AreaViewModel.featPack.Skip(2).Take(2);
            gP3_AreaViewModel.listFeatured = gP3_AreaViewModel.featPack.Take(1).ToList();
            gP3_AreaViewModel.otherFeatured = gP3_AreaViewModel.featPack.Skip(1).Take(4).ToList();
            gP3_AreaViewModel.suggestedPackages = gP3_AreaViewModel.featPack.Skip(5).ToList();

            var first3 = gP3_AreaViewModel.featPack.Take(3).ToList();
            var packid3 = "";
            var iC = 0;
            foreach (var d in first3)
            {
                if (iC < first3.Count - 1) { packid3 = packid3 + "'" + d.PDLID + "', "; } else { packid3 = packid3 + "'" + d.PDLID + "'"; };
                iC++;
            };

            // Content like manages selection
            //var Result5 = await _dapperWrap.GetRecords<DisplayArea>(SqlCalls.SQL_ManagerDisplayArea(gP3_AreaViewModel.areaID));
            //managerDisplay = Result5.ToList();
            gP3_AreaViewModel.leftDisplay = managerDisplay.FindAll(c => c.SDP_DisplayProdKindID == 1877).ToList();
            gP3_AreaViewModel.centerDisplay = managerDisplay.FindAll(c => c.SDP_DisplayProdKindID == 1878).ToList();
            gP3_AreaViewModel.areaHighlightOrientation = gP3_AreaViewModel.leftDisplay.FindAll(d => d.SDP_GroupProdKindID == 1623 || d.SDP_GroupProdKindID == 1619 || d.SDP_GroupProdKindID == 1912 || d.SDP_GroupProdKindID == 1620 || d.SDP_GroupProdKindID == 2478 || d.SDP_GroupProdKindID == 2470).ToList();


            //var Result6 = await _dapperWrap.GetRecords<BoxContent>(SqlCalls.SQL_BoxesContentArea(gP3_AreaViewModel.areaIDs));
            //gP3_AreaViewModel.boxContent = Result6.ToList();
            foreach (var b in gP3_AreaViewModel.boxContent)
            {
                b.STX_URL = b.STX_URL.Replace("https://www.tripmasters.com/europe", "").Replace("http://www.tripmasters.com/europe", "");
            }

            if (gP3_AreaViewModel.centerDisplay.Count > 0)
            {
                List<BoxContent> topCenterOnPage = gP3_AreaViewModel.boxContent.FindAll(c => c.STX_ProdKindID == 1983).ToList();
                gP3_AreaViewModel.allTopDisplay = topCenterOnPage.Join(gP3_AreaViewModel.centerDisplay, b => b.STX_ProdKindID, d => d.SDP_GroupProdKindID, (b, d) =>
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

            //var result8 = await _dapperWrap.GetRecords<WeightPlace>(SqlCalls.SQL_weightPlacesByIntID(0, gP3_AreaViewModel.areaIDs));
            //gP3_AreaViewModel.placesOnWeight = result8.ToList();

            //gP3_AreaViewModel.citesOnWeight = gP3_AreaViewModel.placesOnWeight.FindAll(c => c.CountryID == gP3_AreaViewModel.countryID).ToList();
            //gP3_AreaViewModel.citesnotOnWeight = gP3_AreaViewModel.placesOnWeight.FindAll(c => c.CountryID != gP3_AreaViewModel.countryID).ToList();

            //var result9 = await _dapperWrap.GetRecords<WeightPlace>(SqlCalls.SQL_CountryCitiesByplcID(0, gP3_AreaViewModel.countryID));
            //gP3_AreaViewModel.placesOnCountry = result9.ToList();
            gP3_AreaViewModel.citesOnCountry = gP3_AreaViewModel.placesOnCountry.FindAll(c => c.CountryID == gP3_AreaViewModel.countryID).ToList();

            List<WeightPlace> leftlist = new List<WeightPlace>();
            Int32 lfc = 0;
            //gP3_AreaViewModel.leftCityList = gP3_AreaViewModel.placesOnWeight.FindAll(cty => cty.STR_PlaceTypeID == 1 || cty.STR_PlaceTypeID == 25);
            //gP3_AreaViewModel.leftCityList = gP3_AreaViewModel.placesOnWeight.FindAll(cty => cty.CountryID == gP3_AreaViewModel.countryID);
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

            //var Result8 = await _dapperWrap.GetRecords<CMSPage>(SqlCalls.SQL_CMS_onGPpages("PlcH", 0, gP3_AreaViewModel.areaIDs));
            //gP3_AreaViewModel.leftCMS = Result8.ToList();


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

            //var result11 = await _dapperWrap.GetRecords<weightItin>(SqlCalls.SQL_FeaturedItinByPlaceID(gP3_AreaViewModel.countryID.ToString()));
            //var result12 = await _dapperWrap.GetRecords<TotalPacks>(SqlCalls.SQL_NoOfPacksFeaturedItinByPlaceID(gP3_AreaViewModel.countryID.ToString()));
            //gP3_AreaViewModel.allItineraries = result12.First().NoOfPacks;

            //List<weightItin> objItineraries = result11.ToList();
            //if (objItineraries.Count() > 0)
            //{
            //    gP3_AreaViewModel.allItineraries = result12.First().NoOfPacks;
            //}
            //else
            //{
            //    gP3_AreaViewModel.allItineraries = 0;
            //}
            ViewBag.viewUsedName = "GP3_Area";

            return gP3_AreaViewModel;          
        }
    }
}
