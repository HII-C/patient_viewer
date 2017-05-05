import {Component, Output, EventEmitter, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {LoupeService} from '../services/loupe.service';
import {NgxChartsModule} from '@swimlane/ngx-charts';


@Component({
    selector: 'chart',
    templateUrl: '/chart.html',
})


export class ChartComponent {

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
