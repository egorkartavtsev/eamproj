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
import { FilterModel } from '../../library/filter-model';
import { CookieService } from "angular2-cookie/core";
import { setTimeout } from 'timers';
var AppComponent = /** @class */ (function () {
    function AppComponent(renderer, cookie, http, filterService, route) {
        var _this = this;
        this.renderer = renderer;
        this.cookie = cookie;
        this.http = http;
        this.filterService = filterService;
        this.route = route;
        this.filter = new FilterModel();
        this.logged = false;
        this.c_year = false;
        this.c_mon = false;
        this.c_day = false;
        this.filter.form = '';
        var token;
        var flag = false;
        if (!this.logged) {
            var cookt_1 = this.cookie.get('eam_kp_t');
            this.route.queryParams.subscribe(function (queryParam) {
                token = queryParam['secret'];
                if (token !== undefined) {
                    _this.renderer.addClass(_this.warn.nativeElement, 'd-none');
                    _this.renderer.removeClass(_this.succ.nativeElement, 'd-none');
                    _this.cookie.put('eam_kp_t', token);
                    flag = true;
                }
                else {
                    if (!_this.logged && cookt_1 !== 'undefined') {
                        _this.http.trySession(cookt_1).subscribe(function (data) {
                            if (data["result"] !== null) {
                                _this.renderer.addClass(_this.warn.nativeElement, 'd-none');
                                _this.renderer.removeClass(_this.succ.nativeElement, 'd-none');
                                flag = true;
                            }
                            else {
                                flag = false;
                                _this.renderer.addClass(_this.warn.nativeElement, 'd-none');
                            }
                        });
                    }
                }
            });
        }
        setTimeout(function () {
            _this.logged = flag;
            _this.renderer.addClass(_this.succ.nativeElement, 'd-none');
            _this.filterService.filter.subscribe(function (filt) {
                if (filt.ready) {
                    _this.filter = filt;
                }
            });
        }, 4000);
    }
    AppComponent.prototype.ngOnInit = function () {
    };
    AppComponent.prototype.signIn = function () {
        var _this = this;
        var flag;
        //res = this.user.userSignIn(this.login, this.password);
        this.renderer.removeClass(this.warn.nativeElement, 'd-none');
        this.renderer.addClass(this.dang.nativeElement, 'd-none');
        this.http.singInUser(this.login, this.password).subscribe(function (data) {
            //                console.log(data);
            _this.renderer.addClass(_this.warn.nativeElement, 'd-none');
            if (data["result"] === "Y") {
                _this.renderer.removeClass(_this.succ.nativeElement, 'd-none');
                _this.cookie.put('eam_kp_t', data["token"]);
                _this.cookie.put('eam_kp_uid', data["userId"]);
                flag = true;
            }
            else {
                _this.renderer.removeClass(_this.dang.nativeElement, 'd-none');
                flag = false;
            }
        });
        setTimeout(function () {
            _this.logged = flag;
            _this.renderer.addClass(_this.succ.nativeElement, 'd-none');
        }, 5500);
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
    AppComponent = __decorate([
        Component({
            selector: 'root-app',
            templateUrl: './rootApp.html',
            styleUrls: ['../assets.css']
        }),
        __metadata("design:paramtypes", [Renderer2,
            CookieService,
            HttpService,
            FilterService,
            ActivatedRoute])
    ], AppComponent);
    return AppComponent;
}());
export { AppComponent };
//# sourceMappingURL=app.component.js.map