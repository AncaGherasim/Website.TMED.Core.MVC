using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.IO;
using System.Text;

namespace MVC_TMED.Models.ViewModels
{
    public class GP_BestVacationsViewModel
    {
        public string pageMetaDesc = "";
        public string pageMetaKey = "";
        public List<string> boxCustomFeed = new List<string>();
        public List<string> boxCountries = new List<string>();
        public List<string> boxFeaturPacks = new List<string>();
        public List<string> arrBanner;
        public Int32 featItin = -1;
        public string otherFeat = "";
        public string bstNA = "";
        public Int32 bstID = 0;
        public string bstDES = "";
        public Int32 bstPLC = 0;
        public Int32 plcsR = 0;
        public StringBuilder strPlcsIDs = new StringBuilder();
        public List<String> arrCountriesOnW = new List<string>();
        public List<String> arrCitiesOnW = new List<string>();
        public List<BoxContent> boxContent = new List<BoxContent>();
        public List<DisplayArea> listCustDly = new List<DisplayArea>();
        public List<WeightPlace> placesOnWeight = new List<WeightPlace>();
        public List<WeightPlace> placesOnWeightCity = new List<WeightPlace>();
        public List<WeightPlace> placesOnWeightCountry = new List<WeightPlace>();
        public List<PackOnInterestPriority> featPack = new List<PackOnInterestPriority>();
        public List<BoxContent> boxContent1624 = new List<BoxContent>();
        public List<CustCommentsUserId> listReviews = new List<CustCommentsUserId>();
        public List<DisplayBox> allTopDisplay;
        public List<BoxContent> centerDsp = new List<BoxContent>();
        


        //GP3_BestVacations
        public Int32 intID = 0;
        public string intNA = "";
        public Int32 intIDs = 0;
        public Int32 allTop = 0;
        public string pageHeaderText;
        public List<string> boxSugg = new List<string>();
        public List<string> boxO = new List<string>();
        public List<WeightPlace> citesOnWeight = new List<WeightPlace>();
        public List<string> boxCustomFeedMost = new List<string>();
        public List<string> boxCustomFeedMost2 = new List<string>();
        public IEnumerable<PackOnInterestPriority> listFeatItin;
        public IEnumerable<PackOnInterestPriority> otherFeatured;
        public IEnumerable<PackOnInterestPriority> suggetstedFeatured;
        public Int32 NumComments;
        public decimal Score;
        public Int32 packFeedCountCity = -1;
        public List<DisplayArea> leftDisplay;
        public List<DisplayArea> areaHighlightOrientation;
        public List<BoxContent> bannerOnPage;
    }
}
