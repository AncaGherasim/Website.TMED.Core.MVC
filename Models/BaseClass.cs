using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MVC_TMED.Models
{
    public class BaseObject
    {
        public Int32 Id { get; set; }
    }

    public class NameObject : BaseObject
    {
        public string Name { get; set; }
        public string AWSK_AccessKey { get; internal set; }
        public string AWSK_SecretKey { get; internal set; }
    }
    public class PlaceObject
    {
        public string Id { get; set; }
    }
    public class AwsCredentials
    {
        public string AWSK_AccessKey { get; set; }
        public string AWSK_SecretKey { get; set; }
    }

    public class DepCity
    {
        public string PLC_Title { get; set; }
        public Int32 PLCID { get; set; }
        public string PLC_Code { get; set; }
    }
    public class TotalPacks
    {
        public Int32 NoOfPacks { get; set; }
    }

    public class PriorCity
    {
        public Int32 CtyID { get; set; }
        public string CtyNA { get; set; }
        public Int32 CtyPR { get; set; }
        public string CouNA { get; set; }
        public string CtyCOD { get; set; }
        public string deptNA { get; set; }
        public string hotelAPI { get; set; }
    }

    public class PackOnInterestPriority
    {
        public Int32 SPPW_Weight { get; set; }
        public Int32 PDLID { get; set; }
        public string PDL_Title { get; set; }
        public Int32 PDL_Duration { get; set; }
        public Int32 PDL_SequenceNo { get; set; }
        public string PDL_Content { get; set; }
        public string PDL_Places { get; set; }
        public decimal STP_Save_ { get; set; }
        public decimal STP_Save { get; set; }
        public string SPD_Description { get; set; }
        public string IMG_Path_URL { get; set; }
        public string SPD_InternalComments { get; set; }
        public Int32 NoOfFeed { get; set; }
        public string CountryName { get; set; }
        public Int32 NoOfCountries { get; set; }
      
    }

        public class PlacePackagesIdea: PackOnInterestPriority
    {
        public string STR_PlaceTitle { get; set; }
        public string STP_EndDate { get; set; }
        public decimal STP_Price { get; set; }
        public string STP_Minititle { get; set; }
        public Int32 STP_NumOfNights { get; set; }
        public Int32 PDL_StarRatingSysCode { get; set; }
        public Int32 STR_PlaceID { get; set; }
        public Int32 STR_PlaceTypeID { get; set; }
        public string IMG_Title { get; set; }
        public string STP_TypePromotion { get; set; }
        public string PDL_CustomerRanking { get; set; }
    }

    public class NumberofCustomerFeedbacks
    {
        public Int32 NumComments { get; set; }
        public decimal Score { get; set; }
    }

    public class CMS_WebsiteContent
    {
        public string CMS_Content { get; set; }
    }

    public class PlaceInfo_By_PlaceName
    {
        public string CountryNA { get; set; }
        public Int32 CountryID { get; set; }
        public Int32 STRID { get; set; }
        public Int32 STR_PlaceID { get; set; }
        public Int32 STR_PlaceTypeID { get; set; }
        public string STR_PlaceShortInfo { get; set; }
        public Int32 STR_PlaceAIID { get; set; }
        public string STR_PlaceInfo { get; set; }
        public string STR_PlaceTitle { get; set; }
        public Int32 STR_UserID { get; set; }
        public Int32 STR_PlacePriority { get; set; }
    }

    public class PlaceInfo_By_PlaceName_TripsTaken
    {
        public string CountryNA { get; set; }
        public Int32 CountryID { get; set; }
        public Int32 STRID { get; set; }
        public Int32 STR_PlaceID { get; set; }
        public Int32 STR_PlaceTypeID { get; set; }
        public string STR_PlaceShortInfo { get; set; }
        public Int32 STR_PlaceAIID { get; set; }
        public string STR_PlaceInfo { get; set; }
        public string STR_PlaceTitle { get; set; }
        public Int32 STR_UserID { get; set; }
        public Int32 STR_PlacePriority { get; set; }
    }

    public class NamedObjectComparer : IEqualityComparer<NameObject>
    {
        public bool Equals(NameObject x, NameObject y)
        {
            return x.Id == y.Id;
        }

        public Int32 GetHashCode(NameObject x)
        {
            return x.Id.GetHashCode();
        }
    }

    public class TopDealsCountryComparer : IEqualityComparer<TopDealsCountry>
    {
        public bool Equals(TopDealsCountry x, TopDealsCountry y)
        {
            return x.Id == y.Id;
        }

        public Int32 GetHashCode(TopDealsCountry x)
        {
            return x.Id.GetHashCode();
        }
    }

    public class Feedback
    {
        public string PCC_Comment { get; set; }
        public string PCC_CustomerName { get; set; }
        public string PCC_Itinerary { get; set; }
        public Int32 PCCID { get; set; }
        public Int32 PCC_PDLID { get; set; }
        public DateTime dep_date { get; set; }
        public string PDL_Title { get; set; }
        public string CountryName { get; set; }
        public Int32 CountryID { get; set; }
        public Int32 NoOfComments { get; set; }
    }

    public class Place_Info
    {
        public string SEO_PageTitle { get; set; }
        public string SEO_MetaDescription { get; set; }
        public string SEO_MetaKeyword { get; set; }
        public string SEO_HeaderText { get; set; }
        public string STR_PlaceAI { get; set; }
        public string STR_PlaceTitleDesc { get; set; }
    }

    public class VisitorHome
    {
        public Int32 PLCID { get; set; }
        public string PLC_Title { get; set; }
        public string CtyCOD { get; set; }
    }

    public class VisitHistoryXunitraq
    {
        public Int32 qty { get; set; }
        public string ids { get; set; }
    }

    public class ReviewFirst
    {
        public Int32 PCCID { get; set; }
        public Int32 Score { get; set; }
    }

    public class ReviewPage: CustomReviews
    {
        public DateTime TCF_FeedbackReceivedTime { get; set; }
        public Int32 OverallScore { get; set; }
        public decimal STP_Save { get; set; }
        public Int32 PDL_NoWeb { get; set; }
        public string PDL_Places { get; set; }
        public Int32 NoOfFeed { get; set; }
        public string RelatePlaces { get; set; }
        public string CountryNA { get; set; }
    }

    public class CountryPlaces
    {
        public string STR_PlaceTitle { get; set; }
        public Int32 CityID { get; set; }
        public string CityName { get; set; }
        public Int32 CityType { get; set; }
        public string CityDept { get; set; }
        public string CityInfo { get; set; }
    }

    
    public class TopDealsCountry : NameObject
    {
        public List<Package> DealPacks { get; set; }
    }

    public class Package: NameObject
    {
        public decimal Price { get; set; }
        public Int32 SequenceNo { get; set; }
        public Int32 Duration { get; set; }
    }
    public class cityDestinations
    {
        public Int32 CYID { get; set; }
        public string CYName { get; set; }
        public Int32 CYType { get; set; }
        public string CYInfo { get; set; }
    }

    public class SSData
    {
        public string SSFilter { get; set; }
        public string Ids { get; set; }
    }
    public class CLS_SamplePriceValues
    {
       public string samAIP { get; set; }
        public decimal samPRC { get; set; }
        public decimal samTAX { get; set; }
        public Int32 samNTS { get; set; }
        public Int64 samID { get; set; }
        public string samITIN { get; set; }
        public string samDTE { get; set; }
    }

    public class WebAnnouncement
    {
        public Int64 WEBAID { get; set; }
        public string WEBA_Msg { get; set; }
    }
    public class FaqQRCountry
    {
        public string FaqQuestion { get; set; }
        public string FaqResponse { get; set; }
    }
    public class CMSCountry
    {
        public Int64 CMSW_Order { get; set; }
        public string CMSW_Title { get; set; }
        public Int32 CMSW_RelatedCmsID { get; set; }
        public string CMS_Description { get; set; }
    }
    public class weightItinCountry
    {
        public Int32 PDLID { get; set; }
        public Int32 NoOfCountries { get; set; }
        public string PDL_Title { get; set; }
        public string PDL_Content { get; set; }
        public Int32 PDL_SequenceNo { get; set; }
        public string PDL_Places { get; set; }
        public Int32 PDL_Duration { get; set; }
        public string SPD_Description { get; set; }
        public string SPD_InternalComments { get; set; }
        public Int64 STP_save { get; set; }
        public Int32 NoOfFeed { get; set; }
        public Int32 TotalPacks { get; set; }
        public string IMG_Path_URL { get; set; }
        public string IMG_500Path_URL { get; set; }
    }
    public class CountryHighlights
    {
        public string STX_Title { get; set; }
        public string STX_URL { get; set; }
        public string STX_PictureURL { get; set; }
        public Int32 STX_ProdKindID { get; set; }
        public Int32 STX_Priority { get; set; }
    }
    public class FaqQR
    {
        public string FaqQuestion { get; set; }
        public string FaqResponse { get; set; }
    }

    public class MarketingSubscriptionResponse
    {
        public Int32 statusCode { get; set; }
        public string statusMessage { get; set; }
        public bool success { get; set; }
        public string[] codes { get; set; }
    }

    public class MrkSubscription
    {
        public String email { get; set; }
        public Int32 ED { get; set; }
        public Int32 TM { get; set; }
        public Int32 proc { get; set; }
        public String options { get; set; }
    }

    public class utVisitHistory
    {
        public string utUserID { get; set; }
        public string iSite { get; set; }
    }
    public class MostPop
    {
        public Int32 PDLID { get; set; }
        public string PDL_Title { get; set; }
        public decimal STP_Save { get; set; }
        public Int32 STP_NumOfNights { get; set; }
        public string CityNA { get; set; }
        public Int32 SPD_CountryPlaceID { get; set; }
        public string CountryName { get; set; }
        public string IMG_Path_URL { get; set; }
        public Int32 NoOfFeed { get; set; }
        public string Comment { get; set; }
        public DateTime dep_date { get; set; }
    }
    public class TransportationOptionQ
    {
        public CalendarTransportationOptionQ CalendarTransportationOptionQ { get; set; }
    }
    public class CalendarTransportationOptionQ
    {
        public int Version { get; set; }
        public string UserID { get; set; }
        public List<CityTO> Cities { get; set; }
    }
    public class CityTO
    {
        public string No { get; set; }
        public int PlaceID { get; set; }
        public string PlaceName { get; set; }
        public int PlaceToID { get; set; }
    }

    public class BuildPackageComponentListQ
    {
        public CalendarBuildPackageComponentListQ CalendarBuildPackageComponentListQ { get; set; }
    }
    public class CalendarBuildPackageComponentListQ
    {
        public int DepCityID { get; set; }
        public List<CityPC> Cities { get; set; }
        public CalendarBuildPackageComponentListQ()
        {

        }
        public CalendarBuildPackageComponentListQ(int version, List<CityPC> cities)
        {
            this.Cities = new List<CityPC>();
        }
    }

    public class CityPC
    {
        public string No { get; set; }
        public int PlaceID { get; set; }
        public string PlaceName { get; set; }
        public int NoOfNight { get; set; }
        public List<CityComponent> CityComponents { get; set; }
    }
    public class CityComponent
    {
        public string ProductType { get; set; }
        public string ProductFreeField1 { get; set; }
        public string ProductNotes { get; set; }
        public string ProductItemID { get; set; }
        public int Transportation { get; set; }
        public int OverNight { get; set; }
        public string CarPickUpCityNo { get; set; }
        public string CarPickUpDay { get; set; }
        public string CarDropOffCityNo { get; set; }
        public string CarDropOffDay { get; set; }
    }
    public class TopSellerPackages
    {
        public int PDL_ProductId { get; set; }
        public int PDLID { get; set; }
        public string PDL_Title { get; set; }
        public int STP_UserId { get; set; }
        public string STP_Save { get; set; }
        public int STP_NumOfNights { get; set; }
        public int NoOfSales { get; set; }
        public int PDL_Duration { get; set; }
        public int SPD_CountryPlaceId { get; set; }
        public int Package_Rank { get; set; }
        public int NoOfFeeds { get; set; }
        public string Booking_Date { get; set; }
    }
    public class Feedbacks
    {
        public Int32 dept { get; set; }
        public string PCC_Comment { get; set; }
        public string PCC_Itinerary { get; set; }
        public Int32 PCCID { get; set; }
        public Int32 PCC_PDLID { get; set; }
        public DateTime dep_date { get; set; }
        public string PDL_Title { get; set; }
        public string CountryName { get; set; }
        public Int32 CountryID { get; set; }
        public Int32 pcc_overallscore { get; set; }
        public string pdl_places { get; set; }
    }

    public class CalendarError
    {
        public string Message { get; set; }
        public string Cities { get; set; }
    }

    public class MaxMind
    {
        public Int32 maxp_tournetplaceid { get; set; }
        public string citycode { get; set; }
        public string plc_title { get; set; }
    }
}