var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
import { CookieService } from "angular2-cookie/core";
var UserService = /** @class */ (function () {
    function UserService(cookie) {
        this.cookie = cookie;
        this.user = {
            "user_id": '',
            "ses_token": '',
            "name": ''
        };
        this.logged = false;
        console.log('step 1');
    }
    UserService.prototype.isLogged = function (token) {
        console.log('step 4: token = ' + token);
        if (token !== undefined) {
            console.log('step 5-1');
            this.updateSession(token);
            this.logged = true;
        }
        else {
            console.log('step 5-2');
            if (!this.logged && this.cookie.get('eam_kp_t') !== undefined) {
                this.updateSession(this.cookie.get('eam_kp_t'));
            }
        }
        console.log('step 6: logged = ' + this.logged);
        return this.logged;
    };
    UserService.prototype.updateSession = function (token) {
    };
    UserService.prototype.createSession = function () { };
    UserService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [CookieService])
    ], UserService);
    return UserService;
}());
export { UserService };
//# sourceMappingURL=user.service.js.map