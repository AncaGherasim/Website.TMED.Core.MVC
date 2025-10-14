using MVC_TMED.Infrastructure;
using System.Collections.Generic;
using System.Text;
using System;

namespace MVC_TMED.Models
{
    public class GP4_PlacesHierarchy
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
        public string STR_PlaceExtra { get; set; }
        public string STR_PlaceMap { get; set; }
        public string STR_PlaceTitleDesc { get; set; }
        public string STR_PlacePractical { get;set; }

    }

    public class GP4_DisplayOrder
    {
        public Int32 OrderNumber { get; set; }
        public string OrderName { get; set; }
    }
    public class GP4_DisplayPosition
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

    public class GP4_BoxContent
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

    public class GP4_WeightPlace
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

    public class GP4_DisplayBox
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
    public class GP4_CMScity
    {
        public string CMS_Title { get; set; }
        public string CMS_Content { get; set; }
        public string CMS_Description { get; set; }
        public Int64 CMSID { get; set; }
    }
    public class GP4_CMSPage
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
    public class GP4_SEOPage
    {
        public string SEO_PageTitle { get; set; }
        public string SEO_MetaDescription { get; set; }
        public string SEO_MetaKeyword { get; set; }
        public string SEO_HeaderText { get; set; }
    }
    public class GP4_CombineCoun
    {
        public string CouNA { get; set; }
        public Int32 CouID { get; set; }
    }

    public class GP4_CombineCountries : GP4_CombineCoun
    {
        public Int32 PlcID { get; set; }
        public string PlcNA { get; set; }
        public Int32 PlcTY { get; set; }
        public Int32 PlcRK { get; set; }
    }
    public class GP4_PackOnInterestPriority
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
        public string Comment { get; set; }
        public DateTime TvlDate { get; set; }
        public string CountryName { get; set; }
    }
    public class GP4_NumberofCustomerFeedbacks
    {
        public Int32 NumComments { get; set; }
        public decimal Score { get; set; }
    }
    public class GP4_CountryFeed
    {
        public Int32 PCC_PDLID { get; set; }     
        public string PCC_Comment { get; set; }
        public string PCC_CustomerName { get; set; }
        public string PCC_Itinerary {  get; set; }
        public Int32 PCC_OverallScore { get; set; }
        public DateTime dep_date { get; set; }
        public string PDL_Title { get; set; }
        public string CountryName { get; set; }
        public Int32 CountryID { get; set; }    
    }

}