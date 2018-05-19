using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

using SchoolWayz.Data.Models.SmartTrack;
using Microsoft.Extensions.Options;
using Microsoft.Azure.Documents;
using SchoolWayz.Cloud.Web.Framework;

namespace SchoolWayz.Cloud.Service.Controllers.Route
{
    [Route("api/Route")]
    public class TransportRouteController : BaseController<TransportRoute>
    {



        public TransportRouteController(IOptions<AppSettings> settings) : base(settings)
        {

        }




        // Get All Stoppages for a Route

        [Route("Stoppages/{organizationid}/{routeid}")]
        public async Task<IActionResult> GetRouteStoppages(string organizationid, string routeid)
        {
            // Check the valid organizationid
            if (organizationid == null || organizationid.Length == 0 || await IsValidOrganizationID(organizationid) == false)
            {
                return BadRequest();
            }


            // Get all the stoppages for the route

            var result = (await this.repository.WhereAsync(p => p.type.Equals(typeof(TransportRoute).Name)
                                                            && p.organizationid.Equals(organizationid)
                                                            && p.Id.Equals(routeid)
                                                      )).SelectMany(p => p.TransportStoppages);



            if (result == null)
            {
                return NotFound();
            }

            return new ObjectResult(result);

        }


        // Get Patrons for a Route along with Stoppage Details

        [Route("Patrons/{organizationid}/{routeid}")]
        public async Task<IActionResult> GetRoutePatrons(string organizationid, string routeid)
        {


            // Check the valid organizationid
            if (organizationid == null || organizationid.Length == 0 || await IsValidOrganizationID(organizationid) == false)
            {
                return BadRequest();
            }


            // Get all the patrons for the route

            var query = new SqlQuerySpec
            {
                QueryText = "select {'PatronId': P, 'Stoppage': T.Name, 'StoppageId': T.id, 'Sequence': T.Sequence} as RoutePatrons from c Join T in c.TransportStoppages Join P in T.PatronId where c.organizationid = @orgid and c.type  = 'TransportRoute' and c.id = @id ",
                Parameters = new Microsoft.Azure.Documents.SqlParameterCollection {
                    new SqlParameter { Name = "@orgid", Value = organizationid},
                    new SqlParameter { Name = "@id"   , Value = routeid } }
            };


            var result = (await this.repository.QueryAsyncSQL(query));



            if (result == null)
            {
                return NotFound();
            }

            return new ObjectResult(result);

        }


        // Get Patrons for a Specific Stoppage
        [Route("Stoppage/Patrons/{organizationid}/{stoppageid}")]
        public async Task<IActionResult> GetStoppagePatrons(string organizationid, string stoppageid)
        {


            // Check the valid organizationid
            if (organizationid == null || organizationid.Length == 0 || await IsValidOrganizationID(organizationid) == false)
            {
                return BadRequest();
            }


            // Get all the patrons for the route

            var query = new SqlQuerySpec
            {
                QueryText = "select P as PatronId from c Join T in c.TransportStoppages Join P in T.PatronId where c.organizationid = @orgid and c.type  = 'TransportRoute' and T.id = @stoppageid ",
                Parameters = new Microsoft.Azure.Documents.SqlParameterCollection {
                    new SqlParameter { Name = "@orgid", Value = organizationid},
                    new SqlParameter { Name = "@stoppageid"   , Value = stoppageid } }
            };


            var result = (await this.repository.QueryAsyncSQL(query));



            if (result == null)
            {
                return NotFound();
            }

            return new ObjectResult(result);

        }


        // Add Patron to a Stoppage
        [HttpPut]
        [Route("Stoppage/AddPatron/{organizationid}/{routeid}/{stoppageid}/{patronid}")]
        public async Task<IActionResult> AddPatronToStoppage(string organizationid, string routeid, string stoppageid, string patronid)
        {

            // If the patronid, stoppageid or organization id is not valid
            if (routeid == null ||
                 routeid.Length == 0 ||
                 patronid == null ||
                 patronid.Length == 0 ||
                 stoppageid == null ||
                 stoppageid.Length == 0 ||
                 organizationid == null ||
                 organizationid.Length == 0
                )
            {
                return BadRequest();
            }


            // Get the route document

            TransportRoute routedoc = (await this.repository.WhereAsync(p => p.type.Equals(typeof(TransportRoute).Name)
                                                              && p.organizationid.Equals(organizationid)
                                                              && p.Id.Equals(routeid))).AsEnumerable().FirstOrDefault();

            // Add the Patron ID to the stoppage required
            TransportStoppage stoppage = routedoc.TransportStoppages.Find(p => p.Id == stoppageid);

            // Add the first Patron

            if (stoppage != null && stoppage.PatronId == null)
            {
                stoppage.PatronId = new List<string>();
                stoppage.PatronId.Add(patronid);


            }
            else
            {
                // Check if the Patron ID already exist 
                if (!stoppage.PatronId.Contains(patronid))
                {
                    // Add the Patron ID 
                    stoppage.PatronId.Add(patronid);
                }

            }

            var result = (await this.repository.AddOrUpdateAsync(routedoc));

            return new ObjectResult(result);
            //return new OkResult();
        }



        // Remove Patron from a Stoppage
        [HttpPut]
        [Route("Stoppage/RemovePatron/{organizationid}/{routeid}/{stoppageid}/{patronid}")]
        public async Task<IActionResult> RemovePatronFromStoppage(string organizationid, string routeid, string stoppageid, string patronid)
        {

            // If the patronid, stoppageid or organization id is not valid
            if (routeid == null ||
                 routeid.Length == 0 ||
                 patronid == null ||
                 patronid.Length == 0 ||
                 stoppageid == null ||
                 stoppageid.Length == 0 ||
                 organizationid == null ||
                 organizationid.Length == 0
                )
            {
                return BadRequest();
            }


            // Get the route document

            TransportRoute routedoc = (await this.repository.WhereAsync(p => p.type.Equals(typeof(TransportRoute).Name)
                                                              && p.organizationid.Equals(organizationid)
                                                              && p.Id.Equals(routeid))).AsEnumerable().FirstOrDefault();

            // Remove the Patron ID to the stoppage required

            routedoc.TransportStoppages.Find(p => p.Id == stoppageid).PatronId.Remove(patronid);

            var result = (await this.repository.AddOrUpdateAsync(routedoc));

            return new OkResult();
        }



        // Add Stoppage to a Route

        [HttpPut]
        [Route("Stoppage/{organizationid}/{routeid}")]
        public async Task<IActionResult> AddStoppage(string organizationid, string routeid, [FromBody]TransportStoppage value)
        {

            // If the patronid, stoppageid or organization id is not valid
            if (value == null ||
                 routeid == null ||
                 routeid.Length == 0 ||
                 organizationid == null ||
                 organizationid.Length == 0
                )
            {
                return BadRequest();
            }


            // Get the route document

            TransportRoute routedoc = (await this.repository.WhereAsync(p => p.type.Equals(typeof(TransportRoute).Name)
                                                              && p.organizationid.Equals(organizationid)
                                                              && p.Id.Equals(routeid))).AsEnumerable().FirstOrDefault();


            // Check if the Stoppage already exist for route
            TransportStoppage stoppage = routedoc.TransportStoppages.Find(p => p.Id == value.Id);
            if (stoppage != null)
            {
                // remove the existing and add the supplied
                routedoc.TransportStoppages.Remove(stoppage);

            }

            // Add the new value
            routedoc.TransportStoppages.Add(value);



            var result = (await this.repository.AddOrUpdateAsync(routedoc));

            return new ObjectResult(result);
        }


        [HttpPut]
        [Route("RemoveStoppage/{organizationid}/{routeid}/{stoppageid}")]
        public async Task<IActionResult> RemoveStoppage(string organizationid, string routeid, string stoppageid)
        {

            // If the patronid, stoppageid or organization id is not valid
            if (routeid == null ||
                 routeid.Length == 0 ||
                 organizationid == null ||
                 organizationid.Length == 0 ||
                 stoppageid == null ||
                 stoppageid.Length == 0
                )
            {
                return BadRequest();
            }


            // Get the route document

            TransportRoute routedoc = (await this.repository.WhereAsync(p => p.type.Equals(typeof(TransportRoute).Name)
                                                              && p.organizationid.Equals(organizationid)
                                                              && p.Id.Equals(routeid))).AsEnumerable().FirstOrDefault();

            // Get The Stoppage Object 
            TransportStoppage stoppage = routedoc.TransportStoppages.Find(p => p.Id == stoppageid);


            if (stoppage != null)
            {
                // Remove the stoppage from the route
                routedoc.TransportStoppages.Remove(stoppage);

            }

            // Update the document

            var result = (await this.repository.AddOrUpdateAsync(routedoc));

            return new OkResult();
        }

        //Edit stoppage
        [Route("EditStoppage/{organizationid}/{routeid}/{stoppageid}")]
        public async Task<IActionResult> EditStoppage(string organizationid, string routeid, string stoppageid)
        {
            // Get all the documents from the collection

            var result = (await this.repository.WhereAsync(p => p.type.Equals(typeof(TransportRoute).Name)
                                                                 && p.organizationid.Equals(organizationid)
                                                                  && p.Id.Equals(routeid)
                                                                 )).AsEnumerable().SelectMany(x => x.TransportStoppages).Where(x => x.Id.Equals(stoppageid));
            if (result == null)
            {
                return NotFound();
            }
            return new ObjectResult(result);

        }
        //Stoppage Sequence Move Up
        [Route("MoveUp/{organizationid}/{routeid}/{stoppageid}/{sequenceno}")]
        public async Task<IActionResult> MoveUp(string organizationid, string routeid, string stoppageid, int sequenceno)
        {
            // Get all the documents from the collection
            var result = (await this.repository.WhereAsync(p => p.type.Equals(typeof(TransportRoute).Name)
                                                                 && p.organizationid.Equals(organizationid)
                                                                  && p.Id.Equals(routeid)
                                                                 )).AsEnumerable().SelectMany(x => x.TransportStoppages);
            if (result == null)
            {
                return NotFound();
            }
            return new ObjectResult(result);

        }

        //Stoppage Sequence Move Down
        [Route("MoveDown/{organizationid}/{routeid}/{stoppageid}/{sequenceno}")]
        public async Task<IActionResult> MoveDown(string organizationid, string routeid, string stoppageid, int sequenceno)
        {
            // Get all the documents from the collection

            var result = (await this.repository.WhereAsync(p => p.type.Equals(typeof(TransportRoute).Name)
                                                                 && p.organizationid.Equals(organizationid)
                                                                  && p.Id.Equals(routeid)
                                                                 )).AsEnumerable().SelectMany(x => x.TransportStoppages);
            if (result == null)
            {
                return NotFound();
            }
            return new ObjectResult(result);

        }
    }

}