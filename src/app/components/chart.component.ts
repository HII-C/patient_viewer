import {Component} from '@angular/core';
import {LoupeService} from '../services/loupe.service';

@Component({
    selector: 'chart',
    templateUrl: '/chart.html'
})

export class ChartComponent {
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
    }

    test(e: any){
        console.log("Events work, see~" + e);
    }

    reRenderData(){
        for (let o of this.loupeService.observationsArray){
            if (o.code['coding'][0]['code'] == '32623-1'){
                console.log(o.valueQuantity.value);
                this.data[0].data.push(Number(o.valueQuantity.value));
                let dataSet = JSON.parse(JSON.stringify(this.data));
                this.data = dataSet;
            }
        }
    }

}
