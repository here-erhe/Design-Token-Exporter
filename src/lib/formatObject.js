import _ from 'lodash';
import values from './values';
import strings from './strings';
import YAML from 'json-to-pretty-yaml';

const formatObject = (obj, type, jsonTitle) => {
    let string = '';

    if (type == strings.values.json) {
        let jsonObj = {};
        jsonObj[_.camelCase(jsonTitle)] = obj;

        string = JSON.stringify(jsonObj, null, '\t');
    } else if (type == strings.values.yaml) {
        let jsonObj = {};
        jsonObj[_.camelCase(jsonTitle)] = obj;

        string = YAML.stringify(jsonObj);
    } else {
        if (type == strings.values.jsObject) {
            string = 'const ' + _.camelCase(jsonTitle) + ' = {\n';
        } else if (type == strings.values.es6Module) {
            string = 'export const ' + _.camelCase(jsonTitle) + ' = {\n';
        } else {
            string = values[type].lineStart;
        }

        string = string.concat(
            _.join(
                _.map(obj, (value, key) => {
                    return (
                        values[type].prefix +
                        key +
                        values[type].diviner +
                        value +
                        values[type].postfix
                    );
                }),
                ''
            )
        );

        string = string.concat(values[type].lineEnd);
    }

    return string;
};

export default formatObject;
