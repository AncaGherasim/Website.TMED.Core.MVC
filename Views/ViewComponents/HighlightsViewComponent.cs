using Microsoft.AspNetCore.Mvc;

namespace MVC_TMED.Views.ViewComponents
{
    public class HighlightsViewComponent : ViewComponent
    {
        public IViewComponentResult Invoke()
        {
            return View("Highlights");
        }
    }
}
