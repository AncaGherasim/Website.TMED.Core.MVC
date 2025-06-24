using System;

namespace MVC_TMED.Infrastructure
{
    public class SqlCalls
    {
        private static string SiteUserId = Startup.StaticConfig.GetSection("ApplicationSettings:userID").Value;
        private static string InternalComments = Startup.StaticConfig.GetSection("ApplicationSettings:intCom").Value;
        private static string defaultMostPop = Startup.StaticConfig.GetSection("ApplicationSettings:defaultMostPop").Value;

        public static string SQL_ProductTemplateValue(string PackageId)
        {
            return @"SELECT PRWT.PWT_TemplateValue  FROM PRD_ProductItemXwebTemplate PIXT 
        INNER JOIN PRD_ProductWebTemplate PRWT ON PIXT.PPWT_TemplateID = PRWT.PWTID 
        LEFT JOIN PRD_ProductItemExtraProperty PIEP ON PIEP.PDLX_PDLID = PIXT.PPWT_ProdItemID and PIEP.PDL_Active = 1
        WHERE PIXT.PPWT_ProdItemID = " + PackageId +
         @" AND PIXT.PPWT_Active = 1 AND PRWT.PWT_Active = 1 and isnull(PIEP.PDLX_IsLuxury, 0) = 0
        ORDER BY PWT_TemplateValue DESC";
        }

        public static string SQL_RelPackByPackID(string PackageId) //sqlRelatedPacklageByPackId in SqlCalls.vb
        {
            return @"SELECT DISTINCT pxp.CXZID,pxp.cxz_productitem as PackageId,pit.PDL_title as PackageTitle,pxp.cxz_ChildPlaceId as PlaceId,ph.str_placetitle as PlaceTitle,
                ph.str_placetypeid,PROD.SPD_Features
                FROM prd_placexproductitem pxp
                INNER JOIN str_places_hierarchy ph ON ph.str_placeid = pxp.cxz_childplaceid
                AND ph.str_userid = 243 and ph.str_placetypeid in (1, 5, 25)
                INNER JOIN PRD_ProductItem pit ON pit.pdlid = pxp.cxz_productitem and pit.PDL_Active = 1 AND pit.PDL_NoWeb = 0
                INNER Join PRD_Product PROD ON PROD.SPDID = PIT.PDL_ProductID
                AND PROD.SPD_Active = 1
                AND pit.PDL_Active = 1
                AND PROD.SPD_InternalComments LIKE '%" + InternalComments + @"%'
                WHERE
                pxp.cxz_active = 1
                And ph.str_placeactive = 1
                And ph.STR_NoWeb = 0
                AND pxp.cxz_productitem in (" + PackageId + @") ORDER BY PackageID";
        }

        public static string SQL_PackageRelatedPlacesInfo_WithCMSs_short(string PackageId)
        {
            return @"select pxp1.cxz_ChildPlaceId as PlaceId, ph.str_placetypeid as STR_PlaceTypeId, ph.STR_UserID, ph.STR_PlaceTitle, ph.STR_PlaceShortInfo, 1 as N
                FROM prd_placexproductitem pxp1 
                INNER JOIN STR_Places_Hierarchy ph ON ph.str_placeid=pxp1.cxz_childplaceid AND ph.str_userid in (243, 595, 182) AND ph.str_prodkindid=0 And ph.str_placeactive = 1 And ph.str_placetypeid <> 3 AND ph.STR_NoWeb = 0
                WHERE pxp1.cxz_active = 1 AND pxp1.cxz_productitem = " + PackageId + @" and ph.STR_PlacePriority  = 1";
        }

        public static string SQL_PackageRelatedPlacesInfo_WithCMSs(string PackageId)
        {
            return @";declare @placesIds table(PlaceId int, STR_PlaceTypeId int, STR_UserID int INDEX IX1 CLUSTERED(PlaceId, STR_PlaceTypeId))
                                insert into @placesIds
                                select pxp1.cxz_ChildPlaceId, ph.str_placetypeid, ph.STR_UserID
                                FROM prd_placexproductitem pxp1 
                                INNER JOIN STR_Places_Hierarchy ph ON ph.str_placeid=pxp1.cxz_childplaceid AND ph.str_userid in (243, 595, 182) AND ph.str_prodkindid=0 And ph.str_placeactive = 1 And ph.str_placetypeid <> 3 AND ph.STR_NoWeb = 0
                                WHERE pxp1.cxz_active = 1 AND pxp1.cxz_productitem = " + PackageId + @" and ph.STR_PlacePriority  = 1
                ; with Hotels(PDLID, GIPH_TNTournetName, GIPH_GIATAID, CXZ_ChildPlaceID, N, N1) as
                                       (select gpi.GLT_PDLID, gh.GIPH_TNTournetName, gh.GIPH_GIATAID, gxtp.GITP_PLCID, row_number() over(partition by gxtp.GITP_PLCID, gh.GIPH_GIATAID order by gh.GIPH_TNSequence, pIt.PDLID), row_number() over(partition by gxtp.GITP_PLCID, gh.GIPHID order by gh.GIPHID)
                                       from GIATA_GiataXTournetPlace gxtp
                                       inner
                                       join GIATA_GiataXProductItem gpi on gpi.GLT_GIPHID = gxtp.GITP_GIPHID and gpi.GLT_Active = 1
                                       inner join GIATA_Hotels gh on gpi.GLT_GIPHID = gh.GIPHID and gh.GIPH_Active = 1 and gh.GIPH_TNNoWeb = 0
                                       inner join PRD_ProductItem pIt ON pIt.PDLID = gpi.GLT_PDLID and pIt.PDL_Active = 1 and pIt.PDL_NoWeb = 0 and pIt.PDL_Title NOT Like '-%' AND pIt.PDL_Title NOT Like 'Zblock%'
                                       inner join Prd_Product PRO ON pro.SPDID = pIt.PDL_ProductID AND PRO.SPD_Active = 1 AND PRO.spd_producttypesyscode = 3
                                       inner join @placesIds ids on ids.PlaceId = gxtp.GITP_PLCID and ids.STR_PlaceTypeId in (25, 1)
                                       where gxtp.GITP_Active = 1)
                ,CMSs(STRID, STR_PlaceID, CMSW_Title, CMSW_Order, CMSW_RelatedCmsID, CMS_Description) as 
                                       (SELECT plcH.STRID, plcH.STR_PlaceID,Xcms.CMSW_Title, Xcms.CMSW_Order, Xcms.CMSW_RelatedCmsID, CSM.CMS_Description
                                        FROM STR_WebHierarchyXCMS Xcms
                                        INNER JOIN CMS_WebsiteContent CSM ON Csm.CMSID = Xcms.CMSW_RelatedCmsID
                                        INNER JOIN STR_Places_Hierarchy plcH ON STR_PlaceActive = 1 AND Xcms.CMSW_WebHierarchyID = plcH.STRID
                                        inner join @placesIds ids on ids.PlaceId = plcH.STR_PlaceID AND ids.STR_UserID = plcH.STR_UserID 
                                        WHERE Xcms.CMSW_MasterContentID = 0 and Xcms.CMSW_Active = 1)
                ,SSs(PlaceId, NoOfSS) as
                                       (SELECT CXZ_ChildPlaceID, count(1) as NoOfSS
                                        from PRD_PlaceXProductItem
                                        INNER JOIN PRD_ProductItem ON PRD_ProductItem.PDLID = PRD_PlaceXProductItem.CXZ_ProductItem AND PRD_ProductItem.PDL_Active = 1 AND PRD_ProductItem.PDL_NoWeb = 0
                                        INNER JOIN Prd_Product ON Prd_Product.SPDID = PRD_ProductItem.PDL_ProductID AND Prd_Product.SPD_Active = 1  AND PRD_Product.SPD_ProductTypeSysCode = 152
                                        inner join @placesIds ids on ids.PlaceId = CXZ_ChildPlaceID and ids.STR_PlaceTypeId in (25, 1)
                                        WHERE PRD_PlaceXProductItem.CXZ_Active = 1
                                        group by CXZ_ChildPlaceID)
                ,Feeds(PlaceId, NoOfFeeds, OverAll) as
                                       (Select ids.PlaceId, count(*), round(avg(convert(decimal(12, 2), case when[PCC_OverallScore] = 0 then null else[PCC_OverallScore] end)),1)
                                        From @placesIds ids
                                        inner join PRD_PlaceXProductItem pXp on pXp.CXZ_ChildPlaceID = ids.PlaceID and pXp.CXZ_Active = 1
                                        inner join PRD_ProductItem pri ON pXp.CXZ_ProductItem = pri.PDLID and pri.PDL_NoWeb = 0 and pri.PDL_Active = 1
                                        inner join Prd_Product PRO ON pro.SPDID = pri.PDL_ProductID AND PRO.SPD_Active = 1 AND PRO.spd_producttypesyscode = 34
                                        inner join PRD_CustomerComment CF on pri.PDLID = CF.PCC_PDLID and datalength(CF.PCC_Comment) > 15 and CF.PCC_Active = 1 and CF.PCC_Block = 0
                                        Where ids.STR_PlaceTypeId = 5 group by ids.PlaceId)
                Select pxp.STR_UserID, pxp.PlaceId as PlaceId, pxp.STR_PlaceTypeId, ph.STR_PlaceTitle, Packs.NoOfPacks, isnull(cF.NoOfFeeds, 0) as NoOfFeeds, isnull(cF.OverAll, 0) as OverAll
                                      ,isnull(HotelsXPlace.NoOfHotels, 0) as NoOfHotels, isnull(SSs.NoOfSS, 0) as NoOfSS
                                      ,case when row_number() over(Partition by ph.str_placeid Order by ph.str_placeid) = 1 then isnull(ph.STR_PlaceShortInfo, 'none') else '' end as STR_PlaceShortInfo
                                      ,row_number() over(Partition by ph.str_placeid Order by ph.str_placeid, str_PlacePriority) as N
					                  , CMSs.CMSW_Title, CMSs.CMSW_Order, CMSs.CMSW_RelatedCmsID, isnull(CMSs.CMS_Description,'none') as CMS_Description
                                FROM @placesIds pxp
                                INNER JOIN STR_Places_Hierarchy ph ON ph.str_placeid = pxp.PlaceId AND ph.str_userid = pxp.STR_UserID AND ph.str_prodkindid = 0 And ph.str_placeactive = 1 And ph.str_placetypeid <> 3 --AND ph.STR_NoWeb = 0
                                LEFT JOIN(SELECT h.CXZ_ChildPlaceID, count(1) as NoOfHotels from Hotels h
                                          WHERE(h.n = 1 and h.GIPH_GIATAID <> 0) or(h.n1 = 1 and h.GIPH_GIATAID = 0)
                                           Group by h.CXZ_ChildPlaceID) as HotelsXPlace ON HotelsXPlace.CXZ_ChildPlaceID = ph.str_placeid and ph.str_placetypeid in (25, 1)
                                left join CMSs on CMSs.STR_PlaceID = ph.str_placeid
                                left join SSs on SSs.PlaceId = ph.str_placeid
                                left join Feeds cF on cF.PlaceId = ph.str_placeid
                                outer apply(SELECT COUNT(PdlId) as NoOfPacks FROM PRD_Placexproductitem pxp2
                                         INNER JOIN PRD_productItem pri ON pri.pdlid = pxp2.cxz_productitem and pri.PDL_NoWeb = 0 and pri.PDL_Active = 1 and pri.PDL_Title NOT LIKE 'Zpend%' and pri.PDL_Title NOT LIKE 'zzz%' and pri.PDL_IsPackage = 1
                                         INNER JOIN PRD_Product pro2 ON pro2.spdid = pri.pdl_productid AND pro2.spd_active = 1 
							                AND pro2.SPD_InternalComments LIKE (case pxp.STR_UserID when 243 then '%:.ED%' when 182 then '%:LD%' when 595 then '%:.TW%' End)
							                AND pro2.SPD_ProductTypeSysCode = 34
                                          WHERE pxp2.cxz_childplaceid = pxp.PlaceId and pxp2.cxz_active = 1) Packs";
        }

        public static string SQL_Get_PriorityArrivalCitiesAllSites()
        {
            return @"SELECT  p1.STR_PlaceID as CtyID
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
        }

        public static string SQL_PackageRelatedItineraries(string PackageID, bool PackageItself = true)
        {
            string sQuery = "";
            if (PackageItself)
            {
                sQuery = @"Select DISTINCT *FROM(
                SELECT PRI.PDL_Title, PRI.PDLID as STP_ProdItemID, case when STRP.STP_NumOfNights is null then PRI.PDL_Duration else STRP.STP_NumOfNights end as STP_NumOfNights, isnull(STRP.STP_Save,9999) as STP_Save, '0' as ppw, PRO.SPD_InternalComments
                , space(50) as CountryName
                FROM PRD_ProductItem PRI
                LEFT JOIN PRD_Product PRO ON PRO.SPDID = PRI.PDL_ProductID AND PRO.SPD_Active = 1
                LEFT JOIN STR_SitePromotion STRP ON  STRP.STP_ProdItemID = PRI.PDLID
                AND STRP.STP_UserID = " + SiteUserId + @" AND STRP.STP_Active = 1
                AND STRP.STP_StartDate <= Convert(VARCHAR(10), GETDATE(), 101) AND STRP.STP_EndDate >= CONVERT(VARCHAR(10), GETDATE(), 101)
                WHERE PRI.PDLID = " + PackageID + @" and pri.PDL_NoWeb = 0 and pri.PDL_Active = 1 
                UNION All
                SELECT PRI.PDL_Title, PXW.PIPW_PackageID as STP_ProdItemID, case when STRP.STP_NumOfNights is null then PRI.PDL_Duration else STRP.STP_NumOfNights end as STP_NumOfNights, isnull(STRP.STP_Save,9999) as STP_Save, PXW.PIPW_Weight as ppw
                ,PRO.SPD_InternalComments
                ,ph.STR_PlaceTitle As CountryName
                FROM PRD_ProductItemXPackageWeight PXW
                LEFT JOIN PRD_ProductItem PRI ON PRI.PDLID = PXW.PIPW_PackageID AND PRI.PDL_Active = 1 
                LEFT JOIN PRD_Product PRO ON PRO.SPDID = PRI.PDL_ProductID  AND PRO.SPD_Active = 1
                LEFT JOIN  STR_SitePromotion STRP ON STRP.STP_ProdItemID = PXW.PIPW_PackageID 
                AND STRP.STP_UserID = " + SiteUserId + @" AND STRP.STP_Active = 1
                AND STRP.STP_StartDate <= Convert(VARCHAR(10), GETDATE(), 101) AND STRP.STP_EndDate >= CONVERT(VARCHAR(10), GETDATE(), 101)
	            Left Join STR_Places_Hierarchy ph on ph.STR_PlaceID = pro.SPD_CountryPlaceID 
		        and ph.STR_PlaceActive = 1 and ph.STR_NoWeb = 0 and ph.STR_UserID in (243, 595, 182) and ph.STR_PlacePriority = 1 
                WHERE(PXW.PIPW_ProductItemID = " + PackageID + @") AND PXW.PIPW_Active = 1 and pri.PDL_NoWeb = 0) as tb
                Order by ppw ASC";
            }
            else
            {
                sQuery = @"
                SELECT PRI.PDL_Title, PXW.PIPW_PackageID as STP_ProdItemID, case when STRP.STP_NumOfNights is null then PRI.PDL_Duration else STRP.STP_NumOfNights end as STP_NumOfNights, isnull(STRP.STP_Save,9999) as STP_Save, PXW.PIPW_Weight as ppw
                ,PRO.SPD_InternalComments
                ,ph.STR_PlaceTitle As CountryName
                FROM PRD_ProductItemXPackageWeight PXW
                LEFT JOIN PRD_ProductItem PRI ON PRI.PDLID = PXW.PIPW_PackageID AND PRI.PDL_Active = 1 
                LEFT JOIN PRD_Product PRO ON PRO.SPDID = PRI.PDL_ProductID  AND PRO.SPD_Active = 1
                LEFT JOIN  STR_SitePromotion STRP ON STRP.STP_ProdItemID = PXW.PIPW_PackageID 
                AND STRP.STP_UserID = " + SiteUserId + @" AND STRP.STP_Active = 1
                AND STRP.STP_StartDate <= Convert(VARCHAR(10), GETDATE(), 101) AND STRP.STP_EndDate >= CONVERT(VARCHAR(10), GETDATE(), 101)
	            Left Join STR_Places_Hierarchy ph on ph.STR_PlaceID = pro.SPD_CountryPlaceID 
		        and ph.STR_PlaceActive = 1 and ph.STR_NoWeb = 0 and ph.STR_UserID in (243, 595, 182) and ph.STR_PlacePriority = 1 
                WHERE(PXW.PIPW_ProductItemID = " + PackageID + @") AND PXW.PIPW_Active = 1 and pri.PDL_NoWeb = 0
                Order by ppw ASC";
            }
            return sQuery;
        }

        public static string SQL_PriceGuidance(string PackageID)
        {
            return @"Select REDID, convert(char(10),RED_TXMLTime,20) as RED_TXMLTime, convert(char(10),RED_StartDate,20) as RED_StartDate, RED_Nights, RED_StartCode, RED_StartID, (RED_AirPrice + RED_AirTax + RED_PackagePrice) as RED_PackagePrice
                , RED_PackageID, '' as RED_Itinerary, PLC_Title, PLCID
                From RBT_ED RB
                INNER JOIN PRD_Place PL ON PL.PLCID = RB.RED_StartID
                WHERE RED_PackageID = " + PackageID + @" AND RED_Active = 1
                    AND exists (Select PBDA_PlaceID From PRD_BestDepartureAirport Where PBDA_PlaceID = PLCID AND PBDA_Active = 1)
                ORDER BY RED_StartDate ASC";
        }

        public static string SQL_PackageFeedbacksSummary(string PackageID)
        {
            return @"with Feeds(PCCID, PCC_Comment, OverallScore, PCC_Ranking) as 
                (SELECT PCCID, PCC_Comment, isnull([PCC_OverallScore],-999), PCC_Ranking FROM PRD_CustomerComment WHERE PCC_PDLID = " + PackageID + @" AND datalength(PCC_Comment) > 15 AND PCC_Active = 1 AND PCC_Block = 0) 
                select 1 as Id, convert(varchar(8), count(PCCID)) as [Name] from Feeds
                 union
                 select 2 as Id, convert(varchar(8), round(avg(convert(decimal(12, 2), OverallScore)), 1)) as [Name] from Feeds where OverallScore > 0
                union
                select 3 as Id, OverAll.[Name] from(select top 1 Convert(varchar(8000), PCC_Comment) as [Name] from Feeds where PCC_Comment not like '---%' order by PCC_Ranking, PCCID desc) OverAll
               order by id";
        }

        public static string SQL_PackageInformation(string PackageID)
        {
            return @"Select PRI.PDL_Title, PRI.PDL_Content, PRI.PDL_Description, isNull(PRI.PDL_Notes,'none') as PDL_Notes,PRI.PDL_SpecialCode,PRI.PDL_ProductID,PRI.PDL_Duration,
                PRO.SPD_InternalComments, PRO.SPD_Description, PRO.SPD_StarRatingSysCode,PRO.SPD_ProductKindSysCode,PRO.SPD_Features,PRO.SPD_CountryPlaceID,
                SPR.STP_Price, SPR.STP_Save, SPR.STP_Content, SPR.STP_FromPlaceID,SPR.STP_NumOfNights,SPR.STP_MiniTitle,isNull(SPR.STP_StartTravelDate, Cast('1900-01-01' As Date)) As STP_StartTravelDate,
                PLC.PLC_Title,
                PLH.STR_PlaceTitle,PLH.STR_PlaceID,PLCH.STR_PlaceTitle as CityNA,PLCH.STR_PlaceID as CityID,PLC.PLCID, PLC.PLC_Code, 
                PRI.PDL_Gateway as CityEID, PLCH1.STR_PlaceTitle as CityENA, pro.SPD_CategoryTemplate 
                From PRD_ProductItem PRI
                INNER JOIN PRD_Product PRO ON PRO.SPDID = PRI.PDL_ProductID 
                LEFT JOIN STR_SitePromotion SPR ON SPR.STP_ProdItemID = PRI.PDLID 
                AND (SPR.STP_UserID = " + SiteUserId + @") 
                AND (SPR.STP_StartDate <= CONVERT(VARCHAR(10), GETDATE(), 101)) AND (SPR.STP_EndDate >= CONVERT(VARCHAR(10), GETDATE(), 101))
                AND (SPR.STP_Active = 1)
                LEFT JOIN PRD_Place PLC ON PLC.PLCID = SPR.STP_FromPlaceID
                AND (PLC.PLC_PlaceTypeID = 1) AND (PLC.PLC_Active = 1)
                LEFT JOIN STR_Places_Hierarchy PLH ON PLH.STR_PlaceID = PRO.SPD_CountryPlaceID
                AND PLH.STR_PlaceActive = 1
                AND PLH.STR_UserID = " + SiteUserId + @" AND PLH.STR_PlaceTypeID = 5 AND plh.STR_ProdKindId=0
                LEFT JOIN STR_Places_Hierarchy PLCH ON PLCH.STR_PlaceID = PRO.SPD_StatePlaceID
                AND PLCH.STR_PlaceActive = 1
                AND PLCH.STR_UserID = " + SiteUserId + @" AND (PLCH.STR_PlaceTypeID = 1 OR PLCH.STR_PlaceTypeID = 25)
                LEFT JOIN STR_Places_Hierarchy PLCH1 ON PLCH1.STR_PlaceID = PRI.PDL_Gateway 
                AND PLCH1.STR_PlaceActive = 1
                AND PLCH1.STR_UserID = " + SiteUserId + @" AND (PLCH1.STR_PlaceTypeID = 1 OR PLCH1.STR_PlaceTypeID = 25)
                WHERE PRI.PDLID = " + PackageID + @" AND (PRI.PDL_Active = 1) AND pri.PDL_NoWeb = 0";
        }

        public static string SQL_PackageExtraInformation(string PackageID)
        {
            return @"Select PRI.PDL_Title, PRI.PDL_Content, PRI.PDL_Description, isNull(PRI.PDL_Notes,'none') as PDL_Notes,PRI.PDL_SpecialCode,PRI.PDL_ProductID,PRI.PDL_Duration,
                PRO.SPD_InternalComments, PRO.SPD_Description, PRO.SPD_StarRatingSysCode,PRO.SPD_ProductKindSysCode,PRO.SPD_Features,PRO.SPD_CountryPlaceID,
                SPR.STP_Price, SPR.STP_Save, SPR.STP_Content, SPR.STP_FromPlaceID,SPR.STP_NumOfNights,SPR.STP_MiniTitle,SPR.STP_StartTravelDate,
                PLC.PLC_Title,
				Images.IMG_Path_URL,
				(SELECT Count(CF.PCCID) as feedbacks FROM PRD_CustomerComment CF WHERE(CF.PCC_PDLID = PRI.PDLID) AND CF.PCC_Active = 1 AND CF.PCC_Block = 0) as NoOfFeeds
                ,PLH.STR_PlaceTitle,PLH.STR_PlaceID,PLCH.STR_PlaceTitle as CityNA,PLCH.STR_PlaceID as CityID,PLC.PLCID, PLC.PLC_Code, 
                PRI.PDL_Gateway as CityEID, PLCH1.STR_PlaceTitle as CityENA, pro.SPD_CategoryTemplate
                From PRD_ProductItem PRI
                INNER JOIN PRD_Product PRO ON PRO.SPDID = PRI.PDL_ProductID
                LEFT JOIN STR_SitePromotion SPR ON SPR.STP_ProdItemID = PRI.PDLID
                AND (SPR.STP_UserID = 243)
                AND(SPR.STP_StartDate <= CONVERT(VARCHAR(10), GETDATE(), 101)) AND(SPR.STP_EndDate >= CONVERT(VARCHAR(10), GETDATE(), 101))
                AND(SPR.STP_Active = 1)
                LEFT JOIN PRD_Place PLC ON PLC.PLCID = SPR.STP_FromPlaceID
                AND (PLC.PLC_PlaceTypeID = 1) AND(PLC.PLC_Active = 1)
                LEFT JOIN STR_Places_Hierarchy PLH ON PLH.STR_PlaceID = PRO.SPD_CountryPlaceID
                AND PLH.STR_PlaceActive = 1
                AND PLH.STR_UserID = 243 AND PLH.STR_PlaceTypeID = 5 AND plh.STR_ProdKindId= 0
                LEFT JOIN STR_Places_Hierarchy PLCH ON PLCH.STR_PlaceID = PRO.SPD_StatePlaceID
                AND PLCH.STR_PlaceActive = 1
                AND PLCH.STR_UserID = 243 AND (PLCH.STR_PlaceTypeID = 1 OR PLCH.STR_PlaceTypeID = 25)
                LEFT JOIN STR_Places_Hierarchy PLCH1 ON PLCH1.STR_PlaceID = PRI.PDL_Gateway
                AND PLCH1.STR_PlaceActive = 1
                AND PLCH1.STR_UserID = 243 AND (PLCH1.STR_PlaceTypeID = 1 OR PLCH1.STR_PlaceTypeID = 25)
                outer apply(select top 1 Pic3.IMG_Path_URL from PRD_ProductXImages Pic2
                              LEFT JOIN APP_Images Pic3 ON Pic3.IMGID = Pic2.PXI_ImageID
                              where Pic2.PXI_ProductID = PRI.PDL_ProductID AND Pic2.PXI_Sequence  = 0 AND Pic2.PXI_Active = 1 and Pic3.IMG_Active= 1) Images
                  WHERE PRI.PDLID = " + PackageID + @" AND(PRI.PDL_Active = 1) AND pri.PDL_NoWeb = 0";
        }

        public static string SQL_PackageSamplePrices_ED(string PackageID)
        {
            return @"SELECT PLC_Title, REA_TotalPrice, REA_AirTax, REA_Nights, REAID, REA_StartDate
                FROM RBT_EDAggregate
                INNER JOIN PRD_Place ON PRD_Place.PLCID = RBT_EDAggregate.REA_StartPlaceID
                WHERE(REA_PackageID = " + PackageID + @") 
                ORDER BY PLC_Title,REA_TotalPrice";
        }

        public static string SQL_PackageCMS(string PackageID)
        {
            return @"Select isNull(PICMS_ItineraryCMSID, 0) as PICMS_ItineraryCMSID
               ,isNull(content.CMS_Content, '') as PICMS_ItineraryCMSContent
               ,isNull(PICMS_PriceCMSID, 0) as PICMS_PriceCMSID
               ,isNull(PICMS_AccommodationCMSID, 0) as PICMS_AccommodationCMSID
,(Select CMS_Content From CMS_WebsiteContent Where CMSID = PICMS_AccommodationCMSID) as CMSHotel
               ,isNull(PICMS_ActivityCMSID, 0) as PICMS_ActivityCMSID
               ,isNull(PICMS_TransferCMSID, 0) as PICMS_TransferCMSID
               ,isNull(PICMS_FAQCMSID, 0) as PICMS_FAQCMSID
               ,isNull(PICMS_OverviewCMSID, 0) as PICMS_OverviewCMSID
                From PRD_ProductItemXCMSs 
                inner join CMS_WebsiteContent content on PICMS_ItineraryCMSID = CMSID
                Where PICMS_Active = 1 AND PICMS_ProductItemID = " + PackageID;
        }
        public static string SQL_Top3PackImag(string PackageID)
        {
            return @"SELECT Pic2.PXI_ImageID,Pic2.PXI_Sequence, Pic3.IMG_ImageType
            , Pic3.IMG_Title
            , Case When Pic3.IMG_500Path_URL is null Then Pic3.IMG_Path_URL else Pic3.IMG_500Path_URL end as IMG_500Path_URL
            FROM PRD_ProductItem Pic1
            INNER JOIN PRD_ProductXImages Pic2 ON Pic2.PXI_ProductID = Pic1.PDL_ProductID
            INNER JOIN APP_Images Pic3 ON Pic3.IMGID = Pic2.PXI_ImageID
            WHERE(Pic1.PDLID = " + PackageID + @"
            And Pic2.PXI_Active = 1 And Pic3.IMG_Active = 1 And Pic1.PDL_Active = 1 AND Pic1.PDL_NoWeb = 0 AND (Pic2.PXI_Sequence < 4 OR Pic3.IMG_ImageType like ('M%')))";
        }
        public static string SQL_PicsForPack(string PackageID)
        {
            return @"SELECT Pic2.PXI_ImageID,Pic2.PXI_Sequence,Pic3.IMG_Path_URL,Pic3.IMG_Title,Pic3.IMG_ImageType,isnull(Pic3.IMG_500Path_URL,'none') as IMG_500Path_URL
                FROM PRD_ProductItem Pic1
                INNER JOIN PRD_ProductXImages Pic2 ON Pic2.PXI_ProductID = Pic1.PDL_ProductID
                INNER JOIN APP_Images Pic3 ON Pic3.IMGID = Pic2.PXI_ImageID
                WHERE(Pic1.PDLID = " + PackageID + @" And Pic2.PXI_Active = 1 And Pic3.IMG_Active = 1 And Pic1.PDL_Active = 1 AND Pic1.PDL_NoWeb = 0 )
                ORDER BY Pic2.PXI_Sequence";
        }

        public static string SQL_PackageComponentList(string PackageID)
        {
            return @"SELECT DISTINCT PRIx.PDLID as ParentID, PRIx.PDL_Title as ParentTitle, PROx.SPD_StatePlaceID as City, PRIx.PDL_Gateway as GateWay, PRIx.PDL_ReturnCity as ReturnCity, case when (isnull(PRIx.PDL_PercentMarkupOverride,0) + isnull(PRIx.PDL_FlatMarkupOverride,0))>0 then 1 else 0 end as MarkUpByPkg 
                  ,CL.cmpID, CL.cmp_PDLComponentID, PRI.PDL_Title as Title 
                  , LEFT(LTRIM(RTRIM(SC.SCD_Code)),1) as ProdType 
                  ,CL.cmp_GroupingKey, CL.cmp_DayOfComponent, CL.cmp_DaysDuration, CL.cmp_MarkupFlat, CL.cmp_MarkupFraction, CL.cmp_ChildMarkupFlat, CL.cmp_ChildMarkupFraction, CL.cmp_DayFlexible, CL.cmp_DurationFlexible, CL.cmp_PriceDeterminant, CL.cmp_SeasonDeterminant, CL.cmp_DisplayIt, CL.cmp_Category, CL.cmp_PriceIt 
                  ,CL.cmp_IsItChoice, CL.cmp_Optional, CL.cmp_AllotBlock, CL.cmp_Notes, CL.cmp_CheckDate ,CL.cmp_StartDate, CL.cmp_EndDate ,CL.cmp_LineNo, CL.cmp_Itin, CL.cmp_SequenceTitleTemplateID, CL.cmp_MultipleDurations, CL.cmp_CitySeq, CL.cmp_RelativeDay, CL.cmp_ProductFF1, CL.cmp_AllProducts, CL.cmp_MajorComponent 
                  ,CL.cmp_MinStay, CL.cmp_NoOfAvailNite, CL.cmp_OverNite 
                  ,isnull(doc.[ITI_Content],'') as ItinParagraph 
                  ,P.PLC_Title as CityTitle, P.PLCID as CityID, C.PLCID as CountryID, 1 as cmp_CategoryFlag, 'No' as cmp_OptionalFlag 
                  ,'0' as RelatedProductItems
                  ,'' as RelatedIDs 
                  ,'' as Pkg_AirVendorAPI
                  ,'' as category 
               FROM PRD_ComponentList CL 
               INNER JOIN PRD_ProductItem PRIx ON PRIx.PDLID = CL.cmp_PDLParentID AND PRIx.PDL_Active = 1 and  PRIx.PDL_NoWeb = 0 
               INNER JOIN PRD_Product PROx ON PROx.SPDID = PRIx.PDL_ProductID AND PROx.SPD_Active = 1 
               INNER JOIN PRD_ProductItem PRI ON PRI.PDLID = CL.cmp_PDLComponentID AND PRI.PDL_Active = 1 
               INNER JOIN PRD_Product PRO ON PRO.SPDID = PRI.PDL_ProductID AND PRO.SPD_Active = 1 
               INNER JOIN SYS_Codes SC ON SC.SCDID = PRO.SPD_ProductTypeSysCode AND SC.SCD_Active = 1 
               INNER JOIN SYS_Codes SyC ON SyC.SCDID = PRO.SPD_ProductKindSysCode AND SyC.SCD_Active = 1 
               INNER JOIN PRD_Place P ON P.PLCID = PRO.SPD_StatePlaceID and P.PLC_Active = 1 
               INNER JOIN PRD_Place C On C.PLCID = P.PLC_ParentID and C.PLC_Active =1 
               outer apply (select top 1 [ITI_Content] from [dbo].[DOC_ItineraryParagraphs] where [ITIID]=CL.cmp_Itin) doc 
               outer apply (SELECT PRD_PackageXComponentXChoice.PCC_ChoiceProdItemID as 'RelatedID' 
                           FROM PRD_PackageXComponentXChoice 
               			inner join PRD_ProductItem on PRD_PackageXComponentXChoice.PCC_ChoiceProdItemID = PRD_ProductItem.PDLID 
               			inner join PRD_Category on PRD_Category.PTY_ProductItemID = PRD_ProductItem.PDLID
                           WHERE PCC_ComponentID = CL.cmp_PDLComponentID
               				AND PRD_PackageXComponentXChoice.PCC_Active = 1 AND (PRD_PackageXComponentXChoice.PCC_Shareable =1  OR PRD_PackageXComponentXChoice.PCC_PackProdItemId = PRIx.PDLID) AND PRD_ProductItem.PDL_Active = 1 AND PRD_Category.PTY_Active = 1 
                           for xml path(''), type) as RelatedCmps(cmps) 
               outer apply (SELECT i.GDSID as Id FROM dbo.SYS_CRS_Interface i INNER JOIN dbo.PRD_ProductItemXCRSInterface pXi on i.GDSID = pXi.PPCI_CRSID 
                            WHERE pXi.PPCI_PDLID = PRIx.PDLID And i.GDS_Active = 1 And pXi.PPCI_Active = 1 
                                  AND i.GDSID in (SELECT x.PPCI_CRSID FROM PRD_ProductItemXCRSInterface x WHERE x.PPCI_PDLID = PRIx.PDLID AND x.PPCI_Active = 1) 
               		   ORDER BY i.GDS_Name for xml path(''), type) as Pkg_AirVendorAPI(api) 
               outer apply (select PC.PTYID as ID, ltrim(rtrim(PC.PTY_Title)) as Title, isnull(PC.PTY_Description,'Null') as [Desc] from [dbo].[PRD_Category] PC where PC.PTY_ProductItemID=PRIx.PDLID and PC.[PTY_Active]=1 for xml path('Category'), type) as Categories(category) 
               WHERE CL.cmp_PDLParentID = " + PackageID + @" And CL.cmp_Active = 1 
               ORDER BY CL.cmp_LineNo, CL.cmp_CitySeq";
        }

        public static string SQL_PackageFixDates(string PackageID)
        {
            return "exec dbo.WEB_GetPackFixDates " + PackageID;
        }

        public static string SQL_PackageHotelBlackoutsList(string PackageID)
        {
            return "exec dbo.WEB_GetPacksBlackOutDates " + PackageID;
        }

        public static string SQL_ThisCMS(string CmsID)
        {
            return @"Select CMS_Content From CMS_WebsiteContent where CMSID = " + CmsID;
        }

        public static string SQL_MiniPackageInformation(string MiniPackageId)
        {
            return @"SELECT PRO.SPD_StatePlaceID, PRI.PDL_Title, isNull(PRO.SPD_Description,'none') as SPD_Description
                , isNull(PRI.PDL_Content,'none') as PDL_Content,PRI.PDL_Description, PRI.PDL_Notes,PRO.SPD_ProductKindSysCode
                , PRI.PDL_SpecialCode
                 FROM PRD_ProductItem PRI
                 INNER JOIN PRD_Product PRO ON PRO.SPDID = PRI.PDL_ProductID 
                 WHERE PRI.PDLID in (" + MiniPackageId + ") AND PRI.PDL_Active = 1 and pri.PDL_NoWeb = 0";
        }

        public static string SQL_MiniPackageCategories(string MiniPackageId)
        {
            return @"Select PRO.SPD_StatePlaceID,PTYID, PTY_Title, isNull(PTY_Description,'none') as PTY_Description, PTY_ProductItemID, PTY_Active, PTY_Default, PTY_RecID, PTY_SourceTable
               FROM PRD_Category
               INNER JOIN PRD_ProductItem PRI ON PRI.PDLID = PTY_ProductItemID AND PRI.PDL_Active = 1
               INNER JOIN PRD_Product PRO ON PRO.SPDID = PRI.PDL_ProductID 
               WHERE PTY_ProductItemID in (" + MiniPackageId + @")
               AND PTY_Active = 1
               ORDER BY PTY_ProductItemID, PTY_Default DESC";
        }

        public static string SQL_CustomerFeedbacks_By_Page(string tabType, Int32 page, string id)
        {
            return @"declare @page int = " + page + @", @tabType varchar(3); set @tabType = '" + tabType +
                    @"' if @tabType = 'C' 
                        with FeedsC(PCCID, PCC_Comment, PCC_CustomerName, PCC_Itinerary, OverallScore, N) 
                        as (Select CF.PCCID, CF.PCC_Comment, CF.PCC_CustomerName, CF.PCC_Itinerary, CF.PCC_OverallScore, row_number() over(Order by PCCID desc) as N 
                        From STR_Places_Hierarchy PLCO inner join PRD_PlaceXProductItem pXp on pXp.CXZ_ChildPlaceID = PLCO.STR_PlaceID and pXp.CXZ_Active = 1 
                        inner join PRD_ProductItem pri ON pXp.CXZ_ProductItem = pri.PDLID and pri.PDL_NoWeb = 0 and pri.PDL_Active = 1 
                        inner join PRD_CustomerComment CF on pri.PDLID = CF.PCC_PDLID and datalength(CF.PCC_Comment) > 15 and CF.PCC_Active = 1 and CF.PCC_Block = 0      
                        inner join Prd_Product PRO ON pro.SPDID = pri.PDL_ProductID AND PRO.SPD_Active = 1 AND PRO.spd_producttypesyscode = 34
                        Where PLCO.STR_PlaceID = " + id + " and PLCO.STR_UserID in (243, 182, 595) and PLCO.STR_NoWeb = 0 and PLCO.STR_PlaceActive = 1 and PLCO.STR_PlaceTypeID = 5 and PLCO.STR_ProdKindID = 0) " +
                        "select* from FeedsC where n between((@page-1)*10)+1 and @page*10 order by PCCID desc " +
                     @"else 
                        with FeedsP(PCCID, PCC_Comment, PCC_CustomerName, PCC_Itinerary, OverallScore, N) 
                        as (SELECT CF.PCCID, CF.PCC_Comment, CF.PCC_CustomerName, CF.PCC_Itinerary, CF.PCC_OverallScore, row_number() over(Order by PCCID desc) 
                        FROM PRD_CustomerComment CF  WHERE CF.PCC_PDLID = " + id + @" AND datalength(CF.PCC_Comment) > 15 AND CF.PCC_Active = 1 AND CF.PCC_Block = 0) 
                        select* from FeedsP where n between((@page-1)*10)+1 and @page*10";
        }

        public static string SQL_FeaturedItinerariesByUserID()
        {
            return @"Select PRI.PDLID 
            ,PRI.PDL_Title
            ,PRI.PDL_Content
            ,PRI.PDL_SequenceNo
            ,STP.STP_UserID
            ,CASE
            When STP.STP_UserID = 243 then 'TMED'
            else ''
            end as _deptNA
            ,Convert(money,isnull(STP.STP_Price,99999))STP_Price
            ,Convert(money,isnull(STP.STP_Save,99999))STP_Save
            ,CASE When STP.STP_NumOfNights is null then PDL_Duration else STP.STP_NumOfNights end as STP_NumOfNights
            ,STP.STP_StartDate
            ,PRO.SPD_InternalComments
            ,PRO.SPD_Producttypesyscode
            ,PRO.SPD_Description
            ,PRO.SPD_StatePlaceID as CityID
            ,(Select top 1 PLCY.STR_PlaceTitle  FROM STR_Places_Hierarchy PLCY where PLCY.STR_PlaceID = PRO.SPD_StatePlaceID and PLCY.STR_PlaceActive = 1 AND PLCY.STR_NoWeb = 0) as CityName
            ,PRO.SPD_CountryPlaceID as CountryID
            ,(Select top 1 PLCO.STR_PlaceTitle  FROM STR_Places_Hierarchy PLCO where PLCO.STR_PlaceID = PRO.SPD_CountryPlaceID and PLCO.STR_PlaceActive = 1 AND PLCO.STR_NoWeb = 0) as CountryName
            ,IMG.IMG_Path_URL, IMG.IMG_500Path_URL
            ,(SELECT COUNT (CF.PCCID) as NoOfFeed FROM PRD_CustomerComment CF  
            INNER JOIN RSV_Heading CFH with (nolock) ON CF.PCC_BookingID = CFH.ID 
            WHERE(CF.PCC_PDLID = PRI.PDLID)
            AND CF.PCC_Comment is not null AND LEN(cast(CF.PCC_Comment as varchar(8000))) > 15  
            AND CF.PCC_Active = 1 AND CF.PCC_Block = 0) as NoOfFeed
            ,isnull((SELECT TOP 1 isNull(PPW.SPPW_Weight, 999) as SPPW_Weight
            FROM STR_PlacesXPackageWeight PPW 
            WHERE(PPW.SPPW_PackageID = PRI.PDLID) AND PPW.SPPW_Active = 1 AND PPW.SPPW_MasterContentID = 0 
            ORDER BY SPPW_Weight ASC),0) as SPPW_Weight
            FROM STR_SitePromotion STP
            INNER JOIN PRD_ProductItem PRI ON PRI.PDLID = STP.STP_ProdItemID
            INNER JOIN PRD_Product PRO ON PRO.SPDID = PRI.PDL_ProductID
            LEFT JOIN PRD_ProductXImages PXI ON PXI.PXI_ProductID = PRI.PDL_ProductID 
            AND PXI.PXI_Active = 1 
            AND PXI.PXI_Sequence = 0 
            LEFT JOIN APP_Images IMG ON IMG.IMGID = PXI.PXI_ImageID 
            AND IMG.IMG_Active = 1 
            WHERE 
            STP.STP_UserID IN (243) 
            AND STP.STP_Active = 1 
            AND STP.STP_StartDate <= CONVERT(VARCHAR(10), GETDATE(), 101) 
            AND STP.STP_EndDate >= CONVERT(VARCHAR(10), GETDATE(), 101) 
            AND PRO.SPD_Producttypesyscode = 34 
            AND PRO.SPD_Active = 1 
            AND PRI.PDL_Active = 1 
            AND PRI.PDL_SequenceNo < 100 
            AND PRI.PDL_NoWeb = 0 
            AND STP.STP_TypePromotion = 1 
            ORDER BY _deptNA, Case When STP_TypePromotion = 0 Then 99 else STP_TypePromotion End ASC, STP_StartDate DESC,PDL_SequenceNo DESC";
        }

        public static string SQL_Get_NumberofCustomerFeedbacks_OverAllScore()
        {
            return @"SELECT count(*) as NumComments,avg(cast(PCC_OverallScore as decimal)) as Score from PRD_CustomerComment 
                WHERE PCC_OverallScore > 0 AND PCC_DetailID = 0 AND PCC_Active = 1 AND PCC_Block = 0";
        }

        public static string SQL_GetCustomerCommentsByuserID(string packids, bool simplifiedDestinations = false)
        {
            var strQuery = "";
            if (simplifiedDestinations)
            { //only for .deskDestinations click (Base.js) on TMED footer 
                strQuery = @"SELECT top 3 PRI.PDLID,PRI.PDL_Title, Convert(money, isnull(STP.STP_Save, 99999)) as STP_Save 
                     ,CASE WHEN STP.STP_NumOfNights is null then PRI.PDL_Duration ELSE STP.STP_NumOfNights END as STP_NumOfNights 
                     ,HRCH.STR_PlaceTitle as CityNA, PRO.SPD_CountryPlaceID, CONT.STR_PlaceTitle as CountryName, img.IMG_Path_URL, IMG.IMG_500Path_URL
                     FROM STR_SitePromotion STP 
                     INNER JOIN PRD_ProductItem PRI ON PRI.PDLID = STP.STP_ProdItemID 
                     INNER JOIN PRD_Product PRO ON PRO.SPDID = PRI.PDL_ProductID 
                     INNER JOIN STR_Places_Hierarchy HRCH ON (HRCH.STR_PlaceID = PRO.SPD_StatePlaceID) AND (HRCH.STR_PlaceActive = 1) AND (HRCH.STR_UserID = STP.STP_UserID) AND (HRCH.STR_NoWeb = 0) 
                     INNER JOIN STR_Places_Hierarchy CONT ON (CONT.STR_PlaceID = PRO.SPD_CountryPlaceID) AND (CONT.STR_PlaceActive = 1) AND (CONT.STR_UserID = STP.STP_UserID) AND (CONT.STR_NoWeb = 0) 
                     LEFT JOIN PRD_ProductXImages PxImg ON PxImg.PXI_ProductID = PRI.PDL_ProductID AND (PxImg.PXI_Sequence = 0) And PxImg.PXI_Active = 1
                     LEFT JOIN APP_Images Img ON Img.IMGID = PxImg.PXI_ImageID
                     WHERE STP.STP_UserID = 243 AND STP.STP_Active = 1 AND STP.STP_StartDate <= CONVERT(VARCHAR(10),GETDATE(),101) AND STP.STP_EndDate >= CONVERT(VARCHAR(10),GETDATE(),101) 
                     AND PRI.PDL_Active = 1 AND PRI.PDL_NoWeb = 0 AND PRO.SPD_Active = 1 AND PRO.SPD_Producttypesyscode=34
                     AND PRI.PDLID in (" + defaultMostPop + @")";
            }
            else
            {
                strQuery = @"SELECT top 3 PRI.PDLID,PRI.PDL_Title, Convert(money, isnull(STP.STP_Save, 99999)) as STP_Save 
                     ,CASE WHEN STP.STP_NumOfNights is null then PRI.PDL_Duration ELSE STP.STP_NumOfNights END as STP_NumOfNights 
                     ,HRCH.STR_PlaceTitle as CityNA, PRO.SPD_CountryPlaceID, CONT.STR_PlaceTitle as CountryName, img.IMG_Path_URL, IMG.IMG_500Path_URL
                     ,(SELECT COUNT (CF.PCCID) FROM PRD_CustomerComment CF INNER JOIN RSV_Heading CFH with (nolock) ON CF.PCC_BookingID = CFH.ID 
                     WHERE CF.PCC_PDLID = PRI.PDLID AND CF.PCC_Comment is not null AND LEN(cast(CF.PCC_Comment as varchar(8000))) > 15 AND CF.PCC_Active = 1 AND CF.PCC_Block = 0 AND CHARINDEX('---', CF.PCC_Comment) = 0) as NoOfFeed 
                     ,(SELECT top 1 convert(varchar(1000), CF.PCC_Comment) FROM PRD_CustomerComment CF INNER JOIN RSV_Heading CFH with (nolock) ON CF.PCC_BookingID = CFH.ID 
                     WHERE CF.PCC_PDLID = PRI.PDLID AND CF.PCC_Comment is not null AND LEN(cast(CF.PCC_Comment as varchar(8000))) > 15 AND CF.PCC_Active = 1 AND CF.PCC_Block = 0 AND CHARINDEX('---', CF.PCC_Comment) = 0 AND CFH.dep_date > convert(Varchar(10),Getdate()- 1095,101) ORDER BY CF.PCC_Ranking ASC, CFH.dep_date DESC) as Comment 
                     ,(SELECT top 1 CFH.dep_date FROM PRD_CustomerComment CF INNER JOIN RSV_Heading CFH with (nolock) ON CF.PCC_BookingID = CFH.ID 
                     WHERE CF.PCC_PDLID = PRI.PDLID AND CF.PCC_Comment is not null AND LEN(cast(CF.PCC_Comment as varchar(8000))) > 15 AND CF.PCC_Active = 1 AND CF.PCC_Block = 0 AND CHARINDEX('---', CF.PCC_Comment) = 0 AND CFH.dep_date > convert(Varchar(10),Getdate()- 1095,101) ORDER BY CF.PCC_Ranking ASC, CFH.dep_date DESC) as dep_date
                     FROM STR_SitePromotion STP 
                     INNER JOIN PRD_ProductItem PRI ON PRI.PDLID = STP.STP_ProdItemID 
                     INNER JOIN PRD_Product PRO ON PRO.SPDID = PRI.PDL_ProductID 
                     INNER JOIN STR_Places_Hierarchy HRCH ON (HRCH.STR_PlaceID = PRO.SPD_StatePlaceID) AND (HRCH.STR_PlaceActive = 1) AND (HRCH.STR_UserID = STP.STP_UserID) AND (HRCH.STR_NoWeb = 0) 
                     INNER JOIN STR_Places_Hierarchy CONT ON (CONT.STR_PlaceID = PRO.SPD_CountryPlaceID) AND (CONT.STR_PlaceActive = 1) AND (CONT.STR_UserID = STP.STP_UserID) AND (CONT.STR_NoWeb = 0) 
                     LEFT JOIN PRD_ProductXImages PxImg ON PxImg.PXI_ProductID = PRI.PDL_ProductID AND (PxImg.PXI_Sequence = 0) And PxImg.PXI_Active = 1
                     LEFT JOIN APP_Images Img ON Img.IMGID = PxImg.PXI_ImageID
                     WHERE STP.STP_UserID = 243 AND STP.STP_Active = 1 AND STP.STP_StartDate <= CONVERT(VARCHAR(10),GETDATE(),101) AND STP.STP_EndDate >= CONVERT(VARCHAR(10),GETDATE(),101) 
                     AND PRI.PDL_Active = 1 AND PRI.PDL_NoWeb = 0 AND PRO.SPD_Active = 1 AND PRO.SPD_Producttypesyscode=34
                     AND PRI.PDLID in (" + defaultMostPop + @")";
            }

            return strQuery;
        }

        public static string SQL_SpotLights_Home(string plcIDs)
        {
            return @"SELECT DISTINCT PRI.PDLID, CONT.STR_PlaceTitle as CountryNA, CONT.STR_PlaceAIID, PRI.PDL_Title ,
                Convert(money,isnull(STP.STP_Save,99999))as STP_Save, STP_NumOfNights, PRO.SPD_CountryPlaceID  
                ,STUFF((Select  ',' + STR_PlaceTitle  FROM STR_Places_Hierarchy CTY 
                WHERE (CTY.STR_Place1ParentID = CONT.STR_PlaceID OR CTY.STR_Place2ParentID = CONT.STR_PlaceID)
                AND CTY.STR_PlaceActive = 1 
                AND CTY.STR_PlaceTypeID in (25,1)
                AND CTY.STR_UserID = 243
                AND CTY.STR_PlaceAIID < 4 FOR XML PATH('')), 1, 1,'' ) as city 
                , isnull(IMG.IMG_500Path_URL,'none') as IMG_500Path_URL
                FROM PRD_ProductItem PRI 
                INNER JOIN STR_SitePromotion STP ON PRI.PDLID = STP.STP_ProdItemID 
                INNER JOIN PRD_Product PRO ON PRO.SPDID = PRI.PDL_ProductID
                INNER JOIN STR_Places_Hierarchy CONT ON (CONT.STR_PlaceID = PRO.SPD_CountryPlaceID) 
                Left JOIN PRD_ProductXImages Pic ON Pic.PXI_ProductID = PRI.PDL_ProductID and Pic.PXI_Active = 1 AND Pic.PXI_Sequence = 0
                Left JOIN APP_Images IMG ON IMG.IMGID = Pic.PXI_ImageID AND IMG.IMG_Active = 1
                WHERE PRI.PDLID in (" + plcIDs + @") AND STP.STP_Active = 1 
                AND STP.STP_UserID = 243 AND STP.STP_StartDate <= CONVERT(VARCHAR(10),GETDATE(),101) 
                AND STP.STP_EndDate >= CONVERT(VARCHAR(10),GETDATE(),101) 
                AND CONT.STR_PlaceACtive = 1 
                AND CONT.STR_NoWeb = 0 
                AND CONT.STR_UserID = 243 
                ORDER BY STR_PlaceAIID, CountryNa , PDL_Title ASC";
        }

        public static string SQL_AllDestinos(bool First3 = false, bool First1 = false)
        {
            string strQuery = @"SELECT p1.STR_PlaceID as CtyID, p1.STR_PlaceTitle as CtyNA, p2.STR_PlaceID as CouID, p2.STR_PlaceTitle as CouNA, p1.STR_PlaceAIID as Ranking
                , isnull(p2.STR_PlaceAIID,1000) as CountryRK
                FROM  STR_Places_Hierarchy p1
                INNER JOIN STR_Places_Hierarchy p2 ON (p2.STR_PlaceID = p1.STR_Place1ParentID OR p2.STR_PlaceID = p1.STR_Place2ParentID)
                WHERE p1.STR_PlaceActive = 1
                AND p1.STR_UserID = " + SiteUserId + @" AND p1.STR_PlaceTypeID in (1, 25) AND p1.STR_NoWeb = 0
                AND p1.STR_ProdKindID = 0
                AND p2.STR_PlaceActive = 1
                AND p2.STR_UserID = " + SiteUserId + @" AND p2.STR_PlaceTypeID = 5
                AND p2.STR_ProdKindID = 0
                AND p2.STR_NoWeb = 0";

            if (First3)
            {
                strQuery = strQuery + " AND (p1.STR_PlaceAIID <= 3) ORDER BY p2.STR_PlaceTitle,p1.STR_PlaceAIID ASC,p1.STR_PlaceTitle";
            }
            else
            {
                if (First1)
                {
                    strQuery = strQuery + " AND (p1.STR_PlaceAIID = 1) ORDER BY CountryRK ASC, CouNA DESC";
                }
                else
                {
                    strQuery = strQuery + " ORDER BY p2.STR_PlaceTitle,p1.STR_PlaceAIID ASC,p1.STR_PlaceTitle";
                }
            }


            return strQuery;
        }

        public static string SQL_GetPlaceInfoByName(string plname)
        {
            return @"SELECT p1.STRID as strID, p1.STR_PlaceID as plcID, p1.STR_PlaceTitle as plcNA , p2.STR_PlaceID as couID, p2.STR_PlaceTitle as couNA
                FROM STR_Places_Hierarchy p1
                Left Join STR_Places_Hierarchy p2 On p2.STR_PlaceID = p1.STR_Place1ParentID Or p2.STR_PlaceID = p1.STR_Place2parentID
                WHERE(p1.STR_PlaceActive = 1)
                AND (p1.STR_UserID = " + SiteUserId + @")
                AND (p1.STR_NoWeb = 0)
                AND (p1.STR_ProdKindID = 0)
                AND (p1.STR_PlaceTitle LIKE '" + plname + @"')
                AND (p2.STR_UserID = 243)
                AND (p2.STR_PlaceActive = 1)
                AND (p2.STR_PlaceTypeID = 5)
                AND (p2.STR_Noweb = 0)";
        }

        public static string SQL_CustomerFeedByPlaceID(string placeID)
        {
            return @"SELECT top 4 CF.PCC_Comment 
                ,CF.PCC_CustomerName 
                ,CF.PCC_Itinerary 
                ,CF.PCCID 
                ,CF.PCC_PDLID 
                ,CFH.dep_date 
                ,CFP.PDL_Title 
                ,PRO.SPD_CountryPlaceID as CountryID 
                , (Select co.STR_PlaceTitle From STR_Places_Hierarchy co Where co.STR_PlaceActive = 1  
                And co.STR_PlacePriority = 1 And co.STR_UserID in(243, 595, 182) AND co.STR_NoWeb = 0 
                and co.STR_PlaceTypeID = 5 
                and co.STR_ProdKindID = 0 
                AND co.STR_PlaceID = PRO.SPD_CountryPlaceID) as CountryName 
                FROM PRD_CustomerComment CF 
                INNER JOIN RSV_Heading CFH with (nolock) ON CF.PCC_BookingID = CFH.ID 
                INNER JOIN PRD_ProductItem CFP ON CFP.PDLID = CF.PCC_PDLID 
                and CFP.PDL_Active = 1 
                AND CFP.PDL_NoWeb = 0 
                INNER JOIN PRD_PlaceXProductItem CFxplace ON CFxplace.CXZ_ProductItem = CFP.PDLID  
                INNER JOIN PRD_Product PRO ON PRO.SPDID = CFP.PDL_ProductID 
                WHERE CF.PCC_PDLID <> 0  
                AND CFH.dept in (868,1615)
                AND CF.PCC_Active = 1 
                AND CF.PCC_Block = 0 
                AND CFxplace.CXZ_ChildPlaceID = " + placeID + @"
                AND CFxplace.CXZ_Active = 1 
                AND (CF.PCC_Comment is not null) 
                AND (LEN(cast(CF.PCC_Comment as varchar(8000))) > 15) 
                AND PCC_Comment not like '-----%' 
                ORDER BY  CFH.dep_date DESC";
        }

        public static string SQL_PackOnInterestPriorityList(string plcIDs, string intIDs)
        {
            return @"SELECT PXW.SPPW_Weight
                 , PRI.PDLID
                 , PRI.PDL_Title
                 , PRI.PDL_Duration
                 , PRI.PDL_SequenceNo
                 , PRI.PDL_Content
                 , PRI.PDL_Places
                 , isnull(STPR.STP_Save, 9999) STP_Save_
                 , PRO.SPD_Description,IMG.IMG_500Path_URL as IMG_Path_URL
                 , isnull(PRO.SPD_InternalComments, '') SPD_InternalComments
                   ,(SELECT COUNT (CF.PCCID) as NoOfFeed
                  FROM PRD_CustomerComment CF 
                  INNER JOIN RSV_Heading CFH with (nolock) ON CF.PCC_BookingID = CFH.ID
                  WHERE CF.PCC_PDLID = PRI.PDLID 
                  AND CF.PCC_Comment is not null
                  AND LEN(cast(CF.PCC_Comment as varchar(8000))) > 15
                  AND CF.PCC_Active = 1 
                  AND CF.PCC_Block = 0) as NoOfFeed
                 ,isnull((select top 1 [STR_PlaceTitle] from [dbo].[STR_Places_Hierarchy] ph where ph.[STR_PlaceID] = pro.[SPD_CountryPlaceID] and ph.[STR_NoWeb]=0 and ph.[STR_PlaceActive]=1),'none') as CountryName
                 FROM STR_PlacesXPackageWeight PXW
                  INNER JOIN PRD_ProductItem PRI ON PRI.PDLID = PXW.SPPW_PackageID 
                  AND PRI.PDL_Active = 1 and pri.PDL_NoWeb = 0 
                  INNER JOIN PRD_Product PRO ON PRO.SPDID = PRI.PDL_ProductID
                  AND PRO.SPD_Active = 1
                  LEFT JOIN STR_SitePromotion STPR ON STPR.STP_ProdItemID = PXW.SPPW_PackageID
                  AND STPR.STP_UserID = " + SiteUserId + @"
                  AND STPR.STP_Active = 1 
                  AND STPR.STP_StartDate <= Convert(VARCHAR(10), GETDATE(), 101) 
                  AND STPR.STP_EndDate >= CONVERT(VARCHAR(10), GETDATE(), 101)
                  Left JOIN PRD_ProductXImages Pic ON Pic.PXI_ProductID = PRI.PDL_ProductID and Pic.PXI_Active = 1 AND Pic.PXI_Sequence = 0
                  Left JOIN APP_Images IMG ON IMG.IMGID = Pic.PXI_ImageID 
                  WHERE PXW.SPPW_Active = 1 AND IMG.IMG_Active = 1 
                  AND PXW.SPPW_ParentPlace = " + plcIDs + @" 
                  AND PXW.SPPW_MasterContentID = " + intIDs + @" 
                  ORDER BY PXW.SPPW_Weight";
        }

        public static string SQL_HotelListSummary(string placeID)
        {
            return @";with PLDIds(GIPH_GIATAID, GIPH_TNTournetRating
		       , GIPH_TNSequence, GHS_TrustYouScore, GHS_ExpediaScore, GHS_ExpediaReviewCount, GHS_FinalScore
		       , GHS_SolarToursScore, GIPH_TNZoneID, SPD_StarRatingSysCode, PDL_ProductID
		       , CityZone, N, N1) as 
              (select gh.GIPH_GIATAID, gh.GIPH_TNTournetRating 
                     ,gh.GIPH_TNSequence, isnull(ghs.GHS_TrustYouScore, 0), isnull(ghs.GHS_ExpediaScore, 0), isnull(ghs.GHS_ExpediaReviewCount, 0), isnull(ghs.GHS_FinalScore, 0)
			         ,isnull(ghs.GHS_SolarToursScore, 0), gh.GIPH_TNZoneID, gh.GIPH_TNTournetRating, pri.PDL_ProductID
                     ,isnull(place.Name,''), row_number() over(partition by gxtp.GITP_PLCID, gh.GIPH_GIATAID order by gh.GIPH_TNSequence, pri.PDLID), row_number() over(partition by gxtp.GITP_PLCID, gh.GIPHID order by gh.GIPHID) 
               from GIATA_GiataXTournetPlace gxtp 
               inner join GIATA_GiataXProductItem gpi on gpi.GLT_GIPHID = gxtp.GITP_GIPHID And gpi.GLT_Active=1 
               inner join PRD_ProductItem pri ON pri.PDLID = gpi.GLT_PDLID and pri.PDL_Active = 1 and pri.PDL_NoWeb = 0 AND pri.PDL_Title NOT Like '-%' AND pri.PDL_Title NOT Like 'Zblock%' 
	           --inner join Prd_Product PRO ON pro.SPDID = pri.PDL_ProductID AND PRO.SPD_Active = 1 AND PRO.spd_producttypesyscode=3 
               inner join GIATA_Hotels gh on gpi.GLT_GIPHID = gh.GIPHID And gh.GIPH_Active=1 And  gh.GIPH_TNNoWeb = 0 
               left join GIATA_Texts gt on gt.GHGT_GIATAID = gh.GIPH_GIATAID And gt.GHGT_Active=1 
               left join GIATA_HotelScores ghs on ghs.GHS_GIPHID = gh.GIPHID And ghs.GHS_Active = 1 
	           outer apply (select top 1 case when pl.[PLC_Title] like '.NONE%' then '' else pl.[PLC_Title] end as Name from [dbo].[PRD_Place] pl where pl.[PLCID]=gh.[GIPH_TNZoneID] And pl.[PLC_Active] = 1 ) Place
               where gxtp.GITP_PLCID =" + placeID + @"and gxtp.GITP_Active = 1) 
               Select p.GIPH_TNSequence as PDL_SequenceNo
	                 , p.GIPH_TNTournetRating as SCD_CodeTitle, p.GIPH_TNZoneID, p.CityZone
                     , p.GHS_TrustYouScore, p.GHS_ExpediaScore, p.GHS_ExpediaReviewCount, p.GHS_FinalScore, p.GHS_SolarToursScore, GIPH_GIATAID
                     from PLDIds p
                     --inner join SYS_Codes SYC ON SYC.SCDID = p.SPD_StarRatingSysCode and SYC.[SCD_Active]=1 
                     left join PRD_Property PTY ON PTY.PTY_ProductID = p.PDL_ProductID and PTY.PTY_active = 1 and PTY.pty_placeCityId=" + placeID +
                        @"where((p.n = 1 and p.GIPH_GIATAID<>0) or (p.GIPH_GIATAID = 0 and p.n1 = 1))";
        }

        public static string SQL_HotelListSummaryNew(string placeID)
        {
            return @";with PLDIds(
                GIPH_GIATAID
                , GIPH_TNTournetRating
                , GIPH_TNSequence
                , GHS_TrustYouScore
                , GHS_ExpediaScore
                , GHS_ExpediaReviewCount
                , GHS_FinalScore
                , GHS_SolarToursScore
                , GIPH_TNZoneID
                , PDLID
                , GIPH_Name
                , PDL_Title
                , IMG_Url
                , TNHighlights
                , GIPHLatitude
                , GIPHLongitude
                , CityZone
                , N
                , N1
                , HotelAddress, HotelDescription) as 
                (select gh.GIPH_GIATAID
                , isnull(gh.GIPH_TNTournetRating,'')
                , gh.GIPH_TNSequence
                , isnull(ghs.GHS_TrustYouScore, 0)
                , isnull(ghs.GHS_ExpediaScore, 0)
                , isnull(ghs.GHS_ExpediaReviewCount, 0)
                , isnull(ghs.GHS_FinalScore, 0)
                , isnull(ghs.GHS_SolarToursScore, 0)
                , gh.GIPH_TNZoneID
                , pri.PDLID
                , gh.GIPH_Name
                , gh.GIPH_TNTournetName
                , isnull(img.IMG_Path_URL, '/images/nopicture.jpg') 
                , isnull(gh.GIPH_TNHighlights,'') as GIPH_TNHighlights
                , gh.GIPH_Latitude
                , gh.GIPH_Longitude
                , isnull(place.Name,'') as PlaceName
                , row_number() over(partition by gxtp.GITP_PLCID, gh.GIPH_GIATAID order by gh.GIPH_TNSequence, pri.PDLID)
                , row_number() over(partition by gxtp.GITP_PLCID, gh.GIPHID order by gh.GIPHID)
   	            ,case when (gh.GIPH_TNContentSource like '%tournet content' or gh.GIPH_TNUseTournetContent = 1) AND ltrim(rtrim(isnull(gh.GIPH_AddressLine1,'')+isnull(gh.GIPH_AddressLine2,'')+isnull(gh.GIPH_AddressLine3,'')))='' then PTY.PTY_Address else isnull(gh.GIPH_AddressLine1,'')+isnull(', '+gh.GIPH_AddressLine2,'')+isnull(', '+gh.GIPH_AddressLine3,'')+isnull(', '+gh.GIPH_AddressLine4,'')+isnull(', '+gh.GIPH_AddressLine5,'')+isnull(', '+gh.GIPH_AddressLine6,'') end 
                ,case when gh.GIPH_TNContentSource='giata/giata content' and gh.GIPH_TNUseTournetContent=0 then isnull(gt.GHGT_Text100+'</br></br>','')+isnull(gt.GHGT_Text101,'')
                    when gh.GIPH_TNUseTournetContent = 1 then ltrim(rtrim(convert(xml, gh.GIPH_TNTournetContent).value('(//Property/Description/text())[1]','varchar(max)')))
                    else ltrim(rtrim(convert(xml, gh.GIPH_TNTournetContent).value('(//Property/Description/text())[1]','varchar(max)'))) end
                from GIATA_GiataXTournetPlace gxtp 
                inner join GIATA_GiataXProductItem gpi on gpi.GLT_GIPHID = gxtp.GITP_GIPHID And gpi.GLT_Active=1 
                inner join PRD_ProductItem pri ON pri.PDLID = gpi.GLT_PDLID and pri.PDL_Active = 1 and pri.PDL_NoWeb = 0 AND pri.PDL_Title NOT Like '-%' AND pri.PDL_Title NOT Like 'Zblock%'     
                inner join PRD_Property PTY ON PTY.PTY_ProductID = pri.PDL_ProductID and PTY.PTY_active = 1 
                inner join GIATA_Hotels gh on gpi.GLT_GIPHID = gh.GIPHID And gh.GIPH_Active=1 And  gh.GIPH_TNNoWeb = 0 
                left join GIATA_Texts gt on gt.GHGT_GIATAID = gh.GIPH_GIATAID And gt.GHGT_Active=1 
                left join GIATA_HotelScores ghs on ghs.GHS_GIPHID = gh.GIPHID And ghs.GHS_Active = 1 
                outer apply (select top 1 case when pl.[PLC_Title] like '.NONE%' then '' else pl.[PLC_Title] end as Name 
                from [dbo].[PRD_Place] pl 
                where pl.[PLCID]=gh.[GIPH_TNZoneID] And pl.[PLC_Active] = 1 ) Place
                outer apply (select top 1 Case when ai.IMG_500Path_URL is null Then ai.IMG_Path_URL Else ai.IMG_500Path_URL End as IMG_Path_URL 
                from GIATA_HotelXImages ghi 
                inner join APP_Images ai on ghi.GIMG_TNImageID = ai.IMGID and ai.IMG_Active= 1 
                where gpi.GLT_GIPHID= ghi.GIMG_GIPHID and ghi.GIMG_Active= 1 and ghi.GIMG_TNSequence = 0) Img   
                where gxtp.GITP_PLCID = " + placeID + @" and gxtp.GITP_Active = 1)
                Select
                GIPH_GIATAID
                , p.GIPH_TNTournetRating
                , p.GIPH_TNSequence
                , p.GHS_TrustYouScore
                , p.GHS_ExpediaScore
                , p.GHS_ExpediaReviewCount
                , p.GHS_FinalScore
                , p.GHS_SolarToursScore
                , p.GIPH_TNZoneID
                , p.PDLID
                , p.GIPH_Name
                ,p.PDL_Title
                , p.IMG_Url
                , p.TNHighlights
                , p.GIPHLatitude
                , p.GIPHLongitude
                , p.CityZone
                , HotelAddress, HotelDescription
                from PLDIds p
                where
                ((p.n = 1 and p.GIPH_GIATAID<>0) or (p.GIPH_GIATAID = 0 and p.n1 = 1)) 
                Order By PDL_Title ASC";
        }

        public static string SQL_HotelListSummaryNewHotelsPage(int sort, bool isRatings, bool isFavorite, bool isHotelName, bool isCityZone, bool is4_5Review, bool is4Review, bool is3_5Review, bool is3Review, bool is0Review)
        {
            string strQuery = "";
            strQuery = @"select p3.*, Place.Name As CityZone, Img.IMG_500Path_URL, Img.IMG_Path_URL
                from 
	                (select p2.*, 
		                (select count(*) from 
			                (select p1.*, isnull(ghs.GHS_FinalScore, 0) as GHS_FinalScore
				                from
				                (select GLT_GIPHID, GIPHID, GIPH_GIATAID, GIPH_TNTournetRating, GIPH_TNSequence, GIPH_TNZoneID, PDLID, PDL_Title, GIPH_TNHighlights  
					                from 
					                (select GLT_GIPHID, GIPHID, gh.GIPH_GIATAID as GIPH_GIATAID, isnull(gh.GIPH_TNTournetRating,'') as GIPH_TNTournetRating, gh.GIPH_TNSequence as GIPH_TNSequence
						                , gh.GIPH_TNZoneID, pri.PDLID
						                , gh.GIPH_TNTournetName as PDL_Title, isnull(gh.GIPH_TNHighlights,'') as GIPH_TNHighlights
						                , row_number() over(partition by gxtp.GITP_PLCID, gh.GIPH_GIATAID order by gh.GIPH_TNSequence, pri.PDLID) as n
						                , row_number() over(partition by gxtp.GITP_PLCID, gh.GIPHID order by gh.GIPHID) as n1
					                from GIATA_GiataXTournetPlace gxtp 
					                inner join GIATA_GiataXProductItem gpi on gpi.GLT_GIPHID = gxtp.GITP_GIPHID And gpi.GLT_Active=1 
					                inner join PRD_ProductItem pri ON pri.PDLID = gpi.GLT_PDLID and pri.PDL_Active = 1 and pri.PDL_NoWeb = 0 AND pri.PDL_Title NOT Like '-%' AND pri.PDL_Title NOT Like 'Zblock%'     
					                inner join PRD_Property PTY ON PTY.PTY_ProductID = pri.PDL_ProductID and PTY.PTY_active = 1 
					                inner join GIATA_Hotels gh on gpi.GLT_GIPHID = gh.GIPHID And gh.GIPH_Active=1 And  gh.GIPH_TNNoWeb = 0 
					                where gxtp.GITP_PLCID = @placeID and gxtp.GITP_Active = 1) p0
				                where (p0.n = 1 and p0.GIPH_GIATAID<>0) or (p0.GIPH_GIATAID = 0 and p0.n1 = 1)
				                ) p1
				                left join GIATA_HotelScores ghs on ghs.GHS_GIPHID = p1.GIPHID And ghs.GHS_Active = 1 " +
                                (isRatings || isFavorite || isHotelName || is4_5Review || is4Review || is3_5Review || is3Review || is0Review || isCityZone ? " Where 1=1 " : "") + 
                                (isRatings ? " AND (GIPH_TNTournetRating in @RatingsList)" : "") +
                                (isFavorite ? " AND (GIPH_TNSequence >= 49 and GIPH_TNSequence <= 60)" : "") +
                                (isHotelName ? " AND (PDL_Title like @HotelName)" : "") +
                                (is4_5Review ? " AND ((GHS_FinalScore >= 4.5) " : "") +
                                (is4Review ? (is4_5Review ? " OR (GHS_FinalScore >= 4.0 and GHS_FinalScore <= 4.49) " : " AND ((GHS_FinalScore >= 4.0 and GHS_FinalScore <= 4.49) ") : "") +
                                (is3_5Review ? (is4_5Review || is4Review ? " OR (GHS_FinalScore >= 3.5 and GHS_FinalScore < 4) " : " AND ((GHS_FinalScore >= 3.5 and GHS_FinalScore < 4) ") : "") +
                                (is3Review ? (is4_5Review || is4Review || is3_5Review ? " OR (GHS_FinalScore >= 3.0 and GHS_FinalScore <= 3.49) " : " AND ((GHS_FinalScore >= 3.0 and GHS_FinalScore <= 3.49) ") : "") +
                                (is0Review ? (is4_5Review || is4Review || is3_5Review || is3Review ? " OR ((GHS_FinalScore >= 0 and GHS_FinalScore <= 2.99) or GHS_FinalScore is null) " : " AND (((GHS_FinalScore >= 0 and GHS_FinalScore <= 2.99) or GHS_FinalScore is null) ") : "") +
                                (is4_5Review || is4Review || is3_5Review || is3Review || is0Review ? ")" : "") +
                                (isCityZone ? " AND (GIPH_TNZoneID = @CityZone)" : "") + @"
			                ) p
		                ) as TotalHotels
	                from 
		                (select p1.*, isnull(ghs.GHS_TrustYouScore, 0) as GHS_TrustYouScore
                                    , isnull(ghs.GHS_ExpediaReviewCount, 0) as GHS_ExpediaReviewCount, isnull(ghs.GHS_FinalScore, 0) as GHS_FinalScore
			                from
			                (select GLT_GIPHID, GIPHID, GIPH_GIATAID, GIPH_TNTournetRating, GIPH_TNSequence, GIPH_TNZoneID, PDLID, PDL_Title, GIPH_TNHighlights as TNHighlights, GIPH_Latitude as GIPHLatitude, GIPH_Longitude as GIPHLongitude 
				                from 
				                (select GLT_GIPHID, GIPHID, gh.GIPH_GIATAID as GIPH_GIATAID, isnull(gh.GIPH_TNTournetRating,'') as GIPH_TNTournetRating, gh.GIPH_TNSequence as GIPH_TNSequence
					                , gh.GIPH_TNZoneID as GIPH_TNZoneID, pri.PDLID
					                , gh.GIPH_TNTournetName as PDL_Title, isnull(gh.GIPH_TNHighlights,'') as GIPH_TNHighlights
					                , gh.GIPH_Latitude, gh.GIPH_Longitude
					                , row_number() over(partition by gxtp.GITP_PLCID, gh.GIPH_GIATAID order by gh.GIPH_TNSequence, pri.PDLID) as n
					                , row_number() over(partition by gxtp.GITP_PLCID, gh.GIPHID order by gh.GIPHID) as n1
				                from GIATA_GiataXTournetPlace gxtp 
				                inner join GIATA_GiataXProductItem gpi on gpi.GLT_GIPHID = gxtp.GITP_GIPHID And gpi.GLT_Active=1 
				                inner join PRD_ProductItem pri ON pri.PDLID = gpi.GLT_PDLID and pri.PDL_Active = 1 and pri.PDL_NoWeb = 0 AND pri.PDL_Title NOT Like '-%' AND pri.PDL_Title NOT Like 'Zblock%'     
				                inner join PRD_Property PTY ON PTY.PTY_ProductID = pri.PDL_ProductID and PTY.PTY_active = 1 
				                inner join GIATA_Hotels gh on gpi.GLT_GIPHID = gh.GIPHID And gh.GIPH_Active=1 And  gh.GIPH_TNNoWeb = 0 
				                where gxtp.GITP_PLCID = @placeID and gxtp.GITP_Active = 1
				                ) p0
				                where (p0.n = 1 and p0.GIPH_GIATAID<>0) or (p0.GIPH_GIATAID = 0 and p0.n1 = 1)
			                ) p1
			                left join GIATA_HotelScores ghs on ghs.GHS_GIPHID = p1.GIPHID And ghs.GHS_Active = 1 " +
                                (isRatings || isFavorite || isHotelName || is4_5Review || is4Review || is3_5Review || is3Review || is0Review || isCityZone ? " Where 1=1 " : "") +
                                (isRatings ? " AND (GIPH_TNTournetRating in @RatingsList)" : "") +
                                (isFavorite ? " AND (GIPH_TNSequence >= 49 and GIPH_TNSequence <= 60)" : "") +
                                (isHotelName ? " AND (PDL_Title like @HotelName)" : "") +
                                (is4_5Review ? " AND ((GHS_FinalScore >= 4.5) " : "") +
                                (is4Review ? (is4_5Review ? " OR (GHS_FinalScore >= 4.0 and GHS_FinalScore <= 4.49) " : " AND ((GHS_FinalScore >= 4.0 and GHS_FinalScore <= 4.49) ") : "") +
                                (is3_5Review ? (is4_5Review || is4Review ? " OR (GHS_FinalScore >= 3.5 and GHS_FinalScore < 4) " : " AND ((GHS_FinalScore >= 3.5 and GHS_FinalScore < 4) ") : "") +
                                (is3Review ? (is4_5Review || is4Review || is3_5Review ? " OR (GHS_FinalScore >= 3.0 and GHS_FinalScore <= 3.49) " : " AND ((GHS_FinalScore >= 3.0 and GHS_FinalScore <= 3.49) ") : "") +
                                (is0Review ? (is4_5Review || is4Review || is3_5Review || is3Review ? " OR ((GHS_FinalScore >= 0 and GHS_FinalScore <= 2.99) or GHS_FinalScore is null) " : " AND (((GHS_FinalScore >= 0 and GHS_FinalScore <= 2.99) or GHS_FinalScore is null) ") : "") +
                                (is4_5Review || is4Review || is3_5Review || is3Review || is0Review ? ")" : "") +
                                (isCityZone ? " AND (GIPH_TNZoneID = @CityZone)" : "") + @"
                        ) p2
                    ORDER BY " + (sort == 1 ? "PDL_Title ASC" : (sort == 2 ? "GIPH_TNTournetRating DESC, PDL_Title ASC" : "GHS_FinalScore DESC, PDL_Title ASC")) + @"
	                OFFSET (@pageNo - 1)*12 Rows
	                Fetch next 12 Rows ONLY
                ) p3
                outer apply (select top 1 pl.[PLC_Title] as Name 
                                                from [dbo].[PRD_Place] pl 
                                                where pl.[PLCID]=p3.[GIPH_TNZoneID] And pl.[PLC_Active] = 1 ) Place
                outer apply (select top 1 ai.IMG_500Path_URL, ai.IMG_Path_URL 
                                                from GIATA_HotelXImages ghi 
                                                inner join APP_Images ai on ghi.GIMG_TNImageID = ai.IMGID and ai.IMG_Active= 1 
                                                where p3.GLT_GIPHID= ghi.GIMG_GIPHID and ghi.GIMG_Active= 1 and ghi.GIMG_TNSequence = 0) Img
                ORDER BY " + (sort == 1 ? "PDL_Title ASC" : (sort == 2 ? "GIPH_TNTournetRating DESC, PDL_Title ASC" : "GHS_FinalScore DESC, PDL_Title ASC"));
            return strQuery;
        }

        public static string SQL_HotelInfo()
        {
            return @"select pri.PDLID, gh.GIPH_TNTournetRating as Rating, GIPH_TNTournetName as Name, gh.GIPH_Name as GiataName, gh.GIPH_TNSequence as SequenceNo, isnull(GIPH_Phone1, 0) as Phone 
	            ,case when (gh.GIPH_TNContentSource like '%tournet content' or gh.GIPH_TNUseTournetContent = 1) AND ltrim(rtrim(isnull(gh.GIPH_AddressLine1,'')+isnull(gh.GIPH_AddressLine2,'')+isnull(gh.GIPH_AddressLine3,'')))='' then PTY.PTY_Address else isnull(gh.GIPH_AddressLine1,'')+isnull(', '+gh.GIPH_AddressLine2,'')+isnull(', '+gh.GIPH_AddressLine3,'')+isnull(', '+gh.GIPH_AddressLine4,'')+isnull(', '+gh.GIPH_AddressLine5,'')+isnull(', '+gh.GIPH_AddressLine6,'') end as HotelAddress 
                ,CASE 
		            WHEN (gh.GIPH_TNContentSource LIKE '%tournet content' or gh.GIPH_TNUseTournetContent = 1) and HotelStyleManual.Name='' THEN '' 
		            WHEN (gh.GIPH_TNContentSource LIKE '%tournet content' or gh.GIPH_TNUseTournetContent = 1) and HotelStyleManual.Name<>'' THEN HotelStyleManual.Name 
		            ELSE isnull(HotelStyle.Name,'') 
	            END AS HotelStyle 
                ,CASE 
		            --WHEN (gh.GIPH_TNContentSource LIKE '%tournet content' or gh.GIPH_TNUseTournetContent = 1) AND (ISNULL(gh.GIPH_TNRooms,0)=0 OR gh.GIPH_TNRooms=0) THEN '-'
		            WHEN (gh.GIPH_TNContentSource LIKE '%tournet content' or gh.GIPH_TNUseTournetContent = 1) AND ISNULL(gh.GIPH_TNRooms,0)>=0 Then STR(gh.GIPH_TNRooms)
		            ELSE STR(HotelNoRooms.Value)
	            END AS NoRooms 
                ,gh.GIPH_Latitude as Latitude, gh.GIPH_Longitude as Longitude 
                ,case when gh.GIPH_TNContentSource='giata/giata content' and gh.GIPH_TNUseTournetContent=0 then isnull(gt.GHGT_Text100+'</br></br>','')+isnull(gt.GHGT_Text101,'')
                when gh.GIPH_TNUseTournetContent = 1 then ltrim(rtrim(convert(xml, gh.GIPH_TNTournetContent).value('(//Property/Description/text())[1]','varchar(max)')))
                else ltrim(rtrim(convert(xml, gh.GIPH_TNTournetContent).value('(//Property/Description/text())[1]','varchar(max)'))) end as HotelDescription                 
                ,case when gh.GIPH_TNContentSource='giata/giata content' and gh.GIPH_TNUseTournetContent=0 then gt.GHGT_Text102 else ltrim(rtrim(convert(xml, gh.GIPH_TNTournetContent).value('(//Property/RoomDesc/text())[1]','varchar(max)'))) end as RoomDescr 
                ,pro.SPD_StatePlaceID, gh.GIPH_GIATAID, gh.GIPH_TNContentSource
	            ,isnull(place.Name,'') as CityZone, GIPH_TNUseTournetContent, GIPH_TNHighlights, isnull(GIPC_HotelCode,'none') as  GIPC_HotelCode, isNull(GHS_SolarToursScore,0) as GHS_SolarToursScore
				, ISNULL(GHS_ExpediaScore, 0) as GHS_ExpediaScore, ISNULL(GHS_ExpediaReviewCount, 0) as GHS_ExpediaReviewCount, ISNULL(GHS_FinalScore, 0) as GHS_FinalScore, PLC_Title, STR_PlaceTitle
            ,gex.GIEX_ExpSpecialCheckin
            ,gex.GIEX_MandatoryFees
			,gex.GIEX_OptionalFees
            ,gex.GIEX_Renovations
            from PRD_ProductItem pri 
            inner join PRD_Property PTY ON PTY.PTY_ProductID = pri.PDL_ProductID and PTY.PTY_active = 1 
            inner join Prd_Product PRO ON pro.SPDID = pri.PDL_ProductID AND PRO.SPD_Active = 1 AND PRO.spd_producttypesyscode=3 
            inner join PRD_Place PLC ON pro.SPD_StatePlaceID = PLC.PLCID
			left join STR_Places_Hierarchy SPH on SPD_StatePlaceID = STR_PlaceID and STR_UserID = 243 and STR_PlaceActive = 1
            inner join SYS_Codes SYC ON SYC.SCDID = PRO.SPD_StarRatingSysCode and SYC.[SCD_Active]=1 
            inner join GIATA_GiataXProductItem gpi on gpi.GLT_PDLID = pri.PDLID and gpi.GLT_Active=1 
            inner join GIATA_Hotels gh on gpi.GLT_GIPHID = gh.GIPHID and gh.GIPH_Active=1 and  gh.GIPH_TNNoWeb = 0 
            left join GIATA_Texts gt on gt.GHGT_GIATAID = gh.GIPH_GIATAID and gt.GHGT_Active=1 
            left join GIATA_HotelScores ghs on ghs.GHS_GIPHID = gh.GIPHID And ghs.GHS_Active = 1 
            left join GIATA_ExpediaExt gex on gex.GIEX_GIATAID = gh.GIPH_GIATAID and gex.GIEX_Active = 1
            outer apply (select stuff((select ', ' + a.[GHGA_FactTitle] from GIATA_Facts f inner join GIATA_Amenities a on f.GHGF_FactID = a.GHGA_FactID and a.[GHGA_Active]=1 and a.[GHGA_TNNoWeb]=0 where f.GHGF_GIATAID = gh.GIPH_GIATAID and f.GHGF_Active=1 and f.GHGF_SectionName='hotel_type' and f.[GHGF_FactValue]='true' for xml path('')),1,1,'') as Name ) HotelStyle 
            outer apply (select f.[GHGF_FactValue] as value from GIATA_Facts f where f.GHGF_GIATAID = gh.GIPH_GIATAID and f.GHGF_Active=1 and f.[GHGF_FactName]='num_rooms_total') HotelNoRooms 
            outer apply (select top 1 case when pl.[PLC_Title] like '.NONE%' then '' else pl.[PLC_Title] end as Name from [dbo].[PRD_Place] pl where pl.[PLCID]=gh.[GIPH_TNZoneID] And pl.[PLC_Active] = 1 ) Place
            outer apply (select top 1 gphc.GIPC_HotelCode from GIATA_ProviderHotelCodes gphc where gphc.GIPC_GIPHID=gh.GIPHID And gphc.GIPC_Active = 1 And gphc.GIPC_ProviderCode = 'trustyou' order by GIPC_TNIsMainCode desc) x              
			            outer apply 
				            (
					            select ISNULL(stuff((select ', ' + s.SCD_CodeTitle 
					            from GIATA_HotelXExtraProperties ex 
					            inner join SYS_Codes s on ex.GHAP_HotelStyleCodeID = s.SCDID and s.SCD_Active=1 
					            where ex.GHAP_GIPHID = gh.GIPHID and ex.GHAP_Active=1 for xml path('')),1,1,''),'') as Name ) HotelStyleManual
            where pri.PDLID = @hotelID and pri.PDL_Active = 1 and pri.PDL_NoWeb = 0 AND pri.PDL_Title NOT Like '-%' AND pri.PDL_Title NOT Like 'Zblock%'";
        }

        public static string SQL_HotelImages(string hotID)
        {
            return @"select ai.IMG_Title, isnull(Case when ai.IMG_500Path_URL is null Then ai.IMG_Path_URL Else ai.IMG_500Path_URL End, '') as IMG_Path_URL, ghi.GIMG_TNSequence 
                from GIATA_GiataXProductItem gpi inner join GIATA_Hotels gh on gpi.GLT_GIPHID = gh.GIPHID and gh.GIPH_Active=1 and  gh.GIPH_TNNoWeb = 0  
                inner join GIATA_HotelXImages ghi on gh.GIPHID=ghi.GIMG_GIPHID and ghi.GIMG_Active=1 inner join APP_Images ai on ghi.GIMG_TNImageID = ai.IMGID and ai.IMG_Active=1 
                where gpi.GLT_PDLID = " + hotID + @" and gpi.GLT_Active=1 order by ghi.GIMG_TNSequence";
        }

        public static string SQL_HotelFacilities()
        {
            return @"declare @Source varchar(10)
               declare @giatahid as int 
               declare @UseTournet as bit 
               select @Source = case when gh.GIPH_TNContentSource like '%tournet%' then 'TN' else 'GIATA' end ,@giatahid= gh.GIPHID, @UseTournet = gh.GIPH_TNUseTournetContent from GIATA_GiataXProductItem gpi inner join GIATA_Hotels gh on gpi.GLT_GIPHID = gh.GIPHID and gh.GIPH_Active=1 and  gh.GIPH_TNNoWeb = 0  
                 where gpi.GLT_PDLID = @hotelID and gpi.GLT_Active=1 
               if @Source='TN' or @UseTournet = 1 
               	select pf.FACID as Id, pf.FAC_Type as FacilityType, scd.SCD_CodeTitle as FacilityStrType, 
               			FAC_Title as FacilityName 
               		   From [dbo].[GIATA_RoomAmenities] ghra 
               			inner Join PRD_Facility pf on ghra.GHRA_AmenityID=pf.FACID 
                        INNER Join sys_codes scd ON scd.SCDID = pf.FAC_Type And SCD_Active = 1 
                       where GHRA_GIPHID =@giatahid And ghra.GHRA_Active=1 And pf.FAC_Active=1 
               else  
               select f.GHGFID as Id, f.GHGF_SectionType as FacilityType, a.GHGA_SectionTitle as FacilityStrType, a.GHGA_FactTitle as FacilityName 
                from GIATA_GiataXProductItem gpi  
                inner join GIATA_Hotels gh on gpi.GLT_GIPHID = gh.GIPHID and gh.GIPH_Active=1 and  gh.GIPH_TNNoWeb = 0 
                inner join [dbo].[GIATA_Facts] f on f.[GHGF_GIATAID]= gh.GIPH_GIATAID and f.[GHGF_Active]=1 and f.[GHGF_TNNoWeb]=0 and f.[GHGF_FactValue] in ('1', 'true') 
                inner join [dbo].[GIATA_Amenities] a on f.GHGF_FactID=a.[GHGA_FactID] and a.[GHGA_Active]=1 and a.[GHGA_TNNoWeb]=0 
                inner join [dbo].[GIATA_AmenitySections] ams on ams.[GHSA_SectionID]=a.[GHGA_SectionID] and ams.[GHSA_Active]=1 and ams.[GHSA_TNNoWeb]=0 
                where gpi.GLT_PDLID = @hotelID And gpi.GLT_Active = 1 order by f.GHGF_SectionType,  a.GHGA_SectionTitle";
        }

        public static string SQL_HotelRoomCategories()
        {
            return @"Select PTYID, PTY_Title, isNull(PTY_Description,'none') as PTY_Description
                , PTY_ProductItemID, PTY_Active, PTY_Default, PTY_RecID, PTY_SourceTable 
                FROM PRD_Category WHERE PTY_ProductItemID = @hotelID AND PTY_Active = 1 ORDER BY PTY_Title";
        }

        //Query to use only for mobile Hotels on City page
        //Added by: Andrei
        //Date: 08/02/2019
        public static string SQL_Hotels_From_Place(string plcID)
        {
            return @"with PLDIds(PDLID, GIPHID, GIPH_GIATAID, GIPH_TNTournetName, GIPH_CityName, GIPH_TNTournetRating, GIPH_Latitude, GIPH_Longitude
				, GIPH_TNHighlights
		       , GIPH_TNSequence
			   , GHS_TrustYouScore
		       , GHS_SolarToursScore, GHS_ExpediaScore, GHS_ExpediaReviewCount, GHS_FinalScore, GIPC_HotelCode, GIPH_TNZoneID, SPD_StarRatingSysCode
			   , PDL_ProductID
		       , CityZone, GIPH_TNUseTournetContent, N, N1) as 
          (select gpi.GLT_PDLID, gh.GIPHID, gh.GIPH_GIATAID, gh.GIPH_TNTournetName, gh.GIPH_CityName, gh.GIPH_TNTournetRating, gh.GIPH_Latitude, gh.GIPH_Longitude
		  , isnull(GIPH_TNHighlights,''),gh.GIPH_TNSequence, isnull(ghs.GHS_TrustYouScore, 0),isnull(ghs.GHS_SolarToursScore, 0)
                 , ISNULL(ghs.GHS_ExpediaScore, 0), ISNULL(ghs.GHS_ExpediaReviewCount, 0), ISNULL(ghs.GHS_FinalScore, 0)
				 , isnull(x.GIPC_HotelCode,'none'), gh.GIPH_TNZoneID, pro.SPD_StarRatingSysCode, pri.PDL_ProductID,isnull(place.Name,''),gh.GIPH_TNUseTournetContent 
				 ,row_number() over(partition by gxtp.GITP_PLCID, gh.GIPH_GIATAID order by gh.GIPH_TNSequence, pri.PDLID)
				 ,row_number() over(partition by gxtp.GITP_PLCID, gh.GIPHID order by gh.GIPHID) 
           from GIATA_GiataXTournetPlace gxtp 
		   inner join GIATA_GiataXProductItem gpi on gpi.GLT_GIPHID = gxtp.GITP_GIPHID And gpi.GLT_Active=1 
           inner join PRD_ProductItem pri ON pri.PDLID = gpi.GLT_PDLID and pri.PDL_Active = 1 and pri.PDL_NoWeb = 0 AND pri.PDL_Title NOT Like '-%' AND pri.PDL_Title NOT Like 'Zblock%' 
	       inner join Prd_Product PRO ON pro.SPDID = pri.PDL_ProductID AND PRO.SPD_Active = 1 AND PRO.spd_producttypesyscode=3 
           inner join GIATA_Hotels gh on gpi.GLT_GIPHID = gh.GIPHID And gh.GIPH_Active=1 And  gh.GIPH_TNNoWeb = 0 
           left join GIATA_HotelScores ghs on ghs.GHS_GIPHID = gh.GIPHID And ghs.GHS_Active = 1 
           outer apply (select top 1 gphc.GIPC_HotelCode from GIATA_ProviderHotelCodes gphc where gphc.GIPC_GIPHID=gh.GIPHID And gphc.GIPC_Active = 1 And gphc.GIPC_ProviderCode = 'trustyou' order by GIPC_TNIsMainCode desc) x 
	       outer apply (select top 1 case when pl.[PLC_Title] like '.NONE%' then '' else pl.[PLC_Title] end as Name from [dbo].[PRD_Place] pl where pl.[PLCID]=gh.[GIPH_TNZoneID] And pl.[PLC_Active] = 1 ) Place
           where gxtp.GITP_PLCID = " + plcID + @" and gxtp.GITP_Active = 1) 
           Select p.PDLID, p.GIPH_TNTournetName as PDL_Title, p.GIPH_TNSequence as PDL_SequenceNo, p.GIPH_TNTournetRating, p.GIPH_Latitude, p.GIPH_Longitude 
		   , p.GIPH_TNHighlights
	             , p.GIPH_TNZoneID, p.CityZone
				 , isnull(img.IMG_Path_URL, '/images/nopicture.jpg') as IMG_Path_URL
                 ,p.GIPHID, p.GIPH_GIATAID
				 , p.GIPH_CityName
				 , p.GHS_TrustYouScore
				 , p.GHS_SolarToursScore, p.GHS_ExpediaScore, p.GHS_ExpediaReviewCount, p.GHS_FinalScore, p.GIPC_HotelCode
                 from PLDIds p
                 --inner join SYS_Codes SYC ON SYC.SCDID = p.SPD_StarRatingSysCode and SYC.[SCD_Active]=1
                 outer apply (select top 1 Case when ai.IMG_500Path_URL is null Then ai.IMG_Path_URL Else ai.IMG_500Path_URL End as IMG_Path_URL from GIATA_HotelXImages ghi inner join APP_Images ai on ghi.GIMG_TNImageID = ai.IMGID and ai.IMG_Active= 1 where p.GIPHID= ghi.GIMG_GIPHID and ghi.GIMG_Active= 1 and ghi.GIMG_TNSequence = 0) Img
                    where(p.n = 1 and p.GIPH_GIATAID<>0) or(p.GIPH_GIATAID = 0 and p.n1 = 1)
				order by PDL_Title";
        }

        //Query to use only for mobile - Get Hotels Facilities
        //Added by: Andrei
        //Date: 08/09/2019

        public static string SQL_Hotels_Facilities(string plcID)
        {
            return @"declare @Source varchar(10) 
                    declare @T table(PDLID int)
                    ;with PLDIds(PDLID,--, GIPHID, 
				    GIPH_GIATAID, N, N1) as 
                    (select gpi.GLT_PDLID, gh.GIPH_GIATAID 
				     ,row_number() over(partition by gxtp.GITP_PLCID, gh.GIPH_GIATAID order by gh.GIPH_TNSequence, pri.PDLID)
				     ,row_number() over(partition by gxtp.GITP_PLCID, gh.GIPHID order by gh.GIPHID) 
                   from GIATA_GiataXTournetPlace gxtp 
		           inner join GIATA_GiataXProductItem gpi on gpi.GLT_GIPHID = gxtp.GITP_GIPHID And gpi.GLT_Active=1 
                   inner join PRD_ProductItem pri ON pri.PDLID = gpi.GLT_PDLID and pri.PDL_Active = 1 and pri.PDL_NoWeb = 0 AND pri.PDL_Title NOT Like '-%' AND pri.PDL_Title NOT Like 'Zblock%' 
	               inner join Prd_Product PRO ON pro.SPDID = pri.PDL_ProductID AND PRO.SPD_Active = 1 AND PRO.spd_producttypesyscode=3 
                   inner join GIATA_Hotels gh on gpi.GLT_GIPHID = gh.GIPHID And gh.GIPH_Active=1 And  gh.GIPH_TNNoWeb = 0 
                   where gxtp.GITP_PLCID = " + plcID + @"and gxtp.GITP_Active = 1) 

		           insert INTO @T select p.PDLID from PLDIds p where (p.n = 1 and p.GIPH_GIATAID<>0) or(p.GIPH_GIATAID = 0 and p.n1 = 1)

                   Select @Source = Case When gh.GIPH_TNContentSource Like '%tournet%' then 'TN' else 'GIATA' end from GIATA_GiataXProductItem gpi inner join GIATA_Hotels gh on gpi.GLT_GIPHID = gh.GIPHID and gh.GIPH_Active=1 and  gh.GIPH_TNNoWeb = 0  
                   Where gpi.GLT_PDLID In (select PDLID from @T) And gpi.GLT_Active=1

			       print @source

                   if @Source='TN'
                       with Facilities as
			           ( 
                        Select distinct FACID As FacilID, FAC_Type As FacilityType, SCD_CodeTitle As FacilityStrType, FAC_Title As FacilityName 
                        From PRD_ProductItem 
                        INNER Join PRD_Product On SPDID = PDL_ProductId And SPD_Active = 1 
                        INNER Join PRD_ProductXFacility On SPDID = PXF_ProductId And PXF_Active = 1 
                        INNER Join PRD_Facility On PXF_FacilityID = FACID And FAC_Active = 1 
                        INNER Join sys_codes On SCDID = FAC_Type And SCD_Active = 1 
                        Where PDLID IN (select PDLID from @T)
                        And PDL_Active = 1 And PDL_NoWeb = 0 and FAC_Type in (1007,1008,253,252)
                       )
                        Select distinct f1.FacilID, f1.FacilityName, f1.FacilityStrType,f1.FacilityType, @Source as SourceNA
                        From Facilities f1
                        ORDER BY FacilityStrType
                   Else
                       with Facilities as
			           ( 
                        Select distinct a.GHGA_FactID As FacilID, f.GHGF_SectionType As FacilityType, a.GHGA_SectionTitle As FacilityStrType, a.GHGA_FactTitle As FacilityName 
                        From GIATA_GiataXProductItem gpi  
                        inner Join GIATA_Hotels gh On gpi.GLT_GIPHID = gh.GIPHID And gh.GIPH_Active=1 And  gh.GIPH_TNNoWeb = 0 
                        inner Join [dbo].[GIATA_Facts] f On f.[GHGF_GIATAID]= gh.GIPH_GIATAID And f.[GHGF_Active]=1 And f.[GHGF_TNNoWeb]=0 And f.[GHGF_FactValue] In ('1', 'true') 
                        inner Join [dbo].[GIATA_Amenities] a on f.GHGF_FactID=a.[GHGA_FactID] And a.[GHGA_Active]=1 And a.[GHGA_TNNoWeb]=0 
                        inner join [dbo].[GIATA_AmenitySections] ams on ams.[GHSA_SectionID]=a.[GHGA_SectionID] And ams.[GHSA_Active]=1 And ams.[GHSA_TNNoWeb]=0 
                        Where gpi.GLT_PDLID in (select PDLID from @T) 
                        And gpi.GLT_Active = 1 and  f.GHGF_SectionType in (1007,1008,253,252)
                       )
                        Select distinct f1.FacilID, f1.FacilityName, f1.FacilityStrType, f1.FacilityType,  @Source as SourceNA
                        from Facilities f1
                        ORDER BY FacilityStrType";
        }

        public static string SQL_GetHotelsByFacilityID(string fid, string plcID, string TnGi)
        {
            string query = "";
            switch (TnGi)
            {
                case "TN":
                    query = query + @";with Facilities
                         as (Select PDLID
                    From PRD_PlaceXProductItem pxp
                    inner Join PRD_ProductItem pri On pri.PDLID = pxp.CXZ_ProductItem And pri.PDL_Active = 1 And pri.PDL_NoWeb = 0 And pri.PDL_Title Not Like '-%' AND pri.PDL_Title NOT Like 'Zblock%' 
                    INNER Join PRD_Product pro ON pro.SPDID = PDL_ProductId And pro.SPD_Active = 1 And PRO.spd_producttypesyscode = 3  
                    INNER Join PRD_ProductXFacility ON SPDID = PXF_ProductId And PXF_Active = 1 
                    INNER Join PRD_Facility ON PXF_FacilityID = FACID And FAC_Active = 1 
                    INNER Join sys_codes ON SCDID = FAC_Type And SCD_Active = 1 
                    where  pxp.CXZ_ChildPlaceID = " + plcID + @" And pxp.cxz_active = 1 
                    And FACID in (" + fid + @"))
                    Select(select convert(varchar(10), PDLID) + ',' from Facilities for xml path('')) as Name";
                    break;
                case "GIATA":
                    query = query + @";with Facilities
                         as (Select GLT_PDLID
                    From PRD_PlaceXProductItem pxp 
                    inner Join GIATA_GiataXProductItem gpi on gpi.GLT_PDLID = pxp.CXZ_ProductItem And gpi.GLT_Active=1 
                    inner Join GIATA_Hotels gh on gpi.GLT_GIPHID = gh.GIPHID And gh.GIPH_Active=1 And  gh.GIPH_TNNoWeb = 0 
                    inner Join [dbo].[GIATA_Facts] f on f.[GHGF_GIATAID]= gh.GIPH_GIATAID And f.[GHGF_Active]=1 And f.[GHGF_TNNoWeb]=0 And f.[GHGF_FactValue] in ('1', 'true') 
                    inner Join [dbo].[GIATA_Amenities] a on f.GHGF_FactID=a.[GHGA_FactID] And a.[GHGA_Active]=1 And a.[GHGA_TNNoWeb]=0 
                    inner Join [dbo].[GIATA_AmenitySections] ams on ams.[GHSA_SectionID]=a.[GHGA_SectionID] And ams.[GHSA_Active]=1 And ams.[GHSA_TNNoWeb]=0 
                    where  pxp.CXZ_ChildPlaceID = " + plcID + @" And pxp.cxz_active = 1
                    And a.GHGA_FactID in (" + fid + @"))
                    Select(select convert(varchar(10), GLT_PDLID) + ',' from Facilities for xml path('')) as Name";
                    break;
            }
            return query;
        }

        public static string SQL_PlaceInfo_By_PlaceName(string PlaceName)
        {
            return @"SELECT isnull(CO.STR_PlaceTitle,'none') as CountryNA, isnull(CO.STR_PlaceID,0) as CountryID, CY.STRID, CY.STR_PlaceID,CY.STR_PlaceTypeID, CY.STR_PlaceShortInfo 
             ,CY.STR_PlaceAIID,CY.STR_PlaceInfo,CY.STR_PlaceTitle
             FROM STR_Places_Hierarchy CY 
             LEFT Join STR_Places_Hierarchy CO ON (CO.STR_PlaceID = CY.STR_Place1ParentID OR CO.STR_PlaceID = CY.STR_Place2ParentID) 
                AND CO.STR_PlaceActive = 1 AND CO.STR_NoWeb = 0 AND CO.STR_PlaceTypeID = 5 AND CO.STR_ProdKindID = 0 
                AND CO.STR_UserID = " + SiteUserId + @" WHERE CY.STR_UserID = " + SiteUserId + @" AND CY.STR_PlaceActive = 1 
            AND CY.STR_NoWeb = 0 AND CY.STR_ProdKindID = 0 AND (CY.STR_PlaceTitle LIKE '" + PlaceName + @"')"; 
        }

        //Query to be used in Trips Taken page to check in all divisions
        public static string SQL_PlaceInfo_By_PlaceName_TripsTaken(string PlaceName)
        {
            return @"SELECT isnull(CO.STR_PlaceTitle,'none') as CountryNA, isnull(CO.STR_PlaceID,0) as CountryID, CY.STRID, CY.STR_PlaceID,CY.STR_PlaceTypeID, CY.STR_PlaceShortInfo 
             ,CY.STR_PlaceAIID,CY.STR_PlaceInfo,CY.STR_PlaceTitle, CY.STR_UserID, CY.STR_PlacePriority
             FROM STR_Places_Hierarchy CY 
             LEFT Join STR_Places_Hierarchy CO ON (CO.STR_PlaceID = CY.STR_Place1ParentID OR CO.STR_PlaceID = CY.STR_Place2ParentID) 
                AND CO.STR_PlaceActive = 1 AND CO.STR_NoWeb = 0 AND CO.STR_PlaceTypeID = 5 AND CO.STR_ProdKindID = 0 
                AND CO.STR_UserID in (243, 182, 595) WHERE CY.STR_UserID in (243, 182, 595) AND CY.STR_PlaceActive = 1 
            AND CY.STR_NoWeb = 0 AND CY.STR_ProdKindID = 0 AND (CY.STR_PlaceTitle LIKE '" + PlaceName + @"')";
        }
        //Created identically with the query above but with less columns loaded and change to use STR_PlaceID instead of STR_PLaceTitle
        //Used in GP3 Area Page
        public static string SQL_PlaceInfo_By_PlaceId(Int32 placeId)
        {
            return @"SELECT isnull(CO.STR_PlaceTitle,'none') as CountryNA, isnull(CO.STR_PlaceID,0) as CountryID, CY.STRID, CY.STR_PlaceID,CY.STR_PlaceTypeID,CY.STR_PlaceTitle 
             FROM STR_Places_Hierarchy CY 
             LEFT Join STR_Places_Hierarchy CO ON (CO.STR_PlaceID = CY.STR_Place1ParentID OR CO.STR_PlaceID = CY.STR_Place2ParentID) 
                AND CO.STR_PlaceActive = 1 AND CO.STR_NoWeb = 0 AND CO.STR_PlaceTypeID = 5 AND CO.STR_ProdKindID = 0 
                AND CO.STR_UserID = " + SiteUserId + @" WHERE CY.STR_UserID = " + SiteUserId + @" AND CY.STR_PlaceActive = 1 
            AND CY.STR_NoWeb = 0 AND CY.STR_ProdKindID = 0 AND CY.STR_PlaceID = " + placeId + @"";
        }

        public static string SQL_PlacePackagesIdeas(string strID)
        {
            return @"SELECT PXW.SPPW_Weight
                 , PRI.PDLID
                 , PRI.PDL_Title
                 , PRI.PDL_Duration
                 , PRI.PDL_SequenceNo
                 , PRI.PDL_Content
                 , PRI.PDL_Places
				 , PRO.SPD_Description
                 , isnull(STPR.STP_Save, 9999) STP_Save
                 , isnull(STPR.STP_Save, 9999) STP_Price
                 ,IMG.IMG_500Path_URL as IMG_Path_URL
                 ,isnull((select top 1 [STR_PlaceTitle] from [dbo].[STR_Places_Hierarchy] ph where ph.[STR_PlaceID] = pro.[SPD_CountryPlaceID] and ph.[STR_NoWeb]=0 and ph.[STR_PlaceActive]=1),'none') as CountryName
                 FROM STR_PlacesXPackageWeight PXW
                  INNER JOIN PRD_ProductItem PRI ON PRI.PDLID = PXW.SPPW_PackageID 
                  AND PRI.PDL_Active = 1 and pri.PDL_NoWeb = 0 
                  INNER JOIN PRD_Product PRO ON PRO.SPDID = PRI.PDL_ProductID
                  AND PRO.SPD_Active = 1
                  LEFT JOIN STR_SitePromotion STPR ON STPR.STP_ProdItemID = PXW.SPPW_PackageID
                  AND STPR.STP_UserID = " + SiteUserId + @"
                  AND STPR.STP_Active = 1 
                  AND STPR.STP_StartDate <= GETDATE()
                  AND STPR.STP_EndDate >= GETDATE()
                  Left JOIN PRD_ProductXImages Pic ON Pic.PXI_ProductID = PRI.PDL_ProductID and Pic.PXI_Active = 1 AND Pic.PXI_Sequence = 0
                  Left JOIN APP_Images IMG ON IMG.IMGID = Pic.PXI_ImageID 
                  WHERE PXW.SPPW_Active = 1 AND IMG.IMG_Active = 1 
                  AND PXW.SPPW_ParentPlace = " + strID + @"
                  AND PXW.SPPW_MasterContentID = 0
                  ORDER BY PXW.SPPW_Weight";
        }

        public static string SQL_Vacations_Places_Hierarchy(string PlaceTitle, bool IsInList = false)
        {
            return @"SELECT STRID,STR_PlaceID,STR_PlaceTitle,STR_PlaceTypeID,STR_PlaceShortInfo,STR_PlaceAIID,STR_PlaceInfo,STR_ProdKindID,isNull(STR_PageTemplate,'T1') as STR_PageTemplate, STR_UserID
                FROM STR_Places_Hierarchy
                WHERE STR_PlaceActive = 1 AND 
                STR_UserID = 243
                And STR_NoWeb = 0 AND 
                STR_ProdKindID = 0
                And STR_PlaceTitle " + (IsInList == false ? "LIKE '" : "IN (") + PlaceTitle + (IsInList == false ? "'" : ")");
        }

        public static string SQL_FeedbacksByPlaceID(Int32 PlaceId)
        {
            return @"SELECT CF.PCC_Comment
        ,CF.PCC_CustomerName
        ,CF.PCC_Itinerary
        ,CF.PCCID
        ,CF.PCC_PDLID
        ,CFH.dep_date
        ,CFP.PDL_Title
        ,PLCO.STR_PlaceTitle as CountryName
        ,PLCO.STR_PlaceID as CountryID
          FROM PRD_CustomerComment CF 
          INNER JOIN RSV_Heading CFH with (nolock) ON  CF.PCC_BookingID = CFH.ID
          INNER JOIN PRD_ProductItem CFP ON  CFP.PDLID = CF.PCC_PDLID and CFP.PDL_Active = 1 AND CFP.PDL_NoWeb = 0
          INNER JOIN PRD_PlaceXProductItem CFxplace ON CFxplace.CXZ_ProductItem = CFP.PDLID
          INNER JOIN PRD_Product PRO ON PRO.SPDID = CFP.PDL_ProductID 
          LEFT JOIN STR_Places_Hierarchy PLCO ON PLCO.STR_PlaceID = PRO.SPD_CountryPlaceID 
          AND (PLCO.STR_PlaceActive = 1) 
          AND (PLCO.STR_UserID in (243, 595, 182)) 
          AND (PLCO.STR_NoWeb = 0)
          AND (PLCO.STR_PlaceTypeID = 5) and PLCO.Str_ProdkindId=0 
          WHERE  CF.PCC_PDLID <> 0 
          AND CFH.dept = 1615
          AND CF.PCC_Active = 1 AND CF.PCC_Block = 0
          AND CFH.dep_date > convert(Varchar(10),Getdate()-720,101)
          AND CFxplace.CXZ_ChildPlaceID =" + PlaceId + @"
          AND CFxplace.CXZ_Active = 1
          AND (CF.PCC_Comment is not null)
          AND (LEN(cast(CF.PCC_Comment as varchar(8000))) > 15)
          ORDER BY CF.PCC_Ranking ASC, CFH.dep_date DESC";
        }
        // Created new query identically with the one above put with less columns 
        // Used in GP3 Area Page
        public static string SQL_FeedbacksByPlaceId(Int32 placeId)
        {
            return @"SELECT CF.PCC_Comment, CF.PCC_PDLID, CFH.dep_date, CFP.PDL_Title, PLCO.STR_PlaceTitle as CountryName, PLCO.STR_PlaceID as CountryID
                  FROM PRD_CustomerComment CF 
                  INNER JOIN RSV_Heading CFH with (nolock) ON  CF.PCC_BookingID = CFH.ID
                  INNER JOIN PRD_ProductItem CFP ON  CFP.PDLID = CF.PCC_PDLID and CFP.PDL_Active = 1 AND CFP.PDL_NoWeb = 0
                  INNER JOIN PRD_PlaceXProductItem CFxplace ON CFxplace.CXZ_ProductItem = CFP.PDLID
                  INNER JOIN PRD_Product PRO ON PRO.SPDID = CFP.PDL_ProductID 
                  LEFT JOIN STR_Places_Hierarchy PLCO ON PLCO.STR_PlaceID = PRO.SPD_CountryPlaceID 
                  AND (PLCO.STR_PlaceActive = 1) 
                  AND (PLCO.STR_UserID in (243, 595, 182)) 
                  AND (PLCO.STR_NoWeb = 0)
                  AND (PLCO.STR_PlaceTypeID = 5) and PLCO.Str_ProdkindId=0 
                  WHERE  CF.PCC_PDLID <> 0 
                  AND CFH.dept = 1615
                  AND CF.PCC_Active = 1 AND CF.PCC_Block = 0
                  AND CFH.dep_date > convert(Varchar(10),Getdate()-720,101)
                  AND CFxplace.CXZ_ChildPlaceID =" + placeId + @"
                  AND CFxplace.CXZ_Active = 1
                  AND (CF.PCC_Comment is not null)
                  AND (LEN(cast(CF.PCC_Comment as varchar(8000))) > 15)
                  ORDER BY CF.PCC_Ranking ASC, CFH.dep_date DESC";
        }

        public static string SQL_ManagerDisplayArea(Int32 AreaID)
        {
            return @"Select SDP_DisplayTitle
                  , isnull(SDP_GroupTitleURL,'none') as SDP_GroupTitleURL
                  , isnull(SDP_Description,'none') as SDP_Description
                  , isnull(SDP_Order,0) as SDP_Order
                  , isnull(SDP_PlaceHierarchyID,0) as SDP_PlaceHierarchyID
                  , isnull(SDP_GroupProdKindID,0) as SDP_GroupProdKindID
                  , isnull(SDP_DisplayProdKindID,0) as SDP_DisplayProdKindID
                  , isnull(SDP_TitleBGColor,'none') as SDP_TitleBGColor
                  From STR_Places_Hierarchy h
                  inner join STR_DisplayPosition d on SDP_PlaceHierarchyID = STRID
                  and d.SDP_PlaceID = h.STR_PlaceID
                  Where   
                  STR_PlaceID = " + AreaID + @" 
				  and STR_PlaceActive = 1
				  and SDP_MasterContentID = 0
				  and SDP_Active = 1
                  and STR_PlacePriority = 1
                  order by  SDP_DisplayProdKindID, SDP_Order ASC";
        }

        public static string SQL_BoxesContentArea(Int32 AreaID)
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
                  AND PLD.STX_Active = 1 AND PLD.STX_MasterContentID = 0 AND PLD.STX_StrId =  " + AreaID + @" 
                  ORDER BY PLD.STX_ProdKindID, PLD.STX_Priority";
        }

        public static string SQL_weightPlacesByIntID(Int32 intIDs, Int32 plcIDs)
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
                 WHERE SPW_masterContentID = " + intIDs + @"
                 AND SPW_Active = 1 
                AND SPW_ParentPlace = " + plcIDs + @"
                ORDER BY SPW_Weight ASC";
        }

        public static string SQL_CountryCitiesByplcID(Int32 intIDs, Int32 countryID)
        {
            return @"Select plh2.STR_PlaceTitle, plh2.STR_PlaceID, cast(plh2.STR_PlaceShortInfo As nvarchar(max)) as STR_PlaceShortInfo, plh2.STR_PlaceTypeID, 1 As SPW_Weight, plh2.STR_PlaceAIID
                ,isnull(plh3.STR_PlaceTitle,'') as Country, isnull(plh3.STR_PlaceID,-1) as CountryId
		         From STR_Places_Hierarchy plh2
                 Left Join STR_Places_Hierarchy plh3 on (plh3.STR_PlaceID = plh2.Str_Place1ParentId Or plh3.STR_PlaceID = plh2.Str_Place2ParentId)
                 And plh3.STR_UserID = 243  And plh3.Str_PlaceTypeId=5 And plh3.STR_PlaceActive = 1 And plh3.Str_Noweb = 0 And plh3.Str_ProdKindID=0
                 WHERE(plh2.STR_Place2ParentID = " + countryID + @" Or plh2.STR_Place1ParentID = " + countryID + @")
                 And (plh2.STR_PlaceActive = 1)
                 And (plh2.STR_UserID = 243)
                 And (plh2.STR_PlaceTypeID = 25 Or plh2.STR_PlaceTypeID = 1)
                 And (plh2.STR_NoWeb = 0)
	             Order By STR_PlaceAIID, Country, STR_PlaceTitle";
        }

        public static string SQL_CombineCountries(string idsStr)
        {
            return @"SELECT p1.STR_PlaceID as PlcID
                , p1.STR_PlaceTitle as PlcNA
                , p1.STR_PlaceTypeID as PlcTY
                , p1.STR_PlaceAIID as PlcRK
                , p2.STR_PlaceTitle as CouNA
                , p2.STR_PlaceID as CouID
                  FROM  STR_Places_Hierarchy p1
                  INNER JOIN STR_Places_Hierarchy p2 ON p2.STR_PlaceID = p1.STR_Place1ParentID OR p2.STR_PlaceID = p1.STR_Place2ParentID
                  WHERE (p1.STR_UserID = 243)
                  AND(p1.STR_PlaceActive = 1)
                  AND(p1.STR_PlaceTypeID = 1 OR p1.STR_PlaceTypeID = 25)
                  AND(p1.STR_NoWeb = 0)
                  AND(p1.STR_ProdKindID = 0)
                  AND(p1.STR_PlaceID IN (" + idsStr + @"))
                  AND p2.STR_UserID =  243 
                  AND p2.STR_PlaceTypeID = 5
                  AND p2.STR_PlaceActive = 1
                  AND p2.STR_NoWeb = 0
                  ORDER BY p1.STR_PlaceAIID, p1.STR_PlaceTypeID, p1.STR_PlaceTitle";
        }

        public static string SQL_CMS_onGPpages(string pgTyp, Int32 intIDs, Int32 plcIDs)
        {
            string q = @"Select XCM.CMSWID
                , XCM.CMSW_Title
                , XCM.CMSW_Order
                , CWC.CMSID
                , CWC.CMS_Title
                , CWC.CMS_Content
                , isnull(CWC.CMS_Description,'none') as CMS_Description
                From STR_WebHierarchyXCMS XCM
                LEFT JOIN CMS_WebsiteContent CWC ON CWC.CMSID = XCM.CMSW_RelatedCmsID
                AND CWC.CMS_Active = 1";
            if (pgTyp == "WInt")
            {
                q = q + @" Where (XCM.CMSW_masterContentID = " + intIDs + @")";
            }
            if (pgTyp == "PlcH")
            {
                q = q + @" Where (CMSW_WebHierarchyId = " + plcIDs + @")";
            }
            q = q + @" AND XCM.CMSW_Active = 1
                ORDER BY XCM.CMSW_Order ASC";
            return q;
        }

        public static string SQL_EDDestinos()
        {
            return @"with CouCty (CtyID, CtyNA, ConID, ConNA, Rank)
                As 
                (SELECT  p1.STR_PlaceID as CtyID, p1.STR_PlaceTitle as CtyNA,p2.STR_PlaceID as ConID, p2.STR_PlaceTitle as ConNA,p1.STR_PlaceAIID as Rank
                         FROM  STR_Places_Hierarchy p1
                         INNER JOIN STR_Places_Hierarchy p2 ON (p2.STR_PlaceID = p1.STR_Place1ParentID OR p2.STR_PlaceID = p1.STR_Place2ParentID)
                         WHERE (p1.STR_PlaceActive = 1) AND
                         (p1.STR_UserID = 243) AND
                         (p1.STR_PlaceTypeID = 1 OR p1.STR_PlaceTypeID = 25) AND 
                         (p1.STR_NoWeb = 0) AND
                         (p1.STR_ProdKindID = 0) AND
                         (p2.STR_PlaceActive = 1) AND 
                         (p2.STR_UserID = 243) AND 
                         (p2.STR_PlaceTypeID = 5) AND 
                         (p2.STR_NoWeb = 0) AND 
                         (p2.STR_ProdKindID = 0)
                )
                select ConNA as plcNA, ConID as plcID
                from CouCty
                group by ConID,ConNA
                order by ConNA";
        }

        public static string SQL_CitiesNames(string PlaceIDs)
        {
            return @"SELECT P1.STR_PlaceID as ID, P1.STR_PlaceTitle as Name, P2.STR_PlaceID as ContryID, P2.STR_PlaceTitle as CountryName
               FROM STR_Places_Hierarchy P1
               INNER Join STR_Places_Hierarchy P2 ON (P2.STR_PlaceID = P1.STR_Place1ParentID OR P2.STR_PlaceID = P1.STR_Place2ParentID)
               WHERE P1.STR_PlaceID IN (" + PlaceIDs + @") AND P1.STR_PlaceTypeID in (1,25)
                     AND P1.STR_UserID = 243 And P1.STR_PlaceActive = 1 And P1.Str_NoWeb = 0
                     AND P2.STR_UserID = 243 AND P2.STR_PlaceActive = 1 AND P2.Str_NoWeb= 0 AND P2.STR_PlaceTypeID = 5 and p2.Str_ProdKindId= 0";
        }

        public static string SQL_FeaturedItinByPlaceID(string plcid)
        {
            return @"Select PRI.PDLID, PRI.PDL_Title
                ,PRI.PDL_Content, PRI.PDL_SequenceNo, PRI.PDL_Places, PRI.PDL_Duration, ppw.SPPW_Weight, PRO.SPD_Description, pro.SPD_InternalComments
                ,cast(isnull(SPR.STP_Save,9999) as money) STP_save, Pic3.IMG_Path_URL, isnull(Pic3.IMG_500Path_URL, 'none') as IMG_500Path_URL, Feeds.NoOfFeed, 0 as TotalPacks
                FROM PRD_PlaceXProductItem PXP
                INNER JOIN PRD_ProductItem PRI ON PRI.PDLID = PXP.CXZ_ProductItem
                AND PRI.PDL_Active = 1 AND PRI.PDL_NoWeb = 0 and PDL_Title NOT LIKE 'Zpend%'
                INNER Join PRD_Product PRO ON PRO.SPDID = PRI.PDL_ProductID AND PRO.SPD_Active = 1 AND PRO.SPD_ProductTypeSysCode = 34 AND PRO.SPD_InternalComments LIKE '%" + InternalComments + @"%' AND PRO.SPD_StarratingSysCode <> 541
                left Join STR_SitePromotion SPR ON SPR.STP_ProdItemID=PRI.PDLID AND SPR.STP_Active = 1 AND SPR.STP_StartDate <= CONVERT(VARCHAR(10), GETDATE(), 101) AND SPR.STP_EndDate >= CONVERT(VARCHAR(10), GETDATE(), 101) AND SPR.STP_UserID = " + SiteUserId +
                @"Left Join STR_Places_Hierarchy PHI On PHI.STR_PlaceID = " + plcid + @" And PHI.STR_PlaceActive = 1 And PHI.STR_UserID = " + SiteUserId + @" And PHI.STR_NoWeb = 0 And PHI.Str_ProdkindId=0
                left join STR_PlacesXPackageWeight PPW ON PPW.SPPW_parentPlace = PHI.STRID AND PPW.SPPW_PackageID = PRI.PDLID AND PPW.SPPW_Active = 1 AND PPW.SPPW_MasterContentID = 0
                left join PRD_ProductXImages Pic2 ON Pic2.PXI_ProductID = PRI.PDL_ProductID AND Pic2.PXI_Sequence = 0 AND Pic2.PXI_Active = 1
                left join APP_Images Pic3 ON Pic3.IMGID = Pic2.PXI_ImageID AND Pic3.IMG_Active = 1
                outer apply (SELECT COUNT (CF.PCCID) as NoOfFeed FROM PRD_CustomerComment CF WHERE CF.PCC_PDLID = PRI.PDLID  AND CF.PCC_Comment is not null AND LEN(cast(CF.PCC_Comment as varchar(8000))) > 15 AND CF.PCC_Active = 1 AND CF.PCC_Block = 0) as Feeds
                WHERE
                PXP.CXZ_Active = 1
                and pxp.CXZ_ChildPlaceId= " + plcid + @"
                and PPW.SPPW_Weight<30
                ORDER BY ppw.SPPW_Weight ASC";
        }

        public static string SQL_NoOfPacksFeaturedItinByPlaceID(string plcid)
        {
            return @"SELECT COUNT(PDLID) as NoOfPacks
                    FROM PRD_Placexproductitem pxp2
                    INNER JOIN PRD_productItem pit2
                    ON pit2.pdlid = pxp2.cxz_productitem
                    AND pit2.pdl_active=1
                    AND pit2.PDL_NoWeb = 0
                    AND pit2.PDL_Title NOT LIKE 'Zpend%'
                    INNER JOIN PRD_Product pro2
                    ON pro2.spdid = pit2.pdl_productid
                    AND pro2.spd_active=1
                    AND pro2.spd_producttypesyscode = 34
                    AND PRO2.SPD_InternalComments LIKE '%" + InternalComments + @"%'
                    AND PRO2.SPD_StarratingSysCode <> 541
                    WHERE pxp2.CXZ_Active = 1 and pxp2.cxz_childplaceid = " + plcid;
        }
        // Created new query identically with the one above put with less columns 
        // Used in GP3 Area Page
        public static string SQL_NoOfPacksFeaturedItinByPlaceId(int placeId)
        {
            return @"SELECT COUNT(PDLID) as NoOfPacks
                    FROM PRD_Placexproductitem pxp2
                    INNER JOIN PRD_productItem pit2
                    ON pit2.pdlid = pxp2.cxz_productitem
                    AND pit2.pdl_active = 1
                    AND pit2.PDL_NoWeb = 0
                    AND pit2.PDL_Title NOT LIKE 'Zpend%'
                    INNER JOIN PRD_Product pro2
                    ON pro2.spdid = pit2.pdl_productid
                    AND pro2.spd_active = 1
                    AND pro2.spd_producttypesyscode = 34
                    AND PRO2.SPD_InternalComments LIKE '%" + InternalComments + @"%'
                    AND PRO2.SPD_StarratingSysCode<> 541
                    WHERE pxp2.CXZ_Active = 1 and pxp2.cxz_childplaceid = " + placeId;
        }

        public static string SQL_FeaturedItinByPlaceIDSEO(string plcid, string userXMLIDs)
        {

            return @"Declare @userXMLIDs XML;Set @userXMLIDs = '" + userXMLIDs + "';" +
                @";with packs(PDLID, PDL_Places, PDL_Title, PDL_Content, PDL_SequenceNo, PDL_Duration, PDL_ProductID, SPD_Description, SPD_InternalComments) as
                (Select pxp.CXZ_ProductItem, PRI.PDL_Places, PDL_Title, PDL_Content, PDL_SequenceNo, PDL_Duration, PDL_ProductID, SPD_Description, SPD_InternalComments 
                FROM PRD_PlaceXProductItem PXP 
                INNER JOIN PRD_ProductItem PRI ON PRI.PDLID = PXP.CXZ_ProductItem AND PRI.PDL_Active = 1 AND PRI.PDL_NoWeb = 0 and PDL_Title NOT LIKE 'Zpend%'
                INNER Join PRD_Product PRO ON PRO.SPDID = PRI.PDL_ProductID AND PRO.SPD_Active = 1 AND PRO.SPD_ProductTypeSysCode = 34 AND 
                (
				(case when 243 in (SELECT
											ParamValues.ID.value('.','VARCHAR(20)')
											FROM @userXMLIDs.nodes('/UserId/id') as ParamValues(ID) 
										) 
										then PRO.SPD_InternalComments else '1' end Like '%:.ED%') 
				or 
				(case when 182 in (SELECT
											ParamValues.ID.value('.','VARCHAR(20)')
											FROM @userXMLIDs.nodes('/UserId/id') as ParamValues(ID) 
										) 
										then PRO.SPD_InternalComments else '1' end Like '%:LD%') 
				or 
				(case when 243 in (SELECT
											ParamValues.ID.value('.','VARCHAR(20)')
											FROM @userXMLIDs.nodes('/UserId/id') as ParamValues(ID) 
										)
										then PRO.SPD_InternalComments else '1' end Like '%:.ED%') 
				)
				 AND PRO.SPD_StarratingSysCode <> 541  
                WHERE PXP.CXZ_Active = 1 and pxp.CXZ_ChildPlaceId= " + plcid + @")
                select p.PDLID, u.NoOfCountries, p.PDL_Title, p.PDL_Content, p.PDL_SequenceNo, case when row_number() over (Order By ppw.SPPW_Weight)=1 then Places.PDL_Places else '' end as PDL_Places, p.PDL_Duration, p.SPD_Description, p.SPD_InternalComments, cast(isnull(SPR.STP_Save,9999) as money) STP_save
                      ,Feeds.NoOfFeed, NoOfPacks.Value as TotalPacks
					  , Pic3.IMG_Path_URL, isnull(Pic3.IMG_500Path_URL,'none') as IMG_500Path_URL
                from packs p
                left Join STR_SitePromotion SPR ON SPR.STP_ProdItemID=p.PDLID AND SPR.STP_Active = 1 AND SPR.STP_StartDate <= CONVERT(VARCHAR(10), GETDATE(), 101) AND SPR.STP_EndDate >= CONVERT(VARCHAR(10), GETDATE(), 101) AND SPR.STP_UserID in (SELECT
											ParamValues.ID.value('.','VARCHAR(20)')
											FROM @userXMLIDs.nodes('/UserId/id') as ParamValues(ID) 
										)  
                Left Join STR_Places_Hierarchy PHI On PHI.STR_PlaceID = " + plcid + @" And PHI.STR_PlaceActive = 1 And PHI.STR_UserID in (SELECT
											ParamValues.ID.value('.','VARCHAR(20)')
											FROM @userXMLIDs.nodes('/UserId/id') as ParamValues(ID) 
										) And PHI.STR_NoWeb = 0 And PHI.Str_ProdkindId=0 
                left join STR_PlacesXPackageWeight PPW ON PPW.SPPW_parentPlace = PHI.STRID AND PPW.SPPW_PackageID = p.PDLID AND PPW.SPPW_Active = 1 AND PPW.SPPW_MasterContentID = 0 
                outer apply (SELECT COUNT (CF.PCCID) as NoOfFeed FROM PRD_CustomerComment CF WHERE CF.PCC_PDLID = p.PDLID  AND CF.PCC_Comment is not null AND LEN(cast(CF.PCC_Comment as varchar(8000))) > 15 AND CF.PCC_Active = 1 AND CF.PCC_Block = 0) as Feeds
                outer apply (select count(PDLID) as value from packs) as NoOfPacks   
                outer apply (select (select packs.PDL_Places+' ' from packs for xml path('')) as PDL_Places) as Places  
                left join PRD_ProductXImages Pic2 ON Pic2.PXI_ProductID = p.PDL_ProductID AND Pic2.PXI_Sequence = 0 AND Pic2.PXI_Active = 1  
                left join APP_Images Pic3 ON Pic3.IMGID = Pic2.PXI_ImageID AND Pic3.IMG_Active = 1 
				cross apply 
					(select count(DISTINCT CXZ_ChildPlaceID) As NoOfCountries
                FROM prd_placexproductitem pxp1
                INNER JOIN STR_Places_Hierarchy ph ON ph.str_placeid = pxp1.cxz_childplaceid AND ph.str_prodkindid = 0 And ph.str_placeactive = 1 And ph.str_placetypeid <> 3 AND ph.STR_NoWeb = 0 AND ph.str_UserId in (SELECT
											ParamValues.ID.value('.','VARCHAR(20)')
											FROM @userXMLIDs.nodes('/UserId/id') as ParamValues(ID) 
										) 
                WHERE pxp1.cxz_active = 1 AND pxp1.cxz_productitem = p.PDLID and STR_PlaceTypeID = 5) u
                where isNull(PPW.SPPW_Weight, 999)<999
                ORDER BY ppw.SPPW_Weight ASC";
        }

        public static string SQL_CitiesOnCountry(string plcid)
        {
            return @"SELECT STR_PlaceID
                ,STR_PlaceTitle
                ,STR_PlaceTypeID
                ,isnull(STR_PlaceAIID,'2000') as STR_PlaceAIID
                ,STR_Place1ParentID
                ,isnull(STR_PlaceShortInfo,'No Info') as STR_PlaceShortInfo
                ,isnull(STIN.STI_SysCodeID,0) as STI_SysCodeID
                 FROM STR_Places_Hierarchy
                 LEFT Join STR_SiteInterest STIN ON STIN.STI_SiteHierarchyID = STRID
                 AND (STIN.STI_Active = 1)
                 AND (STIN.STI_SysCodeID is NOT null)
                 WHERE(STR_Place2ParentID =  " + plcid + @"   Or STR_Place1ParentID =  " + plcid + @"  )
                 AND (STR_PlaceActive = 1)
                 AND (STR_UserID =  243 )
                 AND (STR_PlaceTypeID = 25 OR STR_PlaceTypeID = 1 OR STR_PlaceTypeID = 6 OR STR_PlaceTypeID = 2)
                 AND (STR_NoWeb = 0)
                 AND (STR_PlaceTitle not like 'zz%') AND (STR_PlaceTitle not like 'zPend%')
                 ORDER BY STR_PlaceAIID ASC";
        }
        public static string SQL_CitiesOnCountrySEO(string plcid)
        {
            return @"SELECT STR_PlaceID
                , STR_PlaceTitle
                , STR_PlaceTypeID
                , isnull(STR_PlaceAIID, '2000') as STR_PlaceAIID
                ,STR_Place1ParentID
                ,isnull(STR_PlaceShortInfo, 'No Info') as STR_PlaceShortInfo
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
                WHERE(STR_Place2ParentID = " + plcid + @"   Or STR_Place1ParentID = " + plcid + @")
                AND(STR_PlaceActive = 1)
                AND(STR_UserID = 243)
                AND(STR_PlaceTypeID = 25 OR STR_PlaceTypeID = 1)
                AND(STR_NoWeb = 0)
                AND(STR_PlaceTitle not like 'zz%') AND(STR_PlaceTitle not like 'zPend%')
                AND(STR_PlaceAIID < 1000)
                ORDER BY STR_PlaceAIID ASC";
        }
        public static string SQL_GetHiglightsByPlaceID(string plcID, bool StrIDValue = false)
        {
            string strquery = @"SELECT * 
                  FROM STR_PlaceDescription 
                  WHERE STX_UserID =  243
                  AND (STX_Active = 1) 
                  AND ";
            if (StrIDValue)
            {
                strquery = strquery + "(STX_STRID =  " + plcID + @")
                    AND STX_MasterContentID = 0 
                    AND STX_Title is not null 
                    AND STX_URL is not null";
            }
            else
            {
                strquery = strquery + "(STX_PlaceID =  " + plcID + @")
                    AND STX_MasterContentID = 0 
                    AND STX_Title is not null 
                    AND STX_URL is not null";
            }
            return strquery;
        }

        //public static string SQL_GetHiglightsInterestByPlaceID(string strid)
        //{
        //    return @"SELECT * 
        //          FROM STR_PlaceDescription 
        //          WHERE STX_UserID =  243
        //          AND (STX_Active = 1) 
        //          AND (STX_STRID =  " + strid + @") 
        //          AND STX_MasterContentID = 0 
        //          AND STX_Title is not null 
        //          AND STX_URL is not null order by STX_Priority";
        //}

        public static string SQL_FeedCommentsByPlaceID(string placeID)
        {
            return @"SELECT top 3 CF.PCC_Comment,CF.PCC_CustomerName,CF.PCC_Itinerary,CF.PCCID,CF.PCC_PDLID,CFH.dep_date, CFP.PDL_Title,PLCO.STR_PlaceTitle as CountryName,PLCO.STR_PlaceID as CountryID
         FROM PRD_CustomerComment CF 
         INNER JOIN RSV_Heading CFH with (nolock) ON  CF.PCC_BookingID = CFH.ID
         INNER JOIN PRD_ProductItem CFP ON  CFP.PDLID = CF.PCC_PDLID and CFP.pdl_active=1 and CFP.pdl_noweb=0 
         INNER JOIN PRD_PlaceXProductItem CFxplace ON CFxplace.CXZ_ProductItem = CFP.PDLID
         INNER JOIN PRD_Product PRO ON PRO.SPDID = CFP.PDL_ProductID 
         LEFT JOIN STR_Places_Hierarchy PLCO ON PLCO.STR_PlaceID = PRO.SPD_CountryPlaceID 
         AND (PLCO.STR_PlaceActive = 1) 
         AND PLCO.STR_UserID = 243
         AND (PLCO.STR_NoWeb = 0)
         AND (PLCO.STR_PlaceTypeID = 5)
         WHERE  CF.PCC_PDLID <> 0 
         AND CFH.dept in (868, 1615)
         AND CF.PCC_Active = 1 AND CF.PCC_Block = 0
         AND CFH.dep_date > convert(Varchar(10),Getdate()-720,101)
         AND CFxplace.CXZ_ChildPlaceID =" + placeID + @"
         AND CFxplace.CXZ_Active = 1
		 AND CF.PCC_Comment is not null AND CF.PCC_Comment not like '%----- No customer comment -----%' AND CF.PCC_Comment not like ''
        ORDER BY CF.PCC_Ranking ASC, CFH.dep_date DESC";
        }

        public static string SQL_PlaceCMSByplaceID(string placeID)
        {
            return @"SELECT Xcms.CMSW_Title, Xcms.CMSW_Order, Xcms.CMSW_RelatedCmsID, isnull(CSM.CMS_Description,'none') as CMS_Description
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

        public static string SQL_CustomerFeedbacks_For_CountriesC(string placeID)
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

        public static string SQL_PlacesFromSTR(string idsStr)
        {
            return @"SELECT p2.STR_PlaceTitle as CouNA, p2.STR_PlaceID as CouID
                FROM  STR_Places_Hierarchy p1
                INNER JOIN STR_Places_Hierarchy p2 ON p2.STR_PlaceID = p1.STR_Place1ParentID OR p2.STR_PlaceID = p1.STR_Place2ParentID
                WHERE p1.STR_UserID = 243
                AND p1.STR_PlaceActive = 1
                AND (p1.STR_PlaceTypeID = 1 OR p1.STR_PlaceTypeID = 25)
                AND p1.STR_NoWeb = 0
                AND p1.STR_ProdKindID = 0
                AND p1.STR_PlaceID IN (" + idsStr + @")
                AND p2.STR_UserID = 243
                AND p2.STR_PlaceTypeID = 5
                AND p2.STR_PlaceActive = 1
                AND p2.STR_NoWeb = 0
                ORDER BY p1.STR_PlaceTitle";
        }

        public static string SQL_PageTemplate_MasterInterestContent(string SysCodeId, string Title)
        {
            if (Title == "")
            {
                return @"Select isnull(SMC_Template,'none') as SMC_Template 
                From STR_MasterInterestContent
                Where SMC_UserID = 243
                AND SMC_SysCodeID in (" + SysCodeId + @") AND SMC_Active = 1";
            }
            else
            {
                return @"Select isnull(SMC_Template,'none') as SMC_Template 
                From STR_MasterInterestContent
                Where SMC_UserID = 243
                AND SMC_SysCodeID in (" + SysCodeId + @") AND SMC_Active = 1
                AND Charindex('" + Title + @"',smc_title) > 0";
            }
        }

        public static string SQL_Interest_Info(string objNA)
        {
            return @"Select *  
                From STR_MasterInterestContent 
                LEFT JOIN  MKT_WebSEO ON SEO_SMCID = SMCID 
                AND SEO_Active = 1 
                Where SMC_UserID = 243 
                AND SMC_Active = 1 
                AND SMC_SysCodeID = 607 
                AND Charindex ('" + objNA + @"', SMC_Title) > 0";
        }

        public static string SQL_CountriesWCommentsByDeptID()
        {
            return @"Select DISTINCT PLCO.STR_PlaceTitle as CountryName
                 ,PLCO.STR_PlaceID as CountryID
                 FROM PRD_CustomerComment CF
                 INNER JOIN RSV_Heading CFH with(nolock) ON CF.PCC_BookingID = CFH.ID
                 INNER JOIN PRD_ProductItem CFP ON CFP.PDLID = CF.PCC_PDLID
                 INNER JOIN PRD_Product PRO ON PRO.SPDID = CFP.PDL_ProductID
                 LEFT JOIN STR_Places_Hierarchy PLCO ON PLCO.STR_PlaceID = PRO.SPD_CountryPlaceID
                 AND(PLCO.STR_PlaceActive = 1)
                 AND(PLCO.STR_UserID = 243)
                 AND(PLCO.STR_NoWeb = 0)
                 AND(PLCO.STR_ProdKindID = 0)
                 AND(PLCO.STR_PlaceTypeID = 5)
                 AND(PLCO.STR_PlaceTitle is not null)
                 WHERE CF.PCC_PDLID <> 0
                 AND CFH.dept in (868, 1615)
                 AND CF.PCC_Active = 1 AND CF.PCC_Block = 0
                 AND CFH.dep_date > convert(Varchar(10), Getdate() - 1095, 101)
                 AND CF.PCC_Comment is not null
                 AND CF.PCC_Itinerary is not null
                 AND LEN(cast(CF.PCC_Comment as varchar(8000))) > 15";
        }

        public static string SQL_PackOnBstVacPriorityList(Int32 intIDs)
        {
            return @"SELECT PXW.SPPW_Weight
                 , PRI.PDLID
                 , PRI.PDL_Title
                 , PRI.PDL_Duration
                 , isnull(STPR.STP_Save,9999) as STP_Save
                 , PRI.PDL_SequenceNo, PXW.SPPW_Weight, PRI.PDL_Content
                 , PRO.SPD_Description,IMG.IMG_Path_URL
                 , PRO.SPD_InternalComments
                 ,(SELECT COUNT (CF.PCCID) as NoOfFeed
                  FROM PRD_CustomerComment CF 
                  WHERE CF.PCC_PDLID = PRI.PDLID 
                  AND CF.PCC_Comment is not null AND LEN(cast(CF.PCC_Comment as varchar(8000))) > 15 
                  AND CF.PCC_Active = 1 AND CF.PCC_Block = 0) as NoOfFeed 
                 ,PDL_Places
                 ,isnull((select top 1 [STR_PlaceTitle] from [dbo].[STR_Places_Hierarchy] ph where ph.[STR_PlaceID] = pro.[SPD_CountryPlaceID] and ph.[STR_NoWeb]=0 and ph.[STR_PlaceActive]=1),'none') as CountryName
                  FROM STR_PlacesXPackageWeight PXW
                  INNER JOIN PRD_ProductItem PRI ON PRI.PDLID = PXW.SPPW_PackageID 
                  AND PRI.PDL_Active = 1 and pri.PDL_NoWeb = 0 
                  INNER JOIN PRD_Product PRO ON PRO.SPDID = PRI.PDL_ProductID
                  AND PRO.SPD_Active = 1
                  LEFT JOIN STR_SitePromotion STPR ON STPR.STP_ProdItemID = PXW.SPPW_PackageID 
                  AND STPR.STP_UserID = 243
                  AND STPR.STP_Active = 1 
                  AND STPR.STP_StartDate <= Convert(VARCHAR(10), GETDATE(), 101) 
                  AND STPR.STP_EndDate >= CONVERT(VARCHAR(10), GETDATE(), 101)
                  Left JOIN PRD_ProductXImages Pic ON Pic.PXI_ProductID = PRI.PDL_ProductID and Pic.PXI_Active = 1 AND Pic.PXI_Sequence = 0
                  Left JOIN APP_Images IMG ON IMG.IMGID = Pic.PXI_ImageID 
                  WHERE PXW.SPPW_Active = 1 AND IMG.IMG_Active = 1 
                  AND PRI.PDL_Title NOT LIKE 'Zpend%'
                  AND PXW.SPPW_MasterContentID = " + intIDs + @" 
                  ORDER BY PXW.SPPW_Weight";
        }

        public static string SQL_ManagerDisplay(Int32 intIDs)
        {
            return @"Select SDP_DisplayTitle
                  , isnull(SDP_GroupTitleURL,'none') as SDP_GroupTitleURL
                  , isnull(SDP_Description,'none') as SDP_Description
                  , isnull(SDP_Order,0) as SDP_Order
                  , isnull(SDP_PlaceHierarchyID,0) as SDP_PlaceHierarchyID
                  , isnull(SDP_GroupProdKindID,0) as SDP_GroupProdKindID
                  , isnull(SDP_DisplayProdKindID,0) as SDP_DisplayProdKindID
                  , isnull(SDP_TitleBGColor,'none') as SDP_TitleBGColor
                  From STR_DisplayPosition 
                  Where SDP_UserID = 243 AND SDP_MasterContentID =  " + intIDs + @"   
                  AND SDP_Active = 1
                  order by  SDP_DisplayProdKindID, SDP_Order ASC";
        }

        public static string SQL_BoxesContent(Int32 intIDs)
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
                  AND PLD.STX_Active = 1 AND STX_MasterContentID = " + intIDs + @" 
                  ORDER BY PLD.STX_ProdKindID, PLD.STX_Priority";
        }

        public static string SQL_CountriesRelated_By_ItineraryID(string packId)
        {
            return @"SELECT DISTINCT pxp.CXZID,pxp.cxz_productitem,pit.PDL_title,pxp.cxz_ChildPlaceId,ph.str_placetitle
                     , ph.str_placetypeid  
                     FROM prd_placexproductitem pxp  
                     INNER JOIN str_places_hierarchy ph ON ph.str_placeid=pxp.cxz_childplaceid AND ph.str_userid=" + SiteUserId + @"  AND ph.str_prodkindid=0 
                     INNER JOIN PRD_ProductItem pit ON pit.pdlid=pxp.cxz_productitem AND pit.pdl_active=1 AND pit.PDL_NoWeb = 0 
                     WHERE(pxp.cxz_active = 1 And ph.str_placeactive = 1)
                     AND pxp.cxz_productitem =" + packId + @" and ph.str_placetypeid in (5)
                     ORDER BY str_placetitle";
        }

        public static string SQL_CustomerFeedbacks_For_Countries(string Ids)
        {
            return @"Select PLCO.STR_PlaceTitle as Name, PLCO.STR_PlaceID as Id, CF.PCCID as FeedBackId, isnull(cf.[PCC_OverallScore],-999) as OverallScore 
               From STR_Places_Hierarchy PLCO 
               inner join PRD_PlaceXProductItem pXp on pXp.CXZ_ChildPlaceID = PLCO.STR_PlaceID and pXp.CXZ_Active = 1 
               inner join PRD_ProductItem pri ON pXp.CXZ_ProductItem = pri.PDLID and pri.PDL_NoWeb = 0 and pri.PDL_Active = 1 
               inner join PRD_CustomerComment CF on pri.PDLID = CF.PCC_PDLID 
               Where PLCO.STR_PlaceID in (" + Ids + @") and PLCO.STR_UserID = " + SiteUserId +
                     @"and PLCO.STR_NoWeb = 0 and PLCO.STR_PlaceActive = 1 and PLCO.STR_PlaceTypeID = 5 and PLCO.STR_ProdKindID = 0 
                     and datalength(CF.PCC_Comment) > 15 and CF.PCC_Active = 1 and CF.PCC_Block = 0 
               Order By PLCO.STR_PlaceID, CF.PCC_Ranking ASC, PCCID desc";
        }

        public static string SQL_PackOnPlace(string PlaceID)
        {
            return @"SELECT DISTINCT PRIT.PDLID,PRIT.PDL_Title,PRIT.PDL_SequenceNo,cast(isnull(STPR.STP_Save,9999) as money) as STP_Save,isnull(STPR.STP_NumOfNights,0) as STP_NumOfNights,cast(PRIT.PDL_Content as Varchar(3000)) as PDL_Content, cast(PROD.SPD_Description as Varchar(3000)) as SPD_Description
         ,isnull((select top 1 [STR_PlaceTitle] from [dbo].[STR_Places_Hierarchy] ph where ph.[STR_PlaceID] = PROD.[SPD_CountryPlaceID] and ph.[STR_NoWeb]=0 and ph.[STR_PlaceActive]=1),'none') as CountryName
         FROM PRD_PlaceXProductItem PLxPR
         INNER JOIN PRD_ProductItem PRIT ON PRIT.PDLID = PLxPR.CXZ_ProductItem 
         AND PRIT.PDL_Title NOT LIKE 'ZZ%' 
         AND PRIT.PDL_Title NOT LIKE 'Zdupe-%' 
         INNER Join PRD_Product PROD ON PROD.SPDID = PRIT.PDL_ProductID 
         INNER Join PRD_Place PLCE ON PLCE.PLCID = PLxPR.CXZ_ChildPlaceID 
         LEFT JOIN STR_SitePromotion STPR ON STPR.STP_ProdItemID = PRIT.PDLID 
         AND STPR.STP_UserID = 243 
         AND STPR.STP_Active = 1 
         AND STPR.STP_StartDate <= Convert(VARCHAR(10), GETDATE(), 101)
         AND STPR.STP_EndDate >= CONVERT(VARCHAR(10), GETDATE(), 101) 
         LEFT JOIN STR_Places_Hierarchy HRCH ON (HRCH.STR_PlaceID = PROd.SPD_StatePlaceID) AND (HRCH.STR_PlaceActive = 1) AND (HRCH.STR_UserID = STPR.STP_UserID) AND (HRCH.STR_NoWeb = 0) 
         LEFT JOIN STR_Places_Hierarchy CONT ON (CONT.STR_PlaceID = PROd.SPD_CountryPlaceID) AND (CONT.STR_PlaceActive = 1) AND (CONT.STR_UserID = STPR.STP_UserID) AND (CONT.STR_NoWeb = 0) 
         WHERE(PROD.SPD_StarRatingSysCode = 895 Or PROD.SPD_StarRatingSysCode = 1266 Or PROD.SPD_StarRatingSysCode = 1339 Or PROD.SPD_StarRatingSysCode = 495)
         AND (PROD.SPD_ProductTypeSysCode = 34) 
         AND (PROD.SPD_Active = 1) 
         AND (PLxPR.CXZ_Active = 1) 
         AND (PROD.SPD_Title NOT LIKE '-%') 
         AND (PROD.SPD_Title NOT LIKE 'ZZ%') 
         AND (PROD.SPD_Title NOT LIKE 'Zpend%') 
         AND (PLxPR.CXZ_ChildPlaceID IN (" + PlaceID + @"))
         AND (PRIT.PDL_Active = 1) 
         AND (PRIT.PDL_NoWeb = 0) 
         AND (PROD.SPD_InternalComments is not Null)        
         ORDER BY PRIT.PDL_SequenceNo DESC , PRIT.PDL_Title";
        }

        public static string SQL_HotelsOnPlace(string PlaceID)
        {
            return @";with PLDIds(PDLID, GIPH_TNTournetName, GIPH_GIATAID, SPD_StarRatingSysCode, PDL_ProductID, PDL_SequenceNo, N, N1) as 
                 (select pxp.CXZ_ProductItem, gh.GIPH_TNTournetName, gh.GIPH_GIATAID, pro.SPD_StarRatingSysCode, pIt.PDL_ProductID, pIt.PDL_SequenceNo, row_number() over(partition by pxp.CXZ_ChildPlaceID, gh.GIPH_GIATAID order by pxp.CXZ_ProductItem), row_number() over(partition by pxp.CXZ_ChildPlaceID, pIt.PDLID order by pxp.CXZ_ProductItem) from PRD_PlaceXProductItem pxp  
                  inner join GIATA_GiataXProductItem gpi on gpi.GLT_PDLID = pxp.CXZ_ProductItem and gpi.GLT_Active=1 
                  inner join GIATA_Hotels gh on gpi.GLT_GIPHID = gh.GIPHID and gh.GIPH_Active=1 and  gh.GIPH_TNNoWeb = 0  													
                  inner join PRD_ProductItem pIt ON pIt.PDLID = gpi.GLT_PDLID and pIt.PDL_Active = 1 and pIt.PDL_NoWeb = 0 and pIt.PDL_Title NOT Like '-%' AND pIt.PDL_Title NOT Like 'Zblock%'  
                  inner join Prd_Product PRO ON pro.SPDID = pIt.PDL_ProductID AND PRO.SPD_Active = 1 AND PRO.spd_producttypesyscode=3  
                  where pxp.CXZ_ChildPlaceID = " + PlaceID + @" and pxp.cxz_active=1)
                select distinct p.PDL_ProductID, p.SPD_StarRatingSysCode, SYS_Codes.SCD_CodeTitle,SYS_Codes.SCD_Description, p.PDL_SequenceNo
                from PLDIds p
                INNER JOIN SYS_Codes ON SYS_Codes.SCDID = p.SPD_StarRatingSysCode
                where(p.n = 1 and GIPH_TNTournetName not like '%nights%' and GIPH_TNTournetName not like '% nts%') or(p.n1 = 1 and p.GIPH_GIATAID = 0 and(GIPH_TNTournetName like '%nights%' or GIPH_TNTournetName like '% nts%'))
               Order by SYS_Codes.SCD_Description";
        }

        public static string SQL_PageTemplate_PlacesH_MasterInterestContent(string PlaceTitle, Int32 SysCodeId)
        {
            return @"SELECT STRID, STR_PlaceID, SMCID, isnull(SMC_Template, 'none') as SMC_Template
                FROM STR_Places_Hierarchy
                    LEFT JOIN STR_MasterInterestContent ON SMC_PlaceHierarchyID = STRID
                And SMC_UserID = 243
                And SMC_Active = 1
                And SMC_SysCodeID = " + SysCodeId + @" WHERE STR_PlaceActive = 1 
                And STR_UserID = 243
                And STR_NoWeb = 0 
                And charindex(STR_PlaceTitle, '" + PlaceTitle + @"') > 0";
        }

        public static string SQL_MasterInterestInfo(Int32 plcID, Int32 intID)
        {
            return @"SELECT COD.SCD_CodeTitle
                , MCT.SMC_Title
                , MCT.SMCID
                , MCT.SMC_Content
                , PH.STRID
                , PH.STR_PlaceTitle
                , PH.STR_PlaceID
                , PH.STR_PlaceAIID
                , PH.STR_PlaceShortInfo
                 FROM STR_MasterInterestContent MCT
                 LEFT JOIN SYS_Codes COD on COD.SCDID = MCT.SMC_SysCodeID
                 AND COD.SCD_Active = 1
                 INNER JOIN STR_Places_Hierarchy PH ON PH.STRID = MCT.SMC_PlaceHierarchyID
                 AND PH.STR_PlaceActive = 1
                 AND PH.STR_NoWeb = 0
                 AND PH.STR_UserID =  243
                 AND PH.STR_PlaceID =  " + plcID + @"
                 WHERE MCT.SMC_UserID =  243
                 AND MCT.SMC_Active = 1 
                 AND MCT.SMC_SysCodeID =  " + intID + @"
                 ORDER BY PH.STR_PlaceAIID";
        }

        public static string SQL_PlacesInterestByMasterInterestID(string intIDs)
        {
            return @"SELECT PW.SPW_Weight, PW.SPW_Deals, PH.STR_PlaceTitle, PH.STR_PlaceTypeID, PH.STR_PlaceShortInfo, PH.STR_PlaceID
                 FROM STR_PlacesWeight PW
                 INNER JOIN STR_Places_Hierarchy PH ON PH.STRID = PW.SPW_ChildPlace
                 AND PH.STR_PlaceActive = 1
                 AND PH.STR_NoWeb = 0
                 AND PH.STR_UserID = 243
                 WHERE PW.SPW_MasterContentID = " + intIDs + @"
                 ORDER BY PW.SPW_Weight";
        }

        public static string SQL_PageTemplate_Places_Hierarchy(string PlaceTypeID, string PlaceTitle)
        {
            return @"Select isnull(STR_PageTemplate, 'none') as CMS_Content From STR_Places_Hierarchy
                Where Str_UserId = " + SiteUserId + @" And Str_NoWeb = 0 And STR_PlaceActive = 1 
                And STR_PlaceTypeID = " + PlaceTypeID + @" And Charindex('"  + PlaceTitle.Trim() + @"', Str_PlaceTitle) > 0";

        }

        public static string SQL_Place_Info(string objId)
        {
            return @"SELECT SEO_PageTitle, SEO_MetaDescription, SEO_MetaKeyword, SEO_HeaderText
                         FROM STR_Places_Hierarchy 
                         LEFT JOIN  MKT_WebSEO ON SEO_STRID = STRID
                         AND SEO_Active = 1
                         WHERE STR_UserID = " + SiteUserId + @"
                         AND STR_PlaceActive = 1 
                         AND STR_NoWeb = 0 
                         AND STR_PlaceID IN (" + objId + @")";
        }

        public static string SQL_GetCitiesAArea(string AreaID)
        {
            return @"select C.STR_PlaceID, C.STR_PlaceTitle, C.STR_PlaceTypeID, C.STR_PlaceShortInfo, STR_PlacesWeight.SPW_Weight, STR_PlacesWeight.SPW_Deals, C.STR_PlaceInfo, '' as PlaceImage 
                from STR_PlacesWeight inner join STR_Places_Hierarchy P on STR_PlacesWeight.SPW_ParentPlace = P.STRID 
                inner join STR_Places_Hierarchy C on STR_PlacesWeight.SPW_ChildPlace = C.STRID 
                where STR_PlacesWeight.SPW_Active = 1 And P.STR_PlaceActive = 1 And C.STR_PlaceActive = 1
                and C.STR_NoWeb = 0 and C.STR_ProdKindID = 0 and P.STR_UserID = 243 and P.STR_prodKindID = 0 and C.STR_UserID = 243
                and P.STR_PlaceID = " + AreaID + @"
                and STR_PlacesWeight.SPW_MasterContentID = 0
                order by STR_PlacesWeight.SPW_Weight";
        }

        public static string SQL_GetItinAArea(string CityIDs, Int32 AAreaOrACity)
        {
            string queryStr = @"SELECT DISTINCT PxP.CXZ_ProductItem
                    ,PxP.CXZ_ChildPlaceID,PHY.STR_PlaceTitle,PRI.PDL_Duration,PRI.PDL_SequenceNo,PRI.PDL_LeadPrice,PRI.PDLID
                    , PRI.PDL_Title,PRO.SPD_Description,PRO.SPD_StarratingSysCode,isnull(PRO.SPD_Features,0) as SPD_Features
                    ,isnull(PRI.PDL_Places,0) as PDL_Places,PRO.SPD_InternalComments,isnull(SPR.STP_ProdItemID,0) Promotion
                    ,cast(isnull(SPR.STP_Price,9999) as money) Prom_Price,cast(isnull(SPR.STP_Save,9999) as money) Price_WTax
                    ,PRO.SPD_InternalComments, cast (PRI.PDL_Content as varchar(3000))as PDL_Content, '' as Includes
                    ,(SELECT COUNT (CF.PCCID) as NoOfFeed
                                      FROM PRD_CustomerComment CF 
                                      INNER JOIN RSV_Heading CFH with (nolock) ON CF.PCC_BookingID = CFH.ID
                                      WHERE CF.PCC_PDLID = PRI.PDLID 
                                      AND CF.PCC_Comment is not null
                                      AND LEN(cast(CF.PCC_Comment as varchar(8000))) > 15
                                      AND CF.PCC_Active = 1 
                  AND CF.PCC_Block = 0) as NoOfFeed
                    , SPR.STP_NumOfNights
                FROM PRD_PlaceXProductItem PxP 
                INNER JOIN PRD_ProductItem PRI ON PRI.PDLID = PxP.CXZ_ProductItem 
                AND (PRI.PDL_Title NOT LIKE 'ZZ%') 
                AND (PRI.PDL_Title NOT LIKE 'Zdupe-%') 
                INNER JOIN PRD_Product PRO ON PRO.SPDID = PRI.PDL_ProductID 
                INNER JOIN PRD_Place PLC ON PLC.PLCID = PxP.CXZ_ChildPlaceID 
                LEFT JOIN STR_SitePromotion SPR ON SPR.STP_ProdItemID = PRI.PDLID 
                AND (SPR.STP_UserID = 243) 
                AND (SPR.STP_Active = 1) 
                AND (SPR.STP_StartDate <= getdate()) 
                AND (SPR.STP_EndDate >= getdate()) 
                LEFT JOIN STR_Places_Hierarchy PHY ON PHY.STR_PlaceID = PxP.CXZ_ChildPlaceID 
                AND (PHY.STR_PlaceActive = 1) 
                AND (PHY.STR_UserID = 243) 
                AND (PHY.STR_ProdKindID = 0) 
                WHERE (PRO.SPD_StarRatingSysCode = 895 
                OR PRO.SPD_StarRatingSysCode = 1266 
                OR PRO.SPD_StarRatingSysCode = 1339 
                OR PRO.SPD_StarRatingSysCode = 495) 
                AND (PRO.SPD_ProductTypeSysCode = 34) 
                AND (PRO.SPD_Active = 1) 
                AND (PxP.CXZ_Active = 1) 
                AND (PRO.SPD_Title NOT LIKE '-%') 
                AND (PRO.SPD_Title NOT LIKE 'ZZ%') 
                AND (PRO.SPD_Title NOT LIKE 'Zpend%') 
                AND (PxP.CXZ_ChildPlaceID IN (" + CityIDs + @")) 
                AND (PRI.PDL_Active = 1) 
                AND (PRI.PDL_NoWeb = 0) 
                AND (PRO.SPD_InternalComments is not Null)";

            if (AAreaOrACity == 1)
            {
                queryStr = queryStr + "ORDER BY PRI.PDL_SequenceNo DESC , PRI.PDL_Title";
            }
            else
            {
                queryStr = queryStr + "ORDER BY STR_PlaceTitle";
            }

            return queryStr;
        }

        public static string SQL_GetAreaCitiesCombine(string AreaID)
        {
            return @"SELECT DISTINCT isnull(PRD_ProductItem.PDL_Places,0) as CMS_Content
                FROM PRD_PlaceXProductItem
                INNER JOIN PRD_ProductItem ON PRD_ProductItem.PDLID = PRD_PlaceXProductItem.CXZ_ProductItem AND PRD_ProductItem.PDL_Title NOT LIKE 'ZZ%' AND PRD_ProductItem.PDL_Title NOT LIKE 'Zdupe-%'
                INNER Join PRD_Product ON PRD_Product.SPDID = PRD_ProductItem.PDL_ProductID
                INNER Join PRD_Place ON PRD_Place.PLCID = PRD_PlaceXProductItem.CXZ_ChildPlaceID
                left JOIN STR_SitePromotion ON STR_SitePromotion.STP_ProdItemID = PRD_ProductItem.PDLID AND STR_SitePromotion.STP_UserID = 243 AND STR_SitePromotion.STP_Active = 1 AND STR_SitePromotion.STP_StartDate <= getdate() AND STR_SitePromotion.STP_EndDate >= getdate()
                WHERE (PRD_Product.SPD_StarRatingSysCode = 895 OR PRD_Product.SPD_StarRatingSysCode = 1266 OR PRD_Product.SPD_StarRatingSysCode = 1339 OR PRD_Product.SPD_StarRatingSysCode = 495)  AND (PRD_Product.SPD_ProductTypeSysCode = 34) AND (PRD_Product.SPD_Active = 1) AND (PRD_PlaceXProductItem.CXZ_Active = 1) AND (PRD_Product.SPD_Title NOT LIKE '-%') AND (PRD_Product.SPD_Title NOT LIKE 'ZZ%') AND(PRD_Product.SPD_Title NOT LIKE 'Zpend%') 
                AND (PRD_PlaceXProductItem.CXZ_ChildPlaceID IN (" + AreaID + @")) AND (PRD_ProductItem.PDL_Active = 1) AND (PRD_ProductItem.PDL_NoWeb = 0) AND (PRD_Product.SPD_InternalComments LIKE '%:.ED%')";
        }

        public static string SQL_AreaCombineFromXML(string XMLIDs, Int32 AAreaOrACity, string CouID)
        {
            string queryStr = @"Declare @citiesXMLIDs XML; Set @citiesXMLIDs = '" + XMLIDs + @"'; SELECT STR_Places_Hierarchy.STR_PlaceID,STR_Places_Hierarchy.STR_PlaceTitle,STR_Places_Hierarchy.STR_PlaceTypeID,STR_Places_Hierarchy.STR_Place1ParentID,STR_Places_Hierarchy.STR_Place2ParentID,isnull(STR_PlaceShortInfo,'No Info') as STR_PlaceShortInfo
	            FROM  STR_Places_Hierarchy
                WHERE (STR_Places_Hierarchy.STR_PlaceActive = 1) AND (STR_Places_Hierarchy.STR_UserID = 243) AND (STR_Places_Hierarchy.STR_NoWeb = 0) AND (STR_Places_Hierarchy.STR_ProdKindID = 0) AND";

            if (AAreaOrACity == 1) 
            {
                //A_Area 
                queryStr = queryStr + @"(STR_Places_Hierarchy.STR_PlaceTypeID = 1 OR STR_Places_Hierarchy.STR_PlaceTypeID = 25 OR STR_Places_Hierarchy.STR_PlaceTypeID = 6) 
                    AND(STR_Places_Hierarchy.STR_PlaceID IN
                        (
                            SELECT
                                ParamValues.ID.value('.', 'VARCHAR(200)')
                                FROM @citiesXMLIDs.nodes('/Cities/id') as ParamValues(ID)
                        ))
                    ORDER BY STR_Places_Hierarchy.STR_PlaceTitle";
            }
            else
            {
                //A_City 
                queryStr = queryStr + @"(STR_Places_Hierarchy.STR_PlaceTypeID = 1 OR STR_Places_Hierarchy.STR_PlaceTypeID = 25) 
                    AND 
                    (STR_Places_Hierarchy.STR_Place1ParentID <>  '" + CouID + @"') AND  (STR_Places_Hierarchy.STR_Place2ParentID <>  '" + CouID + @"')
                    And (STR_Places_Hierarchy.STR_PlaceID IN
                        (
                            SELECT
                                ParamValues.ID.value('.', 'VARCHAR(200)')
                                FROM @citiesXMLIDs.nodes('/Cities/id') as ParamValues(ID)
                        ))
                    ORDER BY STR_Places_Hierarchy.STR_PlaceTitle";
            }

            return queryStr;

            //return @"Declare @citiesXMLIDs XML; Set @citiesXMLIDs = '" + XMLIDs + @"'; SELECT STR_Places_Hierarchy.STR_PlaceID,STR_Places_Hierarchy.STR_PlaceTitle,STR_Places_Hierarchy.STR_PlaceTypeID,STR_Places_Hierarchy.STR_Place1ParentID,STR_Places_Hierarchy.STR_Place2ParentID,isnull(STR_PlaceShortInfo,'No Info') as STR_PlaceShortInfo
            // FROM  STR_Places_Hierarchy
            //    WHERE (STR_Places_Hierarchy.STR_PlaceActive = 1) AND (STR_Places_Hierarchy.STR_UserID = 243) AND (STR_Places_Hierarchy.STR_NoWeb = 0) AND (STR_Places_Hierarchy.STR_ProdKindID = 0) AND (STR_Places_Hierarchy.STR_PlaceTypeID = 1 OR STR_Places_Hierarchy.STR_PlaceTypeID = 25 OR STR_Places_Hierarchy.STR_PlaceTypeID = 6) 
            //  AND (STR_Places_Hierarchy.STR_PlaceID IN 
            //  (
            //   SELECT
            //    ParamValues.ID.value('.','VARCHAR(200)')
            //    FROM @citiesXMLIDs.nodes('/Cities/id') as ParamValues(ID) 
            //  ))
            //    ORDER BY STR_Places_Hierarchy.STR_PlaceTitle";
        }

        public static string SQL_AAreaFeedback(string AreaID)
        {
            return @"SELECT CF.PCC_Comment,CF.PCC_CustomerName,CF.PCC_Itinerary,CF.PCCID,CF.PCC_PDLID,CFH.dep_date, CFP.PDL_Title,PLCO.STR_PlaceTitle as CountryName,PLCO.STR_PlaceID as CountryID
                FROM PRD_CustomerComment CF INNER JOIN RSV_Heading CFH with (nolock) ON CF.PCC_BookingID = CFH.ID 
                INNER JOIN PRD_ProductItem CFP with(nolock) ON CFP.PDLID = CF.PCC_PDLID and CFP.PDL_Active = 1 AND CFP.PDL_NoWeb = 0 
                INNER JOIN PRD_PlaceXProductItem PXI ON CFP.PDLID = PXI.CXZ_ProductItem 
                INNER JOIN PRD_Product PRO ON PRO.SPDID = CFP.PDL_ProductID 
                LEFT JOIN STR_Places_Hierarchy PLCO ON PLCO.STR_PlaceID = PRO.SPD_CountryPlaceID 
                AND (PLCO.STR_PlaceActive = 1) 
                AND (PLCO.STR_UserID = 243) 
                AND (PLCO.STR_NoWeb = 0)
                AND (PLCO.STR_ProdKindID = 0)
                AND (PLCO.STR_PlaceTypeID = 5)
                WHERE(CF.PCC_PDLID <> 0 And CFH.dept = 868 And CF.PCC_Active = 1 And CF.PCC_Block = 0 And PXI.CXZ_Active = 1) 
                AND PXI.CXZ_ChildPlaceID = " + AreaID + @"
                AND (CF.PCC_Comment is not null)
                AND (LEN(cast(CF.PCC_Comment as varchar(8000))) > 20)
                ORDER BY CF.PCC_Ranking ASC, CFH.dep_date DESC";
        }

        public static string SQL_ACityFeedback(string CityID)
        {
            return @"SELECT CF.PCC_Comment,CF.PCC_CustomerName,CF.PCC_Itinerary,CF.PCCID,CF.PCC_PDLID,CFH.dep_date, CFP.PDL_Title,PLCO.STR_PlaceTitle as CountryName,PLCO.STR_PlaceID as CountryID
                FROM PRD_CustomerComment CF INNER JOIN RSV_Heading CFH with (nolock) ON CF.PCC_BookingID = CFH.ID 
                INNER JOIN PRD_ProductItem CFP with(nolock) ON CFP.PDLID = CF.PCC_PDLID and CFP.PDL_Active = 1 AND CFP.PDL_NoWeb = 0 
                INNER JOIN PRD_PlaceXProductItem PXI ON CFP.PDLID = PXI.CXZ_ProductItem 
                INNER JOIN PRD_Product PRO ON PRO.SPDID = CFP.PDL_ProductID 
                LEFT JOIN STR_Places_Hierarchy PLCO ON PLCO.STR_PlaceID = PRO.SPD_CountryPlaceID 
                AND (PLCO.STR_PlaceActive = 1) 
                AND (PLCO.STR_UserID = 243) 
                AND (PLCO.STR_NoWeb = 0)
                AND (PLCO.STR_ProdKindID = 0)
                AND (PLCO.STR_PlaceTypeID = 5)
                WHERE(CF.PCC_PDLID <> 0 And CFH.dept = 868 And CF.PCC_Active = 1 And CF.PCC_Block = 0) 
                AND PXI.CXZ_ChildPlaceID = " + CityID + @"
                AND (CF.PCC_Comment is not null) 
                AND (LEN(cast(CF.PCC_Comment as varchar(8000))) > 15) AND CHARINDEX('---', CF.PCC_Comment) = 0
                ORDER BY CF.PCC_Ranking ASC, CFH.dep_date DESC";
        }

        public static string SQL_Visitor_HomeTown(int Id)
        {
            return @"Select PLCID , PLC_Title 
               , CASE When PLC_Code = 'none' then PLC_FlyToAirportCode else PLC_Code end as CtyCOD 
                From PRD_PLace 
                Where plcID = " + Id + @"
                And PLC_Active = 1";
        }

        public static string SQL_MultiCouFeedback(string CoutryIDs)
        {
            return @"SELECT TOP 5 CF.PCC_PDLID,CF.PCC_Comment,CF.PCC_CustomerName,CF.PCC_Itinerary,CF.PCCID,CFH.dep_date, CFP.PDL_Title,PLCO.STR_PlaceTitle as CountryName,PLCO.STR_PlaceID as CountryID 
          FROM PRD_CustomerComment CF 
          INNER JOIN RSV_Heading CFH with (nolock) ON  CF.PCC_BookingID = CFH.ID
          INNER JOIN PRD_ProductItem CFP ON  CFP.PDLID = CF.PCC_PDLID
          INNER JOIN PRD_Product PRO ON PRO.SPDID = CFP.PDL_ProductID 
          INNER JOIN STR_Places_Hierarchy PLCO ON PLCO.STR_PlaceID = PRO.SPD_CountryPlaceID AND PLCO.STR_PlaceID in (" + CoutryIDs + @")
          AND PLCO.STR_PlaceActive = 1 AND PLCO.STR_NoWeb = 0 AND PLCO.STR_PlaceTypeID = 5 AND PLCO.STR_UserID = 243
          WHERE CF.PCC_PDLID <> 0 AND CFH.dept in (868,1615) AND CF.PCC_Active = 1 AND CF.PCC_Block = 0 
          AND CFH.dep_date > convert(Varchar(10),Getdate()-720,101) 
          AND CF.PCC_Comment is not null AND LEN(cast(CF.PCC_Comment as varchar(8000))) > 15
          AND cast(CF.PCC_Comment as varchar(8000)) <> '----- No customer comment -----'
          ORDER BY CF.PCC_Ranking ASC, CFH.dep_date DESC";
        }

        public static string SQL_Visitor_LastVisits(string VisitorId)
        {
            return @"With Visits(UTS_ProductItemID, UTS_URL, UTS_Date, UTS_Site, N)
               AS 
               (Select top 100 UTS_ProductItemID, UTS_URL, UTS_Date, UTS_Site, row_number() over(partition by UTS_ProductItemID order by UTSID desc) as N
                From UT_Logs
                Where UTS_Active = 1 And UTS_VisitorID = " + VisitorId + @" and UTS_PageType in ('PKG','mobilePKG') and UTS_Site LIKE '%ED'
                Order by UTS_Date desc)
                Select top 20 v.UTS_ProductItemID, v.UTS_URL, v.UTS_Date , v.UTS_Site From Visits v Where v.n=1;";
        }

        public static string SQL_HeaderRecentlyViewed(string VisitedPackagesIds)
        {
            return @"               Select PRI.PDLID
               ,PRI.PDL_Title              
               ,Images.IMG_Path_URL              
               ,PlaceInfo.STR_PlaceTitle
			   ,PlaceInfo.STR_USerID
                FROM PRD_ProductItem PRI
                INNER JOIN PRD_Product PRO ON PRO.SPDID = PRI.PDL_ProductID            
                outer apply (select top 1 Pic3.IMG_Path_URL, Pic3.IMG_500Path_URL from PRD_ProductXImages Pic2 
                              LEFT JOIN APP_Images Pic3 ON Pic3.IMGID = Pic2.PXI_ImageID 
                              where Pic2.PXI_ProductID = PRI.PDL_ProductID AND Pic2.PXI_Sequence  = 0 AND Pic2.PXI_Active =1 and Pic3.IMG_Active=1) Images 
                outer apply (Select top 1 STR_PlaceTitle, PHY.STR_USerID FROM STR_Places_Hierarchy PHY 
                             where PHY.STR_PlaceID = PRO.SPD_CountryPlaceID AND PHY.STR_PlaceTypeID = 5 AND PHY.STR_PlaceActive = 1 AND PHY.STR_USerID in  (243,182,595)) PlaceInfo 
                WHERE PRI.PDLID in (" + VisitedPackagesIds + @") 
                AND PRI.PDL_Active = 1 
                AND PRI.PDL_NoWeb = 0 
                AND PRO.SPD_ProductTypeSysCode = 34 AND PRO.SPD_StarRatingSysCode <> 541 AND PRO.SPD_Active = 1";
        }

        public static string SQL_VisitedPackagesDescription(string VisitedPackagesIds)
        {
            return @"Select PRI.PDLID
               ,PRI.PDL_Title
               ,cast(isnull(PromoTable.STP_Save,9999) as money) as STP_Save
               ,Images.IMG_Path_URL, Images.IMG_500Path_URL
               ,isnull((Select top 1 isnull(ltrim(rtrim(PLC.PLC_Title)) ,'none') +' for '+ isnull(convert(varchar(5), PromoTable.STP_NumOfNights),0) + ' nights' as PLC_Title
                From PRD_Place PLC
                WHERE(PLC.PLCID = PromoTable.STP_FromPlaceID)
                AND PLC.PLC_Active = 1 
                AND PLC.PLC_PlaceTypeID in (1)),'none') as fromPlace
               ,PRI.PDL_Content 
               ,(SELECT Count(CF.PCCID) as feedbacks FROM PRD_CustomerComment CF WHERE(CF.PCC_PDLID = PRI.PDLID) AND CF.PCC_Active = 1 AND CF.PCC_Block = 0) as feedbacks
               ,PlaceInfo.STR_PlaceTitle, PlaceInfo.STR_USerID
                FROM PRD_ProductItem PRI
                INNER JOIN PRD_Product PRO ON PRO.SPDID = PRI.PDL_ProductID 
                outer apply (SELECT Top 1 PRM.STP_Save, PRM.STP_NumOfNights, STP_FromPlaceID FROM STR_SitePromotion PRM 
                              WHERE PRM.STP_ProdItemID = PRI.PDLID AND PRM.STP_Active = 1 AND PRM.STP_UserID in (243,182,595) 
                              AND PRM.STP_StartDate <= getdate() AND PRM.STP_EndDate >= getdate()) PromoTable 
                outer apply (select top 1 Pic3.IMG_Path_URL, Pic3.IMG_500Path_URL from PRD_ProductXImages Pic2 
                              LEFT JOIN APP_Images Pic3 ON Pic3.IMGID = Pic2.PXI_ImageID 
                              where Pic2.PXI_ProductID = PRI.PDL_ProductID AND Pic2.PXI_Sequence  = 0 AND Pic2.PXI_Active =1 and Pic3.IMG_Active=1) Images 
                outer apply (Select top 1 STR_PlaceTitle, PHY.STR_USerID FROM STR_Places_Hierarchy PHY 
                             where PHY.STR_PlaceID = PRO.SPD_CountryPlaceID AND PHY.STR_PlaceTypeID = 5 AND PHY.STR_PlaceActive = 1 AND PHY.STR_USerID in  (243,182,595)) PlaceInfo 
                WHERE PRI.PDLID in (" + VisitedPackagesIds + @") 
                AND PRI.PDL_Active = 1 
                AND PRI.PDL_NoWeb = 0 
                AND PRO.SPD_ProductTypeSysCode = 34 AND PRO.SPD_StarRatingSysCode <> 541 AND PRO.SPD_Active = 1";
        }

        public static string SQL_TopDeals()
        {
            return @"Select PRI.PDLID, PRI.PDL_Title, PRI.PDL_SequenceNo 
               , isnull(try_Convert(money,STP.STP_Save),99999) as STP_Save 
               ,case when STP.STP_NumOfNights is null then PRI.PDL_Duration else STP.STP_NumOfNights end as STP_NumOfNights 
               ,PRO.SPD_CountryPlaceID as CountryID
               ,(SELECT count(CF.PCCID) FROM PRD_CustomerComment CF WHERE CF.PCC_PDLID = PRI.PDLID AND datalength(CF.PCC_Comment) > 15 AND CF.PCC_Active = 1 AND CF.PCC_Block = 0) as NoOfFeeds  
               ,(Select top 1 PLCO.STR_PlaceTitle FROM STR_Places_Hierarchy PLCO where PLCO.STR_PlaceID = PRO.SPD_CountryPlaceID and PLCO.STR_PlaceActive = 1 AND PLCO.STR_NoWeb = 0) as CountryName 
			   ,PRI.PDL_Content as Content
			   ,PRO.SPD_Description as Description
               ,IMG.IMG_Path_URL
			   ,IMG.IMG_500Path_URL
               FROM STR_SitePromotion STP 
               INNER JOIN PRD_ProductItem PRI ON PRI.PDLID = STP.STP_ProdItemID AND PRI.PDL_Active = 1 AND PRI.PDL_NoWeb = 0 AND pri.PDL_Title NOT LIKE 'Zpend%' 
               INNER JOIN PRD_Product PRO ON PRO.SPDID = PRI.PDL_ProductID AND PRO.SPD_Active = 1 
			   left join PRD_ProductXImages PXI ON PXI.PXI_ProductID = PRO.SPDID AND PXI.PXI_Sequence = 0 AND PXI.PXI_Active = 1
			   left join APP_Images IMG ON IMG.IMGID = PXI.PXI_ImageID AND IMG.IMG_Active = 1 AND IMG.IMG_Path_URL is not null
               WHERE STP.STP_UserID IN (243) AND STP.STP_Active = 1 and  STP_TypePromotion = 1 
                 AND STP.STP_StartDate <= CONVERT(VARCHAR(10), GETDATE(), 101) AND STP.STP_EndDate >= CONVERT(VARCHAR(10), GETDATE(), 101) 
                 AND PRO.SPD_Producttypesyscode = 34 AND PRI.PDL_SequenceNo < 10 
               ORDER BY Case When STP_TypePromotion = 0 Then 99 else STP_TypePromotion End ASC, STP_StartDate DESC,PDL_SequenceNo DESC";
        }

        public static string SQL_RegionDeals()
        {
            return @"SELECT ph.str_placetitle, ph.str_placeId, PRI.PDLID, PRI.PDL_Title, PRI.PDL_SequenceNo  
               ,cast(isnull(SPR.STP_Save,9999) as Money) as STP_Price, case when SPR.STP_NumOfNights is null then PRI.PDL_Duration else SPR.STP_NumOfNights end as STP_NumOfNights, ph.STR_UserID  
               FROM STR_SitePromotion SPR  
               INNER JOIN PRD_ProductItem PRI ON SPR.STP_ProdItemID = PRI.PDLID AND PRI.PDL_Active = 1 AND PRI.PDL_NoWeb = 0 AND pri.PDL_Title NOT LIKE 'Zpend%'  
               INNER Join STR_Places_Hierarchy PLH ON PLH.STR_PlaceID = PRI.PDL_Gateway AND PLH.STR_UserID= 243  AND PLH.STR_PlaceActive = 1 AND PLH.STR_NoWeb = 0 AND PLH.STR_ProdKindID = 0  
               inner Join  
               (select str_placetitle, str_placeId, strid, str_UserId from STR_Places_Hierarchy ph  
               where ph.STR_UserID= 243  and ph.STR_NoWeb = 0 and ph.STR_PlaceActive=1 and str_placetypeId in (5,23) and ph.Str_ProdKindId=0  
               ) ph on (ph.STR_PlaceID = PLH.STR_Place1ParentID OR ph.STR_PlaceID = PLH.STR_Place2ParentID)  
               WHERE SPR.STP_UserID= 243  And SPR.STP_Active = 1 And SPR.STP_StartDate <= Convert(VARCHAR(10), GETDATE(), 101) And SPR.STP_EndDate >= Convert(VARCHAR(10), GETDATE(), 101)  
               order by ph.str_placetitle, PRI.PDL_SequenceNo, PRI.PDLID";
        }

        public static string SQL_Visitor_NoOfVisits(string VisitorId)
        {
            return @"With Visits(UTS_VisitorID, UTS_ProductItemID, N) 
                AS 
                (
                 Select top 100 UTS_VisitorID, UTS_ProductItemID, row_number() over(partition by UTS_ProductItemID order by UTSID desc) as N
                 From UT_Logs
                 Where UTS_Active = 1 And UTS_VisitorID = " + VisitorId + @" And UTS_PageType in ('PKG','mobilePKG') and UTS_Site LIKE '%ED'
                 Order by UTS_Date desc
                 )
                 Select top 20  count(v.UTS_VisitorID) as qty,  isnull(STUFF((Select  ',' + convert(varchar(10), b.UTS_ProductItemID)  FROM Visits b where b.n = 1 and b.UTS_ProductItemID > 0 FOR XML PATH('')), 1, 0, ' '),' ') as ids  From Visits v Where v.n=1";
        }

        public static string SQL_AllCoutriesTopDeal()
        {
            return @"SELECT DISTINCT STP.STP_ProdItemID, STP.STP_Price, STP.STP_Save,STP.STP_NumOfNights, PRI.PDL_Title, PRI.PDL_gateway,PRO.SPD_InternalComments, PLH.STR_PlaceTitle, COU.STR_PlaceTitle AS CountryName, PRI.PDL_SequenceNo,COU.STR_PlaceID as PlaceID
                 FROM STR_SitePromotion STP
                 INNER JOIN PRD_ProductItem PRI ON STP.STP_ProdItemID = PRI.PDLID
                 AND (PRI.PDL_Active = 1) and pri.PDL_NoWeb = 0 
                 INNER Join PRD_Product PRO ON PRO.SPDID = PRI.PDL_productID
                 AND (PRO.SPD_Active = 1)
                 INNER Join STR_Places_Hierarchy PLH ON PLH.STR_PlaceID = PRI.PDL_Gateway
                 AND (PLH.STR_PlaceActive = 1)
                 AND (PLH.STR_NoWeb = 0)
                 AND (PLH.STR_ProdKindID = 0)
                 AND (PLH.STR_UserID = 243)
                 LEFT Join STR_Places_Hierarchy COU ON (COU.STR_PlaceID = PLH.STR_Place1ParentID OR COU.STR_PlaceID = PLH.STR_Place2ParentID)
                 AND (COU.STR_PlaceActive = 1)
                 AND (COU.STR_NoWeb = 0)
                 AND (COU.STR_ProdKindID = 0)
                 AND (COU.STR_UserID = 243)
                 AND (COU.STR_PlaceTypeID = 5)
                 WHERE(STP.STP_Active = 1)
                 AND (STP.STP_UserID = 243) 
                 AND (STP.STP_StartDate <= CONVERT(VARCHAR(10), GETDATE(), 101)) 
                 AND (STP.STP_EndDate >= CONVERT(VARCHAR(10), GETDATE(), 101))
                 ORDER BY CountryName,PRI.PDL_SequenceNo DESC";
        }

        public static string SQL_Get_NumberOfCustomerFeedbacks_Per_OverAllScore()
        {
            return @"SELECT isnull(convert(varchar(5),PCC_OverallScore),'Total') as Name, count(CF.PCCID) as Id 
              FROM PRD_CustomerComment cf 
              INNER JOIN RSV_Heading CFH with (nolock) ON CF.PCC_BookingID = CFH.ID
              WHERE CF.PCC_Active = 1 and PCC_Block=0 And PCC_OverallScore Is Not null and CF.PCC_DetailID = 0 AND cfh.dept in (868,1615)
              Group by PCC_OverallScore With rollup order by PCC_OverallScore";
        }

        public static string SQL_ReviewFirst()
        {
            return @"SELECT CF.PCCID, CF.PCC_OverallScore as Score  
                FROM PRD_CustomerComment CF
                INNER JOIN RSV_Heading CFH with (nolock) ON CF.PCC_BookingID = CFH.ID 
                LEFT JOIN PRD_CustomerComment_PrePublished CFP ON CF.PCC_BookingID = CFP.TCF_BookingID
                WHERE CF.PCC_Active= 1 AND CF.PCC_Block = 0 and CF.PCC_DetailID = 0 
                AND LEN(cast(CF.PCC_Comment as varchar(8000))) > 15 and CFH.dept in (868,1615)
                ORDER BY CFP.TCF_FeedbackReceivedTime DESC";
        }

        public static string SQL_ReviewPage(string revID)
        {
            return @"Select CF.PCCID 
                , CONVERT(varchar(10), CFP.TCF_FeedbackReceivedTime, 101)as TCF_FeedbackReceivedTime 
                , CONVERT(int,CFH.dept) as dept
                , CF.PCC_Comment
                , CF.PCC_PDLID
                , CF.PCC_Itinerary, isnull(CF.PCC_OverallScore,-999) as OverallScore 
                , (SELECT Top 1 CAST(isnull(STPR.STP_Save,9999) as MONEY) as STP_Save 
                FROM STR_SitePromotion STPR 
                WHERE(STPR.STP_ProdItemID = CF.PCC_PDLID)
                AND STPR.STP_Active = 1
                AND STPR.STP_StartDate <= Convert(VARCHAR(10), GETDATE(), 101) 
                AND STPR.STP_EndDate >= CONVERT(VARCHAR(10), GETDATE(), 101)) as STP_Save
                , PRI.PDL_Title
                , PRI.PDL_NoWeb
                , LEFT(PRI.PDL_Places, LEN(PRI.PDL_Places)-1) as PDL_Places
                , (SELECT COUNT (CF1.PCCID) as NoOfFeed 
                FROM PRD_CustomerComment CF1 
                INNER JOIN RSV_Heading CFH1 with (nolock) ON CF1.PCC_BookingID = CFH1.ID 
                WHERE(CF1.PCC_PDLID = PRI.PDLID)
                AND LEN(cast(CF1.PCC_Comment as varchar(8000))) > 15 
                AND CF1.PCC_Active = 1 
                AND CF1.PCC_Block = 0) as NoOfFeed 
                , (SELECT (SELECT DISTINCT  ph2.STR_PlaceTitle + '|' + convert(varchar(8),ph2.STR_PlaceID) + '|' + convert(varchar(8),ph2.STR_PlaceTypeID) + ', ' 
                FROM STR_Places_Hierarchy ph2
                WHERE charindex(','+convert(varchar(8),ph2.STR_PlaceID)+',', ','+replace(PDL_Places,' ',''))>0
                AND ph2.STR_PlaceActive = 1
                AND ph2.STR_PlaceTypeID in (1,25,5)
                AND ph2.STR_UserID in(243)
                AND ph2.STR_NoWeb = 0
                FOR XML PATH(''))) as RelatePlaces
                , (Select top 1 STR_PlaceTitle
                FROM PRD_Product PRO 
                INNER JOIN STR_Places_Hierarchy CONT ON (CONT.STR_PlaceID = PRO.SPD_CountryPlaceID) AND (CONT.STR_PlaceActive = 1) AND (CONT.STR_NoWeb = 0)
                WHERE PRO.SPDID = PRI.PDL_ProductID) as CountryNA
                FROM PRD_CustomerComment CF 
                INNER JOIN RSV_Heading CFH with (nolock) ON CF.PCC_BookingID = CFH.ID
                LEFT JOIN PRD_CustomerComment_PrePublished CFP ON CF.PCC_BookingID = CFP.TCF_BookingID
                LEFT JOIN PRD_ProductItem PRI ON PRI.PDLID = CF.PCC_PDLID  AND PRI.PDL_Active = 1 
                WHERE CF.PCCID in (" + revID + @")  
                AND CF.PCC_Block = 0 
                AND CF.PCC_Active=1 
                ORDER BY CFP.TCF_FeedbackReceivedTime DESC";
        }

        public static string SQL_GetReviews(string page, string score)
        {
            return @"select * from ( 
               select PCCID, CONVERT(varchar(10), CFP.TCF_FeedbackReceivedTime, 101)as TCF_FeedbackReceivedTime, CONVERT(int,CFH.dept) as dept, CF.PCC_Comment, CF.PCC_PDLID, CF.PCC_Itinerary 
                 ,isnull(CF.PCC_OverallScore,-999) as OverallScore, CAST(isnull(Price.Value,9999) as MONEY) as STP_Save, PRI.PDL_Title, PRI.PDL_NoWeb, PRI.PDL_Places 
                 ,NoOfFeed.Value as NoOfFeed, RelatePlaces.Value as RelatePlaces, CountryNA.Value as CountryNA, row_number() Over(ORDER BY CFP.TCF_FeedbackReceivedTime DESC) as N 
               from  PRD_CustomerComment CF  
               inner join RSV_Heading CFH with (nolock) ON CF.PCC_BookingID = CFH.ID 
               left join PRD_CustomerComment_PrePublished CFP ON CF.PCC_BookingID = CFP.TCF_BookingID and CFP.TCF_Active=1 and CFP.TCF_FeedbackProcessed=1 
               left join PRD_ProductItem PRI ON PRI.PDLID = CF.PCC_PDLID  AND PRI.PDL_Active = 1 
               outer apply (SELECT Top 1 STPR.STP_Save as Value FROM STR_SitePromotion STPR 
                            WHERE STPR.STP_ProdItemID = CF.PCC_PDLID AND STPR.STP_Active = 1 
               			       AND STPR.STP_StartDate <= Convert(VARCHAR(10), GETDATE(), 101) AND STPR.STP_EndDate >= CONVERT(VARCHAR(10), GETDATE(), 101)) Price 
               outer apply (SELECT COUNT(CF1.PCCID) as Value FROM PRD_CustomerComment CF1 
                            INNER JOIN RSV_Heading CFH1 with (nolock) ON CF1.PCC_BookingID = CFH1.ID 
                            WHERE CF1.PCC_PDLID = PRI.PDLID  AND LEN(cast(CF1.PCC_Comment as varchar(8000))) > 15 AND CF1.PCC_Active = 1 AND CF1.PCC_Block = 0) as NoOfFeed 
               outer apply (Select (SELECT DISTINCT ph2.STR_PlaceTitle + '|' + convert(varchar(8),ph2.STR_PlaceID) + '|' + convert(varchar(8),ph2.STR_PlaceTypeID) + ', ' 
                            FROM STR_Places_Hierarchy ph2 
               			 WHERE charindex(','+convert(varchar(8),ph2.STR_PlaceID)+',', ','+replace(PDL_Places,' ',''))>0 
                                  AND ph2.STR_PlaceActive = 1 AND ph2.STR_NoWeb = 0 AND ph2.STR_PlaceTypeID in (1,25,5) AND ph2.STR_UserID in(243,243,243) 
                            FOR XML PATH('')) as Value) RelatePlaces 
               outer apply (Select top 1 STR_PlaceTitle as Value FROM PRD_Product PRO 
                            INNER JOIN STR_Places_Hierarchy CONT ON (CONT.STR_PlaceID = PRO.SPD_CountryPlaceID) AND (CONT.STR_PlaceActive = 1) AND (CONT.STR_NoWeb = 0) 
                            WHERE PRO.SPDID = PRI.PDL_ProductID) as CountryNA  
               where dept in (868,1615) and
			   CF.PCC_Active= 1 And CF.PCC_Block = 0  And CF.PCC_DetailID = 0 And LEN(cast(CF.PCC_Comment As varchar(8000))) > 15 
               And CF.PCC_OverallScore in (" + score + @")) x
			   where N between ((" + page + @"-1)*10)+1 and " + page + @"*10
			   Order by N";
        }

        public static string SQL_CountryPlaces(string countryId)
        {
            return @"SELECT ctry.STR_PlaceTitle, city.STR_PlaceID as CityID, city.STR_PlaceTitle as CityName, city.STR_PlaceTypeID as CityType
                      ,case city.STR_UserId when 243 then 'europe' when 243 then 'latin' when 243 then 'asia' end as CityDept, isnull(city.STR_PlaceShortInfo,'none') as CityInfo
                FROM STR_Places_Hierarchy ctry 
                INNER JOIN STR_Places_Hierarchy city ON (city.STR_Place2ParentID = ctry.STR_PlaceID OR city.STR_Place1ParentID = ctry.STR_PlaceID)
                           and city.STR_PlaceTypeID in (25, 1, 6) AND city.STR_PlaceActive = 1 AND city.STR_ProdKindID = 0 AND city.STR_NoWeb = 0 and ctry.STR_UserID = city.STR_UserID AND city.STR_PlacePriority=1
                WHERE ctry.STR_PlaceId=" + countryId + @" AND ctry.STR_PlaceActive = 1 AND ctry.STR_NoWeb = 0 AND ctry.STR_ProdKindID = 0 AND ctry.STR_PlacePriority=1 and ctry.STR_UserID in (243,243,243)
                ORDER BY city.STR_PlaceTitle";
        }

        public static string SQL_CityCMS(string cityID)
        {
            return @"SELECT plcH.STR_PlaceID,Xcms.CMSW_Title, CMSW_Order, CMSW_RelatedCmsID, Cms.CMS_Description
                FROM STR_WebHierarchyXCMS Xcms
                INNER JOIN STR_Places_Hierarchy plcH ON plcH.STR_PlaceID in ( " + cityID + @" )  AND STR_PlaceActive = 1 AND STR_UserID = 243
                inner join CMS_WebsiteContent Cms on cms.CMSID = Xcms.CMSW_RelatedCmsID
                WHERE Xcms.CMSW_Active = 1 AND Xcms.CMSW_WebHierarchyID = plcH.STRID
                ORDER BY plcH.STR_PlaceID,Xcms.CMSW_Order ASC";
        }

        public static string SQL_City_FeaturedItineraries(string cityID)
        {
            return @"Select PRI.PDLID, PRI.PDL_Title, case when STPR.STP_NumOfNights is null then PRI.PDL_Duration else STPR.STP_NumOfNights end as Duration, isnull(STPR.STP_Save,9999) as STP_Save 
                     ,PRI.PDL_SequenceNo, PXW.SPPW_Weight,IMG.IMG_Path_URL,PDL_Places 
                FROM STR_PlacesXPackageWeight PXW 
                INNER JOIN PRD_ProductItem PRI ON PRI.PDLID = PXW.SPPW_PackageID AND PRI.PDL_Active = 1 and pri.PDL_NoWeb = 0 
                INNER JOIN PRD_Product PRO ON PRO.SPDID = PRI.PDL_ProductID AND PRO.SPD_Active = 1 
                LEFT JOIN STR_SitePromotion STPR ON STPR.STP_ProdItemID = PXW.SPPW_PackageID And STPR.STP_UserID =  243  AND STPR.STP_Active = 1 
                    AND STPR.STP_StartDate <= Convert(VARCHAR(10), GETDATE(), 101) AND STPR.STP_EndDate >= CONVERT(VARCHAR(10), GETDATE(), 101) 
                Left JOIN PRD_ProductXImages Pic ON Pic.PXI_ProductID = PRI.PDL_ProductID and Pic.PXI_Active = 1 AND Pic.PXI_Sequence = 0 
                Left JOIN APP_Images IMG ON IMG.IMGID = Pic.PXI_ImageID 
                WHERE PXW.SPPW_Active = 1 AND IMG.IMG_Active = 1 AND PDL_Title NOT LIKE 'Zpend%' AND PXW.SPPW_MasterContentID = 0 AND PXW.SPPW_ParentPlace= " + cityID + @"
                ORDER BY PXW.SPPW_Weight";
        }
        public static string SQL_PlaceDisplayContent(string placeIDs, int placeTypeID)
        {
            return @"Select sdp.SDP_DisplayTitle, PLD.STX_Title, isnull(PLD.STX_URL,'none') as STX_URL, isnull(PLD.STX_Description,'none') as STX_Description 
                     ,isnull(PLD.STX_PictureURL,'none') as STX_PictureURL, PLD.STX_ProdKindID, PLD.STX_Priority 
                     ,isnull(PLD.STX_PictureHeightpx,0) as STX_PictureHeightpx, isnull(PLD.STX_PictureWidthpx,0) as STX_PictureWidthpx, isnull(PLD.STX_CMSID,0) as STX_CMSID 
               From STR_PlaceDescription PLD 
               inner join STR_DisplayPosition sdp on sdp.SDP_PlaceHierarchyID = PLD.STX_StrId and sdp.SDP_GroupProdKindID=PLD.STX_ProdKindID AND sdp.SDP_UserID =  243  
               WHERE STX_UserID =  243  AND PLD.STX_Active = 1 AND SDP.SDP_Active = 1 AND PLD.STX_MasterContentID = 0 AND PLD.STX_StrId= " + placeIDs + @"
                     and sdp.SDP_GroupProdKindID = " + placeTypeID + @"
               Order by PLD.STX_Priority";
        }

        public static string SQL_ActivitiesType(string cityID)
        {
            return @"SELECT SYC.SCDID as Id, SYC.SCD_CodeTitle as Name, pri.PDLID as SSId 
               FROM PRD_PlaceXProductItem PXP 
               INNER JOIN PRD_ProductItem PRI ON PRI.PDLID = PXP.CXZ_ProductItem 
               INNER JOIN PRD_Product PRO ON PRO.SPDID = PRI.PDL_ProductID 
               left join SYS_Codes SYC ON SYC.SCDID = PRO.SPD_ProductKindSysCode 
               WHERE PXP.CXZ_ChildPlaceID = " + cityID + @" AND PXP.CXZ_Active = 1 And PRI.PDL_Active = 1 AND PRI.PDL_NoWeb = 0 AND PRO.SPD_Active = 1 
               AND PRO.SPD_ProductTypeSysCode=152 AND SYC.SCD_Active = 1";
        }

        public static string SQL_GetSSToursByCity(string cityID)
        {
            return @"SELECT PRI.PDLID, PRI.PDL_Title, PRI.PDL_SequenceNo, PRI.PDL_Duration as Duration, SYC.SCD_CodeTitle as DurationUnit, SYC1.SCDID as ID, SYC1.SCD_CodeTitle as Name, SPD_Description, PDL_Description, isnull(A.IMG_Path_URL,'none') as IMG_Path_URL, row_number() over (Order by PDL_Title)
		        , VIA.PIDD_Rating As Rating
                ,VIA.PIDD_ReviewCount as Reviews
                FROM PRD_PlaceXProductItem PXP
		        INNER JOIN PRD_ProductItem PRI On PRI.PDLID = PXP.CXZ_ProductItem   
		        INNER JOIN PRD_Product PRO On PRO.SPDID = PRI.PDL_ProductID
		        left JOIN SYS_Codes SYC On SYC.SCDID = PRO.SPD_StarRatingSysCode
		        left join SYS_Codes SYC1 On SYC1.SCDID = PRO.SPD_ProductKindSysCode
                LEFT join IVIAAPI_Products VIP On  VIP.PID_TNProductItemID = PRI.PDLID And VIP.PID_Active = 1
                LEFT Join IVIAAPI_ProductInfo VIA on VIA.PIDD_ProductCode = VIP.PID_ProductCode And PIDD_Active = 1
                outer apply 
                (select TOP 1 IMG_Path_URL from PRD_ProductXImages PXI LEFT JOIN APP_Images IMG ON IMG.IMGID = PXI.PXI_ImageID And IMG.IMG_Path_URL Is Not null 
                where PXI.PXI_ProductID = PRI.PDL_ProductID And PXI.PXI_Sequence = 0 And PXI.PXI_Active = 1 And IMG.IMG_Active = 1) A 
		        WHERE PXP.CXZ_ChildPlaceID = " + cityID + @"
                And PXP.CXZ_Active = 1
                And PRI.PDL_Active = 1 
		        And PRI.PDL_NoWeb = 0
                And PRO.SPD_Active = 1 
		        And PRO.spd_producttypesyscode=152 
                Order By PRI.PDL_Title";
        }

        public static string SQL_POIByPlaceId(string plcId)
        {
            return @"Select IsNull(POIID, 0) as POIID
                , IsNull(POI_PLCID, 0) as POI_PLCID
                , IsNull(POI_Title, 'none') as POI_Title
                , IsNull(POI_Latitude, 0) as POI_Latitude
                , IsNull(POI_Longitude, 0) as POI_Longitude 
                , IsNull(POI_Description, 'none') as POI_Description
                , IsNull(POI_Active, 0) as POI_Active
                , IsNull(POI_CMSID, 0) as POI_CMSID 
                , IsNull(POI_TargetURL, 'none') as  POI_TargetURL
                , IsNull(POI_PictureURL, 'none') as POI_PictureURL
                 FROM PRD_POI
                 WHERE POI_PLCID = " + plcId + @" 
                 AND POI_Active = 1
                 Order by POI_Title";
        }

        //Get Place Hierarchy for All Packages Page
        //Added by Andrei
        //Mobile usage
        public static string SQL_Hierarchy(int placeId)
        {
            return @"SELECT STX_Title, STX_URL, STX_ProdKindID, STX_STRID, STX_Priority
                                      FROM STR_PlaceDescription 
                                      WHERE (STX_UserID =  243 ) 
                                      AND (STX_PlaceID = " + placeId + @") 
                                      AND STX_Active = 1 AND STX_MasterContentID = 0 AND STX_Title is not null AND STX_URL is not null";
        }

        //Get Places from STR
        //Added by Andrei
        //Mobile usage
        public static string SQL_GetPlacesFromSTR(string plcIds)
        {
            return @"SELECT  p1.STR_PlaceID as PlaceId, p1.STR_PlaceTitle as PlaceName, p1.STR_PlaceTypeID as PlaceType, isnull(p1.STR_PlaceAIID,1000) as PlaceRanking, p2.STR_PlaceTitle as CountryName, p2.STR_PlaceID as CountryId
            FROM STR_Places_Hierarchy p1 
            INNER JOIN STR_Places_Hierarchy p2 ON p2.STR_PlaceID = p1.STR_Place1ParentID OR p2.STR_PlaceID = p1.STR_Place2ParentID 
            WHERE p1.STR_UserID =  243  And p1.STR_PlaceActive = 1 AND p1.STR_PlaceTypeID in (1, 25, 6, 2) AND p1.STR_NoWeb = 0 
                AND p1.STR_ProdKindID = 0 AND p1.STR_PlaceID IN (" + plcIds + @") AND p2.STR_UserID = 243  
                AND p2.STR_PlaceTypeID = 5 AND p2.STR_NoWeb = 0 AND p2.STR_PlaceActive = 1 AND p1.STR_PlaceTitle not like 'zz%' AND p1.STR_PlaceTitle not like 'zPend%'
                Order by p2.STR_PlaceTitle, PlaceRanking";
        }

        //Get All Country Packs
        //Added by Andrei
        //Mobile usage
        public static string SQL_GetAllPacksCountry(string placeId, string citiesList = "")
        {
            return @"Select PRI.PDLID, PRI.PDL_Title, PRI.PDL_Content, PRI.PDL_SequenceNo, PRI.PDL_Places
          ,case when SPR.STP_NumOfNights is null then PRI.PDL_Duration else SPR.STP_NumOfNights end as STP_NumOfNights, PRO.SPD_Description ,SPD_InternalComments ,cast(isnull(SPR.STP_Save,9999) as Money) as STP_Save
          ,isNull(PPW.SPPW_Weight, 999) as SPPW_Weight 
          ,(SELECT COUNT (CF.PCCID) as NoOfFeed FROM PRD_CustomerComment CF with (nolock) INNER JOIN RSV_Heading CFH with (nolock) ON CF.PCC_BookingID = CFH.ID
            WHERE CF.PCC_PDLID = PRI.PDLID AND LEN(cast(CF.PCC_Comment as varchar(8000))) > 20 
                AND CF.PCC_Active = 1 AND CF.PCC_Block = 0) as NoOfFeed, Pic3.IMG_Path_URL, convert(varchar(10), SPR.STP_StartTravelDate, 101) as STP_StartTravelDate, PLC.PLC_Title, SPR.STP_MiniTitle
          ,(SELECT TOP 1 PT.PWT_TemplateValue FROM PRD_ProductItemXwebTemplate PWT with (nolock) INNER JOIN PRD_ProductWebTemplate PT with (nolock) ON PWT.PPWT_TemplateID = PT.PWTID
               WHERE PWT.PPWT_ProdItemID = PRI.PDLID AND PWT.PPWT_Active = 1 AND PT.PWT_Active = 1 ORDER BY PT.PWT_TemplateValue DESC) as WebTemplate,
                PHI.STR_PlaceTitle
		  ,isnull((select top 1 [STR_PlaceTitle] from [dbo].[STR_Places_Hierarchy] ph where ph.[STR_PlaceID] = pro.[SPD_CountryPlaceID] and ph.[STR_NoWeb]=0 and ph.[STR_PlaceActive]=1),'none') as CountryName
           FROM PRD_PlaceXProductItem PXP with (nolock) 
           LEFT Join STR_Places_Hierarchy PHI with (nolock) ON PHI.STR_PlaceID = PXP.CXZ_ChildPlaceID 
           INNER JOIN PRD_ProductItem PRI with (nolock) ON PRI.PDLID = PXP.CXZ_ProductItem  
           INNER Join PRD_Product PRO with (nolock) ON PRO.SPDID = PRI.PDL_ProductID
           LEFT Join STR_SitePromotion SPR with (nolock) ON SPR.STP_ProdItemID =PRI.PDLID AND SPR.STP_Active = 1
           AND SPR.STP_StartDate <= CONVERT(VARCHAR(10), GETDATE(), 101) AND SPR.STP_EndDate >= CONVERT(VARCHAR(10), GETDATE(), 101)
           AND SPR.STP_UserID =  243 
           LEFT JOIN PRD_Place PLC with (nolock) ON PLC.PLCID = SPR.STP_FromPlaceID and (PLC.PLC_PlaceTypeID = 1) AND (PLC.PLC_Active = 1)
           LEFT JOIN STR_PlacesXPackageWeight PPW with (nolock) ON PPW.SPPW_parentPlace = PHI.STRID AND PPW.SPPW_PackageID = PRI.PDLID
                AND PPW.SPPW_Active = 1 AND PPW.SPPW_MasterContentID = 0
           LEFT JOIN PRD_ProductXImages Pic2 with (nolock) ON Pic2.PXI_ProductID = PRI.PDL_ProductID AND Pic2.PXI_Sequence = 0 AND Pic2.PXI_Active = 1
           LEFT JOIN APP_Images Pic3 with (nolock) ON Pic3.IMGID = Pic2.PXI_ImageID
           WHERE PXP.CXZ_Active = 1 AND Pic3.IMG_Active = 1 AND PRI.PDL_Active = 1 AND PRI.PDL_NoWeb = 0 AND PRO.SPD_Active = 1 AND PRO.SPD_ProductTypeSysCode = 34
               AND PHI.STR_UserID =  243  AND PHI.STR_NoWeb = 0 AND PHI.STR_ProdKindID = 0 AND PHI.STR_PlaceID in (" + placeId + @") 
              AND PRO.SPD_InternalComments LIKE '%" + InternalComments + @"%' AND PRO.SPD_StarratingSysCode <> 541 AND PHI.STR_PlaceActive = 1
               AND PDL_Title NOT LIKE 'Zpend%'" + citiesList + @"
               ORDER BY case when cast(SPR.STP_Save as Money) > 0 then 11 else 0 end desc, 11 desc, cast(isnull(STP_Save,9999) as Money), case when SPR.STP_NumOfNights is null then PRI.PDL_Duration else SPR.STP_NumOfNights end, PDL_Title";
        }
        public static string SQL_ctyBycon(string ThisPlace)
        {
            return @"SELECT city.STR_PlaceID as CYID,city.STR_PlaceTitle as CYName,city.STR_PlaceTypeID as CYType,city.STR_PlaceAIID as CYRank,isnull(city.STR_PlaceShortInfo,'No Info') as CYInfo
        FROM STR_Places_Hierarchy ctry 
        INNER JOIN STR_Places_Hierarchy city ON (city.STR_Place2ParentID = ctry.STR_PlaceID OR city.STR_Place1ParentID = ctry.STR_PlaceID)
        WHERE
        (ctry.STR_PlaceTitle LIKE '" + ThisPlace + @"') AND
        (ctry.STR_PlaceTypeId = 5) AND 
        (ctry.STR_PlaceActive = 1) AND 
        (ctry.STR_UserID = 243) AND
        (ctry.STR_NoWeb = 0) AND
        (city.STR_PlaceTypeID = 25 OR city.STR_PlaceTypeID = 1 OR city.STR_PlaceTypeID = 6) AND
        (city.STR_PlaceActive = 1) AND
        (city.STR_UserID = 243) AND
        (city.STR_NoWeb = 0)
        ORDER BY city.STR_PlaceTitle";
        }

        public static string SQL_Hotels_From_Place_Map(string plcID)
        {
            return @";with PLDIds(PDLID, GIPHID, GIPH_GIATAID, GIPH_TNTournetName, GIPH_CityName, GIPH_TNTournetRating, GIPH_TNHighlights, GIPH_TNTournetContent
               , GIATA_Address, GIPH_Latitude, GIPH_Longitude, ContentSource
		       , GIPH_TNSequence, GIATA_Description, GHS_TrustYouScore, GHS_BookingScore
		       , GHS_SolarToursScore, GHS_ExpediaScore, GHS_ExpediaReviewCount, GHS_FinalScore, GIPC_HotelCode, GIPH_TNZoneID, SPD_StarRatingSysCode, PDL_CustomerRanking, PDL_DistrictZone, PDL_ProductID
		       , CityZone, GIPH_TNUseTournetContent, N, N1) as 
          (select gpi.GLT_PDLID, gh.GIPHID, gh.GIPH_GIATAID, gh.GIPH_TNTournetName, gh.GIPH_CityName, gh.GIPH_TNTournetRating, isnull(GIPH_TNHighlights,''), isnull(try_convert(xml, gh.GIPH_TNTournetContent),'<Property><Description/><FacilityDesc/><Activities /><RoomDesc/></Property>') 
                 ,isnull(gh.GIPH_AddressLine1,'')+isnull(', '+gh.GIPH_AddressLine2,'')+isnull(', '+gh.GIPH_AddressLine3,'')+isnull(', '+gh.GIPH_AddressLine4,'')+isnull(', '+gh.GIPH_AddressLine5,'')+isnull(', '+gh.GIPH_AddressLine6,'')
                 ,gh.GIPH_Latitude, gh.GIPH_Longitude, case when gh.GIPH_TNContentSource like '%tournet%' then 'TN' else 'GIATA' end 
                 ,gh.GIPH_TNSequence, isnull(gt.GHGT_Text100+'</br></br>','')+isnull(GHGT_Text101,''), isnull(ghs.GHS_TrustYouScore, 0), isnull(ghs.GHS_BookingScore, 0)
			     ,isnull(ghs.GHS_SolarToursScore, 0), ISNULL(GHS_ExpediaScore, 0), ISNULL(GHS_ExpediaReviewCount, 0), ISNULL(GHS_FinalScore, 0)
				 , isnull(x.GIPC_HotelCode,'none'), gh.GIPH_TNZoneID, pro.SPD_StarRatingSysCode, isnull(pri.PDL_CustomerRanking,0), pri.PDL_DistrictZone, pri.PDL_ProductID
                 ,isnull(place.Name,''), gh.GIPH_TNUseTournetContent, row_number() over(partition by gxtp.GITP_PLCID, gh.GIPH_GIATAID order by gh.GIPH_TNSequence, pri.PDLID), row_number() over(partition by gxtp.GITP_PLCID, gh.GIPHID order by gh.GIPHID) 
           from GIATA_GiataXTournetPlace gxtp 
		   inner join GIATA_GiataXProductItem gpi on gpi.GLT_GIPHID = gxtp.GITP_GIPHID And gpi.GLT_Active=1 
           inner join PRD_ProductItem pri ON pri.PDLID = gpi.GLT_PDLID and pri.PDL_Active = 1 and pri.PDL_NoWeb = 0 AND pri.PDL_Title NOT Like '-%' AND pri.PDL_Title NOT Like 'Zblock%' 
	       inner join Prd_Product PRO ON pro.SPDID = pri.PDL_ProductID AND PRO.SPD_Active = 1 AND PRO.spd_producttypesyscode=3 
           inner join GIATA_Hotels gh on gpi.GLT_GIPHID = gh.GIPHID And gh.GIPH_Active=1 And  gh.GIPH_TNNoWeb = 0 
           left join GIATA_Texts gt on gt.GHGT_GIATAID = gh.GIPH_GIATAID And gt.GHGT_Active=1 
           left join GIATA_HotelScores ghs on ghs.GHS_GIPHID = gh.GIPHID And ghs.GHS_Active = 1 
           outer apply (select top 1 gphc.GIPC_HotelCode from GIATA_ProviderHotelCodes gphc where gphc.GIPC_GIPHID=gh.GIPHID And gphc.GIPC_Active = 1 And gphc.GIPC_ProviderCode = 'trustyou' order by GIPC_TNIsMainCode desc) x 
	       outer apply (select top 1 case when pl.[PLC_Title] like '.NONE%' then '' else pl.[PLC_Title] end as Name from [dbo].[PRD_Place] pl where pl.[PLCID]=gh.[GIPH_TNZoneID] And pl.[PLC_Active] = 1 ) Place
           where gxtp.GITP_PLCID = " + plcID + @" and gxtp.GITP_Active = 1 and GHS_FinalScore >= 3.5) 
           Select p.PDLID, p.GIPH_TNTournetName as PDL_Title, p.GIPH_TNSequence as PDL_SequenceNo, p.PDL_CustomerRanking, p.PDL_DistrictZone, p.GIPH_TNTournetRating, p.GIPH_TNHighlights
	             ,SYC.SCD_CodeTitle, p.GIPH_TNZoneID, p.CityZone  
                 ,case when p.ContentSource='TN' and ltrim(rtrim(p.GIATA_Address))='' then PTY.PTY_Address else p.GIATA_Address end as PTY_Address 
                 ,case when p.ContentSource='GIATA' and p.GIPH_TNUseTournetContent=0 then GIATA_Description else ltrim(rtrim(GIPH_TNTournetContent.value('(//Property/Description/text())[1]','varchar(max)'))) end as PTY_Description 
                 ,p.GIPH_Latitude as PTY_Latitude, p.GIPH_Longitude as PTY_Longitude, isnull(img.IMG_Path_URL,'') as IMG_Path_URL 
                 ,p.GIPHID, p.GIPH_GIATAID, p.GIPH_CityName, p.ContentSource, p.GHS_TrustYouScore, p.GHS_BookingScore, p.GHS_SolarToursScore
				 ,p.GHS_ExpediaScore, p.GHS_ExpediaReviewCount, p.GHS_FinalScore, p.GIPC_HotelCode,GIPH_TNTournetContent
                 from PLDIds p              
                 inner join SYS_Codes SYC ON SYC.SCDID = p.SPD_StarRatingSysCode and SYC.[SCD_Active]=1 
                 left join PRD_Property PTY ON PTY.PTY_ProductID = p.PDL_ProductID and PTY.PTY_active = 1 and PTY.pty_placeCityId = " + plcID +
                 @"outer apply (select top 1 Case when ai.IMG_500Path_URL is null Then ai.IMG_Path_URL Else ai.IMG_500Path_URL End as IMG_Path_URL from GIATA_HotelXImages ghi inner join APP_Images ai on ghi.GIMG_TNImageID = ai.IMGID and ai.IMG_Active=1 where p.GIPHID=ghi.GIMG_GIPHID and ghi.GIMG_Active=1 and ghi.GIMG_TNSequence = 0) Img  
                 where (p.n = 1 and p.GIPH_GIATAID<>0) or (p.GIPH_GIATAID = 0 and p.n1 = 1)";
        }

        public static string SQL_ActivitiesIds(string Ids, string Types, string OnlyFavorite, string SSName, string OrderValue)
        {
            string sqlCom = @"SELECT PRI.PDLID as Id FROM PRD_ProductItem PRI 
               INNER JOIN PRD_Product PRO ON PRO.SPDID = PRI.PDL_ProductID 
               LEFT JOIN STR_SitePromotion STPR ON STPR.STP_ProdItemID =pri.PDLID And STPR.STP_UserID = 243 AND STPR.STP_Active = 1 
                  AND STPR.STP_StartDate <= Convert(VARCHAR(10), GETDATE(), 101) AND STPR.STP_EndDate >= CONVERT(VARCHAR(10), GETDATE(), 101) 
               left join SYS_Codes SYC ON SYC.SCDID = PRO.SPD_ProductKindSysCode 
               WHERE PRI.PDL_Active = 1 AND PRI.PDL_NoWeb = 0 AND PRO.SPD_Active = 1 AND PRO.SPD_ProductTypeSysCode=152 AND SYC.SCD_Active = 1 
                     AND PRI.PDLID in (" + Ids + @")";

            if (Types != "")
            {
                sqlCom = sqlCom + @" AND SYC.SCDID in (" + Types + ")";
            }
            if (OnlyFavorite == "1")
            {
                sqlCom = sqlCom + @" AND PRI.PDL_SequenceNo between 50 and 59";
            }
            if (SSName != "")
            {
                sqlCom = sqlCom + @" AND PRI.PDL_Title like '%" + SSName + "%'";
            }

            switch (OrderValue)
            {
                case "1":
                    sqlCom = sqlCom + " ORDER BY PRI.PDL_Title";
                    break;
                case "2":
                    sqlCom = sqlCom + " ORDER BY cast(isnull(STPR.STP_Save,9999) as Money)";
                    break;
                case "3":
                    sqlCom = sqlCom + " ORDER BY case when STPR.STP_NumOfNights is null then PRI.PDL_Duration else STPR.STP_NumOfNights end";
                    break;
            }

            return sqlCom;
        }

        public static string SQL_Activities(string Ids, string Types, string OnlyFavorite, string SSName, string OrderValue)
        {
            string sqlCom = @"SELECT pri.PDLID as Id, pri.pdl_title as Name, PDL_SequenceNo, isnull(STPR.STP_Save,9999) as STP_Save, SYC.SCD_CodeTitle 
	            ,cast((pri.PDL_Duration) as varchar(3)) + ' '+ cast((SYC1.SCD_CodeTitle) as varchar(max)) as SSDuration
                ,case
				when SYC1.SCDID = 1627 then cast(pri.PDL_Duration as varchar(10))
				when SYC1.SCDID = 68 then cast((pri.PDL_Duration * 60 * 24) as varchar(10))
				when SYC1.SCDID = 10 then cast((pri.PDL_Duration * 60) as varchar(10))
				end as SSDurationInMinutes 
                , VIA.IPR2_CombinedAverageRating As Rating
                ,VIA.IPR2_TotalReviews as Reviews
                ,[SPD_Description],PDL_Description, isnull(A.IMG_Path_URL,'none') as IMG_Path_URL 
                FROM PRD_ProductItem PRI 
                INNER JOIN PRD_Product PRO ON PRO.SPDID = PRI.PDL_ProductID 
                LEFT JOIN SYS_Codes SYC ON SYC.SCDID = PRO.SPD_ProductKindSysCode 
                LEFT JOIN SYS_Codes SYC1 ON SYC1.SCDID = PRI.PDL_DurationUnitSysCode 
                LEFT join IVIAAPI2_Products VIP On VIP.PID2_TNProdItemID = PRI.PDLID And VIP.PID2_Active = 1
                LEFT Join IVIAAPI2_ProductReviews VIA on VIA.IPR2_ProductCode = VIP.PID2_ProductCode And IPR2_Active = 1
                LEFT JOIN STR_SitePromotion STPR ON STPR.STP_ProdItemID =pri.PDLID And STPR.STP_UserID = 243 AND STPR.STP_Active = 1 
                AND STPR.STP_StartDate <= Convert(VARCHAR(10), GETDATE(), 101) AND STPR.STP_EndDate >= CONVERT(VARCHAR(10), GETDATE(), 101) 
                outer apply 
                (select TOP 1 IMG_Path_URL from PRD_ProductXImages PXI LEFT JOIN APP_Images IMG ON IMG.IMGID = PXI.PXI_ImageID And IMG.IMG_Path_URL Is Not null 
                where PXI.PXI_ProductID = PRO.SPDID And PXI.PXI_Sequence = 0 And PXI.PXI_Active = 1 And IMG.IMG_Active = 1) A 
                WHERE PRI.PDL_Active = 1 And PRI.PDL_NoWeb = 0 And PRO.SPD_Active = 1 And SYC.SCD_Active = 1 
                AND PRI.pdlid in (" + Ids + @")";

            if (Types != "")
            {
                sqlCom = sqlCom + @" AND SYC.SCDID in (" + Types + ")";
            }
            if (OnlyFavorite == "1")
            {
                sqlCom = sqlCom + @" AND PRI.PDL_SequenceNo between 50 and 59";
            }
            if (SSName != "")
            {
                sqlCom = sqlCom + @" AND PRI.PDL_Title like '%" + SSName + "%'";
            }

            switch (OrderValue)
            {
                case "1":
                    sqlCom = sqlCom + " ORDER BY PRI.PDL_Title";
                    break;
                case "2":
                    sqlCom = sqlCom + " ORDER BY cast(isnull(STPR.STP_Save,9999) as Money)";
                    break;
                case "3":
                    sqlCom = sqlCom + " ORDER BY SSDurationInMinutes";
                    break;
            }

            return sqlCom;
        }

        public static string SQL_BestSellers()
        {
            return @"SELECT TproI.PDLID, Tprom.STP_TypePromotion, TproI.PDL_Title, Tprom.STP_ProdItemID, Tprom.STP_Price, Tprom.STP_NumOfNights,Tprod.SPD_Description, Tprod.SPD_Producttypesyscode, Tprom.STP_MiniTitle 
               ,isnull((select top 1 [STR_PlaceTitle] from [dbo].[STR_Places_Hierarchy] ph where ph.[STR_PlaceID] = Tprod.[SPD_CountryPlaceID] and ph.[STR_NoWeb]=0 and ph.[STR_PlaceActive]=1),'none') as CountryName
                FROM STR_SitePromotion Tprom
                INNER Join PRD_ProductItem TproI ON TproI.PDLID = Tprom.STP_ProdItemID AND TproI.PDL_Active = 1 AND TproI.pdl_noweb=0 
                INNER Join PRD_Product Tprod ON Tprod.SPDID = TproI.PDL_productID AND Tprod.SPD_Active = 1 
                WHERE Tprom.STP_UserID = 243 AND Tprom.STP_Active = 1 AND Tprom.STP_TypePromotion = 1 
                   AND Tprom.STP_StartDate <= CONVERT(VARCHAR(10), GETDATE(), 101) AND Tprom.STP_EndDate >= CONVERT(VARCHAR(10), GETDATE(), 101) 
                ORDER BY Tprom.STP_StartDate DESC";
        }

        public static string SQL_Country_Top3MostPopularPackages(string countryid)
        {
            return @"SELECT TOP 3 PRI.PDLID, PRI.PDL_Title, cast(isnull(SPR.STP_Save,9999) as money) as STP_save 
                  ,isnull((select top 1 [STR_PlaceTitle] from [dbo].[STR_Places_Hierarchy] ph where ph.[STR_PlaceID] = PRO.[SPD_CountryPlaceID] and ph.[STR_NoWeb]=0 and ph.[STR_PlaceActive]=1),'none') as CountryName 
                  ,isnull(img.IMG_Path_URL,'none') as IMG_Path_URL 
               FROM PRD_PlaceXProductItem PXP 
               INNER JOIN PRD_ProductItem PRI ON PRI.PDLID = PXP.CXZ_ProductItem AND PRI.PDL_Active = 1 AND PRI.PDL_NoWeb = 0 
               INNER JOIN PRD_Product PRO ON PRO.SPDID=PRI.PDL_ProductID AND PRO.SPD_Active = 1 AND PRO.SPD_ProductTypeSysCode = 34 AND PRO.SPD_InternalComments LIKE '%" + InternalComments + @"%' 
               INNER JOIN STR_SitePromotion SPR ON SPR.STP_ProdItemID=PRI.PDLID AND SPR.STP_Active = 1 
                          AND SPR.STP_StartDate <= Convert(VARCHAR(10), GETDATE(), 101) And SPR.STP_EndDate >= Convert(VARCHAR(10), GETDATE(), 101) And SPR.STP_UserID = " + SiteUserId + @"
               INNER JOIN 
               (select CF.PCC_PDLID, count(CF.PCCID) as NoOfFeeds from PRD_CustomerComment CF 
                where datalength(CF.PCC_Comment) > 15 AND CF.PCC_Active = 1 AND CF.PCC_Block = 0 and CF.PCC_PDLID<>0 group by PCC_PDLID) x on x.PCC_PDLID = PRI.PDLID 
               LEFT JOIN PRD_ProductXImages PXI ON PXI.PXI_ProductID = PRI.PDL_ProductID AND PXI.PXI_Sequence = 0 
               LEFT JOIN APP_Images IMG ON IMG.IMGID = PXI.PXI_ImageID 
               WHERE PXP.CXZ_ChildPlaceID = " + countryid + @" And PXI.PXI_Active = 1 And IMG.IMG_Active = 1 And IMG.IMG_Path_URL Is Not null 
               ORDER BY x.NoOfFeeds desc";
        }

        public static string SQL_PlaceHighlights(string PlaceId, string ProdKindId)
        {
            return @"SELECT STXID, STX_Title, STX_URL FROM STR_PlaceDescription 
               WHERE STX_PlaceID = " + PlaceId + @" AND STX_ProdKindId in (" + ProdKindId + @") AND STX_UserID = " + SiteUserId + @"
               AND STX_Active = 1 AND STX_MasterContentID = 0 AND STX_Title is not null AND STX_URL is not null ORDER BY STX_Priority";
        }

        public static string SQL_PlaceHighlights(string countryid)
        {
            return @"select PLHR.Str_PlaceId as Id, PLHR.Str_PlaceTitle as Name, isnull(PLHR.STR_PlaceAIID,1000) as Rank, p2.Str_PlaceId as CountryId, p2.Str_PlaceTitle as CountryName 
               from STR_Places_Hierarchy PLHR 
               inner join STR_Places_Hierarchy p2 on p2.STR_UserID=PLHR.STR_UserID and p2.STR_NoWeb = 0 AND p2.STR_PlaceActive = 1 AND p2.STR_ProdKindID = 0 and (p2.STR_PlaceID = PLHR.STR_Place1ParentID OR p2.STR_PlaceID = PLHR.STR_Place2ParentID) and p2.STR_PlaceTypeID=5 
               where PLHR.STR_NoWeb = 0 And PLHR.STR_PlaceActive = 1 And PLHR.STR_ProdKindID = 0 AND PLHR.STR_PlaceTypeID in (25, 1, 6) AND PLHR.STR_UserID = " + SiteUserId + @"
                     and exists 
               (SELECT 1 FROM PRD_PlaceXProductItem PXP with (index(IX_PRD_PlaceXProductItem)) 
               INNER JOIN PRD_ProductItem PRI ON PRI.PDLID = PXP.CXZ_ProductItem AND PRI.PDL_Active = 1 AND PRI.PDL_NoWeb = 0 
               INNER JOIN PRD_Product PRO ON PRO.SPDID=PRI.PDL_ProductID AND PRO.SPD_Active = 1 AND PRO.SPD_ProductTypeSysCode = 34 AND PRO.SPD_InternalComments LIKE '%" + InternalComments + @"%' 
               Left JOIN STR_SitePromotion SPR ON SPR.STP_ProdItemID=PRI.PDLID AND SPR.STP_Active = 1 AND SPR.STP_StartDate <= Convert(VARCHAR(10), GETDATE(), 101) And SPR.STP_EndDate >= Convert(VARCHAR(10), GETDATE(), 101) And SPR.STP_UserID = " + SiteUserId + @"
               WHERE PXP.CXZ_ChildPlaceID = " + countryid + @" and PXP.CXZ_Active = 1 and charindex(','+convert(varchar(10),PLHR.Str_PlaceID)+',', ','+replace(PRI.PDL_places,' ',''))>0 
               and exists (select 1 from PRD_CustomerComment CF WHERE CF.PCC_PDLID = PRI.PDLID AND datalength(CF.PCC_Comment) > 15 AND CF.PCC_Active = 1 AND CF.PCC_Block = 0)) order by Name";
        }

        public static string SQL_CustomerFeedbacksIds_For_Country_Sorted(string CountryId, string Order, string PlacesIds = "")
        {
            string selectClause = @"Select CF.PCCID as Id 
               From STR_Places_Hierarchy PLCO 
               inner join PRD_PlaceXProductItem pXp on pXp.CXZ_ChildPlaceID = PLCO.STR_PlaceID and pXp.CXZ_Active = 1 
               inner join PRD_ProductItem pri ON pXp.CXZ_ProductItem = pri.PDLID and pri.PDL_NoWeb = 0 and pri.PDL_Active = 1 
               inner join PRD_CustomerComment CF on pri.PDLID = CF.PCC_PDLID 
               inner join RSV_Heading CFH with (nolock) ON CF.PCC_BookingID = CFH.ID 
               Where PLCO.STR_PlaceID= " + CountryId + @" and PLCO.STR_UserID = " + SiteUserId + @"
                     and PLCO.STR_NoWeb = 0 and PLCO.STR_PlaceActive = 1 and PLCO.STR_PlaceTypeID = 5 and PLCO.STR_ProdKindID = 0 
                     and datalength(CF.PCC_Comment) > 15 and CF.PCC_Active = 1 and CF.PCC_Block = 0";

            string whereClause = "";
            if (PlacesIds != "")
            {
                string[] strs = PlacesIds.Split(",", StringSplitOptions.RemoveEmptyEntries);
                whereClause = " AND ";
                for (Int32 i = 0; i <= strs.Length - 1; i++)
                {
                    whereClause = whereClause + (i == 0 ? "(" : " or ") + "charindex('," + strs[i].Trim() + ",',','+replace(PRI.PDL_Places,' ',''))>0";
                }
                whereClause = whereClause + ")";
            }

            string orderClause = "";
            switch (Order)
            {
                case "1":
                    orderClause = " ORDER BY PCCID desc";
                    break;
                case "2":
                    orderClause = " ORDER BY CFH.gross_ttl desc";
                    break;
                case "3":
                    orderClause = " ORDER BY CFH.gross_ttl";
                    break;
                case "4":
                    orderClause = " ORDER BY datediff(day, cfh.[ret_date], [dep_date]) desc";
                    break;
            }

            return selectClause + whereClause + orderClause;
        }

        public static string SQL_TripsTakenCustomerFeedbacksSorted(string CustomerFeedbacksIds, string Order)
        {
            string selectClause = @"SELECT CF.PCCID, CF.PCC_Comment, CF.PCC_CustomerName, CF.PCC_Itinerary, pri.PDLID, pri.PDL_Title, isnull(SPR.STP_Save,9999) as STP_save 
             ,(SELECT COUNT (CF.PCCID) FROM PRD_CustomerComment CF WHERE CF.PCC_PDLID = PRI.PDLID AND CF.PCC_Comment is not null AND LEN(cast(CF.PCC_Comment as varchar(8000))) > 15 AND CF.PCC_Active = 1 AND CF.PCC_Block = 0) as NoOfFeed 
             ,pri.PDL_Places, p1.Str_placeTitle, p1.Str_PlaceId, p1.Str_PlaceTypeId 
             FROM PRD_CustomerComment CF 
             inner join RSV_Heading CFH with (nolock) ON CF.PCC_BookingID = CFH.ID 
             inner join PRD_ProductItem PRI ON PRI.PDLID=cf.PCC_PDLID 
             left join STR_SitePromotion SPR ON SPR.STP_ProdItemID=PRI.PDLID AND SPR.STP_Active = 1 AND SPR.STP_StartDate <= Convert(VARCHAR(10), GETDATE(), 101) And SPR.STP_EndDate >= Convert(VARCHAR(10), GETDATE(), 101) And SPR.STP_UserID = " + SiteUserId + @"
             inner join STR_Places_Hierarchy p1 on charindex(','+convert(varchar(10),p1.Str_PlaceID)+',', ','+replace(PRI.PDL_places,' ',''))>0 
                    and p1.STR_NoWeb = 0 AND p1.STR_PlaceActive = 1 AND p1.STR_ProdKindID = 0 AND p1.STR_PlaceTypeID in (25, 1, 6, 5) AND p1.STR_UserID = " + SiteUserId + @"
             Where CF.PCCID in (" + CustomerFeedbacksIds + @")";

            switch (Order)
            {
                case "1":
                    selectClause = selectClause + " ORDER BY PCCID desc";
                    break;
                case "2":
                    selectClause = selectClause + " ORDER BY CFH.gross_ttl desc";
                    break;
                case "3":
                    selectClause = selectClause + " ORDER BY CFH.gross_ttl";
                    break;
                case "4":
                    selectClause = selectClause + " ORDER BY datediff(day, cfh.[ret_date], [dep_date]) desc";
                    break;
            }

            return selectClause;
        }

        public static string sqlPacksByPlaceID_Basic(string placeID)
        {
            return @"Select Distinct(PRI.PDLID), PRI.PDL_Places, case when SPR.STP_NumOfNights is null then PRI.PDL_Duration else SPR.STP_NumOfNights end as STP_NumOfNights, cast(isnull(SPR.STP_Save,9999) as money) AS STP_save 
            FROM PRD_PlaceXProductItem PXP 
            LEFT Join STR_Places_Hierarchy PHI ON PHI.STR_PlaceID = PXP.CXZ_ChildPlaceID 
            INNER JOIN PRD_ProductItem PRI ON PRI.PDLID = PXP.CXZ_ProductItem 
            INNER Join PRD_Product PRO ON PRO.SPDID = PRI.PDL_ProductID 
            LEFT Join STR_SitePromotion SPR ON SPR.STP_ProdItemID =PRI.PDLID AND SPR.STP_Active = 1 AND SPR.STP_StartDate <= CONVERT(VARCHAR(10), GETDATE(), 101) 
                 AND SPR.STP_EndDate >= CONVERT(VARCHAR(10), GETDATE(), 101) AND SPR.STP_UserID = " + SiteUserId + @"
            LEFT JOIN STR_PlacesXPackageWeight PPW ON PPW.SPPW_parentPlace = PHI.STRID AND PPW.SPPW_PackageID = PRI.PDLID 
                 AND PPW.SPPW_Active = 1 AND PPW.SPPW_MasterContentID = 0 
            WHERE PXP.CXZ_Active = 1 And PRI.PDL_Active = 1 AND PRI.PDL_NoWeb = 0 And PRO.SPD_Active = 1 AND PRO.SPD_ProductTypeSysCode = 34 
                 AND PRO.SPD_InternalComments LIKE '%" + InternalComments + @"%'  And PRO.SPD_StarratingSysCode <> 541 AND PHI.STR_PlaceActive = 1 
                 AND PHI.STR_UserID = " + SiteUserId + @" AND PHI.STR_NoWeb = 0 AND PHI.STR_ProdKindID = 0 AND PHI.STR_PlaceID in (" + placeID + @") and PDL_Title NOT LIKE 'Zpend%'";
        }

        public static string sqlPlacesFromSTR(string strIds)
        {
            return @"SELECT  p1.STR_PlaceID as PlcID, p1.STR_PlaceTitle as PlcNA, p1.STR_PlaceTypeID as PlcTY,isnull(p1.STR_PlaceAIID,1000) as PlcRK, p2.STR_PlaceTitle as CouNA, p2.STR_PlaceID as CouID 
           FROM STR_Places_Hierarchy p1 
           INNER JOIN STR_Places_Hierarchy p2 ON p2.STR_PlaceID = p1.STR_Place1ParentID OR p2.STR_PlaceID = p1.STR_Place2ParentID 
           WHERE p1.STR_UserID = " + SiteUserId + @" And p1.STR_PlaceActive = 1 AND p1.STR_PlaceTypeID in (1, 25, 6, 2) AND p1.STR_NoWeb = 0 
               AND p1.STR_ProdKindID = 0 AND p1.STR_PlaceID IN (" + strIds + @") AND p2.STR_UserID = " + SiteUserId + @"
               AND p2.STR_PlaceTypeID = 5 AND p2.STR_NoWeb = 0 AND p2.STR_PlaceActive = 1 AND p1.STR_PlaceTitle not like 'zz%' AND p1.STR_PlaceTitle not like 'zPend%'";
        }

        public static string sqlGetPacksByPlaceID_IdsOnly(string PlaceId, string Filter)
        {
            return @"SELECT a.PDLID, a.NoOfFeed, a.PDL_Places, a.Duration, a.STP_Save FROM (Select DISTINCT PRI.PDLID
           ,(SELECT COUNT (CF.PCCID) FROM PRD_CustomerComment CF with (nolock) INNER JOIN RSV_Heading CFH with (nolock) ON CF.PCC_BookingID = CFH.ID 
           WHERE(CF.PCC_PDLID = PRI.PDLID) AND LEN(cast(CF.PCC_Comment as varchar(8000))) > 20 AND CF.PCC_Active = 1 AND CF.PCC_Block = 0) as NoOfFeed 
           ,CASE WHEN SPR.STP_NumOfNights is null then PRI.PDL_Duration ELSE SPR.STP_NumOfNights END as Duration, SPR.STP_Save, PRI.PDL_Title, PRI.PDL_Places 
           ,PRO.SPD_InternalComments
            FROM PRD_PlaceXProductItem PXP with (nolock)
            LEFT Join STR_Places_Hierarchy PHI with (nolock) ON PHI.STR_PlaceID = PXP.CXZ_ChildPlaceID
            INNER JOIN PRD_ProductItem PRI with (nolock) ON PRI.PDLID = PXP.CXZ_ProductItem 
            INNER Join PRD_Product PRO with (nolock) ON PRO.SPDID = PRI.PDL_ProductID
            LEFT Join STR_SitePromotion SPR with (nolock) ON SPR.STP_ProdItemID =PRI.PDLID AND SPR.STP_Active = 1
            AND SPR.STP_StartDate <= CONVERT(VARCHAR(10), GETDATE(), 101) AND SPR.STP_EndDate >= CONVERT(VARCHAR(10), GETDATE(), 101)
            AND SPR.STP_UserID = " + SiteUserId + @"
            LEFT JOIN PRD_ProductXImages Pic2 with (nolock) ON Pic2.PXI_ProductID = PRI.PDL_ProductID AND Pic2.PXI_Sequence = 0 AND Pic2.PXI_Active = 1
            LEFT JOIN APP_Images Pic3 with (nolock) ON Pic3.IMGID = Pic2.PXI_ImageID
            WHERE PXP.CXZ_Active = 1 AND Pic3.IMG_Active = 1 AND PRI.PDL_Active = 1 AND PRI.PDL_NoWeb = 0 AND PRO.SPD_Active = 1 AND PRO.SPD_ProductTypeSysCode = 34
                AND PHI.STR_UserID = " + SiteUserId + @" AND PHI.STR_NoWeb = 0 AND PHI.STR_ProdKindID = 0 AND PHI.STR_PlaceID in (" + PlaceId + @")
                AND PRO.SPD_InternalComments LIKE '%" + InternalComments + @"%' AND PRO.SPD_StarratingSysCode <> 541 AND PHI.STR_PlaceActive = 1
                AND PDL_Title NOT LIKE 'Zpend%') a" + Filter;
        }

        public static string sqlGetPacksFindItinPage(string placeID, string packsIds, string OrderVal = "")
        {
            string sqlPackIdeas = @"Select PRI.PDLID, PRI.PDL_Title, PRI.PDL_Content, PRI.PDL_SequenceNo, PRI.PDL_Places
          ,case when SPR.STP_NumOfNights is null then PRI.PDL_Duration else SPR.STP_NumOfNights end as STP_NumOfNights, PRO.SPD_Description ,SPD_InternalComments ,cast(isnull(SPR.STP_Save,9999) as Money) as STP_save
          ,isNull(PPW.SPPW_Weight, 999) as SPPW_Weight 
          ,(SELECT COUNT (CF.PCCID) as NoOfFeed FROM PRD_CustomerComment CF with (nolock) INNER JOIN RSV_Heading CFH with (nolock) ON CF.PCC_BookingID = CFH.ID
            WHERE CF.PCC_PDLID = PRI.PDLID AND LEN(cast(CF.PCC_Comment as varchar(8000))) > 20
                AND CF.PCC_Active = 1 AND CF.PCC_Block = 0) as NoOfFeed, Pic3.IMG_Path_URL, SPR.STP_StartTravelDate, PLC.PLC_Title, SPR.STP_MiniTitle
          ,(SELECT TOP 1 PT.PWT_TemplateValue FROM PRD_ProductItemXwebTemplate PWT with (nolock) INNER JOIN PRD_ProductWebTemplate PT with (nolock) ON PWT.PPWT_TemplateID = PT.PWTID 
               WHERE PWT.PPWT_ProdItemID = PRI.PDLID AND PWT.PPWT_Active = 1 AND PT.PWT_Active = 1 ORDER BY PT.PWT_TemplateValue DESC) as WebTemplate 
           ,isnull((select top 1 [STR_PlaceTitle] from [dbo].[STR_Places_Hierarchy] ph where ph.[STR_PlaceID] = pro.[SPD_CountryPlaceID] and ph.[STR_NoWeb]=0 and ph.[STR_PlaceActive]=1),'none') as CountryName
           FROM PRD_PlaceXProductItem PXP with (nolock) 
           LEFT Join STR_Places_Hierarchy PHI with (nolock) ON PHI.STR_PlaceID = PXP.CXZ_ChildPlaceID
           INNER JOIN PRD_ProductItem PRI with (nolock) ON PRI.PDLID = PXP.CXZ_ProductItem 
           INNER Join PRD_Product PRO with (nolock) ON PRO.SPDID = PRI.PDL_ProductID
           LEFT Join STR_SitePromotion SPR with (nolock) ON SPR.STP_ProdItemID =PRI.PDLID AND SPR.STP_Active = 1
           AND SPR.STP_StartDate <= CONVERT(VARCHAR(10), GETDATE(), 101) AND SPR.STP_EndDate >= CONVERT(VARCHAR(10), GETDATE(), 101)
           AND SPR.STP_UserID = " + SiteUserId + @"
           LEFT JOIN PRD_Place PLC with (nolock) ON PLC.PLCID = SPR.STP_FromPlaceID and (PLC.PLC_PlaceTypeID = 1) AND (PLC.PLC_Active = 1)
           LEFT JOIN STR_PlacesXPackageWeight PPW with (nolock) ON PPW.SPPW_parentPlace = PHI.STRID AND PPW.SPPW_PackageID = PRI.PDLID
                AND PPW.SPPW_Active = 1 AND PPW.SPPW_MasterContentID = 0
           LEFT JOIN PRD_ProductXImages Pic2 with (nolock) ON Pic2.PXI_ProductID = PRI.PDL_ProductID AND Pic2.PXI_Sequence = 0 AND Pic2.PXI_Active = 1
           LEFT JOIN APP_Images Pic3 with (nolock) ON Pic3.IMGID = Pic2.PXI_ImageID
           WHERE PXP.CXZ_Active = 1 AND Pic3.IMG_Active = 1 AND PRI.PDL_Active = 1 AND PRI.PDL_NoWeb = 0 AND PRO.SPD_Active = 1 AND PRO.SPD_ProductTypeSysCode = 34
               AND PHI.STR_UserID = " + SiteUserId + @" AND PHI.STR_NoWeb = 0 AND PHI.STR_ProdKindID = 0 AND PHI.STR_PlaceID in (" + placeID + @")
               AND PRO.SPD_InternalComments LIKE '%" + InternalComments + @"%' AND PRO.SPD_StarratingSysCode <> 541 AND PHI.STR_PlaceActive = 1
               AND PDL_Title NOT LIKE 'Zpend%' AND PRI.PDLID in (" + packsIds + @")";

            switch (OrderVal)
            {
                case "0":
                    sqlPackIdeas = sqlPackIdeas + " ORDER BY case when cast(SPR.STP_Save as Money) > 0 then 11 else 0 end desc, 11 desc, cast(isnull(STP_Save,9999) as Money), case when SPR.STP_NumOfNights is null then PRI.PDL_Duration else SPR.STP_NumOfNights end, PDL_Title";
                    break;
                case "1":
                    sqlPackIdeas = sqlPackIdeas + " ORDER BY case when cast(SPR.STP_Save as Money) > 0 then case when SPR.STP_NumOfNights is null then PRI.PDL_Duration else SPR.STP_NumOfNights end else 9999 end " + ",case when SPR.STP_NumOfNights is null then PRI.PDL_Duration else SPR.STP_NumOfNights end, NoOfFeed DESC, cast(isnull(STP_Save,9999) as Money), PDL_Title";
                    break;
                case "2":
                    sqlPackIdeas = sqlPackIdeas + " ORDER BY cast(isnull(SPR.STP_Save,9999) as Money), NoOfFeed DESC, case when SPR.STP_NumOfNights is null then PRI.PDL_Duration else SPR.STP_NumOfNights end, PDL_Title";
                    break;
                case "3":
                    sqlPackIdeas = sqlPackIdeas + " ORDER BY cast(SPR.STP_Save as Money) DESC, NoOfFeed DESC, case when SPR.STP_NumOfNights is null then PRI.PDL_Duration else SPR.STP_NumOfNights end, PDL_Title";
                    break;
                case "4":
                    sqlPackIdeas = sqlPackIdeas + " ORDER BY case when cast(SPR.STP_Save as Money) > 0 then PDL_Title else 'ZZZZZ' end, PDL_Title, NoOfFeed DESC, cast(SPR.STP_Save as Money), case when SPR.STP_NumOfNights is null then PRI.PDL_Duration else SPR.STP_NumOfNights end";
                    break;
            }

            return sqlPackIdeas;
        }
        public static string SQL_TripsTakenCustomerFeedbacksMob(string ids)
        {
    //        return @"select * from(
    //            SELECT CF.PCCID, CF.PCC_Comment, CF.PCC_CustomerName, CF.PCC_Itinerary, pri.PDLID, pri.PDL_Title, isnull(SPR.STP_Save,9999) as STP_save 
    //         ,(SELECT COUNT (CF.PCCID) FROM PRD_CustomerComment CF WHERE CF.PCC_PDLID = PRI.PDLID AND CF.PCC_Comment is not null AND LEN(cast(CF.PCC_Comment as varchar(8000))) > 15 AND CF.PCC_Active = 1 AND CF.PCC_Block = 0) as NoOfFeed 
    //         ,pri.PDL_Places, p1.Str_placeTitle, p1.Str_PlaceId, p1.Str_PlaceTypeId, row_number() Over(ORDER BY CF.PCCID DESC) as N 
    //         FROM PRD_CustomerComment CF 
    //         inner join RSV_Heading CFH with (nolock) ON CF.PCC_BookingID = CFH.ID 
    //         inner join PRD_ProductItem PRI ON PRI.PDLID=cf.PCC_PDLID 
    //         left join STR_SitePromotion SPR ON SPR.STP_ProdItemID=PRI.PDLID AND SPR.STP_Active = 1 AND SPR.STP_StartDate <= Convert(VARCHAR(10), GETDATE(), 101) And SPR.STP_EndDate >= Convert(VARCHAR(10), GETDATE(), 101) And SPR.STP_UserID =  243
    //         inner join STR_Places_Hierarchy p1 on charindex(','+convert(varchar(10),p1.Str_PlaceID)+',', ','+replace(PRI.PDL_places,' ',''))>0 
    //                and p1.STR_NoWeb = 0 AND p1.STR_PlaceActive = 1 AND p1.STR_ProdKindID = 0 AND p1.STR_PlaceTypeID in (25, 1, 6, 5) AND p1.STR_UserID =  243
    //         Where p1.STR_PlaceID = 71) x
			 //where N between ((" + page + @"-1)*10)+1 and " + page + @"*10
    //         Order by PCCID desc";
                return @"select PCCID, PCC_Comment, PCC_CustomerName, PCC_Itinerary, PDLID, PDL_Title, PDL_Places, isnull(STP_Save,9999) as STP_save
                ,(SELECT COUNT (CF.PCCID) FROM PRD_CustomerComment CF WHERE CF.PCC_PDLID = PRI.PDLID AND CF.PCC_Comment is not null AND LEN(cast(CF.PCC_Comment as varchar(8000))) > 15 AND CF.PCC_Active = 1 AND CF.PCC_Block = 0) as NoOfFeed 
                             ,pri.PDL_Places, plc.PDL_PlacesTitle
                from PRD_CustomerComment CF 
                inner join PRD_ProductItem Pri on PCC_PDLID = pri.PDLID 
                left join STR_SitePromotion SPR ON SPR.STP_ProdItemID=PRI.PDLID AND SPR.STP_Active = 1 AND SPR.STP_StartDate <= Convert(VARCHAR(10), GETDATE(), 101) And SPR.STP_EndDate >= Convert(VARCHAR(10), GETDATE(), 101) And SPR.STP_UserID =  243
                outer apply (select(select Str_placeTitle + ','  from dbo.iter_charlist_to_table(PDL_PLaces, DEFAULT) s
                inner join STR_Places_Hierarchy p1 on s.nstr = Str_PlaceID 
                where STR_NoWeb = 0 and STR_PlaceActive = 1 and STR_ProdKindID = 0 AND STR_PlaceTypeID in (25, 1, 6, 5) AND STR_UserID =  243
                for xml path('')
                ) as PDL_PlacesTitle
                ) plc   
                where PCCID in (" + ids + @")
                order by PCCID desc";
        }

        public static string SQL_TripsTakenCustomerFeedbacksIds(string countryId)
        {
            return @"Select CF.PCCID as Id 
               From STR_Places_Hierarchy PLCO 
               inner join PRD_PlaceXProductItem pXp on pXp.CXZ_ChildPlaceID = PLCO.STR_PlaceID and pXp.CXZ_Active = 1 
               inner join PRD_ProductItem pri ON pXp.CXZ_ProductItem = pri.PDLID and pri.PDL_NoWeb = 0 and pri.PDL_Active = 1 
               inner join PRD_CustomerComment CF on pri.PDLID = CF.PCC_PDLID 
               inner join RSV_Heading CFH with (nolock) ON CF.PCC_BookingID = CFH.ID 
               Where PLCO.STR_PlaceID = " + countryId + @"  and PLCO.STR_UserID =  243
                     and PLCO.STR_NoWeb = 0 and PLCO.STR_PlaceActive = 1 and PLCO.STR_PlaceTypeID = 5 and PLCO.STR_ProdKindID = 0 
                     and datalength(CF.PCC_Comment) > 15 and CF.PCC_Active = 1 and CF.PCC_Block = 0 
                     ORDER BY PCCID desc";
        }
        public static string SQL_PackageMediumInformation(int id)
        {
            return @"Select PRI.PDLID, PRI.PDL_Title, PRI.PDL_Places, cast(isnull(SPR.STP_Save,9999) as money) as STP_save, 
                PLH.STR_PlaceTitle as CountryName, PLH.STR_PlaceID as CountryId, PRO.SPD_InternalComments
                From PRD_ProductItem PRI 
                INNER JOIN PRD_Product PRO ON PRO.SPDID = PRI.PDL_ProductID 
                LEFT JOIN STR_SitePromotion SPR ON SPR.STP_ProdItemID = PRI.PDLID 
                AND (SPR.STP_UserID =  243 ) 
                   AND (SPR.STP_StartDate <= CONVERT(VARCHAR(10), GETDATE(), 101)) AND (SPR.STP_EndDate >= CONVERT(VARCHAR(10), GETDATE(), 101))
                   AND (SPR.STP_Active = 1)
                LEFT JOIN STR_Places_Hierarchy PLH ON PLH.STR_PlaceID = PRO.SPD_CountryPlaceID 
                   AND PLH.STR_PlaceActive = 1 AND PLH.STR_PlaceTypeID = 5 AND plh.STR_ProdKindId=0 
                   AND PLH.STR_UserID =  243
                WHERE PRI.PDLID = " + id + @" AND PRI.PDL_Active = 1 AND pri.PDL_NoWeb = 0";
        }

        public static string SQL_PlaceNames(string placeIds)
        {
            return @"SELECT STR_PlaceTitle as Name, STR_PlaceTypeID as PlaceType, STR_PlaceID as Id From STR_Places_Hierarchy
                WHERE STR_PlaceID in ( " + placeIds + @")
                  AND STR_PlaceActive = 1 AND STR_NoWeb = 0 AND STR_PlaceTypeID <>3 AND STR_ProdKindID = 0 AND STR_UserID =  243
                  AND STR_PlaceTitle not like 'zz%'";
        }

        public static string SQL_Get_NumberOfPackageFeedbacks_Per_OverAllScore(int packId)
        {
            return @"SELECT isnull(convert(varchar(10),PCC_OverallScore),'NotRated') as Name, count(CF.PCCID) as Id 
               FROM PRD_CustomerComment cf 
               WHERE CF.PCC_PDLID = " + packId + @" AND CF.PCC_Active = 1 and PCC_Block=0 and CF.PCC_DetailID = 0 AND datalength(CF.PCC_Comment) > 15 
               Group by PCC_OverallScore order by PCC_OverallScore";

        }
        public static string SQL_PackageSimilarPackages(int packId, string packPlacesIds, int countryId)
        {
            string[] strs = packPlacesIds.Split(",", StringSplitOptions.RemoveEmptyEntries);
            string charindexClause_AND = "";
            string charindexClause_OR = "";
            for (var i = 0; i <= strs.Length - 1; i++)
            {
                charindexClause_AND = charindexClause_AND + (i == 0 ? "" : " AND ") + "charindex('," + strs[i].Trim() + ",',','+replace(PRI.PDL_Places,' ',''))<>0";
            }
            for (var j = 0; j <= strs.Length - 1; j++)
            {
                charindexClause_OR = charindexClause_OR + (j == 0 ? "(" : " OR ") + "charindex('," + strs[j].Trim() + ",',','+replace(PRI.PDL_Places,' ',''))<>0";
            }
            charindexClause_OR = charindexClause_OR + ")";

            return @"declare @Packs table(PDLID bigint, PDL_Title varchar(255), NoOfFeed int, PackWeight int, MainOrder int) 
         insert into @Packs 
         SELECT PRI.PDLID, PRI.PDL_Title, (SELECT count(CF.PCCID) FROM PRD_CustomerComment CF WHERE CF.PCC_PDLID = PRI.PDLID AND datalength(CF.PCC_Comment) > 15 AND CF.PCC_Active = 1 AND CF.PCC_Block = 0) as NoOfFeed, PXW.PIPW_Weight as ppw, 1 as MainOrder 
         FROM PRD_ProductItemXPackageWeight PXW 
         inner JOIN PRD_ProductItem PRI ON PRI.PDLID = PXW.PIPW_PackageID AND PRI.PDL_Active = 1 
         inner JOIN PRD_Product PRO ON PRO.SPDID = PRI.PDL_ProductID  AND PRO.SPD_Active = 1 
         inner JOIN  STR_SitePromotion STRP ON STRP.STP_ProdItemID = PXW.PIPW_PackageID AND STRP.STP_UserID =  243  AND STRP.STP_Active = 1 AND STRP.STP_StartDate <= Convert(VARCHAR(10), GETDATE(), 101) AND STRP.STP_EndDate >= CONVERT(VARCHAR(10), GETDATE(), 101) 
         WHERE PXW.PIPW_ProductItemID = " + packId + @"  AND PXW.PIPW_Active = 1 and pri.PDL_NoWeb = 0 
		 insert into @Packs 
         Select PRI.PDLID, PRI.PDL_Title, (SELECT COUNT (CF.PCCID) FROM PRD_CustomerComment CF WHERE CF.PCC_PDLID = PRI.PDLID AND datalength(CF.PCC_Comment) > 15 AND CF.PCC_Active = 1 AND CF.PCC_Block = 0) as NoOfFeed, isNull(PPW.SPPW_Weight, 999) as SPPW_Weight, 2 as MainOrder 
         FROM PRD_PlaceXProductItem PXP 
         inner Join STR_Places_Hierarchy PHI ON PHI.STR_PlaceID = PXP.CXZ_ChildPlaceID 
         INNER JOIN PRD_ProductItem PRI ON PRI.PDLID = PXP.CXZ_ProductItem AND PRI.PDL_Active = 1 AND PRI.PDL_NoWeb = 0 
         INNER Join PRD_Product PRO ON PRO.SPDID = PRI.PDL_ProductID 
         inner Join STR_SitePromotion SPR ON SPR.STP_ProdItemID =PRI.PDLID AND SPR.STP_Active = 1 AND SPR.STP_UserID =  243  AND SPR.STP_StartDate <= CONVERT(VARCHAR(10), GETDATE(), 101) AND SPR.STP_EndDate >= CONVERT(VARCHAR(10), GETDATE(), 101) 
         LEFT JOIN STR_PlacesXPackageWeight PPW ON PPW.SPPW_parentPlace = PHI.STRID AND PPW.SPPW_PackageID = PRI.PDLID AND PPW.SPPW_Active = 1 AND PPW.SPPW_MasterContentID = 0 
         WHERE PXP.CXZ_Active = 1 And PHI.STR_PlaceActive = 1 And PHI.STR_UserID =  243  And PHI.STR_NoWeb = 0 And PHI.STR_ProdKindID = 0 And PHI.STR_PlaceID = " + countryId + @" AND PRO.SPD_Active = 1 AND PRO.SPD_ProductTypeSysCode = 34 AND PRO.SPD_InternalComments LIKE '%:.ED%' AND PRO.SPD_StarratingSysCode <> 541 And PRI.PDLID<> " + packId + @" And SPPW_Weight < 999
         AND " + charindexClause_AND + @"
		 insert into @Packs 
         Select PRI.PDLID, PRI.PDL_Title, (SELECT COUNT (CF.PCCID) FROM PRD_CustomerComment CF WHERE CF.PCC_PDLID = PRI.PDLID AND datalength(CF.PCC_Comment) > 15 AND CF.PCC_Active = 1 AND CF.PCC_Block = 0) as NoOfFeed, isNull(PPW.SPPW_Weight, 999) as SPPW_Weight, 3 as MainOrder 
         FROM PRD_PlaceXProductItem PXP 
         inner Join STR_Places_Hierarchy PHI ON PHI.STR_PlaceID = PXP.CXZ_ChildPlaceID 
         INNER JOIN PRD_ProductItem PRI ON PRI.PDLID = PXP.CXZ_ProductItem AND PRI.PDL_Active = 1 AND PRI.PDL_NoWeb = 0 
         INNER Join PRD_Product PRO ON PRO.SPDID = PRI.PDL_ProductID 
         inner Join STR_SitePromotion SPR ON SPR.STP_ProdItemID =PRI.PDLID AND SPR.STP_Active = 1 AND SPR.STP_UserID =  243  AND SPR.STP_StartDate <= CONVERT(VARCHAR(10), GETDATE(), 101) AND SPR.STP_EndDate >= CONVERT(VARCHAR(10), GETDATE(), 101) 
         LEFT JOIN STR_PlacesXPackageWeight PPW ON PPW.SPPW_parentPlace = PHI.STRID AND PPW.SPPW_PackageID = PRI.PDLID AND PPW.SPPW_Active = 1 AND PPW.SPPW_MasterContentID = 0 
         WHERE PXP.CXZ_Active = 1 And PHI.STR_PlaceActive = 1 And PHI.STR_UserID =  243  And PHI.STR_NoWeb = 0 And PHI.STR_ProdKindID = 0 And PHI.STR_PlaceID = " + countryId + @" AND PRO.SPD_Active = 1 AND PRO.SPD_ProductTypeSysCode = 34 AND PRO.SPD_InternalComments LIKE '%:.ED%' AND PRO.SPD_StarratingSysCode <> 541 and PRI.PDLID<> " + packId + @" and SPPW_Weight<999
         AND " + charindexClause_OR + @"
		 select top 12 p1.PDLID, p1.PDL_Title, p1.NoOfFeed from @Packs p1 where p1.MainOrder = (select min(p2.MainOrder) from @Packs p2 where p1.PDLID=p2.PDLID) and p1.NoOfFeed>0 order by p1.MainOrder, p1.NoOfFeed desc";
        }


        public static string SQL_PackCustomerrFeeds(int packId, int page)
        {
            return @"with Comments as 
        (SELECT CF.PCCID, CF.PCC_Comment, CF.PCC_CustomerName, CF.PCC_Itinerary, CFH.dep_date, isnull(cf.[PCC_OverallScore],-999) as OverallScore
		,row_number() over (ORDER BY CFH.dep_date Desc) as n
		FROM PRD_CustomerComment CF inner join RSV_Heading CFH with (nolock) ON CF.PCC_BookingID = CFH.ID 
         Where CF.PCC_PDLID= " + packId + @"  and CF.PCC_Active=1 and CF.PCC_Block = 0 )
         select PCCID, PCC_Comment, PCC_CustomerName, PCC_Itinerary, dep_date, OverallScore from Comments 
         where n between ( " + page + @" -1) *  10  + 1 and " + page + @" *  10  order by n";
        }

        public static string SQL_PackageCountry(string packIds)
        {
            return @"select Country.CountryName As coun,pri.PDLID as Id
                  ,case when charindex(':.ED',p.SPD_InternalComments)<>0 then 'europe'
	                    when charindex(':LD',p.SPD_InternalComments)<>0 then 'latin'
	                    when charindex(':.TW',p.SPD_InternalComments)<>0 then 'asia'
                        when charindex(':.TM - Luxury',p.SPD_InternalComments)<>0 then 'luxury'
                  end as Region
            from PRD_ProductItem pri 
            inner join PRD_Product p on pri.PDL_ProductID = p.SPDID and p.SPD_Active = 1 
            outer apply (Select top 1 PLCO.STR_PlaceTitle as CountryName 
                         From STR_Places_Hierarchy PLCO 
                         Where PLCO.STR_PlaceID = p.SPD_CountryPlaceID and PLCO.STR_PlaceActive = 1 AND PLCO.STR_NoWeb = 0 and plco.Str_UserId in (243,595,182) 
                         Order By plco.Str_PlacePriority) as Country
            where pdlid in (" + packIds + @")";
        }

        public static string SQL_GetItineraryFromPriceId(string priceId)
        {
            return @"select REDID as Id, RED_Itinerary as Name from RBT_ED where REDID=" + priceId;
        }

        public static string sqlGetCombineByCouID_IdsOnly(string placeId)
        {
            return @"SELECT a.PDLID, a.NoOfFeed FROM (Select PRI.PDLID
            ,(SELECT COUNT (CF.PCCID) FROM PRD_CustomerComment CF with (nolock) INNER JOIN RSV_Heading CFH with (nolock) ON CF.PCC_BookingID = CFH.ID 
             WHERE(CF.PCC_PDLID = PRI.PDLID) AND LEN(cast(CF.PCC_Comment as varchar(8000))) > 20 AND CF.PCC_Active = 1 AND CF.PCC_Block = 0) as NoOfFeed 
            ,CASE WHEN SPR.STP_NumOfNights is null then PRI.PDL_Duration ELSE SPR.STP_NumOfNights END as Duration, SPR.STP_Save, PRI.PDL_Title, PRI.PDL_Places 
            ,PRO.SPD_InternalComments
             FROM PRD_PlaceXProductItem PXP with (nolock)
             LEFT Join STR_Places_Hierarchy PHI with (nolock) ON PHI.STR_PlaceID = PXP.CXZ_ChildPlaceID
             INNER JOIN PRD_ProductItem PRI with (nolock) ON PRI.PDLID = PXP.CXZ_ProductItem 
             INNER Join PRD_Product PRO with (nolock) ON PRO.SPDID = PRI.PDL_ProductID
             LEFT Join STR_SitePromotion SPR with (nolock) ON SPR.STP_ProdItemID =PRI.PDLID AND SPR.STP_Active = 1
             AND SPR.STP_StartDate <= CONVERT(VARCHAR(10), GETDATE(), 101) AND SPR.STP_EndDate >= CONVERT(VARCHAR(10), GETDATE(), 101)
             AND SPR.STP_UserID = " + SiteUserId + @"
             LEFT JOIN STR_PlacesXPackageWeight PPW with (nolock) ON PPW.SPPW_parentPlace = PHI.STRID AND PPW.SPPW_PackageID = PRI.PDLID
             AND PPW.SPPW_Active = 1 AND PPW.SPPW_MasterContentID = 0
             LEFT JOIN PRD_ProductXImages Pic2 with (nolock) ON Pic2.PXI_ProductID = PRI.PDL_ProductID AND Pic2.PXI_Sequence = 0 AND Pic2.PXI_Active = 1
             LEFT JOIN APP_Images Pic3 with (nolock) ON Pic3.IMGID = Pic2.PXI_ImageID
             WHERE PXP.CXZ_Active = 1 AND Pic3.IMG_Active = 1 AND PRI.PDL_Active = 1 AND PRI.PDL_NoWeb = 0 AND PRO.SPD_Active = 1 AND PRO.SPD_ProductTypeSysCode = 34
             AND PHI.STR_UserID =  " + SiteUserId + @"  AND PHI.STR_NoWeb = 0 AND PHI.STR_ProdKindID = 0 AND PHI.STR_PlaceID in ( " + placeId + @" )
             AND PRO.SPD_InternalComments LIKE '%" + InternalComments + @"%' AND PRO.SPD_StarratingSysCode <> 541 AND PHI.STR_PlaceActive = 1
             AND PDL_Title NOT LIKE 'Zpend%') a 
		     WHERE ((cast(STP_Save as Money) >= 0 AND cast(isnull(STP_Save,9999) as Money)<>9999) )  
		     ORDER BY case when cast(STP_Save as Money) > 0 then 2 else 0 end desc, 2 desc, cast(isnull(STP_Save,9999) as Money), Duration, a.PDL_Title";
        }

        public static string SQL_CMSContent(string CMSIds)
        {
            return @"Select * From CMS_WebsiteContent Where CMS_Active = 1 AND CMSID in (" + CMSIds + @")";
        }

        public static string SQL_CustomerFeedbacksSortedByPage(string PackageId, string Page, string Order, string rating)
        {
            string selectClause = @"with Comments as (SELECT CF.PCCID, CF.PCC_Comment, CF.PCC_CustomerName, CF.PCC_Itinerary, CFH.dep_date, isnull(cf.[PCC_OverallScore],-999) as OverallScore ";

            switch (Order)
            {
                case "1":
                    selectClause = selectClause + " ,row_number() over (ORDER BY CFH.dep_date Desc) as n";
                    break;
                case "2":
                    selectClause = selectClause + " ,row_number() over (ORDER BY CFH.gross_ttl Desc) as n ";
                    break;
                case "3":
                    selectClause = selectClause + " ,row_number() over (ORDER BY CFH.gross_ttl) as n ";
                    break;
                case "4":
                    selectClause = selectClause + " ,row_number() over (ORDER BY datediff(day, cfh.[ret_date], [dep_date]) Desc) as n ";
                    break;
            }
            selectClause = selectClause + " FROM PRD_CustomerComment CF inner join RSV_Heading CFH with (nolock) ON CF.PCC_BookingID = CFH.ID ";
            selectClause = selectClause + " Where CF.PCC_PDLID= " + PackageId + " and CF.PCC_Active=1 and CF.PCC_Block = 0 and isnull(cf.[PCC_OverallScore],-999) in (" + rating + "))";
            selectClause = selectClause + " select PCCID, PCC_Comment, PCC_CustomerName, PCC_Itinerary, dep_date, OverallScore from Comments ";
            selectClause = selectClause + " where n between (" + Page + "-1) * 10 + 1 and " + Page + " * 10 order by n";
            return selectClause;
        }

        public static string SQL_BookingTest(Int64 BookingId, string Email)
        {
            return @"SELECT agency, txt1, dept FROM RSV_Heading WHERE ID = " + BookingId + " and txt1 like '" + Email + "%'";
        }

        public static string SQL_Booking_PrePubReview(Int64 BookingId)
        {
            return @"SELECT [TCFID] as Id, pcp.[TCF_BookingID] as BookingID, pcp.[TCF_EmailAddress] as EmailAddress, pcp.[TCF_CustomerComment] as CustomerComment 
                 ,pcp.[TCF_OverallScore] as OverallScore, pcp.[TCF_UseUsAgain] as UseUsAgain, pcp.[TCF_CustomerServiceScore] as CustomerServiceScore 
                 ,pcp.[TCF_WSandBPScore] as WSandBPScore, pcp.[TCF_FlightsScore] as FlightsScore, pcp.[TCF_HotelsScore] as HotelsScore, pcp.[TCF_TransfersScore] as TransfersScore 
                 ,pcp.[TCF_ActivitiesScore] as ActivitiesScore, pcp.[TCF_CarRentalScore] as CarRentalScore, pcp.[TCF_TrainsScore] as TrainsScore, pcp.[TCF_FerriesScore] as FerriesScore 
                 ,pcp.[TCF_FeedbackProcessed] as FeedbackProcessed, pcp.[TCF_FeedbackReceived] as FeedbackReceived 
                 FROM [dbo].[PRD_CustomerComment_PrePublished] pcp 
                 left join [dbo].[PRD_CustomerComment] pc on pcp.[TCF_BookingID]=pc.[PCC_BookingID] and pc.PCC_Active=1 and pc.PCC_Block=0 
                 Where pcp.TCF_BookingID=" + BookingId + " and pcp.[TCF_Active]=1";
        }

        public static string SQL_BookingServices(Int64 BookingId)
        {
            return @" select b.service as Id
                 ,case when s.scd_CodeTitle like 'Air Travel' then 'Flights' 
                       when s.scd_CodeTitle like 'Hotel' then 'Hotels'
                       when s.scd_CodeTitle like 'Rental Cars' then 'Car Rentals' 
                	    when s.scd_CodeTitle in ('Canal Barging','River Cruises','Cruise')  then 'Ferries' 
                       when s.scd_CodeTitle like 'Sightseeing Tours' then 'Activities'
                 	    when s.scd_CodeTitle like 'Transfers' and s1.scd_CodeTitle like '%Train%' then 'Trains' 
                	    when s.scd_CodeTitle like 'Transfers' and (s1.scd_CodeTitle like '%Ferry%' or s1.scd_CodeTitle like '%Boat%') then 'Ferries' 
                       when s.scd_CodeTitle like 'Transfers' and (s1.scd_CodeTitle like '%Air%') then 'Flights' 
                       when s.scd_CodeTitle like 'Transfers' and s1.scd_CodeTitle in ('Transfer IN','Transfer OUT') then 'Transfers' else s.scd_CodeTitle 
                  end as Name, s2.scd_CodeTitle as Rating 
                 from [dbo].[RSV_Bookingdetails]  b
                 inner join prd_productitem pit on pit.[PDLID]=b.[service] and pit.pdl_Active=1 
                 inner join [dbo].[PRD_Product] p on p.[SPDID]=pit.PDL_ProductID and p.[SPD_Active]=1
                 inner join [dbo].[SYS_Codes] s on s.[SCDID]=p.SPD_ProductTypeSysCode and s.scd_Active=1 and s.scd_CodeType=2
                 inner join [dbo].[SYS_Codes] s1 on s1.[SCDID]=p.SPD_ProductKindSysCode and s1.scd_Active=1
                 left join [dbo].[SYS_Codes] s2 on s2.[SCDID]=p.[SPD_StarRatingSysCode] and s2.scd_Active=1
                 where b.[bookingID] = " + BookingId + " and b.[service] Is Not null";
        }

        public static string SQL_ItinComponentList(string packId)
        {
            return @"SELECT SC.SCD_Code as Prod_Type
                , SyC.SCD_CodeTitle as Prod_KindTitle
                , PLH.STR_PlaceTitle as City_Name
                , PRO.SPD_StatePlaceID as City_ID
                , PRO.SPD_ProductTypeSysCode as Prod_Code
                , PRI.PDL_Title as Prod_Title
                , CL.cmp_LineNo as LineNum
                , CL.cmp_CitySeq as CitySeq
                , CL.cmp_RelativeDay as RelativeDay
                , CL.cmp_DaysDuration as DaysDuration
                , CL.cmp_NoOfAvailNite as NtsAvailable
                , CL.cmp_OverNite as OverNite
                , CL.cmp_PDLComponentID as ComponentID
                , CL.cmp_ProductFF1 as ProductFF1
                , CL.cmp_Notes as Notes
                , CL.cmp_MajorComponent as MajorComponent
                FROM PRD_ComponentList CL
                INNER JOIN PRD_ProductItem PRI ON PRI.PDLID = CL.cmp_PDLComponentID
                AND PRI.PDL_Active = 1
                INNER JOIN PRD_Product PRO ON PRO.SPDID = PRI.PDL_ProductID
                AND PRO.SPD_Active = 1
                INNER JOIN SYS_Codes SC ON SC.SCDID = PRO.SPD_ProductTypeSysCode
                AND SC.SCD_Active = 1
                INNER JOIN SYS_Codes SyC ON SyC.SCDID = PRO.SPD_ProductKindSysCode
                AND SyC.SCD_Active = 1
                INNER JOIN STR_Places_Hierarchy PLH ON PLH.STR_PlaceID = PRO.SPD_StatePlaceID
                AND PLH.STR_PlaceActive = 1 and PLH.Str_NoWeb=0 
                AND PLH.STR_UserID = 243
                WHERE CL.cmp_PDLParentID = " + packId + @"
                AND CL.cmp_Active = 1
                ORDER BY CL.cmp_LineNo, CL.cmp_CitySeq";
        }

        public static string SQL_DeptIdByBookId(string bookID)
        {
            return @"SELECT dept As Name
                FROM RSV_Heading 
                WHERE ID = " + bookID;
        }

        public static string SQL_RecommHotels(string plcID)
        {
            return @";with PLDIds(PDLID, GIPH_TNTournetName, GIPH_GIATAID, CXZ_ChildPlaceID, GIPH_TNTournetRating, N, N1) as 
                (select pxp.CXZ_ProductItem, gh.GIPH_TNTournetName, gh.GIPH_GIATAID, pxp.CXZ_ChildPlaceID, gh.GIPH_TNTournetRating, row_number() over(partition by pxp.CXZ_ChildPlaceID, gh.GIPH_GIATAID order by pxp.CXZ_ProductItem), row_number() over(partition by pxp.CXZ_ChildPlaceID, pIt.PDLID order by pxp.CXZ_ProductItem) from PRD_PlaceXProductItem pxp  
                inner join GIATA_GiataXProductItem gpi on gpi.GLT_PDLID = pxp.CXZ_ProductItem and gpi.GLT_Active=1 
                inner join GIATA_Hotels gh on gpi.GLT_GIPHID = gh.GIPHID and gh.GIPH_Active=1 and  gh.GIPH_TNNoWeb = 0  													
                inner join PRD_ProductItem pIt ON pIt.PDLID = gpi.GLT_PDLID and pIt.PDL_Active = 1 and pIt.PDL_NoWeb = 0 and pIt.PDL_Title NOT Like '-%' AND pIt.PDL_Title NOT Like 'Zblock%'  
                inner join Prd_Product PRO ON pro.SPDID = pIt.PDL_ProductID AND PRO.SPD_Active = 1 AND PRO.spd_producttypesyscode=3  
                where pxp.CXZ_ChildPlaceID in (" + plcID + @") and pxp.cxz_active=1)
                select pIds.PDLID, pIds.GIPH_TNTournetName as PDL_Title
	                   ,cast(isnull(PTY.PTY_Description, 'none') as varchar(3000)) as PTY_Description, PRI.PDL_SequenceNo, SYSC.SCD_Description, pIds.GIPH_TNTournetRating,PRO.SPD_StarRatingSysCode
                       ,case when(PRI.PDL_SequenceNo >= 50 and PRI.PDL_SequenceNo <= 59) then(PRI.PDL_SequenceNo - 50) else (PRI.PDL_SequenceNo + 50) end as Sorting,PRO.SPD_Features
              FROM PRD_PlaceXProductItem PXP
                inner join PLDIds pIds ON pXp.CXZ_ProductItem = pIds.PDLID and((pIds.n = 1 and GIPH_TNTournetName not like '%nights%' and GIPH_TNTournetName not like '% nts%') or(pIds.n1 = 1 and(GIPH_TNTournetName like '%nights%' or GIPH_TNTournetName like '% nts%') and GIPH_GIATAID = 0) )
                INNER JOIN PRD_ProductItem PRI ON PRI.PDLID = PXP.CXZ_ProductItem AND(PRI.PDL_Active = 1) AND(PRI.PDL_NoWeb = 0) and PRI.PDL_Title NOT Like '-%' AND PRI.PDL_Title NOT Like 'Zblock%'
                INNER JOIN Prd_Product PRO ON PRO.SPDID = PRI.PDL_ProductID AND(PRO.SPD_Active = 1) AND(PRO.SPD_Producttypesyscode = 3)
                left JOIN PRD_Property PTY ON PTY.PTY_ProductID = PRI.PDL_ProductID AND PTY.PTY_Active = 1
                INNER JOIN SYS_Codes SYSC ON SYSC.SCDID = PRO.SPD_StarRatingSysCode
                WHERE PXP.CXZ_ChildPlaceID in (" + plcID + @") AND PXP.CXZ_Active = 1
                ORDER BY Sorting, GIPH_TNTournetName";
        }

        public static string SQL_RecommSS(string plcID)
        {
            return @"SELECT DISTINCT PRI.PDLID,
                 PRI.PDL_Title,
                 isNull(SYSC.SCD_Description,'none') as SCD_Description,
                 cast(isnull(PRO.SPD_Description,'none') as varchar (3000)) as SPD_Description,
                 PRO.SPD_StarRatingSysCode,
                 PRI.PDL_SequenceNo,
                 case
                 when (PRI.PDL_SequenceNo >= 50 and PRI.PDL_SequenceNo <= 59) then (PRI.PDL_SequenceNo - 50)
                 else (PRI.PDL_SequenceNo + 50)
                 end as Sorting
                 FROM PRD_PlaceXProductItem PXP
                 INNER JOIN PRD_ProductItem PRI ON PRI.PDLID = PXP.CXZ_ProductItem
                 INNER JOIN Prd_Product PRO ON PRO.SPDID = PRI.PDL_ProductID
                 INNER JOIN SYS_Codes SYSC ON SYSC.SCDID = PRO.SPD_StarRatingSysCode
                 WHERE (PXP.CXZ_ChildPlaceID in (" + plcID + @"))
                 AND(PXP.CXZ_Active = 1 )
                 AND(PRI.PDL_Active = 1)
                 AND(PRI.PDL_NoWeb = 0) 
                 AND(PRO.SPD_Active = 1) 
                 AND(PRO.SPD_Producttypesyscode=152)
                 ORDER BY Sorting, PRI.PDL_Title";
        }

        public static string MySQL_RecentlyViewed(string VisitorId)
        {
            return @"set @row_number := 0;
                 select t1.UTS_ProductItemID, t1.UTS_URL, Max(t1.UTS_Date) UTS_Date, t1.UTS_Site, t1.num 
	            from
	            (
                SELECT
	            @row_number:=(CASE
	                WHEN @UTS_ProductItemID_no = UTS_ProductItemID
	                THEN @row_number + 1
	                ELSE 1
	                END) AS num,
	            @UTS_ProductItemID_no:= UTS_ProductItemID UTS_ProductItemID,
	            UTS_URL,
	            UTS_Date,
	            UTS_Site
	            FROM UT_Logs
	                Where UTS_Active = 1 And UTS_VisitorID = " + VisitorId + @" AND UTS_PageType in('PKG','mobilePKG','LUXPKG') and UTS_Site LIKE 'TM%'
                    ORDER BY UTS_Date Desc
	            ) t1
                Where t1.num in (0, 1) Group by UTS_ProductItemID ORDER BY UTS_Date  Desc Limit 3; ";
        }

        public static string MySQL_Visitor_NoOfVisits(string VisitorId)
        {
            return @"set @row_number := 0;
                select t1.UTS_VisitorID as Id from
               (
                SELECT
                    @row_number:=(CASE
                        WHEN @UTS_ProductItemID_no = UTS_ProductItemID 
			                THEN @row_number + 1
                        ELSE 1
                    END) AS num,
                    @UTS_ProductItemID_no:=UTS_ProductItemID UTS_ProductItemID,
                    UTS_URL,
                    UTS_Date,
                    UTS_Site, 
                    UTS_VisitorID
                FROM UT_Logs
                Where UTS_Active = 1 And UTS_VisitorID = " + VisitorId + @" AND (UTS_PageType = 'PKG' or UTS_PageType = 'mobilePKG') and UTS_Site LIKE 'TM%'
                ORDER BY UTS_Date Desc
                               ) t1
                      Where t1.num = 1
                      Group by t1.UTS_ProductItemID
                      ORDER BY UTS_Date  Desc Limit 3";
        }
        public static string SQL_WebAnnounce()
        {
            return @"SELECT WEBAID, WEBA_Msg
                FROM  SYS_WebAnnouncement
                WHERE WEBA_Active = 1";
        }
        public static string SQL_PackageHotelBlackoutsListMobile(string PackageId)
        {
            return @"SELECT convert(varchar(10),PIB_StartDate, 110) as StartDate, convert(varchar(10), PIB_EndDate, 110) as EndDate
                FROM PRD_ProductItemBlackOut where PIB_ProductItemID = " + PackageId + @"
                AND PIB_Active =1 AND PIB_CategoryID = 0";
        }
        public static string SQL_CountryHighlights(string placeID)
        {
            return @"Select PLD.STX_Title
                  , isnull(PLD.STX_URL,'none') as STX_URL
                  , isnull(PLD.STX_PictureURL,'none') as STX_PictureURL
                  , PLD.STX_ProdKindID
                  , PLD.STX_Priority
                  From STR_PlaceDescription PLD
                  Where(STX_UserID = 243 )
                  AND PLD.STX_Active = 1 AND PLD.STX_MasterContentID = 0 AND PLD.STX_PlaceId = " + placeID +
                  @"ORDER BY PLD.STX_ProdKindID, PLD.STX_Priority";
        }
        public static string SQL_CustomerFeedbackByPlaceID(string placeID)
        {
            return @";with comments as
                (
                SELECT CFH.dept, CF.PCC_Ranking, CF.PCC_Comment,CF.PCC_CustomerName,CF.PCC_Itinerary,CF.PCCID,CF.PCC_PDLID,isnull(CF.PCC_OverallScore,-999) as OverallScore
				, CAST(isnull(Price.Value,9999) as MONEY) as STP_Save, CFH.dep_date, CFP.PDL_Title,RelatePlaces.Value as RelatePlaces ,PLCO.STR_PlaceTitle as CountryName,PLCO.STR_PlaceID as CountryID 
                ,row_number() OVER(PARTITION BY PCC_PDLID ORDER BY PCC_PDLID) AS rn 
                FROM PRD_CustomerComment CF 
                INNER JOIN RSV_Heading CFH with (nolock) ON CF.PCC_BookingID = CFH.ID 
                INNER JOIN PRD_ProductItem CFP ON CFP.PDLID = CF.PCC_PDLID and CFP.pdl_active=1 and CFP.pdl_noweb=0 
                INNER JOIN PRD_PlaceXProductItem CFxplace ON CFxplace.CXZ_ProductItem = CFP.PDLID 
                INNER JOIN PRD_Product PRO ON PRO.SPDID = CFP.PDL_ProductID 
				outer apply (SELECT Top 1 STPR.STP_Save as Value FROM STR_SitePromotion STPR 
                            WHERE STPR.STP_ProdItemID = CF.PCC_PDLID AND STPR.STP_Active = 1 
               			       AND STPR.STP_StartDate <= Convert(VARCHAR(10), GETDATE(), 101) AND STPR.STP_EndDate >= CONVERT(VARCHAR(10), GETDATE(), 101)) Price
				outer apply (Select (SELECT DISTINCT ph2.STR_PlaceTitle + '|' + convert(varchar(8),ph2.STR_PlaceID) + '|' + convert(varchar(8),ph2.STR_PlaceTypeID) + ', ' 
                            FROM STR_Places_Hierarchy ph2 
               			 WHERE charindex(','+convert(varchar(8),ph2.STR_PlaceID)+',', ','+replace(PDL_Places,' ',''))>0 
                                  AND ph2.STR_PlaceActive = 1 AND ph2.STR_NoWeb = 0 AND ph2.STR_PlaceTypeID in (1,25,5) AND ph2.STR_UserID in(243) 
                            FOR XML PATH('')) as Value) RelatePlaces 
                LEFT JOIN STR_Places_Hierarchy PLCO ON PLCO.STR_PlaceID = PRO.SPD_CountryPlaceID  				
                AND (PLCO.STR_PlaceActive = 1) AND (PLCO.STR_UserID in (243) 
                AND (PLCO.STR_NoWeb = 0) AND (PLCO.STR_PlaceTypeID = 5) )
                WHERE CF.PCC_PDLID <> 0 
				AND CFH.dept = 1615
                AND CF.PCC_Active = 1 
                AND CF.PCC_Block = 0 
                AND CFH.dep_date > Getdate()-720 
                AND CFxplace.CXZ_ChildPlaceID = " + placeID + @"
                AND CFxplace.CXZ_Active = 1 
                AND (CF.PCC_Comment is not null) AND (LEN(cast(CF.PCC_Comment as varchar(8000))) > 15) 
                ) 
                select top 10 * from comments where rn=1 and charindex('---',PCC_Comment)=0 ORDER BY PCC_Ranking ASC, dep_date DESC";
        }

        public static string SQL_PageTemplate_PlaceCodeID_MasterInterestContent(string InterestId, string CountryId)
        {
            return @"SELECT STR_PlaceTitle, isnull(SMC_Template,'none') as SMC_Template
            FROM STR_Places_Hierarchy
            INNER JOIN STR_MasterInterestContent ON SMC_PlaceHierarchyID = STRID
            WHERE STR_PlaceActive = 1 
            And SMC_UserID = " + SiteUserId +
            @" And SMC_Active = 1
             And SMC_SysCodeID = " + InterestId +
            @" And STR_PlaceID = " + CountryId;

        }

        public static string SQL_PageTemplate_TitleCodeId_MasterInterestContent(string PlaceTitle, string InterestId)
        {
            return @"SELECT PLH.STRID, PLH.STR_PlaceID, MIC.SMCID, isnull(MIC.SMC_Template,'none') as SMC_Template
            FROM STR_Places_Hierarchy PLH
            LEFT JOIN STR_MasterInterestContent MIC ON MIC.SMC_PlaceHierarchyID = PLH.STRID
            WHERE PLH.STR_PlaceActive = 1 
             And PLH.STR_UserID = " + SiteUserId +
            @" And PLH.STR_NoWeb = 0
             And charindex(PLH.STR_PlaceTitle, '" + PlaceTitle + @"') > 0" +
            " And MIC.SMC_UserID = " + SiteUserId +
            @" And MIC.SMC_Active = 1 
             And MIC.SMC_SysCodeID = " + InterestId;

        }

        public static string SQL_CruisePacks(string PlaceID)
        {
            return @"SELECT PIT.PDLID
                ,PIT.PDL_SequenceNo
                ,SYS.SCD_CodeTitle
                ,PIT.PDL_Title
                ,PIT.PDL_SpecialCode
                ,PRO.SPD_StarRatingSysCode
                ,cast(ATR.AAT_Overall as varchar(2000)) as AAT_Overall
                ,cast(PRO.SPD_Description as varchar(2000)) as PDL_Description
                ,cast(PIT.PDL_Content as varchar(2000)) as PDL_Content
                ,cast(PIT.PDL_Description as varchar(2000)) as PDL_Description
                ,PIT.PDL_Duration
                ,isnull(SPR.STP_Price,9999) as STP_Price
                ,isnull(SPR.STP_Save,9999) as STP_Save
                ,cast(IMG.IMG_Path_URL as varchar(200)) as IMG_Path_URL
                ,IMG.IMG_Title
                ,PIT2.PDL_Notes
            FROM PRD_PlaceXProductItem PXP
            INNER Join PRD_ProductItem PIT ON PIT.PDLID = PXP.CXZ_ProductItem
            INNER Join PRD_Product PRO ON PRO.SPDID = PIT.PDL_ProductID
                LEFT Join SYS_Codes SYS ON SYS.SCD_Code = PIT.PDL_SpecialCode and SYS.SCD_CodeType = 78
                LEFT Join PRD_AirlineAttribute ATR ON ATR.AAT_SysCodeID = SYS.SCDID 
                AND (ATR.AAT_Active = 1)
            LEFT JOIN STR_SitePromotion SPR ON SPR.STP_ProdItemID = PIT.PDLID 
                AND (SPR.STP_UserID = 243)
                AND (SPR.STP_Active = 1) 
                AND (SPR.STP_StartDate <= CONVERT(VARCHAR(10), GETDATE(), 101)) AND (SPR.STP_EndDate >= CONVERT(VARCHAR(10), GETDATE(), 101)) 
            LEFT Join PRD_ProductXImages PXI ON PXI.PXI_ProductID = PIT.PDL_ProductID 
                AND (PXI.PXI_Active = 1) 
                AND (PXI.PXI_Sequence = 0) 
            LEFT Join APP_Images IMG ON IMG.IMGID = PXI.PXI_ImageID 
                AND (IMG.IMG_Active = 1) 
            LEFT JOIN PRD_ProductItem PIT2 ON PIT2.PDLID = PIT.PDLID AND PIT2.PDL_Active = 1
            WHERE(PXP.CXZ_ChildPlaceID = " + PlaceID + @")
                AND (PXP.CXZ_Active = 1)
                AND (PIT.PDL_SpecialCode is not null) 
                AND (PIT.PDL_Active = 1) AND PIT.PDL_NoWeb = 0 
                AND (PIT.PDL_Title not like 'Zpend%' AND PIT.PDL_Title not like 'ZZZ%')
                AND (PRO.SPD_Active = 1)
                AND (PRO.SPD_ProductTypeSysCode = 34) 
                AND (PRO.SPD_InternalComments LIKE '%:.ED%')
            ORDER BY PIT.PDL_SpecialCode,PRO.SPD_StarRatingSysCode,PIT.PDL_SequenceNo ASC";

        }

        public static string SQL_CruiseInterestContent(string PlaceID)
        {
            return @"SELECT SMC_Content As Name
            FROM STR_Places_Hierarchy
            INNER JOIN STR_MasterInterestContent ON SMC_PlaceHierarchyID = STRID
            WHERE STR_PlaceActive = 1 
            And SMC_UserID = " + SiteUserId +
            @" And SMC_Active = 1
             And STR_PlaceID = " + PlaceID + @" AND Charindex('Cruises',SMC_Title) > 0";

        }

        public static string SQL_CruiseName(string PlaceID)
        {
            return @"SELECT STR_PlaceTitle As Name FROM STR_Places_Hierarchy WHERE STR_PlaceID = " + PlaceID + @" AND STR_PlaceActive = 1 AND STR_UserID = 243";
        }

        public static string SQL_CruisePackInfo(string PackID)
        {
            return @"SELECT pak1.PDLID,pak1.PDL_Title as Title,pak2.SPD_InternalComments as ProdKinds,pak2.SPD_Description as PackDescription,pak1.PDL_Content as Includes,pak1.PDL_Description as Distances,pak1.PDL_Notes as DeckPlan,pak2.SPD_StarRatingSysCode as SysCode, isnull(HRCH.STR_PlaceTitle,'Europe') as CityNA ,pak1.PDL_Places as Places,pak2.SPD_Features as Themes, CONT.STR_PlaceTitle as CountryName
                FROM PRD_ProductItem pak1
                INNER JOIN PRD_Product pak2 ON pak2.SPDID = pak1.PDL_ProductID
                LEFT JOIN STR_Places_Hierarchy HRCH ON(HRCH.STR_PlaceID = pak2.SPD_StatePlaceID)
                AND(HRCH.STR_PlaceActive = 1)
                AND(HRCH.STR_UserID = 243)
                AND(HRCH.STR_NoWeb = 0)
                AND(HRCH.STR_ProdKindID = 0)
                LEFT JOIN STR_Places_Hierarchy CONT ON (CONT.STR_PlaceID = pak2.SPD_CountryPlaceID) 
                AND (CONT.STR_PlaceActive = 1) 
                AND (CONT.STR_UserID = 243) 
                AND (CONT.STR_NoWeb = 0) 
                AND (CONT.STR_ProdKindID = 0)
                WHERE (pak1.PDLID IN ( " + PackID + @")) 
                AND (pak1.PDL_Active = 1) AND pak1.PDL_NoWeb = 0 
                AND (pak2.SPD_Active = 1)";
        }

        public static string SQL_CruiseRelatedPacks(string PackID)
        {
            return @"SELECT DISTINCT pxp.CXZID,pxp.cxz_productitem as PackageId,pit.PDL_title as PackageTitle,pxp.cxz_ChildPlaceId as PlaceId,ph.str_placetitle as PlaceTitle,
                (
                SELECT COUNT(PdlId) as NoOfPacks 
                FROM PRD_Placexproductitem pxp2
                INNER JOIN str_places_hierarchy ph2 ON ph2.str_placeid=pxp2.cxz_childplaceid 
                AND pxp2.cxz_active=1 AND ph2.str_placeactive=1 AND ph2.str_userid=243
                INNER JOIN PRD_productItem pit2 ON pit2.pdlid=pxp2.cxz_productitem AND pit2.pdl_active=1 AND pit2.PDL_NoWeb = 0
                INNER JOIN PRD_Product pro2 ON pro2.spdid=pit2.pdl_productid AND pro2.spd_active=1 AND pro2.spd_producttypesyscode = 34
                LEFT JOIN str_sitepromotion spr2 ON spr2.stp_proditemid=pit2.pdlid 
                AND spr2.stp_userid=243 AND spr2.stp_active=1 
                WHERE pxp2.cxz_childplaceid=pxp.cxz_ChildPlaceId 
                ) AS NoOfPacks, ph.str_placetypeid 
                FROM prd_placexproductitem pxp 
                INNER JOIN str_places_hierarchy ph ON ph.str_placeid=pxp.cxz_childplaceid AND ph.str_userid=243 
                INNER JOIN PRD_ProductItem pit ON pit.pdlid=pxp.cxz_productitem AND pit.pdl_active=1 AND pit.PDL_NoWeb = 0 
                WHERE pxp.cxz_ChildPlaceId<>1915 AND pxp.cxz_active=1 AND ph.str_placeactive=1 
                AND pxp.cxz_productitem=" + PackID + @"
                ORDER BY str_placetitle";

        }

        public static string SQL_CruisePicsForPack(string PackID)
        {
            return @"SELECT PRD_ProductXImages.PXI_ImageID,PRD_ProductXImages.PXI_Sequence,APP_Images.IMG_Path_URL,APP_Images.IMG_Title,PRD_Product.SPD_InternalComments
                FROM PRD_ProductItem
                INNER JOIN PRD_ProductXImages ON PRD_ProductXImages.PXI_ProductID = PRD_ProductItem.PDL_ProductID
                INNER JOIN APP_Images ON APP_Images.IMGID = PRD_ProductXImages.PXI_ImageID
                INNER JOIN PRD_Product ON PRD_Product.SPDID = PRD_ProductItem.PDL_ProductID
                WHERE PRD_ProductItem.PDLID = " + PackID + @" AND PRD_ProductXImages.PXI_Active = 1 AND APP_Images.IMG_Active = 1 AND SPD_Active = 1 AND PDL_Active = 1 AND PDL_NoWeb = 0
                ORDER BY PRD_ProductXImages.PXI_Sequence";
        }
        public static string SQL_ManagerDisplayAreaGp3City(Int32 AreaID, Int32 hierarchyID)
        {
            return @"Select SDP_DisplayTitle
                  , isnull(SDP_GroupTitleURL,'none') as SDP_GroupTitleURL
                  , isnull(SDP_Description,'none') as SDP_Description
                  , isnull(SDP_Order,0) as SDP_Order
                  , isnull(SDP_PlaceHierarchyID,0) as SDP_PlaceHierarchyID
                  , isnull(SDP_GroupProdKindID,0) as SDP_GroupProdKindID
                  , isnull(SDP_DisplayProdKindID,0) as SDP_DisplayProdKindID
                  , isnull(SDP_TitleBGColor,'none') as SDP_TitleBGColor
                  From STR_DisplayPosition 
                  inner join STR_Places_Hierarchy on SDP_PlaceHierarchyID = STRID
                  Where SDP_UserID =  243 AND SDP_MasterContentID = 0 AND SDP_PlaceID =  " + AreaID + @" And SDP_PlaceHierarchyID = " + hierarchyID + @" AND SDP_Active = 1
                  order by  SDP_DisplayProdKindID, SDP_Order ASC";
        }
        public static string SQL_CustomerFeedbackByPlaceIDVisit(string placeID)
        {
            return @";with comments as
                (
                SELECT CFH.dept, CF.PCC_Ranking, CF.PCC_Comment,CF.PCC_CustomerName,CF.PCC_Itinerary,CF.PCCID,CF.PCC_PDLID,isnull(CF.PCC_OverallScore,-999) as OverallScore
				, CAST(isnull(Price.Value,9999) as MONEY) as STP_Save, CFH.dep_date, CFP.PDL_Title,RelatePlaces.Value as RelatePlaces ,PLCO.STR_PlaceTitle as CountryName,PLCO.STR_PlaceID as CountryID 
                ,row_number() OVER(PARTITION BY PCC_PDLID ORDER BY PCC_PDLID) AS rn 
                FROM PRD_CustomerComment CF 
                INNER JOIN RSV_Heading CFH with (nolock) ON CF.PCC_BookingID = CFH.ID 
                INNER JOIN PRD_ProductItem CFP ON CFP.PDLID = CF.PCC_PDLID and CFP.pdl_active=1 and CFP.pdl_noweb=0 
                INNER JOIN PRD_PlaceXProductItem CFxplace ON CFxplace.CXZ_ProductItem = CFP.PDLID 
                INNER JOIN PRD_Product PRO ON PRO.SPDID = CFP.PDL_ProductID 
				outer apply (SELECT Top 1 STPR.STP_Save as Value FROM STR_SitePromotion STPR 
                            WHERE STPR.STP_ProdItemID = CF.PCC_PDLID AND STPR.STP_Active = 1 
               			       AND STPR.STP_StartDate <= Convert(VARCHAR(10), GETDATE(), 101) AND STPR.STP_EndDate >= CONVERT(VARCHAR(10), GETDATE(), 101)) Price
				outer apply (Select (SELECT DISTINCT ph2.STR_PlaceTitle + '|' + convert(varchar(8),ph2.STR_PlaceID) + '|' + convert(varchar(8),ph2.STR_PlaceTypeID) + '@' 
                            FROM STR_Places_Hierarchy ph2 
               			 WHERE charindex(','+convert(varchar(8),ph2.STR_PlaceID)+',', ','+replace(PDL_Places,' ',''))>0 
                                  AND ph2.STR_PlaceActive = 1 AND ph2.STR_NoWeb = 0 AND ph2.STR_PlaceTypeID in (1,25,5) AND ph2.STR_UserID in(243) 
                            FOR XML PATH('')) as Value) RelatePlaces 
                LEFT JOIN STR_Places_Hierarchy PLCO ON PLCO.STR_PlaceID = PRO.SPD_CountryPlaceID  				
                AND (PLCO.STR_PlaceActive = 1) AND (PLCO.STR_UserID in (243) 
                AND (PLCO.STR_NoWeb = 0) AND (PLCO.STR_PlaceTypeID = 5) )
                WHERE CF.PCC_PDLID <> 0 
				AND CFH.dept = 1615
                AND CF.PCC_Active = 1 
                AND CF.PCC_Block = 0 
                AND CFH.dep_date > Getdate()-720 
                AND CFxplace.CXZ_ChildPlaceID = " + placeID + @"
                AND CFxplace.CXZ_Active = 1 
                AND (CF.PCC_Comment is not null) AND (LEN(cast(CF.PCC_Comment as varchar(8000))) > 15) 
                ) 
                select top 10 * from comments where rn=1 and charindex('---',PCC_Comment)=0 ORDER BY PCC_Ranking ASC, dep_date DESC";
        }

        public static string sqlPackInfoXID(string itinID)
        {
            return @"SELECT PRI.PDLID, PRI.PDL_Title, PRI.PDL_Content, PRO.SPD_Description, PRO.SPD_InternalComments, SPR.STP_Save, SPR.STP_NumOfNights,Pic3.IMG_Path_URL,(
         SELECT COUNT(CF.PCCID) as NoOfFeed
         FROM PRD_CustomerComment CF
         INNER JOIN RSV_Heading CFH with(nolock) ON
         CF.PCC_BookingID = CFH.ID
         WHERE(CF.PCC_PDLID = PRI.PDLID)
         AND(CF.PCC_Comment is not null)
         AND(LEN(cast(CF.PCC_Comment as varchar(8000))) > 20)
         AND CF.PCC_Active = 1 AND CF.PCC_Block = 0) as NoOfFeed
         FROM PRD_ProductItem PRI
         INNER Join PRD_Product PRO ON PRO.SPDID = PRI.PDL_ProductID
         INNER JOIN PRD_ProductXImages Pic2 ON Pic2.PXI_ProductID = PRI.PDL_ProductID
         AND Pic2.PXI_Sequence = 0
         INNER JOIN APP_Images Pic3 ON Pic3.IMGID = Pic2.PXI_ImageID
         LEFT JOIN STR_SitePromotion SPR ON SPR.STP_ProdItemID = PRI.PDLID
         AND SPR.STP_UserID = 243
         AND SPR.STP_StartDate <= Convert(VARCHAR(10), GETDATE(), 101)
         AND SPR.STP_EndDate >= CONVERT(VARCHAR(10), GETDATE(), 101)
         AND SPR.STP_Active = 1
         WHERE PRI.PDLID = " + itinID + @"
         AND PRI.PDL_Active = 1
         AND PRI.PDL_NoWeb = 0
         AND PRO.SPD_Active = 1
         AND Pic3.IMG_Active = 1
         AND Pic2.PXI_Active = 1";
        }

        public static string SQL_HotelOneImages()
        {
            return @"select ai.IMG_Title, isnull(Case when ai.IMG_500Path_URL is null Then ai.IMG_Path_URL Else ai.IMG_500Path_URL End, '') as IMG_Path_URL, ghi.GIMG_TNSequence 
                from GIATA_GiataXProductItem gpi 
                inner join GIATA_Hotels gh on gpi.GLT_GIPHID = gh.GIPHID and gh.GIPH_Active=1 and  gh.GIPH_TNNoWeb = 0  
                inner join GIATA_HotelXImages ghi on gh.GIPHID=ghi.GIMG_GIPHID and ghi.GIMG_Active=1 and ghi.GIMG_TNSequence = 0 
                inner join APP_Images ai on ghi.GIMG_TNImageID = ai.IMGID and ai.IMG_Active=1 
                where gpi.GLT_PDLID = @hotelID and gpi.GLT_Active=1";
        }

        public static string SQL_ToursItinByPlaceID(string plcid)
        {
            return @"Select PRI.PDLID, u.NoOfCountries, PRI.PDL_Title
                    ,PRI.PDL_Content, PRI.PDL_SequenceNo, PRI.PDL_Duration, ppw.SPPW_Weight, PRO.SPD_Description, pro.SPD_InternalComments
                    ,cast(isnull(SPR.STP_Save,9999) as money) STP_save, Pic3.IMG_Path_URL, isnull(Pic3.IMG_500Path_URL, 'none') as IMG_500Path_URL, Feeds.NoOfFeed
                    FROM PRD_PlaceXProductItem PXP
                    INNER JOIN PRD_ProductItem PRI ON PRI.PDLID = PXP.CXZ_ProductItem
                    AND PRI.PDL_Active = 1 AND PRI.PDL_NoWeb = 0 and PDL_Title NOT LIKE 'Zpend%'
                    INNER Join PRD_Product PRO ON PRO.SPDID = PRI.PDL_ProductID AND PRO.SPD_Active = 1 AND PRO.SPD_ProductTypeSysCode = 34 AND PRO.SPD_InternalComments LIKE '%" + InternalComments + @"%' AND PRO.SPD_StarratingSysCode <> 541
                    left Join STR_SitePromotion SPR ON SPR.STP_ProdItemID=PRI.PDLID AND SPR.STP_Active = 1 AND SPR.STP_StartDate <= CONVERT(VARCHAR(10), GETDATE(), 101) AND SPR.STP_EndDate >= CONVERT(VARCHAR(10), GETDATE(), 101) AND SPR.STP_UserID = " + SiteUserId +
                    @"Left Join STR_Places_Hierarchy PHI On PHI.STR_PlaceID = " + plcid + @" And PHI.STR_PlaceActive = 1 And PHI.STR_UserID = " + SiteUserId + @" And PHI.STR_NoWeb = 0 And PHI.Str_ProdkindId=0
                    left join STR_PlacesXPackageWeight PPW ON PPW.SPPW_parentPlace = PHI.STRID AND PPW.SPPW_PackageID = PRI.PDLID AND PPW.SPPW_Active = 1 AND PPW.SPPW_MasterContentID = 0
                    left join PRD_ProductXImages Pic2 ON Pic2.PXI_ProductID = PRI.PDL_ProductID AND Pic2.PXI_Sequence = 0 AND Pic2.PXI_Active = 1
                    left join APP_Images Pic3 ON Pic3.IMGID = Pic2.PXI_ImageID AND Pic3.IMG_Active = 1
                    outer apply (SELECT COUNT (CF.PCCID) as NoOfFeed FROM PRD_CustomerComment CF WHERE CF.PCC_PDLID = PRI.PDLID  AND CF.PCC_Comment is not null AND LEN(cast(CF.PCC_Comment as varchar(8000))) > 15 AND CF.PCC_Active = 1 AND CF.PCC_Block = 0) as Feeds
                    cross apply 
					    (select count(DISTINCT CXZ_ChildPlaceID) As NoOfCountries
						    FROM prd_placexproductitem pxp1
						    INNER JOIN STR_Places_Hierarchy ph ON ph.str_placeid = pxp1.cxz_childplaceid AND ph.str_prodkindid = 0 And ph.str_placeactive = 1 And ph.str_placetypeid <> 3 AND ph.STR_NoWeb = 0 AND ph.str_UserId = " + SiteUserId + @" 
						    WHERE pxp1.cxz_active = 1 AND pxp1.cxz_productitem = PRI.PDLID and STR_PlaceTypeID = 5) u                
                    WHERE
                    PXP.CXZ_Active = 1
                    and pxp.CXZ_ChildPlaceId= " + plcid + @"
                    and PPW.SPPW_Weight<30
                    ORDER BY ppw.SPPW_Weight ASC";
        }

        public static string SQL_NoOfToursItinByPlaceID(string plcid)
        {
            return @"Select count(pxp.CXZ_ProductItem) As NoOfPacks
							, '' as PDL_Places
					    FROM PRD_PlaceXProductItem PXP 
					    INNER JOIN PRD_ProductItem PRI ON PRI.PDLID = PXP.CXZ_ProductItem AND PRI.PDL_Active = 1 AND PRI.PDL_NoWeb = 0 and PDL_Title NOT LIKE 'Zpend%'
					    INNER Join PRD_Product PRO ON PRO.SPDID = PRI.PDL_ProductID AND PRO.SPD_Active = 1 AND PRO.SPD_ProductTypeSysCode = 34 AND 
						    PRO.SPD_InternalComments Like '%" + InternalComments + @"%'
						    AND PRO.SPD_StarratingSysCode <> 541  
					    WHERE PXP.CXZ_Active = 1 and pxp.CXZ_ChildPlaceId= " + plcid + @"";
        }

        public static string SQL_TripsItinByPlaceID(string plcid)
        {
            return @"Select PRI.PDLID, u.NoOfCountries, PRI.PDL_Title
                    ,PRI.PDL_Content, PRI.PDL_SequenceNo, PRI.PDL_Duration, ppw.SPPW_Weight, PRO.SPD_Description, pro.SPD_InternalComments
                    ,cast(isnull(SPR.STP_Save,9999) as money) STP_save, Pic3.IMG_Path_URL, isnull(Pic3.IMG_500Path_URL, 'none') as IMG_500Path_URL, Feeds.NoOfFeed
                    , case when row_number() over (Order By ppw.SPPW_Weight)=1 then Places.PDL_Places else '' end as PDL_Places
                    FROM PRD_PlaceXProductItem PXP
                    INNER JOIN PRD_ProductItem PRI ON PRI.PDLID = PXP.CXZ_ProductItem
                    AND PRI.PDL_Active = 1 AND PRI.PDL_NoWeb = 0 and PDL_Title NOT LIKE 'Zpend%'
                    INNER Join PRD_Product PRO ON PRO.SPDID = PRI.PDL_ProductID AND PRO.SPD_Active = 1 AND PRO.SPD_ProductTypeSysCode = 34 AND PRO.SPD_InternalComments LIKE '%" + InternalComments + @"%' AND PRO.SPD_StarratingSysCode <> 541
                    left Join STR_SitePromotion SPR ON SPR.STP_ProdItemID=PRI.PDLID AND SPR.STP_Active = 1 AND SPR.STP_StartDate <= CONVERT(VARCHAR(10), GETDATE(), 101) AND SPR.STP_EndDate >= CONVERT(VARCHAR(10), GETDATE(), 101) AND SPR.STP_UserID = " + SiteUserId +
                    @"Left Join STR_Places_Hierarchy PHI On PHI.STR_PlaceID = " + plcid + @" And PHI.STR_PlaceActive = 1 And PHI.STR_UserID = " + SiteUserId + @" And PHI.STR_NoWeb = 0 And PHI.Str_ProdkindId=0
                    left join STR_PlacesXPackageWeight PPW ON PPW.SPPW_parentPlace = PHI.STRID AND PPW.SPPW_PackageID = PRI.PDLID AND PPW.SPPW_Active = 1 AND PPW.SPPW_MasterContentID = 0
                    left join PRD_ProductXImages Pic2 ON Pic2.PXI_ProductID = PRI.PDL_ProductID AND Pic2.PXI_Sequence = 0 AND Pic2.PXI_Active = 1
                    left join APP_Images Pic3 ON Pic3.IMGID = Pic2.PXI_ImageID AND Pic3.IMG_Active = 1
                    outer apply (SELECT COUNT (CF.PCCID) as NoOfFeed FROM PRD_CustomerComment CF WHERE CF.PCC_PDLID = PRI.PDLID  AND CF.PCC_Comment is not null AND LEN(cast(CF.PCC_Comment as varchar(8000))) > 15 AND CF.PCC_Active = 1 AND CF.PCC_Block = 0) as Feeds
	                outer apply (select (select packs.PDL_Places+' ' from (Select pxp.CXZ_ProductItem, PRI.PDL_Places, PDL_Title, PDL_Content, PDL_SequenceNo, PDL_Duration, PDL_ProductID, SPD_Description, SPD_InternalComments 
                        FROM PRD_PlaceXProductItem PXP 
                        INNER JOIN PRD_ProductItem PRI ON PRI.PDLID = PXP.CXZ_ProductItem AND PRI.PDL_Active = 1 AND PRI.PDL_NoWeb = 0 and PDL_Title NOT LIKE 'Zpend%'
                        INNER Join PRD_Product PRO ON PRO.SPDID = PRI.PDL_ProductID AND PRO.SPD_Active = 1 AND PRO.SPD_ProductTypeSysCode = 34 AND 
					        PRO.SPD_InternalComments Like '%" + InternalComments + @"%'
					        AND PRO.SPD_StarratingSysCode <> 541  
                        WHERE PXP.CXZ_Active = 1 and pxp.CXZ_ChildPlaceId= " + plcid + @") packs for xml path('')) as PDL_Places) Places 
                    cross apply 
					    (select count(DISTINCT CXZ_ChildPlaceID) As NoOfCountries
						    FROM prd_placexproductitem pxp1
						    INNER JOIN STR_Places_Hierarchy ph ON ph.str_placeid = pxp1.cxz_childplaceid AND ph.str_prodkindid = 0 And ph.str_placeactive = 1 And ph.str_placetypeid <> 3 AND ph.STR_NoWeb = 0 AND ph.str_UserId = " + SiteUserId + @" 
						    WHERE pxp1.cxz_active = 1 AND pxp1.cxz_productitem = PRI.PDLID and STR_PlaceTypeID = 5) u                
                    WHERE
                    PXP.CXZ_Active = 1
                    and pxp.CXZ_ChildPlaceId= " + plcid + @"
                    and PPW.SPPW_Weight<30
                    ORDER BY ppw.SPPW_Weight ASC";
        }

        public static string SQL_SEOFeedCommentsByPlaceID(string placeID)
        {
            return @"with mainPack as (
                select PDL_ProductID, PDL_Title, STP_UserID, STP_Save, STP_NumOfNights, XBP_PkgID, Freq as NoOfSales, package_rank, SPD_CountryPlaceID, PDL_Duration from 
                    (select  PDL_ProductID, PDL_Title, STP_UserID, STP_Save, STP_NumOfNights, XBP_PkgID, Freq, row_number() over (order by Freq desc) as package_rank, SPD_CountryPlaceID, PDL_Duration
                        from (
                                Select PRI.PDL_ProductID, PRI.PDL_Title, STP.STP_UserID, STP.STP_Save, STP.STP_NumOfNights, BEP.XBP_PkgID, count(BEP.XBP_PkgID) as Freq, PRO.SPD_CountryPlaceID, PRI.PDL_Duration
                                        From RSV_BookingExtraProperty BEP WITH (NOLOCK)
                                            INNER JOIN STR_SitePromotion STP ON STP.STP_ProdItemID = BEP.XBP_PkgID
                                            INNER JOIN PRD_ProductItem PRI ON PRI.PDLID = BEP.XBP_PkgID
                                            INNER JOIN PRD_Product PRO ON PRO.SPDID = pri.PDL_ProductID 
                                      Where 
                                        BEP.XBP_PkgID is not null
                                        AND BEP.XBP_PkgID > 0
                                        AND BEP.XBP_Active =1
                                        AND STP.STP_Active = 1 
                                        AND STP.STP_StartDate <= CONVERT(VARCHAR(10),GETDATE(),101) AND STP.STP_EndDate >= CONVERT(VARCHAR(10),GETDATE(),101)
                                        AND PRO.SPD_CountryPlaceID = " + placeID + @"
                                        Group by STP.STP_UserID, BEP.XBP_PkgID, STP.STP_Save, STP_NumOfNights, PDLID, PDL_Title, PDL_ProductID, SPD_CountryPlaceID, PDL_Duration
                                    ) pack_count
                            ) pack_rank
                        where package_rank < 4
                    )
                    SELECT PDL_ProductID, XBP_PkgId As PDLID, PDL_Title, STP_UserID, STP_Save, STP_NumOfNights, NoOfSales, PDL_Duration
                    ,(SELECT count(*) 
                        FROM PRD_CustomerComment CF
                        WHERE CF.PCC_PDLID = mainPack.XBP_PkgID
                        AND CF.PCC_Active = 1 
                        AND CF.PCC_Block = 0 
                    ) as NoOfFeeds
                    , (SELECT top 1 convert(varchar, BEP.XBP_BKTime, 101) 
                        FROM RSV_BookingExtraProperty BEP WITH (NOLOCK)
                        WHERE BEP.XBP_PkgID = mainPack.XBP_PkgID
                        Order by BEP.XBP_BKTime DESC
                    ) as BookingDate
                    From mainPack
					order by package_rank";
        }

        public static string SQL_PackageCMSs(string plcid)
        {
            return @";with placesIds(PlaceId, STR_PlaceTypeId, STR_UserID, STR_PlaceTitle) as
	                (select pxp1.cxz_ChildPlaceId as PlaceId, ph.str_placetypeid as STR_PlaceTypeId, ph.STR_UserID, ph.STR_PlaceTitle
                                FROM prd_placexproductitem pxp1 
                                INNER JOIN STR_Places_Hierarchy ph ON ph.str_placeid=pxp1.cxz_childplaceid AND ph.str_userid in (243, 595, 182) AND ph.str_prodkindid=0 And ph.str_placeactive = 1 And ph.str_placetypeid <> 3 AND ph.STR_NoWeb = 0
                                WHERE pxp1.cxz_active = 1 AND pxp1.cxz_productitem = " + plcid + @" and ph.STR_PlacePriority  = 1)
                            SELECT ids.*, plcH.STRID, plcH.STR_PlaceID,Xcms.CMSW_Title, Xcms.CMSW_Order, Xcms.CMSW_RelatedCmsID, isnull(CSM.CMS_Description,'none') as CMS_Description
		                    , row_number() over(Partition by ids.PlaceId Order by ids.STR_PlaceTitle) as N
                                                        FROM STR_WebHierarchyXCMS Xcms
                                                        INNER JOIN CMS_WebsiteContent CSM ON Csm.CMSID = Xcms.CMSW_RelatedCmsID
                                                        INNER JOIN STR_Places_Hierarchy plcH ON STR_PlaceActive = 1 AND Xcms.CMSW_WebHierarchyID = plcH.STRID
                                                        inner join placesIds ids on ids.PlaceId = plcH.STR_PlaceID AND ids.STR_UserID = plcH.STR_UserID 
                                                        WHERE Xcms.CMSW_MasterContentID = 0 and Xcms.CMSW_Active = 1
										                order by ids.STR_UserID, ids.PlaceId, ids.STR_PlaceTypeId,  Xcms.CMSW_Order";
        }

        public static string SQL_PackageHotels(string plcid)
        {
            return @";with placesIds(PlaceId, STR_PlaceTypeId, STR_UserID, STR_PlaceTitle) as
	                (select pxp1.cxz_ChildPlaceId as PlaceId, ph.str_placetypeid as STR_PlaceTypeId, ph.STR_UserID, ph.STR_PlaceTitle
                                FROM prd_placexproductitem pxp1 
                                INNER JOIN STR_Places_Hierarchy ph ON ph.str_placeid=pxp1.cxz_childplaceid AND ph.str_userid in (243, 595, 182) AND ph.str_prodkindid=0 And ph.str_placeactive = 1 And ph.str_placetypeid <> 3 AND ph.STR_NoWeb = 0
                                WHERE pxp1.cxz_active = 1 AND pxp1.cxz_productitem = " + plcid + @" and ph.STR_PlacePriority  = 1)
	                select PlaceId, STR_PlaceTypeId, STR_UserID, STR_PlaceTitle, count(1) as NoOfHotels 
	                from (
		                select ids.*, gpi.GLT_PDLID, gh.GIPH_TNTournetName, gh.GIPH_GIATAID, gxtp.GITP_PLCID, row_number() over(partition by gxtp.GITP_PLCID, gh.GIPH_GIATAID order by gh.GIPH_TNSequence, pIt.PDLID) as n, row_number() over(partition by gxtp.GITP_PLCID, gh.GIPHID order by gh.GIPHID) as n1
				                  from GIATA_GiataXTournetPlace gxtp
				                  inner join GIATA_GiataXProductItem gpi on gpi.GLT_GIPHID = gxtp.GITP_GIPHID and gpi.GLT_Active = 1
				                  inner join GIATA_Hotels gh on gpi.GLT_GIPHID = gh.GIPHID and gh.GIPH_Active = 1 and gh.GIPH_TNNoWeb = 0
				                  inner join PRD_ProductItem pIt ON pIt.PDLID = gpi.GLT_PDLID and pIt.PDL_Active = 1 and pIt.PDL_NoWeb = 0 and pIt.PDL_Title NOT Like '-%' AND pIt.PDL_Title NOT Like 'Zblock%'
				                  inner join Prd_Product PRO ON pro.SPDID = pIt.PDL_ProductID AND PRO.SPD_Active = 1 AND PRO.spd_producttypesyscode = 3
				                  inner join placesIds ids on ids.PlaceId = gxtp.GITP_PLCID and ids.STR_PlaceTypeId in (25, 1)
				                  where gxtp.GITP_Active = 1
		                ) h
		                 WHERE(h.n = 1 and h.GIPH_GIATAID <> 0) or(h.n1 = 1 and h.GIPH_GIATAID = 0)
		                 Group by PlaceId, STR_PlaceTypeId, STR_UserID, STR_PlaceTitle";
        }

        public static string SQL_PackageActivities(string plcid)
        {
            return @";with placesIds(PlaceId, STR_PlaceTypeId, STR_UserID, STR_PlaceTitle) as
	                (select pxp1.cxz_ChildPlaceId as PlaceId, ph.str_placetypeid as STR_PlaceTypeId, ph.STR_UserID, ph.STR_PlaceTitle
                                FROM prd_placexproductitem pxp1 
                                INNER JOIN STR_Places_Hierarchy ph ON ph.str_placeid=pxp1.cxz_childplaceid AND ph.str_userid in (243, 595, 182) AND ph.str_prodkindid=0 And ph.str_placeactive = 1 And ph.str_placetypeid <> 3 AND ph.STR_NoWeb = 0
                                WHERE pxp1.cxz_active = 1 AND pxp1.cxz_productitem = " + plcid + @" and ph.STR_PlacePriority  = 1)
	                SELECT ids.PlaceId, ids.STR_PlaceTypeId, ids.STR_UserID, STR_PlaceTitle, count(1) as NoOfSS
                                                        from PRD_PlaceXProductItem
                                                        INNER JOIN PRD_ProductItem ON PRD_ProductItem.PDLID = PRD_PlaceXProductItem.CXZ_ProductItem AND PRD_ProductItem.PDL_Active = 1 AND PRD_ProductItem.PDL_NoWeb = 0
                                                        INNER JOIN Prd_Product ON Prd_Product.SPDID = PRD_ProductItem.PDL_ProductID AND Prd_Product.SPD_Active = 1  AND PRD_Product.SPD_ProductTypeSysCode = 152
                                                        inner join placesIds ids on ids.PlaceId = CXZ_ChildPlaceID and ids.STR_PlaceTypeId in (25, 1)
                                                        WHERE PRD_PlaceXProductItem.CXZ_Active = 1
                                                        group by ids.PlaceId, ids.STR_PlaceTypeId, ids.STR_UserID, STR_PlaceTitle";
        }

        public static string SQL_PackageFeedbacks(string plcid)
        {
            return @";with placesIds(PlaceId, STR_PlaceTypeId, STR_UserID, STR_PlaceTitle) as
	                    (select pxp1.cxz_ChildPlaceId as PlaceId, ph.str_placetypeid as STR_PlaceTypeId, ph.STR_UserID, STR_PlaceTitle
                                    FROM prd_placexproductitem pxp1 
                                    INNER JOIN STR_Places_Hierarchy ph ON ph.str_placeid=pxp1.cxz_childplaceid AND ph.str_userid in (243, 595, 182) AND ph.str_prodkindid=0 And ph.str_placeactive = 1 And ph.str_placetypeid <> 3 AND ph.STR_NoWeb = 0
                                    WHERE pxp1.cxz_active = 1 AND pxp1.cxz_productitem = " + plcid + @" and ph.STR_PlacePriority  = 1)
	                    Select ids.PlaceId, ids.STR_PlaceTypeId, ids.STR_UserID, STR_PlaceTitle, count(*) As NoOfFeeds, round(avg(convert(decimal(12, 2), case when[PCC_OverallScore] = 0 then null else[PCC_OverallScore] end)),1) As OverAll
                                        From placesIds ids
                                        inner join PRD_PlaceXProductItem pXp on pXp.CXZ_ChildPlaceID = ids.PlaceID and pXp.CXZ_Active = 1
                                        inner join PRD_ProductItem pri ON pXp.CXZ_ProductItem = pri.PDLID and pri.PDL_NoWeb = 0 and pri.PDL_Active = 1
                                        inner join Prd_Product PRO ON pro.SPDID = pri.PDL_ProductID AND PRO.SPD_Active = 1 AND PRO.spd_producttypesyscode = 34
                                        inner join PRD_CustomerComment CF on pri.PDLID = CF.PCC_PDLID and datalength(CF.PCC_Comment) > 15 and CF.PCC_Active = 1 and CF.PCC_Block = 0
                                        Where ids.STR_PlaceTypeId = 5 group by ids.PlaceId, ids.STR_PlaceTypeId, ids.STR_UserID, STR_PlaceTitle";
        }

        public static string SQL_Vacations_Places_Hierarchy_Priority(string PlaceTitle, bool IsInList = false)
        {
            return @"SELECT STR_UserID,STRID,STR_PlaceID,STR_PlaceTitle,STR_PlaceTypeID,isNull(STR_PageTemplate,'T1') as STR_PageTemplate, STR_PlacePriority, STR_PlaceExtra
                FROM STR_Places_Hierarchy
                WHERE STR_PlaceActive = 1 AND 
                STR_UserID in (243, 595, 182)
                And STR_NoWeb = 0 AND 
                STR_ProdKindID = 0
                And STR_PlaceTitle " + (IsInList == false ? "LIKE '" : "IN (") + PlaceTitle + (IsInList == false ? "'" : ")");
        }

        public static string SQL_PackageInformationSEO(string PackageID)
        {
            return @" Select PRI.PDL_Title, PRI.PDL_Content, PRI.PDL_Description, isNull(PRI.PDL_Notes,'none') as PDL_Notes,PRI.PDL_SpecialCode,PRI.PDL_ProductID,PRI.PDL_Duration,
                PRO.SPD_InternalComments, PRO.SPD_Description, PRO.SPD_StarRatingSysCode,PRO.SPD_ProductKindSysCode,PRO.SPD_Features,PRO.SPD_CountryPlaceID,
                SPR.STP_Price, SPR.STP_Save, SPR.STP_Content, SPR.STP_FromPlaceID,SPR.STP_NumOfNights,SPR.STP_MiniTitle,isNull(SPR.STP_StartTravelDate, Cast('1900-01-01' As Date)) As STP_StartTravelDate,
                PLC.PLC_Title,
                PLH.STR_PlaceTitle,PLH.STR_PlaceID,PLCH.STR_PlaceTitle as CityNA,PLCH.STR_PlaceID as CityID,PLC.PLCID, PLC.PLC_Code, 
                PRI.PDL_Gateway as CityEID, PLCH1.STR_PlaceTitle as CityENA, pro.SPD_CategoryTemplate, Images.IMG_Path_URL, PRI.PDLID as PackageId
                From PRD_ProductItem PRI
                INNER JOIN PRD_Product PRO ON PRO.SPDID = PRI.PDL_ProductID
                LEFT JOIN STR_SitePromotion SPR ON SPR.STP_ProdItemID = PRI.PDLID
                AND (SPR.STP_UserID = " + SiteUserId + @")
                AND(SPR.STP_StartDate <= CONVERT(VARCHAR(10), GETDATE(), 101)) AND(SPR.STP_EndDate >= CONVERT(VARCHAR(10), GETDATE(), 101))
                AND(SPR.STP_Active = 1)
                LEFT JOIN PRD_Place PLC ON PLC.PLCID = SPR.STP_FromPlaceID
                AND (PLC.PLC_PlaceTypeID = 1) AND(PLC.PLC_Active = 1)
                LEFT JOIN STR_Places_Hierarchy PLH ON PLH.STR_PlaceID = PRO.SPD_CountryPlaceID
                AND PLH.STR_PlaceActive = 1
                AND PLH.STR_UserID = " + SiteUserId + @" AND PLH.STR_PlaceTypeID = 5 AND plh.STR_ProdKindId= 0
                LEFT JOIN STR_Places_Hierarchy PLCH ON PLCH.STR_PlaceID = PRO.SPD_StatePlaceID
                AND PLCH.STR_PlaceActive = 1
                AND PLCH.STR_UserID = " + SiteUserId + @" AND (PLCH.STR_PlaceTypeID = 1 OR PLCH.STR_PlaceTypeID = 25)
                LEFT JOIN STR_Places_Hierarchy PLCH1 ON PLCH1.STR_PlaceID = PRI.PDL_Gateway
                AND PLCH1.STR_PlaceActive = 1
                AND PLCH1.STR_UserID = " + SiteUserId + @" AND (PLCH1.STR_PlaceTypeID = 1 OR PLCH1.STR_PlaceTypeID = 25)
                outer apply(select top 1 Pic3.IMG_Path_URL from PRD_ProductXImages Pic2
                   LEFT JOIN APP_Images Pic3 ON Pic3.IMGID = Pic2.PXI_ImageID
                   where Pic2.PXI_ProductID = PRI.PDL_ProductID AND Pic2.PXI_Sequence  = 0 AND Pic2.PXI_Active = 1 and Pic3.IMG_Active= 1) Images
                WHERE PRI.PDLID = " + PackageID + @" AND(PRI.PDL_Active = 1) AND pri.PDL_NoWeb = 0";
        }

        public static string SQL_Place_InfoPackage(string objId)
        {
            return @"SELECT * FROM dbo.MKT_WebSEO 
                        WHERE dbo.MKT_WebSEO.SEO_Active=1    
                        AND dbo.MKT_WebSEO.SEO_PDLID= " + objId + @"";
        }

        public static string SQL_HotelsDistinctZones()
        {
            return @"select DISTINCT pl.[PLC_Title] as CityZone, gipH_TNZoneID as GIPH_TNZoneID
	            from GIATA_GiataXTournetPlace gxtp 
		            inner join GIATA_GiataXProductItem gpi on gpi.GLT_GIPHID = gxtp.GITP_GIPHID And gpi.GLT_Active=1 
                    inner join GIATA_Hotels gh on gpi.GLT_GIPHID = gh.GIPHID And gh.GIPH_Active=1 And gh.GIPH_TNNoWeb = 0 
	                inner join PRD_ProductItem pri ON pri.PDLID = gpi.GLT_PDLID and pri.PDL_Active = 1 and pri.PDL_NoWeb = 0
	                inner join PRD_Property PTY ON PTY.PTY_ProductID = pri.PDL_ProductID and PTY.PTY_active = 1 
		            left join [dbo].[PRD_Place] pl on pl.[PLCID]=gh.[GIPH_TNZoneID] And pl.[PLC_Active] = 1
	            where gxtp.GITP_PLCID = @CityID and gxtp.GITP_Active = 1";
        }

        public static string SQL_HotelsDistinctRatings()
        {
            return @"select DISTINCT ISNULL(gh.GIPH_TNTournetRating, '') As GIPH_TNTournetRating
	            from GIATA_GiataXTournetPlace gxtp 
		            inner join GIATA_GiataXProductItem gpi on gpi.GLT_GIPHID = gxtp.GITP_GIPHID And gpi.GLT_Active=1 
                    inner join GIATA_Hotels gh on gpi.GLT_GIPHID = gh.GIPHID And gh.GIPH_Active=1 And gh.GIPH_TNNoWeb = 0 
	                inner join PRD_ProductItem pri ON pri.PDLID = gpi.GLT_PDLID and pri.PDL_Active = 1 and pri.PDL_NoWeb = 0 
	                inner join PRD_Property PTY ON PTY.PTY_ProductID = pri.PDL_ProductID and PTY.PTY_active = 1 
	            where gxtp.GITP_PLCID = @CityID and gxtp.GITP_Active = 1";
        }

        public static string SQL_HotelsDistinctScores()
        {
            return @"select DISTINCT ghs.GHS_FinalScore
	            from GIATA_GiataXTournetPlace gxtp 
		            inner join GIATA_GiataXProductItem gpi on gpi.GLT_GIPHID = gxtp.GITP_GIPHID And gpi.GLT_Active=1 
                    inner join GIATA_Hotels gh on gpi.GLT_GIPHID = gh.GIPHID And gh.GIPH_Active=1 And gh.GIPH_TNNoWeb = 0 
	                inner join PRD_ProductItem pri ON pri.PDLID = gpi.GLT_PDLID and pri.PDL_Active = 1 and pri.PDL_NoWeb = 0
	                inner join PRD_Property PTY ON PTY.PTY_ProductID = pri.PDL_ProductID and PTY.PTY_active = 1 
                    left join GIATA_HotelScores ghs on ghs.GHS_GIPHID = gh.GIPHID And ghs.GHS_Active = 1 
	            where gxtp.GITP_PLCID = @CityID and gxtp.GITP_Active = 1";
        }

        public static string SQL_HotelInfoFromController()
        {
            return @"select pri.PDLID, 
            	gh.GIPH_TNTournetRating as Rating, 
	            GIPH_TNTournetName as Name, 
	            gh.GIPH_Name as GiataName, 
	            isnull(GIPH_Phone1, 0) as Phone , 
	            gh.GIPH_TNContentSource, 
	            gh.GIPH_TNUseTournetContent, 
	            gh.GIPH_AddressLine1, 
	            gh.GIPH_AddressLine2, 
	            gh.GIPH_AddressLine3, 
	            gh.GIPH_AddressLine4, 
	            gh.GIPH_AddressLine5, 
	            gh.GIPH_AddressLine6, 
	            PTY.PTY_Address, 
                gh.GIPH_Latitude as Latitude, 
	            gh.GIPH_Longitude as Longitude, 
                gt.GHGT_Text100, 
	            gt.GHGT_Text101, 
	            gh.GIPH_TNTournetContent, 
	            gt.GHGT_Text102, 
	            pro.SPD_StatePlaceID, 
	            gh.GIPH_GIATAID, 
	            isnull(place.Name,'') as CityZone, 
	            GIPH_TNHighlights, 
	            isNull(GHS_SolarToursScore,0) as GHS_SolarToursScore, 
	            ISNULL(GHS_ExpediaScore, 0) as GHS_ExpediaScore, 
	            ISNULL(GHS_ExpediaReviewCount, 0) as GHS_ExpediaReviewCount, 
	            ISNULL(GHS_FinalScore, 0) as GHS_FinalScore, 
	            PLC_Title, 
	            STR_PlaceTitle 
            from PRD_ProductItem pri 
	            inner join PRD_Property PTY ON PTY.PTY_ProductID = pri.PDL_ProductID and PTY.PTY_active = 1 
	            inner join Prd_Product PRO ON pro.SPDID = pri.PDL_ProductID AND PRO.SPD_Active = 1 AND PRO.spd_producttypesyscode=3 
                inner join PRD_Place PLC ON pro.SPD_StatePlaceID = PLC.PLCID
	            left join STR_Places_Hierarchy SPH on SPD_StatePlaceID = STR_PlaceID and STR_UserID = 243 and STR_PlaceActive = 1
                inner join SYS_Codes SYC ON SYC.SCDID = PRO.SPD_StarRatingSysCode and SYC.[SCD_Active]=1 
                inner join GIATA_GiataXProductItem gpi on gpi.GLT_PDLID = pri.PDLID and gpi.GLT_Active=1 
                inner join GIATA_Hotels gh on gpi.GLT_GIPHID = gh.GIPHID and gh.GIPH_Active=1 and  gh.GIPH_TNNoWeb = 0 
                left join GIATA_Texts gt on gt.GHGT_GIATAID = gh.GIPH_GIATAID and gt.GHGT_Active=1 
                left join GIATA_HotelScores ghs	on ghs.GHS_GIPHID = gh.GIPHID And ghs.GHS_Active = 1 
                outer apply (
			            select top 1 PLC_Title as Name 
			            from PRD_Place where PLCID=gh.GIPH_TNZoneID And PLC_Active = 1 
		            ) Place
            where pri.PDLID = @hotelID and pri.PDL_Active = 1 and pri.PDL_NoWeb = 0";
        }

        public static string SQL_HotelInfoDetails()
        {
            return @"select 
                gh.GIPH_TNContentSource, 
                gh.GIPH_TNUseTournetContent, 
	            HotelStyleManual.Name as HotelStyleManual, 
	            HotelStyle.Name as HotelStyle, 
	            gh.GIPH_TNRooms, 
	            HotelNoRooms.Value as HotelNoRooms, 
                gex.GIEX_ExpSpecialCheckin, 
                gex.GIEX_MandatoryFees, 
	            gex.GIEX_OptionalFees, 
                gex.GIEX_Renovations
            from PRD_ProductItem pri 
	            inner join PRD_Property PTY ON PTY.PTY_ProductID = pri.PDL_ProductID and PTY.PTY_active = 1 
	            inner join Prd_Product PRO ON pro.SPDID = pri.PDL_ProductID AND PRO.SPD_Active = 1 AND PRO.spd_producttypesyscode=3 
                inner join PRD_Place PLC ON pro.SPD_StatePlaceID = PLC.PLCID
	            left join STR_Places_Hierarchy SPH on SPD_StatePlaceID = STR_PlaceID and STR_UserID = 243 and STR_PlaceActive = 1
                inner join SYS_Codes SYC ON SYC.SCDID = PRO.SPD_StarRatingSysCode and SYC.[SCD_Active]=1 
                inner join GIATA_GiataXProductItem gpi on gpi.GLT_PDLID = pri.PDLID and gpi.GLT_Active=1 
                inner join GIATA_Hotels gh on gpi.GLT_GIPHID = gh.GIPHID and gh.GIPH_Active=1 and  gh.GIPH_TNNoWeb = 0 
                left join GIATA_ExpediaExt gex on gex.GIEX_GIATAID = gh.GIPH_GIATAID and gex.GIEX_Active = 1
                outer apply (
		            select a.GHGA_FactTitle as Name 
			            from GIATA_Facts f inner join GIATA_Amenities a on f.GHGF_FactID = a.GHGA_FactID and a.GHGA_Active=1 and a.GHGA_TNNoWeb=0 
			            where f.GHGF_GIATAID = gh.GIPH_GIATAID and f.GHGF_Active=1 and f.GHGF_SectionName='hotel_type' and f.GHGF_FactValue='true'
		            ) HotelStyle 
                outer apply (
		            select GHGF_FactValue as value from GIATA_Facts where GHGF_GIATAID = gh.GIPH_GIATAID and GHGF_Active=1 and GHGF_FactName='num_rooms_total'
		            ) HotelNoRooms 
	            outer apply (
			          select s.SCD_CodeTitle as Name from GIATA_HotelXExtraProperties ex inner join SYS_Codes s on ex.GHAP_HotelStyleCodeID = s.SCDID and s.SCD_Active=1 where ex.GHAP_GIPHID = gh.GIPHID and ex.GHAP_Active=1 
		            ) HotelStyleManual
            where pri.PDLID = @hotelID and pri.PDL_Active = 1 and pri.PDL_NoWeb = 0";
        }

        public static string SQL_GetAllPacksCountrySimplified(string placeId, string citiesList = "")
        {
            return @"Select PRI.PDLID, PRI.PDL_Title, PRI.PDL_Content, PRI.PDL_SequenceNo, PRI.PDL_Places
                ,case when SPR.STP_NumOfNights is null then PRI.PDL_Duration else SPR.STP_NumOfNights end as STP_NumOfNights
                , PRO.SPD_Description 
                ,SPD_InternalComments 
                ,cast(isnull(SPR.STP_Save,9999) as Money) as STP_Save
                ,(SELECT COUNT (CF.PCCID) as NoOfFeed FROM PRD_CustomerComment CF with (nolock) INNER JOIN RSV_Heading CFH with (nolock) ON CF.PCC_BookingID = CFH.ID
                    WHERE CF.PCC_PDLID = PRI.PDLID AND LEN(cast(CF.PCC_Comment as varchar(8000))) > 20 
                    AND CF.PCC_Active = 1 AND CF.PCC_Block = 0) as NoOfFeed
                , Pic3.IMG_Path_URL
                , convert(varchar(10), SPR.STP_StartTravelDate, 101) as STP_StartTravelDate
                , SPR.STP_MiniTitle
                , PHI.STR_PlaceTitle
		        , isnull((select top 1 [STR_PlaceTitle] from [dbo].[STR_Places_Hierarchy] ph where ph.[STR_PlaceID] = pro.[SPD_CountryPlaceID] and ph.[STR_NoWeb]=0 and ph.[STR_PlaceActive]=1),'none') as CountryName
           FROM PRD_PlaceXProductItem PXP with (nolock) 
           LEFT Join STR_Places_Hierarchy PHI with (nolock) ON PHI.STR_PlaceID = PXP.CXZ_ChildPlaceID 
           INNER JOIN PRD_ProductItem PRI with (nolock) ON PRI.PDLID = PXP.CXZ_ProductItem  
           INNER Join PRD_Product PRO with (nolock) ON PRO.SPDID = PRI.PDL_ProductID
           LEFT Join STR_SitePromotion SPR with (nolock) ON SPR.STP_ProdItemID =PRI.PDLID AND SPR.STP_Active = 1
               AND SPR.STP_StartDate <= CONVERT(VARCHAR(10), GETDATE(), 101) AND SPR.STP_EndDate >= CONVERT(VARCHAR(10), GETDATE(), 101)
               AND SPR.STP_UserID =  243 
           LEFT JOIN PRD_ProductXImages Pic2 with (nolock) ON Pic2.PXI_ProductID = PRI.PDL_ProductID AND Pic2.PXI_Sequence = 0 AND Pic2.PXI_Active = 1
           LEFT JOIN APP_Images Pic3 with (nolock) ON Pic3.IMGID = Pic2.PXI_ImageID
           WHERE PXP.CXZ_Active = 1 AND Pic3.IMG_Active = 1 AND PRI.PDL_Active = 1 AND PRI.PDL_NoWeb = 0 AND PRO.SPD_Active = 1 AND PRO.SPD_ProductTypeSysCode = 34
               AND PHI.STR_UserID =  243  AND PHI.STR_NoWeb = 0 AND PHI.STR_ProdKindID = 0 AND PHI.STR_PlaceID in (" + placeId + @") 
               AND PRO.SPD_InternalComments LIKE '%" + InternalComments + @"%' AND PRO.SPD_StarratingSysCode <> 541 AND PHI.STR_PlaceActive = 1
               AND PDL_Title NOT LIKE 'Zpend%'" + citiesList + @"
               ORDER BY case when cast(SPR.STP_Save as Money) > 0 then 11 else 0 end desc, 10 desc, cast(isnull(STP_Save,9999) as Money), case when SPR.STP_NumOfNights is null then PRI.PDL_Duration else SPR.STP_NumOfNights end, PDL_Title";
        }

        public static string SQL_GetAllPacksCountryFirstPage(string placeId)
        {
            return @"Select top 10 PRI.PDLID, PRI.PDL_Title, PRI.PDL_Content, PRI.PDL_SequenceNo, PRI.PDL_Places
                ,case when SPR.STP_NumOfNights is null then PRI.PDL_Duration else SPR.STP_NumOfNights end as STP_NumOfNights
                , PRO.SPD_Description 
                , SPD_InternalComments 
                , cast(isnull(SPR.STP_Save,9999) as Money) as STP_Save
                ,(SELECT COUNT (CF.PCCID) as NoOfFeed FROM PRD_CustomerComment CF with (nolock) INNER JOIN RSV_Heading CFH with (nolock) ON CF.PCC_BookingID = CFH.ID
                    WHERE CF.PCC_PDLID = PRI.PDLID AND LEN(cast(CF.PCC_Comment as varchar(8000))) > 20 
                    AND CF.PCC_Active = 1 AND CF.PCC_Block = 0) as NoOfFeed
                , Pic3.IMG_Path_URL
                , convert(varchar(10), SPR.STP_StartTravelDate, 101) as STP_StartTravelDate
                , SPR.STP_MiniTitle
                , PHI.STR_PlaceTitle
		        , isnull((select top 1 [STR_PlaceTitle] from [dbo].[STR_Places_Hierarchy] ph where ph.[STR_PlaceID] = pro.[SPD_CountryPlaceID] and ph.[STR_NoWeb]=0 and ph.[STR_PlaceActive]=1),'none') as CountryName
           FROM PRD_PlaceXProductItem PXP with (nolock) 
           LEFT Join STR_Places_Hierarchy PHI with (nolock) ON PHI.STR_PlaceID = PXP.CXZ_ChildPlaceID 
           INNER JOIN PRD_ProductItem PRI with (nolock) ON PRI.PDLID = PXP.CXZ_ProductItem  
           INNER Join PRD_Product PRO with (nolock) ON PRO.SPDID = PRI.PDL_ProductID
           LEFT Join STR_SitePromotion SPR with (nolock) ON SPR.STP_ProdItemID =PRI.PDLID AND SPR.STP_Active = 1
               AND SPR.STP_StartDate <= CONVERT(VARCHAR(10), GETDATE(), 101) AND SPR.STP_EndDate >= CONVERT(VARCHAR(10), GETDATE(), 101)
               AND SPR.STP_UserID =  243 
           LEFT JOIN PRD_ProductXImages Pic2 with (nolock) ON Pic2.PXI_ProductID = PRI.PDL_ProductID AND Pic2.PXI_Sequence = 0 AND Pic2.PXI_Active = 1
           LEFT JOIN APP_Images Pic3 with (nolock) ON Pic3.IMGID = Pic2.PXI_ImageID
           WHERE PXP.CXZ_Active = 1 AND Pic3.IMG_Active = 1 AND PRI.PDL_Active = 1 AND PRI.PDL_NoWeb = 0 AND PRO.SPD_Active = 1 AND PRO.SPD_ProductTypeSysCode = 34
               AND PHI.STR_UserID =  243  AND PHI.STR_NoWeb = 0 AND PHI.STR_ProdKindID = 0 AND PHI.STR_PlaceID in (" + placeId + @") 
               AND PRO.SPD_InternalComments LIKE '%" + InternalComments + @"%' AND PRO.SPD_StarratingSysCode <> 541 AND PHI.STR_PlaceActive = 1
               AND PDL_Title NOT LIKE 'Zpend%'
               ORDER BY case when cast(SPR.STP_Save as Money) > 0 then 11 else 0 end desc, 10 desc, cast(isnull(STP_Save,9999) as Money), case when SPR.STP_NumOfNights is null then PRI.PDL_Duration else SPR.STP_NumOfNights end, PDL_Title";
        }
        public static string SQL_HotelsFrom_cmpComponentID(string cmpComponentID, string packID)
        {
            return @"SELECT	PCC_PackProdItemID, PCC_ComponentID, PCC_ChoiceProdItemID, PDLID, PDL_Title
                    FROM PRD_PackageXComponentXChoice 
                    inner join PRD_ProductItem on PRD_PackageXComponentXChoice.PCC_ChoiceProdItemID = PRD_ProductItem.PDLID	
                    WHERE	PCC_ComponentID = 849783 
                    AND PRD_PackageXComponentXChoice.PCC_Active = 1 
                    AND	((PRD_PackageXComponentXChoice.PCC_Shareable =1 ) OR (PRD_PackageXComponentXChoice.PCC_PackProdItemId = 860886))
                    AND PRD_ProductItem.PDL_Active = 1
                    AND PDL_Title not like 'Zblock-%' 
                    AND PDL_Title not like 'Zpend-%' 
                    AND PDL_Title not like 'ZZZ%' 
                    AND PDL_Title not like '%Hotel Master'
                    Order by PDL_Title";
        }
    }

}
