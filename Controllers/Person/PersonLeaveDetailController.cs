using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using SchoolWayz.Cloud.Web.Framework;
using SchoolWayz.Data.Models.SmartTrack;
using Microsoft.Extensions.Options;
// For more information on enabling Web API for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace SchoolWayz.Cloud.Service.Controllers
{
    [Route("api/Person/Leave")]
    public class PersonLeaveDetailController : BaseController<PersonLeaveDetail>
    {

        public PersonLeaveDetailController(IOptions<AppSettings> settings) : base(settings)
        {

        }

        [HttpGet("OnLeave/{organizationid}/{date}")]
        public async Task<IActionResult> OnLeave(string organizationid, string date)
        {
            // Get all the documents from the collection

            var result = (await this.repository.WhereAsync(p => p.type.Equals(typeof(PersonLeaveDetail).Name)
                                                                 && p.organizationid.Equals(organizationid)
                                                                  && p.StartDate.CompareTo(date) <= 0 && p.EndDate.CompareTo(date) >= 0
                                                                 )).AsEnumerable();
            if (result == null)
            {
                return NotFound();
            }
            return new ObjectResult(result);

        }

        //// GET api/values/5
        //[HttpGet("OnLeave/{organizationid}/{classid}/{sectionid}/{date}")]
        //public async Task<IActionResult> OnLeave(string organizationid, string classid, string sectionid, string date)
        //{
        //    // Get all the documents from the collection
            

        //    var result = (await this.repository.WhereAsync(p => p.type.Equals(typeof(personLeaveDetail).Name)
        //                                                        && p.organizationid.Equals(organizationid)
        //                                                        && p.Class.Equals(classid)
        //                                                        && p.Section.Equals(sectionid)
        //                                                         && p.StartDate.CompareTo(date) <=0 && p.EndDate.CompareTo(date) >= 0
        //                                                         )).AsEnumerable();
        //    if (result == null)
        //    {
        //        return NotFound();
        //    }
        //    return new ObjectResult(result);

        //}

        [HttpPut]
        [Route("RemovePerson/{organizationid}/{personId}/{selectedDate}")]
        public async Task<IActionResult> Removeperson(string organizationid, string personId, string selectedDate)
        {

            // If the personid, stoppageid or organization id is not valid
            if (personId == null ||
                 personId.Length == 0 ||
                 organizationid == null ||
                 organizationid.Length == 0 ||
                 selectedDate == null ||
                 selectedDate.Length == 0
                )
            {
                return BadRequest();
            }

            // Get the route document

            PersonLeaveDetail routedoc = (await this.repository.WhereAsync(p => p.type.Equals(typeof(PersonLeaveDetail).Name)
                                                              && p.organizationid.Equals(organizationid)
                                                              && p.PersonId.Equals(personId)
                                                              //&& p..Equals(personId)
                                                              )).AsEnumerable().FirstOrDefault();           
            // Update the document

            var result = (await this.repository.AddOrUpdateAsync(routedoc));
            return new OkResult();
        }

    }
}
