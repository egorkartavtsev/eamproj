import { Component } from "@angular/core";
import { CookieService } from "angular2-cookie/core";

@Component({
    selector: 'test',
    templateUrl: './test.html'
})

export class TestComponent {

    constructor(private cookie: CookieService) { }

    private key: string;
    private value: string;

    setCookie(key: string, value: string) {
        this.cookie.put(key, value);
        this.getCookie(key);
    }

    getCookie(key: string) {
        console.log("Cookie '" + key + "' = " + this.cookie.get(key));
        console.log("Cookie '6544545456645465' = " + this.cookie.get('6544545456645465'));
    }

}