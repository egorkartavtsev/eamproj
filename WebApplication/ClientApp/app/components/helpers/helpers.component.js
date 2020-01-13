var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Input, Output, Component, EventEmitter } from '@angular/core';
var MessageComponent = /** @class */ (function () {
    function MessageComponent() {
        this.onClose = new EventEmitter();
    }
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], MessageComponent.prototype, "text", void 0);
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], MessageComponent.prototype, "stat", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Object)
    ], MessageComponent.prototype, "onClose", void 0);
    MessageComponent = __decorate([
        Component({
            selector: 'msg-comp',
            templateUrl: './message.html'
        })
    ], MessageComponent);
    return MessageComponent;
}());
export { MessageComponent };
//# sourceMappingURL=helpers.component.js.map