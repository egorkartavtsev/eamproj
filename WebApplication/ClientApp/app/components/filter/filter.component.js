var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { FilterService } from '../../services/filter.service';
var FilterComponent = /** @class */ (function () {
    function FilterComponent(filterService) {
        var _this = this;
        this.filterService = filterService;
        this.filterService.filter.subscribe(function (filt) {
            _this.filterTotal = filt;
            console.log('Это сабж в лямбде-ФИЛЬТРА: ' + filt.areaFilter + ' ' + filt.machinesFilter + ' ' + filt.dateFilter + ' ');
        });
        console.log('Filter start');
    }
    FilterComponent.prototype.ngOnInit = function () {
        this.areas = ['цех1', 'цех2', 'цех3', 'цех4', 'цех5'];
        this.machines = ['agr1', 'agr2', 'agr3', 'agr4', 'agr5'];
        console.log('Filter complete');
    };
    FilterComponent.prototype.inp = function (val) {
        this.filterService.filter.next(this.filterTotal);
        //this.filter = this.filterService.updateFilter(key, val);
        console.log('Это фильтр: ' + this.filterTotal.areaFilter);
    };
    FilterComponent = __decorate([
        Component({
            selector: 'filter-box',
            templateUrl: './filter.html'
        }),
        __metadata("design:paramtypes", [FilterService])
    ], FilterComponent);
    return FilterComponent;
}());
export { FilterComponent };
//# sourceMappingURL=filter.component.js.map