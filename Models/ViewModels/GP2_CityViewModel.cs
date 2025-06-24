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

namespace MVC_TMED.Models.ViewModels
{

    public class DisplayBox
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

    public class GP2_CityViewModel
    {
        private string city;
        private readonly AppSettings _appSettings;
        public List<weightItin> listFeatured = new List<weightItin>();
        public Int32 allItineraries = 0;
        public List<weightItin> otherFeatured = new List<weightItin>();
        public Int64 packFeedCountC = 0;
        public string pageBannerText = "";
        public string pageDescriptionC = "";
        public string pageTitle = "";
        public string pageMetaDesc = "";
        public string pageMetaKey = "";

        public List<PlaceInfo_By_PlaceName> placeInfo = new List<PlaceInfo_By_PlaceName>();
        public List<string> boxCustomFeed = new List<string>();
        public List<string> boxFeaturPacks = new List<string>();
        public List<BoxContent> bannerOnPage;
        public List<DisplayBox> allTopDisplay;
        public string pageHeaderText;
        public List<WeightPlace> citesOnWeight;
        public List<WeightPlace> citesnotOnWeight;
        public List<WeightPlace> placesOnCountry;
        public List<WeightPlace> citesOnCountry;
        public List<WeightPlace> placesOnWeight;
        public StringBuilder strPlcsIDs = new StringBuilder();
        public List<BoxContent> boxContent;
        public List<DisplayArea> leftDisplay;
        public List<PackOnInterestPriority> listFeatItin;
        public List<CMSPage> leftCMS = new List<CMSPage>();
        public List<CombineCountries> arrpCombCountry = new List<CombineCountries>();
        public Int32 NumComments;
        public decimal Score;
        public Int32 packFeedCountCity = -1;

        public string pageDescriptionCity = "";
        //public GP2_CityViewModel(string City, MVC_TMED.Infrastructure.AppSettings appsettings)
        //{
        //    _appSettings = appsettings;
        //    city = City;
        //}




    }
}
