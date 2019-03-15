import { Component, OnInit } from '@angular/core';
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
        this.querySubscription = route.queryParams.subscribe(
            (queryParam: any) => {
                this.title = queryParam['query'];
                let tmp = new Date(queryParam['query']);
                tmp.setDate(tmp.getDate() + 6);
                let mon = (+tmp.getMonth() + 1).toString();
                if (mon.length === 1) { mon = '0' + mon.toString(); }
                this.titleFor = tmp.getFullYear() + '-' + mon + '-' + tmp.getDate();
                this.getData(this.title, this.titleFor);
            }
        );
    }

    ngOnInit() {
        console.log(this.data);
        this.filterService.filter.subscribe(filt => {
            this.filter = filt;
            this.data = [];
            let i = 0;
            for (let day of this.totalData) {
                let day_data: any[] = [];
                this.data[i] = {};
                for (let order of day.porders) {
                    if (this.filterService.applyFilter(filt, order)) {
                        day_data.push(order);
                    }
                }
                this.data[i].porders = day_data;
                this.data[i].dname = day.dname;
                ++i;
            }
        });

    }

    private getData(start: string, end: string) {
        this.emptyData = true;
        if (typeof (this.modalData['title']) !== "undefined") {
            this.showPOrders(this.modalData['target'], this.modalData['title'], this.modalData['instance']);
        }
        this.http.getWeekData(start, end).subscribe(
            (data: any[]) => {
                let rows = Object.keys(data).map(i => data[i]);
                let ind = 0;
                for (let row of rows) {
                    let tmp = Object.keys(row["porders"]).map(i => row["porders"][i]);
                    rows[ind]['porders'] = tmp;
                    ++ind;
                }
                this.totalData = this.data = rows;
                console.log(this.totalData);
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
            cond['instance'] = instance;
            this.modalData['title'] += " для агрегата № " + instance;
        } else {
            cond['instance'] = "";
        }
        this.http.getDataList('month', cond).subscribe(
            (data: any[]) => {
                this.modalData['porders'] = Object.keys(data).map(i => data[i]);
                this.emptyModal = false;
            }
        );
    }

}
