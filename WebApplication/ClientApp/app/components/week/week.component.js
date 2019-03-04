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
        var _this = this;
        this.filterService = filterService;
        this.http = http;
        this.route = route;
        this.totalData = [];
        this.data = [];
        this.emptyData = true;
        this.modalData = [];
        this.emptyModal = true;
        this.querySubscription = route.queryParams.subscribe(function (queryParam) {
            _this.title = queryParam['query'];
            var tmp = new Date(queryParam['query']);
            tmp.setDate(tmp.getDate() + 6);
            var mon = (+tmp.getMonth() + 1).toString();
            if (mon.length === 1) {
                mon = '0' + mon.toString();
            }
            _this.titleFor = tmp.getFullYear() + '-' + mon + '-' + tmp.getDate();
            _this.getData(_this.title, _this.titleFor);
        });
    }
    WeekComponent.prototype.ngOnInit = function () {
        //this.filterService.filter.subscribe(filt => {
        //    this.filter = filt;
        //    let allow = true;
        //    this.data = [];
        //    this.totalData.forEach(element => {
        //        allow = true;
        //        if(filt.areaFilter.length>0 && filt.areaFilter!==element.area){
        //            allow = false;
        //        }
        //        if(filt.machinesFilter.length>0 && filt.machinesFilter!==element.operation){
        //            allow = false;
        //        }
        //        if(filt.dateFilter!==undefined){
        //            let tmpFiltDate = new Date(this.filter.dateFilter).valueOf();
        //            let tmpStartDate = new Date(element.dateStart).valueOf();
        //            let tmpEndDate = new Date(element.dateEnd).valueOf();
        //            if(tmpFiltDate<tmpStartDate || tmpFiltDate>tmpEndDate){
        //                allow = false;
        //            }
        //        }
        //        if(allow){
        //            this.data.push(element);
        //        }
        //    });
        //});
    };
    WeekComponent.prototype.getData = function (start, end) {
        var _this = this;
        this.emptyData = true;
        this.http.getWeekData(start, end).subscribe(function (data) {
            var rows = Object.keys(data).map(function (i) { return data[i]; });
            var ind = 0;
            var year = new Date(_this.title).getFullYear().toString();
            var _loop_1 = function (row) {
                //row["dname"] += " " + year;
                var tmp = Object.keys(row["porders"]).map(function (i) { return row["porders"][i]; });
                rows[ind]['porders'] = tmp;
                ++ind;
            };
            for (var _i = 0, rows_1 = rows; _i < rows_1.length; _i++) {
                var row = rows_1[_i];
                _loop_1(row);
            }
            _this.totalData = _this.data = rows;
            console.log(_this.totalData);
            _this.emptyData = false;
        });
    };
    WeekComponent.prototype.showPOrders = function (target, title, instance) {
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