import { Component, OnInit} from '@angular/core';
import {  SelectItem } from 'primeng/primeng';
import { ActivatedRoute } from '@angular/router';
import { SetupService } from '../../services/setup.service';
import { Observable } from 'rxjs/Rx';
import { AppSettings } from '../../services/global.constants';
import * as moment from 'moment';
declare var vis: any;
@Component({
    selector: 'mapview',
    template: require('./mapview.component.html'),
    providers: [SetupService],

    styles: [`
    .sebm-google-map-container {
       height:500px;
     }
  `],
})
    //push
export class MapViewComponent implements OnInit {
    selectedDate: string;
    RouteOption: any;
    RouteOverlays: Array<any>;
    StoppageOverlays: any[];
    infoWindow: any;
    msgs: any[] = [];
    markerTitle: string;
    selectedPosition: any;
    dialogVisible: boolean;
    draggable: boolean;
    transportRoute: TransportRouteDetail[];
    selectedRoute: string;
    routeList: SelectItem[];
    PatronList: SelectItem[];
    selectedroutes: TransportRouteDetail;
    routeMonitoring: RouteMonitoring;
    routeMonitoringDetails: RouteMonitoring[];
    routeNumber: string;
    driver: PersonDetail;
    routeStaff: PersonDetail;
    coordinator: PersonDetail;
    driverName: string;
    routeStaffName: string;
    coordinatorName: string;
    driverImage: string;
    coordinatorImage: string;
    routeStaffImage: string;
    routeSelected: string;
    transportStoppages: TransportStoppageDetail[];
    patron: PatronDetail | undefined = <PatronDetail>{};
    routeVisible: boolean = true;
    tabVisible1: boolean = true;
    tabVisible2: boolean = true;
    RouteMap: boolean = true;
    StoppageMap: boolean = true;
    patronStoppageSummaryArr: PatronStoppageSummary[];
    orgId: string | null = AppSettings.ORGANIZATION_ID;
    transportRouteTracking: TransportRouteTracking;
    stName: string;
    polyArr: Array<any>;
    poly: MapViewComponent;
    routeMonitor: RouteMonitor;
    routeMonitors: any[];
    routeMonitorList: Array<string[]>;
    visible: boolean = true;
    count: number = 0;
    patronDetail: boolean = false;
    patronLeaveInfoList: PatronLeaveDetail[] = [];
    patronInfoList: PatronSummary[];
    patronDetailList: PatronDetail[] = [];
    public transportRouteRunList: TransportRouteRun[];

    lat: number = 28.633161137544214;
    lng: number = 77.08655834197998;
    zoom: number = 12;
    markers: Marker[];
    orgMarkers: Marker[];
    stops: Marker[];
    polyline: Polyline[];
    orgDetails: Organization;
    schoolLat: string;
    schoolLng: string;
    schoolName: string;
    schoolIcon: string;
    navigatedRouteNumber: string;    
    personList: PersonDetail[];
    patronList: PatronDetail[];
    RoutedPage: boolean = true;
    timelineDiv: any;
    selectedTransportRun: TransportRouteRun;
    selectedRouteId: string;
    stoppageSummaryArr: PatronStoppageSummary[];
    items: any;
    timeline: any;
    elements: any;
    runDirection: string;
    headerColor: string = "Black";
    coveredStoppage: TransportRouteRunStoppage[];
    // start constructor operation
    constructor(private activatedRoute: ActivatedRoute, private _setupService: SetupService) {
        this.tabVisible1 = false;
        this.schoolIcon = AppSettings.SCHOOL_IMAGE;
        this.routeMonitoringDetails = [];
        this.selectedDate = AppSettings.CURRENT_DATE;
        if (this.timeline != undefined) {
            this.timeline.destroy();
        }
        
        // get transport route run by date
        this._setupService.GetCurrentRouteRun(this.selectedDate).subscribe(result => {
            this.transportRouteRunList = result;
            if (this.transportRouteRunList.find(x => x.runDirection == "2")) {
                this.runDirection = "2";
            }
            this._setupService.getTranportRoute().subscribe(result => {
                this.transportRoute = result;
                this.getAllRoutes();//call to getAllRoutes
                //Get RouteMonitoring Details
                this._setupService.getAllLocation(this.selectedDate).subscribe(result => {
                    this.routeMonitoringDetails = result;
                    this.initOverlay("All");
                });
                this._setupService.getOrganization().subscribe(result => {
                    this.orgDetails = result;
                    if (this.orgDetails != null) {
                        this.orgMarkers = [];
                        this.orgMarkers.push({ lat: Number(this.orgDetails.location.latitude), lng: Number(this.orgDetails.location.longitude), label: this.orgDetails.name, title: this.orgDetails.name, icon: this.schoolIcon, draggable: false, });
                    }
                });
                this.getAllRouteSummary(); //call to getAllRouteSummary
                this.tabVisible1 = false;
            });
        });
        this._setupService.getPerson().subscribe(result => {
            this.personList = result;
        });
        this._setupService.getPatron().subscribe(result => {
            this.patronList = result;
            this._setupService.getPatronOnLeave(this.selectedDate).subscribe(result => {
                this.patronLeaveInfoList = result;
            });
        });
        

        //Get Transport Route
        
        this.RouteOverlays = new Array();        
        Observable.interval(10000).subscribe(x => {
            //if (this.timeline != undefined) {
            //    this.timeline.destroy();
            //}
            //if (this.RoutedPage) {
            this._setupService.GetCurrentRouteRun(this.selectedDate).subscribe(result => {
                this.transportRouteRunList = result;
                if (this.transportRouteRunList.find(x => x.runDirection == "2")) {
                    this.runDirection = "2";
                }
            });
                this.selectRoute(this.selectedRoute);
                //this.RoutedPage = false;
            //}
        });
        
    }
    // End constructor operation

    ngOnInit() {
      
        this.activatedRoute.params.subscribe(params => {
            this.navigatedRouteNumber = params["routeNumber"];
               //this.selectRoute(this.selectedRoute);
        })
        this.routeVisible = true;

    }
    ngOnDestroy() {
        if (this.timeline != undefined) {
            this.timeline.destroy();
        }
        //alert("Navigated from Current Page");
        this.RouteMap = true;
        this.StoppageMap = false;
        this.tabVisible1 = false;
        this.tabVisible2 = true;
        this.stoppageSummaryArr = [];
    }



    // get selected Route Data
    selectRoute($event: any) {
        var elements = document.getElementsByTagName("div");
        //alert("elements.length = " + elements.length)
        for (var i = 0; i < elements.length; i++) {
            if (elements[i].id == "visualization") {
                
                this.timelineDiv = elements[i];
            }
        }
        
        this.selectedTransportRun = <TransportRouteRun>{};
        //this.stoppageSummaryArr = [];
        
        // execute when navigation came from Dashboard.
        var transportRoute: TransportRouteDetail | undefined = <TransportRouteDetail>{}
        if (this.navigatedRouteNumber != null) {
            transportRoute = this.transportRoute.find(x => x.routeNumber == this.navigatedRouteNumber);
            
            if (transportRoute != null) {
                this.selectedRoute = transportRoute.id;
            }
        }        
        var a = AppSettings.CURRENT_DATE;
        this.selectedDate = a;
        var personTracking: string[] = [];
        
        if (this.selectedRoute == undefined || this.selectedRoute == "AllRoute") {
            this.getAllRouteSummary();
            this._setupService.getAllLocation(this.selectedDate).subscribe(result => {
                this.routeMonitoringDetails = result;
                this.initOverlay("All");
            });
            this.RouteMap = true;
            this.StoppageMap = false;
            this.tabVisible1 = false;
            this.tabVisible2 = true;
        } else {
            this.driverImage = AppSettings.DEFAULT_IMAGE;
            this.coordinatorImage = AppSettings.DEFAULT_IMAGE;
            this.routeStaffImage = AppSettings.DEFAULT_IMAGE;
            this.driverName = AppSettings.NOTFOUND;
            this.coordinatorName = AppSettings.NOTFOUND;
            this.routeStaffName = AppSettings.NOTFOUND;
            this.routeSelected = this.selectedRoute;
            var person: PersonDetail | undefined = <PersonDetail>{};
            this.selectedTransportRun = this.transportRouteRunList.find(x => x.routeId == this.routeSelected);
            if (this.selectedTransportRun) {
                this.coveredStoppage = this.selectedTransportRun.stoppages;
                personTracking = this.selectedTransportRun.employees;
                if (personTracking.length > 0) {
                    for (var personId of personTracking) {
                        person = this.personList.find(x => x.id == personId);
                        if (person != null) {
                            if (person.role == "Driver") {
                                this.driverName = person.firstName + " " + person.lastName;
                                this.driverImage = person.imgUrl;
                            } else if (person.role == "Coordinator") {
                                this.coordinatorName = person.firstName + " " + person.lastName;
                                this.coordinatorImage = person.imgUrl;
                            } else if (person.role == "Teacher") {
                                this.routeStaffName = person.firstName + " " + person.lastName;
                                this.routeStaffImage = person.imgUrl;
                            }
                        }
                    }
                }
            
                if (this.driverName == AppSettings.NOTFOUND) {
                    person = this.personList.find(x => x.id == this.selectedTransportRun.driverId);
                        if (person != null) {
                            this.driverName = person.firstName + " " + person.lastName;
                            this.driverImage = person.imgUrl;
                        }
                    }
                if (this.coordinatorName == AppSettings.NOTFOUND) {
                    person = this.personList.find(x => x.id == this.selectedTransportRun.coordinatorId);
                        if (person != null) {
                            this.coordinatorName = person.firstName + " " + person.lastName;
                            this.coordinatorImage = person.imgUrl;
                        }
                    }
                if (this.routeStaffName == AppSettings.NOTFOUND) {
                    person = this.personList.find(x => x.id == this.selectedTransportRun.routeStaffId);
                        if (person != null) {
                            this.routeStaffName = person.firstName + " " + person.lastName;
                            this.routeStaffImage = person.imgUrl;
                        }
                    }
                
            } else {
                var transportRouteRun: TransportRouteDetail;
                transportRouteRun = this.transportRoute.find(x => x.id == this.routeSelected);
                if (transportRoute != null) {
                    if (this.driverName == AppSettings.NOTFOUND) {
                        person = this.personList.find(x => x.id == transportRouteRun.driverId);
                        if (person != null) {
                            this.driverName = person.firstName + " " + person.lastName;
                            this.driverImage = person.imgUrl;
                        }
                    }
                    if (this.coordinatorName == AppSettings.NOTFOUND) {
                        person = this.personList.find(x => x.id == transportRouteRun.coordinatorId);
                        if (person != null) {
                            this.coordinatorName = person.firstName + " " + person.lastName;
                            this.coordinatorImage = person.imgUrl;
                        }
                    }
                    if (this.routeStaffName == AppSettings.NOTFOUND) {
                        person = this.personList.find(x => x.id == transportRouteRun.routeStaffId);
                        if (person != null) {
                            this.routeStaffName = person.firstName + " " + person.lastName;
                            this.routeStaffImage = person.imgUrl;
                        }
                    }
                }
            }
            this.selectedroutes = this.transportRoute.find(x => x.id == this.routeSelected);
                if (this.selectedroutes != null) {
                    this.routeNumber = this.selectedroutes.routeNumber;
                    this.transportStoppages = this.selectedroutes.transportStoppages.sort(function (a, b) {
                        return a.sequence - b.sequence;
                    });
                    this._setupService.getAllLocation(this.selectedDate).subscribe(result => {
                        this.routeMonitoringDetails = result;
                        this.initOverlay("Route");
                        this.createPatronList();
                    });
                    //this.initOverlay("Route");
                    
                    
                }
            //});
            //alert("Route Selected");
            this.RouteMap = false;
            this.StoppageMap = true;
            this.tabVisible1 = true;
            this.tabVisible2 = false;
            
            
           
            
        }
    }

    // Get All route data and selected route data
    initOverlay(type: string) {
        this.markers = [];
        this.stops = [];
        this.polyline = [];

        var allRouteIcon = AppSettings.ALLROUTE_MARKER;
        var commingStopIcon = AppSettings.COMMING_STOP_MARKER;
        var coveredStopIcon = AppSettings.COVERED_STOP_MARKER;
        var bus = AppSettings.ROUTE_BUS;
        this.routeVisible = true;
        var transportRoute: TransportRouteDetail | undefined = <TransportRouteDetail>{};
        if (type == "All") {
            this.stops = [];
            this.polyline = [];
            var routeNumber: string = "0";
            for (var route of this.routeMonitoringDetails) {
                if (route.routeID != null) {
                    if (this.transportRoute.length > 0) {
                        transportRoute = this.transportRoute.find(x => x.id == route.routeID);
                        if (transportRoute != null) {
                            routeNumber = transportRoute.routeNumber;
                        }
                    }
                }
        
                this.markers.push({ lat: Number(route.location.latitude), lng: Number(route.location.longitude), label: '', title: '', icon: AppSettings.IMAGE_ENDPOINT + "bus" + transportRoute.routeNumber + ".png", draggable: false, });
            }

        }
        else {
            //alert("Setting Individual Map") ;
            this.stops = [];
            this.polyline = [];
            this.polyArr = new Array();
            var routeMonitoring: RouteMonitoring;
            transportRoute = this.transportRoute.find(x => x.id == this.selectedRoute);
            routeMonitoring = this.routeMonitoringDetails.find(x => x.routeID == this.selectedRoute);
            if (routeMonitoring) {
                this.markers.push({ lat: Number(routeMonitoring.location.latitude), lng: Number(routeMonitoring.location.longitude), label: '', title: '', icon: AppSettings.IMAGE_ENDPOINT + "bus" + transportRoute.routeNumber + ".png", draggable: false });
            }
            var stoppageTracking: TransportRouteRunStoppage | null | undefined = <TransportRouteRunStoppage>{};
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
                    this.stops.push({ lat: Number(stoppages.lattitude), lng: Number(stoppages.longitude), label: stoppages.sequence.toString(), title: stoppages.name + "\n" + "Expected Patron : " + stoppages.patronId.length + "\n" + "Actual Patron : " + stoppagePatronNumber + "\n" + "Expected Time : " + expectedTime + "\n" + "Actual Time : " + stoppageReachTime, icon: commingStopIcon, draggable: false, })
                    this.polyline.push({ lat: Number(stoppages.lattitude), lng: Number(stoppages.longitude), geodesic: true, strokeColor: "red", strokeOpacity: 0.3, strokeWeight: 2 });
                }
            }
        }
    } //End  operations

    //Get stoppage summary of All routes
    getAllRouteSummary() {
        //this._setupService.getTransportRouteRun(this.selectedDate).subscribe(result => {
        //    this.transportRouteRunList = result;
        //var routeDirection: TransportRouteRun | null = <TransportRouteRun>{};;
            var routeMonitor: RouteMonitor;
            var routeStoppage: TransportStoppageDetail[];
            var runRoutes: TransportRouteRun | undefined = <TransportRouteRun>{};
            //var pickRoute: TransportRouteRun[] = [];
            //var dropRoute: TransportRouteRun[] = [];
            var transportStoppageTracking: TransportRouteRunStoppage;
            this.routeMonitorList = new Array<string[]>();
            //routeDirection = this.transportRouteRunList.find(x => x.runDirection == "2");
            for (var route of this.transportRoute) {
                routeStoppage = [];
                runRoutes = this.transportRouteRunList.find(x => x.routeId == route.id);
                routeStoppage = route.transportStoppages.sort(function (a, b) {
                    return a.sequence - b.sequence;
                });
                //if (routeDirection != null && routeDirection.runDirection == "2") {
                if (this.runDirection == "2") {
                    routeStoppage = route.transportStoppages.sort(function (a, b) {
                        return b.sequence - a.sequence;
                    });
                    //pickRoute = runRoutes.filter(x => x.runDirection.toString() == "1");
                    //dropRoute = runRoutes.filter(x => x.runDirection.toString() == "2");
                }
                this.routeMonitors = [];
                //if (runRoutes != null) {
                //    alert("runRoutes.runDirection = " + runRoutes.runDirection);
                   
                //}
                
               // if (route.transportStoppages != null && route.transportStoppages.length > 0) {
                    //routeStoppage = route.transportStoppages.sort(function (a, b) {
                    //    return a.sequence - b.sequence;
                    //});
                    //if (runRoutes.length > 1) {
                    //    routeStoppage = route.transportStoppages.sort(function (a, b) {
                    //        return b.sequence - a.sequence;
                    //    });
                //}
                for (var stoppage of routeStoppage) {
                    //alert("stoppage = " + stoppage.name);
                        routeMonitor = <RouteMonitor>{};
                        routeMonitor.headerColor = "red";
                        routeMonitor.dropTime = "NA";
                        routeMonitor.dropCount = "0";
                        routeMonitor.pickUpTime = "NA";
                        routeMonitor.pickCount = "0";
                        routeMonitor.runDirection = "1";
                        if (runRoutes != null) {
                            transportStoppageTracking = runRoutes.stoppages.find(p => p.transportStoppageID == stoppage.id);
                            if (transportStoppageTracking != null) {

                                routeMonitor.headerColor = "green";
                                routeMonitor.pickUpTime = transportStoppageTracking.reachedTime;
                                routeMonitor.pickCount = transportStoppageTracking.patrons.length.toString();
                                routeMonitor.actualPickPatronId = transportStoppageTracking.patrons;
                                routeMonitor.dropTime = transportStoppageTracking.reachedTime;
                                routeMonitor.dropCount = transportStoppageTracking.patrons.length.toString();
                                routeMonitor.actualDropPatronId = transportStoppageTracking.patrons;
                                routeMonitor.runDirection = "1";
                                if (runRoutes.runDirection == "2") {
                                    //alert("Run Direction 2")
                                    routeMonitor.runDirection = "2";
                                }
                            }
                        }
                        //alert("transportStoppageTracking = " + transportStoppageTracking);
                        


                        //if (pickRoute.length > 0) {
                        //    transportStoppageTracking = pickRoute[0].stoppages.filter(p => p.transportStoppageID == stoppage.id);
                        //    if (transportStoppageTracking.length > 0) {
                        //        routeMonitor.headerColor = "green";
                        //        routeMonitor.pickUpTime = transportStoppageTracking[0].reachedTime;
                        //        routeMonitor.pickCount = transportStoppageTracking[0].patrons.length.toString();
                        //        routeMonitor.actualPickPatronId = transportStoppageTracking[0].patrons;
                        //        routeMonitor.runDirection = "1";
                        //    }
                        //}
                        //if (dropRoute.length > 0) {
                        //    transportStoppageTracking = [];
                        //    transportStoppageTracking = dropRoute[0].stoppages.filter(p => p.transportStoppageID == stoppage.id);
                        //    if (transportStoppageTracking.length > 0) {
                        //        routeMonitor.headerColor = "green";
                        //        routeMonitor.dropTime = transportStoppageTracking[0].reachedTime;
                        //        routeMonitor.dropCount = transportStoppageTracking[0].patrons.length.toString();
                        //        routeMonitor.actualDropPatronId = transportStoppageTracking[0].patrons;
                        //        routeMonitor.runDirection = "2";
                        //    }
                        //}
                        routeMonitor.expectedPatronId = stoppage.patronId;
                        routeMonitor.expectedPickTime = stoppage.pickupTime;
                        routeMonitor.expectedPickCount = stoppage.patronId.length.toString();
                        routeMonitor.expectedDropCount = stoppage.patronId.length.toString();
                        routeMonitor.expectedDropTime = stoppage.dropTime;
                        routeMonitor.routeId = route.routeNumber;
                        routeMonitor.stoppageName = stoppage.name;
                        routeMonitor.stopSequence = stoppage.sequence;
                        this.routeMonitors.push(routeMonitor);
                        
                    }
                //} 
                this.routeMonitorList.push(this.routeMonitors);
            }
        //});
    } //End operation

    // Get pick up data when click on a stoppage in route monitoring details
    getPickupData(col: RouteMonitor) {
        var patronSummary: PatronSummary;
        var patronDetail: PatronDetail;
        this.patronInfoList = [];
        if (col.actualPickPatronId != null && col.actualPickPatronId.length > 0 ) {
            for (var stoppagePatron of col.actualPickPatronId) {
                patronSummary = <PatronSummary>{};
                patronDetail = this.patronList.find(x => x.id == stoppagePatron);
                if (patronDetail != null) {
                    patronSummary.patron = patronDetail;
                    patronSummary.imgUrl = patronDetail.imgUrl;
                    if (col.actualPickPatronId.indexOf(stoppagePatron) > -1) {
                        status = "Picked";
                        patronSummary.patronStatus = status;
                        patronSummary.headerColor = "Green"
                    } else if (this.patronLeaveInfoList.find(x => x.patronId == stoppagePatron)) {
                        status = "OnLeave";
                        patronSummary.patronStatus = status;
                        patronSummary.headerColor = "Orange"
                    } else {
                        status = "Absent";
                        patronSummary.patronStatus = status;
                        patronSummary.headerColor = "red"
                    }
                    this.patronInfoList.push(patronSummary);
                }
            }
        } else {
            for (var stoppagePatron of col.expectedPatronId) {
                patronSummary = <PatronSummary>{};
                patronDetail = this.patronList.find(x => x.id == stoppagePatron);
                if (patronDetail != null) {
                    patronSummary.patron = patronDetail;
                    patronSummary.imgUrl = patronDetail.imgUrl;
                    if (this.patronLeaveInfoList.find(x => x.patronId == stoppagePatron)) {
                        status = "OnLeave";
                        patronSummary.patronStatus = status;
                        patronSummary.headerColor = "Orange"
                    } else {
                        status = "Absent";
                        patronSummary.patronStatus = status;
                        patronSummary.headerColor = "red"
                    }                   
                    this.patronInfoList.push(patronSummary);
                }
            }
        }
        this.patronDetail = true;
    }
    //End operation

    // Get getDropData  when click on a stoppage in route monitoring details
    getDropData(col: RouteMonitor) {        
        var patronSummary: PatronSummary;
        var patronDetail: PatronDetail;
        this.patronInfoList = [];
        if (col.actualDropPatronId != null && col.actualDropPatronId.length > 0) {         
            for (var stoppagePatron of col.actualDropPatronId) {
                patronSummary = <PatronSummary>{};
                patronDetail = this.patronList.find(x => x.id == stoppagePatron);
                if (patronDetail != null) {
                    patronSummary.patron = patronDetail;
                    patronSummary.imgUrl = patronDetail.imgUrl;
                    if (col.actualDropPatronId.indexOf(stoppagePatron) > -1) {
                        status = "Droped";
                        patronSummary.patronStatus = status;
                        patronSummary.headerColor = "Green"
                    } else if (this.patronLeaveInfoList.find(x => x.patronId == stoppagePatron)) {
                        status = "OnLeave";
                        patronSummary.patronStatus = status;
                        patronSummary.headerColor = "Orange"
                    } else {
                        status = "Absent";
                        patronSummary.patronStatus = status;
                        patronSummary.headerColor = "red"
                    }
                }
                this.patronInfoList.push(patronSummary);
            }
        } else {
            //alert("Expected");
            for (var stoppagePatron of col.expectedPatronId) {
                patronSummary = <PatronSummary>{};
                patronDetail = this.patronList.find(x => x.id == stoppagePatron);
                if (patronDetail != null) {
                    patronSummary.patron = patronDetail;
                    patronSummary.imgUrl = patronDetail.imgUrl;
                    if (this.patronLeaveInfoList.find(x => x.patronId == stoppagePatron)) {
                        status = "OnLeave";
                        patronSummary.patronStatus = status;
                        patronSummary.headerColor = "Orange"
                    } else {
                        status = "Absent";
                        patronSummary.patronStatus = status;
                        patronSummary.headerColor = "red"
                    }
                }
                this.patronInfoList.push(patronSummary);
            }
        }       
    }
    handleMapClick(event:any) {
        this.dialogVisible = true;
        this.selectedPosition = event.latLng;
    }


    //update Visibility

    updateVisibility(): void {
        this.visible = false;
        setTimeout(() => this.visible = true, 0);
        this.selectRoute(this.selectedRoute);
    }

    getAllRoutes() {
        this.routeList = [];
        this.routeList.push({ label: 'All Route',  value: 'AllRoute' });
        for (var route of this.transportRoute) {
            this.routeList.push({ label: "Route - " + route.routeNumber, value: route.id });
        }
    }

    createPatronList() {
        var selectedTransportRouteRunStoppage: TransportRouteRunStoppage ;
        this.patronStoppageSummaryArr = [];
        this.items = new vis.DataSet();
        var options = {};
        var currentTime = new Date();
        var month = currentTime.getMonth();
        var day = currentTime.getDate();
        var year = currentTime.getFullYear();
        if (this.runDirection == "2") {
            this.transportStoppages = this.transportStoppages.sort(function (a, b) {
                return b.sequence - a.sequence;
            });
        }
        for (var stoppage of this.transportStoppages) {
            var fields = stoppage.pickupTime.split(':');
            if (this.runDirection == "2") {
                var fields = stoppage.dropTime.split(':');
            }
            var hour = fields[0];
            var minute = Number(fields[1]);
            var scheduledTime = new Date(year, month, day, +hour, +minute);
            //alert("Selected Route Stoppages = " + this.selectedTransportRun.stoppages.length);
            if (this.selectedTransportRun) {
                selectedTransportRouteRunStoppage = this.selectedTransportRun.stoppages.find(x => x.transportStoppageID == stoppage.id);
                if (selectedTransportRouteRunStoppage != null) {
                    var fields = selectedTransportRouteRunStoppage.reachedTime.split(':');
                    var actualhour = fields[0];
                    var actualminute = Number(fields[1]);
                    var actualTime = new Date(year, month, day, +actualhour, +actualminute);
                    
                    if (actualTime.getTime() > scheduledTime.getTime()) {
                        this.items.add({
                            id: stoppage.id,
                            content: stoppage.name,
                            start: new Date(scheduledTime.getTime()),
                            className: 'red',
                            title: 'Reached At ' + selectedTransportRouteRunStoppage.reachedTime
                        });
                    }
                    else {
                        this.items.add({
                            id: stoppage.id,
                            content: stoppage.name,
                            start: new Date(scheduledTime.getTime()),
                            className: 'ontime'
                        });
                    }
                } else {
                    this.items.add({
                        id: stoppage.id,
                        content: stoppage.name,
                        start: new Date(scheduledTime.getTime() ),
                        className: 'nextstop'
                    });
                }
            } else {
                this.items.add({
                    id: stoppage.id,
                    content: stoppage.name,
                    start: new Date(scheduledTime.getTime()),
                    className: 'nextstop'
                });
            }
            for (var patronId of stoppage.patronId) {
                //this.stNameList.push(stoppage.name);
                this.patron = this.patronList.find(x => x.id == patronId);
                //this._setupService.getPatronById(pat).subscribe(result => {
                //    this.patron = result;
                if (this.patron != null) {
                    this.patronStoppageSummaryArr.push({
                        id: '',
                        name: this.patron.firstName + " " + this.patron.lastName,
                        //lastName: this.patronList.lastName,
                        patronClass: this.patron.class + " " + this.patron.section,
                        section: this.patron.section,
                        stoppageName: stoppage.name,//this.stNameList[this.count],
                        rollNumber: this.patron.rollNo,
                        imgUrl: this.patron.imgUrl,
                        reachedTime: '',
                        reachingTime: '',
                        status: '',
                        headerColor: this.headerColor,
                        headerValue:''
                    });
                    //this.count++;
                }
                //});
            }
        }  
        if (this.timeline != undefined) {
            this.timeline.destroy();
        }
        this.timeline = new vis.Timeline(this.timelineDiv, this.items, options);

        this.timeline.on('click', (properties) => {
            if (properties.item != null) {
                this.selectStoppage(properties);
            } else {
                console.log('non node element clicked');
            }
        });
         
    }
    selectStoppageOnhover(properties: any): void {
        //alert("properties = " + properties.item)
        var hoveredItem = document.getElementById('hoveredItem');
        
        if (hoveredItem != null) {
            hoveredItem.innerHTML = 'hoveredItem=' + properties.item;
        }
    }
    selectStoppage(properties: any): void {
        var patronStatus: string='Boarded';
        this.stoppageSummaryArr = [];
        this.headerColor = "Black";
        var selectedTransportStoppage: TransportRouteRunStoppage;
        var transportStoppage: TransportStoppageDetail;
        var actualStoppagePatron: string[]=[];
        var expectedStoppagePatron: string[]=[];
        var absentStoppagePatron: string[] = [];
        var totalStoppagePatron: string[] = [];;
        var stoppage: TransportStoppageDetail;
        var currentStoppage: TransportStoppageDetail;
        if (this.selectedTransportRun != null) {
            selectedTransportStoppage = this.selectedTransportRun.stoppages.find(x => x.transportStoppageID == properties.item);
            if (selectedTransportStoppage != null) {
                stoppage = this.transportStoppages.find(x => x.id == selectedTransportStoppage.transportStoppageID);
                actualStoppagePatron = selectedTransportStoppage.patrons;
                totalStoppagePatron = selectedTransportStoppage.patrons;
                expectedStoppagePatron = stoppage.patronId;               

                absentStoppagePatron = expectedStoppagePatron.filter(item => actualStoppagePatron.indexOf(item) < 0);
                if (absentStoppagePatron != null) {
                    totalStoppagePatron=actualStoppagePatron.concat(absentStoppagePatron);
                }
                for (var patronId of totalStoppagePatron) {
                    this.headerColor = "Black";
                    if (this.selectedTransportRun.runDirection == "1") {
                        if (stoppage.patronId.lastIndexOf(patronId) == -1) {
                            //patronStatus = "Boarded";
                            this.headerColor = "Blue";
                        }
                        if (selectedTransportStoppage.patrons.lastIndexOf(patronId) == -1) {
                            patronStatus = "Absent";
                            this.headerColor = "Red";
                            for (var stoppageId of this.selectedTransportRun.stoppages) {
                                if (stoppageId.patrons.lastIndexOf(patronId) > 0) {
                                    currentStoppage = this.transportStoppages.find(x => x.id == stoppageId.transportStoppageID);
                                    patronStatus = "Boarded From " + currentStoppage.name;
                                    this.headerColor = "Blue";
                                }
                            }
                            
                            
                        }
                        this.patron = this.patronList.find(x => x.id == patronId);
                        if (this.patron != null) {
                            this.stoppageSummaryArr.push({
                                id: '',
                                name: this.patron.firstName + " " + this.patron.lastName,
                                patronClass: this.patron.class + " " + this.patron.section,
                                section: this.patron.section,
                                stoppageName: stoppage.name,
                                rollNumber: this.patron.rollNo,
                                imgUrl: this.patron.imgUrl,
                                reachedTime: selectedTransportStoppage.reachedTime,
                                reachingTime: '',
                                status: patronStatus,
                                headerColor: this.headerColor,
                                headerValue:"Arrival Time"
                            });
                        }
                    } else {
                        
                        
                        if (selectedTransportStoppage.patrons.lastIndexOf(patronId) >= 0) {
                            patronStatus = "Droped";
                            this.headerColor = "Black";
                        } else {
                            if (this.selectedTransportRun.patrons.lastIndexOf(patronId) >= 0) {
                                patronStatus = "Boarded";
                                this.headerColor = "Black";
                            } else {
                                patronStatus = "Absent";
                                this.headerColor = "Red";
                            }
                        }
                        this.patron = this.patronList.find(x => x.id == patronId);
                        if (this.patron != null) {
                            this.stoppageSummaryArr.push({
                                id: '',
                                name: this.patron.firstName + " " + this.patron.lastName,
                                patronClass: this.patron.class + " " + this.patron.section,
                                section: this.patron.section,
                                stoppageName: stoppage.name,
                                rollNumber: this.patron.rollNo,
                                imgUrl: this.patron.imgUrl,
                                reachedTime: selectedTransportStoppage.reachedTime,
                                reachingTime: '',
                                status: patronStatus,
                                headerColor: this.headerColor,
                                headerValue: "Boarded Time"
                            });
                        }
                    }
                }
            } else {
                transportStoppage = this.selectedroutes.transportStoppages.find(x => x.id == properties.item);
                if (transportStoppage != null) {
                    actualStoppagePatron = transportStoppage.patronId;
                    for (var patronId of actualStoppagePatron) {
                        {
                            if (this.selectedTransportRun.runDirection == "1") {
                                this.patron = this.patronList.find(x => x.id == patronId);
                                if (this.patron != null) {
                                    this.stoppageSummaryArr.push({
                                        id: '',
                                        name: this.patron.firstName + " " + this.patron.lastName,
                                        patronClass: this.patron.class + " " + this.patron.section,
                                        section: this.patron.section,
                                        stoppageName: transportStoppage.name,//selectedTransportStoppage.name,//this.stNameList[this.count],
                                        rollNumber: this.patron.rollNo,
                                        imgUrl: this.patron.imgUrl,
                                        reachedTime: this.calculateEstimatedTime(transportStoppage.lattitude, transportStoppage.longitude, this.routeSelected),
                                        reachingTime: '', status: 'Waiting', headerColor: this.headerColor, headerValue: "ETA"
                                    });
                                }
                            } else {
                                if (this.selectedTransportRun.patrons.lastIndexOf(patronId) >= 0) {
                                    patronStatus = "Boarded";
                                    this.headerColor = "Black";
                                } else {
                                    patronStatus = "Absent";
                                    this.headerColor = "Red";
                                }
                                this.patron = this.patronList.find(x => x.id == patronId);
                                if (this.patron != null) {
                                    this.stoppageSummaryArr.push({
                                        id: '',
                                        name: this.patron.firstName + " " + this.patron.lastName,
                                        patronClass: this.patron.class + " " + this.patron.section,
                                        section: this.patron.section,
                                        stoppageName: transportStoppage.name,
                                        rollNumber: this.patron.rollNo,
                                        imgUrl: this.patron.imgUrl,
                                        reachedTime: transportStoppage.dropTime,
                                        reachingTime: '',
                                        status: patronStatus,
                                        headerColor: this.headerColor,
                                        headerValue: "Boarded Time"
                                    });
                                }
                            }
                        }
                    }
                }
            }
        } else {
            transportStoppage = this.selectedroutes.transportStoppages.find(x => x.id == properties.item);
            if (transportStoppage != null) {
                actualStoppagePatron = transportStoppage.patronId;
                for (var patronId of actualStoppagePatron) {
                    {
                        this.patron = this.patronList.find(x => x.id == patronId);
                        if (this.patron != null) {
                            this.stoppageSummaryArr.push({
                                id: '',
                                name: this.patron.firstName + " " + this.patron.lastName,
                                patronClass: this.patron.class.toString(),
                                section: this.patron.section,
                                stoppageName: transportStoppage.name,//selectedTransportStoppage.name,//this.stNameList[this.count],
                                rollNumber: this.patron.rollNo,
                                imgUrl: this.patron.imgUrl,
                                reachedTime: this.calculateEstimatedTime(transportStoppage.lattitude, transportStoppage.longitude, this.routeSelected),
                                reachingTime: '', status: 'Waiting', headerColor: this.headerColor, headerValue: "STA"
                            });
                        }
                    }
                }
            }
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
    download() {
        var tempList: any[] = [];
        for (var patron of this.patronInfoList) {
            tempList.push({
                "FirstName": patron.patron.firstName,
                "LastName": patron.patron.lastName,
                "Class": patron.patron.class,
                "Section": patron.patron.section,
                "RollNo": patron.patron.rollNo,
                "Status": patron.patronStatus,

            });
        }
        var csvData = this.ConvertToCSV(tempList);
        var a = document.createElement("a");
        a.setAttribute('style', 'display:none;');
        document.body.appendChild(a);
        var blob = new Blob([csvData], { type: 'text/csv' });
        var url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = 'StudentList.csv';
        a.click();
    }

    ConvertToCSV(objArray:any) {
        var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
        var str = '';
        var row = "";
        for (var index in objArray[0]) {
            //Now convert each value to string and comma-separated
            row += index + ',';
        }
        row = row.slice(0, -1);
        //append Label row with line break
        str += row + '\r\n';
        for (var i = 0; i < array.length; i++) {
            var line = '';
            for (var index in array[i]) {
                if (line != '') line += ','
                line += array[i][index];
            }
            str += line + '\r\n';
        }
        return str;
    }
}


