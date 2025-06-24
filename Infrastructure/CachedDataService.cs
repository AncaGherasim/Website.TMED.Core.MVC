using Microsoft.Extensions.Configuration;
using System.Data.SqlClient;
using Newtonsoft.Json;
using MVC_TMED.Models;
using System.Collections.Generic;
using System.Text;
using System;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using System.Linq;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Caching.Memory;

namespace MVC_TMED.Infrastructure
{
    public class CachedDataService
    {
        public string destinationsCache { get; private set; }
        public IEnumerable<DepCity> depCitiesCache { get; private set; }
        public IEnumerable<PriorCity> priorCitiesCache { get; private set; }
        public IEnumerable<Feedbacks> feedbacksCache { get; private set; }
        public string webAnnouncementsCache { get; private set; }
        private readonly IServiceProvider _serviceProvider; 
        private readonly IMemoryCache _memoryCache;
        private readonly AppSettings _appSettings;
        
        public CachedDataService(IOptions<AppSettings> appSettings, IServiceProvider serviceProvider, IMemoryCache memoryCache)
        {
            _serviceProvider = serviceProvider;
            _appSettings = appSettings.Value;
            _memoryCache = memoryCache;
        }

        public async Task LoadFeedbacksIfNecessary()
        {
            if (feedbacksCache == null || !feedbacksCache.Any())
            {
                await LoadFeedbacksFromDatabase();
            }
        }

        public async Task LoadDestinationsIfNecessary() //IfNecessary means if the property is empty or is expired
        {
            if (string.IsNullOrEmpty(destinationsCache))
            {
                await LoadDestinationsFromDatabase();
            }           
        }

        public async Task LoadDepCitiesIfNecessary()
        {
            if (depCitiesCache == null || !depCitiesCache.Any())
            {
                await LoadDepCitiesFromDatabase();
            }
        }

        public async Task LoadPriorCitiesIfNecessary()
        {
            if (priorCitiesCache == null || !priorCitiesCache.Any())
            {
                await LoadPriorCitiesFromDatabase();
            }
        }

        public async Task LoadWebAnnouncementIfNecessary()
        {
            if (_memoryCache.TryGetValue("WebAnnouncement", out string cachedData))
            {
                webAnnouncementsCache = cachedData;
            }
            else
            {
                string response = await LoadWebAnnouncement();
                TimeSpan cacheDuration = TimeSpan.FromMinutes(30);
                // Store the response in the cache
                _memoryCache.Set("WebAnnouncement", response, cacheDuration);
                webAnnouncementsCache = response;
            }
        }
        private async Task LoadFeedbacksFromDatabase()
        {
            try
            {
                using (var scope = _serviceProvider.CreateScope())
                {
                    var dapperWrap = scope.ServiceProvider.GetRequiredService<DapperWrap>();
                    var Result = await dapperWrap.pgSQLGetRecordsAsync<Feedbacks>(PostgresCalls.PG_MV_Feedbacks());
                    feedbacksCache = Result.ToList();
                    Console.WriteLine("****** CachedDataService - TMED - Read feedbacksCache from DataBase, memorysize is " + System.Text.Encoding.UTF8.GetByteCount(Newtonsoft.Json.JsonConvert.SerializeObject(feedbacksCache)));
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("****** CachedDataService - TMED - Error reading feedbacksCache from DataBase");
                Console.WriteLine(ex.Message + ex.StackTrace);
            }
        }

        private async Task LoadDestinationsFromDatabase()
        {
            try
            {
                using (var scope = _serviceProvider.CreateScope())
                {
                    var dapperWrap = scope.ServiceProvider.GetRequiredService<DapperWrap>();
                    var Result = await dapperWrap.pgSQLGetRecordsAsync<footerDestinations>(PostgresCalls.PG_MV_FooterDestinations());
                    List<footerDestinations> dst = Result.ToList();
                    destinationsCache = Newtonsoft.Json.JsonConvert.SerializeObject(dst);
                    Console.WriteLine("****** CachedDataService - TMED - Read destinationsCache from DataBase, memorysize is " + System.Text.Encoding.UTF8.GetByteCount(destinationsCache));
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("****** CachedDataService - TMED - Error reading destinationsCache from DataBase");
                Console.WriteLine(ex.Message + ex.StackTrace);
            }
        }

        private async Task LoadDepCitiesFromDatabase()
        {
            try
            {
                using (var scope = _serviceProvider.CreateScope())
                {
                    var dapperWrap = scope.ServiceProvider.GetRequiredService<DapperWrap>();
                    var Result = await dapperWrap.GetRecords<DepCity>("exec [dbo].[WEB_EDQEDepCities] @sTitle = '%%', @sCode = '%'");
                    depCitiesCache = Result.ToList().Where(x => !x.PLC_Title.StartsWith("zzz"));
                    Console.WriteLine("****** CachedDataService - TMED - Read depCitiesCache from DataBase, memorysize is " + System.Text.Encoding.UTF8.GetByteCount(Newtonsoft.Json.JsonConvert.SerializeObject(depCitiesCache)));
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("****** CachedDataService - TMED - Error reading depCitiesCache from DataBase");
                Console.WriteLine(ex.Message + ex.StackTrace);
            }
        }

        private async Task LoadPriorCitiesFromDatabase()
        {
            try
            {
                using (var scope = _serviceProvider.CreateScope())
                {
                    var dapperWrap = scope.ServiceProvider.GetRequiredService<DapperWrap>();
                    List<PriorCity> listCities = new List<PriorCity>();
                    string _PriorityArrivalCitiesAllSites = @"SELECT  p1.STR_PlaceID as CtyID
                        , p1.STR_PlaceTitle as CtyNA
                        , p1.STR_PlacePriority as CtyPR
                        , p2.STR_PlaceTitle as CouNA
                        , CASE When p3.PLC_Code = 'none' then p3.PLC_FlyToAirportCode else p3.PLC_Code end as CtyCOD
                        , CASE
                        When p1.STR_UserID = 595 then 'TMAS'
                        When p1.STR_UserID = 182 then 'TMLD'
                        When p1.STR_UserID = 243 then 'TMED'
                        else '' end as deptNA
                        FROM STR_Places_Hierarchy p1
                        INNER JOIN STR_Places_Hierarchy p2 ON(p2.STR_PlaceID = p1.STR_Place1ParentID OR p2.STR_PlaceID = p1.STR_Place2ParentID)
                        AND p2.STR_UserID = p1.STR_UserID
                        INNER JOIN PRD_Place p3 ON p3.PLCID = p1.STR_PlaceID
                        WHERE p1.STR_PlaceActive = 1
                        AND p1.STR_PlaceTypeID in (1, 25)
                        AND p1.STR_UserID in (595, 182, 243)
                        AND p1.STR_ProdKindID = 0
                        AND p1.STR_NoWeb = 0
                        AND p1.STR_PlacePriority = 1
                        AND p2.STR_PlaceActive = 1
                        AND p2.STR_PlaceTypeID in (5)
                        AND p2.STR_UserID in (595, 182, 243)
                        AND p2.STR_ProdKindID = 0
                        AND p2.STR_NoWeb = 0
                        AND p3.PLC_Active = 1
                        ORDER BY deptNA, p1.STR_PlaceTitle";
                    var Result = await dapperWrap.GetRecords<PriorCity>(_PriorityArrivalCitiesAllSites);
                    listCities = Result.ToList();
                    foreach (var ct in listCities)
                    {
                        switch (ct.deptNA)
                        {
                            case "TMED":
                                ct.hotelAPI = _appSettings.ApplicationSettings.TMED_HotelsAPI;
                                break;
                            case "TMLD":
                                ct.hotelAPI = _appSettings.ApplicationSettings.TMLD_HotelsAPI;
                                break;
                            case "TMAS":
                                ct.hotelAPI = _appSettings.ApplicationSettings.TMAS_HotelsAPI;
                                break;
                        }
                    }
                    priorCitiesCache = listCities;
                    Console.WriteLine("****** CachedDataService - TMED - Read priorCitiesCache from DataBase, memorysize is " + System.Text.Encoding.UTF8.GetByteCount(Newtonsoft.Json.JsonConvert.SerializeObject(priorCitiesCache)));
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("****** CachedDataService - TMED - Error reading priorCitiesCache from DataBase");
                Console.WriteLine(ex.Message + ex.StackTrace);
            }
        }

        private async Task<string> LoadWebAnnouncement()
        {
            try
            {
                using (var scope = _serviceProvider.CreateScope())
                {
                    var dapperWrap = scope.ServiceProvider.GetRequiredService<DapperWrap>();
                    string response = string.Empty;
                    List<WebAnnouncement> webAnnouncements = new List<WebAnnouncement>();
                    var result = await dapperWrap.GetRecords<WebAnnouncement>(SqlCalls.SQL_WebAnnounce());
                    webAnnouncements = result.ToList();
                    if (webAnnouncements.Count > 0)
                    {
                        response = webAnnouncements.First().WEBA_Msg;
                    }

                    return response;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("****** CachedDataService - TMED - Error reading webannouncement from DataBase");
                Console.WriteLine(ex.Message + ex.StackTrace);
                return string.Empty;
            }
        }
    }
}
