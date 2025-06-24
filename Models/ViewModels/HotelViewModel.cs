using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Text;

namespace MVC_TMED.Models.ViewModels
{
    public class HotelViewModel
    {
        public string clsNA { get; set; }
        public string solNA { get; set; }
        public HotelInfo hotelInfo;
        public List<NameObject> facilitiesTypes;
        public List<NameObject> facilities;
        public List<HotelRoomCategories> dvCat;
        public PlaceInfo_By_PlaceName dvPlaceInfo;
        public List<PackOnInterestPriority> featPack;
        public string hotNa = "";
        public string couName = "";
        public string plcNA = "";
        public List<PlacePackagesIdea> dvPackOnCty;
        public string imageHotel = "";
        public string phone = "";
        public string SPD_StatePlaceID = "";
        public string STR_PlaceTitle = "";
        public string STR_PlaceID = "";
    }
}
