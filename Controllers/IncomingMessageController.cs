
using Microsoft.Extensions.Options;
using System.Threading.Tasks;
using SchoolWayz.Data.Models.SmartTrack;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using SchoolWayz.Cloud.Web.Framework;
namespace SchoolWayz.Cloud.Service.Controllers
{
    [Route("api/[controller]")]
    public class IncomingMessageController : BaseController<IncomingMessage>

    {


        public IncomingMessageController(IOptions<AppSettings> setting) : base(setting)
        {

        }
        [Route("GetPreviousResponse/{organizationid}/{messageId}/{patronId}")]
        public async Task<IActionResult> GetPreviousResponse(string organizationid, string messageId,string patronId)
        {
            // Get all the documents from the collection

            var result = (await this.repository.WhereAsync(p => p.type.Equals(typeof(IncomingMessage).Name)
                                                                && p.organizationid.Equals(organizationid)
                                                                 && p.PatronId.Contains(patronId)
                                                                 && p.MessageId.Contains(messageId)
                                                                  )).OrderByDescending(x => x.MessageDate).AsEnumerable();
            if (result == null)
            {
                return NotFound();
            }
            return new ObjectResult(result);

        }


    }
}