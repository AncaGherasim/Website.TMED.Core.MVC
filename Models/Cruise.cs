using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MVC_TMED.Models
{
    public class CruisePacks
    {
        public Int32 PDLID { get; set; }
        public Int32 PDL_SequenceNo { get; set; }
        public string PDL_Title { get; set; }
        public string SCD_CodeTitle { get; set; }
        public string PDL_SpecialCode { get; set; }
        public Int32 SPD_StarRatingSysCode { get; set; }
        public string AAT_Overall { get; set; }
        public string PDL_Description { get; set; }
        public string PDL_Content { get; set; }
        public Int32 PDL_Duration { get; set; }
        public decimal STP_Price { get; set; }
        public decimal STP_Save { get; set; }
        public string IMG_Title { get; set; }
        public string IMG_Path_URL { get; set; }
        public string PDL_Notes { get; set; }
    }

    public class CruisePackInfo
    {
        public Int32 PDLID { get; set; }
        public string Title { get; set; }
        public string ProdKinds { get; set; }
        public string PackDescription { get; set; }
        public string Includes { get; set; }
        public string Distances { get; set; }
        public string DeckPlan { get; set; }
        public Int32 SysCode { get; set; }
        public string CityNA { get; set; }
        public string Places { get; set; }
        public string Themes { get; set; }
        public string CountryName { get; set; }

    }

    public class CruisePackRelated
    {
        public Int32 CXZID { get; set; }
        public Int32 PackageId { get; set; }
        public string PackageTitle { get; set; }
        public Int32 PlaceId { get; set; }
        public string PlaceTitle { get; set; }
        public Int32 NoOfPacks { get; set; }
        public Int32 str_placetypeid { get; set; }
    }

    public class CruisePicsPackage
    {
        public Int32 PXI_ImageID { get; set; }
        public decimal PXI_Sequence { get; set; }
        public string IMG_Path_URL { get; set; }
        public string IMG_Title { get; set; }
        public string IMG_ImageType { get; set; }
        public string IMG_500Path_URL { get; set; }
        public string SPD_InternalComments { get; set; }
    }


}
