import { Component } from '@angular/core';

interface Single{
  name:String
  series: Array<{value: number, name: any}> // <-- note here it's explicitly any
}

var single: Single[] = [
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
      "name": "2016-08-23T10:24:08.741Z"
    },{
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

var bottom: Single[] = [
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

export class ChartTimelineComponent {

    //Chart Options

    single: any[];
    multi: any[];
    data1: any[];
    data2: any[];

    showXAxis = true;
    showYAxis = true;
    gradient = false;
    showLegend = false;
    showXAxisLabel = true;
    xAxisLabel = 'Country';
    showYAxisLabel = true;
    yAxisLabel = 'Population';
    view: any[] = [800, 60];
    view2: any[] = [800,100]

    colorScheme = {
      domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
    };
    autoScale = true;


    constructor(){
        console.log("Chart Component is loaded...");
        this.data1 = single.map(group => {
            group.series = group.series.map(dataItem => {
                dataItem.name = new Date(dataItem.name);
        return dataItem;
      })

      return group;
    })

        this.data2 = bottom.map(group => {
            group.series = group.series.map(dataItem => {
                dataItem.name = new Date(dataItem.name);
        return dataItem;
      })

      return group;
    })

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
        /*this.data = [
        {
          "name": "Germany",
          "value": 46268
        },
        {
          "name": "USA",
          "value": 53041
        },
        {
          "name": "France",
          "value": 42503
        },
        {
          "name": "United Kingdom",
          "value": 41787
        },
        {
          "name": "Spain",
          "value": 29863
        },
        {
          "name": "Italy",
          "value": 35925
        }
    ];*/
    }

}
