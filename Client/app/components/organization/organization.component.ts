import * as ng from '@angular/core';
import { ViewChild } from '@angular/core';
import { FormControl, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { SelectItem, ConfirmationService,Message} from 'primeng/primeng';
import { SetupService, Country, State } from '../../services/setup.service';

@ng.Component({
    selector: 'organization',
    template: require('./organization.component.html'),
    providers: [ConfirmationService, SetupService]

})

export class OrganizationComponent {
    organizationForm: FormGroup;
    @ViewChild("fileInput") fileInput; //for image uploading
    submitted: boolean;
    orgDialog: boolean = false;
    orgId: string;
    organizationDetail: Organization;
    organizationDetails: Organization[];
    selectedEstablishmentType: string;    
    logoURL: string = "DefaultImage.jpg";
    settings: OrganizationSettings;
    notifications: Notifications;
    orgplan: OrganizationPlan;
    locations: GeoCoordinate;
    establishmentType: EstablishmentType;
    msgs: Message[] = [];
    country: Country[];
    countries: SelectItem[];
    states: State[];
    countryStates: SelectItem[];
    selectedValue: string;
    selectedType: string;
    organizationId: string= localStorage.getItem("OrganizationId"); //get organization Id Fromm Session
    file: any[] = [];
    postData: any;
    image: string = "DefaultImage.jpg";//set default Image
    fileUpload: FileUpload;
    organizationHeader: string;
    constructor(private _setupService: SetupService, private fb: FormBuilder) {       
        this.getOrganization(); //Call to get organization 
        this.organizationHeader = "Organization";
        this.organizationDetail = {
            id: '',
            name: '',
            address: '',
            city: '',
            zipCode: '',
            logoURL: '',
            establishmentType: 0,
            plan: 0,
            patrons: [],
            location: this.locations,
            settings: this.settings,
            notifications: this.notifications,
            organizationid: '',
            createDate: new Date(),
            lastUpdated: new Date(),
        }

        this.locations = {
            latitude:'',
            longitude: '',
            altitude: '',
            horizontalAccuracy: '',
            verticalAccuracy: '',
            speed: '',
            course: ''
        }

        this.notifications = {
            notifyParentForWhenTransportReachedStop: false,
            notifyParentForWhenTransportReachedSchool: false,
            notifyParentForPatronReachedSchool: false,
            notifyParentForPatronLeftSchool: false,
            notifyParentForWhenTransportLeftSchool: false,
            notifyParentForPatronAbsent: false,
            notifyParentForPatronAbscond: false,
        }
        
        this.settings = {
            trackHalfSession: false,
            trackPeriods: false,
            trackSchoolEnd: false,
            trackTransportStopDrop: false,
            enableSMSNotificaions: false,
        }

        this.orgplan = {
            silver: 2,
            gold: 3,
            platinum: 4,
        }

        this.establishmentType = {
            school: 1,
            office: 2,
            shop: 3,
            hospital: 4,
            fitnessCenter:5,
        }
    }          //close constructor operation
    getOrganization() {
        // get organization detail from service
        this._setupService.getOrganization().subscribe(result => {
            this.organizationDetail = result;
            this.notifications = this.organizationDetail.notifications;
            this.settings = this.organizationDetail.settings;

            if (this.organizationDetail.plan == 2) {
                this.selectedValue = "silver";
            }
            else if (this.organizationDetail.plan == 3) {
                this.selectedValue = "gold";
            }
            else if (this.organizationDetail.plan == 4) {
                this.selectedValue = "platinum";
            }

            //use for establishmentType

            if (this.organizationDetail.establishmentType == 1) {
                this.selectedType = "school";
            }
            else if (this.organizationDetail.plan == 2) {
                this.selectedType = "office";
            }
            else if (this.organizationDetail.plan == 3) {
                this.selectedType = "shop";
            }
            else if (this.organizationDetail.plan == 4) {
                this.selectedType = "hospital";
            }

            else if (this.organizationDetail.plan == 5) {
                this.selectedType = "fitness Center";
            }
        });
    }

    updateOrganization(number: number) {       // Update oranization
    
        let fileToUpload: any;
        var fileArrys: string[];        
        let fi = this.fileInput.nativeElement;    
        
        if (fi.files && fi.files[0]) {
            fileToUpload = fi.files[0];
            fileArrys = fileToUpload.name.split(".");
        } 
      
        if (this.selectedValue == "silver") {
            this.organizationDetail.plan = 2;
        }
        else if (this.selectedValue == "gold") {
            this.organizationDetail.plan = 3;
        }
        else if (this.selectedValue == "platinum") {
            this.organizationDetail.plan = 4;
        }

         //use for establishmentType
      
        if (this.selectedType == "school") {
            this.organizationDetail.establishmentType = 1;
        }
        else if (this.selectedValue == "office") {
            this.organizationDetail.establishmentType = 2;
        }
        else if (this.selectedValue == "shop") {
            this.organizationDetail.establishmentType = 3;
        }
        else if (this.selectedValue == "hospital") {
            this.organizationDetail.establishmentType = 4;
        }
        else if (this.selectedValue == "fitness Center") {
            this.organizationDetail.establishmentType = 5;
        }              
        if (this.organizationDetail.id) {                           //check organization Id 
            // update organization all details
            this._setupService.updateOrganization(this.organizationDetail.id, this.organizationDetail).subscribe((response) => {
                if (response === 204) {
                    if (this.organizationDetail != null && fi.files && fi.files[0]) {                        
                        if (this.organizationDetail.logoURL != this.image) {         
                            //call for update Image name
                            this._setupService.updateOrganizationLogoImageName(this.organizationDetail.id, fileArrys[1]).subscribe((response) => {
                            });
                        }
                      //logo (image) upload to cloude
                        this._setupService.logoImageUploadToCloude(fileToUpload, this.organizationDetail.id + "." + fileArrys[1]).subscribe((response) => {                          
                                if (response === 204) {
                                    this.getOrganization();// for page refresh and get organization updated records
                                }
                            });
                        }
                        else {
                              this.getOrganization(); // for page refresh and get organization updated records
                    }
                      
                        this.msgs = []; // create blank msgs list
                        //for display growl message after update                
                        this.msgs.push({ severity: 'success', summary: 'Organization updated successfully' });     
                    }
            });  // close updateOrganization service call
        } // end If
    } // close method


    ngOnInit() {
        this.organizationForm = this.fb.group({
            'name': new FormControl('', [Validators.required, Validators.pattern('[a-z A-Z]+')]),
            'address': new FormControl('', Validators.required),
            'plan': new FormControl(),
'plan1': new FormControl(),
'plan2': new FormControl(),
            'establishmentType': new FormControl(),
            'city': new FormControl('', Validators.required),
            'zipCode': new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(8), Validators.pattern('[0-9]+')]),
            
        });

    }
}