using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MVC_TMED.Models
{
    public class HotelInfo
    {
        public Int32 PDLID { get; set; }
        public string Rating { get; set; }
        public string Name { get; set; }
        public string GiataName { get; set; }
        public Int32 SequenceNo { get; set; }
        public string HotelAddress { get; set; }
        public string HotelStyle { get; set; }
        public Int32 NoRooms { get; set; }
        public string Latitude { get; set; }
        public string Longitude { get; set; }
        public string HotelDescription { get; set; }
        public string RoomDescr { get; set; }
        public Int32 SPD_StatePlaceID { get; set; }
        public Int32 GIPH_GIATAID { get; set; }
        public string GIPH_TNContentSource { get; set; }
        public string CityZone { get; set; }
        public bool GIPH_TNUseTournetContent { get; set; }
        public string? GIPH_TNHighlights { get; set; }
        public string GIPC_HotelCode { get; set; }
        public Int32 GHS_SolarToursScore { get; set; }
        public decimal GHS_ExpediaScore { get; set; }
        public Int32 GHS_ExpediaReviewCount { get; set; }
        public decimal GHS_FinalScore { get; set; }
        public string PLC_Title { get; set; }
        public string STR_PlaceTitle { get; set; }
        public string CountryNA { get; set; }
        public Int32 STRID { get; set; }
        public string GIEX_ExpSpecialCheckin { get; set; }
        public string GIEX_MandatoryFees { get; set; }
        public string GIEX_OptionalFees { get; set; }
        public string GIEX_Renovations { get; set; }
        public string IMG_Path_URL { get; set; }
        public string Phone { get; set; }
        public string GIPH_AddressLine1 { get; set; }
        public string GIPH_AddressLine2 { get; set; }
        public string GIPH_AddressLine3 { get; set; }
        public string GIPH_AddressLine4 { get; set; }
        public string GIPH_AddressLine5 { get; set; }
        public string GIPH_AddressLine6 { get; set; }
        public string PTY_Address { get; set; }
        public string GHGT_Text100 { get; set; }
        public string GHGT_Text101 { get; set; }
        public string GHGT_Text102 { get; set; }
        public string GIPH_TNTournetContent { get; set; }
    }

    public class HotelInfoDetails
    {
        public string GIPH_TNContentSource { get; set; }
        public bool GIPH_TNUseTournetContent { get; set; }
        public string HotelStyleManual { get; set; }
        public string HotelStyle { get; set; }
        public int GIPH_TNRooms { get; set; }
        public string HotelNoRooms { get; set; }
        public string GIEX_ExpSpecialCheckin { get; set; }
        public string GIEX_MandatoryFees { get; set; }
        public string GIEX_OptionalFees { get; set; }
        public string GIEX_Renovations { get; set; }
    }

    public class HotelFacilities
    {
        public Int32 Id { get; set; }
        public Int32 FacilityType { get; set; }
        public string FacilityStrType { get; set; }
        public string FacilityName { get; set; }
    }

    public class HotelRoomCategories
    {
        public Int32 PTYID { get; set; }
        public string PTY_Title { get; set; }
        public string PTY_Description { get; set; }
        public Int32 PTY_ProductItemID { get; set; }
        public Int32 PTY_Active { get; set; }
        public Int32 PTY_Default { get; set; }
        public Int32 PTY_RecID { get; set; }
        public Int32 PTY_SourceTable { get; set; }
    }


    public class HotelImages
    {
        public string IMG_Title { get; set; }
        public string IMG_Path_URL { get; set; }
        public Int32 GIMG_TNSequence { get; set; }
    }
}

