using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MVC_TMED.Models
{
    public class PackTemplate
    {
        public string PWT_TemplateValue { get; set; }
    }

    public class PackageRelatedPlacesInfo_WithCMSs
    {
        public Int32 PlaceId { get; set; }
        public string Str_PlaceTitle { get; set; }
        public Int32 Str_PlaceTypeId { get; set; }
        public Int32 NoOfPacks { get; set; }
        public Int32 NoOfFeeds { get; set; }
        public Decimal OverAll { get; set; }
        public Int32 NoOfHotels { get; set; }
        public Int32 NoOfSS { get; set; }
        public string STR_PlaceShortInfo { get; set; }
        public Int64 N { get; set; }
        public string CMSW_Title { get; set; }
        public Int32 CMSW_Order { get; set; }
        public Int32? CMSW_RelatedCmsID { get; set; }
        public string CMS_Description { get; set; }
        public Int32 STR_UserID { get; set; }
    }

    public class RelatedItineraries
    {
        public string PDL_Title { get; set; }
        public Int32 STP_ProdItemID { get; set; }
        public Int32 STP_NumOfNights { get; set; }
        public string STP_Save { get; set; }
        public Int32 ppw { get; set; }
        public string SPD_InternalComments { get; set; }
        public string CountryName { get; set; }
    }

    public class PriceGuidance
    {
        public Int64 REDID { get; set; }
        public string RED_TXMLTime { get; set; }
        public string RED_StartDate { get; set; }
        public Int32 RED_Nights { get; set; }
        public string RED_StartCode { get; set; }
        public Int32 RED_StartID { get; set; }
        public Decimal RED_PackagePrice { get; set; }
        public Int32 RED_PackageID { get; set; }
        public string RED_Itinerary { get; set; }
        public string PLC_Title { get; set; }
        public Int32 PLCID { get; set; }
    }

    public class PackInfo
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
    }

    public class PackPrices
    {
        public string PLC_Title { get; set; }
        public decimal REA_TotalPrice { get; set; }
        public decimal REA_AirTax { get; set; }
        public Int32 REA_Nights { get; set; }
        public Int64 REAID { get; set; }
        public string REA_StartDate { get; set; }
        public string REA_Itinerary { get; set; }
    }

    public class PackageCMS
    {
        public Int32 PICMS_ItineraryCMSID { get; set; }
        public Int32 PICMS_PriceCMSID { get; set; }
        public string PICMS_ItineraryCMSContent { get; set; }
        public Int32 PICMS_AccommodationCMSID { get; set; }
        public Int32 PICMS_ActivityCMSID { get; set; }
        public Int32 PICMS_TransferCMSID { get; set; }
        public Int32 PICMS_FAQCMSID { get; set; }
        public Int32 PICMS_OverviewCMSID { get; set; }
        public string CMSHotel { get; set; }
        public string CMSActivities { get; set; }
    }

    public class RelPacks
    {
        public string Str_PlaceTitle { get; set; }
        public Int32 Str_PlaceTypeId { get; set; }
        public Int32 NoOfPacks { get; set; }
        public Int32 Cxz_ChildPlaceId { get; set; }
        public Int32 UserID { get; set; }
    }

    public class CountryNoOfFeedbacks : NameObject
    {
        public Int32 NoOfFeeds { get; set; }
    }

    public class PlaceInfoSummary : CountryNoOfFeedbacks
    {
        public Int32 NoOfPacks { get; set; }
        public decimal OverAll { get; set; }
        public Int32 STR_UserID { get; set; }
    }

    public class PlaceInfo
    {
        public string STR_PlaceTitle { get; set; }
        public Int32 STR_PlaceID { get; set; }
        public string STR_PlaceShortInfo { get; set; }
        public List<CMScountry> CMSs;
    }


    public class PicsPackage
    {
        public Int32 PXI_ImageID { get; set; }
        public decimal PXI_Sequence { get; set; }
        public string IMG_Path_URL { get; set; }
        public string IMG_Title { get; set; }
        public string IMG_ImageType { get; set; }
        public string IMG_500Path_URL { get; set; }
    }

    public class PackageComponent
    {
        public Int32 ParentID { get; set; }
        public string ParentTitle { get; set; }
        public Int32 City { get; set; }
        public Int32 GateWay { get; set; }
        public Int32 ReturnCity { get; set; }
        public Int32 MarkUpByPkg { get; set; }
        public Int32 cmpID { get; set; }
        public Int32 cmp_PDLComponentID { get; set; }
        public string Title { get; set; }
        public string ProdType { get; set; }
        public Int32 cmp_GroupingKey { get; set; }
        public Int32 cmp_DayOfComponent { get; set; }
        public Int32 cmp_DaysDuration { get; set; }
        public decimal cmp_MarkupFlat { get; set; }
        public decimal cmp_MarkupFraction { get; set; }
        public decimal cmp_ChildMarkupFlat { get; set; }
        public decimal cmp_ChildMarkupFraction { get; set; }
        public Boolean cmp_DayFlexible { get; set; }
        public Boolean cmp_DurationFlexible { get; set; }
        public Boolean cmp_PriceDeterminant { get; set; }
        public Boolean cmp_SeasonDeterminant { get; set; }
        public Boolean cmp_DisplayIt { get; set; }
        public Int32 cmp_Category { get; set; }
        public Boolean cmp_PriceIt { get; set; }
        public Boolean cmp_IsItChoice { get; set; }
        public Boolean cmp_Optional { get; set; }
        public Int32 cmp_AllotBlock { get; set; }
        public string cmp_Notes { get; set; }
        public Boolean cmp_CheckDate { get; set; }
        public DateTime? cmp_StartDate { get; set; }
        public DateTime? cmp_EndDate { get; set; }
        public Int32 cmp_LineNo { get; set; }
        public Int32 cmp_Itin { get; set; }
        public Int32 cmp_SequenceTitleTemplateID { get; set; }
        public Boolean cmp_MultipleDurations { get; set; }
        public Int32 cmp_CitySeq { get; set; }
        public Int32 cmp_RelativeDay { get; set; }
        public string cmp_ProductFF1 { get; set; }
        public Boolean cmp_AllProducts { get; set; }
        public Boolean cmp_MajorComponent { get; set; }
        public Int32 cmp_MinStay { get; set; }
        public string cmp_NoOfAvailNite { get; set; }
        public Boolean cmp_OverNite { get; set; }
        public string ItinParagraph { get; set; }
        public string CityTitle { get; set; }
        public Int32 CityID { get; set; }
        public Int32 CountryID { get; set; }
        public Int32 cmp_CategoryFlag { get; set; }
        public string cmp_OptionalFlag { get; set; }
        public Int32 RelatedProductItems { get; set; }
        public string RelatedIDs { get; set; }
        public string Pkg_AirVendorAPI { get; set; }
        public string category { get; set; }
    }

    public class FixDates
    {
        public DateTime ALT_Date { get; set; }
    }

    public class Blackouts
    {
        public string blacklist { get; set; }
    }

    public class BlackoutsMobile
    {
        public string StartDate { get; set; }
        public string EndDate { get; set; }
    }

    public class MiniPacks
    {
        public Int32 SPD_StatePlaceID { get; set; }
        public string SPD_Description { get; set; }
        public string PDL_Content { get; set; }
        public string PDL_Description { get; set; }
        public string PDL_Notes { get; set; }
        public Int32 SPD_ProductKindSysCode { get; set; }
        public string PDL_SpecialCode { get; set; }
    }

    public class MiniPacksCat
    {
        public Int32 SPD_StatePlaceID { get; set; }
        public Int32 PTYID { get; set; }
        public string PTY_Title { get; set; }
        public string PTY_Description { get; set; }
        public Int32 PTY_ProductItem { get; set; }
        public Int32 PTY_Active { get; set; }
        public Boolean PTY_Default { get; set; }
        public Int32 PTY_RecID { get; set; }
        public Int32 PTY_SourceTable { get; set; }
    }

    public class CustomerFeedback
    {
        public string PCCID { get; set; }
        public string PCC_Comment { get; set; }
        public string PCC_CustomerName { get; set; }
        public string PCC_Itinerary { get; set; }
        public Int32 OverallScore { get; set; }
        public DateTime dep_date { get; set; }
    }

    public class CountriesRelatedByItinId
    {
        public Int32 CXZID { get; set; }
        public Int32 cxz_productitem { get; set; }
        public string PDL_title { get; set; }
        public Int32 cxz_ChildPlaceId { get; set; }
        public string str_placetitle { get; set; }
        public Int32 str_placetypeid { get; set; }
    }

    public class CustomerFeedbacks : NameObject
    {
        public Int32 FeedBackId { get; set; }
        public Int32 OverallScore { get; set; }
    }

    public class RecommSS
    {
        public Int32 PDLID { get; set; }
        public string PDL_Title { get; set; }
        public string SCD_Description { get; set; }
        public string SPD_Description { get; set; }
        public Int32 SPD_StarRatingSysCode { get; set; }
        public Int32 PDL_SequenceNo { get; set; }
        public Int32 Sorting { get; set; }
    }
    public class PackExtraInfo : PackInfo
    {
        public string IMG_Path_URL { get; set; }
        public Int32 NoOfFeeds { get; set; }

    }


    public class PackPackages : ViewModels.CountryPackages
    {
        public string CountryName { get; set; }
    }

    public class PackPackagesComparer : IEqualityComparer<PackPackages>
    {
        public bool Equals(PackPackages x, PackPackages y)
        {
            return x.PDLID == y.PDLID;
        }

        public Int32 GetHashCode(PackPackages x)
        {
            return x.PDLID.GetHashCode();
        }
    }
    public class HotelOnPackComponet
    {
        public Int32 PCC_PackProdItemID { get; set; }
        public Int32 PCC_ComponentID { get; set; }
        public Int32 PCC_ChoiceProdItemID { get; set; }
        public Int32 PDLID { get; set; }
        public string PDL_Title { get; set; }
    }
}
