import { Input, Component, OnInit } from '@angular/core';
import { FilterService } from '../../services/filter.service';
import { FilterModel } from '../../library/filter-model';
import { HttpService } from '../../services/http.service';
import { ProdOrder } from '../../library/prod-order.lib';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
    selector: 'week-app',
    templateUrl: './weekTpl.html'
})
export class WeekComponent implements OnInit {

    private filter: FilterModel;

    private totalData: any[] = [];
    private data: any[] = [];
    private title: string;
    private titleFor: string;
    private emptyData: boolean = true;


    private routeSubscription: Subscription;
    private querySubscription: Subscription;

    private modalData: any[] = [];
    private emptyModal: boolean = true;

    constructor(
        private filterService: FilterService,
        private http: HttpService,
        private route: ActivatedRoute
    ) {
        //this.querySubscription = route.queryParams.subscribe(
        //    (queryParam: any) => {
        //        this.title = queryParam['query'];
        //        let tmp = new Date(queryParam['query']);
        //        tmp.setDate(tmp.getDate() + 6);
        //        let mon = (+tmp.getMonth() + 1).toString();
        //        if (mon.length === 1) { mon = '0' + mon.toString(); }
        //        this.titleFor = tmp.getFullYear() + '-' + mon + '-' + tmp.getDate();
        //        this.getData(this.title, this.titleFor);
        //    }
        //);
    }

    ngOnInit() {
        this.filterService.filter.subscribe(filt => {
            this.filter = filt;
            let sup1 = new Date(this.filter.period.year + '-' + this.filter.period.month + '-' + this.filter.period.day);
            let sup = sup1.toLocaleString('ru', { weekday: 'long' });
            this.title = sup[0].toUpperCase() + sup.substring(1) + ' ' + this.filter.period.day + '.' + this.filter.period.month + '.' + this.filter.period.year;
            sup1.setDate(sup1.getDate() + 6);
            let mon = (+sup1.getMonth() + 1).toString();
            if (mon.length === 1) { mon = '0' + mon.toString(); }
            this.titleFor = sup1.toLocaleString('ru', { weekday: 'long' })[0].toUpperCase() + sup1.toLocaleString('ru', { weekday: 'long' }).substring(1) + ' ' + sup1.getDate() + '.' + mon + '.' + sup1.getFullYear();
            this.getData();
        });

    }
    
    private getData() {
        this.emptyData = true;
        this.http.getWeekData(this.filterService.makeSQLFilter(this.filter)).subscribe(
            (data: any[]) => {
                let rows = Object.keys(data).map(i => data[i]);
                let ind = 0;
                for (let row of rows) {
                    let tmp = Object.keys(row["porders"]).map(i => row["porders"][i]);
                    rows[ind]['porders'] = tmp;
                    ++ind;
                }
                this.totalData = this.data = rows;
                this.emptyData = false;
            }
        );
    }

    private showPOrders(target: string, title: string, instance?: string) {
        this.emptyModal = true;
        this.modalData['title'] = title;
        this.modalData['target'] = target;
        let cond: any[] = [];
        cond['date'] = target;
        if (typeof (instance) !== "undefined") {
            cond['instance'] = "= '" + instance + "'";
            this.modalData['title'] += " для агрегата № " + instance;
        } else {
            cond['instance'] = "LIKE '%'";
        }
        this.http.getDataList('month', cond, this.filterService.makeSQLFilter(this.filter)).subscribe(
            (data: any[]) => {
                this.modalData['porders'] = Object.keys(data).map(i => data[i]);
                this.emptyModal = false;
            }
        );
    }

}
