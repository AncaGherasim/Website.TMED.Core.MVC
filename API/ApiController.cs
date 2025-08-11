using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using MVC_TMED.Models;
using MVC_TMED.Models.ViewModels;
using MVC_TMED.Infrastructure;
using Microsoft.Extensions.Options;
using Dapper;
using System.Data;
using System.Data.SqlClient;
using System.Text.RegularExpressions;
using System.Text;
using System.Xml;
using HtmlAgilityPack;
using Amazon.Lambda;
using Amazon.Lambda.Model;
using System.IO;
using Newtonsoft.Json;
using Amazon;
using System.Net.Http.Headers;
using System.Net.Http;
using System.Threading.Tasks;
using System.Xml.Linq;
using System.Dynamic;
using Microsoft.Extensions.Logging;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace MVC_TMED.API
{
    [Route("Api")]
    [ApiController]
    public class PackagesController : ControllerBase
    {
        private readonly AppSettings _appSettings;
        private readonly DapperWrap _dapperWrap;
        private readonly CachedDataService _cachedDataService;
        private readonly ILogger<PackagesController> _logger;

        public PackagesController(IOptions<AppSettings> appSettings, DapperWrap dapperWrap, CachedDataService cachedDataService, ILogger<PackagesController> logger)
        {
            _appSettings = appSettings.Value;
            _dapperWrap = dapperWrap;
            _cachedDataService = cachedDataService;
            _logger = logger;
        }

        [HttpGet("Packages/PricesHistory/{id}")]
        public async Task<IEnumerable<PriceGuidance>> GetPriceHistory(string id)
        {
            int numId;
            if (!int.TryParse(id, out numId)) { return null; }
            var result = await _dapperWrap.GetRecords<PriceGuidance>(SqlCalls.SQL_PriceGuidance(id));

            return result.ToList();
        }

        [HttpGet("Hotel/ImagesByProdID/{id}")]
        public async Task<IEnumerable<HotelImages>> getImagesByProdID(string id)
        {
            var result = await _dapperWrap.GetRecords<HotelImages>(SqlCalls.SQL_HotelImages(id));

            return result.ToList();
        }

        [HttpGet("Packages/PicsForPacks/{id}")]
        public async Task<IEnumerable<PicsPackage>> GetPicsForPacks(string id)
        {
            int numId;
            if (!int.TryParse(id, out numId)) { return null; }
            var result = await _dapperWrap.GetRecords<PicsPackage>(SqlCalls.SQL_PicsForPack(id));

            return result.ToList();
        }

        [HttpGet("Packages/GetCustomerFeedbacks/{packId}")]
        public async Task<IEnumerable<CountryNoOfFeedbacks>> GetCustomerFeedbacks(string packId)
        {
            string listIds = "";
            int counter = 0;
            List<CountriesRelatedByItinId> listCountryFeedId = new List<CountriesRelatedByItinId>();
            var result = await _dapperWrap.GetRecords<CountriesRelatedByItinId>(SqlCalls.SQL_CountriesRelated_By_ItineraryID(packId));
            listCountryFeedId = result.ToList();
            foreach (var x in listCountryFeedId)
            {
                if (counter == 0)
                {
                    listIds += x.cxz_ChildPlaceId.ToString();
                }
                else
                {
                    listIds += "," + x.cxz_ChildPlaceId.ToString();

                }
                counter++;
            }
            List<CustomerFeedbacks> listFeed = new List<CustomerFeedbacks>();
            var result2 = await _dapperWrap.GetRecords<CustomerFeedbacks>(SqlCalls.SQL_CountriesRelated_By_ItineraryID(packId));
            listFeed = result2.ToList();
            List<CountryNoOfFeedbacks> countryFeeds = listFeed.GroupBy(x => new { x.Name, x.Id }, (key, g) => g.Select(x => new CountryNoOfFeedbacks() { Name = x.Name, Id = x.Id, NoOfFeeds = listFeed.Count() }).First()).ToList();

            return countryFeeds;
        }

        [HttpGet("Packages/getDataThisCMS/{cmsid}")]
        public async Task<IEnumerable<CMS_WebsiteContent>> SqlThisCMS(string cmsid)
        {
            var result = await _dapperWrap.GetRecords<CMS_WebsiteContent>("Select CMS_Content From CMS_WebsiteContent where CMSID = " + cmsid);

            return result.ToList();
        }

        [HttpGet("Packages/depCity")]
        public async Task<IEnumerable<DepCity>> DepCity()
        {
            await _cachedDataService.LoadDepCitiesIfNecessary();
            return _cachedDataService.depCitiesCache;
        }

        [HttpGet("Packages/priorCity")]
        public async Task<IEnumerable<PriorCity>> PriorCity()
        {
            await _cachedDataService.LoadPriorCitiesIfNecessary();
            return _cachedDataService.priorCitiesCache;
        }

        [HttpPost("Packages/webservTransportationOption")]
        public async Task<dynamic> webservGetTransportationOption([FromBody] string stringForm)
        {
            string wAir;
            string cabTY;
            string dateD;
            string depID;
            string depNA;
            string webSite;
            List<string> ctyNA = new List<string>();
            List<string> ctyID = new List<string>();
            string q = stringForm;
            string[] qParts = q.Split("&");
            foreach (var qPart in qParts)
            {
                string[] qPar = qPart.Split("=");
                if (Regex.IsMatch(qPar[0], "qWair", RegexOptions.IgnoreCase))
                {
                    wAir = qPar[1];
                }
                if (Regex.IsMatch(qPar[0], "qLeaveNA", RegexOptions.IgnoreCase))
                {
                    depNA = qPar[1];
                }
                if (Regex.IsMatch(qPar[0], "qLeaveID", RegexOptions.IgnoreCase))
                {
                    depID = qPar[1];
                }
                if (Regex.IsMatch(qPar[0], "xCabin", RegexOptions.IgnoreCase))
                {
                    cabTY = qPar[1];
                }
                if (Regex.IsMatch(qPar[0], "qArrDate", RegexOptions.IgnoreCase))
                {
                    dateD = qPar[1].Replace(".", "/");
                }
                if (Regex.IsMatch(qPar[0], "goingID", RegexOptions.IgnoreCase))
                {
                    webSite = qPar[1];
                }
                if (Regex.IsMatch(qPar[0], "qNACity", RegexOptions.IgnoreCase))
                {
                    ctyNA.Add(qPar[1]);
                }
                if (Regex.IsMatch(qPar[0], "qIDCity", RegexOptions.IgnoreCase))
                {
                    ctyID.Add(qPar[1]);
                }
            }
            //string SiteUserId = _appSettings.ApplicationSettings.userID;
            //StringBuilder strQCities = new StringBuilder();
            //strQCities.Append("<CALENDAR_TRANSPORTATIONOPTION_Q>");
            //strQCities.Append("<Version>2</Version>");
            //strQCities.Append("<UserID>243,595,182</UserID>");
            //strQCities.Append("<Cities>");
            //for (Int32 i = 0; i <= ctyNA.Count - 1; i++)
            //{
            //    if (ctyNA[i].IndexOf("(") > 0)
            //    {
            //        Int32 strEnd = ctyNA[i].IndexOf("(");
            //        ctyNA[i] = ctyNA[i].Substring(0, strEnd);
            //    }
            //    strQCities.Append("<City>");
            //    strQCities.Append("<No>" + (i + 1).ToString() + "</No>");
            //    strQCities.Append("<PlaceID>" + ctyID[i] + "</PlaceID>");
            //    strQCities.Append("<PlaceName>" + ctyNA[i].Trim() + "</PlaceName>");
            //    Int32 ii = i + 1;
            //    if (ii <= ctyNA.Count - 1)
            //    {
            //        strQCities.Append("<PlaceToID>" + ctyID[ii] + "</PlaceToID>");
            //    }
            //    else
            //    {
            //        strQCities.Append("<PlaceToID>-1</PlaceToID>");
            //    }
            //    strQCities.Append("</City>");
            //}
            //strQCities.Append("</Cities>");
            //strQCities.Append("</CALENDAR_TRANSPORTATIONOPTION_Q>");
            ////***************************
            ////SEND REQUEST TO WEB SERVICE 
            ////***************************
            //string webApi = "localhost";
            //string sQuery;
            //string sResult;
            //XmlDocument qCTYS = new XmlDocument();
            //qCTYS.LoadXml(strQCities.ToString());
            //strQCities = null;
            //sQuery = qCTYS.InnerXml;
            //qCTYS = null;
            //sResult = Utilities.SiteAPI_SendAndReceive(sQuery, "tournet", webApi);
            //XmlDocument doc = new XmlDocument();
            //doc.LoadXml(sResult);

            //string strJson = Newtonsoft.Json.JsonConvert.SerializeXmlNode(doc);
            //return strJson;

            TransportationOptionQ transportationOptionQ = new TransportationOptionQ();
            CalendarTransportationOptionQ calendarTransportationOptionQ = new CalendarTransportationOptionQ();
            calendarTransportationOptionQ.Cities = new List<CityTO>();
            calendarTransportationOptionQ.Version = 2;
            calendarTransportationOptionQ.UserID = "243,595,182";
            for (Int32 i = 0; i <= ctyNA.Count - 1; i++)
            {
                if (ctyNA[i].IndexOf("(") > 0)
                {
                    Int32 strEnd = ctyNA[i].IndexOf("(");
                    ctyNA[i] = ctyNA[i].Substring(0, strEnd);
                }
                CityTO cityTO = new CityTO();
                cityTO.No = (i + 1).ToString();
                cityTO.PlaceID = int.Parse(ctyID[i]);
                cityTO.PlaceName = ctyNA[i].Trim();
                Int32 ii = i + 1;
                if (ii <= ctyNA.Count - 1)
                {
                    cityTO.PlaceToID = int.Parse(ctyID[ii]);
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
            return result;
        }

        [HttpGet("Packages/getDataRelPacks/{packID}")]
        public async Task<string> sqlRelPackByPackID(string packID)
        {
            List<RelPackByPackID> dvRel;
            var result = await _dapperWrap.GetRecords<RelPackByPackID>(SqlCalls.SQL_RelPackByPackID(packID));
            dvRel = result.ToList();
            StringBuilder strRel = new StringBuilder();
            for (Int32 r = 0; r < dvRel.Count; r++)
            {
                if (r > 0)
                {
                    strRel.Append("@");
                }
                strRel.Append(dvRel[r].PlaceTitle + "|" + dvRel[r].NoOfPacks.ToString() + "|" + dvRel[r].str_placetypeid.ToString() + "|" + dvRel[r].PlaceId.ToString());
            }
            return strRel.ToString();

        }

        [HttpPost("Packages/webservComponentList")]
        public async Task<dynamic> webservGetComponentList([FromBody] ExpandoObject queryString)
        {
            var dataDictionary = queryString as IDictionary<string, object>;
            List<string> cityS = new List<string>();
            List<string> cityE = new List<string>();
            List<string> city1 = new List<string>();
            List<string> city2 = new List<string>();
            List<string> city3 = new List<string>();
            List<string> city4 = new List<string>();
            List<string> city5 = new List<string>();
            List<string> city6 = new List<string>();
            List<string> city7 = new List<string>();
            List<string> city8 = new List<string>();
            List<string> city9 = new List<string>();
            List<string> city10 = new List<string>();
            List<string> city11 = new List<string>();
            List<string> city12 = new List<string>();
            List<List<string>> citylist = new List<List<string>>();
            List<string> cities = new List<string>();
            //string[] Qparts = Q.Split("&");
            string sysID = "";
            string cty = "";
            string idLeavingFrom = "";
            string wAir = "False";
            if (dataDictionary.TryGetValue("xgoingID", out var qvalue))
            {
                sysID = $"{qvalue}";
            }
            if (dataDictionary.TryGetValue("xidLeavingFrom", out qvalue))
            {
                idLeavingFrom = $"{qvalue}";
            }
            if (dataDictionary.TryGetValue("xaddFlight", out qvalue))
            {
                wAir = $"{qvalue}";
            }

            foreach (var kvp in queryString)
            {
                try
                {
                    if (kvp.Key.Contains("CityS")) cityS.Add(kvp.Value?.ToString() ?? string.Empty);
                    if (kvp.Key.Contains("City1")) city1.Add(kvp.Value?.ToString() ?? string.Empty);
                    if (kvp.Key.Contains("City2")) city2.Add(kvp.Value?.ToString() ?? string.Empty);
                    if (kvp.Key.Contains("City3")) city3.Add(kvp.Value?.ToString() ?? string.Empty);
                    if (kvp.Key.Contains("City4")) city4.Add(kvp.Value?.ToString() ?? string.Empty);
                    if (kvp.Key.Contains("City5")) city5.Add(kvp.Value?.ToString() ?? string.Empty);
                    if (kvp.Key.Contains("City6")) city6.Add(kvp.Value?.ToString() ?? string.Empty);
                    if (kvp.Key.Contains("City7")) city7.Add(kvp.Value?.ToString() ?? string.Empty);
                    if (kvp.Key.Contains("City8")) city8.Add(kvp.Value?.ToString() ?? string.Empty);
                    if (kvp.Key.Contains("City9")) city9.Add(kvp.Value?.ToString() ?? string.Empty);
                    if (kvp.Key.Contains("City10")) city10.Add(kvp.Value?.ToString() ?? string.Empty);
                    if (kvp.Key.Contains("City11")) city11.Add(kvp.Value?.ToString() ?? string.Empty);
                    if (kvp.Key.Contains("City12")) city12.Add(kvp.Value?.ToString() ?? string.Empty);
                    if (kvp.Key.Contains("CityE")) cityE.Add(kvp.Value?.ToString() ?? string.Empty);
                }
                catch (Exception ex)
                {
                    throw new Exception("webservComponentList first try message: " + ex.Message + ", queryString: " + queryString);
                }
            }

            if (cityS.Count > 0) citylist.Add(cityS);
            if (city1.Count > 0) citylist.Add(city1);
            if (city2.Count > 0) citylist.Add(city2);
            if (city3.Count > 0) citylist.Add(city3);
            if (city4.Count > 0) citylist.Add(city4);
            if (city5.Count > 0) citylist.Add(city5);
            if (city6.Count > 0) citylist.Add(city6);
            if (city7.Count > 0) citylist.Add(city7);
            if (city8.Count > 0) citylist.Add(city8);
            if (city9.Count > 0) citylist.Add(city9);
            if (city10.Count > 0) citylist.Add(city10);
            if (city11.Count > 0) citylist.Add(city11);
            if (city12.Count > 0) citylist.Add(city12);
            if (cityE.Count > 0) citylist.Add(cityE);
            // ***************************************
            // BUILD XML TO COMPONENT LIST WEB SERVICE 
            // ***************************************
            Int32 isCarCount = 0;
            string xmlBPC_Q = "";
            string xmlBPC_Q2 = "";
            string qResult = "";
            Int32 totCities = citylist.Count - 1;
            string lastCity;
            try
            {
                lastCity = citylist[totCities][0].ToString();
            }
            catch (Exception ex)
            {
                throw new Exception("webservComponentList second try message: " + ex.Message + ", queryString: " + queryString);
            }
            BuildPackageComponentListQ jsonBPC_Q = new BuildPackageComponentListQ();
            CalendarBuildPackageComponentListQ calendarBuildPackageComponentQ = new CalendarBuildPackageComponentListQ();
            if (wAir == "True")
            {
                calendarBuildPackageComponentQ.DepCityID = int.Parse(idLeavingFrom);
            }

            // ***************************************
            // CITIES PARAMETERS
            // ***************************************
            calendarBuildPackageComponentQ.Cities = new List<CityPC>();
            xmlBPC_Q = xmlBPC_Q + "<Cities>";
            foreach (var ctys in citylist)
            {
                try
                {
                    CityPC city = new CityPC();
                    city.CityComponents = new List<CityComponent>();
                    city.No = ctys[0];
                    city.PlaceID = int.Parse(ctys[2]);
                    city.PlaceName = ctys[1];
                    city.NoOfNight = int.Parse(ctys[4]);
                    if (Int32.Parse(ctys[4]) > 0)
                    {
                        CityComponent component = new CityComponent();
                        component.ProductType = "H";
                        component.ProductFreeField1 = "";
                        component.ProductNotes = "";
                        component.ProductItemID = "";
                        component.Transportation = 0;
                        city.CityComponents.Add(component);
                    }
                    if (ctys.Count() - 1 > 5)
                    {
                        CityComponent component = new CityComponent();
                        if (ctys[5].ToString() != "")
                        {
                            string Nts = "";
                            string isCar = "";
                            string typeNA = "";
                            switch (ctys[5].ToString())
                            {
                                case "TIC":
                                    typeNA = "T";
                                    Nts = "Train";
                                    break;
                                case "TBA":
                                    typeNA = "C";
                                    Nts = "Car";
                                    break;
                                case "P2P":
                                    typeNA = "T";
                                    Nts = "Air";
                                    break;
                                case "OWN":
                                    typeNA = "W";
                                    Nts = "On your Own";
                                    break;
                                case "GI":
                                    typeNA = "G";
                                    Nts = "Ground";
                                    break;
                            }
                            switch (ctys[5].ToString())
                            {
                                case "TIC":
                                case "P2P":
                                case "GI":
                                case "OWN":
                                    component.ProductType = typeNA;
                                    component.ProductFreeField1 = ctys[5];
                                    component.ProductNotes = Nts;
                                    component.ProductItemID = "0";
                                    component.Transportation = 1;
                                    component.OverNight = int.Parse(ctys[7]);
                                    isCarCount = 0;
                                    isCar = "";
                                    break;
                                case "TBA":
                                    if (isCarCount >= 1 && String.Compare(isCar, ctys[0].ToString()) <= 0)
                                    {
                                        if (isCar == ctys[0].ToString())
                                        {
                                            isCarCount = 0;
                                        }
                                    }
                                    isCarCount += 1;
                                    if (isCarCount == 1)
                                    {
                                        component.ProductType = ctys[6];
                                        component.ProductFreeField1 = ctys[5];
                                        component.ProductNotes = Nts;
                                        component.ProductItemID = "0";
                                        component.Transportation = 1;
                                        component.OverNight = int.Parse(ctys[7]);
                                        component.CarPickUpCityNo = ctys[0];
                                        component.CarPickUpDay = ctys[9];
                                        component.CarDropOffCityNo = ctys[12];
                                        component.CarDropOffDay = ctys[11];
                                        isCar = ctys[11].ToString();
                                    }
                                    break;
                            }
                            city.CityComponents.Add(component);
                        }
                        else
                        {
                            component.ProductType = ctys[6];
                            component.ProductFreeField1 = "";
                            component.ProductNotes = "On your Own";
                            component.ProductItemID = "0";
                            component.Transportation = 1;
                            component.OverNight = int.Parse(ctys[7]);
                            isCarCount = 0;
                            city.CityComponents.Add(component);
                        }
                    }
                    calendarBuildPackageComponentQ.Cities.Add(city);
                }
                catch (Exception ex)
                {
                    throw new Exception("webservComponentList third try message: " + ex.Message + ", queryString: " + queryString);
                }
            }
            jsonBPC_Q.CalendarBuildPackageComponentListQ = calendarBuildPackageComponentQ;

            var result = new object();
            using (var httpClient = new HttpClient())
            {
                httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                var url = "https://2l6nhqi7od.execute-api.us-east-1.amazonaws.com/live/web/calendar";
                //var url = "https://efidyc44j7.execute-api.us-east-1.amazonaws.com/beta/calendar"; //DEV
                var data = new StringContent(JsonConvert.SerializeObject(jsonBPC_Q), Encoding.UTF8, "application/json");
                var responseMessage = await httpClient.PostAsync(url, data);
                result = await responseMessage.Content.ReadAsStringAsync();

            }
            XNode node = JsonConvert.DeserializeXNode(result.ToString(), "PackageComponentList");
            string systemID = "", ByStayNite = "", GetNextDay = "", AirVendorAPI = "", AirP2PVendorAPI = "", CarVendorAPI = "", SSVendorAPI = "", TransferVendorAPI = "", TICVendorAPI = "", BookURL = "", GIVendorAPI = "";

            switch (sysID)
            {
                case "TMLD":
                    systemID = _appSettings.ApplicationSettings.TMLD_SystemID;
                    ByStayNite = _appSettings.ApplicationSettings.TMLD_ByStayNite;
                    GetNextDay = _appSettings.ApplicationSettings.TMLD_GetNextDay;
                    AirVendorAPI = _appSettings.ApplicationSettings.TMLD_AirVendorAPI;
                    AirP2PVendorAPI = _appSettings.ApplicationSettings.TMLD_AirP2PVendorAPI;
                    CarVendorAPI = _appSettings.ApplicationSettings.TMLD_CarVendorAPI;
                    SSVendorAPI = _appSettings.ApplicationSettings.TMLD_SSVendorAPI;
                    TransferVendorAPI = _appSettings.ApplicationSettings.TMLD_TransferVendorAPI;
                    TICVendorAPI = _appSettings.ApplicationSettings.TMLD_TICVendorAPI;
                    BookURL = _appSettings.ApplicationSettings.TMLD_BookURL;
                    GIVendorAPI = _appSettings.ApplicationSettings.TMLD_GIVendorAPI;
                    break;
                case "TMED":
                    systemID = _appSettings.ApplicationSettings.TMED_SystemID;
                    ByStayNite = _appSettings.ApplicationSettings.TMED_ByStayNite;
                    GetNextDay = _appSettings.ApplicationSettings.TMED_GetNextDay;
                    AirVendorAPI = _appSettings.ApplicationSettings.TMED_AirVendorAPI;
                    AirP2PVendorAPI = _appSettings.ApplicationSettings.TMED_AirP2PVendorAPI;
                    CarVendorAPI = _appSettings.ApplicationSettings.TMED_CarVendorAPI;
                    SSVendorAPI = _appSettings.ApplicationSettings.TMED_SSVendorAPI;
                    TransferVendorAPI = _appSettings.ApplicationSettings.TMED_TransferVendorAPI;
                    TICVendorAPI = _appSettings.ApplicationSettings.TMED_TICVendorAPI;
                    BookURL = _appSettings.ApplicationSettings.TMED_BookURL;
                    GIVendorAPI = _appSettings.ApplicationSettings.TMED_GIVendorAPI;
                    break;
                case "TMAS":
                    systemID = _appSettings.ApplicationSettings.TMAS_SystemID;
                    ByStayNite = _appSettings.ApplicationSettings.TMAS_ByStayNite;
                    GetNextDay = _appSettings.ApplicationSettings.TMAS_GetNextDay;
                    AirVendorAPI = _appSettings.ApplicationSettings.TMAS_AirVendorAPI;
                    AirP2PVendorAPI = _appSettings.ApplicationSettings.TMAS_AirP2PVendorAPI;
                    CarVendorAPI = _appSettings.ApplicationSettings.TMAS_CarVendorAPI;
                    SSVendorAPI = _appSettings.ApplicationSettings.TMAS_SSVendorAPI;
                    TransferVendorAPI = _appSettings.ApplicationSettings.TMAS_TransferVendorAPI;
                    TICVendorAPI = _appSettings.ApplicationSettings.TMAS_TICVendorAPI;
                    BookURL = _appSettings.ApplicationSettings.TMAS_BookURL;
                    GIVendorAPI = _appSettings.ApplicationSettings.TMAS_GIVendorAPI;
                    break;
            }
            string contenido = "";
            string rResult = "";
            Int32 webServiceR = 0;
            try
            {
                contenido = Utilities.StringToGzipString(node.ToString());
                webServiceR = 1;
                rResult = contenido + "@|@" + webServiceR + "@|@" + systemID + "@|@" + ByStayNite + "@|@" + GetNextDay + "@|@" + AirVendorAPI + "@|@" + AirP2PVendorAPI + "@|@" + CarVendorAPI + "@|@" + SSVendorAPI + "@|@" + TransferVendorAPI + "@|@" + TICVendorAPI + "@|@" + lastCity + "@|@" + BookURL + "@|@" + GIVendorAPI;

            }
            catch (System.IO.IOException e)
            {
                rResult = Utilities.GZipStringToString(contenido);
                contenido = "Error";
                rResult = contenido + "@|@" + webServiceR + "@|@" + systemID + "@|@" + ByStayNite + "@|@" + GetNextDay + "@|@" + AirVendorAPI + "@|@" + AirP2PVendorAPI + "@|@" + CarVendorAPI + "@|@" + SSVendorAPI + "@|@" + TransferVendorAPI + "@|@" + TICVendorAPI + "@|@" + lastCity + "@|@" + BookURL + "@|@" + GIVendorAPI;
            }

            return Newtonsoft.Json.JsonConvert.SerializeObject(rResult);
        }

        [HttpPost("Hotels/HotelsOnPlace")]
        public async Task<IEnumerable<HotelsSummaryNew>> GetHotelsSummaryNews([FromBody] GetHotelsParams getHotelsParams)
        {
            string PlaceId = getHotelsParams.IDplc;
            var result = await _dapperWrap.GetRecords<HotelsSummaryNew>(SqlCalls.SQL_HotelListSummaryNew(PlaceId));

            return result.ToList();
        }

        [HttpPost("Hotels/AllHotelsByPlace/")]
        public async Task<IEnumerable<ListOfHotels>> GetListOfAllHotels([FromBody] PlaceObject plcID)
        {
            var result = await _dapperWrap.GetRecords<ListOfHotels>(SqlCalls.SQL_Hotels_From_Place(plcID.Id));

            return result.ToList();
        }

        [HttpPost("Hotels/GetHotelsFacilities/")]
        public async Task<IEnumerable<HotelsFacilities>> GetHotelsFacilities([FromBody] PlaceObject plcID)
        {
            var result = await _dapperWrap.GetRecords<HotelsFacilities>(SqlCalls.SQL_Hotels_Facilities(plcID.Id));
            return result.ToList();
         }

        [HttpPost("Hotels/GetHotelsByFacilityID/")]
        public async Task<IEnumerable<NameObject>> GetHotelsByFacilityID(string fid, string plcID, string TnGi)
        {
            var result = await _dapperWrap.GetRecords<NameObject>(SqlCalls.SQL_GetHotelsByFacilityID(fid, plcID, TnGi));
            return result.ToList();
         }

        [HttpGet("Vacations/EDDestinos")]
        public async Task<IEnumerable<CLS_PlaceValues>> sqlEDDestinos()
        {
            var result = await _dapperWrap.GetRecords<CLS_PlaceValues>(SqlCalls.SQL_EDDestinos());

            return result.ToList();
        }

        [HttpPost("HeaderRecentlyViewed")]
        public async Task<string> HeaderShowRecently([FromBody] PlaceObject userID)
        {
            if (String.IsNullOrEmpty(userID.Id))
            {
                return null;
            }
            string vProds = "";

            IEnumerable<LastVisits> visits = _dapperWrap.MySqlGetRecords<LastVisits>(SqlCalls.MySQL_RecentlyViewed(userID.Id));
            foreach (var v in visits)
            {
                vProds = vProds + "," + v.UTS_ProductItemID.ToString();
            }

            if (vProds != "")
            {
                List<VisitedPacks> lastVisitedPacks = new List<VisitedPacks>();
                var Result = await _dapperWrap.GetRecords<VisitedPacks>(SqlCalls.SQL_HeaderRecentlyViewed(vProds.Substring(1, vProds.Length - 1)));
                lastVisitedPacks = Result.ToList();
                List<recentlyVisitedPackage> recentlyViewed = visits.Join(lastVisitedPacks, b => b.UTS_ProductItemID, d => d.PDLID, (b, d) =>
                     new recentlyVisitedPackage
                     {
                         UTS_ProductItemID = b.UTS_ProductItemID,
                         UTS_URL = b.UTS_URL,
                         UTS_Date = b.UTS_Date,
                         UTS_Site = b.UTS_Site.ToUpper(),
                         PDLID = d.PDLID,
                         PDL_Title = d.PDL_Title,
                         IMG_Path_URL = d.IMG_Path_URL,                         
                         STR_PlaceTitle = d.STR_PlaceTitle ?? ""
                     }).ToList();

                return Newtonsoft.Json.JsonConvert.SerializeObject(recentlyViewed);
            }
            else
            {
                return null;
            }
        }

        [HttpPost("RecentlyViewed")]
        public async Task<string> ShowRecently([FromBody] PlaceObject userID)
        {
            if (String.IsNullOrEmpty(userID.Id))
            {
                return null;
            }
            string vProds = "";

            IEnumerable<LastVisits> visits = _dapperWrap.MySqlGetRecords<LastVisits>(SqlCalls.MySQL_RecentlyViewed(userID.Id));
            foreach (var v in visits)
            {
                vProds = vProds + "," + v.UTS_ProductItemID.ToString();
            }

            if (vProds != "")
            {
                List<VisitedPacks> lastVisitedPacks = new List<VisitedPacks>();
                var Result = await _dapperWrap.GetRecords<VisitedPacks>(SqlCalls.SQL_VisitedPackagesDescription(vProds.Substring(1, vProds.Length - 1)));
                lastVisitedPacks = Result.ToList();
                List<recentlyVisitedPackage> recentlyViewed = visits.Join(lastVisitedPacks, b => b.UTS_ProductItemID, d => d.PDLID, (b, d) =>
                     new recentlyVisitedPackage
                     {
                         UTS_ProductItemID = b.UTS_ProductItemID,
                         UTS_URL = b.UTS_URL,
                         UTS_Date = b.UTS_Date,
                         UTS_Site = b.UTS_Site.ToUpper(),
                         PDLID = d.PDLID,
                         PDL_Title = d.PDL_Title,
                         STP_Save = d.STP_Save,
                         IMG_Path_URL = d.IMG_Path_URL,
                         fromPlace = d.fromPlace,
                         PDL_Content = d.PDL_Content,
                         feedbacks = d.feedbacks,
                         STR_PlaceTitle = d.STR_PlaceTitle ?? ""
                     }).ToList();

                return Newtonsoft.Json.JsonConvert.SerializeObject(recentlyViewed);
            }
            else
            {
                return null;
            }
        }

        [HttpPost("VisitHistoryXunitraq")]
        public string getVisitHistoryXunitraq([FromBody] utVisitHistory utVisits)
        {
            //string vProds = "";
            if (string.IsNullOrEmpty(utVisits.utUserID))
            {
                return null;
            }
            IEnumerable<BaseObject> Ids = _dapperWrap.MySqlGetRecords<BaseObject>(SqlCalls.MySQL_Visitor_NoOfVisits(utVisits.utUserID));
            return Newtonsoft.Json.JsonConvert.SerializeObject(Ids);
        }


        //[HttpPost("sqlReviewFirst")]
        //public async Task<string> sqlReviewFirst()
        //{
        //    List<ReviewFirst> reviewList = new List<ReviewFirst>();
        //    var result = await _dapperWrap.GetRecords<ReviewFirst>(SqlCalls.SQL_ReviewFirst());
        //    reviewList = result.ToList();

        //    return Newtonsoft.Json.JsonConvert.SerializeObject(reviewList);
        //}

        //[HttpPost("sqlReviewPage")]
        //public async Task<string> sqlReviewPage([FromBody] string revID)
        //{
        //    List<ReviewPage> reviewList = new List<ReviewPage>();
        //    var result = await _dapperWrap.GetRecords<ReviewPage>(SqlCalls.SQL_ReviewPage(revID));
        //    reviewList = result.ToList();
            
        //    return Newtonsoft.Json.JsonConvert.SerializeObject(reviewList);
        //}

        [HttpPost("GetReviews")]
        public async Task<IEnumerable<CustomReviews>> Getreviews(string page, string score)
        {
            List<CustomReviews> reviews = new List<CustomReviews>();
            var result = await _dapperWrap.GetRecords<CustomReviews>(SqlCalls.SQL_GetReviews(page, score));
            return result.ToList();
        }

        [HttpPost("CountryPlaces")]
        public async Task<string> GetCountryPlaces([FromBody] string countryId)
        {
            List<CountryPlaces> countryList = new List<CountryPlaces>();
            var result = await _dapperWrap.GetRecords<CountryPlaces>(SqlCalls.SQL_CountryPlaces(countryId));
            countryList = result.ToList();
            
            return Newtonsoft.Json.JsonConvert.SerializeObject(countryList);
        }

        [HttpPost("Activities/GetSSToursByCity/")]
        public async Task<IEnumerable<GetTours>> getSSToursByCity([FromBody] PlaceObject city)
        {
            List<GetTours> ssTours = new List<GetTours>();
            var result = await _dapperWrap.GetRecords<GetTours>(SqlCalls.SQL_GetSSToursByCity(city.Id.ToString()));
            ssTours = result.ToList();

            return ssTours;
        }

        [HttpPost("Activities/GetPoiByPlaceId/")]
        public async Task<IEnumerable<PoiByPlace>> GetPoiByPlaceId([FromBody] PlaceObject placeId)
        {
            List<PoiByPlace> poiPlaces = new List<PoiByPlace>();
            var result = await _dapperWrap.GetRecords<PoiByPlace>(SqlCalls.SQL_POIByPlaceId(placeId.Id.ToString()));
            poiPlaces = result.ToList();

            return poiPlaces;
        }

        //Get All Packages for Country
        //All Packages Page

        [HttpPost("All_Packages/GetAllPackages/")]
        public async Task<IEnumerable<CountryPackages>> GetAllPackages([FromBody] PlaceObject placeId)
        {
            List<CountryPackages> listPacks = new List<CountryPackages>();
            var result = await _dapperWrap.GetRecords<CountryPackages>(SqlCalls.SQL_GetAllPacksCountrySimplified(placeId.Id));
            listPacks = result.ToList();
            listPacks = listPacks.Distinct(new FindPacksByPlaceID_IdComparer()).ToList();
            listPacks.Where(pk => pk.SPD_InternalComments.Contains("1901:"))
                .ToList()
                .ForEach(pk => pk.SPD_InternalComments = "Inflexible package");
            return listPacks;
        }

        //Get All Packages for Combine Page
        [HttpPost("Combine/GetAllCombinePackages")]
        public async Task<IEnumerable<CountryPackages>> GetAllCombinePackages([FromBody] PlaceObject placeId)
        {
            List<CountryPackages> listPacks = new List<CountryPackages>();
            string[] placesIds = placeId.Id.Split(",");
            var result = await _dapperWrap.GetRecords<CountryPackages>(SqlCalls.SQL_GetAllPacksCountry(placeId.Id));
            listPacks = result.ToList();
            foreach (var pk in listPacks)
            {
                if (pk.SPD_InternalComments.Contains("1155:"))
                {
                    pk.SPD_InternalComments = "Self_Drive";
                }
                else if (pk.SPD_InternalComments.Contains("1767:"))
                {
                    pk.SPD_InternalComments = "Charming-Properties";
                }
                else if (pk.SPD_InternalComments.Contains("1901:"))
                {
                    pk.SPD_InternalComments = "Inflexible package";
                }
                else if (pk.SPD_InternalComments.Contains("1784:."))
                {
                    pk.SPD_InternalComments = "Guided";
                }
                else if (pk.SPD_InternalComments.Contains("1785:."))
                {
                    pk.SPD_InternalComments = "Partially Guided";
                }
                else
                {
                    pk.SPD_InternalComments = "none";
                }

            }
            foreach (var p in placesIds)
            {
                listPacks = listPacks.Where(n => n.PDL_Places != null && n.PDL_Places.Contains(p.ToString() + ",")).ToList();
            }
            listPacks = listPacks.GroupBy(x => x.PDLID).Select(x => x.First()).ToList();

            return listPacks;
        }

        [HttpPost("Emailtous")]
        public string Emailtous([FromBody] string emailinfo)
        {
            string userDest = "";
            string userBKN = "";
            string userNA = "";
            string userEmail = "";
            string userTel = "";
            string userMsg = "";
            string q = emailinfo;
            string[] qParts = q.Split("&");
            foreach (var qPart in qParts)
            {
                string[] qPar = qPart.Split("=");
                if (Regex.IsMatch(qPar[0], "frmDest", RegexOptions.IgnoreCase))
                {
                    userDest = qPar[1];
                }
                if (Regex.IsMatch(qPar[0], "frmBKN", RegexOptions.IgnoreCase))
                {
                    userBKN = qPar[1];
                }
                if (Regex.IsMatch(qPar[0], "frmFullName", RegexOptions.IgnoreCase))
                {
                    userNA = qPar[1];
                }
                if (Regex.IsMatch(qPar[0], "frmEmail", RegexOptions.IgnoreCase))
                {
                    userEmail = qPar[1];
                }
                if (Regex.IsMatch(qPar[0], "frmPhone", RegexOptions.IgnoreCase))
                {
                    userTel = qPar[1];
                }
                if (Regex.IsMatch(qPar[0], "frmMsg", RegexOptions.IgnoreCase))
                {
                    userMsg = qPar[1];
                }
            }
            string emailED = "contact@tripmasters.com";
            string emailLdAs = "customerservice@tripmasters.com";
            string userTrip = "Asia, Latin America and South Pacific";
            string sendTo = "";
            sendTo = emailED;
            userTrip = "Europe";
            string emailSent = "";
            try
            {

                using (System.Net.Mail.MailMessage message = new System.Net.Mail.MailMessage(sendTo, sendTo))
                {
                    message.Subject = "ED - Contact Us";
                    if (userBKN != "")
                    {
                        message.Body = "Booking Number: " + userBKN + "<br/><br/>";
                    }
                    message.Body = message.Body + "Destination: " + userTrip + "<br/><br/>" +
                                            "Full Name: " + userNA + "<br/><br/>" +
                                            "Email: " + userEmail + "<br/><br/>" +
                                            "Phone: " + userTel + "<br/><br/>" +
                                            "Message:" + userMsg;
                    message.IsBodyHtml = true;

                    System.Net.Mail.SmtpClient smtp = new System.Net.Mail.SmtpClient();
                    smtp.Host = _appSettings.ApplicationSettings.mailSERVER;
                    if (_appSettings.ApplicationSettings.mailSSL == "true")
                    {
                        smtp.EnableSsl = true;
                    }
                    else
                    {
                        smtp.EnableSsl = false;
                    }
                    smtp.UseDefaultCredentials = true;
                    smtp.Credentials = new System.Net.NetworkCredential(_appSettings.ApplicationSettings.mailUSER, _appSettings.ApplicationSettings.mailPASS);
                    smtp.Port = Int32.Parse(_appSettings.ApplicationSettings.mailPORT);
                    smtp.Send(message);
                }
                emailSent = "True";
            }
            catch (System.IO.IOException e)
            {
                emailSent = "False: " + e.Message;
            }
            finally
            {
            }

            string strJson = Newtonsoft.Json.JsonConvert.SerializeObject(emailSent);
            return strJson;
        }

        [HttpPost("Hotels/POIHotels/")]
        public async Task<IEnumerable<POI>> GetPOIHotels([FromBody] PlaceObject plcId)
        {
            var result = await _dapperWrap.GetRecords<POI>(SqlCalls.SQL_POIByPlaceId(plcId.Id));

            return result.ToList();
        }

        [HttpPost("Hotels/AllHotelsByPlaceMap/")]
        public async Task<IEnumerable<ListOfHotelsMap>> GetListOfAllHotelsMap([FromBody] PlaceObject place)
        {
            var result = await _dapperWrap.GetRecords<ListOfHotelsMap>(SqlCalls.SQL_Hotels_From_Place_Map(place.Id));

            return result.ToList();
        }

        [HttpPost("CitySSData")]
        public async Task<string> GetCitySSData([FromBody] SSData sSData)
        {
            String[] filterParts = sSData.SSFilter.Split("|");
            filterParts[0] = filterParts[0].Replace("T", ",").Substring(0, filterParts[0].Length - 1);
            if (filterParts[2].Trim() == "" || filterParts[2] == "none")
            {
                filterParts[2] = "";
            }
            if (filterParts[3].Trim() == "")
            {
                filterParts[3] = "1";
            }
            sSData.Ids = sSData.Ids.Replace("I", ",");
            StringBuilder ssIds = new StringBuilder();
            if ((sSData.Ids ?? "") == "")
            {
                return Newtonsoft.Json.JsonConvert.SerializeObject(ssIds.Append("@0"));
            }

            List<BaseObject> dv = new List<BaseObject>();
            var result = await _dapperWrap.GetRecords<BaseObject>(SqlCalls.SQL_ActivitiesIds(sSData.Ids, filterParts[0], filterParts[1], filterParts[2], filterParts[3]));
            dv = result.ToList();

            Int32 j = 0;
            for (Int32 i = 0; i < dv.Count; i++)
            {
                ssIds.Append(dv[i].Id.ToString());
                if (j < 9)
                {
                    if (i < dv.Count - 1)
                    {
                        ssIds.Append(",");
                    }
                    j += 1;
                }
                else
                {
                    ssIds.Append("|");
                    j = 0;
                }
            }
            ssIds.Append("@" + dv.Count.ToString());

            return Newtonsoft.Json.JsonConvert.SerializeObject(ssIds.ToString());
        }

        [HttpPost("CityActivities")]
        public async Task<IEnumerable<Activity>> GET_SS([FromBody] SSData sSData)
        {
            String[] filterParts = sSData.SSFilter.Split("|");
            filterParts[0] = filterParts[0].Replace("T", ",").Substring(0, filterParts[0].Length - 1);
            if (filterParts[2].Trim() == "" || filterParts[2] == "none")
            {
                filterParts[2] = "";
            }
            if (filterParts[3].Trim() == "")
            {
                filterParts[3] = "1";
            }
            List<Activity> dv = new List<Activity>();
            var result = await _dapperWrap.GetRecords<Activity>(SqlCalls.SQL_Activities(sSData.Ids, filterParts[0], filterParts[1], filterParts[2], filterParts[3]));
            dv = result.ToList();
            
            return dv;
        }

        [HttpPost("CityTripsTakenFeeds")]
        public async Task<string> GetCityTripsTakenFeeds([FromBody] SSData sSData)
        {
            String[] filterParts = sSData.SSFilter.Split("|");
            if (filterParts[0] == "none")
            {
                filterParts[0] = "";
            }
            else
            {
                filterParts[0] = filterParts[0].Replace("C", ",").Substring(0, filterParts[0].Length - 1);
            }

            List<BaseObject> dv = new List<BaseObject>();
            var result = await _dapperWrap.GetRecords<BaseObject>(SqlCalls.SQL_CustomerFeedbacksIds_For_Country_Sorted(sSData.Ids, filterParts[1], filterParts[0]));
            dv = result.ToList();
            

            Int32 j = 0;
            StringBuilder feedsIds = new StringBuilder();
            for (Int32 i = 0; i < dv.Count; i++)
            {
                feedsIds.Append(dv[i].Id.ToString());
                if (j < 9)
                {
                    if (i < dv.Count - 1)
                    {
                        feedsIds.Append(",");
                    }
                    j += 1;
                }
                else
                {
                    feedsIds.Append("|");
                    j = 0;
                }
            }
            feedsIds.Append("@" + dv.Count.ToString());

            return Newtonsoft.Json.JsonConvert.SerializeObject(feedsIds.ToString());
        }

        [HttpPost("PacksFindItinPage")]
        public async Task<string> GetPacksFindItinPage([FromBody] FindItinPage findItinPage)
        {
            string placeID = findItinPage.placeID;
            string packsIds = findItinPage.packsIds;
            string OrderVal = findItinPage.OrderVal;

            List<PackFindItinPage> dt = new List<PackFindItinPage>();
            var result = await _dapperWrap.GetRecords<PackFindItinPage>(SqlCalls.sqlGetPacksFindItinPage(placeID, packsIds, OrderVal));
            dt = result.ToList();
            

            StringBuilder strIdeas = new StringBuilder();
            string tmpDescr = "";

            dt = dt.Distinct(new PackFindItinPageComparer()).ToList();

            foreach (var dr in dt)
            {
                strIdeas.Append(dr.PDLID + "|");
                strIdeas.Append(dr.PDL_Title + "|");

                tmpDescr = dr.SPD_Description.Replace("</br>", "");
                tmpDescr = tmpDescr.Replace("</b>", "");
                tmpDescr = tmpDescr.Replace("<b>", "");
                tmpDescr = tmpDescr.Replace("\r\n", "</br>");
                strIdeas.Append(tmpDescr + "|");

                strIdeas.Append(dr.STP_NumOfNights.ToString() + "|");
                strIdeas.Append(dr.STP_Save.ToString() + "|");

                string[] a = dr.PDL_Content.Split("\r\n");
                string strContent = "";
                for (Int32 i = 0; i <= a.Length - 1; i++)
                {
                    strContent = strContent + "&bull;&nbsp;" + a[i].Replace("|", ";") + "</br>";
                }
                strIdeas.Append(strContent + "|");

                string intComents = dr.SPD_InternalComments;
                if (intComents.Contains("1155:"))
                {
                    strIdeas.Append("Self-Drive|");
                }
                else
                {
                    if (intComents.Contains("1767:"))
                    {
                        strIdeas.Append("Charming-Properties|");
                    }
                    else
                    {
                        if (intComents.Contains("1901:"))
                        {
                            strIdeas.Append("Inflexible package|");
                        }
                        else
                        {
                            strIdeas.Append("none|");
                        }
                    }
                }

                if (dr.NoOfFeed != 0)
                {
                    strIdeas.Append(dr.NoOfFeed.ToString() + "|");
                }
                else
                {
                    strIdeas.Append("0|");
                }

                string gui = intComents;
                if (gui.Contains("1784:."))
                {
                    gui = "Guided";
                }
                else
                {
                    if (gui.Contains("1785:."))
                    {
                        gui = "Partially Guided";
                    }
                    else
                    {
                        gui = "none";
                    }
                }

                if ((dr.STP_StartTravelDate ?? "") != "")
                {
                    strIdeas.Append(dr.STP_StartTravelDate.ToString() + "|");
                }
                else
                {
                    strIdeas.Append("" + "|");
                }
                strIdeas.Append(dr.PLC_Title + "|");
                strIdeas.Append(dr.STP_MiniTitle + "|");
                strIdeas.Append(dr.WebTemplate.ToString().Trim() + "|");
                strIdeas.Append(dr.IMG_Path_URL.Trim() + "|");
                strIdeas.Append(gui + "|");
                strIdeas.Append(dr.CountryName.Trim() + "@");
            }

            return Newtonsoft.Json.JsonConvert.SerializeObject(strIdeas.ToString());
        }
        //Get all packs for Find Itinerary Page
        //Mobile page use only
        [HttpPost("FindItinPacks")]
        public async Task<IEnumerable<CountryPackages>> FindItinPacks([FromBody] PlaceObject placeId)
        {
            List<CountryPackages> listPacks = new List<CountryPackages>();
            string[] arrCityIDs = placeId.Id.Split(",");
            StringBuilder sqlFilter = new StringBuilder();
            sqlFilter.Append(" AND ( ");
            for (Int32 i = 0; i < arrCityIDs.Length; i++)
            {
                sqlFilter.Append(" charindex('," + arrCityIDs[i] + ",', ',' + replace(PDL_Places,' ','') )<>0");
                if (arrCityIDs.Length > 1 && i < arrCityIDs.Length - 1)
                {
                    sqlFilter.Append(" AND ");
                }
            }
            sqlFilter.Append(" )");

            var result = await _dapperWrap.GetRecords<CountryPackages>(SqlCalls.SQL_GetAllPacksCountry(placeId.Id, sqlFilter.ToString()));
            listPacks = result.ToList();
            listPacks = listPacks.Distinct(new FindPacksByPlaceID_IdComparer()).ToList();
            return listPacks;
        }

        //Get Country and City by PDL_Places
        //All Packages Page
        [HttpPost("All_Packages/GetAllPlaces")]
        public async Task<IEnumerable<AllPacksPlaces>> GetAllPlaces([FromBody] PlaceObject placeIds)
        {
            var result = await _dapperWrap.GetRecords<AllPacksPlaces>(SqlCalls.SQL_GetPlacesFromSTR(placeIds.Id));

            return result.ToList();
        }

        //Get all customer feedbacks ids for trips taken by travelrs
        //Mobile
        //Added by Andrei
        [HttpPost("GetIdsTripsTakenFeeds")]
        public async Task<string> GetIdsTripsTakenFeeds([FromBody] PlaceObject countryId)
        {
            List<BaseObject> listIds = new List<BaseObject>();
            var result = await _dapperWrap.GetRecords<BaseObject>(SqlCalls.SQL_TripsTakenCustomerFeedbacksIds(countryId.Id));
            listIds = result.ToList();
            
            StringBuilder strIds = new StringBuilder();
            int j = 0;
            for (var i = 0; i <= listIds.Count - 1; i++)
            {
                strIds.Append(listIds[i].Id.ToString());
                if (j < 9)
                {
                    if (i < listIds.Count - 1) { strIds.Append(","); }
                    j = j + 1;
                }
                else
                {
                    strIds.Append("|");
                    j = 0;
                }
            }
            strIds.Append("@" + listIds.Count.ToString());
            return Newtonsoft.Json.JsonConvert.SerializeObject(strIds.ToString());
        }

        //Get Trips taken customer feedbacks
        //Mobile 
        //Added by Andrei
        [HttpPost("GetTripsTakenFeeds")]
        public async Task<IEnumerable<TripsTakenCustomerFeedback>> GetTripsTakenFeeds([FromBody] PlaceObject ids)
        {
            List<TripsTakenCustomerFeedback> lst = new List<TripsTakenCustomerFeedback>();
            var result = await _dapperWrap.GetRecords<TripsTakenCustomerFeedback>(SqlCalls.SQL_TripsTakenCustomerFeedbacksMob(ids.Id));
            lst = result.ToList();

            return lst;
        }

        [HttpPost("EDDestinos")]
        public async Task<IEnumerable<CLS_PlaceValues>> GetEDDestinos([FromBody] SSData sSData)
        {
            List<ExploreDest> dv = new List<ExploreDest>();
            var result = await _dapperWrap.GetRecords<ExploreDest>(SqlCalls.SQL_AllDestinos());
            dv = result.ToList();
            

            Int32 checkID = 0;
            List<CLS_PlaceValues> s = new List<CLS_PlaceValues>();
            List<string> arrCountry = new List<string>();
            string[] plcP;
            if (sSData.SSFilter == "COU")
            {
                if (dv.Count > 0)
                {
                    for (Int32 sp = 0; sp <= dv.Count - 1; sp++)
                    {
                        if (checkID != dv[sp].CouID)
                        {
                            checkID = dv[sp].CouID;
                            arrCountry.Add(dv[sp].CouNA + "|" + dv[sp].CouID);
                        }
                    }
                }
                for (Int32 pls = 0; pls <= arrCountry.Count - 1; pls++)
                {
                    plcP = arrCountry[pls].Split("|");
                    s.Add(new CLS_PlaceValues() { plcNA = plcP[0], plcID = Int32.Parse(plcP[1]) });
                }

            }

            return s;
        }

        [HttpGet("FooterDestinations")]
        public async Task<string> GetFooterDestinations()
        {
            await _cachedDataService.LoadDestinationsIfNecessary();
            return _cachedDataService.destinationsCache;
        }

        [HttpGet("DestinationCities")]
        public async Task<string> GetDestinationCities()
        {
            var Result = await _dapperWrap.GetRecords<ExploreDest>(SqlCalls.SQL_AllDestinos(true));
            List<ExploreDest> destinationCities = Result.ToList();
            StringBuilder strRel = new StringBuilder();
            for (Int32 r = 0; r < destinationCities.Count; r++)
            {
                if (r > 0)
                {
                    strRel.Append("@");
                }
                strRel.Append(destinationCities[r].CouID.ToString() + "|" + destinationCities[r].CouNA + "|" + destinationCities[r].CtyID.ToString() + "|" + destinationCities[r].CtyNA + "|" + destinationCities[r].Ranking.ToString());
            }
            return strRel.ToString();
        }
        [HttpGet("Packages/SamplePrices/{itinID}")]
        public async Task<IEnumerable<CLS_SamplePriceValues>> SamplePrices(Int64 itinID)
        {
            List<PackPrices> packP = new List<PackPrices>();
            string _packP = @"SELECT TOP 30 PLC_Title,AGR.REA_TotalPrice,AGR.REA_AirTax,AGR.REA_Nights,AGR.REAID,AGR.REA_StartDate,AGR.REA_Itinerary
                FROM RBT_EDAggregate AGR
                INNER JOIN PRD_Place ON PRD_Place.PLCID = AGR.REA_StartPlaceID
                WHERE(AGR.REAID = " + itinID +
                @") ORDER BY AGR.REA_TotalPrice";

            var result = await _dapperWrap.GetRecords<PackPrices>(_packP);
            
            List<CLS_SamplePriceValues> s = new List<CLS_SamplePriceValues>();
            if (packP.Count() > 0)
            {
                foreach (var c in packP)
                {
                    s.Add(new CLS_SamplePriceValues()
                    {
                        samAIP = c.PLC_Title,
                        samDTE = c.REA_StartDate,
                        samID = c.REAID,
                        samTAX = c.REA_AirTax,
                        samITIN = c.REA_Itinerary,
                        samNTS = c.REA_Nights,
                        samPRC = c.REA_TotalPrice
                    });
                }
            }
            return s;
        }

        [HttpPost("amzCloud_Suggestions")]
        public async Task<IEnumerable<string>> Get_AWS_Suggestions([FromBody] PlaceObject q)
        {
            List<string> suggs = new List<string>();
            Int32 hasCityOrCountryElements = 0;
            try
            {
                string awsURL1 = "http://search-tripmasters-ddvbbeyrdp2xmv66q4il4ihzbm.us-east-1.cloudsearch.amazonaws.com/2013-01-01/suggest?q=" + q.Id + "&format=xml&suggester=tmsuggester";
                string awsURL2 = "http://search-tripmasters-ddvbbeyrdp2xmv66q4il4ihzbm.us-east-1.cloudsearch.amazonaws.com/2013-01-01/suggest?q=" + q.Id + "&format=xml&suggester=tmsugg_city&size=2";
                string awsURL3 = "http://search-tripmasters-ddvbbeyrdp2xmv66q4il4ihzbm.us-east-1.cloudsearch.amazonaws.com/2013-01-01/suggest?q=" + q.Id + "&format=xml&suggester=tmsugg_country&size=1";
                List<System.Net.WebRequest> rqsts = new List<System.Net.WebRequest>();
                rqsts.Add(System.Net.WebRequest.Create(awsURL1));
                rqsts.Add(System.Net.WebRequest.Create(awsURL2));
                rqsts.Add(System.Net.WebRequest.Create(awsURL3));
                Int32 index = 0;
                foreach (var x in rqsts)
                {
                    System.Net.WebResponse resp = await x.GetResponseAsync();
                    System.IO.Stream respStream = resp.GetResponseStream();
                    System.Xml.XmlDocument xmlToDoc = new XmlDocument();
                    System.Xml.XmlNodeList xmlSuggests;
                    List<string> suggsP = new List<string>();
                    string addedText = "";
                    xmlToDoc.Load(respStream);
                    xmlSuggests = xmlToDoc.SelectNodes("//item");
                    foreach (System.Xml.XmlNode n in xmlSuggests)
                    {
                        string suggestion = n.SelectSingleNode("./@suggestion").Value;

                        switch (index)
                        {
                            case 0:
                                string packId = n.SelectSingleNode("./@id").Value;
                                addedText = "##P##" + packId;
                                break;
                            case 1:
                                addedText = "##inCt";
                                break;
                            case 2:
                                addedText = "##inCo";
                                break;
                        }
                        suggsP.Add(suggestion + addedText);
                    }
                    if (suggsP.Count > 0)
                    {
                        if (index > 0)
                        {
                            suggsP.ForEach(y => suggs.Insert(0, y));
                        }
                        else
                        {
                            string packsIds = string.Join(",", suggsP.Select(y => y.Substring(y.LastIndexOf("##pk") + 4)));
                            List<PackageCountry> pkgs = new List<PackageCountry>();
                            var result = await _dapperWrap.GetRecords<PackageCountry>(SqlCalls.SQL_PackageCountry(packsIds));
                            pkgs = result.ToList();
                            for (Int32 i = 0; i <= suggsP.Count - 1; i++)
                            {
                                string id = suggsP[i].Substring(suggsP[i].IndexOf("##pk") + 4).Trim();
                                string suggText = suggsP[i].Substring(0, suggsP[i].IndexOf("##")).Trim().Replace(" ", "_").Replace("&", "and");
                                List<PackageCountry> pkg = pkgs.Where(p => p.Id.ToString() == id).ToList();
                                if (pkg.Count > 0)
                                {
                                    suggsP[i] = suggsP[i] + "##www.tripmasters.com/" + pkg[0].Region + "/" + pkg[0].coun.Replace(" ", "_") + "/" + suggText + "/package-" + id;
                                }
                            }
                            suggs.AddRange(suggsP);
                        }
                    }
                    index++;
                }
                if (suggs.Count > 0 && hasCityOrCountryElements > 0)
                {
                    string f = suggs.FirstOrDefault(x => x.Contains("##inC"));
                    string hh = f ?? "";
                    if (hh != "")
                    {
                        suggs.Insert(suggs.IndexOf(f), "-##Sp");
                    }
                }
            }
            catch (System.IO.IOException ex)
            {
                suggs.Insert(0, "Error: " + ex.Message);
                _logger.LogError($"****** Site: TMED | Error-amzCloud_Suggestions IOException message: " + ex.Message + ", q.Id: " + q.Id);
            }
            catch (System.Exception ex)
            {
                _logger.LogError($"****** Site: TMED | Error-amzCloud_Suggestions Exception message: " + ex.Message + ", q.Id: " + q.Id);
                throw;   
            }
            return suggs;
        }

        [HttpGet("Packages/ItineraryContentFromPriceId/{PriceId}")]
        public async Task<IEnumerable<NameObject>> getItineraryContentFromPriceId(string PriceId)
        {
            var result = await _dapperWrap.GetRecords<NameObject>(SqlCalls.SQL_GetItineraryFromPriceId(PriceId));

            return result.ToList();
        }

        [HttpGet("GetPackCustFeeds")]
        public async Task<IEnumerable<CustomerFeedback>> GetPackCustFeeds(int packId, int page)
        {
            var result = await _dapperWrap.GetRecords<CustomerFeedback>(SqlCalls.SQL_PackCustomerrFeeds(packId, page));

            return result.ToList();
        }

        [HttpGet("Combine/GetPacksIds")]
        public async Task<string> GetPacksIds(string placeId)
        {
            List<CombineCountryIds> listIds = new List<CombineCountryIds>();
            var result = await _dapperWrap.GetRecords<CombineCountryIds>(SqlCalls.sqlGetCombineByCouID_IdsOnly(placeId));
            listIds = result.ToList();
            
            StringBuilder strIds = new StringBuilder();
            int j = 0;
            for (var i = 0; i <= listIds.Count - 1; i++)
            {
                strIds.Append(listIds[i].PDLID.ToString());
                if (i < listIds.Count - 1) { strIds.Append(","); }
            }
            strIds.Append("@" + listIds.Count.ToString());
            return Newtonsoft.Json.JsonConvert.SerializeObject(strIds.ToString());
        }

        [HttpPost("CheckBooking")]
        public async Task<IEnumerable<BookingTest>> GetCheckBooking([FromBody] CheckBookingParams checkBookingParams)
        {
            var result = await _dapperWrap.GetRecords<BookingTest>(SqlCalls.SQL_BookingTest(Int64.Parse(checkBookingParams.bookingId), checkBookingParams.email));

            return result.ToList();
        }

        //[HttpPost("sqlBookingDeptID")]
        //public async Task<string> GetsqlBookingDeptID([FromBody] CheckBookingParams bookID)
        //{
        //    StringBuilder dID = new StringBuilder();
        //    List<NameObject> dvD = new List<NameObject>();
        //    var result = await _dapperWrap.GetRecords<NameObject>(SqlCalls.SQL_DeptIdByBookId(bookID.bookingId));
        //    dvD = result.ToList();
            
        //    if (dvD.Count > 0)
        //    {
        //        for (Int32 dp = 0; dp <= dvD.Count - 1; dp++)
        //        {
        //            dID.Append(dvD[dp].Name);
        //        }
        //    }
        //    return dID.ToString();
        //}

        [HttpPost("RecommHotels/{plcID}")]
        public async Task<IEnumerable<RecommHotels>> GetRecommHotels(string plcID)
        {
            int numId;
            if (!int.TryParse(plcID, out numId)) { return null; }
            var result = await _dapperWrap.GetRecords<RecommHotels>(SqlCalls.SQL_RecommHotels(plcID));

            return result.ToList();
        }

        [HttpPost("RecommSS/{plcID}")]
        public async Task<IEnumerable<RecommSS>> GetRecommSS(string plcID)
        {
            int numId;
            if (!int.TryParse(plcID, out numId)) { return null; }
            var result = await _dapperWrap.GetRecords<RecommSS>(SqlCalls.SQL_RecommSS(plcID));

            return result.ToList();
        }
        public async Task<List<FaqQR>> SqlFaqCms(int? cmsId)
        {
            var listFaq = new List<FaqQR>();
            Regex rgxNum = new Regex(@"\d+");
            var cmsString = "";
            var rgxExp = @"class=""aCMStxtLink""";

            List<CMS_WebsiteContent> cmsContent = new List<CMS_WebsiteContent>();
            var result = await _dapperWrap.GetRecords<CMS_WebsiteContent>("Select CMS_Content From CMS_WebsiteContent where CMSID = " + cmsId);
            cmsContent = result.ToList();
            try
            {
                cmsString = Regex.Replace(cmsContent[0].CMS_Content, rgxExp, "", RegexOptions.IgnoreCase);
                var htmlDoc = new HtmlDocument();
                htmlDoc.LoadHtml(cmsString);
                HtmlNode docRoot = htmlDoc.DocumentNode;
                HtmlNodeCollection aNodesColl = docRoot.SelectNodes("//a");
                if (aNodesColl != null)
                {
                    foreach (HtmlNode lnk in aNodesColl)
                    {
                        var hrefVal = lnk.GetAttributeValue("href", "");
                        var hrefTxt = lnk.InnerHtml;
                        Match rgxMtch = rgxNum.Match(hrefVal);
                        if (rgxMtch.Success)
                        {
                            cmsString = cmsString.Replace(hrefVal, "/" + hrefTxt + "/" + rgxMtch.Value.ToString() + "/cms.aspx");
                            hrefVal = "/" + hrefTxt + "/" + rgxMtch.Value.ToString() + "/cms.aspx";
                        }
                        if (!Regex.IsMatch(hrefVal, "www.tripmasters.com", RegexOptions.IgnoreCase))
                        {
                            cmsString = cmsString.Replace(hrefVal, "https://www.tripmasters.com" + hrefVal);
                            hrefVal = "https://www.tripmasters.com" + hrefVal;
                        }
                        if (lnk.Attributes["target"] == null)
                        {
                            var target = @"target=""_blank""";
                            cmsString = cmsString.Replace(@"href=""" + hrefVal + "", target + @" href=""" + hrefVal + "");
                        }
                    }
                }
                htmlDoc = null;
                var doc = new HtmlDocument();
                doc.LoadHtml(cmsString);
                var ps = doc.DocumentNode.Descendants("p");
                string que = "";
                string ans = "";
                int cmsC = 0;
                if (ps != null)
                {
                    foreach (var cms in ps)
                    {
                        if (cms.Attributes["class"] == null)
                        {
                            listFaq.Clear();
                            listFaq.Add(new FaqQR() { FaqQuestion = "none", FaqResponse = "none" });
                            break;
                        }
                        if (cms.GetAttributeValue("class", "") == "spCMSContentTitle")
                        {
                            que = cms.InnerHtml;
                            cmsC = cmsC + 1;
                        }
                        if (cms.GetAttributeValue("class", "") == "spCMSContentText")
                        {
                            ans = cms.InnerHtml;
                            cmsC = cmsC + 1;
                        }
                        if (cmsC > 0 && cmsC % 2 == 0)
                        {
                            listFaq.Add(new FaqQR() { FaqQuestion = que, FaqResponse = ans });
                            cmsC = 0;
                        }
                    }
                }
                doc = null;
            }
            catch (System.IO.IOException ex)
            {
                cmsString = ex.Message;
            }


            return listFaq;
        }

        [HttpPost("getDataExpediaReviewHotel")]
        public string AWSExpediaReviewHotel([FromBody] BaseObject pdlId)
        {
            List<AwsCredentials> aws = new List<AwsCredentials>();
            var responseMessage = String.Empty;
            string rResult = String.Empty;
            var sqlGetAWSCredentials = _appSettings.AWSConnection.AwsCredentialsQuery;
            var t0 = _dapperWrap.GetRecords<AwsCredentials>(sqlGetAWSCredentials);
            aws = t0.Result.ToList();

            using (AmazonLambdaClient client = new AmazonLambdaClient(aws.First().AWSK_AccessKey, aws.First().AWSK_SecretKey, RegionEndpoint.USEast1))
            {
                string payload = @"{""pdlid"": """ + pdlId.Id + @""", ""register"": ""Tournet"", ""callingmodule"": ""WEB"", ""outputType"": ""json""}";
                //Amazon.Lambda.Model.InvokeRequest ir = new Amazon.Lambda.Model.InvokeRequest();
                InvokeRequest ir = new InvokeRequest
                {
                    FunctionName = @"arn:aws:lambda:" + _appSettings.AWSConnection.AwsRegionId + @":function:TM_UNI_ExpediaReviewsV2",
                    InvocationType = InvocationType.RequestResponse,
                    Payload = payload
                };

                try
                {
                    InvokeResponse response = client.InvokeAsync(ir).Result;
                    if (String.IsNullOrEmpty(response.FunctionError))
                    {
                        using (response.Payload)
                        {
                            var sr = new StreamReader(response.Payload);
                            JsonReader reader = new JsonTextReader(sr);

                            var serilizer = new JsonSerializer();
                            var op = serilizer.Deserialize(reader);
                            responseMessage = JsonConvert.SerializeObject(op);
                        }
                    }
                    else
                    {
                        rResult = "Error" + response.FunctionError;
                        throw new Exception(response.FunctionError + " TM_UNI_ExpediaReviewsV2 throwed exception");
                    }
                }
                catch (Exception ex)
                {
                    rResult = "Catched error from TM_UNI_ExpediaReviewsV2 = " + ex.Message;
                    responseMessage = rResult;
                }
            }
            return responseMessage;
        }

        [HttpPost("PackInfoXID/{id}")]

        public async Task<string> PackInfoXID(string id)

        {

            List<PackPackages> dt = new List<PackPackages>();
            var result = await _dapperWrap.GetRecords<PackPackages>(SqlCalls.sqlPackInfoXID(id));
            dt = result.ToList();
            

            StringBuilder strIdeas = new StringBuilder();
            string tmpDescr = "";

            dt = dt.Distinct(new PackPackagesComparer()).ToList();

            foreach (var dr in dt)
            {
                strIdeas.Append(dr.PDLID + "|");
                strIdeas.Append(dr.PDL_Title + "|");

                tmpDescr = dr.SPD_Description.Replace("</br>", "");
                tmpDescr = tmpDescr.Replace("</b>", "");
                tmpDescr = tmpDescr.Replace("<b>", "");
                tmpDescr = tmpDescr.Replace("\r\n", "</br>");
                strIdeas.Append(tmpDescr + "|");

                strIdeas.Append(dr.STP_NumOfNights.ToString() + "|");
                strIdeas.Append(dr.STP_Save.ToString() + "|");
                strIdeas.Append(dr.STP_Save.ToString() + "|");
                strIdeas.Append(dr.STP_NumOfNights.ToString() + "|");
                strIdeas.Append(dr.IMG_Path_URL.ToString() + "|");
                strIdeas.Append(dr.NoOfFeed.ToString() + "|");
                string[] a = dr.PDL_Content.Split("\r\n");
                string strContent = "";
                for (Int32 i = 0; i <= a.Length - 1; i++)
                {
                    strContent = strContent + "&bull;&nbsp;" + a[i].Replace("|", ";") + "</br>";
                }
                strIdeas.Append(strContent + "|");

                string intComents = dr.SPD_InternalComments;
                if (intComents.Contains("1155:"))
                {
                    strIdeas.Append("Self-Drive|");
                }
                else
                {
                    if (intComents.Contains("1767:"))
                    {
                        strIdeas.Append("Charming-Properties|");
                    }
                    else
                    {
                        if (intComents.Contains("1901:"))
                        {
                            strIdeas.Append("Inflexible package|");
                        }
                        else
                        {
                            strIdeas.Append("none|");
                        }
                    }
                }

                if (dr.NoOfFeed != 0)
                {
                    strIdeas.Append(dr.NoOfFeed.ToString() + "|");
                }
                else
                {
                    strIdeas.Append("0|");
                }

                string gui = intComents;
                if (gui.Contains("1784:."))
                {
                    gui = "Guided";
                }
                else
                {
                    if (gui.Contains("1785:."))
                    {
                        gui = "Partially Guided";
                    }
                    else
                    {
                        gui = "none";
                    }
                }

                if ((dr.STP_StartTravelDate ?? "") != "")
                {
                    strIdeas.Append(dr.STP_StartTravelDate.ToString() + "|");
                }
                else
                {
                    strIdeas.Append("" + "|");
                }

            }

            return Newtonsoft.Json.JsonConvert.SerializeObject(strIdeas.ToString());
        }

        [HttpPost("MarketingSubscriber")]
        public async Task<string> GetMrktEmail([FromBody] MrkSubscription mrkSubscriptionParams)
        {
            string mrkResult = String.Empty;
            var lambdaResult = new MarketingSubscriptionResponse();
            try
            {
                //The proc value is for defining that procedure to use: 1 = Add, 2 = Update, 3 = Get
                List<AwsCredentials> aws = new List<AwsCredentials>();
                var mrkMessage = String.Empty;
                var sqlGetAWSCredentials = _appSettings.AWSConnection.AwsCredentialsQuery;
                var result = await _dapperWrap.GetRecords<AwsCredentials>(sqlGetAWSCredentials);
                aws = result.ToList();

                using (AmazonLambdaClient client = new AmazonLambdaClient(aws.First().AWSK_AccessKey, aws.First().AWSK_SecretKey, RegionEndpoint.USEast1))
                {
                    string payload = @"{""email"": """ + mrkSubscriptionParams.email + @""", ""ED"": """ + mrkSubscriptionParams.ED + @""", ""TM"": """ + mrkSubscriptionParams.TM + @""", ""proc"": """ + mrkSubscriptionParams.proc + @""", ""options"": """ + mrkSubscriptionParams.options + @"""}";
                    InvokeRequest ir = new InvokeRequest
                    {
                        FunctionName = @"arn:aws:lambda:" + _appSettings.AWSConnection.AwsRegionId + @":function:TM_WS_MktEmailSubscriptionV2",
                        InvocationType = InvocationType.RequestResponse,
                        Payload = payload
                    };

                    try
                    {
                        InvokeResponse response = client.InvokeAsync(ir).Result;
                        if (String.IsNullOrEmpty(response.FunctionError))
                        {
                            using (response.Payload)
                            {
                                var sr = new StreamReader(response.Payload);
                                JsonReader reader = new JsonTextReader(sr);
                                var serilizer = new JsonSerializer();
                                lambdaResult = serilizer.Deserialize<MarketingSubscriptionResponse>(reader);
                            }
                        }
                        else
                        {
                            mrkMessage = "Error" + response.FunctionError;
                            throw new Exception(response.FunctionError + " TM_WS_MktEmailSubscription");
                        }
                    }
                    catch (Exception ex)
                    {
                        mrkMessage = ex.Message;
                        _logger.LogError($"****** Site: TMED | Error-MarketingSubscriber catched error : " + ex.Message);
                        return mrkMessage;
                    }
                }

                //mrkResult = mrkMessage;
                if (lambdaResult.statusCode == 200)
                {
                    return Newtonsoft.Json.JsonConvert.SerializeObject(lambdaResult);
                }
                else
                {
                    throw new Exception("MarketingSubscriber return 500: ");
                }
            }
            catch (Exception ex)
            {
                mrkResult = ex.Message;
                _logger.LogError($"****** Site: TMED | Error-MarketingSubscriber catched error : " + ex.Message);
                return mrkResult;
            }
        }

        [HttpPost("MostPop")]
        public async Task<string> GetMostPop()
        {
            List<MostPop> dv = new List<MostPop>();
            string Iids = _appSettings.ApplicationSettings.defaultMostPop;
            var Result = await _dapperWrap.GetRecords<MostPop>(SqlCalls.SQL_GetCustomerCommentsByuserID(Iids, true));
            dv = Result.ToList();
            return Newtonsoft.Json.JsonConvert.SerializeObject(dv);
        }

        [HttpPost("NoOfSEOItinByPlaceID")]
        public async Task<Int32> GetNoOfSEOItinByPlaceID([FromBody] BaseObject PlaceItem)
        {
            Int32 noToursItin = 0;
            var result = await _dapperWrap.GetRecords<TotalPacks>(SqlCalls.SQL_NoOfToursItinByPlaceID(PlaceItem.Id.ToString()));
            noToursItin = result.ToList().FirstOrDefault().NoOfPacks;
            return noToursItin;
        }

        [HttpPost("TopSellersPackFeedback")]
        public async Task<string> GetTopSellersPackFeedback([FromBody] string placeID)
        {
            //List<TopSellersPackFeedback> listReviews = new List<TopSellersPackFeedback>();
            List<TopSellerPackages> listPackages = new List<TopSellerPackages>();
            //var result = await _dapperWrap.GetRecords<TopSellersPackFeedback>(SqlCalls.SQL_SEOFeedCommentsByPlaceID(placeID));
            //listReviews = result.ToList();
            var resultPg = await _dapperWrap.pgSQLGetRecordsAsync<TopSellerPackages>(PostgresCalls.PG_MV_TopSellingPackages(Int32.Parse(placeID)));
            listPackages = resultPg.ToList();
            return Newtonsoft.Json.JsonConvert.SerializeObject(listPackages.Where(x => x.NoOfFeeds > 0));
        }

        [HttpPost("PackageSamplePrice")]
        public async Task<string> GetPackageSamplePrice([FromBody] string packID)
        {
            int numId;
            if (!int.TryParse(packID, out numId)) { return null; }
            List<PackPrices> listPackPrices = new List<PackPrices>();
            var result = await _dapperWrap.GetRecords<PackPrices>(SqlCalls.SQL_PackageSamplePrices_ED(packID));
            listPackPrices = result.ToList();
            return Newtonsoft.Json.JsonConvert.SerializeObject(listPackPrices.OrderBy(p => p.PLC_Title).GroupBy(r => r.PLC_Title).ToList());
        }

        [HttpGet("Packages/PackageRelatedPlacesInfo_WithCMSs/{id}")]
        public async Task<IEnumerable<PackageRelatedPlacesInfo_WithCMSs>> GetPackageRelatedPlacesInfo_WithCMSs(string id)
        {
            int numId;
            if (!int.TryParse(id, out numId)) { return null; }
            var result = await _dapperWrap.GetRecords<PackageRelatedPlacesInfo_WithCMSs>(SqlCalls.SQL_PackageRelatedPlacesInfo_WithCMSs(id));
            return result.ToList();
        }

        [HttpGet("Packages/PackageCMSs/{id}")]
        public async Task<IEnumerable<PackageRelatedPlacesInfo_WithCMSs>> GetPackageCMSs(string id)
        {
            int numId;
            if (!int.TryParse(id, out numId)) { return null; }
            var result = await _dapperWrap.GetRecords<PackageRelatedPlacesInfo_WithCMSs>(SqlCalls.SQL_PackageCMSs(id));
            return result.ToList();
        }

        [HttpGet("Packages/PackageHotels/{id}")]
        public async Task<IEnumerable<PackageRelatedPlacesInfo_WithCMSs>> GetPackageHotels(string id)
        {
            int numId;
            if (!int.TryParse(id, out numId)) { return null; }
            var result = await _dapperWrap.GetRecords<PackageRelatedPlacesInfo_WithCMSs>(SqlCalls.SQL_PackageHotels(id));
            return result.ToList();
        }

        [HttpGet("Packages/PackageActivities/{id}")]
        public async Task<IEnumerable<PackageRelatedPlacesInfo_WithCMSs>> GetPackageActivities(string id)
        {
            int numId;
            if (!int.TryParse(id, out numId)) { return null; }
            var result = await _dapperWrap.GetRecords<PackageRelatedPlacesInfo_WithCMSs>(SqlCalls.SQL_PackageActivities(id));
            return result.ToList();
        }

        [HttpGet("Packages/PackageFeedbacks/{id}")]
        public async Task<IEnumerable<PackageRelatedPlacesInfo_WithCMSs>> GetPackageFeedbacks(string id)
        {
            int numId;
            if (!int.TryParse(id, out numId)) { return null; }
            var result = await _dapperWrap.GetRecords<PackageRelatedPlacesInfo_WithCMSs>(SqlCalls.SQL_PackageFeedbacks(id));
            return result.ToList();
        }

        [HttpGet("GetNoOfPacksFeaturedItin/{placeId}")]
        public async Task<IEnumerable<TotalPacks>> GetNoOfPacksFeaturedItinByPlaceId(int placeId)
        {
            var getNoPacks = await _dapperWrap.pgSQLGetRecordsAsync<TotalPacks>(PostgresCalls.PG_MV_NoOfPacksFeaturedItinByPlaceId(_appSettings.ApplicationSettings.intCom, placeId));
            return getNoPacks;
        }

        [HttpGet("Hotels/HotelPlacePackagesIdeas")]
        public async Task<string> GetHotelPlacePackagesIdeas([FromQuery] BaseObject oId)
        {
            var parameters = new DynamicParameters();
            string pgsql = "SELECT pdlid As PDLID, pdl_title As PDL_Title, pdl_content As PDL_Content, pdl_places As PDL_Places, duration As PDL_Duration" +
                ", stp_save As STP_Save, stp_starttraveldate, spd_description As SPD_Description, spd_internalcomments, img_path_url As IMG_Path_URL, countryname As CountryName " +
                "FROM dbo.web_tm_mv_packagesbyplaceid WHERE str_userid = 243 AND CXZ_ChildPlaceID = @strID " +
                "ORDER BY CASE WHEN STP_Save = 9999 THEN 1 ELSE 0 END, NoOfFeed DESC, STP_Save ASC, Duration ASC, PDL_Title ASC " +
                "LIMIT 4";
            parameters.Add("@strID", oId.Id);
            var result = await _dapperWrap.pgSQLGetRecordsAsync<PlacePackagesIdea>(pgsql, 4, parameters);
            List<PlacePackagesIdea> dvPackOnCty = result.ToList();
            return Newtonsoft.Json.JsonConvert.SerializeObject(dvPackOnCty);
        }

        [HttpPost("HotelInfoDetails")]
        public async Task<string> GetHotelInfoDetails([FromBody] string HotelID)
        {
            int numId;
            if (!int.TryParse(HotelID, out numId)) { return null; }
            var result = await _dapperWrap.GetRecords<HotelInfoDetails>(SqlCalls.SQL_HotelInfoDetails(), new { hotelID = HotelID });
            List<HotelInfoDetails> dvPackOnCty = result.ToList();
            return Newtonsoft.Json.JsonConvert.SerializeObject(dvPackOnCty);
        }

        [HttpPost("HomeTownAirport")]
        public async Task<string> GeHomeTownAirport()
        {
            var awaitedHomeTown = await Utilities.HomeTownAirport();
            return Newtonsoft.Json.JsonConvert.SerializeObject(awaitedHomeTown.ToString());
        }

        [HttpGet("WebAnnouncement")]
        public async Task<string> GetWebAnnouncement()
        {
            //string response = string.Empty;
            //List<WebAnnouncement> webAnnouncements = new List<WebAnnouncement>();
            //var result = await _dapperWrap.GetRecords<WebAnnouncement>(SqlCalls.SQL_WebAnnounce());
            //webAnnouncements = result.ToList();
            //if (webAnnouncements.Count > 0)
            //{
            //    response = webAnnouncements.First().WEBA_Msg;
            //}

            //return response;

            await _cachedDataService.LoadWebAnnouncementIfNecessary();
            return _cachedDataService.webAnnouncementsCache;
        }

        [HttpGet("Packages/Top1FeedbackByPackId/{packID}")]
        public async Task<Feedbacks> GetPackageTop1FeedbackByPackId(int packID)
        {
            await _cachedDataService.LoadFeedbacksIfNecessary();
            Feedbacks result = _cachedDataService.feedbacksCache.Where(f => f.PCC_PDLID == packID && f.pcc_overallscore >= 4 && !f.PCC_Comment.StartsWith("---"))
                .OrderByDescending(f => f.dep_date).FirstOrDefault();
            return result;
        }

        [HttpGet("Top3FeedbackByCounId/{counID}")]
        public async Task<IEnumerable<dynamic>> GetTop3FeedbackByCounId(int counID)
        {
            await _cachedDataService.LoadFeedbacksIfNecessary();
            int totalRows = _cachedDataService.feedbacksCache.Count(f => f.CountryID == counID);
            var filteredFeedbacks = _cachedDataService.feedbacksCache.Where(f => f.CountryID == counID && f.pcc_overallscore >= 4 && !f.PCC_Comment.StartsWith("---"))
                .OrderByDescending(f => f.dep_date);
            var topResults = filteredFeedbacks
                .Take(3)
                .Select(f => new
                {
                    f.PCC_Comment,
                    f.pcc_overallscore,
                    f.dep_date,
                    Total_Rows = totalRows
                });
            return topResults;
        }

        [HttpPost("errorcalendarlogs")]
        public IActionResult LogErrorCalendar([FromBody] CalendarError logErrorRequest)
        {
            if (logErrorRequest == null)
            {
                _logger.LogError($"****** Site: TMED | Error-BYO-Calendar logErrorRequest object is null");
            }
            else
            {
                _logger.LogError($"****** Site: TMED | Error-BYO-Calendar message: {logErrorRequest.Message}");
                _logger.LogError($"****** Site: TMED | Error-BYO-Calendar cities: {logErrorRequest.Cities}");
            }
            return Ok();
        }

        [HttpGet("FindAllPackages")]
        public async Task<IActionResult> GetFindAllPackages([FromQuery] FindCusPackInfo findCusPackInfo)
        {
            Response.Headers["Cache-Control"] = "no-cache, no-store, must-revalidate";
            Response.Headers["Pragma"] = "no-cache";
            Response.Headers["Expires"] = "0";

            string OrderVal = findCusPackInfo.OrderVal;
            Int32 PageNo = findCusPackInfo.PageNo;
            var sqlBuilder = new StringBuilder();
            var parameters = new DynamicParameters();
            if (findCusPackInfo.plcID.IndexOf(",") >= 0)
            {
                string[] aplaceID = findCusPackInfo.plcID.Split(',');
                List<int> iplcids = new List<int>();
                foreach (string part in aplaceID)
                {
                    Int32.TryParse(part, out Int32 nPlaceId);
                    iplcids.Add(nPlaceId);
                }
                sqlBuilder.Append(@"WITH filtered_packages AS (
                      SELECT pdlid, pdl_title, pdl_content, pdl_places, nooffeed, duration, stp_save, stp_starttraveldate, spd_description
                        , spd_internalcomments, img_path_url, countryname
                      FROM dbo.web_tm_mv_packagesbyplaceid
                      WHERE str_userid = @UserId AND CXZ_ChildPlaceID = ANY(@PlaceId)
                      GROUP BY pdlid, pdl_title, pdl_content, pdl_places, nooffeed, duration, stp_save, stp_starttraveldate, spd_description, spd_internalcomments,
                        img_path_url, countryname
                      HAVING COUNT(DISTINCT CXZ_ChildPlaceID) = @CountriesNo
                    )
                    SELECT*, COUNT(pdlid) OVER() AS TotalCount
                                  FROM filtered_packages where 1 = 1");
                parameters.Add("@PlaceId", iplcids);
                parameters.Add("@UserId", 243);
                parameters.Add("@CountriesNo", iplcids.Count);
            }
            else
            {
                Int32.TryParse(findCusPackInfo.plcID, out Int32 nPlaceId);
                sqlBuilder.Append("SELECT *, " +
                    "COUNT(*) OVER() AS TotalCount " +
                    "FROM dbo.web_tm_mv_packagesbyplaceid where str_userid = @UserId AND CXZ_ChildPlaceID = @PlaceId");
                parameters.Add("@PlaceId", nPlaceId);
                parameters.Add("@UserId", 243);
            }

            string[] filterParts = findCusPackInfo.filter.Split("I");

            // Add Price Filter
            if (!string.IsNullOrWhiteSpace(filterParts[0]))
            {
                var priceConditions = new List<string>();
                string[] tmpParts = filterParts[0].Split("P");
                for (int i = 0; i < tmpParts.Length - 1; i++)
                {
                    string[] tmpInterval = tmpParts[i].Split("_");
                    if (tmpInterval[1] != "MAX")
                    {
                        if (tmpParts[i] == "0_999")
                        {
                            priceConditions.Add("(STP_Save = 9999 OR STP_Save <= 999)");
                        }
                        else
                        {
                            priceConditions.Add("(STP_Save BETWEEN @PriceMin" + i + " AND @PriceMax" + i + ")");
                            Decimal.TryParse(tmpInterval[0], out Decimal price_min);
                            Decimal.TryParse(tmpInterval[1], out Decimal price_max);
                            parameters.Add("@PriceMin" + i, price_min);
                            parameters.Add("@PriceMax" + i, price_max);
                        }
                    }
                    else
                    {
                        priceConditions.Add("(STP_Save >= @PriceMin" + i + ")");
                        Decimal.TryParse(tmpInterval[0], out Decimal price_min);
                        parameters.Add("@PriceMin" + i, price_min);
                    }
                }
                sqlBuilder.Append(" AND (" + string.Join(" OR ", priceConditions) + ")");
            }

            // Add Duration Filter
            if (!string.IsNullOrWhiteSpace(filterParts[1]))
            {
                var durationConditions = new List<string>();
                string[] tmpParts = filterParts[1].Split("L");
                for (int i = 0; i < tmpParts.Length - 1; i++)
                {
                    string[] tmpInterval = tmpParts[i].Split("_");
                    if (tmpInterval[1] != "MAX")
                    {
                        durationConditions.Add("(Duration BETWEEN @DurationMin" + i + " AND @DurationMax" + i + ")");
                        Int32.TryParse(tmpInterval[0], out Int32 duration_i);
                        Int32.TryParse(tmpInterval[1], out Int32 duration_f);
                        parameters.Add("@DurationMin" + i, duration_i);
                        parameters.Add("@DurationMax" + i, duration_f);
                    }
                    else
                    {
                        Int32.TryParse(tmpInterval[0], out Int32 duration_i);
                        durationConditions.Add("(Duration >= @DurationMin" + i + ")");
                        parameters.Add("@DurationMin" + i, duration_i);
                    }
                }
                sqlBuilder.Append(" AND (" + string.Join(" OR ", durationConditions) + ")");
            }

            // Add Places Filter
            if (!string.IsNullOrWhiteSpace(filterParts[2]))
            {
                string[] tmpParts = filterParts[2].Split("C");
                var placeConditions = new List<string>();
                for (Int32 i = 0; i <= tmpParts.Length - 2; i++)
                {
                    placeConditions.Add(" strpos(',' || replace(PDL_Places, ' ', ''), ',' || @PlaceItem" + i + " || ',') <> 0");
                    parameters.Add("@PlaceItem" + i, tmpParts[i]);
                }
                sqlBuilder.Append(" AND (" + string.Join(" AND ", placeConditions) + ")");
            }

            // Add Sorting
            switch (OrderVal)
            {
                case "0":
                    sqlBuilder.Append(" ORDER BY CASE WHEN STP_Save = 9999 THEN 1 ELSE 0 END, NoOfFeed DESC, STP_Save ASC, Duration ASC, PDL_Title ASC");
                    break;
                case "1":
                    sqlBuilder.Append(" ORDER BY CASE WHEN STP_Save = 9999 THEN 1 ELSE 0 END, Duration ASC, NoOfFeed DESC, STP_Save ASC, PDL_Title ASC");
                    break;
                case "2":
                    sqlBuilder.Append(" ORDER BY STP_Save ASC, NoOfFeed DESC, Duration ASC, PDL_Title ASC");
                    break;
                case "3":
                    sqlBuilder.Append(" ORDER BY CASE WHEN STP_Save = 9999 THEN 1 ELSE 0 END, STP_Save DESC, NoOfFeed DESC, Duration ASC, PDL_Title ASC");
                    break;
                case "4":
                    sqlBuilder.Append(" ORDER BY CASE WHEN STP_Save = 9999 THEN 1 ELSE 0 END, PDL_Title ASC, NoOfFeed DESC, STP_Save ASC, Duration ASC");
                    break;
            }

            // **Pagination**
            int offsetv = (PageNo - 1) * 20;
            sqlBuilder.Append(" LIMIT @PageSize OFFSET @Offsetv ");
            parameters.Add("@PageSize", 20);
            parameters.Add("@Offsetv", offsetv);

            // Execute Query with Parameters
            var result = await _dapperWrap.pgSQLGetRecordsAsync<PacksByPlaceID_Filters_PG>(sqlBuilder.ToString(), 4, parameters);
            return Ok(new
            {
                Packages = result,
                TotalPackages = result.FirstOrDefault()?.totalcount ?? 0
            });
        }
        [HttpGet("getDiscountRecords/{code}")]
        public async Task<string> GetDiscountPromotion(string code)
        {
            List<DiscountPromotion> listDiscount = new List<DiscountPromotion>();
            var ResultDiscount = await _dapperWrap.GetRecords<DiscountPromotion>(SqlClass1.SQL_PromotionDiscount(code));
            listDiscount = ResultDiscount.ToList();
            return JsonConvert.SerializeObject(listDiscount.OrderByDescending(p => p.MKTD_DiscountValue).GroupBy(r => r.MKTD_DiscountValue).ToList());
        }

        [HttpGet("Hotels/HotelsOnPagePgs")]
        public async Task<IActionResult> GetHotelsOnPagePgs([FromQuery] GetHotelsPageParams getHotelsParams)
        {
            Response.Headers["Cache-Control"] = "no-cache, no-store, must-revalidate";
            Response.Headers["Pragma"] = "no-cache";
            Response.Headers["Expires"] = "0";

            var parameters = new DynamicParameters();

            getHotelsParams.HotelName ??= "";
            string orderByClause = "ORDER BY pdl_title ASC"; // default
            if (getHotelsParams.Sort == 2)
                orderByClause = "ORDER BY giph_tntournetrating DESC, pdl_title ASC";
            else if (getHotelsParams.Sort == 3)
                orderByClause = "ORDER BY ghs_finalscore DESC, pdl_title ASC";

            string sql = $@"
                WITH hotels_by_placeid AS (
                    SELECT * FROM dbo.web_tm_mv_hotelsbyplaceid
                    WHERE gitp_plcid = @PlaceId
                ),
                filtered_hotels AS (
                    SELECT *
                    FROM hotels_by_placeid
                    WHERE
                        (@IsRatings IS FALSE OR giph_tntournetrating = ANY(@RatingsList))
                        AND (@IsFavorite IS FALSE OR (giph_tnsequence BETWEEN 49 AND 60))
                        AND (@IsHotelName IS FALSE OR pdl_title ILIKE @HotelName)
                        AND (@IsCityZone IS FALSE OR giph_tnzoneid = @CityZone)
                        AND (
                            (@Is4_5Review IS FALSE AND @Is4Review IS FALSE AND @Is3_5Review IS FALSE AND @Is3Review IS FALSE AND @Is0Review IS FALSE)
                            OR (
                                FALSE
                                OR (@Is4_5Review AND ghs_finalscore >= 4.5)
                                OR (@Is4Review AND ghs_finalscore >= 4.0 AND ghs_finalscore <= 4.49)
                                OR (@Is3_5Review AND ghs_finalscore >= 3.5 AND ghs_finalscore < 4)
                                OR (@Is3Review AND ghs_finalscore >= 3.0 AND ghs_finalscore <= 3.49)
                                OR (@Is0Review AND ((ghs_finalscore >= 0 AND ghs_finalscore <= 2.99) OR ghs_finalscore IS NULL))
                            )
                        )
                    ),
                    paged_hotels AS (
                    SELECT *,
                        COUNT(*) OVER() AS TotalCount
                    FROM filtered_hotels
                    {orderByClause}
                    OFFSET ((@PageNo - 1) * 12)
                    LIMIT 12
                )
                SELECT *
                FROM paged_hotels;";

            parameters.Add("@PlaceId", getHotelsParams.PlaceId);
            parameters.Add("@IsRatings", getHotelsParams.isRatings);
            parameters.Add("@IsFavorite", getHotelsParams.isFavorite);
            parameters.Add("@IsHotelName", getHotelsParams.isHotelName);
            parameters.Add("@IsCityZone", getHotelsParams.isCityZone);
            parameters.Add("@RatingsList", getHotelsParams.RatingsList);
            parameters.Add("@HotelName", "%" + getHotelsParams.HotelName + "%");
            parameters.Add("@CityZone", getHotelsParams.CityZone);
            parameters.Add("@Is4_5Review", getHotelsParams.ReviewsList?.Contains("4_5") ?? false);
            parameters.Add("@Is4Review", getHotelsParams.ReviewsList?.Contains("4") ?? false);
            parameters.Add("@Is3_5Review", getHotelsParams.ReviewsList?.Contains("3_5") ?? false);
            parameters.Add("@Is3Review", getHotelsParams.ReviewsList?.Contains("3") ?? false);
            parameters.Add("@Is0Review", getHotelsParams.ReviewsList?.Contains("0") ?? false);
            parameters.Add("@PageNo", getHotelsParams.PageNo);

            var result = await _dapperWrap.pgSQLGetRecordsAsync<HotelsSummaryNew>(sql, 4, parameters);
            return Ok(result);
        }

        [HttpGet("Hotels/HotelsOnPlaceMap")]
        public async Task<IActionResult> GetHotelsOnPlaceMap([FromQuery] GetHotelsPageParams getHotelsParams)
        {
            Response.Headers["Cache-Control"] = "no-cache, no-store, must-revalidate";
            Response.Headers["Pragma"] = "no-cache";
            Response.Headers["Expires"] = "0";

            var parameters = new DynamicParameters();

            string sql = $@"
                WITH hotels_by_placeid AS (
                    SELECT * FROM dbo.web_tm_mv_hotelsbyplaceid
                    WHERE gitp_plcid = @PlaceId
                ),
                paged_hotels AS (
                    SELECT *,
                    COUNT(*) OVER() AS TotalCount
                    FROM hotels_by_placeid
                    )
                SELECT *
                FROM paged_hotels;";

            parameters.Add("@PlaceId", getHotelsParams.PlaceId);
            var result = await _dapperWrap.pgSQLGetRecordsAsync<HotelsSummaryNew>(sql, 4, parameters);
            return Ok(result);
        }

        [HttpGet("Hotels/HotelMapAddress")]
        public async Task<IActionResult> GetHotelMapAddress([FromQuery] GetHotelsPageParams getHotelsParams)
        {
            Response.Headers["Cache-Control"] = "no-cache, no-store, must-revalidate";
            Response.Headers["Pragma"] = "no-cache";
            Response.Headers["Expires"] = "0";

            var parameters = new DynamicParameters();

            string sql = $@"
                SELECT 
                    gh.giph_tncontentsource, 
                    gh.giph_tnusetournetcontent, 
                    gh.giph_addressline1, 
                    gh.giph_addressline2, 
                    gh.giph_addressline3, 
                    gh.giph_addressline4, 
                    gh.giph_addressline5, 
                    gh.giph_addressline6, 
                    pty.pty_address, 
                    gt.ghgt_text100, 
                    gt.ghgt_text101, 
                    gh.giph_tntournetcontent, 
                    gt.ghgt_text102
                FROM dbo.prd_productitem pri 
                    INNER JOIN dbo.prd_property pty ON pty.pty_productid = pri.pdl_productid AND pty.pty_active = true 
                    INNER JOIN dbo.prd_product pro ON pro.spdid = pri.pdl_productid AND pro.spd_active = true AND pro.spd_producttypesyscode = 3 
                    INNER JOIN dbo.prd_place plc ON pro.spd_stateplaceid = plc.plcid
                    INNER JOIN dbo.sys_codes syc ON syc.scdid = pro.spd_starratingsyscode AND syc.scd_active = true
                    INNER JOIN dbo.giata_giataxproductitem gpi ON gpi.glt_pdlid = pri.pdlid AND gpi.glt_active = true
                    INNER JOIN dbo.giata_hotels gh ON gpi.glt_giphid = gh.giphid AND gh.giph_active = true AND gh.giph_tnnoweb = false
                    LEFT JOIN dbo.giata_texts gt ON gt.ghgt_giataid::text = gh.giph_giataid AND gt.ghgt_active = true 
                WHERE pri.pdlid = @PlaceId
                    AND pri.pdl_active = true
                    AND pri.pdl_noweb = false";

            parameters.Add("@PlaceId", getHotelsParams.PlaceId);
            var result = await _dapperWrap.pgSQLGetRecordsAsync<HotelsMapAddress>(sql, 4, parameters);
            return Ok(result);
        }

        [HttpGet("Activities/ActivitiesOnPagePgs")]
        public async Task<IActionResult> GetActivitiesOnPagePgs([FromQuery] GetActivitiesPageParams getActivitiesParams)
        {
            Response.Headers["Cache-Control"] = "no-cache, no-store, must-revalidate";
            Response.Headers["Pragma"] = "no-cache";
            Response.Headers["Expires"] = "0";

            var parameters = new DynamicParameters();

            getActivitiesParams.ActivityName ??= "";
            string orderByClause = "ORDER BY name";
            if (getActivitiesParams.Sort > 1)
                orderByClause = "ORDER BY ssdurationinminutes";

            string[] aTypeList;
            if (string.IsNullOrEmpty(getActivitiesParams.TypeList))
            {
                aTypeList = Array.Empty<string>();
            }
            else
            {
                aTypeList = getActivitiesParams.TypeList.Split(',');
            }
            List<int> iTypeList = new List<int>();
            foreach (string part in aTypeList)
            {
                Int32.TryParse(part, out Int32 nTypeList);
                iTypeList.Add(nTypeList);
            }

            string sql = $@"
                WITH base_activities AS (
                  SELECT
                    pri.pdlid AS id,
                    pri.pdl_title AS name,
                    pri.pdl_sequenceno AS sequenceNo,
                    COALESCE(
                      NULLIF(stpr.stp_save::text, '')::money,
                      9999::money
                    )::numeric AS STP_Save,
                    syc.scd_codetitle AS SCD_CodeTitle,
                    pri.pdl_duration AS PDL_Duration,
                    syc1.scd_codetitle AS rawDurationUnit,
                    syc.scdid,
                    pro.spd_description AS SPD_Description,
                    pri.pdl_description AS PDL_Description,
                    CASE
                      WHEN syc1.SCDID = 1627 THEN pri.PDL_Duration
                      WHEN syc1.SCDID = 68   THEN pri.PDL_Duration * 60 * 24
                      WHEN syc1.SCDID = 10   THEN pri.PDL_Duration * 60
                    END AS ssdurationinminutes,
                    pro.spdid
                  FROM dbo.prd_placexproductitem pxp
                  JOIN dbo.prd_productitem pri ON pri.pdlid = pxp.cxz_productitem
                  JOIN dbo.prd_product pro ON pro.spdid = pri.pdl_productid
                  LEFT JOIN dbo.sys_codes syc ON syc.scdid = pro.spd_productkindsyscode
                  LEFT JOIN dbo.sys_codes syc1 ON syc1.scdid = pri.pdl_durationunitsyscode
                  LEFT JOIN dbo.str_sitepromotion stpr ON stpr.stp_proditemid = pri.pdlid
                    AND stpr.stp_userid = @UserId AND stpr.stp_active = TRUE
                    AND stpr.stp_startdate <= CURRENT_DATE AND stpr.stp_enddate >= CURRENT_DATE
                  WHERE
                    pxp.cxz_childplaceid = @PlaceId
                    AND pxp.cxz_active = TRUE
                    AND pri.pdl_active = TRUE
                    AND pri.pdl_noweb = FALSE
                    AND pro.spd_active = TRUE
                    AND pro.spd_producttypesyscode = 152
                    AND syc.scd_active = TRUE
                    AND (@IsFavorite IS FALSE OR (pdl_sequenceno BETWEEN 49 AND 60))
                    AND (@IsTypeList IS FALSE OR syc.scdid = ANY(@TypeList))
                    AND (@IsActivityName IS FALSE OR pdl_title ILIKE @ActivityName)
                ),
                paged_activities AS (
                  SELECT *,
                         COUNT(*) OVER() AS TotalCount
                    FROM base_activities
                    {orderByClause}
                    OFFSET ((@PageNo - 1) * @NoPageItems)
                    LIMIT @NoPageItems
                ),
                images AS (
                  SELECT DISTINCT ON (pxi.pxi_productid)
                    pxi.pxi_productid,
                    img.img_path_url
                  FROM dbo.prd_productximages pxi
                  JOIN dbo.app_images img
                    ON img.imgid = pxi.pxi_imageid
                   AND img.img_path_url IS NOT NULL
                   AND img.img_active = TRUE
                  WHERE pxi.pxi_productid IN (SELECT spdid FROM paged_activities)
                    AND pxi.pxi_sequence = 0
                    AND pxi.pxi_active = TRUE
                )
                SELECT
                  pa.*,
                  COALESCE(img.img_path_url, 'none') AS IMG_Path_URL
                FROM paged_activities pa
                LEFT JOIN images img ON img.pxi_productid = pa.spdid
                {orderByClause};";

            parameters.Add("@PlaceId", getActivitiesParams.PlaceId);
            parameters.Add("@IsFavorite", getActivitiesParams.isFavorite);
            parameters.Add("@IsActivityName", getActivitiesParams.isActivityName);
            parameters.Add("@TypeList", iTypeList);
            parameters.Add("@IsTypeList", getActivitiesParams.isTypeList);
            parameters.Add("@ActivityName", "%" + getActivitiesParams.ActivityName + "%");
            parameters.Add("@PageNo", getActivitiesParams.PageNo);
            parameters.Add("@UserId", 243);
            parameters.Add("@NoPageItems", (getActivitiesParams.IsMobileDevice ? 12 : 24));

            var result = await _dapperWrap.pgSQLGetRecordsAsync<Activity>(sql, 4, parameters);
            return Ok(result);
        }
    }
}

