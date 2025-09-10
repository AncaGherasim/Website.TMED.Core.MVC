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

        public static string SQL_PlaceHierarchyByPlaceName(string placeName)
        {
            return @"SELECT STR_UserID, STRID, STR_PlaceID, STR_PlaceTitle, STR_PlaceTypeID, STR_PageTemplate, STR_PlacePriority, STR_PlaceExtra, STR_PlaceMap, STR_PlaceShortInfo, STR_PlacePractical
                FROM STR_Places_Hierarchy
                WHERE STR_PlaceActive = 1
                AND STR_PlacePriority = 1
                AND STR_UserID in (243,182,595)
                AND STR_NoWeb = 0
                AND STR_ProdKindID = 0               
                AND STR_PlaceTitle = ' " + placeName + @"'";
        }

        public static string SQL_PlacePageSEO(int placeID)
        {
            return @"SELECT SEO_PageTitle, SEO_MetaDescription, SEO_MetaKeyword, SEO_HeaderText
                         FROM STR_Places_Hierarchy 
                         LEFT JOIN  MKT_WebSEO ON SEO_STRID = STRID
                         AND SEO_Active = 1
                         WHERE STR_UserID = 243
                         AND STR_PlaceActive = 1 
                         AND STR_NoWeb = 0 
                         AND STR_PlaceID = " + placeID + @"";
        }

        public static string SQL_PlaceHierarchyPacksPriorityList(int plcSTRID)
        {
            return @"SELECT PXW.SPPW_Weight
                 , PRI.PDLID
                 , PRI.PDL_Title
                 , PRI.PDL_Duration
                 , PRI.PDL_SequenceNo
                 , PRI.PDL_Content
                 , PRI.PDL_Description
                 , isnull(STPR.STP_Save, 9999) STP_Save
                 , PRO.SPD_Description
                 , IMG.IMG_500Path_URL
				 , Feeds.NoOfFeed, overallscore.OverAllScore, comment.Comment, comment.TvlDate           
                 , isnull((select top 1 [STR_PlaceTitle] from [dbo].[STR_Places_Hierarchy] ph where ph.[STR_PlaceID] = pro.[SPD_CountryPlaceID] and ph.[STR_NoWeb]=0 and ph.[STR_PlaceActive]=1 and ph.STR_UserID in (243, 595, 182)),'none') as CountryName
				 , isnull((select top 1 [STR_userID] From STR_Places_Hierarchy pp where pp.STR_PlaceID = pro.SPD_CountryPlaceID and pp.STR_NoWeb = 0 and pp.STR_placeActive = 1 and pp.STR_UserID in (243, 595, 182)),000) as deptID                 
                 FROM STR_PlacesXPackageWeight PXW
                  INNER JOIN PRD_ProductItem PRI ON PRI.PDLID = PXW.SPPW_PackageID 
                  AND PRI.PDL_Active = 1 and pri.PDL_NoWeb = 0 
                  INNER JOIN PRD_Product PRO ON PRO.SPDID = PRI.PDL_ProductID
                  AND PRO.SPD_Active = 1
                  LEFT JOIN STR_SitePromotion STPR ON STPR.STP_ProdItemID = PXW.SPPW_PackageID
                  AND STPR.STP_Active = 1 
                  AND STPR.STP_StartDate <= Convert(VARCHAR(10), GETDATE(), 101) 
                  AND STPR.STP_EndDate >= CONVERT(VARCHAR(10), GETDATE(), 101)
                  Left JOIN PRD_ProductXImages Pic ON Pic.PXI_ProductID = PRI.PDL_ProductID and Pic.PXI_Active = 1 AND Pic.PXI_Sequence = 0
                  Left JOIN APP_Images IMG ON IMG.IMGID = Pic.PXI_ImageID
				   outer apply (SELECT COUNT (CF.PCCID) as NoOfFeed FROM PRD_CustomerComment CF WHERE CF.PCC_PDLID = PRI.PDLID  AND CF.PCC_Comment is not null AND LEN(cast(CF.PCC_Comment as varchar(8000))) > 15 AND CF.PCC_Active = 1 AND CF.PCC_Block = 0) as Feeds
            outer apply (SELECT avg(pc.pcc_overallscore) AS OverAllScore FROM prd_customercomment pc WHERE pc.pcc_pdlid = pri.pdlid AND pc.pcc_overallscore > 0 AND pc.pcc_detailid = 0 AND pc.pcc_active = 1 AND pc.pcc_block = 0) as overallscore
            outer apply (SELECT top 1 pc.pcc_comment AS Comment, rh.dep_date as TvlDate FROM dbo.prd_customercomment pc
            JOIN dbo.rsv_heading rh ON pc.pcc_bookingid = rh.id
            WHERE pc.pcc_pdlid = pri.pdlid AND pc.pcc_comment IS NOT NULL AND LEN(cast(pc.PCC_Comment as varchar(8000))) > 15 AND pc.pcc_active = 1 AND pc.pcc_block = 0 AND pc.pcc_comment not like '-----%'  AND rh.dep_date > convert(Varchar(10),Getdate()-360,101)
            ORDER BY pc.pcc_ranking, rh.dep_date DESC) as comment
                  WHERE PXW.SPPW_Active = 1 AND IMG.IMG_Active = 1 
                  AND PXW.SPPW_ParentPlace = " + plcSTRID + @"
                  AND PXW.SPPW_MasterContentID = 0
				  ORDER BY PXW.SPPW_Weight";
        }
        public static string SQL_PlaceHierarchyDisplayPosition(int placeID)
        {
            return @"Select SDP_DisplayTitle
                  , isnull(SDP_GroupTitleURL, 'none') as SDP_GroupTitleURL
                  , isnull(SDP_Description, 'none') as SDP_Description
                  , isnull(SDP_Order, 0) as SDP_Order
                  , isnull(SDP_PlaceHierarchyID, 0) as SDP_PlaceHierarchyID
                  , isnull(SDP_GroupProdKindID, 0) as SDP_GroupProdKindID
                  , isnull(SDP_DisplayProdKindID, 0) as SDP_DisplayProdKindID
                  , isnull(SDP_TitleBGColor, 'none') as SDP_TitleBGColor
                  From STR_Places_Hierarchy h
                  inner join STR_DisplayPosition d on SDP_PlaceHierarchyID = STRID
                  and d.SDP_PlaceID = h.STR_PlaceID
                  Where STR_PlaceID = " + placeID + @"
                  and STR_PlaceActive = 1
                  and SDP_MasterContentID = 0
                  and SDP_Active = 1
                  and STR_PlacePriority = 1
                  and STR_UserID = 243
                  order by  SDP_DisplayProdKindID, SDP_Order ASC";
        }
        public static string SQL_PlaceHierarchyPlaceDescription(int plcSTRID)
        {
            return @"Select PLD.STX_Title
                  , isnull(PLD.STX_URL,'none') as STX_URL
                  , isnull(STX_Description,'none') as STX_Description
                  , isnull(PLD.STX_PictureURL,'none') as STX_PictureURL
                  , PLD.STX_ProdKindID
                  , PLD.STX_Priority
                  , isnull(PLD.STX_PictureHeightpx,0) as STX_PictureHeightpx
                  , isnull(PLD.STX_PictureWidthpx,0) as STX_PictureWidthpx
                  , isnull(PLD.STX_CMSID,0) as STX_CMSID
                  , isnull(CWS.CMS_Title,'none') as CMS_Title
                  , isnull(CWS.CMS_Description, 'none') as CMS_Description
                  , isnull(CWS.CMS_Content,'none') as CMS_Content
                  From STR_PlaceDescription PLD
                  LEFT JOIN CMS_WebsiteContent CWS ON CWS.CMSID = PLD.STX_CMSID
                  AND CWS.CMS_Active = 1
                  Where(STX_UserID =  243 )
                  AND PLD.STX_Active = 1 AND PLD.STX_MasterContentID = 0 AND PLD.STX_StrId = " + plcSTRID + @"
                  ORDER BY PLD.STX_ProdKindID, PLD.STX_Priority";
        }

        public static string SQL_GP4_MultiCouFeedback(string CoutryIDs)
        {
            return @"SELECT 
                CF.PCC_PDLID,
                CF.PCC_Comment,
                CF.PCC_CustomerName,
                CF.PCC_Itinerary,
                CF.PCCID,
	            CF.PCC_OverallScore,
                CFH.dep_date,
                CFP.PDL_Title,
                PLCO.STR_PlaceTitle AS CountryName,
                PLCO.STR_PlaceID AS CountryID
                FROM PRD_CustomerComment CF
                INNER JOIN RSV_Heading CFH WITH (NOLOCK) 
                    ON CF.PCC_BookingID = CFH.ID
                INNER JOIN PRD_ProductItem CFP 
                    ON CFP.PDLID = CF.PCC_PDLID
                INNER JOIN PRD_Product PRO 
                    ON PRO.SPDID = CFP.PDL_ProductID
                INNER JOIN STR_Places_Hierarchy PLCO 
                    ON PLCO.STR_PlaceID = PRO.SPD_CountryPlaceID
                WHERE  
                CF.PCC_PDLID <> 0
                AND CFH.dept IN (868,1615)
                AND CF.PCC_Active = 1
                AND CF.PCC_Block = 0
                AND CFH.dep_date > DATEADD(DAY, -720, GETDATE())
                AND CF.PCC_Comment IS NOT NULL
                AND LEN(CAST(CF.PCC_Comment AS VARCHAR(MAX))) > 15
                AND CAST(CF.PCC_Comment AS VARCHAR(MAX)) <> '----- No customer comment -----'
	            AND CF.PCC_OverallScore >= 4
                AND PLCO.STR_PlaceID IN (" + CoutryIDs + @")
                AND PLCO.STR_PlaceActive = 1
                AND PLCO.STR_NoWeb = 0
                AND PLCO.STR_PlaceTypeID = 5
                AND PLCO.STR_UserID = 243
            ORDER BY 
                CF.PCC_Ranking ASC, 
                CFH.dep_date DESC";
        }

        public static string SQL_PlaceHierarchyWeightPlaces(Int32 plcSTRID)
        {
            return @"Select plh.STR_PlaceTitle, plh.STR_PlaceID, plh.STR_PlaceShortInfo, plh.STR_PlaceTypeID, SPW_Weight, plh.STR_PlaceAIID
                    ,isnull(plh1.STR_PlaceTitle,'') as Country, isnull(plh1.STR_PlaceID,-1) as CountryId
                    From STR_PlacesWeight
                        Inner Join STR_Places_Hierarchy PLH on PLH.STRID = SPW_ChildPlace
                            AND PLH.STR_PlaceActive = 1
                        left Join STR_Places_Hierarchy PLH1 on (plh1.STR_PlaceID = PLH.Str_Place1ParentId or PLH1.STR_PlaceID = PLH.Str_Place2ParentId)
                            AND PLH1.STR_UserID = 243 AND PLH1.Str_PlaceTypeId=5 AND PLH1.STR_PlaceActive = 1 and PLH1.Str_Noweb = 0 and PLH1.Str_ProdKindID=0
                            AND PLH.STR_UserID = 243
					    cross apply 
							    (
								SELECT TOP 1 PHI.STR_PlaceID
								FROM PRD_PlaceXProductItem PXP 
									LEFT Join STR_Places_Hierarchy PHI ON PHI.STR_PlaceID = PXP.CXZ_ChildPlaceID 
									INNER JOIN PRD_ProductItem PRI ON PRI.PDLID = PXP.CXZ_ProductItem 
									INNER Join PRD_Product PRO ON PRO.SPDID = PRI.PDL_ProductID 
								WHERE PXP.CXZ_Active = 1 And PRI.PDL_Active = 1 And PRO.SPD_Active = 1 AND PRI.PDL_NoWeb = 0  AND PRO.SPD_ProductTypeSysCode = 34
								    AND PRO.SPD_InternalComments LIKE '%" + InternalComments + @"%'  And PRO.SPD_StarratingSysCode <> 541 AND PHI.STR_PlaceActive = 1 
									AND PHI.STR_UserID = 243 AND PHI.STR_ProdKindID = 0 and PDL_Title NOT LIKE 'Zpend%' AND PHI.STR_NoWeb = 0
									AND PLH.STR_PlaceID = PHI.STR_PlaceID
							    ) t0
                     WHERE SPW_masterContentID = 0
                        AND SPW_Active = 1 
                        AND SPW_ParentPlace = " + plcSTRID + @"
                    ORDER BY SPW_Weight ASC";
        }

        public static string SQL_Get_NumberofCustomerFeedbacks_OverAllScore()
        {
            return @"SELECT count(*) as NumComments,avg(cast(PCC_OverallScore as decimal)) as Score from PRD_CustomerComment 
                WHERE PCC_OverallScore > 0 AND PCC_DetailID = 0 AND PCC_Active = 1 AND PCC_Block = 0";
        }
    }
}
