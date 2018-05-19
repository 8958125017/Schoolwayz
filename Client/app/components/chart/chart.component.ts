import { Component, OnInit, NgModule, EventEmitter, Pipe, PipeTransform, ViewChild } from '@angular/core';
import { FormsModule, FormControl, FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ChartModule, TabViewModule, UIChart, MenubarModule, MenuItem, PanelModule, ButtonModule, CheckboxModule, SelectItem, GrowlModule, Message } from 'primeng/primeng';
import { Http, Headers } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { SetupService } from '../../services/setup.service';
import * as moment from 'moment';
import { Observable } from 'rxjs/Rx';

@Component({
    selector: 'chart',
    template: require('./chart.component.html'),
    providers: [SetupService]
})

export class ChartComponent implements OnInit {
    data: any;
    data1: any;
    public http: Http;
    totalPatron: number;
    presentPatronCount: number;
    absconedPatronCount: number;
    absentpatron: number;
    presentOnleave: number;
    organizationId: string = localStorage.getItem("OrganizationId");
    private selectedDate: any;
    patronClass: string;
    section: string = null;
    pSection: string = null;
    pClass: string = null;
    activeItem: any;
    activeLink: any;
    Chart: any;
    @ViewChild("chart") chart: UIChart
    // @ViewChild("chartLine") chartLine:  UIChart
    patronDetail: PatronDetail;
    absentPatronList: PatronDetail[];
    tempAbsentPatronList: PatronDetail[];
    patron: PatronDetail;
    patronCountArr: Array<any>;
    selectedOnLeaveStudent: PatronDetail;
    patronLeaveDetail: PatronLeaveDetail[]; // Patron Leave Detail
    presentPatron: PatronTracking[]; // Present Patron
    patronDetailList: PatronDetail[]; // Patron Detail where leaves are applied
    totalPatronList: PatronDetail[]; // Total Patron
    public gradeDetails: GradeDetail[];
    public gradeDetail: Array<string>
    public classList: SelectItem[];
    public sectonList: SelectItem[];
    trackingTypeDetails: PatronTracking[];
    trackingTypeList: PatronTracking[];
    patronId: string
    patronDetailList1: PatronDetail[];
    patronDetails: PatronDetail[];
    getPatron: PatronDetail;
    absconedPatronDetail: PatronDetail;
    absconedPatronDetailList: PatronDetail[];
    patronName: string;
    patronTracking: PatronTracking;
    totalGrades: string[];
    present: boolean = true;
    absent: boolean = true;
    onLeave: boolean = true;
    patronOnLeaveDescriptionList: PatronOnLeaveDescription[];
    selectedTab: number = 0;
    markedAbsentList: PatronTracking[] = [];
    markedAbsconedList: PatronTracking[] = [];
    presentPatronImage: PresentPatronImage;
    presentPatronImageList: PresentPatronImage[];
    msgs: Message[];
    constructor(http: Http, private _setupService: SetupService, private activatedRoute: ActivatedRoute, private _router: Router) {
        this.http = http;
        this.selectedDate = moment(new Date()).format('YYYY-MM-DD');
        //this.selectedDate = moment(new Date()).toDate();
        this._setupService.getGrade().subscribe((response) => {
            this.totalGrades = [];
            this.gradeDetails = response
            for (var grades of this.gradeDetails) {
                if (this.totalGrades.indexOf(grades.grade) == -1) {
                    this.totalGrades.push(grades.grade);
                }
            }
            this.createclassList();
        });

        this.pClass = "School";
        this.patronClass = null;
        this.section = "";
        this.showPresentPatron();
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
        else if (e.index == 4) {
            this.selectedTab = 4;
        }
    }

    activateTab(tabNumber) {
        this.selectedTab = tabNumber;
    }

    selectData1() {

    }
    public getPatronTrackingData(trackingTypeList: PatronTracking[]) {
        this.trackingTypeDetails = [];
        var patronInfo: PatronDetail;
        this._setupService.getPatron().subscribe(result => {
            this.patronDetailList1 = result;
            this.presentPatronImageList = [];
            for (var item of trackingTypeList) {
                this.presentPatronImage = <PresentPatronImage>{};
                if (!item.isAbsconed) {
                    this.patronTracking = <PatronTracking>{};
                    patronInfo = this.patronDetailList1.find(x => x.id == item.patronId);
                    if (patronInfo != null) {
                        this.patronTracking.firstName = patronInfo.firstName;
                        this.patronTracking.lastName = patronInfo.lastName;
                        this.patronTracking.section = patronInfo.section;
                        this.patronTracking.class = patronInfo.class.toString();
                        this.patronTracking.rollNumber = patronInfo.rollNo;
                        this.patronTracking.trackingTime = moment(item.trackingTime, 'H:mm').format('h:mm a');
                        this.presentPatronImage.patronTracking = this.patronTracking;
                        this.presentPatronImage.imagePath = patronInfo.imgUrl;
                        this.presentPatronImageList.push(this.presentPatronImage);
                    }
                }
            }
        });
    }


    getSelectedDate(value) {
        var a = this.selectedDate;
        var b = moment(a).format('YYYY-MM-DD');
        this.selectedDate = b;
        this.patronClass = this.patronClass;
        this.section = this.section;
        this.showPresentPatron();
        this.showScatterChart();
    }

    getpresentpatron(value) {
        this.pClass = "School";
        this.patronClass = null;
        this.section = null;
        this.showPresentPatron();
        this.showScatterChart();
        this.msgs = [];
        this.msgs.push({ severity: 'info', summary: 'Info message', detail: 'patron tracking by school' })
    }

    createclassList() {
        this.classList = [];
        this.sectonList = [];
        this.classList.push({ label: 'Class', value: null })
        this.sectonList.push({ label: 'Section', value: 'Section' });
        for (var i = 0; i < this.totalGrades.length; i++) {
            this.classList.push({ label: this.totalGrades[i], value: this.totalGrades[i] });
        }
    }

    getSelectedClassSection() {
        this.sectonList = [];
        var classSection: GradeDetail[];
        this.sectonList.push({ label: 'Section', value: 'Section' });
        classSection = this.gradeDetails.filter(x => x.grade == this.patronClass).sort();
        for (var i = 0; i < classSection.length; i++) {
            this.sectonList.push({ label: classSection[i].section, value: classSection[i].section });
        }
    }

    showPresentPatron() {
        var updatedPatronList: PatronTracking[] = [];
        this.markedAbsconedList = [];
        if (this.patronClass == null) {
            this._setupService.getPresentPatron(this.selectedDate).subscribe(result => {
                this.presentPatron = result;
                this.getPatronTrackingData(this.presentPatron);
                this._setupService.getPatronOnLeave(this.selectedDate).subscribe(result => {
                    this.patronLeaveDetail = result;
                    for (var pat of this.presentPatron) {
                        if (pat.isMarkedAbsent) {
                            this.markedAbsentList.push(pat);
                        }
                        if (pat.isAbsconed) {
                            this.markedAbsconedList.push(pat);
                        }
                        if (this.patronLeaveDetail.find(x => x.patronId == pat.patronId)) {
                            updatedPatronList.push(pat);
                        }
                    }
                    this._setupService.getPatron().subscribe(result => {
                        this.totalPatronList = result;
                        this.totalPatron = this.totalPatronList.length;
                        this.presentPatronCount = this.presentPatron.length - this.markedAbsconedList.length;
                        this.absconedPatronCount = this.markedAbsconedList.length;
                        this.presentOnleave = this.patronLeaveDetail.length - updatedPatronList.length;
                        this.absentpatron = this.totalPatron - (this.presentPatronCount + this.absconedPatronCount + this.presentOnleave);
                        this.showOnLeavePatron();
                    });
                });
            });
        } else {
            this._setupService.getPresentPatronByClass(this.patronClass, this.section, this.selectedDate).subscribe(result => {
                this.presentPatron = result;
                this.getPatronTrackingData(this.presentPatron);
                this._setupService.getPatronOnLeaveByClass(this.patronClass, this.section, this.selectedDate).subscribe(result => {
                    this.patronLeaveDetail = result;
                    for (var pat of this.presentPatron) {
                        if (pat.isMarkedAbsent) {
                            this.markedAbsentList.push(pat);
                        }
                        if (pat.isAbsconed) {
                            this.markedAbsconedList.push(pat);
                        }
                        if (this.patronLeaveDetail.find(x => x.patronId == pat.patronId)) {
                            updatedPatronList.push(pat);
                        }
                    }
                    this._setupService.getClassPatron(this.patronClass, this.section, this.selectedDate).subscribe(result => {
                        this.totalPatronList = result;
                        this.totalPatron = this.totalPatronList.length;
                        this.presentPatronCount = this.presentPatron.length - this.markedAbsconedList.length;
                        this.absconedPatronCount = this.markedAbsconedList.length;
                        this.presentOnleave = this.patronLeaveDetail.length - updatedPatronList.length;
                        this.absentpatron = this.totalPatron - (this.presentPatron.length + this.absconedPatronCount + this.presentOnleave);
                        this.showOnLeavePatron();
                    });
                });
            });
        }
    }

    showOnLeavePatron() {
        let observables = new Array();
        var patronOnLeaveDescription: PatronOnLeaveDescription;
        var OnLeaveRemoved: Array<PatronTracking> = new Array<PatronTracking>();
        this.patronOnLeaveDescriptionList = [];
        for (var leave of this.patronLeaveDetail) {
            OnLeaveRemoved = this.presentPatron.filter(a => a.patronId == leave.patronId)
            if (OnLeaveRemoved.length == 0) {
                observables.push(this._setupService.getPatronById(leave.patronId));
            }
        }
        Observable.forkJoin(observables).subscribe(
            result => {
                this.patronDetailList1 = <PatronDetail[]>result;
                for (var i = 0; i < this.patronDetailList1.length; i++) {
                    if (this.patronLeaveDetail.find(x => x.patronId == this.patronDetailList1[i].id)) {
                        patronOnLeaveDescription = <PatronOnLeaveDescription>{};
                        patronOnLeaveDescription.patronInfo = this.patronDetailList1[i];
                        patronOnLeaveDescription.description = this.patronLeaveDetail[i].description;
                        patronOnLeaveDescription.imagePath = this.patronDetailList1[i].imgUrl;
                        this.patronOnLeaveDescriptionList.push(patronOnLeaveDescription);
                    }
                }
            }
        );
        this.showAbsentPatron();
    }

    showAbsentPatron() {
        var tempPatronAbsentList: Array<PatronDetail> = new Array<PatronDetail>();
        this.absentPatronList = [];
        this.tempAbsentPatronList = [];
        for (var i = 0; i < this.totalPatronList.length; i++) {
            var patronTrack: Array<PatronTracking> = new Array<PatronTracking>();
            patronTrack = this.presentPatron.filter(a => a.patronId == this.totalPatronList[i].id);
            if (patronTrack.length == 0) {
                this.tempAbsentPatronList.push(this.totalPatronList[i]);
            }
        }
        for (var pat of this.tempAbsentPatronList) {
            var patronLeave: Array<PatronLeaveDetail> = new Array<PatronLeaveDetail>();
            patronLeave = this.patronLeaveDetail.filter(a => a.patronId == pat.id);
            if (patronLeave.length == 0) {
                this.absentPatronList.push(pat);
            }
        }
        this.showAbsconedPatron();
    }

    showAbsconedPatron() {
        this.absconedPatronDetailList = [];
        for (var absconedPatron of this.markedAbsconedList) {
            if (absconedPatron != null) {
                this._setupService.getPatronById(absconedPatron.patronId).subscribe(result => {
                    this.absconedPatronDetail = result;
                    this.absconedPatronDetailList.push(this.absconedPatronDetail);
                });
            }
        }
    }

    updateAttendance(selectedPatron: PatronDetail) {
        var patronTracking = <PatronTracking>{};
        patronTracking.patronId = selectedPatron.id;
        patronTracking.class = selectedPatron.class.toString();
        patronTracking.section = selectedPatron.section;
        patronTracking.organizationid = this.organizationId;
        patronTracking.trackingDate = this.selectedDate;
        patronTracking.trackingTime = moment(new Date()).format('HH:mm');
        patronTracking.createDate = new Date();
        this._setupService.markPresent(patronTracking).subscribe(result => {
            this.showPresentPatron();
            this.showScatterChart();
        });
    }

    updateAttendance1(selectedPatron: PatronOnLeaveDescription) {
        var patronTracking = <PatronTracking>{};
        patronTracking.patronId = selectedPatron.patronInfo.id;
        patronTracking.class = selectedPatron.patronInfo.class.toString();
        patronTracking.section = selectedPatron.patronInfo.section;
        patronTracking.organizationid = this.organizationId;
        patronTracking.trackingDate = this.selectedDate;
        patronTracking.trackingTime = moment(new Date()).format('HH:mm');
        patronTracking.createDate = new Date();
        this._setupService.markPresent(patronTracking).subscribe(result => {
            this.showPresentPatron();
            this.showScatterChart();
        });
    }



    showScatterChart() {
        if (this.patronClass == null) {
            this._setupService.getPresentPatron(this.selectedDate).subscribe(result => {
                this.presentPatron = result;
                var tempStartTime: string = '07:00';
                this.patronCountArr = new Array<any>();
                if (this.presentPatron.length > 0) {
                    for (var i = 0; i <= 30; i++) {
                        var noPatron = 0;
                        var patronCount: Array<PatronTracking> = new Array<PatronTracking>();
                        var beginningTime = moment(tempStartTime, 'HH:mm');
                        var startTime = beginningTime.format('HH:mm');
                        var endTime = moment(beginningTime).startOf('minutes').add(10, 'minutes').format('HH:mm');
                        patronCount = this.presentPatron.filter(x => x.trackingTime >= startTime && x.trackingTime < endTime)
                        if (patronCount.length > 0) {
                            this.patronCountArr.push(Number(patronCount.length));
                        }
                        else {
                            this.patronCountArr.push(Number(noPatron));
                        }
                        tempStartTime = endTime;
                    }
                }
                this.updateLine(this.chart);
            });

        } else {
            this._setupService.getPresentPatronByClass(this.patronClass, this.section, this.selectedDate).subscribe(result => {
                this.presentPatron = result;
                var tempStartTime: string = '07:00';
                this.patronCountArr = new Array<any>();
                if (this.presentPatron.length > 0) {
                    for (var i = 0; i <= 30; i++) {
                        var noPatron = 0;
                        var patronCount: Array<PatronTracking> = new Array<PatronTracking>();
                        var beginningTime = moment(tempStartTime, 'HH:mm');
                        var startTime = beginningTime.format('HH:mm');
                        var endTime = moment(beginningTime).startOf('minutes').add(10, 'minutes').format('HH:mm');
                        patronCount = this.presentPatron.filter(x => x.trackingTime >= startTime && x.trackingTime < endTime)
                        if (patronCount.length > 0) {
                            this.patronCountArr.push(Number(patronCount.length));
                        }
                        else {
                            this.patronCountArr.push(Number(noPatron));
                        }
                        tempStartTime = endTime;
                    }
                }

            });
        }

        this.data1 = {
            labels: ['7:00', '7:10', '7:20', '7:30', '7:40', '7:50 ',
                '8:00', '8:10', '8:20', '8:30', '8:40', '8:50',
                '9:00', '9:10', '9:20', '9:30', '9:40', '9:50',
                '10:00', '10:10', '10:20', '10:30', '10:40', '10:50',
                '11:00', '11:10', '11:20', '11:30', '11:40', '11:50', '12:00'
            ],
            datasets: [
                {
                    label: 'Present Patron',
                    data: [
                        this.patronCountArr != null ? this.patronCountArr[0] : 0, this.patronCountArr != null ? this.patronCountArr[1] : 0, this.patronCountArr != null ? this.patronCountArr[2] : 0, this.patronCountArr != null ? this.patronCountArr[3] : 0
                        , this.patronCountArr != null ? this.patronCountArr[4] : 0, this.patronCountArr != null ? this.patronCountArr[5] : 0, this.patronCountArr != null ? this.patronCountArr[6] : 0, this.patronCountArr != null ? this.patronCountArr[7] : 0, this.patronCountArr != null ? this.patronCountArr[8] : 0
                        , this.patronCountArr != null ? this.patronCountArr[9] : 0, this.patronCountArr != null ? this.patronCountArr[10] : 0, this.patronCountArr != null ? this.patronCountArr[11] : 0, this.patronCountArr != null ? this.patronCountArr[12] : 0, this.patronCountArr != null ? this.patronCountArr[13] : 0
                        , this.patronCountArr != null ? this.patronCountArr[14] : 0, this.patronCountArr != null ? this.patronCountArr[15] : 0, this.patronCountArr != null ? this.patronCountArr[16] : 0, this.patronCountArr != null ? this.patronCountArr[17] : 0, this.patronCountArr != null ? this.patronCountArr[18] : 0
                        , this.patronCountArr != null ? this.patronCountArr[19] : 0, this.patronCountArr != null ? this.patronCountArr[20] : 0, this.patronCountArr != null ? this.patronCountArr[21] : 0, this.patronCountArr != null ? this.patronCountArr[22] : 0, this.patronCountArr != null ? this.patronCountArr[23] : 0
                        , this.patronCountArr != null ? this.patronCountArr[24] : 0, this.patronCountArr != null ? this.patronCountArr[25] : 0, this.patronCountArr != null ? this.patronCountArr[26] : 0, this.patronCountArr != null ? this.patronCountArr[27] : 0, this.patronCountArr != null ? this.patronCountArr[28] : 0
                        , this.patronCountArr != null ? this.patronCountArr[29] : 0, this.patronCountArr != null ? this.patronCountArr[30] : 0,
                    ],
                    fill: false,
                    backgroundColor: '#42A5F5',
                    borderColor: "#1E88E5",
                },
            ]
        };
    }

    updateLine(chart: UIChart) {
        this.data1.datasets[0].data = [this.patronCountArr.length > 0 ? this.patronCountArr[0] : 0, this.patronCountArr.length > 0 ? this.patronCountArr[1] : 0, this.patronCountArr.length > 0 ? this.patronCountArr[2] : 0, this.patronCountArr.length > 0 ? this.patronCountArr[3] : 0
            , this.patronCountArr.length > 0 ? this.patronCountArr[4] : 0, this.patronCountArr.length > 0 ? this.patronCountArr[5] : 0, this.patronCountArr.length > 0 ? this.patronCountArr[6] : 0, this.patronCountArr.length > 0 ? this.patronCountArr[7] : 0, this.patronCountArr.length > 0 ? this.patronCountArr[8] : 0
            , this.patronCountArr.length > 0 ? this.patronCountArr[9] : 0, this.patronCountArr.length > 0 ? this.patronCountArr[10] : 0, this.patronCountArr.length > 0 ? this.patronCountArr[11] : 0, this.patronCountArr.length > 0 ? this.patronCountArr[12] : 0, this.patronCountArr.length > 0 ? this.patronCountArr[13] : 0
            , this.patronCountArr.length > 0 ? this.patronCountArr[14] : 0,  this.patronCountArr.length > 0 ? this.patronCountArr[15] : 0, this.patronCountArr.length > 0 ? this.patronCountArr[16] : 0, this.patronCountArr.length > 0 ? this.patronCountArr[17] : 0, this.patronCountArr.length > 0 ? this.patronCountArr[18] : 0
            , this.patronCountArr.length > 0 ? this.patronCountArr[19] : 0, this.patronCountArr.length > 0 ? this.patronCountArr[20] : 0, this.patronCountArr.length > 0 ? this.patronCountArr[21] : 0, this.patronCountArr.length > 0 ? this.patronCountArr[22] : 0, this.patronCountArr.length > 0 ? this.patronCountArr[23] : 0
            , this.patronCountArr.length > 0 ? this.patronCountArr[24] : 0, this.patronCountArr.length > 0 ? this.patronCountArr[25] : 0, this.patronCountArr.length > 0 ? this.patronCountArr[26] : 0, this.patronCountArr.length > 0 ? this.patronCountArr[27] : 0, this.patronCountArr.length > 0 ? this.patronCountArr[28] : 0
            , this.patronCountArr.length > 0 ? this.patronCountArr[29] : 0, this.patronCountArr.length > 0 ? this.patronCountArr[30] : 0
        ]
        chart.refresh();
    }

    itemClick(event, item: MenuItem) {
        if (!item.url || item.routerLink) {
            event.preventDefault();
        }

        if (item.command) {
            if (!item.eventEmitter) {
                item.eventEmitter = new EventEmitter();
                item.eventEmitter.subscribe(item.command);
            } else {
                item.eventEmitter.unsubscribe();
                item.eventEmitter = new EventEmitter();
                item.eventEmitter.subscribe(item.command);
            }

            item.eventEmitter.emit({
                originalEvent: event,
                item: item
            });
        }

        if (item.routerLink) {
            this._router.navigate(item.routerLink);
        }

        this.activeItem = null;
        this.activeLink = null;
    }
    ngOnInit() {

    }

    download() {
        var tempList: any[] = [];
        if (this.selectedTab == 1) {
            for (var patron of this.presentPatronImageList) {
                tempList.push({
                    "Name": patron.patronTracking.patronName,
                    "Class ": patron.patronTracking.class,
                    "Section": patron.patronTracking.section,
                    "TrackingTime": patron.patronTracking.trackingTime,
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
        if (this.selectedTab == 3) {
            for (var leavePatron of this.patronOnLeaveDescriptionList) {
                tempList.push({
                    "Name": leavePatron.patronInfo.firstName + " " + leavePatron.patronInfo.lastName,
                    "Class ": leavePatron.patronInfo.class,
                    "Section": leavePatron.patronInfo.section,
                    "RollNumber": leavePatron.patronInfo.rollNo,
                    "Description": leavePatron.description,
                });
            }
        }
        if (this.selectedTab == 4) {
            for (var absconedPatron of this.absconedPatronDetailList) {
                tempList.push({
                    "Name": absconedPatron.firstName + " " + absconedPatron.lastName,
                    "Class ": absconedPatron.class,
                    "Section": absconedPatron.section,
                    "RollNumber": absconedPatron.rollNo,
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
interface PresentPatronImage {
    patronTracking: PatronTracking;
    imagePath: string;
}




