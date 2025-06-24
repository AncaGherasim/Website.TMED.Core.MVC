using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MVC_TMED.Models.ViewModels
{
    public class CruiseViewModel
    {
        public Int32 TotalAllCruise;
        public string intContent;
        public string PlaceName;
        public Int32 PlaceID;
        public List<CruisePacks> listAllCruise = new List<CruisePacks>();
        public List<CruisePacks> listNoFilterCruise = new List<CruisePacks>();
        public List<CruisePacks> listAllMinis = new List<CruisePacks>();
    }

    public class CruisePics_Params 
    {
        public string Name { get; set; }
        public string Ship { get; set; }
        public string Imag0 { get; set; }
    }

    public class CruiseInfo_Params
    {
        public string PackID { get; set; }
        public string PlaceID { get; set; }
        public string PgType { get; set; }
    }

}
