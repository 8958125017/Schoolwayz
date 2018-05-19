using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using SchoolWayz.Cloud.Web.Framework;
using SchoolWayz.Data.Models.SmartTrack;

using Microsoft.Azure.Documents;
using Microsoft.Extensions.Options;
using SchoolWayz.Data.Models;
using System.Collections;


namespace SchoolWayz.Cloud.Service.Controllers
{
    [Route("api/Patron/Tracking")]
    public class PatronTrackingController : BaseController<PatronTracking>
    {



        public PatronTrackingController(IOptions<AppSettings> settings) : base(settings)
        {

        }


        // Get All Patron Tracking Data for a specific day for an Organization 

        [Route("GetAll/{organizationid}/{date}")]
        public async Task<IActionResult> GetAll(string organizationid, string date)
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
        [Route("DualMode/{organizationid}/{classid}/{sectionid}/{trackingType}/{date}")]
        public async Task<IActionResult> FirstHalf(string organizationid, string classid, string sectionid, AttendanceType trackingType, string date)
        {
            var result = (IEnumerable)null;

            if (trackingType == AttendanceType.FirstHalf)
            {

                result = (await this.repository.WhereAsync(p => p.type.Equals(typeof(PatronTracking).Name)
                                                                 && p.organizationid.Equals(organizationid)
                                                                  && p.Class.Equals(classid)
                                                                    && p.Section.Equals(sectionid)
                                                                    && p.FirstHalfTrackingTime != null
                                                                 && p.TrackingDate.Equals(date))).AsEnumerable();
            }
            if (trackingType == AttendanceType.SecondHalf)
            {
                result = (await this.repository.WhereAsync(p => p.type.Equals(typeof(PatronTracking).Name)
                                                                    && p.organizationid.Equals(organizationid)
                                                                     && p.Class.Equals(classid)
                                                                       && p.Section.Equals(sectionid)
                                                                       && p.SecondHalfTrackingTime != null
                                                                    && p.TrackingDate.Equals(date))).AsEnumerable();
            }
            if (result == null)
            {
                return NotFound();
            }
            return new ObjectResult(result);

        }
        
        [Route("SecondHalf/{organizationid}/{classid}/{sectionid}/{date}")]
        public async Task<IActionResult> SecondHalf(string organizationid, string classid, string sectionid, string date)
        {
            // Get all the documents from the collection

            var result = (await this.repository.WhereAsync(p => p.type.Equals(typeof(PatronTracking).Name)
                                                                 && p.organizationid.Equals(organizationid)
                                                                  && p.Class.Equals(classid)
                                                                    && p.Section.Equals(sectionid)
                                                                    && p.SecondHalfTrackingTime != null
                                                                 && p.TrackingDate.Equals(date))).AsEnumerable();
            if (result == null)
            {
                return NotFound();
            }
            return new ObjectResult(result);

        }



        [Route("GetAll/{organizationid}/{classid}/{sectionid}/{date}")]
        public async Task<IActionResult> GetAll(string organizationid, string classid, string sectionid, string date)
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


        [Route("Patron/{organizationid}/{patronId}")]
        public async Task<IActionResult> Patron(string organizationid, string patronId)
        {
            // Get all the documents from the collection

            var result = (await this.repository.WhereAsync(p => p.type.Equals(typeof(PatronTracking).Name)
                                                                && p.organizationid.Equals(organizationid)
                                                                && p.PatronId.Equals(patronId))).AsEnumerable().OrderByDescending(x => x.TrackingDate).FirstOrDefault();
            if (result == null)
            {
                return NotFound();
            }
            return new ObjectResult(result);

        }
        [Route("AllTracking/{organizationid}/{patronId}/{startdate}/{endDate}")]
        public async Task<IActionResult> AllTracking(string organizationid, string patronId,string startdate,string endDate)
        {
            // Get all the documents from the collection
            
            var result = (await this.repository.WhereAsync(p => p.type.Equals(typeof(PatronTracking).Name)
                                                                && p.organizationid.Equals(organizationid)
                                                                && p.PatronId.Equals(patronId)
                                                                && p.TrackingDate.CompareTo(startdate) >= 0 && p.TrackingDate.CompareTo(endDate) <= 0
                                                                 )).AsEnumerable().OrderByDescending(x => x.TrackingDate);
            if (result == null)
            {
                return NotFound();
            }
            return new ObjectResult(result);

        }

        [HttpGet("GetPatron/{organizationid}/{patronId}/{date}")]
        public async Task<IActionResult> GetPatron(string organizationid, string patronId, string date)
        {
            // Get all the documents from the collection

            var result = (await this.repository.WhereAsync(p => p.type.Equals(typeof(PatronTracking).Name)
                                                                 && p.organizationid.Equals(organizationid)
                                                                 && p.PatronId.Equals(patronId)
                                                                  && p.TrackingDate.Equals(date)
                                                                 )).AsEnumerable().FirstOrDefault();
            if (result == null)
            {
                return NotFound();
            }
            return new ObjectResult(result);

        }



        [Route("Summary/{organizationid}/{date}")]
        public async Task<IActionResult> Summary(string organizationid, string date)
        {
            // Get all the documents from the collection



            var present = await this.repository.ExecuteSP<Document>("dbs/RqJpAA==/colls/RqJpAM7UUAA=/sprocs/RqJpAM7UUAANAAAAAAAAgA==/", "Select * from c where c.type = '" + typeof(PatronTracking).Name +
                                                                        "' and c.TrackingDate = '" + date + "' and " +
                                                                        "c.organizationid = '" + organizationid + "'");

            var total = await this.repository.ExecuteSP<Document>("dbs/RqJpAA==/colls/RqJpAM7UUAA=/sprocs/RqJpAM7UUAANAAAAAAAAgA==/", "Select * from c where c.type = '" + typeof(SchoolWayz.Data.Models.SmartTrack.Patron).Name +
                                                                      "' and c.organizationid = '" + organizationid + "'");



            var leave = await this.repository.ExecuteSP<Document>("dbs/RqJpAA==/colls/RqJpAM7UUAA=/sprocs/RqJpAM7UUAANAAAAAAAAgA==/", "Select * from c where c.type = '" + typeof(PatronLeaveDetail).Name +
                                                                      "' and c.organizationid = '" + organizationid + "'" +
                                                                      " and (  ( c.StartDate < '" + date + "' and c.EndDate > '" + date + "') or c.StartDate = '" + date + "' or c.EndDate = '" + date + "' )");



            PatronTrackingSummary summary = new PatronTrackingSummary();



            summary.TotalPatrons = int.Parse(total.Response.GetPropertyValue<string>("count"));
            summary.PresentPatrons = int.Parse(present.Response.GetPropertyValue<string>("count"));
            summary.PatronsOnLeave = int.Parse(leave.Response.GetPropertyValue<string>("count"));
            summary.AbsentPatrons = summary.TotalPatrons - (summary.PresentPatrons + summary.PatronsOnLeave);
            summary.TrackingDate = date;
            summary.organizationid = organizationid;
            return new ObjectResult(summary);


        }



        [Route("Summary/{organizationid}/{classid}/{sectionid}/{date}")]
        public async Task<IActionResult> Summary(string organizationid, string classid, string sectionid, string date)
        {
            // Get all the documents from the collection

            // Get all the documents from the collection



            var present = await this.repository.ExecuteSP<Document>("dbs/RqJpAA==/colls/RqJpAM7UUAA=/sprocs/RqJpAM7UUAANAAAAAAAAgA==/", "Select * from c where c.type = '" + typeof(PatronTracking).Name +
                                                                        "' and c.TrackingDate = '" + date +
                                                                        "' and c.organizationid = '" + organizationid +
                                                                        "' and c.Class = '" + classid +
                                                                        "' and c.Section = '" + sectionid + "'");

            var total = await this.repository.ExecuteSP<Document>("dbs/RqJpAA==/colls/RqJpAM7UUAA=/sprocs/RqJpAM7UUAANAAAAAAAAgA==/", "Select * from c where c.type = '" + typeof(SchoolWayz.Data.Models.SmartTrack.Patron).Name +
                                                                      "' and c.organizationid = '" + organizationid +
                                                                      "' and c.Class = " + classid +
                                                                      " and c.Section = '" + sectionid + "'");



            var leave = await this.repository.ExecuteSP<Document>("dbs/RqJpAA==/colls/RqJpAM7UUAA=/sprocs/RqJpAM7UUAANAAAAAAAAgA==/", "Select * from c where c.type = '" + typeof(PatronLeaveDetail).Name +
                                                                      "' and c.organizationid = '" + organizationid +
                                                                      "' and c.Class = '" + classid +
                                                                      "' and c.Section = '" + sectionid +
                                                                      "' and (  ( c.StartDate > '" + date + "' and c.EndDate < '" + date + "') or c.StartDate = '" + date + "' or c.EndDate = '" + date + "' )");



            PatronTrackingSummary summary = new PatronTrackingSummary();



            summary.TotalPatrons = int.Parse(total.Response.GetPropertyValue<string>("count"));
            summary.PresentPatrons = int.Parse(present.Response.GetPropertyValue<string>("count"));
            summary.PatronsOnLeave = int.Parse(leave.Response.GetPropertyValue<string>("count"));
            summary.AbsentPatrons = summary.TotalPatrons - (summary.PresentPatrons + summary.PatronsOnLeave);
            summary.TrackingDate = date;
            summary.organizationid = organizationid;

            return new ObjectResult(summary);

        }

        [HttpPut]
        [Route("RemovePatron/{organizationid}/{patronId}/{selectedDate}/{updatedBy}")]
        public async Task<IActionResult> RemovePatron(string organizationid, string patronId, string selectedDate,string updatedBy)
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

           (await this.repository.WhereAsync(p => p.type.Equals(typeof(PatronTracking).Name)
                                                              && p.organizationid.Equals(organizationid)
                                                              && p.PatronId.Equals(patronId)
                                                              && p.TrackingDate.Equals(selectedDate)
                                                              )).ToList().ForEach(x =>
                                                              {
                                                                  //x.IsMarkedAbsent = true; x.lastupdated = DateTime.Now;x.lastupdatedby = updatedBy;
                                                              });

            //PatronTracking result = (await this.repository.WhereAsync(p => p.type.Equals(typeof(PatronTracking).Name)
            //                                                  && p.organizationid.Equals(organizationid)
            //                                                  && p.PatronId.Equals(patronId)
            //                                                  && p.TrackingDate.Equals(selectedDate)
            //                                                  )).AsEnumerable().FirstOrDefault();

            //if (result == null)
            //{
            //    return BadRequest();
            //}

            //var resultDel = (await this.repository.RemoveAsync(result.Id));

            return new OkResult();
        }

    }
}
