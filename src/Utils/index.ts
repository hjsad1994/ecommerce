import lodash from 'lodash';

interface GetInfoDataParams<T> {
    fields: (keyof T)[];
    object: T;
}

const getInfoData = <T extends Record<string, any>>({fields = [], object}: GetInfoDataParams<T>): Partial<T> => {
    return lodash.pick(object, fields);
}

export default getInfoData;