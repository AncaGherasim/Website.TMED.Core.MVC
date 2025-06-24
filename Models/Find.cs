using MVC_TMED.Models.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MVC_TMED.Models
{
    public class PacksByPlaceID_Basic
    {
        public Int32 PDLID { get; set; }
        public string PDL_Places { get; set; }
        public Decimal STP_Save { get; set; }
        public Int64 Duration { get; set; }
        public Int64 STP_NumOfNights { get; set; }
    }
    public class Packages_PG
    {
        public Int32 pdlid { get; set; }
        public string pdl_places { get; set; }
        public decimal stp_save { get; set; }
        public Int64 duration { get; set; }
        public Int64 STP_NumOfNights { get; set; }
        public Int32 NoOfFeed { get; set; }
        public string pdl_title { get; set; }
        public string pdl_content { get; set; }
        public string stp_starttraveldate { get; set; }
        public string spd_description { get; set; }
        public string spd_internalcomments { get; set; }
        public string img_path_url { get; set; }
        public string countryname { get; set; }
        public Int32 totalcount { get; set; }
    }

    public class Aggregates_PG
    {
        public string price_filter_1 { get; set; }
        public string price_filter_2 { get; set; }
        public string price_filter_3 { get; set; }
        public string price_filter_4 { get; set; }
        public string price_filter_5 { get; set; }
        public string nights_filter_1 { get; set; }
        public string nights_filter_2 { get; set; }
        public string nights_filter_3 { get; set; }
        public string nights_filter_4 { get; set; }
    }

    public class Cities_PG
    {
        public string str_placeid { get; set; }
        public string str_placetitle { get; set; }
        public string counid { get; set; }
        public string counname { get; set; }
        public Int32 plcrk { get; set; }
    }

    public class PacksByPlaceID_PG
    {
        public Int32 TotalCount { get; set; }
        public List<Packages_PG> packages { get; set; }
        public Aggregates_PG aggregates { get; set; }
        public List<Cities_PG> cities { get; set; }
    }

    public class PacksByPlaceID_Filters_PG
    {
        public Int32 totalcount { get; set; }
        public string countryname { get; set; }
        public string img_path_url { get; set; }
        public string spd_internalcomments { get; set; }
        public string spd_description { get; set; }
        public DateTime stp_starttraveldate { get; set; }
        public decimal stp_save { get; set; }
        public Int32 duration { get; set; }
        public Int32 nooffeed { get; set; }
        public string pdl_places { get; set; }
        public string pdl_content { get; set; }
        public string pdl_title { get; set; }
        public Int32 pdlid { get; set; }
    }
    public class PlacesFromSTR
    {
        public Int32 PlcID { get; set; }
        public string PlcNA { get; set; }
        public Int32 PlcTY { get; set; }
        public Int32 PlcRK { get; set; }
        public string CouNA { get; set; }
        public Int32 CouID { get; set; }
    }

    public class Country: NameObject
    {
        public List<NameObject> Cities = new List<NameObject>();
    }

    public class CountryComparer : IEqualityComparer<Country>
    {
        public bool Equals(Country x, Country y)
        {
            return x.Id == y.Id;
        }

        public Int32 GetHashCode(Country x)
        {
            return x.Id.GetHashCode();
        }
    }

    public class FindCusPackInfo
    {
        public string plcID { get; set; }
        public string plcNA { get; set; }
        public string filter { get; set; }
        public string OrderVal { get; set; }
        public Int32 PageNo { get; set; }
    }

    public class PacksByPlaceID_Id
    {
        public Int32 PDLID { get; set; }
        public Int32 NoOfFeed { get; set; }
    }

    public class FindItinPage
    {
        public string placeID { get; set; }
        public string packsIds { get; set; }
        public string OrderVal { get; set; }
    }

    public class PackFindItinPage : ViewModels.CountryPackages
    {
        public string CountryName { get; set; }
    }

    public class PackFindItinPageComparer : IEqualityComparer<PackFindItinPage>
    {
        public bool Equals(PackFindItinPage x, PackFindItinPage y)
        {
            return x.PDLID == y.PDLID;
        }

        public Int32 GetHashCode(PackFindItinPage x)
        {
            return x.PDLID.GetHashCode();
        }
    }

    public class PacksByPlaceID_IdComparer : IEqualityComparer<PacksByPlaceID_Id>
    {
        public bool Equals(PacksByPlaceID_Id x, PacksByPlaceID_Id y)
        {
            return x.PDLID == y.PDLID;
        }

        public Int32 GetHashCode(PacksByPlaceID_Id x)
        {
            return x.PDLID.GetHashCode();
        }
    }

    public class FindPacksByPlaceID_IdComparer : IEqualityComparer<CountryPackages>
    {
        public bool Equals(CountryPackages x, CountryPackages y)
        {
            return x.PDLID == y.PDLID;
        }

        public Int32 GetHashCode(CountryPackages x)
        {
            return x.PDLID.GetHashCode();
        }
    }
    public class CountryWithCitiesPG
    {
        public string counid { get; set; }
        public string counname { get; set; }
        public Int32 plcrk { get; set; }
        public List<CityPG> cities { get; set; }
        public bool isfixed { get; set; }
    }

    public class CityPG
    {
        public string str_placeid { get; set; }
        public string str_placetitle { get; set; }
        public Int32 plcrk { get; set; }
        public bool isfixed { get; set; }
    }

    public class CityObjectComparer : IEqualityComparer<CityPG>
    {
        public bool Equals(CityPG x, CityPG y)
        {
            return x.str_placeid == y.str_placeid;
        }

        public Int32 GetHashCode(CityPG x)
        {
            return x.str_placeid.GetHashCode();
        }
    }

}
