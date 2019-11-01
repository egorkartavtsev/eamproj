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
    //private filter: FilterModel;
    //private routeSubscription: Subscription;
    //private querySubscription: Subscription;
    //private tmpDT: object = {};
    //private TotalData: any[] = [];
    //private warn: boolean = false;
    //private tmpQuery: string;
    //private targetChanged: object = {
    //    "hours": false,
    //    "startDate": false
    //};
    //model: NgbDateStruct;
    //startCalDay: NgbDateStruct;
    //private curPage: number = 0;
    function MonthComponent(renderer, filterService, route, http, calendar) {
        this.renderer = renderer;
        this.filterService = filterService;
        this.route = route;
        this.http = http;
        this.calendar = calendar;
        this.emptyData = true;
        this.emptyModal = true;
        this.modalData = [];
        this.CurrentData = [];
        this.tHeadDays = [];
        /********************************************************/
        this.currentCount = 0;
        this.needCount = '20';
    }
    MonthComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.filterService.filter.subscribe(function (filt) {
            if (filt.ready) {
                _this.tHeadDays = [];
                _this.filter = filt;
                var sup = new Date(_this.filter.period.year + '-' + _this.filter.period.month + '-01').toLocaleString('ru', { month: 'long' });
                sup = sup + " " + _this.filter.period.year;
                _this.title = sup[0].toUpperCase() + sup.substring(1);
                _this.modalData['title'] = "";
                _this.modalData['porders'] = [];
                _this.totalCount = _this.filter.conut.toString();
                _this.getData();
            }
        });
    };
    MonthComponent.prototype.showClones = function (e, row_id) {
        // определить есть ли открытые строки
        var row_status = $('#row_' + row_id).attr('inst-showed');
        $('#row_' + row_id).find('.btn-show-inst').find('i').remove();
        if (row_status === 'true') {
            $('#row_' + row_id).attr('inst-showed', 'false');
            $('#row_' + row_id).find('.btn-show-inst').append('<i class="fas fa-eye"></i>');
            $('.inst-row-' + row_id).each(function () {
                $(this).slideToggle('slow', function () {
                    $(this).remove();
                });
            });
        }
        else {
            $('#row_' + row_id).attr('inst-showed', 'true');
            $('#row_' + row_id).find('.btn-show-inst').append('<i class="fas fa-eye-slash"></i>');
            var newrow = this.renderer.createElement('tr');
            this.renderer.addClass(newrow, 'inst-row');
            this.renderer.addClass(newrow, 'inst-row-' + row_id);
            var newcol = this.renderer.createElement('td');
            this.renderer.setAttribute(newcol, 'colspan', '3');
            this.renderer.addClass(newcol, 'text-right');
            this.renderer.appendChild(newcol, this.renderer.createText('Полномочие'));
            this.renderer.appendChild(newrow, newcol);
            console.log('needly: ', this.CurrentData[row_id - 1]);
            for (var _i = 0, _a = this.tHeadDays; _i < _a.length; _i++) {
                var i = _a[_i];
                newcol = this.renderer.createElement('td');
                this.renderer.appendChild(newcol, this.renderer.createText(i.weekDD.toString()));
                this.renderer.appendChild(newrow, newcol);
            }
            $('#row_' + row_id).after($(newrow));
        } // сгенерировать строку. Вставить после текущей строки
        //console.log('row ' + row_id+': ', newrow);
    };
    MonthComponent.prototype.getData = function () {
        var _this = this;
        this.CurrentData = [];
        this.emptyData = true;
        this.currentCount = 0;
        this.http.getMonthData(this.filterService.makeSQLFilter(this.filter), this.needCount, this.currentCount.toString()).subscribe(function (data) {
            var tmp = _this.getRows(data);
            _this.CurrentData = tmp;
            _this.currentCount = _this.CurrentData.length;
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
            cond['instance'] = "= '" + instance + "'";
            this.modalData['instance'] = instance;
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
    MonthComponent.prototype.fetchData = function () {
        var _this = this;
        this.renderer.setAttribute(this.fetchBtn.nativeElement, 'disabled', 'disabled');
        this.renderer.removeClass(this.mimiLoader.nativeElement, 'd-none');
        this.http.getMonthData(this.filterService.makeSQLFilter(this.filter), this.needCount, this.currentCount.toString()).subscribe(function (data) {
            var tmp = _this.getRows(data);
            Array.prototype.push.apply(_this.CurrentData, tmp);
            _this.currentCount = _this.CurrentData.length;
            _this.emptyData = false;
            _this.tryBtn(_this.currentCount);
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
            totalRows[i]['rownum'] = i + 1;
            totalRows[i]['days'] = cells;
            this_1.tHeadDays = [];
            for (var _i = 0, cells_1 = cells; _i < cells_1.length; _i++) {
                var cell = cells_1[_i];
                if (cell['res'] !== "") {
                    sum += +cell['res'];
                }
                totalRows[i]['days'][j]['title'] = cell['weekDD'] + ' ' + cell['monDD'] + ' ' + this_1.title;
                totalRows[i]['days'][j]['target'] = this_1.filter.period.year + '-' + this_1.filter.period.month + '-' + cell['monDD'];
                ++j;
                this_1.tHeadDays.push({
                    "monDD": cell['monDD'],
                    "weekDD": cell['weekDD'].toLowerCase(),
                    "target": this_1.filter.period.year + '-' + this_1.filter.period.month + '-' + cell['monDD'],
                    "title": cell['weekDD'] + ' ' + this_1.title
                });
            }
            totalRows[i]['sum'] = sum;
            ++i;
        };
        var this_1 = this;
        for (var _i = 0, tmp_1 = tmp; _i < tmp_1.length; _i++) {
            var row = tmp_1[_i];
            _loop_1(row);
        }
        return totalRows;
    };
    MonthComponent.prototype.tryBtn = function (length) {
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
    ], MonthComponent.prototype, "fetchBtn", void 0);
    __decorate([
        ViewChild('fetchSel'),
        __metadata("design:type", Object)
    ], MonthComponent.prototype, "fetchSel", void 0);
    __decorate([
        ViewChild('mimiLoader'),
        __metadata("design:type", Object)
    ], MonthComponent.prototype, "mimiLoader", void 0);
    MonthComponent = __decorate([
        Component({
            selector: 'month-app',
            templateUrl: './monthTpl.html'
        }),
        __metadata("design:paramtypes", [Renderer2,
            FilterService,
            ActivatedRoute,
            HttpService,
            NgbCalendar])
    ], MonthComponent);
    return MonthComponent;
}());
export { MonthComponent };
//# sourceMappingURL=month.component.js.map