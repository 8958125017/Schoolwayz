using Microsoft.AspNetCore.Mvc;

using SchoolWayz.Data.Models.SmartTrack;

using Microsoft.Extensions.Options;
// For more information on enabling Web API for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860
using SchoolWayz.Cloud.Web.Framework;
namespace SchoolWayz.Cloud.Web.Controllers
{
    [Route("api/[controller]")]
    public class TransportRouteController : BaseController<TransportRoute>
    {
        public TransportRouteController(IOptions<AppSettings> setting) : base(setting)
        {

        }

        [HttpPost]
        [Route("addStoppage/{routeId}")]
        public async void addStoppage(string routeId, [FromBody]TransportStoppage value)
        {
            
            var result = (await this.repository.ExecuteSPByName<string>("update", "update c  set c.TransportStoppages ='" + value + "' where c.type='" + typeof(TransportRoute).Name +
                                                                                    "' and c.routenumber ='" + routeId + "'"));
        }

       

    }
}
