namespace SchoolWayz.Cloud.Web.Framework
{
    public class Constants
    {
        public const string OpenIdConnectAuthenticationScheme = "OpenID Connect B2C";

        public const string B2CPolicy = "b2cPolicy";

        public const string AcrClaimType = "http://schemas.microsoft.com/claims/authnclassreference";

        public const string ClaimsObjectIdentifier = "http://schemas.microsoft.com/identity/claims/objectidentifier";

        public const string ClaimsOrganizationId = "jobtitle";

        public const string ClaimsGivenName = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname";

        public const string ClaimsSurName =  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname";

        public const string CacheProtector = "ADB2C_TableTokenCache";
		
    }
    public class StoredProcedureLinks
    {

        public const string SP_Count = "dbs/RqJpAA==/colls/RqJpAM7UUAA=/sprocs/RqJpAM7UUAANAAAAAAAAgA==/";

        public const string usp_GetRoutesCurrentLocation = "dbs/RqJpAA==/colls/RqJpAM7UUAA=/sprocs/RqJpAM7UUAASAAAAAAAAgA==/";



    }
}
