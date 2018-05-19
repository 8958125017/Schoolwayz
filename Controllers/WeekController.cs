using Microsoft.AspNetCore.Mvc;
using SchoolWayz.Data.Models.SmartTrack;

using Microsoft.Extensions.Options;
using SchoolWayz.Cloud.Web.Framework;

namespace SchoolWayz.Cloud.Web.Controllers
{


    [Route("api/[controller]")]
    public class WeekController : BaseController<WeekDetail>
    {
        public WeekController(IOptions<AppSettings> settings) : base(settings)
        {

        }
    }
}
