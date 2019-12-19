var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Input, Component, Renderer2, ViewChild, Output, EventEmitter } from '@angular/core';
import { CloneOrder } from '../../library/po-clone.lib';
import { FilterModel } from '../../library/filter-model';
import { UserService } from '../../services/user.service';
import { FilterService } from '../../services/filter.service';
import { HttpService } from '../../services/http.service';
var EditcloneComponent = /** @class */ (function () {
    function EditcloneComponent(usrService, filterService, http, renderer) {
        var _this = this;
        this.usrService = usrService;
        this.filterService = filterService;
        this.http = http;
        this.renderer = renderer;
        this.onSaved = new EventEmitter();
        this.filter = new FilterModel();
        this.data = [];
        this.allow = false;
        this.resp_match = false;
        this.current_clone = new CloneOrder;
        this.tmpDT = {};
        this.filterService.filter.subscribe(function (filt) {
            _this.filter = filt;
        });
        this.usrService.user.subscribe(function (user) {
            _this.user = user;
        });
    }
    EditcloneComponent.prototype.ngOnInit = function () {
        this.resp_match = (this.user.resps.indexOf(this.resp_key) < 0) ? false : true;
        this.getRows();
    };
    EditcloneComponent.prototype.getRows = function () {
        var _this = this;
        this.http.getCloneDetails(this.instance_number, this.filterService.makeSQLFilter(this.filter), this.resp_key, this.date).subscribe(function (data) {
            _this.data = Object.keys(data).map(function (i) { return data[i]; });
            ;
            _this.allow = true;
        });
    };
    EditcloneComponent.prototype.editClone = function (clone) {
        this.current_clone = clone;
        var sup = new Date(this.makeTrueDate(clone.SCHEDULED_START_DATE).replace(/(\d+).(\d+).(\d+) (\d+):(\d+):(\d+)/, '$2/$1/$3 $4:$5:$6'));
        this.tmpDT = { hour: sup.getHours(), minute: sup.getMinutes() };
        this.model = { year: sup.getFullYear(), month: (+sup.getMonth() + 1), day: sup.getDate() };
        this.startCalDay = { year: sup.getFullYear(), month: (+sup.getMonth() + 1), day: sup.getDate() };
    };
    EditcloneComponent.prototype.cancel = function () {
        this.current_clone = new CloneOrder;
    };
    EditcloneComponent.prototype.save = function () {
        var _this = this;
        this.allow = false;
        this.http.updateClone(this.current_clone).subscribe(function (data) {
            _this.getRows();
            _this.onSaved.emit(true);
            _this.cancel();
        });
    };
    /* DATES & CALENDAR */
    EditcloneComponent.prototype.makeTrueDate = function (date) {
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
    EditcloneComponent.prototype.toogleCalendar = function () {
        if (this.calendar.nativeElement.className.toString().indexOf('d-none') < 0) {
            this.renderer.addClass(this.calendar.nativeElement, 'd-none');
        }
        else {
            this.renderer.removeClass(this.calendar.nativeElement, 'd-none');
        }
    };
    EditcloneComponent.prototype.updateComplete = function (e) {
        var sup = new Date(this.makeTrueDate(this.current_clone.SCHEDULED_START_DATE).replace(/(\d+).(\d+).(\d+) (\d+):(\d+):(\d+)/, '$2/$1/$3 $4:$5:$6'));
        var tmp = {
            "days": Math.floor(+this.current_clone.DURATION / 24),
            "hours": +this.current_clone.DURATION % 24
        };
        sup.setDate(sup.getDate() + tmp.days);
        sup.setHours(sup.getHours() + tmp.hours);
        this.current_clone.SCHEDULED_COMPLETION_DATE = this.makeTrueDate(sup.getDate() + "." + (+sup.getMonth() + 1) + "." + sup.getFullYear() + " " + sup.getHours() + ":" + sup.getMinutes() + ":00");
    };
    EditcloneComponent.prototype.setDate = function () {
        this.current_clone.SCHEDULED_START_DATE = this.makeTrueDate(this.model.day + "." + this.model.month + "." + this.model.year + " " + this.tmpDT['hour'] + ":" + this.tmpDT['minute'] + ":00");
        this.updateComplete();
        this.toogleCalendar();
    };
    EditcloneComponent.prototype.cancelDate = function () {
        var sup = new Date(this.makeTrueDate(this.current_clone.SCHEDULED_START_DATE));
        this.model = { year: sup.getFullYear(), month: (+sup.getMonth() + 1), day: sup.getDate() };
        this.tmpDT = { hour: sup.getHours(), minute: sup.getMinutes() };
        this.toogleCalendar();
    };
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], EditcloneComponent.prototype, "resp_key", void 0);
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], EditcloneComponent.prototype, "instance_number", void 0);
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], EditcloneComponent.prototype, "date", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Object)
    ], EditcloneComponent.prototype, "onSaved", void 0);
    __decorate([
        ViewChild('startCal'),
        __metadata("design:type", Object)
    ], EditcloneComponent.prototype, "calendar", void 0);
    EditcloneComponent = __decorate([
        Component({
            selector: 'editclone-comp',
            templateUrl: './editclone.html'
        }),
        __metadata("design:paramtypes", [UserService, FilterService, HttpService, Renderer2])
    ], EditcloneComponent);
    return EditcloneComponent;
}());
export { EditcloneComponent };
//# sourceMappingURL=editclone.component.js.map