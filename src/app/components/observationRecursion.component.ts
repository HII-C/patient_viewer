import {Component, Input, Output, EventEmitter} from '@angular/core';
import {ObservationService} from '../services/observation.service';


@Component({
	selector: 'observationRecursion',
	templateUrl: '/observations.html'
})
export class ObservationRecursive {


	@Input() obs: any;
  @Input() level: number;
	constructor(private observationService: ObservationService) {
		console.log("Recursive created...");
	}
  getData() {
    return this.obs;
  }
  getLevel() {
    return this.level;
  }
}
