'use strict';


customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">healthcreek-ui documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link">AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AppModule-cadeeb5e089848295fbd215ed65a04e4"' : 'data-target="#xs-components-links-module-AppModule-cadeeb5e089848295fbd215ed65a04e4"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AppModule-cadeeb5e089848295fbd215ed65a04e4"' :
                                            'id="xs-components-links-module-AppModule-cadeeb5e089848295fbd215ed65a04e4"' }>
                                            <li class="link">
                                                <a href="components/AccordionRecursion.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AccordionRecursion</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AccountComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AccountComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AddObservation.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AddObservation</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AppComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AppComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CarePlanComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">CarePlanComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CarePlanDisplay.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">CarePlanDisplay</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ColumnStateSwitcherComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ColumnStateSwitcherComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ConditionsChartComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ConditionsChartComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ConditionsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ConditionsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ConditionsDisplay.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ConditionsDisplay</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ContextMenuComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ContextMenuComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/FormBuilder.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">FormBuilder</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/HistoricalTrendsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">HistoricalTrendsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/HomeComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">HomeComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/HoverBoxComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">HoverBoxComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LoadingAnimation.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">LoadingAnimation</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MedicationsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">MedicationsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/NewCondition.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">NewCondition</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/NoteNavigationComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">NoteNavigationComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ObservationRecursive.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ObservationRecursive</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ObservationRecursiveChart.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ObservationRecursiveChart</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ObservationsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ObservationsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ObservationsDisplay.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ObservationsDisplay</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PatientComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">PatientComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TimelineComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">TimelineComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TimelinePopupComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">TimelinePopupComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ToolbarComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ToolbarComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TripleListComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">TripleListComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-AppModule-cadeeb5e089848295fbd215ed65a04e4"' : 'data-target="#xs-injectables-links-module-AppModule-cadeeb5e089848295fbd215ed65a04e4"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppModule-cadeeb5e089848295fbd215ed65a04e4"' :
                                        'id="xs-injectables-links-module-AppModule-cadeeb5e089848295fbd215ed65a04e4"' }>
                                        <li class="link">
                                            <a href="injectables/AssociationService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>AssociationService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/CarePlanService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>CarePlanService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/ConditionService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>ConditionService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/DoctorService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>DoctorService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/EncounterService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>EncounterService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/FhirService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>FhirService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/HistoricalTrendsService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>HistoricalTrendsService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/MapService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>MapService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/ObservationService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>ObservationService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/PatientService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>PatientService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/ScratchPadService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>ScratchPadService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/SmartService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>SmartService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/ToolBarService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>ToolBarService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/FormCreatorModule.html" data-type="entity-link">FormCreatorModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-FormCreatorModule-25eef312897db61b740c3d7ff79eb26b"' : 'data-target="#xs-components-links-module-FormCreatorModule-25eef312897db61b740c3d7ff79eb26b"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-FormCreatorModule-25eef312897db61b740c3d7ff79eb26b"' :
                                            'id="xs-components-links-module-FormCreatorModule-25eef312897db61b740c3d7ff79eb26b"' }>
                                            <li class="link">
                                                <a href="components/CheckboxInline.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">CheckboxInline</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/NormalBox1.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">NormalBox1</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/NormalBox2.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">NormalBox2</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ScratchPadUpdate.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ScratchPadUpdate</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SelectListSingle.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SelectListSingle</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                </ul>
                </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#directives-links"' :
                                'data-target="#xs-directives-links"' }>
                                <span class="icon ion-md-code-working"></span>
                                <span>Directives</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="directives-links"' : 'id="xs-directives-links"' }>
                                <li class="link">
                                    <a href="directives/AutoGrowDirective.html" data-type="entity-link">AutoGrowDirective</a>
                                </li>
                                <li class="link">
                                    <a href="directives/HighlightDirective.html" data-type="entity-link">HighlightDirective</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#classes-links"' :
                            'data-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/AllergyIntolerance.html" data-type="entity-link">AllergyIntolerance</a>
                            </li>
                            <li class="link">
                                <a href="classes/BaseColumn.html" data-type="entity-link">BaseColumn</a>
                            </li>
                            <li class="link">
                                <a href="classes/Bundle.html" data-type="entity-link">Bundle</a>
                            </li>
                            <li class="link">
                                <a href="classes/CarePlan.html" data-type="entity-link">CarePlan</a>
                            </li>
                            <li class="link">
                                <a href="classes/Chart.html" data-type="entity-link">Chart</a>
                            </li>
                            <li class="link">
                                <a href="classes/Client.html" data-type="entity-link">Client</a>
                            </li>
                            <li class="link">
                                <a href="classes/Condition.html" data-type="entity-link">Condition</a>
                            </li>
                            <li class="link">
                                <a href="classes/ContextMenuOption.html" data-type="entity-link">ContextMenuOption</a>
                            </li>
                            <li class="link">
                                <a href="classes/Encounter.html" data-type="entity-link">Encounter</a>
                            </li>
                            <li class="link">
                                <a href="classes/Form.html" data-type="entity-link">Form</a>
                            </li>
                            <li class="link">
                                <a href="classes/Link.html" data-type="entity-link">Link</a>
                            </li>
                            <li class="link">
                                <a href="classes/Medication.html" data-type="entity-link">Medication</a>
                            </li>
                            <li class="link">
                                <a href="classes/Observation.html" data-type="entity-link">Observation</a>
                            </li>
                            <li class="link">
                                <a href="classes/Patient.html" data-type="entity-link">Patient</a>
                            </li>
                            <li class="link">
                                <a href="classes/Server.html" data-type="entity-link">Server</a>
                            </li>
                            <li class="link">
                                <a href="classes/Timeline.html" data-type="entity-link">Timeline</a>
                            </li>
                            <li class="link">
                                <a href="classes/User.html" data-type="entity-link">User</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interfaces-links"' :
                            'data-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/Associable.html" data-type="entity-link">Associable</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#pipes-links"' :
                                'data-target="#xs-pipes-links"' }>
                                <span class="icon ion-md-add"></span>
                                <span>Pipes</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="pipes-links"' : 'id="xs-pipes-links"' }>
                                <li class="link">
                                    <a href="pipes/HumanizeBytesPipe.html" data-type="entity-link">HumanizeBytesPipe</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});