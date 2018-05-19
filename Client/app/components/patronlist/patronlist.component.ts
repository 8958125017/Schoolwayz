import { Component, ViewChild } from '@angular/core';
import { FormControl, FormBuilder, Validators, FormGroup, } from '@angular/forms';
import { Http, Headers, } from '@angular/http';

import { SelectItem, ConfirmationService, Message, PasswordModule } from 'primeng/primeng';
import { SetupService, Country, State } from '../../services/setup.service';
import { UUID } from 'angular2-uuid';
import * as moment from 'moment';
import 'rxjs/Rx';
import { AppSettings } from '../../services/global.constants';

@Component({
    selector: 'patronlist',
    template: require('./patronlist.component.html?v=${new Date().getTime()'),
    providers: [ConfirmationService, SetupService]
})

export class PatronListComponent {
    @ViewChild("fileInput") fileInput;
    @ViewChild("personImage") personImage;
    postData: any;

    file: any[] = [];
    fileUpload: FileUpload;
    submitted: boolean;
    ContactPersonHeader: string;
    AutheticationHeader: string;
    PatronHeader: string;

    public http: Http;
    msgs: Message[] = [];
    image: string = AppSettings.DEFAULT_IMAGE;
    organizationid: string = AppSettings.ORGANIZATION_ID;;
    selectedTab: number = 1;

    // for patron creation form
    patronDialog: boolean = false;
    patronform: FormGroup;
    patronId: string
    patronDetail: PatronDetail;
    //patronDetail1: PatronDetail[];
    personDetails: PersonDetail[];
    authTypeDetails: AuthenticationTypeDetail[];
    authenticationTypeDetails: AuthenticationTypeDetail;
    public gradeDetails: GradeDetail[];
    //uploadedFiles: any[] = [];
    selectedClass: string;
    selectedSection: string;
    public classList: SelectItem[];
    public sectionList: SelectItem[];
    patronClass: string;
    totalGrades: string[];

    //for patron list
    patronArr = [];
    patronDetails: PatronDetail[] = [];
    selectedPatronDetail: PatronDetail;

    imagePath: string = AppSettings.IMAGE_ENDPOINT;

    //for contact person form
    patronContact: boolean = false;
    personform: FormGroup;
    personId: string;
    personDetail: PersonDetail;
    pViewDetail: PersonViewDetail;
    pViewDetails: PersonViewDetail[];
    personDetailList: PersonDetail[];
    personViewDetail: PersonDetail;
    selectedCountry: string;
    selectedState: string;
    personViewDetails: PersonDetail[];
    country: Country[];
    countries: SelectItem[];
    states: State[];
    countryStates: SelectItem[];
    public relations: SelectItem[];
    public role: SelectItem[];
    selectedRole: string;
    selectedRelation: string;
    personViewId: string;
    personView: PersonDetail;
    patronList: PatronDetail;
    personviewList: PersonViewDetail;

    selectedContactPerson: PersonDetail[];
    selectedPersonId: string;
    selectedPersonDetail: PersonDetail;

    //for patronAuthentication form

    patronAuthDialog: boolean = false;
    authform: FormGroup;
    public authMode: SelectItem[];
    selectedAuthMode: string;
    authTypeId: string
    selectAuthenticationTypeDetail: AuthenticationTypeDetail;
    authenticationTypeDetail: AuthenticationTypeDetail;
    authenticationTypeList: AuthenticationTypeDetail[];
    patron1: PatronDetail;
    ip: string;
    loading: boolean;
    tab1visible: boolean = true;
    tab2visible: boolean = true;
    tab1Authenticationvisible: boolean = true;
    tab2Authenticationvisible: boolean = true;
    header: string;
    patronHeader: string;
    contactPersonHeader: string;
    oldRollNo: number;
    patDetail: PatronDetail
    constructor(private confirmationService: ConfirmationService, private _setupService: SetupService, private fb: FormBuilder) {
        //this.http = http;

        // patron operation
        this.getPatron();

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

        //patron authentications
        this.authMode = [];
        //this.authMode.push({ label: 'Select Mode', value: null });
        this.authMode.push({ label: 'RFID', value: '2' });
        this.authMode.push({ label: 'Finger Scan', value: '1' });
        this.patronAuth();
    }

    // end constructor operation
    //-------------------------------------------------------------------------------------------------

    //this function is used for patron operation and it call from constructor by this.patron() or at the time of add patron for clear form before add
    patron() {
        this.patronDetail = {
            id: this.patronId,
            firstName: '',
            lastName: '',
            patronNumber: '',
            rollNo: 0,
            dateOfBirth: new Date(),
            imgUrl: this.image,
            section: '',
            isActive: true,
            class: 0,
            transportRouteId: '',
            stoppageId: '',
            organizationId: this.organizationid,
            createDate: new Date(),
            lastUpdated: new Date(),
            persons: [],
            authentications: []
        };
    }
    // start patron operations

    // create form for patron creation 

    getPatron() {
        this.patron();
        this.person();
        this.loading = true;
        setTimeout(() => {
            this.loading = false;
        }, 15000);
        this._setupService.getPatron().subscribe((response) => {
            this.patronDetails = [];
            this.patronDetails = response;
            this.loading = false;
        });


    }

    createPatron(number: number) {
        this.patronDetail.class = Number(this.selectedClass);
        this.patronDetail.section = this.selectedSection;
        var a = this.patronDetail.dateOfBirth;
        var b = moment(a).format('YYYY-MM-DD');
        this.patronDetail.dateOfBirth = moment(b).toDate();

        if (b >= AppSettings.CURRENT_DATE) {
            this.msgs = [];
            this.msgs.push({ severity: 'error', summary: 'Date of birth should not be greater than current date.' });
        }
        else {
            let fileToUpload: any;
            var fileArrys: string[];
            var savedPatron: PatronDetail;
            let fi = this.fileInput.nativeElement;
            if (fi.files && fi.files[0]) {
                fileToUpload = fi.files[0];
                fileArrys = fileToUpload.name.split(".");
            }

            var a = this.patronDetail.dateOfBirth;
            var b = moment(a).format('YYYY-MM-DD');
            this.patronDetail.dateOfBirth = moment(b).toDate();
            if (this.patronDetail.id) {
                //alert("roll no" + this.patronDetail.rollNo);
                if (this.oldRollNo != this.patronDetail.rollNo) {
                    //alert("Not Equal")
                    ///  alert("Not Equal Roll no = " + this.patronDetail.rollNo)
                    if (this.patronDetails.find(x => x.class == this.patronDetail.class && x.section == this.patronDetail.section && x.rollNo == this.patronDetail.rollNo)) {
                        //    alert("Exist")
                        this.msgs = [];
                        this.msgs.push({ severity: 'error', summary: 'Roll number should be unique' });
                    } else {
                        //   alert("Not Exist")
                        this.PatronHeader = "Edit Patron";
                        this._setupService.updatePatron(this.patronDetail.id, this.patronDetail).subscribe((response) => {
                            if (response === 204) {
                                if (this.patronDetail != null && fi.files && fi.files[0]) {
                                    if (this.patronDetail.imgUrl == this.image) {
                                        this._setupService.updatePatronImageName(this.patronDetail.id, fileArrys[1]).subscribe((response) => {
                                        });
                                    }
                                    this._setupService.fileuploads(fileToUpload, this.patronDetail.id + "." + fileArrys[1]).subscribe((response) => {
                                        if (response === 204) {
                                            //this.patronDetail.imgUrl = savedPatron.id + "." + fileArrys[1];
                                            //this.patronDetails.push(this.patronDetail);
                                            this.getPatron();
                                        }
                                    });
                                } else {
                                    this.getPatron();
                                    //this.patronDetails.push(this.patronDetail);
                                }
                                this.msgs = [];
                                this.msgs.push({ severity: 'success', summary: 'Patron updated successfully' });
                                this.patronDialog = false;
                            }
                        });
                    }
                } else {
                   // alert(" Equal")
                    this.PatronHeader = "Edit Patron";
                    this._setupService.updatePatron(this.patronDetail.id, this.patronDetail).subscribe((response) => {
                        if (response === 204) {
                            if (this.patronDetail != null && fi.files && fi.files[0]) {
                                if (this.patronDetail.imgUrl == this.image) {
                                    this._setupService.updatePatronImageName(this.patronDetail.id, fileArrys[1]).subscribe((response) => {
                                    });
                                }
                                this._setupService.fileuploads(fileToUpload, this.patronDetail.id + "." + fileArrys[1]).subscribe((response) => {
                                    //if (response === 204) {
                                        //this.patronDetail.imgUrl = savedPatron.id + "." + fileArrys[1];
                                        //this.patronDetails.push(this.patronDetail);
                                        this.getPatron();
                                    //}
                                });
                            } else {
                                this.getPatron();
                                //this.patronDetails.push(this.patronDetail);
                            }
                            this.msgs = [];
                            this.msgs.push({ severity: 'success', summary: 'Patron updated successfully' });
                            this.patronDialog = false;
                        }
                    });
                }
            }
            else {
                if (this.patronDetails.find(x => x.class == this.patronDetail.class && x.section == this.patronDetail.section && x.rollNo == this.patronDetail.rollNo)) {
                    this.msgs = [];
                    this.msgs.push({ severity: 'error', summary: 'Roll number should be unique' });
                } else {
                    this.PatronHeader = "Add Patron";
                    this.patronDetail.persons = [];
                    this.patronDetail.authentications = [];
                    this.patronDetail.imgUrl = this.image;
                    this.patronDetail.organizationId = this.organizationid;
                    this._setupService.saveAndGetId(this.patronDetail).subscribe((response) => {
                        savedPatron = response;
                        this.patronDetail.id = savedPatron.id;
                        if (this.patronDetail != null && fi.files && fi.files[0]) {
                            this._setupService.updatePatronImageName(savedPatron.id, fileArrys[1]).subscribe((response) => {
                                this._setupService.fileuploads(fileToUpload, savedPatron.id + "." + fileArrys[1]).subscribe((response) => {
                                    //this.patronDetail.imgUrl = savedPatron.id + "." + fileArrys[1];
                                    //this.patronDetails.push(this.patronDetail);
                                    this.getPatron();
                                });
                            });
                        } else {
                            this.getPatron();
                            this.msgs = [];
                            this.msgs.push({ severity: 'success', summary: 'Patron saved successfully' });
                            //this.patronDetails.push(this.patronDetail);
                        }
                        this.msgs = [];
                        this.msgs.push({ severity: 'success', summary: 'Patron saved successfully' });

                    });
                    this.patronDialog = false;
                }
            }
        }
    }


    onChange(fileInput: any) {
        let f1 = fileInput.target.files;
        this.fileToUpload = f1[0];
    }


    //end patron create operation


    //Patron from validation
    validatePatron() {
        this.patronform = this.fb.group({
            'firstName': new FormControl('', [Validators.required, Validators.pattern('[a-z A-Z]+')]),
            'lastName': new FormControl('', [Validators.required, Validators.pattern('[a-z A-Z]+')]),
            'dateOfBirth': new FormControl('', Validators.required),
            'rollNo': new FormControl('', [Validators.required, Validators.pattern('[0-9]+')]),
            'classList': new FormControl('', Validators.required),
            'sectionList': new FormControl('', Validators.required),
            'isActive': new FormControl(''),
            'currentDate': new FormControl(''),
        });
    }
    //, { validator: this.matchingDates('dateOfBirth', 'currentDate') }
    // matchingDates(dateOfBirthKey: string, currentDateKey: string = AppSettings.CURRENT_DATE) {   
    //     return (group: FormGroup): { [key: string]: any } => {
    //         let dateOfBirth = group.controls[dateOfBirthKey.toString()];
    //         let currentDate = group.controls[currentDateKey];
    //         if (dateOfBirth.value >= currentDate.value) {
    //             return {
    //                 invalidDate: true
    //             };
    //         }
    //     }
    // }
    ngOnInit() {
        this.validatePatron();//call to validatePatron
        this.validatePerson();
        this.validatePatronAuth();
    }


    patronCancel() {
        this.patronDialog = false;
    }

    createclassList() {
        this.classList = [];
        this.sectionList = [];
        //this.classList.push({ label: 'Class', value: null })
        this.sectionList.push({ label: 'Section', value: 'Section' });
        for (var i = 0; i < this.totalGrades.length; i++) {
            this.classList.push({ label: this.totalGrades[i], value: this.totalGrades[i] });
        }
    }

    getSelectedClassSection() {
        this.sectionList = [];
        var classSection: GradeDetail[];
        //this.sectionList.push({ label: 'Section', value:''});
        classSection = this.gradeDetails.filter(x => x.grade == this.selectedClass).sort();
        for (var i = 0; i < classSection.length; i++) {
            this.sectionList.push({ label: classSection[i].section, value: classSection[i].section });
        }
    }

    // add new patron
    addPatron() {
        this.patronHeader = "Add Patron";
        this.patronDetail = <PatronDetail>{};
        this.patronDetail.imgUrl = this.image;
        //this.patron();
        this.validatePatron();
        this.patronDialog = true;
    }

    //update patron 
    updatePatron(selectedPatron: PatronDetail) {
        this.patronHeader = "Edit Patron";
        this.oldRollNo = selectedPatron.rollNo;
        this.patronDetail = <PatronDetail>{};
        this.patronDetail = selectedPatron;
        var a = selectedPatron.dateOfBirth;
        var b = moment(a).format('YYYY-MM-DD');
        selectedPatron.dateOfBirth = moment(b).toDate();
        this.selectedClass = this.patronDetail.class.toString();
        this.getSelectedClassSection();
        this.selectedSection = this.patronDetail.section;
        this.patronDialog = true;
    }

    // Delete Patron from list
    deletePatron(patronDetail: PatronDetail) {
        this.confirmationService.confirm({
            message: 'Do you want to delete Patron ' + "<b>" + patronDetail.firstName + " " + patronDetail.lastName + "</b > " + '?',
            header: 'Delete Confirmation',
            icon: 'fa fa-trash',
            accept: () => {
                this._setupService.deletePatron(patronDetail).subscribe((response) => {
                    if (response === 204) {
                        //this.patronDetails.forEach((u: PatronDetail, i) => {
                        //    if (u.id === patronDetail.id) {
                        //        this.patronDetails.splice(i, 1);
                        //    }
                        //});
                        this.patronDetails = this.patronDetails.filter(x => x.id != patronDetail.id);
                        this.msgs = [];
                        this.msgs.push({ severity: 'error', summary: 'Patron deleted successfully' });
                        //this.getPatron();
                    }
                });
            }
        });
    }

    //download patron list
    download() {
        var tempList: any[] = [];
        if (this.patronDetails == null) {
            this.msgs = [];
            this.msgs.push({ severity: 'warn',  detail: 'Please wait while data is loading' });
        } else {
            for (var patron of this.patronDetails) {
                tempList.push({
                    "FirstName": patron.firstName,
                    "LastName": patron.lastName,
                    "IsActive": patron.isActive,
                    "Class": patron.class,
                    "Section": patron.section,
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
        a.download = 'PatronDetails.csv';
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
    //end patron operations
    //------------------------------------------------------------------------------------------------

    // start for person operation

    person() {
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
            isActive: true,
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
    //validate patron contact person form

    validatePerson() {
        this.personform = this.fb.group({
            'firstName': new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z]+')]),
            'lastName': new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z]+')]),
            'dateOfBirth': new FormControl('', Validators.required),
            'relation': new FormControl('', Validators.required),
            'emailId': new FormControl('', [Validators.required, Validators.email]),
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
    //far add patron contact person

    addperson(patronDetail: PatronDetail) {
        this.patronId = patronDetail.id;
        this.personDetails = patronDetail.persons;
        this.selectedRelation = this.personDetail.relation;
        this.validatePerson();
        this.selectedTab = 1;
        this.patronContact = true;
        this.tab1visible = true;
        this.tab2visible = false;
    }
    //for create patron contact person

    createPerson(number: number) {
        var a = this.personDetail.dateOfBirth;
        var b = moment(a).format('YYYY-MM-DD');
        this.personDetail.dateOfBirth = moment(b).toDate();
        if (b >= AppSettings.CURRENT_DATE) {
            this.msgs = [];
            this.msgs.push({ severity: 'error', summary: 'Date of birth should be less than from current date ' });
        }
        else {
            var addedPerson: PersonDetail;
            this.tab1visible = true;
            this.tab2visible = false;
            this.selectedTab = number;
            var updatedPatron: PatronDetail;

            this.personDetail.country = this.selectedCountry;
            this.personDetail.state = this.selectedState;
            this.personDetail.relation = this.selectedRelation;
            this.personDetail.role = this.selectedRole;

            let fileToUpload: any;
            var fileArrys: string[];
            var newPersonId: string;
            let fi = this.personImage.nativeElement;
            if (fi.files && fi.files[0]) {
                fileToUpload = fi.files[0];
                fileArrys = fileToUpload.name.split(".");
            }

            if (this.patronId) {
                if (this.personDetail.imgUrl == null || this.personDetail.imgUrl == this.image) {
                    this.personDetail.imgUrl = this.image;
                }
                this.personDetail.organizationId = this.organizationid;
                this._setupService.createPatronContactPerson(this.patronId, this.personDetail).subscribe(result => {
                    updatedPatron = result;
                    addedPerson = updatedPatron.persons[updatedPatron.persons.length - 1];
                    newPersonId = addedPerson.id;
                    if (updatedPatron != null && fi.files && fi.files[0]) {
                        this._setupService.patronContactPersonFileUploads(fileToUpload, newPersonId + "." + fileArrys[1]).subscribe((response) => {
                            this._setupService.updateContactPersonImageName(this.patronId, newPersonId, fileArrys[1]).subscribe((response) => {
                                this.patronDetail = response;
                                this.personDetails = this.patronDetail.persons;
                                var a = this.patronDetail.dateOfBirth;
                                var b = moment(a).toDate();
                                this.patronDetail.dateOfBirth = b;
                                this.getPatron();
                                this.person();
                                this.msgs = [];
                                this.msgs.push({ severity: 'success', summary: 'Contact person saved successfully' });
                            });
                        });
                    }
                    else {

                        this.msgs = [];
                        this.msgs.push({ severity: 'success', summary: 'Contact person update successfully' });
                        this.personDetails = updatedPatron.persons;

                    }

                });
            }
        }
    }

    //Update patron contact person form

    updateContactPerson(tabNumber: number, mode: string, personDetail: PersonDetail) {
        this.contactPersonHeader = "Edit Contact Person";
        var selectedPerson: PatronDetail | undefined = <PatronDetail>{};
        var contactPerson: PersonDetail | undefined = <PersonDetail>{};;
        this.ContactPersonHeader = "Edit Contact Person";
        this.tab1visible = false;
        this.tab2visible = true;
        selectedPerson = this.patronDetails.find(x => x.id == this.patronId);
        if (selectedPerson != null) {
            contactPerson = selectedPerson.persons.find(x => x.id == personDetail.id);
        }
        if (contactPerson != null) {
            this.personDetail = contactPerson;
            this.selectedRelation = this.personDetail.relation;
            this.selectedCountry = this.personDetail.country;
            this.selectedState = this.personDetail.state;
            this.selectedRole = this.personDetail.role;
            this.personDetail.gender = this.personDetail.gender;
            
            var a = this.personDetail.dateOfBirth;
            var b = moment(a).format('YYYY-MM-DD');
            this.personDetail.dateOfBirth = moment(b).toDate();
        }
        this.selectedTab = tabNumber;
    }

    // delete patron contact person  from list
    deletePerson(person: PersonDetail) {
      
        if (this.personDetails.length == 1) {
            this.msgs = [];
            this.msgs.push({ severity: 'error', summary: 'Contact person can not be delete' });
        } else {
            
            this.confirmationService.confirm({
                message: 'Do you want to delete ' + "<b>" + person.firstName + " " + person.lastName + "</b > " + '?',
                header: 'Delete Confirmation',
                icon: 'fa fa-trash',
                accept: () => {
                    this._setupService.deletePatronContactPerson(this.patronId, person.id).subscribe((response) => {
                        if (response === 200) {
                            //this.personDetails.forEach((u: PersonDetail, i) => {
                            //    if (u.id === person.id) {
                            //        this.personDetails.splice(i, 1);
                            //    }
                            //});
                            this.personDetails = this.personDetails.filter(x => x.id != person.id);
                            this.getPatron();
                            this.person();
                            this.msgs = [];
                            this.msgs.push({ severity: 'error', summary: 'Contact person deleted successfully' });
                        }
                    });
                }
            });
        }
    }

    //cancle patron contact person form
    contactcancel(number: number) {
        this.tab1visible = true;
        this.tab2visible = false;
        this.selectedTab = number;
    }

    // for tab  change  from tab button
    handleChange(e) {
        this.validatePerson();
        this.selectedTab = 1;
    }

    // for tab change from add and edit button
    activateTab(tabNumber: number, mode: string) {
        this.ContactPersonHeader = "Add Contact Person"
        this.tab1visible = false;
        this.tab2visible = true;
        if (mode == 'add') {
            this.personDetail = null;
            this.person();
            this.validatePerson();
            this.selectedTab = tabNumber;
        }
    }
    //End  Patron Contact Person Operation
    //----------------------------------------------------------------------------------------------

    //Start Patron Authentication Operation
    patronAuth() {
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
    //Validate patron authntication

    validatePatronAuth() {
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
    addAuthType(patronDetail: PatronDetail) {
        this.patronId = patronDetail.id;
        //this.getPatron();

        this.authTypeDetails = patronDetail.authentications;
        this.auth();
        this.validatePatronAuth();
        this.selectedTab = 1;
        this.patronAuthDialog = true;
        this.tab1Authenticationvisible = true;
        this.tab2Authenticationvisible = false;
    }

    //create form and save patron authentication

    createAuthType(number: number) {
        this.tab1Authenticationvisible = true;
        this.tab2Authenticationvisible = false;
        this.selectedTab = number;
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        this.authenticationTypeDetail.mode = this.selectedAuthMode;
        if (this.patronId) {
            this._setupService.createPatronAuth(this.patronId, this.authenticationTypeDetail).subscribe(result => {
                this.patronDetail = result;
                this.authTypeDetails = this.patronDetail.authentications;
                var a = this.patronDetail.dateOfBirth;
                var b = moment(a).toDate();
                this.patronDetail.dateOfBirth = b;
                this.getPatron();
                this.auth();
                this.patronAuth();
            });
            this.msgs = [];
            this.msgs.push({ severity: 'success', summary: 'Patron authentication saved successfully' });
        }
    }

    //update patron authentication
    updateAuthType(tabNumber: number, mode: string, perDetail: PersonDetail) {
        var selectedPatron: PatronDetail | undefined = <PatronDetail>{};;
        var selectedPatronAuth: AuthenticationTypeDetail | undefined = <AuthenticationTypeDetail>{};;
        this.AutheticationHeader = "Edit Authentication";
        this.tab1Authenticationvisible = false;
        this.tab2Authenticationvisible = true;
        selectedPatron = this.patronDetails.find(x => x.id == this.patronId);
        if (selectedPatron != null) {
            selectedPatronAuth = selectedPatron.authentications.find(x => x.id == perDetail.id);
        }
        if (selectedPatronAuth != null) {
            this.authenticationTypeDetail = selectedPatronAuth;
            this.selectedAuthMode = this.authenticationTypeDetail.mode
        }
        this.selectedTab = tabNumber;
    }

    //delete patron authentication
    deleteAuthType(authDetail: AuthenticationTypeDetail) {
        this.confirmationService.confirm({
            message: 'Do you want to delete Authentication ' + "<b>" + authDetail.hashValue + "</b >" + '?',
            header: 'Delete Confirmation',
            icon: 'fa fa-trash',
            accept: () => {
                this._setupService.deletePatronAutheticationType(this.patronId, authDetail.id).subscribe((response) => {
                    if (response === 200) {
                        //this.authTypeDetails.forEach((u: AuthenticationTypeDetail, i) => {
                        //    if (u.id === authDetail.id) {
                        //        this.authTypeDetails.splice(i, 1);
                        //    }
                        //});
                        this.authTypeDetails = this.authTypeDetails.filter(x => x.id != authDetail.id);
                        this.getPatron();
                        this.auth();
                        this.patronAuth();
                        this.msgs = [];
                        this.msgs.push({ severity: 'error', summary: 'Authentication deleted successfully' });
                    }
                });
            }
        });
    }

    //  tab change for patron authentication
    handleChange1(e) {
        this.validatePatronAuth();
        this.selectedTab = 1;
    }

    //for activate tab if add authentication
    activateTab1(tabNumber: number, mode: string) {
        this.AutheticationHeader = "Add Authentication"
        this.tab1Authenticationvisible = false;
        this.tab2Authenticationvisible = true;
        if (mode == 'add') {
            this.authenticationTypeDetail = null;
            this.patronAuth();
            this.validatePatronAuth();
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
