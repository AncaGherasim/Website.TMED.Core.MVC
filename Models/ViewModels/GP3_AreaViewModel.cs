using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MVC_TMED.Infrastructure;
using Microsoft.AspNetCore.Mvc;
using System.Text;

namespace MVC_TMED.Models.ViewModels
{
    public class DisplayBoxArea
    {
        public string CMS_Content { get; set; }
        public Int32 STX_CMSID { get; set; }
        public string STX_Description { get; set; }
        public Int32 STX_PictureWidthpx { get; set; }
        public Int32 STX_PictureHeightpx { get; set; }
        public string STX_PictureURL { get; set; }
        public Int32 STX_Priority { get; set; }
        public Int32 STX_ProdKindID { get; set; }
        public string STX_Title { get; set; }
        public string STX_URL { get; set; }
        public string SDP_DisplayTitle { get; set; }
        public string SDP_TitleBGColor { get; set; }
    }

    public class GP3_AreaViewModel
    {
        private string city;
        private readonly AppSettings _appSettings;
        public List<PackOnInterestPriority> listFeatured = new List<PackOnInterestPriority>();
        public List<PackOnInterestPriority> suggestedPackages = new List<PackOnInterestPriority>();
        public Int32 allItineraries = 0;
        public List<PackOnInterestPriority> otherFeatured = new List<PackOnInterestPriority>();
        public Int64 packFeedCountC = 0;
        public string pageBannerText = "";
        public string pageDescriptionC = "";
        public string pageTitle = "";
        public string pageMetaDesc = "";
        public string pageMetaKey = "";
        public List<PackOnInterestPriority> featPack = new List<PackOnInterestPriority>();
        public List<DisplayArea> centerDisplay;
        public List<string> boxCustomFeed = new List<string>();
        public List<string> boxFeaturPacks = new List<string>();
        public List<BoxContent> bannerOnPage;
        public List<BoxContent> hotelAct = new List<BoxContent>();
        public List<BoxContent> isWhatExpect = new List<BoxContent>();
        public List<DisplayBox> allTopDisplay;
        public List<CMScity> expectSMS;
        public List<WeightPlace> leftCityList;
        public List<WeightPlace> leftCountryCityList;
        public string countryNA;
        public Int32 areaIDs;
        public Int32 areaID;
        public string areaNA;
        public Int32 countryID;
        public Int32 allTop;
        public string intNA;
        public string pageHeaderText;
        public List<WeightPlace> citesOnWeight;
        public List<WeightPlace> citesnotOnWeight;
        public List<WeightPlace> placesOnCountry = new List<WeightPlace>();
        public List<WeightPlace> citesOnCountry;
        public List<WeightPlace> placesOnWeight;
        public StringBuilder strPlcsIDs = new StringBuilder();
        public List<BoxContent> boxContent = new List<BoxContent>();
        public List<DisplayArea> leftDisplay;
        public List<DisplayArea> areaHighlightOrientation;
        public List<PackOnInterestPriority> listFeatItin;
        public List<CMSPage> leftCMS = new List<CMSPage>();
        public List<string> arrpCombCountry = new List<string>();
        public Int32 NumComments;
        public decimal Score;
        public Int32 packFeedCountCity;
        public List<NumberofCustomerFeedbacks> listReviews = new List<NumberofCustomerFeedbacks>();
        public string pageDescriptionCity = "";
        public IEnumerable<CMScity> WhatExpect;
        public IEnumerable<PackOnInterestPriority> bestPackages1;
        public IEnumerable<PackOnInterestPriority> bestPackages2;
    }
}
