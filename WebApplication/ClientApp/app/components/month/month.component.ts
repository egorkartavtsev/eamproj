import { Input, Renderer2, ViewChild, Component, Injector, ApplicationRef, ComponentFactoryResolver, EmbeddedViewRef } from '@angular/core';
import { FilterService } from '../../services/filter.service';
import { FilterModel } from '../../library/filter-model';
import { HttpService } from '../../services/http.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { EditcloneComponent } from '../editclone/editclone.component';



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

    private compR: any;
    private listeners: any = {};

    /********************************************************/


    constructor(
        private renderer: Renderer2,
        private filterService: FilterService,
        private componentFactoryResolver: ComponentFactoryResolver,
        private injector: Injector,
        private route: ActivatedRoute,
        private http: HttpService,
        private appRef: ApplicationRef,
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

    private showClones(row_id: any, inst: any) {
        // определить есть ли открытые строки
        let row_status = $('#row_' + row_id).attr('inst-showed');
        $('#row_' + row_id).find('.btn-show-inst').find('i').remove();

        if (row_status === 'true') {
            //если открыты, у данного родителя удаляем
            $('#row_' + row_id).attr('inst-showed', 'false');
            $('#row_' + row_id).find('.btn-show-inst').append('<i class="fas fa-eye"></i>');

            for (let cb of this.listeners[row_id]) {
                cb();
            }

            $('.inst-row-' + row_id).each(function () {
                $(this).remove();
            });

        } else {
            //если не открыты, то показываем
            $('#row_' + row_id).attr('inst-showed', 'true');
            $('#row_' + row_id).find('.btn-show-inst').append('<i class="fas fa-eye-slash"></i>');


            //берём из базы клоны
            this.renderer.removeClass(this.mimiLoader.nativeElement, 'd-none');
            let summ = 0;
            this.listeners[row_id] = [];

            this.http.getClones(this.filterService.makeSQLFilter(this.filter), inst).subscribe(
                (data: any) => {// сгенерировать строку. Вставить после текущей строки
                    if (JSON.stringify(data) !== "{}") {
                        let tmp = Object.keys(data).map(i => data[i]);
                        for (let row of tmp) {
                            summ = 0;
                            let newrow = this.renderer.createElement('tr');
                            this.renderer.addClass(newrow, 'inst-row');
                            this.renderer.addClass(newrow, 'inst-row-' + row_id);

                            let newcol: any = this.renderer.createElement('td');
                            this.renderer.setAttribute(newcol, 'colspan', '3');
                            this.renderer.addClass(newcol, 'text-right');
                            this.renderer.appendChild(newcol, this.renderer.createText(row.resp_name.toString()));
                            this.renderer.appendChild(newrow, newcol);


                            let sup = Object.keys(row.days).map(i => row.days[i]);
                            for (let cell of sup) {
                                newcol = this.renderer.createElement('td');
                                this.renderer.addClass(newcol, 'text-center');
                                if (cell.res.toString() !== '') {
                                    summ += parseInt(cell.res, 10);
                                    this.renderer.appendChild(newcol, this.renderer.createText(cell.res.toString()));
                                    this.renderer.addClass(newcol, cell.class.toString());
                                    this.renderer.setAttribute(newcol, 'data-toggle', 'modal');
                                    this.renderer.setAttribute(newcol, 'data-target', '#mainModal');
                                    this.listeners[row_id].push(this.renderer.listen(newcol, 'click', (evt) => {
                                        this.showCloneDetails(inst, row.resp_key.toString(), cell.date.toString(), row_id);
                                    }));
                                }
                                this.renderer.appendChild(newrow, newcol);
                            }
                            newcol = this.renderer.createElement('td');
                            this.renderer.addClass(newcol, 'text-center');
                            this.renderer.appendChild(newcol, this.renderer.createText(summ.toString()));
                            this.renderer.appendChild(newrow, newcol);
                            
                            $('#row_' + row_id).after($(newrow));
                        }
                    }

                    this.renderer.addClass(this.mimiLoader.nativeElement, 'd-none');
                }
            );
        }
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

    private showCloneDetails(instance_number: string, resp_key: string, date: string, row_id: string) {

        if (typeof (this.compR) !== 'undefined') {
            this.compR.destroy();
        }

        this.compR = this.componentFactoryResolver
            .resolveComponentFactory(EditcloneComponent)
            .create(this.injector);
        this.compR.instance.instance_number = instance_number;
        this.compR.instance.resp_key = resp_key;
        this.compR.instance.date = date;
        this.compR.instance.onSaved.subscribe((v: any) => {
            this.showClones(row_id, instance_number);
            this.showClones(row_id, instance_number);
        });
        this.appRef.attachView(this.compR.hostView);
        const domElem = (this.compR.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;


        document.getElementById('mainModalBody').appendChild(domElem);
    }

}