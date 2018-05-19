import * as ng from '@angular/core';
import { ViewChild } from '@angular/core';
import { FormControl, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Http, Headers } from '@angular/http';
import { ActivatedRoute } from '@angular/router';
import { SelectItem, ConfirmationService, Message } from 'primeng/primeng';
import { SetupService, Country, State } from '../../services/setup.service';
import { AppSettings } from '../../services/global.constants';
import { UUID } from 'angular2-uuid';
import * as moment from 'moment';
@ng.Component({
    selector: 'personlist',
    template: require('./personlist.component.html'),
    providers: [ConfirmationService, SetupService]
})
export class PersonListComponent {
    //common for person staff and person contact person
    @ViewChild("fileInput") fileInput;
    @ViewChild("personImage") personImage;

    submitted: boolean;
    file: any[] = [];
    postData: any;
    image: string = "DefaultImage.jpg";
    public http: Http;
    msgs: Message[] = [];
    organizationid: string = AppSettings.ORGANIZATION_ID;;  
    selectedTab: number = 1;
    public personDetailsList: DisplayImage[];

    // staffperson list

    staffPersonDialog: boolean = false;
    //private router: Router
    personArr = [];
    public personDetails: PersonDetail[];
    selectedPersonDetail: PersonDetail;
    
    //staff person create form
   
    personviewform: FormGroup;
    selectedPersonViewDetail: string;
    personDetail: PersonDetail;
    employeePerson: PersonViewDetail;
    personViewDetail: PersonDetail;
    authTypeDetails: AuthenticationTypeDetail[];
    selectedCountry: string;
    selectedState: string;
    selectedImage: string;
    country: Country[];
    countries: SelectItem[];
    states: State[];
    countryStates: SelectItem[];
    public relations: SelectItem[];
    public role: SelectItem[];
    uploadedFiles: any[] = [];
    selectedRole: string;
    selectedRelation: string;
    personViewId: string;


    //for person contect person form

    //for contact person form
    personContactPersonDialog: boolean = false;
    personform: FormGroup;
    personId: string;

    pViewDetail: PersonViewDetail;
    pViewDetails: PersonViewDetail[];
    personDetailList: PersonDetail[];

    personViewDetails: PersonDetail[];

    personView: PersonDetail;
    patronList: PatronDetail;
    personviewList: PersonViewDetail;

    selectedContactPerson: PersonDetail[];
    selectedPersonId: string;
    selectedGender: string;


    //for personAuthentication form

    personAuthDialog: boolean = false;
    authform: FormGroup;
    public authMode: SelectItem[];
    selectedAuthMode: string;
    authTypeId: string
    selectAuthenticationTypeDetail: AuthenticationTypeDetail;
    authenticationTypeDetail: AuthenticationTypeDetail;
    authenticationTypeList: AuthenticationTypeDetail[];
    patronId: string;
    fileUpload: FileUpload;
    loading: boolean;
    tab1visible: boolean = true;
    tab2visible: boolean = true;
    tab1Authenticationvisible: boolean = true;
    tab2Authenticationvisible: boolean = true;
    header: string;
    employeeHeader:string
    constructor(private activatedRoute: ActivatedRoute, private confirmationService: ConfirmationService, private _setupService: SetupService, private fb: FormBuilder) {
        //this.http = http;

        this.getPerson();
        this.personViewStaff();

        this.activatedRoute.params.subscribe(params => {
            this.personViewId = params['personViewId'];
        })

        this._setupService.getPersonViewById(this.personViewId).subscribe(result => {
            this.pViewDetail = result;
            this.personViewDetails = this.pViewDetail.personObj;
            this.authTypeDetails = this.pViewDetail.authentications;
            for (var i = 0; i < this.authTypeDetails.length; i++) {
                if (this.authTypeDetails[i].mode == "2") {
                    this.authTypeDetails[i].modeType = "RFID";
                }
                else if (this.authTypeDetails[i].mode == "1") {
                    this.authTypeDetails[i].modeType = "Finger Scan";
                }
                else {
                    this.authTypeDetails[i].modeType = "NA";
                }
            }
        });

        this.country = this._setupService.getCountries();
        this.countries = [];
        //this.countries.push({ label: 'Country', value: null });
        for (var i = 0; i < this.country.length; i++) {
            this.countries.push({ label: this.country[i].name, value: this.country[i].name });
        }

        this.states = this._setupService.getStates();
        this.countryStates = [];
        //this.countryStates.push({ label: 'State', value: null });
        for (var i = 0; i < this.states.length; i++) {
            this.countryStates.push({ label: this.states[i].name, value: this.states[i].name });
        }

        this.personDetail = {
            id: UUID.UUID(),
            patronId: '',
            personViewId: '',
            firstName: '',
            lastName: '',
            role: '',
            emailId: '',
            address: '',
            gender: '',
            dateOfBirth: new Date(),
            isActive: false,
            password: '',
            primaryMobile: '',
            secondaryMobile: '',
            country: '',
            organizationId: this.organizationid,
            state: '',
            zipCode: '',
            isPrimaryContact: false,
            isHavingSmartPhone: false,
            relation: '',
            imgUrl: '',
            createDate: new Date(),
            lastUpdated: new Date()
        };

        //this.http = http;
        this.authMode = [];
        //this.authMode.push({ label: 'Select Mode', value: null });
        this.authMode.push({ label: 'RFID', value: '2' });
        this.authMode.push({ label: 'Finger Scan', value: '1' });

        this.authenticationTypeDetail = {
            id: UUID.UUID(),
            hashValue: '',
            patronId: '',
            mode: '',
            modeType: '',
            createDate: new Date(),
            lastUpdated: new Date(),
            organizationId: this.organizationid,
            remark: ''
        };

        this.activatedRoute.params.subscribe(params => {
            this.authTypeId = params['authTypeId'];
            this.patronId = params['patronId'];

        })

        this.activatedRoute.params.subscribe(params => {
            this.personViewId = params['personViewId'];

        })

        this.role = [];
        {
            //this.role.push({ label: 'Select Role', value: null });
            this.role.push({ label: 'Parents', value: 'Parents' });
            this.role.push({ label: 'Admin', value: 'Admin' });
            this.role.push({ label: 'Teacher', value: 'Teacher' });
            this.role.push({ label: 'Driver', value: 'Driver' });
            this.role.push({ label: 'Coordinator', value: 'Coordinator' });
            this.role.push({ label: 'Guest', value: 'Guest' });
        }

        this.relations = [];
        //this.relations.push({ label: 'Relation', value: null });
        this.relations.push({ label: 'Father', value: 'father' });
        this.relations.push({ label: 'Mother', value: 'mother' });
        this.relations.push({ label: 'Brother', value: 'brother' });
        this.relations.push({ label: 'Sister', value: 'sister' });
        this.relations.push({ label: 'Uncle', value: 'uncle' });
        this.relations.push({ label: 'Aunt', value: 'aunt' });
        this.relations.push({ label: 'Husband', value: 'husband' });
        this.relations.push({ label: 'Wife', value: 'wife' });

        //patron authentication
        this.authMode = [];
        //this.authMode.push({ label: 'Select Mode', value: null });
        this.authMode.push({ label: 'RFID', value: '2' });
        this.authMode.push({ label: 'Finger Scan', value: '1' });

    }

    //--------------------------------------End Constructor------------------------------------------------

    //Start Person view (Staff) operation

    personViewStaff() {
        this.pViewDetail = {
            id: '',
            personId: '',
            patronId: '',
            firstName: '',
            lastName: '',
            role: '',
            emailId: '',
            address: '',
            gender: '',
            dateOfBirth: new Date(),
            isActive: false,
            password: '',
            confirmPassword: '',
            organizationId: this.organizationid,
            authentications: this.authTypeDetails = [],
            primaryMobile: '',
            secondaryMobile: '',
            country: '',
            state: '',
            zipCode: '',
            isPrimaryContact: false,
            isHavingSmartPhone: false,
            relation: '',
            imgUrl: this.image,
            createDate: new Date(),
            lastUpdated: new Date(),
            personObj: this.personViewDetails = []
        };
    }

    personContact() {
        this.personDetail = {
            id: UUID.UUID(),
            patronId: '',
            personViewId: '',
            firstName: '',
            lastName: '',
            role: '',
            emailId: '',
            address: '',
            gender: '',
            dateOfBirth: new Date(),
            isActive: false,
            password: '',
            primaryMobile: '',
            secondaryMobile: '',
            country: '',
            organizationId: this.organizationid,
            state: '',
            zipCode: '',
            isPrimaryContact: false,
            isHavingSmartPhone: false,
            relation: '',
            imgUrl: this.image,
            createDate: new Date(),
            lastUpdated: new Date()
        };

    }

    addPersonView() {
        this.employeeHeader = "Add Person";
        this.personViewStaff();
        this.validateStaffPerson()
        this.staffPersonDialog = true;
    }

    createEmployee(number: number) {

        var a = this.pViewDetail.dateOfBirth;
        var b = moment(a).format('YYYY-MM-DD');
        this.pViewDetail.dateOfBirth = moment(b).toDate();
        if (b >= AppSettings.CURRENT_DATE) {
            this.msgs = [];
            this.msgs.push({ severity: 'error', summary: 'Date of birth should not be greater than current date ' });
        }
        else {
            let fileToUpload: any;
            var fileArrys: string[];
            var savedPerson: PersonViewDetail;
            let fi = this.fileInput.nativeElement;
            if (fi.files && fi.files[0]) {
                fileToUpload = fi.files[0];
                fileArrys = fileToUpload.name.split(".");
            }
            var headers = new Headers();
            headers.append('Content-Type', 'application/json');
            this.pViewDetail.country = this.selectedCountry;
            this.pViewDetail.state = this.selectedState;
            this.pViewDetail.relation = this.selectedRelation;
            this.pViewDetail.role = this.selectedRole;
           
            if (this.pViewDetail.id) {
                this._setupService.updatePerson(this.personViewId, this.pViewDetail).subscribe((response) => {
                    if (response === 204) {
                        if (this.pViewDetail != null && fi.files && fi.files[0]) {
                            this._setupService.updatePersonImageName(this.pViewDetail.id, fileArrys[1]).subscribe((response) => {
                            });
                            this._setupService.fileuploadsforPerson(fileToUpload, this.pViewDetail.id + "." + fileArrys[1]).subscribe((response) => {

                                if (response === 204) {
                                    this.getPerson();
                                }
                            });
                        } else {
                            this.getPerson();
                        }

                    }
                });
                this.msgs = [];
                this.msgs.push({ severity: 'success', summary: 'Person update successfully' });
                this.staffPersonDialog = false;
            }
            else {
                this._setupService.saveAndGetIdforPerson(this.pViewDetail).subscribe((response) => {
                    savedPerson = response;
                    if (this.pViewDetail != null && fi.files && fi.files[0]) {
                        this._setupService.updatePersonImageName(savedPerson.id, fileArrys[1]).subscribe((response) => {
                            this._setupService.fileuploadsforPerson(fileToUpload, savedPerson.id + "." + fileArrys[1]).subscribe((response) => {
                                this.getPerson();
                            });
                        });
                    } else {
                        this.getPerson();
                    }
                    this.msgs = [];
                    this.msgs.push({ severity: 'success', summary: 'Person Saved Successfully' });
                });
                this.staffPersonDialog = false;
            }

        }
    }
    

    deletePerson(personDetail: PersonDetail) {
        this.confirmationService.confirm({
            message: 'Do you want to delete ' + "<b>" + personDetail.firstName + " " + personDetail.lastName + "</b > " + '?',
            header: 'Delete Confirmation',
            icon: 'fa fa-trash',
            accept: () => {
                this._setupService.deletePerson(personDetail).subscribe((response) => {
                    if (response === 204) {
                        //this.personDetails.forEach((u: PersonDetail, i) => {
                        //    if (u.id === personDetail.id) {
                        //        this.personDetails.splice(i, 1);
                        //    }
                        //});
                        this.personDetails = this.personDetails.filter(x => x.id != personDetail.id);
                        this.msgs = [];
                        this.msgs.push({ severity: 'error', summary: 'Person deleted successfully' });
                        //this.getPerson();
                    }
                });
            }
        });
    }
    validateStaffPerson() {
        this.personviewform = this.fb.group({
            'firstName': new FormControl('',[Validators.required, Validators.pattern('[a-zA-Z]+')]),
            'lastName': new FormControl('',[Validators.required, Validators.pattern('[a-zA-Z]+')]),
            'dateOfBirth': new FormControl('', Validators.required),
            'role': new FormControl('', Validators.required),
            'emailId': new FormControl('',[Validators.required, Validators.email]),
            'password': new FormControl('', Validators.compose([Validators.required, Validators.minLength(4)])),
            'confirmPassword': new FormControl(''),
            'gender': new FormControl('', Validators.required),
            'primaryMobile': new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern('[0-9]+')]),
            'secondaryMobile': new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern('[0-9]+')]),
            'address': new FormControl('', Validators.required),
            'countries': new FormControl('', Validators.required),
            'state': new FormControl('', Validators.required),
            'zipCode': new FormControl('', [Validators.required,Validators.minLength(3), Validators.maxLength(8), Validators.pattern('[0-9]+')]),
            'isPrimaryContact': new FormControl(''),
            'isHavingSmartPhone': new FormControl(''),
            'isActive': new FormControl(''),
            'imgUrl': new FormControl(''),
           }, { validator: this.matchingPasswords('password', 'confirmPassword') });

    }
    matchingPasswords(passwordKey: string, confirmPasswordKey: string) {
       
        return (group: FormGroup): { [key: string]: any } => {
            let password = group.controls[passwordKey];
            let confirmPassword = group.controls[confirmPasswordKey];
            if (password.value !== confirmPassword.value) {
                return {
                    mismatchedPasswords: true
                };
            }
        }
    }
    ngOnInit() {
        this.validateStaffPerson();//call to validatePatron
        this.validatePerson();
        this.validatePersonAuth();
    }
    download() {
        var tempList: any[] = [];
        for (var patron of this.personDetails) {
            tempList.push({
                "FirstName": patron.firstName,
                "LastName": patron.lastName,
                "EmailId": patron.emailId,
                "Role": patron.role,
                "Primary Mobile": patron.primaryMobile,
            });
        }
        var csvData = this.ConvertToCSV(tempList);
        var a = document.createElement("a");
        a.setAttribute('style', 'display:none;');
        document.body.appendChild(a);
        var blob = new Blob([csvData], { type: 'text/csv' });
        var url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = 'PersonDetails.csv';
        a.click();
    }

    ConvertToCSV(objArray:any) {
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
    showPassword(input: any): any {

        input.type = input.type === 'password' ? 'text' : 'password';
    }

    personCancel() {
        this.staffPersonDialog = false;
        //this.confirmationService.confirm({
        //    message: 'Are you sure you want to cancel this form?',
        //    accept: () => {
                
        //    }
        //});
        
    }
    //--------------------------------------End Person view (Staff) operation---------------------------------------------------

    //start person contact person operation

    validatePerson() {
        this.personform = this.fb.group({
            'firstName': new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z]+')]),
            'lastName': new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z]+')]),
            'dateOfBirth': new FormControl('', Validators.required),
            'relation': new FormControl('', Validators.required),
            'emailId': new FormControl('', [Validators.required,Validators.email]),
            'password': new FormControl(''),
            'gender': new FormControl(''),
            'primaryMobile': new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern('[0-9]+')]),
            'secondaryMobile': new FormControl('', [Validators.minLength(10), Validators.maxLength(10), Validators.pattern('[0-9]+')]),
            'address': new FormControl('', Validators.required),
            'countries': new FormControl('', Validators.required),
            'state': new FormControl('', Validators.required),
            'zipCode': new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(8), Validators.pattern('[0-9]+')]),
            'isPrimaryContact': new FormControl(''),
            'isHavingSmartPhone': new FormControl(''),
            'isActive': new FormControl(''),

           });
    }

    addContactperson(pViewDetail: PersonViewDetail) {
        this.personViewId = pViewDetail.id;      
        this.personViewDetails = pViewDetail.personObj;
        this.selectedTab = 1;
        this.personContactPersonDialog = true;
        this.tab1visible = true;
        this.tab2visible = false;
    }

    createPerson(number: number) {
        var a = this.personDetail.dateOfBirth;
        var b = moment(a).format('YYYY-MM-DD');
        this.personDetail.dateOfBirth = moment(b).toDate();
        if (b >= AppSettings.CURRENT_DATE) {
            this.msgs = [];
            this.msgs.push({ severity: 'error', summary: 'Date of birth should not be greater than current date ' });
        }
        else {
            var addedPerson: PersonDetail;
            this.tab1visible = true;
            this.tab2visible = false;
            this.selectedTab = number;
            var updatedPerson: PersonViewDetail;
            let fileToUpload: any;
            var fileArrys: string[];
            var newPersonId: string;
            let fi = this.personImage.nativeElement;
            if (fi.files && fi.files[0]) {
                fileToUpload = fi.files[0];
                fileArrys = fileToUpload.name.split(".");
            }

            
            this.personDetail.country = this.selectedCountry;
            this.personDetail.state = this.selectedState;
            this.personDetail.relation = this.selectedRelation;
            this.personDetail.role = this.selectedRole;
            //alert("personViewId = "+this.personViewId);
            if (this.personViewId) {
                if (this.personDetail.imgUrl == null || this.personDetail.imgUrl == this.image) {
                    this.personDetail.imgUrl = this.image;
                }               
                this.personDetail.organizationId = this.organizationid;
                this._setupService.createPersonContactPerson(this.personViewId, this.personDetail).subscribe(result => {
                    updatedPerson = result;
                    addedPerson = updatedPerson.personObj[updatedPerson.personObj.length - 1];
                    newPersonId = addedPerson.id;
                    if (this.personDetail != null && fi.files && fi.files[0]) {
                        this._setupService.personContactPersonFileUploads(fileToUpload, newPersonId + "." + fileArrys[1]).subscribe((response) => {
                            this._setupService.updatePersonContactPersonImageName(this.personViewId, newPersonId, fileArrys[1]).subscribe((response) => {
                                this.pViewDetail = response;
                                this.personViewDetails = this.pViewDetail.personObj;
                                var a = this.pViewDetail.dateOfBirth;
                                var b = moment(a).toDate();
                                this.pViewDetail.dateOfBirth = b;
                                this.getPerson();
                                this.personContact();
                                this.msgs = [];
                                this.msgs.push({ severity: 'success', summary: 'Contact person saved successfully' });
                            });
                        });
                    } else {
                        this.personViewDetails = updatedPerson.personObj;
                        this.msgs = [];
                        this.msgs.push({ severity: 'success', summary: 'Contact person saved successfully' });

                    }

                });
            }
        }
    }

    
    //update perosn 

    updatePerson(employeeDetail: PersonViewDetail) {
        this.employeeHeader = "Edit Person";
        this.pViewDetail = employeeDetail;
        this.selectedCountry = this.pViewDetail.country;
        this.selectedState = this.pViewDetail.state;
        this.selectedRelation = this.pViewDetail.relation;
        this.selectedRole = this.pViewDetail.role;

        var a = employeeDetail.dateOfBirth;
        var b = moment(a).format('YYYY-MM-DD');
        employeeDetail.dateOfBirth = moment(b).toDate();
        this.staffPersonDialog = true;
    }
    //Update patron contact person form

    updateContactPerson(tabNumber:number, mode:string, personDetail: PersonDetail) {
        var selectedPerson: PersonViewDetail;
        var contactPerson: PersonDetail | undefined = <PersonDetail>{};
        this.header = "Edit Contact Person";
        this.tab1visible = false;
        this.tab2visible = true;
        selectedPerson = this.personDetails.find(x => x.id == this.personViewId);
        contactPerson = selectedPerson.personObj.find(x => x.id == personDetail.id);
        //alert("gender : " + contactPerson.gender.length);
        //this._setupService.editPersonContactPerson(this.personViewId, personDetail.id).subscribe(result => {
        //    this.personDetailList = result;
        if (contactPerson != null) {
            this.personDetail = contactPerson;
                this.selectedRelation = this.personDetail.relation;
                this.selectedCountry = this.personDetail.country;
                this.selectedState = this.personDetail.state;
                //this.selectedRole = this.personDetail.role;
                this.selectedGender = this.personDetail.gender;
                //this.personDetail.gender = this.personDetail.gender ;
                var a = this.personDetail.dateOfBirth;
                var b = moment(a).format('YYYY-MM-DD');
                this.personDetail.dateOfBirth = moment(b).toDate();
            }
        //});
        //this.selectedRelation = this.personDetail.relation;
        //this.selectedCountry = this.personDetail.country;
        //this.selectedState = this.personDetail.state;
        //this.selectedRole = this.personDetail.role
        this.selectedTab = tabNumber;
    }

    // delete person contact person  from list
    deletePersonContact(personDetail: PersonDetail) {
        if (this.personViewDetails.length == 1) {
            this.msgs = [];
            this.msgs.push({ severity: 'error', summary: 'Contact person can not be delete' });
        } else {
            this.confirmationService.confirm({
                message: 'Do you want to delete ' + "<b>" + personDetail.firstName + " " + personDetail.lastName + "</b > " + ' ? ',
                header: 'Delete Confirmation',
                icon: 'fa fa-trash',
                accept: () => {
                    this._setupService.deletePersonContactPerson(this.personViewId, personDetail.id).subscribe((response) => {
                        if (response === 200) {
                            //this.personViewDetails.forEach((u: PersonDetail, i) => {
                            //    if (u.id === personDetail.id) {
                            //        this.personViewDetails.splice(i, 1);
                            //        this.personContact();
                            //    }
                            //});
                            this.personViewDetails = this.personViewDetails.filter(x => x.id != personDetail.id);
                            this.getPerson();
                            this.personContact();
                            this.msgs = [];
                            this.msgs.push({ severity: 'error', summary: 'Contact person deleted successfully' });
                        }
                    });
                }
            });
        }
    }

    // for tab  change  from tab button
    handleChange(e:number) {
        this.validatePerson();
        this.selectedTab = 1;
    }
    // for tab change from add and edit button
    activateTab(tabNumber:number, mode:string) {
        this.header = "Add contact Person"
        this.tab1visible = false;
        this.tab2visible = true;
        if (mode == 'add') {
            this.personDetail = null;
            this.personContact();
            this.validatePerson();
            this.selectedTab = tabNumber;
        }
    }
    contactcancel(number:number) {
        this.tab1visible = true;
        this.tab2visible = false;
        this.selectedTab = number;
    }

    getPerson() {
        this.loading = true;
        setTimeout(() => {
            this.loading = false;
        }, 15000);
        this._setupService.getPerson().subscribe((response) => {
            this.personDetails = [];
            this.personDetailsList = [];
            this.personDetails = response;
            this.loading = false;
        });
    }
    //------------------------------End  Person Contact Person Operation-------------------------------------
    personAuth() {

        this.authenticationTypeDetail = {
            id: UUID.UUID(),
            hashValue: '',
            patronId: '',
            mode: '',
            modeType: '',
            createDate: new Date(),
            lastUpdated: new Date(),
            organizationId: this.organizationid,
            remark: ''
        };
    }
    //Validate person authntication

    validatePersonAuth() {
        this.authform = this.fb.group({
            'hashvalue': new FormControl('', Validators.required),
            'authmode': new FormControl('', Validators.required),
            'remark': new FormControl(),
        });
    }
    auth() {
        for (var i = 0; i < this.authTypeDetails.length; i++) {
            if (this.authTypeDetails[i].mode == "2") {
                this.authTypeDetails[i].modeType = "RFID";
            }
            else if (this.authTypeDetails[i].mode == "1") {
                this.authTypeDetails[i].modeType = "Finger Scan";
            }
            else {
                this.authTypeDetails[i].modeType = "NA";
            }
        }

    }
    // add patron authentication
    addAuthType(personViewDetail: PersonViewDetail) {
        this.personViewId = personViewDetail.id;
        //this.getPerson();
        this.authTypeDetails = personViewDetail.authentications;
        this.auth();
        this.validatePersonAuth();
        this.selectedTab = 1;
        this.personAuthDialog = true;
        this.tab1Authenticationvisible = true;
        this.tab2Authenticationvisible = false;
    }

    //create form and save patron authentication

    createAuthType(number:number) {
        this.tab1Authenticationvisible = true;
        this.tab2Authenticationvisible = false;
        this.selectedTab = number;
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        this.authenticationTypeDetail.mode = this.selectedAuthMode;
        if (this.personViewId) {
            this._setupService.createPersonAuth(this.personViewId, this.authenticationTypeDetail).subscribe(result => {
                this.pViewDetail = result;
                this.authTypeDetails = this.pViewDetail.authentications;
                var a = this.pViewDetail.dateOfBirth;
                var b = moment(a).toDate();
                this.pViewDetail.dateOfBirth = b;
                this.getPerson();
                this.auth();
                this.personAuth();
            });
            this.msgs = [];
            this.msgs.push({ severity: 'success', summary: 'Authentication saved successfully' });
        }
    }

    //update patron authentication
    updateAuthType(tabNumber: number, mode: string, personDetail: PersonDetail) {
        var selectedPerson: PersonViewDetail;
        var selectedPersonAuth: AuthenticationTypeDetail;
        this.header = "Edit Authentication";
        this.tab1Authenticationvisible = false;
        this.tab2Authenticationvisible = true;
        selectedPerson = this.personDetails.find(x => x.id == this.personViewId);
        selectedPersonAuth = selectedPerson.authentications.find(x => x.id == personDetail.id);
        //this._setupService.editPersonAuth(this.personViewId, personDetail.id).subscribe(result => {
        //    this.authenticationTypeList = result;
        if (selectedPersonAuth != null) {
            this.authenticationTypeDetail = selectedPersonAuth;
                this.selectedAuthMode = this.authenticationTypeDetail.mode
            }
        //});
        this.selectedTab = tabNumber;
    }

    //delete patron authentication
    deleteAuthType(authType: AuthenticationTypeDetail) {
        this.confirmationService.confirm({
            message: 'Do you want to delete ' + "<b>" + authType.hashValue + "</b >" + '?',
            header: 'Delete Confirmation',
            icon: 'fa fa-trash',
            accept: () => {
                this._setupService.deletePersonAutheticationType(this.personViewId, authType.id).subscribe((response) => {
                    if (response === 200) {
                        //this.authTypeDetails.forEach((u: AuthenticationTypeDetail, i) => {
                        //    if (u.id === authType.id) {
                        //        this.authTypeDetails.splice(i, 1);
                        //    }
                        //});
                        this.authTypeDetails = this.authTypeDetails.filter(x => x.id != authType.id);
                        this.getPerson();
                        this.auth();
                        this.personAuth();
                        this.msgs = [];
                        this.msgs.push({ severity: 'error', summary: 'Authentication deleted successfully' });
                    }
                });
            }
        });

    }

    //  tab change for patron authentication
    handleChange1(e) {
        this.validatePersonAuth();
        this.selectedTab = 1;
    }

    //for activate tab if add authentication
    activateTab1(tabNumber:number, mode:string) {
        this.tab1Authenticationvisible = false;
        this.tab2Authenticationvisible = true;
        if (mode == 'add') {
            this.authenticationTypeDetail = null;
            this.personAuth();
            this.validatePersonAuth();
            this.selectedTab = tabNumber;
        }
    }
    //for patron auth cancle
    onCancel(number: number) {
        this.tab1Authenticationvisible = true;
        this.tab2Authenticationvisible = false;
        this.selectedTab = number;
    }
    
    //End Patron Authebntication Operation
}





