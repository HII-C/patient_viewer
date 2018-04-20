// Represents a single chart in the historical trends tool.
export class Chart {
  title: string;
  code: string;
  dashedLines: boolean;

  // An array of data points associated with the chart.
  data: {
    value: number;
    name: any;
  }[] = [];

  // Stores the chart in the format expected for line charts by NGX-Charts.
  lineChartData: {
    name: any;
    series: {
      value: number;
      name: any;
    }[];
  }[];

  // The minimum and maximum Y-axis values to be displayed on the chart.
  yScaleMin: number;
  yScaleMax: number;

  // Used to display horizontal "reference" lines in the NGX-Charts line chart.
  // Generally an array of two elements (the low and high values).
  normalValues: {
    name: string;
    value: number;
  }[];
}
