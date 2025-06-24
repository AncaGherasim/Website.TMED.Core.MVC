using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Text;

namespace MVC_TMED.Models.ViewModels
{
    public class GP2_MultiCountryViewModel
    {
        public Int32 multicountryIDs = -1;
        public string multicountryDES = "";
        public Int32 multicountryID = -1;
        public string multicountryNa = "";
        public Int32 multiCountryPLC = -1;
        public string intNA = "";
        public List<weightItin> boxFeaturPacks = new List<weightItin>();
        public List<BoxContent> boxContent = new List<BoxContent>();
        public List<BoxContent> centerDsp = new List<BoxContent>();
        public List<BoxContent> bannerOnPage = new List<BoxContent>();
        public List<DisplayBox> allTopDisplay = new List<DisplayBox>();
        public List<WeightPlace> placesOnWeight = new List<WeightPlace>();
        public List<CustomReviews> CountriesFeeds = new List<CustomReviews>();
        public string pageMetaDesc = "";
        public string pageMetaKey = "";
        public string pageHeaderText = "";
        public string pageTitle = "";
        public string PageType = "";
        public string CriteoIDs = "";
        public StringBuilder strPlcsIDs = new StringBuilder();
        public List<DisplayArea> leftDisplay = new List<DisplayArea>();
        public List<DisplayArea> managerDisplay = new List<DisplayArea>();
        public string otherFeat = "";
        public List<WeightPlace> countryCities;
        public List<WeightPlace> placesOnCountry;
    }
}
