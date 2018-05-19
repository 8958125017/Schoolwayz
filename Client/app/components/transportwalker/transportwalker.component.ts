import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { SelectItem, ConfirmationService, Message } from 'primeng/primeng';
import { SetupService } from '../../services/setup.service';
import { AppSettings} from '../../services/global.constants'
import * as moment from 'moment';
@Component({
    selector: 'transportwalker',
    template: require('./transportwalker.component.html'),
    providers: [ConfirmationService, SetupService]
})

export class TransportWalkerComponent {
    walkerform: FormGroup;
    loading: boolean;
    msgs: Message[] = [];
    public transportWalkingRequest: TransportWalkingRequest;
    selectedPatronDetail: PatronDetail;
    orgId: string = AppSettings.ORGANIZATION_ID;
    transportWalkerDialog: boolean = false;
    public requestModeList: SelectItem[];
    selectedMode: string;
    public requestByList: SelectItem[];
    selectedRequestBy: string;
    public reasonList: SelectItem[];
    selectedReason: string;
    patronDetails: PatronDetail[];
    patronMapDialog: boolean;
    transportWalkerPatronList: TransportWalkingDetail[];
    transportWalkerList: TransportWalkingDetail[];
    selectedPatron: PatronDetail;    
    private selectedTime: any;
    selectedWalkerDetail: TransportWalkingDetail;
    pickImage: string;
    dropImage: string;
    selectedYear: any;
    id: any;
    current: boolean;
    history: boolean;
    startDate: string;
    endDate: string;
    currentDate: string;
    constructor(private confirmationService: ConfirmationService, private _setupService: SetupService, private fb: FormBuilder) {
        this.loading = true;        
        this.currentWalker();
        this.selectedYear = AppSettings.SELECTED_YEAR;
        this.selectedTime = AppSettings.CURRENT_TIME;
        this.startDate = AppSettings.CURRENT_DATE;
        this.currentDate = AppSettings.CURRENT_DATE;
        this.endDate = moment(new Date(), "YYYY-MM-DD").add(1, 'days').format('YYYY-MM-DD');  
        this._setupService.getTransportPatron().subscribe(result => {
            this.patronDetails = result;
            this.getwalker();
        })

        this.transportWalkingRequest = {
            id: '',
            patronId: '',
            requestBy: '',
            requestMode: '',
            reason: '',
            description: '',
            requestDate: AppSettings.CURRENT_DATE,
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

        this.requestModeList = [];
        //this.requestModeList.push({ label: 'select', value: 'null' });
        this.requestModeList.push({ label: 'In person', value: 'In person' });
        this.requestModeList.push({ label: 'Email', value: 'Email' });
        this.requestModeList.push({ label: 'Via Phone', value: 'Via Phone' });
        this.requestModeList.push({ label: 'Other', value: 'Other' });

        this.requestByList = [];
      //  this.requestByList.push({ label: 'select', value: 'null' });
        this.requestByList.push({ label: 'Parents', value: 'Parents' });
        this.requestByList.push({ label: 'Admin', value: 'Admin' });
        this.requestByList.push({ label: 'Self', value: 'Self' });


        //this.reasonList = [];
        //this.reasonList.push({ label: 'select', value: 'null' });
        //this.reasonList.push({ label: 'Sick', value: 'Sick' });
        //this.reasonList.push({ label: 'Family Function', value: 'Family Function' });

    }
    ngOnInit() {

        this.validateWalker();
    }
    historyWalker() {
        this.current = false;
        this.transportWalkerList = [];
        this.history = true;
        this.startDate = new Date();
        this.endDate = new Date();
        this.loading = true;
        setTimeout(() => {
            this.loading = false;
        }, 15000);
        this.getwalker();

    }
    
    currentWalker() {
       
        this.history = false;
        this.transportWalkerList = [];
        this.current = true;
        this.startDate = AppSettings.CURRENT_DATE;
        this.endDate = moment(new Date(), "YYYY-MM-DD").add(1, 'days').format('YYYY-MM-DD');
        this.loading = true;
        setTimeout(() => {
            this.loading = false;
        }, 15000);
        this.getwalker();

    }
    getwalker() {
        this._setupService.getTransportWalkingRequest(this.startDate, this.endDate).subscribe(result => {
            this.transportWalkerPatronList = result;
            this.createTransportWalkerList();
        });
    }
    getSelectedDateWalker(value: any) {
        var a = this.startDate;
        this.startDate = moment(a).format('YYYY-MM-DD');
        var b = this.endDate;
        this.endDate = moment(b).format('YYYY-MM-DD');        
        if (this.startDate == null || this.endDate == null) {
            this.msgs = []
            this.msgs.push({ severity: 'error', summary: 'Please select start date and end date ' });
        }
        else if (this.startDate > this.endDate) {
            this.msgs = []
            this.msgs.push({ severity: 'error', summary: 'End date should be greater than start date ' });
        }
        else if (this.endDate > this.currentDate) {
            this.msgs = []
            this.msgs.push({ severity: 'error', summary: 'End date should be greater than crrent date ' });
        }
        else {
            this.loading = true;
            this.getwalker();
        }

    }

    isAcknowledge(transportWalkingDetail: TransportWalkingDetail[]) {
        if (this.selectedWalkerDetail == null) {
            this.msgs = [];
            this.msgs.push({ severity: 'warn', detail: 'Please select at least one walker' });
        } else {

            for (let walker of transportWalkingDetail) {
                this._setupService.updateAcknowledge(walker.id, true).subscribe((response) => {
                    this.loading = true;
                    this.getwalker()
                    this.msgs = [];
                    this.msgs.push({ severity: 'success', summary: 'Walker request approved sucessfully' });
                });
            }
        }
    }

    createTransportWalkerList() {
        var patronInfo: PatronDetail | undefined = <PatronDetail>{};
        this.transportWalkerList = [];
        for (var patron of this.transportWalkerPatronList) {
            this.pickImage = AppSettings.UNCHECK_IMAGE;
            this.dropImage = AppSettings.UNCHECK_IMAGE;
            patronInfo = this.patronDetails.find(x => x.id == patron.patronId);
            if (patron.pick)
                this.pickImage = AppSettings.CHECK_IMAGE;
            if (patron.drop)
                this.dropImage = AppSettings.CHECK_IMAGE;
            if (patronInfo != null) {
                patron.imgUrl = patronInfo.imgUrl;
                patron.firstName = patronInfo.firstName;
                patron.lastName = patronInfo.lastName;
                patron.class = patronInfo.class.toString();
                patron.section = patronInfo.section;
                patron.rollNumber = patronInfo.rollNo.toString();
                patron.pickImage = this.pickImage;
                patron.dropImage = this.dropImage;
                this.transportWalkerList.push(patron);
                
            }
        }
        this.loading = false;
    }
    validateWalker() {
        this.walkerform = this.fb.group({
            'patronid': new FormControl(''),
            'pick': new FormControl(''),
            'drop': new FormControl(''),
            'requestDate': new FormControl('', Validators.required),
            'requestModeList': new FormControl('', Validators.required),
            'requestByList': new FormControl('', Validators.required),
            'description': new FormControl('', Validators.required),            
        })

    }
    addRequest() {
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
        this.validateWalker();
     // empty reason in form before add 
        this.transportWalkerDialog = true;
    }

    openSearchBox() {
        this.patronMapDialog = true;
    }

    mapPatron(selectedPat: PatronDetail) {
        this.selectedPatron = selectedPat;
        if (this.selectedPatron != undefined) {
            this.transportWalkingRequest.patronId = "Name- " + this.selectedPatron.firstName + " " + this.selectedPatron.lastName + ", Class- " + this.selectedPatron.class + " " + this.selectedPatron.section;
            this.patronMapDialog = false;
        }
        else {
            this.msgs = [];
            this.msgs.push({ severity: 'warn', summary: 'Please select at least one patron' });
        }
    }

    onSearchCancel(event: Event) {
        this.patronMapDialog = false;
    }

    createTransportWalker(number: number) {
        this.loading = true;
        var a = moment(this.transportWalkingRequest.requestDate).toDate();
        this.transportWalkingRequest.requestDate = moment(a).format('YYYY-MM-DD');
        if (this.selectedPatron != undefined) {
            this.transportWalkingRequest.patronId = this.selectedPatron.id;
            this.transportWalkingRequest.requestTime = this.selectedTime;
            this.transportWalkingRequest.transpportRouteId = this.selectedPatron.transportRouteId;
            this.transportWalkingRequest.stoppageId = this.selectedPatron.stoppageId;
            this.transportWalkingRequest.requestBy = this.selectedRequestBy;
            this.transportWalkingRequest.requestMode = this.selectedMode;
            this.transportWalkingRequest.reason = this.selectedReason;
            this._setupService.createTransportWalkingRequest(this.transportWalkingRequest).subscribe(result => {
                if (result == 204) {
                    this.loading = true;
                    setTimeout(() => {
                        this.loading = false;
                    }, 15000);
                    this.getwalker();
                    this.msgs = [];
                    this.msgs.push({ severity: 'success', summary: 'Transport walker saved sucessfully' });
                }
            }); 
            this.transportWalkerDialog = false;
        } else {

            this.loading = false;
           
            this.msgs = [];
            this.msgs.push({ severity: 'warn', summary: 'Please select at least one patron' });
           
        }
       

    }

    deleteWalker(transportWalkingDetail: TransportWalkingDetail[]) {
        if (this.selectedWalkerDetail == null) {
            this.msgs = [];
            this.msgs.push({ severity: 'warn', detail: 'Please select at least one walker' });
        } else {
            this.confirmationService.confirm({
                message: 'Do you want to delete this record(s)?',
                header: 'Delete Confirmation',
                icon: 'fa fa-trash',
                accept: () => {
                    for (let walker of transportWalkingDetail) {
                        this._setupService.deleteWalker(walker.id).subscribe((response) => {
                            if (response === 204) {
                                this.transportWalkerList.forEach((u: TransportWalkingDetail, i) => {
                                    if (u.id === walker.id) {
                                        this.loading = true;
                                        this.getwalker();
                                        this.loading = false
                                        this.msgs = [];
                                        this.msgs.push({ severity: 'error', detail: 'Walker deleted successfully' });
                                    }
                                });

                            }
                        });
                    }
                }
            });
        }
    }

    onCancel(event: Event) {
        this.transportWalkerDialog = false;
    }

    download() {
        var tempList: any[] = [];
        for (var walker of this.transportWalkerList) {
            tempList.push({
                "FirstName": walker.firstName,
                "LastName": walker.lastName,
                "RequestMode": walker.requestMode,
                "RequestBy": walker.requestBy,
                "Reason": walker.reason,
                "Description": walker.description,
                "IsAcknowledged": walker.isAcknowledged,
            });
        }
        var csvData = this.ConvertToCSV(tempList);
        var a = document.createElement("a");
        a.setAttribute('style', 'display:none;');
        document.body.appendChild(a);
        var blob = new Blob([csvData], { type: 'text/csv' });
        var url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = 'TransportWalkerList.csv';
        a.click();
    }

    ConvertToCSV(objArray: any) {
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

