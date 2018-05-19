using Microsoft.AspNetCore.Mvc;
using SchoolWayz.Data.Models.SmartTrack;
using Microsoft.Extensions.Options;
using SchoolWayz.Cloud.Web.Framework;
using System.Threading.Tasks;
using System.Linq;
using System.Collections.Generic;

namespace SchoolWayz.Cloud.Web.Controllers
{


    [Route("api/[controller]")]
    public class SessionController : BaseController<SessionDetail>
    {
        public SessionController(IOptions<AppSettings> settings) : base(settings)
        {

        }

        [HttpPost]
        [Route("saveAndGetSessionId")]
        public async Task<IActionResult> SaveAndGetSessionId([FromBody]SessionDetail value)
        {
            if (value == null || value.organizationid == null || value.organizationid.Length == 0)
            {
                return BadRequest();
            }

            var result = (await this.repository.AddOrUpdateAsync(value));

            //string id = value.Id;

            //return CreatedAtRoute("DefaultApi", new { organizationid = result.organizationid, id = result.Id }, result);
            return new ObjectResult(result);
        }

        [HttpPut]
        [Route("UpdateSessionDetailStatus/{organizationid}/{sessionId}")]
        public async Task<IActionResult> UpdateSessionDetailStatus(string organizationid, string sessionId)
        {
            // Get all the documents from the collection

            List<SessionDetail> sessionList = (await this.repository.WhereAsync(p => p.type.Equals(typeof(SessionDetail).Name)
                                                                 && p.organizationid.Equals(organizationid)
                                                                  && p.Id != sessionId
                                                                  )).AsEnumerable().ToList();
            if (sessionList != null && sessionList.Count > 0)
            {
                foreach (var session in sessionList)
                {
                    session.Status = "Completed";
                    await this.repository.AddOrUpdateAsync(session);
                }
            }

            var result = (await this.repository.WhereAsync(p => p.type.Equals(typeof(SessionDetail).Name)
                                                                && p.organizationid.Equals(organizationid)
                                                                 )).AsEnumerable().ToList();

            return new ObjectResult(result);

        }
        [Route("UpdateSessionWithBreak/{organizationid}")]
        public async void UpdateSessionWithBreak(string organizationid, [FromBody]BreakDetail value)
        {
            // Get all the documents from the collection

            var result = (await this.repository.WhereAsync(p => p.type.Equals(typeof(SessionDetail).Name)
                                                                 && p.organizationid.Equals(organizationid)
                                                                  && p.Status.Equals("Active")
                                                                 )).AsEnumerable().FirstOrDefault();
            if (result != null)
            {

                result.SessionBreak.Add(value);
                await this.repository.AddOrUpdateAsync(result);
            }

        }
        [Route("UpdateBreakInSession/{organizationid}/{breakId}")]
        public async void UpdateBreakInSession(string organizationid, string breakId, [FromBody]BreakDetail value)
        {
            // Get all the documents from the collection

            SessionDetail result = (await this.repository.WhereAsync(p => p.type.Equals(typeof(SessionDetail).Name)
                                                                 && p.organizationid.Equals(organizationid)
                                                                  && p.Status.Equals("Active")
                                                                 )).AsEnumerable().FirstOrDefault();
            BreakDetail breakDetail = result.SessionBreak.Find(x => x.Id == breakId);
            if (breakDetail != null)
            {
                result.SessionBreak.Remove(breakDetail);
            }
            result.SessionBreak.Add(value);
            await this.repository.AddOrUpdateAsync(result);

        }

        [Route("UpdateSessionWithTerm/{organizationid}")]
        public async void UpdateSessionWithTerm(string organizationid, [FromBody]TermDetail value)
        {
            // Get all the documents from the collection

            var result = (await this.repository.WhereAsync(p => p.type.Equals(typeof(SessionDetail).Name)
                                                                 && p.organizationid.Equals(organizationid)
                                                                  && p.Status.Equals("Active")
                                                                 )).AsEnumerable().FirstOrDefault();
            if (result != null)
            {

                result.SessionTerm.Add(value);
                await this.repository.AddOrUpdateAsync(result);
            }

        }
        [Route("UpdateTermInSession/{organizationid}/{termId}")]
        public async void UpdateTermInSession(string organizationid, string termId, [FromBody]TermDetail value)
        {
            // Get all the documents from the collection

            SessionDetail result = (await this.repository.WhereAsync(p => p.type.Equals(typeof(SessionDetail).Name)
                                                                 && p.organizationid.Equals(organizationid)
                                                                  && p.Status.Equals("Active")
                                                                 )).AsEnumerable().FirstOrDefault();
            TermDetail termDetail = result.SessionTerm.Find(x => x.Id == termId);

            if (termDetail != null)
            {
                result.SessionTerm.Remove(termDetail);
            }
            result.SessionTerm.Add(value);
            await this.repository.AddOrUpdateAsync(result);

        }
        [HttpPut]
        [Route("DeleteBreakFromSession/{organizationid}/{breakId}")]
        public async void DeleteBreakFromSession(string organizationid, string breakId)
        {
            // Get all the documents from the collection

            SessionDetail result = (await this.repository.WhereAsync(p => p.type.Equals(typeof(SessionDetail).Name)
                                                                 && p.organizationid.Equals(organizationid)
                                                                  && p.Status.Equals("Active")
                                                                 )).AsEnumerable().FirstOrDefault();
            BreakDetail breakDetail = result.SessionBreak.Find(x => x.Id == breakId);

            if (breakDetail != null)
            {
                result.SessionBreak.Remove(breakDetail);
            }
            //  var resultDel = (await this.repository.RemoveAsync(id));

            await this.repository.AddOrUpdateAsync(result);

        }
        [HttpPut]
        [Route ("DeleteTermFromSession/{organizationId}/{termId}")]
        public async void DeleteTermFromSessionn (string organizationId,string termId)
        {
            SessionDetail result = (await this.repository.WhereAsync(p => p.type.Equals(typeof(SessionDetail).Name)
                                                                     && p.organizationid.Equals(organizationId)
                                                                     && p.Status.Equals("Active"))).AsEnumerable                                              ().FirstOrDefault();

            TermDetail termDetail = result.SessionTerm.Find(x => x.Id == termId);
            if(termDetail!=null)
            {
                result.SessionTerm.Remove(termDetail);
            }
            await this.repository.AddOrUpdateAsync(result);
        }

        [Route("UpdateSessionWithWeek/{organizationid}/{weekdays}")]
        public async void UpdateSessionWithWeek(string organizationid, string weekdays)
        {
            // Get all the documents from the collection
            WeekDetail newWeekDeatil = new WeekDetail();
            newWeekDeatil.dayofweek = weekdays;

            var result = (await this.repository.WhereAsync(p => p.type.Equals(typeof(SessionDetail).Name)
                                                                 && p.organizationid.Equals(organizationid)
                                                                  && p.Status.Equals("Active")
                                                                 )).AsEnumerable().FirstOrDefault();
            WeekDetail weekDetail = result.WeekDays;
            if (weekDetail != null)
            {

                result.WeekDays.dayofweek = "";
                
            }
            result.WeekDays = newWeekDeatil;
            await this.repository.AddOrUpdateAsync(result);

        }

    }
}
