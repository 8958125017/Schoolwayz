import { Injectable } from '@angular/core';
import { Http, Headers, Response, Jsonp } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { AppSettings } from '../services/global.constants';

@Injectable()
export class SetupService {
    patronList: PatronDetail[];
    
    

    constructor(private http: Http, private _Jsonp: Jsonp) {

        this.http = http;
        
    }
    //end constructor operation


    endpoint_url: string = AppSettings.API_ENDPOINT;

    organizationId: string = AppSettings.ORGANIZATION_ID;  //get organization id From active session
    
    private getHeaders() {
        let headers = new Headers();
        headers.append('Accept', 'application/json');
        return headers;
    }

    getCountries() {    // set country
        return [
            new Country(2, 'India'),
        ];
    }

    getStates() {    //set country city and states  
        return [
            new State(1, 'Andhra Pradesh'),
            new State(2, 'Arunachal Pradesh'),
            new State(3, 'Assam'),
            new State(4, 'Gujarat'),
            new State(5, 'Chhattisgarh'),
            new State(6, 'Haryana'),
            new State(7, 'Himachal Pradesh'),
            new State(8, 'Karnataka'),
            new State(9, 'Madhya Pradesh'),
            new State(10, 'Maharashtra'),
            new State(11, 'Jharkhand'),
            new State(12, 'Uttarakhand'),  
            new State(13, 'Punjab'),
            new State(14, 'Uttar Pradesh'),           
            new State(15, 'Delhi'),
            new State(16, 'Rajasthan'),
            new State(17, 'Orissa'),
            new State(18, 'Manipur'),
            new State(19, 'Meghalaya'),
            new State(20, 'Mizoram'),
            new State(21, 'Nagaland'),
            new State(22, 'Chandigarh'),
            new State(23, 'Tamilnadu'),
            new State(24, 'Kerala'),
            new State(25, 'Tripura'),
            new State(26, 'Goa'),
            new State(27, 'Jammu & Kashmir'),
           ]
    }
   
    getSequence() {    //set sequence for transport route stoppage sequence
        return [
            new Sequence(1, 1),
            new Sequence(2, 2),
            new Sequence(3, 3),
            new Sequence(4, 4),
            new Sequence(5, 5),
            new Sequence(6, 6),
            new Sequence(7, 7),
            new Sequence(8, 8),
            new Sequence(9, 9),
            new Sequence(10, 10),
            new Sequence(11, 11),
            new Sequence(12, 12),
            new Sequence(13, 13),
            new Sequence(14, 14),
            new Sequence(15, 15),]
    }
    //call to deleteRoute from patron
    deleteRoutesFromPatron(tRoutes: TransportRouteDetail): Observable<number> {
        return this.http.put(this.endpoint_url + 'Patron/DeleteRouteFromPatron/' + this.organizationId + "/" + tRoutes.id, { headers: this.getHeaders() })
            .map((res: Response) => res.json())
    }

    updateAdminPassword(id: string, ChangePassword: AdminCredential): Observable<number> {
        return this.http.put(this.endpoint_url + 'AdminCredential/ChangeUserPassword/' + this.organizationId + "/" + id , ChangePassword, { headers: this.getHeaders() })
            .map((res: Response) => res.json());
    }

    

     // Begin Organization services

    // call to get organization detail
    getOrganization(): Observable<Organization> {
        return this.http.get(this.endpoint_url + 'Organization/GetOrg/' + this.organizationId)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    //call to update organization
    updateOrganization(id: string, organizationDetail: Organization): Observable<number> {
        return this.http.put(this.endpoint_url + 'Organization/' + this.organizationId + "/" + id, organizationDetail, { headers: this.getHeaders() })
            .map((res: Response) => res.status);
    }
    

    //call to update organization logo (image) name
    updateOrganizationLogoImageName(orgId: string, fileExt: string): Observable<number> {
        return this.http
            .put(this.endpoint_url + 'Organization/UpdateOrganizationImageName/' + this.organizationId + "/" + orgId + "/" + fileExt, { headers: this.getHeaders() }).map((res: Response) => res.status);
    }

    //call to upload logo (Image) in cloude
    logoImageUploadToCloude(fileToUpload: any, organizationId: string): Observable<number> {
        let input = new FormData();
        input.append("file", fileToUpload);
        return this.http.post(this.endpoint_url + 'Organization/UploadImage/' + this.organizationId + "/" + organizationId, input)
            .map((res: Response) => res.status)
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }
   
    // End Organization services

    // Begin Schedule Services

    // Begin session operations

    // Call for get session detail 
    getSession(): Observable<SessionDetail[]> {
        return this.http.get(this.endpoint_url + 'Session/' + this.organizationId)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }
    // Call for create new session and get saved session id
    saveAndGetSessionId(sessionDetail: SessionDetail): Observable<SessionDetail> {
        return this.http.post(this.endpoint_url + 'Session/saveAndGetSessionId/', sessionDetail, { headers: this.getHeaders() })
            .map((res: Response) => res.json());
    }

    //Update Session status () Active or Completed
    updateSessionStatus(savedSessionId: string): Observable<number> {
        return this.http
            .put(this.endpoint_url + 'Session/UpdateSessionDetailStatus/' + this.organizationId + "/" + savedSessionId, { headers: this.getHeaders() }).map((res: Response) => res.status);
    }

    getSessionById(sessionId: string): Observable<SessionDetail> {
        return this.http.get(this.endpoint_url + 'Session/' + this.organizationId + "/" + sessionId)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }
    updateBreakInSessionDetail(breakId: string, breakDetail: BreakDetail): Observable<number> {
        return this.http.put(this.endpoint_url + 'Session/UpdateBreakInSession/' + this.organizationId + "/" + breakId, breakDetail, { headers: this.getHeaders() }).map((res: Response) => res.status);
    }
    updateTermInSessionDetail(termId: string, termDetail: TermDetail): Observable<number> {
        return this.http.put(this.endpoint_url + 'Session/UpdateTermInSession/' + this.organizationId + "/" + termId, termDetail, { headers: this.getHeaders() }).map((res: Response) => res.status);
    }

    updateSession(sessionId: string, sessionDetail: SessionDetail): Observable<number> {
        return this.http
            .put(this.endpoint_url + 'Session/' + this.organizationId + "/" + sessionId, sessionDetail, { headers: this.getHeaders() }).map((res: Response) => res.status);
    }

    deleteSession(sessionDetail: SessionDetail): Observable<number> {
        return this.http.delete(this.endpoint_url + 'Session/' + this.organizationId + "/" + sessionDetail.id) // ...using put request
            .map((res: Response) => res.status) // ...and calling .json() on the response to return data
            .catch((error: any) => Observable.throw(error.json().error || 'Server error')); //...errors if any
    }
    deleteBreakFromSession(breakdetail: BreakDetail): Observable<number> {       
        return this.http.put(this.endpoint_url + 'Session/DeleteBreakFromSession/' + this.organizationId + "/" + breakdetail.id, { headers: this.getHeaders() })
            .map((res: Response) => res.json());
    }
   
    // End session operations

    // Begin Term operations
    getTerm(): Observable<TermDetail[]> {
        return this.http.get(this.endpoint_url + 'Term/' + this.organizationId)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    getTermById(termId: string): Observable<TermDetail> {
        return this.http.get(this.endpoint_url + 'Term/' + this.organizationId + "/" + termId)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }
    saveAndGetTermId(termDetail: TermDetail): Observable<TermDetail> {
        return this.http.post(this.endpoint_url + 'Term/saveAndGetTermId/', termDetail, { headers: this.getHeaders() })
            .map((res: Response) => res.json());
    }
    updateSessionTermDetail(termDetail: TermDetail): Observable<number> {
        return this.http.put(this.endpoint_url + 'Session/UpdateSessionWithTerm/' + this.organizationId, termDetail, { headers: this.getHeaders() }).map((res: Response) => res.status);
    }
    createTerm(termDetail: TermDetail): Observable<number> {
        return this.http.post(this.endpoint_url + 'Term', termDetail, { headers: this.getHeaders() }).map((res: Response) => res.status);
    }

    updateTerm(termId: string, termDetail: TermDetail): Observable<number> {
        return this.http
            .put(this.endpoint_url + 'Term/' + this.organizationId + "/" + termId, termDetail, { headers: this.getHeaders() }).map((res: Response) => res.status);
    }

    deleteTerm(termDetail: TermDetail): Observable<number> {
        return this.http.delete(this.endpoint_url + 'Term/' + this.organizationId + "/" + termDetail.id) // ...using put request
            .map((res: Response) => res.status) // ...and calling .json() on the response to return data
            .catch((error: any) => Observable.throw(error.json().error || 'Server error')); //...errors if any
    }
    deleteTermFromSession(termDetail: TermDetail): Observable<number> {
        return this.http.put(this.endpoint_url + 'Session/DeleteTermFromSession/' + this.organizationId + "/" + termDetail.id, { headers: this.getHeaders() })
            .map((res: Response) => res.json());
    }
    // End Term operations

    // Begin Break operations
    getBreak(): Observable<BreakDetail[]> {
        return this.http.get(this.endpoint_url + 'Break/' + this.organizationId)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    getBreakById(breakId: string): Observable<BreakDetail> {
        return this.http.get(this.endpoint_url + 'Break/' + this.organizationId + "/" + breakId)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }
    saveAndGetBreakId(breakDetail: BreakDetail): Observable<BreakDetail> {
        return this.http.post(this.endpoint_url + 'Break/saveAndGetBreakId/', breakDetail, { headers: this.getHeaders() })
            .map((res: Response) => res.json());
    }
    createBreak(breakDetail: BreakDetail): Observable<number> {
        return this.http.post(this.endpoint_url + 'Break', breakDetail, { headers: this.getHeaders() }).map((res: Response) => res.status);
    }
    updateSessionBreakDetail(breakDetail: BreakDetail): Observable<number> {
        return this.http.put(this.endpoint_url + 'Session/UpdateSessionWithBreak/' + this.organizationId, breakDetail, { headers: this.getHeaders() }).map((res: Response) => res.status);
    }
    updateBreak(breakId: string, breakDetail: BreakDetail): Observable<number> {
        return this.http
            .put(this.endpoint_url + 'Break/' + this.organizationId + "/" + breakId, breakDetail, { headers: this.getHeaders() }).map((res: Response) => res.status);
    }

    deleteBreak(breakDetail: BreakDetail): Observable<number> {
        return this.http.delete(this.endpoint_url + 'Break/' + this.organizationId + "/" + breakDetail.id) // ...using put request
            .map((res: Response) => res.status) // ...and calling .json() on the response to return data
            .catch((error: any) => Observable.throw(error.json().error || 'Server error')); //...errors if any
    }
    // end Break operations 

    // Begin Grade operations
    getGrade(): Observable<GradeDetail[]> {
        return this.http.get(this.endpoint_url + 'Grade/' + this.organizationId)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }
    getSection(patronClass: string): Observable<GradeDetail[]> {
        return this.http.get(this.endpoint_url + 'Grade/GetAll/' + this.organizationId + "/" + patronClass)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    getUniqueClasses(): Observable<any[]> {
        //alert("call service");
        return this.http.get(this.endpoint_url + 'Grade/GetClasses/' + this.organizationId)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }
    getGradeById(gradeId: string): Observable<GradeDetail> {
        return this.http.get(this.endpoint_url + 'Grade/' + this.organizationId + "/" + gradeId)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }
    createGrade(selectedGrade: string, selectedSection: string): Observable<number> {
        return this.http.post(this.endpoint_url + 'Grade', { Grade: selectedGrade, Section: selectedSection, createdate: new Date(), organizationid: this.organizationId }, { headers: this.getHeaders() }).map((res: Response) => res.status);
    }
    deleteGrade(gradeDetail: GradeDetail): Observable<number> {
        return this.http.delete(this.endpoint_url + 'Grade/' + this.organizationId + "/" + gradeDetail.id) // ...using put request
            .map((res: Response) => res.status) // ...and calling .json() on the response to return data
            .catch((error: any) => Observable.throw(error.json().error || 'Server error')); //...errors if any
    }
    // End Grade operations

    // Begin Week operations
    getWeek(): Observable<WeekDetail[]> {
        return this.http.get(this.endpoint_url + 'Week/' + this.organizationId)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }
    createWeek(daysOfWeek: string): Observable<number> {
        return this.http.post(this.endpoint_url + 'Week', { dayofweek: daysOfWeek, createDate: new Date(), organizationid: this.organizationId }, { headers: this.getHeaders() }).map((res: Response) => res.status);
    }
    updateWeek(daysOfWeekId: string, daysOfWeek: string, daysCreatedDate: Date): Observable<number> {
        return this.http
            .put(this.endpoint_url + 'Week/' + this.organizationId + "/" + daysOfWeekId, { id: daysOfWeekId, dayofweek: daysOfWeek, lastupdated: new Date(), createdate: daysCreatedDate, organizationid: this.organizationId }, { headers: this.getHeaders() }).map((res: Response) => res.status);
    }
    updateSessionWeekDetail(daysOfWeek: string): Observable<number> {
        return this.http.put(this.endpoint_url + 'Session/UpdateSessionWithWeek/' + this.organizationId+"/"+daysOfWeek, { headers: this.getHeaders() }).map((res: Response) => res.status);
    }
    // End Week operations
    //End Schedule Services
   
    patronContactPersonFileUploads(fileToUpload: any, contactPersonId: string): Observable<number> {
        let input = new FormData();
        input.append("file", fileToUpload);
        return this.http.post(this.endpoint_url + 'Patron/UploadPatronContactPersonImage/' + this.organizationId + "/" + contactPersonId, input)
            .map((res: Response) => res.status)
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }
    updateContactPersonImageName(patronID: string, contactPersonId: string, fileExt: string): Observable<PatronDetail> {
        return this.http.put(this.endpoint_url + 'Patron/UpdatePatronContactPersonImageName/' + this.organizationId + "/" + patronID + "/" + contactPersonId + "/" + fileExt, { headers: this.getHeaders() }).map((res: Response) => res.json());
    }
   
    fileuploads(fileToUpload: any, patronId: string): Observable<number> {
        let input = new FormData();
        input.append("file", fileToUpload);
        return this.http.post(this.endpoint_url + 'Patron/UploadImage/' + this.organizationId + "/" + patronId, input)
            .map((res: Response) => res.status)
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    updatePatronImageName(patronId: string, fileExt: string): Observable<number> {
        return this.http.put(this.endpoint_url + 'Patron/UpdatePatronImageName/' + this.organizationId + "/" + patronId + "/" + fileExt, { headers: this.getHeaders() }).map((res: Response) => res.status);
    }

    saveAndGetId(patronDetail: PatronDetail): Observable<PatronDetail> {
        return this.http.post(this.endpoint_url + 'Patron/GetSavedId/', patronDetail, { headers: this.getHeaders() })
            .map((res: Response) => res.json());
    }
    fileuploadsforPerson(fileToUpload: any, personId: string): Observable<number> {
        let input = new FormData();
        input.append("file", fileToUpload);
        return this.http.post(this.endpoint_url + 'Person/UploadImage/' + this.organizationId + "/" + personId, input)
            .map((res: Response) => res.status)
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }
    saveAndGetIdforPerson(personDetail: PersonViewDetail): Observable<PersonViewDetail> {
        return this.http.post(this.endpoint_url + 'Person/GetSavedId/', personDetail, { headers: this.getHeaders() })
            .map((res: Response) => res.json());
    }

    updatePersonImageName(personId: string, fileExt: string): Observable<number> {
        return this.http
            .put(this.endpoint_url + 'Person/UpdatePersonImageName/' + this.organizationId + "/" + personId + "/" + fileExt, { headers: this.getHeaders() }).map((res: Response) => res.status);
    }   

    personContactPersonFileUploads(fileToUpload: any, contactPersonId: string): Observable<number> {
        let input = new FormData();
        input.append("file", fileToUpload);
        return this.http.post(this.endpoint_url + 'Person/UploadPersonContactPersonImage/' + this.organizationId + "/" + contactPersonId, input)
            .map((res: Response) => res.status)
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }
    updatePersonContactPersonImageName(personID: string, contactPersonId: string, fileExt: string): Observable<PersonViewDetail> {
        return this.http.put(this.endpoint_url + 'Person/UpdatePersonContactPersonImageName/' + this.organizationId + "/" + personID + "/" + contactPersonId + "/" + fileExt, { headers: this.getHeaders() }).map((res: Response) => res.json());
    }
    removeFileuploads(fileName: string): Observable<number> {
        return this.http.put(this.endpoint_url + 'Patron/RemoveImage/' + this.organizationId + "/" + fileName,
            { headers: this.getHeaders() }).map((res: Response) => res.status);
    }

    //Begin of Patron Operations
    getPatron(): Observable<PatronDetail[]> {
        return this.http.get(this.endpoint_url + 'Patron/' + this.organizationId)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    getPatronById(patronId: string): Observable<PatronDetail> {
        return this.http.get(this.endpoint_url + 'Patron/' + this.organizationId + "/" + patronId)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }
    getPatronBirthday(selectedDate: string): Observable<PatronDetail[]> {
        return this.http.get(this.endpoint_url + 'Patron/GetPatronBybirthday' + this.organizationId + "/" + selectedDate)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }
    //getResticatedPatron(): Observable<PatronDetail[]> {
    //    return this.http.get(this.endpoint_url + 'Patron/GetResticatedPatron/' + this.organizationId )
    //        .map((res: Response) => res.json())
    //        .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    //}
    getPersonnById(personId: string): Observable<PersonDetail> {
        return this.http.get(this.endpoint_url + 'Person/' + this.organizationId + "/" + personId)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    createPatron(patronDetail: PatronDetail): Observable<number> {
        return this.http.post(this.endpoint_url + 'Patron', patronDetail, { headers: this.getHeaders() }).map((res: Response) => res.status);
    }
    updatePatron(patronId: string, patronDetail: PatronDetail): Observable<number> {
        return this.http
            .put(this.endpoint_url + 'Patron/' + this.organizationId + "/" + patronId, patronDetail, { headers: this.getHeaders() }).map((res: Response) => res.status);
    }
    deletePatron(patronDetail: PatronDetail): Observable<number> {
        return this.http.delete(this.endpoint_url + 'Patron/' + this.organizationId + "/" + patronDetail.id) // ...using put request
            .map((res: Response) => res.status) // ...and calling .json() on the response to return data
            .catch((error: any) => Observable.throw(error.json().error || 'Server error')); //...errors if any
    }
    deletePatronContactPerson(patronId: string, personDetailId: string): Observable<number> {
        return this.http.put(this.endpoint_url + 'Patron/RemovePerson/' + this.organizationId + "/" + patronId + "/" + personDetailId, "") // ...using put request
            .map((res: Response) => res.status) // ...and calling .json() on the response to return data
            .catch((error: any) => Observable.throw(error.json().error || 'Server error')); //...errors if any
    }
    deletePatronAutheticationType(patronId: string, authId: string): Observable<number> {
        return this.http.put(this.endpoint_url + 'Patron/RemoveAuth/' + this.organizationId + "/" + patronId + "/" + authId, "") // ...using put request
            .map((res: Response) => res.status) // ...and calling .json() on the response to return data
            .catch((error: any) => Observable.throw(error.json().error || 'Server error')); //...errors if any
    }

    createPatronContactPerson(patronId: string, personDetail: PersonDetail): Observable<PatronDetail> {
        return this.http.put(this.endpoint_url + 'Patron/AddPerson/' + this.organizationId + "/" + patronId, personDetail, { headers: this.getHeaders() })
            .map((res: Response) => res.json());
    }
    //End of Patron Operations

    //Begin of Person Operations

    getPerson(): Observable<PersonDetail[]> {
        return this.http.get(this.endpoint_url + 'Person/' + this.organizationId)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }
    createPerson(personDetail: PersonViewDetail): Observable<number> {
        return this.http.post(this.endpoint_url + 'Person', personDetail, { headers: this.getHeaders() }).map((res: Response) => res.status);
    }

    updatePerson(personId: string, personDetail: PersonViewDetail): Observable<number> {
        return this.http
            .put(this.endpoint_url + 'Person/' + this.organizationId + "/" + personId, personDetail, { headers: this.getHeaders() }).map((res: Response) => res.status);
    }
    getPersonById(personId: string): Observable<PersonDetail> {
        return this.http.get(this.endpoint_url + 'Person/' + this.organizationId + "/" + personId)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }
    getPersonViewById(personId: string): Observable<PersonViewDetail> {
        return this.http.get(this.endpoint_url + 'Person/' + this.organizationId + "/" + personId)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }
    deletePersonContactPerson(personId: string, personObjId: string): Observable<number> {
        return this.http.put(this.endpoint_url + 'Person/RemovePerson/' + this.organizationId + "/" + personId + "/" + personObjId, "") // ...using put request
            .map((res: Response) => res.status) // ...and calling .json() on the response to return data
            .catch((error: any) => Observable.throw(error.json().error || 'Server error')); //...errors if any
    }
    deletePersonAutheticationType(personId: string, authId: string): Observable<number> {
        return this.http.put(this.endpoint_url + 'Person/RemoveAuth/' + this.organizationId + "/" + personId + "/" + authId, "") // ...using put request
            .map((res: Response) => res.status) // ...and calling .json() on the response to return data
            .catch((error: any) => Observable.throw(error.json().error || 'Server error')); //...errors if any
    }
    getPersonAuth(personViewId: string): Observable<AuthenticationTypeDetail[]> {
        return this.http.get(this.endpoint_url + 'Person/GetAuthOfPerson' + this.organizationId + "/" + personViewId)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    createPersonContactPerson(personViewId: string, personDetail: PersonDetail): Observable<PersonViewDetail> {
        return this.http.put(this.endpoint_url + 'Person/AddPerson/' + this.organizationId + "/" + personViewId, personDetail, { headers: this.getHeaders() })
            .map((res: Response) => res.json());
    }
    createPersonAuth(personViewId: string, authDetail: AuthenticationTypeDetail): Observable<PersonViewDetail> {
        return this.http
            .put(this.endpoint_url + 'Person/AddAuth/' + this.organizationId + "/" + personViewId, authDetail, { headers: this.getHeaders() }).map((res: Response) => res.json());
    }
    createPatronAuth(patronId: string, authDetail: AuthenticationTypeDetail): Observable<PatronDetail> {
        return this.http.put(this.endpoint_url + 'Patron/AddAuth/' + this.organizationId + "/" + patronId, authDetail
            , { headers: this.getHeaders() })
            .map((res: Response) => res.json());

    }
    editPersonContactPerson(personViewId: string, personId: string): Observable<PersonDetail[]> {
        return this.http.get(this.endpoint_url + 'Person/EditPerson/' + this.organizationId + "/" + personViewId + "/" + personId)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }
    editPatronContactPerson(patronId: string, personId: string): Observable<PersonDetail[]> {
        return this.http.get(this.endpoint_url + 'Patron/EditPerson/' + this.organizationId + "/" + patronId + "/" + personId)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }
    deletePerson(personDetail: PersonDetail): Observable<number> {
        return this.http.delete(this.endpoint_url + 'Person/' + this.organizationId + "/" + personDetail.id) // ...using put request
            .map((res: Response) => res.status) // ...and calling .json() on the response to return data
            .catch((error: any) => Observable.throw(error.json().error || 'Server error')); //...errors if any
    }

    // Begin Tracking Operations
    getPatronTracking(): Observable<PatronTracking[]> {
        return this.http.get(this.endpoint_url + 'Patron/Tracking/' + this.organizationId)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }


    markPresent(patronTracking: PatronTracking): Observable<number> {
        return this.http
            .post(this.endpoint_url + 'Patron/Tracking', patronTracking, { headers: this.getHeaders() }).map((res: Response) => res.status);
    }
    markPresent1(personTracking: PersonTracking): Observable<number> {
        return this.http
            .post(this.endpoint_url + 'Person/Tracking', personTracking, { headers: this.getHeaders() }).map((res: Response) => res.status);
    }
    removeOnLeavePatron(patronId: string, selectedDate: string): Observable<number> {
        return this.http.delete(this.endpoint_url + 'Patron/Leave' + this.organizationId + "/" + patronId) // ...using put request
            .map((res: Response) => res.status) // ...and calling .json() on the response to return data
            .catch((error: any) => Observable.throw(error.json().error || 'Server error')); //...errors if any
    }
    removePresentPatron(patronId: string): Observable<number> {
        return this.http.delete(this.endpoint_url + 'Patron/Tracking/' + this.organizationId + "/" + patronId) // ...using put request
            .map((res: Response) => res.status) // ...and calling .json() on the response to return data
            .catch((error: any) => Observable.throw(error.json().error || 'Server error')); //...errors if any
    }
    removePresentPerson(personId: string): Observable<number> {
        return this.http.delete(this.endpoint_url + 'Person/Tracking/' + this.organizationId + "/" + personId) // ...using put request
            .map((res: Response) => res.status) // ...and calling .json() on the response to return data
            .catch((error: any) => Observable.throw(error.json().error || 'Server error')); //...errors if any
    }

    // End Tracking Operations

    // Begin Event Operations
    getEvent(): Observable<EventDetail[]> {
        return this.http.get(this.endpoint_url + 'Event/' + this.organizationId)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }
    getCurrentEvent(): Observable<EventDetail> {
        return this.http.get(this.endpoint_url + 'Event/GetCurrentEvent/' + this.organizationId)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }
    //getEventbBycurrentDate(date:string): Observable<EventDetail[]> {
    //    return this.http.get(this.endpoint_url + 'Event/GetCurrentEventByDate/' + this.organizationId + "/" + date)
    //        .map((res: Response) => res.json())
    //        .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    //}

    getEventById(eventId: string): Observable<EventDetail> {
        return this.http.get(this.endpoint_url + 'Event/' + this.organizationId + "/" + eventId)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }
    addPatronToEvent(eventId: string, patronId: string): Observable<number> {
        return this.http
            .put(this.endpoint_url + 'Event/AddPatron/' + this.organizationId + "/" + eventId + "/" + patronId, { headers: this.getHeaders() }).map((res: Response) => res.status);
    }
    RemovePatronToEvent(eventId: string, patronId: string): Observable<number> {
        return this.http
            .put(this.endpoint_url + 'Event/RemovePatron/' + this.organizationId + "/" + eventId + "/" + patronId, { headers: this.getHeaders() }).map((res: Response) => res.status);
    }
    DeclinePatronToEvent(eventId: string, declineRequest: DeclineRequest): Observable<number> {
        return this.http
            .put(this.endpoint_url + 'Event/DeclinePatron/' + this.organizationId + "/" + eventId, declineRequest, { headers: this.getHeaders() }).map((res: Response) => res.status);
    }
    createEvent(eventDetail: EventDetail): Observable<number> {
        return this.http.post(this.endpoint_url + 'Event', eventDetail, { headers: this.getHeaders() }).map((res: Response) => res.status);
    }
    updateEvent(eventId: string, eventDetail: EventDetail): Observable<number> {
        return this.http
            .put(this.endpoint_url + 'Event/' + this.organizationId + "/" + eventId, eventDetail, { headers: this.getHeaders() }).map((res: Response) => res.status);
    }
    deleteEvent(eventId: string): Observable<number> {
        return this.http.delete(this.endpoint_url + 'Event/' + this.organizationId + "/" + eventId) // ...using put request
            .map((res: Response) => res.status) // ...and calling .json() on the response to return data
            .catch((error: any) => Observable.throw(error.json().error || 'Server error')); //...errors if any
    }



    // End Event Operations

    // Begin Authetication Operations

    getAuth(): Observable<AuthenticationTypeDetail[]> {
        return this.http.get(this.endpoint_url + 'Event/' + this.organizationId)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }
    getAuthById(eventId: string): Observable<AuthenticationTypeDetail> {
        return this.http.get(this.endpoint_url + 'Event/' + this.organizationId + "/" + eventId)
            .map((res: Response) => res.json())
            .catch((error
                : any) => Observable.throw(error.json().error || 'Server error'));
    }

    deleteAuth(eventId: string): Observable<number> {
        return this.http.delete(this.endpoint_url + 'Event/' + this.organizationId + "/" + eventId) // ...using put request
            .map((res: Response) => res.status) // ...and calling .json() on the response to return data
            .catch((error: any) => Observable.throw(error.json().error || 'Server error')); //...errors if any
    }
    editPersonAuth(personViewId: string, authId: string): Observable<AuthenticationTypeDetail[]> {
        return this.http.get(this.endpoint_url + 'Person/EditAuth/' + this.organizationId + "/" + personViewId + "/" + authId)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }
    editPatronAuth(patronId: string, authId: string): Observable<AuthenticationTypeDetail[]> {
        return this.http.get(this.endpoint_url + 'Patron/EditAuth/' + this.organizationId + "/" + patronId + "/" + authId)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    // End Authetication Operations

    // Start Chart Operations for patron

    onLeavePatronDetail(patronId: string, selectedDate: string): Observable<PatronLeaveDetail> {
        return this.http.get(this.endpoint_url + 'Patron/Leave/OnLeave/' + this.organizationId + "/" + selectedDate + "/" + patronId)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    getPatronOnLeave(selectedDate: any): Observable<PatronLeaveDetail[]> {
        return this.http.get(this.endpoint_url + 'Patron/Leave/OnLeave/' + this.organizationId + "/" + selectedDate)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }


    getPatronOnLeaveByClass(patronClass: string, section: string, selectedDate: any): Observable<PatronLeaveDetail[]> {
        return this.http.get(this.endpoint_url + 'Patron/Leave/OnLeave/' + this.organizationId + "/" + patronClass + "/" + section + "/" + selectedDate)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }
    getPresentPatron(selectedDate: any): Observable<PatronTracking[]> {
        return this.http.get(this.endpoint_url + 'Patron/Tracking/GetAll/' + this.organizationId + "/" + selectedDate)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }
    /* getEventTracking(selectedDate: any): Observable<EventTracking[]> {
         return this.http.get(this.endpoint_url + 'EventTracking/GetAll/' + this.organizationId + "/" + selectedDate)
             .map((res: Response) => res.json())
             .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
     }
     getEventTrackingByEvent(selectedEvent: string, selectedDate: any): Observable<EventTracking[]> {
         return this.http.get(this.endpoint_url + 'EventTracking/GetAll/' + this.organizationId + "/" + selectedEvent + "/" + selectedDate)
             .map((res: Response) => res.json())
             .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
     }*/
    getEventTracking(): Observable<EventTracking[]> {
        return this.http.get(this.endpoint_url + 'EventTracking/GetAll/' + this.organizationId)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }
    getEventTrackingByEvent(selectedEvent: string): Observable<EventTracking[]> {
        return this.http.get(this.endpoint_url + 'EventTracking/GetAll/' + this.organizationId + "/" + selectedEvent)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }



    getClassPatron(patronClass: string, section: string, selectedDate: any): Observable<PatronDetail[]> {
        return this.http.get(this.endpoint_url + 'Patron/GetAll/' + this.organizationId + "/" + patronClass + "/" + section + "/" + selectedDate)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }
    isStudentExistInClass(patronClass: string, section: string): Observable<PatronDetail[]> {
        return this.http.get(this.endpoint_url + 'Patron/IsStudentExistInClass/' + this.organizationId + "/" + patronClass + "/" + section)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }
    getClassByPatrons(patronClass: string): Observable<PatronDetail[]> {
        return this.http.get(this.endpoint_url + 'Patron/ClassPatron/' + this.organizationId + "/" + patronClass)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }
    getPresentPatronByClass(patronClass: string, section: string, selectedDate: any): Observable<PatronTracking[]> {
        return this.http.get(this.endpoint_url + 'Patron/Tracking/GetAll/' + this.organizationId + "/" + patronClass + "/" + section + "/" + selectedDate)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    getPatronTrackingSummary(selectedDate: any): Observable<PatronTrackingSummary> {
        return this.http.get(this.endpoint_url + 'Patron/Tracking/Summary/' + this.organizationId + "/" + selectedDate)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }
    getPatronTrackingForDate(patronId: string, selectedDate: any): Observable<PatronTracking> {
        return this.http.get(this.endpoint_url + 'Patron/Tracking/GetPatron/' + this.organizationId + "/" + patronId + "/" + selectedDate)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }


    getPatronTrackingSummaryByClass(patronClass: string, section: string, selectedDate: any): Observable<PatronTrackingSummary> {
        return this.http.get(this.endpoint_url + 'Patron/Tracking/Summary/' + this.organizationId + "/" + patronClass + "/" + section + "/" + selectedDate)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    // Start Chart Operations for person


    getPresentPerson(selectedDate: any): Observable<PersonTracking[]> {
        return this.http.get(this.endpoint_url + 'Person/Tracking/GetAll/' + this.organizationId + "/" + selectedDate)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    getPersonOnLeave(selectedDate: any): Observable<PersonLeaveDetail[]> {
        return this.http.get(this.endpoint_url + 'Person/Leave/OnLeave/' + this.organizationId + "/" + selectedDate)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }


    getPersonTrackingSummary(selectedDate: any): Observable<PersonTrackingSummary> {
        return this.http.get(this.endpoint_url + 'Person/Tracking/Summary/' + this.organizationId + "/" + selectedDate)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    // End Chart Operations

    // Begin Map Operations
    getTransportRouteBydate(routeId: string, currentDate: string): Observable<TransportRouteRun[]> {
        return this.http.get(this.endpoint_url + 'RouteRun/Tracking/GetRunDirection/' + this.organizationId + "/" + routeId + "/" + currentDate)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    getTranportRoute(): Observable<TransportRouteDetail[]> {
        return this.http.get(this.endpoint_url + 'TransportRoute/' + this.organizationId)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }
    getTranportRouteWithDetails(): Observable<TransportRouteDetails[]> {
        return this.http.get(this.endpoint_url + 'TransportRoute/' + this.organizationId)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }
    getTransportRouteById(routeId: string): Observable<TransportRouteDetail> {
        return this.http.get(this.endpoint_url + 'TransportRoute/' + this.organizationId + "/" + routeId)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }
    createTransportRoute(transportRouteDetail: TransportRouteDetail): Observable<number> {
        return this.http.post(this.endpoint_url + 'TransportRoute', transportRouteDetail, { headers: this.getHeaders() }).map((res: Response) => res.status);
    }
    updatetransportroute(transportid: string, transportroutedetail: TransportRouteDetail): Observable<number> {
        return this.http.put(this.endpoint_url + 'transportroute/' + this.organizationId + "/" + transportid, transportroutedetail, { headers: this.getHeaders() }).map((res: Response) => res.status);
    }
    editPatronContactPerson1(patronId: string, personId: string): Observable<any[]> {
        return this.http.get(this.endpoint_url + 'Patron/EditPerson/' + this.organizationId + "/" + patronId + "/" + personId,
            { headers: this.getHeaders() }
        )
            .map((res: Response) => res.json())

    }
    deleteTransportRoute(transportId: string): Observable<number> {
        return this.http.delete(this.endpoint_url + 'TransportRoute/' + this.organizationId + "/" + transportId) // ...using put request
            .map((res: Response) => res.status) // ...and calling .json() on the response to return data
            .catch((error: any) => Observable.throw(error.json().error || 'Server error')); //...errors if any
    }
    getTransportStoppageById(stoppageId: string): Observable<TransportStoppageDetail> {
        return this.http.get(this.endpoint_url + 'TransportStoppage/' + this.organizationId + "/" + stoppageId)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }
    createTransportStoppage(routeId: string, transportStoppageDetail: TransportStoppageDetail): Observable<TransportRouteDetail> {
        return this.http.put(this.endpoint_url + 'Route/Stoppage/' + this.organizationId + "/" + routeId, transportStoppageDetail, { headers: this.getHeaders() })
            .map((res: Response) => res.json());
    }
    editTransportStoppage(routeId: string, stoppageId: string): Observable<any[]> {
        return this.http.get(this.endpoint_url + 'Route/EditStoppage/' + this.organizationId + "/" + routeId + "/" + stoppageId, { headers: this.getHeaders() })
            .map((res: Response) => res.json());
    }
    moveUpSequence(routeId: string, stoppageId: string, sequenceNo: number): Observable<TransportStoppageDetail[]> {
        return this.http.get(this.endpoint_url + 'Route/MoveUp/' + this.organizationId + "/" + routeId + "/" + stoppageId + "/" + sequenceNo, { headers: this.getHeaders() })
            .map((res: Response) => res.json());

    }
    moveDownSequence(routeId: string, stoppageId: string, sequenceNo: number): Observable<TransportStoppageDetail[]> {
        return this.http.get(this.endpoint_url + 'Route/MoveDown/' + this.organizationId + "/" + routeId + "/" + stoppageId + "/" + sequenceNo, { headers: this.getHeaders() })
            .map((res: Response) => res.json());

    }
    deleteTransportStoppage(transportRouteId: string, stoppageId: string): Observable<number> {
        return this.http.put(this.endpoint_url + 'Route/RemoveStoppage/' + this.organizationId + "/" + transportRouteId + "/" + stoppageId, "") // ...using put request
            .map((res: Response) => res.status) // ...and calling .json() on the response to return data
            .catch((error: any) => Observable.throw(error.json().error || 'Server error')); //...errors if any
    }
    getAllLocation(currentDate: string): Observable<RouteMonitoring[]> {
        return this.http.get(this.endpoint_url + 'RouteMonitoring/GetLocations/' + this.organizationId + "/" + currentDate)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    getRouteLocation(routeId: string, currentDate: string): Observable<RouteMonitoring> {
        return this.http.get(this.endpoint_url + 'RouteMonitoring/GetLocation/' + this.organizationId + "/" + routeId + "/" + currentDate)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }
    getRoutePatrons(routeId: string): Observable<RemovePatron[]> {
        return this.http.get(this.endpoint_url + 'Route/Patrons/' + this.organizationId + "/" + routeId)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }
    addPatronToStoppage(routeId: string, stoppageId: string, patronId: string): Observable<number> {
        return this.http
            .put(this.endpoint_url + 'Route/Stoppage/AddPatron/' + this.organizationId + "/" + routeId + "/" + stoppageId + "/" + patronId, { headers: this.getHeaders() }).map((res: Response) => res.status);
    }

    RemovePatronToStoppage(routeId: string, stoppageId: string, patronId: string): Observable<number> {
        return this.http
            .put(this.endpoint_url + 'Route/Stoppage/RemovePatron/' + this.organizationId + "/" + routeId + "/" + stoppageId + "/" + patronId, { headers: this.getHeaders() }).map((res: Response) => res.status);
    }

    getAllRouteInfo(currentDate: string): Observable<any[]> {
        return this.http.get(this.endpoint_url + 'Route/Tracking/Summary' + this.organizationId + "/" + currentDate)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    getRouteStoppages(routeId: string): Observable<TransportStoppageDetail[]> {
        return this.http.get(this.endpoint_url + 'Route/Stoppages/' + this.organizationId + "/" + routeId)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    getStoppagePatrons(stoppageId: string): Observable<StoppagePatron[]> {
        return this.http.get(this.endpoint_url + 'Route/Stoppage/Patrons/' + this.organizationId + "/" + stoppageId)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    getCount(routeNumber: string, currentDate: string): Observable<Stopcount> {
        return this.http.get(this.endpoint_url + 'Route/Tracking/Summary/' + this.organizationId + "/" + routeNumber + "/" + currentDate)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    getAllRouteSummary(currentDate: string): Observable<AllRouteSummary> {
        return this.http.get(this.endpoint_url + 'Route/Tracking/Summary/' + this.organizationId + "/" + currentDate)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    getPersonTracking(routeNumber: string, currentDate: string): Observable<string[]> {
        return this.http.get(this.endpoint_url + 'Route/Tracking/PersonSummary/' + this.organizationId + "/" + routeNumber + "/" + currentDate)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }
    // End Map Operations

    //getTotalStudent() {
    //    this.http.get('/api/patron').subscribe(result => {
    //        this.patronList = result.json();
    //    });
    //    return this.patronList;
    //}

    getAllRoutes() {
        var transportRoueDetail: TransportRouteDetail[];
        this.http.get(this.endpoint_url + 'TransportRoute').subscribe(result => {
            transportRoueDetail = result.json();
        });
        //return transportRoueDetail
    }

    getActiveDevice(): Observable<SetupDevice[]> {
        return this.http.get(this.endpoint_url + 'SetupDevice/GetAll/' + this.organizationId)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }
    createTransportOutgoingMessage(outgoingMessage: TransportMessage): Observable<number> {
        return this.http.post(this.endpoint_url + 'TransportMessage/CreateMessage', outgoingMessage, { headers: this.getHeaders() })
            .map((res: Response) => res.status);
    }
    getOutgoingTransportMessage(): Observable<TransportMessage[]> {
        return this.http.get(this.endpoint_url + 'TransportMessage/GetAllMessage/' + this.organizationId)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    getMessage(): Observable<InhouseMessage[]> {
        return this.http.get(this.endpoint_url + 'MessageCenter/' + this.organizationId)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }
    getOutgoingMessage(): Observable<OutgoingMessage[]> {
        return this.http.get(this.endpoint_url + 'OutgoingMessage/GetAllMessage/' + this.organizationId)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }
    deleteOutgoingMessages(messageId: string): Observable<number> {
        return this.http.delete(this.endpoint_url + 'OutgoingMessage/' + this.organizationId + "/" + messageId) // ...using put request
            .map((res: Response) => res.status) // ...and calling .json() on the response to return data
            .catch((error: any) => Observable.throw(error.json().error || 'Server error')); //...errors if any
    }
    deleteIncomingMessages(messageId: string): Observable<number> {
        return this.http.delete(this.endpoint_url + 'IncomingMessage/' + this.organizationId + "/" + messageId) // ...using put request
            .map((res: Response) => res.status) // ...and calling .json() on the response to return data
            .catch((error: any) => Observable.throw(error.json().error || 'Server error')); //...errors if any
    }
    getSavedMessage(): Observable<OutgoingMessage[]> {
        return this.http.get(this.endpoint_url + 'OutgoingMessage/SavedMessages/' + this.organizationId)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }
    getIncomingMessage(): Observable<IncomingMessage[]> {
        return this.http.get(this.endpoint_url + 'IncomingMessage/' + this.organizationId)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }


    getMessageById(messageId: string): Observable<InhouseMessage> {
        return this.http.get(this.endpoint_url + 'MessageCenter/' + this.organizationId + "/" + messageId)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    createMessage(messageCenter: InhouseMessage): Observable<number> {

        return this.http.post(this.endpoint_url + 'MessageCenter/CreateMessage', messageCenter, { headers: this.getHeaders() })
            .map((res: Response) => res.status);
    }

    createOutgoingMessage(outgoingMessage: OutgoingMessage): Observable<number> {
        return this.http.post(this.endpoint_url + 'OutgoingMessage/CreateMessage', outgoingMessage, { headers: this.getHeaders() })
            .map((res: Response) => res.status);
    }

    updateMessage(messageid: string, messageCenter: InhouseMessage): Observable<number> {
        return this.http.put(this.endpoint_url + 'MessageCenter/' + this.organizationId + "/" + messageid, messageCenter, { headers: this.getHeaders() }).map((res: Response) => res.status);
    }

    deleteMessage(messageid: string): Observable<number> {
        return this.http.delete(this.endpoint_url + 'MessageCenter/' + this.organizationId + "/" + messageid) // ...using put request
            .map((res: Response) => res.status) // ...and calling .json() on the response to return data
            .catch((error: any) => Observable.throw(error.json().error || 'Server error')); //...errors if any
    }

    updatePatronTransport(routeId: string, stoppageId: string, patronId: string): Observable<number> {
        return this.http.put(this.endpoint_url + 'Patron/UpdateTransport/' + this.organizationId + "/" + routeId + "/" + stoppageId + "/" + patronId, { headers: this.getHeaders() }).map((res: Response) => res.status);
    }
    removePatronTransport(patronId: string): Observable<number> {
        return this.http.put(this.endpoint_url + 'Patron/RemoveTransport/' + this.organizationId + "/" + patronId, { headers: this.getHeaders() }).map((res: Response) => res.status);
    }



    getTransportWalkingRequest(startDate: string, endDate: string): Observable<TransportWalkingDetail[]> {
        //alert("startDate " + startDate);
        //alert("endDate " + endDate);
        return this.http.get(this.endpoint_url + 'TransportWalker/GetAllWalker/' + this.organizationId + "/" + startDate + "/" + endDate)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }
    getTransportWalkingRequestByDate(selectedDate: string): Observable<TransportWalkingDetail[]> {
        return this.http.get(this.endpoint_url + 'TransportWalker/GetWalkerBydate/' + this.organizationId + "/" + selectedDate)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }


    createTransportWalkingRequest(transportWalkingRequest: TransportWalkingRequest): Observable<number> {
        return this.http.post(this.endpoint_url + 'TransportWalker', transportWalkingRequest, { headers: this.getHeaders() })
            .map((res: Response) => res.status);
    }
    deleteWalker(walkerId: string): Observable<number> {
        return this.http.delete(this.endpoint_url + 'TransportWalker/' + this.organizationId + "/" + walkerId) // ...using put request
            .map((res: Response) => res.status) // ...and calling .json() on the response to return data
            .catch((error: any) => Observable.throw(error.json().error || 'Server error')); //...errors if any
    }
    updateAcknowledge(id: string, isAck: boolean): Observable<number> {
        return this.http.put(this.endpoint_url + 'TransportWalker/acknowledge/' + this.organizationId + "/" + id + "/" + isAck, { headers: this.getHeaders() }).map((res: Response) => res.status);
    }

    getAllClassDevice(patronClass: string): Observable<SetupDevice[]> {
        return this.http.get(this.endpoint_url + 'SetupDevice/ClassDevice/' + this.organizationId + "/" + patronClass)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }
    getSectionDevice(patronClass: string, section: string): Observable<SetupDevice[]> {
        return this.http.get(this.endpoint_url + 'SetupDevice/SectionDevice/' + this.organizationId + "/" + patronClass + "/" + section)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }
    getTransportDevice(): Observable<SetupDevice[]> {
        return this.http.get(this.endpoint_url + 'SetupDevice/TransportDevice/' + this.organizationId)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }
    getAttendanceDevice(): Observable<SetupDevice[]> {
        return this.http.get(this.endpoint_url + 'SetupDevice/AttendanceDevice/' + this.organizationId)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }
    sendToCloud(deviceId: string, message: InhouseMessage): Observable<number> {
        return this.http.post(this.endpoint_url + 'SendToCloud/' + deviceId, message, { headers: this.getHeaders() }).map((res: Response) => res.status);

    }
    getoutgoingMessageById(messageId: string): Observable<OutgoingMessage> {
        return this.http.get(this.endpoint_url + 'OutgoingMessage/' + this.organizationId + "/" + messageId)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    getoutgoingMessageById1(messageId: string, id: string): Observable<OutgoingMessage> {
        return this.http.get(this.endpoint_url + 'OutgoingMessage/GetMessage' + this.organizationId + "/" + messageId + "/" + id)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }






    getTransportRouteRun(currentDate: string): Observable<TransportRouteRun[]> {
        return this.http.get(this.endpoint_url + 'RouteRun/Tracking/GetTransportRunDirection/' + this.organizationId + "/" + currentDate)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }
    getPicupRun(currentDate: string): Observable<TransportRouteRun[]> {
        return this.http.get(this.endpoint_url + 'RouteRun/Tracking/GetPickupRouteRun/' + this.organizationId + "/" + currentDate)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    getIP() {
        return this._Jsonp.get('//api.ipify.org/?format=jsonp&callback=JSONP_CALLBACK')
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    //getTransportStoppagesummary(transportRouteRunID: string, currentDate: string): Observable<TransportStoppageTracking[]> {

    //    return this.http.get(this.endpoint_url + 'Stoppage/Tracking/GetTransportStoppage/' + this.organizationId + "/" + transportRouteRunID + "/" + currentDate)
    //        .map((res: Response) => res.json())
    //        .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    //}
    getTransportPatron(): Observable<PatronDetail[]> {
        return this.http.get(this.endpoint_url + 'Patron/GetTransportPatron/' + this.organizationId)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }
    //static dateValidator(control) {
    //    // RFC 2822 compliant regex
    //    if (this.sessionDetail.startDate > this.sessionDetail.endDate) {
    //        return null;
    //    } else {
    //        return { 'invalidEmailAddress': true };
    //    }
    //}
    GetCurrentRouteRun(currentDate: string): Observable<TransportRouteRun[]> {
        return this.http.get(this.endpoint_url + 'RouteRun/Tracking/GetCurrentRouteRun/' + this.organizationId + "/" + currentDate)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    addCoordinates(routeRunMonitoring: TransportRouteRunMonitoring): Observable<number> {
        return this.http.post(this.endpoint_url + 'RouteMonitoring', routeRunMonitoring, { headers: this.getHeaders() })
            .map((res: Response) => res.status);
    }
    //getTransportStoppagesummary(transportRouteRunID: string, currentDate: string): Observable<TransportStoppageTracking[]> {

    //    return this.http.get(this.endpoint_url + 'Stoppage/Tracking/GetTransportStoppage/' + this.organizationId + "/" + transportRouteRunID + "/" + currentDate)
    //        .map((res: Response) => res.json())
    //        .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    //}
    //adminLogin(adminCredential: AdminCredential): Observable<boolean> {
    //    return this.http.post(this.endpoint_url + 'AdminCredential/AuthenticateUser', adminCredential, { headers: this.getHeaders() })
    //        .map((res: Response) => res.json());
    //}

}

export class Country {   //create class for country for use another moduel
    constructor(public id: number,
        public name: string) { }
}
export class State {  
    constructor(public id: number,
                public name: string) { }
}
export class Sequence {     //create Sequence for State for use another moduel
    constructor(public id: number,
        public name: number) { }
}

// Services Not in used

// Login Services
    

    //getAdminData(userId: string, password: string): Observable<AdminCredential> {
    //    return this.http.get(this.endpoint_url + 'AdminCredential/GetAdminData/' + this.organizationId + "/" + userId + "/" + password)
    //        .map((res: Response) => res.json())
    //        .catch((error: any) => Observable.throw(error.json().error || 'server error'));
    //}

    //createLoginDetail(loginDetail: LoginDetail): Observable<number> {
    //    return this.http.post(this.endpoint_url + 'LoginDetail', loginDetail, { headers: this.getHeaders() })
    //        .map((res: Response) => res.status);
    //}

    //getLoginDetail(userId: string): Observable<LoginDetail> {
    //    return this.http.get(this.endpoint_url + 'LoginDetail/LastLogin/' + this.organizationId + "/" + userId)
    //        .map((res: Response) => res.json())
    //        .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    //}


    ////End Login Services