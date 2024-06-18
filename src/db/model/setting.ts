import * as dynamoose from 'dynamoose';
import { Item } from 'dynamoose/dist/Item';
import config from '../../config';

export class SettingDocument extends Item {
    id?: string;
    type?: string;
    symbol?: string;
    status?: string;
    data?: string;
    createdAt?: Date;
}

const SettingsSchema = new dynamoose.Schema({
    id: {
        type: String,
        hashKey: true
    },
    type: {
        type: String,
        index: {
            name: "type"
        }
    },
    symbol: {
        type: String,
        index: {
            name: "symbol"
        }
    },
    data: String,
    createdAt: Date,
});

export default dynamoose.model<SettingDocument>(config.tables.setting, SettingsSchema, {
    // @ts-ignore-next-line
    saveUnknown: false
});
