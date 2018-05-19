using Microsoft.AspNetCore.Mvc;
using SchoolWayz.Data.Models.SmartTrack;

using Microsoft.Extensions.Options;
using System.Threading.Tasks;
using System.Linq;
using SchoolWayz.Cloud.Web.Framework;

namespace SchoolWayz.Cloud.Web.Controllers
{
    [Route("api/[controller]")]
    public class SetupDeviceController : BaseController<SetupDevice>
    {
        public SetupDeviceController(IOptions<AppSettings>setting) : base(setting)
            {

           }

        [Route("GetAll/{organizationid}")]
        public async Task<IActionResult> GetAll(string organizationid)
        {
            // Get all the documents from the collection

            var result = (await this.repository.WhereAsync(p => p.type.Equals(typeof(SetupDevice).Name)
                                                                 && p.organizationid.Equals(organizationid)
                                                                && p.Status
                                                                 )).AsEnumerable();
            if (result == null)
            {
                return NotFound();
            }
            return new ObjectResult(result);

        }
        [Route("AttendanceDevice/{organizationid}")]
        public async Task<IActionResult> AttendanceDevice(string organizationid)
        {
            // Get all the documents from the collection

            var result = (await this.repository.WhereAsync(p => p.type.Equals(typeof(SetupDevice).Name)
                                                                 && p.organizationid.Equals(organizationid)
                                                                  && p.TransportRouteId == null
                                                                && p.Status
                                                                 )).AsEnumerable();
            if (result == null)
            {
                return NotFound();
            }
            return new ObjectResult(result);

        }
        [Route("ClassDevice/{organizationid}/{patronClass}")]
        public async Task<IActionResult> ClassDevice(string organizationid,string patronClass)
        {
            // Get all the documents from the collection

            var result = (await this.repository.WhereAsync(p => p.type.Equals(typeof(SetupDevice).Name)
                                                                 && p.organizationid.Equals(organizationid)
                                                                  && p.Class.Equals(patronClass)
                                                                && p.Status
                                                                 )).AsEnumerable();
            if (result == null)
            {
                return NotFound();
            }
            return new ObjectResult(result);

        }

        [Route("SectionDevice/{organizationid}/{patronClass}/{section}")]
        public async Task<IActionResult> SectionDevice(string organizationid, string patronClass,string section)
        {
            // Get all the documents from the collection

            var result = (await this.repository.WhereAsync(p => p.type.Equals(typeof(SetupDevice).Name)
                                                                 && p.organizationid.Equals(organizationid)
                                                                  && p.Class.Equals(patronClass)
                                                                  && p.Section.Equals(section)
                                                                && p.Status
                                                                 )).AsEnumerable();
            if (result == null)
            {
                return NotFound();
            }
            return new ObjectResult(result);

        }

        [Route("TransportDevice/{organizationid}")]
        public async Task<IActionResult> TransportDevice(string organizationid)
        {
            // Get all the documents from the collection

            var result = (await this.repository.WhereAsync(p => p.type.Equals(typeof(SetupDevice).Name)
                                                                 && p.organizationid.Equals(organizationid)
                                                                  && p.TransportRouteId != null                                                                
                                                                && p.Status
                                                                 )).AsEnumerable();
            if (result == null)
            {
                return NotFound();
            }
            return new ObjectResult(result);

        }

    }

}
