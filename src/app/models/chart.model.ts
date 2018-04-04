// Represents a single chart in the historical trends tool.
export class Chart {
  title: string;
  code: string;
  dashedLines: boolean;

  normalValues: {
    low: number;
    high: number;
  };

  data: {
    value: number;
    name: any;
  }[] = [];
}
