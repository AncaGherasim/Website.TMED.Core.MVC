using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MVC_TMED.Infrastructure;
using Microsoft.Extensions.Options;
using MVC_TMED.Models;
using MVC_TMED.Models.ViewModels;
using System.Data;

namespace MVC_TMED.Controllers
{
    public class GP2CityClass : Controller
    {
        private readonly IOptions<AppSettings> _appSettings;
        private readonly DapperWrap _dapperWrap;

        public GP2CityClass(DapperWrap dapperWrap, IOptions<AppSettings> appsettings)
        {
            _appSettings = appsettings;
            _dapperWrap = dapperWrap;
        }

        //[HttpGet("GP2_City/{City}", Name = "GP2_City_Route")]
        public async Task<GP2_CityViewModel> GP2_City(string City)
        {
            GP2_CityViewModel gP2_CityPageViewModel = new GP2_CityViewModel();

            //List<PlaceInfo_By_PlaceName> dvPlace;
            List<Feedback> listCustomFeed;
            List<PackOnInterestPriority> listPackOnCty;
            List<DisplayArea> managerDisplay;
            List<DisplayArea> centerDisplay;
            List<NumberofCustomerFeedbacks> overAllReviews;
            List<weightItin> objItineraries;
            IDbConnection dbConn = null;
            //dbConn = new SqlConnection(_appSettings.ConnectionStrings.sqlConnStr);

            var result1 = await _dapperWrap.GetRecords<PlaceInfo_By_PlaceName>(SqlCalls.SQL_PlaceInfo_By_PlaceName(City));
            gP2_CityPageViewModel.placeInfo = result1.ToList();
            if (gP2_CityPageViewModel.placeInfo.Count == 0)
            { throw new Exception("Customer Feedbacks by City ID."); }

            var result2 = await _dapperWrap.GetRecords<weightItin>(SqlCalls.SQL_PackOnInterestPriorityList(gP2_CityPageViewModel.placeInfo.FirstOrDefault().STRID.ToString(), "0"));
            objItineraries = result2.ToList();
            if (objItineraries.Count > 0)
            {
                gP2_CityPageViewModel.allItineraries = objItineraries[0].TotalPacks;
            }
            gP2_CityPageViewModel.listFeatured = objItineraries.Take(1).ToList();
            gP2_CityPageViewModel.otherFeatured = objItineraries.Skip(1).Take(4).ToList();

            var first3 = objItineraries.Take(3).ToList();
            var packid3 = "";
            var iC = 0;
            foreach (var d in first3)
            {
                if (iC < first3.Count - 1) { packid3 = packid3 + "'" + d.PDLID + "', "; } else { packid3 = packid3 + "'" + d.PDLID + "'"; };
                iC++;
            };

            var result3 = await _dapperWrap.GetRecords<Feedback>(SqlCalls.SQL_FeedbacksByPlaceID(gP2_CityPageViewModel.placeInfo.FirstOrDefault().STR_PlaceID));
            listCustomFeed = result3.ToList();
            foreach (var f in listCustomFeed)
            {
                gP2_CityPageViewModel.boxCustomFeed.Add(Utilities.FormatCustomerComment(f.PCC_Comment, 150) + "||" + f.dep_date.ToString() + "|" + f.CountryName + "|" + f.PCC_PDLID + "|" + f.PDL_Title);
            }
            if (listCustomFeed.Count > 0)
            {
                gP2_CityPageViewModel.packFeedCountC = listCustomFeed[0].NoOfComments;
            }
            
            var result4 = await _dapperWrap.GetRecords<PackOnInterestPriority>(SqlCalls.SQL_PackOnInterestPriorityList(gP2_CityPageViewModel.placeInfo.FirstOrDefault().STRID.ToString(), "0"));
            listPackOnCty = result4.ToList();
            List<PackOnInterestPriority> featPack = listPackOnCty.FindAll(n => n.SPPW_Weight < 999);
            if (featPack.Count == 0)
            {
                featPack = featPack.FindAll(n => n.PDL_SequenceNo < 9);
            }
            gP2_CityPageViewModel.listFeatItin = featPack;
            foreach (var pk in featPack)
            {
                gP2_CityPageViewModel.boxFeaturPacks.Add(pk.PDLID + "|" + pk.PDL_Title + "|" + pk.SPD_Description + "|" + pk.PDL_Duration + "|" + pk.STP_Save_ + "|" + pk.PDL_Content + "|" + pk.NoOfFeed + "|" + pk.SPD_InternalComments + "|" + pk.IMG_Path_URL);
                gP2_CityPageViewModel.strPlcsIDs.Append(pk.PDL_Places);
            }

            var result5 = await _dapperWrap.GetRecords<DisplayArea>(SqlCalls.SQL_ManagerDisplayArea(gP2_CityPageViewModel.placeInfo.FirstOrDefault().STR_PlaceID));
            managerDisplay = result5.ToList();
            gP2_CityPageViewModel.leftDisplay = managerDisplay.FindAll(c => c.SDP_DisplayProdKindID == 1877).ToList();
            centerDisplay = managerDisplay.FindAll(c => c.SDP_DisplayProdKindID == 1878).ToList();

            var result6 = await _dapperWrap.GetRecords<BoxContent>(SqlCalls.SQL_BoxesContentArea(gP2_CityPageViewModel.placeInfo.FirstOrDefault().STRID));
            gP2_CityPageViewModel.boxContent = result6.ToList();
            foreach (var b in gP2_CityPageViewModel.boxContent)
            {
                b.STX_URL = b.STX_URL.Replace("https://www.tripmasters.com/europe", "").Replace("http://www.tripmasters.com/europe", "");
            }

            if (centerDisplay.Count > 0)
            {
                List<BoxContent> topCenterOnPage = gP2_CityPageViewModel.boxContent.FindAll(c => c.STX_ProdKindID == 1983).ToList();
                gP2_CityPageViewModel.allTopDisplay = topCenterOnPage.Join(centerDisplay, b => b.STX_ProdKindID, d => d.SDP_GroupProdKindID, (b, d) =>
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
                Int32 allTop = gP2_CityPageViewModel.allTopDisplay.Count;
            }
            gP2_CityPageViewModel.bannerOnPage = gP2_CityPageViewModel.boxContent.FindAll(bn => bn.STX_ProdKindID == 1624).ToList();

            var result7 = await _dapperWrap.GetRecords<WeightPlace>(SqlCalls.SQL_weightPlacesByIntID(0, gP2_CityPageViewModel.placeInfo.FirstOrDefault().STRID));
            gP2_CityPageViewModel.placesOnWeight = result7.ToList();
            gP2_CityPageViewModel.citesOnWeight = gP2_CityPageViewModel.placesOnWeight.FindAll(c => c.CountryID == gP2_CityPageViewModel.placeInfo.FirstOrDefault().CountryID).ToList();
            gP2_CityPageViewModel.citesnotOnWeight = gP2_CityPageViewModel.placesOnWeight.FindAll(c => c.CountryID != gP2_CityPageViewModel.placeInfo.FirstOrDefault().CountryID).ToList();

            var result8 = await _dapperWrap.GetRecords<WeightPlace>(SqlCalls.SQL_CountryCitiesByplcID(0, gP2_CityPageViewModel.placeInfo.FirstOrDefault().CountryID));
            gP2_CityPageViewModel.placesOnCountry = result8.ToList();
            gP2_CityPageViewModel.citesOnCountry = gP2_CityPageViewModel.placesOnCountry.FindAll(c => c.CountryID == gP2_CityPageViewModel.placeInfo.FirstOrDefault().CountryID).ToList();

            gP2_CityPageViewModel.pageTitle = gP2_CityPageViewModel.placeInfo.FirstOrDefault().CountryNA + " Vacation Packages | Custom " + gP2_CityPageViewModel.placeInfo.FirstOrDefault().CountryNA + " Vacation Packages | Tripmasters";
            gP2_CityPageViewModel.pageMetaDesc = gP2_CityPageViewModel.placeInfo.FirstOrDefault().CountryNA + " Vacation Packages. Build custom " + gP2_CityPageViewModel.placeInfo.FirstOrDefault().CountryNA + " vacations. Best " + gP2_CityPageViewModel.placeInfo.FirstOrDefault().CountryNA + " vacation deals. Tours to " + gP2_CityPageViewModel.placeInfo.FirstOrDefault().CountryNA + ". " + gP2_CityPageViewModel.placeInfo.FirstOrDefault().CountryNA + " online booking.";
            gP2_CityPageViewModel.pageMetaKey = gP2_CityPageViewModel.placeInfo.FirstOrDefault().CountryNA + " air and hotel stays, sightseeing tours, hotel packages, deals, rail, images, online booking, pricing, information, hotel travel, recommendations, resort, accommodations, Europe";
            gP2_CityPageViewModel.pageHeaderText = gP2_CityPageViewModel.placeInfo.FirstOrDefault().CountryNA + " Vacations";
            gP2_CityPageViewModel.pageDescriptionC = gP2_CityPageViewModel.pageMetaDesc;
            gP2_CityPageViewModel.pageBannerText = "US based|Price & Book in seconds|Discounted Air included";

            ViewBag.PageTitle = gP2_CityPageViewModel.pageTitle;
            ViewBag.pageMetaDesc = gP2_CityPageViewModel.pageMetaDesc;
            ViewBag.pageMetaKey = gP2_CityPageViewModel.pageMetaKey;

            var result9 = await _dapperWrap.GetRecords<CMSPage>(SqlCalls.SQL_CMS_onGPpages("PlcH", 0, gP2_CityPageViewModel.placeInfo.FirstOrDefault().STRID));
            gP2_CityPageViewModel.leftCMS = result9.ToList();
            string placesIDs = gP2_CityPageViewModel.strPlcsIDs.ToString();
            Int32 _placesIDs = placesIDs.Count() - 1;
            if (_placesIDs >= 0)
            {
                if (placesIDs.Substring(_placesIDs, 1) == ",")
                {
                    placesIDs = placesIDs.Substring(0, _placesIDs);
                }
                var result10 = await _dapperWrap.GetRecords<CombineCountries>(SqlCalls.SQL_CombineCountries(placesIDs));
                gP2_CityPageViewModel.arrpCombCountry = result10.ToList();
            }

            var result11 = await _dapperWrap.GetRecords<NumberofCustomerFeedbacks>(SqlCalls.SQL_Get_NumberofCustomerFeedbacks_OverAllScore());
            overAllReviews = result11.ToList();
            gP2_CityPageViewModel.NumComments = overAllReviews.FirstOrDefault().NumComments;
            gP2_CityPageViewModel.Score = overAllReviews.FirstOrDefault().Score;
            //dbConn.Dispose();
            ViewBag.PageType = "ListingPage";
            ViewBag.CriteoIDs = packid3;

            return gP2_CityPageViewModel;
        }
    }
}
