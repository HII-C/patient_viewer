import { Component, Input } from '@angular/core';

@Component({
	selector: "normal-box-2",
	templateUrl: "./normal-box-2.html"
})

export class NormalBox2{
	@Input() inputData: any;
	boxData: String;
	
	getData(): any {
		if (this.boxData == null)
			return null;
		
		return {id: this.inputData.id, data: this.boxData};
	}
}