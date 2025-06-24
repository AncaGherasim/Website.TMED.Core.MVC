using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MVC_TMED.Infrastructure;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using MVC_TMED.Models;
using MVC_TMED.Models.ViewModels;
using System.Xml;
using System.Text;
using Dapper;
using System.Data;
using System.Data.SqlClient;
using MVC_TMED.Infrastructure;

namespace MVC_TMED.Views.ViewComponents
{
    public class UC_TM_SmallCalendarViewComponent : ViewComponent
    {
        public IViewComponentResult Invoke()
        {
            return View("Index");
        }

    }

}
