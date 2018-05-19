import {Component, OnInit, NgModule} from '@angular/core';
import {FormsModule, FormControl, FormBuilder, Validators, FormGroup} from '@angular/forms';
import {Router, ActivatedRoute} from '@angular/router';
import {SetupService} from '../../services/setup.service';
import { SelectItem, ConfirmationService, Message } from 'primeng/primeng';
import * as moment from 'moment';


@Component({
    selector: 'transportmessage',
    template: require('./transportmessage.component.html'),
    providers: [SetupService, ConfirmationService]
})

export class TransportMessageComponent {
    messageform: FormGroup;
    loading: boolean;
  
   
    organizationId: string = localStorage.getItem("OrganizationId");
    public transportMessage: TransportMessage;
    public transportMessageDetails: TransportMessage[];
    //displayDialog: boolean;
    //submitted: boolean;
    selectedRoute: string[] = [];
    selectedStoppage: string[] = [];
    selectAllRoute: string;
    messageCenterDialog: boolean = false;
    showRoute: boolean;
    selectedDate: string;


    //messageId: string;
    //public outgoingMessage: OutgoingMessage; 
    //public externalMessageDetails: OutgoingMessage[];
      tDetails: TransportRouteDetail[];
   
    //public gradeDetails: GradeDetail[];
      routeList: SelectItem[];
      stoppageList: SelectItem[];
    PatronList: SelectItem[];
    public classSectionList: SelectItem[];
    public messageCategory: SelectItem[];
    
    
   // public broadcastTo: SelectItem[];
    public outgoingMessageTo: SelectItem[];
    //patron: boolean;
    patronMapDialog: boolean;
    patronDetails: PatronDetail[];
    personDetails: PersonDetail;
    selectedPatron: PatronDetail;
    selectedPatronDetail: PatronDetail;
    totalPatronList: PatronDetail[];
    status: boolean;
    selectedOutgoingMessage: OutgoingMessage[]
    msgs: Message[] = [];
    personId: string;
    userName: string;  
    image: string;
    showStoppage: boolean;
    tRoute: TransportRouteDetail;
    tStop: TransportRouteDetail;
    tMessage: TransportMessage;
    routeIdList: string[];
    rNumber: string[];
    messageList: TransportMessage[];
   
    constructor(private _setupService: SetupService, private fb: FormBuilder) {
        // this.http = http;
        
        this.showStoppage = false;
        this.loading = true;
               
        var firstName;
        var lastName;        
         this.personId = localStorage.getItem("UserId");     
         firstName = localStorage.getItem("GivenName");
         lastName = localStorage.getItem("SurName");
         this.userName = firstName + " " + lastName;
         this.image = localStorage.getItem("ImgUrl");          
        this._setupService.getTranportRoute().subscribe(result => {
            this.tDetails = result;
            this.getAllRoutes();  
            this.getTransportMessage();
            });       
       
        this.transportMsg();
       
    }
    getTransportMessage() {
        var transportRoute: TransportRouteDetail;
        var transportStoppage: TransportStoppageDetail;
        var message: TransportMessage;
        this._setupService.getOutgoingTransportMessage().subscribe(result => {
            this.transportMessageDetails = result;
            this.messageList = [];
            for (var msg of this.transportMessageDetails) { 
                message = <TransportMessage>{};  
                message.senderName = msg.senderName;
                message.broadcastTo = msg.broadcastTo;
                message.subject = msg.subject;
                message.senderId = msg.senderId;
                message.senderImage = msg.senderImage;
                message.senderName = msg.senderName;
                message.stopId = msg.stopId;
                message.message = msg.message;
                message.messageDate = msg.messageDate;
                message.messageTime = msg.messageTime;
                message.routeId = msg.routeId;
                message.senderRole = msg.senderRole;
                this.routeIdList = msg.routeId;
                message.routeNumber = [];
                message.stoppageName = [];
                message.stoppageField = "";
                for (var routeId of this.routeIdList) {                   
                    transportRoute = this.tDetails.find(x => x.id == routeId);
                    message.routeNumber.push(transportRoute.routeNumber);
                    if (msg.stopId != null && msg.stopId.length > 0) {
                        message.stoppageField = "Stoppage :-";
                        for (var stoppage of msg.stopId) {
                            transportStoppage = transportRoute.transportStoppages.find(x => x.id == stoppage)
                            message.stoppageName.push(transportStoppage.name);
                        }
                    }
                }
                this.messageList.push(message);
            }
           
            this.loading = false;
        });

    }
    transportMsg() {
        this.transportMessage = {
            id: '',
            subject: '',
            senderId: '',
            senderName: '',
            senderImage: '',
            senderRole: '',
            broadcastTo: 'Parents',
            message: '',
            patronId: [],
            routeId: [],
            stopId: [],
            routeNumber: [],
            stoppageName: [],
            personId: [],
            createDate: new Date(),
            lastUpdated: new Date(),
            organizationId: this.organizationId,
            messageTime: '',
            messageDate: ''
        }
    }
    addMessage() {
        this.showStoppage = false;
        this.transportMsg();
        this.messageCenterDialog = true; 
    }
    
   
    
    getAllRoutes() {
        this.routeList = [];      
        for (var route of this.tDetails) {
            this.routeList.push({ label: "Route "+route.routeNumber, value: route.id });
        }
    }

    displayStoppages() {
        this.stoppageList = [];  
        var selectedTransportRoute: TransportRouteDetail;
        if (this.selectedRoute.length == 1 && this.transportMessage.broadcastTo == "Parents") {
            selectedTransportRoute = this.tDetails.find(x => x.id == this.selectedRoute[0]);            
            for (var stoppage of selectedTransportRoute.transportStoppages) {
                this.stoppageList.push({ label: stoppage.name, value: stoppage.id });
            }
            this.showStoppage = true;
        } else {
            this.showStoppage = false;
        }
    }
    // send out going message to patrons by organization,class,class section level
    sendMessageToPatron() {      
             
        var patronsDetail: string[]=[];
        var selectedTransportRoute: TransportRouteDetail;
        var selectStoppage: TransportStoppageDetail[];        
        var driverList: string[] = [];
        var patronList: string[];  
        var routeStoppage: TransportStoppageDetail
           for (var route of this.selectedRoute) {          
               selectedTransportRoute = this.tDetails.find(x => x.id == route);          
               if (this.transportMessage.broadcastTo == "Parents") {
                   if (this.selectedStoppage != null) {
                       for (var stoppage of this.selectedStoppage) {
                           routeStoppage = selectedTransportRoute.transportStoppages.find(x => x.id == stoppage);
                           patronList = [];
                           patronList = routeStoppage.patronId;
                           if (patronList != null) {
                               for (var patron of patronList) {
                                   if (patron != null) {
                                       patronsDetail.push(patron)
                                   }

                               }
                           }
                       }
                   } else { 
                   selectStoppage = selectedTransportRoute.transportStoppages;
                   for (var stop of selectStoppage) {
                       patronList = [];
                       patronList = stop.patronId;
                       if (patronList != null) {
                           for (var patron of patronList) {
                               if (patron != null) {
                                   patronsDetail.push(patron)
                               }

                           }
                       }
                   }
               }
                
            }
            else if (this.transportMessage.broadcastTo === "Driver") {                 
                driverList.push(selectedTransportRoute.driverId);              
            }           
        }
       
           this.transportMessage.routeId = this.selectedRoute;
           
          
           if (this.selectedStoppage.length > 0) {
               
               this.transportMessage.stopId = this.selectedStoppage; 
              
           }
        this.transportMessage.patronId = patronsDetail;        
        this.transportMessage.personId = driverList;     
        this.transportMessage.senderId = this.personId;      
        this.transportMessage.senderName = this.userName;    
        this.transportMessage.senderImage = this.image;    
        this.transportMessage.messageDate = moment(new Date()).format('YYYY-MM-DD');     
        this.transportMessage.messageTime = moment(new Date()).format('h:mm a');          
        this._setupService.createTransportOutgoingMessage(this.transportMessage).subscribe(messageDetails => {
            this.getTransportMessage();           
                this.msgs = [];
                this.msgs.push({ severity: 'success', summary: 'Message send successfully' });
            });
        this.messageCenterDialog = false;
    }


    onCancel(event: Event) {
        this.messageform.reset();
        this.messageCenterDialog = false;
    }  
    validate() {
        this.messageform = this.fb.group({
            'broadcastTo': new FormControl(),
            'routeList': new FormControl('', Validators.required),
            'stoppageList': new FormControl(),
            'subject': new FormControl('', Validators.required),
            'message': new FormControl('', Validators.required),
        });
    }

    ngOnInit() {
        this.validate();
    }
}

