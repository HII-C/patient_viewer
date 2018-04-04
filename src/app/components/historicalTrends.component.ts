import { Component } from '@angular/core';

import { ObservationService } from '../services/observation.service';
import { HistoricalTrendsService } from '../services/historicalTrends.service';

@Component({
  selector: 'historicalTrends',
  templateUrl: '/historicalTrends.html'
})
export class HistoricalTrendsComponent {

  constructor(private trendsService: HistoricalTrendsService,
              private observationService: ObservationService) { }
}
