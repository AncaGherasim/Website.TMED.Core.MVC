using System;

namespace MVC_TMED.Infrastructure
{
    public class AppSettings
    {
        public appstgs ApplicationSettings { get; set; }
        public class appstgs
        {
            public Int64 highTPL { get; set; }
            public string userID { get; set; }
            public string intCom { get; set; }
            public string SystemID { get; set; }
            public string GeneralLoc { get; set; }
            public string iOutTime { get; set; }
            public string iInTime { get; set; }
            public string AirP2PVendorAPI { get; set; }
            public string bFirst { get; set; }
            public string GetNextDay { get; set; }
            public string AirVendorAPI { get; set; }
            public string CarVendorAPI { get; set; }
            public string SSVendorAPI { get; set; }
            public string ByStayNite { get; set; }
            public string nStartDayAllow { get; set; }
            public string TransferVendorAPI { get; set; }
            public string TICVendorAPI { get; set; }
            public string SiteName { get; set; }
            public string defaultMostPop { get; set; }
            public string spotLight { get; set; }
            public string GIVendorAPI { get; set; }
            public string TMLD_HotelsAPI { get; set; }
            public string TMED_HotelsAPI { get; set; }
            public string TMAS_HotelsAPI { get; set; }
            public string CityHotelVendorAPI { get; set; }
            public string TMLD_SystemID { get; set; }
            public string TMLD_ByStayNite { get; set; }
            public string TMLD_GetNextDay { get; set; }
            public string TMLD_AirVendorAPI { get; set; }
            public string TMLD_AirP2PVendorAPI { get; set; }
            public string TMLD_CarVendorAPI { get; set; }
            public string TMLD_SSVendorAPI { get; set; }
            public string TMLD_TransferVendorAPI { get; set; }
            public string TMLD_TICVendorAPI { get; set; }
            public string TMLD_BookURL { get; set; }
            public string TMLD_GIVendorAPI { get; set; }
            public string _ut2Server { get; set; }
            public string _utSiteName { get; set; }
            public string deptID { get; set; }
            public string _bpURL { get; set; }
            public string mailSERVER { get; set; }
            public string mailPORT { get; set; }
            public string mailSSL { get; set; }
            public string mailUSER { get; set; }
            public string mailPASS { get; set; }
            public string domainName { get; set; }
            public string register { get; set; }
            //TMED
            public string TMED_SystemID { get; set; }
            public string TMED_ByStayNite { get; set; }
            public string TMED_GetNextDay { get; set; }
            public string TMED_AirVendorAPI { get; set; }
            public string TMED_AirP2PVendorAPI { get; set; }
            public string TMED_CarVendorAPI { get; set; }
            public string TMED_SSVendorAPI { get; set; }
            public string TMED_TransferVendorAPI { get; set; }
            public string TMED_TICVendorAPI { get; set; }
            public string TMED_BookURL { get; set; }
            public string TMED_GIVendorAPI { get; set; }
            //TMAS
            public string TMAS_SystemID { get; set; }
            public string TMAS_ByStayNite { get; set; }
            public string TMAS_GetNextDay { get; set; }
            public string TMAS_AirVendorAPI { get; set; }
            public string TMAS_AirP2PVendorAPI { get; set; }
            public string TMAS_CarVendorAPI { get; set; }
            public string TMAS_SSVendorAPI { get; set; }
            public string TMAS_TransferVendorAPI { get; set; }
            public string TMAS_TICVendorAPI { get; set; }
            public string TMAS_BookURL { get; set; }
            public string TMAS_GIVendorAPI { get; set; }

            public string[] Top_countries { get; set; }
            public string[] Top_cities { get; set; }
        }

        public awscon AWSConnection { get; set; }
        public class awscon
        {
            public string AwsCredentialsQuery { get; set; }
            public string AwsRegionId { get; set; }
        }
        public specvar SpecialVariables { get; set; }
        public class specvar
        {
            public string YouTubeVideoURL { get; set; }
            public string YouTubeVideoName { get; set; }
        }
    }

    public static class AppSettingsProvider //just for SqlCalls static methods
    {
        public static string userID { get; set; }
        public static string intCom { get; set; }

        public static string SiteName { get; set; }

    }
    public class AWSParameterStoreService
    {
        public string? SqlConnectionString { get; set; }
        public string? MySqlConnectionString { get; set; }
        public string? PostgresConnectionString {  get; set; }
    }
}
