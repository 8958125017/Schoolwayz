using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

using SchoolWayz.Data.Models.SmartTrack;
using Microsoft.Extensions.Options;

using Newtonsoft.Json.Linq;
using SchoolWayz.Cloud.Web.Framework;

namespace SchoolWayz.Cloud.Service.Controllers.Route
{
    [Route("api/Route/Tracking")]
    public class TransportRouteTrackingController : BaseController<TransportRouteTracking>
    {



        public TransportRouteTrackingController(IOptions<AppSettings> settings) : base(settings)
        {

        }

        // Get Summary for a Specific Stoppage
        [HttpGet]
        [Route("Summary/Stoppage/{organizationid}/{stoppageid}/{date}")]
        public async Task<IActionResult> GetStoppageTrackingSummary(string organizationid, string stoppageid, string date)
        {


            // Check the valid organizationid
            if (organizationid == null || organizationid.Length == 0 || stoppageid == null || stoppageid.Length == 0 || date == null || date.Length == 0)
            {
                return BadRequest();
            }





            // Get all the Tracking for the Stoppage for the date

            TransportRouteTracking[] result = (await this.repository.WhereAsync(p => p.type.Equals(typeof(TransportRouteTracking).Name)
                                                           && p.organizationid.Equals(organizationid)
                                                           && p.StoppageId.Equals(stoppageid)
                                                           && p.TrackingDate.Equals(date)
                                                      )).ToArray();






            return new ObjectResult(BuildStoppageSummary(result, stoppageid, date));



        }
        [HttpGet]
        [Route("PersonSummary/{organizationid}/{routeno}/{date}")]
        public async Task<IActionResult> GetPersonTrackingSummary(string organizationid, string routeno, string date)
        {


            // Check the valid organizationid
            if (organizationid == null || organizationid.Length == 0 || routeno == null || routeno.Length == 0 || date == null || date.Length == 0)
            {
                return BadRequest();
            }





            // Get all the Tracking for the Stoppage for the date

            TransportRouteTracking[] result = (await this.repository.WhereAsync(p => p.type.Equals(typeof(TransportRouteTracking).Name)
                                                           && p.organizationid.Equals(organizationid)
                                                           && p.RouteNumber.Equals(routeno)
                                                           && p.TrackingDate.Equals(date)
                                                            && p.PatronId.Equals(null)
                                                      )).ToArray();
            IEnumerable<string> rs = result.Select(x => x.EmployeeId).Distinct();

            return new ObjectResult(rs);



        }


        // Get Summary for a Specific Route
        [HttpGet]
        [Route("Summary/{organizationid}/{routeno}/{date}")]
        public async Task<IActionResult> GetRouteTrackingSummary(string organizationid, string routeno, string date)
        {


            // Check the valid organizationid
            if (organizationid == null || organizationid.Length == 0 || routeno == null || routeno.Length == 0 || date == null || date.Length == 0)
            {
                return BadRequest();
            }





            // Get all the Tracking for the Stoppage for the date

            TransportRouteTracking[] result = (await this.repository.WhereAsync(p => p.type.Equals(typeof(TransportRouteTracking).Name)
                                                           && p.organizationid.Equals(organizationid)
                                                           && p.RouteNumber.Equals(routeno)
                                                           && p.TrackingDate.Equals(date)
                                                      )).ToArray();







            return new ObjectResult(BuildRouteSummary(result, routeno, date));



        }


        // Get Summary for an organization
        [HttpGet]
        [Route("Summary/{organizationid}/{date}")]
        public async Task<IActionResult> GetSummary(string organizationid, string date)
        {


            // Check the valid organizationid
            if (organizationid == null || organizationid.Length == 0 || date == null || date.Length == 0)
            {
                return BadRequest();
            }





            // Get all the Tracking for the organization for the date

            TransportRouteTracking[] result = (await this.repository.WhereAsync(p => p.type.Equals(typeof(TransportRouteTracking).Name)
                                                           && p.organizationid.Equals(organizationid)
                                                           && p.TrackingDate.Equals(date)
                                                      )).ToArray();





            double CutOffTimeMinutes = TimeSpan.Parse(AppSettings.tracking.CutOffTime).TotalMinutes;


            // Get The First Tracking for PickUp
            IEnumerable<TransportRouteTracking> pickup = result.Where(p => TimeSpan.Parse(p.TrackingTime).TotalMinutes < CutOffTimeMinutes);

            // Get The Tracking for Drop
            IEnumerable<TransportRouteTracking> drop = result.Where(p => TimeSpan.Parse(p.TrackingTime).TotalMinutes > CutOffTimeMinutes);

            int pickupcount = pickup.Count();
            int dropcount = drop.Count();



            string[] pickuppatrons = pickup.Select(p => p.PatronId).ToArray();
            string[] droppatrons = drop.Select(p => p.PatronId).ToArray();


            // create StoppageTrackingSummary dynamic object

            dynamic summary = new JObject();


            summary.PickupCount = pickupcount;
            summary.DropCount = dropcount;

            summary.TrackingDate = date;
            summary.PickupPatrons = new JArray(pickuppatrons);
            summary.DropPatrons = new JArray(droppatrons);




            //Get The Route Group
            IEnumerable<IGrouping<string, string>> routes = result.GroupBy(p => p.RouteNumber, p => p.RouteNumber);

            TransportRouteTracking[] routeResult;
            JArray routeArray = new JArray();


            foreach (IGrouping<string, string> route in routes)
            {

                routeResult = result.Where(p => p.RouteNumber == route.Key).ToArray();


                routeArray.Add(BuildRouteSummary(routeResult, route.Key, date));


            }

            summary.Routes = routeArray;


            return new ObjectResult(summary);



        }

        [Route("OnBoard/{organizationid}/{routeno}/{date}")]
        public async Task<IActionResult> GetOnBoardPatron(string organizationid, string routeno, string date)
        {
            // Get all the documents from the collection
            IEnumerable<TransportRouteTracking> pickup;
            double CutOffTimeMinutes = TimeSpan.Parse(AppSettings.tracking.CutOffTime).TotalMinutes;

            TransportRouteTracking[] result = (await this.repository.WhereAsync(p => p.type.Equals(typeof(TransportRouteTracking).Name)
                                                          && p.organizationid.Equals(organizationid)
                                                          && p.TrackingDate.Equals(date) && p.RouteNumber.Equals(routeno)
                                                     )).ToArray();
            if (DateTime.Now > DateTime.Parse(AppSettings.tracking.CutOffTime))
            {
                pickup = result.Where(p => TimeSpan.Parse(p.TrackingTime).TotalMinutes > CutOffTimeMinutes);
            }
            else
            {
                pickup = result.Where(p => TimeSpan.Parse(p.TrackingTime).TotalMinutes < CutOffTimeMinutes);
            }



            return new ObjectResult(pickup);


        }


        #region Helper Private Functions 


        public dynamic BuildStoppageSummary(TransportRouteTracking[] result, string stoppageid, string date)
        {
            double CutOffTimeMinutes = TimeSpan.Parse(AppSettings.tracking.CutOffTime).TotalMinutes;


            // Get The First Tracking for PickUp
            IEnumerable<TransportRouteTracking> pickup = result.Where(p => TimeSpan.Parse(p.TrackingTime).TotalMinutes < CutOffTimeMinutes);

            // Get The Tracking for Drop
            IEnumerable<TransportRouteTracking> drop = result.Where(p => TimeSpan.Parse(p.TrackingTime).TotalMinutes > CutOffTimeMinutes);

            int pickupcount = pickup.Count();
            int dropcount = drop.Count();
            string pickuptime = "";
            string droptime = "";

            if (pickupcount != 0)
            {
                pickuptime = pickup.OrderBy(p => p.TrackingTime).First().TrackingTime;
            }

            if (dropcount != 0)
            {
                droptime = drop.OrderBy(p => p.TrackingTime).First().TrackingTime;
            }

            string[] pickuppatrons = pickup.Select(p => p.PatronId).ToArray();
            string[] droppatrons = drop.Select(p => p.PatronId).ToArray();


            // create StoppageTrackingSummary dynamic object

            dynamic summary = new JObject();

            summary.StoppageId = stoppageid;
            summary.PickupCount = pickupcount;
            summary.DropCount = dropcount;
            summary.PickupTime = pickuptime;
            summary.DropTime = droptime;
            summary.TrackingDate = date;
            summary.PickupPatrons = new JArray(pickuppatrons);
            summary.DropPatrons = new JArray(droppatrons);

            return summary;
        }

        public dynamic BuildRouteSummary(TransportRouteTracking[] result, string routeno, string date)
        {
            double CutOffTimeMinutes = TimeSpan.Parse(AppSettings.tracking.CutOffTime).TotalMinutes;


            // Get The First Tracking for PickUp
            IEnumerable<TransportRouteTracking> pickup = result.Where(p => TimeSpan.Parse(p.TrackingTime).TotalMinutes < CutOffTimeMinutes);

            // Get The Tracking for Drop
            IEnumerable<TransportRouteTracking> drop = result.Where(p => TimeSpan.Parse(p.TrackingTime).TotalMinutes > CutOffTimeMinutes);

            int pickupcount = pickup.Count();
            int dropcount = drop.Count();



            string[] pickuppatrons = pickup.Select(p => p.PatronId).ToArray();
            string[] droppatrons = drop.Select(p => p.PatronId).ToArray();


            // create StoppageTrackingSummary dynamic object

            dynamic summary = new JObject();

            summary.RouteNo = routeno;
            summary.PickupCount = pickupcount;
            summary.DropCount = dropcount;

            summary.TrackingDate = date;
            summary.PickupPatrons = new JArray(pickuppatrons);
            summary.DropPatrons = new JArray(droppatrons);










            //Get The Stoppage Group
            IEnumerable<IGrouping<string, string>> stoppages = result.GroupBy(p => p.StoppageId, p => p.StoppageId);

            TransportRouteTracking[] stoppageResult;
            JArray stoppageArray = new JArray();


            foreach (IGrouping<string, string> stoppage in stoppages)
            {

                stoppageResult = result.Where(p => p.StoppageId == stoppage.Key).ToArray();


                stoppageArray.Add(BuildStoppageSummary(stoppageResult, stoppage.Key, date));


            }

            summary.Stoppages = stoppageArray;

            return summary;

        }

        #endregion

    }



}