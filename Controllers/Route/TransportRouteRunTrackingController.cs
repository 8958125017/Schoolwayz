using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using SchoolWayz.Cloud.Web.Framework;
using SchoolWayz.Data.Models.SmartTrack;

using Microsoft.Extensions.Options;
namespace SchoolWayz.Cloud.Service.Controllers.Route
{
    [Route("api/RouteRun/Tracking")]
    public class TransportRouteRunTrackingController : BaseController<TransportRouteRun>
    {



        public TransportRouteRunTrackingController(IOptions<AppSettings> settings) : base(settings)
        {

        }
        [Route("GetRunDirection/{organizationid}/{routeId}/{date}")]
        public async Task<IActionResult> GetRunDirection(string organizationid, string routeId, string date)
        {


            if (routeId == null ||
                 routeId.Length == 0 ||
                 date == null ||
                 date.Length == 0 ||
                 organizationid == null ||
                 organizationid.Length == 0
                )
            {
                return BadRequest();
            }

            var result = (await this.repository.WhereAsync(p => p.type.Equals(typeof(TransportRouteRun).Name)
                                                              && p.organizationid.Equals(organizationid)
                                                              && p.RouteId.Equals(routeId)
                                                              && p.RunDate.Equals(date))).AsEnumerable();

            return new ObjectResult(result);
        }

        [HttpPut]
        [Route("AddPatron/{organizationid}/{transportRunId}")]
        public async Task<IActionResult> AddPatron(string organizationid, string transportRunId, [FromBody]List<string> value)
        {
            if (value == null ||
                 transportRunId == null ||
                 transportRunId.Length == 0 ||
                 organizationid == null ||
                 organizationid.Length == 0
                )
            {
                return BadRequest();
            }

            TransportRouteRun transportRouteRun = (await this.repository.WhereAsync(p => p.type.Equals(typeof(TransportRouteRun).Name)
                                                              && p.organizationid.Equals(organizationid)
                                                              && p.Id.Equals(transportRunId))).AsEnumerable().FirstOrDefault();

            if (transportRouteRun != null)
            {
                transportRouteRun.Patrons.Clear();
                transportRouteRun.Patrons = value;
            }
            var result = (await this.repository.AddOrUpdateAsync(transportRouteRun));
            return new ObjectResult(result);
        }

        [HttpPut]
        [Route("AddPerson/{organizationid}/{transportRunId}")]
        public async Task<IActionResult> AddPerson(string organizationid, string transportRunId, [FromBody]List<string> value)
        {
            if (value == null ||
                 transportRunId == null ||
                 transportRunId.Length == 0 ||
                 organizationid == null ||
                 organizationid.Length == 0
                )
            {
                return BadRequest();
            }

            TransportRouteRun transportRouteRun = (await this.repository.WhereAsync(p => p.type.Equals(typeof(TransportRouteRun).Name)
                                                              && p.organizationid.Equals(organizationid)
                                                              && p.Id.Equals(transportRunId))).AsEnumerable().FirstOrDefault();

            if (transportRouteRun != null)
            {
                transportRouteRun.Employees.Clear();
                transportRouteRun.Employees = value;
            }
            var result = (await this.repository.AddOrUpdateAsync(transportRouteRun));
            return new ObjectResult(result);
        }
        [HttpPut]
        [Route("TransportStoppageTracking/{organizationid}/{routerunid}/{date}")]
        public async Task<IActionResult> TransportStoppageTracking(string organizationid, string routerunid, string date, [FromBody]TransportRouteRunStoppage value)
        {
            if (value == null ||
                 date == null ||
                 date.Length == 0 ||
                 organizationid == null ||
                 organizationid.Length == 0 ||
                 routerunid == null ||
                 routerunid.Length == 0
                )
            {
                return BadRequest();
            }

            TransportRouteRun transportRouteRun = (await this.repository.WhereAsync(p => p.type.Equals(typeof(TransportRouteRun).Name)
                                                              && p.organizationid.Equals(organizationid)
                                                              && p.Id.Equals(routerunid)
                                                              && p.RunDate.Equals(date))).AsEnumerable().FirstOrDefault();
            if (transportRouteRun != null)
            {
                transportRouteRun.Stoppages.Add(value);
            }
            var result = (await this.repository.AddOrUpdateAsync(transportRouteRun));
            return new ObjectResult(result);
        }
        [Route("GetTransportRunDirection/{organizationid}/{date}")]
        public async Task<IActionResult> GetRunDirection(string organizationid, string date)
        {


            if (
                 date == null ||
                 date.Length == 0 ||
                 organizationid == null ||
                 organizationid.Length == 0
                )
            {
                return BadRequest();
            }

            var result = (await this.repository.WhereAsync(p => p.type.Equals(typeof(TransportRouteRun).Name)
                                                              && p.organizationid.Equals(organizationid)
                                                              && p.RunDate.Equals(date))).AsEnumerable();

            return new ObjectResult(result);
        }
        [Route("GetPickupRouteRun/{organizationid}/{date}")]
        public async Task<IActionResult> GetPickupRouteRun(string organizationid, string date)
        {


            if (
                 date == null ||
                 date.Length == 0 ||
                 organizationid == null ||
                 organizationid.Length == 0
                )
            {
                return BadRequest();
            }

            var result = (await this.repository.WhereAsync(p => p.type.Equals(typeof(TransportRouteRun).Name)
                                                              && p.organizationid.Equals(organizationid)
                                                              && p.RunDate.Equals(date) && p.RunDirection == TransportRouteRunDirection.ToSchool)).AsEnumerable();

            return new ObjectResult(result);
        }
        [Route("GetCurrentRouteRun/{organizationid}/{date}")]
        public async Task<IActionResult> GetCurrentRouteRun(string organizationid, string date)
        {


            if (
                 date == null ||
                 date.Length == 0 ||
                 organizationid == null ||
                 organizationid.Length == 0
                )
            {
                return BadRequest();
            }

            List<TransportRouteRun> transportRouteRun = (await this.repository.WhereAsync(p => p.type.Equals(typeof(TransportRouteRun).Name)
                                                              && p.organizationid.Equals(organizationid)
                                                              && p.RunDate.Equals(date) && p.RunDirection == TransportRouteRunDirection.FromSchool)).AsEnumerable().ToList();
            if (transportRouteRun.Count() <= 0)
            {
                transportRouteRun = (await this.repository.WhereAsync(p => p.type.Equals(typeof(TransportRouteRun).Name)
                                                                 && p.organizationid.Equals(organizationid)
                                                                 && p.RunDate.Equals(date) && p.RunDirection == TransportRouteRunDirection.ToSchool)).AsEnumerable().ToList();
            }

            return new ObjectResult(transportRouteRun);
        }
        [Route("AllTracking/{organizationid}/{patronId}/{startdate}/{endDate}")]
        public async Task<IActionResult> AllTracking(string organizationid, string patronId, string startdate, string endDate)
        {
            // Get all the documents from the collection

            var result = (await this.repository.WhereAsync(p => p.type.Equals(typeof(TransportRouteRun).Name)
                                                                && p.organizationid.Equals(organizationid)
                                                                && p.Patrons.Contains(patronId)
                                                                && p.RunDate.CompareTo(startdate) >= 0 && p.RunDate.CompareTo(endDate) <= 0
                                                                 )).AsEnumerable().OrderByDescending(x => x.RunDate);

            if (result == null)
            {
                return NotFound();
            }
            return new ObjectResult(result);

        }
        //[Route("GetCurrentRouteRun/{organizationid}/{date}")]
        //public async Task<IActionResult> GetCurrentRouteRun(string organizationid, string date)
        //{

        //    //var result =(string)null;
        //    if (
        //         date == null ||
        //         date.Length == 0 ||
        //         organizationid == null ||
        //         organizationid.Length == 0
        //        )
        //    {
        //        return BadRequest();
        //    }


        //    var result = (await this.repository.WhereAsync(p => p.type.Equals(typeof(TransportRouteRun).Name)
        //                                                      && p.organizationid.Equals(organizationid)
        //                                                      && p.RunDate.Equals(date) && p.RunDirection == TransportRouteRunDirection.FromSchool)).AsEnumerable();
        //    if (result == null || result.Count() == 0)
        //    {
        //        result = (await this.repository.WhereAsync(p => p.type.Equals(typeof(TransportRouteRun).Name)
        //                                                      && p.organizationid.Equals(organizationid)
        //                                                      && p.RunDate.Equals(date) && p.RunDirection == TransportRouteRunDirection.ToSchool)).AsEnumerable();
        //    }
        //    return new ObjectResult(result);
        //}
        [Route("GetHistoricalRouteRun/{organizationid}/{date}")]
        public async Task<IActionResult> GetHistoricalRouteRun(string organizationid, string date)
        {

            if (
                 date == null ||
                 date.Length == 0 ||
                 organizationid == null ||
                 organizationid.Length == 0
                )
            {
                return BadRequest();
            }


            var result = (await this.repository.WhereAsync(p => p.type.Equals(typeof(TransportRouteRun).Name)
                                                              && p.organizationid.Equals(organizationid)
                                                              && p.RunDate.Equals(date))).AsEnumerable();
            return new ObjectResult(result);
        }

    }
}