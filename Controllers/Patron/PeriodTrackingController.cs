using Microsoft.AspNetCore.Mvc;
using SchoolWayz.Cloud.Web.Framework;
using SchoolWayz.Data.Models.SmartTrack;

using Microsoft.Extensions.Options;
using System.Linq;
using System.Threading.Tasks;
// For more information on enabling Web API for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace SchoolWayz.Cloud.Web.Controllers
{
    [Route("api/Period/")]
    public class PeriodTrackingController : BaseController<PeriodTracking>
    {
        
        public PeriodTrackingController(IOptions<AppSettings> setting) : base(setting)
        {

        }

        [Route("PeriodTracking/{organizationid}/{classid}/{sectionid}/{periodNumber}/{date}")]
        public async Task<IActionResult> SecondHalf(string organizationid, string classid, string sectionid, string periodNumber, string date)
        {
            // Get all the documents from the collection

            var result = (await this.repository.WhereAsync(p => p.type.Equals(typeof(PeriodTracking).Name)
                                                                 && p.organizationid.Equals(organizationid)
                                                                  && p.Class.Equals(classid)
                                                                    && p.Section.Equals(sectionid)
                                                                    && p.PeriodNumber.Equals(periodNumber)
                                                                 && p.TrackingDate.Equals(date))).AsEnumerable();
            if (result == null)
            {
                return NotFound();
            }
            return new ObjectResult(result);

        }

    }
}
