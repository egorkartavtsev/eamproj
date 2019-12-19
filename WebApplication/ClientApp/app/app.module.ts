// modules
import { NgModule }             from '@angular/core';
import { BrowserModule }        from '@angular/platform-browser';
import { HttpClientModule }     from '@angular/common/http';
import { FormsModule, ReactiveFormsModule }          from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SelectDropDownModule } from 'ngx-select-dropdown'
import { CookieService } from 'angular2-cookie/services/cookies.service';

// components
import { AppComponent }         from './components/app/app.component';
import { TestComponent }        from './components/test/test.component';
import { FilterComponent}       from './components/filter/filter.component';
import { WeekComponent }        from './components/week/week.component';
import { YearComponent }        from './components/year/year.component';
import { MonthComponent }       from './components/month/month.component';
import { PoListComponent }      from './components/poList/po-list.component';
import { CreateOrderComponent } from './components/createWO/createOrder.component';
import { EditcloneComponent } from './components/editclone/editclone.component';


//services
import { FilterService }    from './services/filter.service';
import { HttpService }      from './services/http.service';
import { UserService }      from './services/user.service';

//derectives
import { EmptyCellDirective } from './directives/empty-cell.directive';

// определение маршрутов
//const appRoutes: Routes =[
//    { path: '', component: MonthComponent},
//    { path: 'week', component: WeekComponent},
//    { path: 'test', component: TestComponent },
//    { path: 'year', component: YearComponent},
//    { path: 'month', component: MonthComponent},
//    { path: '**', redirectTo: '/' }
//];

@NgModule({
    imports: [NgbModule, SelectDropDownModule, BrowserModule, HttpClientModule, FormsModule, ReactiveFormsModule, RouterModule.forRoot([]) ],
    declarations: [AppComponent, FilterComponent, WeekComponent, MonthComponent, YearComponent, EmptyCellDirective, PoListComponent, CreateOrderComponent, TestComponent, EditcloneComponent],
    entryComponents: [EditcloneComponent],
    providers: [FilterService, HttpService, CookieService, UserService],
    bootstrap:      [ AppComponent ]
})
export class AppModule { }