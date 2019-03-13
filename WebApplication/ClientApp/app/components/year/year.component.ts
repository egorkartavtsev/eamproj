import { Component, OnInit } from '@angular/core';
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
    private routeSubscription: Subscription;
    private querySubscription: Subscription;

    private TotalData: any[] = [];
    private CurrentData: any[] = [];
    private title: string;

    private modalData: any[] = [];
    private currentPO: ProdOrder = new ProdOrder;
    private emptyData: boolean = true;
    private emptyModal: boolean = true;
    private tmpDT: object = {};
    private targetChanged: object = {
        "hours": false,
        "startDate": false
    };
    model: NgbDateStruct;
    startCalDay: NgbDateStruct;

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
        private filterService: FilterService,
        private http: HttpService,
        private route: ActivatedRoute
    ) {
        this.emptyData = true;
        this.querySubscription = route.queryParams.subscribe(
            (queryParam: any) => {
                if (queryParam['query'] !== undefined) {
                    this.title = queryParam['query'];
                } else {
                    this.title = new Date().getFullYear().toString();
                }
                this.getData(this.title);
            }
        );
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
        console.log("Данные пусты");
        this.emptyData = true;
        this.http.getYearData(query).subscribe(
            (data: any[]) => {
                console.log("===========clear data from db=============");
                console.log(data);
                console.log("***********clear data from db*************");
                let tmp = Object.keys(data).map(i => data[i]);
                this.TotalData = [];
                let i = 0;
                for (let row of tmp) {
                    let j = 0;
                    let sup = [];
                    let sum = 0;
                    this.TotalData.push(row);

                    let cells = Object.keys(row['decadas']).map(i => row['decadas'][i]);
                    this.TotalData[i]['decadas'] = cells;

                    for (let cell of cells) {
                        if (cell['val'] == "") {
                            this.TotalData[i]['decadas'][j] = cell;
                        } else {
                            this.TotalData[i]['decadas'][j]['val'] = (cell['val'] % 24) ? (cell['val'] / 24).toFixed(2) : (cell['val'] / 24);
                            this.TotalData[i]['decadas'][j]['class'] = cell['class'];
                            this.TotalData[i]['decadas'][j]['tarM'] = cell['tarM'];
                            this.TotalData[i]['decadas'][j]['tarD'] = cell['tarD'];
                            sum += +cell['val'];
                        }
                        ++j;
                    }
                    this.TotalData[i]['sum'] = ((sum * 100) % 100) ? sum.toFixed(2) : sum;
                    ++i;
                }
                console.log("Заполнено");
                this.CurrentData = this.TotalData;
                this.emptyData = false;
            },
            error => { console.log(error) }
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
        let cond: any[] = [];
        cond['weekend'] = range['end'];
        cond['weekstart'] = range['start'];

        if (typeof (instance) !== "undefined") {
            cond['instance'] = instance;
            this.modalData['title'] += " для агрегата №" + instance;
        } else {
            cond['instance'] = "";
        }

        this.http.getDataList('year', cond).subscribe(
            (data: any[]) => {
                this.modalData['porders'] = Object.keys(data).map(i => data[i]);
                this.emptyModal = false;
            }
        );
    }

    onSaved() {
        this.getData(this.title);
    }
}