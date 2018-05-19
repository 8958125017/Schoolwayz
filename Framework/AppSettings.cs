namespace SchoolWayz.Cloud.Web.Framework
{

    /// <summary>
    /// This class act as accessor for AppSettings defined in appsetings.json
    /// </summary>
    public class AppSettings
    {

        public azure azure { get; set; }
		public tracking tracking { get; set; }

        public AppSettings()
        {
            azure = new azure();
        }
    }

    public class azure
    {
        public documentdb documentdb { get; set; }

        public authentication authentication { get; set; }

		public iothub iothub { get; set; }
        public storage storage { get; set; }

        public azure()
        {
            documentdb = new documentdb();
            authentication = new authentication();
			iothub = new iothub();
            storage = new storage();
        }
    }

    public class documentdb
    {

        public string endpointUrl { get; set; }
        public string authorizationKey { get; set; }
        public string databaseId { get; set; }
        public string collectionName { get; set; }

    }

    public class authentication

    {

        public string Instance { get; set; }

        public string TenantId { get; set; }



        public string Authority => $"{Instance}{TenantId}/v2.0";



        public string Audience { get; set; }

        public string SignInOrSignUpPolicy { get; set; }

        public string PostLogoutRedirectUri { get; set; }

        public string ClientSecret { get; set; }

        public string ClientId { get; set; }

    }
    public class tracking
    {
        public string CutOffTime { get; set; }
    }
    public class iothub
    {
        public string ConnectionString { get; set; }
    }

    public class storage
    {
        public string TableTokenCacheEndPoint { get; set ; }

        public int SARExpirtyTimeInHours { get; set; }
    }

}
