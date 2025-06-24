using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MVC_TMED.Infrastructure;
using Microsoft.Extensions.Options;
using MVC_TMED.Models;
using System.Xml;
using System.Text;
using Dapper;
using System.Data;
using System.Data.SqlClient;
using MVC_TMED.Models.ViewModels;
using System.Linq.Expressions;
using System.Globalization;

namespace MVC_TMED.Controllers
{
    public class PackageController : Controller
    {
        private readonly AppSettings _appSettings;
        private readonly DapperWrap _dapperWrap;
        private readonly AWSParameterStoreService _awsParameterStoreService;

        public PackageController(IOptions<AppSettings> appsettings, DapperWrap dapperWrap, AWSParameterStoreService awsParameterStoreService)
        {
            _appSettings = appsettings.Value;
            _dapperWrap = dapperWrap;
            _awsParameterStoreService = awsParameterStoreService;
        }

        //[IgnoreAntiforgeryToken(Order = 1001)]
        //[ResponseCache(Duration = 30, Location = ResponseCacheLocation.Client)]
        [TypeFilter(typeof(CheckCacheFilter))]
        [HttpGet("{Country}/{name}/package-{id}", Name = "Package_Route")]   // /Colombia/Itinerary_pk62227_Bogota_-_Medellin_-_Cartagena_by_Air.aspx
        [HttpHead("{Country}/{name}/package-{id}", Name = "Package_Route")]   // /Colombia/Itinerary_pk62227_Bogota_-_Medellin_-_Cartagena_by_Air.aspx
        [HttpPost("{Country}/{name}/package-{id}", Name = "Package_Route")]   // /Colombia/Itinerary_pk62227_Bogota_-_Medellin_-_Cartagena_by_Air.aspx
        public async Task<IActionResult> Index(string Country, string id, string name)   // if we decide to create one single project for all destinations: string Continent,   {Continent}/
        {
            HttpContext.Response.Headers.Add("_utPg", "PKG");
            HttpContext.Response.Headers.Add("packID", id);

            MVC_TMED.Models.ViewModels.PackTemplate_21ViewModel viewModelTemplate;
            viewModelTemplate = new Models.ViewModels.PackTemplate_21ViewModel();
            // part from Global.asax to find which type of package it is: 21 or 22 or 24 ...
            Int64 highTPL = _appSettings.ApplicationSettings.highTPL;    //_appSettings.highTPL;
            List<PackTemplate> noTemplates = new List<PackTemplate>();
            //IDbConnection dbConn = new SqlConnection(_appSettings.ConnectionStrings.sqlConnStr);
            //noTemplates = dbConn.Query<PackTemplate>(SqlCalls.SQL_ProductTemplateValue(id)).ToList();
            var Result1 = await _dapperWrap.GetRecords<PackTemplate>(SqlCalls.SQL_ProductTemplateValue(id));
            noTemplates = Result1.ToList();
            if (noTemplates.Count == 0)
            {
                return NotFound();
            }
            if (noTemplates.First().PWT_TemplateValue == "21a")
            {
                viewModelTemplate.HideAdvance = "true";
                noTemplates.First().PWT_TemplateValue = "21";
            }
            Int64 templVal = Int64.Parse(noTemplates.First(x => Int64.Parse(x.PWT_TemplateValue) < highTPL).PWT_TemplateValue);
            string PackageView = "";

            //common part for all 3 templates 
            viewModelTemplate.PackId = id;
            viewModelTemplate.relatedItin = HttpContext.Request.Query["relItin"];
            if (viewModelTemplate.relatedItin == null)
            {
                viewModelTemplate.relatedItin = id;
            }

            var Result2 = await _dapperWrap.GetRecords<PackInfo>(SqlCalls.SQL_PackageInformation(id));
            viewModelTemplate.ListPackInfo = Result2.ToList();
            if (viewModelTemplate.ListPackInfo.Count == 0)
            {
                return NotFound();
            }
            string division = _appSettings.ApplicationSettings.SiteName == "" ? "" : viewModelTemplate.ListPackInfo.First().SPD_InternalComments.Contains(":.ED") ? "/europe" : viewModelTemplate.ListPackInfo.First().SPD_InternalComments.Contains(":LD") ? "/latin" : viewModelTemplate.ListPackInfo.First().SPD_InternalComments.Contains(":.TW") ? "/asia" : _appSettings.ApplicationSettings.SiteName;
            if (Country.Replace(" ", "_").ToLower() != (viewModelTemplate.ListPackInfo.First().STR_PlaceTitle ?? Country).Replace(" ", "_").ToLower() || name.Replace(" ", "_").ToLower() != viewModelTemplate.ListPackInfo.First().PDL_Title.Replace(" ", "_").ToLower() || division != _appSettings.ApplicationSettings.SiteName)
            {
                if (division != _appSettings.ApplicationSettings.SiteName)
                {
                    return RedirectPermanent(division + "/" + (viewModelTemplate.ListPackInfo.First().STR_PlaceTitle ?? Country).Replace(" ", "_").ToLower() + "/" + viewModelTemplate.ListPackInfo.First().PDL_Title.Replace(" ", "_").ToLower() + "/package-" + id);
                }
                else
                {
                    return RedirectPermanent(division + "/" + viewModelTemplate.ListPackInfo.First().STR_PlaceTitle.Replace(" ", "_").ToLower() + "/" + viewModelTemplate.ListPackInfo.First().PDL_Title.Replace(" ", "_").ToLower() + "/package-" + id);
                }
            }

            //Pack Info
            //taskPackInfos.Wait();
            //viewModelTemplate.ListPackInfo = taskPackInfos.Result;
            if (viewModelTemplate.ListPackInfo.Count < 1)
            {
                return View("PackTemplate_21", viewModelTemplate);
            }
            viewModelTemplate.packNA = viewModelTemplate.ListPackInfo.First().PDL_Title;
            viewModelTemplate.packNoNts = viewModelTemplate.ListPackInfo.First().STP_NumOfNights;
            if (viewModelTemplate.packNoNts == 0)
                viewModelTemplate.packNoNts = viewModelTemplate.ListPackInfo.First().PDL_Duration;
            viewModelTemplate.packPrice = viewModelTemplate.ListPackInfo.First().STP_Save;
            if (viewModelTemplate.packPrice != null)
                viewModelTemplate.packPriceD = Decimal.Parse(viewModelTemplate.packPrice);
            viewModelTemplate.packDepartureNA = viewModelTemplate.ListPackInfo.First().PLC_Title;
            viewModelTemplate.packKinds = viewModelTemplate.ListPackInfo.First().SPD_InternalComments;
            viewModelTemplate.packType = viewModelTemplate.ListPackInfo.First().SPD_StarRatingSysCode;
            viewModelTemplate.packInterestON = viewModelTemplate.ListPackInfo.First().SPD_Features;
            viewModelTemplate.packSamplePrice = viewModelTemplate.ListPackInfo.First().STP_MiniTitle ?? "";
            viewModelTemplate.packStartTravel = viewModelTemplate.ListPackInfo.First().STP_StartTravelDate;
            viewModelTemplate.packIncluded = viewModelTemplate.ListPackInfo.First().PDL_Content;
            viewModelTemplate.packCountryNA = viewModelTemplate.ListPackInfo.First().STR_PlaceTitle;
            viewModelTemplate.packCountryID = viewModelTemplate.ListPackInfo.First().STR_PlaceID;
            viewModelTemplate.packCityNA = viewModelTemplate.ListPackInfo.First().CityNA;
            viewModelTemplate.packCityID = viewModelTemplate.ListPackInfo.First().CityID;
            viewModelTemplate.packDescription = viewModelTemplate.ListPackInfo.First().SPD_Description;
            viewModelTemplate.packSpecialCode = viewModelTemplate.ListPackInfo.First().PDL_SpecialCode;
            viewModelTemplate.packDayXday = viewModelTemplate.ListPackInfo.First().PDL_Description;
            viewModelTemplate.packAccomoda = viewModelTemplate.ListPackInfo.First().PDL_Notes;
            viewModelTemplate.packDistances = viewModelTemplate.ListPackInfo.First().PDL_Description;
            viewModelTemplate.packProdID = viewModelTemplate.ListPackInfo.First().PDL_ProductID;
            viewModelTemplate.packCityEID = viewModelTemplate.ListPackInfo.First().CityEID;
            viewModelTemplate.packCityENA = viewModelTemplate.ListPackInfo.First().CityENA;
            viewModelTemplate.ntsString = viewModelTemplate.GetNights();
            viewModelTemplate.GuiNo = viewModelTemplate.GuidePackages();
            int _DepartureAirportId;
            Int32.TryParse(viewModelTemplate.ListPackInfo.First().STP_FromPlaceID.ToString(), out _DepartureAirportId);
            viewModelTemplate.DepartureAirport.Id = _DepartureAirportId;
            viewModelTemplate.DepartureAirport.Name = viewModelTemplate.ListPackInfo.First().PLC_Title;
            // *** DISCOUNT CODE *** //
            if (Request.Query.ContainsKey("utm_discountcode") || Request.Cookies["utmdiscountcode"] != null)
            {
                viewModelTemplate.MK_DiscountCode = Request.Cookies["utmdiscountcode"];
                viewModelTemplate.MK_Discount = true;
            }

            string pgTitle = viewModelTemplate.packNA.Replace("_", " ") + " | Custom Vacation Package | Tripmasters";
            string pageMetaDesc = viewModelTemplate.packNA.Replace("_", " ") + ", " + viewModelTemplate.packCountryNA + " Vacation Packages, Build Custom Vacation Packages with Airfare, best vacation deals, online bookings.";
            string pageMetaKey = "Europe vacations, European tours, Europe tour packages, vacation packages, to Europe, hotel deals, online booking, pricing, information, hotel travel, hotel, resort, accommodations, Europe, France, Paris, England, London, Netherlands, Italy, Spain";

            var result15 = await _dapperWrap.GetRecords<Place_Info>(SqlCalls.SQL_Place_InfoPackage(id.ToString()));
            List<Place_Info> dvTl = result15.ToList();
            if (dvTl.Count > 0)
            {
                pgTitle = dvTl[0].SEO_PageTitle ?? pgTitle;
                pageMetaDesc = dvTl[0].SEO_MetaDescription ?? pageMetaDesc;
            }


            ViewBag.image = "https://pictures.tripmasters.com/images/destination_icons/ed/cities/" + viewModelTemplate.packCityID + "_placephoto.jpg";
            ViewBag.PageTitle = pgTitle;
            ViewBag.pageMetaDesc = pageMetaDesc;
            ViewBag.pageMetaKey = pageMetaKey;
            ViewBag.PageType = "ProductPage";
            ViewBag.PackId = id;
            ViewBag.tmpagetype = "package";
            ViewBag.tmpagetypeinstance = "t" + templVal;
            ViewBag.tmrowid = "";
            ViewBag.tmadstatus = "";
            ViewBag.tmregion = "europe";
            ViewBag.tmcountry = "";
            ViewBag.tmdestination = "";

            //SET NIGHTS
            Int32 setNts = 0;
            string ntsString;
            if (viewModelTemplate.packKinds.IndexOf("1901:.") > 0) { setNts = 1; }
            if (templVal == 26)
            {
                setNts = 1;
            }
            if (setNts == 0)
            {
                decimal r = viewModelTemplate.packNoNts / 2;
                ntsString = viewModelTemplate.packNoNts.ToString() + " to " + (viewModelTemplate.packNoNts + Math.Round(r)).ToString() + "+";
                viewModelTemplate.txtNites = "by selecting dates, No. of nights in each city and your departure city.";
            }
            else
            {
                ntsString = viewModelTemplate.packNoNts.ToString() + " ";
                viewModelTemplate.txtNites = "Select date, and your departure city";
            }
            viewModelTemplate.P2P = 1;
            if (viewModelTemplate.packKinds.IndexOf("1155:") > 0) { viewModelTemplate.SelfDrive = 1; }
            if (viewModelTemplate.packKinds.IndexOf("1434:") > 0) { viewModelTemplate.P2P = 1; }
            if (viewModelTemplate.packKinds.IndexOf("1351:") > 0) { viewModelTemplate.Cruise = 1; }
            if (viewModelTemplate.packKinds.IndexOf("2792:") > 0) { viewModelTemplate.isTMGuided = 1; }
            if (viewModelTemplate.packKinds.IndexOf("1787:") > 0) { viewModelTemplate.isGuided = 1; }
            switch (viewModelTemplate.packType)
            {
                case 1266:
                case 495:
                    viewModelTemplate.sortFlag = "P";
                    break;
                default:
                    viewModelTemplate.sortFlag = "";
                    if (viewModelTemplate.packKinds.IndexOf("1434:.") > 0) { viewModelTemplate.P2P = 1; } else { viewModelTemplate.P2P = 0; }
                    break;
            }
            if (viewModelTemplate.SelfDrive == 1)
            { viewModelTemplate.webTIC = "Rental Car"; }
            else
            {
                if (viewModelTemplate.P2P == 1)
                {
                    viewModelTemplate.webTIC = "Regional Air";
                }
                else
                {
                    viewModelTemplate.webTIC = "Cruise";
                }
            }
            string stringCityIDs;
            if (viewModelTemplate.packKinds.IndexOf(_appSettings.ApplicationSettings.intCom) == 0)
                viewModelTemplate.verifySite = 1;
            if (viewModelTemplate.verifySite == 1)
            {
                viewModelTemplate.stringCityIDs = viewModelTemplate.packCityID.ToString();
                return View("PackTemplate_21", viewModelTemplate);
            }

            //RELATED ITINERARIES
            var Result4 = await _dapperWrap.GetRecords<RelatedItineraries>(SqlCalls.SQL_PackageRelatedItineraries(viewModelTemplate.relatedItin, false));
            viewModelTemplate.PackRelItins = Result4.ToList();

            //SAMPLE PRICES --- moved to an ajax call 
            //var Result5 = await _dapperWrap.GetRecords<PackPrices>(SqlCalls.SQL_PackageSamplePrices_ED(id));
            //viewModelTemplate.listHistory = Result5.ToList();
            //if (viewModelTemplate.listHistory.Count() > 0)
            //{
            //    viewModelTemplate.listHistory = viewModelTemplate.listHistory.Select(x => new PackPrices { PLC_Title = x.PLC_Title, REAID = x.REAID, REA_AirTax = x.REA_AirTax, REA_Nights = x.REA_Nights, REA_StartDate = x.REA_StartDate, REA_TotalPrice = x.REA_TotalPrice, REA_Itinerary = x.REA_Itinerary }).ToList();
            //}
            //BLOCK DEPARTURES DATE
            List<PackageCMS> ListPackCMS = new List<PackageCMS>();
            System.Xml.XmlDocument xmlCities = new XmlDocument();
            List<FixDates> dvFixDates = new List<FixDates>();
            List<Blackouts> dvBlckDates = new List<Blackouts>();
            var Result10 = await _dapperWrap.GetRecords<Blackouts>(SqlCalls.SQL_PackageHotelBlackoutsList(id));
            dvBlckDates = Result10.ToList();
            if (dvBlckDates.Count > 0)
            {
                if (dvBlckDates.First().blacklist != "-")
                {
                    viewModelTemplate.BkDates = "B" + "-" + dvBlckDates.First().blacklist;
                }
                else
                {
                    viewModelTemplate.BkDates = "0";
                }
            }
            viewModelTemplate.BkDates = viewModelTemplate.BkDates.Replace(",", "*");

            //FIX DEPARTURES DATES
            var Result9 = await _dapperWrap.GetRecords<FixDates>(SqlCalls.SQL_PackageFixDates(id));
            dvFixDates = Result9.ToList();
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
                viewModelTemplate.FxDates = "F" + "-" + fixeds;
                viewModelTemplate.fixNetDts = fixeds;
            }
            else
            {
                viewModelTemplate.FxDates = "0";
                viewModelTemplate.fixNetDts = "0";
            }
            viewModelTemplate.FxDates = viewModelTemplate.FxDates.Replace(",", "*");

            //RELATED PACKAGES
            var Result3 = await _dapperWrap.GetRecords<PackageRelatedPlacesInfo_WithCMSs>(templVal > 21 ? SqlCalls.SQL_PackageRelatedPlacesInfo_WithCMSs(id) : SqlCalls.SQL_PackageRelatedPlacesInfo_WithCMSs_short(id));
            viewModelTemplate.PackRelatedPlaces = Result3.ToList();
            viewModelTemplate.ListRelPacks = viewModelTemplate.PackRelatedPlaces.Where(y => y.N == 1)
                .Select(x => new RelPacks { Str_PlaceTypeId = x.Str_PlaceTypeId, Cxz_ChildPlaceId = x.PlaceId, NoOfPacks = x.NoOfPacks, Str_PlaceTitle = x.Str_PlaceTitle, UserID = x.STR_UserID }).ToList();
            if (templVal > 21)
            {
                viewModelTemplate.CountriesNoOfFeeds = new List<PlaceInfoSummary>();
                if (viewModelTemplate.ListRelPacks.Where(x => x.Str_PlaceTypeId == 5).Count() > 0)
                {
                    viewModelTemplate.CountriesNoOfFeeds = viewModelTemplate.PackRelatedPlaces.Where(x => x.Str_PlaceTypeId == 5 && x.N == 1).Select(y => new PlaceInfoSummary { Id = y.PlaceId, Name = y.Str_PlaceTitle, NoOfFeeds = y.NoOfFeeds, NoOfPacks = y.NoOfPacks, OverAll = y.OverAll, STR_UserID = y.STR_UserID }).OrderBy(x => x.Name).ToList();
                    viewModelTemplate.packFeedCountC = viewModelTemplate.CountriesNoOfFeeds.Where(x => x.Id == viewModelTemplate.packCountryID).First().NoOfFeeds;
                }
            }
            //TO BUILD CMS Country Info if FAQ is none TABS - add multiply countries
            if (viewModelTemplate.PackRelatedPlaces.Count > 0)
            {
                viewModelTemplate.countriesCMS = viewModelTemplate.PackRelatedPlaces.Where(x => x.N == 1 && x.Str_PlaceTypeId == 5).Select(x => new PlaceInfo { STR_PlaceID = x.PlaceId, STR_PlaceTitle = x.Str_PlaceTitle, STR_PlaceShortInfo = x.STR_PlaceShortInfo }).ToList();
                foreach (var p in viewModelTemplate.countriesCMS)
                {
                    p.CMSs = new List<CMScountry>();
                    Int32 placeId = p.STR_PlaceID;
                    List<CMScountry> cmsList_ = viewModelTemplate.PackRelatedPlaces.Where(x => x.PlaceId == placeId && (x.CMSW_RelatedCmsID ?? 0) != 0).Select(x => new CMScountry { CMSW_Order = x.CMSW_Order, CMSW_RelatedCmsID = x.CMSW_RelatedCmsID, CMSW_Title = x.CMSW_Title, CMS_Description = x.CMS_Description }).OrderBy(x => x.CMSW_Order).ToList();
                    if (cmsList_.Count > 0)
                    {
                        p.CMSs = cmsList_;
                    }
                }
            }

            //Pack CMS 
            var Result7 = await _dapperWrap.GetRecords<PackageCMS>(SqlCalls.SQL_PackageCMS(id));
            ListPackCMS = Result7.ToList();
            if (ListPackCMS.Count > 0)
            {
                viewModelTemplate.itiID = ListPackCMS.First().PICMS_ItineraryCMSID;
                viewModelTemplate.itinContent = ListPackCMS.First().PICMS_ItineraryCMSContent;
                viewModelTemplate.priID = ListPackCMS.First().PICMS_PriceCMSID;
                viewModelTemplate.accID = ListPackCMS.First().PICMS_AccommodationCMSID;
                viewModelTemplate.hotelContent = ListPackCMS.First().CMSHotel;
                viewModelTemplate.actID = ListPackCMS.First().PICMS_ActivityCMSID;
                viewModelTemplate.activitiesContent = ListPackCMS.First().CMSActivities;
                viewModelTemplate.traID = ListPackCMS.First().PICMS_TransferCMSID;
                viewModelTemplate.faqID = ListPackCMS.First().PICMS_FAQCMSID;
                viewModelTemplate.ovrID = ListPackCMS.First().PICMS_OverviewCMSID;
            }


            //PACK FEEDBACKS
            var Result6 = await _dapperWrap.GetRecords<NameObject>(SqlCalls.SQL_PackageFeedbacksSummary(id));
            viewModelTemplate.PackFeedsSum = Result6.ToList();
            if (viewModelTemplate.PackFeedsSum.Count > 0)
            {
                if (viewModelTemplate.PackFeedsSum.Where(x => x.Id == 3).Count() > 0)
                {
                    viewModelTemplate.arrFeedUp.Add(viewModelTemplate.PackFeedsSum.Where(x => x.Id == 3).First().Name);
                }
                if (viewModelTemplate.PackFeedsSum.Where(x => x.Id == 1).Count() > 0)
                {
                    viewModelTemplate.packFeedCount = Int32.Parse(viewModelTemplate.PackFeedsSum.Where(x => x.Id == 1).First().Name);
                }
                if (viewModelTemplate.PackFeedsSum.Where(x => x.Id == 2).Count() > 0)
                {
                    decimal _overAll;
                    if (Decimal.TryParse(viewModelTemplate.PackFeedsSum.Where(x => x.Id == 2).First().Name, out _overAll))
                    {
                        viewModelTemplate.overAll = Decimal.Round(_overAll, 1);
                    }
                }
            }

            //PRICE GUIDANCE
            //Commented to hide the price guidance tab from template
            //var Result8 = await _dapperWrap.GetRecords<PriceGuidance>(SqlCalls.SQL_PriceGuidance(id));
            //viewModelTemplate.listPrices = Result8.ToList();


            //XML COMPONENTS CONTENT
            xmlCities = Utilities.PackageComponentListData(Int32.Parse(id), _awsParameterStoreService.SqlConnectionString);
            StringBuilder strCityID = new StringBuilder();
            StringBuilder strCitySEQ = new StringBuilder();
            StringBuilder minIDs = new StringBuilder();
            StringBuilder strCompID = new StringBuilder();
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
            viewModelTemplate.strTinTout = new List<string>();
            viewModelTemplate.minPackID = "";
            List<string> strSS = new List<string>();
            viewModelTemplate.xmlCities = xmlCities.GetElementsByTagName("Component");
            foreach (XmlNode cty in viewModelTemplate.xmlCities)
            {
                if (cty.SelectSingleNode("ProdType").InnerText == "H" || cty.SelectSingleNode("ProdType").InnerText == "P")
                {
                    try
                    {
                        if (ctyC == 0)
                        {
                            strCompID.Append(cty.SelectSingleNode("cmp_PDLComponentID").InnerText);
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
                            strCompID.Append(cty.SelectSingleNode("cmp_PDLComponentID").InnerText);
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

                        }
                        catch (System.IO.IOException e)
                        {
                            throw new Exception(" nxcty 'P' <div>" + e.Message + "</div>");
                        }
                        viewModelTemplate.minPackID = minIDs.ToString();
                    }

                    ctyC += 1;

                    string cityId = cty.SelectSingleNode("CityID").InnerText;
                    string countryId = cty.SelectSingleNode("CountryID").InnerText;

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
                                XmlNodeList transportsCar = cty.SelectNodes("//Component[./ProdType/text()='C' and ./CityID/text()=" + cityId + " and ./cmp_CitySeq/text()=" + ctySQ + "]");
                                if (transportsCar.Count > 0)
                                {
                                    strCitySEQ.Append("|By Car");
                                }
                                else
                                {
                                    strCitySEQ.Append("|none");
                                }
                                break;
                        }
                        strCitySEQ.Append("|" + cty.SelectSingleNode("CountryID").InnerText);
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
                                    viewModelTemplate.strTinTout.Add(transp.SelectSingleNode("cmp_CitySeq").InnerText + "^" + transp.SelectSingleNode("cmp_RelativeDay").InnerText + "^" + transp.SelectSingleNode("Title").InnerText + "^" + transp.SelectSingleNode("cmp_ProductFF1").InnerText);
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
                        strCitySEQ.Append("|" + cty.SelectSingleNode("CountryID").InnerText);
                    }
                }

                //XML COMPONENTS CONTENT  - SS
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
            viewModelTemplate.stringCityIDs = strCityID.ToString();
            viewModelTemplate.howManyCtys = strCitySEQ.ToString().Split("@").Count();
            //GET CITY INFO and CMS
            foreach (string seq in strCitySEQ.ToString().Split("@"))
            {
                string[] seqParts = seq.Split("|");
                string[] dayDur_and_avNite = seqParts[2].Split("^");
                CitySquence cSq = new CitySquence()
                {
                    Id = Int32.Parse(seqParts[0]),
                    Sequence = Int32.Parse(seqParts[1]),
                    ProdType = seqParts[3],
                    ProdTitle = seqParts[4],
                    OverNite = seqParts[5],
                    DaysDuration = dayDur_and_avNite[0],
                    NoOfAvailNite = dayDur_and_avNite[1],
                    Transportation = seqParts[6],
                    CMSs = new List<CMScountry>()
                };
                IEnumerable<PackageRelatedPlacesInfo_WithCMSs> dr = viewModelTemplate.PackRelatedPlaces.Where(q => q.PlaceId.ToString() == seqParts[0] && q.N == 1 && (q.Str_PlaceTypeId == 25 || q.Str_PlaceTypeId == 1));
                if (dr.Count() > 0)
                {
                    cSq.Name = dr.First().Str_PlaceTitle;
                    cSq.NoOfHotels = dr.First().NoOfHotels;
                    cSq.NoOfSS = dr.First().NoOfSS;
                    cSq.PlaceShortInfo = dr.First().STR_PlaceShortInfo;
                    cSq.Division = (dr.First().STR_UserID == 243) ? "europe" : (dr.First().STR_UserID == 595) ? "asia" : "latin";
                    List<CMScountry> cmsList_ = viewModelTemplate.PackRelatedPlaces.Where(q => q.PlaceId.ToString() == seqParts[0] && (q.CMSW_RelatedCmsID ?? 0) != 0).Select(x => new CMScountry() { CMSW_Order = x.CMSW_Order, CMSW_RelatedCmsID = x.CMSW_RelatedCmsID, CMSW_Title = x.CMSW_Title, CMS_Description = x.CMS_Description }).OrderBy(x => x.CMSW_Order).ToList();
                    if (cmsList_.Count > 0) cSq.CMSs = cmsList_;
                    List<PackageRelatedPlacesInfo_WithCMSs> countryList = viewModelTemplate.PackRelatedPlaces.Where(c => c.PlaceId.ToString() == seqParts[7] && c.N == 1 && c.Str_PlaceTypeId == 5).ToList();
                    if (countryList.Count > 0)
                    {
                        cSq.CountryName = countryList.FirstOrDefault().Str_PlaceTitle;
                    }
                    else
                    {
                        cSq.CountryName = Country;
                    }
                }
                viewModelTemplate.citySeq.Add(cSq);
                viewModelTemplate.citiesInfo.Append(cSq.Id + "|" + cSq.Division + "|" + cSq.CountryName + "@");
            }

            //MiniPacks Tasks
            if (viewModelTemplate.minPackID != "")
            {
                //List<MiniPacks> dvminPack = dbConn.QueryAsync<MiniPacks>(SqlCalls.SQL_MiniPackageInformation(viewModelTemplate.minPackID)).Result.ToList();
                var Result11 = await _dapperWrap.GetRecords<MiniPacks>(SqlCalls.SQL_MiniPackageInformation(viewModelTemplate.minPackID));
                List<MiniPacks> dvminPack = Result11.ToList();
                for (Int32 mn = 0; mn < dvminPack.Count; mn++)
                {
                    if (mn > 0)
                    {
                        viewModelTemplate.minPackDESc.Append("@");
                    }
                    viewModelTemplate.minPackDESc.Append(dvminPack[mn].SPD_StatePlaceID + "||" + dvminPack[mn].PDL_Description);
                }
            }

            switch (templVal)
            {
                case 25:
                case 26:
                    //MiniPacks Tasks
                    if (viewModelTemplate.minPackID != "")
                    {
                        //List<MiniPacks> dvminPack = dbConn.QueryAsync<MiniPacks>(SqlCalls.SQL_MiniPackageInformation(viewModelTemplate.minPackID)).Result.ToList();
                        var Result12 = await _dapperWrap.GetRecords<MiniPacksCat>(SqlCalls.SQL_MiniPackageCategories(viewModelTemplate.minPackID));
                        viewModelTemplate.minPackCategories = Result12.ToList();
                    }

                    if (templVal == 25)
                    {
                        if (Utilities.CheckMobileDevice() == false)
                        {
                            ViewBag.viewUsedName = "PackTemplate_25";
                            PackageView = "PackTemplate_25";
                        }
                        else
                        {
                            ViewBag.viewUsedName = "PackTemplate_24_26_Mob";
                            PackageView = "PackTemplate_24_26_Mob";
                        }
                    }
                    else
                    {
                        if (Utilities.CheckMobileDevice() == false)
                        {
                            ViewBag.viewUsedName = "PackTemplate_26";
                            PackageView = "PackTemplate_26";
                        }
                        else
                        {
                            ViewBag.viewUsedName = "PackTemplate_24_26_Mob";
                            PackageView = "PackTemplate_24_26_Mob";
                        }
                    }


                    break;
                case 21:
                    // Top T21 Page images
                    var Result13 = await _dapperWrap.GetRecords<PicsPackage>(SqlCalls.SQL_Top3PackImag(id));
                    viewModelTemplate.topPicsPack = Result13.ToList();

                    ViewBag.viewUsedName = "PackTemplate_21";
                    if (viewModelTemplate.isTMGuided == 1)
                    {
                        PackageView = "PackTemplate_21_Guided";
                    }
                    else
                    {
                        PackageView = "PackTemplate_21";
                    }

                    break;
                default:
                    ViewBag.viewUsedName = "PackTemplate_24_26";
                    PackageView = "PackTemplate_24_26";
                    viewModelTemplate = new Models.ViewModels.PackTemplate_21ViewModel();
                    break;
            }

            return View(PackageView, viewModelTemplate);
        }

        [HttpGet("/package/GetCustFeed/{tabType}/{page}/{id}", Name = "CustFeed_Route")]
        public async Task<IActionResult> GetCustFeed(string tabType, Int32 page, string id)
        {
            int numId;
            if (tabType != "P" && tabType != "C") { return BadRequest(); }
            if (!int.TryParse(id, out numId)) { return BadRequest(); }
            var Result1 = await _dapperWrap.GetRecords<CustomerFeedback>(SqlCalls.SQL_CustomerFeedbacks_By_Page(tabType, page, id));
            List<CustomerFeedback> ListCustFeed = Result1.ToList();
            return View("Get_CustomerFeedBackPage", ListCustFeed);
        }

        static bool IsArrDateInRange(string promArrDate, string disStartDate, string disEndDate)
        {
            // Define the date format
            string format = "MM/dd/yyyy";
            //// Try parsing the strings into DateTime objects
            if (DateTime.TryParseExact(disStartDate, format, null, DateTimeStyles.None, out DateTime startDate) &&
                DateTime.TryParseExact(disEndDate, format, null, DateTimeStyles.None, out DateTime endDate) &&
                DateTime.TryParseExact(promArrDate, format, null, DateTimeStyles.None, out DateTime date))
            {
                // Check if the date is within the range (inclusive)
                return date >= startDate && date <= endDate;
            }

            // Return false if parsing fails
            return false;
        }

        static bool IsBookDateInRange(string today, string bookStartDate, string bookEndDate)
        {
            // Define the date format
            string format = "MM/dd/yyyy";
            //// Try parsing the strings into DateTime objects
            if (DateTime.TryParseExact(bookStartDate, format, null, DateTimeStyles.None, out DateTime startDate) &&
                DateTime.TryParseExact(bookEndDate, format, null, DateTimeStyles.None, out DateTime endDate) &&
                DateTime.TryParseExact(today, format, null, DateTimeStyles.None, out DateTime date))
            {
                // Check if the date is within the range (inclusive)
                return date >= startDate && date <= endDate;
            }

            // Return false if parsing fails
            return false;
        }

    }
}
