using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using SchoolWayz.Cloud.Web.Framework;
using SchoolWayz.Data.Models.SmartTrack;
using Microsoft.Extensions.Options;
using Newtonsoft.Json.Linq;
// For more information on enabling Web API for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860
namespace SchoolWayz.Cloud.Service.Controllers.Route
{
    [Route("api/Route/Monitoring")]
    public class TransportRouteMonitoringController : BaseController<TransportRouteRunMonitoring>
    {

        public TransportRouteMonitoringController(IOptions<AppSettings> settings) : base(settings)
        {

        }

        // Get Current Position of Routes
        [HttpGet]
        [Route("Current/{organizationid}/{date}")]
        public async Task<IActionResult> GetCurrentPosition(string organizationid, string date)
        {


            // Check the valid organizationid
            if (organizationid == null || organizationid.Length == 0 || date == null || date.Length != 10)
            {
                return BadRequest();
            }



            var result = await this.repository.ExecuteSP<dynamic>(StoredProcedureLinks.usp_GetRoutesCurrentLocation, organizationid, date);


            // Check the response is present   

            if (result.Response == null)
            {
                return NotFound();
            }

            // conver the response to json array, which will be consumed by the client

            JArray responseArray = JArray.Parse(result.Response);

            return new ObjectResult(responseArray);

        }

    }
}
