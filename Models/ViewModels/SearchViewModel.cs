using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Xml;

namespace MVC_TMED.Models.ViewModels
{
    public class SearchViewModel
    {
        public XmlNodeList xmlPackIds;
        public string placeNA = "";
        public List<PlacesHierarchy> placeHierarchy = new List<PlacesHierarchy>();
        public List<string> boxPrices = new List<string>();
        public List<string> boxLengths = new List<string>();
        public List<Country> Countries = new List<Country>();
        public string placeID = "";
        public string destNAs = "";
        public string pageTitle = "";
        public string navLinks = "";
        public List<Filter> Prices = new List<Filter>();
        public List<Filter> StayLengths = new List<Filter>();
        public List<Country> Cities = new List<Country>();
        public List<NameObject> Interests = new List<NameObject>();
    }

    public class SearchPackagesViewModel
    {
        public List<xmlPackage> packs = new List<xmlPackage>();
        public Int32 xmlPacksCount = 0; 

    }
}
