var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
var HttpService = /** @class */ (function () {
    function HttpService(http) {
        this.http = http;
    }
    HttpService.prototype.getFormURL = function (org_id, entity_id) {
        var body = {
            query: "312",
            "cond[org_id]": org_id,
            "cond[entity_id]": entity_id
        };
        return this.http.get("/api/getDatas/", { params: body });
    };
    HttpService.prototype.getYearData = function (year) {
        var body = {
            query: "300",
            "cond[year]": year
        };
        return this.http.get("/api/yearTable/", { params: body });
    };
    HttpService.prototype.getMonthData = function (cond) {
        var body = {
            query: "301",
            "cond[month]": cond
        };
        return this.http.get("/api/monthTable/", { params: body });
    };
    HttpService.prototype.getWeekData = function (start, end) {
        var body = {
            query: "302",
            "cond[weekstart]": start,
            "cond[weekend]": end
        };
        return this.http.get("/api/weekTable/", { params: body });
    };
    HttpService.prototype.getDataList = function (target, cond) {
        var body = {};
        switch (target) {
            case 'month':
                body = {
                    query: "303",
                    "cond[day]": cond['date'],
                    "cond[instance]": cond['instance']
                };
                break;
            case 'year':
                body = {
                    query: "302",
                    "cond[weekstart]": cond['weekstart'],
                    "cond[weekend]": cond['weekend'],
                    "cond[instance]": cond['instance']
                };
                break;
        }
        return this.http.get("api/porderLists/", { params: body });
    };
    HttpService.prototype.updateWODates = function (entity, start, duration, status) {
        var body = {
            query: "300",
            "cond[date_start]": start,
            "cond[entity_id]": entity,
            "cond[duration]": duration,
            "cond[status_type]": status
        };
        return this.http.get("api/updatesWO/", { params: body });
    };
    HttpService.prototype.getOrganizations = function () {
        var body = {
            query: "304"
        };
        return this.http.get("api/getDatas", { params: body });
    };
    HttpService.prototype.getAgrs = function (org_id) {
        var body = {
            query: "305",
            "cond[organiozation_id]": org_id,
        };
        return this.http.get("api/getDatas", { params: body });
    };
    HttpService.prototype.getIdleCats = function (org_id) {
        var body = {
            query: "307",
            "cond[organiozation_id]": org_id
        };
        return this.http.get("api/getDatas", { params: body });
    };
    HttpService.prototype.getIdleTypes = function (org_id, idle_cat) {
        var body = {
            query: "308",
            "cond[organiozation_id]": org_id,
            "cond[idle_cat]": idle_cat
        };
        return this.http.get("api/getDatas", { params: body });
    };
    HttpService.prototype.getIdleCodes = function (org_id, idle_cat, idle_type) {
        var body = {
            query: "309",
            "cond[organiozation_id]": org_id,
            "cond[idle_categ]": idle_cat,
            "cond[idle_type]": idle_type
        };
        return this.http.get("api/getDatas", { params: body });
    };
    ;
    HttpService.prototype.geTK = function (instance_number) {
        var body = {
            query: "306",
            "cond[instance_number]": instance_number,
        };
        return this.http.get("api/getDatas", { params: body });
    };
    HttpService.prototype.createWO = function (org_id, instance_number, start, complete, duration, work_type, entity_name, idle_categ, idle_type, idle_code, planner_type) {
        var body = {
            query: "301",
            "cond[wip_entity_name]": entity_name,
            "cond[organization_id]": org_id,
            "cond[asset_number]": instance_number,
            "cond[scheduled_start_date]": start,
            "cond[scheduled_completion_date]": complete,
            "cond[operation]": work_type,
            "cond[class_code]": "��������",
            "cond[duration]": duration,
            "cond[idle_categ]": idle_categ,
            "cond[idle_type]": idle_type,
            "cond[idle_code]": idle_code,
            "cond[planner_type]": planner_type
        };
        return this.http.get("api/updatesWO/", { params: body });
    };
    HttpService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [HttpClient])
    ], HttpService);
    return HttpService;
}());
export { HttpService };
//# sourceMappingURL=http.service.js.map