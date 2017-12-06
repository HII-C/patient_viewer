import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';


import { CheckboxInline } from '../components/form_components/checkbox-inline.component';
import { NormalBox1 } from '../components/form_components/normal-box-1.component';
import { NormalBox2 } from '../components/form_components/normal-box-2.component';
import { SelectListSingle } from '../components/form_components/select-list-single.component';
import { ScratchPadUpdate } from '../components/form_components/scrachpad-update.component';

@NgModule({
	imports: [
		FormsModule,
		BrowserModule
	],
	declarations: [
		CheckboxInline,
		NormalBox1,
		NormalBox2,
		SelectListSingle,
		ScratchPadUpdate
	], exports: [
		CheckboxInline,
		NormalBox1,
		NormalBox2,
		SelectListSingle,
		ScratchPadUpdate
	]
})

export class FormCreatorModule{}