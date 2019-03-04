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
import { NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
var MonthComponent = /** @class */ (function () {
    function MonthComponent(filterService, route, http, calendar) {
        var _this = this;
        this.filterService = filterService;
        this.route = route;
        this.http = http;
        this.calendar = calendar;
        this.tmpDT = {};
        this.TotalData = [];
        this.CurrentData = [];
        this.emptyData = true;
        this.emptyModal = true;
        this.modalData = [];
        this.tHeadDays = [];
        this.targetChanged = {
            "hours": false,
            "startDate": false
        };
        this.querySubscription = route.queryParams.subscribe(function (queryParam) {
            if (queryParam['query'] !== undefined) {
                _this.tmpQuery = queryParam['query'];
            }
            else {
                var date = new Date();
                _this.tmpQuery = date.getFullYear().toString();
                _this.tmpQuery += "-" + (((+date.getMonth().toString() + 1).toString().length < 2) ? "0" + (+date.getMonth().toString() + 1).toString() : (+date.getMonth().toString() + 1).toString());
            }
            var sup = new Date(_this.tmpQuery + "-01").toLocaleString('ru', { month: 'long' });
            sup = sup + " " + new Date(_this.tmpQuery + "-01").getFullYear().toString();
            _this.title = sup[0].toUpperCase() + sup.substring(1);
            _this.getData(_this.tmpQuery);
        });
        this.modalData['title'] = "";
        this.modalData['porders'] = [];
    }
    MonthComponent.prototype.getData = function (query) {
        var _this = this;
        this.emptyData = true;
        this.TotalData = [];
        this.tHeadDays = [];
        this.CurrentData = [];
        this.http.getMonthData(query).subscribe(function (data) {
            var tmp = Object.keys(data).map(function (i) { return data[i]; });
            var i = 0;
            var _loop_1 = function (row) {
                var j = 0;
                var sum = 0;
                _this.TotalData.push(row);
                var cells = Object.keys(row['days']).map(function (i) { return row['days'][i]; });
                _this.TotalData[i]['days'] = cells;
                _this.tHeadDays = [];
                for (var _i = 0, cells_1 = cells; _i < cells_1.length; _i++) {
                    var cell = cells_1[_i];
                    if (cell['res'] !== "") {
                        sum += +cell['res'];
                    }
                    _this.TotalData[i]['days'][j]['title'] = cell['weekDD'] + ' ' + cell['monDD'] + ' ' + _this.title;
                    _this.TotalData[i]['days'][j]['target'] = _this.tmpQuery + '-' + cell['monDD'];
                    ++j;
                    _this.tHeadDays.push({
                        "monDD": cell['monDD'],
                        "weekDD": cell['weekDD'].toLowerCase(),
                        "target": _this.tmpQuery + '-' + cell['monDD'],
                        "title": cell['weekDD'] + ' ' + cell['monDD'] + ' ' + _this.title
                    });
                }
                _this.TotalData[i]['sum'] = sum;
                ++i;
            };
            for (var _i = 0, tmp_1 = tmp; _i < tmp_1.length; _i++) {
                var row = tmp_1[_i];
                _loop_1(row);
            }
            _this.CurrentData = _this.TotalData;
            _this.emptyData = false;
        });
    };
    MonthComponent.prototype.showPOrders = function (target, title, instance) {
        var _this = this;
        this.emptyModal = true;
        this.modalData['title'] = title;
        var cond = [];
        cond['date'] = target;
        if (typeof (instance) !== "undefined") {
            cond['instance'] = instance;
            this.modalData['title'] += " для агрегата № " + instance;
        }
        else {
            cond['instance'] = "";
        }
        this.http.getDataList('month', cond).subscribe(function (data) {
            _this.modalData['porders'] = Object.keys(data).map(function (i) { return data[i]; });
            _this.emptyModal = false;
        });
    };
    MonthComponent = __decorate([
        Component({
            selector: 'month-app',
            templateUrl: './monthTpl.html'
        }),
        __metadata("design:paramtypes", [FilterService, ActivatedRoute, HttpService, NgbCalendar])
    ], MonthComponent);
    return MonthComponent;
}());
export { MonthComponent };
//# sourceMappingURL=month.component.js.map