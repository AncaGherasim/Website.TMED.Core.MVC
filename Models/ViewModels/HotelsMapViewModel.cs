using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Text;

namespace MVC_TMED.Models.ViewModels
{
    public class HotelsMapViewModel
    {
        public string plcID = "";
        public string plcNA = "";
        public string couID = "";
        public string couNA = "";
        public List<PlaceInfoByName> hotelInfo = new List<PlaceInfoByName>();
        public List<ListCityZones> listCityZones = new List<ListCityZones>();
        public List<ListRatings> listRatings = new List<ListRatings>();
        public StringBuilder strReview = new StringBuilder();
        public HotelsByPlaceID_PG allHotels = new HotelsByPlaceID_PG();
    }
}
