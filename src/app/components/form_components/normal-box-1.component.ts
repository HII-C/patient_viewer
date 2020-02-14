import { Component, Input } from '@angular/core';

@Component({
	selector: "normal-box-1",
	templateUrl: "./normal-box-1.html"
})

export class NormalBox1{
	@Input() inputData: any;
	boxData: String;
	
	getData(): any {
		if (this.boxData == null)
			return null;
		
		return {id: this.inputData.id, data: this.boxData};
	}
}