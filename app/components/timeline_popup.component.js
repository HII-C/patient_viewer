"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var fhir_service_1 = require("../services/fhir.service");
var timeline_service_1 = require("../services/timeline.service");
var TimelinePopupComponent = (function () {
    function TimelinePopupComponent(fhirService, timelineService) {
        this.fhirService = fhirService;
        this.timelineService = timelineService;
        this.condition = null;
        console.log("TimelinePopupComponent created...");
    }
    TimelinePopupComponent.prototype.show = function (timelineItem) {
        this.condition = timelineItem;
        $('#timeline_popup').modal({});
    };
    return TimelinePopupComponent;
}());
TimelinePopupComponent = __decorate([
    core_1.Component({
        selector: 'timeline-popup',
        templateUrl: 'app/components/timeline_popup.html'
    }),
    __metadata("design:paramtypes", [fhir_service_1.FhirService, timeline_service_1.TimelineService])
], TimelinePopupComponent);
exports.TimelinePopupComponent = TimelinePopupComponent;
//# sourceMappingURL=timeline_popup.component.js.map