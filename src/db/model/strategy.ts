import * as dynamoose from 'dynamoose';
import { Item } from "dynamoose/dist/Item";
import config from '../../config';

export class StrategyDocument extends Item {
    id?: string;
    type?: string;
    symbol?: string;
    status?: string;
    profit?: number;
    data?: string;
    createdAt?: Date;
    holdId?: string;
    unHoldPrice?: number;
}

const StrategySchema = new dynamoose.Schema({
    id: {
        type: String,
        hashKey: true,
    },
    type: {
        type: String,
        index: {
            name: 'typeIndex',
        },
    },
    symbol: {
        type: String,
        index: {
            name: 'symbolIndex',
        },
    },
    status: {
        type: String,
        index: {
            name: 'statusIndex',
        },
    },
    profit: Number,
    data: String,
    createdAt: Date,
    holdId: {
        type: String,
        index: {
            name: 'holdIdIndex',
        },
    },
    unHoldPrice: Number,
});

export default dynamoose.model<StrategyDocument>(config.tables.strategy, StrategySchema, {
    // @ts-ignore-next-line
    saveUnknown: false
});
