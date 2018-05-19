import * as ng from '@angular/core';
import { Component, OnInit, NgModule } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule, FormControl, FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
    InputTextModule, SelectItem, CheckboxModule, SelectButtonModule, Header, Footer, MessagesModule, ConfirmationService,
    ConfirmDialogModule, PanelModule, DropdownModule, CalendarModule, InputTextareaModule, DataListModule, CarouselModule,
    MultiSelectModule, GrowlModule, Message
} from 'primeng/primeng';
import { SetupService } from '../../services/setup.service';
import { Observable } from 'rxjs/Rx';
import * as moment from 'moment';
@ng.Component({
    selector: 'eventlist',
    template: require('./eventlist.component.html'),
    providers: [ConfirmationService, SetupService]
})

export class EventListComponent {
    participants: boolean = false;
    loading: boolean;
    patronMapDialog: boolean = false;
    eventDialog: boolean = false;
    private router: Router
    eventArr = [];
    public eventDetails: EventDetail[];
    selectedEventDetail: EventDetail;
    patronDetails: PatronDetail[];
    public http: Http;
    eventList: EventDetail[];
    participantId: any[];
    patronDetailList: PatronDetail[];
    selectedPatronDetail: PatronDetail;
    eventId: string
    msgs: Message[] = [];
    deline: boolean = false;
    public delineMode: SelectItem[];
    eventDetail: EventDetail;
    selectedMode: string;
    organizationID: string = localStorage.getItem("OrganizationId");
    declineReq: DeclineRequest[];
    declineRequest: DeclineRequest;
    eventform: FormGroup;
    submitted: boolean;
    public occurenceType: SelectItem[];
    selectedOccurence: string;
    public weekDetails: WeekDetail[];
    daysOfWeekId: string
    days: SelectItem[];
    selectedDays: string[] = [];
    public daysOfWeek: string = "";
    public daysOfMonth: string = "";
    months: SelectItem[];
    selectedMonths: string[] = [];
    showWeek: boolean;
    showMonth: boolean;
    daysCreatedDate: Date;
    eventDetail1: EventDetail;
    constructor(http: Http, private _router: Router, private confirmationService: ConfirmationService, private activatedRoute: ActivatedRoute, private _setupService: SetupService) {
        this.http = http;
        this._setupService.getPatron().subscribe(result => {
            this.patronDetails = result;
        })
        //this.loading = true;
        this._setupService.getEvent().subscribe(result => {
            this.eventDetails = result;
            this.occurence();
          //  this.loading = false;
        });
       
        this.delineMode = [];
        this.delineMode.push({ label: 'select', value: 'null' });
        this.delineMode.push({ label: 'Inperson', value: 'Inperson' });
        this.delineMode.push({ label: 'Email', value: 'Email' });
        this.delineMode.push({ label: 'OnCall', value: 'Oncall' });

        this.event();
        this.declineRequest = {
            declinedPatron: '',
            declineMode: '',
            declinedPerson: '',
            declineReason: ''
        };

        this.showWeek = false;
        this.showMonth = false;
        this.http = http;

        this.occurenceType = [];
        this.occurenceType.push({ label: 'Select ', value: null });
        this.occurenceType.push({ label: 'Adhoc', value: '0' });
        this.occurenceType.push({ label: 'Daily', value: '1' });
        this.occurenceType.push({ label: 'Weekly', value: '2' });
        this.occurenceType.push({ label: 'Monthly', value: '3' });

        this.months = [];
        this.months.push({ label: '1', value: '1' });
        this.months.push({ label: '2', value: '2' });
        this.months.push({ label: '3', value: '3' });
        this.months.push({ label: '4', value: '4' });
        this.months.push({ label: '5', value: '5' });
        this.months.push({ label: '6', value: '6' });
        this.months.push({ label: '7', value: '7' });
        this.months.push({ label: '8', value: '8' });
        this.months.push({ label: '9', value: '9' });
        this.months.push({ label: '10', value: '10' });
        this.months.push({ label: '11', value: '11' });
        this.months.push({ label: '12', value: '12' });
        this.months.push({ label: '13', value: '13' });
        this.months.push({ label: '14', value: '14' });
        this.months.push({ label: '15', value: '15' });
        this.months.push({ label: '16', value: '16' });
        this.months.push({ label: '17', value: '17' });
        this.months.push({ label: '18', value: '18' });
        this.months.push({ label: '19', value: '19' });
        this.months.push({ label: '20', value: '20' });
        this.months.push({ label: '21', value: '21' });
        this.months.push({ label: '22', value: '22' });
        this.months.push({ label: '23', value: '23' });
        this.months.push({ label: '24', value: '24' });
        this.months.push({ label: '25', value: '25' });
        this.months.push({ label: '26', value: '26' });
        this.months.push({ label: '27', value: '27' });
        this.months.push({ label: '28', value: '28' });
        this.months.push({ label: '29', value: '29' });
        this.months.push({ label: '30', value: '30' });

        this.eventDetail = {
            id: '',
            title: '',
            remarks: '',
            description: '',
            patronId: [],
            personId: [],
            dayOfWeek: '',
            dayOfMonth: '',
            occurence: '',
            occurenceType: '',
            declineRequest: this.declineReq = [],
            startDate: null,
            endDate: null,
            startTime: null,
            endTime: null,
            createDate: new Date(),
            organizationid: this.organizationID,
            lastUpdated: new Date()
        };

        this.declineRequest = {
            declinedPatron: '',
            declineMode: '',
            declinedPerson: '',
            declineReason: ''
        };

        this.activatedRoute.params.subscribe(params => {
            this.eventId = params['eventId'];
        })

        this.days = [];
        this.days.push({ label: 'Monday', value: 'Monday' });
        this.days.push({ label: 'TuesDay', value: 'TuesDay' });
        this.days.push({ label: 'Wedneday', value: 'Wedneday' });
        this.days.push({ label: 'Thursday', value: 'Thursday' });
        this.days.push({ label: 'Friday', value: 'Friday' });
        this.days.push({ label: 'Saturday', value: 'Saturday' });
        this.days.push({ label: 'Sunday', value: 'Sunday' });
    }

    event() {
        this.eventDetail = {
            id: '',
            title: '',
            remarks: '',
            description: '',
            patronId: [],
            personId: [],
            dayOfWeek: '',
            dayOfMonth: '',
            occurence: '',
            occurenceType: '',
            declineRequest: this.declineReq = [],
            startDate: null,
            endDate: null,
            startTime: null,
            endTime: null,
            createDate: new Date(),
            organizationid: this.organizationID,
            lastUpdated: new Date()
        };

    }

    occurence() {
        for (var i = 0; i < this.eventDetails.length; i++) {

            if (this.eventDetails[i].occurence == " 0") {

                this.eventDetails[i].occurenceType = "Adhoc";
            }
            else if (this.eventDetails[i].occurence == "1") {

                this.eventDetails[i].occurenceType = "Daily";

            }
            else if (this.eventDetails[i].occurence == "2") {

                this.eventDetails[i].occurenceType = "Weekly";

            }
            else if (this.eventDetails[i].occurence == "3") {

                this.eventDetails[i].occurenceType = "Monthly";

            }
            else {
                this.eventDetails[i].occurenceType = "NA";
            }
        }
        this.eventDetails[i].startTime = moment(this.eventDetails[i].startTime, 'H:mm').format('h:mm a');
        this.eventDetails[i].endTime = moment(this.eventDetails[i].endTime, 'H:mm').format('h:mm a');

    }
    // creation event form
    onSelectMode() {
        if (this.selectedOccurence == '0' || this.selectedOccurence == '1') {
            this.showWeek = false;
            this.showMonth = false;
        }
        if (this.selectedOccurence == '2') {
            this.showWeek = true;
            this.showMonth = false;
        }
        if (this.selectedOccurence == '3') {
            this.showMonth = true;
            this.showWeek = false;
        }
    }

    createEvent(value: EventDetail) {
        if (this.selectedOccurence == '2') {
            this.createWeek();
            this.eventDetail.dayOfWeek = this.daysOfWeek;
        }
        if (this.selectedOccurence == '3') {
            this.createMonths();
            this.eventDetail.dayOfMonth = this.daysOfMonth;
        }
        this.submitted = true;
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        this.eventDetail.occurence = this.selectedOccurence;

        var a = this.eventDetail.startDate;
        var b = moment(a).format('YYYY-MM-DD');
        this.eventDetail.startDate = b;


        var c = this.eventDetail.endDate;
        var d = moment(c).format('YYYY-MM-DD');
        this.eventDetail.endDate = d;

        var a = this.eventDetail.startTime;
        var b = moment(a, 'H:mm').format('h:mm ');
        this.eventDetail.startTime = b;

        var c = this.eventDetail.endTime;
        var d = moment(c, 'H:mm').format('h:mm ');
        this.eventDetail.endTime = d;

        if (this.eventDetail.id) {
            this._setupService.updateEvent(this.eventDetail.id, this.eventDetail).subscribe((response) => {
                if (response === 204) {
                    this._setupService.getEvent().subscribe(result => {
                        this.eventDetails = result;
                        this.occurence();
                    });
                    this.msgs = [];
                    this.msgs.push({ severity: 'success', summary: 'Event update successfully' });
                }
            }); this.eventDialog = false;

        } else {
            this._setupService.createEvent(this.eventDetail).subscribe((response) => {
                if (response === 204) {
                    this._setupService.getEvent().subscribe(result => {
                        this.eventDetails = result;
                        this.occurence();
                    });
                    this.msgs = [];
                    this.msgs.push({ severity: 'success', summary: 'Event saved successfully' });
                }
            }); this.eventDialog = false;
        }

    }


    ngOnInit() {
        this._setupService.getEventById(this.eventId).subscribe(result => {
            this.eventDetail = result;
            this.selectedOccurence = this.eventDetail.occurence;
            if (this.selectedOccurence == '2') {
                this.showWeek = true;
                this.showMonth = false;
                this.selectedDays = this.eventDetail.dayOfWeek.split(",");
            }
            if (this.selectedOccurence == '3') {
                this.showMonth = true;
                this.showWeek = false;
                this.selectedMonths = this.eventDetail.dayOfMonth.split(",");
            }

        });
    }

    eventCancel(event: Event) {
        this.eventDialog = false;
    }

    createWeek() {
        if (this.selectedDays.length > 0) {
            for (var key in this.selectedDays) {
                this.daysOfWeek += this.selectedDays[key] + ",";
            }
            this.daysOfWeek = this.daysOfWeek.replace(/^,|,$/g, ''); // remove end commas
        }
        else {
            this.confirmationService.confirm({
                message: 'Please Select atleast One Day !',
                header: 'Select Confirmation',
                accept: () => {

                }
            });
        }
    }

    createMonths() {
        if (this.selectedMonths.length > 0) {
            for (var key in this.selectedMonths) {
                this.daysOfMonth += this.selectedMonths[key] + ",";
            }
            this.daysOfMonth = this.daysOfMonth.replace(/^,|,$/g, ''); // remove end commas
        }
        else {
            this.confirmationService.confirm({
                message: 'Please Select atleast One Day of Month !',
                header: 'Select Confirmation',
                accept: () => {

                }
            });

        }

    }
    //end event form creation
    addEvent() {
        this.event();
        this.eventDialog = true;
    }

    updateEvent(eventDetail: EventDetail) {
        this.eventDetail = eventDetail;

        var a = eventDetail.startDate;
        var b = moment(a).toDate();
        eventDetail.startDate = b.toLocaleDateString();


        var c = eventDetail.endDate;
        var d = moment(c).toDate();
        eventDetail.endDate = d.toLocaleDateString();


        this.selectedOccurence = eventDetail.occurence;
        this.eventDialog = true;
    }

    deleteEvent(eventDetail: EventDetail[]) {
        if (this.selectedEventDetail == null) {
            this.msgs = [];
            this.msgs.push({ severity: 'info', summary: 'info Message', detail: 'please select at least one event' });
        } else {
            this.confirmationService.confirm({
                message: 'Do you want to delete this record(s)?',
                header: 'Delete Confirmation',
                icon: 'fa fa-trash',
                accept: () => {
                    for (let event of eventDetail) {
                        this._setupService.deleteEvent(event.id).subscribe((response) => {
                            if (response === 204) {
                                this.eventDetails.forEach((u: EventDetail, i) => {
                                    if (u.id === event.id) {
                                      //  this.eventDetails.splice(i, 1);
                                        this._setupService.getEvent().subscribe(result => {
                                            this.eventDetails = result;
                                            this.occurence();
                                        });
                                    }
                                });
                                this.msgs = [];
                                this.msgs.push({ severity: 'error', summary: 'error message', detail: 'Event delete successfully' });
                            }
                        });
                    }
                }
            });
        }
    }
    
    declinepatron(declineRequest: DeclineRequest) {
        
        if (this.selectedPatronDetail == null)
        {
            this.msgs = [];
            this.msgs.push({ severity: 'info', summary: 'info Message', detail: 'please select at least one patron' });
        }
        else
        {
            this.declineRequest.declinedPatron = this.selectedPatronDetail.id
            this.declineRequest.declineMode = this.selectedMode;
            this._setupService.DeclinePatronToEvent(this.eventId, this.declineRequest).subscribe((response) => {         
            if (response === 200) {
            this.patronDetailList.forEach((u: PatronDetail, i) => {
                if (u.id === this.selectedPatronDetail.id) {
                   this.patronDetailList.splice(i, 1);
                   this.getEventPatron(this.eventId);
                   this.msgs = [];
                   this.msgs.push({ severity: 'success', summary: 'patron decline successfully' });
                }
            });
            this.deline = false;
        }
            });
            
      }
    }

    addParticipants(eventDetail: EventDetail) {
        this.participants = true;
        this.selectedPatronDetail = null;
        this.eventId = eventDetail.id;
        this.participantId = [];
        this.getEventPatron(eventDetail.id);
    }

    getEventPatron(eventId: string) {
        
        let observables = new Array();
        var eventInfo: EventDetail;
        this._setupService.getEventById(eventId).subscribe(result => {
            eventInfo = result;
            this.participantId = eventInfo.patronId;
            for (var patron of this.participantId) {
                observables.push(this._setupService.getPatronById(patron));
            }
            Observable.forkJoin(observables).subscribe(result => {
                    this.patronDetailList = <PatronDetail[]>result;
                }
            );
            
        });

    }

    onCancel(event: Event) {
        this.participants = false;
    }
    Cancel(event: Event) {
        this.deline = false;
    }
    mapPatron(eventDetail: EventDetail, selectedPatron: PatronDetail) {
        if (selectedPatron == null) {
            this.msgs = [];
            this.msgs.push({ severity: 'info', summary: 'please select at least one patron' });
        } else {
            this._setupService.addPatronToEvent(this.eventId, selectedPatron.id).subscribe(result => {
                if (result == 200) {
                    this.getEventPatron(this.eventId);
                    this.patronMapDialog = false;
                    this.selectedPatronDetail = null;
                  
                }
            });
        }
    }

    openSearchBox(event: Event) {
        this.patronMapDialog = true;
    }

    onSearchCancel(event: Event) {
        this.patronMapDialog = false;
    }
    //Download Event Detail List
    download() {
        var tempList: any[] = [];
        for (var event of this.eventDetails) {
            tempList.push({
                "Title": event.title,
                "Occurence": event.occurence,
                "StartDate": event.startDate,
                "EndDate": event.endDate,
                "StartTime": event.startTime,
                "EndTime": event.endTime,
            });
        }
        var csvData = this.ConvertToCSV(tempList);
        var a = document.createElement("a");
        a.setAttribute('style', 'display:none;');
        document.body.appendChild(a);
        var blob = new Blob([csvData], { type: 'text/csv' });
        var url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = 'EventDetails.csv';
        a.click();
    }

    ConvertToCSV(objArray) {
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

    //Download Participants List

    participantsList() {
        var tempList: any[] = [];
        for (var patron of this.patronDetailList) {
            tempList.push({
                "FirstName": patron.firstName,
                "LastName": patron.lastName,
                "IsActive": patron.isActive,
                "Class": patron.class,
                "Section": patron.section,
                "RollNumber": patron.rollNo,
            });
        }
        var csvData = this.ConvertToCSV1(tempList);
        var a = document.createElement("a");
        a.setAttribute('style', 'display:none;');
        document.body.appendChild(a);
        var blob = new Blob([csvData], { type: 'text/csv' });
        var url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = 'ParticipantsList.csv';
        a.click();
    }

    ConvertToCSV1(objArray) {
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