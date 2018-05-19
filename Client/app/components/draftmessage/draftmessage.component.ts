﻿import {Component, OnInit, NgModule} from '@angular/core';
import {FormsModule, FormControl, FormBuilder, Validators, FormGroup} from '@angular/forms'
import {Http, Headers} from '@angular/http'
import {Router, ActivatedRoute} from '@angular/router';
import { SetupService } from '../../services/setup.service';
import {PanelModule, SelectItem, ConfirmDialogModule, ConfirmationService, TabViewModule, CheckboxModule, GrowlModule, Message} from 'primeng/primeng';
import * as moment from 'moment';
import {Observable} from 'rxjs/Rx';

@Component({
    selector: 'draftmessage',
    template: require('./draftmessage.component.html'),
    providers: [SetupService, ConfirmationService]
})

export class DraftMessageComponent {

    public http: Http;
    organizationId: string = localStorage.getItem("OrganizationId");
    public outgoingMessage: OutgoingMessage;
    public externalMessageDetails: OutgoingMessage[];
    messageCenterDialog: boolean = false;
    submitted: boolean;
    displayDialog: boolean;
    messageId: string;
    public gradeDetails: GradeDetail[];
    public classList: SelectItem[];
    public classSectionList: SelectItem[];
    public messageCategory: SelectItem[];
    selectedGrade: string[] = [];
    selectedClassSection: string[] = [];
    selectOrganization: string;
    selectedCategory: string;
    selectClass: string;
    showClass: boolean;
    showClassSection: boolean;
    showIsResponseNeed: boolean;
    selectedBroadCast: string;
    public broadcastTo: SelectItem[];
    public outgoingMessageTo: SelectItem[];
    patron: boolean;
    patronMapDialog: boolean;
    patronDetails: PatronDetail[];
    personDetails: PersonDetail;
    selectedPatron: PatronDetail;
    selectedPatronDetail: PatronDetail;
    totalPatronList: PatronDetail[];
    public outgoingMessageDetails: OutgoingMessage[]
    selectedDate: string;
    selectedMessageDetail: OutgoingMessage[];
    selectedMessageId: string;
    status: boolean;
   
    msgs: Message[] = [];
    constructor(http: Http, private _router: Router, private activatedRoute: ActivatedRoute, private confirmationService: ConfirmationService, private _setupService: SetupService) {
        this.http = http;
        this.showClass = false;
        var personId = "7d82766a-ab7c-4787-b126-d02359b41696";
        this._setupService.getPatron().subscribe(result => {
            this.patronDetails = result;
        })
        this._setupService.getPersonnById(personId).subscribe(result => {
            this.personDetails = result;
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
        this.outgoingMessageTo = [];
        this.outgoingMessageTo.push({ label: 'Choose Option', value: null });
        this.outgoingMessageTo.push({ label: 'Organization', value: 'Organization' });
        this.outgoingMessageTo.push({ label: 'Class', value: 'Class' });
        this.outgoingMessageTo.push({ label: 'Class-Section', value: 'Sections' });
        this.outgoingMessageTo.push({ label: 'Patron', value: 'Patron' });

        this.outgoingMessage = {
            id: '',
            subject: null,
            senderId: '',
            senderName: '',
            senderImage: '',
            senderRole: '',
            message: null,
            isSent: false,
            broadcastTo: '',
            patronId: [],
            isResponseNeed: false,
            createDate: new Date(),
            lastUpdated: new Date(),
            organizationId: this.organizationId,
            messageTime: '',
            messageDate: ''
        }
    }
    getMessage() {
        this._setupService.getSavedMessage().subscribe(result => {
            this.outgoingMessageDetails = result;
        });
    }

    onSelectMode() {
        if (this.selectedBroadCast == 'Organization') {
            this.selectedGrade = [];
            this.selectedClassSection = [];
            this.showClassSection = false;
            this.showClass = false;
            this.patron = false;
            this.showIsResponseNeed = false;
        }
        if (this.selectedBroadCast == 'Class') {
            this.selectedClassSection = [];
            this.showClassSection = false;
            this.showClass = true;
            this.patron = false;
            this.showIsResponseNeed = true;
        }
        if (this.selectedBroadCast == 'Sections') {
            this.selectedGrade = [];
            this.showClassSection = true;
            this.showClass = false;
            this.patron = false;
            this.showIsResponseNeed = true;
        }

        if (this.selectedBroadCast == 'Patron') {
            this.showClassSection = false;
            this.showClass = false;
            this.patron = true;
            this.showIsResponseNeed = true;
        }
    }

    createMessage(outgoingMessage: OutgoingMessage) {

        this.outgoingMessage = outgoingMessage;
        
            if (this.selectedBroadCast == 'Organization') {
                this.selectedGrade = [];
                this.selectedClassSection = [];
                this.showClassSection = false;
                this.showClass = false;
                this.patron = false;
            }

            this.selectedBroadCast = this.outgoingMessage.broadcastTo;
            if (this.selectedBroadCast == 'Class') {
                this.selectedClassSection = [];
                this.showClassSection = false;
                this.showClass = true;
                this.patron = false;
            }
            if (this.selectedBroadCast == 'Sections') {
                this.selectedGrade = [];
                this.showClassSection = true;
                this.showClass = false;
                this.patron = false;
            }
            if (this.selectedBroadCast == 'Patron') {
                this.showClassSection = false;
                this.showClass = false;
                this.patron = true;
            }
            this.selectedBroadCast = this.outgoingMessage.broadcastTo;
            this.outgoingMessage = this.outgoingMessage;
            this.messageCenterDialog = true;
        //}
    }
    deleteOutgoingMessage(outegoingMessage: OutgoingMessage[]) {
        if (this.selectedMessageDetail == null) {
            this.msgs = [];
            this.msgs.push({ severity: 'warn', summary: 'please select at least one message' });
        } else {
            this.confirmationService.confirm({
                message: 'Do you want to delete this message(s)?',
                header: 'Delete Confirmation',
                icon: 'fa fa-trash',
                accept: () => {
                    for (let message of outegoingMessage) {
                        this._setupService.deleteOutgoingMessages(message.id).subscribe((response) => {
                            if (response === 204) {
                                this.outgoingMessageDetails.forEach((u: OutgoingMessage, i) => {
                                    if (u.id === message.id) {
                                        //this.outgoingMessageDetails.splice(i, 1);
                                        this.getMessage();
                                    }
                                });
                                this.msgs = [];
                                this.msgs.push({ severity: 'error', summary: 'Message delete successfully' });
                            }
                        });
                    }
                }
             });
        }
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

    // send out going message to patrons by organization,class,class section level
    sendMessageToPatron(status) {
          if (status == 1) {
            this.status = true;
        }
        this.status = status;
        let observables = new Array();
        var org: any[] = [];
        var patrons: PatronDetail[] = [];
        var pat: OutgoingMessage[] = [];
        var selectedClassPatron: PatronDetail[][] = [];
        if (this.selectedBroadCast == 'Organization') {
            this.sendExternalData(selectedClassPatron);    //call sendExternalData
        }
        else
            if (this.selectedBroadCast == 'Class') {
                for (var patronClass of this.selectedGrade) {
                    observables.push(this._setupService.getClassByPatrons(patronClass));
                }
                Observable.forkJoin(observables).subscribe(
                    result => {
                        selectedClassPatron = <PatronDetail[][]>result;
                        this.sendExternalData(selectedClassPatron);  //call sendExternalData
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
                        this.sendExternalData(selectedClassPatron);    //call sendExternalData
                    }
                );
            }
            else if (this.selectedBroadCast == 'Patron') {
                patrons.push(this.selectedPatron)
                selectedClassPatron.push(patrons);
                this.sendExternalData(selectedClassPatron);  //call sendExternalData
            }
        this.messageCenterDialog = false;
    }

    sendExternalData(selectedClassPatron: PatronDetail[][]) {
        for (var classPatron of selectedClassPatron) {
            for (var patron of classPatron) {
                this.outgoingMessage.patronId.push(patron.id);
            }
        }
        if (this.status) {
            this.outgoingMessage.isSent = true;
        }
        this.outgoingMessage.senderId = this.personDetails.id;
        this.outgoingMessage.senderName = this.personDetails.firstName + " " + this.personDetails.lastName;
        this.outgoingMessage.senderImage = this.personDetails.imgUrl;
        this.outgoingMessage.senderRole = this.personDetails.role;
        this.outgoingMessage.broadcastTo = this.selectedBroadCast;
        this.outgoingMessage.messageDate = moment(new Date()).format('YYYY-MM-DD');
        this.outgoingMessage.messageTime = moment(new Date()).format('h:mm a');
        this._setupService.createOutgoingMessage(this.outgoingMessage).subscribe(messageDetails => {
            this._setupService.getSavedMessage().subscribe(result => {
                this.outgoingMessageDetails = result;
            });
            if (this.outgoingMessage.isSent == true) {
                this.msgs = [];
                this.msgs.push({ severity: 'sucsess', summary: 'message saved successfully' });
            } else {
                this.msgs = [];
                this.msgs.push({ severity: 'sucsess', summary: 'message saved in draft' });
            }
      });

    }
    onCancel(event: Event) {
        this.messageCenterDialog = false;
    }
    ngOnInit() {

    }
}

