using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MVC_TMED.Infrastructure;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using MVC_TMED.Models.ViewModels;
using MVC_TMED.Models;
using System.Xml;
using System.Text;
using Dapper;
using System.Data;
using System.Data.SqlClient;
using Newtonsoft.Json;
using System.Net.Http.Headers;
using System.Net.Http;

namespace MVC_TMED.Controllers
{
    public class PackageByoController : Controller
    {
        private readonly AppSettings _appSettings;
        private readonly DapperWrap _dapperWrap;
        private readonly AWSParameterStoreService _awsParameterStoreService;

        public PackageByoController(IOptions<AppSettings> appsettings, DapperWrap dapperWrap, AWSParameterStoreService awsParameterStoreService)
        {
            _appSettings = appsettings.Value;
            _dapperWrap = dapperWrap;
            _awsParameterStoreService = awsParameterStoreService;   
        }

        [HttpGet("{Country}/{name}/packagebyo-{id}", Name = "PackageByo_Route")]
        [HttpHead("{Country}/{name}/packagebyo-{id}", Name = "PackageByo_Route")]
        [HttpPost("{Country}/{name}/packagebyo-{id}", Name = "PackageByo_Route")]
        public async Task<IActionResult> Index(string Country, string id, string name)
        {
            HttpContext.Response.Headers.Add("_utPg", "byoPack");
            HttpContext.Response.Headers.Add("packID", id);

            PackTemplate_21ViewModel viewModel = new PackTemplate_21ViewModel();
            viewModel.packCountryNA = Country;
            viewModel.PackId = id;
            viewModel.relatedItin = HttpContext.Request.Query["relItin"];
            if (viewModel.relatedItin == null)
            {
                viewModel.relatedItin = id;
            }

            //Itinerary's Information
            var result1 = await _dapperWrap.GetRecords<PackInfo>(SqlCalls.SQL_PackageInformation(id));
            viewModel.ListPackInfo = result1.ToList();
            if (viewModel.ListPackInfo.Count == 0)
            {
                return NotFound();
            }


            var urlpath = HttpContext.Request.Path.Value.Split("/");
            string division = _appSettings.ApplicationSettings.SiteName == "" ? "" : viewModel.ListPackInfo.First().SPD_InternalComments.Contains(":.ED") ? "/europe" : viewModel.ListPackInfo.First().SPD_InternalComments.Contains(":LD") ? "/latin" : viewModel.ListPackInfo.First().SPD_InternalComments.Contains(":.TW") ? "/asia" : _appSettings.ApplicationSettings.SiteName;

            if (urlpath.Length == 5)
            {
                if (urlpath[4].Replace("_", " ") != viewModel.ListPackInfo.First().PDL_Title || urlpath[1].Replace("_", " ") != viewModel.ListPackInfo.First().STR_PlaceTitle)
                {
                    return RedirectPermanent("/" + viewModel.ListPackInfo.First().STR_PlaceTitle.Replace(" ", "_") + "/" + viewModel.ListPackInfo.First().PDL_Title.Replace(" ", "_") + "/packagebyo-" + id);
                }
            }
            if (urlpath.Length == 6)
            {
                if (urlpath[5].Replace("_", " ") != viewModel.ListPackInfo.First().PDL_Title || urlpath[2].Replace("_", " ") != viewModel.ListPackInfo.First().STR_PlaceTitle)
                {
                    return RedirectPermanent(urlpath[0] + "/" + viewModel.ListPackInfo.First().STR_PlaceTitle.Replace(" ", "_") + "/" + viewModel.ListPackInfo.First().PDL_Title.Replace(" ", "_") + "/packagebyo-" + id);
                }
            }

            if (Country.Replace(" ", "_").ToLower() != (viewModel.ListPackInfo.First().STR_PlaceTitle ?? Country).Replace(" ", "_").ToLower() || name.Replace(" ", "_").ToLower() != viewModel.ListPackInfo.First().PDL_Title.Replace(" ", "_").ToLower() || division != _appSettings.ApplicationSettings.SiteName)
            {
                if (division != _appSettings.ApplicationSettings.SiteName)
                {
                    return RedirectPermanent(division + "/" + (viewModel.ListPackInfo.First().STR_PlaceTitle ?? Country).Replace(" ", "_").ToLower() + "/" + viewModel.ListPackInfo.First().PDL_Title.Replace(" ", "_").ToLower() + "/packagebyo-" + id);
                }
                else
                {
                    return RedirectPermanent(division + "/" + viewModel.ListPackInfo.First().STR_PlaceTitle.Replace(" ", "_").ToLower() + "/" + viewModel.ListPackInfo.First().PDL_Title.Replace(" ", "_").ToLower() + "/packagebyo-" + id);
                }
            }
            int _DepartureAirportId;
            Int32.TryParse(viewModel.ListPackInfo.First().STP_FromPlaceID.ToString(), out _DepartureAirportId);
            viewModel.DepartureAirport.Id = _DepartureAirportId;
            viewModel.DepartureAirport.Name = viewModel.ListPackInfo.First().PLC_Title;

            //Departures date
            List<BlackoutsMobile> dvBlckDates = new List<BlackoutsMobile>();
            String stD = "";
            String edD = "";
            StringBuilder blokeds = new StringBuilder();
            var Result2 = await _dapperWrap.GetRecords<BlackoutsMobile>(SqlCalls.SQL_PackageHotelBlackoutsListMobile(id));
            dvBlckDates = Result2.ToList();
            if (dvBlckDates.Count > 0)
            {
                for (Int32 bk = 0; bk < dvBlckDates.Count; bk++)
                {
                    stD = dvBlckDates[bk].StartDate;
                    edD = dvBlckDates[bk].EndDate;
                    if (bk == 0)
                    {
                        blokeds.Append(stD + "," + edD);
                    }
                    if (bk > 0)
                    {
                        blokeds.Append("|" + stD + "," + edD);
                    }
                }

                if (blokeds.ToString() != "")
                {
                    viewModel.BkDates = blokeds.ToString();
                }
                else
                {
                    viewModel.BkDates = "0";
                }
            }
            //viewModel.BkDates = viewModel.BkDates.Replace(",", "*");

            //FIX DEPARTURES DATES
            List<FixDates> dvFixDates = new List<FixDates>();
            var Result3 = await _dapperWrap.GetRecords<FixDates>(SqlCalls.SQL_PackageFixDates(id));
            dvFixDates = Result3.ToList();
            string fixeds = "";
            if (dvFixDates.Count > 0)
            {
                foreach (FixDates fx in dvFixDates.OrderBy(x => x.ALT_Date))
                {
                    fixeds = fixeds + "," + string.Format("{0:MM/dd/yyyy}", fx.ALT_Date);
                }
            }
            if (fixeds != "")
            {
                viewModel.FxDates = fixeds;
                viewModel.fixNetDts = fixeds;
            }
            else
            {
                viewModel.FxDates = "0";
                viewModel.fixNetDts = "0";
            }
            //viewModel.FxDates = viewModel.FxDates.Replace(",", "*");

            //XML COMPONENTS CONTENT
            System.Xml.XmlDocument xmlCities = new XmlDocument();
            xmlCities = Utilities.PackageComponentListData(Int32.Parse(id), _awsParameterStoreService.SqlConnectionString);
            StringBuilder strCityID = new StringBuilder();
            StringBuilder strCitySEQ = new StringBuilder();
            StringBuilder minIDs = new StringBuilder();
            Int32 ctyC = 0;
            Int32 ticSQ = 0;
            Int32 ttcSQ = 0;
            Int32 cmpDY = 0;
            Int32 tioC = 0;
            Int32 ssC = 0;
            Int32 minC = 0;
            Int32 compC = 0;
            String ctySQ = "-1";
            String ssSS = "none";
            string ssNA = "";
            string ssDY = "";
            string ssSQ = "";
            string tranfT = "n";
            string tranfTIC = "none";
            viewModel.strTinTout = new List<string>();
            viewModel.minPackID = "";
            List<string> strSS = new List<string>();
            viewModel.xmlCities = xmlCities.GetElementsByTagName("Component");
            foreach (XmlNode cty in viewModel.xmlCities)
            {
                if (cty.SelectSingleNode("ProdType").InnerText == "H" || cty.SelectSingleNode("ProdType").InnerText == "P")
                {
                    try
                    {
                        if (ctyC == 0)
                        {
                            strCityID.Append(cty.SelectSingleNode("CityID").InnerText);
                            strCitySEQ.Append(cty.SelectSingleNode("CityID").InnerText + "|"
                                + cty.SelectSingleNode("cmp_CitySeq").InnerText + "|"
                                + cty.SelectSingleNode("cmp_DaysDuration").InnerText + "^"
                                + cty.SelectSingleNode("cmp_NoOfAvailNite").InnerText + "|"
                                + cty.SelectSingleNode("ProdType").InnerText + "|"
                                + cty.SelectSingleNode("Title").InnerText + "|"
                                + cty.SelectSingleNode("cmp_OverNite").InnerText);
                        }
                        else
                        {
                            strCityID.Append("," + cty.SelectSingleNode("CityID").InnerText);
                            strCitySEQ.Append("@" + cty.SelectSingleNode("CityID").InnerText + "|"
                                + cty.SelectSingleNode("cmp_CitySeq").InnerText + "|"
                                + cty.SelectSingleNode("cmp_DaysDuration").InnerText + "^"
                                + cty.SelectSingleNode("cmp_NoOfAvailNite").InnerText + "|"
                                + cty.SelectSingleNode("ProdType").InnerText + "|"
                                + cty.SelectSingleNode("Title").InnerText + "|"
                                + cty.SelectSingleNode("cmp_OverNite").InnerText);
                        }
                    }
                    catch (System.IO.IOException e)
                    {
                        throw new Exception(" nxcty <div>" + e.Message + "</div>");
                    }

                    if (cty.SelectSingleNode("ProdType").InnerText == "P")
                    {
                        try
                        {
                            if (minC == 0)
                            {
                                minIDs.Append(cty.SelectSingleNode("cmp_PDLComponentID").InnerText);
                            }
                            if (minC > 0)
                            {
                                minIDs.Append("," + cty.SelectSingleNode("cmp_PDLComponentID").InnerText);
                            }
                            viewModel.minPackID = minIDs.ToString();
                        }
                        catch (System.IO.IOException e)
                        {
                            throw new Exception(" nxcty 'P' <div>" + e.Message + "</div>");
                        }
                        minC += 1;
                    }

                    ctyC += 1;

                    string cityId = cty.SelectSingleNode("CityID").InnerText;
                    ctySQ = cty.SelectSingleNode("cmp_CitySeq").InnerText;
                    XmlNodeList transports = cty.SelectNodes("//Component[./ProdType/text()='T' and ./CityID/text()=" + cityId + " and ./cmp_CitySeq/text()=" + ctySQ + "]");
                    if (transports.Count == 0)
                    {
                        tranfT = cty.SelectSingleNode("cmp_ProductFF1").InnerText;
                        switch (tranfT)
                        {
                            case "TIC":
                                strCitySEQ.Append("|" + cty.SelectSingleNode("Title").InnerText);
                                break;
                            case "SO":
                            case "P2P":
                                strCitySEQ.Append("|By Air");
                                break;
                            default:
                                strCitySEQ.Append("|none");
                                break;
                        }
                    }
                    else
                    {
                        Boolean w = false;
                        foreach (XmlNode transp in transports)
                        {
                            tranfT = transp.SelectSingleNode("cmp_ProductFF1").InnerText;
                            switch (tranfT)
                            {
                                case "TIC":
                                    if (!w)
                                    {
                                        strCitySEQ.Append("|" + transp.SelectSingleNode("Title").InnerText);
                                    }
                                    else
                                    {
                                        strCitySEQ.Append(transp.SelectSingleNode("Title").InnerText);
                                    }
                                    w = true;
                                    break;
                                case "SO":
                                case "P2P":
                                    if (!w)
                                    {
                                        strCitySEQ.Append("|By Air - " + transp.SelectSingleNode("Title").InnerText);
                                    }
                                    else
                                    {
                                        strCitySEQ.Append("By Air - " + transp.SelectSingleNode("Title").InnerText);
                                    }
                                    w = true;
                                    break;
                                case "TIN":
                                case "TOUT":
                                    viewModel.strTinTout.Add(transp.SelectSingleNode("cmp_CitySeq").InnerText + "^" + transp.SelectSingleNode("cmp_RelativeDay").InnerText + "^" + transp.SelectSingleNode("Title").InnerText + "^" + transp.SelectSingleNode("cmp_ProductFF1").InnerText);
                                    break;
                            }
                        }

                        if (!w)
                        {
                            XmlNodeList transportsBySeq = cty.SelectNodes("//Component[./ProdType/text()='T' and ./cmp_CitySeq/text()=" + ctySQ + "]");
                            foreach (XmlNode transp in transportsBySeq)
                            {
                                tranfT = transp.SelectSingleNode("cmp_ProductFF1").InnerText;
                                switch (tranfT)
                                {
                                    case "TIC":
                                        if (!w)
                                        {
                                            strCitySEQ.Append("|" + transp.SelectSingleNode("Title").InnerText);
                                        }
                                        else
                                        {
                                            strCitySEQ.Append(transp.SelectSingleNode("Title").InnerText);
                                        }
                                        w = true;
                                        break;
                                    case "SO":
                                    case "P2P":
                                        if (!w)
                                        {
                                            strCitySEQ.Append("|By Air - " + transp.SelectSingleNode("Title").InnerText);
                                        }
                                        else
                                        {
                                            strCitySEQ.Append("By Air - " + transp.SelectSingleNode("Title").InnerText);
                                        }
                                        w = true;

                                        break;
                                }
                            }
                            if (!w) strCitySEQ.Append("|none");
                        }
                    }
                }

                try
                {
                    if (cty.SelectSingleNode("ProdType").InnerText == "S")
                    {
                        ssDY = cty.SelectSingleNode("cmp_RelativeDay").InnerText;
                        ssSQ = cty.SelectSingleNode("cmp_CitySeq").InnerText;
                        ssNA = cty.SelectSingleNode("Title").InnerText;
                        strSS.Add(ssSQ + "^" + ssDY + "^" + ssNA);
                        ssC += 1;
                    }
                }
                catch (System.IO.IOException e)
                {
                    throw new Exception(" SS <div>" + e.Message + "</div>");
                }
            }
            viewModel.stringCityIDs = strCityID.ToString();
            viewModel.howManyCtys = strCitySEQ.ToString().Split("@").Count();


            string pgTitle = "Build Your Own Vacation Package | Custom Vacation Package | Tripmasters";
            string pageMetaDesc = "Build Your Own Vacation Package: reorder, or add cities to your itinerary, Build Custom Vacation Packages with Airfare, best vacation deals, online bookings.";
            string pageMetaKey = "Europe vacations, European tours, Europe tour packages, vacation packages, to Europe, hotel deals, online booking, pricing, information, hotel travel, hotel, resort, accommodations, Europe, France, Paris, England, London, Netherlands, Italy, Spain";
            ViewBag.PageTitle = pgTitle;
            ViewBag.pageMetaDesc = pageMetaDesc;
            ViewBag.pageMetaKey = pageMetaKey;
            ViewBag.tmpagetype = "package";
            ViewBag.tmpagetypeinstance = "pkbyo";
            ViewBag.tmrowid = "";
            ViewBag.tmadstatus = "";
            ViewBag.tmregion = "europe";
            ViewBag.tmcountry = "";
            ViewBag.tmdestination = "";

            //RELATED ITINERARIES
            var Result4 = await _dapperWrap.GetRecords<RelatedItineraries>(SqlCalls.SQL_PackageRelatedItineraries(viewModel.relatedItin));
            viewModel.PackRelItins = Result4.ToList();   //itinRelateList


            if (Utilities.CheckMobileDevice() == false)
            {
                ViewBag.viewUsedName = "PackageByo";
                return View("PackageByo", viewModel);
            }
            else
            {
                ViewBag.viewUsedName = "PackageByo_Mob";
                return View("PackageByo_Mob", viewModel);
            }
        }

        [HttpPost("BYOitinerary")]
        public async Task<IActionResult> B_GET_BYOitinerary([FromBody] PackageByoItinerary_Params packageByoItinerary_Params)
        {
            CalendarViewModel calendarViewModel = new CalendarViewModel();
            calendarViewModel.citiesTransportOptions = new List<CityTrasnsportOptions>();

            PackageBYOitineraryViewModel packageBYOitineraryViewModel = new PackageBYOitineraryViewModel();

            string packID = packageByoItinerary_Params.pkID;
            string packNa = packageByoItinerary_Params.pkNA;
            string itinSeq = packageByoItinerary_Params.itiSQ;

            if (itinSeq == "undefined" || itinSeq == null)
            {
                List<ItinComponent> itinComp = new List<ItinComponent>();
                var result1 = await _dapperWrap.GetRecords<ItinComponent>(SqlCalls.SQL_ItinComponentList(packID));
                itinComp = result1.ToList();
                

                foreach (var c in itinComp)
                {
                    if (c.Prod_Type.Trim() == "H" || c.Prod_Type.Trim() == "P")
                    {
                        calendarViewModel.compCity.Add(c);
                        calendarViewModel.eachCity.Add(c);
                    }
                    if (c.Prod_Type.Trim() == "TR" || c.Prod_Type.Trim() == "C")
                    {
                        calendarViewModel.compIntrCty.Add(c);
                    }
                }
            }
            else
            {
                string[] nwIten = itinSeq.Split("$$$");
                Int32 noCity = 0;
                foreach (var c in nwIten)
                {
                    noCity += 1;
                    string[] cprt = c.Split("|");
                    if (cprt[0] != null)
                    {
                        if (cprt.Length > 3)
                        {
                            calendarViewModel.compCity.Add(new ItinComponent() { City_Name = cprt[1], City_ID = Int32.Parse(cprt[2]), CitySeq = noCity.ToString(), ProductFF1 = cprt[3] });

                            if (cprt[4] != null)
                            {
                                if (cprt[4].Trim() == "T" || cprt[4].Trim() == "C" || cprt[4].Trim() != "undefined")
                                {
                                    calendarViewModel.compIntrCty.Add(new ItinComponent() { City_Name = cprt[1], City_ID = Int32.Parse(cprt[2]), CitySeq = noCity.ToString(), ProductFF1 = cprt[3], Prod_Type = cprt[4], Prod_KindTitle = "" });
                                }
                            }
                        }
                        else
                        {
                            calendarViewModel.compCity.Add(new ItinComponent() { City_Name = cprt[1], City_ID = Int32.Parse(cprt[2]), CitySeq = noCity.ToString() });
                        }

                    }
                }
            }

            //StringBuilder strQCities = new StringBuilder();
            string qCities = "";
            string qidCities = "";
            string nextCty = "";
            //strQCities.Append("<CALENDAR_TRANSPORTATIONOPTION_Q>");
            //strQCities.Append("<UserID>" + _appSettings.ApplicationSettings.userID + "</UserID>");
            //strQCities.Append("<Cities>");
            //for (Int32 i = 0; i<= calendarViewModel.compCity.Count - 1; i++)
            //{
            //    if (i == 0)
            //    {
            //        qCities = calendarViewModel.compCity[i].City_Name;
            //        calendarViewModel.FrstCity = calendarViewModel.compCity[i].City_Name;
            //        qidCities = calendarViewModel.compCity[i].City_ID.ToString();
            //    }
            //    else
            //    {
            //        qCities = qCities + ", " + calendarViewModel.compCity[i].City_Name;
            //        qidCities = qidCities + "," + calendarViewModel.compCity[i].City_ID;
            //    }
            //    strQCities.Append("<City>");
            //    strQCities.Append("<No>" + (i + 1).ToString() + "</No>");
            //    strQCities.Append("<PlaceID>" + calendarViewModel.compCity[i].City_ID + "</PlaceID>");
            //    strQCities.Append("<PlaceName>" + calendarViewModel.compCity[i].City_Name + "</PlaceName>");

            //    if (i < calendarViewModel.compCity.Count - 1)
            //    {
            //        strQCities.Append("<PlaceToID>" + calendarViewModel.compCity[i + 1].City_ID + "</PlaceToID>");
            //    }
            //    else
            //    {
            //        strQCities.Append("<PlaceToID>-1</PlaceToID>");
            //    }
            //    strQCities.Append("</City>");
            //}
            //strQCities.Append("</Cities>");
            //strQCities.Append("</CALENDAR_TRANSPORTATIONOPTION_Q>");

            //string sQuery = "";
            string sResult = "";
            //XmlDocument qCTYS = new XmlDocument();
            //qCTYS.LoadXml(strQCities.ToString());
            //strQCities = null;
            //sQuery = qCTYS.InnerXml;
            //qCTYS = null;
            //string webApi = "localhost";
            //sResult = Utilities.SiteAPI_SendAndReceive(sQuery, "tournet", webApi);
            //if (sResult.Contains("<ErrMsg>"))
            //{
            //    calendarViewModel.itineraryErr = 1;
            //}

            TransportationOptionQ transportationOptionQ = new TransportationOptionQ();
            CalendarTransportationOptionQ calendarTransportationOptionQ = new CalendarTransportationOptionQ();
            calendarTransportationOptionQ.Cities = new List<CityTO>();
            calendarTransportationOptionQ.Version = 2;
            calendarTransportationOptionQ.UserID = "243,595,182";
            for (Int32 i = 0; i <= calendarViewModel.compCity.Count - 1; i++)
            {
                if (i == 0)
                {
                    qCities = calendarViewModel.compCity[i].City_Name;
                    calendarViewModel.FrstCity = calendarViewModel.compCity[i].City_Name;
                    qidCities = calendarViewModel.compCity[i].City_ID.ToString();
                }
                else
                {
                    qCities = qCities + ", " + calendarViewModel.compCity[i].City_Name;
                    qidCities = qidCities + "," + calendarViewModel.compCity[i].City_ID;
                }
                CityTO cityTO = new CityTO();
                cityTO.No = (i + 1).ToString();
                cityTO.PlaceID = int.Parse(calendarViewModel.compCity[i].City_ID.ToString());
                cityTO.PlaceName = calendarViewModel.compCity[i].City_Name.Trim();

                if (i < calendarViewModel.compCity.Count - 1)
                {
                    cityTO.PlaceToID = int.Parse(calendarViewModel.compCity[i + 1].City_ID.ToString());
                    //strQCities.Append("<PlaceToID>" + ctyID[ii] + "</PlaceToID>");
                }
                else
                {
                    cityTO.PlaceToID = -1;
                    //strQCities.Append("<PlaceToID>-1</PlaceToID>");
                }
                calendarTransportationOptionQ.Cities.Add(cityTO);
            }

            transportationOptionQ.CalendarTransportationOptionQ = calendarTransportationOptionQ;
            var result = new object();
            using (var httpClient = new HttpClient())
            {
                httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                var url = "https://2l6nhqi7od.execute-api.us-east-1.amazonaws.com/live/web/calendar";
                //var url = "https://efidyc44j7.execute-api.us-east-1.amazonaws.com/beta/calendar"; //DEV
                var data = new StringContent(JsonConvert.SerializeObject(transportationOptionQ), Encoding.UTF8, "application/json");
                var responseMessage = await httpClient.PostAsync(url, data);
                result = await responseMessage.Content.ReadAsStringAsync();
            }
            //JObject jsonn = JObject.Parse(result.ToString());
            dynamic json = JsonConvert.DeserializeObject(result.ToString());

            if (json.StatusCode == 500)
            {
                calendarViewModel.itineraryErr = 1;
            }

            //XmlDocument rCTYS = new XmlDocument();
            //rCTYS.LoadXml(sResult);
            string strPlaceIDs = "";
            List<City> cityList = new List<City>();
            //XmlNodeList rCities = rCTYS.GetElementsByTagName("City");
            foreach (var item in json.Cities)
            {
                strPlaceIDs = strPlaceIDs + item.PlaceID + ",";
            }
            if (json.Cities.Count > 0)
            {
                strPlaceIDs = strPlaceIDs.Substring(0, strPlaceIDs.Length - 1);
                try
                {
                    var result1 = _dapperWrap.GetRecords<City>(SqlCalls.SQL_CitiesNames(strPlaceIDs));
                    cityList = result1.Result.ToList();
                }
                catch (System.IO.IOException e)
                {
                    return View("Error");
                }
            }

            try
            {
                string countryId = "";
                List<City> thisCity = new List<City>();
                //XmlNodeList itincity = rCTYS.GetElementsByTagName("City");

                foreach (var cty in json.Cities)
                {
                    CityTrasnsportOptions ct = new CityTrasnsportOptions();
                    //ct.PlaceName = node.SelectSingleNode("PlaceName").InnerText;
                    ct.No = cty.No;
                    ct.PlaceID = cty.PlaceID;
                    ct.PlaceName = cty.PlaceName;
                    //ct.PlaceAPI = HotelsAPI;
                    //ct.StayNights = ctySt[Int32.Parse(ct.No) - 1];

                    //thisCity = cityList.Where(x => x.Id == Int32.Parse(ct.PlaceID)).ToList();
                    //if (thisCity.Count > 0)
                    //{
                    //    ct.CountryId = thisCity[0].ContryID;
                    //    ct.CountryName = thisCity[0].CountryName;
                    //}

                    //Int64 NextPlaceId = -9999;
                    //Int64.TryParse(node.SelectSingleNode("PlaceToID").InnerText, out NextPlaceId);
                    Int32 NextPlaceId = -9999;
                    if (cty.PlaceToID != null)
                    {
                        NextPlaceId = cty.PlaceToID;
                    }
                    List<City> nextPlace = cityList.Where(x => x.Id == NextPlaceId).ToList();
                    if (nextPlace.Count > 0)
                    {
                        ct.NextPlace = nextPlace[0];
                    }

                    //XmlNodeList optionNodes = node.SelectNodes("Options/Option");
                    List<TransportOption> options = new List<TransportOption>();
                    if (cty.Options != null)
                    {
                        foreach (var optNode in cty.Options)
                        {
                            TransportOption opt = new TransportOption();
                            opt.ProductTypeName = optNode.ProductTypeName;
                            if (opt.ProductTypeName == "Air")
                            {
                                opt.ProductType = "A";
                            }
                            else
                            {
                                opt.ProductType = optNode.ProductType;
                            }
                            Int32 overNts = 0;
                            if (optNode.Overnight != null)
                            {
                                overNts = optNode.Overnight;
                            }
                            //Int32.TryParse(optNode.Overnight, out overNts);
                            opt.Overnight = overNts;
                            opt.ProductFreeField1 = optNode.ProductFreeField1;
                            opt.ProductNotes = optNode.ProductNotes;
                            opt.Ranking = Convert.ToInt32(optNode.Ranking);

                            //---- Car dropoff List ----
                            //XmlNodeList dropCityNodes = optNode.SelectNodes("CarDropOff/DOCity");
                            List<DropCity> dropCities = new List<DropCity>();
                            if (optNode.CarDropOff != null)
                            {
                                foreach (var dcNode in optNode.CarDropOff.DOCity)
                                {
                                    DropCity dropC = new DropCity();
                                    dropC.DOPlaceID = Int64.Parse(dcNode.DOPlaceID.ToString());
                                    dropC.DOPlaceName = dcNode.DOPlaceName;
                                    dropC.DOPlaceNo = dcNode.DOPlaceNo;
                                    dropCities.Add(dropC);
                                }
                                opt.CarDropOff = dropCities;
                            }

                            options.Add(opt);
                        }
                    }

                    options = options.OrderBy(x => x.Ranking).ToList();
                    ct.Options = options;
                    calendarViewModel.citiesTransportOptions.Add(ct);
                }

                //---- Remove DropOffCities if previous city is in another country ----
                //---- And add city S or E in compCity if found ----
                for (Int32 i = 0; i <= calendarViewModel.citiesTransportOptions.Count - 1; i++)
                {
                    if (calendarViewModel.citiesTransportOptions[i].No == "S")
                    {
                        calendarViewModel.compCity.Insert(0, new ItinComponent() { City_Name = calendarViewModel.citiesTransportOptions[i].PlaceName, City_ID = Int32.Parse(calendarViewModel.citiesTransportOptions[i].PlaceID), CitySeq = calendarViewModel.citiesTransportOptions[i].No, ProductFF1 = "" });
                    }

                    if (calendarViewModel.citiesTransportOptions[i].No == "E")
                    {
                        calendarViewModel.compCity.Add(new ItinComponent() { City_Name = calendarViewModel.citiesTransportOptions[i].PlaceName, City_ID = Int32.Parse(calendarViewModel.citiesTransportOptions[i].PlaceID), CitySeq = calendarViewModel.citiesTransportOptions[i].No, ProductFF1 = "" });
                    }

                    if (calendarViewModel.citiesTransportOptions[i].Options.Count > 0)
                    {
                        for (Int32 j = 0; j <= calendarViewModel.citiesTransportOptions[i].Options.Count - 1; j++)
                        {
                            if (calendarViewModel.citiesTransportOptions[i].Options[j].CarDropOff != null)
                            {
                                for (Int32 k = 0; k <= calendarViewModel.citiesTransportOptions[i].Options[j].CarDropOff.Count - 1; k++)
                                {
                                    string placeId = calendarViewModel.citiesTransportOptions[i].Options[j].CarDropOff[k].DOPlaceID.ToString();
                                    string placeNo = calendarViewModel.citiesTransportOptions[i].Options[j].CarDropOff[k].DOPlaceNo;
                                    Int32 placeIndex = calendarViewModel.citiesTransportOptions.FindIndex(x => x.PlaceID == placeId && x.No == placeNo);
                                    CityTrasnsportOptions previousCity = new CityTrasnsportOptions();
                                    if (placeIndex > 0)
                                    {
                                        previousCity = calendarViewModel.citiesTransportOptions[placeIndex - 1];
                                    }
                                    if (previousCity.CountryId != calendarViewModel.citiesTransportOptions[i].CountryId)
                                    {
                                        calendarViewModel.citiesTransportOptions[i].Options[j].CarDropOff.RemoveAt(k);
                                    }
                                }
                            }
                        }
                    }
                }

            }
            catch (System.IO.IOException e)
            {
                return View("Error");
            }

            if (Utilities.CheckMobileDevice() == false)
            {
                return View("Get_PackageBYOitinerary", calendarViewModel);
            }
            else
            {
                return View("Get_Mob_ByoPackageItinerary", calendarViewModel);
            }


        }


    }
}