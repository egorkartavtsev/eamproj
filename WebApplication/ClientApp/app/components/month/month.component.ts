import { Input, Renderer2, ViewChild, Component } from '@angular/core';
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
    private emptyData: boolean = true;
    private emptyModal: boolean = true;
    private modalData: any[] = [];
    private CurrentData: any[] = [];
    private tHeadDays: any[] = [];

    private currentPO: any;

    @ViewChild('fetchBtn') fetchBtn: any;
    @ViewChild('fetchSel') fetchSel: any;
    @ViewChild('mimiLoader') mimiLoader: any;

    /********************************************************/

    private currentCount: number = 0;
    private totalCount: string;
    private needCount: string = '20';

    /********************************************************/
    //private filter: FilterModel;
    //private routeSubscription: Subscription;
    //private querySubscription: Subscription;

    //private tmpDT: object = {};

    //private TotalData: any[] = [];

    //private warn: boolean = false;
    //private tmpQuery: string;
    //private targetChanged: object = {
    //    "hours": false,
    //    "startDate": false
    //};
    //model: NgbDateStruct;
    //startCalDay: NgbDateStruct;
    //private curPage: number = 0;


    constructor(
        private renderer: Renderer2,
        private filterService: FilterService,
        private route: ActivatedRoute,
        private http: HttpService,
        private calendar: NgbCalendar) {}

    ngOnInit() {
        this.filterService.filter.subscribe(
            (filt: any) => {
                if (filt.ready) {
                    this.tHeadDays = [];
                    this.filter = filt;
                    let sup = new Date(this.filter.period.year + '-' + this.filter.period.month + '-01').toLocaleString('ru', { month: 'long' });
                    sup = sup + " " + this.filter.period.year;
                    this.title = sup[0].toUpperCase() + sup.substring(1);
                    this.modalData['title'] = "";
                    this.modalData['porders'] = [];
                    this.totalCount = this.filter.conut.toString();
                    this.getData();
                }
            }
        );
    }

    private showClones(e: any, row_id: any) {
        // определить есть ли открытые строки
        let row_status = $('#row_' + row_id).attr('inst-showed');
        $('#row_' + row_id).find('.btn-show-inst').find('i').remove();

        if (row_status === 'true') {
            $('#row_' + row_id).attr('inst-showed', 'false');
            $('#row_' + row_id).find('.btn-show-inst').append('<i class="fas fa-eye"></i>');
            $('.inst-row-' + row_id).each(function () {
                $(this).slideToggle('slow', function () {
                    $(this).remove();
                })
            });
        } else {
            $('#row_' + row_id).attr('inst-showed', 'true');
            $('#row_' + row_id).find('.btn-show-inst').append('<i class="fas fa-eye-slash"></i>');

            let newrow = this.renderer.createElement('tr');
            this.renderer.addClass(newrow, 'inst-row');
            this.renderer.addClass(newrow, 'inst-row-' + row_id);

            let newcol: any = this.renderer.createElement('td');
            this.renderer.setAttribute(newcol, 'colspan', '3');
            this.renderer.addClass(newcol, 'text-right');
            this.renderer.appendChild(newcol, this.renderer.createText('Полномочие'));
            this.renderer.appendChild(newrow, newcol);

            console.log('needly: ', this.CurrentData[row_id-1]);

            for (let i of this.tHeadDays) {
                newcol = this.renderer.createElement('td');
                this.renderer.appendChild(newcol, this.renderer.createText(i.weekDD.toString()));
                this.renderer.appendChild(newrow, newcol);
            }

            $('#row_' + row_id).after($(newrow));
        } // сгенерировать строку. Вставить после текущей строки



        //console.log('row ' + row_id+': ', newrow);
    }

    private getData() {
        this.CurrentData = [];
        this.emptyData = true;
        this.currentCount = 0;
        this.http.getMonthData(this.filterService.makeSQLFilter(this.filter), this.needCount, this.currentCount.toString()).subscribe(
            (data: any[]) => {
                let tmp = this.getRows(data);
                this.CurrentData = tmp;
                this.currentCount = this.CurrentData.length;
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
            cond['instance'] = "= '"+instance+"'";
            this.modalData['instance'] = instance;
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

    private fetchData() {
        this.renderer.setAttribute(this.fetchBtn.nativeElement, 'disabled', 'disabled');
        this.renderer.removeClass(this.mimiLoader.nativeElement, 'd-none');
        this.http.getMonthData(this.filterService.makeSQLFilter(this.filter), this.needCount, this.currentCount.toString()).subscribe(
            (data: any[]) => {
                let tmp = this.getRows(data);
                Array.prototype.push.apply(this.CurrentData, tmp);
                this.currentCount = this.CurrentData.length;
                this.emptyData = false;
                this.tryBtn(this.currentCount);
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
            totalRows[i]['rownum'] = i+1;
            totalRows[i]['days'] = cells;
            this.tHeadDays = [];
            for (let cell of cells) {
                if (cell['res'] !== "") {
                    sum += +cell['res'];
                }
                totalRows[i]['days'][j]['title'] = cell['weekDD'] + ' ' + cell['monDD'] + ' ' + this.title;
                totalRows[i]['days'][j]['target'] = this.filter.period.year + '-' + this.filter.period.month + '-' + cell['monDD'];
                ++j;
                this.tHeadDays.push({
                    "monDD": cell['monDD'],
                    "weekDD": cell['weekDD'].toLowerCase(),
                    "target": this.filter.period.year + '-' + this.filter.period.month + '-' + cell['monDD'],
                    "title": cell['weekDD'] + ' ' + this.title
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
            this.renderer.removeClass(this.fetchSel.nativeElement, 'd-none');
        } else {
            this.renderer.addClass(this.fetchBtn.nativeElement, 'd-none');
            this.renderer.addClass(this.fetchSel.nativeElement, 'd-none');
        }
    }

}