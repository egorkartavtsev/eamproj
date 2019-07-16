import { Input, Component, Output, EventEmitter, ViewChild, Renderer, Renderer2, ElementRef, OnInit } from '@angular/core';
import { NewOrder } from '../../library/new-order.lib';
import { HttpService } from '../../services/http.service';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'createwo-comp',
    templateUrl: './create.html'
})

export class CreateOrderComponent {
    private tmpDT: object = {};
    model: NgbDateStruct;
    startCalDay: NgbDateStruct;
    private order: NewOrder = new NewOrder;

    private organizations: any[] = [];
    private agregates: any[] = [];
    private idle_types: any[] = [];
    private idle_codes: any[] = [];
    private idle_categs: any[] = [];
    private routing_sequences: any[] = [];
    private tmp_org: string;

    private allow: boolean = false;

    @ViewChild('startCal') calendar: any;
    @ViewChild('miniLoader') minLoad: any;
    @ViewChild('modal') mWin: any;
    @ViewChild('saveBtn') saveBtn: any;

    constructor(private http: HttpService, private renderer: Renderer2) {
        this.http.getOrganizations().subscribe(
            (data: any[]) => {
                this.organizations = Object.keys(data).map(i => data[i]);
            }
        );

    }

    ngOnInit() {
        let sup = new Date();
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
    }

    private setOrg() {
        this.renderer.removeClass(this.minLoad.nativeElement, 'd-none');
        this.agregates = [];
        this.routing_sequences = [];

        this.order.instance_number = '';
        this.order.work_type = '';
        this.order.idle_type = '';
        this.order.idle_code = '';
        this.order.idle_categ = '';


        let sup = this.tmp_org.split(":");
        this.order.org_id = sup[1];
        this.order.entity_name = sup[0];
        this.http.getAgrs(this.order.org_id.toString()).subscribe(
            (data: any[]) => {
                this.agregates = Object.keys(data).map(i => data[i]);
                console.log(this.agregates);
                this.renderer.addClass(this.minLoad.nativeElement, 'd-none');
            }
        );

        this.http.getIdleCats(this.order.org_id).subscribe(
            (data: any[]) => {
                this.idle_categs = Object.keys(data).map(i => data[i]);
                this.renderer.addClass(this.minLoad.nativeElement, 'd-none');
            }
        );
        this.validateForm();
    }

    private setIdleCat() {
        this.renderer.removeClass(this.minLoad.nativeElement, 'd-none');
        this.idle_types = [];
        this.order.idle_type = '';
        this.order.idle_code = '';

        this.http.getIdleTypes(this.order.org_id, this.order.idle_categ).subscribe(
            (data: any[]) => {
                this.idle_types = Object.keys(data).map(i => data[i]);
                this.renderer.addClass(this.minLoad.nativeElement, 'd-none');
            }
        );
        this.validateForm();
    }

    private setIdleType() {
        this.renderer.removeClass(this.minLoad.nativeElement, 'd-none');
        this.idle_codes = [];
        this.order.idle_code = '';

        this.http.getIdleCodes(this.order.org_id, this.order.idle_categ, this.order.idle_type).subscribe(
            (data: any[]) => {
                this.idle_codes = Object.keys(data).map(i => data[i]);
                this.renderer.addClass(this.minLoad.nativeElement, 'd-none');
            }
        );
        this.validateForm();
    }


    private setAgr() {
        this.renderer.removeClass(this.minLoad.nativeElement, 'd-none');
        this.routing_sequences = [];
        this.order.work_type = '';

        this.http.geTK(this.order.instance_number).subscribe(
            (data: any[]) => {
                let tmp = Object.keys(data).map(i => data[i]);
                for (let row of tmp) {
                    let sup = row.ROUTING_COMMENT.split(":");
                    this.routing_sequences.push(sup[0]);
                }
                this.renderer.addClass(this.minLoad.nativeElement, 'd-none');
            }
        );
        this.validateForm();
    }

    private createWO() {
        this.renderer.removeClass(this.minLoad.nativeElement, 'd-none');
        this.http.createWO(
            this.order.org_id,
            this.order.instance_number,
            this.order.start,
            this.order.complete,
            this.order.hours,
            this.order.work_type,
            this.order.entity_name,
            this.order.idle_categ,
            this.order.idle_type,
            this.order.idle_code,
            this.order.planner_type
        ).subscribe(
            (data: any) => {
                this.renderer.addClass(this.minLoad.nativeElement, 'd-none');
                window.location.reload();
            },
            error => {
                console.log(error);
                alert(error.error.text);
            }
        );
    }

    private validateForm() {
        this.allow = true;

        if (this.allow && this.order.hours !== '0') {
            this.allow = true;
        } else {
            this.allow = false;
        }

        if (this.allow && this.order.idle_categ !== '') {
            this.allow = true;
        } else {
            this.allow = false;
        }

        if (this.allow && this.order.idle_code !== '') {
            this.allow = true;
        } else {
            this.allow = false;
        }

        if (this.allow && this.order.org_id !== '') {
            this.allow = true;
        } else {
            this.allow = false;
        }

        if (this.allow && this.order.org_name !== '') {
            this.allow = true;
        } else {
            this.allow = false;
        }

        if (this.allow && this.order.planner_type !== '') {
            this.allow = true;
        } else {
            this.allow = false;
        }

        if (this.allow && this.order.instance_number !== '') {
            this.allow = true;
        } else {
            this.allow = false;
        }

        if (this.allow && this.order.idle_type !== '') {
            this.allow = true;
        } else {
            this.allow = false;
        }

        if (this.allow && this.order.work_type !== '') {
            this.allow = true;
        } else {
            this.allow = false;
        }
    }

    /* DATES & CALENDAR*/
    private toogleCalendar() {
        if (this.calendar.nativeElement.className.toString().indexOf('d-none') < 0) {
            this.renderer.addClass(this.calendar.nativeElement, 'd-none');
        } else {
            this.renderer.removeClass(this.calendar.nativeElement, 'd-none');
        }
    }

    private setDate() {
        this.order.start = this.makeTrueDate(this.model.day + "." + this.model.month + "." + this.model.year + " " + this.tmpDT['hour'] + ":" + this.tmpDT['minute'] + ":00");
        this.updateComplete();
        this.validateForm();
        this.toogleCalendar();
    }

    private cancelDate() {
        var sup = new Date(this.order.start.replace(/(\d+).(\d+).(\d+) (\d+):(\d+):(\d+)/, '$2/$1/$3 $4:$5:$6'));
        this.model = { year: sup.getFullYear(), month: (+sup.getMonth() + 1), day: sup.getDate() };
        this.tmpDT = { hour: sup.getHours(), minute: sup.getMinutes() };
        this.toogleCalendar();
    }

    private updateComplete() {
        var sup = new Date(this.order.start.replace(/(\d+).(\d+).(\d+) (\d+):(\d+):(\d+)/, '$2/$1/$3 $4:$5:$6'));
        let tmp = {
            "days": Math.floor(+this.order.hours / 24),
            "hours": +this.order.hours % 24
        };
        sup.setDate(sup.getDate() + tmp.days);
        sup.setHours(sup.getHours() + tmp.hours);
        this.order.complete = this.makeTrueDate(sup.getDate() + "." + (+sup.getMonth() + 1) + "." + sup.getFullYear() + " " + sup.getHours() + ":" + sup.getMinutes() + ":00");
        this.validateForm();
    }

    private makeTrueDate(date: string) {
        var sup = new Date(date.replace(/(\d+).(\d+).(\d+) (\d+):(\d+):(\d+)/, '$2/$1/$3 $4:$5:$6'));
        let day: string;
        let month: string;
        let year: string = sup.getFullYear().toString();
        let hours: string;
        let minutes: string;

        if (sup.getDate().toString().length < 2) {
            day = "0" + sup.getDate().toString();
        } else {
            day = sup.getDate().toString();
        }
        if (sup.getMonth().toString().length < 2) {
            month = "0" + (sup.getMonth() + 1).toString();
        } else {
            month = (sup.getMonth() + 1).toString();
        }
        if (sup.getHours().toString().length < 2) {
            hours = "0" + sup.getHours().toString();
        } else {
            hours = sup.getHours().toString();
        }
        if (sup.getMinutes().toString().length < 2) {
            minutes = "0" + sup.getMinutes().toString();
        } else {
            minutes = sup.getMinutes().toString();
        }
        return day + "." + month + "." + year + " " + hours + ":" + minutes + ":00";

    }

}