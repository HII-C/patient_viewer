import { Component, Input } from '@angular/core';

@Component({
	selector: "scratchpad-update",
	templateUrl: "./scrachpad-update.html"
})

export class ScratchPadUpdate{
	@Input() inputData: any;
	
	description: string;
	status: string;
	onset: string;
	
	getData(): any {		
		return {id: this.inputData.id, data: {description: this.description, status: this.status}};
	}
	
	onRadioChanged(currStatus: string): void {
		console.log("changing!!!");
		this.status = currStatus;
	}
}