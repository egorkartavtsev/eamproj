var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Renderer2, Component, Injector, ApplicationRef, ComponentFactoryResolver } from '@angular/core';
import { UserService } from '../../services/user.service';
import { FilterService } from '../../services/filter.service';
import { HttpService } from '../../services/http.service';
import { MonthComponent } from '../../components/month/month.component';
import { YearComponent } from '../../components/year/year.component';
import { WeekComponent } from '../../components/week/week.component';
var WorkplaceComponent = /** @class */ (function () {
    function WorkplaceComponent(usrService, filterService, http, renderer, componentFactoryResolver, injector, appRef) {
        this.usrService = usrService;
        this.filterService = filterService;
        this.http = http;
        this.renderer = renderer;
        this.componentFactoryResolver = componentFactoryResolver;
        this.injector = injector;
        this.appRef = appRef;
    }
    WorkplaceComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.filterService.filter.subscribe(function (filt) {
            _this.filter = filt;
            if (_this.filter.ready) {
                _this.showComponent();
            }
            else {
                if (typeof (_this.compR) !== 'undefined') {
                    _this.compR.destroy();
                }
            }
        });
    };
    WorkplaceComponent.prototype.showComponent = function () {
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
        var domElem = this.compR.hostView.rootNodes[0];
        document.getElementById('worktable').appendChild(domElem);
    };
    WorkplaceComponent = __decorate([
        Component({
            selector: 'workplace',
            templateUrl: './workplace.html'
        }),
        __metadata("design:paramtypes", [UserService,
            FilterService,
            HttpService,
            Renderer2,
            ComponentFactoryResolver,
            Injector,
            ApplicationRef])
    ], WorkplaceComponent);
    return WorkplaceComponent;
}());
export { WorkplaceComponent };
//# sourceMappingURL=workplace.component.js.map