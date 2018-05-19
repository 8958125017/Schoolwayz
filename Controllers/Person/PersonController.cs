using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using SchoolWayz.Cloud.Web.Framework;
using SchoolWayz.Data.Models.SmartTrack;
using Microsoft.Extensions.Options;
using Microsoft.AspNetCore.Http;
// For more information on enabling Web API for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace SchoolWayz.Cloud.Web.Controllers
{
    [Route("api/[controller]")]
    public class PersonController : BaseController<Person>
    {
        public PersonController(IOptions<AppSettings> settings) : base(settings)
        {

        }
        [Route("GetPerson/{organizationid}/{personId}")]
        public async Task<IActionResult> GetPerson(string organizationid, string personId)
        {
            // Get all the documents from the collection

            var result = (await this.repository.WhereAsync(p => p.type.Equals(typeof(Person).Name)
                                                                 && p.organizationid.Equals(organizationid)
                                                                  && p.Id.Equals(personId)
                                                                 )).AsEnumerable();
            if (result == null)
            {
                return NotFound();
            }
            return new ObjectResult(result);

        }
        [Route("EditPerson/{organizationid}/{personViewId}/{personId}")]
        public async Task<IActionResult> EditPerson(string organizationid, string personViewId, string personId)
        {
            // Get all the documents from the collection

            var result = (await this.repository.WhereAsync(p => p.type.Equals(typeof(Person).Name)
                                                                 && p.organizationid.Equals(organizationid)
                                                                  && p.Id.Equals(personViewId)
                                                                 )).AsEnumerable().SelectMany(x => x.PersonObj).Where(x => x.Id.Equals(personId));
            if (result == null)
            {
                return NotFound();
            }
            return new ObjectResult(result);

        }
        [HttpPut]
        [Route("AddPerson/{organizationid}/{personId}")]
        public async Task<IActionResult> AddPerson(string organizationid, string personId, [FromBody]Person value)
        {

            // If the patronid, stoppageid or organization id is not valid
            if (value == null ||
                 personId == null ||
                 personId.Length == 0 ||
                 organizationid == null ||
                 organizationid.Length == 0
                )
            {
                return BadRequest();
            }


            // Get the route document

            Person person = (await this.repository.WhereAsync(p => p.type.Equals(typeof(Person).Name)
                                                              && p.organizationid.Equals(organizationid)
                                                              && p.Id.Equals(personId))).AsEnumerable().FirstOrDefault();


            // Check if the Stoppage already exist for route
            Person personObj = person.PersonObj.Find(p => p.Id == value.Id);
            if (personObj != null)
            {
                // remove the existing and add the supplied
                person.PersonObj.Remove(personObj);

            }

            // Add the new value
            person.PersonObj.Add(value);



            var result = (await this.repository.AddOrUpdateAsync(person));

            return new  ObjectResult(result);
        }



        [HttpPut]
        [Route("RemovePerson/{organizationid}/{personId}/{personObjId}")]
        public async Task<IActionResult> RemovePerson(string organizationid, string personId, string personObjId)
        {

            // If the patronid, stoppageid or organization id is not valid
            if (personId == null ||
                 personId.Length == 0 ||
                 organizationid == null ||
                 organizationid.Length == 0 ||
                 personObjId == null ||
                 personObjId.Length == 0
                )
            {
                return BadRequest();
            }


            // Get the route document

            Person person = (await this.repository.WhereAsync(p => p.type.Equals(typeof(Person).Name)
                                                              && p.organizationid.Equals(organizationid)
                                                              && p.Id.Equals(personId))).AsEnumerable().FirstOrDefault();

            // Get The Stoppage Object 
            Person personObj = person.PersonObj.Find(p => p.Id == personObjId);


            if (person != null)
            {
                // Remove the stoppage from the route
                person.PersonObj.Remove(personObj);

            }

            // Update the document

            var result = (await this.repository.AddOrUpdateAsync(person));

            return new OkResult();
        }

        [HttpPut]
        [Route("AddAuth/{organizationid}/{personId}")]
        public async Task<IActionResult> AddAuth(string organizationid, string personId, [FromBody]Authentication value)
        {

            // If the patronid, stoppageid or organization id is not valid
            if (value == null ||
                 personId == null ||
                 personId.Length == 0 ||
                 organizationid == null ||
                 organizationid.Length == 0
                )
            {
                return BadRequest();
            }


            // Get the route document

            Person person = (await this.repository.WhereAsync(p => p.type.Equals(typeof(Person).Name)
                                                              && p.organizationid.Equals(organizationid)
                                                              && p.Id.Equals(personId))).AsEnumerable().FirstOrDefault();


            // Check if the Stoppage already exist for route
            Authentication auth = person.Authentications.Find(p => p.Id == value.Id);
            if (auth != null)
            {
                // remove the existing and add the supplied
                person.Authentications.Remove(auth);

            }

            // Add the new value
            person.Authentications.Add(value);



            var result = (await this.repository.AddOrUpdateAsync(person));

            return new  ObjectResult(result);
        }



        [HttpPut]
        [Route("RemoveAuth/{organizationid}/{personId}/{authId}")]
        public async Task<IActionResult> RemoveAuth(string organizationid, string personId, string authId)
        {

            // If the patronid, stoppageid or organization id is not valid
            if (personId == null ||
                 personId.Length == 0 ||
                 organizationid == null ||
                 organizationid.Length == 0 ||
                 authId == null ||
                 authId.Length == 0
                )
            {
                return BadRequest();
            }


            // Get the route document

            Person person = (await this.repository.WhereAsync(p => p.type.Equals(typeof(Person).Name)
                                                              && p.organizationid.Equals(organizationid)
                                                              && p.Id.Equals(personId))).AsEnumerable().FirstOrDefault();

            // Get The Stoppage Object 
            Authentication auth = person.Authentications.Find(p => p.Id == authId);


            if (auth != null)
            {
                // Remove the stoppage from the route
                person.Authentications.Remove(auth);

            }

            // Update the document

            var result = (await this.repository.AddOrUpdateAsync(person));

            return new OkResult();
        }
        [Route("EditAuth/{organizationid}/{personId}/{authId}")]
        public async Task<IActionResult> EditAuth(string organizationid, string personId, string authId)
        {
            // Get all the documents from the collection

            var result = (await this.repository.WhereAsync(p => p.type.Equals(typeof(Person).Name)
                                                                 && p.organizationid.Equals(organizationid)
                                                                  && p.Id.Equals(personId)
                                                                 )).AsEnumerable().SelectMany(x => x.Authentications).Where(x => x.Id.Equals(authId));
            if (result == null)
            {
                return NotFound();
            }
            return new ObjectResult(result);

        }

        //Create patron and get patron Id 
        [HttpPost]
        [Route("GetSavedId")]
        public async Task<IActionResult> GetSavedId([FromBody]Person value)
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

        //Image upload
        [HttpPost]
        [Route("UploadImage/{organizationId}/{personId}")]
        public async Task UploadImage(string organizationId, string personId, IFormFile file)
        {
            //foreach (var file in files)
            //{

            if (file == null) throw new Exception("File is null");
            if (file.Length == 0) throw new Exception("File is empty");
            SchoolWayz.Cloud.Helper.IAzureImageHandlerService imageHandler = new SchoolWayz.Cloud.Helper.AzureImageHandlerService();
            await imageHandler.UploadFileToBlob(file, organizationId + "/" + "Photo", personId);

            //}
        }
        [HttpPut]
        [Route("UpdatePersonImageName/{organizationid}/{personId}/{fileExt}")]
        public async Task<IActionResult> UpdatePersonImageName(string organizationid, string personId, string fileExt)
        {
            // Get all the documents from the collection

            Person person = (await this.repository.WhereAsync(p => p.type.Equals(typeof(Person).Name)
                                                                 && p.organizationid.Equals(organizationid)
                                                                  && p.Id.Equals(personId)
                                                                 )).AsEnumerable().FirstOrDefault();
            if (person == null)
            {
                return NotFound();
            }
            else
            {
                person.ImgUrl = personId + "." + fileExt;

            }

            var result = (await this.repository.AddOrUpdateAsync(person));

            return new ObjectResult(result);

        }
        //Image upload
        [HttpPost]
        [Route("UploadPersonContactPersonImage/{organizationId}/{personContactPersonId}")]
        public async Task UploadPersonContactPersonImage(string organizationId, string personContactPersonId, IFormFile file)
        {
            //foreach (var file in files)
            //{

            if (file == null) throw new Exception("File is null");
            if (file.Length == 0) throw new Exception("File is empty");
            SchoolWayz.Cloud.Helper.IAzureImageHandlerService imageHandler = new SchoolWayz.Cloud.Helper.AzureImageHandlerService();
            await imageHandler.UploadFileToBlob(file, organizationId + "/" + "Photo", personContactPersonId);

            //}
        }

        [HttpPut]
        [Route("UpdatePersonContactPersonImageName/{organizationid}/{personId}/{personContactPersonId}/{fileExt}")]
        public async Task<IActionResult> updatePatronContactPersonImageName(string organizationid, string personId, string personContactPersonId, string fileExt)
        {

            Person person = (await repository.WhereAsync(p => p.type.Equals(typeof(Person).Name)
                                                                 && p.organizationid.Equals(organizationid)
                                                                  && p.Id.Equals(personId)
                                                                 )).AsEnumerable().FirstOrDefault();
            Person per = person.PersonObj.Find(x => x.Id == personContactPersonId);
            if (person == null)
            {
                return NotFound();
            }
            else
            {
                per.ImgUrl= personContactPersonId + "." + fileExt;

            }

            var result = (await this.repository.AddOrUpdateAsync(person));

            return new ObjectResult(result);

        }
    }
}
