import { Component, ViewChild, Renderer2, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { FilterService } from '../../services/filter.service';
import { FilterModel } from '../../library/filter-model';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { forEach } from '@angular/router/src/utils/collection';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { CookieService } from "angular2-cookie/core";
import { setTimeout } from 'timers';

@Component({
    selector: 'root-app',
    templateUrl: './rootApp.html',
    styleUrls: ['../assets.css']
})
export class AppComponent implements OnInit {

    private filter: FilterModel;

    //private year: string;
    //private month: string;
    //private date: string;
    private logged: boolean = false;
    //private querySubscription: Subscription;

    private password: string;
    private login: string;

    //@ViewChild('mimiLoader') mimiLoader: any;
    //@ViewChild('btnSingIn') btnSingIn: any;

    //private currentDate = {
    //    year: "",
    //    month: {
    //        name: "",
    //        number: ""
    //    },
    //    day: ""
    //};
    //model: NgbDateStruct;
    //startCalDay: NgbDateStruct;
    //private dateArray: any = {
    //    years: ["2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023"],
    //    monthes: [
    //        { name: "Январь", number: "01" },
    //        { name: "Февраль", number: "02" },
    //        { name: "Март", number: "03" },
    //        { name: "Апрель", number: "04" },
    //        { name: "Май", number: "05" },
    //        { name: "Июнь", number: "06" },
    //        { name: "Июль", number: "07" },
    //        { name: "Август", number: "08" },
    //        { name: "Сентябрь", number: "09" },
    //        { name: "Октябрь", number: "10" },
    //        { name: "Ноябрь", number: "11" },
    //        { name: "Декабрь", number: "12" },
    //    ],
    //    days: []
    //};

    constructor(
        private renderer: Renderer2,
        private cookie: CookieService,
        private http: HttpService,
        private filterService: FilterService,
        //private router: Router,
        //private route: ActivatedRoute
    ) {
        this.filterService.filter.subscribe(
            (filt: FilterModel) => {
                this.filter = filt;
                switch (filt.form) {
                    case 'year':
                        console.log(filt.form);
                        break;
                    case 'mon':
                        console.log(filt.form);
                        break;
                    case 'day':
                        console.log(filt.form);
                        break;
                }
            }
        );
        let token;
        let flag: boolean = false;
        //if (!this.logged) {
        //    let cookt: string = this.cookie.get('eam_kp_t');
        //    this.querySubscription = this.route.queryParams.subscribe(
        //        (queryParam: any) => {
        //            token = queryParam['secret'];
        //            if (token !== undefined) {
        //                this.cookie.put('eam_kp_t', token);
        //                flag = true;
        //            } else {
        //                if (!this.logged && cookt !== undefined) {
        //                    this.http.trySession(cookt).subscribe(
        //                        (data: any[]) => {
        //                            if (data["result"] !== null) {
        //                                flag = true;
        //                            } else {
        //                                flag = false;
        //                            }
        //                        }
        //                    );
        //                }
        //            }

        //        }
        //    );
        //}
        setTimeout(() => {
            this.logged = flag;
        }, 3000);
    }

    ngOnInit() {
    }

    signIn() {
        let flag: boolean;
        let valid: boolean;
        //res = this.user.userSignIn(this.login, this.password);
        this.http.singInUser(this.login, this.password).subscribe(
            (data: any[]) => {
                if (data["result"] === "Y") {
                    this.cookie.put('eam_kp_t', data["token"]);
                    flag = true;
                    valid = true;
                } else {
                    flag = false;
                    valid = false;
                }
            }
        );
        setTimeout(() => {
            this.logged = flag;
        }, 5000);
    }

    /*
    updateDate(target: string, value: string) {
        let dCount: number;
        switch (target) {
            case "year":
                this.currentDate.year = value;
                dCount = 32 - new Date(+value, (+this.currentDate.month.number -1), 32).getDate();
                this.dateArray.days = [];
                for (let i = 1; i <= dCount; i++) {
                    this.dateArray.days.push((i.toString().length < 2) ? "0" + i : i.toString());
                }
                break;
            case "month":
                this.currentDate.month.number = value;
                for (let mon of this.dateArray.monthes) {
                    if (mon.number === value) {
                        this.currentDate.month.name = mon.name;
                    }
                }
                dCount = 32 - new Date(+this.currentDate.month.number, (+value-1), 32).getDate();
                this.dateArray.days = [];
                for (let i = 1; i <= dCount; i++) {
                    this.dateArray.days.push((i.toString().length < 2) ? "0" + i : i.toString());
                }
                break;
            case "day":
                this.currentDate.day = value;
                break;
        }
    }

    goTo(report: string) {

        let queryparam = {};

        switch (report) {
            case 'year':
                queryparam = {
                    query:this.currentDate.year
                }
                break;
            case 'month':
                queryparam = {
                    query:this.currentDate.year + '-' + this.currentDate.month.number
                }
                break;
            case 'week':
                queryparam = {
                    query:this.currentDate.year + '-' + this.currentDate.month.number + '-' + this.currentDate.day
                }
                break;
        }

        this.router.navigate(
            [report],
            {
                queryParams:queryparam
            }
        );
    }*/

}