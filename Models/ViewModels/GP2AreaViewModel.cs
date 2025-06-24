using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Text;

namespace MVC_TMED.Models.ViewModels
{
    public class GP2AreaViewModel
    {
        public List<string> boxCustomFeed = new List<string>();
        public List<string> boxFeaturPacks = new List<string>();
        public List<BoxContent> bannerOnPage;
        public List<PackOnInterestPriority> listFeatured = new List<PackOnInterestPriority>();
        public List<PackOnInterestPriority> otherFeatured = new List<PackOnInterestPriority>();
        public List<BoxContent> topCenterOnPage = new List<BoxContent>();
        public List<PackOnInterestPriority> featPack = new List<PackOnInterestPriority>();
        public List<PackOnInterestPriority> dvPackOnCty = new List<PackOnInterestPriority>();
        public List<DisplayBox> allTopDisplay;
        public List<Feedback> dvCustomFeed = new List<Feedback>();
        public string countryNA = "";
        public Int32 areaIDs;
        public string areaDES = "";
        public Int32 areaID;
        public string intNA = "";
        public Int32 countryID;
        public Int32 cityPLC;
        public string areaNA = "";
        public List<WeightPlace> citesOnWeight;
        public List<WeightPlace> citesnotOnWeight;
        public List<WeightPlace> placesOnCountry;
        public List<WeightPlace> citesOnCountry;
        public List<WeightPlace> placesOnWeight;
        public StringBuilder strPlcsIDs = new StringBuilder();
        public List<BoxContent> boxContent;
        public List<DisplayArea> leftDisplay;
        public List<DisplayArea> managerDisplay;
        public List<PackOnInterestPriority> listFeatItin;
        public List<CMSPage> leftCMS = new List<CMSPage>();
        public List<CombineCountries> arrpCombCountry = new List<CombineCountries>();
        public Int32 NumComments;
        public decimal Score;
        public string pageTitle = "";
        public string pageMetaDesc = "";
        public string pageMetaKey = "";
        public string pageHeaderText = "";
        public string pageDescriptionCity = "";
        public string pageBannerText = "";
        public Int32 packFeedCountCity = -1;
        public List<plcExtension> Highlights = new List<plcExtension>();
        public List<PlacesInterest> Cities = new List<PlacesInterest>();
        public List<CitiesRelatedItin> CitiesRelatedItin = new List<CitiesRelatedItin>();
        public List<EachCity> listCitiesOn = new List<EachCity>();
        public List<EachCity> listCitiesMore = new List<EachCity>();
        public List<PlaceInfo_By_PlaceName> dvTopPlaces = new List<PlaceInfo_By_PlaceName>();
        public Int32 TotalCustFeed = -1;
        public List<Feedback> listReviews = new List<Feedback>();
        public List<BoxContent> centerDsp = new List<BoxContent>();
    }
}
