using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MVC_TMED.Models
{
    public class CMScountry
    {
        public Int64 CMSW_Order { get; set; }
        public string CMSW_Title { get; set; }
        public Int32? CMSW_RelatedCmsID { get; set; }
        public string CMS_Description { get; set; }
    }

    public class CitySquence : NameObject
    {
        public Int32 Sequence { get; set; }
        public string DaysDuration { get; set; }
        public string NoOfAvailNite { get; set; }
        public Int32 NoOfHotels { get; set; }
        public Int32 NoOfSS { get; set; }
        public string PlaceShortInfo { get; set; }
        public List<CMScountry> CMSs { get; set; }
        public string ProdType { get; set; }
        public string ProdTitle { get; set; }
        public string OverNite { get; set; }
        public string CityTitle { get; set; }
        public string Transportation { get; set; }
        public string Str_Place_Title { get; set; }
        public string CountryName { get; set; }
        public string Division { get; set; }
    }

    public class City: NameObject
    {
        public Int64 ContryID { get; set; }
        public string CountryName { get; set; }
    }

    public class CityTrasnsportOptions
    {
        public string No { get; set; }
        public string PlaceName { get; set; }
        public string PlaceID { get; set; }
        public Int64 CountryId { get; set; }
        public string CountryName { get; set; }
        public string PlaceAPI { get; set; }
        private City NextPlace_ = new City() { Id = -1, Name = "End Itin" };
        public City NextPlace
        {
            get {return NextPlace_;}
            set {NextPlace_ = value;}
        }
        public string StayNights { get; set; }
        public List<TransportOption> Options  { get; set; }
    }

    public class TransportOption
    {
        public Int64 Ranking { get; set; }
        public string ProductType { get; set; }
        public string ProductTypeName { get; set; }
        public string ProductFreeField1 { get; set; }
        public string ProductNotes { get; set; }
        public Int64 Overnight { get; set; }
        public List<DropCity> CarDropOff { get; set; }
    }

    public class DropCity
    {
        public Int64 DOPlaceID { get; set; }
        public string DOPlaceName { get; set; }
        public string DOPlaceNo { get; set; }
    }

}
