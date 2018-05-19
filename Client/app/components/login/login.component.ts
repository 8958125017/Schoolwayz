import * as ng from '@angular/core';
import {Component, OnInit, NgModule } from '@angular/core';
import {FormsModule, FormControl, FormBuilder, Validators, FormGroup, ReactiveFormsModule} from '@angular/forms';
import { Http, Headers, RequestOptions, Response, JsonpModule } from '@angular/http';
import {Router, ActivatedRoute} from '@angular/router';
import {InputTextModule, TabViewModule, SelectItem, CheckboxModule, CalendarModule, SelectButtonModule, Header, Footer, MessagesModule, ConfirmationService, ConfirmDialogModule, ScheduleModule, GrowlModule, Message, FileUploadModule, DropdownModule } from 'primeng/primeng';
import {SetupService, Country, State} from '../../services/setup.service';
import { UUID } from 'angular2-uuid';
import * as moment from 'moment';


@ng.Component({
    selector: 'login',
    template: require('./login.component.html'),
    providers: [ConfirmationService, SetupService]
})


export class LoginComponent {
    msgs: Message[] = [];
    loginform: FormGroup;
    submitted: boolean;
    status: string;
    organizationId: = localStorage.getItem("OrganizationId");
    public http: Http;
    loginID: string;
    loginDetails: LoginDetail;
    adminCredential: AdminCredential;
    // getAdminData: AdminCredential;
    ip:string;
    constructor(http: Http, private _router: Router, private fb: FormBuilder, private confirmationService: ConfirmationService, private _setupService: SetupService, private jsonp: JsonpModule) {
        this.http = http
            this.adminCredential = {
            id: this.loginID,
            userId: '',
            password: '',
            firstName: '',
            lastName: '',
            imgUrl: '';
            emailId: '',
            primaryContact: '',
            secondarycontact: '',
            organizationid: this.organizationId,
            createDate: new Date(),
            lastUpdated: new Date()
        };
        this.loginDetails = {
            userId: '',
            lastName: '',
            firstName: '',
            ipAddress: '',
            lastLogin: new Date(),
            organizationid: this.organizationId,
            createDate: new Date(),
            lastUpdated: new Date()
            }

        //var ip: string;
        this._setupService.getIP().subscribe((response) => {
            this.ip = JSON.stringify(response);
            let obj: MyObj = JSON.parse(this.ip);
            this.ip = obj.ip;
          });
       
    }
  
    login() {
        this.adminlogin();
      
    }
    adminlogin() {
       
        this._setupService.adminLogin(this.adminCredential).subscribe((response) => {

            if (response) {
                this._setupService.getAdminData(this.adminCredential.userId, this.adminCredential.password).subscribe(result => {
                    this.adminCredential = result;
                    
                    this.loginSummary();  
                    
                });
              
                this._router.navigate(['/home']);
            }
            else {
                     this.status = "Invalid Username or Password";
            }
        });
        
    }
    loginSummary() {
        this.loginDetails = <LoginDetail>{};
        this.loginDetails.userId = this.adminCredential.userId;
        this.loginDetails.firstName = this.adminCredential.firstName;           
        this.loginDetails.lastName = this.adminCredential.lastName;
        this.loginDetails.lastLogin = moment(new Date()).toDate();
        this.loginDetails.ipAddress = this.ip;
        this.loginDetails.organizationid = this.adminCredential.organizationid;
        this._setupService.createLoginDetail(this.loginDetails).subscribe((response) => {
            if (response === 204) {
              
                this.msgs = [];
                this.msgs.push({ severity: 'info', summary: 'info Message', detail: 'login create sucessfully' });
            }
        });
    }

    ngOnInit() {
        this.loginform = this.fb.group({
            'userId': new FormControl('', Validators.required),
            'password': new FormControl('', Validators.required),
            'loginid': new FormControl(),
        });
       
    }

}
interface MyObj {
    ip: string;
}


