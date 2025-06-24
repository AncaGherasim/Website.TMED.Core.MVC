using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MVC_TMED.Infrastructure;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using MVC_TMED.Models.ViewModels;
using MVC_TMED.Models;
using System.Text;
using Newtonsoft.Json;

namespace MVC_TMED.Controllers
{
    public class CombineController : Controller
    {
        private readonly AppSettings _appSettings;
        private readonly DapperWrap _dapperWrap;

        public CombineController(IOptions<AppSettings> appSettings, DapperWrap dapperWrap)
        {
            _appSettings = appSettings.Value;
            _dapperWrap = dapperWrap;
        }

        [HttpGet("{names}/Combine/", Name = "Combine_Route")] //italy/combine
        [HttpHead("{names}/Combine/", Name = "Combine_Route")]
        [HttpPost("{names}/Combine/", Name = "Combine_Route")]
        public async Task<IActionResult> Index(string names)
        {
            
            FindViewModel findViewModel = new FindViewModel();

            findViewModel.placeNA = names;
            findViewModel.destNAs = names.Replace("_-_", "','").Replace("_", " ");
            findViewModel.destNAs = "'" + findViewModel.destNAs.Replace("-", " ") + "'";

            var result1 = await _dapperWrap.GetRecords<PlacesHierarchy>(SqlCalls.SQL_Vacations_Places_Hierarchy(findViewModel.destNAs, true));
            findViewModel.placeHierarchy = result1.ToList();
            if (findViewModel.placeHierarchy.Count == 0)
            {
                return NotFound();
            }
            foreach (var p in findViewModel.placeHierarchy)
            {
                findViewModel.placeID = findViewModel.placeID + "," + p.STR_PlaceID.ToString();
                findViewModel.placeIDs.Add(p.STR_PlaceID);
            }
            findViewModel.placeID = findViewModel.placeID.Substring(1, findViewModel.placeID.Length - 1);

            string[] strNAsP = names.Split("_-_");
            if (strNAsP.Length == 1)
            {
                findViewModel.pageTitle = strNAsP[0].Replace("_", " ");
                findViewModel.pageTitle = Utilities.UppercaseFirstLetter(findViewModel.pageTitle.Replace(" and ", "&"));
                findViewModel.navLinks = Utilities.UppercaseFirstLetter(strNAsP[0].Replace("_", " "));
            }
            else
            {
                for (Int32 n = 0; n < strNAsP.Length; n++)
                {
                    if (n == 0)
                    {
                        findViewModel.pageTitle = Utilities.UppercaseFirstLetter(strNAsP[n].Replace(" and ", "&").Replace("_", " "));
                        findViewModel.navLinks = findViewModel.navLinks + Utilities.UppercaseFirstLetter(strNAsP[n].Replace("_", " "));
                    }
                    else
                    {
                        findViewModel.pageTitle = findViewModel.pageTitle + " - " + Utilities.UppercaseFirstLetter(strNAsP[n].Replace(" and ", "&").Replace("_", " "));
                        findViewModel.navLinks = findViewModel.navLinks + "|" + Utilities.UppercaseFirstLetter(strNAsP[n].Replace("_", " "));
                    }
                }
            }

            string pgTitle = "  Combinations for: " + findViewModel.pageTitle;
            string pageMetaDesc = "Plan an unforgettable vacation to Europe with Tripmasters today. Find custom multi-city, multi-country vacation packages that are sure to suit every travelers desire.";
            string pageMetaKey = "Europe vacations, European tours, Europe tour packages, vacation packages, to Europe, hotel deals, online booking, pricing, information, hotel travel, hotel, resort, accommodations, Europe, France, Paris, England, London, Netherlands, Italy, Spain";
            ViewBag.PageTitle = pgTitle;
            ViewBag.pageMetaDesc = pageMetaDesc;
            ViewBag.pageMetaKey = pageMetaKey;
            ViewBag.tmpagetype = "combine";
            ViewBag.tmpagetypeinstance = "";
            ViewBag.tmrowid = "";
            ViewBag.tmadstatus = "";
            ViewBag.tmregion = "europe";
            ViewBag.tmcountry = "";
            ViewBag.tmdestination = "";

            if (findViewModel.placeID != "")
            {
                var jsonResult = await _dapperWrap.pgJsonGetRecordsAsync<PacksByPlaceID_PG>(PostgresCalls.PG_Func_PackagesbyListPlaceids(), 4, new { UserId = 243, PlaceId = findViewModel.placeIDs.ToArray(), CountriesNo = findViewModel.placeIDs.Count });
                if (string.IsNullOrWhiteSpace(jsonResult))
                {
                    return NotFound();
                }
                PacksByPlaceID_PG resultObject = JsonConvert.DeserializeObject<PacksByPlaceID_PG>(jsonResult);
                findViewModel.allPackages = resultObject;

                findViewModel.Countries_ = findViewModel.allPackages.cities
                    .GroupBy(c => new { c.counid, c.counname })
                    .Select(g => new CountryWithCitiesPG
                    {
                        counid = g.Key.counid,
                        counname = g.Key.counname,
                        isfixed = findViewModel.placeID.Split(",").Contains(g.Key.counid)
                    })
                    .OrderBy(x => x.counname)
                    .ToList();
            }

            return View("Combine", findViewModel);
        }
    }
}
