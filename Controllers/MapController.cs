using Microsoft.AspNetCore.Mvc;

using SchoolWayz.Data.Models.SmartTrack;
using Microsoft.Extensions.Options;

// For more information on enabling Web API for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860
using SchoolWayz.Cloud.Web.Framework;

namespace SchoolWayz.Cloud.Web.Controllers
{
    [Route("api/[controller]")]
    public class MapController : BaseController<TransportRouteRunMonitoring>
    {
        public MapController(IOptions<AppSettings> setting) : base(setting)
        {

        }

    }
}
