import * as dynamoose from 'dynamoose';
import { Item } from "dynamoose/dist/Item";
import config from '../../config';
const tableName = config.tables.hold
// console.log(tableName)
export class HoldDocument extends Item {
    id?: string;
    type?: string;
    symbol?: string;
    status?: string;
    data?: string;
    avgPrice?: number;
    avgPriceProfit?: number;
    orderId?: string;
    qty?: number;
    createdAt?: Date;
}

const HoldSchema = new dynamoose.Schema({
    id: {
        type: String,
        hashKey: true
    },
    type: {
        type: String,
        index: {
            name: "typeIndex",
        }
    },
    symbol: {
        type: String,
        index: {
            name: "symbolIndex",
        }
    },
    status: {
        type: String,
        index: {
            name: "statusIndex",
        }
    },
    data: String,
    avgPrice: Number,
    avgPriceProfit: Number,
    orderId: String,
    qty: Number,
    createdAt: Date,
});

export default dynamoose.model<HoldDocument>(tableName, HoldSchema, {
    // @ts-ignore-next-line
    saveUnknown: false
});
