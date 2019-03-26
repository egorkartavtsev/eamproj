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
var PoListComponent = /** @class */ (function () {
    function PoListComponent(http, updater, renderer) {
        this.http = http;
        this.updater = updater;
        this.renderer = renderer;
        this.currentPO = new ProdOrder;
        this._plist = [];
        this.tmpDT = {};
        this.onSaved = new EventEmitter();
        this.currentPO = new ProdOrder();
        console.log(this.poList);
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
        console.log(this.currentPO);
        this.http.updateWODates(this.currentPO.entity_id, this.makeTrueDate(this.currentPO.start), this.currentPO.hours, this.currentPO.status_type).subscribe(function (data) {
            console.log(data);
            _this.onSaved.emit(true);
            _this.cancel();
        }, function (error) {
            var alert = _this.renderer.createElement('div');
            var text = _this.renderer.createText('Произошла ошибка на сервере.');
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
            //setTimeout(() => {
            //    this.renderer.setStyle(alert, 'display', 'none');
            //    console.log(alert);
            //}, 3000);
        });
    };
    PoListComponent.prototype.openForm = function (org_id, entity_id) {
        var _this = this;
        var url = "";
        this.http.getFormURL(org_id, entity_id).subscribe(function (data) {
            console.log(data[0].URL);
            console.log(_this._plist);
            window.open(data[0].URL.toString(), "hello");
        });
    };
    PoListComponent.prototype.editPO = function (po) {
        this.currentPO = po;
        var sup = new Date(po.start.replace(/(\d+).(\d+).(\d+) (\d+):(\d+):(\d+)/, '$2/$1/$3 $4:$5:$6'));
        this.tmpDT = { hour: sup.getHours(), minute: sup.getMinutes() };
        this.model = { year: sup.getFullYear(), month: (+sup.getMonth() + 1), day: sup.getDate() };
        this.startCalDay = { year: sup.getFullYear(), month: (+sup.getMonth() + 1), day: sup.getDate() };
    };
    PoListComponent.prototype.cancel = function () {
        this.currentPO = new ProdOrder();
    };
    PoListComponent.prototype.setDate = function () {
        this.currentPO.start = this.makeTrueDate(this.model.day + "." + this.model.month + "." + this.model.year + " " + this.tmpDT['hour'] + ":" + this.tmpDT['minute'] + ":00");
        this.updateComplete();
        this.toogleCalendar();
    };
    PoListComponent.prototype.cancelDate = function () {
        var sup = new Date(this.currentPO.start.replace(/(\d+).(\d+).(\d+) (\d+):(\d+):(\d+)/, '$2/$1/$3 $4:$5:$6'));
        this.model = { year: sup.getFullYear(), month: (+sup.getMonth() + 1), day: sup.getDate() };
        this.tmpDT = { hour: sup.getHours(), minute: sup.getMinutes() };
        this.toogleCalendar();
    };
    PoListComponent.prototype.updateComplete = function (e) {
        var sup = new Date(this.currentPO.start.replace(/(\d+).(\d+).(\d+) (\d+):(\d+):(\d+)/, '$2/$1/$3 $4:$5:$6'));
        var tmp = {
            "days": Math.floor(+this.currentPO.hours / 24),
            "hours": +this.currentPO.hours % 24
        };
        sup.setDate(sup.getDate() + tmp.days);
        sup.setHours(sup.getHours() + tmp.hours);
        this.currentPO.complete = this.makeTrueDate(sup.getDate() + "." + (+sup.getMonth() + 1) + "." + sup.getFullYear() + " " + sup.getHours() + ":" + sup.getMinutes() + ":00");
    };
    PoListComponent.prototype.makeTrueDate = function (date) {
        var sup = new Date(date.replace(/(\d+).(\d+).(\d+) (\d+):(\d+):(\d+)/, '$2/$1/$3 $4:$5:$6'));
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
        if (sup.getMonth().toString().length < 2) {
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
    PoListComponent = __decorate([
        Component({
            selector: 'polist-comp',
            template: "\n     <div class=\"modal fade\" id=\"exampleModal\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"exampleModalLabel\" aria-hidden=\"true\">\n        <div class=\"modal-dialog custom_modal_size\" role=\"document\">\n            <div class=\"modal-content\" style=\"overflow-x: auto;\">\n                <div class=\"modal-header\">\n                    <h5 class=\"modal-title text-center w-100\" id=\"exampleModalLabel\">{{title}} <button class=\"btn btn-info\" (click)=\"openForm()\">\u0424\u043E\u0440\u043C\u044B</button></h5>\n                    <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\">\n                        <span aria-hidden=\"true\">&times;</span>\n                    </button>\n                </div>\n                <div class=\"modal-body\">\n                    <table class=\"table table-sm table-stripped table-hover\">\n                        <thead class=\"thead-dark\">\n                            <tr class=\"text-center\">\n                                <th>\u2116 \u041F\u0417</th>\n                                <th>\u0426\u0435\u0445</th>\n                                <th>\u0410\u0433\u0440\u0435\u0433\u0430\u0442</th>\n                                <th>\u0421\u0442\u0430\u0442\u0443\u0441</th>\n                                <th>\u041D\u0430\u0447\u0430\u043B\u043E</th>\n                                <th>\u0417\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u0438\u0435</th>\n                                <th>\u041F\u0440\u043E\u0434\u043E\u043B\u0436., \u0447.</th>\n                                <th><i class=\"fab fa-android\"></i></th>\n                            </tr>\n                        </thead>\n                        <tbody>\n.                           <ng-template [ngIf]=\"!emptyModal\" [ngIfElse]=\"modalloader\">\n                                <tr *ngFor=\"let po of _plist\">\n                                    <ng-template [ngIf]=\"currentPO?.entity_id != po.entity_id\" [ngIfElse]=\"edit\">\n                                        <td class=\"align-middle\">{{po.entity_name}}</td>\n                                        <td class=\"align-middle\">{{po.org_name}}</td>\n                                        <td class=\"align-middle\">{{po.inst_desc}}</td>\n                                        <td class=\"align-middle\">{{po.work_order_type}}</td>\n                                        <td class=\"align-middle\">{{po.start}}</td>\n                                        <td class=\"align-middle\">{{po.complete}}</td>\n                                        <td class=\"align-middle\">{{po.hours}}</td>\n                                        <td class=\"align-middle\">\n                                            <button class=\"btn btn-primary\" (click)=\"editPO(po)\"><i class=\"fas fa-pen\"></i></button>\n                                            <button class=\"btn btn-info\" (click)=\"openForm(po.org_id, po.entity_id)\"><i class=\"fas fa-table\"></i></button>\n                                        </td>\n                                    </ng-template>\n                                </tr>\n                            </ng-template>\n                        </tbody>\n                    </table>\n                </div>\n                <div class=\"modal-footer\">\n                </div>\n            </div>\n        </div>\n     </div>\n     <ng-template #edit>\n        <td> {{ currentPO.entity_name}}</td>\n        <td> {{ currentPO.org_name }}</td>\n        <td> {{ currentPO.inst_desc }}</td>\n        <td><select class=\"form-control\" [(ngModel)]=\"currentPO.status_type\">\n                <option value=\"17\">\u043F\u0440\u043E\u0435\u043A\u0442</option>\n                <option value=\"1\">\u043D\u0435 \u0432\u044B\u043F\u0443\u0449\u0435\u043D\u043E</option>\n                <option value=\"3\">\u0432\u044B\u043F\u0443\u0449\u0435\u043D\u043E</option>\n                <option value=\"4\">\u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u043E</option>\n                <option value=\"5\">\u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u043E \u0431\u0435\u0437 \u0440\u0430\u0441\u0445\u043E\u0434\u0430</option>\n                <option value=\"6\">\u0437\u0430\u0431\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u0430\u043D\u043E</option>\n                <option value=\"7\">\u043E\u0442\u043C\u0435\u043D\u0435\u043D\u043E</option>\n                <option value=\"12\">\u0437\u0430\u043A\u0440\u044B\u0442\u043E</option>\n                <option value=\"15\">\u0441\u0431\u043E\u0439 \u043F\u0440\u0438 \u0437\u0430\u043A\u0440\u044B\u0442\u0438\u0438</option>\n            </select></td>\n        <td>\n            <div class=\"form-group\" id=\"chngStart\" #target>\n                <div class=\"input-group\">\n                    <input type=\"text\" style=\"min-width: 180px;\" [(ngModel)]=\"currentPO.start\" on-input=\"updateComplete($event)\" id=\"curStart\" class=\"form-control\" (click)=\"toogleCalendar()\">\n                    <div class=\"input-group-prepend\">\n                        <button class=\"input-group-text btn btn-default d-none d-sm-block\" (click)=\"toogleCalendar()\"> <i class=\"fas fa-calendar\"> </i></button>\n                    </div>\n                </div>\n                <div #startCal class=\"calendBlock d-none\">\n                        <div class=\"card-body\">\n                            <div class=\"w-100\">\n                                <button type=\"button\" class=\"close pull-right mb-3\" data-toggle=\"collapse\" data-target=\"#startCal\" aria-expanded=\"false\" aria-controls=\"startCal\">\n                                    <span class=\"closeBtn\" aria-hidden=\"true\" (click)=\"toogleCalendar()\">&times; </span>\n                                </button>\n                            </div>\n                            <ngb-datepicker #d\n                                            [footerTemplate]=\"t\"\n                                            [navigation]=\"arrows\"\n                                            [(ngModel)]=\"model\"\n                                            [startDate]=\"startCalDay\"\n                                            (navigate)=\"startCalDay = $event.next\"></ngb-datepicker>\n                    </div>\n                </div>\n            </div>\n        </td>\n        <td> {{ currentPO.complete }}</td>\n        <td>\n            <div class=\"form-group\">\n                <input type=\"number\" [(ngModel)]=\"currentPO.hours\" on-input=\"updateComplete($event)\" id=\"curHours\" class=\"form-control\" />\n            </div>\n        </td>\n        <td>\n            <button class=\"btn btn-success\" (click)=\"save()\"> <i class=\"fas fa-save\"> </i></button>\n            <button class=\"btn btn-secondary\" (click)=\"cancel()\"> <i class=\"fas fa-ban\"> </i></button>\n        </td>\n    </ng-template>\n\n    <ng-template #t>\n        <div class=\"w-100 px-5 dpicker-footer\"><ngb-timepicker [(ngModel)]=\"tmpDT\" [minuteStep]=\"10\"></ngb-timepicker></div>\n        <div class=\"w-100 text-center mb-3 dpicker-footer\">\n            <div class=\"btn-group\">\n                <button (click)=\"setDate()\" type=\"button\" class=\"btn btn-success\" title=\"\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C\" data-toggle=\"collapse\" data-target=\"#startCal\" aria-expanded=\"false\" aria-controls=\"startCal\">\n                    <i class=\"fas fa-calendar-check\"></i>\n                    <span class=\"d-none d-sm-inline\"> Ok</span>\n                </button>\n                <button (click)=\"cancelDate()\" type=\"button\" class=\"btn btn-secondary\" title=\"\u041E\u0442\u043C\u0435\u043D\u0430\" data-toggle=\"collapse\" data-target=\"#startCal\" aria-expanded=\"false\" aria-controls=\"startCal\">\n                    <i class=\"fas fa-thumbs-down\"></i>\n                    <span class=\"d-none d-sm-inline\"> \u041E\u0442\u043C\u0435\u043D\u0430</span>\n                </button>\n            </div>\n        </div>\n    </ng-template>\n    <ng-template #modalloader>\n        <tr><td colspan=\"7\" class=\"text-center\"><div class=\"loader\"></div><br>\u041F\u043E\u0434\u043E\u0436\u0434\u0438\u0442\u0435, \u0438\u0434\u0451\u0442 \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0430 \u0434\u0430\u043D\u043D\u044B\u0445.</td></tr>\n    </ng-template>"
        }),
        __metadata("design:paramtypes", [HttpService, Renderer, Renderer2])
    ], PoListComponent);
    return PoListComponent;
}());
export { PoListComponent };
//# sourceMappingURL=po-list.component.js.map