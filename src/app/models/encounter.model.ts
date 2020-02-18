export class Encounter {
  
  id: string;
  status: string;

  period: {
    start: string;
    end: string;
  };

  text: {
    status: string;
    div: string;
  }

  position:string;
  // Reasons for the encounter.
  reason: {
    text: string;

    // Coding details for the encounter reason.
    coding: {
      system: string;
      code: string;
    }[];
  }[];

  // Get the first reason for the encounter (if there is one). Otherwise, return null.
  getReason(): string {
    // Check if there are any reasons. If not, return null.
    if (!this.reason) {
      return null;
    }

    for (let r of this.reason) {
      if (r.text) {
        // Return the text associated with the reason.
        return r.text;
      }
    }

    return null;
  }
  getStartDate(): Date { return new Date(this.period.start)}
  getEndDate(): Date { return new Date(this.period.end)}

  getLogValue(): any {
    return Math.log(this.getStartDate().getTime())
  }
};
