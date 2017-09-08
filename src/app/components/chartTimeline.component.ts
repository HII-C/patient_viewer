import {Component, Input, Output, EventEmitter, Pipe} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import {NgGrid, NgGridItem, NgGridConfig, NgGridItemConfig, NgGridItemEvent} from 'angular2-grid';
import {DraggableWidget} from './draggable_widget.component';
import {Patient} from '../models/patient.model';
import {LoupeService} from '../services/loupe.service';
import {DoctorService} from '../services/doctor.service';
import {ChartTimelineService} from '../services/chartTimeline.service';
import {ObservationService} from '../services/observation.service';
import {ConditionService} from '../services/condition.service';
import {Condition} from '../models/condition.model';
import {ObservationRecursiveChart} from './observationRecursionChart.component';
import {Observation} from '../models/observation.model';
import {Http, Headers, RequestOptions, Response} from '@angular/http';
import {MapService} from '../services/map.service';
import { UpdatingService } from '../services/updating.service';
import { FhirService } from '../services/fhir.service';
import {ConditionsComponent} from '../components/conditions.component';
import {CarePlanService} from '../services/carePlan.service';
import {CarePlan} from '../models/carePlan.model';
import {ConditionsChartComponent} from './conditionsChart.component';
import {CarePlanChartComponent} from './carePlanChart.component';

import { CsiroService } from '../services/csiro.service';
import { ScratchPadService } from '../services/scratchPad.service';

import { Csiro } from '../models/csiro.model';

import {Subscription} from 'rxjs/Subscription';

import { Chart } from '../models/chart.model';

import * as moment from 'moment';


declare var $:any; //Necessary in order to use jQuery to open popup.
@Component({
  selector: 'chartTimelines',
  templateUrl: '/chartTimeline.html',
})

export class ChartTimelineComponent {
    constructor(private loupeService: LoupeService, private doctorService: DoctorService,
        private chartService: ChartTimelineService, private observationService: ObservationService,
        private conditionService: ConditionService, private mapService: MapService,
        private http:Http, private updatingService: UpdatingService, private fhirService: FhirService,
        private csiroService: CsiroService, private scratchPadService: ScratchPadService,
        private carePlanService: CarePlanService){
        console.log("Chart Component is loaded...");
        this.subscription = this.chartService.activateGraph$.subscribe(clicked => {
            this.update();

        });
        moment.updateLocale('en', {
        relativeTime : {
            future: "in %s",
            past:"%s ago",
            s:  "1s",
            ss : '%ds',
            m:  "1min",
            mm: "%dmin",
            h:  "1h",
            hh: "%h",
            d:  "1d",
            dd: "%dd",
            M:  "1m",
            MM: "%dm",
            y:  "1y",
            yy: "%dy"
        }
        });
        this.mappings = MapService.STATIC_MAPPINGS;
        this.loupeService.activeCondition = this.selectedC;
        this.passThrough.emit(this.patient);

    }

    subscription: Subscription;

//Observation
    selectedO: Observation;
	test: Observation;
	observations: Array<Observation> = [];
	@Input() patient: Patient;
	@Output() observationReturned: EventEmitter<Array<any>> = new EventEmitter();
	mappings: { [key: string]: Array<string> } = {};

//Conditions
    selectedC: Condition;
    conditions: Array<Condition> = [];
    viewToggle: boolean = false;
    collapseQueue: Array<any> = [];
    conditionGrouping: Array<any> = [];
    conditionGroupingName: Array<any> = ["Active", "Inactive"];
    textInputForEdit: String;

    @Output() conditionSelected: EventEmitter<Condition> = new EventEmitter();

//Actions
	@Output() passThrough: EventEmitter<Patient> = new EventEmitter();
    obsCount: number = 0;
    updateTotal(event) {
        console.log("total:"+event);
        this.obsCount = event;
    }


//Chart
    maxYValue: number = 0;
    newData: Array<any> = [];
    data: Chart;
    ctx: CanvasRenderingContext2D;
    count: number = 0;
    chartHeight: number;
    chartWidth: number;
    canvasHeight: number;

    whole: boolean = true;
    twentyFiveYears: boolean = false;
    tenYears: boolean = false;
    fiveYears: boolean = false;
    twoYears: boolean = false;
    oneYear: boolean = false;
    sixMonths: boolean = false;
    threeMonths: boolean = false;
    oneMonth: boolean = false;
    twoWeeks: boolean = false;
    specifyDates: boolean = false;
    startDate: Date;
    endDate: Date;

    static readonly twentyFiveYearsMS: number = 788923150000;
    static readonly tenYearsMS: number = 315569260000;
    static readonly fiveYearsMS: number = 157784630000;
    static readonly twoYearsMS: number = 63113852000;
    static readonly oneYearsMS: number = 31556926000;
    static readonly sixMonthsMS: number = 15778463000;
    static readonly threeMonthsMS: number = 7889231500;
    static readonly oneMonthMS: number = 2629743833.3;
    static readonly twoWeeksMS: number = 1209600000;


    update() {

        this.render('canvas', this.chartService.dataDef);
    }
    render(canvasId, dataObj) {
        this.maxYValue = 0;
        this.count = 0;
        var margin = { top: 0, left: 0, right: 0, bottom: 0 };
        var overallMax, overallMin;
        this.data = this.chartService.dataDef;
        console.log(JSON.stringify(this.data));
        for (var i = 0; i < this.data.dataPoints.length; i++)
        {
            this.newData[i] = JSON.parse(JSON.stringify(this.data.dataPoints[i].data.map(this.makeDate)));
            this.newData[i].sort((a, b) => {return a.x - b.x});
        }
        this.getMaxDataYValue();
        var canvas = <HTMLCanvasElement> document.getElementById(canvasId);
        this.chartHeight = 100; //canvas.getAttribute('height'); //100
        this.chartWidth = Number(canvas.getAttribute('width'));
        this.ctx = canvas.getContext("2d");

        //reset context
        this.ctx.save();
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.restore();
        this.ctx.clearRect(0, 0, this.chartWidth, this.chartService.canvasHeight);

        this.renderChart();

    }

    makeDate(data) {
        data.x = new Date(data.x).getTime();
        return data;
    }
    getMaxDataYValue() {
        for (let i = 0; i < this.newData.length; i++) {
            if (this.newData[i][0].y > this.maxYValue) this.maxYValue = this.newData[i][0].y;
        }
    };

    setWhole()
    {
        this.whole = true;
        this.twentyFiveYears = false;
        this.tenYears = false;
        this.fiveYears = false;
        this.twoYears = false;
        this.oneYear = false;
        this.sixMonths = false;
        this.threeMonths = false;
        this.oneMonth = false;
        this.twoWeeks = false;
        this.specifyDates = false;
        this.ctx.save();
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.restore();
        this.ctx.clearRect(0, 0, this.chartWidth, this.chartService.canvasHeight);
        this.update();
        console.log(this.whole);
    }
    setTwentyFiveYears()
    {
        this.whole = false;
        this.twentyFiveYears = true;
        this.tenYears = false;
        this.fiveYears = false;
        this.twoYears = false;
        this.oneYear = false;
        this.sixMonths = false;
        this.threeMonths = false;
        this.oneMonth = false;
        this.twoWeeks = false;
        this.specifyDates = false;
        this.ctx.save();
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.restore();
        this.ctx.clearRect(0, 0, this.chartWidth, this.chartService.canvasHeight);
        this.update();
        console.log(this.twentyFiveYears);
    }
    setTenYears()
    {
        this.whole = false;
        this.twentyFiveYears = false;
        this.tenYears = true;
        this.fiveYears = false;
        this.twoYears = false;
        this.oneYear = false;
        this.sixMonths = false;
        this.threeMonths = false;
        this.oneMonth = false;
        this.twoWeeks = false;
        this.specifyDates = false;
        this.ctx.save();
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.restore();
        this.ctx.clearRect(0, 0, this.chartWidth, this.chartService.canvasHeight);
        this.update();
        console.log(this.tenYears);
    }
    setFiveYears()
    {
        this.whole = false;
        this.twentyFiveYears = false;
        this.tenYears = false;
        this.fiveYears = true;
        this.twoYears = false;
        this.oneYear = false;
        this.sixMonths = false;
        this.threeMonths = false;
        this.oneMonth = false;
        this.twoWeeks = false;
        this.specifyDates = false;
        this.ctx.save();
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.restore();
        this.ctx.clearRect(0, 0, this.chartWidth, this.chartService.canvasHeight);
        this.update();
        console.log(this.fiveYears);
    }
    setTwoYears()
    {
        this.whole = false;
        this.twentyFiveYears = false;
        this.tenYears = false;
        this.fiveYears = false;
        this.twoYears = true;
        this.oneYear = false;
        this.sixMonths = false;
        this.threeMonths = false;
        this.oneMonth = false;
        this.twoWeeks = false;
        this.specifyDates = false;
        this.ctx.save();
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.restore();
        this.ctx.clearRect(0, 0, this.chartWidth, this.chartHeight);
        this.update();
        console.log(this.twoYears);
    }
    setOneYear()
    {
        this.whole = false;
        this.twentyFiveYears = false;
        this.tenYears = false;
        this.fiveYears = false;
        this.twoYears = false;
        this.oneYear = true;
        this.sixMonths = false;
        this.threeMonths = false;
        this.oneMonth = false;
        this.twoWeeks = false;
        this.specifyDates = false;
        this.ctx.save();
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.restore();
        this.ctx.clearRect(0, 0, this.chartWidth, this.chartHeight);
        this.update();
        console.log(this.oneYear);
    }
    setSixMonths()
    {
        this.whole = false;
        this.twentyFiveYears = false;
        this.tenYears = false;
        this.fiveYears = false;
        this.twoYears = false;
        this.oneYear = false;
        this.sixMonths = true;
        this.threeMonths = false;
        this.oneMonth = false;
        this.twoWeeks = false;
        this.specifyDates = false;
        this.ctx.save();
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.restore();
        this.ctx.clearRect(0, 0, this.chartWidth, this.chartHeight);
        this.update();
        console.log(this.sixMonths);
    }
    setThreeMonths()
    {
        this.whole = false;
        this.twentyFiveYears = false;
        this.tenYears = false;
        this.fiveYears = false;
        this.twoYears = false;
        this.oneYear = false;
        this.sixMonths = false;
        this.threeMonths = true;
        this.oneMonth = false;
        this.twoWeeks = false;
        this.specifyDates = false;
        this.ctx.save();
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.restore();
        this.ctx.clearRect(0, 0, this.chartWidth, this.chartHeight);
        this.update();
        console.log(this.threeMonths);
    }
    setOneMonth()
    {
        this.whole = false;
        this.twentyFiveYears = false;
        this.tenYears = false;
        this.fiveYears = false;
        this.twoYears = false;
        this.oneYear = false;
        this.sixMonths = false;
        this.threeMonths = false;
        this.oneMonth = true;
        this.twoWeeks = false;
        this.specifyDates = false;
        this.ctx.save();
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.restore();
        this.ctx.clearRect(0, 0, this.chartWidth, this.chartHeight);
        this.update();
        console.log(this.oneMonth);
    }
    setTwoWeeks()
    {
        this.whole = false;
        this.twentyFiveYears = false;
        this.tenYears = false;
        this.fiveYears = false;
        this.twoYears = false;
        this.oneYear = false;
        this.sixMonths = false;
        this.threeMonths = false;
        this.oneMonth = false;
        this.twoWeeks = true;
        this.specifyDates = false;
        this.ctx.save();
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.restore();
        this.ctx.clearRect(0, 0, this.chartWidth, this.chartHeight);
        this.update();
        console.log(this.twoWeeks);
    }
    setSpecifyDates(startDate, endDate)
    {
        this.startDate = startDate;
        this.endDate = endDate;
        console.log("startDate, endDate", this.startDate, this.endDate);
        this.whole = false;
        this.twentyFiveYears = false;
        this.tenYears = false;
        this.fiveYears = false;
        this.twoYears = false;
        this.oneYear = false;
        this.sixMonths = false;
        this.threeMonths = false;
        this.oneMonth = false;
        this.twoWeeks = false;
        this.specifyDates = true;
        this.ctx.save();
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.restore();
        this.ctx.clearRect(0, 0, this.chartWidth, this.chartHeight);
        this.update();
        console.log(this.specifyDates);
    }

    renderChart() {
        var overallMaxAndMin = this.getOverallMaxAndMin();
        var offsetAndWidth;
        var dateMin;
        var dateMax = null;
        var indexStart;
        var dateRange;
        var dateNow = new Date().getTime();
        if (this.whole == true)
        {
            dateRange = null;
            dateMin = overallMaxAndMin.min;
            console.log("dateMin", dateMin);
        }
        else if (this.twentyFiveYears == true)
        {
            dateMin = dateNow - ChartTimelineComponent.twentyFiveYearsMS;
            dateRange = ChartTimelineComponent.twentyFiveYearsMS;
            console.log("dateMin", dateMin);
        }
        else if (this.tenYears == true)
        {
            dateMin = dateNow - ChartTimelineComponent.tenYearsMS;
            dateRange = ChartTimelineComponent.tenYearsMS;
            console.log("dateMin", dateMin);
        }
        else if (this.fiveYears == true)
        {
            dateMin = dateNow - ChartTimelineComponent.fiveYearsMS;
            dateRange = ChartTimelineComponent.fiveYearsMS;
            console.log("dateMin", dateMin);
        }
        else if (this.twoYears == true)
        {
            dateMin = dateNow - ChartTimelineComponent.twoYearsMS;
            dateRange = ChartTimelineComponent.twoYearsMS;
            console.log("dateMin", dateMin);
        }
        else if (this.oneYear == true)
        {
            dateMin = dateNow - ChartTimelineComponent.oneYearsMS;
            dateRange = ChartTimelineComponent.oneYearsMS;
            console.log("dateMin", dateMin);
        }
        else if (this.sixMonths == true)
        {
            dateMin = dateNow - ChartTimelineComponent.sixMonthsMS;
            dateRange = ChartTimelineComponent.sixMonthsMS;
            console.log("dateMin", dateMin);
        }
        else if (this.threeMonths == true)
        {
            dateMin = dateNow - ChartTimelineComponent.threeMonthsMS;
            dateRange = ChartTimelineComponent.threeMonthsMS;
            console.log("dateMin", dateMin);
        }
        else if (this.oneMonth == true)
        {
            dateMin = dateNow - ChartTimelineComponent.oneMonthMS;
            dateRange = ChartTimelineComponent.oneMonthMS;
            console.log("dateMin", dateMin);
        }
        else if (this.twoWeeks == true)
        {
            dateMin = dateNow - ChartTimelineComponent.twoWeeksMS;
            dateRange = ChartTimelineComponent.twoWeeksMS;
            console.log("dateMin", dateMin);
        }
        else if (this.specifyDates == true)
        {
            dateMin = this.startDate;
            dateMax = this.endDate;
            dateRange = dateMax - dateMin;
            console.log("dateMin", dateMin);
        }

        var overallDateMinAndMax = this.getOverallDateMinAndMax(dateMin, dateMax);

        this.renderAxisLabels(overallMaxAndMin, dateMin, dateRange, dateNow, overallDateMinAndMax, dateMax);
        this.ctx.save();
        this.ctx.translate(0, 60);
        for (let i = 0; i < this.data.dataPoints.length; i++)
        {
            this.ctx.save();
            this.translateLines();
            this.renderLines();
            this.renderName(i);
            this.ctx.save();
            //TODO offsetAndWidth still need to be fixed for date selection
            offsetAndWidth = this.getOffsetAndWidth(overallMaxAndMin.min, overallMaxAndMin.max, this.newData[i][0].x, this.newData[i][this.newData[i].length-1].x);
            this.translateNewChart(offsetAndWidth.offset);
            //render data
            if (this.data.dataPoints[i].code == '1')
            {
                this.renderDataType1(this.newData[i], i, offsetAndWidth.offset, offsetAndWidth.width, overallMaxAndMin.max, overallMaxAndMin.min);
            }
            else if (this.data.dataPoints[i].code == '2')
            {
                this.renderDataType2(this.newData[i], offsetAndWidth.width);
            }
            else if (this.data.dataPoints[i].code == '3')
            {
                this.renderDataType3(this.newData[i], i, offsetAndWidth.offset, offsetAndWidth.width, overallMaxAndMin.max, overallMaxAndMin.min, dateMin, dateRange);
            }
            this.ctx.restore();
            this.ctx.restore();
        }
        this.ctx.restore();

    }

    getOverallMaxAndMin() //TODO is there ever a reason why both this and next function would be needed??
    {
        var max = this.newData[0][this.newData[0].length-1].x;
        var min = this.newData[0][0].x;
        for (let i = 0; i < this.newData.length; i++)
        {
            if (this.newData[i][0].x < min)
            {
                min = this.newData[i][0].x;
            }
            if (this.newData[i][this.newData[i].length-1].x > max)
            {
                max = this.newData[i][this.newData[i].length-1].x
            }
        }
        return {min: min, max: max};
    }

    getOverallDateMinAndMax(dateMin, dateMax)
    {
        var oDateMin = this.newData[0][0].x; //TODO closer to present or past????
        var oDateMax = this.newData[0][this.newData.length-1].x; //TODO same as above     currently both values to the inside
        for (let i = 0; i < this.newData.length; i++)
        {
            if (i == 0)
            {
                for (let j = 0; j < this.newData[i].length; j++)
                {
                    if (this.newData[i][j].x > dateMin)
                    {
                        oDateMin = this.newData[i][j].x;
                        break;
                    }
                }
                if (dateMax != null)
                {
                    for (let k = this.newData[i].length-1; k >= 0; k--)
                    {
                        if (this.newData[i][k].x < dateMax)
                        {
                            oDateMax = this.newData[i][k].x;
                            break;
                        }
                    }
                }
            }
            else
            {
                for (let j = 0; j < this.newData[i].length; j++)
                {
                    if (this.newData[i][j].x > dateMin && this.newData[i][j].x < oDateMin)
                    {
                        oDateMin = this.newData[i][j].x;
                    }
                }
                if (dateMax != null)
                {
                    for (let k = this.newData[i].length-1; k >= 0; k--)
                    {
                        if (this.newData[i][k].x < dateMax && this.newData[i][k].x > oDateMax)
                        {
                            oDateMax = this.newData[i][k].x;
                            break;
                        }
                    }
                }
            }
        }
        console.log("oDateMin", oDateMin, "oDateMax", oDateMax);
        return {oDateMin: oDateMin, oDateMax: oDateMax};
    }

    renderAxisLabels(overallMaxAndMin, dateMin, dateRange, dateNow, overallDateMinAndMax, dateMax)
    {
        console.log("overallDateMin", overallDateMinAndMax, "dateMin", dateMax);
        var interval, intervalDate;
        var totInterval;
        if (this.specifyDates == true)
        {
            totInterval = overallDateMinAndMax.oDateMax - overallDateMinAndMax.oDateMin;
        }
        else if (this.whole == true)
        {
            totInterval = overallMaxAndMin.max - overallMaxAndMin.min;
        }
        else
        {
            totInterval = overallMaxAndMin.max - overallDateMinAndMax.oDateMin;
        }

        console.log("dateRange", dateRange);

        this.drawLine(0, 60, this.chartWidth, 60, 'black', 2);
        this.ctx.save();
        this.ctx.translate(17,0);
        for (let i = 0; i < 9; i++)
        {
            this.drawLine(i*(this.chartWidth/10), 60, (i*(this.chartWidth/10))+20, 1, 'black', 1);
            interval = overallDateMinAndMax.oDateMin + ((totInterval/10)*i);
            intervalDate = moment(interval).fromNow();
            this.ctx.save();
            this.ctx.translate(i*(this.chartWidth/10)+22,30);
            this.ctx.rotate(-1.22496);
            this.ctx.font = this.data.labelFont;
            this.ctx.textAlign = 'center';
            this.ctx.fillText(intervalDate, 0, 0);
            this.ctx.restore();
        }
        this.ctx.restore();
    }

    translateLines()
    {
        this.ctx.translate(0, this.count*(this.chartHeight+1));
        this.count++;
    }

    renderLines() {

        //Vertical lines
        this.drawLine(1, 4, 1, this.chartHeight, 'black', 2);
        //this.drawLine(this.chartWidth-1, 0, this.chartWidth-1, this.chartHeight, 'black', 2);

        //Horizontal Line
        this.drawLine(0, this.chartHeight, this.chartWidth, this.chartHeight, 'black', 2);
    }

    drawLine(startX, startY, endX, endY, strokeStyle, lineWidth) {
        if (strokeStyle != null) this.ctx.strokeStyle = strokeStyle;
        if (lineWidth != null) this.ctx.lineWidth = lineWidth;
        this.ctx.beginPath();
        this.ctx.moveTo(startX, startY);
        this.ctx.lineTo(endX, endY);
        this.ctx.stroke();
        this.ctx.closePath();
    }

    renderName(i)
    {
        this.ctx.save();
        this.ctx.font = this.data.labelFont;
        this.ctx.textAlign = 'left';
        this.ctx.fillText(this.data.dataPoints[i].title, 5, 12);
        this.ctx.restore();
    }
    getOffsetAndWidth(oMin, oMax, min, max)
    {
        let oLength = oMax.valueOf() - oMin.valueOf();
        let length = max.valueOf() - min.valueOf();
        let width = (length/oLength)*(this.chartWidth-30);

        let leftRatio = min.valueOf() - oMin.valueOf();
        let rightRatio = oMax.valueOf() - min.valueOf();
        let offset = (leftRatio/(leftRatio+rightRatio))*this.chartWidth;
        console.log("offset",offset);
        return {width: width, offset: offset};
    }
    translateNewChart(xTranslate)
    {
        this.ctx.translate(xTranslate, 0);
    }

    renderDataType1(newData, index, offset, width, max, min) {
        console.log("newData", newData);
        var maxAndMins = this.getMaxAndMins(newData, 1); //TODO add button control here as well

        //this section is currently for using the "potential max and min" values as bounds for the height of the graphs.  Will need to be changed at some point
        var top = maxAndMins.largestY+50;
        var bottom = maxAndMins.smallestY-50;
        if (bottom < 0) bottom = 0;

        var xLength = newData[newData.length-1].x - newData[0].x;
        var perc = xLength*.04;
        xLength = xLength + perc;
        var yLength = top - bottom; //maxAndMins.largestY - maxAndMins.smallestY;
        var a, b, c, d, y;
        var sameVal = true;
        var xPos, yPos;
        var txt;
        var fontSize = '8pt Calibri';
        var prevY = 0;
        var prevX = 0;
        var nextY = 0;
        var nextX = 0;
        var first = true;
        var prevPos = "";
        var shadedY;
        var shadedHeight = (this.data.dataPoints[index].normalValues.high - this.data.dataPoints[index].normalValues.low) / (maxAndMins.largestY) * (this.chartHeight - 25);

        //Draw rectangle for normal value range
        if (this.data.dataPoints[index].normalValues.high < maxAndMins.largestY && this.data.dataPoints[index].normalValues.low > maxAndMins.smallestY)
        {
            y = this.data.dataPoints[index].normalValues.high - maxAndMins.smallestY;
            shadedY = (this.chartHeight-30) - (y/yLength)*(this.chartHeight-30);
            this.ctx.save();
            this.ctx.translate(15, 15);
            this.ctx.fillStyle = 'rgba(100, 100, 100, 0.25)';
            this.ctx.rect(-15 - offset, shadedY, this.chartWidth, shadedHeight);
            this.ctx.fill();
            this.ctx.restore();
            //console.log("Chart 1");
        }
        else if (this.data.dataPoints[index].normalValues.high > maxAndMins.largestY && this.data.dataPoints[index].normalValues.low > maxAndMins.smallestY)
        {
            shadedHeight = 15 + (maxAndMins.largestY - this.data.dataPoints[index].normalValues.low) / (maxAndMins.largestY) * (this.chartHeight - 25);
            this.ctx.fillStyle = 'rgba(100, 100, 100, 0.25)';
            this.ctx.rect(-15 - offset, 0, this.chartWidth + 15, shadedHeight);
            this.ctx.fill();
            //console.log("Chart 2", y);
        }
        else if (this.data.dataPoints[index].normalValues.high > maxAndMins.largestY && this.data.dataPoints[index].normalValues.low < maxAndMins.smallestY)
        {
            this.ctx.fillStyle = 'rgba(100, 100, 100, 0.25)';
            this.ctx.rect(-15 - offset, 0, this.chartWidth + 15, this.chartHeight);
            this.ctx.fill();
            //console.log("Chart 3");
        }
        else
        {
            y = this.data.dataPoints[index].normalValues.high - maxAndMins.smallestY;
            shadedY = (this.chartHeight-30) - (y/yLength)*(this.chartHeight-30);
            shadedHeight = (this.chartHeight-15) - shadedY;
            this.ctx.save();
            this.ctx.translate(15, 15);
            this.ctx.fillStyle = 'rgba(100, 100, 100, 0.25)';
            this.ctx.rect(-15 - offset, shadedY, this.chartWidth, shadedHeight);
            this.ctx.fill();
            this.ctx.restore();
            //console.log("Chart 4");
        }

        //console.log("Height and Y", shadedHeight, shadedY);

        this.ctx.save();
        this.ctx.translate(17, 15);

        //Get font for value rendering
        if (this.data.dataPointFont)
        {
            fontSize = this.data.dataPointFont;
        }
        this.ctx.font = fontSize;

        //Check if all values are the same
        for (let i = 1; i < newData.length; i++)
        {
            if (newData[i].y != newData[i-1].y)
            {
                sameVal = false;
                break;
            }
        }

        for (let i = 0; i < newData.length; i++)
        {
            if (newData.length == 1)
            {
                xPos = 0;
                console.log("xPos", xPos);
                yPos = (this.chartHeight-30) - (newData[i].y/yLength)*(this.chartHeight-30);
                /*console.log("yPos", yPos);
                console.log("1 value");*/
            }
            else if (sameVal == true)
            {
                a = newData[i].x - newData[0].x;
                xPos = (a/xLength)*(width /*- 30*/);
                console.log(this.chartHeight,newData[i].y,yLength,this.chartHeight);
                yPos = (this.chartHeight-30) - (newData[i].y/yLength)*(this.chartHeight-30);
                /*console.log("xPos", xPos);
                console.log("yPos", yPos);
                console.log("same values");*/
            }
            else
            {
                a = newData[i].x - newData[0].x;
                xPos = (a/xLength)*(width /*- 30*/);
                b = newData[i].y - bottom; //maxAndMins.smallestY;
                yPos = (this.chartHeight-30) - (b/yLength)*(this.chartHeight-30);
                /*console.log("xPos", xPos);
                console.log("yPos", yPos);
                console.log("regular");*/
            }

            console.log(newData[i].y, xPos, yPos);

            //Render dashed line if necessary
            if (this.data.dataPoints[index].dashedLines == true)
            {
                if (first == true) {} // do nothing
                else
                {
                    this.drawDashedLine(prevX, prevY, xPos, yPos);
                }
            }

            if (newData[i].y < this.data.dataPoints[index].normalValues.low || newData[i].y > this.data.dataPoints[index].normalValues.high)
            {
                //Render red circle
                this.ctx.beginPath();
                this.ctx.fillStyle = 'rgb(255, 0, 0)';
                this.ctx.arc(xPos, yPos, 2, 0, 2 * Math.PI, false)
                this.ctx.fill();
                this.ctx.lineWidth = 1;
                this.ctx.strokeStyle = 'rgb(255, 0, 0)';
                this.ctx.stroke();
                this.ctx.closePath();
            }
            else
            {
                //Render black circle
                this.ctx.beginPath();
                this.ctx.fillStyle = '#000';
                this.ctx.arc(xPos, yPos, 2, 0, 2 * Math.PI, false)
                this.ctx.fill();
                this.ctx.lineWidth = 1;
                this.ctx.strokeStyle = '#000';
                this.ctx.stroke();
                this.ctx.closePath();
            }

            if (i != newData.length - 1)
            {
                c = newData[i+1].x - newData[0].x;
                nextX = (c/xLength)*(width-30);
                d = newData[i+1].y - maxAndMins.smallestY;
                nextY = (this.chartHeight-30) - (d/yLength)*(this.chartHeight-30);
            }

            //Render value
            if (first == true)
            {
                //if first, compare to next
                if (nextX - xPos < 20 && yPos - nextY <= 20 && yPos - nextY >= 0)
                {
                    prevPos = "bottom";
                    txt = newData[i].y.toFixed(2);
                    this.ctx.textAlign = 'center';
                    this.ctx.fillText(txt, xPos, yPos + 15);
                    //console.log("1.1");
                }
                else
                {
                    prevPos = "top";
                    txt = newData[i].y.toFixed(2);
                    this.ctx.textAlign = 'center';
                    this.ctx.fillText(txt, xPos, yPos - 5);
                    //console.log("1.2");
                }
                first = false;
            }
            else if (i == newData.length - 1)
            {
                //if last, compare to prev
                if (xPos - prevX < 20 && prevY - yPos <= 20 && yPos - nextY >= 0)
                {
                    prevPos = "bottom";
                    txt = newData[i].y.toFixed(2);
                    this.ctx.textAlign = 'center';
                    this.ctx.fillText(txt, xPos, yPos + 15);
                    //console.log("2.1");
                }
                else
                {
                    prevPos = "top";
                    txt = newData[i].y.toFixed(2);
                    this.ctx.textAlign = 'center';
                    this.ctx.fillText(txt, xPos, yPos - 5);
                    //console.log("2.2");
                }
            }
            else
            {
                //if 2nd to n-1, compare to prev and next
                if (xPos - prevX < 20 && prevPos == "top" && yPos - prevY <= 20 && yPos - nextY >= 0)
                {
                    prevPos = "bottom";
                    txt = newData[i].y.toFixed(2);
                    this.ctx.textAlign = 'center';
                    this.ctx.fillText(txt, xPos, yPos + 15);
                    //console.log("3.1");
                }
                else if (nextX - xPos < 20 && prevPos == "top" && yPos - nextY <= 20 && yPos - nextY >= 0)
                {
                    prevPos = "bottom";
                    txt = newData[i].y.toFixed(2);
                    this.ctx.textAlign = 'center';
                    this.ctx.fillText(txt, xPos, yPos + 15);
                    //console.log("3.2");
                }
                else
                {
                    txt = newData[i].y.toFixed(2);
                    this.ctx.textAlign = 'center';
                    this.ctx.fillText(txt, xPos, yPos - 5);
                    //console.log("3.3");
                }
            }

            //console.log("prevX", prevX, "xPos", xPos, "prevY", prevY, "yPos", yPos, "nextX", nextX, "nextY", nextY);

            prevX = xPos;
            prevY = yPos;
        }

        this.ctx.restore();

    }

    renderDataType2(newData, width)
    {
        var xLength = newData[newData.length-1].x - newData[0].x;
        var perc = xLength*.04;
        xLength = xLength + perc;
        var a;
        var sameVal = true;
        var xPos;
        var first = true;

        this.ctx.save();
        this.ctx.translate(17, 15);

        //Check if all values are the same
        for (let i = 1; i < newData.length; i++)
        {
            if (newData[i].y != newData[i-1].y)
            {
                sameVal = false;
                break;
            }
        }

        for (let i = 0; i < newData.length; i++)
        {
            if (newData.length == 1)
            {
                xPos = 0;
                /*console.log("xPos", xPos);
                console.log("1 value");*/
            }
            else if (sameVal == true)
            {
                a = newData[i].x - newData[0].x;
                xPos = (a/xLength)*(width /*- 30*/);
                console.log(this.chartHeight,newData[i].y,this.chartHeight);
                /*console.log("xPos", xPos);
                console.log("same values");*/
            }
            else
            {
                a = newData[i].x - newData[0].x;
                xPos = (a/xLength)*(width /*- 30*/);
                /*console.log("xPos", xPos);
                console.log("regular");*/
            }

            this.drawLineWithX(xPos);
        }

        this.ctx.restore();

    }

    renderDataType3(newData, index, offset, width, max, min, dateMin, dateRange) {
        console.log("newData", newData);

        var j = 0;
        if (dateRange != null)
        {
            for (let i = 0; i < newData.length; i++)
            {
                if (newData[i].x >= dateMin)
                {
                    j = i;
                    console.log("j set", j, "dateMin", dateMin, "newData.x", newData[i].x);
                    break;
                }
            }
        }
        var maxAndMins = this.getMaxAndMins(newData, 0);

        //this section is currently for using the "potential max and min" values as bounds for the height of the graphs.  Will need to be changed at some point
        var top = maxAndMins.largestY+50;
        var bottom = maxAndMins.smallestY-50;
        if (bottom < 0) bottom = 0;

        var xLength = newData[newData.length-1].x - newData[0].x;
        var perc = xLength*.04;
        xLength = xLength + perc;
        var yLength = top - bottom;
        var a, b, c, d, y;
        var sameVal = true;
        var xPos, yPos;
        var first = true;
        var whole = false;
        var duration = new Date(8640000000).getTime();

        this.ctx.save();
        this.ctx.translate(17, 15);

        //Check if all values are the same
        for (let i = j + 1; i < newData.length; i++)
        {
            if (newData[i].y != newData[i-1].y)
            {
                sameVal = false;
                break;
            }
        }

        while (j < newData.length)
        {
            if (newData.length-j == 1)
            {
                xPos = 0;
                yPos = -((this.chartHeight) - (newData[j].y/yLength)*(this.chartHeight));
                /*console.log("xPos", xPos);
                console.log("1 value");*/
            }
            else if (sameVal == true)
            {
                a = newData[j].x - newData[0].x;
                xPos = (a/xLength)*(width);
                yPos = -((this.chartHeight) - (newData[j].y/yLength)*(this.chartHeight));
                console.log(this.chartHeight,newData[j].y,this.chartHeight);
                /*console.log("xPos", xPos);
                console.log("same values");*/
            }
            else
            {
                a = newData[j].x - newData[0].x;
                xPos = (a/xLength)*(width);
                b = newData[j].y - bottom;
                yPos = (this.chartHeight) - (b/yLength)*(this.chartHeight);
                /*console.log("xPos", xPos);
                console.log("regular");*/
            }

            this.ctx.fillStyle = 'grey';
            this.ctx.rect(xPos, this.chartHeight-16, (duration/xLength)*width, -yPos);
            this.ctx.fill();

            j++;
        }

        /*for (let i = 0; i < newData.length; i++)
        {
            if (newData.length == 1)
            {
                xPos = 0;
                yPos = -((this.chartHeight) - (newData[i].y/yLength)*(this.chartHeight));
                console.log("xPos", xPos);
                console.log("1 value");
            }
            else if (sameVal == true)
            {
                a = newData[i].x - newData[0].x;
                xPos = (a/xLength)*(width);
                yPos = -((this.chartHeight) - (newData[i].y/yLength)*(this.chartHeight));
                console.log(this.chartHeight,newData[i].y,this.chartHeight);
                console.log("xPos", xPos);
                console.log("same values");
            }
            else
            {
                a = newData[i].x - newData[0].x;
                xPos = (a/xLength)*(width);
                b = newData[i].y - bottom;
                yPos = (this.chartHeight) - (b/yLength)*(this.chartHeight);
                console.log("xPos", xPos);
                console.log("regular");
            }

            this.ctx.fillStyle = 'grey';
            this.ctx.rect(xPos, this.chartHeight-16, (duration/xLength)*width, -yPos);
            this.ctx.fill();
        }*/

        this.ctx.restore();
    }

    getMaxAndMins(newData, a) {
        if ((newData.length - a) % 2 == 0)
        {
            //set initial largest and smallest y values
            if(newData[a].y >= newData[a+1].y)
            {
                var largestY = newData[a].y;
                var smallestY = newData[a+1].y;
            }
            else
            {
                var largestY = newData[a+1].y;
                var smallestY = newData[a].y;
            }
            var i = a+2;
            var j = a+3;
        }
        else
        {
            var largestY = newData[a].y;
            var smallestY = newData[a].y;
            var i = a+1;
            var j = a+2;
        }

        //find smallest and largest y values in the data set
        while (j <= newData.length)
        {
            if (newData[i].y >= newData[j].y)
            {
                if (newData[i].y > largestY)
                {
                    largestY = newData[i].y;
                }
                if (newData[j].y < smallestY)
                {
                    smallestY = newData[j].y;
                }
            }
            else
            {
                if (newData[i].y < smallestY)
                {
                    smallestY = newData[i].y;
                }
                if (newData[j].y > largestY)
                {
                    largestY = newData[j].y;
                }
            }
            i+=2;
            j+=2;
        }


        return {smallestY: smallestY, largestY: largestY};
    }
    drawDashedLine(startX, startY, endX, endY)
    {
        this.ctx.strokeStyle = 'rgba(0, 0, 0, .5)';
        this.ctx.beginPath();
        this.ctx.setLineDash([10, 10]);
        this.ctx.moveTo(startX, startY);
        this.ctx.lineTo(endX, endY);
        this.ctx.stroke();
    }

    drawLineWithX(startX)
    {
        var endY = this.chartHeight-(2/3)*this.chartHeight;

        //Line
        this.drawLine(startX, this.chartHeight-15, startX, endY, 'black', 2);

        //draw X
        this.drawLine(startX-4, endY-4, startX+4, endY+4, 'black', 1);
        this.drawLine(startX-4, endY+4, startX+4, endY-4, 'black', 1);
    }


    ngOnChanges() {
        console.log("Chart ngOnChanges");

        if (this.patient) {

            this.observationService.index(this.patient).subscribe(data => {
                if(data.entry) {
                    let nextLink = null;
                    this.observationService.observations = <Array<Observation>>data.entry.map(r => r['resource']);
                    this.observationService.filterCategory(this.observationService.observations);

                    for(let i of data.link) {
                        if(i.relation=="next") {
                            nextLink = i.url;
                        }
                    }
                    if(nextLink) {this.loadDataO(nextLink);}
                    else {this.loadFinishedO();}

                } else {
                    this.observationService.observations = new Array<Observation>();
                    console.log("No observations for patient.");
                }
            });

            // if (this.selectedC)
        }

    }



    //Observation stuff
//*****************************************************************************************
    loadFinishedO() {
    this.observationService.observations = this.observationService.observations.reverse();
    console.log("Loaded " + this.observationService.observations.length + " observations.");
    this.observationService.observations.sort((n1, n2) => {
        if (n1['code']['coding'][0]['code'] < n2['code']['coding'][0]['code']) {
            return 1;
        }
        if (n1['code']['coding'][0]['code'] > n2['code']['coding'][0]['code']) {
            return -1;
        }
    })
    //this.chartService.setData(this.observationService.observations);
    //append broken data here
    this.observationService.observations.sort((n1, n2) => {
        if (n1.effectiveDateTime < n2.effectiveDateTime) {
            return 1;
        }
        if (n1.effectiveDateTime > n2.effectiveDateTime) {
            return -1;
        }
    })

    var diff = new Date().getTime() - new Date(this.observationService.observations[0].effectiveDateTime).getTime();
    for(let ob of this.observationService.observations) {
        var newDate = new Date(ob.effectiveDateTime).getTime() + diff;
        ob.relativeDateTime = new Date(newDate).toDateString();
        ob.relativeDateTime = moment(newDate).toISOString();
        // console.log(ob.relativeDateTime,ob.effectiveDateTime);
    }

    console.log("running service");

    //this.observationService.observations = this.observationService.observations;
    this.observationService.populateCategories(this.observationService.temp.categories);
    this.observationService.categorizedObservations = this.observationService.temp;

    this.loupeService.observationsArray = this.observationService.observations;
    this.observationReturned.emit(this.observationService.observations);

    console.log("done!");


    }
    loadDataO(url) {
        let isLast = false;
        this.observationService.indexNext(url).subscribe(data => {
            if(data.entry) {
                let nextObs= <Array<Observation>>data.entry.map(r => r['resource']);

                this.observationService.observations = this.observationService.observations.concat(nextObs);
                this.observationService.filterCategory(nextObs);
                isLast = true;
                for(let i of data.link) {
                    if(i.relation=="next") {
                        isLast = false;
                        this.loadDataO(i.url);
                    }
                }
                if(isLast) {
                    this.loadFinishedO();
                }
            }
        });

    }


    updateHighlighted(condition: Condition) {

        let response = this.mapService.load("XYZ");
        for(let obs of this.observationService.observations) {
            obs['highlighted'] = false;
        }
        let key = condition.code.coding[0].code;
        if(this.mappings[key] != null) {
            for(let obs of this.observationService.observations) {
                if(this.mappings[key].indexOf(obs.code['coding'][0]['code']) > -1) {
                    obs['highlighted'] = true;
                }
            }
        }
    }


}
