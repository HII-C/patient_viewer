export class Chart {
  labelFont: string;
  dataPointFont: string;
  dataPoints: {
    title: string;
    code: string;
    dashedLines: boolean;
    normalValues: {
      low: number;
      high: number;
    };
    data: {
      y: number;
      x: string;
    }[];

  }[];
}
