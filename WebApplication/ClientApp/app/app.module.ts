// modules
import { NgModule }             from '@angular/core';
import { BrowserModule }        from '@angular/platform-browser';
import { HttpClientModule }     from '@angular/common/http';
import { FormsModule }          from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { NgbModule }            from '@ng-bootstrap/ng-bootstrap';
import { CookieService }        from 'angular2-cookie/services/cookies.service';

// components
import { AppComponent }         from './components/app/app.component';
import { TestComponent }        from './components/test/test.component';
import { FilterComponent}       from './components/filter/filter.component';
import { WeekComponent }        from './components/week/week.component';
import { YearComponent }        from './components/year/year.component';
import { MonthComponent }       from './components/month/month.component';
import { PoListComponent }      from './components/poList/po-list.component';
import { CreateOrderComponent } from './components/createWO/createOrder.component';


//services
import { FilterService }    from './services/filter.service';
import { HttpService }      from './services/http.service';

//derectives
import { EmptyCellDirective } from './directives/empty-cell.directive';

// определение маршрутов
const appRoutes: Routes =[
    { path: '', component: MonthComponent},
    { path: 'week', component: WeekComponent},
    { path: 'test', component: TestComponent },
    { path: 'year', component: YearComponent},
    { path: 'month', component: MonthComponent},
    { path: '**', redirectTo: '/' }
];

@NgModule({
    imports:        [ NgbModule, BrowserModule, HttpClientModule, RouterModule.forRoot(appRoutes), FormsModule ],
    declarations: [AppComponent, FilterComponent, WeekComponent, MonthComponent, YearComponent, EmptyCellDirective, PoListComponent, CreateOrderComponent, TestComponent],
    providers: [FilterService, HttpService, CookieService ],
    bootstrap:      [ AppComponent ]
})
export class AppModule { }