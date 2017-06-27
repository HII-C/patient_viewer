import {Component, Input, Output, EventEmitter} from '@angular/core';

import {NgGrid, NgGridItem, NgGridConfig, NgGridItemConfig, NgGridItemEvent} from 'angular2-grid';
import {DraggableWidget} from './draggable_widget.component';
import {Patient} from '../models/patient.model';
import {LoupeService} from '../services/loupe.service';
import {DoctorService} from '../services/doctor.service';
import {ChartTimelineService} from '../services/chartTimeline.service';
import { Chart } from '../models/chart.model';

declare var $:any; //Necessary in order to use jQuery to open popup.
@Component({
  selector: 'chartTimelines',
  templateUrl: '/chartTimeline.html',
})

export class ChartTimelineComponent {
  constructor(private loupeService: LoupeService, private doctorService: DoctorService, private chartService: ChartTimelineService){
      console.log("Chart Component is loaded...");
    }

    maxYValue: number = 0;
    newData: Array<any> = [];
    data: Chart;
    ctx: CanvasRenderingContext2D;
    count: number = 0;
    ratio: number = 0;
    chartHeight: number;
    chartWidth: number;
    yMax: number;
    xMax: number;

    show() {
        $('#chartTimeline_popup').modal({});
        this.render('canvas', this.chartService.dataDef);

    }
    render(canvasId, dataObj) {
      var margin = { top: 0, left: 0, right: 0, bottom: 0 };
      var overallMax, overallMin;
      var renderType = { bars: 'bars', points: 'points', lines: 'lines' };
      this.data = this.chartService.dataDef;
      console.log(this.data);
      for (var i = 0; i < this.data.dataPoints.length; i++)
      {
          this.newData[i] = JSON.parse(JSON.stringify(this.data.dataPoints[i].data.map(this.makeDate)));
          console.log("NEWDATA:"+this.newData[i][0].x);
          this.newData[i].sort(function(a, b){return a.x - b.x});
      }
      this.getMaxDataYValue();
      var canvas = <HTMLCanvasElement> document.getElementById(canvasId);
      this.chartHeight = 100; //canvas.getAttribute('height'); //100
      this.chartWidth = Number(canvas.getAttribute('width'));
      console.log("CHARTWIDTH:"+this.chartWidth);
      this.xMax = this.chartWidth - (margin.left + margin.right);
      this.yMax = this.chartHeight - (margin.top + margin.bottom);
      this.ratio = this.yMax / this.maxYValue;
      this.ctx = canvas.getContext("2d");
      this.renderChart();
    }

    makeDate(data) {
        data.x = new Date(data.x).getTime();
        console.log("DATE:"+data.x);
        return data;
    }
    getMaxDataYValue() {
        for (let i = 0; i < this.newData.length; i++) {
          console.log("y value:" + this.newData[i][0].y);
            if (this.newData[i][0].y > this.maxYValue) this.maxYValue = this.newData[i][0].y;
        }
        console.log("MAX:"+this.maxYValue);
    };

    renderChart() {
      var overallMaxAndMin = this.getOverallMaxAndMin();
      var offsetAndWidth;
      for (let i = 0; i < this.data.dataPoints.length; i++)
      {
          this.ctx.save();
          this.translateLines();
          this.renderLines();
          this.renderName(i);
          this.ctx.save();
          console.log("STUFF"+overallMaxAndMin.min,overallMaxAndMin.max, this.newData[i][0].x, this.newData[i][this.newData[i].length-1].x);
          offsetAndWidth = this.getOffsetAndWidth(overallMaxAndMin.min, overallMaxAndMin.max, this.newData[i][0].x, this.newData[i][this.newData[i].length-1].x);
          console.log("OFFSET:"+JSON.stringify(offsetAndWidth));
          this.translateNewChart(offsetAndWidth.offset);
          //render data
          if (this.data.dataPoints[i].code == '1')
          {
              this.renderData(this.newData[i], i, offsetAndWidth.offset, offsetAndWidth.width, overallMaxAndMin.max, overallMaxAndMin.min);
          }
          this.ctx.restore();
          this.ctx.restore();
      }
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

    translateLines()
    {
        this.ctx.translate(0, this.count*this.chartHeight);
        this.count++;
    }

    renderLines() {

        //Vertical line
        this.drawLine(1, 0, 1, this.chartHeight, 'black');

        //Horizontal Line
        this.drawLine(0, this.chartHeight, this.chartWidth, this.chartHeight, 'black');
    }

    drawLine(startX, startY, endX, endY, strokeStyle) {
        if (strokeStyle != null) this.ctx.strokeStyle = strokeStyle;
        //if (lineWidth != null) this.ctx.lineWidth = lineWidth;
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

    renderData(newData, index, offset, width, max, min) {
        console.log("newData", newData);
        var maxAndMins = this.getMaxAndMins(newData);
        console.log("MAXANDMINS:"+maxAndMins.smallestX);
        var xLength = maxAndMins.largestX - maxAndMins.smallestX;
        var yLength = maxAndMins.largestY - maxAndMins.smallestY;
        var a, b, c, d, y;
        var xPos, yPos;
        var txt;
        var fontSize = '8pt Calibri';
        var prevY = 0;
        var prevX = 0;
        var nextY = 0;
        var nextX = 0;
        var first = true;
        var whole = false;
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
            console.log("Chart 1");
        }
        else if (this.data.dataPoints[index].normalValues.high > maxAndMins.largestY && this.data.dataPoints[index].normalValues.low > maxAndMins.smallestY)
        {
            shadedHeight = 15 + (maxAndMins.largestY - this.data.dataPoints[index].normalValues.low) / (maxAndMins.largestY) * (this.chartHeight - 25);
            this.ctx.fillStyle = 'rgba(100, 100, 100, 0.25)';
            this.ctx.rect(-15 - offset, 0, this.chartWidth + 15, shadedHeight);
            this.ctx.fill();
            console.log("Chart 2", y);
        }
        else if (this.data.dataPoints[index].normalValues.high > maxAndMins.largestY && this.data.dataPoints[index].normalValues.low < maxAndMins.smallestY)
        {
            this.ctx.fillStyle = 'rgba(100, 100, 100, 0.25)';
            this.ctx.rect(-15 - offset, 0, this.chartWidth + 15, this.chartHeight);
            this.ctx.fill();
            console.log("Chart 3");
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
            console.log("Chart 4");
        }

        console.log("Height and Y", shadedHeight, shadedY);

        if (newData[0].x == min && newData[newData.length-1].x == max)
        {
            whole = true;
            console.log(whole);
        }

        this.ctx.save();
        //ctx.translate(15, 15);

        if (whole == true) //TODO figure out why they don't line up exactly!!!
        {
            this.ctx.translate(15, 15);
        }
        else
        {
            this.ctx.translate(10, 15);
        }

        //Get font for value rendering
        if (this.data.dataPointFont)
        {
            fontSize = this.data.dataPointFont;
        }
        this.ctx.font = fontSize;

        for (let i = 0; i < newData.length; i++)
        {
            if (whole == false)
            {
                a = newData[i].x - maxAndMins.smallestX;
                xPos = (a/xLength)*(width /*- 30*/);
                console.log("FLAG:" + xPos);
                console.log("a:"+a);
                console.log("xlength:"+xLength);
                console.log("width:"+width);

                b = newData[i].y - maxAndMins.smallestY;
                yPos = (this.chartHeight-30) - (b/yLength)*(this.chartHeight-30);
            }
            else
            {
                a = newData[i].x - maxAndMins.smallestX;
                xPos = (a/xLength)*(width /*- 30*/);
                b = newData[i].y - maxAndMins.smallestY;
                yPos = (this.chartHeight-30) - (b/yLength)*(this.chartHeight-30);
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
                c = newData[i+1].x - maxAndMins.smallestX;
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
                    txt = newData[i].y;
                    this.ctx.textAlign = 'center';
                    this.ctx.fillText(txt, xPos, yPos + 15);
                    console.log("1.1");
                }
                else
                {
                    prevPos = "top";
                    txt = newData[i].y;
                    this.ctx.textAlign = 'center';
                    this.ctx.fillText(txt, xPos, yPos - 5);
                    console.log("1.2");
                }
                first = false;
            }
            else if (i == newData.length - 1)
            {
                //if last, compare to prev
                if (xPos - prevX < 20 && prevY - yPos <= 20 && yPos - nextY >= 0)
                {
                    prevPos = "bottom";
                    txt = newData[i].y;
                    this.ctx.textAlign = 'center';
                    this.ctx.fillText(txt, xPos, yPos + 15);
                    console.log("2.1");
                }
                else
                {
                    prevPos = "top";
                    txt = newData[i].y;
                    this.ctx.textAlign = 'center';
                    this.ctx.fillText(txt, xPos, yPos - 5);
                    console.log("2.2");
                }
            }
            else
            {
                //if 2nd to n-1, compare to prev and next
                if (xPos - prevX < 20 && prevPos == "top" && yPos - prevY <= 20 && yPos - nextY >= 0)
                {
                    prevPos = "bottom";
                    txt = newData[i].y;
                    this.ctx.textAlign = 'center';
                    this.ctx.fillText(txt, xPos, yPos + 15);
                    console.log("3.1");
                }
                else if (nextX - xPos < 20 && prevPos == "top" && yPos - nextY <= 20 && yPos - nextY >= 0)
                {
                    prevPos = "bottom";
                    txt = newData[i].y;
                    this.ctx.textAlign = 'center';
                    this.ctx.fillText(txt, xPos, yPos + 15);
                    console.log("3.2");
                }
                else
                {
                    txt = newData[i].y;
                    this.ctx.textAlign = 'center';
                    this.ctx.fillText(txt, xPos, yPos - 5);
                    console.log("3.3");
                }
            }

            console.log("prevX", prevX, "xPos", xPos, "prevY", prevY, "yPos", yPos, "nextX", nextX, "nextY", nextY);

            prevX = xPos;
            prevY = yPos;
        }

        this.ctx.restore();

    }

    getMaxAndMins(newData) {
        if (newData.length % 2 == 0)
        {
            //set initial largest and smallest x values
            if(newData[0].x >= newData[1].x)
            {
                var largestX = newData[0].x;
                var smallestX = newData[1].x;
            }
            else
            {
                var largestX = newData[1].x;
                var smallestX = newData[0].x;
            }

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
            var largestX = newData[0].x;
            var smallestX = newData[0].x;
            var largestY = newData[0].y;
            var smallestY = newData[0].y;
            var i = 1;
            var j = 2;
        }

        //find smallest and largest x and y values in the data set
        while (j <= newData.length)
        {
            //x
            if (newData[i].x >= newData[j].x)
            {
                if (newData[i].x > largestX)
                {
                    largestX = newData[i].x;
                }
                if (newData[j].x < smallestX)
                {
                    smallestX = newData[j].x;
                }
            }
            else
            {
                if (newData[i].x < smallestX)
                {
                    smallestX = newData[i].x;
                }
                if (newData[j].x > largestX)
                {
                    largestX = newData[j].x;
                }
            }

            //y
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


        console.log(smallestX, smallestY, largestX, largestY);
        return {smallestX: smallestX, smallestY: smallestY, largestX: largestX, largestY: largestY};
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
}