using Microsoft.AspNetCore.Mvc;
using SchoolWayz.Cloud.Web.Framework;
using SchoolWayz.Data.Models.SmartTrack;

using Microsoft.Extensions.Options;
using System.Linq;
using System.Threading.Tasks;
// For more information on enabling Web API for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace SchoolWayz.Cloud.Web.Controllers
{
    [Route("api/[controller]")]
    public class EventController : BaseController<Event>
    {
        
        public EventController(IOptions<AppSettings> setting) : base(setting)
        {

        }
        [HttpPut]
        [Route("AddPatron/{organizationid}/{eventid}/{patronid}")]
        public async Task<IActionResult> AddPatron(string organizationid, string eventid, string patronid)
        {

            // If the patronid or organization id is not valid
            if (organizationid == null ||
                 organizationid.Length == 0||
                 eventid == null ||
                 eventid.Length == 0 ||
                 patronid==null||
                 patronid.Length==0
                )
            {
                return BadRequest();
            }


            // Get the route document

            Event eventdoc = (await this.repository.WhereAsync(p => p.type.Equals(typeof(Event).Name)
                                                              && p.organizationid.Equals(organizationid)
                                                              && p.Id.Equals(eventid))).AsEnumerable().FirstOrDefault();


            // Check if the Patron already exist for route
           if(eventdoc.PatronId.Contains(patronid))
            {
                eventdoc.PatronId.Remove(patronid);
            }          
            // Add the new value
            eventdoc.PatronId.Add(patronid);



            var result = (await this.repository.AddOrUpdateAsync(eventdoc));

            return new ObjectResult(result);
        }

        [HttpPut]
        [Route("DeclinePatron/{organizationid}/{eventid}")]
        public async Task<IActionResult> DeclinePatron(string organizationid, string eventid, [FromBody]DeclineRequest value)
        {

            // If the patronid, stoppageid or organization id is not valid
            if (eventid == null ||
                 eventid.Length == 0 ||
                 organizationid == null ||
                 organizationid.Length == 0
                )
            {
                return BadRequest();
            }


            // Get the route document

            Event eventdoc = (await this.repository.WhereAsync(p => p.type.Equals(typeof(Event).Name)
                                                              && p.organizationid.Equals(organizationid)
                                                              && p.Id.Equals(eventid))).AsEnumerable().FirstOrDefault();

            // Get The Stoppage Object 



            if (eventdoc.PatronId.Contains(value.DeclinedPatron))
            {
                // Remove the stoppage from the route
                eventdoc.PatronId.Remove(value.DeclinedPatron);
                eventdoc.DeclineRequest.Add(value);
            }
            
            // Update the document

            var result = (await this.repository.AddOrUpdateAsync(eventdoc));

            return new OkResult();
        }

        [HttpPut]
        [Route("RemovePatron/{organizationid}/{eventid}/{patronid}")]
        public async Task<IActionResult> RemovePatron(string organizationid, string eventid,  string patronid)
        {

            // If the patronid, stoppageid or organization id is not valid
            if (eventid == null ||
                 eventid.Length == 0 ||
                 patronid == null ||
                 patronid.Length == 0 ||
                 organizationid == null ||
                 organizationid.Length == 0
                )
            {
                return BadRequest();
            }


            // Get the route document

            Event eventdoc = (await this.repository.WhereAsync(p => p.type.Equals(typeof(Event).Name)
                                                              && p.organizationid.Equals(organizationid)
                                                              && p.Id.Equals(eventid))).AsEnumerable().FirstOrDefault();

            // Get The Stoppage Object 
           


            if (eventdoc.PatronId.Contains(patronid))
            {
                // Remove the stoppage from the route
                eventdoc.PatronId.Remove(patronid);

            }

            // Update the document

            var result = (await this.repository.AddOrUpdateAsync(eventdoc));

            return new OkResult();
        }
        [HttpGet]
        [Route("GetCurrentEvent/{organizationid}")]
        public async Task<IActionResult> GetCurrentEvent(string organizationid)
        {


            // Check the valid organizationid
            if (organizationid == null || organizationid.Length == 0 )
            {
                return BadRequest();
            }
          // Get current Event

            Event result = (await this.repository.WhereAsync(p => p.type.Equals(typeof(Event).Name)
                                                           && p.organizationid.Equals(organizationid)                                                          
                                                      )).OrderByDescending(x =>x.StartDate).FirstOrDefault();

            return new ObjectResult(result);



        }
    }
}
