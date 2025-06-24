using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MVC_TMED.Models
{
    public class PlacesHierarchy
    {
        public Int32 STRID { get; set; }
        public Int32 STR_PlaceID { get; set; }
        public string STR_PlaceTitle { get; set; }
        public Int32 STR_PlaceTypeID { get; set; }
        public string STR_PlaceShortInfo { get; set; }
        public Int32 STR_PlaceAIID { get; set; }
        public string STR_PlaceInfo { get; set; }
        public Int32 STR_ProdKindID { get; set; }
        public string STR_PageTemplate { get; set; }
        public Int32 STR_UserID { get; set; }
        public Int32 STR_PlacePriority { get; set; }
        public string STR_PlaceExtra { get; set;}
    }
    public class CMScity
    {
        public string CMS_Title { get; set; }
        public string CMS_Content { get; set; }
        public string CMS_Description { get; set; }
        public Int64 CMSID { get; set; }
    }
    public class DisplayArea
    {
        public string SDP_DisplayTitle { get; set; }
        public string SDP_GroupTitleURL { get; set; }
        public string SDP_Description { get; set; }
        public Int32 SDP_Order { get; set; }
        public Int32 SDP_PlaceHierarchyID { get; set; }
        public Int32 SDP_GroupProdKindID { get; set; }
        public Int32 SDP_DisplayProdKindID { get; set; }
        public string SDP_TitleBGColor { get; set; }
    }

    public class BoxContent
    {
        public string STX_Title { get; set; }
        public string STX_URL { get; set; }
        public string STX_Description { get; set; }
        public string STX_PictureURL { get; set; }
        public Int32 STX_ProdKindID { get; set; }
        public Int32 STX_Priority { get; set; }
        public Int32 STX_PictureWidthpx { get; set; }
        public Int32 STX_PictureHeightpx { get; set; }
        public Int32 STX_CMSID { get; set; }
        public string CMS_Title { get; set; }
        public string CMS_Description { get; set; }
        public string CMS_Content { get; set; }
    }

    public class WeightPlace
    {
        public string STR_PlaceTitle { get; set; }
        public Int32 STR_PlaceID { get; set; }
        public string STR_PlaceShortInfo { get; set; }
        public Int32 STR_PlaceTypeID { get; set; }
        public Int32 SPW_Weight { get; set; }
        public Int32 STR_PlaceAIID { get; set; }
        public string Country { get; set; }
        public Int32 CountryID { get; set; }
    }

    public class CombineCoun
    {
        public string CouNA { get; set; }
        public Int32 CouID { get; set; }
    }

    public class CombineCountries: CombineCoun
    {
        public Int32 PlcID { get; set; }
        public string PlcNA { get; set; }
        public Int32 PlcTY { get; set; }
        public Int32 PlcRK { get; set; }
    }

    public class CMSPage
    {
        public Int32 CMSWID { get; set; }
        public string CMSW_Title { get; set; }
        public Int32 CMSW_Order { get; set; }
        public Int32 CMSID { get; set; }
        public string CMS_Title { get; set; }
        public string CMS_Content { get; set; }
        public Int32 CMSW_RelatedCmsID { get; set; }
        public string CMS_Description { get; set; }

    }

    public class CLS_PlaceValues
    {
        public string plcNA { get; set; }
        public Int32 plcID { get; set; }
    }

    public class weightItin: PackOnInterestPriority
    {
        public Int64 STP_save { get; set; }
        public Int32 TotalPacks { get; set; }
        public string IMG_500Path_URL { get; set; }
    }

    public class EachCity
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

    public class plcExtension
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

    public class CustomReviews
    {
        public Int32 dept { get; set; }
        public Int32 PCC_Ranking { get; set; }
        public string PCC_Comment { get; set; }
        public string PCC_CustomerName { get; set; }
        public string PCC_Itinerary { get; set; }
        public Int32 PCCID { get; set; }
        public Int32 PCC_PDLID { get; set; }
        public DateTime dep_date { get; set; }
        public string PDL_Title { get; set; }
        public string CountryName { get; set; }
        public Int32 CountryID { get; set; }
        public Int32 m { get; set; }
    }
    public class CustomerReviewVisit : CustomReviews
    {
        public Int32 OverallScore { get; set; }
        public string RelatePlaces { get; set; }
        public decimal STP_Save { get; set; }
    }
    public class CountryFeedback: NameObject
    {
        public Int64 NoOfFeedbacks { get; set; }
    }

    public class CountriesComments 
    {
        public Int32 CountryID { get; set; }
        public string CountryName { get; set; }
    }

    public class ManagerDisplay
    {
        public string SDP_DisplayTitle { get; set; }
        public string SDP_GroupTitleURL { get; set; }
        public string SDP_Description { get; set; }
        public Int32 SDP_Order { get; set; }
        public Int32 SDP_PlaceHierarchyID { get; set; }
        public Int32 SDP_GroupProdKindID { get; set; }
        public Int32 SDP_DisplayProdKindID { get; set; }
        public string SDP_TitleBGColor { get; set; }
    }
    public class VacationPlaceInfo
    {
        public string CountryName { get; set; }
        public Int32 CityStrId { get; set; }
        public string CityDescription { get; set; }
        public Int32 CityPlaceId { get; set; }
        public string CityName { get; set; }
        public Int32 CountryId { get; set; }
    }
}
