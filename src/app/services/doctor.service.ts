import { Injectable } from '@angular/core';

import { CookieService } from 'ngx-cookie-service';
import { Condition } from '../models/condition.model';

@Injectable()
export class DoctorService {
  filter: Array<String> = [];
  configMode: boolean = true;
  graphConfig: Array<Array<string>> = [];

  constructor(private cookieService: CookieService) { }

  // The change to visiblities modifiers for the list should be an input to assignVisible(), and input through conditions.component.ts
  assignVisible(list: Array<Condition>) {
    // Wipes the lists, as assignVisible() gets called on subscribe){data == true} for conditions.component.ts
    // Needs to have a clean list, or it will push doubles/triples, or more

    // Use "let of" to generate enumerated list, allows for pass by value iteration
    let count = 0;
    for (let c of list) {
      // Right now the logic only excludes one code, for testing purposes
      // thisModel is a undefined data model, depending on if we want to leave the service with the data we need to create a static model, but
      // it should work for testing purposes

      if (count < 2) {
        for (let i of this.filter) {
          if (c.code['coding'][0]['code'] == i) {
            c.isVisible = true;
            count++;
            break;
          } else {
            c.isVisible = false;
          }
        }
      }
      else {
        c.isVisible = false;
      }
    }

    // returning the updated list for the spec parameters
    return list;
  }

  addGraphConfig(list: Array<string>) {
    this.graphConfig.push(list);
    this.cookieService.set('graphConfig', JSON.stringify(this.graphConfig));
  }
}
