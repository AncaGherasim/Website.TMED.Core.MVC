using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MVC_TMED.Models.ViewModels
{
    public class Country_T4ViewModel
    {
        public List<weightItin> listFeatured = new List<weightItin>();
        public string placeNA = "";
        public Int32 placeID = 0;
        public List<weightItin> otherFeatured = new List<weightItin>();
        public Int64 packFeedCountC = 0;
        public List<plcExtension> listBanners = new List<plcExtension>();
        public string pageHeaderText = "";
        public string pageBannerText = "";
        public string pageDescriptionC = "";
        public string pageTitle = "";
        public string pageMetaDesc = "";
        public string pageMetaKey = "";
        public Int32 allItineraries = 0;
        public string IdPacakgeSEO = "";
        public List<plcExtension> listHighligts = new List<plcExtension>();
        public List<weightItin> suggestedItin = new List<weightItin>();
        public Decimal Score = 0;
        public List<CustomReviews> listReviews = new List<CustomReviews>();
        public List<EachCity> listCitiesOn = new List<EachCity>();
        public List<CombineCoun> listCombineCou = new List<CombineCoun>();
        public List<CMScountry> listCMS = new List<CMScountry>();
        public List<FaqQR> FaqList = new List<FaqQR>();
        public List<EachCity> listCitiesMore = new List<EachCity>();
        public List<PackInfoSEO> ListPackInfo = new List<PackInfoSEO>();
        public List<PackInfoSEO> ListPackInfoSEO = new List<PackInfoSEO>();
        public string image = "";

        public class CMScountries
        {
            public Int64 CMSW_Order { get; set; }
            public string CMSW_Title { get; set; }
            public Int32? CMSW_RelatedCmsID { get; set; }
            public string CMS_Description { get; set; }
        }
        public class PackInfoSEO
        {
            public string PDL_Title { get; set; }
            public string PDL_Content { get; set; }
            public string PDL_Description { get; set; }
            public string PDL_Notes { get; set; }
            public string PDL_SpecialCode { get; set; }
            public string SPD_InternalComments { get; set; }
            public string SPD_Description { get; set; }
            public string SPD_Features { get; set; }
            public string STP_Price { get; set; }
            public string STP_Save { get; set; }
            public string STP_Content { get; set; }
            public string STP_MiniTitle { get; set; }
            public string PLC_Title { get; set; }
            public string STR_PlaceTitle { get; set; }
            public string CityNA { get; set; }
            public string PLC_Code { get; set; }
            public string CityENA { get; set; }
            public Int32 PDL_ProductID { get; set; }
            public Int32 PDL_Duration { get; set; }
            public Int32 STP_NumOfNights { get; set; }
            public Int32 SPD_StarRatingSysCode { get; set; }
            public Int32 SPD_ProductKindSysCode { get; set; }
            public Int32 SPD_CountryPlaceID { get; set; }
            public Int32 STP_FromPlaceID { get; set; }
            public Int32 STR_PlaceID { get; set; }
            public Int32 CityID { get; set; }
            public Int32 PLCID { get; set; }
            public Int32 CityEID { get; set; }
            public Int32 SPD_CategoryTemplate { get; set; }
            public DateTime STP_StartTravelDate { get; set; }
            public string IMG_Path_URL { get; set; }
            public Int32 PackageId { get; set; }
        }

    }
}
