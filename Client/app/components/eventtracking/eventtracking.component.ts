import { Component, OnInit, NgModule, ViewChild } from '@angular/core';
import { FormsModule, FormControl, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { SetupService } from '../../services/setup.service';
import { Http, Headers } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { ConfirmationService, SelectItem, ChartModule, UIChart, Message, } from 'primeng/primeng';
import { Observable } from 'rxjs/Rx';

@Component({
    selector: 'eventtracking',
    template: require('./eventtracking.component.html'),
    providers: [SetupService, ConfirmationService]
})

export class EventTrackingComponent {
    selectedEvent: string;
    eventDetail: EventDetail[];
    eventList: SelectItem[];
    trackingTypeDetails: EventTracking[];
    trackingTypeList: EventTracking[];
    patronId: string;
    personId: string;
    public http: Http;
    public selectedDate: string;
    public selectedTime: string;
    patronDetailList: PatronDetail[];
    patronDetails: PatronDetail[];
    getPatron: PatronDetail;
    patronName: string;
    personDetailList: PersonDetail[];
    eventDetailList: EventDetail[];
    eventDetails: EventDetail;
    personDetails: PersonDetail[];
    getPerson: PersonDetail;
    personName: string;
    title: string;
    name: string;
    personTracking: PersonTracking;
    eventTracking: EventTracking;
    organizationId: string = localStorage.getItem("OrganizationId");
    class: string;
    section: string;
    rollNumber: number;
    role: string;
    barGraph: any;
    totalPerson: number
    totalPatron: number;
    presentperson: number;
    absentPersonCount: number;
    presentPersonCount: number;

    presentOnleave: number;
    msgs: Message[] = [];
    @ViewChild("chart") chart: UIChart
    @ViewChild("chartLine") chartLine: UIChart
    eventPresentDetailList: Array<EventTracking>;
    personCountArr: Array<any>;
    pSchool: string = null;
    selectedTab: number = 0;
    NonAttendeesList: any[];
    eventStartTIme: string;
    totalParticipentList: string[];
    absentPatronList: PatronDetail[];
    constructor(http: Http, private _setupService: SetupService, private _router: Router, private activatedRoute: ActivatedRoute, private confirmationService: ConfirmationService) {
        this.http = http;
        this.pSchool = "School";
        this.trackingTypeList = [];
        this.totalParticipentList = [];
        this.showBarGraph(null);
        this.eventList = null;

        this._setupService.getEvent().subscribe((response) => {
            this.eventDetail = response;
            this.eventDetail = this.eventDetail.sort(function (a, b) {
                return parseInt(b.startDate) - parseInt(a.startDate);
            });
            this.selectedEvent = this.eventDetail[0].id
            this.eventStartTIme = this.eventDetail[0].startTime;
            this.totalParticipentList = this.eventDetail[0].patronId;
            this.showBarGraph(this.selectedEvent);
            this.createEventList();
        });
    }

    handleChange(e) {
        if (e.index == 0) {
            this.selectedTab = 0;
        }
        else if (e.index == 1) {
            this.selectedTab = 1;
        }
        else if (e.index == 2) {
            this.selectedTab = 2;
        }
    }

    activateTab(tabNumber) {
        this.selectedTab = tabNumber;
    }

    public getEventTrackingData() {
        this.presentPersonCount = 0;
        this.absentPersonCount = 0;
        this.trackingTypeDetails = [];
        this._setupService.getPatron().subscribe(result => {
            this.patronDetailList = result;
            this._setupService.getPerson().subscribe(result => {
                this.personDetailList = result;
                for (var item of this.trackingTypeList) {
                    var index = this.totalParticipentList.lastIndexOf(item.patronId);
                    if (index > -1) {
                        this.totalParticipentList.splice(index, 1);
                    }
                    this.getPatronInfo(item);
                    this.presentPersonCount = this.trackingTypeDetails.length;
                }

                this.getAbsentPatronInfo();
            });

        });
    }
    getSelectedDate(value) {
        this.trackingTypeDetails = [];
        this.showBarGraph(this.selectedEvent);
    }
    createEventList() {
        this.eventList = [];
        this.eventList.push({ label: 'Select Event', value: 'null' });
        for (var i = 0; i < this.eventDetail.length; i++) {
            this.eventList.push({ label: this.eventDetail[i].title, value: this.eventDetail[i].id });
        }
    }
    getPatronInfo(item: EventTracking) {
        var patronInfo: PatronDetail;
        var personInfo: PersonDetail;
        var eventInfo: EventDetail;
        this.eventTracking = <EventTracking>{};
        patronInfo = this.patronDetailList.find(x => x.id == item.patronId);
        if (patronInfo != null) {
            this.eventTracking.name = patronInfo.firstName + " " + patronInfo.lastName;
            this.eventTracking.class = patronInfo.class.toString();
            this.eventTracking.section = patronInfo.section;
            this.eventTracking.rollNumber = patronInfo.rollNo;
            this.eventTracking.imgUrl = patronInfo.imgUrl;
            this.eventTracking.role = "Student";
        }
        personInfo = this.personDetailList.find(x => x.id == item.personId);
        if (personInfo != null) {
            this.eventTracking.class = "NA";
            this.eventTracking.section = "NA";
            this.eventTracking.rollNumber = 0;
            this.eventTracking.name = personInfo.firstName + " " + personInfo.lastName;
            this.eventTracking.role = personInfo.role;
            this.eventTracking.imgUrl = personInfo.imgUrl;
        }
        eventInfo = this.eventDetail.find(x => x.id == item.eventId);
        if (eventInfo != null) {
            var index = eventInfo.patronId.lastIndexOf(item.patronId);
            if (index > -1) {
                eventInfo.patronId.splice(index, 1);

            }
            this.eventTracking.title = eventInfo.title;
        }
        this.eventTracking.trackingTime = moment(item.trackingTime, 'H:mm').format('h:mm a');
        this.eventTracking.trackingDate = moment(item.trackingDate).format('YYYY-MM-DD');
        this.trackingTypeDetails.push(this.eventTracking);

    }
    getAbsentPatronInfo() {
        let observables = new Array();
        for (var patron of this.totalParticipentList) {
            observables.push(this._setupService.getPatronById(patron));
        }
        Observable.forkJoin(observables).subscribe(
            result => {
                this.absentPatronList = <PatronDetail[]>result;
                this.absentPersonCount = this.absentPatronList.length;

            }
        );
    }

    showBarGraph(selectedEvent: string) {
        if (selectedEvent != null) {
            this._setupService.getEventTrackingByEvent(selectedEvent).subscribe(result => {
                this.trackingTypeList = result;
                var tempStartTime: string = '07:00';
                this.personCountArr = new Array<any>();
                if (this.trackingTypeList.length > 0) {
                    for (var i = 0; i <= 53; i++) {
                        var noPerson = 0;
                        var personCount: Array<EventTracking> = new Array<EventTracking>();
                        var beginningTime = moment(tempStartTime, 'HH:mm');
                        var startTime = beginningTime.format('HH:mm');
                        var endTime = moment(beginningTime).startOf('minutes').add(15, 'minutes').format('HH:mm');
                        personCount = this.trackingTypeList.filter(x => x.trackingTime >= startTime && x.trackingTime < endTime)
                        if (personCount.length > 0) {
                            this.personCountArr.push(Number(personCount.length));
                        }
                        else {
                            this.personCountArr.push(Number(noPerson));
                        }
                        tempStartTime = endTime;
                    }
                }
                this.updateLine(this.chart);
            });
            this.getEventTrackingData();
        }


        this.barGraph = {
            labels: ['7:00', '7:15', '7:30', '7:45', '8:00', '8:15', '8:30', '8:45', '9:00', '9:15', '9:30', '9:45',
                '10:00', '10:15', '10:30', '10:45', '11:00', '11:15', '11:30', '11:45', '12:00', '12:15', '12:30', '12:45',
                '13:00', '13:15', '13:30', '13:45', '14:00', '14:15', '14:30', '14:45', '15:00', '15:15', '15:30', '15:45',
                '16:00', '16:15', '16:30', '16:45', '17:00', '17:15', '17:30', '17:45', '18:00', '18:15', '18:30', '18:45',
                '19:00', '19:15', '19:30', '19:45', '20:00',],
            datasets: [
                {
                    label: this.pSchool,
                    data: [
                        this.personCountArr != null ? this.personCountArr[0] : 0, this.personCountArr != null ? this.personCountArr[1] : 0, this.personCountArr != null ? this.personCountArr[2] : 0, this.personCountArr != null ? this.personCountArr[3] : 0
                        , this.personCountArr != null ? this.personCountArr[4] : 0, this.personCountArr != null ? this.personCountArr[5] : 0, this.personCountArr != null ? this.personCountArr[6] : 0, this.personCountArr != null ? this.personCountArr[7] : 0, this.personCountArr != null ? this.personCountArr[8] : 0
                        , this.personCountArr != null ? this.personCountArr[9] : 0, this.personCountArr != null ? this.personCountArr[10] : 0, this.personCountArr != null ? this.personCountArr[11] : 0, this.personCountArr != null ? this.personCountArr[12] : 0, this.personCountArr != null ? this.personCountArr[13] : 0
                        , this.personCountArr != null ? this.personCountArr[14] : 0, this.personCountArr != null ? this.personCountArr[15] : 0, this.personCountArr != null ? this.personCountArr[16] : 0, this.personCountArr != null ? this.personCountArr[17] : 0, this.personCountArr != null ? this.personCountArr[18] : 0
                        , this.personCountArr != null ? this.personCountArr[19] : 0, this.personCountArr != null ? this.personCountArr[20] : 0, this.personCountArr != null ? this.personCountArr[21] : 0, this.personCountArr != null ? this.personCountArr[22] : 0, this.personCountArr != null ? this.personCountArr[23] : 0
                        , this.personCountArr != null ? this.personCountArr[24] : 0, this.personCountArr != null ? this.personCountArr[25] : 0, this.personCountArr != null ? this.personCountArr[26] : 0, this.personCountArr != null ? this.personCountArr[27] : 0, this.personCountArr != null ? this.personCountArr[28] : 0
                        , this.personCountArr != null ? this.personCountArr[29] : 0, this.personCountArr != null ? this.personCountArr[30] : 0, this.personCountArr != null ? this.personCountArr[31] : 0, this.personCountArr != null ? this.personCountArr[32] : 0, this.personCountArr != null ? this.personCountArr[33] : 0
                        , this.personCountArr != null ? this.personCountArr[34] : 0, this.personCountArr != null ? this.personCountArr[35] : 0, this.personCountArr != null ? this.personCountArr[36] : 0, this.personCountArr != null ? this.personCountArr[37] : 0, this.personCountArr != null ? this.personCountArr[38] : 0
                        , this.personCountArr != null ? this.personCountArr[39] : 0, this.personCountArr != null ? this.personCountArr[40] : 0, this.personCountArr != null ? this.personCountArr[41] : 0, this.personCountArr != null ? this.personCountArr[42] : 0, this.personCountArr != null ? this.personCountArr[43] : 0
                        , this.personCountArr != null ? this.personCountArr[44] : 0, this.personCountArr != null ? this.personCountArr[45] : 0, this.personCountArr != null ? this.personCountArr[46] : 0, this.personCountArr != null ? this.personCountArr[47] : 0, this.personCountArr != null ? this.personCountArr[48] : 0
                        , this.personCountArr != null ? this.personCountArr[49] : 0, this.personCountArr != null ? this.personCountArr[50] : 0, this.personCountArr != null ? this.personCountArr[51] : 0, this.personCountArr != null ? this.personCountArr[52] : 0, this.personCountArr != null ? this.personCountArr[53] : 0
                        , this.personCountArr != null ? this.personCountArr[54] : 0,
                    ],
                    fill: false,
                    borderColor: "#1E88E5",
                    backgroundColor: '#42A5F5',
                },

            ]
        };
    }
    updateLine(chart: UIChart) {
        this.barGraph.datasets[0].data = [this.personCountArr.length != null ? this.personCountArr[0] : 0, this.personCountArr.length > 0 ? this.personCountArr[1] : 0, this.personCountArr.length > 0 ? this.personCountArr[2] : 0, this.personCountArr.length > 0 ? this.personCountArr[3] : 0
            , this.personCountArr.length > 0 ? this.personCountArr[4] : 0, this.personCountArr.length > 0 ? this.personCountArr[5] : 0, this.personCountArr.length > 0 ? this.personCountArr[6] : 0, this.personCountArr.length > 0 ? this.personCountArr[7] : 0, this.personCountArr.length > 0 ? this.personCountArr[8] : 0
            , this.personCountArr.length > 0 ? this.personCountArr[9] : 0, this.personCountArr.length > 0 ? this.personCountArr[10] : 0, this.personCountArr.length > 0 ? this.personCountArr[11] : 0, this.personCountArr.length > 0 ? this.personCountArr[12] : 0, this.personCountArr.length > 0 ? this.personCountArr[13] : 0
            , this.personCountArr.length > 0 ? this.personCountArr[14] : 0, this.personCountArr.length > 0 ? this.personCountArr[15] : 0, this.personCountArr.length > 0 ? this.personCountArr[16] : 0, this.personCountArr.length > 0 ? this.personCountArr[17] : 0, this.personCountArr.length > 0 ? this.personCountArr[18] : 0
            , this.personCountArr.length > 0 ? this.personCountArr[19] : 0, this.personCountArr.length > 0 ? this.personCountArr[20] : 0, this.personCountArr.length > 0 ? this.personCountArr[21] : 0, this.personCountArr.length > 0 ? this.personCountArr[22] : 0, this.personCountArr.length > 0 ? this.personCountArr[23] : 0
            , this.personCountArr.length > 0 ? this.personCountArr[24] : 0, this.personCountArr.length > 0 ? this.personCountArr[25] : 0, this.personCountArr.length > 0 ? this.personCountArr[26] : 0, this.personCountArr.length > 0 ? this.personCountArr[27] : 0, this.personCountArr.length > 0 ? this.personCountArr[28] : 0
            , this.personCountArr.length > 0 ? this.personCountArr[29] : 0, this.personCountArr.length > 0 ? this.personCountArr[30] : 0, this.personCountArr.length > 0 ? this.personCountArr[31] : 0, this.personCountArr.length > 0 ? this.personCountArr[32] : 0, this.personCountArr.length > 0 ? this.personCountArr[33] : 0
            , this.personCountArr.length > 0 ? this.personCountArr[34] : 0, this.personCountArr.length > 0 ? this.personCountArr[35] : 0, this.personCountArr.length > 0 ? this.personCountArr[36] : 0, this.personCountArr.length > 0 ? this.personCountArr[37] : 0, this.personCountArr.length > 0 ? this.personCountArr[38] : 0
            , this.personCountArr.length > 0 ? this.personCountArr[39] : 0, this.personCountArr.length > 0 ? this.personCountArr[40] : 0, this.personCountArr.length > 0 ? this.personCountArr[41] : 0, this.personCountArr.length > 0 ? this.personCountArr[42] : 0, this.personCountArr.length > 0 ? this.personCountArr[43] : 0
            , this.personCountArr.length > 0 ? this.personCountArr[44] : 0, this.personCountArr.length > 0 ? this.personCountArr[45] : 0, this.personCountArr.length > 0 ? this.personCountArr[46] : 0, this.personCountArr.length > 0 ? this.personCountArr[47] : 0, this.personCountArr.length > 0 ? this.personCountArr[48] : 0
            , this.personCountArr.length > 0 ? this.personCountArr[49] : 0, this.personCountArr.length > 0 ? this.personCountArr[50] : 0, this.personCountArr.length > 0 ? this.personCountArr[51] : 0, this.personCountArr.length > 0 ? this.personCountArr[52] : 0, this.personCountArr.length > 0 ? this.personCountArr[53] : 0
            , this.personCountArr.length > 0 ? this.personCountArr[54] : 0
        ]

        chart.refresh();
    }

    download() {
        var tempList: any[] = [];
        if (this.selectedTab == 1) {
            for (var patron of this.trackingTypeDetails) {
                tempList.push({
                    "Title": patron.title,
                    "Name": patron.name,
                    "RollNumber": patron.rollNumber,
                    "Class ": patron.class,
                    "Section": patron.section,
                    "Role": patron.role,
                    "Time": patron.trackingTime,
                    "Date": patron.trackingDate,
                });
            }

        }
        if (this.selectedTab == 2) {
            for (var absentPatron of this.absentPatronList) {
                tempList.push({
                    "Name": absentPatron.firstName + " " + absentPatron.lastName,
                    "Class ": absentPatron.class,
                    "Section": absentPatron.section,
                    "RollNumber": absentPatron.rollNo,
                });
            }
        }
        var csvData = this.ConvertToCSV(tempList);
        var a = document.createElement("a");
        a.setAttribute('style', 'display:none;');
        document.body.appendChild(a);
        var blob = new Blob([csvData], { type: 'text/csv' });
        var url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = 'file.csv';
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

}


