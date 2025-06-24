using Microsoft.AspNetCore.Mvc;

namespace MVC_TMED.Views.ViewComponents
{
    public class SuggestedViewComponent : ViewComponent
    {
        public IViewComponentResult Invoke()
        {
            return View("SuggestedPacks");
        }
    }
}
