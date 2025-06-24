using MVC_TMED.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Xml;
using System.Text;
using Dapper;
using System.Data;
using System.Data.SqlClient;
using System.Net;
using System.IO.Compression;
using System.IO;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using System.Threading.Tasks;

namespace MVC_TMED.Infrastructure
{
    public class Utilities
    {
        private static IHttpContextAccessor _httpContextAccessor;
        private static AppSettings _appSettings;
        private static AWSParameterStoreService _awsParameterStoreService;
        private static DapperWrap _dapperWrap;
        public static void Configure(IHttpContextAccessor httpContextAccessor, IOptions<AppSettings> appSettings, AWSParameterStoreService awsParameterStoreService, DapperWrap dapperWrap)
        {
            _httpContextAccessor = httpContextAccessor;
            _appSettings = appSettings.Value;
            _awsParameterStoreService = awsParameterStoreService;
            _dapperWrap = dapperWrap;
        }
        public static string FormatCustomerComment(string Comment, System.Int32 CommentLength)
        {
            string commentBold = "";
            string commentNorm = "";
            if (Comment.Length == 0 || CommentLength <= 0)
            {
                return "";
            }
            if (CommentLength > Comment.Length - 1)
                CommentLength = Comment.Length - 1;
            if (Comment.IndexOf("----- No") > 0)
                return Comment.Replace("\r\n", "<br/>");
            try
            {
                Comment = Comment.Substring(0, CommentLength) + " ...";
                Regex r = new Regex("[!?.]", RegexOptions.None);
                Match mc = r.Match(Comment);
                if (mc.Success)
                {
                    commentBold = Comment.Substring(0, mc.Index + 1);
                    commentNorm = Comment.Substring(mc.Index + 1);
                }
                else
                {
                    commentBold = Comment;
                    commentNorm = "";
                }
            }
            catch (System.IO.IOException e)
            {
                throw new Exception(" Detail: FormatCustomerComment() 2 <div>" + e.Message + "<br/>Error occurred.</div>");
            }

            return "<b>" + commentBold.Replace("\r\n", "<br/>") + "</b>" + commentNorm.Replace("\r\n", "<br/>");
        }

        public static string FormatCustomerComment(string Comment)
        {
            string commentBold = "";
            string commentNorm = "";
            Comment = Comment.Trim();

            if (Comment.Length == 0)
            {
                return "";
            }
            if (Comment.IndexOf("----- No") > 0)
                return Comment.Replace("\r\n", "<br/>");
            try
            {
                Regex r = new Regex("[!?.]", RegexOptions.None);
                Match mc = r.Match(Comment);
                if (mc.Success)
                {
                    commentBold = Comment.Substring(0, mc.Index + 1);
                    commentNorm = Comment.Substring(mc.Index + 1);
                }
                else
                {
                    commentBold = Comment;
                    commentNorm = "";
                }
            }
            catch (System.IO.IOException e)
            {
                throw new Exception(" Detail: FormatCustomerComment() 2 <div>" + e.Message + "<br/>Error occurred.</div>");
            }

            return "<b>" + commentBold.Replace("\r\n", "<br/>") + "</b>" + commentNorm.Replace("\r\n", "<br/>");
        }

        public static string ShortComment(string Comment)
        {
            string shortComm = "";
            Int32 howLong = 250;

            if (Comment.Trim().Length <= howLong)
            {
                shortComm = Comment;
            }
            else
            {
                string[] words = Comment.Trim().Split(" ");
                if (words.GetLength(0) > 0)
                {
                    for (Int32 i = 0; i <= words.GetLength(0); i++)
                    {
                        if ((shortComm + words[i]).Length <= howLong)
                        {
                            shortComm = shortComm + " " + words[i];
                        }
                        else
                        {
                            shortComm = shortComm + " ...";
                            break;
                        }
                    }
                }
            }

            return shortComm;
        }

        public static XmlDocument PackageComponentListData(Int32 packageId, string connString)
        {
            XmlDocument xmlDoc = new XmlDocument();
            List<PackageComponent> dv = new List<PackageComponent>();
            using (IDbConnection dbConn = new SqlConnection(connString))
            {
                dv = dbConn.QueryAsync<PackageComponent>(SqlCalls.SQL_PackageComponentList(packageId.ToString())).Result.ToList();
            }

            if (dv.Count == 0)
            {
                xmlDoc.Load("https://www.tripmasters.com/shareweb/XML-Products/pc" + packageId + "_0.xml");
                return xmlDoc;
            }

            try
            {
                StringBuilder xmlStr = new StringBuilder("<PackageComponentList>");
                xmlStr.Append("<ParentID>" + dv.First().ParentID.ToString() + "</ParentID>");
                xmlStr.Append("<ParentTitle>" + dv.First().ParentTitle.ToString() + "</ParentTitle>");
                xmlStr.Append("<City>" + dv.First().City.ToString() + "</City>");
                xmlStr.Append("<GateWay>" + dv.First().GateWay.ToString() + "</GateWay>");
                xmlStr.Append("<ReturnCity>" + dv.First().ReturnCity.ToString() + "</ReturnCity>");
                if (dv.First().Pkg_AirVendorAPI.Trim() != "")
                {
                    xmlStr.Append("<Pkg_AirVendorAPI>" + dv.First().Pkg_AirVendorAPI.Trim().Replace(" ", "_") + "</Pkg_AirVendorAPI>");
                }
                xmlStr.Append("<MarkUpByPkg>" + dv.First().MarkUpByPkg.ToString() + "</MarkUpByPkg>");
                xmlStr.Append(dv.First().category);
                xmlStr.Append("<Cnt>" + dv.Count.ToString() + "</Cnt>");
                foreach (var dr in dv)
                {
                    xmlStr.Append("<Component>");
                    xmlStr.Append("<cmpID>" + dr.cmpID.ToString() + "</cmpID>");
                    xmlStr.Append("<cmp_PDLComponentID>" + dr.cmp_PDLComponentID.ToString() + "</cmp_PDLComponentID>");
                    xmlStr.Append("<Title>" + dr.Title.ToString() + "</Title>");
                    xmlStr.Append("<ProdType>" + dr.ProdType.ToString() + "</ProdType>");
                    xmlStr.Append("<RelatedProductItems>" + dr.RelatedProductItems.ToString() + "</RelatedProductItems>");
                    if (dr.RelatedProductItems != 0)
                    {
                        xmlStr.Append(dr.RelatedIDs.ToString());
                    }
                    xmlStr.Append("<cmp_GroupingKey>" + dr.cmp_GroupingKey.ToString() + "</cmp_GroupingKey>");
                    xmlStr.Append("<cmp_DayOfComponent>" + dr.cmp_DayOfComponent.ToString() + "</cmp_DayOfComponent>");
                    xmlStr.Append("<cmp_DaysDuration>" + dr.cmp_DaysDuration.ToString() + "</cmp_DaysDuration>");
                    xmlStr.Append("<cmp_MarkupFlat>" + dr.cmp_MarkupFlat.ToString() + "</cmp_MarkupFlat>");
                    xmlStr.Append("<cmp_MarkupFraction>" + dr.cmp_MarkupFraction.ToString() + "</cmp_MarkupFraction>");
                    xmlStr.Append("<cmp_ChildMarkupFlat>" + dr.cmp_ChildMarkupFlat.ToString() + "</cmp_ChildMarkupFlat>");
                    xmlStr.Append("<cmp_ChildMarkupFraction>" + dr.cmp_ChildMarkupFraction.ToString() + "</cmp_ChildMarkupFraction>");
                    xmlStr.Append("<cmp_DayFlexible>" + dr.cmp_DayFlexible.ToString() + "</cmp_DayFlexible>");
                    xmlStr.Append("<cmp_DurationFlexible>" + dr.cmp_DurationFlexible.ToString() + "</cmp_DurationFlexible>");
                    xmlStr.Append("<cmp_PriceDeterminant>" + dr.cmp_PriceDeterminant.ToString() + "</cmp_PriceDeterminant>");
                    xmlStr.Append("<cmp_SeasonDeterminant>" + dr.cmp_SeasonDeterminant.ToString() + "</cmp_SeasonDeterminant>");
                    xmlStr.Append("<cmp_DisplayIt>" + dr.cmp_DisplayIt.ToString() + "</cmp_DisplayIt>");
                    xmlStr.Append("<cmp_Category>" + dr.cmp_Category.ToString() + "</cmp_Category>");
                    xmlStr.Append("<cmp_PriceIt>" + dr.cmp_PriceIt.ToString() + "</cmp_PriceIt>");
                    xmlStr.Append("<cmp_IsItChoice>" + dr.cmp_IsItChoice.ToString() + "</cmp_IsItChoice>");
                    xmlStr.Append("<cmp_Optional>" + dr.cmp_Optional.ToString() + "</cmp_Optional>");
                    xmlStr.Append("<cmp_AllotBlock>" + dr.cmp_AllotBlock.ToString() + "</cmp_AllotBlock>");
                    xmlStr.Append("<cmp_Notes>" + dr.cmp_Notes.ToString() + "</cmp_Notes>");
                    xmlStr.Append("<cmp_CheckDate>" + dr.cmp_CheckDate.ToString() + "</cmp_CheckDate>");
                    xmlStr.Append("<cmp_StartDate>" + dr.cmp_StartDate.ToString() + "</cmp_StartDate>");
                    xmlStr.Append("<cmp_EndDate>" + dr.cmp_EndDate.ToString() + "</cmp_EndDate>");
                    xmlStr.Append("<cmp_LineNo>" + dr.cmp_LineNo.ToString() + "</cmp_LineNo>");
                    xmlStr.Append("<cmp_Itin>" + dr.cmp_Itin.ToString() + "</cmp_Itin>");
                    xmlStr.Append("<cmp_SequenceTitleTemplateID>" + dr.cmp_SequenceTitleTemplateID.ToString() + "</cmp_SequenceTitleTemplateID>");
                    xmlStr.Append("<cmp_MultipleDurations>" + dr.cmp_MultipleDurations.ToString() + "</cmp_MultipleDurations>");
                    xmlStr.Append("<cmp_CitySeq>" + dr.cmp_CitySeq.ToString() + "</cmp_CitySeq>");
                    xmlStr.Append("<cmp_RelativeDay>" + dr.cmp_RelativeDay.ToString() + "</cmp_RelativeDay>");
                    xmlStr.Append("<cmp_ProductFF1>" + dr.cmp_ProductFF1.ToString() + "</cmp_ProductFF1>");
                    xmlStr.Append("<cmp_AllProducts>" + dr.cmp_AllProducts.ToString() + "</cmp_AllProducts>");
                    xmlStr.Append("<cmp_MajorComponent>" + dr.cmp_MajorComponent.ToString() + "</cmp_MajorComponent>");
                    xmlStr.Append("<cmp_MinStay>" + dr.cmp_MinStay.ToString() + "</cmp_MinStay>");
                    xmlStr.Append("<cmp_NoOfAvailNite>" + dr.cmp_NoOfAvailNite.ToString() + "</cmp_NoOfAvailNite>");
                    xmlStr.Append("<cmp_OverNite>" + dr.cmp_OverNite.ToString() + "</cmp_OverNite>");
                    xmlStr.Append("<ItinParagraph>" + dr.ItinParagraph.ToString() + "</ItinParagraph>");
                    xmlStr.Append("<CityTitle>" + dr.CityTitle.ToString() + "</CityTitle>");
                    xmlStr.Append("<CityID>" + dr.CityID.ToString() + "</CityID>");
                    xmlStr.Append("<CountryID>" + dr.CountryID.ToString() + "</CountryID>");
                    xmlStr.Append("<cmp_CategoryFlag>" + dr.cmp_CategoryFlag.ToString() + "</cmp_CategoryFlag>");
                    xmlStr.Append("<cmp_OptionalFlag>" + dr.cmp_OptionalFlag.ToString() + "</cmp_OptionalFlag>");
                    xmlStr.Append("</Component>");
                }
                xmlStr.Append("</PackageComponentList>");
                xmlDoc.LoadXml(xmlStr.ToString());

            }
            catch (System.IO.IOException e)
            {
                throw new Exception("PackageComponentListData: " + e.Message);
            }


            return xmlDoc;

        }

        public static string SiteAPI_SendAndReceive(string sXMLQuery, string sRegister, string sDomainName)
        {
            StringBuilder sBody = new StringBuilder();
            System.Uri oUriObj;
            System.Net.HttpWebRequest ohttpRequest;
            HttpWebResponse ohttpResponse;
            System.IO.StreamWriter oStreamw;
            System.IO.Stream oStream;
            XmlTextReader oReader;
            XmlDocument oDocument = new XmlDocument();
            try
            {
                sXMLQuery = sXMLQuery.Replace("<", "&lt;");
                sXMLQuery = sXMLQuery.Replace(">", "&gt;");
                string _str = @"<soap:Envelope" +
                @" xmlns:xsi=""http://www.w3.org/2001/XMLSchema-instance"" xmlns:xsd=""http://www.w3.org/2001/XMLSchema"" xmlns:soap=""http://schemas.xmlsoap.org/soap/envelope/"">" +
                @"<soap:Body>" +
                @"<SendAndReceive  xmlns=""http://tournet.com/iRESAPIv4_5/"">" +
                @"<sXMLQuery>" + sXMLQuery + "</sXMLQuery>" +
                @"<sRegister>" + sRegister + "</sRegister>" +
                @"</SendAndReceive>" +
                @"</soap:Body>" +
                @"</soap:Envelope>";
                sBody.Append(_str);

                oUriObj = new System.Uri("http://" + sDomainName + "/webservice/siteAPIv4_5/siteAPIv4_5.asmx");
                ohttpRequest = (HttpWebRequest)System.Net.HttpWebRequest.CreateDefault(oUriObj); ///WebRequest.CreateDefault(oUriObj);
                ohttpRequest.Method = "POST";
                ohttpRequest.ContentType = "text/xml";
                ohttpRequest.KeepAlive = false;
                ohttpRequest.ProtocolVersion = System.Net.HttpVersion.Version11;
                ohttpRequest.Credentials = new System.Net.NetworkCredential("", "");
                ohttpRequest.Accept = "*/*";
                ohttpRequest.Headers.Add("SOAPAction", "http://tournet.com/iRESAPIv4_5/SendAndReceive");
                ohttpRequest.ContentLength = sBody.ToString().Count();

                //encode the POST payload
                System.Text.ASCIIEncoding enc = new ASCIIEncoding();
                Byte[] buff;
                buff = enc.GetBytes(sBody.ToString());

                oStream = ohttpRequest.GetRequestStream();
                oStream.Write(buff, 0, buff.Length);
                oStream.Close();

                //get the associated stream with the response
                ohttpResponse = (HttpWebResponse)ohttpRequest.GetResponse();
                oStream = GzipServerHTTPResponseToIOStream(ohttpResponse);

                oReader = new XmlTextReader(oStream);
                oDocument.Load(oReader);
                oReader.Close();
                oStream.Close();

                return oDocument.GetElementsByTagName("SendAndReceiveResult").Item(0).InnerText;

            }
            catch (System.IO.IOException e)
            {
                throw new Exception("SiteAPI_SendAndReceive: " + e.Message);
            }
            finally
            {
                oUriObj = null;
                ohttpRequest = null;
                ohttpResponse = null;
                oStreamw = null;
                oStream = null;
                oReader = null;
                oDocument = null;
            }
        }

        public static System.IO.Stream GzipServerHTTPResponseToIOStream(System.Net.HttpWebResponse serverResponse)
        {
            System.IO.Stream compressedStream = null;
            if (serverResponse.ContentEncoding == "gzip")
            {
                compressedStream = new GZipStream(serverResponse.GetResponseStream(), CompressionMode.Compress);
            }
            else if (serverResponse.ContentEncoding == "deflate")
            {
                compressedStream = new DeflateStream(serverResponse.GetResponseStream(), CompressionMode.Compress);
            }
            if (compressedStream != null)
            {
                System.IO.MemoryStream decompressedStream = new System.IO.MemoryStream();
                Int32 size = 2048;
                byte[] writeData = new byte[2048];
                while (true)
                {
                    size = compressedStream.Read(writeData, 0, size);
                    if (size > 0)
                    {
                        decompressedStream.Write(writeData, 0, size);
                    }
                    else
                    {
                        break;
                    }
                }
                decompressedStream.Seek(0, System.IO.SeekOrigin.Begin);
                return decompressedStream;
            }
            else
            {
                return serverResponse.GetResponseStream();
            }
        }

        public static string StringToGzipString(string originalString)
        {
            string output = "";
            try
            {
                byte[] data = System.Text.Encoding.ASCII.GetBytes(originalString);
                System.IO.MemoryStream ms = new MemoryStream();
                GZipStream os = new GZipStream(ms, CompressionMode.Compress);
                os.Write(data, 0, data.Length);
                os.Close();
                ms.Close();
                output = Convert.ToBase64String(ms.ToArray());
                os = null;
                ms = null;
            }
            catch (Exception ex)
            {
                output = "ERROR";
            }
            return output;
        }

        public static string GZipStringToString(string sCompressed)
        {
            MemoryStream memC = null;
            GZipStream gz = null;
            StreamReader sr = null;
            StringBuilder sReturn = new StringBuilder();

            try
            {
                memC = new MemoryStream(Convert.FromBase64String(sCompressed));
                gz = new GZipStream(new MemoryStream(memC.ToArray()), CompressionMode.Decompress);
                sr = new StreamReader(gz, System.Text.Encoding.UTF8);
                int size = 1024;
                byte[] bytesUncompressed = new byte[size + 1];

                while ((true))
                {
                    size = gz.Read(bytesUncompressed, 0, size);
                    if (size > 0)
                    {
                        sReturn.Append(System.Text.Encoding.UTF8.GetString(bytesUncompressed, 0, size));
                    }
                    else
                    {
                        break;
                    }
                }
            }
            catch (Exception ex)
            {
                sReturn.Append("Error message=" + ex.Message + "; Source=" + ex.Source);
            }
            finally
            {
                if (memC != null) memC.Dispose();
                if (gz != null) gz.Dispose();
                if (sr != null) sr.Dispose();
            }

            return sReturn.ToString();
        }

        public static bool CheckMobileDevice()
        {
            try
            {
                //string u = HttpContext.Current.Request.ServerVariables["HTTP_USER_AGENT"];
                string u = _httpContextAccessor.HttpContext.Request.Headers["User-Agent"];
                Regex b = new Regex(@"(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino", RegexOptions.IgnoreCase | RegexOptions.Multiline);
                Regex v = new Regex(@"1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-", RegexOptions.IgnoreCase | RegexOptions.Multiline);
                if ((b.IsMatch(u) || v.IsMatch(u.Substring(0, 4))))
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
            catch
            {
                return false;
            }

        }
        public static async Task<string> GetWebAnnouncement()
        {
            string ann = "";
            List<WebAnnouncement> iannounc = new List<WebAnnouncement>();
            var result = await _dapperWrap.GetRecords<WebAnnouncement>(SqlCalls.SQL_WebAnnounce());
            iannounc = result.ToList();
            if (iannounc.Count > 0)
            {
                ann = iannounc[0].WEBA_Msg;
            }
            return ann;
        }
        public static async Task<object> HomeTownAirport()
        {
            string homeTown = "none";
            string ipAdr = _httpContextAccessor.HttpContext.Request.Headers["X-Forwarded-For"];
            if (ipAdr == null)
            {
                return homeTown;
            }

            Regex reg = new Regex(@"^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$");
            bool ipv4 = reg.IsMatch(ipAdr);
            if (ipv4 == false)
            {
                return homeTown;
            }

            var Result = await _dapperWrap.pgSQLGetRecordsAsync<MaxMind>(PostgresCalls.PG_Func_iMaxMind(), 4, new { ipAdr = ipAdr });
            List<MaxMind> dtTown = new List<MaxMind>();
            dtTown = Result.ToList();
            if (dtTown.Count > 0)
            {
                homeTown = dtTown[0].maxp_tournetplaceid + "|" + dtTown[0].plc_title + "|" + dtTown[0].citycode;
            }
            return homeTown;
        }

        public static string GetHomeTownIP()
        {
            string ipAdr = _httpContextAccessor.HttpContext.Connection.RemoteIpAddress.ToString();
            return ipAdr;
        }

        public static string GetHomeTownIPLong()
        {
            string ipAdr = _httpContextAccessor.HttpContext.Connection.RemoteIpAddress.ToString();
            if (ipAdr == "::1")
            {
                //This is the IP from Washington area
                ipAdr = "108.18.112.104";
            }

            string[] ipArray;
            double num = 0;
            //var ipHome;
            long ipLong = 0;
            ipArray = ipAdr.Split(".");
            for (var i = 0; i <= ipArray.Count() - 1; i++)
            {
                num += ((int.Parse(ipArray[i]) % 256) * Math.Pow(256, (3 - i)));
            }
            ipLong = (long)num;

            return ipLong.ToString();

            //string homeTown = "";
            //var ipHome = 0;
            //List<VisitorHome> dtTown = new List<VisitorHome>();
            //using (IDbConnection dbConn = new SqlConnection(_appSettings.ConnectionStrings.sqlConnStr))
            //{
            //    var dtHome = dbConn.Query("exec IMAXMIND_PlaceByIP " + ipLong.ToString()).ToList();
            //    if (dtHome.Count > 0)
            //    {
            //        ipHome = dtHome[0].MAXP_TournetPlaceId;
            //    }
            //    if (ipHome > -1)
            //    {
            //        dtTown = dbConn.Query<VisitorHome>(SqlCalls.SQL_Visitor_HomeTown(ipHome)).ToList();
            //        //homeTown = dtTown[0].PLCID + "|" + dtTown[0].PLC_Title;
            //        if (dtTown.Count > 0)
            //        {
            //            homeTown = dtTown[0].PLCID + "|" + dtTown[0].PLC_Title;
            //        }
            //        else
            //        {
            //            homeTown = "1|Unknown";
            //        }

            //    }
            //}

            //return homeTown;
        }

        public static string ConnectorSendAndReceive(string register, string xml_q, string domainName)
        {
            string result = "";
            string webServiceName = "";
            string webServiceFile = "";
            webServiceName = "iRESAPIv4_5";
            webServiceFile = "iRESAPIv4_5.asmx";

            StringBuilder body = new StringBuilder();
            body.Append("<?xml version=\"1.0\" encoding=\"utf-8\"?>");
            body.Append("<soap:Envelope xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\">");
            body.Append("<soap:Body>");
            body.Append("<SendAndReceive xmlns=\"http://tournet.com/" + webServiceName + "/\">");
            body.Append("<sXMLQuery>" + System.Web.HttpUtility.HtmlEncode(xml_q) + "</sXMLQuery>");
            body.Append("<sRegister>" + register + "</sRegister>");
            body.Append("</SendAndReceive>");
            body.Append("</soap:Body>");
            body.Append("</soap:Envelope>");

            System.Uri oUriObj;
            oUriObj = new System.Uri("http://" + domainName + "/webservice/" + webServiceName + "/" + webServiceFile);

            System.Net.HttpWebRequest request;
            HttpWebResponse ohttpResponse;
            try
            {
                request = (HttpWebRequest)System.Net.HttpWebRequest.CreateDefault(oUriObj); ///WebRequest.CreateDefault(oUriObj);
                request.Method = "POST";
                request.ContentType = "text/xml; charset=utf-8";
                request.Headers.Add("SOAPAction", "http://tournet.com/" + webServiceName + "/SendAndReceive");
                request.ContentLength = body.ToString().Count();

                StreamWriter streamw = new StreamWriter(request.GetRequestStream(), Encoding.Default);
                streamw.Write(body);
                streamw.Close();

                XmlDocument xml_r = new XmlDocument();

                System.Net.WebResponse response = request.GetResponse();
                Stream dataStream = response.GetResponseStream();
                xml_r.Load(dataStream);

                string tempXML = Utilities.StripNamespace(xml_r.InnerText);

                xml_r = new XmlDocument();
                xml_r.LoadXml(tempXML);
                result = xml_r.InnerXml;
            }
            //catch (WebException webex)
            //{
            //    string errTxt = "";
            //}
            catch (System.IO.IOException e)
            {
                throw new Exception("ConnectorSendAndReceive: " + e.Message);
            }

            return result;
        }

        public static string StripNamespace(string xml)
        {
            return Regex.Replace(xml, "xmlns[^']+'[^']+'", "");
        }

        public static string UppercaseFirstLetter(string s)
        {
            if (string.IsNullOrEmpty(s))
            {
                return string.Empty;
            }
            var words = s.Split(' ');

            var t = "";
            foreach (var word in words)
            {
                t += char.ToUpper(word[0]) + word.Substring(1) + ' ';
            }
            return t.Trim();
            //return char.ToUpper(s[0]) + s.Substring(1);
        }

        public static string TruncateHtml(string html, int maxLength, string ellipsis = "...")
        {
            List<int> textPositions = new List<int>();
            Stack<string> tagStack = new Stack<string>();
            bool inTag = false;
            int i = 0;

            // First pass: collect text positions and track tags
            while (i < html.Length)
            {
                if (html[i] == '<')
                {
                    // Process tag
                    int tagStart = i;
                    bool isClosing = false;
                    i++;
                    if (i < html.Length && html[i] == '/')
                    {
                        isClosing = true;
                        i++;
                    }
                    int tagEnd = html.IndexOf('>', i);
                    if (tagEnd == -1) break; // Invalid tag, ignore
                    string tagName = html.Substring(i, tagEnd - i).Split(' ')[0];
                    i = tagEnd + 1;

                    if (!isClosing)
                    {
                        tagStack.Push(tagName);
                    }
                    else
                    {
                        if (tagStack.Count > 0 && tagStack.Peek() == tagName)
                        {
                            tagStack.Pop();
                        }
                    }
                    inTag = false;
                }
                else
                {
                    // Process text
                    int start = i;
                    while (i < html.Length && html[i] != '<')
                    {
                        textPositions.Add(i); // Record HTML index for each text character
                        i++;
                    }
                }
            }

            // Get plain text and truncate
            string plainText = System.Text.RegularExpressions.Regex.Replace(html, "<.*?>", string.Empty);
            bool wasTruncated;
            int truncatePlainTextIndex = TruncatePlainText(plainText, maxLength, out wasTruncated);

            if (truncatePlainTextIndex == 0)
                return string.Empty;

            // Find corresponding HTML index
            int truncateHtmlIndex = (truncatePlainTextIndex <= textPositions.Count)
                ? textPositions[truncatePlainTextIndex - 1] + 1
                : html.Length;

            // Second pass: build truncated HTML and close tags
            StringBuilder result = new StringBuilder();
            tagStack.Clear();
            i = 0;

            while (i < truncateHtmlIndex && i < html.Length)
            {
                if (html[i] == '<')
                {
                    int tagStart = i;
                    bool isClosing = false;
                    i++;
                    if (i < html.Length && html[i] == '/')
                    {
                        isClosing = true;
                        i++;
                    }
                    int tagEnd = html.IndexOf('>', i);
                    if (tagEnd == -1)
                    {
                        // Invalid tag, append remaining and break
                        result.Append(html.Substring(tagStart));
                        break;
                    }
                    string tagName = html.Substring(i, tagEnd - i).Split(' ')[0];
                    i = tagEnd + 1;

                    if (!isClosing)
                    {
                        tagStack.Push(tagName);
                        result.Append(html.Substring(tagStart, i - tagStart));
                    }
                    else
                    {
                        if (tagStack.Count > 0 && tagStack.Peek() == tagName)
                        {
                            tagStack.Pop();
                        }
                        result.Append(html.Substring(tagStart, i - tagStart));
                    }
                }
                else
                {
                    int start = i;
                    int nextTag = html.IndexOf('<', i);
                    int end = (nextTag == -1 || nextTag > truncateHtmlIndex)
                        ? Math.Min(truncateHtmlIndex, html.Length)
                        : nextTag;
                    result.Append(html.Substring(start, end - start));
                    i = end;
                }
            }

            // Append ellipsis if truncated
            if (wasTruncated)
            {
                result.Append(ellipsis);
            }

            // Close remaining tags
            while (tagStack.Count > 0)
            {
                result.Append("</").Append(tagStack.Pop()).Append('>');
            }

            return result.ToString();
        }

        private static int TruncatePlainText(string plainText, int maxLength, out bool wasTruncated)
        {
            wasTruncated = false;
            if (plainText.Length <= maxLength)
            {
                return plainText.Length;
            }

            int lastSpace = plainText.LastIndexOf(' ', maxLength);
            if (lastSpace == -1)
            {
                wasTruncated = true;
                return maxLength;
            }
            else
            {
                wasTruncated = true;
                return lastSpace + 1; // Include the space
            }
        }

        public static string TruncateText(string text, int maxLength)
        {
            if (string.IsNullOrEmpty(text) || maxLength <= 0)
                return string.Empty;

            if (text.Length <= maxLength)
                return text;

            int lastSpaceIndex = text.LastIndexOf(' ', maxLength);
            if (lastSpaceIndex > 0)
            {
                return text.Substring(0, lastSpaceIndex) + " ...";
            }
            else
            {
                // If there's no space, truncate at maxLength and add [...]
                return text.Substring(0, maxLength) + " ...";
            }
        }

        public static string TruncateHtmlText(string text, int maxLength)
        {
            if (string.IsNullOrEmpty(text) || maxLength <= 0)
                return string.Empty;

            // Remove HTML tags using regex
            string cleanText = Regex.Replace(text, "<.*?>", string.Empty);

            if (cleanText.Length <= maxLength)
                return cleanText;

            int lastSpaceIndex = cleanText.LastIndexOf(' ', maxLength);
            if (lastSpaceIndex > 0)
            {
                return cleanText.Substring(0, lastSpaceIndex) + " ...";
            }
            else
            {
                return cleanText.Substring(0, maxLength) + " ...";
            }
        }

        public static class RegexHelper
        {
            public static readonly Regex MyRegex = new Regex(
                @"^(?:from )?(?:website hierarchy|website|hierarchy|web hierarchy)?$",
                RegexOptions.Compiled | RegexOptions.IgnoreCase
            );
        }
    }
}
