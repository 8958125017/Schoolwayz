import {Component, OnInit, NgModule} from '@angular/core';
import {FormsModule, FormControl, FormBuilder, Validators, FormGroup} from '@angular/forms'
import {Http, Headers} from '@angular/http'
import {Router, ActivatedRoute} from '@angular/router';
import { SetupService } from '../../services/setup.service';
import {PanelModule,DialogModule,ConfirmDialogModule, SelectItem, ConfirmationService, TabViewModule, CheckboxModule, GrowlModule,Message} from 'primeng/primeng';
import * as moment from 'moment';
import {Observable} from 'rxjs/Rx';

@Component({
    selector: 'incomingmessage',
    template: require('./incomingmessage.component.html'),
    providers: [SetupService, ConfirmationService]
})

export class IncomingMessageComponent {
    incomingmessages: IncomingMessage[];
    outgoingmessages: OutgoingMessage[];
    messagesById: OutgoingMessage;
    patronDetails: PatronDetail[];
    public http: Http;
    messageId: string;
    responseMessage: ResponseMessage[];
    responseMsg: ResponseMessage;
    respMessage: ResponseMessage;
    //outMessages: OutgoingMessage[] = [];
    patrons: PatronDetail[] = [];
    readMessageDialog: boolean = false;
    organizationId: string = localStorage.getItem("OrganizationId");
    selectedMessageDetail: IncomingMessage;
    selectedIncomingMessage: ResponseMessage[];
    msgs: Message[] = [];
    messageDialog: boolean;
    outgoingMsg: OutgoingMessage;
    inboundMessage: string;
    outboundMessage: string;
    constructor(http: Http, private _router: Router, private activatedRoute: ActivatedRoute, private confirmationService: ConfirmationService, private _setupService: SetupService) {
        this.http = http;
      
        
        this.inboxMsg();
        this.responseMsg = {
            id: '',
            requestmessage: '',
            outSubject:'',
            outMessage: '',
            messageId: '',
            patronId: '',
            patronName: '',
            patronClass: '',
            patronSection: '',
            patronImage:'',
            messageTime: '',
            messageDate: ''
        }
    }
    inboxMsg() {
        let observables = new Array();
        this._setupService.getIncomingMessage().subscribe(result => {
            this.incomingmessages = result;
            for (var msgId of this.incomingmessages) {
                observables.push(this._setupService.getPatronById(msgId.patronId));
            }
            Observable.forkJoin(observables).subscribe(
                result => {
                    this.patrons = <PatronDetail[]>result;
                    this.setMessages();
                }
            );
        });

    }

    getMessage(responseMessage: ResponseMessage) {
        
        this.respMessage = responseMessage;
        //this.outgoingMsg = <OutgoingMessage>{};
        this.inboundMessage = responseMessage.outMessage;
        this._setupService.getoutgoingMessageById(responseMessage.messageId).subscribe((result) => {
            this.outgoingMsg = result
            this.outboundMessage = this.outgoingMsg.message;
            
           
        });
        this.messageDialog = true;
    }

    readMessage() {
            this.readMessageDialog = true;
    }
    setMessages() {
        this.responseMessage = [];
        
        var patronDetail: PatronDetail;
        for (var message of this.incomingmessages) {
            this.responseMsg = <ResponseMessage>{};
            //outgoingMsg = this.outMessages.find(x => x.id == message.messageId);
            patronDetail = this.patrons.find(x => x.id == message.patronId);
            
                this.responseMsg.outSubject = message.subject;
                this.responseMsg.outMessage = message.message;
                //this.responseMsg.messageTime = outgoingMsg.messageTime;
                //this.responseMsg.messageDate = outgoingMsg.messageDate;
            
            if (patronDetail != null) {
                this.responseMsg.patronName = patronDetail.firstName + " " + patronDetail.lastName;
                this.responseMsg.patronClass = patronDetail.class.toString();
                this.responseMsg.patronSection = patronDetail.section;
                this.responseMsg.patronImage = patronDetail.imgUrl;
            }
            this.responseMsg.id = message.id;
            this.responseMsg.messageId = message.messageId;
            this.responseMsg.requestmessage = message.message;
            this.responseMsg.messageTime = moment(message.messageTime, 'H:mm').format('h:mm a');
            this.responseMsg.messageDate = message.messageDate;
            this.responseMessage.push(this.responseMsg);
        }
    }

    deleteIncomingMessage(responseMessage: ResponseMessage[]) {
        if (this.selectedIncomingMessage == null) {
            this.msgs = [];
            this.msgs.push({ severity: 'warn', summary: 'please select at least one message' });
        } else {
            this.confirmationService.confirm({
                message: 'Do you want to delete this record(s)?',
                header: 'Delete Confirmation',
                icon: 'fa fa-trash',
                accept: () => {
                    for (let message of responseMessage) {
                        this._setupService.deleteIncomingMessages(message.id).subscribe((response) => {
                            if (response === 204) {
                                this.responseMessage.forEach((u: ResponseMessage, i) => {
                                    if (u.id === message.id) {
                                        //this.responseMessage.splice(i, 1);
                                        this.inboxMsg();
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
    onCancel(event: Event) {
        this.messageDialog = false;
    }
}