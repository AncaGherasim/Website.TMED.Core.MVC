using System.Collections.Generic;
using System;
using System.Text;

namespace MVC_TMED.Models.ViewModels
{
    public class GP3_SecondaryDestinationViewModel
    {
        public List<PackOnInterestPriority> allFeatPackages = new List<PackOnInterestPriority>();
        public List<PackOnInterestPriority> bestPackages = new List<PackOnInterestPriority>();
        public Int32 allItineraries = 0;
        public string pageBannerText = "";
        public string pageDescriptionC = "";
        public string pageTitle = "";
        public string pageMetaDesc = "";
        public string pageMetaKey = "";
        public List<DisplayArea> centerDisplay;
        public List<BoxContent> bannerOnPage;
        public List<BoxContent> hotelAct = new List<BoxContent>();
        public List<BoxContent> isWhatExpect = new List<BoxContent>();
        public List<DisplayBox> allTopDisplay;
        public string countryNA;
        public Int32 destinationIds;
        public string destinationDescription;
        public Int32 destinationId;
        public string destinationName;
        public Int32 countryId;
        public Int32 destinationPlaceId;
        public Int32 allTop;
        public string pageHeaderText;
        public List<BoxContent> boxContent;
        public List<DisplayArea> leftDisplay;
        public List<DisplayArea> areaHighlightOrientation;
        public List<PackOnInterestPriority> listFeatItin;
        public string pageDescriptionCity = "";
        public List<CMSPage> leftCMS = new List<CMSPage>();
        public List<string> arrpCombCountry = new List<string>();
        public IEnumerable<CMScity> WhatExpect;
        public List<WeightPlace> placesOnCountry;
        public List<WeightPlace> citesOnCountry;
        public List<WeightPlace> leftCountryCityList;
        public StringBuilder strPlcsIDs = new StringBuilder();
    }
}
