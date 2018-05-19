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

namespace SchoolWayz.Cloud.Service.Controllers
{
    [Route("api/Patron")]
    public class PatronController : BaseController<SchoolWayz.Data.Models.SmartTrack.Patron>
    {



        public PatronController(IOptions<AppSettings> settings) : base(settings)
        {

        }
        // Get All Patron Tracking Data for a specific day for an Organization 

        [Route("GetAll/{organizationid}/{date}")]
        public async Task<IActionResult> GetAll(string organizationid, string date)
        {
            // Get all the documents from the collection

            var result = (await this.repository.WhereAsync(p => p.type.Equals(typeof(Patron).Name)
                                                                 && p.organizationid.Equals(organizationid)
                                                                 )).AsEnumerable();
            if (result == null)
            {
                return NotFound();
            }
            return new ObjectResult(result);

        }



        [Route("GetAll/{organizationid}/{classid}/{sectionid}/{date}")]
        public async Task<IActionResult> GetAll(string organizationid, string classid, string sectionid, string date)
        {
            // Get all the documents from the collection

            var result = (await this.repository.WhereAsync(p => p.type.Equals(typeof(Patron).Name)
                                                                && p.organizationid.Equals(organizationid)
                                                                && p.Class == Int32.Parse(classid)
                                                                && p.Section.Equals(sectionid)
                                                               )).AsEnumerable().OrderBy( x => x.RollNo);
            if (result == null)
            {
                return NotFound();
            }
            return new ObjectResult(result);

        }
        [Route("ClassPatron/{organizationid}/{classid}")]
        public async Task<IActionResult> ClassPatron(string organizationid, string classid)
        {
            // Get all the documents from the collection

            var result = (await this.repository.WhereAsync(p => p.type.Equals(typeof(Patron).Name)
                                                                && p.organizationid.Equals(organizationid)
                                                                && p.Class == Int32.Parse(classid)                                                               
                                                               )).AsEnumerable();
            if (result == null)
            {
                return NotFound();
            }
            return new ObjectResult(result);

        }

        [Route("GetPerson/{organizationid}/{patronId}")]
        public async Task<IActionResult> GetPerson(string organizationid, string patronId)
        {
            // Get all the documents from the collection

            var result = (await this.repository.WhereAsync(p => p.type.Equals(typeof(Patron).Name)
                                                                 && p.organizationid.Equals(organizationid)
                                                                  && p.Id.Equals(patronId)
                                                                 )).AsEnumerable();
            if (result == null)
            {
                return NotFound();
            }
            return new ObjectResult(result);

        }

        [Route("EditPerson/{organizationid}/{patronId}/{personId}")]
        public async Task<IActionResult> EditPerson(string organizationid, string patronId,string personId)
        {
            // Get all the documents from the collection

            var result = (await this.repository.WhereAsync(p => p.type.Equals(typeof(Patron).Name)
                                                                 && p.organizationid.Equals(organizationid)
                                                                  && p.Id.Equals(patronId)                                                                 
                                                                 )).AsEnumerable().SelectMany(x => x.Persons).Where( x => x.Id.Equals(personId));
            if (result == null)
            {
                return NotFound();
            }
            return new ObjectResult(result);

        }
       


        [Route("EditAuth/{organizationid}/{patronId}/{personId}")]
        public async Task<IActionResult> EditAuth(string organizationid, string patronId, string personId)
        {
            // Get all the documents from the collection

            var result = (await this.repository.WhereAsync(p => p.type.Equals(typeof(Patron).Name)
                                                                 && p.organizationid.Equals(organizationid)
                                                                  && p.Id.Equals(patronId)
                                                                 )).AsEnumerable().SelectMany(x => x.Authentications).Where(x => x.Id.Equals(personId));
            if (result == null)
            {
                return NotFound();
            }
            return new ObjectResult(result);

        }

        [Route("UpdatePerson/{organizationid}/{patronId}/{personId}")]
        public async Task<IActionResult> UpdatePerson(string organizationid, string patronId, string personId, [FromBody]Patron value)
        {
            // Get all the documents from the collection

            var result = (await this.repository.AddOrUpdateAsync(value));


            //var result = (await this.repository.WhereAsync(p => p.type.Equals(typeof(Patron).Name)
            //                                                     && p.organizationid.Equals(organizationid)
            //                                                      && p.Id.Equals(patronId)
            //                                                     )).AsEnumerable().SelectMany(x => x.Authentications).Where(x => x.Id.Equals(personId));
            if (result == null)
            {
                return NotFound();
            }
            return new ObjectResult(result);

        }
        [HttpPut]
        [Route("AddPerson/{organizationid}/{patronId}")]
        public async Task<IActionResult> AddPerson(string organizationid, string patronId, [FromBody]Person value)
        {

            // If the patronid, stoppageid or organization id is not valid
            if (value == null ||
                 patronId == null ||
                 patronId.Length == 0 ||
                 organizationid == null ||
                 organizationid.Length == 0
                )
            {
                return BadRequest();
            }


            // Get the route document

            Patron patron = (await this.repository.WhereAsync(p => p.type.Equals(typeof(Patron).Name)
                                                              && p.organizationid.Equals(organizationid)
                                                              && p.Id.Equals(patronId))).AsEnumerable().FirstOrDefault();


            // Check if the Stoppage already exist for route
            Person person = patron.Persons.Find(p => p.Id == value.Id);
            if (person != null)
            {
                // remove the existing and add the supplied
                patron.Persons.Remove(person);

            }

            // Add the new value
            patron.Persons.Add(value);



            var result = (await this.repository.AddOrUpdateAsync(patron));

            return new ObjectResult(result);
            //// Add the new value
            //patron.Persons.Add(value);



            //var result = (await this.repository.AddOrUpdateAsync(patron));

            //Person recentAddedPerson = result.Persons.OrderByDescending(x => x.createdate).FirstOrDefault();

            //return new ObjectResult(recentAddedPerson);
        }



        [HttpPut]
        [Route("RemovePerson/{organizationid}/{patronId}/{personid}")]
        public async Task<IActionResult> RemovePerson(string organizationid, string patronId, string personid)
        {

            // If the patronid, stoppageid or organization id is not valid
            if (patronId == null ||
                 patronId.Length == 0 ||
                 organizationid == null ||
                 organizationid.Length == 0 ||
                 personid == null ||
                 personid.Length == 0
                )
            {
                return BadRequest();
            }


            // Get the route document

            Patron patron = (await this.repository.WhereAsync(p => p.type.Equals(typeof(Patron).Name)
                                                              && p.organizationid.Equals(organizationid)
                                                              && p.Id.Equals(patronId))).AsEnumerable().FirstOrDefault();

            // Get The Stoppage Object 
            Person person = patron.Persons.Find(p => p.Id == personid);


            if (person != null)
            {
                // Remove the stoppage from the route
                patron.Persons.Remove(person);

            }

            // Update the document

            var result = (await this.repository.AddOrUpdateAsync(patron));

            return new OkResult();
        }

        [HttpPut]
        [Route("AddAuth/{organizationid}/{patronId}")]
        public async Task<IActionResult> AddAuth(string organizationid, string patronId, [FromBody]Authentication value)
        {

            // If the patronid, stoppageid or organization id is not valid
            if (value == null ||
                 patronId == null ||
                 patronId.Length == 0 ||
                 organizationid == null ||
                 organizationid.Length == 0
                )
            {
                return BadRequest();
            }


            // Get the route document

            Patron patron = (await this.repository.WhereAsync(p => p.type.Equals(typeof(Patron).Name)
                                                              && p.organizationid.Equals(organizationid)
                                                              && p.Id.Equals(patronId))).AsEnumerable().FirstOrDefault();


            // Check if the Stoppage already exist for route
            Authentication auth = patron.Authentications.Find(p => p.Id == value.Id);
            if (auth != null)
            {
                // remove the existing and add the supplied
                patron.Authentications.Remove(auth);

            }

            // Add the new value
            patron.Authentications.Add(value);
            var result = (await this.repository.AddOrUpdateAsync(patron));
            return new ObjectResult(result);

        }

        [HttpPut]
        [Route("RemoveAuth/{organizationid}/{patronId}/{authId}")]
        public async Task<IActionResult> RemoveAuth(string organizationid, string patronId, string authId)
        {

            // If the patronid, stoppageid or organization id is not valid
            if (patronId == null ||
                 patronId.Length == 0 ||
                 organizationid == null ||
                 organizationid.Length == 0 ||
                 authId == null ||
                 authId.Length == 0
                )
            {
                return BadRequest();
            }


            // Get the route document

            Patron patron = (await this.repository.WhereAsync(p => p.type.Equals(typeof(Patron).Name)
                                                              && p.organizationid.Equals(organizationid)
                                                              && p.Id.Equals(patronId))).AsEnumerable().FirstOrDefault();

            // Get The Stoppage Object 
            Authentication auth = patron.Authentications.Find(p => p.Id == authId);


            if (auth != null)
            {
                // Remove the stoppage from the route
                patron.Authentications.Remove(auth);

            }

            // Update the document

            var result = (await this.repository.AddOrUpdateAsync(patron));

            return new OkResult();
        }
        [HttpPut]
        [Route("UpdateTransport/{organizationid}/{routeId}/{stoppageId}/{patronId}")]
        public async Task<IActionResult> UpdateTransport(string organizationid,string routeId,string stoppageId, string patronId)
        {
            // Get all the documents from the collection

            Patron patron = (await this.repository.WhereAsync(p => p.type.Equals(typeof(Patron).Name)
                                                                 && p.organizationid.Equals(organizationid)
                                                                  && p.Id.Equals(patronId)
                                                                 )).AsEnumerable().FirstOrDefault();
            if (patron == null)
            {
                return NotFound();
            }
            else {
                if (patron.TransportRouteId != null) {
                    patron.TransportRouteId=null;
                    patron.StoppageId = null;
                }
                patron.TransportRouteId = routeId;
                patron.StoppageId = stoppageId;
            }

            var result = (await this.repository.AddOrUpdateAsync(patron));

            return new ObjectResult(result);

        }
        [HttpPut]
        [Route("RemoveTransport/{organizationid}/{patronId}")]
        public async Task<IActionResult> RemoveTransport(string organizationid, string patronId)
        {
            // Get all the documents from the collection

            Patron patron = (await this.repository.WhereAsync(p => p.type.Equals(typeof(Patron).Name)
                                                                 && p.organizationid.Equals(organizationid)
                                                                  && p.Id.Equals(patronId)
                                                                 )).AsEnumerable().FirstOrDefault();
            if (patron == null)
            {
                return NotFound();
            }
            else
            {
                if (patron.TransportRouteId != null)
                {
                    patron.TransportRouteId = null;
                    patron.StoppageId = null;
                }
              
            }

            var result = (await this.repository.AddOrUpdateAsync(patron));

            return new ObjectResult(result);

        }

        [Route("GetTransportPatron/{organizationid}")]
        public async Task<IActionResult> GetTransportPatron(string organizationid)
        {
            // Get all the documents from the collection

            var result = (await this.repository.WhereAsync(p => p.type.Equals(typeof(Patron).Name)
                                                                 && p.organizationid.Equals(organizationid)
                                                                 && p.TransportRouteId != null
                                                                 )).AsEnumerable();
            if (result == null)
            {
                return NotFound();
            }
            return new ObjectResult(result);

        }
        //Create patron and get patron Id 
        [HttpPost]
        [Route("GetSavedId")]
        public async Task<IActionResult> GetSavedId([FromBody]Patron value)
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
        [Route("UploadImage/{organizationId}/{patronId}")]
        public async Task UploadImage(string organizationId, string patronId, IFormFile file)
        {
            //foreach (var file in files)
            //{
            
                if (file == null) throw new Exception("File is null");
                if (file.Length == 0) throw new Exception("File is empty");
                SchoolWayz.Cloud.Helper.IAzureImageHandlerService imageHandler = new SchoolWayz.Cloud.Helper.AzureImageHandlerService();
                await imageHandler.UploadFileToBlob(file, organizationId+"/"+"Photo", patronId);

            //}
        }
        [HttpPut]
        [Route("UpdatePatronImageName/{organizationid}/{patronId}/{fileExt}")]
        public async Task<IActionResult> UpdatePatronImageName(string organizationid, string patronId, string fileExt)
        {
            // Get all the documents from the collection

            Patron patron = (await this.repository.WhereAsync(p => p.type.Equals(typeof(Patron).Name)
                                                                 && p.organizationid.Equals(organizationid)
                                                                  && p.Id.Equals(patronId)
                                                                 )).AsEnumerable().FirstOrDefault();
            if (patron == null)
            {
                return NotFound();
            }
            else
            {
                patron.ImgUrl = patronId + "." + fileExt;

            }

            var result = (await this.repository.AddOrUpdateAsync(patron));

            return new ObjectResult(result);

        }
        //Image upload
        [HttpPut]
        [Route("RemoveImage/{organizationId}/{fileName}")]
        public async Task RemoveImage(string organizationId, string fileName)
        {
            //foreach (var file in files)
            //{

            if (fileName == null) throw new Exception("File is null");
            if (fileName.Length == 0) throw new Exception("File is empty");
            SchoolWayz.Cloud.Helper.IAzureImageHandlerService imageHandler = new SchoolWayz.Cloud.Helper.AzureImageHandlerService();
            await imageHandler.RemoveFileFromBlob(organizationId + "/" + "Photo", fileName);

            //}
        }
       
        [Route("IsStudentExistInClass/{organizationid}/{classid}/{sectionid}")]
        public async Task<IActionResult> IsStudentExistInClass(string organizationid, string classid, string sectionid)
        {
            // Get all the documents from the collection

            var result = (await this.repository.WhereAsync(p => p.type.Equals(typeof(Patron).Name)
                                                                && p.organizationid.Equals(organizationid)
                                                                && p.Class == Int32.Parse(classid)
                                                                && p.Section.Equals(sectionid)
                                                               )).AsEnumerable();
            if (result == null)
            {
                return NotFound();
            }
            return new ObjectResult(result);

        }



        //Image upload
        [HttpPost]
        [Route("UploadPatronContactPersonImage/{organizationId}/{patronContactPersonId}")]
        public async Task UploadPatronContactPersonImage(string organizationId, string patronContactPersonId, IFormFile file)
        {
            //foreach (var file in files)
            //{

            if (file == null) throw new Exception("File is null");
            if (file.Length == 0) throw new Exception("File is empty");
            SchoolWayz.Cloud.Helper.IAzureImageHandlerService imageHandler = new SchoolWayz.Cloud.Helper.AzureImageHandlerService();
            await imageHandler.UploadFileToBlob(file, organizationId + "/" + "Photo", patronContactPersonId);

            //}
        }
        [HttpPut]
        [Route("UpdatePatronContactPersonImageName/{organizationid}/{patronId}/{patronContactPersonId}/{fileExt}")]
        public async Task<IActionResult> updatePatronContactPersonImageName(string organizationid, string patronId,string patronContactPersonId, string fileExt)
        {
           
            Patron patron = (await repository.WhereAsync(p => p.type.Equals(typeof(Patron).Name)
                                                                 && p.organizationid.Equals(organizationid)
                                                                  && p.Id.Equals(patronId)
                                                                 )).AsEnumerable().FirstOrDefault();
            Person person = patron.Persons.Find(x => x.Id == patronContactPersonId);
            if (person == null)
            {
                return NotFound();
            }
            else
            {
                person.ImgUrl = patronContactPersonId + "." + fileExt;

            }

            var result = (await this.repository.AddOrUpdateAsync(patron));

            return new ObjectResult(result);

        }

    }
}
