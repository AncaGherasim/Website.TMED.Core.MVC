using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MVC_TMED.Models.ViewModels
{
    public class CustomerFeedbackViewModel
    {
        public List<PackMediumInfo> packInfo = new List<PackMediumInfo>();
        public List<BestSeller> bestSell = new List<BestSeller>();
        public List<PlaceNames> placeNames = new List<PlaceNames>();
        public List<PlaceHighlight> placeHighlights = new List<PlaceHighlight>();
        public List<PackOnInterestPriority> mostPop = new List<PackOnInterestPriority>();
        public List<NameObject> scores = new List<NameObject>();
        public List<SimilarPackages> similarPacks = new List<SimilarPackages>();
    }
    public class PackMediumInfo
    {
        public Int32 PDLID { get; set; }
        public string PDL_Title { get; set; }
        public string PDL_Places { get; set; }
        public string CountryName { get; set; }
        public Int32 CountryId { get; set; }
        public decimal STP_save { get; set; }
        public string SPD_InternalComments { get; set; }
    }
    public class PlaceNames
    {
        public string Name { get; set; }
        public Int32 PlaceType { get; set; }
        public Int32 Id { get; set; }
    }
    public class SimilarPackages
    {
        public Int32 PDLID { get; set; }
        public string PDL_Title { get; set; }
        public Int32 NoOfFeed { get; set; }
    }

    public class CustomerFeedbacksByPageParams
    {
        public string packId { get; set; }
        public string page { get; set; }
        public string PlacesIDs { get; set; }
        public string order { get; set; }
        public string rating { get; set; }
        public string PDL_Title { get; set; }
        public string CountryName { get; set; }
    }

    public class CustomerFeedbackByPageParamsViewModel
    {
        public List<PlaceNames> packPlaces = new List<PlaceNames>();
        public List<CustomerFeedback> cfs = new List<CustomerFeedback>();
        public Int32 PDLID { get; set; }
        public string PDL_Title { get; set; }
        public string CountryName { get; set; }

    }
}
