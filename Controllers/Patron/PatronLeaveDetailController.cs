using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

using SchoolWayz.Data.Models.SmartTrack;
using SchoolWayz.Cloud.Web.Framework;
using Microsoft.Extensions.Options;
using SchoolWayz.Data.Models;
// For more information on enabling Web API for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace SchoolWayz.Cloud.Service.Controllers
{
    [Route("api/Patron/Leave")]
    public class PatronLeaveDetailController : BaseController<PatronLeaveDetail>
    {

        public PatronLeaveDetailController(IOptions<AppSettings> settings) : base(settings)
        {

        }

        [HttpGet("OnLeave/{organizationid}/{date}")]
        public async Task<IActionResult> OnLeave(string organizationid, string date)
        {
            // Get all the documents from the collection

            var result = (await this.repository.WhereAsync(p => p.type.Equals(typeof(PatronLeaveDetail).Name)
                                                                 && p.organizationid.Equals(organizationid)
                                                                  && p.StartDate.CompareTo(date) <= 0 && p.EndDate.CompareTo(date) >= 0
                                                                 )).AsEnumerable();
            if (result == null)
            {
                return NotFound();
            }
            return new ObjectResult(result);

        }

        [HttpGet("OnLeave/{organizationid}/{date}/{patronId}")]
        public async Task<IActionResult> OnLeave(string organizationid, string date, string patronId)
        {
            // Get all the documents from the collection

            var result = (await this.repository.WhereAsync(p => p.type.Equals(typeof(PatronLeaveDetail).Name)
                                                                 && p.organizationid.Equals(organizationid)
                                                                 && p.PatronId.Equals(patronId)
                                                                  && p.StartDate.CompareTo(date) <= 0 && p.EndDate.CompareTo(date) >= 0
                                                                 )).AsEnumerable().FirstOrDefault();
            if (result == null)
            {
                return NotFound();
            }
            return new ObjectResult(result);

        }

        [HttpGet("LeaveShift/{organizationid}/{trackingType}/{classid}/{sectionid}/{date}")]
        public async Task<IActionResult> LeaveShift(string organizationid, AttendanceType trackingType, string classid, string sectionid, string date)
        {
            var result = (PatronLeaveDetail)null;
            if (trackingType == AttendanceType.FirstHalf)
            {
                result = (await this.repository.WhereAsync(p => p.type.Equals(typeof(PatronLeaveDetail).Name)
                                                                 && p.organizationid.Equals(organizationid)
                                                                  && p.Class.Equals(classid)
                                                                && p.Section.Equals(sectionid)
                                                                  && p.StartDate.CompareTo(date) <= 0 && p.EndDate.CompareTo(date) >= 0
                                                                  && p.FirstHalf
                                                                 )).AsEnumerable().FirstOrDefault();
            }
            if (trackingType == AttendanceType.SecondHalf)
            {
                result = (await this.repository.WhereAsync(p => p.type.Equals(typeof(PatronLeaveDetail).Name)
                                                                && p.organizationid.Equals(organizationid)
                                                                 && p.Class.Equals(classid)
                                                                && p.Section.Equals(sectionid)
                                                                 && p.StartDate.CompareTo(date) <= 0 && p.EndDate.CompareTo(date) >= 0
                                                                 && p.SecondHalf
                                                                )).AsEnumerable().FirstOrDefault();
            }
                if (result == null)
            {
                return NotFound();
            }
            return new ObjectResult(result);

        }

        [HttpGet("PatronLeave/{organizationid}/{patronId}")]
        public async Task<IActionResult> PatronLeave(string organizationid, string patronId)
        {
            // Get all the documents from the collection

            var result = (await this.repository.WhereAsync(p => p.type.Equals(typeof(PatronLeaveDetail).Name)
                                                                 && p.organizationid.Equals(organizationid)
                                                                 && p.PatronId.Equals(patronId)                                                                 
                                                                 )).AsEnumerable();
            if (result == null)
            {
                return NotFound();
            }
            return new ObjectResult(result);

        }

        // GET api/values/5
        [HttpGet("OnLeave/{organizationid}/{classid}/{sectionid}/{date}")]
        public async Task<IActionResult> OnLeave(string organizationid, string classid, string sectionid, string date)
        {
            // Get all the documents from the collection
            

            var result = (await this.repository.WhereAsync(p => p.type.Equals(typeof(PatronLeaveDetail).Name)
                                                                && p.organizationid.Equals(organizationid)
                                                                && p.Class.Equals(classid)
                                                                && p.Section.Equals(sectionid)
                                                                 && p.StartDate.CompareTo(date) <=0 && p.EndDate.CompareTo(date) >= 0
                                                                 )).AsEnumerable();
            if (result == null)
            {
                return NotFound();
            }
            return new ObjectResult(result);

        }

        [HttpPut]
        [Route("RemovePatron/{organizationid}/{patronId}/{selectedDate}")]
        public async Task<IActionResult> RemovePatron(string organizationid, string patronId, string selectedDate)
        {

            // If the patronid, stoppageid or organization id is not valid
            if (patronId == null ||
                 patronId.Length == 0 ||
                 organizationid == null ||
                 organizationid.Length == 0 ||
                 selectedDate == null ||
                 selectedDate.Length == 0
                )
            {
                return BadRequest();
            }


            // Get the route document

            PatronLeaveDetail routedoc = (await this.repository.WhereAsync(p => p.type.Equals(typeof(PatronLeaveDetail).Name)
                                                              && p.organizationid.Equals(organizationid)
                                                              && p.PatronId.Equals(patronId)
                                                              //&& p..Equals(patronId)
                                                              )).AsEnumerable().FirstOrDefault();

           
            // Update the document

            var result = (await this.repository.AddOrUpdateAsync(routedoc));

            return new OkResult();
        }

    }
}
