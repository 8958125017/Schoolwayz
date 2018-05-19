using Microsoft.AspNetCore.Mvc;
using SchoolWayz.Data.Models.SmartTrack;

using Microsoft.Extensions.Options;
using System.Threading.Tasks;
using System.Linq;
using System.Collections.Generic;
using SchoolWayz.Cloud.Web.Framework;

namespace SchoolWayz.Cloud.Web.Controllers
{

    [Route("api/[controller]")]
    public class GradeController : BaseController<GradeDetail>
    {
        public GradeController(IOptions<AppSettings>setting) : base(setting)
        {

        }


        [Route("GetAll/{organizationid}/{grade}")]
        public async Task<IActionResult> GetAll(string organizationid, string grade)
        {
            // Get all the documents from the collection

            var result = (await this.repository.WhereAsync(p => p.type.Equals(typeof(GradeDetail).Name)
                                                                && p.organizationid.Equals(organizationid)
                                                                && p.Grade.Equals(grade)                                                          
                                                               )).OrderBy(p => p.Section).AsEnumerable();
            if (result == null)
            {
                return NotFound();
            }
            return new ObjectResult(result);

        }
        [Route("GetGradeBySection/{organizationid}/{grade}/{section}")]
        public async Task<IActionResult> GetGradeBySection(string organizationid, string grade, string section)
        {
            // Get all the documents from the collection

            var result = (await this.repository.WhereAsync(p => p.type.Equals(typeof(GradeDetail).Name)
                                                                && p.organizationid.Equals(organizationid)
                                                                && p.Grade.Equals(grade)
                                                                && p.Section.Equals(section)
                                                               )).AsEnumerable().FirstOrDefault();
            if (result == null)
            {
                return NotFound();
            }
            return new ObjectResult(result);

        }
        [Route("GetClasses/{organizationid}")]
        public async Task<IActionResult> GetClasses(string organizationid)
        {
            // Get all the documents from the collection

            var result = (await this.repository.WhereAsync(p => p.type.Equals(typeof(GradeDetail).Name)
                                                                && p.organizationid.Equals(organizationid)
                                                               )).OrderBy(p => p.Grade).AsEnumerable();

            IEnumerable<string> rs= result.Select(x => x.Grade).Distinct();

            if (result == null)
            {
                return NotFound();
            }
            return new ObjectResult(rs);

        }
    }
}
