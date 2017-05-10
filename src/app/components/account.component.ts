import {Component, Input} from '@angular/core';
import {DoctorService} from '../services/doctor.service';


@Component({
    selector: 'account',
    templateUrl: '/account.html',
})
export class AccountComponent {
    settings: Array<String> = [];
    electrolytes: Array<String> = ["Sodium","Potassium","Chloride","CO2","Calcium","Magnesium","HBA1C","GLU","ANA"];
    cholesteralBattery: Array<String> = ["Total","LDL","HDL","Triglycerides"];
    liverFunction: Array<String> = ["ALT","AST","Albumin","Bilirubin"];
    kidneyFunction: Array<String> = ["Creatinine","GFR","BUN"];


    constructor(private doctorService: DoctorService) {
        console.log("AccountComponent created...");
    }

    addSetting(checked: boolean, setting: String) {
      if(checked) {
        this.settings.push(setting);
      }
      else{
        this.settings.splice(this.settings.indexOf(setting),1);
      }
    }

    saveSettings() {
      this.doctorService.filter = this.settings;
      console.log("saved");
    }

}