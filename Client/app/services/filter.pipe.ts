import { Injectable,Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filterPipe'
})

@Injectable()
export class FilterPipe implements PipeTransform {

   transform(value: any, search: string) {
        //alert("value = " + value);
        //alert("input = " + search);
        if (search === undefined) return value;
        
        if (search) {
            search = search.toLowerCase();
            return value.filter(function (el: any) {
                return el.toLowerCase().indexOf(search) > -1;
            })
        }
        return value;
    }

}
