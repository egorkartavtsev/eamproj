import { Input, Component, Output, EventEmitter, ViewChild, Renderer, Renderer2, ElementRef } from '@angular/core';
import { ProdOrder } from '../../library/prod-order.lib';
import { HttpService } from '../../services/http.service';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';


@Component({
    selector: 'polist-comp',    
    template: `
     <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog custom_modal_size" role="document">
            <div class="modal-content" style="overflow-x: auto;">
                <div class="modal-header">
                    <h5 class="modal-title text-center w-100" id="exampleModalLabel">{{title}}</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <table class="table table-sm table-stripped table-hover">
                        <thead class="thead-dark">
                            <tr class="text-center">
                                <th>№ ПЗ</th>
                                <th>Цех</th>
                                <th>Агрегат</th>
                                <th>Начало</th>
                                <th>Завершение</th>
                                <th>Продолж., ч.</th>
                                <th><i class="fab fa-android"></i></th>
                            </tr>
                        </thead>
                        <tbody>
.                           <ng-template [ngIf]="!emptyModal" [ngIfElse]="modalloader">
                                <tr *ngFor="let po of _plist">
                                    <ng-template [ngIf]="currentPO?.entity_id != po.entity_id" [ngIfElse]="edit">
                                        <td class="align-middle">{{po.entity_name}}</td>
                                        <td class="align-middle">{{po.org_name}}</td>
                                        <td class="align-middle">{{po.inst_desc}}</td>
                                        <td class="align-middle">{{po.start}}</td>
                                        <td class="align-middle">{{po.complete}}</td>
                                        <td class="align-middle">{{po.hours}}</td>
                                        <td class="align-middle"><button class="btn btn-primary" (click)="editPO(po)"><i class="fas fa-pen"></i></button></td>
                                    </ng-template>
                                </tr>
                            </ng-template>
                        </tbody>
                    </table>
                </div>
                <div class="modal-footer">
                </div>
            </div>
        </div>
     </div>
     <ng-template #edit>
        <td> {{ currentPO.entity_name}}</td>
        <td> {{ currentPO.org_name }}</td>
        <td> {{ currentPO.inst_desc }}</td>
        <td>
            <div class="form-group" id="chngStart" #target>
                <div class="input-group">
                    <input type="text" style="min-width: 180px;" [(ngModel)]="currentPO.start" on-input="updateComplete($event)" id="curStart" class="form-control" (click)="toogleCalendar()">
                    <div class="input-group-prepend">
                        <button class="input-group-text btn btn-default d-none d-sm-block" (click)="toogleCalendar()"> <i class="fas fa-calendar"> </i></button>
                    </div>
                </div>
                <div #startCal class="calendBlock d-none">
                        <div class="card-body">
                            <div class="w-100">
                                <button type="button" class="close pull-right mb-3" data-toggle="collapse" data-target="#startCal" aria-expanded="false" aria-controls="startCal">
                                    <span class="closeBtn" aria-hidden="true" (click)="toogleCalendar()">&times; </span>
                                </button>
                            </div>
                            <ngb-datepicker #d
                                            [footerTemplate]="t"
                                            [navigation]="arrows"
                                            [(ngModel)]="model"
                                            [startDate]="startCalDay"
                                            (navigate)="startCalDay = $event.next"></ngb-datepicker>
                    </div>
                </div>
            </div>
        </td>
        <td> {{ currentPO.complete }}</td>
        <td>
            <div class="form-group">
                <input type="number" [(ngModel)]="currentPO.hours" on-input="updateComplete($event)" id="curHours" class="form-control" />
            </div>
        </td>
        <td>
            <button class="btn btn-success" (click)="save()"> <i class="fas fa-save"> </i></button>
            <button class="btn btn-secondary" (click)="cancel()"> <i class="fas fa-ban"> </i></button>
        </td>
    </ng-template>

    <ng-template #t>
        <div class="w-100 px-5 dpicker-footer"><ngb-timepicker [(ngModel)]="tmpDT" [minuteStep]="10"></ngb-timepicker></div>
        <div class="w-100 text-center mb-3 dpicker-footer">
            <div class="btn-group">
                <button (click)="setDate()" type="button" class="btn btn-success" title="Сохранить" data-toggle="collapse" data-target="#startCal" aria-expanded="false" aria-controls="startCal">
                    <i class="fas fa-calendar-check"></i>
                    <span class="d-none d-sm-inline"> Ok</span>
                </button>
                <button (click)="cancelDate()" type="button" class="btn btn-secondary" title="Отмена" data-toggle="collapse" data-target="#startCal" aria-expanded="false" aria-controls="startCal">
                    <i class="fas fa-thumbs-down"></i>
                    <span class="d-none d-sm-inline"> Отмена</span>
                </button>
            </div>
        </div>
    </ng-template>
    <ng-template #modalloader>
        <tr><td colspan="7" class="text-center"><div class="loader"></div><br>Подождите, идёт загрузка данных.</td></tr>
    </ng-template>`
})
export class PoListComponent {
    private currentPO: ProdOrder = new ProdOrder;
    private _plist: ProdOrder[] = [];
    private tmpDT: object = {};
    model: NgbDateStruct;
    startCalDay: NgbDateStruct;

    @Input() title: string;
    @Input() emptyModal: boolean;
    @Input()
    set poList(list: ProdOrder[]) {
        this._plist = list;
        console.log(this._plist);
    }
    get poList() { return this._plist; }

    @Output() onSaved = new EventEmitter<boolean>();
    @ViewChild('target') targetRow: any;
    @ViewChild('startCal') calendar: any;

    constructor(private http: HttpService, private updater: Renderer, private renderer: Renderer2) {
        this.currentPO = new ProdOrder();
        console.log(this.poList);
    }

    private save() {
        console.log(this.currentPO);
        this.http.updateWODates(this.currentPO.entity_id, this.makeTrueDate(this.currentPO.start), this.currentPO.hours).subscribe(
            (data: any) => {
                console.log(data);
                this.onSaved.emit(true);
                this.cancel();
            },
            error => {
                let alert = this.renderer.createElement('div');
                const text = this.renderer.createText('Произошла ошибка на сервере.');
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
                //setTimeout(() => {
                //    this.renderer.setStyle(alert, 'display', 'none');
                //    console.log(alert);
                //}, 3000);
            }
        );
    }

    private editPO(po: any) {
        this.currentPO = po;
        var sup = new Date(po.start.replace(/(\d+).(\d+).(\d+) (\d+):(\d+):(\d+)/, '$2/$1/$3 $4:$5:$6'));
        this.tmpDT = { hour: sup.getHours(), minute: sup.getMinutes() };
        this.model = { year: sup.getFullYear(), month: (+sup.getMonth() + 1), day: sup.getDate() };
        this.startCalDay = { year: sup.getFullYear(), month: (+sup.getMonth() + 1), day: sup.getDate() };
    }

    private cancel() {
        this.currentPO = new ProdOrder();
    }



    private setDate() {
        this.currentPO.start = this.makeTrueDate(this.model.day + "." + this.model.month + "." + this.model.year + " " + this.tmpDT['hour'] + ":" + this.tmpDT['minute'] + ":00");
        this.updateComplete();
        this.toogleCalendar();
    }

    private cancelDate() {
        var sup = new Date(this.currentPO.start.replace(/(\d+).(\d+).(\d+) (\d+):(\d+):(\d+)/, '$2/$1/$3 $4:$5:$6'));
        this.model = { year: sup.getFullYear(), month: (+sup.getMonth() + 1), day: sup.getDate() };
        this.tmpDT = { hour: sup.getHours(), minute: sup.getMinutes() };
        this.toogleCalendar();
    }

    private updateComplete(e?: object) {
        var sup = new Date(this.currentPO.start.replace(/(\d+).(\d+).(\d+) (\d+):(\d+):(\d+)/, '$2/$1/$3 $4:$5:$6'));
        let tmp = {
            "days": Math.floor(+this.currentPO.hours / 24),
            "hours": +this.currentPO.hours % 24
        };
        sup.setDate(sup.getDate() + tmp.days);
        sup.setHours(sup.getHours() + tmp.hours);
        this.currentPO.complete = this.makeTrueDate(sup.getDate() + "." + (+sup.getMonth() + 1) + "." + sup.getFullYear() + " " + sup.getHours() + ":" + sup.getMinutes() + ":00");
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

    private toogleCalendar() {
        if (this.calendar.nativeElement.className.toString().indexOf('d-none') < 0) {
            this.renderer.addClass(this.calendar.nativeElement, 'd-none');
        } else {
            this.renderer.removeClass(this.calendar.nativeElement, 'd-none');
        }
    }

}