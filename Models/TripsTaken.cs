using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MVC_TMED.Models
{
    public class BestSeller
    {
        public Int32 PDLID { get; set; }
        public Int32 STP_TypePromotion { get; set; }
        public string PDL_Title { get; set; }
        public Int32 STP_ProdItemID { get; set; }
        public decimal STP_Price { get; set; }
        public Int32 STP_NumOfNights { get; set; }
        public string SPD_Description { get; set; }
        public Int32 SPD_Producttypesyscode { get; set; }
        public string SPD_MiniTitle { get; set; }
        public string CountryName { get; set; }
    }

    public class PlaceHighlight
    {
        public Int32 STXID { get; set; }
        public string STX_Title { get; set; }
        public string STX_URL { get; set; }
    }

    public class Country_PlacesFromTravel: NameObject
    {
        public Int32 Rank { get; set; }
        public Int32 CountryId { get; set; }
        public string CountryName { get; set; }
    }

    public class TripsTakenCustomerFeedback : CustomerFeedback
    {
        public Int32 Rank { get; set; }
        public Int32 CountryId { get; set; }
        public string CountryName { get; set; }
        public Int32 PDLID { get; set; }
        public string PDL_Title { get; set; }
        public decimal STP_Save { get; set; }
        public Int32 NoOfFeed { get; set; }
        public string PDL_Places { get; set; }
        public string STR_PlaceTitle { get; set; }
        public Int32 STR_PlaceID { get; set; }
        public Int32 STR_PlaceTypeID { get; set; }
        public string PDL_PlacesTitle { get; set; }
    }

    public class Place: NameObject
    {
        public Int32 PlaceType { get; set; }
    }

    public class TripsTakenFeedback : CustomerFeedback
    {
        public List<PackOnInterestPriority> Package { get; set; }
        public List<Place> Places { get; set; }
    }

    public class TripsTakenFeedbackComparer : IEqualityComparer<TripsTakenFeedback>
    {
        public bool Equals(TripsTakenFeedback x, TripsTakenFeedback y)
        {
            return x.PCC_Comment == y.PCC_Comment && x.PCC_CustomerName == y.PCC_CustomerName && x.PCC_Itinerary == y.PCC_Itinerary && x.PCCID == y.PCCID;
        }

        public Int32 GetHashCode(TripsTakenFeedback x)
        {
            return x.PCC_Comment.GetHashCode();
        }

    }

}
