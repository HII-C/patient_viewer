import { Associable } from './associable.model';

export class Observation implements Associable {
	id: string;
	status: string;
	effectiveDateTime: string;
	relativeDateTime: string;
	category: Array<any>;
	code: Array<any>;
	valueQuantity: Object;
	valueCodeableConcept: Object;

	// This should be populated with the normal ranges, but isn't for whatever reason.
	referenceRange: Object;
	grouping: string;

	// Get the value of an observation
	static getValue(o: Observation) {
		return o['valueQuantity']['value'];
	}

	// Get the units for an observation
	static getUnits(o: Observation) {
		return o['valueQuantity']['unit'];
	}

	// Get the text for an observation
	static getText(o: Observation) {
		// If the text is empty, use the display.
		return o['code']['text'] || o['code']['coding'][0]['display'];
	}

	getCode() {
		return this['code']['coding'][0]['code'];
	}
}

//https://www.hl7.org/fhir/bundle.html
export class ObservationBundle {
	entry: Array<{ resource: Observation }>;
	link: Array<Link>;
}

export class Link {
	relation: string;
	url: string;
}