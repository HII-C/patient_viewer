import {Component, Input} from '@angular/core';

@Component({
    selector: 'account',
    templateUrl: '/account.html'
})
export class AccountComponent {

    constructor() {
        console.log("AccountComponent created...");
    }

}
