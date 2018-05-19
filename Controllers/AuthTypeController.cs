using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

using SchoolWayz.Data.Models.SmartTrack;

using Microsoft.Extensions.Options;
using SchoolWayz.Cloud.Web.Framework;
// For more information on enabling Web API for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace SchoolWayz.Cloud.Web.Controllers
{
    [Route("api/[controller]")]
    public class AuthTypeController : BaseController<Authentication>
    {
        public AuthTypeController(IOptions<AppSettings> settings) : base(settings)
        {

        }
        [HttpPost]
        [Route("GetAuthTypeOfPatron")]
        public async Task<IEnumerable<Authentication>> GetAuthTypeOfPatron([FromBody]Authentication value)
        {
            // Get all the documents from the collection

            List<Authentication> result = (await this.repository.WhereAsync(p => p.type.Equals(typeof(Authentication).Name)
                                                                && p.PatronId.Equals(value.Id))).ToList<Authentication>();

            return result;

        }
        [HttpPost]
        [Route("GetAuthTypeOfPerson")]
        public async Task<IEnumerable<Authentication>> GetAuthTypeOfPerson([FromBody]Authentication value)
        {
            // Get all the documents from the collection

            List<Authentication> result = (await this.repository.WhereAsync(p => p.type.Equals(typeof(Authentication).Name)
                                                                && p.Id.Equals(value.Id))).ToList<Authentication>();

           
            return result;

        }

    }
}
