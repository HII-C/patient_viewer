import { Component, ElementRef } from '@angular/core';

import { DoctorService } from '../../services/doctor.service';
import { ToolBarService } from '../../services/toolbar.service';

@Component({
  selector: 'favorites',
  templateUrl: './favorites.html'
})
export class Favorites {
  constructor(private doctorService: DoctorService, private elRef: ElementRef, private toolbarService: ToolBarService) { }

  newTest: string = "100px";

  onRightClick() {
    return false;
  }

  test(ref: ElementRef) {
    /*console.log("normal");
    console.log(this.elRef);
    console.log(this.elRef.nativeElement.querySelector('div').style.left);*/
    this.newTest = "200px";
  }

  test2() {
    console.log("hi");
  }
}
