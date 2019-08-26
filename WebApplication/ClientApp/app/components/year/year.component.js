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
import { ProdOrder } from '../../library/prod-order.lib';
import { HttpService } from '../../services/http.service';
import { ActivatedRoute } from '@angular/router';
var YearComponent = /** @class */ (function () {
    function YearComponent(renderer, filterService, http, route) {
        this.renderer = renderer;
        this.filterService = filterService;
        this.http = http;
        this.route = route;
        this.CurrentData = [];
        this.modalData = [];
        this.currentPO = new ProdOrder;
        this.emptyData = true;
        this.emptyModal = true;
        /********************************************************/
        this.currentCount = 0;
        this.needCount = '15';
        /********************************************************/
        //private TotalData: any[] = [];
        //private warn: boolean = false;
        //private routeSubscription: Subscription;
        //private querySubscription: Subscription;
        //private tmpDT: object = {};
        //private targetChanged: object = {
        //    "hours": false,
        //    "startDate": false
        //};
        //model: NgbDateStruct;
        //startCalDay: NgbDateStruct;
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
    }
    YearComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.emptyData = true;
        this.filterService.filter.subscribe(function (filt) {
            if (filt.ready) {
                _this.filter = filt;
                _this.title = filt.period.year;
                _this.modalData['title'] = "";
                _this.modalData['porders'] = [];
                _this.totalCount = _this.filter.conut.toString();
                _this.CurrentData = [];
                _this.getData();
            }
        });
    };
    YearComponent.prototype.getData = function () {
        var _this = this;
        this.emptyData = true;
        if (typeof (this.modalData['mon']) !== "undefined") {
            this.showPOList(this.modalData['mon'], this.modalData['dec'], this.modalData['instance']);
        }
        this.http.getYearData(this.filterService.makeSQLFilter(this.filter), this.needCount, this.currentCount.toString()).subscribe(function (data) {
            console.log(data);
            var tmp = _this.getRows(data);
            _this.CurrentData = tmp;
            _this.emptyData = false;
            _this.tryBtn(tmp.length);
            _this.currentCount = _this.CurrentData.length;
        }, function (error) { console.log(error); });
    };
    YearComponent.prototype.fetchData = function () {
        var _this = this;
        this.renderer.setAttribute(this.fetchBtn.nativeElement, 'disabled', 'disabled');
        this.renderer.removeClass(this.mimiLoader.nativeElement, 'd-none');
        this.http.getYearData(this.filter, this.needCount, this.currentCount.toString()).subscribe(function (data) {
            var tmp = _this.getRows(data);
            Array.prototype.push.apply(_this.CurrentData, tmp);
            _this.currentCount = _this.CurrentData.length;
            _this.tryBtn(tmp.length);
        });
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
        this.modalData['mon'] = mon;
        this.modalData['dec'] = dec;
        var cond = [];
        cond['weekend'] = range['end'];
        cond['weekstart'] = range['start'];
        if (typeof (instance) !== "undefined") {
            cond['instance'] = "= '" + instance + "'";
            this.modalData['title'] += " для агрегата №" + instance;
            this.modalData['instance'] = instance;
        }
        else {
            cond['instance'] = "LIKE '%'";
        }
        this.http.getDataList('year', cond, this.filterService.makeSQLFilter(this.filter)).subscribe(function (data) {
            _this.modalData['porders'] = Object.keys(data).map(function (i) { return data[i]; });
            _this.emptyModal = false;
        });
    };
    YearComponent.prototype.onSaved = function () {
        this.getData();
    };
    YearComponent.prototype.getRows = function (data) {
        var totalRows = [];
        var tmp = Object.keys(data).map(function (i) { return data[i]; });
        var i = 0;
        var _loop_1 = function (row) {
            var j = 0;
            var sum = 0;
            totalRows.push(row);
            var cells = Object.keys(row['decadas']).map(function (i) { return row['decadas'][i]; });
            totalRows[i]['decadas'] = cells;
            for (var _i = 0, cells_1 = cells; _i < cells_1.length; _i++) {
                var cell = cells_1[_i];
                if (cell['val'] == "") {
                    totalRows[i]['decadas'][j] = cell;
                }
                else {
                    totalRows[i]['decadas'][j]['val'] = (cell['val'] % 24) ? (cell['val'] / 24).toFixed(2) : (cell['val'] / 24);
                    totalRows[i]['decadas'][j]['class'] = cell['class'];
                    totalRows[i]['decadas'][j]['tarM'] = cell['tarM'];
                    totalRows[i]['decadas'][j]['tarD'] = cell['tarD'];
                    sum += +cell['val'];
                }
                ++j;
            }
            totalRows[i]['sum'] = ((sum * 100) % 100) ? sum.toFixed(2) : sum;
            ++i;
        };
        for (var _i = 0, tmp_1 = tmp; _i < tmp_1.length; _i++) {
            var row = tmp_1[_i];
            _loop_1(row);
        }
        return totalRows;
    };
    YearComponent.prototype.tryBtn = function (length) {
        if (length >= +this.needCount) {
            this.renderer.removeAttribute(this.fetchBtn.nativeElement, 'disabled');
            this.renderer.removeClass(this.fetchBtn.nativeElement, 'd-none');
            this.renderer.removeClass(this.fetchSel.nativeElement, 'd-none');
        }
        else {
            this.renderer.addClass(this.fetchBtn.nativeElement, 'd-none');
            this.renderer.addClass(this.fetchSel.nativeElement, 'd-none');
        }
    };
    __decorate([
        ViewChild('fetchBtn'),
        __metadata("design:type", Object)
    ], YearComponent.prototype, "fetchBtn", void 0);
    __decorate([
        ViewChild('fetchSel'),
        __metadata("design:type", Object)
    ], YearComponent.prototype, "fetchSel", void 0);
    __decorate([
        ViewChild('mimiLoader'),
        __metadata("design:type", Object)
    ], YearComponent.prototype, "mimiLoader", void 0);
    YearComponent = __decorate([
        Component({
            selector: 'year-app',
            templateUrl: './yearTpl.html',
            styles: ['']
        }),
        __metadata("design:paramtypes", [Renderer2,
            FilterService,
            HttpService,
            ActivatedRoute])
    ], YearComponent);
    return YearComponent;
}());
export { YearComponent };
//# sourceMappingURL=year.component.js.map