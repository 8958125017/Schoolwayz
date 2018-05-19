import { Component, OnInit, NgModule, EventEmitter, Pipe, PipeTransform, ViewChild } from '@angular/core';
import { FormsModule, FormControl, FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ChartModule, UIChart, Message, MenubarModule, MenuItem, PanelModule, ButtonModule, CheckboxModule, SelectItem } from 'primeng/primeng';
import { Http, Headers } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { SetupService } from '../../services/setup.service';

import * as moment from 'moment';

@Component({
    selector: 'personchart',
    template: require('./personchart.component.html'),
    providers: [SetupService]
})

export class PersonChartComponent implements OnInit {
    data1: any;
    LineChart: any;
    public http: Http;
    //private items: MenuItem[];
    PieResult: any[];
    ScatterResult: any[];
    PresentPerson: PersonDetail[];
    totalPerson: number;
    presentperson: number;
    absentperson: number;
    OnLeavePerson: any[];
    presentPersonCount: number;
    AbsentPerson: number;
    presentOnleave: number;
    organizationId: string = localStorage.getItem("OrganizationId");
    private selectedDate: any;
    presentOnleave1: string;
    selectedPatronDate: number;
    activeItem: any;
    activeLink: any;
    msgs: Message[] = [];
    personTrackingSummary: PersonTrackingSummary;
    Chart: any;
    @ViewChild("chart") chart: UIChart
    @ViewChild("chartLine") chartLine: UIChart
    personDetail: PersonDetail;
    personLeaveDetailList: Array<PersonDetail>;
    personPresentDetailList: Array<PersonTracking>;
    personList: PersonDetail[];
    pAttendanceInfo: PersonAttendanceInfo;
    personAttendanceInfoList: PersonAttendanceInfo[];
    absentPerson: PersonDetail;
    absentPersonList: PersonDetail[];
    tempAbsentPersonList: PersonDetail[];
    person: PersonDetail;
    personCountArr: Array<number>;
    selectedAbsentPerson: PersonDetail;
    selectedOnLeavePerson: PersonDetail;
    pSchool: string = null;
    personLeaveDetail: PersonLeaveDetail[]; // Patron Leave Detail
    presentPerson: PersonTracking[]; // Present Patron
    personDetailList: PersonDetail[]; // Patron Detail where leaves are applied
    totalPersonList: PersonDetail[]; // Total Patron
    persontrackingTypeDetails: PersonTracking[];
    trackingTypeList: PersonTracking[];
    personId: string
    personDetailList1: PersonDetail[];
    personDetails: PersonDetail[];
    getPerson: PersonDetail;
    personName: string;
    personTracking: PersonTracking;
    personOnLeaveDescriptionList: PersonOnLeaveDescription[];
    selectedTab: number = 0;
    presentPersonImage: PresentPersonImage;
    presentPersonImageList: PresentPersonImage[];
    constructor(http: Http, private _setupService: SetupService, private activatedRoute: ActivatedRoute, private _router: Router) {
        //this.selectedDate = moment(new Date()).toDate();
        this.selectedDate = moment(new Date()).format('YYYY-MM-DD');
        this.http = http;
        this.pSchool = "School";
        this.showPresentPerson();
        this.showScatterChart();
    }
    handleChange(e) {
        if (e.index == 0) {
            this.selectedTab = 0;
        } else if (e.index == 1) {
            this.selectedTab = 1;
        }
        else if (e.index == 2) {
            this.selectedTab = 2;
        }
        else if (e.index == 3) {
            this.selectedTab = 3;
        }
    }
    activatedTab(number) {
        this.selectedTab = number;
    }

    public getPersonTrackingData(trackingTypeList: PersonTracking[]) {
        this.persontrackingTypeDetails = [];
        var personInfo: PersonDetail;
        this._setupService.getPerson().subscribe(result => {
            this.personDetailList1 = result;
            this.presentPersonImageList = [];
            for (var item of trackingTypeList) {
                this.presentPersonImage = <PresentPersonImage>{};
                this.personTracking = <PersonTracking>{};
                personInfo = this.personDetailList1.find(x => x.id == item.personId);
                if (personInfo != null) {
                    this.personTracking.firstName = personInfo.firstName;
                    this.personTracking.lastName = personInfo.lastName
                    this.personTracking.emailId = personInfo.emailId;
                    this.personTracking.role = personInfo.role;
                    this.personTracking.primaryMobile = personInfo.primaryMobile;
                    this.personTracking.trackingTime = moment(item.trackingTime, 'H:mm').format('h:mm a');
                    this.presentPersonImage.personTracking = this.personTracking;
                    this.presentPersonImage.imagePath = personInfo.imgUrl;
                    this.presentPersonImageList.push(this.presentPersonImage);
                }
            }
        });
    }
    download() {
        var tempList: any[] = [];
        if (this.selectedTab == 1) {
            for (var presentPerson of this.presentPersonImageList) {
                tempList.push({
                    "Name": presentPerson.personTracking.personName,
                    "Role ": presentPerson.personTracking.role,
                    "EmailId": presentPerson.personTracking.emailId,
                    "Phone Number": presentPerson.personTracking.primaryMobile,
                    "TrackingTime": presentPerson.personTracking.trackingTime,
                });
            }

        }
        if (this.selectedTab == 2) {
            for (var absentPerson of this.absentPersonList) {
                tempList.push({
                    "Name": absentPerson.firstName + " " + absentPerson.lastName,
                    "Role ": absentPerson.role,
                    "EmailId": absentPerson.emailId,
                    "Phone Number": absentPerson.primaryMobile,

                });
            }
        }
        if (this.selectedTab == 3) {
            for (var leavePerson of this.personOnLeaveDescriptionList) {
                tempList.push({
                    "Name": leavePerson.personInfo.firstName + " " + leavePerson.personInfo.lastName,
                    "Role ": leavePerson.personInfo.role,
                    "EmailId": leavePerson.personInfo.emailId,
                    "Phone Number": leavePerson.personInfo.primaryMobile,
                    "Description": leavePerson.description,
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

    getSelectedDate($event) {
        var a = this.selectedDate;
        var b = moment(a).format('YYYY-MM-DD');
        this.selectedDate = b;
        this.showPresentPerson();
        this.showScatterChart();
    }

    showPresentPerson() {
        var tempPersonTrackingSummary: PersonTrackingSummary;
        var updatePersonList: PersonTracking[] = [];
        this._setupService.getPresentPerson(this.selectedDate).subscribe(result => {
            this.presentPerson = result;
            this.getPersonTrackingData(this.presentPerson);
            this._setupService.getPersonOnLeave(this.selectedDate).subscribe(result => {
                this.personLeaveDetail = result;
                for (var pat of this.presentPerson) {
                    if (this.personLeaveDetail.find(x => x.personId == pat.personId)) {
                        updatePersonList.push(pat);
                    }
                }
                this._setupService.getPerson().subscribe(result => {
                    this.totalPersonList = result;
                    this.totalPerson = this.totalPersonList.length;
                    this.presentPersonCount = this.presentPerson.length;
                    this.presentOnleave = this.personLeaveDetail.length - updatePersonList.length;
                    this.absentperson = this.totalPerson - (this.presentPerson.length + this.presentOnleave);
                    this.showOnLeavePerson();
                });
            });
        });

    }

    showOnLeavePerson() {
        var personOnLeaveDescription: PersonOnLeaveDescription;
        var OnLeaveRemoved: Array<PersonTracking> = new Array<PersonTracking>();
        this.personOnLeaveDescriptionList = [];
        personOnLeaveDescription = <PersonOnLeaveDescription>{};
        for (var leave of this.personLeaveDetail) {
            OnLeaveRemoved = this.presentPerson.filter(a => a.personId == leave.personId)
            if (OnLeaveRemoved.length == 0) {
                this._setupService.getPersonById(leave.personId).subscribe(result => {
                    this.personDetail = result;
                    personOnLeaveDescription.personInfo = this.personDetail;
                    personOnLeaveDescription.description = leave.description;
                    personOnLeaveDescription.imagePath = this.personDetail.imgUrl;
                    this.personOnLeaveDescriptionList.push(personOnLeaveDescription);
                });
            }
        }
        this.showAbsentPerson();
    }

    showAbsentPerson() {
        var tempPersonAbsentList: Array<PersonDetail> = new Array<PersonDetail>();
        this.absentPersonList = [];
        this.tempAbsentPersonList = [];
        for (var i = 0; i < this.totalPersonList.length; i++) {
            var personTrack: Array<PersonTracking> = new Array<PersonTracking>();
            personTrack = this.presentPerson.filter(a => a.personId == this.totalPersonList[i].id);
            if (personTrack.length == 0) {
                this.tempAbsentPersonList.push(this.totalPersonList[i]);
            }
        }
        for (var pat of this.tempAbsentPersonList) {
            var personLeave: Array<PersonLeaveDetail> = new Array<PersonLeaveDetail>();
            personLeave = this.personLeaveDetail.filter(a => a.personId == pat.id);
            if (personLeave.length == 0) {
                this.absentPersonList.push(pat);
            }
        }

    }

    updateAttendance(selectedPerson: PersonDetail) {
        var personTracking = <PersonTracking>{};
        personTracking.personId = selectedPerson.id;
        personTracking.organizationid = this.organizationId;
        personTracking.trackingDate = this.selectedDate.toString();
        personTracking.trackingTime = moment(new Date()).format('HH:mm');
        personTracking.createDate = new Date();
        personTracking.emailId = selectedPerson.emailId;
        personTracking.role = selectedPerson.role;
        personTracking.primaryMobile = selectedPerson.primaryMobile;
        this._setupService.markPresent1(personTracking).subscribe(result => {
            this.showPresentPerson();
            this.showScatterChart();
        });
    }

    showScatterChart() {
        this._setupService.getPresentPerson(this.selectedDate).subscribe(result => {
            this.personPresentDetailList = result;
            var tempStartTime: string = '07:00'
            this.personCountArr = new Array<number>();
            if (this.personPresentDetailList.length > 0) {
                for (var i = 0; i <= 30; i++) {
                    var noPerson = 0;
                    var personCount: Array<PersonTracking> = new Array<PersonTracking>();
                    var beginningTime = moment(tempStartTime, 'HH:mm');
                    var startTime = beginningTime.format('HH:mm');
                    var endTime = moment(beginningTime).startOf('minutes').add(10, 'minutes').format('HH:mm');
                    personCount = this.personPresentDetailList.filter(x => x.trackingTime >= startTime && x.trackingTime < endTime)
                    if (personCount.length > 0) {
                        this.personCountArr.push(personCount.length);
                    }
                    else {
                        this.personCountArr.push(noPerson);
                    }
                    tempStartTime = endTime;
                }
            } this.updateLine(this.chart);
        });

        this.data1 = {
            labels: ['7:00', '7:10', '7:20', '7:30', '7:40', '7:50 ',
                '8:00', '8:10', '8:20', '8:30', '8:40', '8:50',
                '9:00', '9:10', '9:20', '9:30', '9:40', '9:50',
                '10:00', '10:10', '10:20', '10:30', '10:40', '10:50',
                '11:00', '11:10', '11:20', '11:30', '11:40', '11:50', '12:00'
            ],
            datasets: [
                {
                    label: 'Present Person',
                    data: [
                        this.personCountArr != null ? this.personCountArr[0] : 0, this.personCountArr != null ? this.personCountArr[1] : 0, this.personCountArr != null ? this.personCountArr[2] : 0, this.personCountArr != null ? this.personCountArr[3] : 0
                        , this.personCountArr != null ? this.personCountArr[4] : 0, this.personCountArr != null ? this.personCountArr[5] : 0, this.personCountArr != null ? this.personCountArr[6] : 0, this.personCountArr != null ? this.personCountArr[7] : 0, this.personCountArr != null ? this.personCountArr[8] : 0
                        , this.personCountArr != null ? this.personCountArr[9] : 0, this.personCountArr != null ? this.personCountArr[10] : 0, this.personCountArr != null ? this.personCountArr[11] : 0, this.personCountArr != null ? this.personCountArr[12] : 0, this.personCountArr != null ? this.personCountArr[13] : 0
                        , this.personCountArr != null ? this.personCountArr[14] : 0, this.personCountArr != null ? this.personCountArr[15] : 0, this.personCountArr != null ? this.personCountArr[16] : 0, this.personCountArr != null ? this.personCountArr[17] : 0, this.personCountArr != null ? this.personCountArr[18] : 0
                        , this.personCountArr != null ? this.personCountArr[19] : 0, this.personCountArr != null ? this.personCountArr[20] : 0, this.personCountArr != null ? this.personCountArr[21] : 0, this.personCountArr != null ? this.personCountArr[22] : 0, this.personCountArr != null ? this.personCountArr[23] : 0
                        , this.personCountArr != null ? this.personCountArr[24] : 0, this.personCountArr != null ? this.personCountArr[25] : 0, this.personCountArr != null ? this.personCountArr[26] : 0, this.personCountArr != null ? this.personCountArr[27] : 0, this.personCountArr != null ? this.personCountArr[28] : 0
                        , this.personCountArr != null ? this.personCountArr[29] : 0, this.personCountArr != null ? this.personCountArr[30] : 0
                    ],
                    fill: false,
                    backgroundColor: '#42A5F5',
                    borderColor: "#1E88E5",
                },
            ]
        };
    }
    updateLine(chart: UIChart) {
        this.data1.datasets[0].data = [this.personCountArr.length > 0 ? this.personCountArr[0] : 0, this.personCountArr.length > 0 ? this.personCountArr[1] : 0, this.personCountArr.length > 0 ? this.personCountArr[2] : 0, this.personCountArr.length > 0 ? this.personCountArr[3] : 0
            , this.personCountArr.length > 0 ? this.personCountArr[4] : 0, this.personCountArr.length > 0 ? this.personCountArr[5] : 0, this.personCountArr.length > 0 ? this.personCountArr[6] : 0, this.personCountArr.length > 0 ? this.personCountArr[7] : 0, this.personCountArr.length > 0 ? this.personCountArr[8] : 0
            , this.personCountArr.length > 0 ? this.personCountArr[9] : 0, this.personCountArr.length > 0 ? this.personCountArr[10] : 0, this.personCountArr.length > 0 ? this.personCountArr[11] : 0, this.personCountArr.length > 0 ? this.personCountArr[12] : 0, this.personCountArr.length > 0 ? this.personCountArr[13] : 0
            , this.personCountArr.length > 0 ? this.personCountArr[14] : 0, this.personCountArr.length > 0 ? this.personCountArr[15] : 0, this.personCountArr.length > 0 ? this.personCountArr[16] : 0, this.personCountArr.length > 0 ? this.personCountArr[17] : 0, this.personCountArr.length > 0 ? this.personCountArr[18] : 0
            , this.personCountArr.length > 0 ? this.personCountArr[19] : 0, this.personCountArr.length > 0 ? this.personCountArr[20] : 0, this.personCountArr.length > 0 ? this.personCountArr[21] : 0, this.personCountArr.length > 0 ? this.personCountArr[22] : 0, this.personCountArr.length > 0 ? this.personCountArr[23] : 0
            , this.personCountArr.length > 0 ? this.personCountArr[24] : 0, this.personCountArr.length > 0 ? this.personCountArr[25] : 0, this.personCountArr.length > 0 ? this.personCountArr[26] : 0, this.personCountArr.length > 0 ? this.personCountArr[27] : 0, this.personCountArr.length > 0 ? this.personCountArr[28] : 0
            , this.personCountArr.length > 0 ? this.personCountArr[29] : 0, this.personCountArr.length > 0 ? this.personCountArr[30] : 0
        ]
        chart.refresh();
    }
    selectData1() {

    }
    ngOnInit() {

    }
}

interface PersonOnLeaveDescription {
    description: string;
    imagePath: string;
    personInfo: PersonDetail;
}

interface PresentPersonImage {
    personTracking: PersonTracking;
    imagePath: string;
}




