import { Component, OnInit, Renderer2, ViewChild, Input } from '@angular/core';
import { FilterService } from '../../services/filter.service';
import { HttpService } from '../../services/http.service';
import { FilterModel } from '../../library/filter-model';
import { SelConf } from '../../library/sel-conf';

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

    private conf_org: SelConf = new SelConf("ORGANIZATION_NAME");
    private conf_agr: SelConf = new SelConf("INSTANCE_NUMBER");
    private conf_wt: SelConf = new SelConf("ROUTING_COMMENT");
    private conf_stat: SelConf = new SelConf("MEANING");

    public filterTotal: FilterModel;


    constructor(private http: HttpService, private filterService: FilterService, private renderer: Renderer2) {

        //supports
        let date = new Date();
        this.filterService.filter.subscribe(filt => {
            this.filterTotal = filt;
            this.http.getCountOfRows(this.filterService.makeSQLFilter(filt)).subscribe(
                (data: any) => {
                    this.cnt = data[0]['CNT'];
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
                            this.renderer.addClass(this.loader.nativeElement, 'd-none');
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
                            this.renderer.addClass(this.loader.nativeElement, 'd-none');
                        }
                    );
                }
                break;
            case 'wt':
                this.filterTotal.wtype = val.value;
                this.renderer.addClass(this.loader.nativeElement, 'd-none');
                break;
            case 'mon':
                this.days = [];
                let date = new Date(parseInt(this.filterTotal.period.year), (parseInt(this.filterTotal.period.month)-1), 32);
                for (let i = 1; i <= (32 - date.getDate()); ++i) {
                    let d = (i.toString().length > 1) ? i.toString() : '0' + i.toString();
                    this.days.push({ num: d, name: d });
                }
                this.renderer.addClass(this.loader.nativeElement, 'd-none');
                break;
            case 'stat':
                this.filterTotal.status = val.value;
                this.renderer.addClass(this.loader.nativeElement, 'd-none');
                break;
            case 'year':
                this.renderer.addClass(this.loader.nativeElement, 'd-none');
                break;
            case 'day':
                this.renderer.addClass(this.loader.nativeElement, 'd-none');
                break;
            case 'form':
                this.renderer.addClass(this.loader.nativeElement, 'd-none');
                break;
            case 'planner':
                this.renderer.addClass(this.loader.nativeElement, 'd-none');
                break;
        }

        this.filterService.filter.next(this.filterTotal);
    }

    /*inp(source?: string) {
        switch (source) {
            case 'area':
                this.filterTotal.agr = '';
                this.filterTotal.wtype = '';
                this.agregates = [];
                this.routing_sequences = [];
                if (this.filterTotal.org_filter !== '') {
                    this.http.getAgrs(this.filterTotal.org_filter.toString()).subscribe(
                        (data: any[]) => {
                            this.agregates = Object.keys(data).map(i => data[i]);
                        }
                    );
                }
                break;
            case 'agr':
                this.filterTotal.wt_filter = '';
                this.routing_sequences = [];
                if (this.filterTotal.agr_filter !== '') {
                    this.http.geTK(this.filterTotal.agr_filter).subscribe(
                        (data: any[]) => {
                            let tmp = Object.keys(data).map(i => data[i]);
                            for (let row of tmp) {
                                let sup = row.ROUTING_COMMENT.split(":");
                                this.routing_sequences.push(sup[0]);
                            }
                        }
                    );
                }
                break;
        }
        this.filterService.filter.next(this.filterTotal);
    }*/

}
