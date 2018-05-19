import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { HttpModule, JsonpModule } from '@angular/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AgmCoreModule } from 'angular2-google-maps/core';
// Components
import { AppMenuComponent, AppSubMenu } from '../menu.component';
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
import { routing } from './components.routes';


// Primeng
import { AccordionModule } from 'primeng/primeng';
import { AutoCompleteModule } from 'primeng/primeng';
import { BreadcrumbModule } from 'primeng/primeng';
import { ButtonModule } from 'primeng/primeng';
import { CalendarModule } from 'primeng/primeng';
import { CarouselModule } from 'primeng/primeng';
import { ChartModule } from 'primeng/primeng';
import { CheckboxModule } from 'primeng/primeng';
import { ChipsModule } from 'primeng/primeng';
import { CodeHighlighterModule } from 'primeng/primeng';
import { ConfirmDialogModule } from 'primeng/primeng';
import { SharedModule } from 'primeng/primeng';
import { ContextMenuModule } from 'primeng/primeng';
import { DataGridModule } from 'primeng/primeng';
import { DataListModule } from 'primeng/primeng';
import { DataScrollerModule } from 'primeng/primeng';
import { DataTableModule } from 'primeng/primeng';
import { DialogModule } from 'primeng/primeng';
import { DragDropModule } from 'primeng/primeng';
import { DropdownModule } from 'primeng/primeng';
import { EditorModule } from 'primeng/primeng';
import { FieldsetModule } from 'primeng/primeng';
import { FileUploadModule } from 'primeng/primeng';
import { GalleriaModule } from 'primeng/primeng';
import { GMapModule } from 'primeng/primeng';
import { GrowlModule } from 'primeng/primeng';
import { InputMaskModule } from 'primeng/primeng';
import { InputSwitchModule } from 'primeng/primeng';
import { InputTextModule } from 'primeng/primeng';
import { InputTextareaModule } from 'primeng/primeng';
import { LightboxModule } from 'primeng/primeng';
import { ListboxModule } from 'primeng/primeng';
import { MegaMenuModule } from 'primeng/primeng';
import { MenuModule } from 'primeng/primeng';
import { MenubarModule } from 'primeng/primeng';
import { MessagesModule } from 'primeng/primeng';
import { MultiSelectModule } from 'primeng/primeng';
import { OrderListModule } from 'primeng/primeng';
import { OverlayPanelModule } from 'primeng/primeng';
import { PaginatorModule } from 'primeng/primeng';
import { PanelModule } from 'primeng/primeng';
import { PanelMenuModule } from 'primeng/primeng';
import { PasswordModule } from 'primeng/primeng';
import { PickListModule } from 'primeng/primeng';
import { ProgressBarModule } from 'primeng/primeng';
import { RadioButtonModule } from 'primeng/primeng';
import { RatingModule } from 'primeng/primeng';
import { ScheduleModule } from 'primeng/primeng';
import { SelectButtonModule } from 'primeng/primeng';
import { SlideMenuModule } from 'primeng/primeng';
import { SliderModule } from 'primeng/primeng';
import { SpinnerModule } from 'primeng/primeng';
import { SplitButtonModule } from 'primeng/primeng';
import { StepsModule } from 'primeng/primeng';
import { TabMenuModule } from 'primeng/primeng';
import { TabViewModule } from 'primeng/primeng';
import { TerminalModule } from 'primeng/primeng';
import { TieredMenuModule } from 'primeng/primeng';
import { ToggleButtonModule } from 'primeng/primeng';
import { ToolbarModule } from 'primeng/primeng';
import { TooltipModule } from 'primeng/primeng';
import { TreeModule } from 'primeng/primeng';
import { TreeTableModule } from 'primeng/primeng';
@NgModule({
    imports: [
        routing,
        BrowserModule,
        FormsModule,
        HttpModule,
        AccordionModule,
        AutoCompleteModule,
        BreadcrumbModule,
        ButtonModule,
        CalendarModule,
        CarouselModule,
        ChartModule,
        CheckboxModule,
        ChipsModule,
        CodeHighlighterModule,
        ConfirmDialogModule,
        SharedModule,
        ContextMenuModule,
        DataGridModule,
        DataListModule,
        DataScrollerModule,
        DataTableModule,
        DialogModule,
        DragDropModule,
        DropdownModule,
        EditorModule,
        FieldsetModule,
        FileUploadModule,
        GalleriaModule,
        GMapModule,
        GrowlModule,
        InputMaskModule,
        InputSwitchModule,
        InputTextModule,
        InputTextareaModule,
        LightboxModule,
        ListboxModule,
        MegaMenuModule,
        MenuModule,
        MenubarModule,
        MessagesModule,
        MultiSelectModule,
        OrderListModule,
        OverlayPanelModule,
        PaginatorModule,
        PanelModule,
        PanelMenuModule,
        PasswordModule,
        PickListModule,
        ProgressBarModule,
        RadioButtonModule,
        RatingModule,
        ScheduleModule,
        SelectButtonModule,
        SlideMenuModule,
        SliderModule,
        SpinnerModule,
        SplitButtonModule,
        StepsModule,
        TabMenuModule,
        TabViewModule,
        TerminalModule,
        TieredMenuModule,
        ToggleButtonModule,
        ToolbarModule,
        TooltipModule,
        TreeModule,
        TreeTableModule,
        BrowserAnimationsModule,

        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        TranslateModule,
        NgbModule.forRoot(),
        // No need to export as these modules don't expose any components/directive etc'
        HttpModule,
        JsonpModule,
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyBetolnRRNMhjKsw66g_RdYC5NS7p_51Q4'
        })
    ],
    declarations: [
        //DynamicFormComponent,
        //DynamicFormControlComponent,
        //ErrorMessageComponent,
        //ErrorSummaryComponent,
        //FooterComponent,
        //HeaderComponent,
        //PageHeadingComponent,
        //UppercasePipe,
        //LoginComponent,
        HomeComponent,
        PatronListComponent,
        OrganizationComponent,
        ScheduleComponent,
        PersonListComponent,
        TransportRouteListComponent,
        ChartComponent,
        PersonChartComponent,
        EventTrackingComponent,
        EventListComponent,
        TransportWalkerComponent,
        MapViewComponent,
        InhouseMessageComponent,
        IncomingMessageComponent,
        OutgoingMessageComponent,
        DraftMessageComponent,
        TransportMessageComponent,
        ChangePasswordComponent,
        AppMenuComponent,
        AppSubMenu
    ],
    exports: [
        // Modules
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        NgbModule,
        TranslateModule,
        // Providers, Components, directive, pipes
        //DynamicFormComponent,
        //DynamicFormControlComponent,
        //ErrorSummaryComponent,
        //ErrorMessageComponent,
        //FooterComponent,
        //HeaderComponent,
        //PageHeadingComponent,
        //UppercasePipe,
        //LoginComponent,
        AppMenuComponent,
        AppSubMenu,
        OrganizationComponent,
        ScheduleComponent,
        PatronListComponent,
        PersonListComponent,
        TransportRouteListComponent,
        ChartComponent,
        PersonChartComponent,
        EventTrackingComponent,
        EventListComponent,
        TransportWalkerComponent,
        MapViewComponent,
        InhouseMessageComponent,
        IncomingMessageComponent,
        OutgoingMessageComponent,
        TransportMessageComponent,
        DraftMessageComponent,
        ChangePasswordComponent,
        OrderListModule,
        AgmCoreModule
    ]

})



//@NgModule({
//    imports: [routing],
//    declarations: [HomeComponent]
//})
export class ComponentsModule {

    public static forRoot(): ModuleWithProviders {
        return {
            ngModule: ComponentsModule,
            providers: [
                //FormControlService//,
                //ContentService
            ]
        };
    }

}