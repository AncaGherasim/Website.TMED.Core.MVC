using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MVC_TMED.Models;
using MVC_TMED.Infrastructure;
using System.Text;

namespace MVC_TMED.Models.ViewModels
{
    public class PackTemplate_21ViewModel
    {
        public string HideAdvance = "false";
        public string PackId = "";
        public string PackName = "";
        public string packNA = "";
        public string relatedItin = "";
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
        public Int32 packFeedCount { get; set; }
        public Int32 packFeedCountC { get; set; }
        public decimal overAll { get; set; }
        public Int32 verifySite { get; set; }

        public Int32 itiID { get; set; }
        public string itinContent { get; set; }
        public Int32 priID { get; set; }
        public Int32 accID { get; set; }
        public string hotelContent { get; set; }
        public Int32 actID { get; set; }
        public string activitiesContent { get; set; }
        public Int32 traID { get; set; }
        public Int32 faqID { get; set; }
        public Int32 ovrID { get; set; }

        public string minPackID = "";
        public string FxDates = "";
        public string fixNetDts = "";
        public string BkDates = "";
        public Int32 howManyCtys { get; set; }


        public int SelfDrive { get; set; }
        public int P2P { get; set; }
        public int Cruise { get; set; }
        public string sortFlag = "";
        public string webTIC = "";
        public Int32 isTMGuided { get; set; }
        public Int32 isGuided { get; set; }

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

        public List<PackInfo> ListPackInfo { get; set; }
        public List<RelPacks> ListRelPacks { get; set; }
        public List<PackageRelatedPlacesInfo_WithCMSs> PackRelatedPlaces;
        public List<RelatedItineraries> PackRelItins;
        public List<PackPrices> listHistory;
        public List<NameObject> PackFeedsSum;
        public List<String> arrFeedUp = new List<string>();
        public List<PlaceInfoSummary> CountriesNoOfFeeds;
        public List<PriceGuidance> listPrices;
        public NameObject DepartureAirport = new NameObject() { Id = -1, Name = "" };
        public StringBuilder strCitySEQ;
        public System.Xml.XmlNodeList xmlCities;
        public List<CitySquence> citySeq = new List<CitySquence>();
        public List<PlaceInfo> countriesCMS = new List<PlaceInfo>();
        public List<string> strTinTout;
        public StringBuilder minPackDESc = new StringBuilder();
        public List<MiniPacksCat> minPackCategories;
        public List<PicsPackage> topPicsPack = new List<PicsPackage>();

        public string stringCityIDs = "";
        public string txtNites = "";

        public StringBuilder citiesInfo = new StringBuilder();
        public List<HotelOnPackComponet> hotelsOnComponetMaster = new List<HotelOnPackComponet>();
        public List<DiscountPromotion> discountPromotions = new List<DiscountPromotion>();
        public string MK_DiscountCode { get; set; }
        public Int32 MK_DiscountValue { get; set; }
        public string MK_TodayDate { get; set; }
        public string MK_DepartureAirports { get; set; }
        public string MK_BookingStartDate { get; set; }
        public string MK_BookingEndDate { get; set; }
        public Int32 MK_Dept { get; set; }
        public Int32 MK_PackageID { get; set; }
        public string MK_CampaignCode { get; set; }
        public Int32 MK_IsPerPerson { get; set; }
        public Int32 MK_BlockingReason { get; set; }
        public string MK_ArrivalAirportsNames { get; set; }
        public string MK_ArrivalDates { get; set; }
        public bool MK_Discount = false;
        public bool MK_DatesToArrive = false;
        public bool MK_DatesToBook = false;
        public bool MK_AirportAllow = false;
    }
    public class DiscountPromotion
    {
        public string MKTD_DiscountCode { get; set; }
        public string MKTD_CampaignCode { get; set; }
        public Int32 MKTD_DiscountValue { get; set; }
        public DateTime MKTD_BookingStartDate { get; set; }
        public DateTime MKTD_BookingEndDate { get; set; }
        public Int32 MKTD_Dept { get; set; }
        public Int32 MKTD_PackageID { get; set; }
        public Int32 MKRD_IsPerPerson { get; set; }
        public Int32 MKTD_BlockingReason { get; set; }
        public string ArrivalAirportsNames { get; set; }
        public string ArrivalDates { get; set; }
    }
}
