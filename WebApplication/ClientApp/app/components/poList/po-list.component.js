var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Input, Component, Output, EventEmitter, ViewChild, Renderer, Renderer2 } from '@angular/core';
import { ProdOrder } from '../../library/prod-order.lib';
import { HttpService } from '../../services/http.service';
import { CookieService } from "angular2-cookie/core";
var PoListComponent = /** @class */ (function () {
    function PoListComponent(cookie, http, updater, renderer) {
        this.cookie = cookie;
        this.http = http;
        this.updater = updater;
        this.renderer = renderer;
        this.currentPO = new ProdOrder;
        this._plist = [];
        this.tmpDT = {};
        this.onSaved = new EventEmitter();
        this.currentPO = new ProdOrder;
    }
    Object.defineProperty(PoListComponent.prototype, "poList", {
        get: function () { return this._plist; },
        set: function (list) {
            this._plist = list;
        },
        enumerable: true,
        configurable: true
    });
    PoListComponent.prototype.save = function () {
        var _this = this;
        this.renderer.removeClass(this.loader.nativeElement, 'd-none');
        this.http.updateWODates(this.currentPO.entity_id, this.makeTrueDate(this.currentPO.start), this.currentPO.hours, this.currentPO.status_type, this.cookie.get('eam_kp_t')).subscribe(function (data) {
            _this.last_po = _this.currentPO;
            _this.onSaved.emit(true);
            _this.cancel();
        }, function (error) {
            var alert = _this.renderer.createElement('div');
            var text = _this.renderer.createText(error.error.text);
            var icon = _this.renderer.createElement('i');
            _this.renderer.addClass(icon, 'fas');
            _this.renderer.addClass(icon, 'fa-exclamation-triangle');
            _this.renderer.appendChild(alert, icon);
            _this.renderer.appendChild(alert, text);
            _this.renderer.addClass(alert, 'mt-3');
            _this.renderer.addClass(alert, 'mb-0');
            _this.renderer.addClass(alert, 'alert');
            _this.renderer.addClass(alert, 'alert-danger');
            _this.renderer.setStyle(alert, 'color', '#9f5f5f');
            _this.renderer.appendChild(_this.targetRow.nativeElement, alert);
        });
    };
    PoListComponent.prototype.openForm = function (org_id, entity_id) {
        var url = "";
        this.http.getFormURL(org_id, entity_id).subscribe(function (data) {
            window.open(data[0].URL.toString(), "hello");
        });
    };
    PoListComponent.prototype.editPO = function (po) {
        this.last_po = new ProdOrder(po);
        this.last_po_idx = this._plist.indexOf(po);
        this.currentPO = po;
        var sup = new Date(this.makeTrueDate(po.start));
        this.tmpDT = { hour: sup.getHours(), minute: sup.getMinutes() };
        this.model = { year: sup.getFullYear(), month: (+sup.getMonth() + 1), day: sup.getDate() };
        this.startCalDay = { year: sup.getFullYear(), month: (+sup.getMonth() + 1), day: sup.getDate() };
    };
    PoListComponent.prototype.cancel = function () {
        this.currentPO = new ProdOrder;
        this._plist[this.last_po_idx] = this.last_po;
    };
    PoListComponent.prototype.setDate = function () {
        this.currentPO.start = this.makeTrueDate(this.model.day + "." + this.model.month + "." + this.model.year + " " + this.tmpDT['hour'] + ":" + this.tmpDT['minute'] + ":00");
        this.updateComplete();
        this.toogleCalendar();
    };
    PoListComponent.prototype.cancelDate = function () {
        var sup = new Date(this.makeTrueDate(this.currentPO.start));
        this.model = { year: sup.getFullYear(), month: (+sup.getMonth() + 1), day: sup.getDate() };
        this.tmpDT = { hour: sup.getHours(), minute: sup.getMinutes() };
        this.toogleCalendar();
    };
    PoListComponent.prototype.updateComplete = function (e) {
        var sup = new Date(this.makeTrueDate(this.currentPO.start).replace(/(\d+).(\d+).(\d+) (\d+):(\d+):(\d+)/, '$2/$1/$3 $4:$5:$6'));
        var tmp = {
            "days": Math.floor(+this.currentPO.hours / 24),
            "hours": +this.currentPO.hours % 24
        };
        sup.setDate(sup.getDate() + tmp.days);
        sup.setHours(sup.getHours() + tmp.hours);
        this.currentPO.complete = this.makeTrueDate(sup.getDate() + "." + (+sup.getMonth() + 1) + "." + sup.getFullYear() + " " + sup.getHours() + ":" + sup.getMinutes() + ":00");
    };
    PoListComponent.prototype.makeTrueDate = function (date) {
        var sup = new Date(date.replace(/(\d+).(\d+).(\d+) (\d+):(\d+):(\d+)/, '$3/$2/$1 $4:$5:$6'));
        var day;
        var month;
        var year = sup.getFullYear().toString();
        var hours;
        var minutes;
        if (sup.getDate().toString().length < 2) {
            day = "0" + sup.getDate().toString();
        }
        else {
            day = sup.getDate().toString();
        }
        if ((sup.getMonth() + 1).toString().length < 2) {
            month = "0" + (sup.getMonth() + 1).toString();
        }
        else {
            month = (sup.getMonth() + 1).toString();
        }
        if (sup.getHours().toString().length < 2) {
            hours = "0" + sup.getHours().toString();
        }
        else {
            hours = sup.getHours().toString();
        }
        if (sup.getMinutes().toString().length < 2) {
            minutes = "0" + sup.getMinutes().toString();
        }
        else {
            minutes = sup.getMinutes().toString();
        }
        return day + "." + month + "." + year + " " + hours + ":" + minutes + ":00";
    };
    PoListComponent.prototype.toogleCalendar = function () {
        if (this.calendar.nativeElement.className.toString().indexOf('d-none') < 0) {
            this.renderer.addClass(this.calendar.nativeElement, 'd-none');
        }
        else {
            this.renderer.removeClass(this.calendar.nativeElement, 'd-none');
        }
    };
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], PoListComponent.prototype, "title", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], PoListComponent.prototype, "emptyModal", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Array),
        __metadata("design:paramtypes", [Array])
    ], PoListComponent.prototype, "poList", null);
    __decorate([
        Output(),
        __metadata("design:type", Object)
    ], PoListComponent.prototype, "onSaved", void 0);
    __decorate([
        ViewChild('target'),
        __metadata("design:type", Object)
    ], PoListComponent.prototype, "targetRow", void 0);
    __decorate([
        ViewChild('startCal'),
        __metadata("design:type", Object)
    ], PoListComponent.prototype, "calendar", void 0);
    __decorate([
        ViewChild('loader'),
        __metadata("design:type", Object)
    ], PoListComponent.prototype, "loader", void 0);
    PoListComponent = __decorate([
        Component({
            selector: 'polist-comp',
            templateUrl: './po-list.html'
        }),
        __metadata("design:paramtypes", [CookieService, HttpService, Renderer, Renderer2])
    ], PoListComponent);
    return PoListComponent;
}());
export { PoListComponent };
//# sourceMappingURL=po-list.component.js.map