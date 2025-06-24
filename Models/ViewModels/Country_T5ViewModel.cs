using System.Collections.Generic;
using System;

namespace MVC_TMED.Models.ViewModels
{
    public class Country_T5ViewModel
    {
        public List<T5PriorityPacks> listGuided = new List<T5PriorityPacks>();
        public string placeNA = "";
        public Int32 placeID = 0;
        public List<T5PriorityPacks> otherFeatured = new List<T5PriorityPacks>();
        public Int64 packFeedCountC = 0;
        public Int64 packFeedCountC_SD = 0;
        public List<T5plcExtension> listBanners = new List<T5plcExtension>();
        public string pageHeaderText = "";
        public string pageBannerText = "";
        public string pageDescriptionC = "";
        public string pageTitle = "";
        public string pageMetaDesc = "";
        public string pageMetaKey = "";
        public Int32 allItineraries = 0;
        public string IdPacakgeSEO = "";
        public List<T5plcExtension> listHighligts = new List<T5plcExtension>();
        public List<T5PriorityPacks> suggestedItin = new List<T5PriorityPacks>();
        public Decimal Score = 0;
        public List<CustomReviews> listReviews = new List<CustomReviews>();
        public List<T5EachCity> listCitiesOn = new List<T5EachCity>();
        public List<CombineCoun> listCombineCou = new List<CombineCoun>();
        public List<T5CMScountry> listCMS = new List<T5CMScountry>();
        public List<FaqQR> FaqList = new List<FaqQR>();
        public List<T5EachCity> listCitiesMore = new List<T5EachCity>();
        public List<PackInfoSEO> ListPackInfo = new List<PackInfoSEO>();
        public List<PackInfoSEO> ListPackInfoSEO = new List<PackInfoSEO>();
        public List<T5DisplayPosition> ListDisplayPositions = new List<T5DisplayPosition>();
        public string image = "";
        public string firstSecTtl = "";
        public string firstSecDes = "";
        public List<T5_CountryFeed> listCountryFeeds = new List<T5_CountryFeed>();
        public List<T5_CountryFeed> listOverAllFeeds = new List<T5_CountryFeed>();
        public List<T5_CountryFeed> listCommentDate = new List<T5_CountryFeed>();
        public Boolean isGuided = true;
        public Boolean isBYO = false;


        public class T5PriorityPacks
        {
            public Int32 SPPW_Weight { get; set; }
            public Int32 PDLID { get; set; }
            public string PDL_Title { get; set; }
            public Int32 PDL_Duration { get; set; }
            public Int32 PDL_SequenceNo { get; set; }
            public string PDL_Content { get; set; }
            public string PDL_Places { get; set; }
            public string PDL_Description { get; set; }
            public decimal STP_Save { get; set; }
            public string SPD_Description { get; set; }
            public string SPD_InternalComments { get; set; }
            public Int32 NoOfFeed { get; set; }
            public string IMG_500Path_URL { get; set; }
            public Int32 OverAllScore { get; set; }
            public string Comment {  get; set; }
            public DateTime TvlDate { get; set; }
            public string PlacesOnPackages { get; set; }
        }

        public class T5DisplayPosition
        {
            public string SDP_DisplayTitle {  get; set; }
            public string SDP_GroupTitleURL { get; set; }
            public string SDP_Description {  get; set; }
            public Int32 SDP_Order {  get; set; }
            public Int32 SDP_PlaceHierarchyID { get; set; }
            public Int32 SDP_GroupProdKindID {  get; set; }
            public Int32 SDP_DisplayProdKindID { get; set; }
            public string SDP_TitleBGColor {  get; set; }
        }

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

        public class T5_Place_Info
        {
            public string SEO_PageTitle { get; set; }
            public string SEO_MetaDescription { get; set; }
            public string SEO_MetaKeyword { get; set; }
            public string SEO_HeaderText { get; set; }
            public string STR_PlaceAI { get; set; }
            public string STR_PlaceTitleDesc { get; set; }
        }

        public class T5_CountryFeed
        {
            public Int32 NoOfFeedbacks { get; set; }
            public Int32 NumComments { get; set; }
            public decimal Score { get; set; }
            public string pcc_comment { get; set; }
            public Int32 pcc_overallscore { get; set; }
            public DateTime dep_date { get; set; }
            public Int32 Total_Rows { get; set; }
        }
        public class T5TotalPacks
        {
            public Int32 NoOfPacks { get; set; }
        }
        public class T5plcExtension
        {
            public Int32 STXID { get; set; }
            public Int32 STX_UserID { get; set; }
            public Int32 STX_PlaceID { get; set; }
            public string STX_Title { get; set; }
            public string STX_URL { get; set; }
            public string STX_Description { get; set; }
            public string STX_PictureURL { get; set; }
            public Int32 STX_ProdKindID { get; set; }
            public Int32 STX_Active { get; set; }
            public Int32 STX_Priority { get; set; }
            public Int32 STX_STRID { get; set; }
            public Int32 STX_MasterContentID { get; set; }
            public Int32 STX_PictureHeightpx { get; set; }
            public Int32 STX_PictureWidthpx { get; set; }
            public Int32 STX_CMSID { get; set; }
        }

        public class T5EachCity
        {
            public Int32 STR_PlaceID { get; set; }
            public string STR_PlaceTitle { get; set; }
            public Int32 STR_PlaceTypeID { get; set; }
            public Int32 STR_PlaceAIID { get; set; }
            public Int32 STR_Place1ParentID { get; set; }
            public string STR_PlaceShortInfo { get; set; }
            public Int32 STI_SysCodeID { get; set; }

            public string IMG_500Path_URL { get; set; }
        }

        public class T5CMScountry
        {
            public Int64 CMSW_Order { get; set; }
            public string CMSW_Title { get; set; }
            public Int32? CMSW_RelatedCmsID { get; set; }
            public string CMS_Description { get; set; }
        }
    }
}