using System;

namespace MVC_TMED.Infrastructure
{
    public class PostgresCalls
    {
        public static string PG_MV_TopSellingPackages(Int32 countryPlaceId)
        {
            return @"select * from dbo.web_tm_mv_topsellingpackages where spd_countryplaceid = " + countryPlaceId + @" order by noofsales desc limit 3";
        }
        public static string PG_MV_FooterDestinations()
        {
            return @"SELECT regionid, countryid, countryname, cityid, cityname, cityrank
                    FROM dbo.web_tm_mv_destinations
                    WHERE cityrank < 2
                    ORDER BY regionid ASC, countryname ASC, cityrank ASC";
        }

        public static string PG_MV_NoOfPacksFeaturedItinByPlaceId(string internalComments, Int32 placeId)
        {
            return @"select sum(noofpacks) as NoOfPacks from dbo.web_tm_mv_getnoofpacksbyplace where SPD_InternalComments LIKE '%" + internalComments + @"%' and cxz_childplaceid = " + placeId;
        }

        public static string PG_MV_Feedbacks()
        {
            return @"select * from dbo.web_tm_mv_feedbacks";
        }

        public static string PG_Func_iMaxMind()
        {
            return @"SELECT * FROM dbo.imaxmind_placebyip_web(@ipAdr)";
        }
        public static string PG_Func_Packagesbyplaceid()
        {
            string squery = @"WITH filtered_packages AS (
              SELECT *
              FROM dbo.web_tm_mv_packagesbyplaceid
              WHERE str_userid = @UserId
                AND CXZ_ChildPlaceID = @PlaceId
            ),
            paginated AS (
              SELECT *, COUNT(*) OVER() AS TotalCount
              FROM filtered_packages
              ORDER BY CASE WHEN STP_Save = 9999 THEN 1 ELSE 0 END, NoofFeed DESC, STP_Save ASC, Duration ASC, PDL_Title ASC
              LIMIT 20
            ),
            aggregates AS (
              SELECT
                CASE WHEN SUM(CASE WHEN (stp_save BETWEEN 0 AND 999 OR stp_save = 9999) THEN 1 ELSE 0 END) > 0
                     THEN '999 or less|0_999' END AS price_filter_1,
                CASE WHEN SUM(CASE WHEN (stp_save BETWEEN 1000 AND 1999) THEN 1 ELSE 0 END) > 0
                     THEN '1000 - 1999|1000_1999' END AS price_filter_2,
                CASE WHEN SUM(CASE WHEN (stp_save BETWEEN 2000 AND 2999) THEN 1 ELSE 0 END) > 0
                     THEN '2000 - 2999|2000_2999' END AS price_filter_3,
                CASE WHEN SUM(CASE WHEN (stp_save BETWEEN 3000 AND 3999) THEN 1 ELSE 0 END) > 0
                     THEN '3000 - 3999|3000_3999' END AS price_filter_4,
                CASE WHEN SUM(CASE WHEN (stp_save >= 4000 AND stp_save <> 9999) THEN 1 ELSE 0 END) > 0
                     THEN '4000 or more|4000_MAX' END AS price_filter_5,
                CASE WHEN SUM(CASE WHEN (duration BETWEEN 1 AND 7) THEN 1 ELSE 0 END) > 0
                     THEN '7 nights or less|1_7' END AS nights_filter_1,
                CASE WHEN SUM(CASE WHEN (duration BETWEEN 8 AND 10) THEN 1 ELSE 0 END) > 0
                     THEN '8 to 10 nights|8_10' END AS nights_filter_2,
                CASE WHEN SUM(CASE WHEN (duration BETWEEN 11 AND 14) THEN 1 ELSE 0 END) > 0
                     THEN '11 to 14 nights|11_14' END AS nights_filter_3,
                CASE WHEN SUM(CASE WHEN (duration >= 15) THEN 1 ELSE 0 END) > 0
                     THEN '15 nights or more|15_MAX' END AS nights_filter_4
              FROM filtered_packages
            ),
            city_list AS (
              SELECT json_agg(row_to_json(cities)) AS cities
              FROM (
                SELECT DISTINCT ph1.STR_PlaceID, ph1.str_placetitle, ph2.STR_PlaceID as CounID, ph2.str_placetitle as CounName, COALESCE(ph1.STR_PlaceAIID, 1000) AS PlcRK
                FROM filtered_packages p,
	            LATERAL (
			               SELECT unnest(string_to_array(p.PDL_Places, ',')) AS city_id
			             ) cid
	            JOIN dbo.STR_Places_Hierarchy ph1 ON ph1.STR_PlaceID = cid.city_id::integer
	            JOIN dbo.STR_Places_Hierarchy ph2 ON ph2.STR_PlaceID = ph1.STR_Place1ParentID OR ph2.STR_PlaceID = ph1.STR_Place2ParentID 
                       WHERE ph1.STR_UserID = @UserId And ph1.STR_PlaceActive = true AND ph1.STR_PlaceTypeID in (1, 25, 6, 2) AND ph1.STR_NoWeb = false
                           AND ph1.STR_ProdKindID = 0 AND ph2.STR_UserID = @UserId AND trim(cid.city_id) <> ''
                           AND ph2.STR_PlaceTypeID = 5 AND ph2.STR_PlaceActive = true AND ph2.STR_NoWeb = false AND ph1.STR_PlaceTitle not like 'zz%' AND ph1.STR_PlaceTitle not like 'zPend%'
	  
              ) cities
            )
            SELECT json_build_object(
              'packages', (SELECT json_agg(row_to_json(paginated)) FROM paginated),
              'TotalCount', (SELECT TotalCount FROM paginated LIMIT 1),
              'aggregates', (SELECT row_to_json(aggregates) FROM aggregates),
              'cities', (SELECT cities FROM city_list)
            ) AS result;";
            return squery;
        }

        public static string PG_Func_PackagesbyListPlaceids()
        {
            string squery = @"WITH filtered_packages AS (
              SELECT pdlid, pdl_title, pdl_content, pdl_places, nooffeed, duration, stp_save, stp_starttraveldate, spd_description
	            , spd_internalcomments, img_path_url, countryname
              FROM dbo.web_tm_mv_packagesbyplaceid
              WHERE str_userid = @UserId
                AND CXZ_ChildPlaceID = ANY(@PlaceId)
	          GROUP BY pdlid, pdl_title, pdl_content, pdl_places, nooffeed, duration, stp_save, stp_starttraveldate, spd_description, spd_internalcomments,
    	            img_path_url, countryname
	          HAVING COUNT(DISTINCT CXZ_ChildPlaceID) = @CountriesNo
            ),
            paginated AS (
                SELECT *, COUNT(pdlid) OVER() AS TotalCount
                          FROM filtered_packages
                ORDER BY CASE WHEN STP_Save = 9999 THEN 1 ELSE 0 END, NoOfFeed DESC, STP_Save ASC, Duration ASC, PDL_Title ASC
                LIMIT 20
            ),
            aggregates AS (
              SELECT
                CASE WHEN SUM(CASE WHEN (stp_save BETWEEN 0 AND 999 OR stp_save = 9999) THEN 1 ELSE 0 END) > 0
                     THEN '999 or less|0_999' END AS price_filter_1,
                CASE WHEN SUM(CASE WHEN (stp_save BETWEEN 1000 AND 1999) THEN 1 ELSE 0 END) > 0
                     THEN '1000 - 1999|1000_1999' END AS price_filter_2,
                CASE WHEN SUM(CASE WHEN (stp_save BETWEEN 2000 AND 2999) THEN 1 ELSE 0 END) > 0
                     THEN '2000 - 2999|2000_2999' END AS price_filter_3,
                CASE WHEN SUM(CASE WHEN (stp_save BETWEEN 3000 AND 3999) THEN 1 ELSE 0 END) > 0
                     THEN '3000 - 3999|3000_3999' END AS price_filter_4,
                CASE WHEN SUM(CASE WHEN (stp_save >= 4000 AND stp_save <> 9999) THEN 1 ELSE 0 END) > 0
                     THEN '4000 or more|4000_MAX' END AS price_filter_5,
                CASE WHEN SUM(CASE WHEN (duration BETWEEN 1 AND 7) THEN 1 ELSE 0 END) > 0
                     THEN '7 nights or less|1_7' END AS nights_filter_1,
                CASE WHEN SUM(CASE WHEN (duration BETWEEN 8 AND 10) THEN 1 ELSE 0 END) > 0
                     THEN '8 to 10 nights|8_10' END AS nights_filter_2,
                CASE WHEN SUM(CASE WHEN (duration BETWEEN 11 AND 14) THEN 1 ELSE 0 END) > 0
                     THEN '11 to 14 nights|11_14' END AS nights_filter_3,
                CASE WHEN SUM(CASE WHEN (duration >= 15) THEN 1 ELSE 0 END) > 0
                     THEN '15 nights or more|15_MAX' END AS nights_filter_4
              FROM filtered_packages
            ),
            city_list AS (
              SELECT json_agg(row_to_json(cities)) AS cities
              FROM (
                SELECT DISTINCT ph1.STR_PlaceID, ph1.str_placetitle, ph2.STR_PlaceID as CounID, ph2.str_placetitle as CounName, COALESCE(ph1.STR_PlaceAIID, 1000) AS PlcRK
                FROM filtered_packages p,
	            LATERAL (
			               SELECT unnest(string_to_array(p.PDL_Places, ',')) AS city_id
			             ) cid
	            JOIN dbo.STR_Places_Hierarchy ph1 ON ph1.STR_PlaceID = cid.city_id::integer
	            JOIN dbo.STR_Places_Hierarchy ph2 ON ph2.STR_PlaceID = ph1.STR_Place1ParentID OR ph2.STR_PlaceID = ph1.STR_Place2ParentID 
                       WHERE ph1.STR_UserID = @UserId And ph1.STR_PlaceActive = true AND ph1.STR_PlaceTypeID in (1, 25, 6, 2) AND ph1.STR_NoWeb = false
                           AND ph1.STR_ProdKindID = 0 AND ph2.STR_UserID = @UserId AND trim(cid.city_id) <> ''
                           AND ph2.STR_PlaceTypeID = 5 AND ph2.STR_PlaceActive = true AND ph2.STR_NoWeb = false AND ph1.STR_PlaceTitle not like 'zz%' AND ph1.STR_PlaceTitle not like 'zPend%'
	  
              ) cities
            )
            SELECT json_build_object(
              'packages', (SELECT json_agg(row_to_json(paginated)) FROM paginated),
              'TotalCount', (SELECT TotalCount FROM paginated LIMIT 1),
              'aggregates', (SELECT row_to_json(aggregates) FROM aggregates),
              'cities', (SELECT cities FROM city_list)
            ) AS result;";
            return squery;
        }

        public static string PG_Func_Hotelsbyplaceid(bool isMap = false)
        {
            string limitClause = isMap ? "LIMIT 1" : "LIMIT 12";
            string squery = $@"WITH filtered_hotels AS (
                  SELECT *
                  FROM dbo.web_tm_mv_hotelsbyplaceid
                  WHERE gitp_plcid = @PlaceId
                ),
                city_zones AS (
                  SELECT DISTINCT cityzone, giph_tnzoneid FROM filtered_hotels
                ),
                ratings AS (
                  SELECT DISTINCT giph_tntournetrating FROM filtered_hotels
                ),
                reviews AS (
                  SELECT DISTINCT ghs_finalscore FROM filtered_hotels
                ),
                paged_hotels AS (
                  SELECT *
                  FROM filtered_hotels
                  ORDER BY pdl_title COLLATE ""C""
                  {limitClause}
                )
                SELECT json_build_object(
                  'TotalCount', (SELECT COUNT(*) FROM filtered_hotels),
                  'hotels',      (SELECT json_agg(ph.*) FROM paged_hotels ph),
                  'list_cityzones', (SELECT json_agg(cz) FROM city_zones cz),
                  'list_ratings',   (SELECT json_agg(r) FROM ratings r),
                  'list_reviews',   (SELECT json_agg(rv) FROM reviews rv)
                ) AS result;";
            return squery;
        }
    }
}
