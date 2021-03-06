var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, Output, EventEmitter, ViewChild, Renderer2 } from '@angular/core';
import { NewOrder } from '../../library/new-order.lib';
import { HttpService } from '../../services/http.service';
var CreateOrderComponent = /** @class */ (function () {
    function CreateOrderComponent(http, renderer) {
        var _this = this;
        this.http = http;
        this.renderer = renderer;
        this.tmpDT = {};
        this.order = new NewOrder;
        this.organizations = [];
        this.agregates = [];
        this.idle_types = [];
        this.idle_codes = [];
        this.idle_categs = [];
        this.routing_sequences = [];
        this.allow = false;
        this.onSaved = new EventEmitter();
        this.http.getOrganizations().subscribe(function (data) {
            _this.organizations = Object.keys(data).map(function (i) { return data[i]; });
        });
    }
    CreateOrderComponent.prototype.ngOnInit = function () {
        var sup = new Date();
        this.order = new NewOrder;
        this.order.entity_name = "";
        this.order.start = this.makeTrueDate(sup.getDate().toString() + '.' + (+sup.getMonth() + 1).toString() + '.' + sup.getFullYear().toString() + ' ' + sup.getHours().toString() + ':00:00');
        this.order.hours = '0';
        this.order.instance_number = '';
        this.order.org_id = '';
        this.order.planner_type = '';
        this.order.idle_categ = '';
        this.order.idle_type = '';
        this.order.idle_code = '';
        this.order.work_type = '';
        this.tmpDT = { hour: sup.getHours(), minute: 0 };
        this.model = { year: sup.getFullYear(), month: (+sup.getMonth() + 1), day: sup.getDate() };
        this.startCalDay = { year: sup.getFullYear(), month: (+sup.getMonth() + 1), day: sup.getDate() };
        this.updateComplete();
    };
    CreateOrderComponent.prototype.setOrg = function () {
        var _this = this;
        var agrs_ready = false;
        var idles_ready = false;
        this.renderer.removeClass(this.minLoad.nativeElement, 'd-none');
        this.agregates = [];
        this.routing_sequences = [];
        this.order.instance_number = '';
        this.order.work_type = '';
        this.order.idle_type = '';
        this.order.idle_code = '';
        this.order.idle_categ = '';
        var sup = this.tmp_org.split(":");
        this.order.org_id = sup[1];
        this.order.entity_name = sup[0];
        this.http.getAgrs(this.order.org_id.toString()).subscribe(function (data) {
            _this.agregates = Object.keys(data).map(function (i) { return data[i]; });
            if (idles_ready) {
                _this.renderer.addClass(_this.minLoad.nativeElement, 'd-none');
            }
            agrs_ready = true;
            _this.validateForm();
        });
        this.http.getIdleCats(this.order.org_id).subscribe(function (data) {
            _this.idle_categs = Object.keys(data).map(function (i) { return data[i]; });
            if (agrs_ready) {
                _this.renderer.addClass(_this.minLoad.nativeElement, 'd-none');
            }
            idles_ready = true;
            _this.validateForm();
        });
    };
    CreateOrderComponent.prototype.setIdleCat = function () {
        var _this = this;
        this.renderer.removeClass(this.minLoad.nativeElement, 'd-none');
        this.idle_types = [];
        this.order.idle_type = '';
        this.order.idle_code = '';
        this.http.getIdleTypes(this.order.org_id, this.order.idle_categ).subscribe(function (data) {
            _this.idle_types = Object.keys(data).map(function (i) { return data[i]; });
            _this.renderer.addClass(_this.minLoad.nativeElement, 'd-none');
        });
        this.validateForm();
    };
    CreateOrderComponent.prototype.setIdleType = function () {
        var _this = this;
        this.renderer.removeClass(this.minLoad.nativeElement, 'd-none');
        this.idle_codes = [];
        this.order.idle_code = '';
        this.http.getIdleCodes(this.order.org_id, this.order.idle_categ, this.order.idle_type).subscribe(function (data) {
            _this.idle_codes = Object.keys(data).map(function (i) { return data[i]; });
            _this.renderer.addClass(_this.minLoad.nativeElement, 'd-none');
        });
        this.validateForm();
    };
    CreateOrderComponent.prototype.setAgr = function () {
        var _this = this;
        this.renderer.removeClass(this.minLoad.nativeElement, 'd-none');
        this.routing_sequences = [];
        this.order.work_type = '';
        this.http.geTK(this.order.instance_number).subscribe(function (data) {
            var tmp = Object.keys(data).map(function (i) { return data[i]; });
            for (var _i = 0, tmp_1 = tmp; _i < tmp_1.length; _i++) {
                var row = tmp_1[_i];
                var sup = row.ROUTING_COMMENT.split(":");
                _this.routing_sequences.push(sup[0]);
            }
            _this.renderer.addClass(_this.minLoad.nativeElement, 'd-none');
        });
        this.validateForm();
    };
    CreateOrderComponent.prototype.createWO = function () {
        var _this = this;
        this.renderer.removeClass(this.minLoad.nativeElement, 'd-none');
        this.http.createWO(this.order.org_id, this.order.instance_number, this.order.start, this.order.complete, this.order.hours, this.order.work_type, this.order.entity_name, this.order.idle_categ, this.order.idle_type, this.order.idle_code, this.order.planner_type).subscribe(function (data) {
            _this.order = new NewOrder;
            _this.allow = false;
            _this.renderer.addClass(_this.minLoad.nativeElement, 'd-none');
            _this.onSaved.emit(true);
        }, function (error) {
            console.log(error);
            alert(error.error.text);
        });
    };
    CreateOrderComponent.prototype.validateForm = function () {
        this.allow = true;
        if (this.allow && this.order.hours !== '0') {
            this.allow = true;
        }
        else {
            this.allow = false;
        }
        if (this.allow && this.order.idle_categ !== '') {
            this.allow = true;
        }
        else {
            this.allow = false;
        }
        if (this.allow && this.order.idle_code !== '') {
            this.allow = true;
        }
        else {
            this.allow = false;
        }
        if (this.allow && this.order.org_id !== '') {
            this.allow = true;
        }
        else {
            this.allow = false;
        }
        if (this.allow && this.order.org_name !== '') {
            this.allow = true;
        }
        else {
            this.allow = false;
        }
        if (this.allow && this.order.instance_number !== '') {
            this.allow = true;
        }
        else {
            this.allow = false;
        }
        if (this.allow && this.order.idle_type !== '') {
            this.allow = true;
        }
        else {
            this.allow = false;
        }
        if (this.allow && this.order.work_type !== '') {
            this.allow = true;
        }
        else {
            this.allow = false;
        }
    };
    /* DATES & CALENDAR*/
    CreateOrderComponent.prototype.toogleCalendar = function () {
        if (this.calendar.nativeElement.className.toString().indexOf('d-none') < 0) {
            this.renderer.addClass(this.calendar.nativeElement, 'd-none');
        }
        else {
            this.renderer.removeClass(this.calendar.nativeElement, 'd-none');
        }
    };
    CreateOrderComponent.prototype.setDate = function () {
        this.order.start = this.makeTrueDate(this.model.day + "." + this.model.month + "." + this.model.year + " " + this.tmpDT['hour'] + ":" + this.tmpDT['minute'] + ":00");
        this.updateComplete();
        this.validateForm();
        this.toogleCalendar();
    };
    CreateOrderComponent.prototype.cancelDate = function () {
        var sup = new Date(this.order.start.replace(/(\d+).(\d+).(\d+) (\d+):(\d+):(\d+)/, '$3/$2/$1 $4:$5:$6'));
        this.model = { year: sup.getFullYear(), month: (+sup.getMonth() + 1), day: sup.getDate() };
        this.tmpDT = { hour: sup.getHours(), minute: sup.getMinutes() };
        this.toogleCalendar();
    };
    CreateOrderComponent.prototype.updateComplete = function () {
        var sup = new Date(this.order.start.replace(/(\d+).(\d+).(\d+) (\d+):(\d+):(\d+)/, '$3/$2/$1 $4:$5:$6'));
        var tmp = {
            "days": Math.floor(+this.order.hours / 24),
            "hours": +this.order.hours % 24
        };
        sup.setDate(sup.getDate() + tmp.days);
        sup.setHours(sup.getHours() + tmp.hours);
        this.order.complete = this.makeTrueDate(sup.getDate() + "." + (+sup.getMonth() + 1) + "." + sup.getFullYear() + " " + sup.getHours() + ":" + sup.getMinutes() + ":00");
        this.validateForm();
    };
    CreateOrderComponent.prototype.makeTrueDate = function (date) {
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
    __decorate([
        Output(),
        __metadata("design:type", Object)
    ], CreateOrderComponent.prototype, "onSaved", void 0);
    __decorate([
        ViewChild('startCal'),
        __metadata("design:type", Object)
    ], CreateOrderComponent.prototype, "calendar", void 0);
    __decorate([
        ViewChild('miniLoader'),
        __metadata("design:type", Object)
    ], CreateOrderComponent.prototype, "minLoad", void 0);
    __decorate([
        ViewChild('modal'),
        __metadata("design:type", Object)
    ], CreateOrderComponent.prototype, "mWin", void 0);
    __decorate([
        ViewChild('saveBtn'),
        __metadata("design:type", Object)
    ], CreateOrderComponent.prototype, "saveBtn", void 0);
    CreateOrderComponent = __decorate([
        Component({
            selector: 'createwo-comp',
            templateUrl: './create.html'
        }),
        __metadata("design:paramtypes", [HttpService, Renderer2])
    ], CreateOrderComponent);
    return CreateOrderComponent;
}());
export { CreateOrderComponent };
//# sourceMappingURL=createOrder.component.js.map