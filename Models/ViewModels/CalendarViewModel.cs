using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Text;

namespace MVC_TMED.Models.ViewModels
{
    public class CalendarViewModel
    {
        public List<CityTrasnsportOptions> citiesTransportOptions;
        public string qCities;
        public string wAir;
        public string dateD;
        public string depID;
        public string depNA;
        public string cabTY;
        public string sCampaignCode;
        public string webSite;

        public Int32 itineraryErr = 0;
        public string FrstCity = "";
        public List<ItinComponent> compCity = new List<ItinComponent>();
        public List<ItinComponent> eachCity = new List<ItinComponent>();
        public List<ItinComponent> compIntrCty = new List<ItinComponent>();

    }

    public class CalendarCompListViewModel
    {
        public Int32 FormSubmit = 0;
        public string wAir = "";
        public string cabin = "";
        public string idLeavingFrom = "";
        public List<string> idCity = new List<string>();
        public List<string> txtCity = new List<string>();
        public string arrDate = "";
        public List<string> apiCity = new List<string>();
        public List<string> stayCity = new List<string>();
        public List<string> overCity = new List<string>();
        public List<string> noCity = new List<string>();
        public string idCityS = "";
        public string idCityE = "";
        public string rooms = "";
        public string roomsAndpax = "";
        public string Adults = "";
        public string Childs = "";
        public List<string> child = new List<string>();
        public string R2Adults = "";
        public string R2Childs = "";
        public string R3Adults = "";
        public string R3Childs = "";
        public string sCampaignCode = "";
        public string contenido = "";
        public string txtCityS = "";
        public string txtCityE = "";
        public List<string> R2child = new List<string>();
        public List<string> R3child = new List<string>();

        public string idReturningTo = "";
        public string txtReturningTo = "";

    }

}
