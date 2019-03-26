var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from "@angular/core";
import { CookieService } from "angular2-cookie/core";
var TestComponent = /** @class */ (function () {
    function TestComponent(cookie) {
        this.cookie = cookie;
    }
    TestComponent.prototype.setCookie = function (key, value) {
        this.cookie.put(key, value);
        this.getCookie(key);
    };
    TestComponent.prototype.getCookie = function (key) {
        console.log("Cookie '" + key + "' = " + this.cookie.get(key));
        console.log("Cookie '6544545456645465' = " + this.cookie.get('6544545456645465'));
    };
    TestComponent = __decorate([
        Component({
            selector: 'test',
            templateUrl: './test.html'
        }),
        __metadata("design:paramtypes", [CookieService])
    ], TestComponent);
    return TestComponent;
}());
export { TestComponent };
//# sourceMappingURL=test.component.js.map