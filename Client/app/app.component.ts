import { Component, AfterViewInit, OnDestroy, ViewChild, ElementRef, Renderer, trigger, state, transition, style, animate } from '@angular/core';
import { SetupService } from './services/setup.service';
import { Router } from '@angular/router';

declare var jQuery: any;
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    providers: [SetupService],
    animations: [
        trigger('submenu', [
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
export class AppComponent implements AfterViewInit, OnDestroy {

    public menuInactiveDesktop: boolean;

    public menuActiveMobile: boolean;

    public profileActive: boolean;

    public topMenuActive: boolean;

    public topMenuLeaving: boolean;

    @ViewChild('scroller') public scrollerViewChild: ElementRef;

    public scroller: HTMLDivElement;

    documentClickListener: Function;

    menuClick: boolean;
    userId = "admin"
    topMenuButtonClick: boolean;
    userName: string;
    loginDetails: LoginDetail;
    lastLogin: any;
    image: string;
    logoImage: string;
    constructor(public renderer: Renderer, private _router:Router) {
        var firstName;
        var lastName;


        firstName = localStorage.getItem("GivenName");
        lastName = localStorage.getItem("SurName");
        this.userName = firstName + " " + lastName;
        this.image = localStorage.getItem("ImgUrl");
        this.logoImage = localStorage.getItem("LogoUrl");
        this.lastLogin = localStorage.getItem("LastLogin");
    }

    ngAfterViewInit() {
        this.scroller = <HTMLDivElement>this.scrollerViewChild.nativeElement;

        //hides the overlay menu and top menu if outside is clicked
        this.documentClickListener = this.renderer.listenGlobal('body', 'click', (event) => {
            if (!this.isDesktop()) {
                if (!this.menuClick) {
                    this.menuActiveMobile = false;
                }

                if (!this.topMenuButtonClick) {
                    this.hideTopMenu();
                }

                this.menuClick = false;
                this.topMenuButtonClick = false;
            }
        });
    }

    toggleMenu(event: Event) {
        this.menuClick = true;
        if (this.isDesktop()) {
            this.menuInactiveDesktop = !this.menuInactiveDesktop;
            if (this.menuInactiveDesktop) {
                this.menuActiveMobile = false;
            }
        }
        else {
            this.menuActiveMobile = !this.menuActiveMobile;
            if (this.menuActiveMobile) {
                this.menuInactiveDesktop = false;
            }
        }

        if (this.topMenuActive) {
            this.hideTopMenu();
        }

        event.preventDefault();
    }

    toggleProfile(event: Event) {
        this.profileActive = !this.profileActive;
        event.preventDefault();
    }

    toggleTopMenu(event: Event) {
        this.topMenuButtonClick = true;
        this.menuActiveMobile = false;

        if (this.topMenuActive) {
            this.hideTopMenu();
        }
        else {
            this.topMenuActive = true;
        }

        event.preventDefault();
    }

    hideTopMenu() {
        this.topMenuLeaving = true;
        setTimeout(() => {
            this.topMenuActive = false;
            this.topMenuLeaving = false;
        }, 500);
    }

    onMenuClick() {
        this.menuClick = true;

        setTimeout(() => {
            jQuery(this.scroller).nanoScroller();
        }, 600);
    }

    isDesktop() {
        return window.innerWidth > 1024;
    }

    onSearchClick() {
        this.topMenuButtonClick = true;
    }

    ngOnDestroy() {
        if (this.documentClickListener) {
            this.documentClickListener();
        }
    }
    password() {
        this._router.navigate(['/changepassword']);
    }
}