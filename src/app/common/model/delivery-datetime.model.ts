export class DeliveryDateTime {
    value: string;
    dispatchDateTimeValue: string;
    withinCutOff1Time: boolean = false;
    withinIncentiveCutoffTime: boolean = false;
    isSpecialDeliveryDate: boolean = false;

    constructor(value: string, withinCutOff1Time?: boolean, isSpecialDeliveryDate?: boolean) {
        this.value = value;
        if (withinCutOff1Time) {
            this.withinCutOff1Time = withinCutOff1Time;
        } else {
            this.withinCutOff1Time = true;
        }
        if (isSpecialDeliveryDate) {
            this.isSpecialDeliveryDate = isSpecialDeliveryDate
        }
        // if (value === '1900-01-01T00:00:00') {
        //     this.isSpecialDelivery = true;
        // }
    }
}