import { Component } from '@angular/core';
import { FormControl, FormBuilder, Validators, FormGroup} from '@angular/forms';
import { SelectItem,ConfirmationService, Message} from 'primeng/primeng';
import { SetupService } from '../../services/setup.service';
import * as moment from 'moment';
import { AppSettings } from '../../services/global.constants';

@Component({
    selector: 'schedule',
    template: require('./schedule.component.html'),
    providers: [ConfirmationService, SetupService]
})

export class ScheduleComponent {

    sessionform: FormGroup;
    breakform: FormGroup;
    termform: FormGroup;
    gradeform: FormGroup;
    patronDetails: PatronDetail[];
    sessionId: string;
    breakId: string;
    termId: string;

    sessionDetail: SessionDetail;
    breakDetail: BreakDetail;
    termDetail: TermDetail;
    gradeDetail: GradeDetail;

    public sessionDetails: SessionDetail[];
    public breakDetails: BreakDetail[];
    public termDetails: TermDetail[];
    public gradeDetails: GradeDetail[];
    public weekDetails: WeekDetail[];

    sessionDialog: boolean = false;
    breakDialog: boolean = false;
    termDialog: boolean = false;
    gradeDialog: boolean = false;

    daysOfWeekId: string
    daysCreatedDate: Date;
    date1: string;

    days: SelectItem[];
    selectedDays: string[];
    tempSelectedDays: string[];
    public daysOfWeek: string = "";

    selectedSessionDetail: SessionDetail;
    selectedBreakDetail: BreakDetail;
    selectedTermDetail: TermDetail;
    selectedGradeDetail: GradeDetail;
    selectedGrade: string;
    selectedSection: string;

    public grade: SelectItem[];
    public section: SelectItem[];    
   
    msgs: Message[] = [];
    createDate: Date;
    startTime1: Date;
    startTime2: string;
    orgId: string = AppSettings.ORGANIZATION_ID;;  
    loading: boolean;
    currentDate: string;
    constructor(private confirmationService: ConfirmationService, private _setupService: SetupService, private fb: FormBuilder) {
        this.selectedDays = [];
        this.tempSelectedDays = [];
        this.currentDate = moment(new Date()).format('YYYY-MM-DD');        
        this.loading = true;
        setTimeout(() => {
            this._setupService.getSession().subscribe(sessionDetails => this.sessionDetails = sessionDetails);
            this.loading = false;
        }, 1000);
        this._setupService.getBreak().subscribe(breakDetails => this.breakDetails = breakDetails);
        this._setupService.getTerm().subscribe(termDetails => this.termDetails = termDetails);
        this._setupService.getGrade().subscribe(gradeDetails => this.gradeDetails = gradeDetails);
        this._setupService.getPatron().subscribe((response) => { this.patronDetails = response;  });
        this._setupService.getWeek().subscribe(result => {
            this.weekDetails = result;
            this.daysOfWeekId = this.weekDetails[0].id;
            this.daysCreatedDate = this.weekDetails[0].createDate;
            this.selectedDays = this.weekDetails[0].dayofweek.split(",");
            this.tempSelectedDays = this.weekDetails[0].dayofweek.split(",");
        });

        this.days = [];
        this.days.push({ label: 'Monday', value: 'Monday' });
        this.days.push({ label: 'Tuesday', value: 'Tuesday' });
        this.days.push({ label: 'Wednesday', value: 'Wednesday' });
        this.days.push({ label: 'Thursday', value: 'Thursday' });
        this.days.push({ label: 'Friday', value: 'Friday' });
        this.days.push({ label: 'Saturday', value: 'Saturday' });
        this.days.push({ label: 'Sunday', value: 'Sunday' });

        this.grade = [];
        //this.grade.push({ label: 'Select Class', value: null });
        this.grade.push({ label: '1', value: '1' });
        this.grade.push({ label: '2', value: '2' });
        this.grade.push({ label: '3', value: '3' });
        this.grade.push({ label: '4', value: '4' });
        this.grade.push({ label: '5', value: '5' });
        this.grade.push({ label: '6', value: '6' });
        this.grade.push({ label: '7', value: '7' });
        this.grade.push({ label: '8', value: '8' });
        this.grade.push({ label: '9', value: '9' });
        this.grade.push({ label: '10', value: '10' });
        this.grade.push({ label: '11', value: '11' });
        this.grade.push({ label: '12', value: '12' });

        this.section = [];
        //this.section.push({ label: 'Select Section', value: null });
        this.section.push({ label: 'A', value: 'A' });
        this.section.push({ label: 'B', value: 'B' });
        this.section.push({ label: 'C', value: 'C' });
        this.section.push({ label: 'D', value: 'D' });
        this.section.push({ label: 'E', value: 'E' });
        this.section.push({ label: 'F', value: 'F' });
        this.section.push({ label: 'G', value: 'G' });
        this.section.push({ label: 'H', value: 'H' });
        this.getSession();
        this.getTerm();
        this.getBreak();
        this.getGrade();
    }
    getSession() {
        this.sessionDetail = {
            id: '',
            sessionName: '',
            startDate: '',
            endDate: '',
            sessionBreak: [],
            sessionTerm: [],
            sessionWeek: [],
            status: '',
            createDate: new Date(),
            lastUpdated: new Date(),
            organizationid: this.orgId,
            type: ''
        };
    }
    getBreak() {
        this.breakDetail = {
            id: '',
            breakName: '',
            startDate: '',
            endDate: '',
            tag: '',
            organizationid: this.orgId,
            createDate: new Date(),
            lastUpdated: new Date()
        }
    }
    getTerm() {
        this.termDetail = {
            id: '',
            termName: '',
            startDate: '',
            endDate: '',
            tag: '',
            organizationid: this.orgId,
            createDate: new Date(),
            lastUpdated: new Date()
        };
    }
    getGrade() {
        this.gradeDetail = {
            id: '',
            grade: '',
            section: '',
            organizationid: this.orgId,
            createDate: new Date(),
            lastUpdated: new Date()
        };
    }
    addSession() {
        this.getSession();
        this.validate();
        this.sessionDialog = true;
    }

    addBreak() {
        this.getBreak();
        this.validate();
        this.breakDialog = true;
    }

    addTerm() {
        this.getTerm();
        this.validate();
        this.termDialog = true;
    }

    addGrade() {

        this.validate();
        this.gradeDialog = true;
    }

    //Create Session
    createSession() {
        var savedSession: SessionDetail;
        var a = moment(this.sessionDetail.startDate).toDate();
        this.sessionDetail.startDate = moment(a).format('YYYY-MM-DD');
        var b = moment(this.sessionDetail.endDate).toDate();
        this.sessionDetail.endDate = moment(b).format('YYYY-MM-DD');        
        if (this.sessionDetail.id) {    //if  session id found update session
            if (this.sessionDetail.startDate > this.sessionDetail.endDate) {

            } else {
                // call for update update session with session id and session detail
                this._setupService.updateSession(this.sessionDetail.id, this.sessionDetail).subscribe((response) => {
                    if (response === 204) {
                        // Call for get updated session
                        this._setupService.getSession().subscribe(sessionDetails =>
                            this.sessionDetails = sessionDetails);
                        this.msgs = [];
                        this.msgs.push({ severity: 'success', summary: 'Session update successfully' });
                    }
                }); this.sessionDialog = false;
            }
        }
        else {      // if session id not found create new session
            this.sessionDetail.status = "Active";
            this.sessionDetail.sessionBreak = [];
            this.sessionDetail.sessionTerm = [];
            //call for create new session  with active status and get new createtd session id
            this._setupService.saveAndGetSessionId(this.sessionDetail).subscribe((response) => {
                savedSession = response;               
                if (savedSession != null) {                    
                       this._setupService.getSession().subscribe(sessionDetails =>
                       this.sessionDetails = sessionDetails);
                       this.msgs = [];
                       this.msgs.push({ severity: 'success', summary: 'Session saved successfully' });
                       //call for update session status (Completed) for old created session      
                       this._setupService.updateSessionStatus(savedSession.id).subscribe((response) => {  
                       });
                }
            }); this.sessionDialog = false;
        }
    }
   

    //Create Term

    createTerm(value: TermDetail) {
        var savedTerm: TermDetail;
        var a = moment(this.termDetail.startDate).toDate();
        this.termDetail.startDate = moment(a).format('YYYY-MM-DD');
        var b = moment(this.termDetail.endDate).toDate();
        this.termDetail.endDate = moment(b).format('YYYY-MM-DD');        
        if (this.termDetail.id) {
            if (this.termDetail.startDate > this.termDetail.endDate) {

            } else {
                this._setupService.updateTerm(this.termDetail.id, this.termDetail).subscribe((response) => {
                    if (response === 204) {
                        this._setupService.updateTermInSessionDetail(this.termDetail.id, this.termDetail).subscribe((response) => {
                            this._setupService.getTerm().subscribe(termDetails => this.termDetails = termDetails);
                            this.msgs = [];
                            this.msgs.push({ severity: 'success', summary: 'Term update successfully' });
                        });


                    }
                }); this.termDialog = false;
            }
        } else {
            this._setupService.saveAndGetTermId(this.termDetail).subscribe((response) => {
                savedTerm = response;               
                if (savedTerm != null) {
                    this._setupService.updateSessionTermDetail(savedTerm).subscribe((response) => {
                        this._setupService.getTerm().subscribe(termDetails => this.termDetails = termDetails);
                        this.msgs = [];
                        this.msgs.push({ severity: 'success', summary: 'Term saved successfully' });
                    });                  
                }                
            }); this.termDialog = false;
        }
    }

    //Create Break 
    createBreak() {
        var savedBreak: BreakDetail;
        var a = moment(this.breakDetail.startDate).toDate();
        this.breakDetail.startDate = moment(a).format('YYYY-MM-DD');
        var b = moment(this.breakDetail.endDate).toDate();
        this.breakDetail.endDate = moment(b).format('YYYY-MM-DD');        
        if (this.breakDetail.id) {
            if (this.breakDetail.startDate > this.breakDetail.endDate) {

            } else {
                this._setupService.updateBreak(this.breakDetail.id, this.breakDetail).subscribe((response) => {
                    if (response === 204) {
                        this._setupService.updateBreakInSessionDetail(this.breakDetail.id, this.breakDetail).subscribe((response) => {
                            this._setupService.getBreak().subscribe(breakDetails => this.breakDetails = breakDetails);
                            this.msgs = [];
                            this.msgs.push({ severity: 'success', summary: 'Break update successfully' });
                        });

                    }
                }); this.breakDialog = false;
            }
        } else {
            this._setupService.saveAndGetBreakId(this.breakDetail).subscribe((response) => {
                savedBreak = response;
                if (savedBreak != null) {                  
                        this._setupService.getBreak().subscribe(breakDetails => this.breakDetails = breakDetails);
                        this.msgs = [];
                        this.msgs.push({ severity: 'success', summary: 'Break saved successfully' });
                        this._setupService.updateSessionBreakDetail(savedBreak).subscribe((response) => {
                    });
                }
            });
            this.breakDialog = false;
        }
    }
    // Create Weeek
    createWeek() {
        this.daysOfWeek = '';
        if (this.selectedDays.length > 0) {
            for (var day in this.selectedDays) {
                this.daysOfWeek += this.selectedDays[day] + ",";
            }
            this.daysOfWeek = this.daysOfWeek.replace(/^,|,$/g, ''); // remove end commas           
            if (this.daysOfWeekId) {
                    this._setupService.updateWeek(this.daysOfWeekId, this.daysOfWeek, this.daysCreatedDate).subscribe((response) => {
                    if (response === 204) {
                        this.msgs = [];
                        this.msgs.push({ severity: 'success', summary: 'Week update successfully' });
                    }
                });
                    
            }
            else {
                this._setupService.createWeek(this.daysOfWeek).subscribe((response) => {
                    if (response === 204) {
                        this.msgs = [];
                        this.msgs.push({ severity: 'success', summary: 'Week saved successfully' });
                    }
                });
            }
            this._setupService.updateSessionWeekDetail(this.daysOfWeek).subscribe((response) => {

            });


        }
        else {
            this.msgs = [];
            this.msgs.push({ severity: 'error', summary: 'Please select at least one day !' });
            this.selectedDays = this.tempSelectedDays;
        }
    }

    //Create Grade
    createGrade() {              
        this._setupService.createGrade(this.selectedGrade, this.selectedSection).subscribe((response) => {
            if (response === 204) {
                this._setupService.getGrade().subscribe(gradeDetails => this.gradeDetails = gradeDetails);
                this.msgs = [];
                this.msgs.push({ severity: 'success', summary: 'Grade saved successfully' });
            }
        }); this.gradeDialog = false;
    }

    updateSession(sessionDetail: SessionDetail) {
        this.sessionDetail = sessionDetail;
        this.sessionDialog = true;
    }

    updateBreak(breakDetail: BreakDetail) {
        this.breakDetail = breakDetail;
        this.breakDialog = true;
    }

    updateTerm(termDetail: TermDetail) {
        this.termDetail = termDetail;
        this.termDialog = true;
    }

    cancelSession() {
        this.sessionDialog = false;
        
    }
    cancelBreak() {
        this.breakDialog = false;
       
        
    }
    cancelTerm() {
        this.termDialog = false;  
       
    }
    cancelgrade() {
        this.gradeDialog = false;
        
    }

    ngOnInit() {
        this.validate();
        this._setupService.getTermById(this.termId).subscribe(termDetail => this.termDetail = termDetail);
        this._setupService.getBreakById(this.breakId).subscribe(breakDetail => this.breakDetail = breakDetail);
        this._setupService.getSessionById(this.sessionId).subscribe(sessionDetail => this.sessionDetail = sessionDetail);

    }
    
    matchingDates(startdateKey: string, enddateKey: string) {
            return (group: FormGroup): { [key: string]: any } => {
            let startdate = group.controls[startdateKey];
            let enddate = group.controls[enddateKey];
            if (startdate.value > enddate.value) {
                return {
                    invalidDate: true
                };
            }
        }
    }
    validate() {     
        this.sessionform = this.fb.group({           
            //'sessionname': new FormControl('', [Validators.required, Validators.pattern(`\\d{4}[-\\.\\s]\\d{4}`)]),
            'sessionname': new FormControl('', Validators.required),
            'startdate': new FormControl('', Validators.required),
            'enddate': new FormControl('', Validators.required),
            
        }, { validator: this.matchingDates('startdate','enddate') });

        this.breakform = this.fb.group({
            'breakname': new FormControl('', Validators.required),
            'startdate': new FormControl('', Validators.required),
            'enddate': new FormControl('', Validators.required),
          
        }, { validator: this.matchingDates('startdate', 'enddate') });
        this.termform = this.fb.group({
            'termname': new FormControl('', Validators.required),
            'startdate': new FormControl('', Validators.required),
            'enddate': new FormControl('', Validators.required),
            
        },{ validator: this.matchingDates('startdate', 'enddate') });
        this.gradeform = this.fb.group({
            'grade': new FormControl('', Validators.required),
            'section': new FormControl('', Validators.required),
            
        })
    }

    deleteSession(sessionDetail: SessionDetail) {        
        if (sessionDetail.status =="Active") {
            this.msgs = [];
            this.msgs.push({ severity: 'error', summary: 'Session cannot be deleted' });
        } else {
            this.confirmationService.confirm({
                message: 'Do you want to delete ' + "<b>" + sessionDetail.sessionName + "</b>" + ' Session ?',
                header: 'Delete Confirmation',
                icon: 'fa fa-trash',
                accept: () => {
                    this._setupService.deleteSession(sessionDetail).subscribe((response) => {
                        if (response === 204) {
                            this.sessionDetails.forEach((u: SessionDetail, i) => {
                                if (u.id === sessionDetail.id) {
                                    this.sessionDetails.splice(i, 1);
                                }
                            });
                            this.msgs = [];
                            this.msgs.push({ severity: 'error', summary: 'Session deleted successfully' });
                        }
                    });
                }
            });
        }
        

        
    }

    deleteBreak(breakDetail: BreakDetail) {
        this.confirmationService.confirm({
            message: 'Do you want to delete ' + "<b>" + breakDetail.breakName + "</b>" +' break ? ',
            header: 'Delete Confirmation',
            icon: 'fa fa-trash',
            accept: () => {
                this._setupService.deleteBreak(breakDetail).subscribe((response) => {
                    if (response === 204) {
                        this.breakDetails.forEach((u: BreakDetail, i) => {
                            if (u.id === breakDetail.id) {  
                                    this.breakDetails.splice(i, 1);
                                    this.msgs = [];
                                    this.msgs.push({ severity: 'error', summary: 'Break deleted successfully' });
                                }
                        });
                        this._setupService.deleteBreakFromSession(breakDetail).subscribe((result) => {
                        });
                        
                    }
                });
            }
        });
    }

    deleteTerm(termDetail: TermDetail) {
        this.confirmationService.confirm({
            message: 'Do you want to delete ' + "<b>" + termDetail.termName + "</b>"+ ' term ? ',
            header: 'Delete Confirmation',
            icon: 'fa fa-trash',
            accept: () => {
                this._setupService.deleteTerm(termDetail).subscribe((response) => {
                    if (response === 204) {
                        this.termDetails.forEach((u: TermDetail, i) => {
                            if (u.id === termDetail.id) {
                                this.termDetails.splice(i, 1);
                                this.msgs = [];
                                this.msgs.push({ severity: 'error', summary: 'Term deleted successfully' });
                            }
                        });                      
                        this._setupService.deleteTermFromSession(termDetail).subscribe((result) => {
                        });
                    }
                });
            }
        });
    }

    deleteGrade(gradeDetail: GradeDetail) {
        this.confirmationService.confirm({
            message: 'Do you want to delete class ' + "<b>" + gradeDetail.grade + "</b>" + " section " + "<b>" + gradeDetail.section + "</b>" +' ?',
            header: 'Delete Confirmation',
            icon: 'fa fa-trash',
            accept: () => {
                this._setupService.isStudentExistInClass(gradeDetail.grade, gradeDetail.section).subscribe(result => {
                    this.patronDetails = result;
                        if (this.patronDetails.length == 0) {                       
                        this._setupService.deleteGrade(gradeDetail).subscribe((response) => {
                            if (response === 204) {
                                this.gradeDetails.forEach((u: GradeDetail, i) => {
                                    if (u.id === gradeDetail.id) {
                                        this.gradeDetails.splice(i, 1);
                                    }
                                });
                                this.msgs = [];
                                this.msgs.push({ severity: 'error', summary: 'Class deleted successfully' });
                            }

                        });
                    } else {
                        this.msgs = [];
                        this.msgs.push({ severity: 'error', summary: ' Patrons are exist in this class so class can not be deleted' });
                    }
                   
                });
                
            }
        });
    }
   

}

