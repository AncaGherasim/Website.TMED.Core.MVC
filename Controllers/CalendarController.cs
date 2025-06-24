using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using MVC_TMED.Models;
using MVC_TMED.Infrastructure;
using Microsoft.Extensions.Options;
using Dapper;
using System.Data;
using System.Data.SqlClient;
using System.Text.RegularExpressions;
using System.Text;
using System.Xml;
using MVC_TMED.Models.ViewModels;
using System.Threading.Tasks;
using Newtonsoft.Json;
using System.Net.Http.Headers;
using System.Net.Http;
using System.Xml.Linq;
// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace MVC_TMED.Controllers
{
    public class CalendarController : Controller
    {
        private readonly AppSettings _appSettings;
        private readonly AWSParameterStoreService _awsParameterStoreService;
        private readonly DapperWrap _dapperWrap;

        public CalendarController(IOptions<AppSettings> appsettings, AWSParameterStoreService awsParameterStoreService, DapperWrap dapperWrap)
        {
            _appSettings = appsettings.Value;
            _awsParameterStoreService = awsParameterStoreService;
            _dapperWrap = dapperWrap;
        }

        [HttpPost("/Calendar/T4BuildComponentList", Name = "CalendarList")]
        public async Task<IActionResult> W_GET_T4BuildComponentList([FromBody] string stringForm)
        {
            //latin/W_BuiltPackCompList.aspx
            CalendarCompListViewModel calendarCompListViewModel = new CalendarCompListViewModel();
            string webSite = "";
            string xnoCityS = "";
            string xsCityIDS = "";
            string xsCityNAS = "";
            string xsCityAPIS = "";
            string xselNoOfNtsS = "";
            string xrdselTransS = "";
            string xsOverNTSS = "";
            string xpickupdayS = "";
            string xpickupPlaceS = "";
            string xdropoffCityS = "";
            string xdropoffDayS = "";
            string xdropoffPlaceS = "";
            string xrdselTransFieldS = "";
            string cityE = "";
            string q = stringForm;
            List<string> traspCity = new List<string>();
            List<string> carPickUpDay = new List<string>();
            List<string> carPickUpPlace = new List<string>();
            List<string> carDropCityNo = new List<string>();
            List<string> carDropDay = new List<string>();
            List<string> carDropPlace = new List<string>();
            string[] qParts = q.Split("&");
            foreach (var qPart in qParts)
            {
                string[] qPar = qPart.Split("=");
                if (Regex.IsMatch(qPar[0], "xgoingID", RegexOptions.IgnoreCase))
                {
                    webSite = qPar[1];
                }
                if (Regex.IsMatch(qPar[0], "xutm_campaign", RegexOptions.IgnoreCase))
                {
                    calendarCompListViewModel.sCampaignCode = qPar[1];
                }
                if (Regex.IsMatch(qPar[0], "xnoCityS", RegexOptions.IgnoreCase))
                {
                    xnoCityS = qPar[1];
                }
                if (Regex.IsMatch(qPar[0], "xsCityIDS", RegexOptions.IgnoreCase))
                {
                    xsCityIDS = qPar[1];
                }
                if (Regex.IsMatch(qPar[0], "xsCityNAS", RegexOptions.IgnoreCase))
                {
                    xsCityNAS = qPar[1].Replace("+", " ");
                }
                if (Regex.IsMatch(qPar[0], "xsCityAPIS", RegexOptions.IgnoreCase))
                {
                    xsCityAPIS = qPar[1];
                }
                if (Regex.IsMatch(qPar[0], "xselNoOfNtsS", RegexOptions.IgnoreCase))
                {
                    xselNoOfNtsS = qPar[1];
                }
                if (Regex.IsMatch(qPar[0], "xrdselTransS", RegexOptions.IgnoreCase))
                {
                    xrdselTransS = qPar[1];
                }
                if (Regex.IsMatch(qPar[0], "xsOverNTSS", RegexOptions.IgnoreCase))
                {
                    xsOverNTSS = qPar[1];
                }
                if (Regex.IsMatch(qPar[0], "xpickupdayS", RegexOptions.IgnoreCase))
                {
                    xpickupdayS = qPar[1];
                }
                if (Regex.IsMatch(qPar[0], "xpickupPlaceS", RegexOptions.IgnoreCase))
                {
                    xpickupPlaceS = qPar[1];
                }
                if (Regex.IsMatch(qPar[0], "xdropoffCityS", RegexOptions.IgnoreCase))
                {
                    xdropoffCityS = qPar[1];
                }
                if (Regex.IsMatch(qPar[0], "xdropoffDayS", RegexOptions.IgnoreCase))
                {
                    xdropoffDayS = qPar[1];
                }
                if (Regex.IsMatch(qPar[0], "xdropoffPlaceS", RegexOptions.IgnoreCase))
                {
                    xdropoffPlaceS = qPar[1];
                }
                if (Regex.IsMatch(qPar[0], "xrdselTransFieldS", RegexOptions.IgnoreCase))
                {
                    xrdselTransFieldS = qPar[1];
                }
                if (Regex.IsMatch(qPar[0], "xnoCityE", RegexOptions.IgnoreCase))
                {
                    cityE = qPar[1];
                }
            }
            List<string> cityList = new List<string>();
            string eachCTYS = "";
            string eachCTYE = "";
            string eachCTY = "";
            if (xnoCityS != "")
            {
                eachCTYS = eachCTYS + xnoCityS + "$$$" + xsCityIDS + "$$$" + xsCityNAS + "$$$" + xsCityAPIS + "$$$" + xselNoOfNtsS + "$$$" + xrdselTransS +
                    "$$$" + xsOverNTSS + "$$$" + xpickupdayS + "$$$" + xpickupPlaceS + "$$$" + xdropoffCityS + "$$$" + xdropoffDayS + "$$$" +
                    xdropoffPlaceS + "$$$" + xrdselTransFieldS + "$$$";
                cityList.Add(eachCTYS);
            }
            for (Int32 i = 1; i <= 12; i++)
            {
                if (i > 1)
                {
                    eachCTY = "";
                }
                if ((Array.FindAll<string>(qParts, s => s.StartsWith("xsCityID" + i.ToString()))).Count() > 0)
                {
                    eachCTY = eachCTY + (Array.FindAll<string>(qParts, s => s.StartsWith("xnoCity" + i.ToString())).Count() > 0 ? (Array.FindAll<string>(qParts, s => s.StartsWith("xnoCity" + i.ToString())).First().Split("="))[1] + "$$$" : "$$$");
                    eachCTY = eachCTY + (Array.FindAll<string>(qParts, s => s.StartsWith("xsCityID" + i.ToString())).Count() > 0 ? (Array.FindAll<string>(qParts, s => s.StartsWith("xsCityID" + i.ToString())).First().Split("="))[1] + "$$$" : "$$$");
                    eachCTY = eachCTY + (Array.FindAll<string>(qParts, s => s.StartsWith("xsCityNA" + i.ToString())).Count() > 0 ? (Array.FindAll<string>(qParts, s => s.StartsWith("xsCityNA" + i.ToString())).First().Split("="))[1].Replace("+", " ") + "$$$" : "$$$");
                    eachCTY = eachCTY + (Array.FindAll<string>(qParts, s => s.StartsWith("xsCityAPI" + i.ToString())).Count() > 0 ? (Array.FindAll<string>(qParts, s => s.StartsWith("xsCityAPI" + i.ToString())).First().Split("="))[1] + "$$$" : "$$$");
                    eachCTY = eachCTY + (Array.FindAll<string>(qParts, s => s.StartsWith("xselNoOfNts" + i.ToString())).Count() > 0 ? (Array.FindAll<string>(qParts, s => s.StartsWith("xselNoOfNts" + i.ToString())).First().Split("="))[1] + "$$$" : "$$$");
                    eachCTY = eachCTY + (Array.FindAll<string>(qParts, s => s.StartsWith("xrdselTrans" + i.ToString())).Count() > 0 ? (Array.FindAll<string>(qParts, s => s.StartsWith("xrdselTrans" + i.ToString())).First().Split("="))[1] + "$$$" : "$$$");
                    eachCTY = eachCTY + (Array.FindAll<string>(qParts, s => s.StartsWith("xsOverNTS" + i.ToString())).Count() > 0 ? (Array.FindAll<string>(qParts, s => s.StartsWith("xsOverNTS" + i.ToString())).First().Split("="))[1] + "$$$" : "$$$");
                    eachCTY = eachCTY + (Array.FindAll<string>(qParts, s => s.StartsWith("xpickupDay" + i.ToString())).Count() > 0 ? (Array.FindAll<string>(qParts, s => s.StartsWith("xpickupDay" + i.ToString())).First().Split("="))[1] + "$$$" : "$$$");
                    eachCTY = eachCTY + (Array.FindAll<string>(qParts, s => s.StartsWith("xpickupPlace" + i.ToString())).Count() > 0 ? (Array.FindAll<string>(qParts, s => s.StartsWith("xpickupPlace" + i.ToString())).First().Split("="))[1] + "$$$" : "$$$");
                    eachCTY = eachCTY + (Array.FindAll<string>(qParts, s => s.StartsWith("xdropoffCity" + i.ToString())).Count() > 0 ? (Array.FindAll<string>(qParts, s => s.StartsWith("xdropoffCity" + i.ToString())).First().Split("="))[1] + "$$$" : "$$$");
                    eachCTY = eachCTY + (Array.FindAll<string>(qParts, s => s.StartsWith("xdropoffDay" + i.ToString())).Count() > 0 ? (Array.FindAll<string>(qParts, s => s.StartsWith("xdropoffDay" + i.ToString())).First().Split("="))[1] + "$$$" : "$$$");
                    eachCTY = eachCTY + (Array.FindAll<string>(qParts, s => s.StartsWith("xdropoffPlace" + i.ToString())).Count() > 0 ? (Array.FindAll<string>(qParts, s => s.StartsWith("xdropoffPlace" + i.ToString())).First().Split("="))[1] + "$$$" : "$$$");
                    eachCTY = eachCTY + (Array.FindAll<string>(qParts, s => s.StartsWith("xrdselTransField" + i.ToString())).Count() > 0 ? (Array.FindAll<string>(qParts, s => s.StartsWith("xrdselTransField" + i.ToString())).First().Split("="))[1] + "$$$" : "$$$");
                }
                cityList.Add(eachCTY);
            }
            if (cityE != "")
            {
                eachCTYE = eachCTYE + (Array.FindAll<string>(qParts, s => s.StartsWith("xnoCityE")).Count() > 0 ? (Array.FindAll<string>(qParts, s => s.StartsWith("xnoCityE")).First().Split("="))[1] + "$$$" : "$$$");
                eachCTYE = eachCTYE + (Array.FindAll<string>(qParts, s => s.StartsWith("xsCityIDE")).Count() > 0 ? (Array.FindAll<string>(qParts, s => s.StartsWith("xsCityIDE")).First().Split("="))[1] + "$$$" : "$$$");
                eachCTYE = eachCTYE + (Array.FindAll<string>(qParts, s => s.StartsWith("xsCityNAE")).Count() > 0 ? (Array.FindAll<string>(qParts, s => s.StartsWith("xsCityNAE")).First().Split("="))[1].Replace("+", " ") + "$$$" : "$$$");
                eachCTYE = eachCTYE + (Array.FindAll<string>(qParts, s => s.StartsWith("xsCityAPIE")).Count() > 0 ? (Array.FindAll<string>(qParts, s => s.StartsWith("xsCityAPIE")).First().Split("="))[1] + "$$$" : "$$$");
                eachCTYE = eachCTYE + (Array.FindAll<string>(qParts, s => s.StartsWith("xselNoOfNtsE")).Count() > 0 ? (Array.FindAll<string>(qParts, s => s.StartsWith("xselNoOfNtsE")).First().Split("="))[1] + "$$$" : "$$$");
                eachCTYE = eachCTYE + (Array.FindAll<string>(qParts, s => s.StartsWith("xrdselTransE")).Count() > 0 ? (Array.FindAll<string>(qParts, s => s.StartsWith("xrdselTransE")).First().Split("="))[1] + "$$$" : "$$$");
                eachCTYE = eachCTYE + (Array.FindAll<string>(qParts, s => s.StartsWith("xsOverNTSE")).Count() > 0 ? (Array.FindAll<string>(qParts, s => s.StartsWith("xsOverNTSE")).First().Split("="))[1] + "$$$" : "$$$");
                eachCTYE = eachCTYE + (Array.FindAll<string>(qParts, s => s.StartsWith("xpickupDayE")).Count() > 0 ? (Array.FindAll<string>(qParts, s => s.StartsWith("xpickupDayE")).First().Split("="))[1] + "$$$" : "$$$");
                eachCTYE = eachCTYE + (Array.FindAll<string>(qParts, s => s.StartsWith("xpickupPlaceE")).Count() > 0 ? (Array.FindAll<string>(qParts, s => s.StartsWith("xpickupPlaceE")).First().Split("="))[1] + "$$$" : "$$$");
                eachCTYE = eachCTYE + (Array.FindAll<string>(qParts, s => s.StartsWith("xdropoffCityE")).Count() > 0 ? (Array.FindAll<string>(qParts, s => s.StartsWith("xdropoffCityE")).First().Split("="))[1] + "$$$" : "$$$");
                eachCTYE = eachCTYE + (Array.FindAll<string>(qParts, s => s.StartsWith("xdropoffDayE")).Count() > 0 ? (Array.FindAll<string>(qParts, s => s.StartsWith("xdropoffDayE")).First().Split("="))[1] + "$$$" : "$$$");
                eachCTYE = eachCTYE + (Array.FindAll<string>(qParts, s => s.StartsWith("xdropoffPlaceE")).Count() > 0 ? (Array.FindAll<string>(qParts, s => s.StartsWith("xdropoffPlaceE")).First().Split("="))[1] + "$$$" : "$$$");
                eachCTYE = eachCTYE + (Array.FindAll<string>(qParts, s => s.StartsWith("xrdselTransFieldE")).Count() > 0 ? (Array.FindAll<string>(qParts, s => s.StartsWith("xrdselTransFieldE")).First().Split("="))[1] + "$$$" : "$$$");
                cityList.Add(eachCTYE);
            }
            calendarCompListViewModel.idLeavingFrom = Array.FindAll<string>(qParts, s => s.StartsWith("xidLeavingFrom", StringComparison.OrdinalIgnoreCase)).First().Split("=")[1];
            calendarCompListViewModel.wAir = Array.FindAll<string>(qParts, s => s.StartsWith("xrdAWair")).First().Split("=")[1];
            Int32 isCarCount = 0;
            string xmlBPC_Q = "";
            string xmlBPC_Q2 = "";
            string qResult = "";

            BuildPackageComponentListQ jsonBPC_Q = new BuildPackageComponentListQ();
            CalendarBuildPackageComponentListQ calendarBuildPackageComponentQ = new CalendarBuildPackageComponentListQ();
            if (calendarCompListViewModel.wAir == "True")
            {
                calendarBuildPackageComponentQ.DepCityID = int.Parse(calendarCompListViewModel.idLeavingFrom);
            }
            calendarBuildPackageComponentQ.Cities = new List<CityPC>();
            string isCar = "";
            for (Int32 i = 0; i <= cityList.Count - 1; i++)
            {
                string[] eachCity = cityList[i].Split("$$$");
                CityPC city = new CityPC();
                city.CityComponents = new List<CityComponent>();
                if (eachCity[0] != "")
                {
                    city.No = eachCity[0];
                    city.PlaceID = int.Parse(eachCity[1]);
                    city.PlaceName = eachCity[2];
                    city.NoOfNight = int.Parse(eachCity[4]);
                    if (eachCity[4].Length > 0)
                    {
                        CityComponent component = new CityComponent();
                        component.ProductType = "H";
                        component.ProductFreeField1 = "";
                        component.ProductNotes = "";
                        component.ProductItemID = "";
                        component.Transportation = 0;
                        city.CityComponents.Add(component);
                    }
                    if (eachCity[5] != "")
                    {
                        CityComponent component = new CityComponent();
                        string Nts = "";
                        string Field = "";
                        string typeNA = "";
                        switch (eachCity[12])
                        {
                            case "TIC":
                                typeNA = "T";
                                Nts = "Train";
                                Field = eachCity[12];
                                break;
                            case "TBA":
                                typeNA = "C";
                                Nts = "Car";
                                Field = eachCity[12];
                                break;
                            case "P2P":
                                typeNA = "T";
                                Nts = "Air";
                                Field = eachCity[12];
                                break;
                            case "OWN":
                                typeNA = "W";
                                Nts = "On your Own";
                                Field = "";
                                break;
                            case "GI":
                                typeNA = "G";
                                Nts = "Ground";
                                Field = eachCity[12];
                                break;
                        }
                        switch (eachCity[12])
                        {
                            case "TIC":
                            case "P2P":
                            case "GI":
                            case "OWN":
                                component.ProductType = typeNA;
                                component.ProductFreeField1 = Field;
                                component.ProductNotes = Nts;
                                component.ProductItemID = "0";
                                component.Transportation = 1;
                                component.OverNight = string.IsNullOrEmpty(eachCity[6]) ? 0 : int.Parse(eachCity[6]);
                                isCarCount = 0;
                                isCar = "";
                                break;
                            case "TBA":
                                if (isCarCount >= 1 && String.Compare(isCar, eachCity[0]) <= 0)
                                {
                                    if (isCar == eachCity[0])
                                    {
                                        isCarCount = 0;
                                    }
                                }
                                isCarCount = isCarCount + 1;
                                if (isCarCount == 1)
                                {
                                    component.ProductType = eachCity[5];
                                    component.ProductFreeField1 = Field;
                                    component.ProductNotes = Nts;
                                    component.ProductItemID = "0";
                                    component.Transportation = 1;
                                    component.OverNight = string.IsNullOrEmpty(eachCity[6]) ? 0 : int.Parse(eachCity[6]);
                                    component.CarPickUpCityNo = eachCity[0];
                                    component.CarPickUpDay = eachCity[7];
                                    component.CarDropOffCityNo = eachCity[9];
                                    component.CarDropOffDay = eachCity[10];
                                    isCar = eachCity[9];
                                }
                                break;
                        }
                        city.CityComponents.Add(component);
                    }
                    else
                    {
                        CityComponent component = new CityComponent();
                        component.ProductType = eachCity[5];
                        component.ProductFreeField1 = "";
                        component.ProductNotes = "On your Own";
                        component.ProductItemID = "0";
                        component.Transportation = 1;
                        component.OverNight = string.IsNullOrEmpty(eachCity[6]) ? 0 : int.Parse(eachCity[6]);
                        city.CityComponents.Add(component);
                    }
                    calendarBuildPackageComponentQ.Cities.Add(city);
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

            //xmlBPC_Q = "<CALENDAR_BUILDPACKAGECOMPONENTLIST_Q>";
            //if (calendarCompListViewModel.wAir == "True")
            //{
            //    xmlBPC_Q = xmlBPC_Q + "<DepCityID>" + calendarCompListViewModel.idLeavingFrom + "</DepCityID>";
            //}
            //xmlBPC_Q = xmlBPC_Q + "<Cities>";
            //string isCar = "";
            //for (Int32 i = 0; i <= cityList.Count - 1; i++)
            //{
            //    string[] eachCity = cityList[i].Split("$$$");
            //    if (eachCity[0] != "")
            //    {
            //        xmlBPC_Q = xmlBPC_Q + "<City>";
            //        xmlBPC_Q = xmlBPC_Q + "<No>" + eachCity[0] + "</No>";
            //        xmlBPC_Q = xmlBPC_Q + "<PlaceID>" + eachCity[1] + "</PlaceID>";
            //        xmlBPC_Q = xmlBPC_Q + "<PlaceName>" + eachCity[2] + "</PlaceName>";
            //        xmlBPC_Q = xmlBPC_Q + "<NoOfNight>" + eachCity[4] + "</NoOfNight>";
            //        if (eachCity[4].Length > 0)
            //        {
            //            xmlBPC_Q = xmlBPC_Q + "<Component>";
            //            xmlBPC_Q = xmlBPC_Q + "<ProductType>H</ProductType>";
            //            xmlBPC_Q = xmlBPC_Q + "<ProductFreeField1></ProductFreeField1>";
            //            xmlBPC_Q = xmlBPC_Q + "<ProductNotes></ProductNotes>";
            //            xmlBPC_Q = xmlBPC_Q + "<ProductItemID></ProductItemID>";
            //            xmlBPC_Q = xmlBPC_Q + "<Transportation>0</Transportation>";
            //            xmlBPC_Q = xmlBPC_Q + "</Component>";
            //        }
            //        if (eachCity[5] != "")
            //        {
            //            string Nts = "";
            //            string Field = "";
            //            string typeNA = "";
            //            switch (eachCity[5])
            //            {
            //                case "T":
            //                    {
            //                        typeNA = "T";
            //                        Nts = "Train";
            //                        Field = eachCity[12];
            //                        break;
            //                    }
            //                case "C":
            //                    {
            //                        typeNA = "C";
            //                        Nts = "Car";
            //                        Field = eachCity[12];
            //                        break;
            //                    }
            //                case "A":
            //                    {
            //                        typeNA = "T";
            //                        Nts = "Air";
            //                        Field = eachCity[12];
            //                        break;
            //                    }
            //                case "W":
            //                    {
            //                        typeNA = "W";
            //                        Nts = "On your Own";
            //                        Field = "";
            //                        break;
            //                    }
            //            }

            //            switch (eachCity[5])
            //            {
            //                case "T":
            //                case "A":
            //                case "W":
            //                    {
            //                        xmlBPC_Q = xmlBPC_Q + "<Component>";
            //                        xmlBPC_Q = xmlBPC_Q + "<ProductType>" + typeNA + "</ProductType>";
            //                        xmlBPC_Q = xmlBPC_Q + "<ProductFreeField1>" + Field + "</ProductFreeField1>";
            //                        xmlBPC_Q = xmlBPC_Q + "<ProductNotes>" + Nts + "</ProductNotes>";
            //                        xmlBPC_Q = xmlBPC_Q + "<ProductItemID>0</ProductItemID>";
            //                        xmlBPC_Q = xmlBPC_Q + "<Transportation>1</Transportation>";
            //                        xmlBPC_Q = xmlBPC_Q + "<OverNight>" + eachCity[6] + "</OverNight>";
            //                        xmlBPC_Q = xmlBPC_Q + "</Component>";
            //                        isCarCount = 0;
            //                        isCar = "";
            //                        break;
            //                    }
            //                case "C":
            //                    {
            //                        if (isCarCount >= 1 && String.Compare(isCar, eachCity[0]) <= 0)
            //                        {
            //                            if (isCar == eachCity[0])
            //                            {
            //                                isCarCount = 0;
            //                            }
            //                        }
            //                        isCarCount = isCarCount + 1;
            //                        if (isCarCount == 1)
            //                        {
            //                            xmlBPC_Q = xmlBPC_Q + "<Component>";
            //                            xmlBPC_Q = xmlBPC_Q + "<ProductType>" + eachCity[5] + "</ProductType>";
            //                            xmlBPC_Q = xmlBPC_Q + "<ProductFreeField1>" + Field + "</ProductFreeField1>";
            //                            xmlBPC_Q = xmlBPC_Q + "<ProductNotes>" + Nts + "</ProductNotes>";
            //                            xmlBPC_Q = xmlBPC_Q + "<ProductItemID>0</ProductItemID>";
            //                            xmlBPC_Q = xmlBPC_Q + "<Transportation>1</Transportation>";
            //                            xmlBPC_Q = xmlBPC_Q + "<OverNight>" + eachCity[6] + "</OverNight>";

            //                            xmlBPC_Q = xmlBPC_Q + "<CarPickUpCityNo>" + eachCity[0] + "</CarPickUpCityNo>";
            //                            xmlBPC_Q = xmlBPC_Q + "<CarPickUpDay>" + eachCity[7] + "</CarPickUpDay>";
            //                            xmlBPC_Q = xmlBPC_Q + "<CarDropOffCityNo>" + eachCity[9] + "</CarDropOffCityNo>";
            //                            xmlBPC_Q = xmlBPC_Q + "<CarDropOffDay>" + eachCity[10] + "</CarDropOffDay>";

            //                            xmlBPC_Q = xmlBPC_Q + "</Component>";
            //                            isCar = eachCity[9];
            //                        }
            //                        break;
            //                    }
            //            }
            //        }
            //        xmlBPC_Q = xmlBPC_Q + "</City>";
            //    }
            //}
            //xmlBPC_Q = xmlBPC_Q + "</Cities></CALENDAR_BUILDPACKAGECOMPONENTLIST_Q>";
            //xmlBPC_Q2 = "<CALENDAR_BUILDPACKAGECOMPONENTLIST_Q>";
            //xmlBPC_Q2 = xmlBPC_Q2 + "</CALENDAR_BUILDPACKAGECOMPONENTLIST_Q>";

            //XmlDocument qBUILD = new XmlDocument();
            //string qQuery = "";
            string rResult = "";
            //qBUILD.LoadXml(xmlBPC_Q);
            //qQuery = qBUILD.InnerXml;
            //string webApi = "localhost";
            //qResult = Utilities.SiteAPI_SendAndReceive(qQuery, "tournet", webApi);
            try
            {
                //XmlDocument rCTYS = new XmlDocument();
                //rCTYS.LoadXml(qResult);
                //XmlNode itincity = rCTYS.SelectSingleNode("//Content");
                //calendarCompListViewModel.contenido = Utilities.StringToGzipString(itincity.InnerXml);
                //rResult = calendarCompListViewModel.contenido;
                XNode node = JsonConvert.DeserializeXNode(result.ToString(), "PackageComponentList");
                calendarCompListViewModel.contenido = Utilities.StringToGzipString(node.ToString());
                rResult = calendarCompListViewModel.contenido;
                calendarCompListViewModel.FormSubmit = 1;
            }
            catch (System.IO.IOException e)
            {
                rResult = "Error";
                calendarCompListViewModel.FormSubmit = 0;
            }
            //' AIR PARAMETERS 
            calendarCompListViewModel.arrDate = System.Web.HttpUtility.UrlDecode(Array.FindAll<string>(qParts, s => s.StartsWith("xtxtBYArriving")).First().Split("=")[1]);
            string txtLeavingFrom = Array.FindAll<string>(qParts, s => s.StartsWith("xtxtLeavingFrom")).First().Split("=")[1];
            calendarCompListViewModel.idLeavingFrom = Array.FindAll<string>(qParts, s => s.StartsWith("xidLeavingFrom", StringComparison.OrdinalIgnoreCase)).First().Split("=")[1];

            calendarCompListViewModel.txtReturningTo = Array.FindAll<string>(qParts, s => s.StartsWith("xtxtLeavingFrom", StringComparison.OrdinalIgnoreCase)).First().Split("=")[1];
            calendarCompListViewModel.idReturningTo = Array.FindAll<string>(qParts, s => s.StartsWith("xidReturningTo", StringComparison.OrdinalIgnoreCase)).First().Split("=")[1];
            if (calendarCompListViewModel.idReturningTo == "")
            {
                calendarCompListViewModel.txtReturningTo = Array.FindAll<string>(qParts, s => s.StartsWith("xtxtLeavingFrom", StringComparison.OrdinalIgnoreCase)).First().Split("=")[1];
                calendarCompListViewModel.idReturningTo = Array.FindAll<string>(qParts, s => s.StartsWith("xidLeavingFrom", StringComparison.OrdinalIgnoreCase)).First().Split("=")[1];
            }
            calendarCompListViewModel.cabin = Array.FindAll<string>(qParts, s => s.StartsWith("xCabin") && !s.Contains("Txt")).First().Split("=")[1];
            calendarCompListViewModel.wAir = Array.FindAll<string>(qParts, s => s.StartsWith("xrdAWair")).First().Split("=")[1];
            //' CITY S 
            string noCityS = "";
            if (Array.FindAll<string>(qParts, s => s.StartsWith("xnoCityS")).Count() > 0)
            {
                noCityS = Array.FindAll<string>(qParts, s => s.StartsWith("xnoCityS")).First().Split("=")[1];
            }
            if (Array.FindAll<string>(qParts, s => s.StartsWith("xsCityNAS")).Count() > 0)
            {
                calendarCompListViewModel.txtCityS = System.Web.HttpUtility.UrlDecode(Array.FindAll<string>(qParts, s => s.StartsWith("xsCityNAS")).First().Split("=")[1].Replace("+", " "));
            }
            if (Array.FindAll<string>(qParts, s => s.StartsWith("xsCityIDS")).Count() > 0)
            {
                calendarCompListViewModel.idCityS = Array.FindAll<string>(qParts, s => s.StartsWith("xsCityIDS")).First().Split("=")[1];
            }
            string apiCityS = "";
            if (Array.FindAll<string>(qParts, s => s.StartsWith("xsCityAPIS")).Count() > 0)
            {
                apiCityS = System.Web.HttpUtility.UrlDecode(Array.FindAll<string>(qParts, s => s.StartsWith("xsCityAPIS")).First().Split("=")[1]);
            }
            string stayCityS = "";
            if (Array.FindAll<string>(qParts, s => s.StartsWith("xselNoOfNtsS")).Count() > 0)
            {
                stayCityS = Array.FindAll<string>(qParts, s => s.StartsWith("xselNoOfNtsS")).First().Split("=")[1];
            }
            string traspCityS = "";
            if (Array.FindAll<string>(qParts, s => s.StartsWith("xrdselTransS")).Count() > 0)
            {
                traspCityS = Array.FindAll<string>(qParts, s => s.StartsWith("xrdselTransS")).First().Split("=")[1];
            }
            string overCityS = "";
            if (Array.FindAll<string>(qParts, s => s.StartsWith("xsOverNTSS")).Count() > 0)
            {
                overCityS = Array.FindAll<string>(qParts, s => s.StartsWith("xsOverNTSS")).First().Split("=")[1];
            }

            //'  EACH CITY PARAMETERS 
            string isVal = "";
            string transpTYP = "";
            for (Int32 ct = 1; ct <= 12; ct++)
            {
                isVal = Array.FindAll<string>(qParts, s => s.StartsWith("xnoCity" + ct.ToString())).Count() > 0 ? (Array.FindAll<string>(qParts, s => s.StartsWith("xnoCity" + ct.ToString())).First().Split("="))[1] : "";
                if (isVal != "")
                {
                    calendarCompListViewModel.noCity.Add((Array.FindAll<string>(qParts, s => s.StartsWith("xnoCity" + ct.ToString())).First().Split("="))[1]);
                    calendarCompListViewModel.txtCity.Add(System.Web.HttpUtility.UrlDecode((Array.FindAll<string>(qParts, s => s.StartsWith("xsCityNA" + ct.ToString())).First().Split("="))[1].Replace("+", " ")));
                    calendarCompListViewModel.idCity.Add((Array.FindAll<string>(qParts, s => s.StartsWith("xsCityID" + ct.ToString())).First().Split("="))[1]);
                    calendarCompListViewModel.apiCity.Add(System.Web.HttpUtility.UrlDecode((Array.FindAll<string>(qParts, s => s.StartsWith("xsCityAPI" + ct.ToString())).First().Split("="))[1]));
                    calendarCompListViewModel.stayCity.Add((Array.FindAll<string>(qParts, s => s.StartsWith("xselNoOfNts" + ct.ToString())).First().Split("="))[1]);
                    if (Array.FindAll<string>(qParts, s => s.StartsWith("xrdselTrans" + ct.ToString())).Count() > 0)
                    {
                        traspCity.Add((Array.FindAll<string>(qParts, s => s.StartsWith("xrdselTrans" + ct.ToString())).First().Split("="))[1]);
                    }
                    if (Array.FindAll<string>(qParts, s => s.StartsWith("xrdselTrans" + ct.ToString())).Count() > 0)
                    {
                        transpTYP = (Array.FindAll<string>(qParts, s => s.StartsWith("xrdselTrans" + ct.ToString())).First().Split("="))[1];
                    }
                    switch (transpTYP)
                    {
                        case "A":
                        case "C":
                        case "W":
                            {
                                calendarCompListViewModel.overCity.Add("0");
                                break;
                            }
                        default:
                            {
                                if (Array.FindAll<string>(qParts, s => s.StartsWith("xsoverNTS" + ct.ToString())).Count() > 0)
                                {
                                    calendarCompListViewModel.overCity.Add((Array.FindAll<string>(qParts, s => s.StartsWith("xsoverNTS" + ct.ToString())).First().Split("="))[1]);
                                }
                                else
                                {
                                    calendarCompListViewModel.overCity.Add("");
                                }
                                break;
                            }
                    }
                    if (Array.FindAll<string>(qParts, s => s.StartsWith("xpickupday" + ct.ToString())).Count() > 0)
                    {
                        carPickUpDay.Add((Array.FindAll<string>(qParts, s => s.StartsWith("xpickupday" + ct.ToString())).First().Split("="))[1]);
                    }
                    if (Array.FindAll<string>(qParts, s => s.StartsWith("xpickupPlace" + ct.ToString())).Count() > 0)
                    {
                        carPickUpPlace.Add((Array.FindAll<string>(qParts, s => s.StartsWith("xpickupPlace" + ct.ToString())).First().Split("="))[1]);
                    }
                    if (Array.FindAll<string>(qParts, s => s.StartsWith("xdropoffCity" + ct.ToString())).Count() > 0)
                    {
                        carDropCityNo.Add((Array.FindAll<string>(qParts, s => s.StartsWith("xdropoffCity" + ct.ToString())).First().Split("="))[1]);
                    }
                    if (Array.FindAll<string>(qParts, s => s.StartsWith("xdropoffDay" + ct.ToString())).Count() > 0)
                    {
                        carDropDay.Add((Array.FindAll<string>(qParts, s => s.StartsWith("xdropoffDay" + ct.ToString())).First().Split("="))[1]);
                    }
                    if (Array.FindAll<string>(qParts, s => s.StartsWith("xdropoffPlace" + ct.ToString())).Count() > 0)
                    {
                        carDropPlace.Add((Array.FindAll<string>(qParts, s => s.StartsWith("xdropoffPlace" + ct.ToString())).First().Split("="))[1]);
                    }
                }
            }
            //' CITY E 
            string noCityE = "";
            if (Array.FindAll<string>(qParts, s => s.StartsWith("xnoCityE")).Count() > 0)
            {
                noCityE = Array.FindAll<string>(qParts, s => s.StartsWith("xnoCityE")).First().Split("=")[1];
            }
            if (Array.FindAll<string>(qParts, s => s.StartsWith("xsCityNAE")).Count() > 0)
            {
                calendarCompListViewModel.txtCityE = System.Web.HttpUtility.UrlDecode(Array.FindAll<string>(qParts, s => s.StartsWith("xsCityNAE")).First().Split("=")[1].Replace("+", " "));
            }
            if (Array.FindAll<string>(qParts, s => s.StartsWith("xsCityIDE")).Count() > 0)
            {
                calendarCompListViewModel.idCityE = Array.FindAll<string>(qParts, s => s.StartsWith("xsCityIDE")).First().Split("=")[1];
            }
            string apiCityE = "";
            if (Array.FindAll<string>(qParts, s => s.StartsWith("xsCityAPIE")).Count() > 0)
            {
                apiCityE = System.Web.HttpUtility.UrlDecode(Array.FindAll<string>(qParts, s => s.StartsWith("xsCityAPIE")).First().Split("=")[1]);
            }
            string stayCityE = "";
            if (Array.FindAll<string>(qParts, s => s.StartsWith("xselNoOfNtsE")).Count() > 0)
            {
                stayCityE = Array.FindAll<string>(qParts, s => s.StartsWith("xselNoOfNtsE")).First().Split("=")[1];
            }
            string traspCityE = Array.FindAll<string>(qParts, s => s.StartsWith("xrdselTransE")).Count() > 0 ? Array.FindAll<string>(qParts, s => s.StartsWith("xrdselTransE")).First().Split("=")[1] : "";
            string overCityE = Array.FindAll<string>(qParts, s => s.StartsWith("xsOverNTSE")).Count() > 0 ? Array.FindAll<string>(qParts, s => s.StartsWith("xsOverNTSE")).First().Split("=")[1] : "";
            //' PAX PARAMETERS 
            calendarCompListViewModel.roomsAndpax = Array.FindAll<string>(qParts, s => s.StartsWith("xiRoomsAndPax") && !s.Contains("Text")).Count() > 0 ? System.Web.HttpUtility.UrlDecode(Array.FindAll<string>(qParts, s => s.StartsWith("xiRoomsAndPax") && !s.Contains("Text")).First().Split("=")[1]) : "";
            calendarCompListViewModel.rooms = Array.FindAll<string>(qParts, s => s.StartsWith("xselRooms")).Count() > 0 ? Array.FindAll<string>(qParts, s => s.StartsWith("xselRooms")).First().Split("=")[1] : "";
            //' ROOM 1 
            calendarCompListViewModel.Adults = Array.FindAll<string>(qParts, s => s.StartsWith("xiAdults")).Count() > 0 ? Array.FindAll<string>(qParts, s => s.StartsWith("xiAdults")).First().Split("=")[1] : "";
            calendarCompListViewModel.Childs = Array.FindAll<string>(qParts, s => s.StartsWith("xiChildren")).Count() > 0 ? Array.FindAll<string>(qParts, s => s.StartsWith("xiChildren")).First().Split("=")[1] : "";
            for (Int32 ch = 1; ch <= 2; ch++)
            {
                calendarCompListViewModel.child.Add((Array.FindAll<string>(qParts, s => s.StartsWith("xiChild" + ch.ToString())).First().Split("="))[1]);
            }
            //' ROOM 2 
            calendarCompListViewModel.R2Adults = Array.FindAll<string>(qParts, s => s.StartsWith("xRoom2_iAdults")).First().Split("=")[1];
            calendarCompListViewModel.R2Childs = Array.FindAll<string>(qParts, s => s.StartsWith("xRoom2_iChildren")).First().Split("=")[1];
            for (Int32 ch = 1; ch <= 2; ch++)
            {
                calendarCompListViewModel.R2child.Add((Array.FindAll<string>(qParts, s => s.StartsWith("xRoom2_iChild" + ch.ToString())).First().Split("="))[1]);
            }
            //' ROOM 3 
            calendarCompListViewModel.R3Adults = Array.FindAll<string>(qParts, s => s.StartsWith("xRoom3_iAdults")).First().Split("=")[1];
            calendarCompListViewModel.R3Childs = Array.FindAll<string>(qParts, s => s.StartsWith("xRoom3_iChildren")).First().Split("=")[1];
            for (Int32 ch = 1; ch <= 2; ch++)
            {
                calendarCompListViewModel.R3child.Add((Array.FindAll<string>(qParts, s => s.StartsWith("xRoom3_iChild" + ch.ToString())).First().Split("="))[1]);
            }

            return View("CalendarCompList", calendarCompListViewModel);
        }

        [HttpPost("/Calendar/T4TransportationOptions", Name = "CalendarOptions")]
        public IActionResult W_GET_T4TransportationOptions([FromBody] string stringForm)
        {
            CalendarViewModel calendarViewModel = new CalendarViewModel();
            string HotelsAPI = _appSettings.ApplicationSettings.CityHotelVendorAPI;
            calendarViewModel.citiesTransportOptions = new List<CityTrasnsportOptions>();
            calendarViewModel.qCities = "";
            List<string> ctyNA = new List<string>();
            List<string> ctyID = new List<string>();
            List<string> ctySt = new List<string>();
            string q = stringForm;
            string[] qParts = q.Split("&");
            foreach (var qPart in qParts)
            {
                string[] qPar = qPart.Split("=");
                if (Regex.IsMatch(qPar[0], "goingID", RegexOptions.IgnoreCase))
                {
                    calendarViewModel.webSite = qPar[1];
                }
                if (Regex.IsMatch(qPar[0], "qWair", RegexOptions.IgnoreCase))
                {
                    calendarViewModel.wAir = qPar[1];
                }
                if (Regex.IsMatch(qPar[0], "qLeaveNA", RegexOptions.IgnoreCase))
                {
                    calendarViewModel.depNA = System.Web.HttpUtility.UrlDecode(qPar[1]);
                }
                if (Regex.IsMatch(qPar[0], "qLeaveID", RegexOptions.IgnoreCase))
                {
                    calendarViewModel.depID = qPar[1];
                }
                if (Regex.IsMatch(qPar[0], "qCabin", RegexOptions.IgnoreCase) && !qPar[0].Contains("Txt"))
                {
                    calendarViewModel.cabTY = qPar[1];
                }
                if (Regex.IsMatch(qPar[0], "qArrDate", RegexOptions.IgnoreCase))
                {
                    calendarViewModel.dateD = System.Web.HttpUtility.UrlDecode(qPar[1]); //qPar[1].Replace("%2F", "/");
                }
                if (Regex.IsMatch(qPar[0], "qutm_campaign", RegexOptions.IgnoreCase))
                {
                    calendarViewModel.sCampaignCode = qPar[1];
                }
                if (Regex.IsMatch(qPar[0], "qNACity", RegexOptions.IgnoreCase))
                {
                    ctyNA.Add(qPar[1].Replace("+", " "));
                }
                if (Regex.IsMatch(qPar[0], "qIDCity", RegexOptions.IgnoreCase))
                {
                    ctyID.Add(qPar[1]);
                }
                if (Regex.IsMatch(qPar[0], "qSTCity", RegexOptions.IgnoreCase) && !qPar[0].Contains("Txt"))
                {
                    ctySt.Add(qPar[1]);
                }
            }
            StringBuilder strQCities = new StringBuilder();
            strQCities.Append("<CALENDAR_TRANSPORTATIONOPTION_Q>");
            strQCities.Append("<UserID>243</UserID>");
            strQCities.Append("<Cities>");
            for (Int32 i = 0; i <= ctyNA.Count - 1; i++)
            {
                if (ctyNA[i].IndexOf("(") > 0)
                {
                    Int32 strEnd = ctyNA[i].IndexOf("(") - 1;
                    ctyNA[i] = ctyNA[i].Substring(0, strEnd);
                }
                if (i == 1)
                {
                    calendarViewModel.qCities = ctyNA[i];
                }
                else
                {
                    calendarViewModel.qCities = calendarViewModel.qCities + "," + ctyNA[i];
                }

                strQCities.Append("<City>");
                strQCities.Append("<No>" + (i + 1).ToString() + "</No>");
                strQCities.Append("<PlaceID>" + ctyID[i] + "</PlaceID>");
                strQCities.Append("<PlaceName>" + ctyNA[i] + "</PlaceName>");
                Int32 ii = i + 1;
                if (ii <= ctyNA.Count - 1)
                {
                    strQCities.Append("<PlaceToID>" + ctyID[ii] + "</PlaceToID>");
                }
                else
                {
                    strQCities.Append("<PlaceToID>-1</PlaceToID>");
                }
                strQCities.Append("</City>");
            }
            strQCities.Append("</Cities>");
            strQCities.Append("</CALENDAR_TRANSPORTATIONOPTION_Q>");
            //***************************
            //SEND REQUEST TO WEB SERVICE 
            //***************************
            string webApi = "localhost";
            string sQuery;
            string sResult;
            XmlDocument qCTYS = new XmlDocument();
            qCTYS.LoadXml(strQCities.ToString());
            strQCities = null;
            sQuery = qCTYS.InnerXml;
            qCTYS = null;
            sResult = Utilities.SiteAPI_SendAndReceive(sQuery, "tournet", webApi);
            XmlDocument rCTYS = new XmlDocument();
            rCTYS.LoadXml(sResult);

            String strPlaceIDs = "";
            XmlNodeList rCities = rCTYS.GetElementsByTagName("City");
            foreach (XmlNode n in rCities)
            {
                strPlaceIDs = strPlaceIDs + n.SelectSingleNode("PlaceID").InnerText + ",";
            }
            List<City> cityList = new List<City>();
            if (rCities.Count > 0)
            {
                strPlaceIDs = strPlaceIDs.Substring(0, strPlaceIDs.Length - 1);
                
                try
                {
                    var result = _dapperWrap.GetRecords<City>(SqlCalls.SQL_CitiesNames(strPlaceIDs));
                    cityList = result.Result.ToList();
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
                XmlNodeList itincity = rCTYS.GetElementsByTagName("City");
                foreach (XmlNode node in itincity)
                {
                    CityTrasnsportOptions ct = new CityTrasnsportOptions();
                    ct.PlaceName = node.SelectSingleNode("PlaceName").InnerText;
                    ct.No = node.SelectSingleNode("No").InnerText;
                    ct.PlaceID = node.SelectSingleNode("PlaceID").InnerText;
                    ct.PlaceAPI = HotelsAPI;
                    ct.StayNights = ctySt[Int32.Parse(ct.No) - 1];

                    thisCity = cityList.Where(x => x.Id == Int32.Parse(ct.PlaceID)).ToList();
                    if (thisCity.Count > 0)
                    {
                        ct.CountryId = thisCity[0].ContryID;
                        ct.CountryName = thisCity[0].CountryName;
                    }

                    Int64 NextPlaceId = -9999;
                    Int64.TryParse(node.SelectSingleNode("PlaceToID").InnerText, out NextPlaceId);
                    List<City> nextPlace = cityList.Where(x => x.Id == NextPlaceId).ToList();
                    if (nextPlace.Count > 0)
                    {
                        ct.NextPlace = nextPlace[0];
                    }

                    XmlNodeList optionNodes = node.SelectNodes("Options/Option");
                    List<TransportOption> options = new List<TransportOption>();
                    foreach (XmlNode optNode in optionNodes)
                    {
                        TransportOption opt = new TransportOption();
                        opt.ProductTypeName = optNode.SelectSingleNode("ProductTypeName").InnerText;
                        if (opt.ProductTypeName == "Air")
                        {
                            opt.ProductType = "A";
                        }
                        else
                        {
                            opt.ProductType = optNode.SelectSingleNode("ProductType").InnerText;
                        }
                        Int32 overNts = 0;
                        Int32.TryParse(optNode.SelectSingleNode("Overnight").InnerText, out overNts);
                        opt.Overnight = overNts;
                        opt.ProductFreeField1 = optNode.SelectSingleNode("ProductFreeField1").InnerText;
                        opt.ProductNotes = optNode.SelectSingleNode("ProductNotes").InnerText;
                        opt.Ranking = Convert.ToInt32(optNode.SelectSingleNode("Ranking").InnerText);

                        XmlNodeList dropCityNodes = optNode.SelectNodes("CarDropOff/DOCity");
                        List<DropCity> dropCities = new List<DropCity>();
                        foreach (XmlNode dcNode in dropCityNodes)
                        {
                            DropCity dropC = new DropCity();
                            dropC.DOPlaceID = Int64.Parse(dcNode.SelectSingleNode("DOPlaceID").InnerText);
                            dropC.DOPlaceName = dcNode.SelectSingleNode("DOPlaceName").InnerText;
                            dropC.DOPlaceNo = dcNode.SelectSingleNode("DOPlaceNo").InnerText;
                            dropCities.Add(dropC);
                        }
                        opt.CarDropOff = dropCities;
                        options.Add(opt);
                    }
                    options = options.OrderBy(x => x.Ranking).ToList();
                    ct.Options = options;
                    calendarViewModel.citiesTransportOptions.Add(ct);
                }

                for (Int32 i = 0; i <= calendarViewModel.citiesTransportOptions.Count - 1; i++)
                {
                    if (calendarViewModel.citiesTransportOptions[i].Options.Count > 0)
                    {
                        for (Int32 j = 0; j <= calendarViewModel.citiesTransportOptions[i].Options.Count - 1; j++)
                        {
                            if (calendarViewModel.citiesTransportOptions[i].Options[j].CarDropOff.Count > 0)
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

            return View("Calendar", calendarViewModel);
        }
    }
}


