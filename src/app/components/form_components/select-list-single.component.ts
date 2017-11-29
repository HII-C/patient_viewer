import { Component, Input } from '@angular/core';

@Component({
	selector: "select-list-single",
	templateUrl: "form_views/select-list-single.html"
})

export class SelectListSingle{
	@Input() inputData: any;
	listData: String;
	
	getData(): any {
		if (this.listData == null)
			return null;
		
		return {id: this.inputData.id, data: this.listData};
	}
}