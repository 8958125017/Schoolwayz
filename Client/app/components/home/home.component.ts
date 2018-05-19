import { Component, ViewEncapsulation} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfirmationService, Message } from 'primeng/primeng';
import { SetupService } from '../../services/setup.service';
import 'rxjs/Rx';
import * as moment from 'moment';
import { AppSettings } from '../../services/global.constants';
import { Observable } from 'rxjs/Rx';
//import { FilterPipe } from '../../services/filter.pipe';


@Component({
    selector: 'home',
    template: require('./home.component.html'),
    providers: [ConfirmationService, SetupService],
    styles: [`
    .sebm-google-map-container {
       height:500px;       
     }
    button[icon="fa-angle-double-up"] {
            display: none !important;
    }
    button[ng-reflect-icon="fa-angle-double-up"] {
        display: none !important;
    }
button[icon="fa-angle-double-down"] {
            display: none !important;
    }
button[ng-reflect-icon="fa-angle-double-down"] {
        display: none !important;
    }
button[icon="fa-angle-down"] {
            display: none !important;
    }
button[ng-reflect-icon="fa-angle-down"] {
        display: none !important;
    }
button[icon="fa-angle-up"] {
            display: none !important;
    }
button[ng-reflect-icon="fa-angle-up"] {
        display: none !important;
    }
  `],
    encapsulation: ViewEncapsulation.None
})

export class HomeComponent{

    orgId: string = AppSettings.ORGANIZATION_ID;

    msgs: Message[] = [];
    presentPatronCount: number = 0;
    absconedPatronCount: number = 0;
    absentpatron: number = 0;
    selectedRoute: TransportRouteCurrentLocation;

    //presentOnleave: number;
    private selectedDate: any;

    patronDetail: PatronDetail;
    patron: PatronDetail;
    patronLeaveDetail: PatronLeaveDetail[]; // Patron Leave Detail
    presentPatron: PatronTracking[]; // Present Patron
    totalPatronList: PatronDetail[]; // Total Patron
    transportRouteCurrentLocation: TransportRouteCurrentLocation;
    transportRouteCurrentLocationList: TransportRouteCurrentLocation[];
    tempTransportRouteCurrentLocationList: TransportRouteCurrentLocation[];
    filteredTransportRouteCurrentLocationList: TransportRouteCurrentLocation[];
    patronDetailList: PatronDetail[];
    patronOnLeaveDescriptionList: PatronOnLeaveDescription[];
    incomingmessages: IncomingMessage[];

    totalTransportRouteRunList: TransportRouteRun[];
    transportRouteRunList: TransportRouteRun[];
    totalTransportWalkerPatronList: TransportWalkingDetail[];
    transportWalkerPatronList: TransportWalkingDetail[];
    public transportWalkingRequest: TransportWalkingRequest;
    transportWalkerList: TransportWalkingDetail[];
    RouteOption: any;
    RouteOverlays: Array<any>;
    draggable: boolean;
    transportRouteList: TransportRouteDetail[];
    routeMonitoring: RouteMonitoring;
    routeMonitoringDetails: RouteMonitoring[];
    transportRouteTracking: TransportRouteTracking;

    lat: number = 28.633161137544214;
    lng: number = 77.08655834197998;
    zoom: number = 12;

    missingpatronlist: PatronDetail[];
    transportPatron: PatronDetail;
    patronWithTransportInfo: PatronTransportInfo
    finalMissingList: PatronTransportInfo[];
    onBoardPatronList: PatronTransportInfo[];
    MissingPatronList: PatronDetail[];
    lastlogin: string;
    missinglength: number = 0;
    leaveLength: number = 0;
    walkerlength: number = 0;
    messagelength: number = 0;
    busStatusLength: number = 0;
    allRouteIcon: string = AppSettings.ALLROUTE_MARKER;

    div: boolean = false;
    markers: marker[];
    PatronLeaveLoading: boolean;
    MissingPatronLoading: boolean;
    WalkerPatronLoading: boolean;
    LocationLoading: boolean;
    personDetails: PersonDetail[];
    currentTime: string;
    onBoardPatron: string[];
    navigatedRouteNumber: string;
    growlMsgs: string;
    routeImage: string;
    timerImage1: string;
    timerImage2: string;
    stopImage: string;
    orgDetails: Organization;
    orgMarkers: Marker[];
    schoolIcon: string = AppSettings.SCHOOL_IMAGE;
    isChecked: boolean = false;
    stops: Marker[];
    polyline: Polyline[];
    transportStoppage: TransportStoppageDetail[];
    polyArr: Array<any>;
    selectedTransportRun: TransportRouteRun;
    tRouteRun: TransportRouteDetail[];
    coveredStoppage: TransportRouteRunStoppage[];
    selectedroutes: TransportRouteDetail;
    routeSelected: string;
    transportStoppages: TransportStoppageDetail[];
    routeNumber: string;
    runDirection: string;
    selectedroutes2: TransportRouteDetail;
    selectRouteDetail: string;
    mapType: string;
    bgColor: string;
    button: boolean;
    constructor(private _router: Router, private _setupService: SetupService, private activatedRoute: ActivatedRoute) {
        this.button = false;
        this.mapType = "All";
        this.bgColor = "White";
        this.timerImage1 = "assets/layout/images/timer.png";
        this.leaveLength = 0;
        this.missinglength = 0;
        this.walkerlength = 0;
        this.selectedDate = AppSettings.CURRENT_DATE;
        this.currentTime = AppSettings.CURRENT_TIME;
        this._setupService.getOrganization().subscribe(result => {
            this.orgDetails = result;
            if (this.orgDetails != null) {
                this.orgMarkers = [];
                this.orgMarkers.push({ lat: Number(this.orgDetails.location.latitude), lng: Number(this.orgDetails.location.longitude), label: this.orgDetails.name, title: this.orgDetails.name, icon: this.schoolIcon, draggable: false, })
            }
        });
        this._setupService.getPerson().subscribe(result => {
            this.personDetails = result;
        });

        //for transportWalker list
        this._setupService.getPatron().subscribe(result => {
            this.patronDetailList = result;
            this._setupService.getTranportRoute().subscribe(result => {
                this.transportRouteList = result;
                this._setupService.getTransportWalkingRequestByDate(this.selectedDate).subscribe(result => {
                    this.totalTransportWalkerPatronList = result;
                });
                this._setupService.getPatronOnLeave(this.selectedDate).subscribe(result => {
                    this.patronLeaveDetail = result;
                    this.showPatronLeave();
                    this._setupService.getTransportRouteRun(this.selectedDate).subscribe(result => {
                        this.totalTransportRouteRunList = result;
                        if (this.totalTransportRouteRunList.find(x => x.runDirection == 2)) {
                            this.transportRouteRunList = this.totalTransportRouteRunList.filter(x => x.runDirection == 2);
                            this.transportWalkerPatronList = this.totalTransportWalkerPatronList.filter(x => x.drop);
                            this.createTransportWalkerList();

                        } else {
                            this.transportRouteRunList = this.totalTransportRouteRunList.filter(x => x.runDirection == 1);
                            this.transportWalkerPatronList = this.totalTransportWalkerPatronList.filter(x => x.pick);
                            this.createTransportWalkerList();

                        }
                         this._setupService.getAllLocation(this.selectedDate).subscribe(result => {
                            this.routeMonitoringDetails = result;
                            //alert("this.routeMonitoringDetails = " + this.routeMonitoringDetails.length)
                            this.initOverlay(this.mapType);
                            this.missingPatronOntheBus();
                            this.showCurrentRouteDetail();
                            Observable.interval(10000).subscribe(x => {
                                this._setupService.getAllLocation(this.selectedDate).subscribe(result => {
                                    this.routeMonitoringDetails = result;
                                    this.initOverlay(this.mapType);
                                    this.missingPatronOntheBus();
                                    this._setupService.getTransportRouteRun(this.selectedDate).subscribe(result => {
                                        this.totalTransportRouteRunList = result;
                                        if (this.totalTransportRouteRunList.find(x => x.runDirection == 2)) {
                                            this.transportRouteRunList = this.totalTransportRouteRunList.filter(x => x.runDirection == 2);
                                        } else {
                                            this.transportRouteRunList = this.totalTransportRouteRunList.filter(x => x.runDirection == 1);
                                        }
                                        this.showCurrentRouteDetail();
                                        this.showPatronLeave();
                                        this.createTransportWalkerList();
                                     });
                                });
                            });
                        });
                    });
                });
            });
        });
        this.transportWalkingRequest = {
            id: '',
            patronId: '',
            requestBy: '',
            requestMode: '',
            reason: '',
            description: '',
            requestDate: '',
            requestTime: '',
            pick: false,
            drop: false,
            isAcknowledged: true,
            transpportRouteId: '',
            stoppageId: '',
            createDate: new Date(),
            lastUpdated: new Date(),
            organizationId: this.orgId
        }
        this.RouteOverlays = new Array();
        this.showMessageCount();
        this.showTransportRouteBusReachTime();
    }
    // End Constructor

    onSearchChange(searchValue: string) {
        var tempLocations : TransportRouteCurrentLocation[]=[];
        //alert("searchValue =" + searchValue);
        if (searchValue == '') {
            //alert("complete")
            return this.transportRouteCurrentLocationList;
        }
        if (searchValue) {
            for (var currentLocation of this.transportRouteCurrentLocationList) {
                if (currentLocation.RouteDriver.firstName.lastIndexOf(searchValue) > -1 || currentLocation.RouteDriver.lastName.lastIndexOf(searchValue) > -1) {
                    //alert("route  =" + currentLocation.Route);
                    tempLocations.push(currentLocation);
                }
                
            }
        this.transportRouteCurrentLocationList = tempLocations;
            }
        return this.transportRouteCurrentLocationList;
    }

    handleChange(e: any) {
        this.isChecked = e.checked;
        if (this.isChecked) {
            this.tempTransportRouteCurrentLocationList = this.transportRouteCurrentLocationList;
            this.filteredTransportRouteCurrentLocationList = this.transportRouteCurrentLocationList.filter(x => x.Status == true);
            this.transportRouteCurrentLocationList = this.filteredTransportRouteCurrentLocationList;
        } else {
            this.transportRouteCurrentLocationList = this.tempTransportRouteCurrentLocationList;
        }
    }

   

    showCurrentRouteDetail() {
        
        var currentTime = new Date();
        var month = currentTime.getMonth();
        var day = currentTime.getDate();
        var year = currentTime.getFullYear();
        var transportRoute: TransportRouteDetail;
        this.transportRouteCurrentLocationList = [];
        var abort: boolean;
        var Driver: PersonDetail;
        var Staff: PersonDetail;
        var Coordinator: PersonDetail;
        var patronList: PatronDetail[] = [];
        for (var routeRun of this.transportRouteRunList) {
            this.LocationLoading = true;
            abort = false;
            transportRoute = this.transportRouteList.find(x => x.id == routeRun.routeId);
            //masterTransportRoute = this.
            if (transportRoute != null) {
                if (routeRun.runDirection.toString() == "1") {
                    transportRoute.transportStoppages = transportRoute.transportStoppages.sort(function (a, b) {
                        return a.sequence - b.sequence;
                    });
                }
                if (routeRun.runDirection.toString() == "2") {
                    transportRoute.transportStoppages = transportRoute.transportStoppages.sort(function (a, b) {
                        return b.sequence - a.sequence;
                    });
                }
                if (routeRun.stoppages.length == transportRoute.transportStoppages.length && routeRun.runEndTime == null) {
                    this.transportRouteCurrentLocation = <TransportRouteCurrentLocation>{};
                    this.transportRouteCurrentLocation.Route = routeRun.routeNumber;
                    this.transportRouteCurrentLocation.TransportRouteRun = routeRun;
                    this.transportRouteCurrentLocation.RouteImage = this.transportRouteCurrentLocation.Route+".jpg";
                    if (this.transportRouteCurrentLocation.Route == "1") {
                        this.transportRouteCurrentLocation.RouteImage = "assets/layout/images/one.png";
                    }
                    else if (this.transportRouteCurrentLocation.Route == "2") {
                        this.transportRouteCurrentLocation.RouteImage = "assets/layout/images/two.png";
                    }
                    else if (this.transportRouteCurrentLocation.Route == "3") {
                        this.transportRouteCurrentLocation.RouteImage = "assets/layout/images/three.png";
                    }
                    else if (this.transportRouteCurrentLocation.Route == "4") {
                        this.transportRouteCurrentLocation.RouteImage = "assets/layout/images/four.png";
                    }
                    else if (this.transportRouteCurrentLocation.Route == "5") {
                        this.transportRouteCurrentLocation.RouteImage = "assets/layout/images/five.png";
                    }
                    else if (this.transportRouteCurrentLocation.Route == "6") {
                        this.transportRouteCurrentLocation.RouteImage = "assets/layout/images/six.png";
                    }
                    else if (this.transportRouteCurrentLocation.Route == "7") {
                        this.transportRouteCurrentLocation.RouteImage = "assets/layout/images/seven.png";
                    }
                    else if (this.transportRouteCurrentLocation.Route == "8") {
                        this.transportRouteCurrentLocation.RouteImage = "assets/layout/images/eight.png";
                    }
                    else if (this.transportRouteCurrentLocation.Route == "9") {
                        this.transportRouteCurrentLocation.RouteImage = "assets/layout/images/nine.png";
                    }
                    patronList = this.patronDetailList.filter(x => x.transportRouteId == transportRoute.id);
                    if (patronList != null) {
                        for (var patron of patronList) {
                            this.transportRouteCurrentLocation.PatronFirstName += patron.firstName + ",";
                            this.transportRouteCurrentLocation.PatronLastName += patron.lastName + ",";
                        }
                    }
                    this.transportRouteCurrentLocation.ComingStoppage = "School";
                    this.transportRouteCurrentLocation.SchduledTime = "NA";
                    this.transportRouteCurrentLocation.EstimatedTime = "NA";
                    this.transportRouteCurrentLocation.PatronCount = "0";
                    this.transportRouteCurrentLocation.RoutePatrons = [];
                    this.transportRouteCurrentLocation.Status = false;
                    Driver = this.personDetails.find(x => x.id == routeRun.driverId);
                    Staff = this.personDetails.find(x => x.id == routeRun.routeStaffId);
                    Coordinator = this.personDetails.find(x => x.id == routeRun.coordinatorId);
                    this.transportRouteCurrentLocation.Severity = 1;
                    if (Driver != null) {
                        this.transportRouteCurrentLocation.RouteDriver = Driver;
                    }
                    if (Staff != null) {
                        this.transportRouteCurrentLocation.RouteStaff = Staff;
                    }
                    if (Coordinator != null) {
                        this.transportRouteCurrentLocation.RouteCoordinator = Coordinator;
                    }
                    if (routeRun.runEndTime == null) {
                        this.transportRouteCurrentLocation.Status = true;
                    }
                    this.transportRouteCurrentLocation.ComingStopImage = "assets/layout/images/routeStop2.png";
                    this.transportRouteCurrentLocation.StopImage = "assets/layout/images/timer.png";                    
                    this.transportRouteCurrentLocationList.push(this.transportRouteCurrentLocation);
                    this.LocationLoading = false;
                    
                }
                for (var stoppage = 0; stoppage < transportRoute.transportStoppages.length && !abort; stoppage++) {
                    //alert("ID = " + transportRoute.transportStoppages[stoppage].name);
                    var currentStoppage: TransportRouteRunStoppage | undefined = <TransportRouteRunStoppage>{};
                    currentStoppage = routeRun.stoppages.find(x => x.transportStoppageID == transportRoute.transportStoppages[stoppage].id);
                    
                        
                    //for (var y = 0; y < routeRun.stoppages.length && !abort; y++) {
                        this.transportRouteCurrentLocation = <TransportRouteCurrentLocation>{};
                        if (routeRun.runEndTime == null) {
                            this.transportRouteCurrentLocation.StopImage = "assets/layout/images/timer.png";
                            this.transportRouteCurrentLocation.TransportRouteRun = routeRun;
                            //alert("master stoppage ID = " + transportRoute.transportStoppages[x].id);
                            //alert("Route Run stoppage ID = " + routeRun.stoppages[y].transportStoppageID);
                            if (currentStoppage == null) {
                                //alert("currentStoppage = " + transportRoute.transportStoppages[stoppage].name);
                            //if (transportRoute.transportStoppages[x].id != routeRun.stoppages[y].transportStoppageID) {
                                this.transportRouteCurrentLocation.Route = routeRun.routeNumber;
                                if (this.transportRouteCurrentLocation.Route == "1") {
                                    this.transportRouteCurrentLocation.RouteImage = "assets/layout/images/one.png";
                                }
                                else if (this.transportRouteCurrentLocation.Route == "2") {
                                    this.transportRouteCurrentLocation.RouteImage = "assets/layout/images/two.png";
                                }
                                else if (this.transportRouteCurrentLocation.Route == "3") {
                                    this.transportRouteCurrentLocation.RouteImage = "assets/layout/images/three.png";
                                }
                                else if (this.transportRouteCurrentLocation.Route == "4") {
                                    this.transportRouteCurrentLocation.RouteImage = "assets/layout/images/four.png";
                                }
                                else if (this.transportRouteCurrentLocation.Route == "5") {
                                    this.transportRouteCurrentLocation.RouteImage = "assets/layout/images/five.png";
                                }
                                else if (this.transportRouteCurrentLocation.Route == "6") {
                                    this.transportRouteCurrentLocation.RouteImage = "assets/layout/images/six.png";
                                }
                                else if (this.transportRouteCurrentLocation.Route == "7") {
                                    this.transportRouteCurrentLocation.RouteImage = "assets/layout/images/seven.png";
                                }
                                else if (this.transportRouteCurrentLocation.Route == "8") {
                                    this.transportRouteCurrentLocation.RouteImage = "assets/layout/images/eight.png";
                                }
                                else if (this.transportRouteCurrentLocation.Route == "9") {
                                    this.transportRouteCurrentLocation.RouteImage = "assets/layout/images/nine.png";
                                }
                                this.transportRouteCurrentLocation.ComingStopImage = "assets/layout/images/routeStop2.png";
                                this.transportRouteCurrentLocation.ComingStoppage = transportRoute.transportStoppages[stoppage].name;
                                this.transportRouteCurrentLocation.SchduledTime = transportRoute.transportStoppages[stoppage].pickupTime;
                                this.transportRouteCurrentLocation.EstimatedTime = this.calculateEstimatedTime(transportRoute.transportStoppages[stoppage].lattitude, transportRoute.transportStoppages[stoppage].longitude, transportRoute.id);
                                this.transportRouteCurrentLocation.PatronCount = transportRoute.transportStoppages[stoppage].patronId.length.toString();
                                this.transportRouteCurrentLocation.RoutePatrons = transportRoute.transportStoppages[stoppage].patronId;
                                
                                this.transportRouteCurrentLocation.Status = false;
                                Driver = this.personDetails.find(x => x.id == routeRun.driverId);
                                Staff = this.personDetails.find(x => x.id == routeRun.routeStaffId);
                                Coordinator = this.personDetails.find(x => x.id == routeRun.coordinatorId);
                                this.transportRouteCurrentLocation.Severity = 1;
                                if (Driver != null) {
                                    this.transportRouteCurrentLocation.RouteDriver = Driver;
                                }
                                if (Staff != null) {
                                    this.transportRouteCurrentLocation.RouteStaff = Staff;
                                }
                                if (Coordinator != null) {
                                    this.transportRouteCurrentLocation.RouteCoordinator = Coordinator;
                                }
                                if (routeRun.runEndTime == null) {
                                    this.transportRouteCurrentLocation.Status = true;
                                }
                                var fields = this.transportRouteCurrentLocation.EstimatedTime.split(':');
                                var hour = fields[0];
                                var minute = Number(fields[1]);
                                var EstimatedTime = new Date(year, month, day, +hour, +minute);
                                var fields = this.transportRouteCurrentLocation.SchduledTime.split(':');
                                var hour = fields[0];
                                var minute = Number(fields[1]);
                                var SchduledTime = new Date(year, month, day, +hour, +minute);
                                if (EstimatedTime > SchduledTime) {
                                    this.transportRouteCurrentLocation.ColumnColor = "#ff4c4c";
                                    this.transportRouteCurrentLocation.StopImage = "assets/layout/images/timer2.png";
                                    this.transportRouteCurrentLocation.Severity = 0;
                                }
                                if (routeRun.runDirection.toString() == "2") {
                                    this.transportRouteCurrentLocation.SchduledTime = transportRoute.transportStoppages[stoppage].dropTime;
                                    this.transportRouteCurrentLocation.PatronCount = transportRoute.transportStoppages[stoppage].patronId.length.toString();
                                    this.transportRouteCurrentLocation.RoutePatrons = transportRoute.transportStoppages[stoppage].patronId;
                                    //this.transportRouteCurrentLocation.PatronCount = routeRun.stoppages[y].patrons.length.toString();
                                    //this.transportRouteCurrentLocation.RoutePatrons = routeRun.stoppages[y].patrons;
                                }
                                patronList = this.patronDetailList.filter(x => x.transportRouteId == transportRoute.id);
                                if (patronList != null) {
                                    for (var patron of patronList) {
                                        this.transportRouteCurrentLocation.PatronFirstName += patron.firstName + ",";
                                        this.transportRouteCurrentLocation.PatronLastName += patron.lastName + ",";
                                    }
                                }
                                this.transportRouteCurrentLocationList.push(this.transportRouteCurrentLocation);
                                this.LocationLoading = false;
                                abort = true;
                                //break;
                            }
                        } else {
                            this.transportRouteCurrentLocation.Route = routeRun.routeNumber;
                            this.transportRouteCurrentLocation.TransportRouteRun = routeRun;
                            if (this.transportRouteCurrentLocation.Route == "1") {
                                this.transportRouteCurrentLocation.RouteImage = "assets/layout/images/one.png";
                            }
                            else if (this.transportRouteCurrentLocation.Route == "2") {
                                this.transportRouteCurrentLocation.RouteImage = "assets/layout/images/two.png";
                            }
                            else if (this.transportRouteCurrentLocation.Route == "3") {
                                this.transportRouteCurrentLocation.RouteImage = "assets/layout/images/three.png";
                            }
                            else if (this.transportRouteCurrentLocation.Route == "4") {
                                this.transportRouteCurrentLocation.RouteImage = "assets/layout/images/four.png";
                            }
                            else if (this.transportRouteCurrentLocation.Route == "5") {
                                this.transportRouteCurrentLocation.RouteImage = "assets/layout/images/five.png";
                            }
                            else if (this.transportRouteCurrentLocation.Route == "6") {
                                this.transportRouteCurrentLocation.RouteImage = "assets/layout/images/six.png";
                            }
                            else if (this.transportRouteCurrentLocation.Route == "7") {
                                this.transportRouteCurrentLocation.RouteImage = "assets/layout/images/seven.png";
                            }
                            else if (this.transportRouteCurrentLocation.Route == "8") {
                                this.transportRouteCurrentLocation.RouteImage = "assets/layout/images/eight.png";
                            }
                            else if (this.transportRouteCurrentLocation.Route == "9") {
                                this.transportRouteCurrentLocation.RouteImage = "assets/layout/images/nine.png";
                            }
                            this.transportRouteCurrentLocation.ComingStoppage = "Completed";
                            this.transportRouteCurrentLocation.SchduledTime = "NA";
                            this.transportRouteCurrentLocation.EstimatedTime = "NA";
                            this.transportRouteCurrentLocation.PatronCount = "0";
                            this.transportRouteCurrentLocation.RoutePatrons = [];
                            this.transportRouteCurrentLocation.Status = false;
                            Driver = this.personDetails.find(x => x.id == routeRun.driverId);
                            Staff = this.personDetails.find(x => x.id == routeRun.routeStaffId);
                            Coordinator = this.personDetails.find(x => x.id == routeRun.coordinatorId);
                            this.transportRouteCurrentLocation.Severity = 1;
                            if (Driver != null) {
                                this.transportRouteCurrentLocation.RouteDriver = Driver;
                            }
                            if (Staff != null) {
                                this.transportRouteCurrentLocation.RouteStaff = Staff;
                            }
                            if (Coordinator != null) {
                                this.transportRouteCurrentLocation.RouteCoordinator = Coordinator;
                            }
                            if (routeRun.runEndTime == null) {
                                this.transportRouteCurrentLocation.Status = true;
                            }
                            this.transportRouteCurrentLocation.StopImage = "assets/layout/images/timer.png";                            
                            if (routeRun.runDirection.toString() == "2") {
                                this.transportRouteCurrentLocation.SchduledTime = transportRoute.transportStoppages[stoppage].dropTime;
                                this.transportRouteCurrentLocation.PatronCount = transportRoute.transportStoppages[stoppage].patronId.length.toString();
                                this.transportRouteCurrentLocation.RoutePatrons = transportRoute.transportStoppages[stoppage].patronId;
                                //this.transportRouteCurrentLocation.PatronCount = routeRun.stoppages[y].patrons.length.toString();
                                //this.transportRouteCurrentLocation.RoutePatrons = routeRun.stoppages[y].patrons;
                            }
                            patronList = this.patronDetailList.filter(x => x.transportRouteId == transportRoute.id);
                            if (patronList != null) {
                                for (var patron of patronList) {
                                    this.transportRouteCurrentLocation.PatronFirstName += patron.firstName + ",";
                                    this.transportRouteCurrentLocation.PatronLastName += patron.lastName + ",";
                                }
                            }
                            this.transportRouteCurrentLocationList.push(this.transportRouteCurrentLocation);
                            this.LocationLoading = false;
                            abort = true;
                        }
                }


                //}
            }
        }
        //alert("checkked = " + this.isChecked)
        if (this.isChecked) {
            this.transportRouteCurrentLocationList = this.transportRouteCurrentLocationList.filter(x => x.Status == true);
        }
        this.transportRouteCurrentLocationList.sort(function (a, b) {
            return a.Severity - b.Severity;
        });
    }
    ngOnInit() {
        this.activatedRoute.params.subscribe(params => {
            this.navigatedRouteNumber = params["growlMsgs"];
        })
        if (this.navigatedRouteNumber == "1") {
            this.msgs = [];
            this.msgs.push({ severity: 'success', summary: 'Password changed sucessfully' });
            setTimeout(() => {
                this.msgs = [];
            }, 4000);
        }
    }
    calculateEstimatedTime(lat: string, long: string, routeId: string) {
        var routeMonitor: RouteMonitoring | undefined = <RouteMonitoring>{};
        var geoPosition: GeoLocation;
        var distance: number;
        var estimatedTime: string;
        var speed: number;
        routeMonitor = this.routeMonitoringDetails.find(x => x.routeID == routeId);
        if (routeMonitor != null) {
            speed = 40;//routeMonitor.location.speed;
            geoPosition = routeMonitor.location;
            distance = this.calculateDistance(Number(lat), Number(long), Number(geoPosition.latitude), Number(geoPosition.longitude));
            estimatedTime = (distance / speed * 60).toString();
            estimatedTime = moment(new Date()).add(estimatedTime, 'minutes').format('HH:mm');
            return estimatedTime;
        }
        return "NA";
    }
    calculateDistance(lat1: any, lon1: any, lat2: any, lon2: any) {
        var p = 0.017453292519943295;    // Math.PI / 180
        var c = Math.cos;
        var a = 0.5 - c((lat2 - lat1) * p) / 2 +
            c(lat1 * p) * c(lat2 * p) *
            (1 - c((lon2 - lon1) * p)) / 2;
        return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
    }

    

    //Missing Patron In the buses
    missingPatronOntheBus() {
        this.MissingPatronLoading = true;
        var patronAfterLeave: string[] = [];
        var patronAfterWalker: string[] = [];
        //var patron: PatronLeaveDetail | undefined = <PatronLeaveDetail>{};
        var missingPatron: PatronDetail | undefined = <PatronDetail>{};
        var presentPatron: PatronDetail | undefined = <PatronDetail>{};
        this.onBoardPatron = [];
        var transportStoppageDetail: TransportStoppageDetail[] = [];
        var patrons: string[];
        var offBoardPatron: string[] = [];
        this.finalMissingList = [];
        this.onBoardPatronList = [];
        var totalPatron: string[] = [];
        for (var route of this.transportRouteList) {
            transportStoppageDetail = route.transportStoppages;
            for (var stoppage of transportStoppageDetail) {
                patrons = <string[]>{};
                patrons = stoppage.patronId;
                for (var patronId of patrons) {
                    totalPatron.push(patronId);
                    for (var routePatrons of this.transportRouteRunList) {
                        if (routePatrons.patrons.lastIndexOf(patronId) >= 0) {
                            this.onBoardPatron.push(patronId); 
                        }
                        //else {
                        //    offBoardPatron.push(patronId);                           
                        //}
                    }                   
                }
            }
        }
        offBoardPatron = totalPatron.filter(item => this.onBoardPatron.indexOf(item) < 0);
        this.presentPatronCount = this.onBoardPatron.length;
        for (var offBoardPatronId of offBoardPatron) {
            if (this.patronLeaveDetail.find(a => a.patronId == offBoardPatronId) == null) {               
                patronAfterLeave.push(offBoardPatronId);
            }
        }
        for (var leavePatronId of patronAfterLeave) {           
            if (!this.transportWalkerPatronList.find(a => a.patronId == leavePatronId)) {
                patronAfterWalker.push(leavePatronId);                
            }            
        }

        for (var onBoardPatronId of this.onBoardPatron) {           
            presentPatron = this.patronDetailList.find(x => x.id == onBoardPatronId);           
            if (presentPatron != null) {
                this.patronWithTransportInfo = <PatronTransportInfo>{};
                var transportInfo: TransportRouteDetail | undefined = <TransportRouteDetail>{};
                var transportStoppageInfo: TransportStoppageDetail | undefined = <TransportStoppageDetail>{};
                this.transportPatron = <PatronDetail>{};
                transportInfo = this.transportRouteList.find(x => x.id == presentPatron.transportRouteId);
                if (transportInfo != null) {
                    this.patronWithTransportInfo.routeNumber = transportInfo.routeNumber;
                    transportStoppageInfo = transportInfo.transportStoppages.find(x => x.id == presentPatron.stoppageId);
                    if (transportStoppageInfo != null) {
                        this.patronWithTransportInfo.stoppagename = transportStoppageInfo.name;
                    }
                }
                this.patronWithTransportInfo.imagePath = presentPatron.imgUrl;
                this.patronWithTransportInfo.name = presentPatron.firstName + " " + presentPatron.lastName;
                this.onBoardPatronList.push(this.patronWithTransportInfo);
              
            } 
        }
        for (var patronId of patronAfterWalker) {           
            missingPatron = this.patronDetailList.find(x => x.id == patronId);
           
            if (missingPatron != null) {
                this.patronWithTransportInfo = <PatronTransportInfo>{};
                var transportInfo: TransportRouteDetail | undefined = <TransportRouteDetail>{};
                var transportStoppageInfo: TransportStoppageDetail | undefined = <TransportStoppageDetail>{};
                this.transportPatron = <PatronDetail>{};
                transportInfo = this.transportRouteList.find(x => x.id == missingPatron.transportRouteId);
                if (transportInfo != null) {
                    this.patronWithTransportInfo.routeNumber = transportInfo.routeNumber;
                    transportStoppageInfo = transportInfo.transportStoppages.find(x => x.id == missingPatron.stoppageId);
                    if (transportStoppageInfo != null) {
                        this.patronWithTransportInfo.stoppagename = transportStoppageInfo.name;
                    }
                }
                this.patronWithTransportInfo.imagePath = missingPatron.imgUrl;
                this.patronWithTransportInfo.name = missingPatron.firstName + " " + missingPatron.lastName;
                //this.patronWithTransportInfo.lastName = this.patronDetail.lastName;
                this.patronWithTransportInfo.class = missingPatron.class.toString();
                this.patronWithTransportInfo.section = missingPatron.section;
                this.finalMissingList.push(this.patronWithTransportInfo);
                this.missinglength = this.finalMissingList.length;
            } 
        }
        this.MissingPatronLoading = false;
    }
    //Patron Leave
    showPatronLeave() {
        var transportStoppage: TransportStoppageDetail | undefined = <TransportStoppageDetail>{};
      var patronOnLeaveDescription: PatronOnLeaveDescription;
       var patron: PatronDetail | undefined = <PatronDetail>{};
        var presentPatronList: PatronLeaveDetail[] = [];
        var route: TransportRouteDetail | undefined = <TransportRouteDetail>{};
        this.patronOnLeaveDescriptionList = [];
        var actualPatronLeaveList: PatronLeaveDetail[] = [];
        for (var patronLeave of this.patronLeaveDetail) {
            for (var routePatrons of this.transportRouteRunList) {
                if (routePatrons.patrons.lastIndexOf(patronLeave.patronId) >= 0) {
                    presentPatronList.push(patronLeave);
                }
            }
        }
        actualPatronLeaveList = this.patronLeaveDetail.filter(item => presentPatronList.indexOf(item) < 0);
        for (var leave of actualPatronLeaveList) {
            this.PatronLeaveLoading = true;
            patron = this.patronDetailList.find(x => x.id == leave.patronId);
            if (patron != null) {
                patronOnLeaveDescription = <PatronOnLeaveDescription>{};
                patronOnLeaveDescription.name = patron.firstName + " " + patron.lastName;
                patronOnLeaveDescription.patronInfo = patron;
                patronOnLeaveDescription.description = leave.description;
                patronOnLeaveDescription.imagePath = patron.imgUrl;
               
                route = this.transportRouteList.find(x => x.id == patronOnLeaveDescription.patronInfo.transportRouteId);
                //if (route != null) {
                //    patronOnLeaveDescription.routeNumber = route.routeNumber;
                //}
                if (route != null) {
                    transportStoppage = route.transportStoppages.find(x => x.id == leave.stoppageId)
                    patronOnLeaveDescription.routeNumber = route.routeNumber;
                    if (transportStoppage != null) {
                        patronOnLeaveDescription.stoppageName = transportStoppage.name;
                    }
                }
                this.patronOnLeaveDescriptionList.push(patronOnLeaveDescription);
                this.leaveLength = this.patronOnLeaveDescriptionList.length;

            }
        }
        this.PatronLeaveLoading = false;
    }
    //Creating Transport Walker List ,Fetching Patron detail from PatronDetailList.
    createTransportWalkerList() {
        var transportRoute: TransportRouteDetail;
        var transportStoppage: TransportStoppageDetail;
        var patronInfo: PatronDetail | undefined = <PatronDetail>{};
        var presentPatronList: TransportWalkingDetail[] = [];
        var actualPatronWalkerList: TransportWalkingDetail[] = [];
        this.transportWalkerList = [];
        for (var patron of this.transportWalkerPatronList) {
            for (var routePatrons of this.transportRouteRunList) {
                if (routePatrons.patrons.lastIndexOf(patron.patronId) >= 0) {
                    presentPatronList.push(patron);
                }
            }
        }
        actualPatronWalkerList = this.transportWalkerPatronList.filter(item => presentPatronList.indexOf(item) < 0);
        for (var patron of actualPatronWalkerList) {            
            this.WalkerPatronLoading = true;
            patronInfo = this.patronDetailList.find(x => x.id == patron.patronId);
            if (patronInfo != null) {
                patron.imgUrl = patronInfo.imgUrl;
                patron.name = patronInfo.firstName + " " + patronInfo.lastName;                
                patron.class = patronInfo.class.toString();
                patron.section = patronInfo.section;
                patron.rollNumber = patronInfo.rollNo.toString();
                patron.requestBy = patron.requestBy;
                transportRoute = this.transportRouteList.find(x => x.id == patron.transpportRouteId);
                if (transportRoute != null) {
                    transportStoppage = transportRoute.transportStoppages.find(x => x.id == patron.stoppageId)
                    patron.routeNumber = transportRoute.routeNumber;
                    if (transportStoppage != null) {
                        patron.stoppageName = transportStoppage.name;
                    }
                }
                this.transportWalkerList.push(patron);
                this.walkerlength = this.transportWalkerList.length;
            }
        }
        
        //alert("walkerlength = " + this.walkerlength);

            this.WalkerPatronLoading = false;
    }

    isAcknowledge(transportWalkingDetail: TransportWalkingDetail) {
        this._setupService.updateAcknowledge(transportWalkingDetail.id, true).subscribe(result => {
        });
    }

    showMessageCount() {
        this._setupService.getIncomingMessage().subscribe(result => {
            this.incomingmessages = result;
            this.messagelength = this.incomingmessages.length;
        });
    }

    showTransportRouteBusReachTime() {
        this._setupService.getPicupRun(this.selectedDate).subscribe(result => {
            this.transportRouteRunList = result;
        });
    }
    organization() {
        this._router.navigate(['/organization']);
    }
    getmessage() {
        this._router.navigate(['/incomingmessage']);
    }

    // Display All route Map for dashboard

   
    clickedMarker(routeNumber: string, index: any) {
        this._router.navigate(['/mapview', { 'routeNumber': routeNumber }]);
    }
    onRowSelect(transportRoute: TransportRouteCurrentLocation) {
        if (transportRoute.TransportRouteRun.runEndTime == null) {
            this._router.navigate(['/mapview', { 'routeNumber': transportRoute.Route }]);
        }
    }

    selectRoute(transportRouteNumber: TransportRouteCurrentLocation) {  
        if (transportRouteNumber) {
            var navigatedRouteNumber = transportRouteNumber.Route;
            var transportRoute: TransportRouteDetail;  
            if (navigatedRouteNumber != null) {
                
                transportRoute = this.transportRouteList.find(x => x.routeNumber == navigatedRouteNumber);
                if (transportRoute != null) {
                    this.selectRouteDetail = transportRoute.id;
                }
            }
            else {
                 this.selectRouteDetail = "undefined";
            }
        }
        else {
            this.selectRouteDetail = "undefined";
        }
        var a = AppSettings.CURRENT_DATE;
        this.selectedDate = a;
       
        if (this.selectRouteDetail == "undefined") {
            this.button = false;
            this.bgColor = "white"
            this.mapType = "All";
            this._setupService.getAllLocation(this.selectedDate).subscribe(result => {
                this.routeMonitoringDetails = result;
                this.initOverlay(this.mapType);
            });
        } else {
          
            this.button = true;
            this.bgColor ="silver"
            this.mapType = "Route";
            this.selectedTransportRun = <TransportRouteRun>{};
            this.routeSelected = this.selectRouteDetail;
            this.selectedTransportRun = this.transportRouteRunList.find(x => x.routeId == this.routeSelected);         
            if (this.selectedTransportRun) {             
                this.coveredStoppage = this.selectedTransportRun.stoppages;
                  this.selectedroutes = this.transportRouteList.find(x => x.id == this.routeSelected);              
                if (this.selectedroutes != null) {                    
                    this.routeNumber = this.selectedroutes.routeNumber;                  
                    this.transportStoppages = this.selectedroutes.transportStoppages.sort(function (a, b) {
                        return a.sequence - b.sequence;
                    });
                    this._setupService.getAllLocation(this.selectedDate).subscribe(result => {
                        this.routeMonitoringDetails = result;
                        this.initOverlay(this.mapType);
                    });
                    
                }
               
            }
        }
    }

    initOverlay(type: string) {
        this.markers = [];
        this.stops = [];
        this.polyline = [];
        var image = AppSettings.ALLROUTE_MARKER;
        var commingStopIcon = AppSettings.COMMING_STOP_MARKER;       
        var coveredStopIcon = AppSettings.COVERED_STOP_MARKER;
        
        var routeNumber: string = "0";
        var transportRoute: TransportRouteDetail;
        if (type == "All" && this.transportStoppage == null) {

            this.stops = [];
            this.polyline = [];
            var routeNumber: string = "0";
            for (var route of this.routeMonitoringDetails) {
                if (route.routeID != null) {
                    transportRoute = this.transportRouteList.find(x => x.id == route.routeID);
                    if (transportRoute != null) {
                        routeNumber = transportRoute.routeNumber;
                    }

                    this.markers.push({ lat: Number(route.location.latitude), lng: Number(route.location.longitude), label: '', title: '', icon: AppSettings.IMAGE_ENDPOINT + "bus" + transportRoute.routeNumber + ".png", draggable: false, });
                }
            }

        } else {
         //   alert("this.selectRouteDetail = " + this.selectRouteDetail);
            this.stops = [];
            this.polyline = [];
            this.polyArr = new Array();
            var routeMonitoring: RouteMonitoring;
            transportRoute = this.transportRouteList.find(x => x.id == this.selectRouteDetail);
            routeMonitoring = this.routeMonitoringDetails.find(x => x.routeID == this.selectRouteDetail);
            if (routeMonitoring) { 
                this.markers.push({ lat: Number(routeMonitoring.location.latitude), lng: Number(routeMonitoring.location.longitude), label: '', title: '', icon: AppSettings.IMAGE_ENDPOINT + "bus" + transportRoute.routeNumber + ".png", draggable: false });
            }
            var stoppageTracking: TransportRouteRunStoppage;
            var stoppagePatronNumber: number = 0;
            var stoppageReachTime: string = "NA";
            var expectedTime: string = "NA";
            for (var stoppages of this.transportStoppages) {
                if (this.selectedTransportRun) {
                    expectedTime = stoppages.pickupTime;
                    stoppageTracking = this.selectedTransportRun.stoppages.find(x => x.transportStoppageID == stoppages.id) == undefined ? null : this.selectedTransportRun.stoppages.find(x => x.transportStoppageID == stoppages.id);
                    if (stoppageTracking != null && stoppageTracking.patrons != null) {
                        stoppagePatronNumber = stoppageTracking.patrons.length;
                        stoppageReachTime = stoppageTracking.reachedTime;
                    }

                    //if (this.selectedTransportRun.runDirection.toString() == "2") {
                    if (this.runDirection == "2") {
                        expectedTime = stoppages.dropTime;
                    }
                }
                if (this.coveredStoppage) {
                    if (this.coveredStoppage.find(x => x.transportStoppageID == stoppages.id)) {
                        this.stops.push({ lat: Number(stoppages.lattitude), lng: Number(stoppages.longitude), label: stoppages.sequence.toString(), title: stoppages.name + "\n" + "Expected Patron : " + stoppages.patronId.length + "\n" + "Actual Patron : " + stoppagePatronNumber + "\n" + "Expected Time : " + expectedTime + "\n" + "Actual Time : " + stoppageReachTime, icon: coveredStopIcon, draggable: false, })
                        this.polyline.push({ lat: Number(stoppages.lattitude), lng: Number(stoppages.longitude), geodesic: true, strokeColor: "green", strokeOpacity: 0.3, strokeWeight: 2 });
                    } else {
                        this.stops.push({ lat: Number(stoppages.lattitude), lng: Number(stoppages.longitude), label: stoppages.sequence.toString(), title: stoppages.name + "\n" + "Expected Patron : " + stoppages.patronId.length + "\n" + "Actual Patron : " + stoppagePatronNumber + "\n" + "Expected Time : " + expectedTime + "\n" + "Actual Time : " + stoppageReachTime, icon: commingStopIcon, draggable: false, })
                        this.polyline.push({ lat: Number(stoppages.lattitude), lng: Number(stoppages.longitude), geodesic: true, strokeColor: "red", strokeOpacity: 0.3, strokeWeight: 2 });
                    }
                } else {
                    this.stops.push({ lat: Number(stoppages.lattitude), lng: Number(stoppages.longitude), label: stoppages.sequence.toString(), title: stoppages.name + "\n" + "Expected Patron : " + stoppages.patronId.length + "\n" + "Actual Patron : " + stoppagePatronNumber + "\n" + "Expected Time : " + expectedTime + "\n" + "Actual Time : " + stoppageReachTime, icon: image, draggable: false, })
                    this.polyline.push({ lat: Number(stoppages.lattitude), lng: Number(stoppages.longitude), geodesic: true, strokeColor: "red", strokeOpacity: 0.3, strokeWeight: 2 });
                }
            }

        }
    }
   
 }


