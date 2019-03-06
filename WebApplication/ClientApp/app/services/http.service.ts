import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ProdOrder} from '../library/prod-order.lib';
import {Observable} from 'rxjs';
import {BehaviorSubject} from 'rxjs';
import { map } from 'rxjs/operators';
import { url } from 'inspector';
  
@Injectable()
export class HttpService{
    constructor(private http: HttpClient) { }

    getYearData(year: string) {
        const body = {
            query: "300",
            "cond[year]": year
        };
        return this.http.get("/api/yearTable/", { params: body });
    }

    getMonthData(cond: string) {
        const body = {
            query: "301",
            "cond[month]": cond
        };
        return this.http.get("/api/monthTable/", { params: body });
    }

    getWeekData(start: string, end: string) {
        const body = {
            query: "302",
            "cond[weekstart]": start,
            "cond[weekend]": end
        };
        return this.http.get("/api/weekTable/", { params: body });
    }

    getDataList(target: string, cond: any[]) {
        let body = {};
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
    }

    updateWODates(entity: string, start: string, duration: string) {
        let body = {
            query: "300",
            "cond[date_start]": start,
            "cond[entity_id]": entity,
            "cond[duration]": duration
        };
        return this.http.get("api/updatesWO/", { params: body });
    }

    getOrganizations() {
        let body = {
            query: "304"
        };
        return this.http.get("api/getDatas", { params: body });
    }

    getAgrs(org_id: string) {
        let body = {
            query: "305",
            "cond[organiozation_id]": org_id,
        };
        return this.http.get("api/getDatas", { params: body });
    }

    getIdleCats(org_id: string) {
        let body = {
            query: "307",
            "cond[organiozation_id]": org_id
        };
        return this.http.get("api/getDatas", { params: body });
    }

    getIdleTypes(org_id: string, idle_cat: string) {
        let body = {
            query: "308",
            "cond[organiozation_id]": org_id,
            "cond[idle_cat]": idle_cat
        };
        return this.http.get("api/getDatas", { params: body });
    }

    getIdleCodes(org_id: string, idle_cat: string, idle_type: string) {
        let body = {
            query: "309",
            "cond[organiozation_id]": org_id,
            "cond[idle_categ]": idle_cat,
            "cond[idle_type]": idle_type
        };
        return this.http.get("api/getDatas", { params: body })
    };

    geTK(instance_number: string) {
        let body = {
            query: "306",
            "cond[instance_number]": instance_number,
        };
        return this.http.get("api/getDatas", { params: body });
    }

    createWO(org_id: string, instance_number: string, start: string, complete: string, duration: string, work_type: string, entity_name: string, idle_categ: string, idle_type: string, idle_code: string, planner_type: string) {
        let body = {
            query: "301",
            "cond[wip_entity_name]": entity_name,
            "cond[organization_id]": org_id,
            "cond[asset_number]": instance_number,
            "cond[scheduled_start_date]": start,
            "cond[scheduled_completion_date]": complete,
            "cond[operation]": work_type,
            "cond[class_code]": "«¿Ã≈Õ»“‹",
            "cond[duration]": duration,
            "cond[idle_categ]": idle_categ,
            "cond[idle_type]": idle_type,
            "cond[idle_code]": idle_code,
            "cond[planner_type]": planner_type
        };
        return this.http.get("api/updatesWO/", { params: body });
    }
}