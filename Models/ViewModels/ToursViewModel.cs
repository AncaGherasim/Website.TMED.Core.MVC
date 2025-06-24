using System;
using System.Collections.Generic;

namespace MVC_TMED.Models.ViewModels
{
    public class ToursViewModel
    {
        public List<weightItinCountry> bulletList = new List<weightItinCountry>();
        public List<weightItinCountry> listFeatured = new List<weightItinCountry>();
        public List<weightItinCountry> otherFeatured = new List<weightItinCountry>();
        public List<weightItinCountry> otherFeatured1 = new List<weightItinCountry>();
        public List<weightItinCountry> otherFeatured2 = new List<weightItinCountry>();
        public List<weightItinCountry> suggestedItin = new List<weightItinCountry>();
        public List<weightItinCountry> bestPackages = new List<weightItinCountry>();
        public List<weightItinCountry> moreItin = new List<weightItinCountry>();
        public List<weightItinCountry> moreItinHolidays = new List<weightItinCountry>();
        
        public List<PackInfo> ListPackInfo { get; set; }
        public List<weightItinCountry> objItineraries = new List<weightItinCountry>();

        public string placeNA = "";
        public Int32 placeID = 0;
        public string placeShortInfo = "";
        public Int64 packFeedCountC;
        public string pageHeaderText = "";
        public string pageBannerText = "";
        public string pageDescriptionC = "";
        public string pageTitle = "";
        public string pageMetaDesc = "";
        public string pageMetaKey = "";
        public string Continent = "";
        public Int32 UserID = 0;
        public string imageCountryPath = "";
        public string SeoCountryPath = "";
        public Int32 allItineraries = 0;
        public Decimal Score = 0;
        public List<CMSCountry> listCMS = new List<CMSCountry>();
        public List<EachCity> listCitiesOn = new List<EachCity>();
        public List<EachCity> listCities = new List<EachCity>();
        public List<EachCity> listCitiesMore = new List<EachCity>();
        public List<TopSellersPackFeedback> listReviews = new List<TopSellersPackFeedback>();
        public List<CustomerReviewVisit> listReviewsVisit = new List<CustomerReviewVisit>();
        public List<CombineCoun> listCombineCou = new List<CombineCoun>();
        public List<weightItinCountry> listItineraries = new List<weightItinCountry>();
        public List<weightItinCountry> listMoreItin = new List<weightItinCountry>();
        public List<weightItinCountry> listCombine = new List<weightItinCountry>();

        public List<FaqQR> FaqList = new List<FaqQR>();
        public string packid = "";
        public string htmlRedis = "";
        public List<CountryHighlights> listCountryHighlights = new List<CountryHighlights>();
        public Int32 cmsfaqID = 0;
        public string packNA = "";
        public Int32 packNoNts { get; set; }
        public string packPrice = "";
        public decimal packPriceD { get; set; }
        public string packDepartureNA = "";
        public string packKinds = "";
        public Int32 packType { get; set; }
        public string packInterestON = "";
        public string packSamplePrice = "";
        public DateTime packStartTravel { get; set; }
        public string packIncluded = "";
        public string packCountryNA = "";
        public string packCityNA = "";
        public Int32 packCountryID { get; set; }
        public Int32 packCityID { get; set; }
        public string packDescription = "";
        public string packSpecialCode = "";
        public string packDayXday = "";
        public string packAccomoda = "";
        public Int32 packProdID { get; set; }
        public Int32 packCityEID { get; set; }
        public string packCityENA = "";
        public string packDistances = "";
        public string ntsString = "";
        public Int32 setNts { get; set; }
        public string GuiNo = "";
        public string GetNights()
        {
            if (packKinds.IndexOf("1901:.") > 0) setNts = 0;
            if (setNts == 0)
            {
                decimal d = packNoNts / 2;
                return packNoNts + " to " + (packNoNts + Math.Round(d)).ToString() + "+ ";
            }
            else
            {
                return packNoNts + " ";
            }
        }
        public string GuidePackages()
        {
            if (packKinds.IndexOf("1787:.") > 0)
            {
                return "Guided";
            }
            else
            {
                if (packKinds.IndexOf("1788:.") > 0)
                {
                    return "Partially Guided";
                }
                else
                {
                    return "none";
                }
            }
        }
    }

}
