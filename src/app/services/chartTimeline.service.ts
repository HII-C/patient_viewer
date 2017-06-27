import {Component, Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import { Chart } from '../models/chart.model';


@Injectable()
@Component({
})
export class ChartTimelineService {
    dataDef: Chart;
    test: Chart;
    constructor() {
        console.log("ChartTimelineService created...");


        this.dataDef = { labelFont: '10pt Calibri',
                        dataPointFont: '8pt Calibri',
                        dataPoints:[
                            {
                                title: 'Med A',
                                code: '1',
                                dashedLines: true,
                                normalValues: {low: 1000, high: 5009},
                                data: [{ y: 3309, x: '2016-09-19T10:24:08.741Z' },
                                        { y: 2927, x: '2016-09-15T21:10:06.716Z' },
                                        { y: 6264, x: '2016-09-19T15:57:56.065Z' },
                                        { y: 3890, x: '2016-09-19T01:52:22.028Z' },
                                        { y: 5290, x: '2016-09-15T11:33:32.350Z' },
                                        { y: 7909, x: '2016-10-01T10:24:08.741Z' },
                                        { y: 4309, x: '2016-09-22T10:24:08.741Z' },
                                        { y: 927,  x: '2016-09-14T21:10:06.716Z' },
                                        { y: 927,  x: '2016-09-09T21:10:06.716Z' },
                                        { y: 6264, x: '2016-09-25T15:57:56.065Z' }]
                            },
                            {
                                title: 'Med B',
                                code: '1',
                                dashedLines: false,
                                normalValues: {low: 1000, high: 5009},
                                data: [{ y: 3309, x: '2016-09-19T10:24:08.741Z' },
                                        { y: 2927, x: '2016-09-15T21:10:06.716Z' },
                                        { y: 6264, x: '2016-09-19T15:57:56.065Z' },
                                        { y: 3890, x: '2016-09-19T01:52:22.028Z' },
                                        { y: 5290, x: '2016-09-15T11:33:32.350Z' },
                                        { y: 4309, x: '2016-09-22T10:24:08.741Z' },
                                        { y: 927,  x: '2016-09-14T21:10:06.716Z' },
                                        { y: 6264, x: '2016-09-25T15:57:56.065Z' }]
                            },
                            {
                                title: 'Med C',
                                code: '1',
                                dashedLines: true,
                                normalValues: {low: 1500, high: 5009},
                                data: [{ y: 3309, x: '2016-09-19T10:24:08.741Z' },
                                        { y: 2927, x: '2016-09-15T21:10:06.716Z' },
                                        { y: 6264, x: '2016-09-19T15:57:56.065Z' },
                                        { y: 5290, x: '2016-09-15T11:33:32.350Z' },
                                        { y: 4309, x: '2016-09-22T10:24:08.741Z' },]
                            },
                        ]
                    };





    }

}
