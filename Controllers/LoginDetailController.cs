using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

using SchoolWayz.Data.Models.SmartTrack;
using System.Linq;
using System.Threading.Tasks;
using SchoolWayz.Cloud.Web.Framework;

namespace SchoolWayz.Cloud.Web.Controllers
{


    [Route("api/[controller]")]
    public class LoginDetailController : BaseController<LoginDetail>
    {
        public LoginDetailController(IOptions<AppSettings> settings) : base(settings)
        {

        }
        [Route("LastLogin/{organizationid}/{userId}")]
        public async Task<LoginDetail> LastLogin(string organizationid, string userId)
        {
            // Get all the documents from the collection

            var result = (await this.repository.WhereAsync(p => p.type.Equals(typeof(LoginDetail).Name)
                                                                && p.organizationid.Equals(organizationid)
                                                                && p.UserId.Equals(userId))).AsEnumerable().OrderByDescending(x => x.LastLogin).FirstOrDefault();
            if (result == null)
            {
                return null;
            }
            return result;

        }
    }
}