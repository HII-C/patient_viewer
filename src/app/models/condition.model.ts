import { Associable } from './associable.model';

export class Condition implements Associable {
    id: string;
    onsetDateTime: string;
    relativeDateTime: string;
    verificationStatus: string;
    clinicalStatus: string;
    isVisible: boolean;
    isParent: boolean;
    isSelected: boolean;
    parent: string;
	code: {
        coding: [{code: string, display: string, system: string}],
        text: string
    };
};
