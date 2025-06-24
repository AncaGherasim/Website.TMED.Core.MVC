using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Options;
using MVC_TMED.Infrastructure;
using MVC_TMED.Models;
using MVC_TMED.Models.ViewModels;


namespace MVC_TMED.Controllers.VacationTemplates
{
    public class GP3CityClass
    {
        private readonly DapperWrap _dapperWrap;
        private readonly IOptions<AppSettings> _appSettings;
        public IWebHostEnvironment Env { get; }
        public GP3CityClass(DapperWrap dapperWrap, IOptions<AppSettings> appSettings, IWebHostEnvironment env)
        {
            _appSettings = appSettings;
            _dapperWrap = dapperWrap;
            Env = env;
        }
        //[HttpGet("GP3_City/{City}", Name = "GP3_City_Route")]
        public async Task<GP3_CityViewModel> GP3_City(int placeId)
        {
            GP3_CityViewModel gP3_CityViewModel = new GP3_CityViewModel();
            List<PlaceInfo_By_PlaceName> dvPlace;
            List<DisplayArea> managerDisplay = new List<DisplayArea>();
            List<NumberofCustomerFeedbacks> overAllReviews;
            List<Place_Info> placeInfo = new List<Place_Info>();

            string PackageView = "";
            var Result1 = await _dapperWrap.GetRecords<PlaceInfo_By_PlaceName>(SqlCalls.SQL_PlaceInfo_By_PlaceId(placeId));
            dvPlace = Result1.ToList();
            if (dvPlace.Count == 0)
            { throw new Exception("Customer Feedbacks by City ID."); }
            gP3_CityViewModel.countryNA = dvPlace[0].CountryNA;
            gP3_CityViewModel.cityIDs = dvPlace[0].STRID;
            gP3_CityViewModel.cityID = dvPlace[0].STR_PlaceID;
            gP3_CityViewModel.cityNA = dvPlace[0].STR_PlaceTitle;
            gP3_CityViewModel.countryID = dvPlace[0].CountryID;

            var objectTypes = new Type[] { typeof(Place_Info), typeof(PackOnInterestPriority), typeof(Feedback), typeof(DisplayArea), typeof(BoxContent), typeof(WeightPlace), typeof(CMSPage) };
            string queryString = SqlCalls.SQL_Place_Info(gP3_CityViewModel.cityID.ToString()) + @";" +
                                SqlCalls.SQL_PackOnInterestPriorityList(gP3_CityViewModel.cityIDs.ToString(), "0") + @";" +
                                SqlCalls.SQL_FeedbacksByPlaceID(gP3_CityViewModel.cityID) + @";" +
                                SqlCalls.SQL_ManagerDisplayAreaGp3City(gP3_CityViewModel.cityID, gP3_CityViewModel.cityIDs) + @";" +
                                SqlCalls.SQL_BoxesContentArea(gP3_CityViewModel.cityIDs) + @";" +
                                SqlCalls.SQL_CountryCitiesByplcID(0, gP3_CityViewModel.countryID) + @";" +
                                SqlCalls.SQL_PlaceCMSByplaceID(gP3_CityViewModel.cityID.ToString()) + @";";

            var resultsSets = await _dapperWrap.GetMultipleRecords(queryString, 4, null, objectTypes);

            int count = 1;
            if (resultsSets is not null)
            {
                foreach (var resultSet in resultsSets)
                {
                    switch (count)
                    {
                        case 1:
                            placeInfo = ((List<object>)resultSet).Cast<Place_Info>().ToList();
                            break;
                        case 2:
                            gP3_CityViewModel.allFeatPackages = ((List<object>)resultSet).Cast<PackOnInterestPriority>().ToList();
                            break;
                        case 3:
                            gP3_CityViewModel.feedbacks = ((List<object>)resultSet).Cast<Feedback>().ToList();
                            break;
                        case 4:
                            managerDisplay = ((List<object>)resultSet).Cast<DisplayArea>().ToList();
                            break;
                        case 5:
                            gP3_CityViewModel.boxContent = ((List<object>)resultSet).Cast<BoxContent>().ToList();
                            break;
                        case 6:
                            gP3_CityViewModel.placesOnCountry = ((List<object>)resultSet).Cast<WeightPlace>().ToList();
                            break;
                        case 7:
                            gP3_CityViewModel.leftCMS = ((List<object>)resultSet).Cast<CMSPage>().ToList();
                            break;
                        default:
                            break;
                    }
                    count++;
                }
            }

            //var Result12 = await _dapperWrap.GetRecords<Place_Info>(SqlCalls.SQL_Place_Info(gP3_CityViewModel.cityPLC.ToString()));
			//List<Place_Info> dvDAT = Result12.ToList();
			if (placeInfo[0].SEO_PageTitle != null)
			{
				gP3_CityViewModel.pageTitle = placeInfo[0].SEO_PageTitle;
			}
			else
			{
				gP3_CityViewModel.pageTitle = gP3_CityViewModel.cityNA + " Vacation Packages | Vacation to " + gP3_CityViewModel.cityNA + " | Tripmasters";
			}

			if (placeInfo[0].SEO_MetaDescription != null)
			{
				gP3_CityViewModel.pageMetaDesc = placeInfo[0].SEO_MetaDescription;
			}
			else
			{
				gP3_CityViewModel.pageMetaDesc = gP3_CityViewModel.cityNA + "  Vacations, custom vacations to " + gP3_CityViewModel.cityNA + " , best " + gP3_CityViewModel.cityNA + " vacation packages. Travel to " + gP3_CityViewModel.cityNA + ". " + gP3_CityViewModel.cityNA + " online booking.";
			}

			//gP3_CityViewModel.pageTitle = gP3_CityViewModel.cityNA + " Vacation Packages | Vacation to " + gP3_CityViewModel.cityNA + " | Tripmasters";
			//gP3_CityViewModel.pageMetaDesc = gP3_CityViewModel.cityNA + "  Vacations, custom vacations to " + gP3_CityViewModel.cityNA + " , best " + gP3_CityViewModel.cityNA + " vacation packages. Travel to " + gP3_CityViewModel.cityNA + ". " + gP3_CityViewModel.cityNA + " online booking.";
			gP3_CityViewModel.pageMetaKey = gP3_CityViewModel.cityNA + " air and hotel stays, sightseeing tours, hotel packages, deals, rail, images, online booking, pricing, information, hotel travel, recommendations, resort, accommodations, Europe, european vacation, Africa vacation packages, Middle East vacation packages";
            gP3_CityViewModel.pageHeaderText = gP3_CityViewModel.cityNA + " Vacation Packages";
            gP3_CityViewModel.pageDescriptionC = gP3_CityViewModel.pageMetaDesc;
            gP3_CityViewModel.pageBannerText = "Book Customizable Multi-city trips in seconds|Curated Hotels & Services ";
            PackageView = "GP3_City";
            //ViewBag.PageTitle = gP3_CityViewModel.pageTitle;
            //ViewBag.pageMetaDesc = gP3_CityViewModel.pageMetaDesc;
            //ViewBag.pageMetaKey = gP3_CityViewModel.pageMetaKey;

            //var Result2 = await _dapperWrap.GetRecords<PackOnInterestPriority>(SqlCalls.SQL_PackOnInterestPriorityList(gP3_CityViewModel.cityIDs.ToString(), "0"));
            //var result11 = await _dapperWrap.GetRecords<TotalPacks>(SqlCalls.SQL_NoOfPacksFeaturedItinByPlaceID(gP3_CityViewModel.cityID.ToString()));
            //gP3_CityViewModel.allFeatPackages = Result2.ToList();
            //if (gP3_CityViewModel.allFeatPackages.Count > 0)
            //{
            //    gP3_CityViewModel.allItineraries = result11.First().NoOfPacks;
            //}
            gP3_CityViewModel.allFeatPackages = gP3_CityViewModel.allFeatPackages.FindAll(n => n.SPPW_Weight < 999);
            if (gP3_CityViewModel.allFeatPackages.Count == 0)
            {
                gP3_CityViewModel.allFeatPackages = gP3_CityViewModel.allFeatPackages.FindAll(n => n.PDL_SequenceNo < 9);
            }
            gP3_CityViewModel.bestPackages = gP3_CityViewModel.allFeatPackages.Take(4).ToList();
            gP3_CityViewModel.listFeatItin = gP3_CityViewModel.allFeatPackages;
            if (gP3_CityViewModel.allFeatPackages.Take(1).Count() > 0)
            {
                foreach (var t in gP3_CityViewModel.allFeatPackages.Take(1))
                {
                    string imagePath = @String.Format("https://pictures.tripmasters.com{0}", t.IMG_Path_URL);
                    gP3_CityViewModel.image = imagePath;

                }
            }

            var first3 = gP3_CityViewModel.allFeatPackages.Take(3).ToList();
            var packid3 = "";
            var iC = 0;
            foreach (var d in first3)
            {
                if (iC < first3.Count - 1) { packid3 = packid3 + "'" + d.PDLID + "', "; } else { packid3 = packid3 + "'" + d.PDLID + "'"; };
                iC++;
            };

            //var Result3 = await _dapperWrap.GetRecords<Feedback>(SqlCalls.SQL_FeedbacksByPlaceID(gP3_CityViewModel.cityID));
            //gP3_CityViewModel.feedbacks = Result3.ToList();
            //foreach (var f in dvCustomFeed)
            //{
            //    gP3_CityViewModel.boxCustomFeed.Add(Utilities.FormatCustomerComment(f.PCC_Comment, 150) + "||" + f.dep_date.ToString() + "|" + f.CountryName + "|" + f.PCC_PDLID + "|" + f.PDL_Title);
            //}
            //if (dvCustomFeed.Count > 0)
            //{
            //    gP3_CityViewModel.packFeedCountC = dvCustomFeed.Count();
            //}

            //var Result4 = await _dapperWrap.GetRecords<PackOnInterestPriority>(SqlCalls.SQL_PackOnInterestPriorityList(gP3_CityViewModel.cityIDs.ToString(), "0"));
            //dvPackOnCty = Result4.ToList();
            //gP3_CityViewModel.featPack = dvPackOnCty.FindAll(n => n.SPPW_Weight < 999);
            //if (gP3_CityViewModel.featPack.Count == 0)
            //{
            //    gP3_CityViewModel.featPack = gP3_CityViewModel.featPack.FindAll(n => n.PDL_SequenceNo < 9);
            //}
            //gP3_CityViewModel.listFeatItin = gP3_CityViewModel.featPack;
            //foreach (var pk in gP3_CityViewModel.featPack)
            //{
            //    gP3_CityViewModel.boxFeaturPacks.Add(pk.PDLID + "|" + pk.PDL_Title + "|" + pk.SPD_Description + "|" + pk.PDL_Duration + "|" + pk.STP_Save_ + "|" + pk.PDL_Content + "|" + pk.NoOfFeed + "|" + pk.SPD_InternalComments + "|" + pk.IMG_Path_URL);
            //    gP3_CityViewModel.strPlcsIDs.Append(pk.PDL_Places);
            //}

            //var Result5 = await _dapperWrap.GetRecords<DisplayArea>(SqlCalls.SQL_ManagerDisplayAreaGp3City(gP3_CityViewModel.cityID, gP3_CityViewModel.cityIDs));
            //managerDisplay = Result5.ToList();
            gP3_CityViewModel.leftDisplay = managerDisplay.FindAll(c => c.SDP_DisplayProdKindID == 1877).ToList();
            gP3_CityViewModel.centerDisplay = managerDisplay.FindAll(c => c.SDP_DisplayProdKindID == 1878).ToList();
            gP3_CityViewModel.areaHighlightOrientation = gP3_CityViewModel.leftDisplay.FindAll(d => d.SDP_GroupProdKindID == 1623 || d.SDP_GroupProdKindID == 1619 || d.SDP_GroupProdKindID == 1912 || d.SDP_GroupProdKindID == 2470 || d.SDP_GroupProdKindID == 2478).ToList();

            //var Result6 = await _dapperWrap.GetRecords<BoxContent>(SqlCalls.SQL_BoxesContentArea(gP3_CityViewModel.cityIDs));
            //gP3_CityViewModel.boxContent = Result6.ToList();
            foreach (var b in gP3_CityViewModel.boxContent)
            {
                b.STX_URL = b.STX_URL.Replace("https://www.tripmasters.com/europe", "").Replace("http://www.tripmasters.com/europe", "");
            }

            if (gP3_CityViewModel.centerDisplay.Count > 0)
            {
                List<BoxContent> topCenterOnPage = gP3_CityViewModel.boxContent.FindAll(c => c.STX_ProdKindID == 1983).ToList();
                gP3_CityViewModel.allTopDisplay = topCenterOnPage.Join(gP3_CityViewModel.centerDisplay, b => b.STX_ProdKindID, d => d.SDP_GroupProdKindID, (b, d) =>
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
                gP3_CityViewModel.allTop = gP3_CityViewModel.allTopDisplay.Count();
            }
            gP3_CityViewModel.bannerOnPage = gP3_CityViewModel.boxContent.FindAll(bn => bn.STX_ProdKindID == 1624).ToList();

            gP3_CityViewModel.isWhatExpect = gP3_CityViewModel.boxContent.FindAll(bn => bn.STX_ProdKindID == 1622).ToList();
            if (gP3_CityViewModel.isWhatExpect.Count() > 0)
            {
                StringBuilder isExpect = new StringBuilder();
                foreach (var bx in gP3_CityViewModel.isWhatExpect)
                {
                    isExpect.Append("," + Regex.Match(bx.STX_URL, @"\d+").Value);
                }
                var Result7 = await _dapperWrap.GetRecords<CMScity>(SqlCalls.SQL_CMSContent(isExpect.ToString().Substring(1)));
                List<CMScity> expectSMS = Result7.ToList();
                gP3_CityViewModel.WhatExpect =
                                   from c in expectSMS
                                   select new CMScity
                                   {
                                       CMSID = c.CMSID,
                                       CMS_Title = c.CMS_Title,
                                       CMS_Description = (c.CMS_Description ?? "none") + "|" + GetSingleCMSTitle(gP3_CityViewModel.isWhatExpect, c.CMSID) //to complete with GetSingleCMSTitle(isWhatExpect, c.CMSID)})
                                   };
            }

            //var result8 = await _dapperWrap.GetRecords<WeightPlace>(SqlCalls.SQL_weightPlacesByIntID(0, gP3_CityViewModel.cityIDs));
            //gP3_CityViewModel.placesOnWeight = result8.ToList();

            //gP3_CityViewModel.citesOnWeight = gP3_CityViewModel.placesOnWeight.FindAll(c => c.CountryID == gP3_CityViewModel.countryID).ToList();
            //gP3_CityViewModel.citesnotOnWeight = gP3_CityViewModel.placesOnWeight.FindAll(c => c.CountryID != gP3_CityViewModel.countryID).ToList();

            //var result9 = await _dapperWrap.GetRecords<WeightPlace>(SqlCalls.SQL_CountryCitiesByplcID(0, gP3_CityViewModel.countryID));
            //gP3_CityViewModel.placesOnCountry = result9.ToList();
            gP3_CityViewModel.citesOnCountry = gP3_CityViewModel.placesOnCountry.FindAll(c => c.CountryID == gP3_CityViewModel.countryID).ToList();

            List<WeightPlace> leftlist = new List<WeightPlace>();
            Int32 lfc = 0;
            //gP3_CityViewModel.leftCityList = gP3_CityViewModel.placesOnWeight.FindAll(cty => cty.STR_PlaceTypeID == 1 || cty.STR_PlaceTypeID == 25);
            //gP3_CityViewModel.leftCityList = gP3_CityViewModel.placesOnWeight.FindAll(cty => cty.CountryID == gP3_CityViewModel.countryID);
            for (Int32 lf = 0; lf < gP3_CityViewModel.citesOnCountry.Count() - 1; lf++)
            {
                if (lf == 0 & gP3_CityViewModel.citesOnCountry[lf].STR_PlaceAIID < 1000)
                {
                    leftlist.Add(new WeightPlace() { STR_PlaceTitle = "Popular Cities", STR_PlaceID = 0, STR_PlaceShortInfo = "none" });
                }
                if (lf > 0 & gP3_CityViewModel.citesOnCountry[lf].STR_PlaceAIID == 1000)
                {
                    lfc = lfc + 1;
                    if (lfc == 1)
                    {
                        leftlist.Add(new WeightPlace() { STR_PlaceTitle = "Other Cities", STR_PlaceID = 0, STR_PlaceShortInfo = "none" });
                    }
                }
                leftlist.Add(new WeightPlace() { STR_PlaceTitle = gP3_CityViewModel.citesOnCountry[lf].STR_PlaceTitle, STR_PlaceID = gP3_CityViewModel.citesOnCountry[lf].STR_PlaceID, STR_PlaceShortInfo = gP3_CityViewModel.citesOnCountry[lf].STR_PlaceShortInfo });

            }
            gP3_CityViewModel.leftCountryCityList = leftlist.ToList();


            //gP3_CityViewModel.leftCMS = dbConn.QueryAsync<CMSPage>(SqlCalls.SQL_PlaceCMSByplaceID(gP3_CityViewModel.cityID)).Result.ToList();
            //var Result8 = await _dapperWrap.GetRecords<CMSPage>(SqlCalls.SQL_PlaceCMSByplaceID(gP3_CityViewModel.cityID.ToString()));
            //gP3_CityViewModel.leftCMS = Result8.ToList();
            foreach(var p in gP3_CityViewModel.allFeatPackages)
            {
                gP3_CityViewModel.strPlcsIDs.Append(p.PDL_Places);
            }

            string placesIDs = gP3_CityViewModel.strPlcsIDs.ToString();
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
                dvPlacesToComb = dvPlacesToComb.GroupBy(x => x.CouNA, (key, g) => g.Select(x => x).First()).ToList();
                string chkNA = "";
                for (var c = 0; c < dvPlacesToComb.Count(); c++)
                {
                    if (dvPlacesToComb[c].CouID != gP3_CityViewModel.countryID)
                    {
                        if (dvPlacesToComb[c].CouNA != chkNA)
                        {
                            gP3_CityViewModel.arrpCombCountry.Add(dvPlacesToComb[c].CouID + "|" + dvPlacesToComb[c].CouNA);
                            chkNA = dvPlacesToComb[c].CouNA;
                        }
                    }
                }
            }

            var Result10 = await _dapperWrap.GetRecords<NumberofCustomerFeedbacks>(SqlCalls.SQL_Get_NumberofCustomerFeedbacks_OverAllScore());
            overAllReviews = Result10.ToList();
            gP3_CityViewModel.NumComments = overAllReviews.FirstOrDefault().NumComments;
            gP3_CityViewModel.Score = overAllReviews.FirstOrDefault().Score;
            //gP3_CityViewModel.listReviews = overAllReviews.ToList();
            //ViewBag.PageType = "ListingPage";
            //ViewBag.CriteoIDs = packid3;
            return gP3_CityViewModel;
        }

        private string GetSingleCMSTitle(List<BoxContent> isWhatExpect, long cMSID)
        {
            var singleTitle = isWhatExpect.Where(eg => eg.STX_URL.Contains("/" + cMSID + "/")).Select(eg => eg.STX_Title).ToList();
            if (singleTitle.Count == 0)
            {
                singleTitle = isWhatExpect.Where(eg => eg.STX_URL.Contains("cms=" + cMSID + "&")).Select(eg => eg.STX_Title).ToList();
            }
            return singleTitle.First().ToString();
        }
    }

}
