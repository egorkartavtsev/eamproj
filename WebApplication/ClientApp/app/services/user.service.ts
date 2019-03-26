import { Injectable } from '@angular/core';
import { CookieService } from "angular2-cookie/core";

@Injectable()
export class UserService{

    private user: any = {
        "user_id": '',
        "ses_token": '',
        "name": ''
    };

    private logged: boolean = false;
    

    constructor(
        private cookie: CookieService
    ) {
        console.log('step 1');
    }

    isLogged(token: string): boolean {
        console.log('step 4: token = '+token);
        if (token !== undefined) {
            console.log('step 5-1');
            this.updateSession(token);
            this.logged = true;
        } else {
            console.log('step 5-2');
            if (!this.logged && this.cookie.get('eam_kp_t') !== undefined) {
                this.updateSession(this.cookie.get('eam_kp_t'));
            }
        }

        console.log('step 6: logged = ' + this.logged);

        return this.logged;
    }

    private updateSession(token: string) {

    }

    private createSession() { }
}