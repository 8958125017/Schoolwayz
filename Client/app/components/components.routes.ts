import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { OrganizationComponent } from './organization/organization.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { PatronListComponent } from './patronlist/patronlist.component';
import { PersonListComponent } from './personlist/personlist.component';
import { TransportRouteListComponent } from './transportroutelist/transportroutelist.component';
import { ChartComponent } from './chart/chart.component';
import { PersonChartComponent } from './personchart/personchart.component';
import { EventTrackingComponent } from './eventtracking/eventtracking.component';
import { EventListComponent } from './eventlist/eventlist.component';
import { TransportWalkerComponent } from './transportwalker/transportwalker.component';
import { MapViewComponent } from './mapview/mapview.component';
import { InhouseMessageComponent } from './inhousemessage/inhousemessage.component';
import { IncomingMessageComponent } from './incomingmessage/incomingmessage.component';
import { OutgoingMessageComponent } from './outgoingmessage/outgoingmessage.component';
import { DraftMessageComponent } from './draftmessage/draftmessage.component';
import { TransportMessageComponent } from './transportmessage/transportmessage.component';
import { ChangePasswordComponent } from './changepassword/changepassword.component';

const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'organization', component: OrganizationComponent },
    { path: 'schedule', component: ScheduleComponent },
    { path: 'patronlist', component: PatronListComponent },
    { path: 'personlist', component: PersonListComponent },
    { path: 'transportroutelist', component: TransportRouteListComponent },
    { path: 'chart', component: ChartComponent },
    { path: 'personchart', component: PersonChartComponent },
    { path: 'eventtracking', component: EventTrackingComponent },
    { path: 'mapview', component: MapViewComponent },
    { path: 'eventlist', component: EventListComponent },
    { path: 'inhousemessage', component: InhouseMessageComponent },
    { path: 'transportwalker', component: TransportWalkerComponent },
    { path: 'incomingmessage', component: IncomingMessageComponent },
    { path: 'outgoingmessage', component: OutgoingMessageComponent },
    { path: 'draftmessage', component: DraftMessageComponent },
    { path: 'transportmessage', component: TransportMessageComponent },
    { path: 'changepassword', component: ChangePasswordComponent },

];

export const routing = RouterModule.forChild(routes);