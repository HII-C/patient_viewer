//https://www.hl7.org/fhir/bundle.html
export class Bundle {
	entry: Array<{ resource: any }>;
	link: Array<Link>;
}

export class Link {
	relation: string;
	url: string;
}