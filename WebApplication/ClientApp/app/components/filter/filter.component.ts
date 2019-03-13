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

    private organizations: any[] = [];
    private agregates: any[] = [];
    private routing_sequences: any[] = [];

    constructor(private http: HttpService, private filterService: FilterService){
        this.filterService.filter.subscribe(filt => {
            this.filterTotal = filt;
        });

        this.http.getOrganizations().subscribe(
            (data: any[]) => {
                this.organizations = Object.keys(data).map(i => data[i]);
            }
        );
    }

    ngOnInit(){
    }

    inp(source?: string) {
        switch (source) {
            case 'area':
                this.filterTotal.agr_filter = '';
                this.filterTotal.wt_filter = '';
                this.agregates = [];
                this.routing_sequences = [];
                if (this.filterTotal.org_filter !== '') {
                    this.http.getAgrs(this.filterTotal.org_filter.toString()).subscribe(
                        (data: any[]) => {
                            this.agregates = Object.keys(data).map(i => data[i]);
                        }
                    );
                }
                break;
            case 'agr':
                this.filterTotal.wt_filter = '';
                this.routing_sequences = [];
                if (this.filterTotal.agr_filter !== '') {
                    this.http.geTK(this.filterTotal.agr_filter).subscribe(
                        (data: any[]) => {
                            let tmp = Object.keys(data).map(i => data[i]);
                            for (let row of tmp) {
                                let sup = row.ROUTING_COMMENT.split(":");
                                this.routing_sequences.push(sup[0]);
                            }
                        }
                    );
                }
                break;
        }
        this.filterService.filter.next(this.filterTotal);
    }
    
}
