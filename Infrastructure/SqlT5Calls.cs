using MVC_TMED.Models;
using Mysqlx.Crud;
using Org.BouncyCastle.Asn1.Ocsp;
using Org.BouncyCastle.Asn1.X509;
using System;
namespace MVC_TMED.Infrastructure
{
    public class SqlT5Calls
    {
        
        public static string SQL_T5_PlaceSEOandFirstSec(int placeID)
        {
            return @"SELECT SEO_PageTitle, SEO_MetaDescription, SEO_MetaKeyword, SEO_HeaderText, STR_PlaceAI, STR_PlaceTitleDesc
                         FROM STR_Places_Hierarchy 
                         LEFT JOIN  MKT_WebSEO ON SEO_STRID = STRID
                         AND SEO_Active = 1
                         WHERE STR_UserID = 243
                         AND STR_PlaceActive = 1 
                         AND STR_NoWeb = 0 
                         AND STR_PlaceID IN ("+ placeID +")";
        }
        public static string SQL_T5_SEO_Package(string packageID)
        {
            return @"Select PRI.PDL_Title, PRI.PDL_Content, PRI.PDL_Description, isNull(PRI.PDL_Notes, 'none') as PDL_Notes,PRI.PDL_SpecialCode,PRI.PDL_ProductID,PRI.PDL_Duration,
                PRO.SPD_InternalComments, PRO.SPD_Description, PRO.SPD_StarRatingSysCode,PRO.SPD_ProductKindSysCode,PRO.SPD_Features,PRO.SPD_CountryPlaceID,
                SPR.STP_Price, SPR.STP_Save, SPR.STP_Content, SPR.STP_FromPlaceID,SPR.STP_NumOfNights,SPR.STP_MiniTitle,isNull(SPR.STP_StartTravelDate, Cast('1900-01-01' As Date)) As STP_StartTravelDate,
                PLC.PLC_Title,
                PLH.STR_PlaceTitle,PLH.STR_PlaceID,PLCH.STR_PlaceTitle as CityNA,PLCH.STR_PlaceID as CityID,PLC.PLCID, PLC.PLC_Code, 
                PRI.PDL_Gateway as CityEID, PLCH1.STR_PlaceTitle as CityENA, pro.SPD_CategoryTemplate, Images.IMG_Path_URL, PRI.PDLID as PackageId
                From PRD_ProductItem PRI
                INNER JOIN PRD_Product PRO ON PRO.SPDID = PRI.PDL_ProductID
                LEFT JOIN STR_SitePromotion SPR ON SPR.STP_ProdItemID = PRI.PDLID
                AND(SPR.STP_UserID = 243)
                AND(SPR.STP_StartDate <= CONVERT(VARCHAR(10), GETDATE(), 101)) AND(SPR.STP_EndDate >= CONVERT(VARCHAR(10), GETDATE(), 101))
                AND(SPR.STP_Active = 1)
                LEFT JOIN PRD_Place PLC ON PLC.PLCID = SPR.STP_FromPlaceID
                AND(PLC.PLC_PlaceTypeID = 1) AND(PLC.PLC_Active = 1)
                LEFT JOIN STR_Places_Hierarchy PLH ON PLH.STR_PlaceID = PRO.SPD_CountryPlaceID
                AND PLH.STR_PlaceActive = 1
                AND PLH.STR_UserID = 243 AND PLH.STR_PlaceTypeID = 5 AND plh.STR_ProdKindId = 0
                LEFT JOIN STR_Places_Hierarchy PLCH ON PLCH.STR_PlaceID = PRO.SPD_StatePlaceID
                AND PLCH.STR_PlaceActive = 1
                AND PLCH.STR_UserID = 243 AND(PLCH.STR_PlaceTypeID = 1 OR PLCH.STR_PlaceTypeID = 25)
                LEFT JOIN STR_Places_Hierarchy PLCH1 ON PLCH1.STR_PlaceID = PRI.PDL_Gateway
                AND PLCH1.STR_PlaceActive = 1
                AND PLCH1.STR_UserID = 243 AND(PLCH1.STR_PlaceTypeID = 1 OR PLCH1.STR_PlaceTypeID = 25)
                outer apply(select top 1 Pic3.IMG_Path_URL from PRD_ProductXImages Pic2
                   LEFT JOIN APP_Images Pic3 ON Pic3.IMGID = Pic2.PXI_ImageID
                   where Pic2.PXI_ProductID = PRI.PDL_ProductID AND Pic2.PXI_Sequence = 0 AND Pic2.PXI_Active = 1 and Pic3.IMG_Active = 1) Images
                WHERE PRI.PDLID = " + packageID + @" AND (PRI.PDL_Active = 1) AND pri.PDL_NoWeb = 0";
        }

        public static string SQL_T5_PriorityPacks(string placeID)
        {
            return @"Select PPW.SPPW_Weight, PRI.PDLID, PRI.PDL_Title
            ,PRI.PDL_Content, PRI.PDL_Duration, PRI.PDL_Description, PRO.SPD_Description, pro.SPD_InternalComments
            ,cast(isnull(SPR.STP_Save,9999) as money) STP_save, isnull(Pic3.IMG_500Path_URL, 'none') as IMG_500Path_URL, Feeds.NoOfFeed, overallscore.OverAllScore, comment.Comment, comment.TvlDate
            ,LEFT(PRI.PDL_Places, LEN(PRI.PDL_Places)-1) as PDL_Places
            ,(SELECT STUFF((
                    SELECT DISTINCT ' - ' + ph2.STR_PlaceTitle
                    FROM STR_Places_Hierarchy ph2  
                    WHERE CHARINDEX(',' + CONVERT(VARCHAR(8), ph2.STR_PlaceID) + ',', ',' + REPLACE(PDL_Places, ' ', '')) > 0  
                    AND ph2.STR_PlaceActive = 1  
                    AND ph2.STR_PlaceTypeID IN (1, 25)  
                    AND ph2.STR_UserID IN (243, 182, 595)  
                    AND ph2.STR_NoWeb = 0  
                    FOR XML PATH(''), TYPE).value('.', 'NVARCHAR(MAX)'),  
                1, 3, '')  
            ) as PlacesOnPackages  
            FROM PRD_PlaceXProductItem PXP
            INNER JOIN PRD_ProductItem PRI ON PRI.PDLID = PXP.CXZ_ProductItem AND PRI.PDL_Active = 1 AND PRI.PDL_NoWeb = 0 and PDL_Title NOT LIKE 'Zpend%'
            INNER Join PRD_Product PRO ON PRO.SPDID = PRI.PDL_ProductID AND PRO.SPD_Active = 1 AND PRO.SPD_ProductTypeSysCode = 34 AND PRO.SPD_InternalComments LIKE '%:.ED%' AND PRO.SPD_StarratingSysCode <> 541
            left Join STR_SitePromotion SPR ON SPR.STP_ProdItemID=PRI.PDLID AND SPR.STP_Active = 1 AND SPR.STP_StartDate <= CONVERT(VARCHAR(10), GETDATE(), 101) AND SPR.STP_EndDate >= CONVERT(VARCHAR(10), GETDATE(), 101) AND SPR.STP_UserID = 243
            Left Join STR_Places_Hierarchy PHI On PHI.STR_PlaceID = pxp.CXZ_ChildPlaceId And PHI.STR_PlaceActive = 1 And PHI.STR_UserID = 243 And PHI.STR_NoWeb = 0 And PHI.Str_ProdkindId=0
            left join STR_PlacesXPackageWeight PPW ON PPW.SPPW_parentPlace = PHI.STRID AND PPW.SPPW_PackageID = PRI.PDLID AND PPW.SPPW_Active = 1 AND PPW.SPPW_MasterContentID = 0
            left join PRD_ProductXImages Pic2 ON Pic2.PXI_ProductID = PRI.PDL_ProductID AND Pic2.PXI_Sequence = 0 AND Pic2.PXI_Active = 1
            left join APP_Images Pic3 ON Pic3.IMGID = Pic2.PXI_ImageID AND Pic3.IMG_Active = 1
            outer apply (SELECT COUNT (CF.PCCID) as NoOfFeed FROM PRD_CustomerComment CF WHERE CF.PCC_PDLID = PRI.PDLID  AND CF.PCC_Comment is not null AND LEN(cast(CF.PCC_Comment as varchar(8000))) > 15 AND CF.PCC_Active = 1 AND CF.PCC_Block = 0) as Feeds
            outer apply (SELECT avg(pc.pcc_overallscore) AS OverAllScore FROM prd_customercomment pc WHERE pc.pcc_pdlid = pri.pdlid AND pc.pcc_overallscore > 0 AND pc.pcc_detailid = 0 AND pc.pcc_active = 1 AND pc.pcc_block = 0) as overallscore
            outer apply (SELECT top 1 pc.pcc_comment AS Comment, rh.dep_date as TvlDate FROM dbo.prd_customercomment pc
            JOIN dbo.rsv_heading rh ON pc.pcc_bookingid = rh.id
            WHERE pc.pcc_pdlid = pri.pdlid AND pc.pcc_comment IS NOT NULL AND LEN(cast(pc.PCC_Comment as varchar(8000))) > 15 AND pc.pcc_active = 1 AND pc.pcc_block = 0 AND pc.pcc_comment not like '-----%'  AND rh.dep_date > convert(Varchar(10),Getdate()-360,101)
            ORDER BY pc.pcc_ranking, rh.dep_date DESC) as comment
            WHERE
            PXP.CXZ_Active = 1
            and pxp.CXZ_ChildPlaceId = " + placeID + @"
            and PPW.SPPW_Weight<30
            ORDER BY ppw.SPPW_Weight ASC";
        }

        public static string SQL_T5_CitiesOnCountry(string placeID)
        {
            return @"SELECT STR_PlaceID
                , STR_PlaceTitle
                , STR_PlaceTypeID
                , isnull(STR_PlaceAIID, '2000') as STR_PlaceAIID
                , STR_Place1ParentID
                , isnull(STR_PlaceShortInfo, 'No Info') as STR_PlaceShortInfo
                ,(isnull((
				Select top 1 IMG.IMG_500Path_URL 
				From STR_PlacesXPackageWeight PXW
				INNER JOIN PRD_ProductItem PRI ON PRI.PDLID = PXW.SPPW_PackageID AND PRI.PDL_Active = 1 and pri.PDL_NoWeb = 0 
				Left JOIN PRD_ProductXImages Pic ON Pic.PXI_ProductID = PRI.PDL_ProductID and Pic.PXI_Active = 1 AND Pic.PXI_Sequence = 0
                Left JOIN APP_Images IMG ON IMG.IMGID = Pic.PXI_ImageID 
				Where PXW.SPPW_Active = 1 
				AND IMG.IMG_Active = 1 
                  AND PXW.SPPW_ParentPlace = STRID
                  AND PXW.SPPW_MasterContentID = 0
				  AND PXW.SPPW_PackageName like '%Getaway'		  				  
				  ),
				  (
				Select top 1 IMG.IMG_500Path_URL 
				From STR_PlacesXPackageWeight PXW
				INNER JOIN PRD_ProductItem PRI ON PRI.PDLID = PXW.SPPW_PackageID AND PRI.PDL_Active = 1 and pri.PDL_NoWeb = 0 
				Left JOIN PRD_ProductXImages Pic ON Pic.PXI_ProductID = PRI.PDL_ProductID and Pic.PXI_Active = 1 AND Pic.PXI_Sequence = 0
                Left JOIN APP_Images IMG ON IMG.IMGID = Pic.PXI_ImageID 
				Where PXW.SPPW_Active = 1 
				AND IMG.IMG_Active = 1 
                  AND PXW.SPPW_ParentPlace = STRID
                  AND PXW.SPPW_MasterContentID = 0				 	  				  
				  ))) as IMG_500Path_URL
                FROM STR_Places_Hierarchy
                WHERE(STR_Place2ParentID = " + placeID + @"  Or STR_Place1ParentID = " + placeID + @")
                AND(STR_PlaceActive = 1)
                AND(STR_UserID = 243)
                AND(STR_PlaceTypeID = 25 OR STR_PlaceTypeID = 1 OR STR_PlaceTypeID = 6 OR STR_PlaceTypeID = 2)
                AND(STR_NoWeb = 0)
                AND(STR_PlaceTitle not like 'zz%') AND(STR_PlaceTitle not like 'zPend%')
                AND(STR_PlaceAIID < 1000)
                ORDER BY STR_PlaceAIID ASC";
        }

        public static string SQL_T5_Highlights(string placeID)
        {
            return @"SELECT*
                  FROM STR_PlaceDescription
                  WHERE STX_UserID = 243
                  AND(STX_Active = 1)
                  AND(STX_PlaceID = " + placeID + @")
                    AND STX_MasterContentID = 0
                    AND STX_Title is not null
                    AND STX_URL is not null";
        }

        public static string SQL_T5_AboutCMS(string placeID)
        {
            return @"SELECT Xcms.CMSW_Title, Xcms.CMSW_Order, Xcms.CMSW_RelatedCmsID, isnull(CSM.CMS_Description, 'none') as CMS_Description
                 FROM STR_WebHierarchyXCMS Xcms
                 INNER JOIN STR_Places_Hierarchy plcH ON plcH.STR_PlaceID = " + placeID + @" AND STR_PlaceActive = 1 AND STR_UserID = 243
                 INNER JOIN CMS_WebsiteContent CSM ON Csm.CMSID = Xcms.CMSW_RelatedCmsID
                 AND CSM.CMS_Active = 1
                 WHERE
                 Xcms.CMSW_Active = 1
                 AND Xcms.CMSW_WebHierarchyID = plcH.STRID
                 AND Xcms.CMSW_MasterContentID = 0
                 ORDER BY Xcms.CMSW_Order ASC";
        }
        public static string SQL_T5_CommentScore()
        {
            return @"SELECT count(*) as NumComments,avg(cast(PCC_OverallScore as decimal)) as Score from PRD_CustomerComment 
                WHERE PCC_OverallScore > 0 AND PCC_DetailID = 0 AND PCC_Active = 1 AND PCC_Block = 0";
        }

        public static string SQL_T5_CountryComments(string placeID)
        {
            return @"Select PLCO.STR_PlaceTitle as Name, PLCO.STR_PlaceID as Id, count(CF.PCCID) As NoOfFeedbacks
               From STR_Places_Hierarchy PLCO 
               inner join PRD_PlaceXProductItem pXp on pXp.CXZ_ChildPlaceID = PLCO.STR_PlaceID and pXp.CXZ_Active = 1 
               inner join PRD_ProductItem pri ON pXp.CXZ_ProductItem = pri.PDLID and pri.PDL_NoWeb = 0 and pri.PDL_Active = 1 
               inner join PRD_CustomerComment CF on pri.PDLID = CF.PCC_PDLID 
               Where PLCO.STR_PlaceID in (" + placeID + @") and PLCO.STR_UserID = 243
                     and PLCO.STR_NoWeb = 0 and PLCO.STR_PlaceActive = 1 and PLCO.STR_PlaceTypeID = 5 and PLCO.STR_ProdKindID = 0 
                     and datalength(CF.PCC_Comment) > 15 and CF.PCC_Active = 1 and CF.PCC_Block = 0 
               group by PLCO.STR_PlaceTitle, PLCO.STR_PlaceID";
        }

        public static string SQL_T5_DisplayOrder(string placeStrid)
        {
            return @"Select SDP_DisplayTitle
                  , isnull(SDP_GroupTitleURL,'none') as SDP_GroupTitleURL
                  , isnull(SDP_Description,'none') as SDP_Description
                  , isnull(SDP_Order,0) as SDP_Order
                  , isnull(SDP_PlaceHierarchyID,0) as SDP_PlaceHierarchyID
                  , isnull(SDP_GroupProdKindID,0) as SDP_GroupProdKindID
                  , isnull(SDP_DisplayProdKindID,0) as SDP_DisplayProdKindID
                  , isnull(SDP_TitleBGColor,'none') as SDP_TitleBGColor
                  From STR_Places_Hierarchy 
                  inner join STR_DisplayPosition on SDP_PlaceHierarchyID = STRID
                  Where   
				  STRID = " + placeStrid + @"
                  and STR_PlaceActive = 1
				  and SDP_MasterContentID = 0
				  and SDP_Active = 1                 
                  order by  SDP_DisplayProdKindID, SDP_Order ASC";
        }
    }
}
