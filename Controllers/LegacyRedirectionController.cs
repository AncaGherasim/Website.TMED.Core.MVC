using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using MVC_TMED.Infrastructure;
using System.Threading.Tasks;
using MVC_TMED.Models;
using System.Collections.Generic;
using System.Linq;

namespace MVC_TMED.Controllers
{

    public class LegacyRedirectionController : Controller
    {
        private readonly IOptions<AppSettings> _appSettings;
        private readonly DapperWrap _dapperWrap;

        public LegacyRedirectionController(IOptions<AppSettings> appsettings, DapperWrap dapperWrap)
        {
            _appSettings = appsettings;
            _dapperWrap = dapperWrap;
        }

        [HttpGet("/cms/{urlpath1}/{urlpath2}.aspx", Name = "Aspx3")]
        [HttpHead("/cms/{urlpath1}/{urlpath2}.aspx", Name = "Aspx3")]
        [HttpPost("/cms/{urlpath1}/{urlpath2}.aspx", Name = "Aspx3")]
        public IActionResult FancyUrlRedirect3(string urlpath1, string urlpath2, string urlpath3)
        {
            return RedirectPermanent(_appSettings.Value.ApplicationSettings.SiteName + "/cms/" + urlpath1 + Request.QueryString);
        }

        [HttpGet("/Interest/{urlpath1}/{urlpath2}/{urlpath3}.aspx", Name = "Aspx4")]
        [HttpHead("/Interest/{urlpath1}/{urlpath2}/{urlpath3}.aspx", Name = "Aspx4")]
        [HttpPost("/Interest/{urlpath1}/{urlpath2}/{urlpath3}.aspx", Name = "Aspx4")]
        public async Task<IActionResult> FancyUrlRedirect6(string urlpath1, string urlpath2, string urlpath3)
        {
            var newUrl = "";
            switch (true)
            {
                ///interest/c4034/i1986/New_Zealand_-_North_Island.aspx -> 
                ///interest/c4034/i1894/Rotorua_Geothermal_Wonderland.aspx -> 
                case true when Regex.IsMatch(urlpath1, @"\b(c)", RegexOptions.IgnoreCase):
                    var Result = await _dapperWrap.GetRecords<MasterInterestContentTemplate>(SqlCalls.SQL_PageTemplate_PlaceCodeID_MasterInterestContent(urlpath2.Replace("i", ""), urlpath1.Replace("c", "")));
                    List<MasterInterestContentTemplate> dvInterest = Result.ToList();
                    string countryname = dvInterest[0].STR_PlaceTitle;
                    return RedirectPermanent(_appSettings.Value.ApplicationSettings.SiteName + "/" + countryname.Replace(" ", "_").ToLower() + "/" + urlpath3 + "/interest-" + urlpath2.Replace("i", "") + "-" + urlpath1.Replace("c", "") + Request.QueryString);

                default:
                    newUrl = "/";
                    return Redirect(newUrl);
            }
        }

        [HttpGet("{urlpath1}/{urlpath2}.aspx", Name = "Aspx2")]
        [HttpHead("{urlpath1}/{urlpath2}.aspx", Name = "Aspx2")]
        [HttpPost("{urlpath1}/{urlpath2}.aspx", Name = "Aspx2")]
        public async Task<IActionResult> FancyUrlRedirect2(string urlpath1, string urlpath2)
        {
            var newUrl = "";
            switch (true)
            {
                ///All_Packages/Argentina_Vacations.aspx or /All_Packages/Puerto%20Rico_Vacations.aspx
                case true when Regex.IsMatch(urlpath1, @"\b(All_Packages)", RegexOptions.IgnoreCase) && Regex.IsMatch(urlpath2, @"(?<c>\w*)(_Vacations)", RegexOptions.IgnoreCase):
                    var country = urlpath2.ToLower().Substring(0, urlpath2.ToLower().IndexOf("_vacations")).Replace(" ", "_");
                    return RedirectPermanent(_appSettings.Value.ApplicationSettings.SiteName + "/" + country + "/all_vacation_packages" + Request.QueryString);

                ///Colombia/Itinerary_pk62227_Bogota_-_Medellin_-_Cartagena_by_Air.aspx 
                case true when Regex.IsMatch(urlpath2, @"(Itinerary_pk)(\d*)(_)(\D+)", RegexOptions.IgnoreCase):
                    var id2 = urlpath2.ToLower().Substring(12, urlpath2.ToLower().IndexOf("_", 12) - 12);
                    var name2 = urlpath2.ToLower().Substring(urlpath2.ToLower().IndexOf(id2) + id2.Length + 1).Replace(" ", "_");
                    return RedirectPermanent(_appSettings.Value.ApplicationSettings.SiteName + "/" + urlpath1.ToLower().Replace(" ", "_") + "/" + name2 + "/package-" + id2 + Request.QueryString);

                ///Bogota/Hotel_Description_pp155662_Mika_Suites_Hotel.aspx or /Buenos%20Aires/Hotel_Description_pp107509_Palacio_Duhau_-_Park_Hyatt_Buenos_Aires.aspx
                case true when Regex.IsMatch(urlpath2, @"(Hotel_Description_pp)(\d+)(\w+)", RegexOptions.IgnoreCase):
                    var id3 = urlpath2.ToLower().Substring(20, urlpath2.ToLower().IndexOf("_", 20) - 20);
                    var name3 = urlpath2.ToLower().Substring(urlpath2.ToLower().IndexOf(id3) + id3.Length + 1).Replace(" ", "_");
                    var result0 = await _dapperWrap.GetRecords<PlaceInfo_By_PlaceName>(SqlCalls.SQL_PlaceInfo_By_PlaceName(urlpath1));
                    var couName = result0.ToList()[0].CountryNA.ToLower();
                    return RedirectPermanent(_appSettings.Value.ApplicationSettings.SiteName + "/" + couName + "/" + urlpath1.ToLower().Replace(" ", "_") + "/" + name3 + "/hotel-" + id3 + Request.QueryString);

                ///Area/The_Amazon_Vacations.aspx
                case true when Regex.IsMatch(urlpath1, @"\b(Area)", RegexOptions.IgnoreCase) && Regex.IsMatch(urlpath2, @"(?<c>\w*)(_Vacations)", RegexOptions.IgnoreCase):
                    var area = urlpath2.ToLower().Substring(0, urlpath2.ToLower().IndexOf("_vacations")).Replace(" ", "_");
                    ///{placeName}/area/vacations
                    return RedirectPermanent(_appSettings.Value.ApplicationSettings.SiteName + "/" + area + "/area/vacations" + Request.QueryString);

                ///{site}/{title}/Best_vacations
                case true when Regex.IsMatch(urlpath1, @"\b(Best_Vacations)", RegexOptions.IgnoreCase):
                    var name5 = urlpath2;
                    return RedirectPermanent(_appSettings.Value.ApplicationSettings.SiteName + "/" + name5.ToLower() + "/best_vacations" + Request.QueryString);

                ///
                case true when Regex.IsMatch(urlpath1, @"\b(Self_Drive)", RegexOptions.IgnoreCase):
                    var name6 = urlpath2.Replace("_Vacations", "");
                    ///
                    return RedirectPermanent(_appSettings.Value.ApplicationSettings.SiteName + "/" + name6.ToLower() + "/self_drive" + Request.QueryString);

                ///Italy/tkby71_Trips_Taken_to_Italy.aspx
                case true when Regex.IsMatch(urlpath2, @"(?<c>\w*)(_Trips_Taken_to_)", RegexOptions.IgnoreCase):
                    var country3 = urlpath1;
                    return RedirectPermanent(_appSettings.Value.ApplicationSettings.SiteName + "/" + country3 + "/trips_taken_by_travelers" + Request.QueryString);

                default:
                    newUrl = "/";
                    return Redirect(newUrl);
            }
        }

        [HttpGet("{urlpath1}/{urlpath2}/{urlpath3}.aspx", Name = "Aspx7")]
        [HttpHead("{urlpath1}/{urlpath2}/{urlpath3}.aspx", Name = "Aspx7")]
        [HttpPost("{urlpath1}/{urlpath2}/{urlpath3}.aspx", Name = "Aspx7")]
        public IActionResult FancyUrlRedirect7(string urlpath1, string urlpath2, string urlpath3)
        {
            var newUrl = "";
            switch (true)
            {
                ///Country/Self_Drive/Ireland_Vacations.aspx
                case true when Regex.IsMatch(urlpath2, @"\b(Self_Drive)", RegexOptions.IgnoreCase):
                    var name7 = urlpath3.Replace("_Vacations", "", System.StringComparison.OrdinalIgnoreCase);
                    ///Ireland/self_drive        
                    return RedirectPermanent(_appSettings.Value.ApplicationSettings.SiteName + "/" + name7.ToLower() + "/self_drive" + Request.QueryString);

                default:
                    newUrl = "/";
                    return Redirect(newUrl);
            }
        }

        [HttpGet("{urlpath1}.aspx", Name = "Aspx1")]
        [HttpHead("{urlpath1}.aspx", Name = "Aspx1")]
        [HttpPost("{urlpath1}.aspx", Name = "Aspx1")]
        public async Task<IActionResult> FancyUrlRedirect1(string urlpath1)
        {
            var newUrl = "";
            switch (true)
            {
                ///Cruises_in_Australia.aspx
                case true when Regex.IsMatch(urlpath1, @"(?<c>\w*)(Cruises_in_)", RegexOptions.IgnoreCase):
                    var cruise_country = urlpath1.ToLower().Substring(11).Replace(" ", "_");
                    return RedirectPermanent(_appSettings.Value.ApplicationSettings.SiteName + "/" + cruise_country + "/cruise" + Request.QueryString);

                ///Cartagena_Vacations.aspx
                case true when Regex.IsMatch(urlpath1, @"(?<c>\w*)(_Vacations)", RegexOptions.IgnoreCase):
                    var country_city = urlpath1.ToLower().Substring(0, urlpath1.ToLower().IndexOf("_vacations")).Replace(" ", "_");
                    var plcHierarchy = await _dapperWrap.GetRecords<PlacesHierarchy>(SqlCalls.SQL_Vacations_Places_Hierarchy(country_city));
                    List<PlacesHierarchy> placesHierarchies = plcHierarchy.ToList();
                    if (placesHierarchies.Count != 0)
                    {
                        switch (placesHierarchies.First().STR_PlaceTypeID)
                        {
                            case 1:
                            case 25:
                            case 5:
                                {
                                    return RedirectPermanent(_appSettings.Value.ApplicationSettings.SiteName + "/" + country_city + "/vacations" + Request.QueryString);
                                }
                            case 28:
                                {

                                    HttpContext.Response.Headers.Add("_utPg", "MLTYCOU");
                                    HttpContext.Response.Headers.Add("plcID", placesHierarchies[0].STR_PlaceID.ToString());
                                    var urlpath = HttpContext.Request.Path.Value.Split("/");
                                    return RedirectPermanent(_appSettings.Value.ApplicationSettings.SiteName + "/" + country_city + "/multicountry/vacations");
                                }
                            case 6:
                                {
                                    HttpContext.Response.Headers.Add("_utPg", "ARE");
                                    HttpContext.Response.Headers.Add("plcID", placesHierarchies[0].STR_PlaceID.ToString());
                                    return RedirectPermanent(_appSettings.Value.ApplicationSettings.SiteName + "/" + country_city + "/area/vacations");
                                }
                        }
                    }
                    return RedirectPermanent(_appSettings.Value.ApplicationSettings.SiteName + "/" + country_city + "/vacations" + Request.QueryString);

                ///Cartagena_Hotels.aspx
                case true when Regex.IsMatch(urlpath1, @"(?<c>\w*)(_Hotels)", RegexOptions.IgnoreCase):
                    var city2 = urlpath1.ToLower().Substring(0, urlpath1.ToLower().IndexOf("_hotels")).Replace(" ", "_");
                    var result2 = await _dapperWrap.GetRecords<PlaceInfoByName>(SqlCalls.SQL_GetPlaceInfoByName(urlpath1.ToLower().Substring(0, urlpath1.ToLower().IndexOf("_hotels"))));
                    var hotelInfo = result2.ToList();
                    return RedirectPermanent(_appSettings.Value.ApplicationSettings.SiteName + "/" + hotelInfo[0].couNA.Replace(" ", "_").ToLower() + "/" + city2 + "/hotels" + Request.QueryString);

                ///Cartagena_Activities.aspx
                case true when Regex.IsMatch(urlpath1, @"(?<c>\w*)(_Activities)", RegexOptions.IgnoreCase):
                    var city3 = urlpath1.ToLower().Substring(0, urlpath1.ToLower().IndexOf("_activities")).Replace(" ", "_");
                    var result3 = await _dapperWrap.GetRecords<PlaceInfo_By_PlaceName>(SqlCalls.SQL_PlaceInfo_By_PlaceName(urlpath1.ToLower().Substring(0, urlpath1.ToLower().IndexOf("_activities"))));
                    var placeInfo = result3.ToList();
                    return RedirectPermanent(_appSettings.Value.ApplicationSettings.SiteName + "/" + placeInfo[0].CountryNA.Replace(" ", "_").ToLower() + "/" + city3 + "/activities" + Request.QueryString);

                ///M_CityHotelsMap.aspx?plcID=1083&plcNA=Buenos%20Aires&couID=977&couNA=Argentina&wh=0&wf=0
                case true when Regex.IsMatch(urlpath1, @"(M_CityHotelsMap)", RegexOptions.IgnoreCase):
                    string qs = Request.QueryString.Value[1..];
                    string[] arrqs = qs.Split("&");
                    var plcNA = arrqs[1].Split("=")[1];
                    var couNA = arrqs[3].Split("=")[1];
                    return RedirectPermanent(_appSettings.Value.ApplicationSettings.SiteName + "/" + couNA + "/" + plcNA + "/hotelsmap?&wh=0&wf=0");

                ///Costa_Rica_CFB9668_Arenal_Volcano_-_Monteverde_-_Guanacaste_Beaches.aspx
                case true when Regex.IsMatch(urlpath1, @"(?<c>\w*)(_CFB)", RegexOptions.IgnoreCase):
                    var country = urlpath1.ToLower().Substring(0, urlpath1.ToLower().IndexOf("_cfb")).Replace(" ", "_");
                    var id = urlpath1.ToLower().Substring(urlpath1.ToLower().IndexOf("_cfb") + 4, urlpath1.ToLower().IndexOf("_", urlpath1.ToLower().IndexOf("_cfb") + 4) - (urlpath1.ToLower().IndexOf("_cfb") + 4)).Replace(" ", "_");
                    var title = urlpath1.ToLower().Substring(urlpath1.ToLower().IndexOf(id) + urlpath1.ToLower().IndexOf("_", urlpath1.ToLower().IndexOf("_cfb") + 4) - (urlpath1.ToLower().IndexOf("_cfb") + 4) + 1).Replace(" ", "_");
                    ///{countryName}/{Title}/feedback-{Id}
                    return RedirectPermanent(_appSettings.Value.ApplicationSettings.SiteName + "/" + country + "/" + title + "/feedback-" + id + Request.QueryString);

                ///tkby987_Trips_Taken_to_Prague.aspx
                case true when Regex.IsMatch(urlpath1, @"(?<c>\w*)(_Trips_Taken_to_)", RegexOptions.IgnoreCase):
                    var country3 = urlpath1.ToLower().Substring(urlpath1.ToLower().IndexOf("_trips_taken_to_") + 16).Replace(" ", "_");
                    return RedirectPermanent(_appSettings.Value.ApplicationSettings.SiteName + "/" + country3 + "/trips_taken_by_travelers" + Request.QueryString);

                ///Itinerary_pkbyo6609_Fly_and_Drive_the_Costa_Rican_Bird_Route.aspx
                case true when Regex.IsMatch(urlpath1, @"Itinerary_pkbyo", RegexOptions.IgnoreCase):
                    var id4 = urlpath1.ToLower().Substring(15, urlpath1.ToLower().IndexOf("_", 15) - 15);
                    var name4 = urlpath1.ToLower().Substring(urlpath1.ToLower().IndexOf(id4) + id4.Length + 1).Replace(" ", "_");
                    var Result4 = await _dapperWrap.GetRecords<PackInfo>(SqlCalls.SQL_PackageInformation(id4));
                    var ListPackInfobyo = Result4.ToList();
                    return RedirectPermanent(_appSettings.Value.ApplicationSettings.SiteName + "/" + ListPackInfobyo.First().STR_PlaceTitle.Replace(" ", "_").ToLower() + "/" + name4 + "/packagebyo-" + id4 + Request.QueryString);

                ///Itinerary_pk59989_Panama_City_and_Cartagena_by_Air.aspx
                case true when Regex.IsMatch(urlpath1, @"Itinerary_pk", RegexOptions.IgnoreCase):
                    var id2 = urlpath1.ToLower().Substring(12, urlpath1.ToLower().IndexOf("_", 12) - 12);
                    var name2 = urlpath1.ToLower().Substring(urlpath1.ToLower().IndexOf(id2) + id2.Length + 1).Replace(" ", "_");
                    var Result2 = await _dapperWrap.GetRecords<PackInfo>(SqlCalls.SQL_PackageInformation(id2));
                    var ListPackInfo = Result2.ToList();
                    return RedirectPermanent(_appSettings.Value.ApplicationSettings.SiteName + "/" + ListPackInfo.First().STR_PlaceTitle.Replace(" ", "_").ToLower() + "/" + name2 + "/package-" + id2 + Request.QueryString);

                default:
                    newUrl = "/";
                    return Redirect(newUrl);

            }
        }

        [HttpGet("/s/{urlpath1}", Name = "SEO1")]
        [HttpHead("/s/{urlpath1}", Name = "SEO1")]
        [HttpPost("/s/{urlpath1}", Name = "SEO1")]
        public IActionResult FancyUrlRedirect4(string urlpath1, string urlpath2)
        {
            var newUrl = "";
            switch (true)
            {
                //s/Argentina_Holidays or /s/Cayman_Islands_Holidays
                case true when Regex.IsMatch(urlpath1, @"(?<c>\w*)(_Holidays)", RegexOptions.IgnoreCase):
                    var country1 = urlpath1.ToLower().Substring(0, urlpath1.ToLower().IndexOf("_holidays")).Replace(" ", "_");
                    return RedirectPermanent(_appSettings.Value.ApplicationSettings.SiteName + "/" + country1 + "/holidays" + Request.QueryString);

                //s/Argentina_Travel
                case true when Regex.IsMatch(urlpath1, @"(?<c>\w*)(_Travel)", RegexOptions.IgnoreCase):
                    var country2 = urlpath1.ToLower().Substring(0, urlpath1.ToLower().IndexOf("_travel")).Replace(" ", "_");
                    return RedirectPermanent(_appSettings.Value.ApplicationSettings.SiteName + "/" + country2 + "/travel" + Request.QueryString);

                //s/Visit_Argentina or /s/Visit_Ecuador_and_Galapagos
                case true when Regex.IsMatch(urlpath1, @"(Visit_)(?<c>\w*)", RegexOptions.IgnoreCase):
                    var country3 = urlpath1.ToLower()[6..].Replace(" ", "_");
                    return RedirectPermanent(_appSettings.Value.ApplicationSettings.SiteName + "/" + country3 + "/visit" + Request.QueryString);

                //s/Trips_to_St_Vincent_and_the_Grenadines
                case true when Regex.IsMatch(urlpath1, @"(Trips_to_)(?<c>\w*)", RegexOptions.IgnoreCase):
                    var country4 = urlpath1.ToLower()[9..].Replace(" ", "_");
                    return RedirectPermanent(_appSettings.Value.ApplicationSettings.SiteName + "/" + country4 + "/trips" + Request.QueryString);

                default:
                    newUrl = "/";
                    return Redirect(newUrl);
            }
        }

        [HttpGet("/s/{urlpath1}/{urlpath2}", Name = "SEO2")]
        [HttpHead("/s/{urlpath1}/{urlpath2}", Name = "SEO2")]
        [HttpPost("/s/{urlpath1}/{urlpath2}", Name = "SEO2")]
        public IActionResult FancyUrlRedirect5(string urlpath1, string urlpath2)
        {
            var newUrl = "";
            switch (true)
            {
                //s/Argentina/Tours
                case true when urlpath2 == "Tours":
                    return RedirectPermanent(_appSettings.Value.ApplicationSettings.SiteName + "/" + urlpath1.ToLower().Replace(" ", "_") + "/tours" + Request.QueryString);
                default:
                    newUrl = "/";
                    return Redirect(newUrl);
            }
        }

    }
}