using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using SchoolWayz.Cloud.Web.Framework;
using SchoolWayz.Data.Models.SmartTrack;

using Microsoft.Azure.Documents;
using Microsoft.Extensions.Options;
namespace SchoolWayz.Cloud.Service.Controllers
{
    [Route("api/Person/Tracking")]
    public class PersonTrackingController : BaseController<PersonTracking>
    {



        public PersonTrackingController(IOptions<AppSettings> settings) : base(settings)
        {

        }


        // Get All Person Tracking Data for a specific day for an Organization 
        
        [Route("GetAll/{organizationid}/{date}")]
        public async Task<IActionResult> GetAll(string organizationid, string date)
        {
            // Get all the documents from the collection

            var result = (await this.repository.WhereAsync(p => p.type.Equals(typeof(PersonTracking).Name)
                                                                 && p.organizationid.Equals(organizationid)
                                                                 && p.TrackingDate.Equals(date))).AsEnumerable();
            if (result == null)
            {
                return NotFound();
            }
            return new ObjectResult(result);

        }
        [Route("Person/{organizationid}/{personId}")]
        public async Task<IActionResult> Person(string organizationid, string personId)
        {
            // Get all the documents from the collection

            var result = (await this.repository.WhereAsync(p => p.type.Equals(typeof(PersonTracking).Name)
                                                                && p.organizationid.Equals(organizationid)
                                                                && p.PersonId.Equals(personId))).AsEnumerable().OrderByDescending(x => x.TrackingDate).FirstOrDefault();
            if (result == null)
            {
                return NotFound();
            }
            return new ObjectResult(result);

        }


        //[Route("GetAll/{organizationid}/{classid}/{sectionid}/{date}")]
        //public async Task<IActionResult> GetAll(string organizationid, string classid, string sectionid, string date)
        //{
        //    // Get all the documents from the collection

        //    var result = (await this.repository.WhereAsync(p => p.type.Equals(typeof(PersonTracking).Name)
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



        [Route("Summary/{organizationid}/{date}")]
        public async Task<IActionResult> Summary(string organizationid, string date)
        {
            // Get all the documents from the collection



            var present = await this.repository.ExecuteSP<Document>("dbs/RqJpAA==/colls/RqJpAM7UUAA=/sprocs/RqJpAM7UUAANAAAAAAAAgA==/", "Select * from c where c.type = '" + typeof(PersonTracking).Name +
                                                                        "' and c.TrackingDate = '" + date + "' and " +
                                                                        "c.organizationid = '" + organizationid + "'");

            var total = await this.repository.ExecuteSP<Document>("dbs/RqJpAA==/colls/RqJpAM7UUAA=/sprocs/RqJpAM7UUAANAAAAAAAAgA==/", "Select * from c where c.type = '" + typeof(SchoolWayz.Data.Models.SmartTrack.Person).Name +
                                                                      "' and c.organizationid = '" + organizationid + "'");

            

            var leave = await this.repository.ExecuteSP<Document>("dbs/RqJpAA==/colls/RqJpAM7UUAA=/sprocs/RqJpAM7UUAANAAAAAAAAgA==/", "Select * from c where c.type = '" + typeof(PersonLeaveDetail).Name +
                                                                      "' and c.organizationid = '" + organizationid + "'" +
                                                                      " and (  ( c.StartDate < '" + date + "' and c.EndDate > '" +  date + "') or c.StartDate = '" + date + "' or c.EndDate = '" + date + "' )"  );



            PersonTrackingSummary summary = new PersonTrackingSummary();

           

            summary.TotalPersons = int.Parse(total.Response.GetPropertyValue<string>("count"));
            summary.PresentPersons = int.Parse(present.Response.GetPropertyValue<string>("count"));
            summary.PersonsOnLeave = int.Parse(leave.Response.GetPropertyValue<string>("count"));
            summary.AbsentPersons = summary.TotalPersons - (summary.PresentPersons + summary.PersonsOnLeave);
            summary.TrackingDate = date;
            summary.organizationid = organizationid;           
            return new ObjectResult(summary);


        }

        
        
        //[Route("Summary/{organizationid}/{classid}/{sectionid}/{date}")]
        //public async Task<IActionResult> Summary(string organizationid, string classid, string sectionid, string date)
        //{
        //    // Get all the documents from the collection

        //    // Get all the documents from the collection



        //    var present = await this.repository.ExecuteSP<Document>("dbs/RqJpAA==/colls/RqJpAM7UUAA=/sprocs/RqJpAM7UUAANAAAAAAAAgA==/", "Select * from c where c.type = '" + typeof(PersonTracking).Name +
        //                                                                "' and c.TrackingDate = '" + date + 
        //                                                                "' and c.organizationid = '" + organizationid + 
        //                                                                "' and c.Class = '" + classid + 
        //                                                                "' and c.Section = '" + sectionid + "'" );

        //    var total = await this.repository.ExecuteSP<Document>("dbs/RqJpAA==/colls/RqJpAM7UUAA=/sprocs/RqJpAM7UUAANAAAAAAAAgA==/", "Select * from c where c.type = '" + typeof(SchoolWayz.Data.Models.SmartTrack.Person).Name +
        //                                                              "' and c.organizationid = '" + organizationid + 
        //                                                              "' and c.Class = " + classid +
        //                                                              " and c.Section = '" + sectionid + "'");



        //    var leave = await this.repository.ExecuteSP<Document>("dbs/RqJpAA==/colls/RqJpAM7UUAA=/sprocs/RqJpAM7UUAANAAAAAAAAgA==/", "Select * from c where c.type = '" + typeof(PersonLeaveDetail).Name +
        //                                                              "' and c.organizationid = '" + organizationid + 
        //                                                              "' and c.Class = '" + classid +
        //                                                              "' and c.Section = '" + sectionid + 
        //                                                              "' and (  ( c.StartDate > '" + date + "' and c.EndDate < '" + date + "') or c.StartDate = '" + date + "' or c.EndDate = '" + date + "' )");



        //    PersonTrackingSummary summary = new PersonTrackingSummary();



        //    summary.TotalPersons = int.Parse(total.Response.GetPropertyValue<string>("count"));
        //    summary.PresentPersons = int.Parse(present.Response.GetPropertyValue<string>("count"));
        //    summary.PersonsOnLeave = int.Parse(leave.Response.GetPropertyValue<string>("count"));
        //    summary.AbsentPersons = summary.TotalPersons - (summary.PresentPersons + summary.PersonsOnLeave);
        //    summary.TrackingDate = date;
        //    summary.organizationid = organizationid;

        //    return new ObjectResult(summary);

        //}

        [HttpPut]
        [Route("RemovePerson/{organizationid}/{PersonId}/{selectedDate}")]
        public async Task<IActionResult> RemovePerson(string organizationid, string PersonId, string selectedDate)
        {

            // If the Personid, stoppageid or organization id is not valid
            if (PersonId == null ||
                 PersonId.Length == 0 ||
                 organizationid == null ||
                 organizationid.Length == 0 ||
                 selectedDate == null ||
                 selectedDate.Length == 0
                )
            {
                return BadRequest();
            }


            // Get the route document

            PersonTracking result = (await this.repository.WhereAsync(p => p.type.Equals(typeof(PersonTracking).Name)
                                                              && p.organizationid.Equals(organizationid)
                                                              && p.PersonId.Equals(PersonId)
                                                              && p.TrackingDate.Equals(selectedDate)
                                                              )).AsEnumerable().FirstOrDefault();

            if (result == null)
            {
                return BadRequest();
            }

            var resultDel = (await this.repository.RemoveAsync(result.Id));           

            return new OkResult();
        }

    }
}
