import { Component, ViewChild, Renderer2, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { FilterService } from '../../services/filter.service';
import { FilterModel } from '../../library/filter-model';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { forEach } from '@angular/router/src/utils/collection';
import { Subscription } from 'rxjs';
import { CookieService } from "angular2-cookie/core";
import { setTimeout } from 'timers';

@Component({
    selector: 'root-app',
    templateUrl: './rootApp.html',
    styleUrls: ['../assets.css']
})
export class AppComponent implements OnInit {

    private filter: FilterModel = new FilterModel();

    private logged: boolean = false;
    private password: string;
    private login: string;
    private comp: string;
    private c_year: boolean = false;
    private c_mon: boolean = false;
    private c_day: boolean = false;


    @ViewChild('succ') succ: any;
    @ViewChild('dang') dang: any;
    @ViewChild('info') info: any;
    @ViewChild('warn') warn: any;
    @ViewChild('showflt') showflt: any;
    @ViewChild('hideflt') hideflt: any;


    constructor(
        private renderer: Renderer2,
        private cookie: CookieService,
        private http: HttpService,
        private filterService: FilterService,
        private route: ActivatedRoute
    ) {
        this.filter.form = '';
        let token;
        let flag: boolean = false;
        if (!this.logged) {
            let cookt: string = this.cookie.get('eam_kp_t');
            this.route.queryParams.subscribe(
                (queryParam: any) => {
                    token = queryParam['secret'];
                    if (token !== undefined) {
                        this.renderer.addClass(this.warn.nativeElement, 'd-none');
                        this.renderer.removeClass(this.succ.nativeElement, 'd-none');
                        this.cookie.put('eam_kp_t', token);
                        flag = true;
                    } else {
                        if (!this.logged && cookt !== 'undefined') {
                            this.http.trySession(cookt).subscribe(
                                (data: any[]) => {
                                    if (data["result"] !== null) {
                                        this.renderer.addClass(this.warn.nativeElement, 'd-none');
                                        this.renderer.removeClass(this.succ.nativeElement, 'd-none');
                                        flag = true;
                                    } else {
                                        flag = false;
                                        this.renderer.addClass(this.warn.nativeElement, 'd-none');
                                    }
                                }
                            );
                        }
                    }

                }
            );
        }
        setTimeout(() => {
            this.logged = flag;
            this.renderer.addClass(this.succ.nativeElement, 'd-none');
            this.filterService.filter.subscribe(
                (filt: FilterModel) => {
                    if (filt.ready) {
                        this.filter = filt;
                    }
                }
            );
        }, 4000);
    }

    ngOnInit() {
        
    }

    tootgleFlt() {
        $('#flt-box').slideToggle('slow');
        if (this.hideflt.nativeElement.className.indexOf('d-none') > 0) {
            this.renderer.addClass(this.showflt.nativeElement, 'd-none');
            this.renderer.removeClass(this.hideflt.nativeElement, 'd-none');
        } else {
            this.renderer.addClass(this.hideflt.nativeElement, 'd-none');
            this.renderer.removeClass(this.showflt.nativeElement, 'd-none');
        }
    }

    updateFilter() {
        this.filterService.filter.next(this.filter);
    }

    signIn() {
        let flag: boolean;
        //res = this.user.userSignIn(this.login, this.password);
        this.renderer.removeClass(this.warn.nativeElement, 'd-none');
        this.renderer.addClass(this.dang.nativeElement, 'd-none');
        this.http.singInUser(this.login, this.password).subscribe(
            (data: any[]) => {
//                console.log(data);
                this.renderer.addClass(this.warn.nativeElement, 'd-none');
                if (data["result"] === "Y") {
                    this.renderer.removeClass(this.succ.nativeElement, 'd-none');
                    this.cookie.put('eam_kp_t', data["token"]);
                    this.cookie.put('eam_kp_uid', data["userId"]);
                    flag = true;
                } else {
                    this.renderer.removeClass(this.dang.nativeElement, 'd-none');
                    flag = false;
                }
            }
        );
        setTimeout(() => {
            this.logged = flag;
            this.renderer.addClass(this.succ.nativeElement, 'd-none');
        }, 5500);
    }

}