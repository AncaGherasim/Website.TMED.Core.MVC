using MVC_TMED.Models;
using System;

namespace MVC_TMED.Infrastructure
{
    public class SqlClass1
    {
        private static string SiteUserId = Startup.StaticConfig.GetSection("ApplicationSettings:userID").Value;
        private static string InternalComments = Startup.StaticConfig.GetSection("ApplicationSettings:intCom").Value;
        private static string defaultMostPop = Startup.StaticConfig.GetSection("ApplicationSettings:defaultMostPop").Value;

        public static string SQL_PromotionDiscount(string code)
        {
            return @"declare @DiscountCode varchar(50) = '" + code + @"'
            select c.MKTD_DiscountCode, c.MKTD_CampaignCode, c.MKTD_DiscountValue, c.MKTD_BookingStartDate, c.MKTD_BookingEndDate, c.MKTD_Dept, c.MKRD_IsPerPerson, c.MKTD_BlockingReason, c.MKTD_PackageID,
DA.DepartureAirportsIDs,
STUFF(
(
SELECT ' | ' + P.PLC_Title
FROM PRD_Place P
INNER JOIN 
(
SELECT SplitNodes.n.value('.', 'INT') AS Value
FROM (SELECT CAST('<M>' + REPLACE(DA.DepartureAirportsIDs, ',', '</M><M>') + '</M>' AS XML) AS xmlData) AS A
CROSS APPLY xmlData.nodes('/M') AS SplitNodes(n)
) AS s 
ON P.PLCID = s.Value
FOR XML PATH('')
), 1, 1, ''
) AS ArrivalAirportsNames
, a.ArrivalDates as ArrivalDates
from [dbo].[MKT_DiscountCodes] c
CROSS APPLY 
(
SELECT STUFF(LEFT(C.MKTD_DepartureAirports, LEN(C.MKTD_DepartureAirports) - 1), 1, 1, '') AS DepartureAirportsIDs
) AS DA
outer apply (select substring(
(select ',' + convert(varchar(20), MKTDA_StartDate, 101)  + 
(select case when MKTDA_EndDate is not null then '-' + convert(varchar(20), MKTDA_EndDate, 101) 
else '' 
end)
as 'data()'
from MKT_DiscountCodesArrivalDates
where MKTDA_MKTDID = c.MKTDID and MKTDA_Active = 1
for xml path('')
), 2, 9999) as ArrivalDates) a
where c.[MKRD_Active]=1 and c.MKTD_DiscountCode = ltrim(rtrim(@DiscountCode))
order by c.[MKTD_DiscountValue] DESC";

        }
    }
}
