using System.Threading.Tasks;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Blob;
using Microsoft.AspNetCore.Http;

namespace SchoolWayz.Cloud.Helper
{
    public class AzureImageHandlerService : IAzureImageHandlerService
    {
        string storageConnectionString = "DefaultEndpointsProtocol=https;AccountName=devschoolwayzdatastorage;AccountKey=4+z+7pEC7FQJNEe+UIX+4PRDrqaHWTTDeTXaGOPPqnZGKJRTpi0IDaHhgZLKviC+5HQZKo1H5ZQzMmllIRZjdg==;EndpointSuffix=core.windows.net";
        public async Task<string> UploadFileToBlob(IFormFile file,  string blobContainerName, string fileName)
        {
            CloudStorageAccount storageAccount = CloudStorageAccount.Parse
                (storageConnectionString);

            // Create a blob client.
            CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();

            // Get a reference to a container 
            CloudBlobContainer container = blobClient.GetContainerReference(blobContainerName);

            // If container doesn’t exist, create it.
            //await container.CreateIfNotExistsAsync(BlobContainerPublicAccessType.Blob, null, null);

            // Get a reference to a blob 
            CloudBlockBlob blockBlob = container.GetBlockBlobReference(fileName);

           

            // Create or overwrite the blob with the contents of a local file
            using (var fileStream = file.OpenReadStream())
            {
                await blockBlob.UploadFromStreamAsync(fileStream);
            }

            return blockBlob.Uri.AbsoluteUri;
        }

        public async Task<bool> RemoveFileFromBlob(string blobContainerName, string fileName)
        {
            CloudStorageAccount storageAccount = CloudStorageAccount.Parse(storageConnectionString);

            // Create a blob client.
            CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();

            // Get a reference to a container 
            CloudBlobContainer container = blobClient.GetContainerReference(blobContainerName);

            // If container doesn’t exist, create it.
            await container.CreateIfNotExistsAsync(BlobContainerPublicAccessType.Blob, null, null);

            // Get a reference to a blob 
            CloudBlockBlob blockBlob = container.GetBlockBlobReference(fileName);

            // Delete the blob if it is existing
            return await blockBlob.DeleteIfExistsAsync();            
        }
    }
}
