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

    getTotalData(query: string, cond: any, target?: string) {
        let body = { "query": query };
        for (let it of cond) {
            body["cond[" + it.key + "]"] = it.value;
        }
        if (typeof (target) !== 'undefined') {
            body["target"] = target;
        }
        return this.http.get("/api/getData/", { params: body });
    }

    singInUser(login: string, password: string) {
        const body = {
            "cond[user]": login,
            "cond[pass]": password
        };
        return this.http.get("/api/login/", { params: body });
    }

    trySession(token: string) {
        const body = {
            "cond[token]": token
        };
        return this.http.get("/api/login/", { params: body });
    }

    getFormURL(org_id: string, entity_id: string) {
        const body = {
            query: "312",
            "cond[org_id]": org_id,
            "cond[entity_id]": entity_id
        };
        return this.http.get("/api/getDatas/", { params: body });
    }

    getYearData(filter: any, count: string, current: string) {
        let body = {
            query: "300",
            "cond[count]": count,
            "cond[current]": current
        };
        for (let i in filter) {
            body["cond[" + i + "]"] = filter[i];
        }
        return this.http.get("/api/yearTable/", { params: body });
    }

    getMonthData(filter: any, count: string, current: string) {
        let body = {
            query: "301",
            "cond[count]": count,
            "cond[current]": current
        };
        for (let i in filter) {
            body["cond[" + i + "]"] = filter[i];
        }
        return this.http.get("/api/monthTable/", { params: body });
    }

    getClones(filter: any, instance: string) {
        let body = {
            query: "320",
            "cond[instance]": instance
        }
        for (let i in filter) {
            body["cond[" + i + "]"] = filter[i];
        }

        return this.http.get("/api/ClonesMonthTable/", { params: body });
    }

    getWeekData(filter: any) {
        let body = {
            query: "302"
        };
        for (let i in filter) {
            body["cond[" + i + "]"] = filter[i];
        }
        return this.http.get("/api/weekTable/", { params: body });
    }

    getDataList(target: string, cond: any[], filter: any) {
        let body = {};

        for (let i in filter) {
            body["cond[" + i + "]"] = filter[i];
        }

        switch (target) {
            case 'month':
                body["query"]= "303";
                body["cond[day]"]= cond['date'];
                body["cond[instance]"]= cond['instance'];
                break;
            case 'year':
                body["cond[perStart]"] = cond['weekstart'];
                body["cond[perEnd]"] = cond['weekend'];
                body["cond[instance]"] = cond['instance'];
                body["query"] = "302";
                break;
        }

        return this.http.get("api/porderLists/", { params: body });
    }

    updateWODates(entity: string, start: string, duration: string, status: string, token: string) {
        let body = {
            query: "300",
            "cond[date_start]": start,
            "cond[entity_id]": entity,
            "cond[duration]": duration,
            "cond[l_token]": token,
            "cond[status_type]": status
        };
        return this.http.get("api/updatesWO/", { params: body });
    }

    updateClone(clone: any) {
        let body = {};

        let ks = Object.keys(clone);
        for (let key of ks) {
            body["cond[" + key + "]"] = clone[key];
        }

        return this.http.get("api/updateClone/", {params: body});
    }

    getCloneDetails(instance_number: string,
                    filter: any,
                    resp_key: string,
                    date: string) {
        let body = {
            query: '321'
        };

        for (let i in filter) {
            body["cond[" + i + "]"] = filter[i];
        }

        body["cond[instance_number]"] = instance_number;
        body["cond[resp_key]"] = resp_key;
        body["cond[date]"] = date;

        return this.http.get("api/getDatas", { params: body });
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

    getStats() {
        let body = {
            query: "317"
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

    getCountOfRows(filt: any) {
        let body = { query: "315" };
        for (let i of Object.keys(filt)) {
                body["cond[" + i + "]"] = filt[i];
        }
        return this.http.get("api/getDatas", { params: body });
    }

    getFilterList() {
        let body = { query: "318" };
        return this.http.get("api/getDatas", { params: body });
    }

    saveCurFilter(info: any) {
        let body = {};
        for (let attr in info) {
            body[attr] = info[attr];
        }
        return this.http.post("api/saveFilter", body );
    }

    loadFilterFields(filt_id: string) {
        let body = {
            query: "319",
            "cond[filt_id]": filt_id,
        };
        return this.http.get("api/getDatas", { params: body });
    }

    ExportExcel() {
        return this.http.get("api/exportXLS");
    }
}