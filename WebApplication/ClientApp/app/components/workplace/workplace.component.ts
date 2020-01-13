import { Input, Renderer2, ViewChild, Component, Injector, ApplicationRef, ComponentFactoryResolver, EmbeddedViewRef, OnInit } from '@angular/core';

import { UserModel } from '../../library/user-model';
import { FilterModel } from '../../library/filter-model';
import { UserService } from '../../services/user.service';
import { FilterService } from '../../services/filter.service';
import { HttpService } from '../../services/http.service';

import { MonthComponent } from '../../components/month/month.component';
import { YearComponent } from '../../components/year/year.component';
import { WeekComponent } from '../../components/week/week.component';

@Component({
    selector: 'workplace',
    templateUrl: './workplace.html'
})
export class WorkplaceComponent implements OnInit {

    private filter: FilterModel;
    private compR: any;

    constructor(private usrService: UserService,
                private filterService: FilterService,
                private http: HttpService,
                private renderer: Renderer2,
                private componentFactoryResolver: ComponentFactoryResolver,
                private injector: Injector,
                private appRef: ApplicationRef) { }

    ngOnInit() {
        this.filterService.filter.subscribe(
            (filt: FilterModel) => {
                this.filter = filt;
                if (this.filter.ready) {
                    this.showComponent();
                } else {
                    if (typeof (this.compR) !== 'undefined') {
                        this.compR.destroy();
                    }
                }
            }
        );
    }

    private showComponent() {
        if (typeof (this.compR) !== 'undefined') {
            this.compR.destroy();
        }

        switch (this.filter.form) {
            case "mon":
                this.compR = this.componentFactoryResolver
                    .resolveComponentFactory(MonthComponent)
                    .create(this.injector);
                break;
            case "week":
                this.compR = this.componentFactoryResolver
                    .resolveComponentFactory(WeekComponent)
                    .create(this.injector);
                break;
            case "year":
                this.compR = this.componentFactoryResolver
                    .resolveComponentFactory(YearComponent)
                    .create(this.injector);
                break;
        }

        this.appRef.attachView(this.compR.hostView);
        const domElem = (this.compR.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;

        document.getElementById('worktable').appendChild(domElem);
    }

}