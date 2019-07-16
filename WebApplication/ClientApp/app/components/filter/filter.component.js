var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, Renderer2, ViewChild } from '@angular/core';
import { FilterService } from '../../services/filter.service';
import { HttpService } from '../../services/http.service';
import { SelConf } from '../../library/sel-conf';
var FilterComponent = /** @class */ (function () {
    function FilterComponent(http, filterService, renderer) {
        var _this = this;
        this.http = http;
        this.filterService = filterService;
        this.renderer = renderer;
        this.organizations = [];
        this.agregates = [];
        this.wtypes = [];
        this.years = [];
        this.days = [];
        this.monthes = [
            { num: "01", name: "Январь" },
            { num: "02", name: "Февраль" },
            { num: "03", name: "Март" },
            { num: "04", name: "Апрель" },
            { num: "03", name: "Май" },
            { num: "06", name: "Июнь" },
            { num: "07", name: "Июль" },
            { num: "08", name: "Август" },
            { num: "09", name: "Сентябрь" },
            { num: "10", name: "Октябрь" },
            { num: "11", name: "Ноябрь" },
            { num: "12", name: "Декабрь" }
        ];
        this.conf_org = new SelConf("ORGANIZATION_NAME");
        this.conf_agr = new SelConf("INSTANCE_NUMBER");
        this.conf_wt = new SelConf("ROUTING_COMMENT");
        this.conf_stat = new SelConf("MEANING");
        //supports
        var date = new Date();
        this.filterService.filter.subscribe(function (filt) {
            _this.filterTotal = filt;
            _this.http.getCountOfRows(_this.filterService.makeSQLFilter(filt)).subscribe(function (data) {
                _this.cnt = data[0]['CNT'];
            });
        });
        //date arrays
        this.years = [];
        this.days = [];
        for (var i = date.getFullYear() - 5; i <= date.getFullYear() + 5; ++i) {
            this.years.push(i);
        }
        for (var i = 1; i <= (32 - new Date(date.getFullYear(), date.getMonth(), 32).getDate()); ++i) {
            var d = (i.toString().length > 1) ? i.toString() : '0' + i.toString();
            this.days.push({ num: d, name: d });
        }
        //DB datas
        this.http.getOrganizations().subscribe(function (data) {
            _this.organizations = Object.keys(data).map(function (i) { return data[i]; });
        });
        this.http.getStats().subscribe(function (data) {
            _this.stats = Object.keys(data).map(function (i) { return data[i]; });
        });
    }
    FilterComponent.prototype.ngOnInit = function () {
    };
    FilterComponent.prototype.chg = function (val, src) {
        var _this = this;
        this.renderer.removeClass(this.loader.nativeElement, 'd-none');
        switch (src) {
            case 'org':
                this.filterTotal.agr = '%';
                this.filterTotal.wtype = '%';
                this.agregates = [];
                this.filterTotal.org = val.value;
                if (this.filterTotal.org.length > 0) {
                    var orgs = val.value.map(function (a) { return a.ORGANIZATION_ID; }).join(', ');
                    this.http.getAgrs(orgs).subscribe(function (data) {
                        _this.agregates = Object.keys(data).map(function (i) { return data[i]; });
                        _this.renderer.addClass(_this.loader.nativeElement, 'd-none');
                    });
                }
                break;
            case 'agr':
                this.filterTotal.wtype = '%';
                this.wtypes = [];
                this.filterTotal.agr = val.value;
                if (this.filterTotal.agr.length > 0) {
                    var args = val.value.map(function (a) { return a.INSTANCE_NUMBER; }).join("','");
                    this.http.geTK(args).subscribe(function (data) {
                        _this.wtypes = Object.keys(data).map(function (i) { return data[i]; });
                        _this.renderer.addClass(_this.loader.nativeElement, 'd-none');
                    });
                }
                break;
            case 'wt':
                this.filterTotal.wtype = val.value;
                this.renderer.addClass(this.loader.nativeElement, 'd-none');
                break;
            case 'mon':
                this.days = [];
                var date = new Date(parseInt(this.filterTotal.period.year), (parseInt(this.filterTotal.period.month) - 1), 32);
                for (var i = 1; i <= (32 - date.getDate()); ++i) {
                    var d = (i.toString().length > 1) ? i.toString() : '0' + i.toString();
                    this.days.push({ num: d, name: d });
                }
                this.renderer.addClass(this.loader.nativeElement, 'd-none');
                break;
            case 'stat':
                this.filterTotal.status = val.value;
                this.renderer.addClass(this.loader.nativeElement, 'd-none');
                break;
            case 'year':
                this.renderer.addClass(this.loader.nativeElement, 'd-none');
                break;
            case 'day':
                this.renderer.addClass(this.loader.nativeElement, 'd-none');
                break;
            case 'form':
                this.renderer.addClass(this.loader.nativeElement, 'd-none');
                break;
            case 'planner':
                this.renderer.addClass(this.loader.nativeElement, 'd-none');
                break;
        }
        this.filterService.filter.next(this.filterTotal);
    };
    __decorate([
        ViewChild('loader'),
        __metadata("design:type", Object)
    ], FilterComponent.prototype, "loader", void 0);
    FilterComponent = __decorate([
        Component({
            selector: 'filter-box',
            templateUrl: './filter.html'
        }),
        __metadata("design:paramtypes", [HttpService, FilterService, Renderer2])
    ], FilterComponent);
    return FilterComponent;
}());
export { FilterComponent };
//# sourceMappingURL=filter.component.js.map