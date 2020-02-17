import { Component, OnInit, ViewChildren, Input, Output, EventEmitter} from '@angular/core';
import { Form } from 'app/models/form.model';

@Component({
  selector: 'form-builder',
  templateUrl: './form-builder.html',
  styles: ["#main_list {list-style-type: none;}"]
})

export class FormBuilder  {
	// GLOBAL VARIABLES
	public forms: Form[];
	@ViewChildren('form') components: any;
	
	totalData: String[] = [];
	combData: any;
	
	@Input() formInput: any[];
	@Input() userId: String; 
	
	@Output() onSubmitClick: EventEmitter<any> = new EventEmitter<any>();
	
	// ============================== EVENT METHODS ==================================
	constructor(){}
	
	ngOnInit(): void {
		this.getForms();
	}
		
	// method that uses service to get the forms from the server
	getForms(): void {
		//this.formBuilderService.getTemplate().then(forms => {this.forms = forms; console.log(forms);});
		this.forms = this.formInput;
	}
	
	// ===================== LOGIC WHEN SUBMIT BUTTON CLICKED ========================
	
	public submitClick(): void {
		this.totalData = [];
	
		for (var i = 0 ; i < this.components._results.length; i++){
			var currData = this.components._results[i].getData();
			if (currData != null){
				this.totalData.push(currData);
			}
		}
		
		this.combData = {patient: this.userId, data: this.totalData};
		
		// then emit the data to the parent component
		this.onSubmitClick.emit(this.combData);		
	}
	
	public storeData(data: any): void {
		// send data to server or do whatever with it
	}
	
	public getData(): any {
		return this.totalData;
	}
}
