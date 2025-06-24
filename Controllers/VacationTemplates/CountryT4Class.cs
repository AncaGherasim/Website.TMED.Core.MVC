using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Options;
using MVC_TMED.Infrastructure;
using MVC_TMED.Models;
using MVC_TMED.Models.ViewModels;
using static MVC_TMED.Models.ViewModels.Country_T4ViewModel;

namespace MVC_TMED.Controllers.VacationTemplates
{
    public class CountryT4Class
    {
        private readonly DapperWrap _dapperWrap;
        private readonly IOptions<AppSettings> _appSettings;
        private readonly AWSParameterStoreService _awsParameterStoreService;
        private readonly CachedDataService _cachedDataService;
        public CountryT4Class(DapperWrap dapperWrap, IOptions<AppSettings> appSettings, AWSParameterStoreService awsParameterStoreService, CachedDataService cachedDataService)
        {
            _dapperWrap = dapperWrap;
            _appSettings = appSettings;
            _awsParameterStoreService = awsParameterStoreService;
            _cachedDataService = cachedDataService;
        }
        public async Task<Country_T4ViewModel> Country_T4(string country, int placeId, int placeStrid)
        {
            Country_T4ViewModel country_T4ViewModel = new Country_T4ViewModel();

            country_T4ViewModel.placeNA = Utilities.UppercaseFirstLetter(country.Replace("_", " "));
            country_T4ViewModel.placeID = placeId;
			//ViewBag.PageTitle = country_T4ViewModel.pageTitle;
			//ViewBag.pageMetaDesc = country_T4ViewModel.pageMetaDesc;
			//ViewBag.pageMetaKey = country_T4ViewModel.pageMetaKey;

			var Result10 = await _dapperWrap.GetRecords<Place_Info>(SqlCalls.SQL_Place_Info(placeId.ToString()));
			List<Place_Info> dvDAT = Result10.ToList();
            country_T4ViewModel.IdPacakgeSEO = dvDAT[0].SEO_HeaderText;
            if (dvDAT[0].SEO_PageTitle != null)
            {
                country_T4ViewModel.pageTitle = dvDAT[0].SEO_PageTitle;
            }
            else
            {
				country_T4ViewModel.pageTitle = country_T4ViewModel.placeNA + " Vacation Packages | Vacation to " + country_T4ViewModel.placeNA + " | Tripmasters";
			}

			if (dvDAT[0].SEO_MetaDescription != null)
			{
				country_T4ViewModel.pageMetaDesc = dvDAT[0].SEO_MetaDescription;
			}
			else
			{
				country_T4ViewModel.pageMetaDesc = country_T4ViewModel.placeNA + " Vacation Packages, customize multi-city vacations to " + country_T4ViewModel.placeNA + ", flexible trips to " + country_T4ViewModel.placeNA + ". Review past " + country_T4ViewModel.placeNA + "  itineraries, book " + country_T4ViewModel.placeNA + "  vacation packages online. Travel to " + country_T4ViewModel.placeNA + " your way";
			}

			country_T4ViewModel.pageMetaKey = country_T4ViewModel.placeNA + " vacations, " + country_T4ViewModel.placeNA + " vacation packages, discount " + country_T4ViewModel.placeNA + " vacations, discount vacations, vacation packages, vacations, vacation deals, travel, travel packages, travel deals, europe destinations, independent tours, customizable packages, tourism, bargain vacations, discount hotels, discount airfare, travel guides, fly drive, honeymoon vacations, holiday vacations, last minute travel, online reservations, Europe deals, european vacation, Africa vacations, Middle East vacations";
			country_T4ViewModel.pageHeaderText = country_T4ViewModel.placeNA + " Vacation Packages";
			country_T4ViewModel.pageBannerText = "Book Customizable Multi-city trips in seconds|Curated Hotels & Services ";
            country_T4ViewModel.image = "https://pictures.tripmasters.com/images/web/tm/tmed/t4/" + country_T4ViewModel.placeNA.ToLower().Replace(" ", "") + ".jpg";

            if (country_T4ViewModel.placeNA  == "Spain")
            {
                country_T4ViewModel.pageDescriptionC = "Book the best tourist destinations in Spain! Customize the Best of Madrid - Andalucia - Barcelona. The best places to travel in Spain - Spanish Wine Regions, Andalucia, Costa del Sol, Canary Islands. Vacation packages in Spain: Madrid and Barcelona by Air, Madrid - Seville - Barcelona by Train. The most beautiful cities in Spain: Madrid, Barcelona, Seville. Best Madrid - Seville - Barcelona and Ibiza Island Package.";
            }
            else
            {
                country_T4ViewModel.pageDescriptionC = country_T4ViewModel.pageMetaDesc;

            }

            if (dvDAT[0].SEO_HeaderText is not null) 
            { 
                country_T4ViewModel.IdPacakgeSEO = dvDAT[0].SEO_HeaderText;
                var Result22 = await _dapperWrap.GetRecords<PackInfoSEO>(SqlCalls.SQL_PackageInformationSEO(country_T4ViewModel.IdPacakgeSEO.ToString()));
                country_T4ViewModel.ListPackInfo = Result22.ToList();
                country_T4ViewModel.ListPackInfoSEO = country_T4ViewModel.ListPackInfo;
            }

            List<weightItin> objItineraries = new List<weightItin>();
            List<EachCity> objCitiesOn = new List<EachCity>();


            var objectTypes = new Type[] { typeof(weightItin), typeof(EachCity), typeof(plcExtension), typeof(CMScountry), typeof(NumberofCustomerFeedbacks), typeof(CountryFeedback) };
            string queryString = SqlCalls.SQL_FeaturedItinByPlaceID(placeId.ToString()) + @";" +
                                SqlCalls.SQL_CitiesOnCountrySEO(placeId.ToString()) + @";" +
                                SqlCalls.SQL_GetHiglightsByPlaceID(placeStrid.ToString(), true) + @";" +
                                SqlCalls.SQL_PlaceCMSByplaceID(placeId.ToString()) + @";" +
                                SqlCalls.SQL_Get_NumberofCustomerFeedbacks_OverAllScore() + @";" +
                                SqlCalls.SQL_CustomerFeedbacks_For_CountriesC(placeId.ToString()) + @";";

            var resultSets = await _dapperWrap.GetMultipleRecords(queryString, 4, null, objectTypes);
            int count = 1;
            List<weightItin> featuredItineraries = new List<weightItin>();
            List<TotalPacks> totalPackages = new List<TotalPacks>();
            List<CombineCoun> objCombineCoun = new List<CombineCoun>();
            List<plcExtension> objPlaceExt = new List<plcExtension>();
            List<NumberofCustomerFeedbacks> overAllReviews = new List<NumberofCustomerFeedbacks>();
            List<CountryFeedback> CountriesFeeds = new List<CountryFeedback>();

            if (resultSets is not null)
            {
                foreach (var resultSet in resultSets)
                {
                    switch (count)
                    {
                        case 1:
                            featuredItineraries = ((List<object>)resultSet).Cast<weightItin>().ToList();
                            break;
                        case 2:
                            objCitiesOn = ((List<object>)resultSet).Cast<EachCity>().ToList();
                            break;
                        case 3:
                            objPlaceExt = ((List<object>)resultSet).Cast<plcExtension>().ToList();
                            break;
                        case 4:
                            country_T4ViewModel.listCMS = ((List<object>)resultSet).Cast<CMScountry>().ToList();
                            break;
                        case 5:
                            overAllReviews = ((List<object>)resultSet).Cast<NumberofCustomerFeedbacks>().ToList();
                            break;
                        case 6:
                            CountriesFeeds = ((List<object>)resultSet).Cast<CountryFeedback>().ToList();
                            break;
                        default:
                            break;
                    }
                    count++;
                }
            }


            //var result1 = await _dapperWrap.GetRecords<weightItin>(SqlCalls.SQL_FeaturedItinByPlaceID(placeId.ToString()));
            //var result9 = await _dapperWrap.GetRecords<TotalPacks>(SqlCalls.SQL_NoOfPacksFeaturedItinByPlaceID(placeId.ToString()));
            //var noPk = result9.First().NoOfPacks;
            //result1.Select(r => { r.TotalPacks = noPk; return r; }).ToList();
            objItineraries = featuredItineraries.ToList();
            if (objItineraries.Count > 0)
            {
                country_T4ViewModel.allItineraries = objItineraries[0].TotalPacks;
            }
            country_T4ViewModel.listFeatured = objItineraries.Take(1).ToList();
            country_T4ViewModel.otherFeatured = objItineraries.Skip(1).Take(4).ToList();
            country_T4ViewModel.suggestedItin = objItineraries.Skip(5).Take(objItineraries.Count - 5).ToList();

            var first3 = objItineraries.Take(3).ToList();
            var packid3 = "";
            var iC = 0;
            foreach (var d in first3)
            {
                if (iC < first3.Count - 1) { packid3 = packid3 + "'" + d.PDLID + "', "; } else { packid3 = packid3 + "'" + d.PDLID + "'"; };
                iC++;
            };

            string plsIDs = String.Join("", objItineraries.Select(x => x.PDL_Places).ToArray()).Trim();
            if (plsIDs.EndsWith(","))
            {
                plsIDs = plsIDs.Substring(0, plsIDs.Count() - 1);
            }
            //List<CombineCoun> objCombineCoun = new List<CombineCoun>();

            var result2 = await _dapperWrap.GetRecords<CombineCoun>(SqlCalls.SQL_PlacesFromSTR(plsIDs));
            objCombineCoun = result2.ToList();
            objCombineCoun = objCombineCoun.FindAll(x => x.CouNA != country_T4ViewModel.placeNA).ToList();
            objCombineCoun = objCombineCoun.OrderByDescending(p => p.CouNA).ToList();
            country_T4ViewModel.listCombineCou = objCombineCoun;

            //var result3 = await _dapperWrap.GetRecords<EachCity>(SqlCalls.SQL_CitiesOnCountrySEO(placeId.ToString()));
            //objCitiesOn = result3.ToList();
            country_T4ViewModel.listCitiesOn = objCitiesOn.FindAll(x => x.STR_PlaceAIID < 15);
            country_T4ViewModel.listCitiesMore = objCitiesOn.FindAll(x => x.STR_PlaceAIID > 14);

            //var result4 = await _dapperWrap.GetRecords<plcExtension>(SqlCalls.SQL_GetHiglightsByPlaceID(placeStrid.ToString(), true));
            //List<plcExtension> objPlaceExt = result4.ToList();
            country_T4ViewModel.listHighligts = objPlaceExt.FindAll(x => x.STX_ProdKindID == 1623).OrderBy(x => x.STX_Priority).ToList();
            country_T4ViewModel.listBanners = objPlaceExt.FindAll(x => x.STX_ProdKindID == 1624);

            //var result5 = await _dapperWrap.GetRecords<CustomReviews>(SqlCalls.SQL_FeedCommentsByPlaceID(placeId.ToString()));
            //country_T4ViewModel.listReviews = result5.ToList();

            //var result6 = await _dapperWrap.GetRecords<CMScountry>(SqlCalls.SQL_PlaceCMSByplaceID(placeId.ToString()));
            //country_T4ViewModel.listCMS = result6.ToList();

            // GET FAQ CMS content
            var fq = new FaqQR { FaqQuestion = "none", FaqResponse = "none" };
            country_T4ViewModel.FaqList.Add(fq);
            int? cmsfaqID = 0;
            foreach (var cms in country_T4ViewModel.listCMS)
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
                country_T4ViewModel.FaqList.Clear();
                var api = new API.PackagesController(_appSettings, _dapperWrap, _cachedDataService);
                country_T4ViewModel.FaqList = api.SqlFaqCms(cmsfaqID).Result.ToList();
            }

            //var result7 = await _dapperWrap.GetRecords<NumberofCustomerFeedbacks>(SqlCalls.SQL_Get_NumberofCustomerFeedbacks_OverAllScore());
            //List<NumberofCustomerFeedbacks> overAllReviews = result7.ToList();
            Int32 NumComments = 0;
            Decimal overAllAvg = 0;
            if (overAllReviews.Count > 0)
            {
                NumComments = overAllReviews[0].NumComments;
                country_T4ViewModel.Score = overAllReviews[0].Score;
                overAllAvg = Decimal.Round(country_T4ViewModel.Score, 1);
            }

            //var result8 = await _dapperWrap.GetRecords<CountryFeedback>(SqlCalls.SQL_CustomerFeedbacks_For_CountriesC(placeId.ToString()));
            //List<CountryFeedback> CountriesFeeds = result8.ToList();
            if (CountriesFeeds.Count > 0)
            {
                country_T4ViewModel.packFeedCountC = CountriesFeeds[0].NoOfFeedbacks;
            }

		


			return country_T4ViewModel;
        }
    }
}
