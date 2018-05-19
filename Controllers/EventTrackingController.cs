using Microsoft.AspNetCore.Mvc;
using SchoolWayz.Cloud.Web.Framework;
using SchoolWayz.Data.Models.SmartTrack;

using Microsoft.Extensions.Options;
using System.Threading.Tasks;
using System.Linq;
// For more information on enabling Web API for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace SchoolWayz.Cloud.Web.Controllers
{
    [Route("api/[controller]")]
    public class EventTrackingController : BaseController<EventTracking>
    {
        public EventTrackingController(IOptions<AppSettings> setting) : base(setting)
        {

        }
        [Route("GetAll/{organizationid}")]
        public async Task<IActionResult> GetAll(string organizationid)
        {
            // Get all the documents from the collection

            var result = (await this.repository.WhereAsync(p => p.type.Equals(typeof(EventTracking).Name)
                                                                 && p.organizationid.Equals(organizationid)
                                                                 )).AsEnumerable();
            if (result == null)
            {
                return NotFound();
            }
            return new ObjectResult(result);

        }

        [Route("GetAll/{organizationid}/{eventId}")]
        public async Task<IActionResult> GetAll(string organizationid, string eventId)
        {
            // Get all the documents from the collection

            var result = (await this.repository.WhereAsync(p => p.type.Equals(typeof(EventTracking).Name)
                                                                 && p.organizationid.Equals(organizationid)
                                                                 && p.EventId.Equals(eventId))).AsEnumerable();
            if (result == null)
            {
                return NotFound();
            }
            return new ObjectResult(result);

        }


    }


}
