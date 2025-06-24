using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MVC_TMED.Models;

namespace MVC_TMED.Models.ViewModels
{
    public class HomeViewModel
    {
        public List<FeatItins> objAllItineraries = new List<FeatItins>();
        public Int32 NumComments;
        public decimal Score;
        public List<CustCommentsUserId> listReviews = new List<CustCommentsUserId>();
        public List<SpotLight> listSpotLights = new List<SpotLight>();
        public Dictionary<string, string> ctyDictionary = new Dictionary<string, string>();
        public List<ExploreDest> listexploreDest = new List<ExploreDest>();
        public List<Highlights> listHighlights = new List<Highlights>();
        public List<string> spotLightBann;
        public List<string> spotLightCities;
    }
}
