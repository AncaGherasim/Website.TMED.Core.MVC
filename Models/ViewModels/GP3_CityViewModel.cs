using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MVC_TMED.Infrastructure;
using Microsoft.AspNetCore.Mvc;
using System.Text;

namespace MVC_TMED.Models.ViewModels
{  
        public class GP3_CityViewModel
        {
            public List<PackOnInterestPriority> allFeatPackages = new List<PackOnInterestPriority>();
            public List<PackOnInterestPriority> bestPackages = new List<PackOnInterestPriority>();
            public List<Feedback> feedbacks = new List<Feedback>();
            public Int32 allItineraries = 0;
            public Int64 packFeedCountC = 0;
            public string pageBannerText = "";
            public string pageDescriptionC = "";
            public string pageTitle = "";
            public string pageMetaDesc = "";
            public string pageMetaKey = "";
            public List<DisplayArea> centerDisplay;
            public List<BoxContent> bannerOnPage;
            public List<BoxContent> hotelAct = new List<BoxContent>();
            public List<BoxContent> isWhatExpect =new List<BoxContent>();
            public List<DisplayBox> allTopDisplay;
            public List<CMScity> expectSMS;
            public List<WeightPlace> leftCityList;
            public List<WeightPlace> leftCountryCityList;
            public string countryNA;
            public Int32 cityIDs;
            public Int32 cityID;
            public string cityNA;
            public Int32 countryID;
            public Int32 allTop;
            public string pageHeaderText;
            public List<WeightPlace> citesOnWeight;
            public List<WeightPlace> citesnotOnWeight;
            public List<WeightPlace> placesOnCountry;
            public List<WeightPlace> citesOnCountry;
            public List<WeightPlace> placesOnWeight;
            public StringBuilder strPlcsIDs = new StringBuilder();
            public List<BoxContent> boxContent;
            public List<DisplayArea> leftDisplay;
            public List<DisplayArea> areaHighlightOrientation;
            public List<PackOnInterestPriority> listFeatItin;
            public List<CMSPage> leftCMS = new List<CMSPage>();
            public List<string> arrpCombCountry = new List<string>();
            public Int32 NumComments;
            public decimal Score;
            public List<NumberofCustomerFeedbacks> listReviews = new List<NumberofCustomerFeedbacks>();
            public string pageDescriptionCity = "";
            public IEnumerable<CMScity> WhatExpect;
             public string image = "";

    }
}
