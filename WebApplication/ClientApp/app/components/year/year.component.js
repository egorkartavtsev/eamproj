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
import { ProdOrder } from '../../library/prod-order.lib';
import { HttpService } from '../../services/http.service';
import { ActivatedRoute } from '@angular/router';
var YearComponent = /** @class */ (function () {
    function YearComponent(filterService, http, route) {
        var _this = this;
        this.filterService = filterService;
        this.http = http;
        this.route = route;
        this.TotalData = [];
        this.CurrentData = [];
        this.modalData = [];
        this.currentPO = new ProdOrder;
        this.emptyData = true;
        this.emptyModal = true;
        this.tmpDT = {};
        this.targetChanged = {
            "hours": false,
            "startDate": false
        };
        this.monthes = [
            { "mon": "01", "num": "Январь" },
            { "mon": "02", "num": "Февраль" },
            { "mon": "03", "num": "Март" },
            { "mon": "04", "num": "Апрель" },
            { "mon": "05", "num": "Май" },
            { "mon": "06", "num": "Июнь" },
            { "mon": "07", "num": "Июль" },
            { "mon": "08", "num": "Август" },
            { "mon": "09", "num": "Сентябрь" },
            { "mon": "10", "num": "Октябрь" },
            { "mon": "11", "num": "Ноябрь" },
            { "mon": "12", "num": "Декабрь" }
        ];
        this.querySubscription = route.queryParams.subscribe(function (queryParam) {
            if (queryParam['query'] !== undefined) {
                _this.title = queryParam['query'];
            }
            else {
                _this.title = new Date().getFullYear().toString();
            }
            _this.getData(_this.title);
        });
    }
    YearComponent.prototype.ngOnInit = function () { };
    YearComponent.prototype.getData = function (query) {
        var _this = this;
        console.log("Данные пусты");
        this.emptyData = true;
        this.http.getYearData(query).subscribe(function (data) {
            console.log("===========clear data from db=============");
            console.log(data);
            console.log("***********clear data from db*************");
            var tmp = Object.keys(data).map(function (i) { return data[i]; });
            _this.TotalData = [];
            var i = 0;
            var _loop_1 = function (row) {
                var j = 0;
                var sup = [];
                var sum = 0;
                _this.TotalData.push(row);
                var cells = Object.keys(row['decadas']).map(function (i) { return row['decadas'][i]; });
                _this.TotalData[i]['decadas'] = cells;
                for (var _i = 0, cells_1 = cells; _i < cells_1.length; _i++) {
                    var cell = cells_1[_i];
                    if (cell['val'] == "") {
                        _this.TotalData[i]['decadas'][j] = cell;
                    }
                    else {
                        _this.TotalData[i]['decadas'][j]['val'] = (cell['val'] % 24) ? (cell['val'] / 24).toFixed(2) : (cell['val'] / 24);
                        _this.TotalData[i]['decadas'][j]['class'] = cell['class'];
                        _this.TotalData[i]['decadas'][j]['tarM'] = cell['tarM'];
                        _this.TotalData[i]['decadas'][j]['tarD'] = cell['tarD'];
                        sum += +cell['val'];
                    }
                    ++j;
                }
                _this.TotalData[i]['sum'] = ((sum * 100) % 100) ? sum.toFixed(2) : sum;
                ++i;
            };
            for (var _i = 0, tmp_1 = tmp; _i < tmp_1.length; _i++) {
                var row = tmp_1[_i];
                _loop_1(row);
            }
            console.log("Заполнено");
            _this.CurrentData = _this.TotalData;
            _this.emptyData = false;
        }, function (error) { console.log(error); });
    };
    YearComponent.prototype.showPOList = function (mon, dec, instance) {
        var _this = this;
        var range = {};
        this.emptyModal = true;
        var date = new Date(+this.title, +mon, 0);
        switch (dec) {
            case "01":
                range = {
                    "start": this.title + "-" + mon + "-01",
                    "end": this.title + "-" + mon + "-10"
                };
                break;
            case "02":
                range = {
                    "start": this.title + "-" + mon + "-11",
                    "end": this.title + "-" + mon + "-20"
                };
                break;
            case "03":
                range = {
                    "start": this.title + "-" + mon + "-21",
                    "end": this.title + "-" + mon + "-" + date.getDate()
                };
                break;
            default:
                range = {
                    "start": this.title + "-" + mon + "-01",
                    "end": this.title + "-" + mon + "-" + date.getDate()
                };
                break;
        }
        this.modalData['title'] = "ПЗ с " + range['start'] + " по " + range['end'];
        var cond = [];
        cond['weekend'] = range['end'];
        cond['weekstart'] = range['start'];
        if (typeof (instance) !== "undefined") {
            cond['instance'] = instance;
            this.modalData['title'] += " для агрегата №" + instance;
        }
        else {
            cond['instance'] = "";
        }
        this.http.getDataList('year', cond).subscribe(function (data) {
            _this.modalData['porders'] = Object.keys(data).map(function (i) { return data[i]; });
            _this.emptyModal = false;
        });
    };
    YearComponent.prototype.onSaved = function () {
        this.getData(this.title);
    };
    YearComponent = __decorate([
        Component({
            selector: 'year-app',
            templateUrl: './yearTpl.html',
            styles: ['']
        }),
        __metadata("design:paramtypes", [FilterService,
            HttpService,
            ActivatedRoute])
    ], YearComponent);
    return YearComponent;
}());
export { YearComponent };
//# sourceMappingURL=year.component.js.map