import { Component, Input } from '@angular/core';

@Component({
	selector: "checkbox-inline",
	templateUrl: "./checkbox-inline.html"
})

export class CheckboxInline{
	@Input() inputData: any;
	checkboxData : boolean[] = [];
	combinedData: String[] = [];
	
	ngOnInit(){
		// initialize the checkboxes all to false
		for (var i = 0 ; i < this.inputData.data.checkbox.length; i++){
			this.checkboxData.push(false);
		}
	}
	
	getData(): any {
		this.combinedData = [];
		
		for (var i = 0 ; i < this.checkboxData.length; i++){
			if (this.checkboxData[i])
				this.combinedData.push(this.inputData.data.checkbox[i].description);
		}
		
		if (this.combinedData.length != 0){
			return {id: this.inputData.id, data: this.combinedData};
		}
		
		return null;
	}
}