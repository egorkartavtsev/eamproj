var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ViewChild, Renderer2 } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { FilterService } from '../../services/filter.service';
import { UserService } from '../../services/user.service';
import { FilterModel } from '../../library/filter-model';
import { UserModel } from '../../library/user-model';
import { CookieService } from "angular2-cookie/core";
var AppComponent = /** @class */ (function () {
    function AppComponent(renderer, cookie, http, usrService, filterService, route) {
        var _this = this;
        this.renderer = renderer;
        this.cookie = cookie;
        this.http = http;
        this.usrService = usrService;
        this.filterService = filterService;
        this.route = route;
        this.filter = new FilterModel();
        this.user = new UserModel();
        this.logged = false;
        this.c_year = false;
        this.c_mon = false;
        this.c_day = false;
        this.filter.form = '';
        var token = '';
        var target = '';
        this.routeParams = window.location.search.replace('?', '').split('&').reduce(function (p, e) {
            var a = e.split('=');
            p[decodeURIComponent(a[0])] = decodeURIComponent(a[1]);
            return p;
        }, {});
        if (Object.keys(this.routeParams).indexOf('secret') > -1) {
            token = this.routeParams['secret'];
            target = 'url';
        }
        else {
            if (this.cookie.get('eam_kp_t') !== undefined) {
                token = this.cookie.get('eam_kp_t');
            }
        }
        if (token !== '') {
            this.http.trySession(token).subscribe(function (data) {
                if (data['result'] === 'Y') {
                    _this.user = {
                        id: data["id"],
                        resps: data["resps"],
                        token: token
                    };
                    _this.usrService.user.next(_this.user);
                    _this.cookie.put('eam_kp_t', token);
                    _this.logged = true;
                    _this.filterService.filter.subscribe(function (filt) {
                        if (filt.ready) {
                            _this.filter = filt;
                        }
                    });
                }
            });
        }
    }
    AppComponent.prototype.ngOnInit = function () {
    };
    AppComponent.prototype.tootgleFlt = function () {
        $('#flt-box').slideToggle('slow');
        if (this.hideflt.nativeElement.className.indexOf('d-none') > 0) {
            this.renderer.addClass(this.showflt.nativeElement, 'd-none');
            this.renderer.removeClass(this.hideflt.nativeElement, 'd-none');
        }
        else {
            this.renderer.addClass(this.hideflt.nativeElement, 'd-none');
            this.renderer.removeClass(this.showflt.nativeElement, 'd-none');
        }
    };
    AppComponent.prototype.updateFilter = function () {
        this.filterService.filter.next(this.filter);
    };
    AppComponent.prototype.signIn = function () {
        var _this = this;
        this.renderer.removeClass(this.warn.nativeElement, 'd-none');
        this.renderer.addClass(this.dang.nativeElement, 'd-none');
        this.http.singInUser(this.login, this.password).subscribe(function (data) {
            _this.renderer.addClass(_this.warn.nativeElement, 'd-none');
            if (data["result"] === "Y") {
                _this.renderer.removeClass(_this.succ.nativeElement, 'd-none');
                _this.cookie.put('eam_kp_t', data["token"]);
                _this.user = {
                    id: data["id"],
                    resps: data["resps"],
                    token: data["token"]
                };
                _this.usrService.user.next(_this.user);
                _this.renderer.addClass(_this.succ.nativeElement, 'd-none');
                _this.logged = true;
            }
            else {
                _this.renderer.removeClass(_this.dang.nativeElement, 'd-none');
                _this.logged = false;
            }
        });
    };
    __decorate([
        ViewChild('succ'),
        __metadata("design:type", Object)
    ], AppComponent.prototype, "succ", void 0);
    __decorate([
        ViewChild('dang'),
        __metadata("design:type", Object)
    ], AppComponent.prototype, "dang", void 0);
    __decorate([
        ViewChild('info'),
        __metadata("design:type", Object)
    ], AppComponent.prototype, "info", void 0);
    __decorate([
        ViewChild('warn'),
        __metadata("design:type", Object)
    ], AppComponent.prototype, "warn", void 0);
    __decorate([
        ViewChild('showflt'),
        __metadata("design:type", Object)
    ], AppComponent.prototype, "showflt", void 0);
    __decorate([
        ViewChild('hideflt'),
        __metadata("design:type", Object)
    ], AppComponent.prototype, "hideflt", void 0);
    AppComponent = __decorate([
        Component({
            selector: 'root-app',
            templateUrl: './rootApp.html',
            styleUrls: ['../assets.css']
        }),
        __metadata("design:paramtypes", [Renderer2,
            CookieService,
            HttpService,
            UserService,
            FilterService,
            ActivatedRoute])
    ], AppComponent);
    return AppComponent;
}());
export { AppComponent };
//# sourceMappingURL=app.component.js.map