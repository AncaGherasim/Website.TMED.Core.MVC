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
using Dapper;
using Newtonsoft.Json;

namespace MVC_TMED.Controllers
{
    public class FindController : Controller
    {
        private readonly AppSettings _appSettings;
        private readonly DapperWrap _dapperWrap;
        private readonly AWSParameterStoreService _awsParameterStoreService;

        public FindController(IOptions<AppSettings> appSettings, DapperWrap dapperWrap, AWSParameterStoreService awsParameterStoreService)
        {
            _appSettings = appSettings.Value;
            _dapperWrap = dapperWrap;
            _awsParameterStoreService = awsParameterStoreService;
        }

        [HttpGet("{names}/find-packages", Name = "Find_Route")] //japan/find_Package
        [HttpHead("{names}/find-packages", Name = "Find_Route")]
        [HttpPost("{names}/find-packages", Name = "Find_Route")]
        public async Task<IActionResult> Index(string names)
        {
            FindViewModel findViewModel = new FindViewModel();


            findViewModel.destNAs = names.Replace("_-_", "','").Replace("_", " ");
            findViewModel.placeNA = Utilities.UppercaseFirstLetter(names.Replace("_-_", " - ").Replace(" - ", ", "));
            findViewModel.destNAs = "'" + findViewModel.destNAs.Replace("-", " ") + "'";
            findViewModel.destNAs = findViewModel.destNAs.Replace("~", "-");


            var result1 = await _dapperWrap.GetRecords<PlacesHierarchy>(SqlCalls.SQL_Vacations_Places_Hierarchy(findViewModel.destNAs, true));
            findViewModel.placeHierarchy = result1.ToList();
            if (findViewModel.placeHierarchy.Count > 0)
            {
                foreach (var p in findViewModel.placeHierarchy)
                {
                    findViewModel.placeID = findViewModel.placeID + "," + p.STR_PlaceID.ToString();
                    findViewModel.placeIDs.Add(p.STR_PlaceID);
                }
                findViewModel.placeID = findViewModel.placeID.Substring(1, findViewModel.placeID.Length - 1);
            }

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

            string pgTitle = " Itineraries for: " + findViewModel.pageTitle;
            string pageMetaDesc = "Customize multi-city and multi-country vacations with Tripmasters. View our Asia & South Pacific vacation packages today. Browse Asian travel itineraries and much more.";
            string pageMetaKey = "Asia vacations, vacation packages, trips to Asia, Australia, hotel deals, Tokyo, Sydney, online booking, pricing, information, hotel travel, hotel, resort, accommodations, Japan, China, India, Australia, Vietnam, Thailand, Indonesia";
            ViewBag.PageTitle = pgTitle;
            ViewBag.pageMetaDesc = pageMetaDesc;
            ViewBag.pageMetaKey = pageMetaKey;
            ViewBag.tmpagetype = "find";
            ViewBag.tmpagetypeinstance = "";
            ViewBag.tmrowid = "";
            ViewBag.tmadstatus = "";
            ViewBag.tmregion = "asia";
            ViewBag.tmcountry = "";
            ViewBag.tmdestination = "";

            //??????
            //    Master.Page.Title = pgTitle
            //' --- MODIFY ---
            //Dim header1 As HtmlHead = DirectCast(Master.FindControl("pageHead"), HtmlHead)
            //Dim metaDescr As HtmlMeta = header1.FindControl("PageDescription")
            //metaDescr.Content = pageMetaDesc
            //Dim metaKeywrd As HtmlMeta = header1.FindControl("PageKeyword")
            //metaKeywrd.Content = pageMetaKey

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
                        cities = g.Select(c => new CityPG
                        {
                            str_placeid = c.str_placeid,
                            str_placetitle = c.str_placetitle,
                            plcrk = c.plcrk,
                            isfixed = findViewModel.placeID.Split(",").Contains(c.str_placeid)
                        }).ToList()
                    })
                    .OrderBy(x => x.counname)
                    .ToList();
            }

            return View("Find", findViewModel);
        }

        [HttpPost("FindCusPackInfo")]
        public async Task<IActionResult> GET_FindCusPackInfo([FromBody] FindCusPackInfo findCusPackInfo)
        {
            FindCusPackInfoViewModel findCusPackInfoViewModel = new FindCusPackInfoViewModel();

            string PlaceId = findCusPackInfo.plcID;
            string OrderVal = findCusPackInfo.OrderVal;
            StringBuilder sqlFilter = new StringBuilder();
            string[] tmpParts;
            string[] tmpInterval;
            if (OrderVal.Trim() == "")
            {
                OrderVal = "0";
            }
            string filter = findCusPackInfo.filter;
            string[] filterParts = filter.Split("I");

            //Build filter
            if (filterParts[0].Trim() != "")
            {
                sqlFilter.Append(" WHERE (");
                tmpParts = filterParts[0].Split("P");
                for (Int32 i = 0; i <= tmpParts.Length - 2; i++)
                {
                    tmpInterval = tmpParts[i].Split("_");
                    if (tmpInterval[1] != "MAX")
                    {
                        sqlFilter.Append("(cast(ISNULL(STP_Save, 0) as Money) BETWEEN " + tmpInterval[0] + " AND " + tmpInterval[1] + ")");
                    }
                    else
                    {
                        sqlFilter.Append("(cast(ISNULL(STP_Save, 0) as Money) >= " + tmpInterval[0] + ")");
                    }
                    if (tmpParts.Length - 2 > 0 && i < tmpParts.Length - 2)
                    {
                        sqlFilter.Append(" OR ");
                    }
                }
                sqlFilter.Append(" )");
            }

            if (filterParts[1].Trim() != "")
            {
                if (sqlFilter.ToString().Trim().Length > 0)
                {
                    sqlFilter.Append(" AND ( ");
                }
                else
                {
                    sqlFilter.Append(" WHERE ( ");
                }

                tmpParts = filterParts[1].Split("L");
                for (Int32 i = 0; i <= tmpParts.Length - 2; i++)
                {
                    tmpInterval = tmpParts[i].Split("_");
                    if (tmpInterval[1] != "MAX")
                    {
                        sqlFilter.Append("( (Duration BETWEEN " + (tmpInterval[0] == "0" ? "1" : tmpInterval[0]) + " AND " + tmpInterval[1] + " and charindex('1901',SPD_InternalComments)<>0) OR (charindex('1901',SPD_InternalComments)=0 and Duration BETWEEN " + tmpInterval[0] + " + round(convert(decimal(6,2)," + tmpInterval[0] + ")/2,0) AND " + tmpInterval[1] + ") )");
                    }
                    else
                    {
                        sqlFilter.Append("( (Duration>= " + tmpInterval[0] + " and charindex('1901',SPD_InternalComments)<>0) OR (charindex('1901',SPD_InternalComments)=0 AND Duration>=" + tmpInterval[0] + "+round(convert(decimal(6,2)," + tmpInterval[0] + ")/2,0) ) )");
                    }
                    if (tmpParts.Length - 2 > 0 && i < tmpParts.Length - 2)
                    {
                        sqlFilter.Append(" OR ");
                    }
                }
                sqlFilter.Append(" )");
            }

            if (filterParts[2].Trim() != "")
            {
                if (sqlFilter.ToString().Trim().Length > 0)
                {
                    sqlFilter.Append(" AND ( ");
                }
                else
                {
                    sqlFilter.Append(" WHERE ( ");
                }

                tmpParts = filterParts[2].Split("C");
                for (Int32 i = 0; i <= tmpParts.Length - 2; i++)
                {
                    sqlFilter.Append(" charindex('," + tmpParts[i] + ",', ',' + replace(PDL_Places,' ','') )<>0");
                    if (tmpParts.Length - 2 > 0 && i < tmpParts.Length - 2)
                    {
                        sqlFilter.Append(" AND ");
                    }
                }
                sqlFilter.Append(" )");
            }

            switch (OrderVal)
            {
                case "0":
                    sqlFilter.Append(" ORDER BY case when cast(STP_Save as Money) > 0 then 2 else 0 end desc, 2 desc, cast(isnull(STP_Save,9999) as Money), Duration, a.PDL_Title");
                    break;
                case "1":
                    sqlFilter.Append(" ORDER BY case when cast(STP_Save as Money) > 0 then Duration else 9999 end, Duration, NoOfFeed DESC, cast(isnull(STP_Save,9999) as Money), PDL_Title");
                    break;
                case "2":
                    sqlFilter.Append(" ORDER BY cast(isnull(STP_Save,9999) as Money), NoOfFeed DESC, Duration, PDL_Title");
                    break;
                case "3":
                    sqlFilter.Append(" ORDER BY cast(STP_Save as Money) DESC, NoOfFeed DESC, Duration, PDL_Title");
                    break;
                case "4":
                    sqlFilter.Append(" ORDER BY case when cast(STP_Save as Money) > 0 then PDL_Title else 'ZZZZZ' end, PDL_Title, NoOfFeed DESC, cast(STP_Save as Money), Duration");
                    break;
            }

            List<PacksByPlaceID_Id> dvData = new List<PacksByPlaceID_Id>();
            var Result = await _dapperWrap.GetRecords<PacksByPlaceID_Id>(SqlCalls.sqlGetPacksByPlaceID_IdsOnly(PlaceId, sqlFilter.ToString()));
            dvData = Result.ToList();
            dvData = dvData.Distinct(new PacksByPlaceID_IdComparer()).ToList();
            findCusPackInfoViewModel.totalPacks = dvData.Count;
            string strPageIds = "";
            StringBuilder boxAllPacks = new StringBuilder();
            Int32 j = 1;
            for (Int32 i = 0; i <= dvData.Count - 1; i++)
            {
                if (j < 20)
                {
                    strPageIds = strPageIds + dvData[i].PDLID.ToString() + ",";
                }
                else
                {
                    strPageIds = strPageIds + dvData[i].PDLID.ToString();
                    boxAllPacks.Append(strPageIds + "|");
                    strPageIds = "";
                    j = 0;
                }
                j += 1;
            }

            if (strPageIds != "")
            {
                boxAllPacks.Append(strPageIds.Substring(0, strPageIds.Length - 1) + "|");
            }
            findCusPackInfoViewModel.boxAllPacksStr = boxAllPacks.ToString();
            var first3 = dvData.Take(3).ToList();
            var packid3 = "";
            var iC = 0;
            foreach (var d in first3)
            {
                if (iC < first3.Count - 1) { packid3 = packid3 + "'" + d.PDLID + "', "; } else { packid3 = packid3 + "'" + d.PDLID + "'"; };
                iC++;
            };

            ViewBag.PageType = "ListingPage";
            ViewBag.CriteoIDs = packid3;

            return View("Get_FindCusPackInfo", findCusPackInfoViewModel); ;
        }
    }
}
