import * as ng from '@angular/core';
import { OnInit } from '@angular/core';
import { FormControl, FormBuilder, Validators, FormGroup } from '@angular/forms';
import {SelectItem, ConfirmationService,Message} from 'primeng/primeng';
import { SetupService, Sequence } from '../../services/setup.service';
import { UUID } from 'angular2-uuid';
import * as moment from 'moment';
import { AppSettings } from '../../services/global.constants';


@ng.Component({
    selector: 'transportroutelist',
    template: require('./transportroutelist.component.html'),
    providers: [ConfirmationService, SetupService],
    styles: [`
    .sebm-google-map-container {
       height:446px;
     }
  `],
})

export class TransportRouteListComponent implements OnInit {
    transportForm: FormGroup;
    stoppageForm: FormGroup;
    msgs: Message[] = [];
    text: string;
    selectedPatronDetail: PatronDetail;
    patronDetails: PatronDetail[];    
    patronMapDialog: boolean;    
    stoppageDialog: boolean;
    transportRouteDialog: boolean;  
    personDetail: PersonDetail;  
    public transportRouteDetails: TransportRouteDetails[];   
    transportStoppageDetail: TransportStoppageDetail;   
    transportRouteDetail: TransportRouteDetail;
    selectedDriver: PersonDetail | undefined = <PersonDetail>{};
    selectedCoordinator: PersonDetail | undefined = <PersonDetail>{};
    selectedRouteStaff: PersonDetail | undefined = <PersonDetail>{};   
    tRouteDetails: TransportRouteDetails[];   
    selectedSequence: number;
    pDetails: PersonDetail[];
    driverList: SelectItem[];
    coordinatorList: SelectItem[];
    routeStaffList: SelectItem[];    
    sequence: Sequence[];
    sequenceList:SelectItem[]; 
    tDetails: TransportRouteDetail;
    selectedStoppage: TransportStoppageDetail;
    stoppageList: SelectItem[];
    routeId: string;   
    selectedRoutePatron: PatronSummary;           //show/hide lattitude and longitude when select map
    mapVisible: boolean = false;             // use dialog and map      
    resulArr: Array<any>;
    orgId: string = AppSettings.ORGANIZATION_ID;;  
    selectedRouteStoppage: TransportStoppageDetail[];   
    sequenceStoppage: TransportStoppageDetail[]; 
    stoppagePatron: string[];
    selectedTab: number = 1;
    selectedStoppageId: string;
    lat: number;
    lng: number;
    lat1: string;
    lng2: string;
    zoom: number = 12;
    markers: Marker[];
    selectedPatronroutes: TransportRouteDetail;
    patronWithStoppage: PatronSummary | undefined = <PatronSummary>{};
    patronWithStoppageList: PatronSummary[];
    loading: boolean;
    org: Organization;
    orgMarkers: Marker[];
    selectLocation: Marker[];
    schoolIcon: string = AppSettings.SCHOOL_IMAGE;
    tab1stoppage: boolean = true;
    tab2stoppage: boolean = true;
    locationicon: string = AppSettings.STOPPAGE_IMAGE;
    startSequence: number;
    seqList: SelectItem[]; 
    stoppageHeader: string;
    patronTransportInfo: PatronTransportInfo;
    patronRouteList: PatronTransportInfo[];
    tempPatronRouteList: PatronTransportInfo[];
    filteredPatronList: PatronTransportInfo[];
    tempDriverList: SelectItem[] = [];
    tempCoordinateList: SelectItem[] = [];
    tempRouteStaffList: SelectItem[] = [];
    transportRoute: TransportRouteDetail | undefined = <TransportRouteDetail>{};
    transportStoppage: TransportStoppageDetail | undefined = <TransportStoppageDetail>{};
    constructor(private confirmationService: ConfirmationService, private _setupService: SetupService, private fb: FormBuilder) {
       
       
        this.loading = true;
        
        // Get Organization Detail
        this._setupService.getOrganization().subscribe(result => {
            this.org = result;
        });
      
        // get data from transport route show in list-- RouteDetails
        
        this._setupService.getTranportRouteWithDetails().subscribe(result => {
            this.tRouteDetails = result;
            this._setupService.getPerson().subscribe(result => {
                this.pDetails = result;
                this.createPersonList();
                this.getPersonData();
                this.createPatronList();
            });
                        
            });
       
        this.sequence = this._setupService.getSequence();
        this.sequenceList = [];
        //this.sequenceList.push({ label: 'Sequence', value: null });
        for (var i = 0; i < this.sequence.length; i++) {
            this.sequenceList.push({ label: this.sequence[i].id.toString(), value: this.sequence[i].name });
        }
       
        //Get person detail
       
        this.transportRouteDetail = {
            id: '',
            driver: this.personDetail,
            driverId: '',
            coordinator: this.personDetail,
            coordinatorId: '',
            routeNumber: '',
            registrationNumber: '',
            routeStaff: this.personDetail,
            routeStaffId: '',
            description: '',
            remarks: '',
            createDate: new Date(),
            lastUpdated: new Date(),
            transportStoppages: [],
            organizationid: this.orgId

        };

        //initilize stoppage component value
        this.transportStoppageDetail = {
            id: UUID.UUID(),
            name: '',
            sequence: 0,
            lattitude: '',
            longitude: '',
            pickupTime: '',
            dropTime: '',
            description: '',
            organizationid: this.orgId,
            patronId: [],
            createDate: new Date(),
            lastUpdated: new Date()
        };

         
    }
   
    createPatronList() {
        //alert("creating fresh list");
        var transportRoute: TransportRouteDetail;
        var transportStoppage: TransportStoppageDetail;
        this.patronRouteList = [];
        this._setupService.getPatron().subscribe(result => {
            this.patronDetails = result;
            for (var patron of this.patronDetails) {
                this.patronTransportInfo = <PatronTransportInfo>{};
                this.patronTransportInfo.id = patron.id;
                this.patronTransportInfo.imagePath = patron.imgUrl;
                this.patronTransportInfo.firstName = patron.firstName;
                this.patronTransportInfo.lastName = patron.lastName;
                this.patronTransportInfo.class = patron.class.toString();
                this.patronTransportInfo.section = patron.section;
                transportRoute = this.tRouteDetails.find(x => x.id == patron.transportRouteId);
                if (transportRoute) {
                    this.patronTransportInfo.routeNumber = transportRoute.routeNumber;
                    this.patronTransportInfo.transportRouteId = transportRoute.id;
                    transportStoppage = transportRoute.transportStoppages.find(x => x.id == patron.stoppageId)
                    if (transportStoppage) {
                        this.patronTransportInfo.stoppagename = transportStoppage.name;
                        this.patronTransportInfo.stoppageId = transportStoppage.id;
                    }
                    else {
                        this.patronTransportInfo.stoppagename = "NA";
                        this.patronTransportInfo.stoppageId = "NA";
                    }
                }
                else {
                    this.patronTransportInfo.routeNumber = "NA";
                    this.patronTransportInfo.stoppagename = "NA";
                    this.patronTransportInfo.transportRouteId = "NA";
                    this.patronTransportInfo.stoppageId = "NA";
                }

                this.patronRouteList.push(this.patronTransportInfo);
                
            }
            
        });       
    }
    getTransport() {
       
        this._setupService.getTranportRouteWithDetails().subscribe(result => {
            this.tRouteDetails = result;
            this._setupService.getPerson().subscribe(result => {
                this.pDetails = result;
                this.createPersonList();
                this.getPersonData();
            });
           
        });
    }
    getPersonData() {       
        this.loading = false;
        var personInfo: PersonDetail | undefined = <PersonDetail>{};
        this.transportRouteDetails = [];
        for (var item of this.tRouteDetails) {
            personInfo = this.pDetails.find(x => x.id == item.driverId);
            if (personInfo != null) {
                item.driverName = personInfo.firstName + " " + personInfo.lastName;
                item.driverImage = personInfo.imgUrl;
                personInfo = this.pDetails.find(x => x.id == item.coordinatorId);
                if (personInfo != null) {
                    item.coordinatorName = personInfo.firstName + " " + personInfo.lastName;
                    item.coordinatorImage = personInfo.imgUrl;
                    personInfo = this.pDetails.find(x => x.id == item.routeStaffId);
                    if (personInfo != null) {
                        item.routeStaffName = personInfo.firstName + " " + personInfo.lastName;
                        item.routeStaffImage = personInfo.imgUrl;
                    }
                }
            }
            this.transportRouteDetails.push(item);
         }

    }
   

    // show driver,coordinator,routestaff list in dropdown 
    createPersonList() {
        this.driverList = [];
        //this.driverList.push({ label: AppSettings.DRIVER, value: '' });
        this.coordinatorList = [];
      //  this.coordinatorList.push({ label: AppSettings.COORDINATOR, value: '' });
        this.routeStaffList = [];
      //  this.routeStaffList.push({ label: AppSettings.TEACHER, value: '' });
        for (var i = 0; i < this.pDetails.length; i++) {
            if (this.pDetails[i].role == AppSettings.DRIVER) {
                if (!this.tRouteDetails.find(x => x.driverId == this.pDetails[i].id)) {
                    this.driverList.push({ label: this.pDetails[i].firstName + " " + this.pDetails[i].lastName, value: this.pDetails[i] });
                }
            }
            if (this.pDetails[i].role == AppSettings.COORDINATOR) {
                if (!this.tRouteDetails.find(x => x.coordinatorId == this.pDetails[i].id)) {
                    this.coordinatorList.push({ label: this.pDetails[i].firstName + " " + this.pDetails[i].lastName, value: this.pDetails[i] });
                }
            }
            if (this.pDetails[i].role == AppSettings.TEACHER) {
                if (!this.tRouteDetails.find(x => x.routeStaffId == this.pDetails[i].id)) {
                    this.routeStaffList.push({ label: this.pDetails[i].firstName + " " + this.pDetails[i].lastName, value: this.pDetails[i] });
                }
            }
            //alert("image = " + this.driverList[0].value);
        }
        this.tempDriverList = this.driverList;
        this.tempCoordinateList = this.coordinatorList;
        this.tempRouteStaffList = this.routeStaffList;
    }


    
    // function for add new transport route
    addTransportRoute() {
        this.driverList = [];
        this.driverList = this.tempDriverList;
        this.coordinatorList = [];
        this.coordinatorList = this.tempCoordinateList;
        this.routeStaffList = [];
        this.routeStaffList = this.tempRouteStaffList;
        this.transportRouteDetail = {
            id: '',
            driver: this.personDetail,
            driverId: '',
            coordinator: this.personDetail,
            coordinatorId: '',
            routeNumber: '',
            registrationNumber: '',
            routeStaff: this.personDetail,
            routeStaffId: '',
            description: '',
            remarks: '',
            createDate: new Date(),
            lastUpdated: new Date(),
            transportStoppages: [],
            organizationid: this.orgId

        };
        this.selectedDriver = this.personDetail; // empty driver in form before add
        this.selectedCoordinator = this.personDetail;  // empty Coordinator in form before add
        this.selectedRouteStaff = this.personDetail; // empty Staff in form before add
        this.transportValidation();
        this.transportRouteDialog = true;
    }

    // method for create and edit transport route
    createTransportRoute() {
        if (this.selectedCoordinator != null) {
            this.transportRouteDetail.coordinatorId = this.selectedCoordinator.id;
        }
        if (this.selectedDriver != null) {
            this.transportRouteDetail.driverId = this.selectedDriver.id;
        }
        if (this.selectedRouteStaff != null) {
            this.transportRouteDetail.routeStaffId = this.selectedRouteStaff.id;
        }               
        if (this.transportRouteDetail.id) {
            this._setupService.updatetransportroute(this.transportRouteDetail.id, this.transportRouteDetail).subscribe(result => {
                if (result == 204) {
                    this._setupService.getTranportRouteWithDetails().subscribe(result => {
                        this.tRouteDetails = result;
                        if (this.tRouteDetails.length > 0) {
                            this.getPersonData();
                        }
                    });
                    this.msgs = [];
                    this.msgs.push({ severity: 'success', summary: 'Route update successfully' });
                    this.transportRouteDialog = false;
                }
            });
        }
        else {
            this._setupService.createTransportRoute(this.transportRouteDetail).subscribe(result => {
                if (result == 204) {
                    this._setupService.getTranportRouteWithDetails().subscribe(result => {
                        this.tRouteDetails = result;
                        if (this.tRouteDetails.length > 0) {
                            this.getPersonData();
                        }
                    });
                    this.msgs = [];
                    this.msgs.push({ severity: 'success', summary: 'Route saved successfully' });
                    this.transportRouteDialog = false;
                }

            });

        }
    }
    transportValidation() {
        this.transportForm = this.fb.group({
            'routeNumber': new FormControl('', [Validators.required, Validators.pattern('[0-9]+')]),
            'registrationNumber': new FormControl('', Validators.required),
            'driverList': new FormControl('', Validators.required),
            'coordinatorList': new FormControl('', Validators.required),
            'routeStaffList': new FormControl('', Validators.required),
            'description': new FormControl('', Validators.required),
            'remarks': new FormControl(''),
            'transportid': new FormControl(''),
        });
    }

   

    //method for upadate transport route
    updateTransportRoute(transportRouteDetail: TransportRouteDetail) {
        this.createPersonList();
        this.transportRouteDetail = transportRouteDetail;
        
        
        this.selectedDriver = this.pDetails.find(x => x.id == this.transportRouteDetail.driverId);
        if (this.selectedDriver != null) {
            this.driverList.push({ label: this.selectedDriver.firstName + " " + this.selectedDriver.lastName, value: this.selectedDriver });
        }
      //  this.driverList.push({ label: this.selectedDriver.firstName + " " + this.pDetails[i].lastName, value: this.pDetails[i] });
        this.selectedCoordinator = this.pDetails.find(x => x.id == this.transportRouteDetail.coordinatorId);
        if (this.selectedCoordinator != null) {
            this.coordinatorList.push({ label: this.selectedCoordinator.firstName + " " + this.selectedCoordinator.lastName, value: this.selectedCoordinator });
        }
        this.selectedRouteStaff = this.pDetails.find(x => x.id == this.transportRouteDetail.routeStaffId);
        if (this.selectedRouteStaff != null) {
            this.routeStaffList.push({ label: this.selectedRouteStaff.firstName + " " + this.selectedRouteStaff.lastName, value: this.selectedRouteStaff });
        }
        this.transportRouteDialog = true;
        
    }

    // delete transport route
    deleteTransportRoute(transportRouteDetail: TransportRouteDetail) {
        this.confirmationService.confirm({
            message: 'Do you want to delete this Route?',
            header: 'Delete Confirmation',
            icon: 'fa fa-trash',
            accept: () => {
                this._setupService.deleteTransportRoute(transportRouteDetail.id).subscribe(response => {
                    if (response === 204) {
                        //this.transportRouteDetails.forEach((u: TransportRouteDetail, i) => {
                        //    if (u.id === transportRouteDetail.id) {
                        //        this.transportRouteDetails.splice(i, 1);
                        //    }
                        //});
                        this.transportRouteDetails = this.transportRouteDetails.filter(x => x.id != transportRouteDetail.id);
                        this.msgs = [];
                        this.msgs.push({ severity: 'error', summary: 'Route deleted successfully' });
                    }
                });
                this._setupService.deleteRoutesFromPatron(transportRouteDetail).subscribe((result) => {

                });
            }
        });
    }

    // Add Stoppage
    addStoppage(transportRoueDetail: TransportRouteDetail) {
        this.routeId = transportRoueDetail.id;
        this.flushStoppage();
        this.stoppageValidation();
        this.updateStoppage(null);
        this.selectedTab = 1;
        this.stoppageDialog = true;
        this.tab1stoppage = true;
        this.tab2stoppage = false;
    }

    cancelTransportStoppage(number:number) {
        this.tab1stoppage = true;
        this.tab2stoppage = false;
        this.selectedTab = number;
    }
    // create stoppage
    createTransportStoppage(number: number) {             
        this.tab1stoppage = true;
        this.tab2stoppage = false;
        this.selectedTab = number;
        var a = this.transportStoppageDetail.pickupTime;
        var b = moment(a, 'H:mm').format('H:mm');
        this.transportStoppageDetail.pickupTime = b;
        var c = this.transportStoppageDetail.dropTime;
        var d = moment(c, 'H:mm').format('H:mm');
        this.transportStoppageDetail.dropTime = d; 
        this.transportStoppageDetail.sequence = this.selectedSequence;
        if (this.routeId) { 
            this._setupService.createTransportStoppage(this.routeId, this.transportStoppageDetail).subscribe(result => {
                this.transportRouteDetail = result;
                this.selectedRouteStoppage = this.transportRouteDetail.transportStoppages;
                this._setupService.getTranportRouteWithDetails().subscribe(result => {
                    this.tRouteDetails = result;
                    this._setupService.getPerson().subscribe(result => {
                        this.pDetails = result;
                        this.createPersonList();
                        this.getPersonData();

                    });
                });
                this.flushStoppage();           
                this.msgs = [];
                this.msgs.push({ severity: 'success', summary: AppSettings.STOPPGAE_SAVED });
            });
            
        }
       
    }
    stoppageValidation() {
        this.stoppageForm = this.fb.group({
            'name': new FormControl('', Validators.required),
            'seqList': new FormControl('', Validators.required),
            'lattitude': new FormControl(''),
            'longitude': new FormControl(''),
            'pickupTime': new FormControl('', Validators.required),
            'dropTime': new FormControl('', Validators.required),
            'description': new FormControl(''),
           
        });
    }
    // update Stoppage
    updateStoppage(stoppageId: string) {
        //this.patronWithStoppageList = [];
       // this.getTransport();
        this.selectedStoppageId = stoppageId;
        this.resulArr = [];
        var routeDetail: TransportRouteDetail | undefined = <TransportRouteDetail>{};
        this.patronWithStoppageList = [];
        var patron: PatronDetail | undefined = <PatronDetail>{};
        var selectStoppage: TransportStoppageDetail | undefined = <TransportStoppageDetail>{};
        routeDetail = this.tRouteDetails.find(x => x.id == this.routeId);
        if (stoppageId != null) {          
            this.selectLocation = [];
            if (routeDetail != null) { 
                selectStoppage = routeDetail.transportStoppages.find(s => s.id == this.selectedStoppage.id);
                if (selectStoppage != null) {
                    this.transportStoppageDetail = selectStoppage;
                    this.selectedSequence = this.transportStoppageDetail.sequence;
                   
                    this.selectLocation.push({ lat: Number(this.transportStoppageDetail.lattitude), lng: Number(this.transportStoppageDetail.longitude), icon: this.locationicon, draggable: true, })
                    this.stoppagePatron = selectStoppage.patronId;
                    for (var i = 0; i < this.stoppagePatron.length; i++) {
                        patron = this.patronDetails.find(x => x.id == this.stoppagePatron[i]);
                        if (patron != null) {
                            this.patronWithStoppage = <PatronSummary>{};
                            this.patronWithStoppage.patron = patron;
                            this.patronWithStoppage.imgUrl = patron.imgUrl;
                            this.patronWithStoppage.stoppageName = selectStoppage.name,
                                this.patronWithStoppageList.push(this.patronWithStoppage);
                            
                        }
                    }
                }
        }

        } else {   
            if (routeDetail != null) {
                this.selectedRouteStoppage = routeDetail.transportStoppages;
                
                for (var stoppage of this.selectedRouteStoppage) {
                    this.stoppagePatron = stoppage.patronId;
                    for (var i = 0; i < this.stoppagePatron.length; i++) {
                        patron = this.patronDetails.find(x => x.id == this.stoppagePatron[i]);
                        if (patron != null) {
                            this.patronWithStoppage = <PatronSummary>{};
                            this.patronWithStoppage.patron = patron;
                            this.patronWithStoppage.imgUrl = patron.imgUrl;
                            this.patronWithStoppage.stoppageName = stoppage.name,
                            this.patronWithStoppageList.push(this.patronWithStoppage);
                        }
                    }
                }
            }
        }
        
    }

    flushStoppage() {
        this.transportStoppageDetail = {
            id: UUID.UUID(),
            name: '',
            sequence: 0,
            lattitude: '',
            longitude: '',
            pickupTime: '',
            dropTime: '',
            description: '',
            patronId: [],
            createDate: new Date(),
            lastUpdated: new Date(),
            organizationid: this.orgId
        };
    }

    handleChange(e:number) {
        this.selectedTab = 1;
    }

    unmappedPatron(e: any) {
        var isChecked = e.checked;
        if (isChecked) {
            this.tempPatronRouteList = this.patronRouteList;
            this.filteredPatronList = this.patronRouteList.filter(x => x.routeNumber == "NA" || x.stoppagename == "NA");
            this.patronRouteList = this.filteredPatronList;
        } else {
            this.patronRouteList = this.tempPatronRouteList;
        }
    }

    activateTab(tabNumber: number, mode: string) {
        
        this.seqList = [];
        this.mapVisible = true;
        this.orgMarkers = [];
        this.orgMarkers.push({ lat: Number(this.org.location.latitude), lng: Number(this.org.location.longitude), icon: this.schoolIcon, label: this.org.name, draggable: false, })
        this.lat1 = this.org.location.latitude;
        this.lng2 = this.org.location.longitude;
        if (mode == 'add') {
            this.stoppageHeader = "Add Stop"
            for (var sequence of this.sequenceList) {
                if (!this.selectedRouteStoppage.find(x => x.sequence == sequence.value)) {
                    this.seqList.push(sequence);
                }
            }
          
            this.startSequence = this.selectedRouteStoppage.length;
            this.tab1stoppage = false;
            this.tab2stoppage = true;
            this.selectLocation = [];
            this.transportStoppageDetail = <TransportStoppageDetail>{};
            this.flushStoppage();
            this.selectedTab = tabNumber;
            
        }
        if (mode == 'edit') {
            this.stoppageHeader = "Edit Stop"
            var editSequence: SelectItem | undefined = <SelectItem>{};
                editSequence = this.sequenceList.find(x => x.value == this.transportStoppageDetail.sequence.toString());
                if (editSequence != null) {
                    this.seqList.push(editSequence);
                }
            //this.seqList = this.transportStoppageDetail.sequence;
            if (this.selectedStoppageId == null) {
                this.tab1stoppage = true;
                this.tab2stoppage = false;
                this.msgs = [];
                this.msgs.push({ severity: 'warn', summary: 'Please select a stoppage' });

            }
            else {
                this.tab1stoppage = false;
                this.tab2stoppage = true;
                this.selectedSequence = this.transportStoppageDetail.sequence;
                //this.seqList.push();
                //alert("this.selectedSequence = " + this.selectedSequence);
                this.selectedTab = tabNumber;
            }
        }
    }

    //    
    //DeleteStoppage
    deleteStoppage(stopaggeInfo: TransportStoppageDetail) {
        if (this.selectedStoppage == null) {
            this.msgs = [];
            this.msgs.push({ severity: 'warn', summary: 'Please select a stoppage' });
        } else {           
            this.confirmationService.confirm({
                message: 'Do you want to delete this record?',
                header: 'Delete Confirmation',
                icon: 'fa fa-trash',
                accept: () => {
                    this._setupService.deleteTransportStoppage(this.routeId, stopaggeInfo.id).subscribe(response => {
                        if (response === 200) {
                            //this.selectedRouteStoppage.forEach((u: TransportStoppageDetail, i) => {
                            //    if (u.id == stopaggeInfo.id) {
                                    this.selectedRouteStoppage = this.selectedRouteStoppage.filter(x => x.id != stopaggeInfo.id);
                                    //this.selectedRouteStoppage.splice(i, 1);
                                    this.flushStoppage();
                                    this.patronWithStoppageList = [];
                            //    }
                            //});
                            this.msgs = [];
                            this.msgs.push({ severity: 'error', summary: 'Stoppage deleted successfully' });
                        }
                    });
                }
            });
        }
    }

    ngOnInit() {       
        this._setupService.getTransportRouteById(this.transportRouteDetail.id).subscribe(result => {
            this.transportRouteDetail = result;
        });
        this.transportValidation();
        this.stoppageValidation();
    }


    // method for click event in map
    handleMapClick($event: MouseEvent) {
        this.selectLocation = [];
        this.transportStoppageDetail.lattitude = $event.coords.lat;
        this.transportStoppageDetail.longitude = $event.coords.lng;
        this.locationicon = AppSettings.STOPPAGE_IMAGE;
        this.selectLocation.push({ lat: Number(this.transportStoppageDetail.lattitude), lng: Number(this.transportStoppageDetail.longitude), icon: this.locationicon, draggable: true, })
    }



    // create stoppage list in dropdown
    createStoppageList() {
        this.stoppageList = [];
        this.stoppageList.push({ label: 'Stoppage', value: null });
        for (var i = 0; i < this.tDetails.transportStoppages.length; i++) {
            this.stoppageList.push({ label: this.tDetails.transportStoppages[i].name, value: this.tDetails.transportStoppages[i] });
        }
    }

    addpatron(transportRoueDetail: TransportRouteDetail) {
        this.routeId = transportRoueDetail.id;
        this._setupService.getTransportRouteById(transportRoueDetail.id).subscribe(result => {
            this.tDetails = result;
            this.createStoppageList();
            this._setupService.getPatron().subscribe(result => {
                this.patronDetails = result;
            })
        });
        this.patronMapDialog = true;
    }

    removePatron(selectedRoutePatron: PatronSummary, selectedStoppage: TransportStoppageDetail) {
        
        if (selectedStoppage == null || selectedRoutePatron == null) {
            this.msgs = [];
            this.msgs.push({ severity: 'warn', summary: 'Please select stoppage and patron' });
        } else {
            this.confirmationService.confirm({
                message: 'Do you want to Remove the Patron?',
                header: 'Remove Patron',
                icon: 'fa fa-trash',
                accept: () => {
                    this._setupService.RemovePatronToStoppage(this.routeId, selectedStoppage.id, selectedRoutePatron.patron.id).subscribe(response => {                       
                        if (response === 200) {
                            this.removePatronWithTransport(selectedRoutePatron.patron.id);
                            //this.patronWithStoppageList.forEach((u: PatronSummary, i) => {
                                //if (u.patron.id === selectedRoutePatron.patron.id) {
                            
                            this.patronWithStoppageList = this.patronWithStoppageList.filter(x => x.patron.id != selectedRoutePatron.patron.id);
                                    //this.patronWithStoppageList.splice(i, 1);                                    
                                    this._setupService.getPatron().subscribe(result => {
                                        this.patronDetails = result;
                                        this.createPatronList();
                                    });
                                    this.getTransport();
                                //}
                            //});
                            this.msgs = [];
                            this.msgs.push({ severity: 'error', summary: 'Patron removed successfully' });
                        }
                    });
                }
            });
        }
    }
   
    mapPatron(selectedPatron: PatronDetail, selectedStoppage: TransportStoppageDetail) {
        var patron: PatronDetail | undefined = <PatronDetail>{};
        var patronInfo: string[];
        if (selectedPatron == null) {
            this.msgs = [];
            this.msgs.push({ severity: 'warn', summary: 'Please select at least one patron' });
        } else {
            patronInfo = [];
            //var stoppagePatron: StoppagePatron;
           
            if (selectedPatron.transportRouteId == null || selectedPatron.transportRouteId == "") {
                this._setupService.addPatronToStoppage(this.routeId, selectedStoppage.id, selectedPatron.id).subscribe(result => {
                    //this._setupService.getStoppagePatrons(selectedStoppage.id).subscribe(result => {
                    //    patronInfo = result;
                        patronInfo = selectedStoppage.patronId;
                        patronInfo.push(selectedPatron.id);
                        this.updatePatronWithTransport(selectedPatron.id, selectedStoppage.id);
                        this.patronWithStoppageList = [];
                        for (var patronId of patronInfo) {
                            //stoppagePatron = patronInfo[i];
                            patron = this.patronDetails.find(x => x.id == patronId);
                            
                            if (patron != null) {
                                this.patronWithStoppage = <PatronSummary>{};
                                this.patronWithStoppage.patron = patron;
                                this.patronWithStoppage.imgUrl = patron.imgUrl;
                                //this.patronWithStoppage.stoppageName = selectedStoppage.name,
                                this.patronWithStoppageList.push(this.patronWithStoppage);
                                this.getTransport();
                                this.msgs = [];
                                this.msgs.push({ severity: 'success', summary: 'Patron mapped successfully' });
                            }
                        }
                        this._setupService.getPatron().subscribe(result => {
                            this.patronDetails = result;
                        });
                    //});
                });
            } else {
                var routeName;
                var routestop: TransportStoppageDetail | undefined = <TransportStoppageDetail>{};
                this._setupService.getTransportRouteById(selectedPatron.transportRouteId).subscribe(result => {
                    this.selectedPatronroutes = result;
                    routeName = this.selectedPatronroutes.routeNumber;
                    routestop = this.selectedPatronroutes.transportStoppages.find(x => x.id == selectedPatron.stoppageId)
                    if (routestop != null) {
                        this.confirmationService.confirm({
                            message: "<b>" + selectedPatron.firstName + " " + selectedPatron.lastName + "</b>" + ' Already mapped with ' + "<b>" + routestop.name + "</b>" + ' of route number ' + "<b>" + routeName + "</b>" + '.Do you want to Overwrite ?',
                            header: 'Map Patron',
                            icon: 'fa fa-trash',
                            accept: () => {
                                this._setupService.RemovePatronToStoppage(selectedPatron.transportRouteId, selectedPatron.stoppageId, selectedPatron.id).subscribe(response => {
                                    if (response === 200) {
                                        this.updatePatronWithTransport(selectedPatron.id, selectedStoppage.id);
                                        this._setupService.addPatronToStoppage(this.routeId, selectedStoppage.id, selectedPatron.id).subscribe(response => {
                                            this._setupService.editTransportStoppage(this.routeId, selectedStoppage.id).subscribe(result => {
                                                this.resulArr = result;
                                                this.transportStoppageDetail = this.resulArr[0];
                                                this.stoppagePatron = this.transportStoppageDetail.patronId;
                                                for (var i = 0; i < this.stoppagePatron.length; i++) {
                                                    patron = this.patronDetails.find(x => x.id == this.stoppagePatron[i]);
                                                    if (patron != null) {
                                                        this.patronWithStoppage = <PatronSummary>{};
                                                        this.patronWithStoppage.patron = patron;
                                                        this.patronWithStoppage.imgUrl = patron.imgUrl;
                                                        this.patronWithStoppage.stoppageName = selectedStoppage.name,
                                                            this.patronWithStoppageList.push(this.patronWithStoppage);
                                                        this.getTransport();
                                                        this.msgs = [];
                                                        this.msgs.push({ severity: 'success', summary: 'Patron mapped successfully' });
                                                    }
                                                }
                                                this._setupService.getPatron().subscribe(result => {
                                                    this.patronDetails = result;
                                                });
                                            });
                                        });
                                    }
                                });
                            }
                        });
                    }

                });
            }
            this.patronMapDialog = false;
            
        }
    }

    
    updatePatronWithTransport(patronId: string, stoppageId: string) {
        this._setupService.updatePatronTransport(this.routeId, stoppageId, patronId).subscribe(result => {
        });
    }
    removePatronWithTransport(patronId: string) {
               this._setupService.removePatronTransport(patronId).subscribe(result => {
        });
    }

    // Map Patron With transport Stoppage

    openSearchBox(selectedStoppage: TransportStoppageDetail) {
       // this.patronRouteList = [];
        if (this.selectedStoppage == null) {
            this.msgs = [];
            this.msgs.push({severity: 'warn', summary: 'Please select stoppage'});
        } else {
            this.patronMapDialog = true;
        }
    }

  onCancel(event: Event) { 
              this.transportRouteDialog = false;  
    }
  onSearchCancel(event: Event) {
      this.patronRouteList = [];
        this.patronMapDialog = false;
        
    }

    //Stoppage Sequence Move Up
  moveUp() {
      var oldsequence: number = 0;
        var transRoute: TransportRouteDetail;
        oldsequence = this.selectedStoppage.sequence;
        var newsequence: number = 0;
        var transStoppage: TransportStoppageDetail[];
        var newTransportStoppage: TransportStoppageDetail;
        var oldTransportStoppage: TransportStoppageDetail;
        oldTransportStoppage = this.selectedStoppage;
        transRoute = this.tRouteDetails.find(x => x.id == this.routeId);
        if (transRoute != null) {
            transStoppage = transRoute.transportStoppages;
            //this._setupService.moveUpSequence(this.routeId, this.selectedStoppage.id, this.selectedStoppage.sequence).subscribe(result => {
            //    transStoppage = result;
                transStoppage = transStoppage.filter(x => x.sequence < this.selectedStoppage.sequence).sort(function (a, b) {
                    return b.sequence - a.sequence;
                });
                if (transStoppage.length == 0) {
                    this.msgs = [];
                    this.msgs.push({ severity: 'warn', summary: AppSettings.INVALID_SEQUENCE });
                } else {
                    newsequence = transStoppage[0].sequence;
                    newTransportStoppage = transStoppage[0];
                    oldTransportStoppage.sequence = newsequence;
                    newTransportStoppage.sequence = oldsequence;
                    this._setupService.createTransportStoppage(this.routeId, oldTransportStoppage).subscribe(result => {
                        this.transportRouteDetail = result;
                        if (this.transportRouteDetail != null) {
                            this._setupService.createTransportStoppage(this.routeId, newTransportStoppage).subscribe(result => {
                                this.transportRouteDetail = result;
                                this.selectedRouteStoppage = this.transportRouteDetail.transportStoppages;
                                this.transportStoppageDetail = oldTransportStoppage;
                                this.msgs = [];
                                this.msgs.push({ severity: 'success', summary: AppSettings.SEQUENCE_CHANGED });
                            });
                        }
                    });

                }
            }
        //});
    }
    //Stoppage Sequence Move Down
    moveDown() {
        var oldsequence: number = 0;
        var newsequence: number = 0;
        oldsequence = this.selectedStoppage.sequence;
        var transStoppage: TransportStoppageDetail[];
        var transRoute: TransportRouteDetail;
        var newTransportStoppage: TransportStoppageDetail;
        var oldTransportStoppage: TransportStoppageDetail;
        oldTransportStoppage = this.selectedStoppage;
        transRoute = this.tRouteDetails.find(x => x.id == this.routeId);
        if (transRoute != null) {
            transStoppage = transRoute.transportStoppages;

            //this._setupService.moveDownSequence(this.routeId, this.selectedStoppage.id, this.selectedStoppage.sequence).subscribe(result => {
            //    transStoppage = result;
            transStoppage = transStoppage.filter(x => x.sequence > this.selectedStoppage.sequence).sort(function (a, b) {
                return a.sequence - b.sequence;
            });
            if (transStoppage.length == 0) {
                this.msgs = [];
                this.msgs.push({ severity: 'warn', summary: AppSettings.INVALID_SEQUENCE });
            } else {
                newsequence = transStoppage[0].sequence;
                newTransportStoppage = transStoppage[0];
                oldTransportStoppage.sequence = newsequence;
                newTransportStoppage.sequence = oldsequence;
                this._setupService.createTransportStoppage(this.routeId, oldTransportStoppage).subscribe(result => {
                    this.transportRouteDetail = result;
                    if (this.transportRouteDetail != null) {
                        this._setupService.createTransportStoppage(this.routeId, newTransportStoppage).subscribe(result => {
                            this.transportRouteDetail = result;
                            this.selectedRouteStoppage = this.transportRouteDetail.transportStoppages;
                            this.transportStoppageDetail = oldTransportStoppage;
                            this.msgs = [];
                            this.msgs.push({ severity: 'success', summary: AppSettings.SEQUENCE_CHANGED });
                        });
                    }
                });

            }
        }
        //});

    }

    //Transport List DownLoad
    transportList() {
        var tempList: any[] = [];
        for (var transport of this.transportRouteDetails) {
            tempList.push({
                "RouteNumber": transport.routeNumber,
                "RegistrationNumber ": transport.registrationNumber,
                "DriverName": transport.driverName,
                "CoordinatorName": transport.coordinatorName,
                "RouteStaffName": transport.routeStaffName,
                "description": transport.description,

            });
        }
        var csvData = this.ConvertToCSV(tempList);
        var a = document.createElement("a");
        a.setAttribute('style', 'display:none;');
        document.body.appendChild(a);
        var blob = new Blob([csvData], { type: 'text/csv' });
        var url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = 'TransportRouteDetails.csv';
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

    //Transport Stoppage List DownLoad
    stoppageDownload() {
        var tempList: any[] = [];
        for (var patron of this.selectedRouteStoppage) {
            tempList.push({
                "Sequence": patron.sequence,
                "Name": patron.name,
                "PickupTime": patron.pickupTime,
                "DropTime": patron.dropTime,
            });
        }
        var csvData = this.ConvertToCSV1(tempList);
        var a = document.createElement("a");
        a.setAttribute('style', 'display:none;');
        document.body.appendChild(a);
        var blob = new Blob([csvData], { type: 'text/csv' });
        var url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = 'TransportStoppageDetail.csv';
        a.click();
    }

    ConvertToCSV1(objArray:any) {
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

    //Transport Student List DownLoad
    studentDownload() {
        var tempList: any[] = [];
        for (var pat of this.patronWithStoppageList) {
            tempList.push({
                "FirstName": pat.patron.firstName,
                "LastName": pat.patron.lastName,
                "Class": pat.patron.class,
                "Section": pat.patron.section,
                "StoppageName": pat.stoppageName,
            });
        }
        var csvData = this.ConvertToCSV2(tempList);
        var a = document.createElement("a");
        a.setAttribute('style', 'display:none;');
        document.body.appendChild(a);
        var blob = new Blob([csvData], { type: 'text/csv' });
        var url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = 'StoppagePatronDetails.csv';
        a.click();
    }

    ConvertToCSV2(objArray:any) {
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




