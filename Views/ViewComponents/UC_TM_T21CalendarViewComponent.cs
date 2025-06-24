using Microsoft.AspNetCore.Mvc;

namespace MVC_TMED.Views.ViewComponents
{
    public class UC_TM_T21CalendarViewComponent : ViewComponent
    {
        public IViewComponentResult Invoke()
        {
            return View("Index");
        }

    }
}
