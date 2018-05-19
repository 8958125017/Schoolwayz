using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Mvc;
using SchoolWayz.Cloud.Web.Framework;

using Microsoft.Extensions.Options;

using AspNetCoreSpa.Server.Entities;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;

using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc.Rendering;
using System.Net;
using System.Net.Sockets;
using SchoolWayz.Data.Models.SmartTrack;

namespace SchoolWayz.Cloud.Web.Controllers
{
    // For more information on enabling MVC for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

    public class HomeController : Controller
    {
        //private readonly UserManager<ApplicationUser> _userManager;
        private readonly IHostingEnvironment _env;
        private AppSettings _settings;
        AdminCredentialController signinController;
        LoginDetailController loginDetailController;
        OrganizationController organizationController;
        //SchoolWayz.Data.Models.SmartTrack.AdminCredential _user;
        SchoolWayz.Data.Models.SmartTrack.LoginDetail loginDetail;
        SchoolWayz.Data.Models.SmartTrack.Organization OrganizationDetail;

        /*
        public HomeController(UserManager<ApplicationUser> userManager, IHostingEnvironment env)
        {
            _userManager = userManager;
            _env = env;
        }

        */


        public HomeController(IHostingEnvironment env, IOptions<AppSettings> settings)
        {

            _env = env;
            _settings = settings.Value;
            signinController = new AdminCredentialController(settings);
            loginDetailController = new LoginDetailController(settings);
            organizationController = new OrganizationController(settings);
        }
        [HttpGet]
        [Route("Home/Index")]

        public async Task<IActionResult> Index(SchoolWayz.Data.Models.SmartTrack.AdminCredential user)
        {
            ViewBag.MainDotJs = await GetMainDotJs();
            LoadViewData(user, null, null);
            return View();
        }

        // Becasue for production this is hashed chunk so has changes on each production build
        public async Task<string> GetMainDotJs()
        {
            var basePath = _env.WebRootPath + "//dist//";

            if (_env.IsDevelopment() && !System.IO.File.Exists(basePath + "main.js"))
            {
                // Just a .js request to make it wait to finish webpack dev middleware finish creating bundles:
                // More info here: https://github.com/aspnet/JavaScriptServices/issues/578#issuecomment-272039541
                using (var client = new HttpClient())
                {
                    var requestUri = Request.Scheme + "://" + Request.Host + "/dist/main.js";
                    await client.GetAsync(requestUri);
                }
            }

            var info = new System.IO.DirectoryInfo(basePath);
            var file = info.GetFiles()
                .Where(f => _env.IsDevelopment() ? f.Name == "main.js" : f.Name.StartsWith("main.") && !f.Name.EndsWith("bundle.map"));
            return file.FirstOrDefault().Name;
        }




        public IActionResult Login()
        {
            return View();
        }

        [HttpGet]
        [Route("Home/ForgotPassword")]
        public IActionResult ForgotPassword()
        {
            return View();
        }

        [HttpPost]
        [Route("Home/ForgotPassword")]
        public async Task<IActionResult> ForgotPassword(ForgotPasswordViewModel ForgotPasswordViewModel, string returnUrl = null)
        {
            SchoolWayz.Data.Models.SmartTrack.AdminCredential forgotPasswordcredential = new Data.Models.SmartTrack.AdminCredential();
            forgotPasswordcredential.EmailId = ForgotPasswordViewModel.AuthenticationField;
            //forgotPasswordcredential.PrimaryContact = ForgotPasswordViewModel.PhoneNumber;

            SchoolWayz.Data.Models.SmartTrack.AdminCredential userPassword = await signinController.ForgotPassword(forgotPasswordcredential);

            if (userPassword != null)
            {
                // Check if 
                // Add code to validate user , and send error message if not successfull to the control
                // Also add the variable to localstorage for currentuser 


                //ViewBag.MainDotJs = await GetMainDotJs();
                this.ModelState.AddModelError(string.Empty, "New Password Has bean Sent To Your Email Id");
                return View("Login");
            }

            this.ModelState.AddModelError(string.Empty, "Invalid EmailId or Phone Number.");
            return View("ForgotPassword", ForgotPasswordViewModel);
        }


        [HttpPost]
        [Route("Home/SignIn")]
        public async Task<IActionResult> SignIn(LoginViewModel model, string returnUrl = null)
        {
            SchoolWayz.Data.Models.SmartTrack.AdminCredential credential = new Data.Models.SmartTrack.AdminCredential();
            credential.UserName = model.Username;
            credential.Password = model.Password;


            SchoolWayz.Data.Models.SmartTrack.AdminCredential user = await signinController.Admin(credential);

            if (user != null)
            {
                // Check if 
                // Add code to validate user , and send error message if not successfull to the control
                // Also add the variable to localstorage for currentuser 
                //loginDetail = await loginDetailController.LastLogin(user.organizationid, user.Id);
                OrganizationDetail = await organizationController.GetOrg(user.organizationid);
                ViewBag.MainDotJs = await GetMainDotJs();
                LoadViewData(user, OrganizationDetail, loginDetail);
                return View("Index");
            }

            this.ModelState.AddModelError(string.Empty, "Invalid UserName or Password, Login Failed.");
            return View("Login", model);

        }


        private async void LoadViewData(SchoolWayz.Data.Models.SmartTrack.AdminCredential user, Organization organization, LoginDetail loginDetail)
        {
            LoginDetail currentLogin = new LoginDetail();
            // Get The Auth Token for User 
            //ViewData["AuthToken"] = await GetAccessTokenAsync();
            //string organizationid = User.FindFirst(Constants.ClaimsOrganizationId).Value;
            ViewData["OrganizationId"] = user.organizationid;
            ViewData["GivenName"] = user.FirstName;
            ViewData["SurName"] = user.LastName;
            ViewData["ObjectIdentifier"] = user.Id;
            ViewData["ImgUrl"] = user.ImgUrl;
            ViewData["LogoUrl"] = organization.LogoURL;
            ViewData["LastLogin"] = DateTime.Now;
            ViewData["UserId"] = user.UserId;

            if (loginDetail != null)
            {
                ViewData["LastLogin"] = loginDetail.LastLogin;
            }
            currentLogin.FirstName = user.FirstName;
            currentLogin.LastName = user.LastName;
            currentLogin.UserId = user.Id;
            currentLogin.organizationid = user.organizationid;
            currentLogin.LastLogin = DateTime.Now;
            // Get the cotainser SAS token for organizationid
            //ViewData["ContainerSasToken"] = await storageHelper.GetContainerSasToken(organizationid);
            //ViewData["ContainerUri"] = await storageHelper.GetContainerUri(organizationid);
            string localIP;
            using (Socket socket = new Socket(AddressFamily.InterNetwork, SocketType.Dgram, 0))
            {
                socket.Connect("8.8.8.8", 65530);
                IPEndPoint endPoint = socket.LocalEndPoint as IPEndPoint;
                localIP = endPoint.Address.ToString();
            }
            currentLogin.IpAddress = localIP;
            await loginDetailController.Post(currentLogin);

        }
    }

    public class LoginViewModel
    {
        [Required]
        [Display(Name = "Username")]
        [DataType(DataType.Text)]
        public string Username { get; set; }

        [Required]
        [DataType(DataType.Password)]
        [Display(Name = "Password")]
        public string Password { get; set; }
    }
    public class ForgotPasswordViewModel
    {
        [Required]
        [Display(Name = "AuthenticationField")]
        [DataType(DataType.Text)]
        public string AuthenticationField { get; set; }        
    }
}





