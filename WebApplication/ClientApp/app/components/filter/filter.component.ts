import { Component, OnInit, Renderer2, ViewChild, Input } from '@angular/core';
import { FilterService } from '../../services/filter.service';
import { HttpService } from '../../services/http.service';
import { FilterModel } from '../../library/filter-model';
import { SelConf } from '../../library/sel-conf';
import { CookieService } from "angular2-cookie/core";

@Component({
    selector: 'filter-box',
    templateUrl: './filter.html'
})
export class FilterComponent implements OnInit {

    private organizations: any[] = [];
    private agregates: any[] = [];
    private wtypes: any[] = [];
    private stats: any;
    private years: any[] = [];
    private days: any[] = [];
    private cnt: string;
    private filterList: any[] = [];
    private newFilterName: string = "";

    private monthes: any[] = [
        { num: "01", name: "Январь" },
        { num: "02", name: "Февраль" },
        { num: "03", name: "Март" },
        { num: "04", name: "Апрель" },
        { num: "03", name: "Май" },
        { num: "06", name: "Июнь" },
        { num: "07", name: "Июль" },
        { num: "08", name: "Август" },
        { num: "09", name: "Сентябрь" },
        { num: "10", name: "Октябрь" },
        { num: "11", name: "Ноябрь" },
        { num: "12", name: "Декабрь" }
    ];

    @ViewChild('loader') loader: any;

    @ViewChild('yrSel') yrSel: any;
    @ViewChild('monSel') monSel: any;
    @ViewChild('daySel') daySel: any;

    @ViewChild('newFiltNameBox') newFiltNameBox: any;
    @ViewChild('firstSaveBtn') firstSaveBtn: any;
    @ViewChild('lastSaveBtn') lastSaveBtn: any;

    private conf_org: SelConf = new SelConf("ORGANIZATION_NAME");
    private conf_agr: SelConf = new SelConf("FULL_NAME");
    private conf_wt: SelConf = new SelConf("ROUTING_COMMENT");
    private conf_stat: SelConf = new SelConf("MEANING");

    public filterTotal: FilterModel;


    constructor(private http: HttpService, private cookie: CookieService, private filterService: FilterService, private renderer: Renderer2) {
        this.filterTotal = new FilterModel();
        //supports
        let date = new Date();
        this.filterService.filter.subscribe(filt => {
            this.filterTotal = filt;
            this.http.getCountOfRows(this.filterService.makeSQLFilter(filt)).subscribe(
                (data: any) => {
                    this.cnt = data[0]['CNT'];
                    this.filterTotal.conut = data[0]['CNT'];
                    this.renderer.addClass(this.loader.nativeElement, 'd-none');
                }
            );
        });

        //date arrays
        this.years = [];
        this.days = [];
        for (let i = date.getFullYear() - 5; i <= date.getFullYear() + 5; ++i) {
            this.years.push(i);
        }
        for (let i = 1; i <= (32 - new Date(date.getFullYear(), date.getMonth(), 32).getDate()); ++i) {
            let d = (i.toString().length > 1) ? i.toString() : '0' + i.toString();
            this.days.push({num:d,name:d});
        }



        //DB datas
        this.http.getOrganizations().subscribe(
            (data: any[]) => {
                this.organizations = Object.keys(data).map(i => data[i]);
            }
        );
        this.http.getStats().subscribe(
            (data: any[]) => {
                this.stats = Object.keys(data).map(i => data[i]);
            }
        );
    }

    ngOnInit() {
    }

    chg(val: any, src: string) {
        this.filterTotal.ready = false;
        this.renderer.removeClass(this.loader.nativeElement, 'd-none');
        switch (src) {
            case 'org':
                this.filterTotal.agr = '%';
                this.filterTotal.wtype = '%';
                this.agregates = [];
                this.filterTotal.org = val.value;
                if (this.filterTotal.org.length > 0) {
                    let orgs = val.value.map((a: any) => a.ORGANIZATION_ID).join(', ');
                    this.http.getAgrs(orgs).subscribe(
                        (data: any[]) => {
                            this.agregates = Object.keys(data).map(i => data[i]);
                        }
                    );
                }
                break;
            case 'agr':
                this.filterTotal.wtype = '%';
                this.wtypes = [];
                this.filterTotal.agr = val.value;
                if (this.filterTotal.agr.length > 0) {
                    let args = val.value.map((a: any) => a.INSTANCE_NUMBER).join("','");
                    this.http.geTK(args).subscribe(
                        (data: any[]) => {
                            this.wtypes = Object.keys(data).map(i => data[i]);
                        }
                    );
                }
                break;
            case 'wt':
                this.filterTotal.wtype = val.value;
                break;
            case 'mon':
                this.days = [];
                let date = new Date(parseInt(this.filterTotal.period.year), (parseInt(this.filterTotal.period.month)-1), 32);
                for (let i = 1; i <= (32 - date.getDate()); ++i) {
                    let d = (i.toString().length > 1) ? i.toString() : '0' + i.toString();
                    this.days.push({ num: d, name: d });
                }
                break;
            case 'stat':
                this.filterTotal.status = val.value;
                break;
            case 'form':
                switch (this.filterTotal.form) {
                    case 'week':
                        this.renderer.removeClass(this.monSel.nativeElement, 'd-none');
                        this.renderer.removeClass(this.daySel.nativeElement, 'd-none');
                        break;
                    case 'mon':
                        this.renderer.removeClass(this.monSel.nativeElement, 'd-none');
                        this.renderer.addClass(this.daySel.nativeElement, 'd-none');
                        break;
                    case 'year':
                        this.renderer.addClass(this.monSel.nativeElement, 'd-none');
                        this.renderer.addClass(this.daySel.nativeElement, 'd-none');
                        break;
                }
                break;
        }
        this.filterService.filter.next(this.filterTotal);
    }

    showTable() {
        this.filterTotal.ready = true;
        this.filterTotal.conut = parseInt(this.cnt);
        this.filterService.filter.next(this.filterTotal);
    }

    getFilterList() {
        this.http.getFilterList().subscribe(
            (data: any) => {
                this.filterList = data;
            }
        );
    }

    prepareSave() {
        this.renderer.addClass(this.firstSaveBtn.nativeElement, "d-none");
        this.renderer.removeClass(this.lastSaveBtn.nativeElement, "d-none");
        this.renderer.removeClass(this.newFiltNameBox.nativeElement, "d-none");
    }

    saveCurrent() {
        if (this.newFilterName === "") {
            alert("Введите название фильтра!");
        } else {
            let filterInfo = {};

            let filt2save = {};
            let tmpDesc = "";
            let tmpTxt = "";

            let tmpFilt = this.filterService.makeSQLFilter(this.filterTotal);


            for (let fld in tmpFilt) {
                tmpDesc = "";
                if (fld !== 'planner' && fld !== 'perEnd' && fld !== 'perStart') {
                    switch (fld) {
                        case "agr":
                            for (let obb of this.filterTotal[fld]) {
                                if (typeof (obb["FULL_NAME"]) !== "undefined") {
                                    tmpDesc += obb["FULL_NAME"] + "; ";
                                } else {
                                    tmpDesc = "Все";
                                }
                            }
                            tmpTxt = "Агрегат: ";
                            break;
                        case "org":
                            for (let obb of this.filterTotal[fld]) {
                                if (typeof (obb["ORGANIZATION_NAME"]) !== "undefined") {
                                    tmpDesc += obb["ORGANIZATION_NAME"] + "; ";
                                } else {
                                    tmpDesc = "Все";
                                }
                            }
                            tmpTxt = "Организация: ";
                            break;
                        case "status":
                            for (let obb of this.filterTotal[fld]) {
                                if (typeof (obb["MEANING"]) !== "undefined") {
                                    tmpDesc += obb["MEANING"] + "; ";
                                } else {
                                    tmpDesc = "Все";
                                }
                            }
                            tmpTxt = "Статус: ";
                            break;
                        case "wtype":
                            for (let obb of this.filterTotal[fld]) {
                                if (typeof (obb["ROUTING_COMMENT"]) !== "undefined") {
                                    tmpDesc += obb["ROUTING_COMMENT"] + "; ";
                                } else {
                                    tmpDesc = "Все";
                                }
                            }
                            tmpTxt = "Тип работ: ";
                            break;
                    }

                    filt2save[fld] = {
                        "field_val": tmpFilt[fld],
                        "field_name": fld,
                        "field_name_desc": tmpTxt,
                        "field_val_desc": tmpDesc
                    };
                }
            }

            filterInfo = {
                "name": this.newFilterName,
                "user": this.cookie.get('eam_kp_uid'),
                "attrs": JSON.stringify(filt2save)
                //"attrs": filt2save
            };
            this.http.saveCurFilter(filterInfo).subscribe(
                (data: any) => {
                    alert("Сохранено");
                    this.renderer.addClass(this.lastSaveBtn.nativeElement, "d-none");
                    this.renderer.removeClass(this.firstSaveBtn.nativeElement, "d-none");
                    this.renderer.addClass(this.newFiltNameBox.nativeElement, "d-none");
                    this.newFilterName = '';
                },
                (error: any) => {
                    console.log(error);
                    alert("Возникла ошибка при сохранении");
                }
            );
        }
    }

    returnCustomForm() {
        this.filterTotal.filterType = 'custom';
        this.filterService.filter.next(this.filterTotal);
    }

    loadFilter(filter_id: string) {
        this.http.loadFilterFields(filter_id).subscribe(
            (data: any) => {
                this.filterTotal.filterLoaded = data;
                this.filterTotal.filterType = 'loaded';
                this.filterService.filter.next(this.filterTotal);
                this.filterService.makeSQLFilter(this.filterTotal);
            }
        );
    }

    exportXLS() {
        this.http.ExportExcel().subscribe(
            (data: any) => {
                console.log(data);
            }
        );
    }

}
