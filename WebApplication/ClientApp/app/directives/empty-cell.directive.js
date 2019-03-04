var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Directive, Input, ElementRef } from '@angular/core';
var EmptyCellDirective = /** @class */ (function () {
    function EmptyCellDirective(element) {
        this.element = element;
    }
    Object.defineProperty(EmptyCellDirective.prototype, "emptyCell", {
        set: function (cell) {
            if (cell !== "") {
                this.element.nativeElement.style.fontWeight = "bold";
                //this.element.nativeElement.style.backgroundColor = "#a3c1c9";
                //this.element.nativeElement.style.borderColor = "#93b1b9";
            }
        },
        enumerable: true,
        configurable: true
    });
    __decorate([
        Input(),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], EmptyCellDirective.prototype, "emptyCell", null);
    EmptyCellDirective = __decorate([
        Directive({ selector: '[emptyCell]' }),
        __metadata("design:paramtypes", [ElementRef])
    ], EmptyCellDirective);
    return EmptyCellDirective;
}());
export { EmptyCellDirective };
//# sourceMappingURL=empty-cell.directive.js.map