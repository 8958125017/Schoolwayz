import {Component, OnInit, NgModule} from '@angular/core';
import {FormsModule, FormControl, FormBuilder, Validators, FormGroup} from '@angular/forms'
import {Http, Headers} from '@angular/http'
import {Router, ActivatedRoute} from '@angular/router';
import {SetupService} from '../../services/setup.service';
import {PanelModule, SelectItem, ConfirmationService, TabViewModule, CheckboxModule, GrowlModule, Message } from 'primeng/primeng';
import * as moment from 'moment';
import {Observable} from 'rxjs/Rx';

@Component({
    selector: 'inhousemessage',
    template: require('./inhousemessage.component.html'),
    providers: [SetupService, ConfirmationService]
})

export class InhouseMessageComponent 
{
     msgs: Message[] = [];
    selectedDevice: string;
    public http: Http;
    organizationId: string = localStorage.getItem("OrganizationId");
    public messageDetail: InhouseMessage;
    public outgoingMessage: OutgoingMessage;
    public deviceDetail: DeviceDetail;
    public messageDetails: SetupDevice[];
    deviceList: SelectItem[];
    public occurenceType: SelectItem[];
    selectedOccurence: string;
    showWeek: boolean;
    showMonth: boolean;
    selectedMonths: string[] = [];
    selectedDays: string[] = [];
    public daysOfWeek: string = "";
    public daysOfMonth: string = "";
    days: SelectItem[];
    months: SelectItem[];
    public messageCenterDetails: InhouseMessage[];
    public externalMessageDetails: OutgoingMessage[]
    messagedetailss: InhouseMessage[];
    selectedMessageDetail: InhouseMessage;
    messagedetails: InhouseMessage[];
    messageCenterDialog: boolean = false;
    submitted: boolean;
    displayDialog: boolean;
    messageId: string;
    public gradeDetails: GradeDetail[];
    public classList: SelectItem[];
    public classSectionList: SelectItem[];
    public messageCategory: SelectItem[];
    selectedGrade: string[]=[];
    selectedClassSection: string[]=[];
    selectOrganization: string;
    selectedCategory: string;
    selectClass: string;
    showClass: boolean;
    showClassSection: boolean;
    selectedBroadCast: string;
    public broadcastTo: SelectItem[];
    public outgoingMessageTo: SelectItem[];
    deviceDetailList: DeviceDetail[] = [];
    public deviceDetails: DeviceDetail[]
    patron: boolean;
    patronMapDialog: boolean;
    patronDetails: PatronDetail[];
    selectedPatron: PatronDetail;
    selectedPatronDetail: PatronDetail;
    patronClass: string;
    section: string;
    selectedDate: string;
    totalPatronList: PatronDetail[];
    name: string;
    constructor(http: Http, private _router: Router, private activatedRoute: ActivatedRoute, private confirmationService: ConfirmationService, private _setupService: SetupService) {
        this.http = http;
        this.showClass=false;
        this._setupService.getPatron().subscribe(result => {
            this.patronDetails = result;
        })
        this._setupService.getGrade().subscribe((response) => {
            this.gradeDetails = response;
            this.gradeDetails = this.gradeDetails.sort(function (a, b) {
                return parseInt(a.grade) - parseInt(b.grade);
            });
            this.createGradeList();
            this.createClassList();
        });
        this.getMessage(); 

        this.broadcastTo = [];
        this.broadcastTo.push({ label: 'Choose Option', value: null });
        this.broadcastTo.push({ label: 'Organization', value: 'Organization' });
        this.broadcastTo.push({ label: 'Class', value: 'Class' });
        this.broadcastTo.push({ label: 'Class-Section', value: 'Sections' });
        this.broadcastTo.push({ label: 'Transport', value: 'Transport' });

        this.outgoingMessageTo = [];
        this.outgoingMessageTo.push({ label: 'Choose Option', value: null });
        this.outgoingMessageTo.push({ label: 'Organization', value: 'Organization' });
        this.outgoingMessageTo.push({ label: 'Class', value: 'Class' });
        this.outgoingMessageTo.push({ label: 'Class-Section', value: 'Sections' });
        this.outgoingMessageTo.push({ label: 'Patron', value: 'Patron' });

        this.messageCategory = [];
        this.messageCategory.push({ label: 'SelectCategory', value: null });
        this.messageCategory.push({ label: 'Important', value: 'Important' });
        this.messageCategory.push({ label: 'Critical', value: 'Critical' });
        this.messageCategory.push({label:'Regular',value:'Regular'});
       
       
        this.messageDetail={
            //id: '',
            message: null,
            messageCategory: '',
            deviceDetail: this.deviceDetailList,
            expiryDate: null,
            organizationId: this.organizationId,
            messageDate: '',
            messageTime: '',
            messageType:''
        }
      
    }
    getMessage() {
        
        this._setupService.getMessage().subscribe(result => {
            this.messageCenterDetails = result;
            
            
        });
        this._setupService.getOutgoingMessage().subscribe(result => {
            this.externalMessageDetails = result;
          
        });
        

    }
    openSearchBox() {
        this.patronMapDialog = true;
    }
    mapPatron(event) {
        this.selectedPatron = this.selectedPatronDetail;
        this.patronMapDialog = false;
    }
    createGradeList() {
        this.classSectionList = [];
        for (var i = 0; i < this.gradeDetails.length; i++) {
            this.classSectionList.push({ label: this.gradeDetails[i].grade + "-" + this.gradeDetails[i].section, value: this.gradeDetails[i].grade + "-" + this.gradeDetails[i].section });
        }
    }
    
    createClassList() {
        this.classList = [];
        for (var i = 0; i < this.gradeDetails.length; i++) {
            if (!this.classList.find(x => x.label == this.gradeDetails[i].grade)) {
                this.classList.push({ label: this.gradeDetails[i].grade, value: this.gradeDetails[i].grade });
            }
        }
    }

    sendMessageToPatron() {
        let observables = new Array();
        var org: any[] = [];
        var patrons: PatronDetail[] = [];
        var pat: OutgoingMessage[] = [];
        var selectedClassPatron: PatronDetail[][] = [];
        if (this.selectedBroadCast == 'Organization') {
            this._setupService.getPatron().subscribe(result => {
                patrons = result;
                selectedClassPatron.push(patrons);
                this.sendExternalData(selectedClassPatron);
            })
            
        }
        else if (this.selectedBroadCast == 'Class') {
            for (var patronClass of this.selectedGrade) {
                observables.push(this._setupService.getClassByPatrons(patronClass));
            }
            Observable.forkJoin(observables).subscribe(
                result => {
                    selectedClassPatron = <PatronDetail[][]>result;
                    this.sendExternalData(selectedClassPatron);
                }
            );
        }
        else if (this.selectedBroadCast == 'Sections') {
            for (var patronClassSection of this.selectedClassSection) {
                var grades: string[] = patronClassSection.split("-");
                observables.push(this._setupService.getClassPatron(grades[0], grades[1], this.selectedDate));
            }
            Observable.forkJoin(observables).subscribe(
                result => {
                    selectedClassPatron = <PatronDetail[][]>result;
                    this.sendExternalData(selectedClassPatron);
                }
            );
        }
        else if (this.selectedBroadCast == 'Patron') {
            patrons.push(this.selectedPatron)
            selectedClassPatron.push(patrons);
            this.sendExternalData(selectedClassPatron);
           }
       
        
        this.messageCenterDialog = false;
    }

    sendExternalData(selectedClassPatron:PatronDetail[][]) {
           for (var classPatron of selectedClassPatron) {
            for (var patron of classPatron) {
                this.outgoingMessage.patronId.push(patron.id);
            }
        }
           this.outgoingMessage.messageDate = moment(new Date()).format('YYYY-MM-DD');
           this._setupService.createOutgoingMessage(this.outgoingMessage).subscribe(messageDetails => {
            this._setupService.getMessage().subscribe(result => {
                this.messageCenterDetails = result;
            });
        });

    }

    sendMessage() {
            let observables = new Array();
            var allClassDevice: SetupDevice[][] = [];
            var allClassDeviceList: any[] = [];
            this.messageDetail.messageCategory = this.selectedCategory;
            if (this.selectedBroadCast == 'Organization') {
                var allDevice: SetupDevice[] = [];
                this._setupService.getAttendanceDevice().subscribe(result => {
                    allDevice = result;
                    allClassDevice.push(allDevice);
                    this.sendData(allClassDevice);
                });
            }
            else if (this.selectedGrade.length > 0 && this.selectedBroadCast == 'Class') {
                for (var patronClass of this.selectedGrade) {
                    observables.push(this._setupService.getAllClassDevice(patronClass));
                }
                Observable.forkJoin(observables).subscribe(
                    result => {
                        allClassDevice = <SetupDevice[][]>result;
                        this.sendData(allClassDevice);
                    }
                );
            } else if (this.selectedClassSection.length > 0 && this.selectedBroadCast == 'Sections') {
                for (var patronClassSection of this.selectedClassSection) {
                    var grades: string[] = patronClassSection.split("-");
                    observables.push(this._setupService.getSectionDevice(grades[0], grades[1]));
                }
                Observable.forkJoin(observables).subscribe(
                    result => {
                        allClassDevice = <SetupDevice[][]>result;
                        this.sendData(allClassDevice);
                    }
                );
            }
            else if (this.selectedBroadCast == 'Transport') {
                var transportDevice: SetupDevice[] = [];
                this._setupService.getTransportDevice().subscribe(result => {
                    transportDevice = result;
                    allClassDevice.push(transportDevice);
                    this.sendData(allClassDevice);
                });
            }
            this.msgs = [];
            this.msgs.push({ severity: 'info', summary:'message created sucessfully' });
            this.messageCenterDialog = false;
    }

    sendData(classDeviceInfoList: SetupDevice[][]) {
        this.deviceDetailList = [];
        for (var classDeviceInfo of classDeviceInfoList) {           
            if (classDeviceInfo != null) {
                for (var classDevice of classDeviceInfo) {
                   this.deviceDetail = <DeviceDetail>{};
                   this.deviceDetail.deviceId = classDevice.name;
                   this.deviceDetail.receivedBy = classDevice.class + "-" + classDevice.section;
                   if (this.selectedBroadCast == 'Transport') {
                       this.deviceDetail.receivedBy = classDevice.name;
                   }                 
                    //this.deviceDetail.acknowledgeDate = moment(new Date()).format('YYYY-MM-DD');
                    //this.deviceDetail.acknowledgeTime = moment(new Date()).format('HH:MM');
                    this.deviceDetailList.push(this.deviceDetail);
               }
            }
            
        }
        if (this.messageDetail.expiryDate == null) {
            this.messageDetail.expiryDate = moment(new Date()).format('YYYY-MM-DD');
        }
        var a = this.messageDetail.expiryDate;
        var b = moment(a).format('YYYY-MM-DD');
        this.messageDetail.expiryDate = b;

        this.messageDetail.deviceDetail = this.deviceDetailList;
        this.messageDetail.messageDate = moment(new Date()).format('YYYY-MM-DD');
       
        this.messageDetail.messageCategory = this.selectedCategory;
        this._setupService.createMessage(this.messageDetail).subscribe(res => {
            
            if (res === 204) {
                this._setupService.getMessage().subscribe(result => {
                    this.messageCenterDetails = result;
                    
                });
            }
            //this.getMessage();
        });
    }
    createMessageList() {
        this.deviceList = [];
        this.deviceList.push({ label: 'Device List', value: 'null' });
        for (var i = 0; i < this.messageDetails.length; i++) {
            this.deviceList.push({ label: this.messageDetails[i].name, value: this.messageDetails[i].id });
        }
    }
    
    createMessage() {
        this.messageDetail = {
            //id: '',
            message: null,
            messageCategory: '',
            deviceDetail: this.deviceDetailList,
            expiryDate: null,
            organizationId: this.organizationId,
            messageDate: '',
            messageTime: '',
            messageType: ''
        }
        
        this.selectedBroadCast = null;
        this.selectedCategory=this.messageDetail.messageCategory;
        this.messageCenterDialog = true;
    }

    onCancel(event: Event) {
        this.messageCenterDialog = false;
    }

    ngOnInit() {
      
    }
    onSelectMode() {
           if (this.selectedBroadCast == 'Organization') {
            this.selectedGrade = [];
            this.selectedClassSection = [];
            this.showClassSection = false;
            this.showClass = false;
        }
        if (this.selectedBroadCast == 'Class') {
            this.selectedClassSection = [];
            this.showClassSection = false;
            this.showClass = true;
        }
        if (this.selectedBroadCast == 'Sections') {
            this.selectedGrade = [];
            this.showClassSection = true;
            this.showClass = false;
        }
        if (this.selectedBroadCast == 'Transport') {
            this.selectedGrade = [];
            this.selectedClassSection = [];
            this.showClassSection = false;
            this.showClass = false;
        }
        if (this.selectedBroadCast == 'Patron') {
            this.showClassSection = false;
            this.showClass = false;
            this.patron = true;
        }
    }
    

    confirm(event) {
        this.deviceDetails = [];
        this.deviceDetails = this.selectedMessageDetail.deviceDetail;
        this.displayDialog = true;
    }
    
}

