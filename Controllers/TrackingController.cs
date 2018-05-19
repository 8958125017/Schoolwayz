using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using SchoolWayz.Cloud.Web.Framework;
using SchoolWayz.Data.Models.SmartTrack;

using Microsoft.Extensions.Options;
namespace SchoolWayz.Cloud.Service.Controllers
{
    [Route("api/[controller]")]
    public class TrackingController : BaseController<AttendanceTracking>
    {



        public TrackingController(IOptions<AppSettings> settings) : base(settings)
        {

        }


        // GET api/values/5
        [HttpGet("{organizationid}/{date}")]
        public async new Task<IActionResult> Get(string organizationid, string date)
        {
            // Get all the documents from the collection

            var result = (await this.repository.WhereAsync(p => p.type.Equals(typeof(PatronTracking).Name)
                                                                 && p.organizationid.Equals(organizationid)
                                                                 && p.TrackingDate.Equals(date))).AsEnumerable();
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
                                                                 && p.TrackingDate.Equals(date))).AsEnumerable();


            



            if (result == null)
            {
                return NotFound();
            }
            return new ObjectResult(result);

        }


        // GET api/values/5
        [Route("GetSummary/{organizationid}/{date}")]
        public async Task<IActionResult> GetSummary(string organizationid, string date)
        {
            // Get all the documents from the collection



            var present = await this.repository.ExecuteSPByName<string>("Count", "Select * from c where c.type='" + typeof(PatronTracking).Name +
                                                                        "' and c.TrackingDate ='" + date + "' and " +
                                                                        "c.OrganizationId='" + organizationid + "'");

            var total_patrons = await this.repository.ExecuteSPByName<string>("Count", "Select * from c where c.type='" + typeof(SchoolWayz.Data.Models.SmartTrack.Patron).Name +
                                                                        "c.OrganizationId='" + organizationid + "'");

            var onleave_patrons = await this.repository.ExecuteSPByName<string>("Count", "Select * from c where c.type='" + typeof(PatronLeaveDetail).Name +
                                                                        "c.OrganizationId='" + organizationid + "' and " +
                                                                         "' and c.StartDate <='" + date + "' and " +
                                                                          "' and c.EndDate >='" + date + "'" 
                                                                        );

            AttendanceSummary summary = new AttendanceSummary();

            summary.TotalPatrons = int.Parse(total_patrons.Response);
            summary.PresentPatrons = int.Parse(present.Response);
            summary.PatronsOnLeave = int.Parse(onleave_patrons.Response);

            //if (result == null)
            //{
            //    return NotFound();
            //}
            return new ObjectResult(summary);


        }

        [Route("GetSummary/{organizationid}/{classid}/{sectionid}/{date}")]
        public async Task<IActionResult> GetSummary(string organizationid, string classid, string sectionid, string date)
        {
            // Get all the documents from the collection
          

               var present = await this.repository.ExecuteSPByName<string>("Count", "Select * from c where c.type='" + typeof(PatronTracking).Name +
                                                                            "' and c.TrackingDate ='" + date + "' and " +
                                                                            "c.OrganizationId='" + organizationid + "' and " +
                                                                              "c.Class='" + classid + "' and " +
                                                                                "c.Section='" + sectionid + "'");

               var total_patrons = await this.repository.ExecuteSPByName<string>("Count", "Select * from c where c.type='" + typeof(SchoolWayz.Data.Models.SmartTrack.Patron).Name +
                                                                            "c.OrganizationId='" + organizationid + "' and " +
                                                                              "c.Class='" + classid + "' and " +
                                                                                "c.Section='" + sectionid + "'");

            var onleave_patrons = await this.repository.ExecuteSPByName<string>("Count", "Select * from c where c.type='" + typeof(PatronLeaveDetail).Name +
                                                            "c.OrganizationId='" + organizationid + "' and " +
                                                             "' and c.StartDate <='" + date + "' and " +
                                                              "' and c.EndDate >='" + date + "' and " +
                                                                              "c.Class='" + classid + "' and " +
                                                                                "c.Section='" + sectionid + "'");


            AttendanceSummary summary = new AttendanceSummary();

            summary.TotalPatrons = int.Parse(total_patrons);
            summary.PresentPatrons = int.Parse(present.Response);
            summary.PatronsOnLeave = int.Parse(onleave_patrons.Response);

            //if (result == null)
            //{
            //    return NotFound();
            //}
            return new ObjectResult(summary);


        }

        // GET api/values/5
        //[Route("GetSummary/{organizationid}/{classid}/{sectionid}/{date}")]
        //public async Task<IActionResult> GetSummary(string organizationid, string classid, string sectionid, string date)
        //{
        //    // Get all the documents from the collection

        //    var result = (await this.repository.WhereAsync(p => p.type.Equals(typeof(AttendanceTracking).Name)
        //                                                        && p.organizationid.Equals(organizationid)
        //                                                        && p.Class.Equals(classid)
        //                                                        && p.Section.Equals(sectionid)
        //                                                         && p.TrackingDate.Equals(date))).AsEnumerable();
        //    if (result == null)
        //    {
        //        return NotFound();
        //    }
        //    return new ObjectResult(result);

        //}


        // POST api/values
        [HttpPost]
        public void Post([FromBody]string value)
        {
        }

        // PUT api/values/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/values/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
