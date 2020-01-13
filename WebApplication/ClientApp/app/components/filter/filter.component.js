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
import { UserService } from '../../services/user.service';
import { FilterModel } from '../../library/filter-model';
import { SelConf } from '../../library/sel-conf';
import { CookieService } from "angular2-cookie/core";
var FilterComponent = /** @class */ (function () {
    function FilterComponent(http, cookie, filterService, renderer, userservice) {
        var _this = this;
        this.http = http;
        this.cookie = cookie;
        this.filterService = filterService;
        this.renderer = renderer;
        this.userservice = userservice;
        this.organizations = [];
        this.agregates = [];
        this.wtypes = [];
        this.years = [];
        this.days = [];
        this.cnt = '0';
        this.filterList = [];
        this.newFilterName = "";
        this.existsOrg = false;
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
        this.conf_agr = new SelConf("FULL_NAME");
        this.conf_wt = new SelConf("ROUTING_COMMENT");
        this.conf_stat = new SelConf("MEANING");
        this.filterTotal = new FilterModel();
        //supports
        var date = new Date();
        //date arrays
        this.years = [];
        this.days = [];
        for (var i = date.getFullYear() - 10; i <= date.getFullYear() + 5; ++i) {
            this.years.push(i);
        }
        for (var i = 1; i <= (32 - new Date(date.getFullYear(), date.getMonth(), 32).getDate()); ++i) {
            var d = (i.toString().length > 1) ? i.toString() : '0' + i.toString();
            this.days.push({ num: d, name: d });
        }
        //user info
        this.userservice.user.subscribe(function (user) {
            _this.user = user;
        });
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
        this.filterTotal.ready = false;
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
                    });
                }
                break;
            case 'wt':
                this.filterTotal.wtype = val.value;
                break;
            case 'mon':
                this.days = [];
                var date = new Date(parseInt(this.filterTotal.period.year), (parseInt(this.filterTotal.period.month) - 1), 32);
                for (var i = 1; i <= (32 - date.getDate()); ++i) {
                    var d = (i.toString().length > 1) ? i.toString() : '0' + i.toString();
                    this.days.push({ num: d, name: d });
                }
                break;
            case 'stat':
                this.filterTotal.status = val.value;
                break;
            case 'form':
                switch (this.filterTotal.form) {
                    case 'week':
                        this.renderer.removeClass(this.monSel.nativeElement, 'd-none');
                        this.renderer.removeClass(this.daySel.nativeElement, 'd-none');
                        break;
                    case 'mon':
                        this.renderer.removeClass(this.monSel.nativeElement, 'd-none');
                        this.renderer.addClass(this.daySel.nativeElement, 'd-none');
                        break;
                    case 'year':
                        this.renderer.addClass(this.monSel.nativeElement, 'd-none');
                        this.renderer.addClass(this.daySel.nativeElement, 'd-none');
                        break;
                }
                break;
        }
        console.log(this.filterTotal);
        if (this.filterTotal.filterType == 'loaded') {
            this.renderer.removeAttribute(this.applyBtn.nativeElement, 'disabled');
        }
        else {
            this.tryApplyBtn();
        }
        this.http.getCountOfRows(this.filterService.makeSQLFilter(this.filterTotal)).subscribe(function (data) {
            _this.cnt = data[0]['CNT'];
            _this.filterTotal.conut = data[0]['CNT'];
            _this.renderer.addClass(_this.loader.nativeElement, 'd-none');
            _this.filterService.filter.next(_this.filterTotal);
        });
    };
    FilterComponent.prototype.showTable = function () {
        this.filterTotal.ready = true;
        this.filterTotal.conut = parseInt(this.cnt);
        this.filterService.filter.next(this.filterTotal);
    };
    FilterComponent.prototype.getFilterList = function () {
        var _this = this;
        this.http.getFilterList().subscribe(function (data) {
            _this.filterList = data;
        });
    };
    FilterComponent.prototype.prepareSave = function () {
        this.renderer.addClass(this.firstSaveBtn.nativeElement, "d-none");
        this.renderer.removeClass(this.lastSaveBtn.nativeElement, "d-none");
        this.renderer.removeClass(this.newFiltNameBox.nativeElement, "d-none");
    };
    FilterComponent.prototype.saveCurrent = function () {
        var _this = this;
        if (this.filterTotal.org !== '%' && this.filterTotal.org.length > 0) {
            if (this.newFilterName === "") {
                alert("Введите название фильтра!");
            }
            else {
                var filterInfo = {};
                var filt2save = {};
                var tmpDesc = "";
                var tmpTxt = "";
                var tmpFilt = this.filterService.makeSQLFilter(this.filterTotal);
                for (var fld in tmpFilt) {
                    tmpDesc = "";
                    if (fld !== 'planner' && fld !== 'perEnd' && fld !== 'perStart') {
                        switch (fld) {
                            case "agr":
                                for (var _i = 0, _a = this.filterTotal[fld]; _i < _a.length; _i++) {
                                    var obb = _a[_i];
                                    if (typeof (obb["FULL_NAME"]) !== "undefined") {
                                        tmpDesc += obb["FULL_NAME"] + "; ";
                                    }
                                    else {
                                        tmpDesc = "Все";
                                    }
                                }
                                tmpTxt = "Агрегат: ";
                                break;
                            case "org":
                                for (var _b = 0, _c = this.filterTotal[fld]; _b < _c.length; _b++) {
                                    var obb = _c[_b];
                                    if (typeof (obb["ORGANIZATION_NAME"]) !== "undefined") {
                                        tmpDesc += obb["ORGANIZATION_NAME"] + "; ";
                                    }
                                    else {
                                        tmpDesc = "Все";
                                    }
                                }
                                tmpTxt = "Организация: ";
                                break;
                            case "status":
                                for (var _d = 0, _e = this.filterTotal[fld]; _d < _e.length; _d++) {
                                    var obb = _e[_d];
                                    if (typeof (obb["MEANING"]) !== "undefined") {
                                        tmpDesc += obb["MEANING"] + "; ";
                                    }
                                    else {
                                        tmpDesc = "Все";
                                    }
                                }
                                tmpTxt = "Статус: ";
                                break;
                            case "wtype":
                                for (var _f = 0, _g = this.filterTotal[fld]; _f < _g.length; _f++) {
                                    var obb = _g[_f];
                                    if (typeof (obb["ROUTING_COMMENT"]) !== "undefined") {
                                        tmpDesc += obb["ROUTING_COMMENT"] + "; ";
                                    }
                                    else {
                                        tmpDesc = "Все";
                                    }
                                }
                                tmpTxt = "Тип работ: ";
                                break;
                        }
                        filt2save[fld] = {
                            "field_val": tmpFilt[fld],
                            "field_name": fld,
                            "field_name_desc": tmpTxt,
                            "field_val_desc": tmpDesc
                        };
                    }
                }
                filterInfo = {
                    "name": this.newFilterName,
                    "user": this.user.id,
                    "attrs": JSON.stringify(filt2save)
                };
                this.http.saveCurFilter(filterInfo).subscribe(function (data) {
                    alert("Сохранено");
                    _this.renderer.addClass(_this.lastSaveBtn.nativeElement, "d-none");
                    _this.renderer.removeClass(_this.firstSaveBtn.nativeElement, "d-none");
                    _this.renderer.addClass(_this.newFiltNameBox.nativeElement, "d-none");
                    _this.newFilterName = '';
                }, function (error) {
                    console.log(error);
                    alert("Возникла ошибка при сохранении");
                });
            }
        }
        else {
            alert("Выберите организацию!");
        }
    };
    FilterComponent.prototype.returnCustomForm = function () {
        this.filterTotal.filterType = 'custom';
        this.tryApplyBtn();
        this.filterService.filter.next(this.filterTotal);
    };
    FilterComponent.prototype.loadFilter = function (filter_id) {
        var _this = this;
        this.http.loadFilterFields(filter_id).subscribe(function (data) {
            _this.filterTotal.filterLoaded = data;
            _this.filterTotal.filterType = 'loaded';
            _this.existsOrg = true;
            _this.filterService.filter.next(_this.filterTotal);
            _this.chg('', 'total');
        });
    };
    FilterComponent.prototype.tryApplyBtn = function () {
        if (this.filterTotal.org !== '%' && this.filterTotal.org.length > 0) {
            this.existsOrg = true;
            this.renderer.removeAttribute(this.applyBtn.nativeElement, 'disabled');
        }
        else {
            this.renderer.setAttribute(this.applyBtn.nativeElement, 'disabled', 'disabled');
            this.existsOrg = false;
        }
    };
    FilterComponent.prototype.exportXLS = function () {
        this.http.ExportExcel().subscribe(function (data) {
            console.log(data);
        });
    };
    __decorate([
        ViewChild('loader'),
        __metadata("design:type", Object)
    ], FilterComponent.prototype, "loader", void 0);
    __decorate([
        ViewChild('yrSel'),
        __metadata("design:type", Object)
    ], FilterComponent.prototype, "yrSel", void 0);
    __decorate([
        ViewChild('monSel'),
        __metadata("design:type", Object)
    ], FilterComponent.prototype, "monSel", void 0);
    __decorate([
        ViewChild('daySel'),
        __metadata("design:type", Object)
    ], FilterComponent.prototype, "daySel", void 0);
    __decorate([
        ViewChild('newFiltNameBox'),
        __metadata("design:type", Object)
    ], FilterComponent.prototype, "newFiltNameBox", void 0);
    __decorate([
        ViewChild('firstSaveBtn'),
        __metadata("design:type", Object)
    ], FilterComponent.prototype, "firstSaveBtn", void 0);
    __decorate([
        ViewChild('lastSaveBtn'),
        __metadata("design:type", Object)
    ], FilterComponent.prototype, "lastSaveBtn", void 0);
    __decorate([
        ViewChild('applyBtn'),
        __metadata("design:type", Object)
    ], FilterComponent.prototype, "applyBtn", void 0);
    FilterComponent = __decorate([
        Component({
            selector: 'filter-box',
            templateUrl: './filter.html'
        }),
        __metadata("design:paramtypes", [HttpService, CookieService, FilterService, Renderer2, UserService])
    ], FilterComponent);
    return FilterComponent;
}());
export { FilterComponent };
//# sourceMappingURL=filter.component.js.map