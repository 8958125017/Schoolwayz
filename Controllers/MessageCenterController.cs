using System;
using Microsoft.AspNetCore.Mvc;
using SchoolWayz.Data.Models.SmartTrack;

using Microsoft.Extensions.Options;
using System.Threading.Tasks;
using System.Linq;
using Microsoft.Azure.Devices;
using System.Text;
using Newtonsoft.Json;
using SchoolWayz.Cloud.Web.Framework;

namespace SchoolWayz.Cloud.Web.Controllers
{
    [Route("api/[controller]")]
    public class MessageCenterController : BaseController<InhouseMessage>
    {
        static ServiceClient serviceClient;
        
        public MessageCenterController(IOptions<AppSettings> setting) : base(setting)
        {

        }

        [Route("GetActiveMessage/{organizationid}")]
        public async Task<IActionResult> GetActiveMessage(string organizationid)
        {
            // Get all the documents from the collection

            var result = (await this.repository.WhereAsync(p => p.type.Equals(typeof(InhouseMessage).Name)
                                                                 && p.organizationid.Equals(organizationid)
                                                                  && TimeSpan.Parse(p.ExpiryDate) < TimeSpan.Parse(DateTime.Now.ToString("yyyy-MM-dd"))
                                                                 )).AsEnumerable();
            if (result == null)
            {
                return NotFound();
            }
            return new ObjectResult(result);

        }

        [HttpPut]
        [Route("UpdateAcknowledge/{organizationid}/{msgId}")]
        public async Task<IActionResult> UpdateAcknowledge(string organizationid, string msgId, [FromBody]DeviceDetail value)
        {

            // If the patronid, stoppageid or organization id is not valid
            if (value == null ||
                 msgId == null ||
                 msgId.Length == 0 ||
                 organizationid == null ||
                 organizationid.Length == 0
                )
            {
                return BadRequest();
            }


            // Get the route document

            InhouseMessage messagedoc = (await this.repository.WhereAsync(p => p.type.Equals(typeof(InhouseMessage).Name)
                                                              && p.organizationid.Equals(organizationid)
                                                              && p.Id.Equals(msgId))).AsEnumerable().FirstOrDefault();

            // Remove the Patron ID to the stoppage required

            DeviceDetail deviceDetail = messagedoc.DeviceDetail.Find(p => p.deviceId == value.deviceId);
            if (deviceDetail != null)
            {
                // remove the existing and add the supplied
                messagedoc.DeviceDetail.Remove(deviceDetail);
            }

            messagedoc.DeviceDetail.Add(value);
            var result = (await this.repository.AddOrUpdateAsync(messagedoc));
            
            return new OkResult();
        }
        //[HttpPost]
        //[Route("CreateExternalMessage/")]
        //public async Task<IActionResult> CreateExternalMessage([FromBody]ExternalMessage value)
        //{

        //    if (value == null || value.organizationid == null || value.organizationid.Length == 0)
        //    {
        //        return BadRequest();
        //    }

        //    var result = (await this.repository.AddOrUpdateAsync(value));
        //    foreach (var device in value.DeviceDetail)
        //    {
        //        await SendCloudToDeviceMessageAsync("TestDevice1", value);
        //    }
        //    return CreatedAtRoute("DefaultApi", new { organizationid = result.organizationid, id = result.Id }, result);
        //    return new NoContentResult();

        //}

        [HttpPost]
        [Route("CreateMessage/")]
        public async Task<IActionResult> CreateMessage([FromBody]InhouseMessage value)
        {

            if (value == null || value.organizationid == null || value.organizationid.Length == 0)
            {
                return BadRequest();
            }

            var result = (await this.repository.AddOrUpdateAsync(value));
            foreach(var device in value.DeviceDetail) {
                await SendCloudToDeviceMessageAsync("TestDevice1", value);
            }

            //return CreatedAtRoute("DefaultApi", new { organizationid = result.organizationid, id = result.Id }, result);
            //return new NoContentResult();
            return new OkResult();

        }

        //[HttpPost]
        //[Route("SendToCloud/{deviceId}")]
        public async Task SendCloudToDeviceMessageAsync(string deviceId, [FromBody]InhouseMessage value)
        {
                     
            string connectionString = AppSettings.azure.iothub.ConnectionString;
            serviceClient = ServiceClient.CreateFromConnectionString(connectionString);
            string json = JsonConvert.SerializeObject(value);
            var commandMessage = new Message(Encoding.ASCII.GetBytes(json));
            await serviceClient.SendAsync(deviceId, commandMessage);
            //HostName = tst-schoolwayzhub.azure - devices.net; SharedAccessKeyName = iothubowner; SharedAccessKey = GM2ptSiELX8sKjOFAQLkcPnaPxQx7ajVopy / FaSNrSQ =
        }
    }
}
