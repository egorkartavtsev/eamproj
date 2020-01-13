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
import { FilterService } from '../../services/filter.service';
import { HttpService } from '../../services/http.service';
import { ActivatedRoute } from '@angular/router';
var WeekComponent = /** @class */ (function () {
    function WeekComponent(filterService, http, route) {
        this.filterService = filterService;
        this.http = http;
        this.route = route;
        this.totalData = [];
        this.data = [];
        this.emptyData = true;
        this.modalData = [];
        this.emptyModal = true;
        //this.querySubscription = route.queryParams.subscribe(
        //    (queryParam: any) => {
        //        this.title = queryParam['query'];
        //        let tmp = new Date(queryParam['query']);
        //        tmp.setDate(tmp.getDate() + 6);
        //        let mon = (+tmp.getMonth() + 1).toString();
        //        if (mon.length === 1) { mon = '0' + mon.toString(); }
        //        this.titleFor = tmp.getFullYear() + '-' + mon + '-' + tmp.getDate();
        //        this.getData(this.title, this.titleFor);
        //    }
        //);
    }
    WeekComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.filterService.filter.subscribe(function (filt) {
            _this.filter = filt;
            var sup1 = new Date(_this.filter.period.year + '-' + _this.filter.period.month + '-' + _this.filter.period.day);
            var sup = sup1.toLocaleString('ru', { weekday: 'long' });
            _this.title = sup[0].toUpperCase() + sup.substring(1) + ' ' + _this.filter.period.day + '.' + _this.filter.period.month + '.' + _this.filter.period.year;
            sup1.setDate(sup1.getDate() + 6);
            var mon = (+sup1.getMonth() + 1).toString();
            if (mon.length === 1) {
                mon = '0' + mon.toString();
            }
            _this.titleFor = sup1.toLocaleString('ru', { weekday: 'long' })[0].toUpperCase() + sup1.toLocaleString('ru', { weekday: 'long' }).substring(1) + ' ' + sup1.getDate() + '.' + mon + '.' + sup1.getFullYear();
            _this.getData();
        });
    };
    WeekComponent.prototype.getData = function () {
        var _this = this;
        this.emptyData = true;
        this.http.getWeekData(this.filterService.makeSQLFilter(this.filter)).subscribe(function (data) {
            var rows = Object.keys(data).map(function (i) { return data[i]; });
            var ind = 0;
            var _loop_1 = function (row) {
                var tmp = Object.keys(row["porders"]).map(function (i) { return row["porders"][i]; });
                rows[ind]['porders'] = tmp;
                ++ind;
            };
            for (var _i = 0, rows_1 = rows; _i < rows_1.length; _i++) {
                var row = rows_1[_i];
                _loop_1(row);
            }
            _this.totalData = _this.data = rows;
            _this.emptyData = false;
        });
    };
    WeekComponent.prototype.showPOrders = function (target, title, instance) {
        var _this = this;
        this.emptyModal = true;
        this.modalData['title'] = title;
        this.modalData['target'] = target;
        var cond = [];
        cond['date'] = target;
        if (typeof (instance) !== "undefined") {
            cond['instance'] = "= '" + instance + "'";
            this.modalData['title'] += " для агрегата № " + instance;
        }
        else {
            cond['instance'] = "LIKE '%'";
        }
        this.http.getDataList('month', cond, this.filterService.makeSQLFilter(this.filter)).subscribe(function (data) {
            _this.modalData['porders'] = Object.keys(data).map(function (i) { return data[i]; });
            _this.emptyModal = false;
        });
    };
    WeekComponent = __decorate([
        Component({
            selector: 'week-app',
            templateUrl: './weekTpl.html'
        }),
        __metadata("design:paramtypes", [FilterService,
            HttpService,
            ActivatedRoute])
    ], WeekComponent);
    return WeekComponent;
}());
export { WeekComponent };
//# sourceMappingURL=week.component.js.map