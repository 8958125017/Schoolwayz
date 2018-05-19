using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using SchoolWayz.Data.Framework.DocumentDB;
using SchoolWayz.Data.Models;
using Microsoft.Extensions.Options;
using Microsoft.Azure.Documents.Client.TransientFaultHandling;
// For more information on enabling Web API for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860
using SchoolWayz.Data.Models.SmartTrack;
using Microsoft.AspNetCore.Cors;
namespace SchoolWayz.Cloud.Web.Framework
{
    /// <summary>
    /// Base Class for all Web API Controllers
    /// </summary>

    //[Authorize]
    [EnableCors("CorsPolicy")]
    public class BaseController<T> : Controller where T : BaseModel
    {
        public static IReliableReadWriteDocumentClient Client { get; set; }
        private IDocumentDbInitializer init;
        public DocumentDbRepository<T> repository;
        //Use this class to access appsettings defined in appsettings.json file
        public static AppSettings AppSettings { get; set; }

        public string collectionName;

        // For the collection Name
        public static string GetCollectionName()
        {
            return AppSettings.azure.documentdb.collectionName;
        }

        public Func<string> collectionNameFunc = GetCollectionName;


        /// <summary>
        /// Default constructor
        /// </summary>
        public BaseController(IOptions<AppSettings> settings)
        {

            AppSettings = settings.Value;



            collectionName = AppSettings.azure.documentdb.collectionName;

            init = new DocumentDbInitializer();
            // get the Azure DocumentDB client
            Client = init.GetClient(AppSettings.azure.documentdb.endpointUrl, AppSettings.azure.documentdb.authorizationKey);
            // prepare the repository
            repository = new DocumentDbRepository<T>(Client, AppSettings.azure.documentdb.databaseId, collectionNameFunc, null);

        }


        // Base Crud Operations for all controllers
        // These operations assume every Data class has minimum two properties by convention
        // id : the unique identifier of a document
        // type : type of the document

        #region Get Operations 

        // GET: api/values
        [HttpGet("{organizationid}/{id}")]
        public async Task<IActionResult> Get(string organizationid, string id)
        {
            // Get all the documents from the collection

            // If the  id or organization id is not valid
            if (id == null || id.Length == 0 || organizationid == null || organizationid.Length == 0 )
            {
                return BadRequest();
            }

            var result = (await this.repository.WhereAsync(p => p.type.Equals(typeof(T).Name)
                                                                && p.organizationid.Equals(organizationid)
                                                                && p.Id.Equals(id))).AsEnumerable().FirstOrDefault();
            if (result == null)
            {
                return NotFound();
            }
            return new OkObjectResult(result);

        }

        // Get: api
        [HttpGet("{organizationid}")]
        public async Task<IActionResult> Get(string organizationid)
        {
            // Get all the documents from the collection
            if (organizationid == null || organizationid.Length == 0 )
            {
                return BadRequest();
            }


            List<T> result = (await this.repository.WhereAsync(p => p.type.Equals(typeof(T).Name)
                                                              && p.organizationid.Equals(organizationid))).ToList<T>();
            return new OkObjectResult(result);

        }

        #endregion

        #region Post Operations


        // POST api/values

        [HttpPost]
        public async Task<IActionResult> Post([FromBody]T value)
        {
            if (value == null || value.organizationid == null || value.organizationid.Length == 0 )
            {
                return BadRequest();
            }

            var result = (await this.repository.AddOrUpdateAsync(value));

            //return CreatedAtRoute("DefaultApi", new { organizationid = result.organizationid, id = result.Id }, result);
            return new NoContentResult();
        }

        #endregion


        #region PUT Operations

        [HttpPut("{organizationid}/{id}")]
        public async Task<IActionResult> Put(string organizationid, string id, [FromBody]T value)
        {

            // If the value, id or organization id is not valid
            if (value == null || id == null || id.Length == 0 || organizationid == null || organizationid.Length == 0 )
            {
                return BadRequest();
            }


            var result = (await this.repository.AddOrUpdateAsync(value));
            return new NoContentResult();
        }



        #endregion

        #region Delete Operations
        [HttpDelete("{organizationid}/{id}")]
        public async Task<IActionResult> Delete(string organizationid, string id)
        {
            // If the value, id or organization id is not valid
            if (id == null || id.Length == 0 || organizationid == null || organizationid.Length == 0 )
            {
                return BadRequest();
            }


            // Check if the Object don't exist for organizationid and id
            var result = (await this.repository.WhereAsync(p => p.type.Equals(typeof(T).Name)
                                                                && p.organizationid.Equals(organizationid)
                                                                && p.Id.Equals(id))).AsEnumerable().FirstOrDefault();

            if (result == null)
            {
                return BadRequest();
            }

            var resultDel = (await this.repository.RemoveAsync(id));
            return new NoContentResult();

        }

        #endregion 

        protected async Task<bool> IsValidOrganizationID(string organizationid)
        {


            var result = (await this.repository.WhereAsync(p => p.type.Equals(typeof(Organization).Name)
                                                                && p.Id.Equals(organizationid))).AsEnumerable().FirstOrDefault();
            if (result == null)
            {
                return false;
            }
            else
            {
                return true;
            }


        }

    }
}
