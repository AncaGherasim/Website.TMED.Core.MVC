using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace MVC_TMED.Models.ViewModels
{
    public class TripsTakenViewModel
    {
        public List<PlaceInfo_By_PlaceName_TripsTaken> placeInfo = new List<PlaceInfo_By_PlaceName_TripsTaken>();
        public List<BestSeller> packs = new List<BestSeller>();
        public List<PackOnInterestPriority> topPacks = new List<PackOnInterestPriority>();
        public List<PlaceHighlight> countryHighlights = new List<PlaceHighlight>();
        public List<Country_PlacesFromTravel> citiesFromCountry = new List<Country_PlacesFromTravel>();
        public List<Country_PlacesFromTravel> citiesRankLessThan5 = new List<Country_PlacesFromTravel>();
        public string pageMetaDesc = "";
        public string pageMetaKey = "";
        public string pageHeaderText = "";
        public string pageDescriptionCity = "";
        public Int32 NoCountryId = -1;
        public Int32 CountryId = -1;
        public string CountryName = "";
        public string destination = "";
    }
}
