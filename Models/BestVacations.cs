using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MVC_TMED.Models
{
    public class MasterInterestContentTemplate
    {
        public string SMC_Template { get; set; }
        public string STR_PlaceTitle { get; set; }
    }

    public class Interest_Info
    {
        public Int32 SMCID { get; set; }
        public string SMC_Title { get; set; }
        public Int32 SMC_SysCodeID { get; set; }
        public string SMC_Content { get; set; }
        public Int32 SMC_Active { get; set; }
        public Int32 SMC_UserID { get; set; }
        public Int32 SMC_PlaceHierarchyID { get; set; }
        public string SMC_Template { get; set; }
        public Int32 SEOID { get; set; }
        public Int32 SEO_PDLID { get; set; }
        public Int32 SEO_STRID { get; set; }
        public Int32 SEO_SMCID { get; set; }
        public Int32 SEO_PLCID { get; set; }
        public string SEO_PageTitle { get; set; }
        public string SEO_MetaDescription { get; set; }
        public string SEO_MetaKeyword { get; set; }
        public Int32 SEO_Active { get; set; }
        public string SEO_HeaderText { get; set; }
        public string SEO_GoogleRemarketing { get; set; }
        public string SEO_BannerText { get; set; }

    }
}
