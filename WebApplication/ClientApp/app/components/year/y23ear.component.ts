import { Component, OnInit}     from '@angular/core';
import { FilterService }        from '../../services/filter.service';
import { FilterModel }          from '../../library/filter-model';
import { HttpService }          from '../../services/http.service';
import { YearTableRow }         from '../../library/YearTableRow';
import { ActivatedRoute}        from '@angular/router';
import {Subscription}           from 'rxjs';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
  
@Component({
    selector: 'year-app',
    templateUrl: './yearTpl.html'
})
export class YearComponent implements OnInit { 
    
    private filter: FilterModel;
    private routeSubscription: Subscription;
    private querySubscription: Subscription;

    private TotalData: any[] = [];
    private CurrentData: any[] = [];
    private title: string;

    private modalData: any[] = [];
    private currentPO: any;
    private targetChanged: object = {
        "hours": false,
        "startDate": false
    };
    model: NgbDateStruct;
    startCalDay: NgbDateStruct;

    constructor (
        private filterService: FilterService, 
        private http: HttpService, 
        private route: ActivatedRoute
    ) {
        
        this.querySubscription = route.queryParams.subscribe(
            (queryParam: any) => {
                console.log(queryParam['query']);
                if(queryParam['query'] !== undefined ){
                    this.title = queryParam['query'];
                } else {
                    this.title = new Date().getFullYear().toString();
                }
                this.getData(this.title);
            }
        );
    }

    ngOnInit() {}

    private getData(query: string) {
        this.http.getYearData(query).subscribe(
            (data: any[]) => {
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
                this.CurrentData = this.TotalData;
                console.log(this.CurrentData);
            }
        );
    }

    private showPOList(mon: string, dec?: string, instance?: string) {
        let range = {};
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
        this.modalData['title'] = "ÏÇ ñ " + range['start'] + " ïî " + range['end'];
        let cond: any[] = [];
        cond['weekend'] = range['end'];
        cond['weekstart'] = range['start'];

        if (typeof (instance) !== "undefined") {
            cond['instance'] = instance;
            this.modalData['title'] += " äëÿ àãğåãàòà ¹" + instance;
        } else {
            cond['instance'] = "";
        }

        this.http.getDataList('year', cond).subscribe(
            (data: any[]) => {
                this.modalData['porders'] = Object.keys(data).map(i => data[i]);
            }
        );
    }

}