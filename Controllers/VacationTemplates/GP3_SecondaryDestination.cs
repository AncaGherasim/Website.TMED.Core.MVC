using MVC_TMED.Infrastructure;
using MVC_TMED.Models.ViewModels;
using MVC_TMED.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Text.RegularExpressions;
using System.Text;

namespace MVC_TMED.Controllers.VacationTemplates
{
    public class GP3_SecondaryDestinationClass
    {
        private readonly DapperWrap _dapperWrap;
        public GP3_SecondaryDestinationClass(DapperWrap dapperWrap)
        {
            _dapperWrap = dapperWrap;
        }
        public async Task<GP3_SecondaryDestinationViewModel> GP3_SecondaryDestination(string City)
        {
            GP3_SecondaryDestinationViewModel gP3_SecondaryDestinationViewModel = new GP3_SecondaryDestinationViewModel();
            List<PlaceInfo_By_PlaceName> placeInfo;
            List<DisplayArea> managerDisplay;
            //Get Place Infomation
            var Result1 = await _dapperWrap.GetRecords<PlaceInfo_By_PlaceName>(SqlCalls.SQL_PlaceInfo_By_PlaceName(City));
            placeInfo = Result1.ToList();
            if (placeInfo.Count == 0)
            {
                throw new Exception("No destination information by place name.");
            }
            gP3_SecondaryDestinationViewModel.countryNA = placeInfo.FirstOrDefault().CountryNA;
            gP3_SecondaryDestinationViewModel.destinationIds = placeInfo.FirstOrDefault().STRID;
            gP3_SecondaryDestinationViewModel.destinationDescription = placeInfo.FirstOrDefault().STR_PlaceShortInfo;
            gP3_SecondaryDestinationViewModel.destinationId = placeInfo.FirstOrDefault().STR_PlaceID;
            gP3_SecondaryDestinationViewModel.destinationName = placeInfo.FirstOrDefault().STR_PlaceTitle;
            gP3_SecondaryDestinationViewModel.countryId = placeInfo.FirstOrDefault().CountryID;
            gP3_SecondaryDestinationViewModel.destinationPlaceId = placeInfo.FirstOrDefault().STR_PlaceID;

            gP3_SecondaryDestinationViewModel.pageTitle = gP3_SecondaryDestinationViewModel.destinationName + " Vacation Packages | Vacation to " + gP3_SecondaryDestinationViewModel.destinationName + " | Tripmasters";
            gP3_SecondaryDestinationViewModel.pageMetaDesc = gP3_SecondaryDestinationViewModel.destinationName + "  Vacations, custom vacations to " + gP3_SecondaryDestinationViewModel.destinationName + " , best " + gP3_SecondaryDestinationViewModel.destinationName + " vacation packages. Travel to " + gP3_SecondaryDestinationViewModel.destinationName + ". " + gP3_SecondaryDestinationViewModel.destinationName + " online booking.";
            gP3_SecondaryDestinationViewModel.pageMetaKey = gP3_SecondaryDestinationViewModel.destinationName + " air and hotel stays, sightseeing tours, hotel packages, deals, rail, images, online booking, pricing, information, hotel travel, recommendations, resort, accommodations, Europe, european vacation, Africa vacation packages, Middle East vacation packages";
            gP3_SecondaryDestinationViewModel.pageHeaderText = gP3_SecondaryDestinationViewModel.destinationName + " Vacation Packages";
            gP3_SecondaryDestinationViewModel.pageDescriptionC = gP3_SecondaryDestinationViewModel.pageMetaDesc;
            gP3_SecondaryDestinationViewModel.pageBannerText = "Book Customizable Multi-city trips in seconds|Curated Hotels & Services ";
            //Get Managers Display Content
            var Result2 = await _dapperWrap.GetRecords<DisplayArea>(SqlCalls.SQL_ManagerDisplayAreaGp3City(gP3_SecondaryDestinationViewModel.destinationId, gP3_SecondaryDestinationViewModel.destinationIds));
            managerDisplay = Result2.ToList();

            if (managerDisplay.Count > 0)
            {
                gP3_SecondaryDestinationViewModel.leftDisplay = managerDisplay.FindAll(c => c.SDP_DisplayProdKindID == 1877).ToList();
                gP3_SecondaryDestinationViewModel.centerDisplay = managerDisplay.FindAll(c => c.SDP_DisplayProdKindID == 1878).ToList();
                gP3_SecondaryDestinationViewModel.areaHighlightOrientation = gP3_SecondaryDestinationViewModel.leftDisplay.FindAll(d => d.SDP_GroupProdKindID == 1623 || d.SDP_GroupProdKindID == 1619 || d.SDP_GroupProdKindID == 1912 || d.SDP_GroupProdKindID == 2478 || d.SDP_GroupProdKindID == 2470).ToList();
            }
            //Get Destination Content Areas - Web Speciality Boxes
            var Result3 = await _dapperWrap.GetRecords<BoxContent>(SqlCalls.SQL_BoxesContentArea(gP3_SecondaryDestinationViewModel.destinationIds));
            gP3_SecondaryDestinationViewModel.boxContent = Result3.ToList();
            if (gP3_SecondaryDestinationViewModel.centerDisplay != null)
            {
                List<BoxContent> topCenterOnPage = gP3_SecondaryDestinationViewModel.boxContent.FindAll(c => c.STX_ProdKindID == 1983).ToList();
                gP3_SecondaryDestinationViewModel.bannerOnPage = gP3_SecondaryDestinationViewModel.boxContent.FindAll(bn => bn.STX_ProdKindID == 1624).ToList();
                gP3_SecondaryDestinationViewModel.isWhatExpect = gP3_SecondaryDestinationViewModel.boxContent.FindAll(bn => bn.STX_ProdKindID == 1622).ToList();
                if (gP3_SecondaryDestinationViewModel.isWhatExpect.Count() > 0)
                {
                    StringBuilder isExpect = new StringBuilder();
                    foreach (var bx in gP3_SecondaryDestinationViewModel.isWhatExpect)
                    {
                        isExpect.Append("," + Regex.Match(bx.STX_URL, @"\d+").Value);
                    }
                    var Result4 = await _dapperWrap.GetRecords<CMScity>(SqlCalls.SQL_CMSContent(isExpect.ToString().Substring(1)));
                    List<CMScity> expectSMS = Result4.ToList();
                    gP3_SecondaryDestinationViewModel.WhatExpect =
                                       from c in expectSMS
                                       select new CMScity
                                       {
                                           CMSID = c.CMSID,
                                           CMS_Title = c.CMS_Title,
                                           CMS_Description = (c.CMS_Description ?? "none") + "|" + GetSingleCMSTitle(gP3_SecondaryDestinationViewModel.isWhatExpect, c.CMSID) //to complete with GetSingleCMSTitle(isWhatExpect, c.CMSID)})
                                       };

                }
                gP3_SecondaryDestinationViewModel.allTopDisplay = topCenterOnPage.Join(gP3_SecondaryDestinationViewModel.centerDisplay, b => b.STX_ProdKindID, d => d.SDP_GroupProdKindID, (b, d) =>
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
                gP3_SecondaryDestinationViewModel.allTop = gP3_SecondaryDestinationViewModel.allTopDisplay.Count();
            }
            
            var Result5 = await _dapperWrap.GetRecords<PackOnInterestPriority>(SqlCalls.SQL_PackOnInterestPriorityList(gP3_SecondaryDestinationViewModel.destinationIds.ToString(), "0"));
            var Result6 = await _dapperWrap.GetRecords<TotalPacks>(SqlCalls.SQL_NoOfPacksFeaturedItinByPlaceID(gP3_SecondaryDestinationViewModel.destinationId.ToString()));
            gP3_SecondaryDestinationViewModel.allFeatPackages = Result5.ToList();
            if (gP3_SecondaryDestinationViewModel.allFeatPackages.Count > 0)
            {
                gP3_SecondaryDestinationViewModel.allItineraries = Result6.First().NoOfPacks;
            }
            gP3_SecondaryDestinationViewModel.allFeatPackages = gP3_SecondaryDestinationViewModel.allFeatPackages.FindAll(n => n.SPPW_Weight < 999);
            if (gP3_SecondaryDestinationViewModel.allFeatPackages.Count == 0)
            {
                gP3_SecondaryDestinationViewModel.allFeatPackages = gP3_SecondaryDestinationViewModel.allFeatPackages.FindAll(n => n.PDL_SequenceNo < 9);
            }
            gP3_SecondaryDestinationViewModel.bestPackages = gP3_SecondaryDestinationViewModel.allFeatPackages.Take(4).ToList();
            gP3_SecondaryDestinationViewModel.listFeatItin = gP3_SecondaryDestinationViewModel.allFeatPackages;
            var Result7 = await _dapperWrap.GetRecords<CMSPage>(SqlCalls.SQL_PlaceCMSByplaceID(gP3_SecondaryDestinationViewModel.destinationId.ToString()));
            gP3_SecondaryDestinationViewModel.leftCMS = Result7.ToList();
            foreach (var p in gP3_SecondaryDestinationViewModel.allFeatPackages)
            {
                gP3_SecondaryDestinationViewModel.strPlcsIDs.Append(p.PDL_Places);
            }

            string placesIDs = gP3_SecondaryDestinationViewModel.strPlcsIDs.ToString();
            Int32 _placesIDs = placesIDs.Count() - 1;
            if (_placesIDs >= 0)
            {
                if (placesIDs.Substring(_placesIDs, 1) == ",")
                {
                    placesIDs = placesIDs.Substring(0, _placesIDs);
                }
                List<CombineCountries> dvPlacesToComb = new List<CombineCountries>();

                var Result8 = await _dapperWrap.GetRecords<CombineCountries>(SqlCalls.SQL_CombineCountries(placesIDs));
                dvPlacesToComb = Result8.ToList();
                dvPlacesToComb = dvPlacesToComb.GroupBy(x => x.CouNA, (key, g) => g.Select(x => x).First()).ToList();
                string chkNA = "";
                for (var c = 0; c < dvPlacesToComb.Count(); c++)
                {
                    if (dvPlacesToComb[c].CouID != gP3_SecondaryDestinationViewModel.countryId)
                    {
                        if (dvPlacesToComb[c].CouNA != chkNA)
                        {
                            gP3_SecondaryDestinationViewModel.arrpCombCountry.Add(dvPlacesToComb[c].CouID + "|" + dvPlacesToComb[c].CouNA);
                            chkNA = dvPlacesToComb[c].CouNA;
                        }
                    }
                }
            }

            var Result9 = await _dapperWrap.GetRecords<WeightPlace>(SqlCalls.SQL_CountryCitiesByplcID(0, gP3_SecondaryDestinationViewModel.countryId));
            gP3_SecondaryDestinationViewModel.placesOnCountry = Result9.ToList();
            gP3_SecondaryDestinationViewModel.citesOnCountry = gP3_SecondaryDestinationViewModel.placesOnCountry.FindAll(c => c.CountryID == gP3_SecondaryDestinationViewModel.countryId).ToList();

            List<WeightPlace> leftlist = new List<WeightPlace>();
            Int32 lfc = 0;
            //gP3_CityViewModel.leftCityList = gP3_CityViewModel.placesOnWeight.FindAll(cty => cty.STR_PlaceTypeID == 1 || cty.STR_PlaceTypeID == 25);
            //gP3_CityViewModel.leftCityList = gP3_CityViewModel.placesOnWeight.FindAll(cty => cty.CountryID == gP3_CityViewModel.countryID);
            for (Int32 lf = 0; lf < gP3_SecondaryDestinationViewModel.citesOnCountry.Count() - 1; lf++)
            {
                if (lf == 0 & gP3_SecondaryDestinationViewModel.citesOnCountry[lf].STR_PlaceAIID < 1000)
                {
                    leftlist.Add(new WeightPlace() { STR_PlaceTitle = "Popular Cities", STR_PlaceID = 0, STR_PlaceShortInfo = "none" });
                }
                if (lf > 0 & gP3_SecondaryDestinationViewModel.citesOnCountry[lf].STR_PlaceAIID == 1000)
                {
                    lfc = lfc + 1;
                    if (lfc == 1)
                    {
                        leftlist.Add(new WeightPlace() { STR_PlaceTitle = "Other Cities", STR_PlaceID = 0, STR_PlaceShortInfo = "none" });
                    }
                }
                leftlist.Add(new WeightPlace() { STR_PlaceTitle = gP3_SecondaryDestinationViewModel.citesOnCountry[lf].STR_PlaceTitle, STR_PlaceID = gP3_SecondaryDestinationViewModel.citesOnCountry[lf].STR_PlaceID, STR_PlaceShortInfo = gP3_SecondaryDestinationViewModel.citesOnCountry[lf].STR_PlaceShortInfo });

            }
            gP3_SecondaryDestinationViewModel.leftCountryCityList = leftlist.ToList();

            return gP3_SecondaryDestinationViewModel;
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
