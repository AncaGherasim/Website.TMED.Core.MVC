using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MVC_TMED.Infrastructure;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using MVC_TMED.Models.ViewModels;
using MVC_TMED.Models;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Hosting;

namespace MVC_TMED.Infrastructure
{
    public class CheckCacheFilter : IAsyncActionFilter
    {
        public readonly DapperWrap _dapperWrap;
        public readonly IWebHostEnvironment _webHostEnvironment;

        public CheckCacheFilter(DapperWrap dapperWrap, IWebHostEnvironment webHostEnvironment)
        {
            _dapperWrap = dapperWrap;
            _webHostEnvironment = webHostEnvironment;
        }

        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            Int32 ValidCache = 0;
            String DesktopOrMobile = "Desktop";
            String pageURL = context.HttpContext.Request.Path;
            string pathBase = context.HttpContext.Request.PathBase;
            //pageURL = "https://webtest.tripdev.net/europe" + pageURL;
            pageURL = "https://www.tripmasters.com/europe" + pageURL;
            object sCachedPage = "";

            if (Utilities.CheckMobileDevice())
            {
                DesktopOrMobile = "Mobile";
            }

            if (_webHostEnvironment.EnvironmentName != "Development")
            {
                IEnumerable<NameObject> cachedHTMLPageContents = new List<NameObject>();
                try
                {
                    cachedHTMLPageContents = await _dapperWrap.MySqlGetRecordsAsync<NameObject>("Select 0 As Id, CACHE_PageContent" + DesktopOrMobile + @" As Name FROM WEB_PageCache WHERE CACHE_PageURL = '" + pageURL +
                        @"' AND CACHE_Expire > NOW() AND CACHE_RefreshStatusCode" + DesktopOrMobile + " = 200 AND CACHE_Active = 1");
                    if (cachedHTMLPageContents.Count() > 0)
                    {
                        bool VacationAreaMulticou = false;
                        if (Regex.IsMatch(pageURL, @"(?<c>\w*)(/vacations)", RegexOptions.IgnoreCase))
                        {
                            if (!(Regex.IsMatch(pageURL, @"(?<c>\w*)(/area/vacations)", RegexOptions.IgnoreCase)) && !(Regex.IsMatch(pageURL, @"(?<c>\w*)(/multicountry/vacations)", RegexOptions.IgnoreCase)))
                            {
                                var country_city = "";
                                Regex r2 = new Regex(@"(?<c>\w*)(/vacations)", RegexOptions.None);
                                Match mc2 = r2.Match(pageURL);
                                if (mc2.Success)
                                {
                                    country_city = mc2.Value.Replace("/vacations", "");
                                    var plcHierarchy = await _dapperWrap.GetRecords<PlacesHierarchy>(SqlCalls.SQL_Vacations_Places_Hierarchy(country_city));
                                    List<PlacesHierarchy> placesHierarchies = plcHierarchy.ToList();
                                    if (placesHierarchies.Count != 0)
                                    {
                                        if (placesHierarchies.First().STR_PlaceTypeID == 28 || placesHierarchies.First().STR_PlaceTypeID == 6)
                                        {
                                            VacationAreaMulticou = true;
                                        }
                                    }
                                }
                            }
                        }
                        if (cachedHTMLPageContents.First().Name != "" && !VacationAreaMulticou)
                        {
                            sCachedPage = cachedHTMLPageContents.First().Name;
                        }
                    }
                }
                catch (System.IO.IOException e)
                {
                    Console.WriteLine("TMED-Error-Cache-MySql01: " + e.Message);
                    sCachedPage = e;
                }
                catch(System.Exception ex)
                {

                    Console.WriteLine("TMED-Error-Cache-MySql02: " + ex.Message);
                    if (ex.InnerException != null)
                    {
                        Console.WriteLine(ex.InnerException.Message);
                    }

                }

                //            Object sCachedPage = await GetAuroraCachedPage(DesktopOrMobile, pageURL);
                if (sCachedPage is String)
                {
                    if (sCachedPage.ToString() != "")
                    {
                        ValidCache = 1;
                    }
                }
                else
                {
                    if (sCachedPage is System.IO.IOException)
                    {
                        if (context.Controller is Controller controller)
                        {
                            controller.ViewData["MySQLCachedError"] = "Catched MySQL error";
                        }
                        //ViewBag._HtmlCachedPage = "Catched MySQL error";
                    }
                    else
                    {
                        if (context.Controller is Controller controller)
                        {
                            controller.ViewData["MySQLCachedError"] = "Catched MySQL error";
                            Console.WriteLine("TMED-Error-Cache-MySql03: Catched MySQL error");
                        }
                        //ViewBag._HtmlCachedPage = "Unknown error";
                    }
                }
            }
            
            if (ValidCache == 1)
            {
                CacheModel oo = new CacheModel();
                oo.cachecontent = sCachedPage.ToString();

                context.Result = new ViewResult
                {
                    ViewName = "~/Views/CachePage/HtmlCachePage.cshtml",
                    ViewData = new Microsoft.AspNetCore.Mvc.ViewFeatures.ViewDataDictionary(new EmptyModelMetadataProvider(), new ModelStateDictionary())
                    {
                        Model = sCachedPage.ToString()
                    }
                };
                
            }
            else
            {
                await next();
            }
            
        }

    }

    public class CacheModel
    {
        public string cachecontent { get; set; }
    }
}