using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

using SchoolWayz.Data.Models.SmartTrack;
using Microsoft.Extensions.Options;
using SchoolWayz.Cloud.Web.Framework;
// For more information on enabling Web API for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace SchoolWayz.Cloud.Web.Controllers
{
    [Route("api/[controller]")]
    public class AdminCredentialController : BaseController<AdminCredential>
    {
        public AdminCredentialController(IOptions<AppSettings> settings) : base(settings)
        {

        }
        [HttpPost]
        [Route("AuthenticateUser/")]
        public async Task<AdminCredential> Admin([FromBody]AdminCredential value)
        {
            // Get all the documents from the collection
            var authenticatedUser = (await this.repository.WhereAsync(p => p.type.Equals(typeof(AdminCredential).Name)
                                                                && p.UserName.Equals(value.UserName) &&                 p.Password.Equals(value.Password))).AsEnumerable().FirstOrDefault();

            
            if (authenticatedUser == null)
            {
                return null;
                //return NotFound();
            }

                return authenticatedUser;
        }
       
        [HttpPut]
        [Route("ChangeUserPassword/{organizationId}/{id}")]
        public async Task<AdminCredential> ChangeUserPassword(string organizationId,string id,[FromBody]AdminCredential value)
        {
            // Get all the documents from the collection
            var authenticatedUser = (await this.repository.WhereAsync(p => p.type.Equals(typeof(AdminCredential).Name)
                                                                && p.organizationid.Equals(organizationId)
                                                                && p.UserId.Equals(id) && p.Password.Equals(value.Password))).AsEnumerable().FirstOrDefault();


            if (authenticatedUser == null)
            {
                return null;
                //return NotFound();
            }
            else
            {
                authenticatedUser.Password = value.NewPassword;
                await this.repository.AddOrUpdateAsync(authenticatedUser);
            }

            return authenticatedUser;
        }


        [Route("GetAdminData/{organizationid}/{userId}/{password}")]
        public async Task<IActionResult> GetAdminData(string organizationid, string userId,string password)
        {
            // Get all the documents from the collection

            var result = (await this.repository.WhereAsync(p => p.type.Equals(typeof(AdminCredential).Name)
                                                                 && p.organizationid.Equals(organizationid)
                                                                  && p.UserId.Equals(userId) && p.Password.Equals(password)
                                                                 )).AsEnumerable().FirstOrDefault();
            if (result == null)
            {
                return NotFound();
            }

            return new ObjectResult(result);

        }
        [HttpPost]
        [Route("ForgotPasswodCredential/")]
        public async Task<AdminCredential> ForgotPassword([FromBody]AdminCredential value)
        {
            // Get all the documents from the collection
            var authenticatedUser = (await this.repository.WhereAsync(p => p.type.Equals(typeof(AdminCredential).Name)
                                                                && p.EmailId.Equals(value.EmailId) || p.PrimaryContact.Equals(value.EmailId))).AsEnumerable().FirstOrDefault();


            if (authenticatedUser == null)
            {
                return null;
                //return NotFound();
            }

            return authenticatedUser;
        }

    }
}
