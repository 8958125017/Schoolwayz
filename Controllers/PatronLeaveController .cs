using Microsoft.AspNetCore.Mvc;

using SchoolWayz.Data.Models.SmartTrack;
using SchoolWayz.Cloud.Web.Framework;
using Microsoft.Extensions.Options;

// For more information on enabling Web API for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace SchoolWayz.Cloud.Web.Controllers
{
    [Route("api/[controller]")]
    public class PatronLeaveController : BaseController<PatronLeaveDetail>
    {
        public PatronLeaveController(IOptions<AppSettings> setting) : base(setting)
        {

        }

    }
}
