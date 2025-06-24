using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MVC_TMED.Models
{
    public class PlacesH_MasterInterestContent
        {
            public Int32 STRID { get; set; }
            public Int32 STR_PlaceID { get; set; }
            public Int32 SMCID { get; set; }
            public string SMC_Template { get; set; }
        }

    public class MasterInterestInfo
    {
        public Int32 SMCID { get; set; }
        public string SMC_Title { get; set; }
        public string SMC_Content { get; set; }
        public string SCD_CodeTitle { get; set; }
        public Int32 STRID { get; set; }
        public string STR_PlaceTitle { get; set; }
        public Int32 STR_PlaceID { get; set; }
        public Int32 STR_PlaceAIID { get; set; }
        public string STR_PlaceShortInfo { get; set; }

    }

    public class PlacesInterest
    {
        public string STR_PlaceTitle { get; set; }
        public Int32 STR_PlaceID { get; set; }
        public string STR_PlaceShortInfo { get; set; }
        public Int32 STR_PlaceTypeID { get; set; }
        public Int32 SPW_Weight { get; set; }
        public Int32 SPW_Deals { get; set; }
    }

    public class CitiesRelatedItin
    {
        public Int32 cxz_productitem { get; set; }
        public Int32 cxz_ChildPlaceId { get; set; }
        public string str_placetitle { get; set; }
        public Int32 PDL_Duration { get; set; }
        public Int32 PDL_SequenceNo { get; set; }
        public Int32 PDLID { get; set; }
        public string PDL_title { get; set; }
        public string SPD_Description { get; set; }
        public Int32 SPD_StarratingSysCode { get; set; }
        public string SPD_Features { get; set; }
        public string PDL_Places { get; set; }
        public string SPD_InternalComments { get; set; }
        public Int32 Promotion { get; set; }
        public Decimal Prom_Price { get; set; }
        public Decimal Price_WTax { get; set; }
        public string PDL_Content { get; set; }
        public Int32 STP_NumOfNights { get; set; }
        public Int32 NoOfFeed { get; set; }
    }


}
