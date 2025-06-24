using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MVC_TMED.Models
{
        public class FeatItins
        {
            public Int32 PDLID { get; set; }
            public string PDL_Title { get; set; }
            public string PDL_Content { get; set; }
            public Int32 PDL_SequenceNo { get; set; }
            public Int32 STP_UserID { get; set; }
            public Int32 DeptNA { get; set; }
            public Decimal STP_Price { get; set; }
            public Decimal STP_Save { get; set; }
            public Int64 STP_NumOfNights { get; set; }
            public DateTime STP_StartDate { get; set; }
            public string SPD_InternalComments { get; set; }
            public string SPD_Description { get; set; }
            public Int32 SPD_Producttypesyscode { get; set; }
            public Int32 CityID { get; set; }
            public string CityName { get; set; }
            public Int32 CountryID { get; set; }
            public string CountryName { get; set; }
            public string IMG_Path_URL { get; set; }
            public string IMG_500Path_URL { get; set; }
            public Int32 NoOfFeed { get; set; }
        }

        public class CustCommentsUserId
        {
            public Int32 PDLID { get; set; }
            public string PDL_Title { get; set; }
            public decimal STP_Save { get; set; }
            public Int32 STP_NumOfNights { get; set; }
            public string CityNA { get; set; }
            public Int32 SPD_CountryPlaceID { get; set; }
            public string CountryName { get; set; }
            public string IMG_Path_URL { get; set; }
            public string IMG_500Path_URL { get; set; }
            public Int32 NoOfFeed { get; set; }
            public string Comment { get; set; }
            public DateTime dep_date { get; set; }
        }

        public class SpotLight
        {
            public Int32 PDLID { get; set; }
            public string CountryNA { get; set; }
            public Int32 STR_PlaceAIID { get; set; }
            public string PDL_Title { get; set; }
            public decimal STP_Save { get; set; }
            public Int32 STP_NumOfNights { get; set; }
            public Int32 SPD_CountryPlaceID { get; set; }
            public string city { get; set; }
            public string IMG_500Path_URL { get; set; }
        }

        public class ExploreDest
        {
            public Int32 CtyID { get; set; }
            public string CtyNA { get; set; }
            public Int32 CouID { get; set; }
            public string CouNA { get; set; }
            public Int32 Ranking { get; set; }
        }

    public class footerDestinations
    {
        public Int32 regionid { get; set; }
        public Int32 countryid { get; set; }
        public string countryname { get; set; }
        public Int32 cityid { get; set; }
        public string cityname { get; set; }
        public Int32 cityrank { get; set; }
    }

    public class RelPackByPackID
        {
            public Int32 CXZID { get; set; }
            public Int32 PackageId { get; set; }
            public string PackageTitle { get; set; }
            public Int32 PlaceId { get; set; }
            public string PlaceTitle { get; set; }
            public Int32 NoOfPacks { get; set; }
            public Int32 str_placetypeid { get; set; }
            public string SPD_Features { get; set; }
        }

    public class LastVisits
    {
        public Int32 UTS_ProductItemID { get; set; }
        public string UTS_URL { get; set; }
        public DateTime UTS_Date { get; set; }
        public string UTS_Site { get; set; }
    }


    public class VisitedPacks: FeatItins
    {
        public string fromPlace { get; set; }
        public Int32 feedbacks { get; set; }
        public Int32 STR_UserID { get; set; }
        public string STR_PlaceTitle { get; set; }
    }

    public class recentlyVisitedPackage : VisitedPacks
    {
        public Int32 UTS_ProductItemID { get; set; }
        public string UTS_URL { get; set; }
        public DateTime UTS_Date { get; set; }
        public string UTS_Site { get; set; }
    }


}

