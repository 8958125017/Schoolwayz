import { Component } from '@angular/core';

@Component({
    selector: 'nav-menu',
    template: require('./navmenu.component.html'),
    styles: [require('./navmenu.component.css')]
})
export class NavMenuComponent {

    clicked1: string = null;
    clicked2:string=null

    sideNavClick1(clicked1: string): void {
        this.clicked1 = this.clicked1 == clicked1 ? null : clicked1;
    }
    sideNavClick2(clicked2: string): void {
        this.clicked2 = this.clicked2 == clicked2 ? null : clicked2;
    }

    sideNavAlert(): void {
        alert("sublist item clicked");
    }
}
