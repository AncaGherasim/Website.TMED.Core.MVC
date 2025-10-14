using MVC_TMED.Infrastructure;
using System.Collections.Generic;
using System.Text;
using System;

namespace MVC_TMED.Models.ViewModels
{
    public class GP4_ViewModel
    {
        private string city;        
        public Int32 plcSTRID;
        public Int32 placeID;
        public string placeNA;
        public Int32 countryID;
        public string countryNA;
        public string pageTopText;
        public string pagePicture;
        public string pageTitle = "";
        public string pageMetaDesc = "";
        public string pageMetaKey = "";
        public string bestSubTitle = "";
        public string suggSubTitle = "";
        public Int32 NumComments;
        public decimal Score;
        public decimal overAllAvg;
        public List<GP4_PackOnInterestPriority> bestVacPacks = new List<GP4_PackOnInterestPriority>();
        public List<GP4_PackOnInterestPriority> suggestPacks = new List<GP4_PackOnInterestPriority>();
        public List<GP4_PackOnInterestPriority> twoCitiesPacks = new List<GP4_PackOnInterestPriority>();
        public List<GP4_PackOnInterestPriority> threeCitiesPacks = new List<GP4_PackOnInterestPriority>();
        public List<GP4_PackOnInterestPriority> fourCiyiesPacks = new List<GP4_PackOnInterestPriority>();
        public List<GP4_PackOnInterestPriority> fiveCitiesPacks = new List<GP4_PackOnInterestPriority>();
        public List<GP4_DisplayPosition> listDisplayPosition = new List<GP4_DisplayPosition>();        
        public List<GP4_DisplayBox> listBoxDisplay = new List<GP4_DisplayBox>();
        public List<GP4_CountryFeed> listCountryFeed = new List<GP4_CountryFeed>();
        public List<GP4_WeightPlace> listWeightPlace = new List<GP4_WeightPlace>();
    }
}
