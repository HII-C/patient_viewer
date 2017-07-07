import {Component, Input, Output, EventEmitter} from '@angular/core';
import {ObservationService} from '../services/observation.service';
import {ChartTimelineService} from '../services/chartTimeline.service';


@Component({
	selector: 'observationRecursion',
	templateUrl: '/observations.html'
})
export class ObservationRecursive {


	@Input() obs: any;
  @Input() level: number;
	constructor(private observationService: ObservationService, private chartService: ChartTimelineService) {
		console.log("Recursive created...");
	}
  getData() {
    return this.obs;
  }
  getLevel() {
    return this.level;
  }
	checked(obs:any) {
		obs.isSelected = !obs.isSelected
		console.log("value:"+JSON.stringify(obs));

		if(obs.isSelected) {
			for(let o of this.observationService.observations) {
				if (o['code']['coding'][0]['code'] == obs.code) {
					this.observationService.selected.push(o);
				}
			}
		}
		else {
			for(let o of this.observationService.observations) {
				if (o.id == obs.code) {
					let index = this.observationService.selected.indexOf(o);
					this.observationService.selected.splice(index,1);
				}
			}
		}
		console.log("checked",obs.isSelected,obs.code);
		this.chartService.setData(this.observationService.selected);
	}
}
