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

namespace MVC_TMED.Controllers.VacationTemplates
{
    public class GP3_MultiCountryClass
    {
        private readonly IOptions<AppSettings> _appSettings;
        private readonly DapperWrap _dapperWrap;
        public GP3_MultiCountryClass(DapperWrap dapperWrap, IOptions<AppSettings> appSettings)
        {
            _appSettings = appSettings;
            _dapperWrap = dapperWrap;
        }
        public async Task<GP3_MultiCountryViewModel> GP3_MultiCou(Int32 placeId)
        {
            GP3_MultiCountryViewModel gP3_MultiCountryViewModel = new GP3_MultiCountryViewModel();
            //MultiCou = Utilities.UppercaseFirstLetter(MultiCou.Replace("_", " "));
            List<PlaceInfo_By_PlaceName> dvPlace;
            List<Feedback> dvCustomFeed;
            List<PackOnInterestPriority> dvPackOnCty;
            List<DisplayArea> managerDisplay = new List<DisplayArea>();
            List<weightItin> objItineraries = new List<weightItin>();
            List<NumberofCustomerFeedbacks> overAllReviews;
            List<Place_Info> interestInfo = new List<Place_Info> ();

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
            foreach ( var ci in gP3_MultiCountryViewModel.placesOnWeight.FindAll( x => x.STR_PlaceTypeID == 25 || x.STR_PlaceTypeID == 1))
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

            return gP3_MultiCountryViewModel;

        }

    }
}
