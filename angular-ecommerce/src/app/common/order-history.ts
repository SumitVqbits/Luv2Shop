export class OrderHistory {
dateCreated!: string|number|Date;

    constructor(public id: string,
                public orderTrackingNumber: string,
                public totalPrice: number,
                public totalQuantity: number,
                public dataCreated: Date) {

                }
     
}
