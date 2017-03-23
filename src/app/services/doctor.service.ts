import {Component, Injectable} from '@angular/core';
import {LoupeService} from './loupe.service';
import {Condition} from '../models/condition.model';

@Injectable()
@Component({
})
export class DoctorService {
	// Creates the class-scope variables so we can call this.exportList, and doctorService.exportList from other components
	viewConditionList: Array<any> = [];
	exportList: Array<Condition> = [];

	constructor() {
		console.log("Doctor Prefrence Service running...");
	}

	// The change to visiblities modifiers for the list should be an input to assignVisible(), and input through conditions.component.ts
	assignVisible(list: Array<Condition>){
		// Wipes the lists, as assignVisible() gets called on subscribe){data == true} for conditions.component.ts
		// Needs to have a clean list, or it will push doubles/triples, or more
		this.exportList = new Array<Condition>();
		this.viewConditionList = new Array<Condition>();
		// Use "let of" to generate enumerated list, allows for pass by value iteration
		for (let c of list){
			// Right now the logic only excludes one code, for testing purposes
			// thisModel is a undefined data model, depending on if we want to leave the service with the data we need to create a static model, but
			// it should work for testing purposes
			if (c.code['coding'][0]['code'] != "310249008"){
				let thisModel = {condition: c, visibleStatus: true, extraData: []};
				this.viewConditionList.push(thisModel);
			}
			if  (c.code['coding'][0]['code'] != "442311008"){
				let thisModel = {condition: c, visibleStatus: true, extraData: []};
				this.viewConditionList.push(thisModel);
			}
			else{
				let thisModel = {condition: c, visibleStatus: false, extraData: []};
				this.viewConditionList.push(thisModel);
			}
		}
		// More pass by value iteration
		for (let v of this.viewConditionList){
			if (v.visibleStatus == true){
				this.exportList.push(v.condition);
			}
		}
		// returning the updated list for the spec parameters
		return this.exportList;
	}
}
