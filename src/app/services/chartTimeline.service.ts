import {Component, Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import { Chart } from '../models/chart.model';
import { Observation } from '../models/observation.model';


@Injectable()
@Component({
})
export class ChartTimelineService {
    dataDef: Chart;
    test: Chart;
    constructor() {
        console.log("ChartTimelineService created...");
    }

    setData(data) {
      let newData = new Chart();
      newData.labelFont = "10pt Calibri";
      newData.dataPointFont = '8pt Calibri';
      newData.dataPoints = [];
      let currentTitle = '';
      let count = 0;
      let numCharts = -1;
      for(let o of data) {
        if(!o.valueQuantity || !o.valueQuantity['value']) {
          continue;
        }
        if(o.code['text'] != currentTitle) {
            numCharts++;
            count = 0;
            currentTitle = o.code['text'];
            newData.dataPoints.push({
                  title: "",
                  code: "",
                  dashedLines: true,
                  normalValues: {low: 0, high: 0},
                  data: []
              });
            newData.dataPoints[numCharts].title = o.code['text'];
            newData.dataPoints[numCharts].code = '1';
            newData.dataPoints[numCharts].dashedLines = true;
            newData.dataPoints[numCharts].normalValues = {low: 115, high: 127};
        }

          newData.dataPoints[numCharts].data.push({y: 0, x:''});
          newData.dataPoints[numCharts].data[count].y = o.valueQuantity['value'];
          newData.dataPoints[numCharts].data[count].x = o.effectiveDateTime;
          count++;


    }
      this.dataDef = newData;
    }
}
