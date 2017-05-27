import { Component, Input } from '@angular/core';

import {NgGrid, NgGridItem, NgGridConfig, NgGridItemConfig, NgGridItemEvent} from 'angular2-grid';
import {DraggableWidget} from './draggable_widget.component';
import {Patient} from '../models/patient.model';
import {LoupeService} from '../services/loupe.service';


interface Single{
    name:String
    series: Array<any>
}

let single: Single[] = [
{
    "name": "David",
    "series": [
        {
            "value": 3309,
            "name": "2016-09-19T10:24:08.741Z"
        },
        {
            "value": 2927,
            "name": "2016-09-15T21:10:06.716Z"
        },
        {
            "value": 6264,
            "name": "2016-09-19T15:57:56.065Z"
        },
        {
            "value": 3890,
            "name": "2016-09-19T01:52:22.028Z"
        },
        {
            "value": 5290,
            "name": "2016-09-15T11:33:32.350Z"
        },
        {
            "value": 2309,
            "name": "2016-08-13T10:24:08.741Z"
        },
        {
            "value": 7909,
            "name": "2016-10-10T10:24:08.741Z"
        },
        {
            "value": 4309,
            "name": "2016-09-22T10:24:08.741Z"
        },
        {
            "value": 927,
            "name": "2016-09-14T21:10:06.716Z"
        },
        {
            "value": 6264,
            "name": "2016-09-25T15:57:56.065Z"
        },
        {
            "value": 2533,
            "name": "2016-08-10T01:52:22.028Z"
        },
        {
          "value": 3752
          ,
          "name": "2016-10-28T10:24:08.741Z"
        },

    ]
  }
];

let multi: Single[] = [
{
    "name": "David",
    "series": [
        {
            "value": 3309,
            "name": "2016-09-19T10:24:08.741Z"
        },
        {
            "value": 2927,
            "name": "2016-09-15T21:10:06.716Z"
        },
        {
            "value": 6264,
            "name": "2016-09-19T15:57:56.065Z"
        },
        {
            "value": 3890,
            "name": "2016-09-19T01:52:22.028Z"
        },
        {
            "value": 5290,
            "name": "2016-09-15T11:33:32.350Z"
        },
        {
            "value": 7909,
            "name": "2016-10-10T10:24:08.741Z"
        },
        {
            "value": 4309,
            "name": "2016-09-22T10:24:08.741Z"
        },
        {
            "value": 927,
            "name": "2016-09-14T21:10:06.716Z"
        },
        {
            "value": 6264,
            "name": "2016-09-25T15:57:56.065Z"
        },

    ]
  }
];

let bottom: Single[] = [
{
    "name": "David",
    "series": [
      {
        "value": null,
        "name": "2016-10-28T10:24:08.741Z"
      },
      {
        "value": null,
        "name": "2016-08-10T01:52:22.028Z"
      },
    ]
    }
];

@Component({
  selector: 'chartTimelines',
  templateUrl: '/chartTimeline.html',

})

export class ChartTimelineComponent implements DraggableWidget {

    // For options: https://github.com/BTMorton/angular2-grid
    gridItemConfiguration: NgGridItemConfig = {
        'col': 32,               //  The start column for the item
        'row': 3,               //  The start row for the item
        'sizex': 75,             //  The start width in terms of columns for the item
        'sizey': 45,             //  The start height in terms of rows for the item
        'dragHandle': null,     //  The selector to be used for the drag handle. If null, uses the whole item
        'resizeHandle': null,   //  The selector to be used for the resize handle. If null, uses 'borderSize' pixels from the right for horizontal resize,
        //    'borderSize' pixels from the bottom for vertical, and the square in the corner bottom-right for both
        'borderSize': 15,
        'fixed': false,         //  If the grid item should be cascaded or not. If yes, manual movement is required
        'draggable': true,      //  If the grid item can be dragged. If this or the global setting is set to false, the item cannot be dragged.
        'resizable': true,      //  If the grid item can be resized. If this or the global setting is set to false, the item cannot be resized.
        'payload': null,        //  An optional custom payload (string/number/object) to be used to identify the item for serialization
        'maxCols': 0,           //  The maximum number of columns for a particular item. This value will only override the value from the grid (if set) if it is smaller
        'minCols': 0,           //  The minimum number of columns for a particular item. This value will only override the value from the grid if larger
        'maxRows': 0,           //  The maximum number of rows for a particular item. This value will only override the value from the grid (if set) if it is smaller
        'minRows': 0,           //  The minimum number of rows for a particular item. This value will only override the value from the grid if larger
        'minWidth': 0,          //  The minimum width of a particular item. This value will override the value from the grid, as well as the minimum columns if the resulting size is larger
        'minHeight': 0,         //  The minimum height of a particular item. This value will override the value from the grid, as well as the minimum rows if the resulting size is larger
    }
    @Input() observations: Array<any>;
    start: Date;
    end: Date;
    startSub: any;
    endSub: any;

    startDate: any;
    endDate: any;
    dateDifference: any;
    startDate2: any;
    endDate2: any;
    dateDifference2: any;
    percentage: any;
    leftRatio: any;
    rightRatio: any;
    xPad: any;

//Chart data variables
    single: any[];
    multi: any[];
    data1: any[];
    data2: any[];
    data3: any[];
    view: any[];
    view2: any[];
    view3: any[];

    view2XMax: number;
    viewXMax: number;


//Chart Options
    showXAxis = true;
    showYAxis = true;
    gradient = false;
    showLegend = false;
    showXAxisLabel = true;
    xAxisLabel = 'Country';
    showYAxisLabel = true;
    yAxisLabel = 'Population';

    colorScheme = {
      domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
    };
    autoScale = true;

    constructor(private loupeService: LoupeService){
        console.log("Chart Component is loaded...");

        //this.start = multi[0].series[0].name;
        //this.end = multi[0].series[0].name;
        this.startSub = multi[0].series[0].name;
        this.endSub = multi[0].series[0].name;
        this.findStuff();
        console.log("Start Sub",this.startSub);
        console.log("End Sub",this.endSub);
        console.log();

        this.maxXAxis();
        this.otherXAxis();
        this.findPercentage();
        this.setXAxis();
        this.setPosition();
        this.setChartSizes();

        console.log(this.startDate);
        console.log(this.endDate);
        console.log(this.dateDifference);
        console.log(this.startDate2);
        console.log(this.endDate2);
        console.log(this.dateDifference2);
        console.log(this.percentage);
        console.log(this.view2XMax);
        console.log(this.xPad);
        console.log(bottom[0].series[1].name);



        this.data1 = single.map(group => {
            group.series = group.series.map(dataItem => {
                dataItem.name = new Date(dataItem.name);
        return dataItem;
      });

      return group;
    });

        this.data2 = bottom.map(group => {
            group.series = group.series.map(dataItem => {
                dataItem.name = new Date(dataItem.name);
        return dataItem;
      });

      return group;
    })

        this.data3 = multi.map(group => {
            group.series = group.series.map(dataItem => {
                dataItem.name = new Date(dataItem.name);
        return dataItem;
      });

      return group;
    });

    }
    // This Method will hold all of the live observation data, not 100% where to put it into graph, but just lmk and I can do it 
    ngOnChanges(){
        if (this.loupeService.observationsArray){
            console.log(this.loupeService.observationsArray);
            single[0].name = 'Austin';
            single[0].series = [];
            for (let o of this.loupeService.observationsArray){
                if (o.valueQuantity){
                    single[0].series.push({"value": o.valueQuantity.value, "name": o.effectiveDateTime});
                }
                else if (o.component){
                    single[0].series.push({"value": o.component[0].valueQuantity.value, "name": o.effectiveDateTime});
                }
            }
            console.log(single);
        }
        else{
            console.log('Invalid observations array');
        }

    }

maxXAxis(){
    //Overall date difference for setting max X-Axis
        this.startDate = new Date("2016-08-10T01:52:22.028Z");
        this.endDate = new Date("2016-10-28T10:24:08.741Z");
        this.dateDifference = this.endDate.valueOf() - this.startDate.valueOf();
        console.log("maxXAxis ", this.startDate, this.endDate, this.dateDifference)
    }

otherXAxis(){
    //Date difference of other data sets to compare to get percentage
        this.startDate2 = new Date(this.startSub); //"2016-09-14T21:10:06.716Z"
        this.endDate2 = new Date(this.endSub); //"2016-10-10T10:24:08.741Z"
        this.dateDifference2 = this.endDate2.valueOf() - this.startDate2.valueOf();
    }

findPercentage(){
    //Find percentage to get size of x-axis
        this.percentage = this.dateDifference2/this.dateDifference;
    }

setXAxis(){
    //X-Axis sizes
        this.viewXMax = 800;
        this.view2XMax = this.viewXMax * this.percentage;
    }

setPosition(){
    //Set position of graph with padding using startDate, endDate, and startDate2
        this.leftRatio = this.startDate2.valueOf() - this.startDate.valueOf();
        this.rightRatio = this.endDate.valueOf() - this.startDate2.valueOf();
        this.xPad = (this.leftRatio/(this.leftRatio + this.rightRatio)) * this.viewXMax; //left padding in pixels
    }

setChartSizes(){
//Chart sizes
    this.view = [this.viewXMax, 45];
    this.view2 = [this.viewXMax, 131];
    this.view3 = [this.view2XMax, 45];
}

findStuff()
    {
        for (let i of multi[0].series)
        {
            console.log("i.name: ", i.name);
            console.log("start: ", this.startSub, "end", this.endSub);
            if (this.startSub > i.name)
            {
                this.startSub = i.name;
            }
            else if (this.endSub < i.name)
            {
                this.endSub = i.name;
            }
        }
    }

}
