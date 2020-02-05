import { Input, Component, Output, EventEmitter, ViewChild, Renderer, Renderer2, ElementRef } from '@angular/core';
import { ProdOrder } from '../../library/prod-order.lib';
import { HttpService } from '../../services/http.service';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { CookieService } from "angular2-cookie/core";


@Component({
    selector: 'polist-comp',
    templateUrl: './po-list.html'
})
export class PoListComponent {
    private currentPO: ProdOrder = new ProdOrder;
    private _plist: ProdOrder[] = [];
    private tmpDT: object = {};

    private last_po_idx: number;
    private last_po: ProdOrder;

    model: NgbDateStruct;
    startCalDay: NgbDateStruct;

    @Input() title: string;
    @Input() emptyModal: boolean;
    @Input()
    set poList(list: ProdOrder[]) {
        this._plist = list;
    }
    get poList() { return this._plist; }

    @Output() onSaved = new EventEmitter<boolean>();
    @ViewChild('target') targetRow: any;
    @ViewChild('startCal') calendar: any;
    @ViewChild('loader') loader: any;

    constructor(private cookie: CookieService,  private http: HttpService, private updater: Renderer, private renderer: Renderer2) {
        this.currentPO = new ProdOrder;
    }

    private save() {
        this.renderer.removeClass(this.loader.nativeElement, 'd-none');
        this.http.updateWODates(this.currentPO.entity_id, this.makeTrueDate(this.currentPO.start), this.currentPO.hours, this.currentPO.status_type, this.cookie.get('eam_kp_t')).subscribe(
            (data: any) => {
                this.last_po = this.currentPO;
                this.onSaved.emit(true);
                this.cancel();
            },
            error => {
                let alert = this.renderer.createElement('div');
                const text = this.renderer.createText(error.error.text);
                let icon = this.renderer.createElement('i');
                this.renderer.addClass(icon, 'fas');
                this.renderer.addClass(icon, 'fa-exclamation-triangle');
                this.renderer.appendChild(alert, icon);
                this.renderer.appendChild(alert, text);
                this.renderer.addClass(alert, 'mt-3');
                this.renderer.addClass(alert, 'mb-0');
                this.renderer.addClass(alert, 'alert');
                this.renderer.addClass(alert, 'alert-danger');
                this.renderer.setStyle(alert, 'color', '#9f5f5f');
                this.renderer.appendChild(this.targetRow.nativeElement, alert);
            }
        );
    }

    openForm(org_id: string, entity_id: string) {
        let url = "";
        this.http.getFormURL(org_id, entity_id).subscribe(
            (data: any) => {
                window.open(data[0].URL.toString(), "hello");
            }
        );
    }

    private editPO(po: any) {

        this.last_po = new ProdOrder(po);
        this.last_po_idx = this._plist.indexOf(po);

        this.currentPO = po;
        var sup = new Date(this.makeTrueDate(po.start));
        this.tmpDT = { hour: sup.getHours(), minute: sup.getMinutes() };
        this.model = { year: sup.getFullYear(), month: (+sup.getMonth() + 1), day: sup.getDate() };
        this.startCalDay = { year: sup.getFullYear(), month: (+sup.getMonth() + 1), day: sup.getDate() };
    }

    private cancel() {
        this.currentPO = new ProdOrder;
        this._plist[this.last_po_idx] = this.last_po;
    }



    private setDate() {
        this.currentPO.start = this.makeTrueDate(this.model.day + "." + this.model.month + "." + this.model.year + " " + this.tmpDT['hour'] + ":" + this.tmpDT['minute'] + ":00");
        this.updateComplete();
        this.toogleCalendar();
    }

    private cancelDate() {
        var sup = new Date(this.makeTrueDate(this.currentPO.start));
        this.model = { year: sup.getFullYear(), month: (+sup.getMonth() + 1), day: sup.getDate() };
        this.tmpDT = { hour: sup.getHours(), minute: sup.getMinutes() };
        this.toogleCalendar();
    }

    private updateComplete(e?: object) {
        var sup = new Date(this.makeTrueDate(this.currentPO.start).replace(/(\d+).(\d+).(\d+) (\d+):(\d+):(\d+)/, '$2/$1/$3 $4:$5:$6'));
        let tmp = {
            "days": Math.floor(+this.currentPO.hours / 24),
            "hours": +this.currentPO.hours % 24
        };
        sup.setDate(sup.getDate() + tmp.days);
        sup.setHours(sup.getHours() + tmp.hours);
        this.currentPO.complete = this.makeTrueDate(sup.getDate() + "." + (+sup.getMonth() + 1) + "." + sup.getFullYear() + " " + sup.getHours() + ":" + sup.getMinutes() + ":00");
    }

    private makeTrueDate(date: string) {
        var sup = new Date(date.replace(/(\d+).(\d+).(\d+) (\d+):(\d+):(\d+)/, '$3/$2/$1 $4:$5:$6'));
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
        if ((sup.getMonth() + 1).toString().length < 2) {
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

    private toogleCalendar() {
        if (this.calendar.nativeElement.className.toString().indexOf('d-none') < 0) {
            this.renderer.addClass(this.calendar.nativeElement, 'd-none');
        } else {
            this.renderer.removeClass(this.calendar.nativeElement, 'd-none');
        }
    }

}