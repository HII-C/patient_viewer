import {Component, Injectable} from '@angular/core';


@Injectable()
@Component({
})
export class ToolBarService {
  leftPosition:string;
  topPosition:string;

    constructor() {
        console.log("Toolbar Service created...");
    }

}
