using System;
using System.Threading.Tasks;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Blob;

namespace SchoolWayz.Cloud.Web.Framework
{
    public class StorageHelper
    {

        AppSettings settings;
        public StorageHelper(AppSettings settings)
        {
            this.settings = settings;
        }

        public async Task<string> GetContainerUri(string containername)
        {

            //Parse the connection string and return a reference to the storage account.
            CloudStorageAccount storageAccount = CloudStorageAccount.Parse(settings.azure.storage.TableTokenCacheEndPoint);

            //Create the blob client object.
            CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();

            //Get a reference to a container to use for the sample code, and create it if it does not exist.
            CloudBlobContainer container = blobClient.GetContainerReference(containername);
            await container.CreateIfNotExistsAsync();

            //Return the URI string for the container, including the SAS token.
            return container.Uri.ToString();
        }

        public async Task<string> GetContainerSasToken(string containername)
        {

            //Parse the connection string and return a reference to the storage account.
            CloudStorageAccount storageAccount = CloudStorageAccount.Parse(settings.azure.storage.TableTokenCacheEndPoint);

            //Create the blob client object.
            CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();

            //Get a reference to a container to use for the sample code, and create it if it does not exist.
            CloudBlobContainer container = blobClient.GetContainerReference(containername);
            await container.CreateIfNotExistsAsync();

            //Set the expiry time and permissions for the container.
            //In this case no start time is specified, so the shared access signature becomes valid immediately.
            SharedAccessBlobPolicy sasConstraints = new SharedAccessBlobPolicy();
            sasConstraints.SharedAccessExpiryTime = DateTime.UtcNow.AddHours(settings.azure.storage.SARExpirtyTimeInHours);
            sasConstraints.Permissions = SharedAccessBlobPermissions.Write | SharedAccessBlobPermissions.List | SharedAccessBlobPermissions.Read;

            //Generate the shared access signature on the container, setting the constraints directly on the signature.
            string sasContainerToken = container.GetSharedAccessSignature(sasConstraints);

            //Return the URI string for the container, including the SAS token.
            return sasContainerToken;
        }

    }
}
