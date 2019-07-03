import _ from 'lodash';

const varNaming = (layer, naming) => {

    let layerNameArr = layer.name.split('/');
    let layerName = '';

    if(naming == 0){ 
        layerName = layerNameArr.join('-').toLowerCase().replace(/ /g, '').replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
    }else if(naming == 1){ 
        layerName =  _.camelCase(_.join(layerNameArr, '-'));
    }else{

        let stringPosition = naming-2;

        if(layerNameArr.length < stringPosition+1){
            layerName = layerNameArr[0].toLowerCase().replace(/ /g, '');
        }else{
            layerName = layerNameArr[stringPosition].toLowerCase().replace(/ /g, '');          
        }
    }

    return layerName;

}

export default varNaming;
