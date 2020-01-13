var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
// modules
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SelectDropDownModule } from 'ngx-select-dropdown';
// components
import { AppComponent } from './components/app/app.component';
import { FilterComponent } from './components/filter/filter.component';
import { WeekComponent } from './components/week/week.component';
import { YearComponent } from './components/year/year.component';
import { MonthComponent } from './components/month/month.component';
import { PoListComponent } from './components/poList/po-list.component';
import { CreateOrderComponent } from './components/createWO/createOrder.component';
import { EditcloneComponent } from './components/editclone/editclone.component';
import { WorkplaceComponent } from './components/workplace/workplace.component';
import { MessageComponent } from './components/helpers/helpers.component';
//services
import { FilterService } from './services/filter.service';
import { HttpService } from './services/http.service';
import { UserService } from './services/user.service';
import { CookieService } from 'angular2-cookie/services/cookies.service';
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        NgModule({
            imports: [NgbModule, SelectDropDownModule, BrowserModule, HttpClientModule, FormsModule, ReactiveFormsModule, RouterModule.forRoot([])],
            declarations: [AppComponent, FilterComponent, WeekComponent, MonthComponent, YearComponent, PoListComponent, CreateOrderComponent, EditcloneComponent, MessageComponent, WorkplaceComponent],
            entryComponents: [EditcloneComponent, MessageComponent, WeekComponent, MonthComponent, YearComponent],
            providers: [FilterService, HttpService, CookieService, UserService],
            bootstrap: [AppComponent]
        })
    ], AppModule);
    return AppModule;
}());
export { AppModule };
//# sourceMappingURL=app.module.js.map