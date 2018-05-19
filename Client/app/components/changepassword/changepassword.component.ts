import * as ng from '@angular/core';
import { DialogModule, , InputTextModule, ButtonModule, SelectItem, ConfirmationService, Message } from 'primeng/primeng';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { SetupService } from '../../services/setup.service';
import { AppSettings } from '../../services/global.constants';
import { UUID } from 'angular2-uuid';

@ng.Component({
    selector: 'changepassword',
    template: require('./changepassword.component.html'),
    providers: [ConfirmationService, SetupService]

})
export class ChangePasswordComponent {
    passwordForm: FormGroup;    
    userid: string = AppSettings.ADMIN_ID;   
    changePassword: AdminCredential;
    msgs: Message[] = [];
    updatedPassword: AdminCredential;
    

    constructor(private fb: FormBuilder, private _router: Router, private _setupService: SetupService) {

        this.changePassword = {
            id: UUID.UUID(),
            userId: '',
            password: '',
            newPassword: '',
            confirmPassword: '',
            firstName: '',
            lastName: '',
            imgUrl:'',
            emailId:'',
            primaryContact: '',
            secondarycontact: '',
            organizationid: AppSettings.ORGANIZATION_ID,
            createDate: new Date(),
            lastUpdated: new Date(),
        }        
       
    }
    updateAdminPassword() {
       
        this.updatedPassword = <AdminCredential>{};
        this.updatedPassword.password = this.changePassword.password;
        this.updatedPassword.newPassword = this.changePassword.newPassword;
        this.updatedPassword.confirmPassword = this.changePassword.confirmPassword;
        this.updatedPassword.organizationid = AppSettings.ORGANIZATION_ID;
      

      
        if (this.userid) {
            this._setupService.updateAdminPassword(this.userid, this.updatedPassword).subscribe((response) => { 
                if (response != null) {                                      
                    this._router.navigate(['/home', { 'growlMsgs': 1 }]); 
                } else {
                    this.msgs = [];
                    this.msgs.push({ severity: 'error', summary: 'Current password not matched' });
                }
            });
           
           
        }
    }
    

    ngOnInit() {
        this.passwordForm = this.fb.group({
            'password': new FormControl('', Validators.required),
            'newPassword': new FormControl('', Validators.compose([Validators.required, Validators.minLength(4)])),
            'confirmPassword': new FormControl(''),                 
        }, { validator: this.matchingPasswords('newPassword', 'confirmPassword') });
        
    }
    matchingPasswords(passwordKey: string, confirmPasswordKey: string) {

        return (group: FormGroup): { [key: string]: any } => {
            let newPassword = group.controls[passwordKey];
            let confirmPassword = group.controls[confirmPasswordKey];
            if (newPassword.value !== confirmPassword.value) {
                return {
                    mismatchedPasswords: true
                };
            }
        }
    }
}
