import {Component, Input, Output, EventEmitter} from '@angular/core';

import {NgGrid, NgGridItem, NgGridConfig, NgGridItemConfig, NgGridItemEvent} from 'angular2-grid';
import {DraggableWidget} from './draggable_widget.component';
import {Patient} from '../models/patient.model';
import {LoupeService} from '../services/loupe.service';
import {DoctorService} from '../services/doctor.service';
import {ChartTimelineService} from '../services/chartTimeline.service';
import {ObservationService} from '../services/observation.service';
import {Subscription} from 'rxjs/Subscription';

import { Chart } from '../models/chart.model';

import * as moment from 'moment';
//import { TimeAgoPipe } from 'angular2-moment/time-ago.pipe';


declare var $:any; //Necessary in order to use jQuery to open popup.
@Component({
  selector: 'chartTimelines',
  templateUrl: '/chartTimeline.html',
})

export class ChartTimelineComponent {
  constructor(private loupeService: LoupeService, private doctorService: DoctorService, private chartService: ChartTimelineService, private observationService: ObservationService){
      console.log("Chart Component is loaded...");
      this.subscription = this.chartService.activateGraph$.subscribe(clicked => {
          this.update();
      });
    }
    subscription: Subscription;

    maxYValue: number = 0;
    newData: Array<any> = [];
    data: Chart;
    ctx: CanvasRenderingContext2D;
    count: number = 0;
    chartHeight: number;
    chartWidth: number;
    canvasHeight: number;

    whole: boolean = false;
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
    setSpecifyDates()
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
        var dateRange;
        var indexStart;
        if (this.whole == true)
        {
            dateRange = null;
            console.log("dateRange", dateRange);
        }
        else if (this.twentyFiveYears == true)
        {
            dateRange = new Date().getTime() - ChartTimelineComponent.twentyFiveYearsMS;
            console.log("dateRange", dateRange);
        }
        else if (this.tenYears == true)
        {
            dateRange = new Date().getTime() - ChartTimelineComponent.tenYearsMS;
            console.log("dateRange", dateRange);
        }
        else if (this.fiveYears == true)
        {
            dateRange = new Date().getTime() - ChartTimelineComponent.fiveYearsMS;
            console.log("dateRange", dateRange);
        }
        else if (this.twoYears == true)
        {
            dateRange = new Date().getTime() - ChartTimelineComponent.twoYearsMS;
            console.log("dateRange", dateRange);
        }
        else if (this.oneYear == true)
        {
            dateRange = new Date().getTime() - ChartTimelineComponent.oneYearsMS;
            console.log("dateRange", dateRange);
        }
        else if (this.sixMonths == true)
        {
            dateRange = new Date().getTime() - ChartTimelineComponent.sixMonthsMS;
            console.log("dateRange", dateRange);
        }
        else if (this.threeMonths == true)
        {
            dateRange = new Date().getTime() - ChartTimelineComponent.threeMonthsMS;
            console.log("dateRange", dateRange);
        }
        else if (this.oneMonth == true)
        {
            dateRange = new Date().getTime() - ChartTimelineComponent.oneMonthMS;
            console.log("dateRange", dateRange);
        }
        else if (this.twoWeeks == true)
        {
            dateRange = new Date().getTime() - ChartTimelineComponent.twoWeeksMS;
            console.log("dateRange", dateRange);
        }

        this.renderAxisLabels(overallMaxAndMin, dateRange);
        this.ctx.save();
        this.ctx.translate(0, 60);
        for (let i = 0; i < this.data.dataPoints.length; i++)
        {
            this.ctx.save();
            this.translateLines();
            this.renderLines();
            this.renderName(i);
            this.ctx.save();
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
                this.renderDataType3(this.newData[i], i, offsetAndWidth.offset, offsetAndWidth.width, overallMaxAndMin.max, overallMaxAndMin.min);
            }
            this.ctx.restore();
            this.ctx.restore();
        }
        this.ctx.restore();

    }

    getOverallMaxAndMin()
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

    renderAxisLabels(overallMaxAndMin, dateRange)
    {
        var interval, intervalDate;
        var totInterval;
        if (dateRange == null)
        {
            totInterval = overallMaxAndMin.max - overallMaxAndMin.min;
        }
        else
        {
            totInterval = dateRange;
        }
        /*var diff = new Date().getTime() - (overallMaxAndMin.min);
        var diffInterval, diffIntervalDate;*/

        this.drawLine(0, 60, this.chartWidth, 60, 'black', 2);
        for (let i = 0; i < 10; i++)
        {
            this.drawLine(i*(this.chartWidth/10), 60, (i*(this.chartWidth/10))+20, 1, 'black', 1);
            interval = (totInterval/10)*(i+1);
            //diffInterval = (diff/10)*(i+1);
            //intervalDate = new Date(interval).toLocaleDateString();
            intervalDate = moment(interval).fromNow();
            this.ctx.save();
            this.ctx.translate(i*(this.chartWidth/10)+22,30);
            this.ctx.rotate(-1.22496);
            this.ctx.font = this.data.labelFont;
            this.ctx.textAlign = 'center';
            this.ctx.fillText(intervalDate, 0, 0);
            this.ctx.restore();
        }
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
        var maxAndMins = this.getMaxAndMins(newData);

        //this section is currently for using the "potential max and min" values as bounds for the height of the graphs.  Will need to be changed at some point
        var top = maxAndMins.largestY+50;
        var bottom = maxAndMins.smallestY-50;
        if (bottom < 0) bottom = 0;
        console.log("top", top, "bottom", bottom);

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

        console.log("Height and Y", shadedHeight, shadedY);

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
                console.log("yPos", yPos);
                console.log("1 value");
            }
            else if (sameVal == true)
            {
                a = newData[i].x - newData[0].x;
                xPos = (a/xLength)*(width /*- 30*/);
                console.log(this.chartHeight,newData[i].y,yLength,this.chartHeight);
                yPos = (this.chartHeight-30) - (newData[i].y/yLength)*(this.chartHeight-30);
                console.log("xPos", xPos);
                console.log("yPos", yPos);
                console.log("same values");
            }
            else
            {
                a = newData[i].x - newData[0].x;
                xPos = (a/xLength)*(width /*- 30*/);
                b = newData[i].y - bottom; //maxAndMins.smallestY;
                yPos = (this.chartHeight-30) - (b/yLength)*(this.chartHeight-30);
                console.log("xPos", xPos);
                console.log("yPos", yPos);
                console.log("regular");
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
        console.log("newData", newData);

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
                console.log("xPos", xPos);
                console.log("1 value");
            }
            else if (sameVal == true)
            {
                a = newData[i].x - newData[0].x;
                xPos = (a/xLength)*(width /*- 30*/);
                console.log(this.chartHeight,newData[i].y,this.chartHeight);
                console.log("xPos", xPos);
                console.log("same values");
            }
            else
            {
                a = newData[i].x - newData[0].x;
                xPos = (a/xLength)*(width /*- 30*/);
                console.log("xPos", xPos);
                console.log("regular");
            }

            this.drawLineWithX(xPos);
        }

        this.ctx.restore();

    }

    renderDataType3(newData, index, offset, width, max, min) {
        console.log("newData", newData);

        var maxAndMins = this.getMaxAndMins(newData);

        //this section is currently for using the "potential max and min" values as bounds for the height of the graphs.  Will need to be changed at some point
        var top = maxAndMins.largestY+50;
        var bottom = maxAndMins.smallestY-50;
        if (bottom < 0) bottom = 0;
        console.log("top", top, "bottom", bottom);

        var xLength = newData[newData.length-1].x - newData[0].x;
        var perc = xLength*.04;
        xLength = xLength + perc;
        var yLength = top - bottom; //maxAndMins.largestY - maxAndMins.smallestY;
        var a, b, c, d, y;
        var sameVal = true;
        var xPos, yPos;
        var first = true;
        var whole = false;
        var duration = new Date(8640000000).getTime();

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
        }

        this.ctx.restore();
    }

    getMaxAndMins(newData) {
        if (newData.length % 2 == 0)
        {
            //set initial largest and smallest y values
            if(newData[0].y >= newData[1].y)
            {
                var largestY = newData[0].y;
                var smallestY = newData[1].y;
            }
            else
            {
                var largestY = newData[1].y;
                var smallestY = newData[0].y;
            }
            var i = 2;
            var j = 3;
        }
        else
        {
            var largestY = newData[0].y;
            var smallestY = newData[0].y;
            var i = 1;
            var j = 2;
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


        console.log("smallestY", smallestY, "largestY", largestY);
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
}
