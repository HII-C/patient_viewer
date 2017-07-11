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
	graphData: Array<any> = [];
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

		if(obs.isSelected) {
			for(let o of this.observationService.observations) {
				if (o['code']['coding'][0]['code'] == obs.code) {
					this.graphData.push(o);
				}
			}
			this.observationService.selected.push(obs);

		}
		else {
			for(let o of this.observationService.observations) {
				if (o['code']['coding'][0]['code'] == obs.code) {
					let index = this.graphData.indexOf(o);
					this.graphData.splice(index,1);
				}
			}
			let index = this.observationService.selected.indexOf(obs);

			this.observationService.selected.splice(index,1);

		}

		console.log("checked",obs.isSelected,obs.code);
		this.chartService.setData(this.graphData);
	}
}
