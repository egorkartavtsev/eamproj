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
import { HttpService } from '../../services/http.service';
var FilterComponent = /** @class */ (function () {
    function FilterComponent(http, filterService) {
        var _this = this;
        this.http = http;
        this.filterService = filterService;
        this.organizations = [];
        this.agregates = [];
        this.routing_sequences = [];
        this.filterService.filter.subscribe(function (filt) {
            _this.filterTotal = filt;
        });
        this.http.getOrganizations().subscribe(function (data) {
            _this.organizations = Object.keys(data).map(function (i) { return data[i]; });
        });
    }
    FilterComponent.prototype.ngOnInit = function () {
    };
    FilterComponent.prototype.inp = function (source) {
        var _this = this;
        switch (source) {
            case 'area':
                this.filterTotal.agr_filter = '';
                this.filterTotal.wt_filter = '';
                this.agregates = [];
                this.routing_sequences = [];
                if (this.filterTotal.org_filter !== '') {
                    this.http.getAgrs(this.filterTotal.org_filter.toString()).subscribe(function (data) {
                        _this.agregates = Object.keys(data).map(function (i) { return data[i]; });
                    });
                }
                break;
            case 'agr':
                this.filterTotal.wt_filter = '';
                this.routing_sequences = [];
                if (this.filterTotal.agr_filter !== '') {
                    this.http.geTK(this.filterTotal.agr_filter).subscribe(function (data) {
                        var tmp = Object.keys(data).map(function (i) { return data[i]; });
                        for (var _i = 0, tmp_1 = tmp; _i < tmp_1.length; _i++) {
                            var row = tmp_1[_i];
                            var sup = row.ROUTING_COMMENT.split(":");
                            _this.routing_sequences.push(sup[0]);
                        }
                    });
                }
                break;
        }
        this.filterService.filter.next(this.filterTotal);
    };
    FilterComponent = __decorate([
        Component({
            selector: 'filter-box',
            templateUrl: './filter.html'
        }),
        __metadata("design:paramtypes", [HttpService, FilterService])
    ], FilterComponent);
    return FilterComponent;
}());
export { FilterComponent };
//# sourceMappingURL=filter.component.js.map