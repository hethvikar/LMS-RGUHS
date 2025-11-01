using Microsoft.AspNetCore.Mvc;

namespace PlacementCellApi.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
