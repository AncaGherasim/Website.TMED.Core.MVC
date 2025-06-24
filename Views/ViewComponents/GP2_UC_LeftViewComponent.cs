using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MVC_TMED.Infrastructure;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using MVC_TMED.Models;
using MVC_TMED.Models.ViewModels;
using System.Xml;
using System.Text;
using Dapper;
using System.Data;
using System.Data.SqlClient;
using MVC_TMED.Infrastructure;
using Microsoft.AspNetCore.Hosting;

namespace MVC_TMED.Views.ViewComponents
{
    public class GP2_UC_LeftModel
    {
        public List<WeightPlace> leftList = new List<WeightPlace>();
        public List<WeightPlace> leftCountryCityList = new List<WeightPlace>();
        public List<WeightPlace> leftCityList = new List<WeightPlace>();
        public List<DisplayArea> leftDisplay = new List<DisplayArea>();
        public List<string> arrpCombCountry = new List<string>();
        public List<BoxContent> leftAtractions = new List<BoxContent>();
        public List<CMSPage> leftCMS = new List<CMSPage>();
        public List<BoxContent> leftHighlight = new List<BoxContent>();
        public List<BoxContent> leftPrortyHigh = new List<BoxContent>();
        public List<BoxContent> leftOrientLong = new List<BoxContent>();
        public List<BoxContent> leftArea = new List<BoxContent>();
        public List<BoxContent> leftInterest = new List<BoxContent>();
    }

    public class GP2UCLeftViewComponent : ViewComponent
    {
        private readonly IWebHostEnvironment _hostingEnv = null;
        private readonly AppSettings _appSettings;
        private readonly AWSParameterStoreService _awsParameterStoreService;

        public GP2UCLeftViewComponent(IOptions<AppSettings> appsettings, IWebHostEnvironment HostingEnv, AWSParameterStoreService awsParameterStoreService)
        {
            _appSettings = appsettings.Value;
            _hostingEnv = HostingEnv;
            _awsParameterStoreService = awsParameterStoreService;
        }

        public IViewComponentResult Invoke(string plcNA, Int32 plcIDs, Int32 plcID, string plcTY, Int32 counID, string counNA, List<DisplayArea> leftDisplay, List<BoxContent> boxContent, List<WeightPlace> placesOnWeight, string pgtype, StringBuilder strPlcsIDs, List<WeightPlace> countryCities)
        {
            List<WeightPlace> leftList = new List<WeightPlace>();
            List<WeightPlace> leftCountryCityList = new List<WeightPlace>();
            GP2_UC_LeftModel gP2_UC_LeftModel = new GP2_UC_LeftModel();
            gP2_UC_LeftModel.leftDisplay = leftDisplay;
            IDbConnection dbConn = null;
            dbConn = new SqlConnection(_awsParameterStoreService.SqlConnectionString);

            foreach (var box in leftDisplay)
            {
                Int32 boxC = box.SDP_GroupProdKindID;
                switch (boxC)
                {
                    case 1883:
                        {
                            Int32 lfC = 0;
                            List<WeightPlace> leftCityList = placesOnWeight.FindAll(cty => cty.STR_PlaceTypeID == 1 || cty.STR_PlaceTypeID == 25).ToList();
                            leftCityList = placesOnWeight.FindAll(cty => cty.CountryID == counID).ToList();
                            for (Int32 lf = 0; lf <= countryCities.Count - 1; lf++)
                            {
                                if (lf == 0 && countryCities[lf].STR_PlaceAIID < 1000)
                                {
                                    leftList.Add(new WeightPlace { STR_PlaceTitle = "Popular Cities", STR_PlaceID = 0, STR_PlaceShortInfo = "none" });
                                }
                                if (lf > 0 && countryCities[lf].STR_PlaceAIID == 1000)
                                {
                                    lfC = lfC + 1;
                                    if (lfC == 1)
                                    {
                                        leftList.Add(new WeightPlace { STR_PlaceTitle = countryCities[lf].STR_PlaceTitle, STR_PlaceID = countryCities[lf].STR_PlaceID, STR_PlaceShortInfo = countryCities[lf].STR_PlaceShortInfo });
                                    }
                                }
                                leftList.Add(new WeightPlace { STR_PlaceTitle = countryCities[lf].STR_PlaceTitle, STR_PlaceID = countryCities[lf].STR_PlaceID, STR_PlaceShortInfo = countryCities[lf].STR_PlaceShortInfo });
                            }
                            leftCountryCityList = leftList;

                            gP2_UC_LeftModel.leftList = leftList;
                            gP2_UC_LeftModel.leftDisplay = leftDisplay;
                            gP2_UC_LeftModel.leftCountryCityList = leftCountryCityList;
                            break;
                        }
                    case 1884:
                        {
                            string placesIDs = strPlcsIDs.ToString();
                            Int32 _placesIDs = placesIDs.Count() - 1;
                            if (placesIDs.Substring(_placesIDs, 1) == ",")
                            {
                                placesIDs = placesIDs.Substring(0, _placesIDs);
                            }

                            List<CombineCountries> dvPlacesToComb = dbConn.QueryAsync<CombineCountries>(SqlCalls.SQL_CombineCountries(placesIDs)).Result.ToList();
                            //dvPlacesToComb.Sort();
                            string chkNA = "";
                            List<string> CombineCou = new List<string>();
                            for (Int32 cou = 0; cou <= dvPlacesToComb.Count - 1; cou++)
                            {
                                if (dvPlacesToComb[cou].CouID != counID)
                                {
                                    if (dvPlacesToComb[cou].CouNA != chkNA)
                                    {
                                        CombineCou.Add(dvPlacesToComb[cou].CouID.ToString() + "|" + dvPlacesToComb[cou].CouNA.Replace(" ", "_"));
                                        chkNA = dvPlacesToComb[cou].CouNA;
                                    }
                                }
                            }
                            gP2_UC_LeftModel.arrpCombCountry = CombineCou;
                            ViewBag.counNA = counNA;
                            break;
                        }
                    case 2032:
                        {
                            break;
                        }
                    case 1621:
                        {
                            gP2_UC_LeftModel.leftAtractions = boxContent.FindAll(ar => ar.STX_ProdKindID == 1621).ToList();
                            break;
                        }
                    case 1880:
                        {
                            gP2_UC_LeftModel.leftCMS = dbConn.QueryAsync<CMSPage>(SqlCalls.SQL_CMS_onGPpages(pgtype, plcID, plcIDs)).Result.ToList();
                            break;
                        }
                    case 1881:
                        {
                            gP2_UC_LeftModel.leftCityList = placesOnWeight.FindAll(x => x.STR_PlaceTypeID == 1 || x.STR_PlaceTypeID == 25);
                            break;
                        }
                    case 1623:
                        {
                            gP2_UC_LeftModel.leftHighlight = boxContent.FindAll(ar => ar.STX_ProdKindID == 1623).ToList();
                            break;
                        }
                    case 1620:
                        {
                            gP2_UC_LeftModel.leftInterest = boxContent.FindAll(ar => ar.STX_ProdKindID == 1620).ToList();
                            break;
                        }
                    case 1622:
                        {
                            gP2_UC_LeftModel.leftPrortyHigh = boxContent.FindAll(ar => ar.STX_ProdKindID == 1622).ToList();
                            break;
                        }
                    case 1912:
                        {
                            gP2_UC_LeftModel.leftDisplay = leftDisplay;
                            gP2_UC_LeftModel.leftOrientLong = boxContent.FindAll(ar => ar.STX_ProdKindID == 1912).ToList();
                            break;
                        }
                    case 1619:
                        {
                            gP2_UC_LeftModel.leftDisplay = leftDisplay;
                            gP2_UC_LeftModel.leftArea = boxContent.FindAll(ar => ar.STX_ProdKindID == 1619).ToList();
                            break;
                        }
                    case 1915:
                        {
                            gP2_UC_LeftModel.leftCountryCityList = countryCities;
                            break;
                        }
                }
            }

            dbConn.Dispose();
            ViewBag.AppBasePath = Request.Scheme + "://" + Request.Host;
            return View("Index", gP2_UC_LeftModel);

        }

    }
}
