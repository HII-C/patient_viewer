import { Component, Injectable } from '@angular/core';
import { Condition } from '../models/condition.model';
import { ConditionService } from './condition.service';
import * as _ from "lodash";

@Injectable()
@Component({
})
export class UpdatingService {

  constructor(private conditionService: ConditionService) { }

  updateEntry(entry: any, toChange: any, dataLocation: string, index: number) {
    // TO-DO - pass property accessors to function
    // https://stackoverflow.com/questions/6491463/accessing-nested-javascript-objects-with-string-key
    let testing = _.get(entry, dataLocation);
    _.set(this.conditionService.conditions[index], dataLocation, toChange);
    console.log("does this somehow work lmao?");
    console.log(testing);
  }
}
