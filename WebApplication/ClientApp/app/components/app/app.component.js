var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, Renderer2 } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { FilterService } from '../../services/filter.service';
import { CookieService } from "angular2-cookie/core";
import { setTimeout } from 'timers';
var AppComponent = /** @class */ (function () {
    //@ViewChild('mimiLoader') mimiLoader: any;
    //@ViewChild('btnSingIn') btnSingIn: any;
    //private currentDate = {
    //    year: "",
    //    month: {
    //        name: "",
    //        number: ""
    //    },
    //    day: ""
    //};
    //model: NgbDateStruct;
    //startCalDay: NgbDateStruct;
    //private dateArray: any = {
    //    years: ["2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023"],
    //    monthes: [
    //        { name: "Январь", number: "01" },
    //        { name: "Февраль", number: "02" },
    //        { name: "Март", number: "03" },
    //        { name: "Апрель", number: "04" },
    //        { name: "Май", number: "05" },
    //        { name: "Июнь", number: "06" },
    //        { name: "Июль", number: "07" },
    //        { name: "Август", number: "08" },
    //        { name: "Сентябрь", number: "09" },
    //        { name: "Октябрь", number: "10" },
    //        { name: "Ноябрь", number: "11" },
    //        { name: "Декабрь", number: "12" },
    //    ],
    //    days: []
    //};
    function AppComponent(renderer, cookie, http, filterService) {
        var _this = this;
        this.renderer = renderer;
        this.cookie = cookie;
        this.http = http;
        this.filterService = filterService;
        //private year: string;
        //private month: string;
        //private date: string;
        this.logged = false;
        this.filterService.filter.subscribe(function (filt) {
            _this.filter = filt;
            switch (filt.form) {
                case 'year':
                    console.log(filt.form);
                    break;
                case 'mon':
                    console.log(filt.form);
                    break;
                case 'day':
                    console.log(filt.form);
                    break;
            }
        });
        var token;
        var flag = false;
        //if (!this.logged) {
        //    let cookt: string = this.cookie.get('eam_kp_t');
        //    this.querySubscription = this.route.queryParams.subscribe(
        //        (queryParam: any) => {
        //            token = queryParam['secret'];
        //            if (token !== undefined) {
        //                this.cookie.put('eam_kp_t', token);
        //                flag = true;
        //            } else {
        //                if (!this.logged && cookt !== undefined) {
        //                    this.http.trySession(cookt).subscribe(
        //                        (data: any[]) => {
        //                            if (data["result"] !== null) {
        //                                flag = true;
        //                            } else {
        //                                flag = false;
        //                            }
        //                        }
        //                    );
        //                }
        //            }
        //        }
        //    );
        //}
        setTimeout(function () {
            _this.logged = flag;
        }, 3000);
    }
    AppComponent.prototype.ngOnInit = function () {
    };
    AppComponent.prototype.signIn = function () {
        var _this = this;
        var flag;
        var valid;
        //res = this.user.userSignIn(this.login, this.password);
        this.http.singInUser(this.login, this.password).subscribe(function (data) {
            if (data["result"] === "Y") {
                _this.cookie.put('eam_kp_t', data["token"]);
                flag = true;
                valid = true;
            }
            else {
                flag = false;
                valid = false;
            }
        });
        setTimeout(function () {
            _this.logged = flag;
        }, 5000);
    };
    AppComponent = __decorate([
        Component({
            selector: 'root-app',
            templateUrl: './rootApp.html',
            styleUrls: ['../assets.css']
        }),
        __metadata("design:paramtypes", [Renderer2,
            CookieService,
            HttpService,
            FilterService])
    ], AppComponent);
    return AppComponent;
}());
export { AppComponent };
//# sourceMappingURL=app.component.js.map