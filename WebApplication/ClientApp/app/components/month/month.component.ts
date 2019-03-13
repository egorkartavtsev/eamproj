import { Component, OnInit } from '@angular/core';
import { FilterService } from '../../services/filter.service';
import { FilterModel } from '../../library/filter-model';
import { HttpService } from '../../services/http.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';



@Component({
    selector: 'month-app',
    templateUrl: './monthTpl.html'
})
export class MonthComponent {
    private filter: FilterModel;
    private title: string;
    private routeSubscription: Subscription;
    private querySubscription: Subscription;

    private tmpDT: object = {};

    private TotalData: any[] = [];
    private CurrentData: any[] = [];

    private emptyData: boolean = true;
    private emptyModal: boolean = true;
    private modalData: any[] = [];
    private currentPO: any;
    private tHeadDays: any[] = [];
    private tmpQuery: string;
    private targetChanged: object = {
        "hours": false,
        "startDate": false
    };
    model: NgbDateStruct;
    startCalDay: NgbDateStruct;

    constructor(private filterService: FilterService, private route: ActivatedRoute, private http: HttpService, private calendar: NgbCalendar) {
        this.querySubscription = route.queryParams.subscribe(
            (queryParam: any) => {
                if (queryParam['query'] !== undefined) {
                    this.tmpQuery = queryParam['query'];
                } else {
                    let date = new Date();
                    this.tmpQuery = date.getFullYear().toString();
                    this.tmpQuery += "-" + (((+date.getMonth().toString() + 1).toString().length < 2) ? "0" + (+date.getMonth().toString() + 1).toString() : (+date.getMonth().toString() + 1).toString());
                }
                let sup = new Date(this.tmpQuery + "-01").toLocaleString('ru', { month: 'long' });
                sup = sup + " " + new Date(this.tmpQuery + "-01").getFullYear().toString();
                this.title = sup[0].toUpperCase() + sup.substring(1);
                this.getData(this.tmpQuery);
            }
        );
        this.modalData['title'] = "";
        this.modalData['porders'] = [];

    }

    ngOnInit() {
        this.filterService.filter.subscribe(filt => {
            this.filter = filt;
            this.CurrentData = [];
            this.emptyData = true;
            
            for (let order of this.TotalData) {
                if (this.filterService.applyFilter(filt, order)) {
                    this.CurrentData.push(order);
                }
            }
            this.emptyData = false;
            console.log(this.CurrentData);
        });

    }

    private getData(query: string) {
        this.emptyData = true;
        this.TotalData = [];
        this.tHeadDays = [];
        this.CurrentData = [];
        this.http.getMonthData(query).subscribe(
            (data: any[]) => {
                let tmp = Object.keys(data).map(i => data[i]);
                let i = 0;
                for (let row of tmp) {
                    let j = 0;
                    let sum = 0;
                    this.TotalData.push(row);
                    let cells = Object.keys(row['days']).map(i => row['days'][i]);
                    this.TotalData[i]['days'] = cells;
                    this.tHeadDays = [];
                    for (let cell of cells) {
                        if (cell['res'] !== "") {
                            sum += +cell['res'];
                        }
                        this.TotalData[i]['days'][j]['title'] = cell['weekDD'] + ' ' + cell['monDD'] + ' ' + this.title;
                        this.TotalData[i]['days'][j]['target'] = this.tmpQuery + '-' + cell['monDD'];
                        ++j;
                        this.tHeadDays.push({
                            "monDD": cell['monDD'],
                            "weekDD": cell['weekDD'].toLowerCase(),
                            "target": this.tmpQuery + '-' + cell['monDD'],
                            "title": cell['weekDD'] + ' ' + cell['monDD'] + ' ' + this.title
                        });
                    }
                    this.TotalData[i]['sum'] = sum;
                    ++i;
                }
                this.CurrentData = this.TotalData;
                this.emptyData = false;
            }
        );
    }

    private showPOrders(target: string, title: string, instance?: string) {
        this.emptyModal = true;
        this.modalData['title'] = title;
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