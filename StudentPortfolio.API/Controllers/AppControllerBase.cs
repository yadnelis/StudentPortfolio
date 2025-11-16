using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Infrastructure;

namespace StudentPortfolio.API.Controllers
{
    public class AppControllerBase(IWebHostEnvironment env) : ControllerBase
    {
        [NonAction]
        [ApiExplorerSettings(IgnoreApi = true)]
        public override OkObjectResult Ok([ActionResultObjectValue] object value)
        {
            return base.Ok(new
            {
                Entity = value,
                Time = DateTime.UtcNow,
                Resource = HttpContext.Request.Path.Value,
            });
        }

        [NonAction]
        [ApiExplorerSettings(IgnoreApi = true)]
        public new OkObjectResult Ok()
        {
            return base.Ok(new
            {
                Time = DateTime.UtcNow,
                Resource = HttpContext.Request.Path.Value,
            });
        }

        [NonAction]
        [ApiExplorerSettings(IgnoreApi = true)]
        public BadRequestObjectResult BadRequest([ActionResultObjectValue] Exception error)
        {
            if(env.IsDevelopment())
            {
                return base.BadRequest(new
                {
                    Time = DateTime.UtcNow,
                    Resource = HttpContext.Request.Path.Value,
                    Exception = error.Message,
                    StackTrace = error.StackTrace
                });
            }
            else
            {
                return base.BadRequest(new
                {
                    Time = DateTime.UtcNow,
                    Resource = HttpContext.Request.Path.Value
                });
            }
        }
    }
}
