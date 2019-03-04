var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { Router } from '@angular/router';
// import {ActivatedRoute} from '@angular/router';
// import {Subscription} from 'rxjs';
var AppComponent = /** @class */ (function () {
    function AppComponent(router) {
        this.router = router;
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
    }
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
    AppComponent = __decorate([
        Component({
            selector: 'root-app',
            templateUrl: './rootApp.html',
            styleUrls: ['../assets.css']
        }),
        __metadata("design:paramtypes", [Router])
    ], AppComponent);
    return AppComponent;
}());
export { AppComponent };
//# sourceMappingURL=app.component.js.map