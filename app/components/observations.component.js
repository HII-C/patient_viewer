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
var map_service_1 = require("../services/map.service");
var patient_model_1 = require("../models/patient.model");
var ObservationsComponent = (function () {
    function ObservationsComponent(fhirService, observationService, mapService) {
        var _this = this;
        this.fhirService = fhirService;
        this.observationService = observationService;
        this.mapService = mapService;
        this.observations = [];
        this.mappings = {};
        console.log("ObservationsComponent created...");
        this.mapService.load().subscribe(function (res) {
            console.log("Loaded mappings...");
            _this.mappings = res;
        });
    }
    ObservationsComponent.prototype.ngOnChanges = function () {
        var _this = this;
        console.log("Observations ngOnChanges");
        if (this.patient) {
            this.observationService.index(this.patient).subscribe(function (data) {
                if (data.entry) {
                    _this.observations = data.entry.map(function (r) { return r['resource']; });
                    _this.observations = _this.observations.reverse();
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
        for (var _i = 0, _a = this.observations; _i < _a.length; _i++) {
            var obs = _a[_i];
            obs['highlighted'] = false;
        }
        var key = condition.code['coding'][0]['code'];
        if (this.mappings[key] != null) {
            for (var _b = 0, _c = this.observations; _b < _c.length; _b++) {
                var obs = _c[_b];
                if (this.mappings[key].indexOf(obs.code['coding'][0]['code']) > -1) {
                    obs['highlighted'] = true;
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
    __metadata("design:paramtypes", [fhir_service_1.FhirService,
        observation_service_1.ObservationService,
        map_service_1.MapService])
], ObservationsComponent);
exports.ObservationsComponent = ObservationsComponent;
//# sourceMappingURL=observations.component.js.map