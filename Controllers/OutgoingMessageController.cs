
using Microsoft.Extensions.Options;
using System.Threading.Tasks;
using SchoolWayz.Data.Models.SmartTrack;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using Microsoft.ServiceBus.Messaging;
using SchoolWayz.Cloud.Web.Framework;


namespace SchoolWayz.Cloud.Service.Controllers
{
    [Route("api/[controller]")]
    public class OutgoingMessageController : BaseController<OutgoingMessage>

    {


        public OutgoingMessageController(IOptions<AppSettings> setting) : base(setting)
        {

        }
        [HttpPost]
        [Route("CreateMessage/")]
        public async Task<IActionResult> OutgoingMessage([FromBody]OutgoingMessage value)
        {

            if (value == null ||
                 value.organizationid == null || 
                 value.organizationid.Length == 0
               )
            {
                return BadRequest();
            }

            var result = (await this.repository.AddOrUpdateAsync(value));

            if (value.IsSent)
            {
                var connectionString = "Endpoint=sb://tst-schoolwayzbus.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=ZOXbRHUHkW1ZbH2Lm5OuUBraaLRA7ksi0Ik8PKI+rsI=";
                var queueName = "smarttrack";
                string msg = Newtonsoft.Json.JsonConvert.SerializeObject(value);
                var client = QueueClient.CreateFromConnectionString(connectionString, queueName);
                var message = new BrokeredMessage(msg);
                client.Send(message);
            }
            return new NoContentResult();

        }
        [Route("GetMessage/{organizationid}/{patronId}")]
        public async Task<IActionResult> GetMessage(string organizationid,string patronId)
        {
            // Get all the documents from the collection

            var result = (await this.repository.WhereAsync(p => p.type.Equals(typeof(OutgoingMessage).Name)
                                                                && p.organizationid.Equals(organizationid)
                                                                 && (p.PatronId.Contains(patronId) || p.BroadcastTo.Equals("Organization"))
                                                                 && p.IsSent
                                                                  )).OrderByDescending(x => x.MessageDate).AsEnumerable();
            if (result == null)
            {
                return NotFound();
            }
            return new ObjectResult(result);

        }
        [Route("GetAllMessage/{organizationid}")]
        public async Task<IActionResult> GetAllMessage(string organizationid)
        {
            // Get all the documents from the collection

            var result = (await this.repository.WhereAsync(p => p.type.Equals(typeof(OutgoingMessage).Name)
                                                                && p.organizationid.Equals(organizationid)
                                                                 && p.IsSent
                                                                  )).OrderByDescending(x => x.MessageDate).AsEnumerable();
            if (result == null)
            {
                return NotFound();
            }
            return new ObjectResult(result);

        }

        [Route("SavedMessages/{organizationid}")]
        public async Task<IActionResult> SavedMessages(string organizationid)
        {
            // Get all the documents from the collection

            var result = (await this.repository.WhereAsync(p => p.type.Equals(typeof(OutgoingMessage).Name)
                                                                && p.organizationid.Equals(organizationid)
                                                                 && !p.IsSent
                                                                  )).OrderByDescending(x => x.MessageDate).AsEnumerable();
            if (result == null)
            {
                return NotFound();
            }
            return new ObjectResult(result);

        }


        //[HttpGet("GetMessageById/{organizationid}/{messageId}/{id}")]
        //public async Task<IActionResult> GetMessageById(string organizationid, string messageId, string id)
        //{
        //    // Get all the documents from the collection

        //    var result = (await this.repository.WhereAsync(p => p.type.Equals(typeof(OutgoingMessage).Name)
        //                                                         && p.organizationid.Equals(organizationid)
        //                                                         && p..Equals(messageId)
        //                                                          && p.Id.Equals(id)
        //                                                         )).AsEnumerable().FirstOrDefault();
        //    if (result == null)
        //    {
        //        return NotFound();
        //    }
        //    return new ObjectResult(result);

        //}



    }
}