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
	checked(checked: boolean, value) {
		if(checked) {
			for(let o of this.observationService.observations) {
				if (o['code']['coding'][0]['code'] == value) {
					this.observationService.selected.push(o);
				}
			}
		}
		else {
			for(let o of this.observationService.observations) {
				if (o.id == value) {
					let index = this.observationService.selected.indexOf(o);
					this.observationService.selected.splice(index,1);
				}
			}
		}
		console.log("checked",checked,value);
	}
}
