using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Text;

namespace MVC_TMED.Models.ViewModels
{
    public class FindViewModel
    {
        public List<PlacesHierarchy> placeHierarchy = new List<PlacesHierarchy>();
        public List<string> boxPrices = new List<string>();
        public List<string> boxLengths = new List<string>();
        public List<Country> Countries = new List<Country>();
        public string placeNA = "";
        public string placeID = "";
        public string destNAs = "";
        public string pageTitle = "";
        public string navLinks = "";
        public string namesFind = "";
        public PacksByPlaceID_PG allPackages = new PacksByPlaceID_PG();
        public List<CountryWithCitiesPG> Countries_ = new List<CountryWithCitiesPG>();
        public CountryWithCitiesPG thisCountry = new CountryWithCitiesPG();
        public List<Int32> placeIDs = new List<Int32>();
    }

    public class FindCusPackInfoViewModel
    {
        public Int32 totalPacks = 0;
        public string boxAllPacksStr = "";
    }

    public class CombineCountryIds
    {
        public Int32 PDLID { get; set; }
        public Int32 NoOfFeed { get; set; }
    }

   public class CombineCountryPackages
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
        public DateTime STP_StartTravelDate { get; set; }
        public string PLC_Title { get; set; }
        public string STP_MiniTitle { get; set; }

    }
}
