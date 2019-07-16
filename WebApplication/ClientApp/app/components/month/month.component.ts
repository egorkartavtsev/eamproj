import { Renderer2, ViewChild, Component, OnInit } from '@angular/core';
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
    private warn: boolean = false;
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

    private curPage: number = 0;
    @ViewChild('fetchBtn') fetchBtn: any;
    @ViewChild('mimiLoader') mimiLoader: any;

    /********************************************************/

    private currentCount: number = 0;
    private totalCount: string;
    private needCount: string = '20';

    /********************************************************/

    constructor(private renderer: Renderer2, private filterService: FilterService, private route: ActivatedRoute, private http: HttpService, private calendar: NgbCalendar) {
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
                this.getData();
                //this.http.getCountOfRows(this.tmpQuery, '1').subscribe(
                //    data => {
                //        this.totalCount = data[0]['CNT'];
                //    }
                //);
            }
        );
        this.modalData['title'] = "";
        this.modalData['porders'] = [];

    }

    ngOnInit() {
        this.filterService.filter.subscribe(filt => {
            this.filter = filt;
            this.CurrentData = [];
            for (let order of this.TotalData) {
                if (this.filterService.applyFilter(filt, order)) {
                    this.CurrentData.push(order);
                }
            }

            //if (this.filter.agr_filter == '' && this.filter.org_filter == '' && this.filter.planner_filter == '' && this.filter.wt_filter == '') {
            //    this.warn = false;
            //} else {
            //    this.warn = true;
            //}
        });

    }

    private getData() {
        this.emptyData = true;
        let query = this.tmpQuery;
        if (typeof (this.modalData['title']) !== "undefined") {
            this.showPOrders(this.modalData['target'], this.modalData['title'], this.modalData['instance']);
        }
        this.TotalData = [];
        this.tHeadDays = [];
        this.CurrentData = [];
        this.currentCount = 0;
        this.http.getMonthData(query, this.curPage.toString(), this.needCount, this.currentCount.toString()).subscribe(
            (data: any[]) => {
                let tmp = this.getRows(data);
                this.TotalData = tmp;
                for (let order of this.TotalData) {
                    if (this.filterService.applyFilter(this.filter, order)) {
                        this.CurrentData.push(order);
                    }
                }
                this.currentCount = this.TotalData.length;
                this.emptyData = false;
                this.tryBtn(tmp.length);
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
            this.modalData['instance'] = instance;
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

    private fetchData() {
        this.renderer.setAttribute(this.fetchBtn.nativeElement, 'disabled', 'disabled');
        this.renderer.removeClass(this.mimiLoader.nativeElement, 'd-none');
        ++this.curPage;
        this.http.getMonthData(this.tmpQuery, this.curPage.toString(), this.needCount, this.currentCount.toString()).subscribe(
            (data: any[]) => {
                let tmp = this.getRows(data);

                Array.prototype.push.apply(this.TotalData, tmp);
                for (let order of tmp) {
                    if (this.filterService.applyFilter(this.filter, order)) {
                        this.CurrentData.push(order);
                    }
                }
                this.currentCount = this.TotalData.length;

                this.emptyData = false;
                this.tryBtn(tmp.length);
                this.renderer.addClass(this.mimiLoader.nativeElement, 'd-none');
            }
        );
    }

    private getRows(data: any[]) {

        let totalRows: any[] = [];

        let tmp = Object.keys(data).map(i => data[i]);
        let i = 0;
        for (let row of tmp) {
            let j = 0;
            let sum = 0;
            totalRows.push(row);
            let cells = Object.keys(row['days']).map(i => row['days'][i]);
            totalRows[i]['days'] = cells;
            this.tHeadDays = [];
            for (let cell of cells) {
                if (cell['res'] !== "") {
                    sum += +cell['res'];
                }
                totalRows[i]['days'][j]['title'] = cell['weekDD'] + ' ' + cell['monDD'] + ' ' + this.title;
                totalRows[i]['days'][j]['target'] = this.tmpQuery + '-' + cell['monDD'];
                ++j;
                this.tHeadDays.push({
                    "monDD": cell['monDD'],
                    "weekDD": cell['weekDD'].toLowerCase(),
                    "target": this.tmpQuery + '-' + cell['monDD'],
                    "title": cell['weekDD'] + ' ' + cell['monDD'] + ' ' + this.title
                });
            }
            totalRows[i]['sum'] = sum;
            ++i;
        }
        return totalRows;
    }

    private tryBtn(length: number) {
        if (length >= +this.needCount) {
            this.renderer.removeAttribute(this.fetchBtn.nativeElement, 'disabled');
            this.renderer.removeClass(this.fetchBtn.nativeElement, 'd-none');
        } else {
            this.renderer.addClass(this.fetchBtn.nativeElement, 'd-none');
        }
    }

}