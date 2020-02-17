import { Component, Input } from '@angular/core';
import { DoctorService } from 'app/services/doctor.service';

@Component({
  selector: 'account',
  templateUrl: './account.html',
})
export class AccountComponent {
  settings: Array<string> = [];
  electrolytes: Array<string> = ["Sodium", "Potassium", "Chloride", "CO2", "Calcium", "Magnesium", "HBA1C", "GLU", "ANA"];
  cholesteralBattery: Array<string> = ["Total", "LDL", "HDL", "Triglycerides"];
  liverFunction: Array<string> = ["ALT", "AST", "Albumin", "Bilirubin"];
  kidneyFunction: Array<string> = ["Creatinine", "GFR", "BUN"];

  constructor(private doctorService: DoctorService) { }

  addSetting(checked: boolean, setting: string) {
    if (checked) {
      this.settings.push(setting);
    }
    else {
      this.settings.splice(this.settings.indexOf(setting), 1);
    }
  }

  saveSettings() {
    this.doctorService.filter = this.settings;
    this.doctorService.addGraphConfig(this.settings);
    console.log("saved");
  }

  toggleConfigMode() {
    if (this.doctorService.configMode == true) {
      this.doctorService.configMode = false;
    }
    else {
      this.doctorService.configMode = true;
    }
  }
}
