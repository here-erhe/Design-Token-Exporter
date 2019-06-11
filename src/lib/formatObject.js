import _ from 'lodash'
import values from './values'

const formatObject = (obj, type, jsonTitle) => {

    let string = '';

    if(type == 'JSON'){

        let jsonObj = {};
        jsonObj[_.camelCase(jsonTitle)] = obj;

        string = JSON.stringify(jsonObj, null, "\t");

    }else{

        if(type == 'JavaScript Object'){
            string = "const " + _.camelCase(jsonTitle) + " = {\n";
        }else{
            string = values[type].lineStart;
        }
        

        string = string.concat(
        _.join(
            _.map(obj, (value, key) => values[type].prefix  + key + values[type].diviner + value + values[type].postfix),
            ''
        ));
        
        string = string.concat(values[type].lineEnd);
    }

    return string;

}

export default formatObject;