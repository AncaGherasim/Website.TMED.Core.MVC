using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Text;

namespace MVC_TMED.Models.ViewModels
{
    public class HotelsViewModel
    {
        public List<CustomerFeed> listCityFeedBacks = new List<CustomerFeed>();
        public List<PackOnInterestPriority> listCityPackages = new List<PackOnInterestPriority>();
        public List<ListCityZones> listCityZones = new List<ListCityZones>();
        public List<ListRatings> listRatings = new List<ListRatings>();
        public List<PlaceInfoByName> hotelInfo = new List<PlaceInfoByName>();
        public Int32 NoOfHotels = 0;
        public StringBuilder strReview = new StringBuilder();
        public List<Tuple<string, string, string>> listRev = new List<Tuple<string, string, string>>();
        public List<HotelsSummaryNew> hotelListAll = new List<HotelsSummaryNew>();
        public HotelsByPlaceID_PG allHotels = new HotelsByPlaceID_PG();
        public string ctyLatLong;
    }
}
