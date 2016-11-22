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
var observation_service_1 = require("../services/observation.service");
var patient_model_1 = require("../models/patient.model");
var ObservationsComponent = (function () {
    function ObservationsComponent(fhirService, observationService) {
        this.fhirService = fhirService;
        this.observationService = observationService;
        this.observations = [];
        this.testMap = {
            "442311008": ["72166-2"]
        };
        console.log("ObservationsComponent created...");
    }
    ObservationsComponent.prototype.ngOnChanges = function () {
        var _this = this;
        console.log("Observations ngOnChanges");
        if (this.patient) {
            this.observationService.index(this.patient).subscribe(function (data) {
                if (data.entry) {
                    _this.observations = data.entry.map(function (r) { return r['resource']; });
                    console.log("Loaded " + _this.observations.length + " observations.");
                }
                else {
                    _this.observations = new Array();
                    console.log("No observations for patient.");
                }
            });
        }
    };
    ObservationsComponent.prototype.updateHighlighted = function (condition) {
        for (var key in this.testMap) {
            if (condition.code['coding'][0]['code'] == key) {
                for (var _i = 0, _a = this.observations; _i < _a.length; _i++) {
                    var obs = _a[_i];
                    if (obs.code['coding'][0]['code'] == this.testMap[key]) {
                        obs['highlighted'] = true;
                    }
                }
            }
        }
    };
    return ObservationsComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", patient_model_1.Patient)
], ObservationsComponent.prototype, "patient", void 0);
ObservationsComponent = __decorate([
    core_1.Component({
        selector: 'observations',
        templateUrl: 'app/components/observations.html'
    }),
    __metadata("design:paramtypes", [fhir_service_1.FhirService, observation_service_1.ObservationService])
], ObservationsComponent);
exports.ObservationsComponent = ObservationsComponent;
//# sourceMappingURL=observations.component.js.map