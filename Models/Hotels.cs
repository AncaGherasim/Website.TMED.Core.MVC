using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MVC_TMED.Models
{
    public class PlaceInfoByName
    {
        public Int32 strID { get; set; }
        public Int32 plcID { get; set; }
        public string plcNA { get; set; }
        public Int32 couID { get; set; }
        public string couNA { get; set; }
    }

    public class CustomerFeed
    {
        public string PCC_Comment { get; set; }
        public string PCC_CustomerName { get; set; }
        public string PCC_Itinerary { get; set; }
        public Int32 PCCID { get; set; }
        public Int32 PCC_PDLID { get; set; }
        public DateTime dep_date { get; set; }
        public string PDL_Title { get; set; }
        public Int32 CountryID { get; set; }
        public string CountryName { get; set; }
    }

    public class HotelsSummary
    {
        public Int32 PDL_SequenceNo { get; set; }
        public string GIPH_TNTournetRating { get; set; }
        public string SCD_CodeTitle { get; set; }
        public Int32 GIPH_TNZoneID { get; set; }
        public string CityZone { get; set; }
        public Int32 GHS_TrustYouScore { get; set; }
        public Int32 GHS_SolarToursScore { get; set; }
        public decimal GHS_ExpediaScore { get; set; }
        public Int32 GHS_ExpediaReviewCount { get; set; }
        public decimal GHS_FinalScore { get; set; }
    }

    public class HotelsSummaryNew
    {
        public string pdl_title { get; set; }
        public Int32 giphid { get; set; }
        public Int32 pdlid { get; set; }
        public string giph_giataid { get; set; }
        public string tnhighlights { get; set; }
        public Int32 giph_tnzoneid { get; set; }
        public string cityzone { get; set; }
        public Int32 giph_tnsequence { get; set; }
        public string giph_tntournetrating { get; set; }
        public Int32 ghs_trustyouscore { get; set; }
        public Int32 ghs_expediareviewcount { get; set; }
        public double ghs_finalscore { get; set; }
        public string giphlatitude { get; set; }
        public string giphlongitude { get; set; }
        public string img_500path_url { get; set; }
        public string img_path_url { get; set; }
        public Int32 TotalCount { get; set; }
        public string img_url { get; set; }
        public string hotelAddress { get; set; }
        public string hotelDescription { get; set; }
    }

    public class ListOfAllHotels
    {
        public Int32 PDLID { get; set; }
        public string PDL_Title { get; set; }
        public string SCD_CodeTitle { get; set; }
        public Int32 PDL_SequenceNo { get; set; }
        public string PTY_Description { get; set; }
        public string IMG_Path_URL { get; set; }
        public string PTY_Address { get; set; }
        public string PTY_Latitude { get; set; }
        public string PTY_Longitude { get; set; }
        public string PDL_DistrictZone { get; set; }
        public string GIPH_TNTournetRating { get; set; }
        public Int32 PDL_CustomerRanking { get; set; }
        public Int32 GIPH_TNZoneID { get; set; }
        public Int32 CXZ_ProductItem { get; set; }
        public Int32 GLT_PDLID { get; set; }
        public string GIPC_HotelCode { get; set; }
        public Int32 GHS_SolarToursScore { get; set; }
        public Int32 GHS_TrustYouScore { get; set; }
        public Int32 GHS_BookingScore { get; set; }
        public decimal GHS_ExpediaScore { get; set; }
        public Int32 GHS_ExpediaReviewCount { get; set; }
        public decimal GHS_FinalScore { get; set; }
        public Int32 GIPHID { get; set; }
        public string CityZone { get; set; }
        public string GIPH_TNHighlights { get; set; }
        public Int32 TotalNumerOfRows { get; set; }
    }

    public class RecommHotels : ListOfAllHotels
    {
        public string SCD_Description { get; set; }
        public string GIPH_TNTournetRating { get; set; }
        public Int32 SPD_StarRatingSysCode { get; set; }
        public Int32 Sorting { get; set; }
        public string SPD_Features { get; set; }

    }

    public class ListCityZones
    {
        public string? cityzone { get; set; }
        public int? giph_tnzoneid { get; set; }
    }

    public class ListRatings
    {
        public string giph_tntournetrating { get; set; }
        public Int32 CountRat { get; set; }
    }

    public class GetHotelsParams
    {
        public string IDplc { get; set; }
        public Int32 Pageno { get; set; }
        public string Ratings { get; set; }
        public string HotelName { get; set; }
        public string Favorites { get; set; }
        public string Review { get; set; }
        public string CityZone { get; set; }
        public Int32 Sort { get; set; }
    }

    public class GetHotelsPageParams
    {
        public Int32 PlaceId { get; set; }
        public Int32 PageNo { get; set; }
        public string[] RatingsList { get; set; }
        public string HotelName { get; set; }
        public string[] ReviewsList { get; set; }
        public Int32 CityZone { get; set; }
        public Int32 Sort { get; set; }
        public bool FirstLoad { get; set; }
        public bool isRatings { get; set; }
        public bool isFavorite { get; set; }
        public bool isHotelName { get; set; }
        public bool isCityZone { get; set; }
    }

    public class ListOfHotels
    {
        public Int32 PDLID { get; set; }
        public string PDL_Title { get; set; }
        public Int32 PDL_SequenceNo { get; set; }
        public string GIPH_TNHighlights { get; set; }
        public string GIPH_TNTournetRating { get; set; }
        public string SCD_CodeTitle { get; set; }
        public decimal GIPH_Latitude { get; set; }
        public decimal GIPH_Longitude { get; set; }
        public Int32 GIPH_TNZoneID { get; set; }
        public string CityZone { get; set; }
        public string IMG_Path_URL { get; set; }
        public Int32 GIPHID { get; set; }
        public string GIPH_CityName { get; set; }
        public Int32 GHS_TrustYouScore { get; set; }
        public Int32 GHS_SolarToursScore { get; set; }
        public decimal GHS_ExpediaScore { get; set; }
        public Int32 GHS_ExpediaReviewCount { get; set; }
        public decimal GHS_FinalScore { get; set; }
        public string GIPC_HotelCode { get; set; }
    }

    public class HotelsFacilities
    {
        public Int32 FacilID { get; set; }
        public string FacilityName { get; set; }
        public string FacilityStrType { get; set; }
        public Int32 FacilityType { get; set; }
        public string SourceNA { get; set; }
    }

    public class FacilityIDFilter
    {
        public string FacilID { get; set; }
        public string PlcID { get; set; }
        public string TypeId { get; set; }
    }

    public class HotelsFilters
    {
        public List<ListCityZones> listCityZones { get; set; }
        public List<ListRatings> listRatings { get; set; }
        public string strReview { get; set; }
    }

    public class ListReviews
    {
        public decimal ghs_finalscore { get; set; }
    }

    public class HotelsByPlaceID_PG
    {
        public Int32 TotalCount { get; set; }
        public List<HotelsSummaryNew> hotels { get; set; }
        public List<ListCityZones> list_cityzones { get; set; }
        public List<ListRatings> list_ratings { get; set; }
        public List<ListReviews> list_reviews { get; set; }
        public static string ExpediaNoRange(double no)
        {
            if (no >= 4.5 && no <= 5.0)
            {
                return "EX";
            }
            else if (no >= 4.0 && no <= 4.49)
            {
                return "VG";
            }
            else if (no >= 3.5 && no <= 3.99)
            {
                return "GD";
            }
            return string.Empty;
        }
        public static double getDistanceFromLatLonInKm(double lat1, double lon1, double lat2, double lon2)
        {
            var R = 6371.0;
            var dLat = (lat2 - lat1) * (Math.PI / 180.0);
            var dLon = (lon2 - lon1) * (Math.PI / 180.0);
            var a = Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
                    Math.Cos(lat1 * (Math.PI / 180.0)) * Math.Cos(lat2 * (Math.PI / 180.0)) *
                    Math.Sin(dLon / 2) * Math.Sin(dLon / 2);
            var c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
            var d = R * c;
            return d;
        }
    }
}