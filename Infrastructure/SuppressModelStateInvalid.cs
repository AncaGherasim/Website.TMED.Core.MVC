using System;
using Microsoft.AspNetCore.Mvc.ApplicationModels;

namespace MVC_TMED.Infrastructure
{
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
    public class SuppressModelStateInvalidFilterAttribute : Attribute, IActionModelConvention
    {
        public void Apply(ActionModel action)
        {
            for (var i = 0; i < action.Filters.Count; i++)
            {
                var filter = action.Filters[i];
                if (filter.GetType().Name == "ModelStateInvalidFilterFactory")
                {
                    action.Filters.RemoveAt(i);
                    break;
                }
            }
        }
    }
}