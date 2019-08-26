import { Input, Renderer2, ViewChild, Component, OnInit } from '@angular/core';
import { FilterService } from '../../services/filter.service';
import { FilterModel } from '../../library/filter-model';
import { ProdOrder } from '../../library/prod-order.lib';
import { HttpService } from '../../services/http.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'year-app',
    templateUrl: './yearTpl.html',
    styles: ['']
})
export class YearComponent implements OnInit {

    private filter: FilterModel;
    private CurrentData: any[] = [];
    private title: string;
    private modalData: any[] = [];

    private currentPO: ProdOrder = new ProdOrder;
    private emptyData: boolean = true;
    private emptyModal: boolean = true;
    @ViewChild('fetchBtn') fetchBtn: any;
    @ViewChild('fetchSel') fetchSel: any;
    @ViewChild('mimiLoader') mimiLoader: any;

    /********************************************************/

    private currentCount: number = 0;
    private totalCount: string;
    private needCount: string = '15';

    /********************************************************/




    //private TotalData: any[] = [];
    //private warn: boolean = false;
    //private routeSubscription: Subscription;
    //private querySubscription: Subscription;
    //private tmpDT: object = {};
    //private targetChanged: object = {
    //    "hours": false,
    //    "startDate": false
    //};
    //model: NgbDateStruct;
    //startCalDay: NgbDateStruct;
    private monthes: any[] = [
        { "mon": "01", "num": "Январь" },
        { "mon": "02", "num": "Февраль" },
        { "mon": "03", "num": "Март" },
        { "mon": "04", "num": "Апрель" },
        { "mon": "05", "num": "Май" },
        { "mon": "06", "num": "Июнь" },
        { "mon": "07", "num": "Июль" },
        { "mon": "08", "num": "Август" },
        { "mon": "09", "num": "Сентябрь" },
        { "mon": "10", "num": "Октябрь" },
        { "mon": "11", "num": "Ноябрь" },
        { "mon": "12", "num": "Декабрь" }
    ];





    constructor(
        private renderer: Renderer2, 
        private filterService: FilterService,
        private http: HttpService,
        private route: ActivatedRoute
    ) {}

    ngOnInit() {
        this.emptyData = true;
        this.filterService.filter.subscribe(filt => {
            if (filt.ready) {
                this.filter = filt;
                this.title = filt.period.year;
                this.modalData['title'] = "";
                this.modalData['porders'] = [];
                this.totalCount = this.filter.conut.toString();
                this.CurrentData = [];
                this.getData();
            }
        });

    }

    private getData() {
        this.emptyData = true;
        if (typeof (this.modalData['mon']) !== "undefined") {
            this.showPOList(this.modalData['mon'], this.modalData['dec'], this.modalData['instance']);
        }
        this.http.getYearData(this.filterService.makeSQLFilter(this.filter), this.needCount, this.currentCount.toString()).subscribe(
            (data: any[]) => {
                console.log(data);
                let tmp = this.getRows(data);
                this.CurrentData = tmp;
                this.emptyData = false;
                this.tryBtn(tmp.length);
                this.currentCount = this.CurrentData.length;
            },
            error => { console.log(error) }
        );
    }
    
    private fetchData() {
        this.renderer.setAttribute(this.fetchBtn.nativeElement, 'disabled', 'disabled');
        this.renderer.removeClass(this.mimiLoader.nativeElement, 'd-none');
        this.http.getYearData(this.filter, this.needCount, this.currentCount.toString()).subscribe(
            (data: any[]) => {
                let tmp = this.getRows(data);
                Array.prototype.push.apply(this.CurrentData, tmp);
                this.currentCount = this.CurrentData.length;
                this.tryBtn(tmp.length);
            }
        );
    }

    private showPOList(mon: string, dec?: string, instance?: string) {
        let range = {};
        this.emptyModal = true;
        var date = new Date(+this.title, +  mon, 0);
        switch (dec) {
            case "01":
                range = {
                    "start": this.title + "-" + mon + "-01",
                    "end": this.title + "-" + mon + "-10"
                }
                break;
            case "02":
                range = {
                    "start": this.title + "-" + mon + "-11",
                    "end": this.title + "-" + mon + "-20"
                }
                break;
            case "03":
                range = {
                    "start": this.title + "-" + mon + "-21",
                    "end": this.title + "-" + mon + "-" + date.getDate()
                }
                break;
            default:
                range = {
                    "start": this.title + "-" + mon + "-01",
                    "end": this.title + "-" + mon + "-" + date.getDate()
                }
                break;
        }
        this.modalData['title'] = "ПЗ с " + range['start'] + " по " + range['end'];
        this.modalData['mon'] = mon;
        this.modalData['dec'] = dec;
        let cond: any[] = [];
        cond['weekend'] = range['end'];
        cond['weekstart'] = range['start'];

        if (typeof (instance) !== "undefined") {
            cond['instance'] = "= '" + instance + "'";
            this.modalData['title'] += " для агрегата №" + instance;
            this.modalData['instance'] = instance;
        } else {
            cond['instance'] = "LIKE '%'";
        }

        this.http.getDataList('year', cond, this.filterService.makeSQLFilter(this.filter)).subscribe(
            (data: any[]) => {
                this.modalData['porders'] = Object.keys(data).map(i => data[i]);
                this.emptyModal = false;
            }
        );
    }

    onSaved() {
        this.getData();
    }



    private getRows(data: any[]) {
        let totalRows: any[] = [];

        let tmp = Object.keys(data).map(i => data[i]);
        let i = 0;
        for (let row of tmp) {
            let j = 0;
            let sum = 0;
            totalRows.push(row);

            let cells = Object.keys(row['decadas']).map(i => row['decadas'][i]);
            totalRows[i]['decadas'] = cells;

            for (let cell of cells) {
                if (cell['val'] == "") {
                    totalRows[i]['decadas'][j] = cell;
                } else {
                    totalRows[i]['decadas'][j]['val'] = (cell['val'] % 24) ? (cell['val'] / 24).toFixed(2) : (cell['val'] / 24);
                    totalRows[i]['decadas'][j]['class'] = cell['class'];
                    totalRows[i]['decadas'][j]['tarM'] = cell['tarM'];
                    totalRows[i]['decadas'][j]['tarD'] = cell['tarD'];
                    sum += +cell['val'];
                }
                ++j;
            }
            totalRows[i]['sum'] = ((sum * 100) % 100) ? sum.toFixed(2) : sum;
            ++i;
        }
        return totalRows;
    }

    private tryBtn(length: number) {
        if (length >= +this.needCount) {
            this.renderer.removeAttribute(this.fetchBtn.nativeElement, 'disabled');
            this.renderer.removeClass(this.fetchBtn.nativeElement, 'd-none');
            this.renderer.removeClass(this.fetchSel.nativeElement, 'd-none');
        } else {
            this.renderer.addClass(this.fetchBtn.nativeElement, 'd-none');
            this.renderer.addClass(this.fetchSel.nativeElement, 'd-none');
        }
    }

}