using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using SchoolWayz.Cloud.Web.Framework;
using SchoolWayz.Data.Models.SmartTrack;
using Microsoft.Extensions.Options;
using Microsoft.AspNetCore.Http;

namespace SchoolWayz.Cloud.Web.Controllers
{
    [Route("api/[controller]")]
    public class OrganizationController : BaseController<Organization>
    {
        public OrganizationController(IOptions<AppSettings> settings) : base(settings)
        {

        }
        
        [Route("GetOrg/{id}")]
        public async Task<Organization> GetOrg(string id)
        {
            // Get all the documents from the collection

            Organization org = (await this.repository.WhereAsync(p => p.type.Equals(typeof(Organization).Name)
                                                                 && p.Id.Equals(id)
                                                                 )).AsEnumerable().FirstOrDefault();
            if (org == null)
            {
                return null;
            }
            return org;

        }
        //Image upload to cloude
        [HttpPost]
        [Route("UploadImage/{organizationId}/{orgId}")]
        public async Task UploadImage(string organizationId, string orgId, IFormFile file)
        {
            //foreach (var file in files)
            //{

            if (file == null) throw new Exception("File is null");
            if (file.Length == 0) throw new Exception("File is empty");
            SchoolWayz.Cloud.Helper.IAzureImageHandlerService imageHandler = new SchoolWayz.Cloud.Helper.AzureImageHandlerService();
            await imageHandler.UploadFileToBlob(file, organizationId + "/" + "Photo", orgId);

            //}
        }
        //update organization logo(Image) Name
        [HttpPut]
        [Route("UpdateOrganizationImageName/{organizationid}/{orgId}/{fileExt}")]
        public async Task<IActionResult> UpdateOrganizationImageName(string organizationid, string orgId, string fileExt)
        {
            // Get all the documents from the collection

            Organization organization = (await this.repository.WhereAsync(p => p.type.Equals(typeof(Organization).Name)
                                                                 && p.organizationid.Equals(organizationid)
                                                                  && p.Id.Equals(orgId)
                                                                 )).AsEnumerable().FirstOrDefault();
            if (organization == null)
            {
                return NotFound();
            }
            else
            {
                organization.LogoURL = orgId + "." + fileExt;

            }

            var result = (await this.repository.AddOrUpdateAsync(organization));

            return new ObjectResult(result);

        }

    }
}