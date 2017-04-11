import {Component, Input} from '@angular/core';
import {DoctorService} from '../services/doctor.service';

@Component({
    selector: 'account',
    templateUrl: '/account.html'
})
export class AccountComponent {
    settings: Array<String> = [];

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
