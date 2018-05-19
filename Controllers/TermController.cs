using Microsoft.AspNetCore.Mvc;
using SchoolWayz.Data.Models.SmartTrack;

using Microsoft.Extensions.Options;
using SchoolWayz.Cloud.Web.Framework;
using System.Threading.Tasks;

namespace SchoolWayz.Cloud.Web.Controllers
{
    [Route("api/[controller]")]
    public class TermController :BaseController<TermDetail>
    {
        public TermController(IOptions<AppSettings>setting) : base(setting)
            {

           }

        [HttpPost]
        [Route("saveAndGetTermId")]
        public async Task<IActionResult> saveAndGetTermId([FromBody]TermDetail value)
        {
            if (value == null || value.organizationid == null || value.organizationid.Length == 0)
            {
                return BadRequest();
            }

            var result = (await this.repository.AddOrUpdateAsync(value));

            //string id = value.Id;
            //sessioncontroller.UpdateSessionWithBreak(result.organizationid, result);
            //return CreatedAtRoute("DefaultApi", new { organizationid = result.organizationid, id = result.Id }, result);
            return new ObjectResult(result);
        }
    }
}
