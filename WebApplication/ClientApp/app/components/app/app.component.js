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
import { Router } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { ActivatedRoute } from '@angular/router';
import { CookieService } from "angular2-cookie/core";
import { setTimeout } from 'timers';
var AppComponent = /** @class */ (function () {
    function AppComponent(router, route, renderer, cookie, http) {
        var _this = this;
        this.router = router;
        this.route = route;
        this.renderer = renderer;
        this.cookie = cookie;
        this.http = http;
        this.logged = false;
        this.currentDate = {
            year: "",
            month: {
                name: "",
                number: ""
            },
            day: ""
        };
        this.dateArray = {
            years: ["2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023"],
            monthes: [
                { name: "Январь", number: "01" },
                { name: "Февраль", number: "02" },
                { name: "Март", number: "03" },
                { name: "Апрель", number: "04" },
                { name: "Май", number: "05" },
                { name: "Июнь", number: "06" },
                { name: "Июль", number: "07" },
                { name: "Август", number: "08" },
                { name: "Сентябрь", number: "09" },
                { name: "Октябрь", number: "10" },
                { name: "Ноябрь", number: "11" },
                { name: "Декабрь", number: "12" },
            ],
            days: []
        };
        var token;
        var flag = false;
        if (!this.logged) {
            var cookt_1 = this.cookie.get('eam_kp_t');
            this.querySubscription = this.route.queryParams.subscribe(function (queryParam) {
                token = queryParam['secret'];
                if (token !== undefined) {
                    _this.cookie.put('eam_kp_t', token);
                    flag = true;
                }
                else {
                    if (!_this.logged && cookt_1 !== undefined) {
                        _this.http.trySession(cookt_1).subscribe(function (data) {
                            console.log(data);
                            if (data["result"] !== null) {
                                flag = true;
                            }
                            else {
                                flag = false;
                            }
                        });
                    }
                }
            });
        }
        setTimeout(function () {
            _this.logged = flag;
        }, 3000);
    }
    AppComponent.prototype.ngOnInit = function () {
        var date = new Date();
        this.year = date.getFullYear().toString();
        this.month = (+date.getMonth().toString() + 1).toString();
        this.date = date.getDate().toString();
        this.model = this.startCalDay = { year: date.getFullYear(), month: (+date.getMonth() + 1), day: date.getDate() };
        // заполнить структуру dateArray значениями для годов, месяцев и дней. Дни зависят от месяца
        this.currentDate = {
            year: date.getFullYear().toString(),
            month: {
                name: "",
                number: ((+date.getMonth() + 1).toString().length < 2) ? "0" + (+date.getMonth() + 1).toString() : (+date.getMonth() + 1).toString()
            },
            day: date.getDate().toString()
        };
        for (var _i = 0, _a = this.dateArray.monthes; _i < _a.length; _i++) {
            var mon = _a[_i];
            if (mon.number === this.currentDate.month.number) {
                this.currentDate.month.name = mon.name;
            }
        }
        for (var i = 1; i <= (32 - new Date(date.getFullYear(), date.getMonth(), 32).getDate()); i++) {
            this.dateArray.days.push((i.toString().length < 2) ? "0" + i : i.toString());
        }
    };
    AppComponent.prototype.signIn = function () {
        var _this = this;
        var flag;
        var valid;
        this.renderer.removeClass(this.mimiLoader.nativeElement, 'd-none');
        //res = this.user.userSignIn(this.login, this.password);
        this.http.singInUser(this.login, this.password).subscribe(function (data) {
            if (data["result"] === "Y") {
                _this.cookie.put('eam_kp_t', data["token"]);
                flag = true;
                valid = true;
                _this.renderer.addClass(_this.mimiLoader.nativeElement, 'btn-success');
                _this.renderer.removeClass(_this.mimiLoader.nativeElement, 'btn-danger');
            }
            else {
                flag = false;
                valid = false;
                _this.renderer.addClass(_this.mimiLoader.nativeElement, 'btn-danger');
                _this.renderer.removeClass(_this.mimiLoader.nativeElement, 'btn-success');
            }
        });
        setTimeout(function () {
            _this.logged = flag;
        }, 5000);
        if (this.logged) {
            this.renderer.addClass(this.mimiLoader.nativeElement, 'd-none');
        }
    };
    AppComponent.prototype.updateDate = function (target, value) {
        var dCount;
        switch (target) {
            case "year":
                this.currentDate.year = value;
                dCount = 32 - new Date(+value, (+this.currentDate.month.number - 1), 32).getDate();
                this.dateArray.days = [];
                for (var i = 1; i <= dCount; i++) {
                    this.dateArray.days.push((i.toString().length < 2) ? "0" + i : i.toString());
                }
                break;
            case "month":
                this.currentDate.month.number = value;
                for (var _i = 0, _a = this.dateArray.monthes; _i < _a.length; _i++) {
                    var mon = _a[_i];
                    if (mon.number === value) {
                        this.currentDate.month.name = mon.name;
                    }
                }
                dCount = 32 - new Date(+this.currentDate.month.number, (+value - 1), 32).getDate();
                this.dateArray.days = [];
                for (var i = 1; i <= dCount; i++) {
                    this.dateArray.days.push((i.toString().length < 2) ? "0" + i : i.toString());
                }
                break;
            case "day":
                this.currentDate.day = value;
                break;
        }
    };
    AppComponent.prototype.goTo = function (report) {
        console.log(this.currentDate);
        console.log(report);
        var queryparam = {};
        switch (report) {
            case 'year':
                queryparam = {
                    query: this.currentDate.year
                };
                break;
            case 'month':
                queryparam = {
                    query: this.currentDate.year + '-' + this.currentDate.month.number
                };
                break;
            case 'week':
                queryparam = {
                    query: this.currentDate.year + '-' + this.currentDate.month.number + '-' + this.currentDate.day
                };
                break;
        }
        this.router.navigate([report], {
            queryParams: queryparam
        });
    };
    __decorate([
        ViewChild('mimiLoader'),
        __metadata("design:type", Object)
    ], AppComponent.prototype, "mimiLoader", void 0);
    __decorate([
        ViewChild('btnSingIn'),
        __metadata("design:type", Object)
    ], AppComponent.prototype, "btnSingIn", void 0);
    AppComponent = __decorate([
        Component({
            selector: 'root-app',
            templateUrl: './rootApp.html',
            styleUrls: ['../assets.css']
        }),
        __metadata("design:paramtypes", [Router,
            ActivatedRoute,
            Renderer2,
            CookieService,
            HttpService])
    ], AppComponent);
    return AppComponent;
}());
export { AppComponent };
//# sourceMappingURL=app.component.js.map