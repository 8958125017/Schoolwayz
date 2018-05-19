using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

using SchoolWayz.Data.Models.SmartTrack;

using Microsoft.Extensions.Options;

using SchoolWayz.Cloud.Web.Framework;

namespace SchoolWayz.Cloud.Web.Controllers
{
    [Route("api/[controller]")]
    public class RouteMonitoringController : BaseController<TransportRouteRunMonitoring>
    {



        public RouteMonitoringController(IOptions<AppSettings> settings) : base(settings)
        {

        }
        [Route("GetLocation/{organizationid}/{routeId}/{date}")]
        public async Task<IActionResult> GetLocation(string organizationid,string routeId,string date)
        {
            // Get all the documents from the collection

            var result = (await this.repository.WhereAsync(p => p.type.Equals(typeof(TransportRouteRunMonitoring).Name)
                                                                 && p.organizationid.Equals(organizationid)
                                                                 && p.RouteID.Equals(routeId)
                                                                 && p.MonitoringDate.Equals(date)
                                                                 )).AsEnumerable().OrderByDescending(x => x.MonitoringTime).First();
            if (result == null)
            {
                return NotFound();
            }
            return new ObjectResult(result);

        }
        [Route("GetLocations/{organizationid}/{date}")]
        public async Task<IActionResult> GetLocations(string organizationid, string date)
        {
            // Get all the documents from the collection

            var result = (await this.repository.WhereAsync(p => p.type.Equals(typeof(TransportRouteRunMonitoring).Name)
                                                                 && p.organizationid.Equals(organizationid)
                                                                 && p.MonitoringDate.Equals(date)
                                                                 )).AsEnumerable().OrderByDescending(x => x.MonitoringTime).GroupBy(x => x.RouteID).Select(x => x.First());//Select(row => new { row.RouteNumber,row.Lattitude,row.Longitude,row.MonitoringTime }).Select(row => new { row.RouteNumber}).Distinct();
            if (result == null)
            {
                return NotFound();
            }
            return new ObjectResult(result);

        }
    }
}
