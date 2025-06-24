using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MVC_TMED.Models
{
    public class POI
    {
        public Int32 POIID { get; set; }
        public Int32 POI_PLCID { get; set; }
        public string POI_Title { get; set; }
        public Decimal POI_Latitude { get; set; }
        public Decimal POI_Longitude { get; set; }
        public string POI_Description { get; set; }
        public Int32 POI_CMSID { get; set; }
        public string POI_TargetURL { get; set; }
        public string POI_PictureURL { get; set; }
    }

    public class ListOfHotelsMap : ListOfHotels
    {
        public Decimal PTY_Latitude { get; set; }
        public Decimal PTY_Longitude { get; set; }
        public string PTY_Address { get; set; }
        public Int32 PDL_CustomerRanking { get; set; }
        public Int32 PDL_DistrictZone { get; set; }
        public string PTY_Description { get; set; }
        public Int32 GIPH_GIATAID { get; set; }
        public string ContentSource { get; set; }
        public Int32 GHS_BookingScore { get; set; }
        public string GIPH_TNTournetContent { get; set; }
    }

    public class HotelsMapAddress
    {
        public string giph_tncontentsource { get; set; }
        public bool giph_tnusetournetcontent { get; set; }
        public string giph_addressline1 { get; set; }
        public string giph_addressline2 { get; set; }
        public string giph_addressline3 { get; set; }
        public string giph_addressline4 { get; set; }
        public string giph_addressline5 { get; set; }
        public string giph_addressline6 { get; set; }
        public string pty_address { get; set; }
        public string ghgt_text100 { get; set; }
        public string ghgt_text101 { get; set; }
        public string ghgt_text102 { get; set; }
        public string giph_tntournetcontent { get; set; }
    }
}
