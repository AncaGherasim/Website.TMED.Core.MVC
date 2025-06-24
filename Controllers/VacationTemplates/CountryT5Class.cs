using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using MVC_TMED.Infrastructure;
using MVC_TMED.Models;
using MVC_TMED.Models.ViewModels;
using static MVC_TMED.Models.ViewModels.Country_T5ViewModel;

namespace MVC_TMED.Controllers.VacationTemplates
{
    public class CountryT5Class
    {
        private readonly DapperWrap _dapperWrap;
        private readonly IOptions<AppSettings> _appSettings;
        private readonly AWSParameterStoreService _awsParameterStoreService;
        private readonly CachedDataService _cachedDataService;
        public CountryT5Class(DapperWrap dapperWrap, IOptions<AppSettings> appSettings, AWSParameterStoreService awsParameterStoreService, CachedDataService cachedDataService)
        {
            _dapperWrap = dapperWrap;
            _appSettings = appSettings;
            _awsParameterStoreService = awsParameterStoreService;
            _cachedDataService = cachedDataService;
        }
              
        public async Task<Country_T5ViewModel> Country_T5(string country, int placeId, int placeStrid, string calendarBYO)
        {
            Country_T5ViewModel country_T5ViewModel = new Country_T5ViewModel();
      
            if (!string.IsNullOrEmpty(calendarBYO) && calendarBYO.ToLower() == "byo")
            {
                country_T5ViewModel.isBYO = true;
            }
            country_T5ViewModel.placeNA = Utilities.UppercaseFirstLetter(country.Replace("_", " "));
            if (country_T5ViewModel.placeNA.ToLower() == "usa")
            {
                country_T5ViewModel.placeNA = country_T5ViewModel.placeNA.ToUpper();
            }
            country_T5ViewModel.placeID = placeId;

            var Result12 = await _dapperWrap.GetRecords<T5_Place_Info>(SqlT5Calls.SQL_T5_PlaceSEOandFirstSec(placeId));
            List<T5_Place_Info> dvDAT = Result12.ToList();
            if (dvDAT[0].SEO_PageTitle != null)
            {
                country_T5ViewModel.pageTitle = dvDAT[0].SEO_PageTitle;
            }
            else
            {
                country_T5ViewModel.pageTitle = country_T5ViewModel.placeNA + " Vacation Packages | Vacation to " + country_T5ViewModel.placeNA + " | Tripmasters";
            }

            if (dvDAT[0].SEO_MetaDescription != null)
            {
                country_T5ViewModel.pageMetaDesc = dvDAT[0].SEO_MetaDescription;
            }
            else
            {
                country_T5ViewModel.pageMetaDesc = country_T5ViewModel.placeNA + " Vacations, customize multi-city vacations to " + country_T5ViewModel.placeNA + ", flexible trips to " + country_T5ViewModel.placeNA + ". Review past " + country_T5ViewModel.placeNA + "  itineraries, book " + country_T5ViewModel.placeNA + "  vacation packages online. Travel to " + country_T5ViewModel.placeNA + " your way";
            }

            if (dvDAT[0].SEO_HeaderText is not null)
            {
                country_T5ViewModel.IdPacakgeSEO = dvDAT[0].SEO_HeaderText;
                var Result22 = await _dapperWrap.GetRecords<PackInfoSEO>(SqlT5Calls.SQL_T5_SEO_Package(country_T5ViewModel.IdPacakgeSEO.ToString()));
                country_T5ViewModel.ListPackInfo = Result22.ToList();
                country_T5ViewModel.ListPackInfoSEO = country_T5ViewModel.ListPackInfo;
            }
            if (dvDAT[0].STR_PlaceAI is not null) { 
                country_T5ViewModel.firstSecTtl = dvDAT[0].STR_PlaceAI;
                country_T5ViewModel.firstSecDes = dvDAT[0].STR_PlaceTitleDesc;
            }

            var objectTypes = new Type[] { typeof(T5PriorityPacks), typeof(T5EachCity), typeof(T5plcExtension), typeof(T5CMScountry), typeof(T5_CountryFeed), typeof(T5_CountryFeed), typeof(T5DisplayPosition) };
            string queryString = SqlT5Calls.SQL_T5_PriorityPacks(placeId.ToString()) + @";" +
                                SqlT5Calls.SQL_T5_CitiesOnCountry(placeId.ToString()) + @";" +
                                SqlT5Calls.SQL_T5_Highlights(placeId.ToString()) + @";" +
                                SqlT5Calls.SQL_T5_AboutCMS(placeId.ToString()) + @";" +
                                SqlT5Calls.SQL_T5_CommentScore() + @";" +
                                SqlT5Calls.SQL_T5_CountryComments(placeId.ToString()) + @";" +
                                SqlT5Calls.SQL_T5_DisplayOrder(placeStrid.ToString()) + @";";

            var resultSets = await _dapperWrap.GetMultipleRecords(queryString, 4, null, objectTypes);
            int count = 1;
            List<T5PriorityPacks> featuredItineraries = new List<T5PriorityPacks>();
            List<T5DisplayPosition> displayPositions = new List<T5DisplayPosition>();
            List<T5TotalPacks> totalPackages = new List<T5TotalPacks>();
            List<T5plcExtension> objPlaceExt = new List<T5plcExtension>();
            List<T5_CountryFeed> overAllReviews = new List<T5_CountryFeed>();
            List<T5_CountryFeed> CountriesFeeds = new List<T5_CountryFeed>();
            List<T5EachCity> objCitiesOn = new List<T5EachCity>();
           
            if (resultSets is not null)
            {
                foreach (var resultSet in resultSets)
                {
                    switch (count)
                    {
                        case 1:
                            featuredItineraries = ((List<object>)resultSet).Cast<T5PriorityPacks>().ToList();
                            break;
                        case 2:
                            objCitiesOn = ((List<object>)resultSet).Cast<T5EachCity>().ToList();
                            break;
                        case 3:
                            objPlaceExt = ((List<object>)resultSet).Cast<T5plcExtension>().ToList();
                            break;
                        case 4:
                            country_T5ViewModel.listCMS = ((List<object>)resultSet).Cast<T5CMScountry>().ToList();
                            break;
                        case 5:
                            overAllReviews = ((List<object>)resultSet).Cast<T5_CountryFeed>().ToList();
                            break;
                        case 6:
                            CountriesFeeds = ((List<object>)resultSet).Cast<T5_CountryFeed>().ToList();
                            break;
                        case 7:
                            displayPositions = ((List<object>)resultSet).Cast<T5DisplayPosition>().ToList();
                            break;
                        default:
                            break;
                    }
                    count++;
                }
            }
            
            List<T5PriorityPacks> objItineraries = new List<T5PriorityPacks>();         
            objItineraries = featuredItineraries.OrderBy(x => x.SPPW_Weight).ToList();
            country_T5ViewModel.listGuided = objItineraries.Where(gi => gi.SPD_InternalComments.Contains(".isTMGuided")).ToList();
            country_T5ViewModel.otherFeatured = objItineraries.Where(ot => !ot.SPD_InternalComments.Contains(".isTMGuided")).ToList();
            if (country_T5ViewModel.listGuided.Count == 0)
            {
                country_T5ViewModel.listGuided = objItineraries.OrderBy(x => x.SPPW_Weight).Take(5).ToList();
                country_T5ViewModel.otherFeatured = objItineraries.OrderBy(x => x.SPPW_Weight).Skip(5).Take(objItineraries.Count() - 5).ToList();
                country_T5ViewModel.isGuided = false;
            } 
            country_T5ViewModel.ListDisplayPositions = displayPositions.ToList();
            country_T5ViewModel.listCountryFeeds = CountriesFeeds.ToList();
            country_T5ViewModel.listOverAllFeeds = overAllReviews.ToList();
            country_T5ViewModel.listHighligts = objPlaceExt.OrderBy(h => h.STX_Priority).ToList();
            country_T5ViewModel.listCitiesOn = objCitiesOn.Take(3).ToList();

        // GET FAQ CMS content
        var fq = new FaqQR { FaqQuestion = "none", FaqResponse = "none" };
            country_T5ViewModel.FaqList.Add(fq);
            int? cmsfaqID = 0;
            foreach (var cms in country_T5ViewModel.listCMS)
            {
                if (cms.CMS_Description != "none")
                {
                    if (Regex.IsMatch(cms.CMS_Description, "FAQ", RegexOptions.IgnoreCase))
                    {
                        cmsfaqID = cms.CMSW_RelatedCmsID;
                    }
                }
                else
                {
                    if (Regex.IsMatch(cms.CMSW_Title, "FAQ", RegexOptions.IgnoreCase))
                    {
                        cmsfaqID = cms.CMSW_RelatedCmsID;
                    }
                }
            }
            if (cmsfaqID > 0)
            {
                country_T5ViewModel.FaqList.Clear();
                var api = new API.PackagesController(_appSettings, _dapperWrap, _cachedDataService);
                country_T5ViewModel.FaqList = api.SqlFaqCms(cmsfaqID).Result.ToList();
            }

            // Call API Metoth fot comment

            await _cachedDataService.LoadFeedbacksIfNecessary();
            int totalRows = _cachedDataService.feedbacksCache.Count(f => f.CountryID == placeId);
            var filteredFeedbacks = _cachedDataService.feedbacksCache.Where(f => f.CountryID == placeId && f.pcc_overallscore >= 4 && !f.PCC_Comment.StartsWith("---"))
                .OrderByDescending(f => f.dep_date);
                var topResults = filteredFeedbacks
                .Take(1)
                .Select(f => new
                {
                    f.PCC_Comment,
                    f.pcc_overallscore,
                    f.dep_date,
                    Total_Rows = totalRows
                }).ToList();


            country_T5ViewModel.listCommentDate = new List<T5_CountryFeed>(topResults.Select(tr=>new T5_CountryFeed { pcc_comment = tr.PCC_Comment, pcc_overallscore = tr.pcc_overallscore, dep_date = tr.dep_date, Total_Rows = tr.Total_Rows}));
                
  

            return country_T5ViewModel;
        }
    }
}
