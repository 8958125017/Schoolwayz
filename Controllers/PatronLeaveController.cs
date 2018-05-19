using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

using SchoolWayz.Data.Models.SmartTrack;
using Microsoft.Extensions.Options;
using System;
using SchoolWayz.Cloud.Web.Framework;

namespace SchoolWayz.Cloud.Service.Controllers
{
    [Route("api/[controller]")]
    public class PatronLeaveController : BaseController<PatronLeaveDetail>
    {



        public PatronLeaveController(IOptions<AppSettings> settings) : base(settings)
        {

        }


        // GET api/values/5
        [HttpGet("{organizationid}/{date}")]
        public async new Task<IActionResult> Get(string organizationid, string date)
        {
            // Get all the documents from the collection

            var result = (await this.repository.WhereAsync(p => p.type.Equals(typeof(PatronTracking).Name)
                                                                 && p.organizationid.Equals(organizationid)
                                                                  && DateTime.Parse(p.StartDate) <= Convert.ToDateTime(date)
                                                                 && DateTime.Parse(p.EndDate) >= Convert.ToDateTime(date))).AsEnumerable();
            if (result == null)
            {
                return NotFound();
            }
            return new ObjectResult(result);

        }

        // GET api/values/5
        [HttpGet("{organizationid}/{classid}/{sectionid}/{date}")]
        public async Task<IActionResult> Get(string organizationid, string classid, string sectionid, string date)
        {
            // Get all the documents from the collection

            var result = (await this.repository.WhereAsync(p => p.type.Equals(typeof(PatronTracking).Name)
                                                                && p.organizationid.Equals(organizationid)
                                                                && p.Class.Equals(classid)
                                                                && p.Section.Equals(sectionid)
                                                                 && DateTime.Parse(p.StartDate) <= Convert.ToDateTime(date)
                                                                 && DateTime.Parse(p.EndDate) >= Convert.ToDateTime(date))).AsEnumerable();
            if (result == null)
            {
                return NotFound();
            }
            return new ObjectResult(result);

        }


        



    }
}
