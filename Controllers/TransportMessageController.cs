
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
    public class TransportMessageController : BaseController<TransportMessage>

    {


        public TransportMessageController(IOptions<AppSettings> setting) : base(setting)
        {

        }
        [HttpPost]
        [Route("CreateMessage/")]
        public async Task<IActionResult> OutgoingMessage([FromBody]TransportMessage value)
        {

            if (value == null ||
                 value.organizationid == null ||
                 value.organizationid.Length == 0
               )
            {
                return BadRequest();
            }

            var result = (await this.repository.AddOrUpdateAsync(value));


            //var connectionString = "Endpoint=sb://tst-schoolwayzbus.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=ZOXbRHUHkW1ZbH2Lm5OuUBraaLRA7ksi0Ik8PKI+rsI=";
            //var queueName = "smarttrack";
            //string msg = Newtonsoft.Json.JsonConvert.SerializeObject(value);
            //var client = QueueClient.CreateFromConnectionString(connectionString, queueName);
            //var message = new BrokeredMessage(msg);
            //client.Send(message);

            return new NoContentResult();

        }
        //[Route("GetMessage/{organizationid}/{patronId}")]
        //public async Task<IActionResult> GetMessage(string organizationid,string patronId)
        //{
        //    // Get all the documents from the collection

        //    var result = (await this.repository.WhereAsync(p => p.type.Equals(typeof(TransportMessage).Name)
        //                                                        && p.organizationid.Equals(organizationid)
        //                                                         && (p.PatronId.Contains(patronId) ||                 p.BroadcastTo.Equals("Organization"))

        //                                                          )).OrderByDescending(x => x.MessageDate).AsEnumerable();
        //    if (result == null)
        //    {
        //        return NotFound();
        //    }
        //    return new ObjectResult(result);

        //}
        [Route("GetAllMessage/{organizationid}")]
        public async Task<IActionResult> GetAllMessage(string organizationid)
        {
            // Get all the documents from the collection

            var result = (await this.repository.WhereAsync(p => p.type.Equals(typeof(TransportMessage).Name)
                                                              && p.organizationid.Equals(organizationid)))
                                                                  .OrderByDescending(x => x.MessageDate).AsEnumerable();
            if (result == null)
            {
                return NotFound();
            }
            return new ObjectResult(result);

        }
        [Route("GetTransportMessage/{organizationid}")]
        public async Task<IActionResult> GetTransportMessage(string organizationid)
        {
            // Get all the documents from the collection

            var result = (await this.repository.WhereAsync(p => p.type.Equals(typeof(TransportMessage).Name)
                                                              && p.organizationid.Equals(organizationid)
                                                              && p.PersonId.Count() > 0))
                                                                  .OrderByDescending(x => x.MessageDate).AsEnumerable();
            if (result == null)
            {
                return NotFound();
            }
            return new ObjectResult(result);

        }

        //[Route("SavedMessages/{organizationid}")]
        //public async Task<IActionResult> SavedMessages(string organizationid)
        //{
        //    // Get all the documents from the collection

        //    var result = (await this.repository.WhereAsync(p => p.type.Equals(typeof(TransportMessage).Name)
        //                                                        && p.organizationid.Equals(organizationid)     
        //                                                          )).OrderByDescending(x => x.MessageDate).AsEnumerable();
        //    if (result == null)
        //    {
        //        return NotFound();
        //    }
        //    return new ObjectResult(result);

        //}

    }
}