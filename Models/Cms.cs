using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MVC_TMED.Models
{
    public class CMSContent
    {
        public Int32 CMSID { get; set; }
        public String CMS_Title { get; set; }
        public String CMS_Description { get; set; }
        public String CMS_Content { get; set; }
        public Int32 CMS_Active { get; set; }
        public Int32 CMS_AuthorID { get; set; }
        public DateTime CMS_CreatedDate { get; set; }
        public Int32 CMS_LastUpdateID { get; set; }
        public DateTime CMS_LastUpdateDate { get; set; }
    }
}
