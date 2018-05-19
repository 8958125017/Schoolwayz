//interface ChangePassword {
//    oldPassword: string;
//    newPassword: string;
//    confirmPassword: string;
//}

interface FileUpload {
    imageUpload: string;
}
interface Organization {
    id: string;
    address: string;
    name: string;
    city: string;
    zipCode: string;
    logoURL: string;
    establishmentType: number;
    plan: number;
    patrons: string[];
    settings: OrganizationSettings;
    notifications: Notifications;
    location: GeoCoordinate;
    lastUpdated: Date;
    createDate: Date;
    organizationid: string;
}

interface OrganizationPlan {
    silver: number; // Include student tracking for transport in addition to bronze
    gold: number; // Include attendance tracking with limited machines in addition to Silver
    platinum: number;  // Extra features such as Gate Security, Digital Pay, SecureID etc in addition to Gold
}

interface EstablishmentType {
    school: number;
    office: number;
    shop: number;
    hospital: number;
    fitnessCenter: number;
}

interface Notifications {
    notifyParentForWhenTransportReachedStop: boolean;
    notifyParentForWhenTransportReachedSchool: boolean;
    notifyParentForWhenTransportLeftSchool: boolean;
    notifyParentForPatronReachedSchool: boolean;
    notifyParentForPatronLeftSchool: boolean;
    notifyParentForPatronAbsent: boolean;
    notifyParentForPatronAbscond: boolean;
}
interface GeoCoordinate {
    latitude: string,
    longitude: string,
    altitude: string,
    horizontalAccuracy: string,
    verticalAccuracy: string,
    speed: string,
    course: string,
}

interface OrganizationSettings {
    trackHalfSession: boolean;
    trackPeriods: boolean;
    trackSchoolEnd: boolean;
    trackTransportStopDrop: boolean;
    enableSMSNotificaions: boolean;
}


interface AdminCredential {
    id: string;
    userId: string;
    password: string;
    newPassword: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
    imgUrl: string;
    emailId: string;
    primaryContact: string;
    secondarycontact: string;
    lastUpdated: Date;
    createDate: Date;
    organizationid: string;

}

interface LoginDetail {
    userId: string;
    lastName: string;
    firstName: string;
    ipAddress: string;
    lastLogin: Date;
    organizationid: string;
    createDate: Date;
    lastUpdated: Date;
}

interface marker {
    lat: number;
    lng: number;
    label?: string;
    title: string;
    draggable: boolean;
    icon: string;
}

//Session
interface SessionDetail {
    id: string;
    sessionName: string;
    startDate: string;
    endDate: string;
    sessionBreak: BreakDetail[];
    sessionTerm: TermDetail[];
    sessionWeek: WeekDetail[];
    status: string;
    createDate: Date;
    lastUpdated: Date;
    organizationid: string;
    type: string;
}

//Term
interface TermDetail {
    id: string;
    termName: string;
    startDate: string;
    endDate: string;
    tag: string;
    organizationid: string;
    createDate: Date;
    lastUpdated: Date;
}

//Break
interface BreakDetail {
    id: string;
    breakName: string;
    startDate: string;
    endDate: string;
    tag: string;
    organizationid: string;
    createDate: Date;
    lastUpdated: Date;
}

//Week
interface WeekDetail {
    id: string;
    dayofweek: string;
    createDate: Date;
    organizationid: string;
    lastUpdated: Date;
}

//Grade
interface GradeDetail {
    id: string;
    grade: string;
    section: string;
    createDate: Date;
    lastUpdated: Date;
    organizationid: string;
}



interface GeoLocation {
    latitude: string;
    longitude: string;
    speed: string;
}

interface EventDetail {
    id: string;
    title: string;
    remarks: string;
    patronId: any[];
    personId: any[];
    description: string;
    declineRequest: DeclineRequest[];
    dayOfWeek: string;
    dayOfMonth: string;
    occurence: string;
    occurenceType: string;
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
    organizationid: string;
    createDate: Date;
    lastUpdated: Date;
}
interface DeclineRequest {
    declinedPatron: string;
    declinedPerson: string;
    declineMode: string;
    declineReason: string;

}

interface TransportRouteDetail {
    id: string;
    routeNumber: string;
    registrationNumber: string;
    driverId: string;
    routeStaffId: string;
    coordinatorId: string;
    description: string;
    remarks: string;
    driver: PersonDetail;
    coordinator: PersonDetail;
    routeStaff: PersonDetail;
    createDate: Date;
    lastUpdated: Date;
    organizationid: string;
    transportStoppages: TransportStoppageDetail[];
}

interface RouteTracking {
    routeNumber: string;
    RouteStaffId: string;
    DriverId: string;
    CoordinatorId: string;
    PatronId: string;
    EmployeeId: string;
    StoppageId: string;
    TrackingDate: string;
    TrackingTime: string;
    Lattitude: string;
    Longitude: string;
}

interface TransportRouteTrackingDetail {
    transportRoute: TransportRouteDetail;
    routeTracking: RouteTracking;
}

interface CompleteRouteDetail {
    transportRouteTrackingDetail: TransportRouteTrackingDetail[];
}


interface TransportRouteTracking {
    routeId: string;
    routeNumber: string;
    personId: string;
    employeeId: string;
    stoppageId: string;
    trackingDate: string;
    trackingTime: string;
    lattitude: string;
    longitude: string;
    driverId: string;
    coordinatorId: string;
    routeStaffId: string;
}

interface PatronDetail {
    id: string;
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    patronNumber: string;
    rollNo: number;
    imgUrl: string;
    section: string;
    isActive: boolean;
    transportRouteId: string;
    stoppageId: string;
    organizationId: string;
    class: number;
    createDate: Date;
    lastUpdated: Date;
    persons: PersonDetail[];
    authentications: AuthenticationTypeDetail[];
}

interface AuthenticationTypeDetail {
    id: string;
    remark: string;
    hashValue: string;
    patronId: string;
    mode: string;
    modeType: string;
    createDate: Date;
    organizationId: string;
    lastUpdated: Date;
}

interface PatronLeaveDetail {
    id: string;
    patronId: string;
    description: string;
    natureOfLeave: string;
    startDate: Date;
    endDate: Date;
    remarks: string;
    createDate: Date;
    lastUpdated: Date;
    transpportRouteId?: string;
    routeNumber?: string;
    stoppageId?: string;
    stoppageName?: string;
}
interface PersonLeaveDetail {
    id: string;
    personId: string;
    roleId: string
    roleName: string
    description: string;
    natureOfLeave: string;
    NumberOfDays: number;
    approved: String;
    startDate: Date;
    endDate: Date;
    remarks: string;
    status: boolean;
    createDate: Date;
    lastUpdated: Date;
    remark: string;
   
}


interface TrackingTypeDetail {
    id: string;
    patronId: string;
    eventId: string;
    authenticationId: string;
    createdate: Date;
   // organisationId
    lastupdated: Date;
    patron: PatronDetail;
}

interface PatronTrackingSummary {
    id: string;
    totalPatrons: number;
    presentPatrons: number;
    absentPatrons: number;
    patronsOnLeave: number;
    trackingDate: string;
    organizationid: string;
    type: string;
    createdate: Date;
    lastupdated: Date;
}

interface PersonTrackingSummary {
    id: string;
    totalPersons: number;
    presentPersons: number;
    absentPersons: number;
    personsOnLeave: number;
    trackingDate: string;
    organizationid: string;
    type: string;
    createdate: Date;
    lastupdated: Date;
}

interface AttendanceTracking {
    patronId: string;
    personId: string;
    trackingDate: string;
    trackingTime: string;
    authenticationId: string;
    class: string;
    section: string;
    rollNumber: number;
    subject: string;
    attendanceType: string;
}

interface EventTrackingDetail {
    authenticationId: string;
    class: string;
    event: Event;
    eventId: string;
}

interface EventTracking {
    id: string;
    patronId: string;
    title: string;
    name: string;
    class: string;
    section: string;
    rollNumber: number;
    personId: string;
    role: string;
    imgUrl: string;
    trackingDate: string;
    trackingTime: string;
    eventId: string;
    authenticationId: string;
    organizationid: string;
    createDate: Date;
    lastUpdated: Date;
}

interface PersonViewDetail {
    id: string;
    firstName: string;
    patronId: string;
    lastName: string;
    emailId: string;
    password: string;
    confirmPassword: string;
    gender: string;
    dateOfBirth: Date;
    primaryMobile: string;
    address: string
    role: string;
    authentications: AuthenticationTypeDetail[];
    isActive: boolean;
    secondaryMobile: string;
    country: string;
    state: string;
    zipCode: string;
    isPrimaryContact: boolean;
    isHavingSmartPhone: boolean;
    relation: string;
    imgUrl: string;
    createDate: Date;
    lastUpdated: Date;
    personId: string;
    personObj: PersonDetail[];
    organizationId: string;
}

interface PersonDetail {
    id: string;
    firstName: string;
    patronId: string;
    lastName: string;
    emailId: string;
    password: string;
    gender: string;
    dateOfBirth: Date;
    primaryMobile: string;
    address: string
    role: string;
    isActive: boolean;
    secondaryMobile: string;
    country: string;
    state: string;
    zipCode: string;
    isPrimaryContact: boolean;
    isHavingSmartPhone: boolean;
    relation: string;
    imgUrl: string;
    createDate: Date;
    lastUpdated: Date;
    personViewId: string;
    organizationId: string;
}

interface TransportStoppageDetail {
    id: string;
    name: string;
    sequence: number;
    lattitude: string;
    longitude: string;
    pickupTime: string;
    patronId: string[];
    dropTime: string;
    description: string;
    createDate: Date;
    organizationid: string;
    lastUpdated: Date;
}

interface PatronTracking {
    id: string;
    patronId: string;
    trackingDate: string;
    trackingTime: string;
    isMarkedAbsent: boolean;
    isAbsconed: boolean;
    authenticationId: string;
    firstName: string;
    lastName: string;
    class: string;
    section: string;
    rollNumber: number;
    attendanceType: string;
    subject: string;
    createDate: Date;
    organizationid: string;
    lastUpdated: Date;
}

interface PersonTracking {
    id: string;
    personId: string;
    firstName: string;
    personName: string;
    lastName: string;
    emailId: string;
    gender: string;
    role: string;
    primaryMobile: string;
    trackingDate: string;
    trackingTime: string;
    authenticationId: string;
    attendanceType: string;
    subject: string;
    createDate: Date;
    organizationid: string;
    lastUpdated: Date;
}

interface PatronStoppageSummary {
    id: string;
    stoppageName: string;
    name: string;
    //lastName: string;
    patronClass: string;
    section: string;
    rollNumber: number;
    imgUrl: string;
    reachedTime: string;
    reachingTime: string;
    status: string;
    headerColor: string;
    headerValue: string;
}



interface PatronAttendanceInfo {
    patron: PatronDetail;
    tracking: PatronTracking;
    leave: PatronLeaveDetail;
    absent: boolean;
    headerColor: string;
    imageUrl: string;
}

interface PersonAttendanceInfo {
    person: PersonDetail;
    tracking: PersonTracking;
    leave: PersonLeaveDetail;
    absent: boolean;
    headerColor: string;
    imageUrl: string;
}

interface RemovePatron {
    RoutePatrons: RoutePatrons;
}

interface RoutePatrons {
    PatronId: string;
    Stoppage: string;
    StoppageId: string;
    Sequence: number;
}

interface StoppagePatron {
    PatronId: string;
}

interface TransportRouteDetails {
    id: string;
    routeNumber: string;
    registrationNumber: string;
    driverId: string;
    driverName: string;
    driverImage: string;
    routeStaffId: string;
    routeStaffName: string;
    routeStaffImage: string;
    coordinatorId: string;
    coordinatorName: string;
    coordinatorImage: string;
    description: string;
    remarks: string;
    driver: PersonDetail;
    coordinator: PersonDetail;
    routeStaff: PersonDetail;
    createDate: Date;
    lastUpdated: Date;
    organizationid: string;
    transportStoppages: TransportStoppageDetail[];
}

interface IValue {
    prop: string
}

interface MyType {
    [name: string]: IValue;

}

interface StoppageCount {
    StoppageId: string;
    PickupCount: string;
    DropCount: string;
    PickupTime: string;
    DropTime: string;
    TrackingDate: Date;
    PickupPatrons: Array<any>;
    DropPatrons: Array<any>;
}
interface Stopcount {
    RouteNo: string;
    PickupCount: string;
    DropCount: string;
    TrackingDate: Date;
    PickupPatrons: Array<any>;
    DropPatrons: Array<any>;
    Stoppages: StoppageCount[];
}
interface AllRouteSummary {
    PickupCount: string;
    DropCount: string;
    TrackingDate: Date;
    PickupPatrons: Array<any>;
    DropPatrons: Array<any>;
    Routes: Stopcount[];
}

interface SetupDevice {
    id: string;
    name: string;
    class: string;
    section: string;
    establishmentType: string;
    event: string,
    eventId: string,
    installedAt: string,
    status: boolean,
    updatedBy: string,
    transportRoute: string,
    transportRouteId: string,
    organizationid: string;
    createDate: Date;
    lastUpdated: Date;
}
interface PatronOnLeaveDescription {
    name: string;
    description: string;
    imagePath: string;
    patronInfo: PatronDetail;
    routeNumber: string;
    stoppageName?: string;
}
interface PersonOnLeaveDescription {
    description: string;
    imagePath: string;
    personInfo: PersonDetail;
}
interface TransportWalkingRequest {
    id: string;
    patronId: string;
    requestBy: string;
    requestMode: string;
    reason: string;
    description: string;
    requestDate: string;
    requestTime: string;
    pick: boolean;
    drop: boolean;
    isAcknowledged: boolean;
    transpportRouteId: string;
    stoppageId: string;
    createDate: Date;
    organizationId: string;
    lastUpdated: Date;
}

interface TransportWalkingDetail {
    id: string;
    patronId: string;
    imgUrl: string;
    name: string;
    firstName: string;
    lastName: string;
    class: string;
    section: string;
    rollNumber: string;
    requestBy: string;
    requestMode: string;
    reason: string;
    pick: boolean;
    drop: boolean;
    description: string;
    requestDate: Date;
    requestTime: string;
    isAcknowledged: boolean;
    transpportRouteId: string;
    routeNumber: string;
    stoppageId: string;
    stoppageName: string;
    createDate: Date;
    organizationId: string;
    lastUpdated: Date;
    pickImage: string;
    dropImage: string;
}
interface InhouseMessage {

    deviceDetail: DeviceDetail[];
    messageType: string;
    messageCategory: string;
    message: string;
    messageTime: string;
    messageDate: string;
    expiryDate: string;
    organizationId: string;


}
interface DeviceDetail {
    deviceId: string;
    receivedBy: string;
    isSent: boolean; // sent by Cloud to Device
    sentDate: string;
    sentTime: string;
    isRecieved: boolean;//recieved by device from Cloud
    receivedDate: string;
    receivedTime: string;
    isAcknowledge: boolean; // acknowledged on Device
    acknowledgeDate: string;
    acknowledgeTime: string;
}
interface OutgoingMessage {
    id: string;
    broadcastTo: string;
    isSent: boolean;
    senderId: string;
    senderName: string;
    senderImage: string;
    senderRole: string;
    isResponseNeed: boolean;
    subject: string;
    message: string;
    messageTime: string;
    messageDate: string;
    patronId: string[];
    createDate: Date;
    lastUpdated: Date;
    organizationId: string;
}
interface IncomingMessage {
    id: string;
    message: string;
    subject: string;
    messageId: string;
    messageTime: string;
    patronId: string;
    messageDate: string;
}
interface ResponseMessage {
    id: string;
    requestmessage: string;
    outMessage: string;
    outSubject: string;
    messageId: string;
    patronId: string;
    messageTime: string;
    messageDate: string;
    patronName: string;
    patronClass: string;
    patronSection: string;
    patronImage: string;
}
interface DisplayImage {
    datalist: PatronDetail;
    imagePath: string;
}



interface RouteMonitor {
    routeId: string;
    stoppageName: string;
    dropTime: string;
    expectedDropTime: string;
    headerColor: string;
    expectedDropCount: string;
    dropCount: string;
    stopSequence: number;
    pickUpTime: string;
    expectedPickTime: string;
    pickCount: string;
    expectedPickCount: string;
    expectedPatronId: string[];
    actualPickPatronId: string[];
    actualDropPatronId: string[];
    runDirection: string;
}

interface PatronSummary {
    patron: PatronDetail;
    patronId: string;
    patronStatus: string;
    routeId: string;
    stoppageName: string;
    headerColor: string;
    imgUrl: string;
}

interface TransportRouteRun {
    id: string;
    routeId: string;
    routeNumber: string;
    registrationNumber: string;
    routeStaffId: string;
    driverId: string;
    coordinatorId: string;
    runDate: string;
    runStartTime: string;
    runEndTime: string;
    patronWalkers: string[];
    employeeWalkers: string[];
    patrons: string[];
    employees: string[];
    runDirection: TransportRouteRunDirection;
    stoppages: TransportRouteRunStoppage[];
    videos: TransportRouteRunVideoRecording[];
}

interface TransportRouteRunStoppage {
    transportStoppageID: string;
    reachedTime: string;
    trackingDate: string;
    patrons: string[];
    employees: string[];
}

interface TransportRouteRunTracking {
    transportRouteRunID: string;
    transportStoppageID: string;
    patronID: string;
    employeeID: string;
}


interface TransportRouteRunMonitoring {
    transportRouteRunID: string;
    routeID: string;
    location: GeoLocation;
    monitoringDate: string;
    monitoringTime: string;
    organizationId: string;
}

interface RouteMonitoring {
    transportRouteRunID: string;
    routeID: string;
    routeNumber: string;
    location: GeoLocation;
    monitoringTime: string;
    monitoringDate: string;
    createdate: Date;
    lastupdated: Date;
}

interface TransportRouteRunVideoRecording {
    transportRouteRunID: string;
    fileName: string;
    startTime: string;
    endTime: string;
    recordingSize: string;
    recordingDuration: string;
}

enum TransportRouteRunDirection {

    toSchool = 1,
    fromSchool = 2
}
interface PatronTransportInfo {
    id?: string;
    imagePath: string;
    name: string;
    firstName: string;
    lastName: string;
    class: string;
    section: string;
    routeNumber: string;
    stoppagename: string;
    transportRouteId: string;
    stoppageId: string;
}


interface Marker {
    lat: number;
    lng: number;
    label?: string;
    title?: string;
    draggable: boolean;
    icon: string;
}

interface Polyline {
    lat: number;
    lng: number;
    geodesic: boolean;
    strokeColor: string;
    strokeWeight: number
    strokeOpacity: number;
}
interface TransportMessage {
    id: string;
    broadcastTo: string;
    senderId: string;
    senderName: string;
    senderImage: string;
    senderRole: string;
    subject: string;
    message: string;
    messageTime: string;
    messageDate: string;
    patronId: string[];
    routeId: string[];
    stopId: string[];
    personId: string[];
    routeNumber: string[];
    stoppageName: string[];
    createDate: Date;
    lastUpdated: Date;
    organizationId: string;
    stoppageField: string;
}
interface TransportRouteCurrentLocation {
    Route: string;
    ComingStoppage: string;
    SchduledTime: string;
    EstimatedTime: string;
    PatronCount: string;
    PatronCountHeader: string;
    TransportRouteRun: TransportRouteRun;
    TransportStoppageDetail: TransportStoppageDetail;
    Status: boolean;
    RoutePatrons: string[];
    RouteDriver: PersonDetail;
    RouteStaff: PersonDetail;
    RouteCoordinator: PersonDetail;
    Patron: PatronDetail[];
    ColumnColor: string;
    bgColor: string;
    Severity: number;
    RouteImage: string;
    StopImage: string;
    ComingStopImage: string;
    PatronFirstName: string;
    PatronLastName: string;
}

interface Coordinates {
    lat: string;
    long: string;
}

interface Array<T> {
    find(predicate: (search: T) => boolean): T;
}
