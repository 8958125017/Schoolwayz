import { Component, Input } from '@angular/core';

@Component({
    selector: 'base-component'
    
})
export class BaseComponent {
    @Input() isBase: boolean = true;
}