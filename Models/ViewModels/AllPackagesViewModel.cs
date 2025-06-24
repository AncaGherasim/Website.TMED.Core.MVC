using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MVC_TMED.Models.ViewModels
{
    public class AllPackagesViewModel
    {
        public List<PlacesHierarchy> placeHierarchy = new List<PlacesHierarchy>();
        public List<Hierarchy> listHierarchy = new List<Hierarchy>();
        public string pageHeaderText = "";
        public Int32 placeID;
        public string placeNA = "";
        public Int32 placeSTR;
        public List<string> boxPrices = new List<string>();
        public List<string> boxLengths = new List<string>();
        public List<CountryWithCitiesPG> Countries = new List<CountryWithCitiesPG>();
        public CountryWithCitiesPG thisCountry = new CountryWithCitiesPG();
        public string couNA = "";
        public List<CountryPackages> list10Packs = new List<CountryPackages>();
        public PacksByPlaceID_PG allPackages = new PacksByPlaceID_PG();
    }

    public class Hierarchy
    {
        public string STX_Title { get; set; }
        public string STX_URL { get; set; }
        public Int32 STX_ProdKindID { get; set; }
        public Int32 STX_STRID { get; set; }
        public Int32 STX_Priority { get; set; }
    }
    public class CountryPackages
    {
        public Int32 PDLID { get; set; }
        public string PDL_Title { get; set; }
        public string PDL_Content { get; set; }
        public Int32 PDL_SequenceNo { get; set; }
        public string PDL_Places { get; set; }
        public Int32 STP_NumOfNights { get; set; }
        public string SPD_Description { get; set; }
        public string SPD_InternalComments { get; set; }
        public decimal STP_Save { get; set; }
        public Int32 SPPW_Weight { get; set; }
        public Int32 NoOfFeed { get; set; }
        public string IMG_Path_URL { get; set; }
        public string STP_StartTravelDate { get; set; }
        public string PLC_Title { get; set; }
        public string STP_MiniTitle { get; set; }
        public string STR_PlaceTitle { get; set; }
        public string WebTemplate { get; set; }
        public string CountryName { get; set; }
    }
    public class AllPacksPlaces
    {
        public Int32 PlaceId { get; set; }
        public string PlaceName { get; set; }
        public Int32 PlaceType { get; set; }
        public Int32 PlaceRanking { get; set; }
        public string CountryName { get; set; }
        public Int32 CountryId { get; set; }
    }
}
