using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MVC_TMED.Models.ViewModels
{
    public class InterestViewModel
    {
        public string pageMetaDesc = "";
        public string pageMetaKey = "";
        public string pageHeaderText = "";
        public string pageDescriptionCity = "";
        public string pageBannerText = "";
        public List<string> boxCustomFeed = new List<string>();
        public List<string> boxCountries = new List<string>();
        public List<string> boxFeaturPacks = new List<string>();
        public List<string> arrBanner;
        public Int64 packFeedCountC = 0;
        public Int32 intID = 0;


        public string plcNA = "";
        public Int32 plcIDs = 0;
        public Int32 plcID = 0;
        public string intNA = "";
        public Int32 intIDs = 0;
        public string intDES = "";
        public List<Feedback> listCustomFeed = new List<Feedback>();
        public List<PackOnInterestPriority> featPack = new List<PackOnInterestPriority>();
        public Int32 featItin = -1;
        public string otherFeat = "";
        public List<DisplayArea> listCustDly = new List<DisplayArea>();
        public Decimal Score = 0;
        public Int32 NumComments;
        public List<PackOnInterestPriority> listFeatured = new List<PackOnInterestPriority>();
        public List<PackOnInterestPriority> otherFeatured = new List<PackOnInterestPriority>();

        public List<PlacesInterest> placesInterest = new List<PlacesInterest>();
        
        public List<String> arrCountriesOnW = new List<string>();
        public List<String> arrCitiesOnW = new List<string>();
        public List<BoxContent> boxContent = new List<BoxContent>();
        public List<WeightPlace> placesOnWeight = new List<WeightPlace>();
        public List<BoxContent> boxContent1624 = new List<BoxContent>();
        public List<CustCommentsUserId> listReviews = new List<CustCommentsUserId>();
        public List<DisplayBox> allTopDisplay;

        public List<BoxContent> centerDsp = new List<BoxContent>();
        public List<CMSPage> leftCMS = new List<CMSPage>();
        public List<WeightPlace> placesOnWeightCity = new List<WeightPlace>();

        public List<plcExtension> objPlaceExt = new List<plcExtension>();
        public List<EachCity> listCitiesOn = new List<EachCity>();
        public List<EachCity> listCitiesMore = new List<EachCity>();

        public string strPackOnWeiString = "";
    }
}
