import { Component, ViewChild, Renderer2, OnInit, Injector, ApplicationRef, ComponentFactoryResolver, EmbeddedViewRef } from '@angular/core';

import { HttpService } from '../../services/http.service';
import { FilterService } from '../../services/filter.service';
import { UserService } from '../../services/user.service';
import { CookieService } from "angular2-cookie/core";

import { FilterModel } from '../../library/filter-model';
import { UserModel } from '../../library/user-model';

import { MessageComponent } from '../../components/helpers/helpers.component';



@Component({
    selector: 'root-app',
    templateUrl: './rootApp.html',
    styleUrls: ['../assets.css']
})
export class AppComponent implements OnInit {

    private filter: FilterModel = new FilterModel();
    private user: UserModel = new UserModel();

    private logged: boolean = false;
    private password: string;
    private login: string;
    private comp: string;
    private c_year: boolean = false;
    private c_mon: boolean = false;
    private c_day: boolean = false;
    private routeParams: any;

    private compR: any;


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
        private usrService: UserService,
        private filterService: FilterService,
        private componentFactoryResolver: ComponentFactoryResolver,
        private injector: Injector,
        private appRef: ApplicationRef
    ) {
        this.filter.form = '';
        let token = '';
        let target = '';
        
        this.routeParams = window.location.search.replace('?', '').split('&').reduce(
            function (p, e) {
                var a = e.split('=');
                p[decodeURIComponent(a[0])] = decodeURIComponent(a[1]);
                return p;
            },
            {}
        );

        if (Object.keys(this.routeParams).indexOf('secret') > -1) {
            token = this.routeParams['secret'];
            target = 'url';
        } else {
            if (this.cookie.get('eam_kp_t') !== undefined) {
                token = this.cookie.get('eam_kp_t');
            }
        }

        if (token !== '') {
            this.http.trySession(token).subscribe(
                (data: any) => {
                    if (data['result'] === 'Y') {
                        this.user = {
                            id: data["id"],
                            resps: data["resps"],
                            token: token
                        };
                        this.usrService.user.next(this.user);

                        this.cookie.put('eam_kp_t', token);
                        this.logged = true;
                        this.filterService.filter.subscribe(
                            (filt: FilterModel) => {
                                if (filt.ready) {
                                    this.filter = filt;
                                }
                            }
                        );
                    }
                }
            );
        }
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
        this.renderer.removeClass(this.warn.nativeElement, 'd-none');
        this.renderer.addClass(this.dang.nativeElement, 'd-none');
        this.http.singInUser(this.login, this.password).subscribe(
            (data: any[]) => {
                this.renderer.addClass(this.warn.nativeElement, 'd-none');
                if (data["result"] === "Y") {
                    this.renderer.removeClass(this.succ.nativeElement, 'd-none');
                    this.cookie.put('eam_kp_t', data["token"]);
                    this.user = {
                        id: data["id"],
                        resps: data["resps"],
                        token: data["token"]
                    };
                    this.usrService.user.next(this.user);
                    this.renderer.addClass(this.succ.nativeElement, 'd-none');
                    this.logged = true;
                } else {
                    this.renderer.removeClass(this.dang.nativeElement, 'd-none');
                    this.logged = false;
                }
            }
        );
    }
}