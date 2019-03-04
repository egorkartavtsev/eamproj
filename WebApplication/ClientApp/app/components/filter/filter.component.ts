import { Component, OnInit, Input}     from '@angular/core';
import { FilterService }        from '../../services/filter.service';
import { HttpService }        from '../../services/http.service';
import { FilterModel }          from '../../library/filter-model';

@Component({
    selector: 'filter-box',
    templateUrl: './filter.html'
})
export class FilterComponent implements OnInit {
    
    public filterTotal: FilterModel;
    public areas: string[];
    public machines: string[];

    constructor (private filterService: FilterService){
        this.filterService.filter.subscribe(filt => {
            this.filterTotal = filt;
            console.log('Это сабж в лямбде-ФИЛЬТРА: '+filt.areaFilter+' '+filt.machinesFilter+' '+filt.dateFilter+' ');
        });

        console.log('Filter start');
    }

    ngOnInit(){
        this.areas = ['цех1', 'цех2', 'цех3', 'цех4', 'цех5'];
        this.machines = ['agr1', 'agr2', 'agr3', 'agr4', 'agr5'];
        console.log('Filter complete');
    }

    inp(val:string){
        this.filterService.filter.next(this.filterTotal);
        //this.filter = this.filterService.updateFilter(key, val);
        console.log('Это фильтр: '+this.filterTotal.areaFilter);
    }
    
}
