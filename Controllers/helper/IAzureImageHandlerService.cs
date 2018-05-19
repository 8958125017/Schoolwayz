using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;

namespace SchoolWayz.Cloud.Helper
{
    public interface IAzureImageHandlerService
    {
        Task<string> UploadFileToBlob(IFormFile file,string blobContainerName, string fileName);
        Task<bool> RemoveFileFromBlob(string blobContainerName, string fileName);
    }
}