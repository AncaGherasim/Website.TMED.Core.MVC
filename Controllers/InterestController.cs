using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MVC_TMED.Infrastructure;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using MVC_TMED.Models;
using MVC_TMED.Models.ViewModels;
using System.Text;
using System.Data;
using System.Data.SqlClient;

namespace MVC_TMED.Controllers
{
    public class InterestController : Controller
    {
        private readonly AppSettings _appSettings;
        private readonly DapperWrap _dapperWrap;

        public InterestController(IOptions<AppSettings> appsettings, DapperWrap dapperWrap)
        {
            _appSettings = appsettings.Value;
            _dapperWrap = dapperWrap;
        }

        [HttpGet("{name}/self_drive", Name = "SelfDrive_Route")] //Country/Self_Drive/Ireland_Vacations.aspx -> /Ireland/self_drive 
        [HttpGet("{country}/{name}/interest-{interestid}-{countryid}", Name = "Interest_Route")]
        [HttpHead("{name}/self_drive", Name = "SelfDrive_Route")] //Country/Self_Drive/Ireland_Vacations.aspx -> /Ireland/self_drive 
        [HttpHead("{country}/{name}/interest-{interestid}-{countryid}", Name = "Interest_Route")]
        [HttpPost("{name}/self_drive", Name = "SelfDrive_Route")] //Country/Self_Drive/Ireland_Vacations.aspx -> /Ireland/self_drive 
        [HttpPost("{country}/{name}/interest-{interestid}-{countryid}", Name = "Interest_Route")]
        public async Task<IActionResult> Index(string country, string name, string interestid, string countryid)
        {
            string routeName = ControllerContext.ActionDescriptor.AttributeRouteInfo.Name;

            if (Utilities.CheckMobileDevice() == false)
            {
                ViewBag.Mobile = 0;
                return await Desktop(country, name, interestid, countryid, routeName);
            }
            else
            {
                ViewBag.Mobile = 1;
                return await Mobile(country, name, interestid, countryid, routeName);
            }
        }
        public async Task<IActionResult> Desktop(string country, string name, string interestid, string countryid, string routeName)
        {
            Models.ViewModels.InterestViewModel viewModelTemplate = new Models.ViewModels.InterestViewModel();

            Int32 plcID = 0;
            string tmpVAL = "";
            Int32 intID = 0;
            //IDbConnection dbConn = new SqlConnection(_appSettings.ConnectionStrings.sqlConnStr);
            if (country is null)
            {

                //Self_Drive - most of them have GP, only E
                viewModelTemplate.intID = 1155;
                var Result1 = await _dapperWrap.GetRecords<PlacesH_MasterInterestContent>(SqlCalls.SQL_PageTemplate_PlacesH_MasterInterestContent(name, 1155));
                List<PlacesH_MasterInterestContent> dvSD = Result1.ToList();
                if (dvSD.Count == 0)
                {
                    throw new Exception("Self Driven " + name + " no Template row.");
                }
                tmpVAL = dvSD[0].SMC_Template;
                plcID = dvSD[0].STR_PlaceID;  //1169
                HttpContext.Response.Headers.Add("_utPg", "SLFDRV");

            }
            else
                {
                    //Interest - most of them have none
                    Int32.TryParse(interestid, out viewModelTemplate.intID);
                    Int32.TryParse(countryid, out plcID);
                    //List<MasterInterestContentTemplate> dvInterest = dbConn.QueryAsync<MasterInterestContentTemplate>(SqlCalls.SQL_PageTemplate_MasterInterestContent(id, "")).Result.ToList();
                    var Result2 = await _dapperWrap.GetRecords<MasterInterestContentTemplate>(SqlCalls.SQL_PageTemplate_PlaceCodeID_MasterInterestContent(interestid, countryid));
                    List<MasterInterestContentTemplate> dvInterest = Result2.ToList();
                    if (dvInterest.Count == 0)
                    {
                        throw new Exception("Interest " + name + " no Template row.");
                    }
                    tmpVAL = dvInterest[0].SMC_Template;

                //return View("A_Interest");
            }


            //SQL STRING QUERIES TO RETRIEVE ALL PAGE INFO NEEDED
            //List<MasterInterestInfo> dvIC = dbConn.QueryAsync<MasterInterestInfo>(SqlCalls.SQL_MasterInterestInfo(plcID, intID)).Result.ToList();
            var Result3 = await _dapperWrap.GetRecords<MasterInterestInfo>(SqlCalls.SQL_MasterInterestInfo(plcID, viewModelTemplate.intID));
                List<MasterInterestInfo> dvIC = Result3.ToList();
                if (dvIC.Count > 0)
                {
                    viewModelTemplate.intIDs = dvIC[0].SMCID;
                    viewModelTemplate.plcNA = dvIC[0].STR_PlaceTitle;
                    viewModelTemplate.plcIDs = dvIC[0].STRID;
                    viewModelTemplate.intNA = dvIC[0].SMC_Title;
                    viewModelTemplate.intDES = dvIC[0].SMC_Content;
                }
                viewModelTemplate.plcID = plcID;

                if (tmpVAL.Contains("GP") || tmpVAL.Contains("GP2"))
                {
                    //Customer Feedbacks by Place ID
                    //viewModelTemplate.listCustomFeed = dbConn.QueryAsync<Feedback>(SqlCalls.SQL_FeedbacksByPlaceID(plcID)).Result.ToList();
                    var result4 = await _dapperWrap.GetRecords<Feedback>(SqlCalls.SQL_FeedbacksByPlaceID(plcID));
                    viewModelTemplate.listCustomFeed = result4.ToList();

                    //Packages Priority List
                    //List<PackOnInterestPriority> dvPackOnCty = dbConn.QueryAsync<PackOnInterestPriority>(SqlCalls.SQL_PackOnInterestPriorityList(viewModelTemplate.plcIDs.ToString(), viewModelTemplate.intIDs.ToString())).Result.ToList();
                    var result5 = await _dapperWrap.GetRecords<PackOnInterestPriority>(SqlCalls.SQL_PackOnInterestPriorityList(viewModelTemplate.plcIDs.ToString(), viewModelTemplate.intIDs.ToString()));
                    List<PackOnInterestPriority> dvPackOnCty = result5.ToList();
                    viewModelTemplate.featPack = dvPackOnCty.FindAll(n => n.SPPW_Weight < 999);
                    if (viewModelTemplate.featPack.Count < 4)
                    {
                        viewModelTemplate.featPack = viewModelTemplate.featPack.FindAll(n => n.PDL_SequenceNo < 9);
                        viewModelTemplate.featPack.Sort(
                                delegate (PackOnInterestPriority p1, PackOnInterestPriority p2)
                                {
                                    return p1.PDL_SequenceNo.CompareTo(p2.PDL_SequenceNo);
                                });

                    }
                    viewModelTemplate.featItin = viewModelTemplate.featPack[0].PDLID;
                    foreach (PackOnInterestPriority p in viewModelTemplate.featPack)
                    {
                        viewModelTemplate.otherFeat = viewModelTemplate.otherFeat + "," + viewModelTemplate.featPack[0].PDLID;
                    }
                var first3 = dvPackOnCty.Take(3).ToList();
                var packid3 = "";
                var iC = 0;
                foreach (var d in first3)
                {
                    if (iC < first3.Count - 1) { packid3 = packid3 + "'" + d.PDLID + "', "; } else { packid3 = packid3 + "'" + d.PDLID + "'"; };
                    iC++;
                };

                //Boxes Content
                //viewModelTemplate.boxContent = dbConn.QueryAsync<BoxContent>(SqlCalls.SQL_BoxesContent(viewModelTemplate.intIDs)).Result.ToList();
                var result6 = await _dapperWrap.GetRecords<BoxContent>(SqlCalls.SQL_BoxesContent(viewModelTemplate.intIDs));
                    viewModelTemplate.boxContent = result6.ToList();
                    viewModelTemplate.boxContent1624 = viewModelTemplate.boxContent.FindAll(n => n.STX_ProdKindID == 1624);

                    //Structured Data
                    //List<PackOnInterestPriority> dvPackOnCty_sd = dbConn.QueryAsync<PackOnInterestPriority>(SqlCalls.SQL_PackOnInterestPriorityList(viewModelTemplate.plcIDs.ToString(), "0")).Result.ToList();
                    var result7 = await _dapperWrap.GetRecords<PackOnInterestPriority>(SqlCalls.SQL_PackOnInterestPriorityList(viewModelTemplate.plcIDs.ToString(), "0"));
                    List<PackOnInterestPriority> dvPackOnCty_sd = result7.ToList();
                    viewModelTemplate.listFeatured = dvPackOnCty_sd.Take(1).ToList();
                    viewModelTemplate.otherFeatured = dvPackOnCty_sd.Skip(1).Take(4).ToList();
                //CONTENT LIKE MANAGER SELECTION
                //viewModelTemplate.listCustDly = dbConn.QueryAsync<DisplayArea>(SqlCalls.SQL_ManagerDisplay(viewModelTemplate.intIDs)).Result.ToList();
                var result8 = await _dapperWrap.GetRecords<DisplayArea>(SqlCalls.SQL_ManagerDisplay(viewModelTemplate.intIDs));
                    viewModelTemplate.listCustDly = result8.ToList();

                    //WEIGHT CITIES
                    //viewModelTemplate.placesOnWeight = dbConn.QueryAsync<WeightPlace>(SqlCalls.SQL_weightPlacesByIntID(viewModelTemplate.intIDs, viewModelTemplate.plcIDs)).Result.ToList();
                    var result9 = await _dapperWrap.GetRecords<WeightPlace>(SqlCalls.SQL_weightPlacesByIntID(viewModelTemplate.intIDs, viewModelTemplate.plcIDs));
                    viewModelTemplate.placesOnWeight = result9.ToList();

                    //DECLARE TITLE AND METAS TO THIS PAGE
                    string pageTitle = "the Best " + viewModelTemplate.intNA + " Vacations | " + viewModelTemplate.intNA + " Flexible trips | " + viewModelTemplate.intNA + " Itineraries";
                    viewModelTemplate.pageMetaDesc = "Book the Best " + viewModelTemplate.intNA + " vacations, customize " + viewModelTemplate.intNA + " vacation itineraries, flexible trips to " + viewModelTemplate.intNA + ". Book " + viewModelTemplate.intNA + " packages online";
                    viewModelTemplate.pageMetaKey = viewModelTemplate.intNA + " air and hotel stays, sightseeing tours, hotel packages, deals, rail, images, online booking, pricing, information, hotel travel, recommendations, resort, accommodations, Europe";
                    viewModelTemplate.pageHeaderText = viewModelTemplate.intNA;
                    viewModelTemplate.pageBannerText = "US based|Price & Book in seconds|Discounted Air included";      
                    viewModelTemplate.pageDescriptionCity = viewModelTemplate.pageMetaDesc;
                    ViewBag.PageTitle = pageTitle;
                    ViewBag.pageMetaDesc = viewModelTemplate.pageMetaDesc;
                    ViewBag.pageMetaKey = viewModelTemplate.pageMetaKey;
                    ViewBag.tmpagetype = "interest";
                    ViewBag.tmpagetypeinstance = "";
                    ViewBag.tmrowid = "";
                    ViewBag.tmadstatus = "";
                    ViewBag.tmregion = "europe";
                    ViewBag.tmcountry = "";
                    ViewBag.tmdestination = "";

                //List<Interest_Info> dvTl = dbConn.QueryAsync<Interest_Info>(SqlCalls.SQL_Interest_Info(viewModelTemplate.intNA)).Result.ToList();
                var result10 = await _dapperWrap.GetRecords<Interest_Info>(SqlCalls.SQL_Interest_Info(viewModelTemplate.intNA));
                    List<Interest_Info> dvTl = result10.ToList();
                    if (dvTl.Count > 0)
                    {
                        pageTitle = dvTl[0].SEO_PageTitle ?? pageTitle;
                        viewModelTemplate.pageMetaDesc = dvTl[0].SEO_MetaDescription ?? viewModelTemplate.pageMetaDesc;
                        viewModelTemplate.pageMetaKey = dvTl[0].SEO_MetaKeyword ?? viewModelTemplate.pageMetaKey;
                        viewModelTemplate.pageHeaderText = dvTl[0].SEO_HeaderText ?? viewModelTemplate.pageHeaderText;
                    }
                    //MODIFY OR REMOVE/ADD DINAMICALLY Title and meta on Master Page
                    //Master.Page.Title = pageTitle
                    //' --- MODIFY ---
                    //Dim header1 As HtmlHead = DirectCast(Master.FindControl("pageHead"), HtmlHead)
                    //Dim metaDescr As HtmlMeta = header1.FindControl("PageDescription")
                    //metaDescr.Content = pageMetaDesc
                    //Dim metaKeywrd As HtmlMeta = header1.FindControl("PageKeyword")
                    //metaKeywrd.Content = pageMetaKey

                    //List<NumberofCustomerFeedbacks> overAllReviews = dbConn.QueryAsync<NumberofCustomerFeedbacks>(SqlCalls.SQL_Get_NumberofCustomerFeedbacks_OverAllScore()).Result.ToList();
                    var result11 = await _dapperWrap.GetRecords<NumberofCustomerFeedbacks>(SqlCalls.SQL_Get_NumberofCustomerFeedbacks_OverAllScore());
                    List<NumberofCustomerFeedbacks> overAllReviews = result11.ToList();
                    Int32 NumComments = 0;
                    Decimal overAllAvg = 0;
                    if (overAllReviews.Count > 0)
                    {
                        NumComments = overAllReviews[0].NumComments;
                        viewModelTemplate.Score = overAllReviews[0].Score;
                        overAllAvg = Decimal.Round(viewModelTemplate.Score, 1);
                    }

                    if (tmpVAL.Contains("GP2"))
                    {

                        List<DisplayArea> leftDisplay = viewModelTemplate.listCustDly.FindAll(x => x.SDP_DisplayProdKindID == 1877);
                        List<DisplayArea> centerDisplay = viewModelTemplate.listCustDly.FindAll(x => x.SDP_DisplayProdKindID == 1878);

                        var result111 = await _dapperWrap.GetRecords<BoxContent>(SqlCalls.SQL_BoxesContent(viewModelTemplate.intIDs));
                        List<BoxContent> boxContent = result111.ToList();
                        if (centerDisplay.Count > 0)
                        {
                            List<BoxContent> topCenterOnPage = boxContent.FindAll(c => c.STX_ProdKindID == 1983).ToList();
                            viewModelTemplate.allTopDisplay = topCenterOnPage.Join(centerDisplay, b => b.STX_ProdKindID, d => d.SDP_GroupProdKindID, (b, d) =>
                                 new DisplayBox
                                 {
                                     CMS_Content = b.CMS_Content,
                                     STX_CMSID = b.STX_CMSID,
                                     STX_Description = b.STX_Description
                                    ,
                                     STX_PictureHeightpx = b.STX_PictureHeightpx,
                                     STX_PictureURL = b.STX_PictureURL
                                    ,
                                     STX_PictureWidthpx = b.STX_PictureWidthpx,
                                     STX_Priority = b.STX_Priority
                                    ,
                                     STX_ProdKindID = b.STX_ProdKindID,
                                     STX_Title = b.STX_Title
                                    ,
                                     STX_URL = b.STX_URL,
                                     SDP_DisplayTitle = d.SDP_DisplayTitle,
                                     SDP_TitleBGColor = d.SDP_TitleBGColor
                                 }).ToList();
                            Int32 allTop = viewModelTemplate.allTopDisplay.Count;
                        }

                    ViewBag.PageType = "ListingPage";
                    ViewBag.CriteoIDs = packid3;

                    ViewBag.viewUsedName = "GP2_Interest";
                    return View("GP2_Interest", viewModelTemplate);
                    }
                    else
                     {
                    ViewBag.PageType = "ListingPage";
                    ViewBag.CriteoIDs = packid3;

                    ViewBag.viewUsedName = "GP_Interest";
                    return View("GP_Interest", viewModelTemplate);
                    }
                }
                else //not GP or GP2
                {
                    //viewModelTemplate.placesInterest = dbConn.QueryAsync<PlacesInterest>(SqlCalls.SQL_PlacesInterestByMasterInterestID(viewModelTemplate.intIDs.ToString())).Result.ToList();
                    var result12 = await _dapperWrap.GetRecords<PlacesInterest>(SqlCalls.SQL_PlacesInterestByMasterInterestID(viewModelTemplate.intIDs.ToString()));
                    viewModelTemplate.placesInterest = result12.ToList();
                    StringBuilder strPlsIDOnInt = new StringBuilder();
                    for (Int32 w = 0; w < viewModelTemplate.placesInterest.Count; w++)
                    {
                        if (w == 0)
                        {
                            strPlsIDOnInt.Append(viewModelTemplate.placesInterest[w].STR_PlaceID);
                        }
                        else
                        {
                            strPlsIDOnInt.Append(", " + viewModelTemplate.placesInterest[w].STR_PlaceID.ToString());
                        }

                    }

                    //viewModelTemplate.objPlaceExt = dbConn.QueryAsync<plcExtension>(SqlCalls.SQL_GetHiglightsByPlaceID(viewModelTemplate.plcID.ToString())).Result.ToList();
                    var result13 = await _dapperWrap.GetRecords<plcExtension>(SqlCalls.SQL_GetHiglightsByPlaceID(viewModelTemplate.plcID.ToString()));
                    viewModelTemplate.objPlaceExt = result13.ToList();

                    //List<EachCity> objCitiesOnCountry = dbConn.QueryAsync<EachCity>(SqlCalls.SQL_CitiesOnCountry(plcID.ToString())).Result.ToList();
                    var result15 = await _dapperWrap.GetRecords<EachCity>(SqlCalls.SQL_CitiesOnCountry(plcID.ToString()));
                    List<EachCity> objCitiesOnCountry = result15.ToList();
                    viewModelTemplate.listCitiesOn = objCitiesOnCountry.FindAll(x => x.STR_PlaceAIID < 15); // && x.STI_SysCodeID == 1324
                    viewModelTemplate.listCitiesMore = objCitiesOnCountry.FindAll(x => !(x.STR_PlaceAIID < 15)); //&& x.STI_SysCodeID == 1324

                    //Packages Priority List
                    //List<PackOnInterestPriority> dvPackOnCty = dbConn.QueryAsync<PackOnInterestPriority>(SqlCalls.SQL_PackOnInterestPriorityList(viewModelTemplate.plcIDs.ToString(), viewModelTemplate.intIDs.ToString())).Result.ToList();
                    var result14 = await _dapperWrap.GetRecords<PackOnInterestPriority>(SqlCalls.SQL_PackOnInterestPriorityList(viewModelTemplate.plcIDs.ToString(), viewModelTemplate.intIDs.ToString()));
                    List<PackOnInterestPriority> dvPackOnCty = result14.ToList();
                    viewModelTemplate.featPack = dvPackOnCty.FindAll(n => n.SPPW_Weight < 999);
                    if (viewModelTemplate.featPack.Count < 4)
                    {
                        viewModelTemplate.featPack = viewModelTemplate.featPack.FindAll(n => n.PDL_SequenceNo < 9);
                        viewModelTemplate.featPack.Sort(
                                delegate (PackOnInterestPriority p1, PackOnInterestPriority p2)
                                {
                                    return p1.PDL_SequenceNo.CompareTo(p2.PDL_SequenceNo);
                                });
                    }
                        var first3 = dvPackOnCty.Take(3).ToList();
                        var packid3 = "";
                        var iC = 0;
                        foreach (var d in first3)
                        {
                            if (iC < first3.Count - 1) { packid3 = packid3 + "'" + d.PDLID + "', "; } else { packid3 = packid3 + "'" + d.PDLID + "'"; };
                            iC++;
                        };


                System.Text.RegularExpressions.Regex regex = new System.Text.RegularExpressions.Regex("<[^<>]+>");
                    StringBuilder strPackOnWei = new StringBuilder();
                    StringBuilder strWeiPacks = new StringBuilder();
                    StringBuilder strREL = new StringBuilder();
                    //List<PackOnInterestPriority> top3packages = dvPackOnCty.Take(3).ToList();
                    //List<PackOnInterestPriority> nextpackages = dvPackOnCty.Skip(3).ToList();
                    //List<RelPackByPackID> relpackstop3 = new List<RelPackByPackID>();
                    for (Int32 p = 0; p <= dvPackOnCty.Count - 1; p++)
                    {
                        if (p == 0)
                        {
                            strPackOnWei.Append(dvPackOnCty[p].PDL_SequenceNo.ToString() + "|" + dvPackOnCty[p].PDLID.ToString() + "|" + dvPackOnCty[p].PDL_Title + "|" + dvPackOnCty[p].STP_Save_.ToString() + "|" + dvPackOnCty[p].PDL_Duration.ToString() + "|" + dvPackOnCty[p].SPD_Description + "|" + dvPackOnCty[p].PDL_Content + "|" + dvPackOnCty[p].IMG_Path_URL + "|" + dvPackOnCty[p].CountryName);
                            strWeiPacks.Append(dvPackOnCty[p].PDLID.ToString());
                        }
                        else
                        {
                            strPackOnWei.Append("~" + dvPackOnCty[p].PDL_SequenceNo.ToString() + "|" + dvPackOnCty[p].PDLID.ToString() + "|" + dvPackOnCty[p].PDL_Title + "|" + dvPackOnCty[p].STP_Save_.ToString() + "|" + dvPackOnCty[p].PDL_Duration.ToString() + "|" + dvPackOnCty[p].SPD_Description + "|" + dvPackOnCty[p].PDL_Content + "|" + dvPackOnCty[p].IMG_Path_URL + "|" + dvPackOnCty[p].CountryName);
                            strWeiPacks.Append(", " + dvPackOnCty[p].PDLID.ToString());
                        }
                    }

                    //string sqlPackOnInt = "";
                    //if (strPlsIDOnInt.ToString() != "")
                    //{
                    //    sqlPackOnInt = SqlCalls.SQL_PackOnPlace(strPlsIDOnInt.ToString());
                    //    if (strWeiPacks.ToString() != "")
                    //    {
                    //        sqlPackOnInt = sqlPackOnInt + " AND (PRIT.PDLID NOT IN (" + strWeiPacks.ToString() + ")) ";
                    //    }
                    //    sqlPackOnInt = sqlPackOnInt + " ORDER BY PRIT.PDL_SequenceNo ASC,STP_save ASC, PRIT.PDL_Title";
                    //}



                    if (strWeiPacks.ToString() != "")
                    {
                        string sqlRelPack = SqlCalls.SQL_RelPackByPackID(strWeiPacks.ToString());
                        //List<RelPackByPackID> dvRel = dbConn.QueryAsync<RelPackByPackID>(sqlRelPack).Result.ToList();
                        var result16 = await _dapperWrap.GetRecords<RelPackByPackID>(sqlRelPack);
                        List<RelPackByPackID> dvRel = result16.ToList();
                        Int32 plcPKid = 0;
                        Int32 lopC = 0;
                        for (Int32 r = 0; r <= dvRel.Count - 1; r++)
                        {
                            if (plcPKid != dvRel[r].PackageId)
                            {
                                plcPKid = dvRel[r].PackageId;
                                if (r > 0)
                                {
                                    strREL.Append("|");
                                }
                                lopC = 0;
                            }
                            if (lopC == 0)
                            {
                                strREL.Append(dvRel[r].PackageId.ToString() + ":" + dvRel[r].PlaceId.ToString() + "^" + dvRel[r].PlaceTitle + "^" + dvRel[r].NoOfPacks.ToString() + "^" + dvRel[r].str_placetypeid.ToString());
                            }
                            else
                            {
                                strREL.Append("@" + dvRel[r].PlaceId.ToString() + "^" + dvRel[r].PlaceTitle + "^" + dvRel[r].NoOfPacks.ToString() + "^" + dvRel[r].str_placetypeid.ToString());
                            }
                            lopC += 1;
                        }
                    }
                    string[] relPart = strREL.ToString().Split("|");
                    string[] packPart = strPackOnWei.ToString().Split("~");
                    StringBuilder strWiePacksOn = new StringBuilder();
                    Int32 eachCo = 0;
                    string[] Ppk;
                    string[] Pr;
                    foreach (var kp in packPart)
                    {
                        Ppk = kp.Split("|");
                        foreach (var r in relPart)
                        {
                            Pr = r.Split(":");
                            if (Ppk[1] == Pr[0])
                            {
                                if (eachCo == 0)
                                {
                                    strWiePacksOn.Append(kp + "|" + Pr[1]);
                                }
                                else
                                {
                                    strWiePacksOn.Append("~" + kp + "|" + Pr[1]);
                                }
                                eachCo += 1;
                            }
                        }
                    }
                    strPackOnWei = strWiePacksOn;
                    if (regex.IsMatch(strPackOnWei.ToString()))
                    {
                        viewModelTemplate.strPackOnWeiString = regex.Replace(strPackOnWei.ToString(), "");
                    }
                ViewBag.PageType = "ListingPage";
                ViewBag.CriteoIDs = packid3;

                //Cookie for marketing Compain
                string strURL = HttpContext.Request.Path;
                string sCampaignCode = "";
                if (HttpContext.Request.Query["utm_campaign"] != "")
                {
                    sCampaignCode = HttpContext.Request.Query["utm_campaign"];
                }
                else
                {
                    if (strURL.Contains("utm_campaign"))
                    {
                        sCampaignCode = strURL.Replace(strURL.Substring(1, strURL.IndexOf("utm_campaign=") - 1), "");
                        sCampaignCode = sCampaignCode.Replace("utm_campaign=", "");
                        if (sCampaignCode.Contains("&"))
                        {
                            string[] strParts = sCampaignCode.Split("&");
                            sCampaignCode = strParts[0];
                        }
                    }
                }
                if (sCampaignCode == null)
                {
                    if (HttpContext.Request.Cookies["utmcampaign"] == null)
                    {
                        sCampaignCode = "Direct";
                    }
                    else
                    {
                        string _utmcampaign = HttpContext.Request.Cookies["utmcampaign"];
                        if (HttpContext.Request.Cookies["utmcampaign"].StartsWith("a="))
                        {
                            _utmcampaign = HttpContext.Request.Cookies["utmcampaign"].Substring(2, _utmcampaign.Length - 2);
                        }
                        sCampaignCode = System.Text.Encodings.Web.HtmlEncoder.Default.Encode(_utmcampaign);
                    }
                }
                Microsoft.AspNetCore.Http.CookieOptions optionUtmCampaign = new Microsoft.AspNetCore.Http.CookieOptions();
                optionUtmCampaign.Domain = ".tripmasters.com";
                optionUtmCampaign.IsEssential = true;
                optionUtmCampaign.Expires = DateTime.Now.AddDays(365);
                HttpContext.Response.Cookies.Append("utmcampaign", sCampaignCode, optionUtmCampaign);

                ViewBag.viewUsedName = "A_Interest";
                return View("A_Interest", viewModelTemplate);                      
                    
                }
            }

        public async Task<IActionResult> Mobile(string country, string name, string interestid, string countryid, string routeName)
        {
            Models.ViewModels.InterestViewModel viewModelTemplate = new Models.ViewModels.InterestViewModel();

            Int32 plcID = 0;
            string tmpVAL = "";
            //IDbConnection dbConn = new SqlConnection(_appSettings.ConnectionStrings.sqlConnStr);
            if (country is null)
            {

                //Self_Drive - most of them have GP, only E
                viewModelTemplate.intID = 1653;
                //List<PlacesH_MasterInterestContent> dvSD = dbConn.QueryAsync<PlacesH_MasterInterestContent>(SqlCalls.SQL_PageTemplate_PlacesH_MasterInterestContent(name, intID)).Result.ToList();
                var Result1 = await _dapperWrap.GetRecords<PlacesH_MasterInterestContent>(SqlCalls.SQL_PageTemplate_TitleCodeId_MasterInterestContent(name, "212"));
                List<PlacesH_MasterInterestContent> dvSD = Result1.ToList();
                if (dvSD.Count == 0)
                {
                    throw new Exception("Self Driven " + name + " no Template row.");
                }
                tmpVAL = dvSD[0].SMC_Template;
                plcID = dvSD[0].STR_PlaceID;  //1169
                                              //return View("GP_Interest");
            }
            else
            {
                //Interest - most of them have none
                Int32.TryParse(interestid, out viewModelTemplate.intID);
                Int32.TryParse(countryid, out plcID);
                //List<MasterInterestContentTemplate> dvInterest = dbConn.QueryAsync<MasterInterestContentTemplate>(SqlCalls.SQL_PageTemplate_MasterInterestContent(id, "")).Result.ToList();
                var Result2 = await _dapperWrap.GetRecords<MasterInterestContentTemplate>(SqlCalls.SQL_PageTemplate_PlaceCodeID_MasterInterestContent(interestid, countryid));
                List<MasterInterestContentTemplate> dvInterest = Result2.ToList();
                if (dvInterest.Count == 0)
                {
                    throw new Exception("Interest " + name + " no Template row.");
                }
                tmpVAL = dvInterest[0].SMC_Template;

                //return View("A_Interest");
            }


            //SQL STRING QUERIES TO RETRIEVE ALL PAGE INFO NEEDED
            var Result3 = await _dapperWrap.GetRecords<MasterInterestInfo>(SqlCalls.SQL_MasterInterestInfo(plcID, viewModelTemplate.intID));
            List<MasterInterestInfo> dvIC = Result3.ToList();
            if (dvIC.Count > 0)
            {
                viewModelTemplate.intIDs = dvIC[0].SMCID;
                viewModelTemplate.plcNA = dvIC[0].STR_PlaceTitle;
                viewModelTemplate.plcIDs = dvIC[0].STRID;
                viewModelTemplate.intNA = dvIC[0].SMC_Title;
                viewModelTemplate.intDES = dvIC[0].SMC_Content;
            }
            viewModelTemplate.plcID = plcID;

            if (!tmpVAL.Contains("none"))
            {
                //Packages Priority List
                var result4 = await _dapperWrap.GetRecords<PackOnInterestPriority>(SqlCalls.SQL_PackOnInterestPriorityList(viewModelTemplate.plcIDs.ToString(), viewModelTemplate.intIDs.ToString()));
                List<PackOnInterestPriority> dvPackOnCty = result4.ToList();
                viewModelTemplate.featPack = dvPackOnCty.FindAll(n => n.SPPW_Weight < 999);
                if (viewModelTemplate.featPack.Count() == 0)
                {
                    viewModelTemplate.featPack = dvPackOnCty.FindAll(x => x.SPPW_Weight < 9);
                }
                var first3 = dvPackOnCty.Take(3).ToList();
                var packid3 = "";
                var iC = 0;
                foreach (var d in first3)
                {
                    if (iC < first3.Count - 1) { packid3 = packid3 + "'" + d.PDLID + "', "; } else { packid3 = packid3 + "'" + d.PDLID + "'"; };
                    iC++;
                };

                //CONTENT LIKE MANAGER SELECTION
                var result5 = await _dapperWrap.GetRecords<DisplayArea>(SqlCalls.SQL_ManagerDisplay(viewModelTemplate.intIDs));
                viewModelTemplate.listCustDly = result5.ToList();

                var result6 = await _dapperWrap.GetRecords<BoxContent>(SqlCalls.SQL_BoxesContent(viewModelTemplate.intIDs));
                viewModelTemplate.boxContent = result6.ToList();


                //WEIGHT CITIES
                var result7 = await _dapperWrap.GetRecords<WeightPlace>(SqlCalls.SQL_weightPlacesByIntID(viewModelTemplate.intIDs, viewModelTemplate.plcIDs));
                viewModelTemplate.placesOnWeight = result7.ToList();

                //CMS Content
                var result8 = await _dapperWrap.GetRecords<CMSPage>(SqlCalls.SQL_CMS_onGPpages("WInt", viewModelTemplate.intIDs, 0));
                viewModelTemplate.leftCMS = result8.ToList();

                //Customer Feedbacks by Place ID
                var result9 = await _dapperWrap.GetRecords<Feedback>(SqlCalls.SQL_FeedbacksByPlaceID(plcID));
                viewModelTemplate.listCustomFeed = result9.ToList();
                viewModelTemplate.packFeedCountC = viewModelTemplate.listCustomFeed.Count();

                var result17 = await _dapperWrap.GetRecords<PackOnInterestPriority>(SqlCalls.SQL_PackOnInterestPriorityList(viewModelTemplate.plcIDs.ToString(), "0"));
                List<PackOnInterestPriority> dvPackOnCty_d = result17.ToList();
                viewModelTemplate.listFeatured = dvPackOnCty_d.Take(1).ToList();
                viewModelTemplate.otherFeatured = dvPackOnCty_d.Skip(1).Take(4).ToList();

                //DECLARE TITLE AND METAS TO THIS PAGE
                string pageTitle = "the Best " + viewModelTemplate.intNA + " Vacations | " + viewModelTemplate.intNA + " Flexible trips | " + viewModelTemplate.intNA + " Itineraries";
                viewModelTemplate.pageMetaDesc = "Book the Best " + viewModelTemplate.intNA + " vacations, customize " + viewModelTemplate.intNA + " vacation itineraries, flexible trips to " + viewModelTemplate.intNA + ". Book " + viewModelTemplate.intNA + " packages online";
                viewModelTemplate.pageMetaKey = viewModelTemplate.intNA + " air and hotel stays, sightseeing tours, hotel packages, deals, rail, images, online booking, pricing, information, hotel travel, recommendations, resort, accommodations, Europe";
                viewModelTemplate.pageHeaderText = viewModelTemplate.intNA;
                viewModelTemplate.pageBannerText = "US based|Price & Book in seconds|Discounted Air included";
                viewModelTemplate.pageDescriptionCity = viewModelTemplate.pageMetaDesc;
                ViewBag.PageTitle = pageTitle;
                ViewBag.pageMetaDesc = viewModelTemplate.pageMetaDesc;
                ViewBag.pageMetaKey = viewModelTemplate.pageMetaKey;
                ViewBag.tmpagetype = "interest";
                ViewBag.tmpagetypeinstance = "";
                ViewBag.tmrowid = "";
                ViewBag.tmadstatus = "";
                ViewBag.tmregion = "europe";
                ViewBag.tmcountry = "";
                ViewBag.tmdestination = "";

                //Review Score
                var result10 = await _dapperWrap.GetRecords<NumberofCustomerFeedbacks>(SqlCalls.SQL_Get_NumberofCustomerFeedbacks_OverAllScore());
                List<NumberofCustomerFeedbacks> overAllReviews = result10.ToList();
                viewModelTemplate.NumComments = overAllReviews.FirstOrDefault().NumComments;
                viewModelTemplate.Score = overAllReviews.FirstOrDefault().Score;
                string temp = "";

                if (tmpVAL.Contains(",GP2,"))
                {
                    viewModelTemplate.centerDsp = viewModelTemplate.boxContent.FindAll(x => x.STX_ProdKindID == 1983).ToList();
                    temp = "GP2";
                }
                else if (tmpVAL.Contains(",GP,"))
                {
                    viewModelTemplate.centerDsp = viewModelTemplate.boxContent.FindAll(x => x.STX_ProdKindID == 1912).ToList();
                    temp = "GP";
                }
                ViewBag.PageType = "ListingPage";
                ViewBag.CriteoIDs = packid3;

                ViewBag.viewUsedName = temp + "_Interest_Mob";
                return View(temp + "_Interest_Mob", viewModelTemplate);
            }
            else
            {
                var result12 = await _dapperWrap.GetRecords<PlacesInterest>(SqlCalls.SQL_PlacesInterestByMasterInterestID(viewModelTemplate.intIDs.ToString()));
                viewModelTemplate.placesInterest = result12.ToList();
                StringBuilder strPlsIDOnInt = new StringBuilder();
                for (Int32 w = 0; w < viewModelTemplate.placesInterest.Count; w++)
                {
                    if (w == 0)
                    {
                        strPlsIDOnInt.Append(viewModelTemplate.placesInterest[w].STR_PlaceID);
                    }
                    else
                    {
                        strPlsIDOnInt.Append(", " + viewModelTemplate.placesInterest[w].STR_PlaceID.ToString());
                    }

                }

                //viewModelTemplate.objPlaceExt = dbConn.QueryAsync<plcExtension>(SqlCalls.SQL_GetHiglightsByPlaceID(viewModelTemplate.plcID.ToString())).Result.ToList();
                var result13 = await _dapperWrap.GetRecords<plcExtension>(SqlCalls.SQL_GetHiglightsByPlaceID(viewModelTemplate.plcID.ToString()));
                viewModelTemplate.objPlaceExt = result13.ToList();

                //List<EachCity> objCitiesOnCountry = dbConn.QueryAsync<EachCity>(SqlCalls.SQL_CitiesOnCountry(plcID.ToString())).Result.ToList();
                var result15 = await _dapperWrap.GetRecords<EachCity>(SqlCalls.SQL_CitiesOnCountry(plcID.ToString()));
                List<EachCity> objCitiesOnCountry = result15.ToList();
                viewModelTemplate.listCitiesOn = objCitiesOnCountry.FindAll(x => x.STR_PlaceAIID < 15); // && x.STI_SysCodeID == 1324
                viewModelTemplate.listCitiesMore = objCitiesOnCountry.FindAll(x => !(x.STR_PlaceAIID < 15)); // && x.STI_SysCodeID == 1324



                //Packages Priority List
                //List<PackOnInterestPriority> dvPackOnCty = dbConn.QueryAsync<PackOnInterestPriority>(SqlCalls.SQL_PackOnInterestPriorityList(viewModelTemplate.plcIDs.ToString(), viewModelTemplate.intIDs.ToString())).Result.ToList();
                var result14 = await _dapperWrap.GetRecords<PackOnInterestPriority>(SqlCalls.SQL_PackOnInterestPriorityList(viewModelTemplate.plcIDs.ToString(), viewModelTemplate.intIDs.ToString()));
                List<PackOnInterestPriority> dvPackOnCty = result14.ToList();
                viewModelTemplate.featPack = dvPackOnCty.FindAll(n => n.SPPW_Weight < 999);
                if (viewModelTemplate.featPack.Count < 4)
                {
                    viewModelTemplate.featPack = viewModelTemplate.featPack.FindAll(n => n.PDL_SequenceNo < 9);
                    viewModelTemplate.featPack.Sort(
                            delegate (PackOnInterestPriority p1, PackOnInterestPriority p2)
                            {
                                return p1.PDL_SequenceNo.CompareTo(p2.PDL_SequenceNo);
                            });
                }

                var first3 = dvPackOnCty.Take(3).ToList();
                var packid3 = "";
                var iC = 0;
                foreach (var d in first3)
                {
                    if (iC < first3.Count - 1) { packid3 = packid3 + "'" + d.PDLID + "', "; } else { packid3 = packid3 + "'" + d.PDLID + "'"; };
                    iC++;
                };

                System.Text.RegularExpressions.Regex regex = new System.Text.RegularExpressions.Regex("<[^<>]+>");
                StringBuilder strPackOnWei = new StringBuilder();
                StringBuilder strWeiPacks = new StringBuilder();
                StringBuilder strREL = new StringBuilder();
                //List<PackOnInterestPriority> top3packages = dvPackOnCty.Take(3).ToList();
                //List<PackOnInterestPriority> nextpackages = dvPackOnCty.Skip(3).ToList();
                //List<RelPackByPackID> relpackstop3 = new List<RelPackByPackID>();
                for (Int32 p = 0; p <= dvPackOnCty.Count - 1; p++)
                {
                    if (p == 0)
                    {
                        strPackOnWei.Append(dvPackOnCty[p].PDL_SequenceNo.ToString() + "|" + dvPackOnCty[p].PDLID.ToString() + "|" + dvPackOnCty[p].PDL_Title + "|" + dvPackOnCty[p].STP_Save_.ToString() + "|" + dvPackOnCty[p].PDL_Duration.ToString() + "|" + dvPackOnCty[p].SPD_Description + "|" + dvPackOnCty[p].PDL_Content + "|" + dvPackOnCty[p].IMG_Path_URL + "|" + dvPackOnCty[p].CountryName);
                        strWeiPacks.Append(dvPackOnCty[p].PDLID.ToString());
                    }
                    else
                    {
                        strPackOnWei.Append("~" + dvPackOnCty[p].PDL_SequenceNo.ToString() + "|" + dvPackOnCty[p].PDLID.ToString() + "|" + dvPackOnCty[p].PDL_Title + "|" + dvPackOnCty[p].STP_Save_.ToString() + "|" + dvPackOnCty[p].PDL_Duration.ToString() + "|" + dvPackOnCty[p].SPD_Description + "|" + dvPackOnCty[p].PDL_Content + "|" + dvPackOnCty[p].IMG_Path_URL + "|" + dvPackOnCty[p].CountryName);
                        strWeiPacks.Append(", " + dvPackOnCty[p].PDLID.ToString());
                    }
                }

                //string sqlPackOnInt = "";
                //if (strPlsIDOnInt.ToString() != "")
                //{
                //    sqlPackOnInt = SqlCalls.SQL_PackOnPlace(strPlsIDOnInt.ToString());
                //    if (strWeiPacks.ToString() != "")
                //    {
                //        sqlPackOnInt = sqlPackOnInt + " AND (PRIT.PDLID NOT IN (" + strWeiPacks.ToString() + ")) ";
                //    }
                //    sqlPackOnInt = sqlPackOnInt + " ORDER BY PRIT.PDL_SequenceNo ASC,STP_save ASC, PRIT.PDL_Title";
                //}



                if (strWeiPacks.ToString() != "")
                {
                    string sqlRelPack = SqlCalls.SQL_RelPackByPackID(strWeiPacks.ToString());
                    //List<RelPackByPackID> dvRel = dbConn.QueryAsync<RelPackByPackID>(sqlRelPack).Result.ToList();
                    var result16 = await _dapperWrap.GetRecords<RelPackByPackID>(sqlRelPack);
                    List<RelPackByPackID> dvRel = result16.ToList();
                    Int32 plcPKid = 0;
                    Int32 lopC = 0;
                    for (Int32 r = 0; r <= dvRel.Count - 1; r++)
                    {
                        if (plcPKid != dvRel[r].PackageId)
                        {
                            plcPKid = dvRel[r].PackageId;
                            if (r > 0)
                            {
                                strREL.Append("|");
                            }
                            lopC = 0;
                        }
                        if (lopC == 0)
                        {
                            strREL.Append(dvRel[r].PackageId.ToString() + ":" + dvRel[r].PlaceId.ToString() + "^" + dvRel[r].PlaceTitle + "^" + dvRel[r].NoOfPacks.ToString() + "^" + dvRel[r].str_placetypeid.ToString());
                        }
                        else
                        {
                            strREL.Append("@" + dvRel[r].PlaceId.ToString() + "^" + dvRel[r].PlaceTitle + "^" + dvRel[r].NoOfPacks.ToString() + "^" + dvRel[r].str_placetypeid.ToString());
                        }
                        lopC += 1;
                    }
                }
                string[] relPart = strREL.ToString().Split("|");
                string[] packPart = strPackOnWei.ToString().Split("~");
                StringBuilder strWiePacksOn = new StringBuilder();
                Int32 eachCo = 0;
                string[] Ppk;
                string[] Pr;
                foreach (var kp in packPart)
                {
                    Ppk = kp.Split("|");
                    foreach (var r in relPart)
                    {
                        Pr = r.Split(":");
                        if (Ppk[1] == Pr[0])
                        {
                            if (eachCo == 0)
                            {
                                strWiePacksOn.Append(kp + "|" + Pr[1]);
                            }
                            else
                            {
                                strWiePacksOn.Append("~" + kp + "|" + Pr[1]);
                            }
                            eachCo += 1;
                        }
                    }
                }
                strPackOnWei = strWiePacksOn;
                if (regex.IsMatch(strPackOnWei.ToString()))
                {
                    viewModelTemplate.strPackOnWeiString = regex.Replace(strPackOnWei.ToString(), "");
                }
                ViewBag.PageType = "ListingPage";
                ViewBag.CriteoIDs = packid3;

                ViewBag.viewUsedName = "A_Interest";
                return View("A_Interest", viewModelTemplate);
            }
        }
    }
}