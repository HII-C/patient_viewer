import {Component, Compiler, ElementRef} from '@angular/core';
import {DoctorService} from '../services/doctor.service';
import {ToolBarService} from '../services/toolbar.service';

@Component({
    selector: 'favorites',
    templateUrl: '/favorites.html'
})
export class Favorites {

    constructor(private doctorService: DoctorService, private elRef:ElementRef, private toolbarService:ToolBarService) {
        console.log("Favorites component created");
    }
    newTest:string = "100px";
    onRightClick() {
      console.log("clicked");

        return false;
      }
      test(ref: ElementRef) {
        console.log("normal");
        console.log(this.elRef);
        console.log(this.elRef.nativeElement.querySelector('div').style.left);
        this.newTest = "200px";

      }
      test2() {
        console.log("hi");
      }
}
