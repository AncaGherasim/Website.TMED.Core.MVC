using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MVC_TMED.Models
{
    public class PackageCountry
    {
        public string coun { get; set; }
        public Int32 Id { get; set; }
        public string Region { get; set; }
    }

    public class Filter
    {
        public string Title { get; set; }
        public Int32 Index { get; set; }
        public string Value { get; set; }
    }

    public class SearchPackages
    {
        public string site { get; set; }
        public string q { get; set; }
        public string filter { get; set; }
        public string page { get; set; }
        public string sort { get; set; }
    }

    public class xmlPackage
    {
        public Int32 Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Include { get; set; }
        public Int32 Duration { get; set; }
        public Decimal Price { get; set; }
        public Int32 Reviews { get; set; }
        public string ImageURL { get; set; }
        public string Country { get; set; }
        public string ProdKinds { get; set; }
        public DateTime DepartureDate { get; set; }
        public string DepartureAirport { get; set; }
        public string PriceHistInfo { get; set; }
    }


}
