using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using SchoolWayz.Cloud.Web.Framework;
using SchoolWayz.Data.Models.SmartTrack;

using Microsoft.Extensions.Options;
// For more information on enabling Web API for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace SchoolWayz.Cloud.Web.Controllers
{
    [Route("api/[controller]")]
    public class TrackLoginDetailController : BaseController<TrackLoginDetail>
    {



        public TrackLoginDetailController(IOptions<AppSettings> settings) : base(settings)
        {

        }

        [HttpGet("{id}")]
        [Route("LastVisited")]
        public async Task<IActionResult> GetLastVistedDate(string userId)
        {
            // Get all the documents from the collection
            var lastVisited = (await this.repository.WhereAsync(p => p.type.Equals("TrackLoginDetail")
                                                                && p.AdminCredentialId.Equals(userId)));

            //(await repository.WhereAsync(u => u.UserId.Equals(value.UserId) 
            //&& u.Pass.Equals(value.Pass)).AsEnumerable().FirstOrDefault());
            if (lastVisited == null)
            {
                return new ObjectResult(false);
            }

            return new ObjectResult(true);

            //return CreatedAtRoute("DefaultApi", new ObjectResult(true));

        }


    }
}
