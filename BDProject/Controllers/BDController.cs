using Microsoft.AspNetCore.Mvc;

using Microsoft.AspNetCore.Authorization;

namespace BDProject.Controllers
{
    [Authorize]
    public class BDController : Controller
    {
        #region----Index Page-------
        public IActionResult Index()
        {
            return View();
        }
        #endregion

        public IActionResult Intro()
        {
            return View();
        }

        #region-----Photos Image----
        public IActionResult photos()
        {
            return View();
        }
        #endregion

        public IActionResult SpecialMoments()
        {
            return View();
        }

      


        #region----Puzzle Game-----
        public IActionResult PuzzleGame()
        {
            return View();
        }

        #endregion

        #region---Countdown-----
        public IActionResult Countdown()
        {
            return View();
        }
        #endregion

        public IActionResult Places()
        {
            return View();
        }

        public IActionResult Songs()
        {
            return View();
        }

        public IActionResult Letter()
        {
            return View();
        }

    }
}
