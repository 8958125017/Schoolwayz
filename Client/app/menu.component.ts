import {Component,Input,OnInit,EventEmitter,trigger,state,transition,style,animate} from '@angular/core';
import {Location} from '@angular/common';
import {Router} from '@angular/router';
import {MenuItem } from 'primeng/primeng';


@Component({
    selector: 'app-menu',
    template: `
        <div class="menu">
            <ul app-submenu [item]="model" root="true"></ul>
        </div>
    `
})
export class AppMenuComponent implements OnInit {

    model: MenuItem[];
    
    ngOnInit() {
        this.model = [
            { label: 'Dashboard', icon: 'fa-home', routerLink: ['/home'] },
            {
                label: 'Setup', icon: 'fa fa-cog', 
                items: [
                    { label: 'Organization', icon: 'fa fa-university', routerLink: ['/organization'] },
                    { label: 'Schedule', icon: 'fa fa-calendar-plus-o', routerLink: ['/schedule'] },
                    { label: 'Patron', icon: 'fa fa-users', routerLink: ['/patronlist'] },
                    { label: 'Employee', icon: 'fa-user-circle-o', routerLink: ['/personlist'] },
                    { label: 'Transport', icon: 'fa-bus', routerLink: ['/transportroutelist'] }
                ]
            },
            //{
            //    label: 'Analytics', icon: 'fa fa-bar-chart', 
            //    items: [
            //        { label: 'Patron', icon: 'fa fa-users', routerLink: ['/chart']},
            //        { label: 'Employee', icon: 'fa fa-users', routerLink: ['/personchart']},
            //        { label: 'Events', icon: 'fa-table', routerLink: ['/eventtracking']},
            //    ]
            //},            
            //{
            //    label: 'Message Center', icon: 'fa fa-envelope',
            //    items: [
            //        { label: 'Internal Message', icon: 'fa fa-paper-plane', routerLink: ['/inhousemessage']},
                        
            //        {
            //            label: 'External Message', icon: 'fa-sign-in',
            //            items: [
            //                { label: 'Inbox', icon: 'fa fa-inbox', routerLink: ['/incomingmessage'] }, 
            //                { label: 'Outbox', icon: 'fa fa-paper-plane', routerLink: ['/outgoingmessage'] }, 
            //                { label: 'Drafts', icon: 'fa fa-floppy-o', routerLink: ['/draftmessage'] },
            //            ]
            //        }
            //    ]
            //},
            //{ label: 'Event', icon: 'fa fa-calendar', routerLink: ['/eventlist'] },
            { label: 'Message Center', icon: 'fa fa-envelope', routerLink: ['/transportmessage'] },
            { label: 'Walking Request', icon: 'fa fa-car', routerLink: ['/transportwalker'] },
            //{
            //    label: 'Walking Request', icon: 'fa fa-car',
            //    items: [
            //        { label: 'Current Walker', icon: 'fa fa-calendar', routerLink: ['/transportwalker',{'id':"current"}] },
            //        { label: 'History Walker', icon: 'fa fa-calendar', routerLink: ['/transportwalker', { 'id':"History" }] },
            //    ]
            //},
            { label: 'Map', icon: 'fa fa-map', routerLink: ['/mapview'] },
            //{ label: 'Documentation', icon: 'fa-book', routerLink: ['/documentation'] } ,
           
        ];
    }
}

@Component({
    selector: '[app-submenu]',
    template: `
        <ul>
            <ng-template ngFor let-child let-i="index" [ngForOf]="(root ? item : item.items)">
                <li [ngClass]="{'active-menuitem': isActive(i)}">
                    <a [href]="child.url||'#'" (click)="itemClick($event,child,i)">
                        <i class="fa fa-fw" [ngClass]="child.icon"></i>
                        <span>{{child.label}}</span>
                        <i class="fa fa-fw fa-angle-down" *ngIf="child.items"></i>
                    </a>
                    <ul app-submenu [item]="child" *ngIf="child.items" [@children]="isActive(i) ? 'visible' : 'hidden'" ></ul>
                </li>
            </ng-template>
        </ul>
    `,
    animations: [
        trigger('children', [
            state('hidden', style({
                height: '0px'
            })),
            state('visible', style({
                height: '*'
            })),
            transition('visible => hidden', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)')),
            transition('hidden => visible', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)'))
        ])
    ]
})
export class AppSubMenu {

    @Input() item: MenuItem;
    
    @Input() root: boolean;
        
    activeIndex: number;
        
    constructor(public router: Router, public location: Location) {}
        
    itemClick(event: Event, item: MenuItem, index: number) {
        if(item.disabled) {
            event.preventDefault();
            return true;
        }
        
        this.activeIndex = (this.activeIndex === index) ? null : index;
        
        if(!item.url||item.routerLink) {
            event.preventDefault();
        }
        
        if(item.command) {
            if(!item.eventEmitter) {
                item.eventEmitter = new EventEmitter();
                item.eventEmitter.subscribe(item.command);
            }
            
            item.eventEmitter.emit({
                originalEvent: event,
                item: item
            });
        }

        if(item.routerLink) {
            this.router.navigate(item.routerLink);
        }
    }
    
    isActive(index: number): boolean {
        return this.activeIndex === index;
    }
}