using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MVC_TMED.Models.ViewModels
{
    public class PackageBYOitineraryViewModel
    {

    }

    public class ItinComponent
    {
        public string Prod_Type { get; set; }
        public string Prod_KindTitle { get; set; }
        public string City_Name { get; set; }
        public Int32 City_ID { get; set; }
        public Int32 Prod_Code { get; set; }
        public string Prod_Title { get; set; }
        public Int32 LineNum { get; set; }
        public string CitySeq { get; set; }
        public Int32 RelativeDay { get; set; }
        public Int32 DaysDuration { get; set; }
        public string NtsAvailable { get; set; }
        public Int32 OverNite { get; set; }
        public Int32 ComponentID { get; set; }
        public string Notes { get; set; }
        public bool MajorComponent { get; set; }
        public string ProductFF1 { get; set; }
    }

    public class PackageByoItinerary_Params //pkID=' + id + '&pkNA=' + na + '&itiSQ=' + sq,
    {
        public string pkID { get; set; }
        public string pkNA { get; set; }
        public string itiSQ { get; set; }
    }

}
