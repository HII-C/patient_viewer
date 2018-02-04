import { Component } from '@angular/core';

@Component({
  selector: 'addObservation',
  templateUrl: '/addObservation.html'
})
export class AddObservation {
  model = { name: '', code: "1" };
  arrayOfKeyValues: any[] = [{ name: 'height', code: '8302-2' }, { name: 'weight', code: '3141-9' }, { name: 'oxygen_saturation', code: '2710-2' }, { name: 'temperature', code: '8310-5' }, { name: 'bmi', code: '39156-5' }];

  constructor() { }
}
