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
            //if(numCharts>5) {break;} //temporary fix to prevent graph data overload
            numCharts++;
            count = 0;
            currentTitle = o.code['text'];
            newData.dataPoints.push({
                  title: "",
                  code: "",
                  dashedLines: false,
                  normalValues: {low: 0, high: 0},
                  data: []
              });
            newData.dataPoints[numCharts].title = o.code['text'];
            newData.dataPoints[numCharts].code = '2';
            newData.dataPoints[numCharts].dashedLines = true;
            newData.dataPoints[numCharts].normalValues = {low: 100, high: 200};
        }

          newData.dataPoints[numCharts].data.push({y: 0, x:0});
          newData.dataPoints[numCharts].data[count].y = o.valueQuantity['value'];
          let newDate = new Date(o.relativeDateTime).getTime();
          newData.dataPoints[numCharts].data[count].x = newDate;
          count++;


    }
      this.dataDef = newData;
    }
}
