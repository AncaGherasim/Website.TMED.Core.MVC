using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MVC_TMED.Models.ViewModels
{
    public class ActivitiesViewModel
    {
        public List<PlaceInfo_By_PlaceName> placeInfo = new List<PlaceInfo_By_PlaceName>();
        public List<CityCMS> cityCMS = new List<CityCMS>();
        public List<CityFeaturedItineraries> featuredItineraries = new List<CityFeaturedItineraries>();
        public List<PlaceDisplayContent> displayContents = new List<PlaceDisplayContent>();
        public List<ActivitiesType> activitiesType = new List<ActivitiesType>();
        public String ssIds = "";
    }

    public class CityCMS
    {
        public Int32 STR_PlaceID { get; set; }
        public string CMSW_Title { get; set; }
        public Int32 CMSW_Order { get; set; }
        public Int32 CMSW_RelatedCmsID { get; set; }
        public string CMS_Description { get; set; }
    }

    public class CityFeaturedItineraries
    {
        public Int32 PDLID { get; set; }
        public string PDL_Title { get; set; }
        public Int32 Duration { get; set; }
        public decimal STP_Save { get; set; }
        public Int32 PDL_SequenceNo { get; set; }
        public Int32 SPPW_Weight { get; set; }
        public string IMG_Path_URL { get; set; }
        public string PDL_Places { get; set; }
    }

    public class PlaceDisplayContent
    {
        public string SDP_DisplayTitle { get; set; }
        public string STX_Title { get; set; }
        public string STX_URL { get; set; }
        public string STX_Description { get; set; }
        public string STX_PictureURL { get; set; }
        public Int32 STX_ProdKindID { get; set; }
        public Int32 STX_Priority { get; set; }
        public Int32 STX_PictureHeightpx { get; set; }
        public Int32 STX_PictureWidthpx { get; set; }
        public Int32 STX_CMSID { get; set; }
    }
    public class ActivitiesType
    {
        public Int32 Id { get; set; }
        public string Name { get; set; }
        public Int32 SSId { get; set; }
    }

    public class GetTours
    {
        public Int32 PDLID { get; set; }
        public string PDL_Title { get; set; }
        public Int32 PDL_SequenceNo { get; set; }
        public Int32 Duration { get; set; }
        public string DurationUnit { get; set; }
        public Int32 ID { get; set; }
        public string Name { get; set; }
        public string SPD_Description { get; set; }
        public string PDL_Description { get; set; }
        public string IMG_Path_URL { get; set; }
        public decimal Rating { get; set; }
        public Int32 Reviews { get; set; }
    }

    public class PoiByPlace
    {
        public Int32 POIID { get; set; }
        public Int32 POI_PLCID { get; set; }
        public string POI_Title { get; set; }
        public decimal POI_Latitude { get; set; }
        public decimal POI_Longitude { get; set; }
        public string POI_Description { get; set; }
        public Int32 POI_Active { get; set; }
        public Int32 POI_CMSID { get; set; }
        public string POI_TragetURL { get; set; }
        public string POI_PictureURL { get; set; }
    }

    public class Activity
    {
        public Int32 Id { get; set; }
        public string Name { get; set; }
        public Int32 PDL_SequenceNo { get; set; }
        public decimal STP_Save { get; set; }
        public string SCD_CodeTitle { get; set; }
        public string SSDuration { get; set; }
        public Int32 SSDurationInMinutes { get; set; }
        public decimal Rating { get; set; }
        public Int32 Reviews { get; set; }
        public string SPD_Description { get; set; }
        public string PDL_Description { get; set; }
        public string IMG_Path_URL { get; set; }
    }
}
