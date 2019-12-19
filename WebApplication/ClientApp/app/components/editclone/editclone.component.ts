import { Input, Component, Renderer2, ViewChild, Output, EventEmitter, ElementRef, OnInit } from '@angular/core';
import { CloneOrder } from '../../library/po-clone.lib';
import { UserModel } from '../../library/user-model';
import { FilterModel } from '../../library/filter-model';
import { UserService } from '../../services/user.service';
import { FilterService } from '../../services/filter.service';
import { HttpService } from '../../services/http.service';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'editclone-comp',
    templateUrl: './editclone.html'
})

export class EditcloneComponent {

    @Input() resp_key: string;
    @Input() instance_number: string;
    @Input() date: string;
    @Output() onSaved = new EventEmitter<boolean>();

    @ViewChild('startCal') calendar: any;

    private user: UserModel;
    private filter: FilterModel = new FilterModel();

    private data: any = [];
    private allow: boolean = false;
    private resp_match: boolean = false;

    private current_clone: CloneOrder = new CloneOrder;
    private tmpDT: object = {};
    model: NgbDateStruct;
    startCalDay: NgbDateStruct;

    constructor(private usrService: UserService, private filterService: FilterService, private http: HttpService, private renderer: Renderer2) {
        this.filterService.filter.subscribe(
            (filt: FilterModel) => {
                this.filter = filt;
            }
        );
        this.usrService.user.subscribe(
            (user: UserModel) => {
                this.user = user;
            }
        );
    }

    ngOnInit() {
        this.resp_match = (this.user.resps.indexOf(this.resp_key) < 0) ? false : true;
        this.getRows();
    }

    private getRows() {
        this.http.getCloneDetails(this.instance_number, this.filterService.makeSQLFilter(this.filter), this.resp_key, this.date).subscribe(
            (data: any) => {
                this.data = Object.keys(data).map(i => data[i]);;
                this.allow = true;
            }
        );
    }

    private editClone(clone: CloneOrder) {
        this.current_clone = clone;
        var sup = new Date(this.makeTrueDate(clone.SCHEDULED_START_DATE).replace(/(\d+).(\d+).(\d+) (\d+):(\d+):(\d+)/, '$2/$1/$3 $4:$5:$6'));
        this.tmpDT = { hour: sup.getHours(), minute: sup.getMinutes() };
        this.model = { year: sup.getFullYear(), month: (+sup.getMonth() + 1), day: sup.getDate() };
        this.startCalDay = { year: sup.getFullYear(), month: (+sup.getMonth() + 1), day: sup.getDate() };
    }

    private cancel() {
        this.current_clone = new CloneOrder;
    }

    private save() {
        this.allow = false;
        this.http.updateClone(this.current_clone).subscribe(
            (data: any) => {
                this.getRows();
                this.onSaved.emit(true);
                this.cancel();
            }
        );
    }


    /* DATES & CALENDAR */
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

    private updateComplete(e?: object) {
        var sup = new Date(this.makeTrueDate(this.current_clone.SCHEDULED_START_DATE).replace(/(\d+).(\d+).(\d+) (\d+):(\d+):(\d+)/, '$2/$1/$3 $4:$5:$6'));
        let tmp = {
            "days": Math.floor(+this.current_clone.DURATION / 24),
            "hours": +this.current_clone.DURATION % 24
        };
        sup.setDate(sup.getDate() + tmp.days);
        sup.setHours(sup.getHours() + tmp.hours);
        this.current_clone.SCHEDULED_COMPLETION_DATE = this.makeTrueDate(sup.getDate() + "." + (+sup.getMonth() + 1) + "." + sup.getFullYear() + " " + sup.getHours() + ":" + sup.getMinutes() + ":00");
    }

    private setDate() {
        this.current_clone.SCHEDULED_START_DATE = this.makeTrueDate(this.model.day + "." + this.model.month + "." + this.model.year + " " + this.tmpDT['hour'] + ":" + this.tmpDT['minute'] + ":00");
        this.updateComplete();
        this.toogleCalendar();
    }

    private cancelDate() {
        var sup = new Date(this.makeTrueDate(this.current_clone.SCHEDULED_START_DATE));
        this.model = { year: sup.getFullYear(), month: (+sup.getMonth() + 1), day: sup.getDate() };
        this.tmpDT = { hour: sup.getHours(), minute: sup.getMinutes() };
        this.toogleCalendar();
    }


}