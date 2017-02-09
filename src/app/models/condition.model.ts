export class Condition {
    id: string;
    onsetDateTime: string;
    verificationStatus: string;
    clinicalStatus: string;
	code: {
        coding: [{code: string}, {display: string}, {system: string}],
        text: string
    };
};
