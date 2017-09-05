import {Component, Output, EventEmitter, NgModule} from '@angular/core';

import {NgGrid, NgGridItem, NgGridConfig, NgGridItemConfig, NgGridItemEvent} from 'angular2-grid';

import {DraggableWidget} from './draggable_widget.component';

import {BrowserModule} from '@angular/platform-browser';
import {LoupeService} from '../services/loupe.service';
// import {NgxChartsModule} from '@swimlane/ngx-charts';


@Component({
    selector: 'chart',
    templateUrl: '/chart.html',
})
export class ChartComponent implements DraggableWidget {

	// For options: https://github.com/BTMorton/angular2-grid
	gridItemConfiguration: NgGridItemConfig = {
		'col': 35,               //  The start column for the item
		'row': 3,               //  The start row for the item
		'sizex': 70,             //  The start width in terms of columns for the item
		'sizey': 40,             //  The start height in terms of rows for the item
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

    //Chart Options

    single: any[];
    multi: any[];

    showXAxis = true;
    showYAxis = true;
    gradient = false;
    showLegend = false;
    showXAxisLabel = true;
    xAxisLabel = 'Country';
    showYAxisLabel = true;
    yAxisLabel = 'Population';
    view: any[] = [800, 400];

    colorScheme = {
      domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
    };
    autoScale = true;


    public data: Array<any> = [
        {data: [0], label: 'Series A'},
        {data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B'},
        {data: [18, 48, 77, 9, 100, 27, 40], label: 'Series C'}
        ];
    public labels: Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
    public options: any = {
            responsive: true
        };
    public colors:Array<any> = [
        { // grey
          backgroundColor: 'rgba(148,159,177,0.2)',
          borderColor: 'rgba(148,159,177,1)',
          pointBackgroundColor: 'rgba(148,159,177,1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(148,159,177,0.8)'
        },
        { // dark grey
          backgroundColor: 'rgba(77,83,96,0.2)',
          borderColor: 'rgba(77,83,96,1)',
          pointBackgroundColor: 'rgba(77,83,96,1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(77,83,96,1)'
        },
        { // grey
          backgroundColor: 'rgba(148,159,177,0.2)',
          borderColor: 'rgba(148,159,177,1)',
          pointBackgroundColor: 'rgba(148,159,177,1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(148,159,177,0.8)'}
    ];
    public legend: boolean = true;
    public type: string = 'line';


    constructor(private loupeService: LoupeService){
        console.log("Chart Component is loaded...");
        this.single = [
        {
          "name": "Germany",
          "value": 8940000
        },
        {
          "name": "USA",
          "value": 5000000
        },
        {
          "name": "France",
          "value": 7200000
            }
        ];
        this.multi = [
        {
          "name": "Germany",
          "series": [
            {
              "name": "2010",
              "value": 7300000
            },
            {
              "name": "2011",
              "value": 8940000
            }
          ]
        },

        {
          "name": "USA",
          "series": [
            {
              "name": "2010",
              "value": 7870000
            },
            {
              "name": "2011",
              "value": 8270000
            }
          ]
        },

        {
          "name": "France",
          "series": [
            {
              "name": "2010",
              "value": 5000002
            },
            {
              "name": "2011",
              "value": 5800000
            }
          ]
        }
      ];
    }


    test(e: any){
        console.log("Events work, see~" + e);
    }

    reRenderData(){
        for (let o of this.loupeService.observationsArray){
            if (o.code['coding'][0]['code'] == '32623-1'){
                console.log(o.valueQuantity.value);
                this.data[0].data.push(Number(o.valueQuantity.value));

            }
        }
        let dataSet = JSON.parse(JSON.stringify(this.data));
        this.data = dataSet;
    }



}
