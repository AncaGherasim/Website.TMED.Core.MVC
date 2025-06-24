using Microsoft.AspNetCore.Mvc;

namespace MVC_TMED.Views.ViewComponents
{
    public class GuidedSellerViewComponent : ViewComponent
    {
        public IViewComponentResult Invoke()
        {
            return View("GuidedSellerPacks");
        }
    }
}
