var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Renderer2, ViewChild, Component } from '@angular/core';
import { FilterService } from '../../services/filter.service';
import { HttpService } from '../../services/http.service';
import { ActivatedRoute } from '@angular/router';
import { NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
var MonthComponent = /** @class */ (function () {
    /********************************************************/
    function MonthComponent(renderer, filterService, route, http, calendar) {
        var _this = this;
        this.renderer = renderer;
        this.filterService = filterService;
        this.route = route;
        this.http = http;
        this.calendar = calendar;
        this.tmpDT = {};
        this.TotalData = [];
        this.CurrentData = [];
        this.emptyData = true;
        this.emptyModal = true;
        this.warn = false;
        this.modalData = [];
        this.tHeadDays = [];
        this.targetChanged = {
            "hours": false,
            "startDate": false
        };
        this.curPage = 0;
        /********************************************************/
        this.currentCount = 0;
        this.needCount = '20';
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
            _this.getData();
            _this.http.getCountOfRows(_this.tmpQuery, '1').subscribe(function (data) {
                _this.totalCount = data[0]['CNT'];
            });
        });
        this.modalData['title'] = "";
        this.modalData['porders'] = [];
    }
    MonthComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.filterService.filter.subscribe(function (filt) {
            _this.filter = filt;
            _this.CurrentData = [];
            for (var _i = 0, _a = _this.TotalData; _i < _a.length; _i++) {
                var order = _a[_i];
                if (_this.filterService.applyFilter(filt, order)) {
                    _this.CurrentData.push(order);
                }
            }
            if (_this.filter.agr_filter == '' && _this.filter.org_filter == '' && _this.filter.planner_filter == '' && _this.filter.wt_filter == '') {
                _this.warn = false;
            }
            else {
                _this.warn = true;
            }
        });
    };
    MonthComponent.prototype.getData = function () {
        var _this = this;
        this.emptyData = true;
        this.modalData = [];
        var query = this.tmpQuery;
        if (typeof (this.modalData['title']) !== "undefined") {
            this.showPOrders(this.modalData['target'], this.modalData['title'], this.modalData['instance']);
        }
        this.TotalData = [];
        this.tHeadDays = [];
        this.CurrentData = [];
        this.http.getMonthData(query, this.curPage.toString(), this.needCount, this.currentCount.toString()).subscribe(function (data) {
            var tmp = _this.getRows(data);
            _this.TotalData = tmp;
            for (var _i = 0, _a = _this.TotalData; _i < _a.length; _i++) {
                var order = _a[_i];
                if (_this.filterService.applyFilter(_this.filter, order)) {
                    _this.CurrentData.push(order);
                }
            }
            _this.currentCount = _this.TotalData.length;
            _this.emptyData = false;
            _this.tryBtn(tmp.length);
        });
    };
    MonthComponent.prototype.showPOrders = function (target, title, instance) {
        var _this = this;
        this.emptyModal = true;
        this.modalData['title'] = title;
        this.modalData['target'] = target;
        var cond = [];
        cond['date'] = target;
        if (typeof (instance) !== "undefined") {
            cond['instance'] = instance;
            this.modalData['instance'] = instance;
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
    MonthComponent.prototype.fetchData = function () {
        var _this = this;
        this.renderer.setAttribute(this.fetchBtn.nativeElement, 'disabled', 'disabled');
        this.renderer.removeClass(this.mimiLoader.nativeElement, 'd-none');
        ++this.curPage;
        this.modalData = [];
        this.http.getMonthData(this.tmpQuery, this.curPage.toString(), this.needCount, this.currentCount.toString()).subscribe(function (data) {
            var tmp = _this.getRows(data);
            Array.prototype.push.apply(_this.TotalData, tmp);
            for (var _i = 0, tmp_1 = tmp; _i < tmp_1.length; _i++) {
                var order = tmp_1[_i];
                if (_this.filterService.applyFilter(_this.filter, order)) {
                    _this.CurrentData.push(order);
                }
            }
            _this.currentCount = _this.TotalData.length;
            _this.emptyData = false;
            _this.tryBtn(tmp.length);
            _this.renderer.addClass(_this.mimiLoader.nativeElement, 'd-none');
        });
    };
    MonthComponent.prototype.getRows = function (data) {
        var totalRows = [];
        var tmp = Object.keys(data).map(function (i) { return data[i]; });
        var i = 0;
        var _loop_1 = function (row) {
            var j = 0;
            var sum = 0;
            totalRows.push(row);
            var cells = Object.keys(row['days']).map(function (i) { return row['days'][i]; });
            totalRows[i]['days'] = cells;
            this_1.tHeadDays = [];
            for (var _i = 0, cells_1 = cells; _i < cells_1.length; _i++) {
                var cell = cells_1[_i];
                if (cell['res'] !== "") {
                    sum += +cell['res'];
                }
                totalRows[i]['days'][j]['title'] = cell['weekDD'] + ' ' + cell['monDD'] + ' ' + this_1.title;
                totalRows[i]['days'][j]['target'] = this_1.tmpQuery + '-' + cell['monDD'];
                ++j;
                this_1.tHeadDays.push({
                    "monDD": cell['monDD'],
                    "weekDD": cell['weekDD'].toLowerCase(),
                    "target": this_1.tmpQuery + '-' + cell['monDD'],
                    "title": cell['weekDD'] + ' ' + cell['monDD'] + ' ' + this_1.title
                });
            }
            totalRows[i]['sum'] = sum;
            ++i;
        };
        var this_1 = this;
        for (var _i = 0, tmp_2 = tmp; _i < tmp_2.length; _i++) {
            var row = tmp_2[_i];
            _loop_1(row);
        }
        return totalRows;
    };
    MonthComponent.prototype.tryBtn = function (length) {
        if (length >= +this.needCount) {
            this.renderer.removeAttribute(this.fetchBtn.nativeElement, 'disabled');
            this.renderer.removeClass(this.fetchBtn.nativeElement, 'd-none');
        }
        else {
            this.renderer.addClass(this.fetchBtn.nativeElement, 'd-none');
        }
    };
    __decorate([
        ViewChild('fetchBtn'),
        __metadata("design:type", Object)
    ], MonthComponent.prototype, "fetchBtn", void 0);
    __decorate([
        ViewChild('mimiLoader'),
        __metadata("design:type", Object)
    ], MonthComponent.prototype, "mimiLoader", void 0);
    MonthComponent = __decorate([
        Component({
            selector: 'month-app',
            templateUrl: './monthTpl.html'
        }),
        __metadata("design:paramtypes", [Renderer2, FilterService, ActivatedRoute, HttpService, NgbCalendar])
    ], MonthComponent);
    return MonthComponent;
}());
export { MonthComponent };
//# sourceMappingURL=month.component.js.map