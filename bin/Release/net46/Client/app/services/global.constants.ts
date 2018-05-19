import * as moment from 'moment';

export class AppSettings {
    public static ORGANIZATION_ID = localStorage.getItem("OrganizationId");
    public static ADMIN_NAME = localStorage.getItem("GivenName") + " " + localStorage.getItem("SurName");   
    public static ADMIN_IMAGE = localStorage.getItem("ImgUrl");
    public static ORGANIZATION_lOGO = localStorage.getItem("LogoUrl");
    public static LAST_LOGIN = localStorage.getItem("LastLogin");
    public static ADMIN_ID = localStorage.getItem("UserId");
    public static API_ENDPOINT = 'http://localhost:5000/api/';
    public static IMAGE_ENDPOINT = 'https://devschoolwayzdatastorage.blob.core.windows.net/b077007f-6e64-4074-bd2b-c9500d89bef8/Photo/';
    public static STOPPAGE_IMAGE = AppSettings.IMAGE_ENDPOINT + 'stop.png';
    public static CHECK_IMAGE = AppSettings.IMAGE_ENDPOINT + 'check.png';
    public static UNCHECK_IMAGE = AppSettings.IMAGE_ENDPOINT + 'uncheck.png';
    public static CURRENT_DATE = moment(new Date()).format('YYYY-MM-DD');
    public static CURRENT_TIME = moment(new Date()).format('HH:mm');
    public static SELECTED_YEAR = moment(new Date()).format('YYYY');
    public static SCHOOL_IMAGE = AppSettings.IMAGE_ENDPOINT +'school.png';
    public static NOTFOUND = "NotFound";
    public static DEFAULT_IMAGE = "DefaultImage.jpg";
    public static ALLROUTE_MARKER = AppSettings.IMAGE_ENDPOINT + 'stop.png';//'bus2.png';
    public static ROUTE_BUS = AppSettings.IMAGE_ENDPOINT + 'school-bus.png';
    public static DRIVER = "Driver";
    public static COORDINATOR = "Coordinator";
    public static TEACHER = "Teacher";
    public static INVALID_SEQUENCE = 'Not a valid Sequence';
    public static SEQUENCE_CHANGED = 'Sequence Change Successfully';
    public static STOPPGAE_SAVED = 'Stoppage Saved Successfully';
    public static CHECK = AppSettings.IMAGE_ENDPOINT + 'Check.png';
    public static UNCHECK = AppSettings.IMAGE_ENDPOINT + 'Uncheck.png';
}