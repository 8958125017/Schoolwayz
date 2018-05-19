using System;
using System.Collections.Generic;
using Newtonsoft.Json;
using Microsoft.AspNetCore.Mvc;
using SchoolWayz.Data.Models.SmartTrack;
using Microsoft.Extensions.Options;
using System.Threading.Tasks;
using System.Linq;
using SchoolWayz.Cloud.Web.Framework;
namespace SchoolWayz.Cloud.Web.Controllers
{


    [Route("api/[controller]")]
    public class TransportWalkerController : BaseController<TransportWalkingRequest>
    {
        public TransportWalkerController(IOptions<AppSettings> settings) : base(settings)
        {

        }
        [HttpGet("PickupWalker/{organizationid}/{routeId}/{date}")]
        public async Task<IActionResult> PickupWalker(string organizationid, string routeId, string date)
        {
            var result = (await this.repository.WhereAsync(p => p.type.Equals(typeof(TransportWalkingRequest).Name)
                                                                      && p.organizationid.Equals(organizationid)
                                                                      && p.TranspportRouteId.Equals(routeId)
                                                                       && p.RequestDate.Equals(date)
                                                                       && p.Pick
                                                                     )).AsEnumerable();



            if (result == null)
            {
                return NotFound();
            }
            return new ObjectResult(result);

        }
        [HttpGet("DropWalker/{organizationid}/{routeId}/{date}")]
        public async Task<IActionResult> DropWalker(string organizationid, string routeId, string date)
        {
            var result = (await this.repository.WhereAsync(p => p.type.Equals(typeof(TransportWalkingRequest).Name)
                                                                      && p.organizationid.Equals(organizationid)
                                                                      && p.TranspportRouteId.Equals(routeId)
                                                                       && p.RequestDate.Equals(date)
                                                                       && p.Drop
                                                                     )).AsEnumerable();


            if (result == null)
            {
                return NotFound();
            }
            return new ObjectResult(result);

        }
        [HttpPut]
        [Route("acknowledge/{organizationid}/{id}/{isAcknowledge}")]
        public async Task<IActionResult> acknowledge(string organizationid, string id, bool isAcknowledge)
        {
            // Get all the documents from the collection

            TransportWalkingRequest transportWalkingRequest = (await this.repository.WhereAsync(p => p.type.Equals(typeof(TransportWalkingRequest).Name)
                                                                 && p.organizationid.Equals(organizationid)
                                                                  && p.Id.Equals(id)
                                                                 )).AsEnumerable().FirstOrDefault();
            if (transportWalkingRequest == null)
            {
                return NotFound();
            }
            else
            {
                transportWalkingRequest.IsAcknowledged = true;

            }

            var result = (await this.repository.AddOrUpdateAsync(transportWalkingRequest));

            return new ObjectResult(result);

        }
        [HttpGet("WalkerPatron/{organizationid}/{patronId}/")]
        public async Task<IActionResult> WalkerPatron(string organizationid, string patronId)
        {
            // Get all the documents from the collection

            var result = (await this.repository.WhereAsync(p => p.type.Equals(typeof(TransportWalkingRequest).Name)
                                                                 && p.organizationid.Equals(organizationid)
                                                                 && p.PatronId.Equals(patronId)
                                                                 )).AsEnumerable();
            if (result == null)
            {
                return NotFound();
            }
            return new ObjectResult(result);

        }
        //[Route("GetAllWalker/{organizationid}/{startDate}/{endDate}")]
        //public async Task<IActionResult> GetAllWalker(string organizationid ,string startDate, string endDate)
        //{
        //    // Get all the documents from the collection

        //    var result = (await this.repository.WhereAsync(p => p.type.Equals(typeof(TransportWalkingRequest).Name)
        //                                                      && p.organizationid.Equals(organizationid)
        //                                                      && DateTime.Parse(p.RequestDate)>= DateTime.Parse(startDate)
        //                                                      && DateTime.Parse(p.RequestDate) <= DateTime.Parse(endDate)
        //                                                      )).OrderByDescending(x => x.createdate).AsEnumerable();
        //    if (result == null)
        //    {
        //        return NotFound();
        //    }
        //    return new ObjectResult(result);

        //}
        [Route("GetAllWalker/{organizationid}/{startDate}/{endDate}")]
        public async Task<IActionResult> GetAllWalker(string organizationid, string startDate, string endDate)
        {
            // Get all the documents from the collection
            var result = (await this.repository.WhereAsync(p => p.type.Equals(typeof(TransportWalkingRequest).Name)
                                                              && p.organizationid.Equals(organizationid)
                                                              && p.RequestDate.CompareTo(startDate) >= 0
                                                              && p.RequestDate.CompareTo(endDate) <= 0
                                                              )).OrderByDescending(x => x.createdate).AsEnumerable();
            if (result == null)
            {
                return NotFound();
            }
            return new ObjectResult(result);

        }
          // Get transport Walker by request date

        [HttpGet("GetWalkerBydate/{organizationid}/{date}/")]
        public async Task<IActionResult> GetWalkerBydate(string organizationid, string date)
        {

        //Check the valid organizationid
            if (organizationid == null || organizationid.Length == 0)
            {
                return BadRequest();
            }
            var result = (await this.repository.WhereAsync(p => p.type.Equals(typeof(TransportWalkingRequest).Name)
                                                                 && p.organizationid.Equals(organizationid)
                                                                 && p.RequestDate.Equals(date)
                                                                 )).AsEnumerable();
            if (result == null)
            {
                return NotFound();
            }
            return new ObjectResult(result);
        }
    }
}





