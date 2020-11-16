import hexAToRGBA from './hexAToRGBA';

const tokenValue = (layer) => {
    let value = '';

    let layerType = layer.type;

    let layerNameArr = layer.name.split('/');
    let tokenType = layerNameArr[0];
    let tokenCategory = _.kebabCase(layerNameArr[1]);

    if (layerType === 'ShapePath') {
        // ShapeLayers + Category match

        if (
            _.indexOf(
                ['spacing', 'space', 'spacer', 'sizing', 'size'],
                tokenCategory
            ) !== -1
        ) {
            // Get spacing
            value = _.round(layer.frame.height, 0) + 'px';
        } else if (
            _.indexOf(
                ['hr-color', 'background-color', 'text-color', 'color'],
                tokenCategory
            ) !== -1
        ) {
            // Get color
            let color = _.last(layer.style.fills).color;
            value =
                color.slice(-2) === 'ff'
                    ? color.substr(0, 7)
                    : hexAToRGBA(color);
        } else if (tokenCategory === 'border-color') {
            // Get border color

            if (_.size(layer.style.borders) !== 0) {
                let border = _.last(layer.style.borders);
                value = border.color.substr(0, 7);
            } else {
                let fillArray = layer.style.fills;
                value = _.last(fillArray).color.substr(0, 7);
            }
        } else if (
            _.indexOf(['radius', 'border-radius'], tokenCategory) !== -1
        ) {
            // Get color

            let points = _.map(layer.points, 'cornerRadius');

            if (_.size(_.uniq(points)) === 1) {
                if (
                    layer.frame.width / 2 === points[1] ||
                    layer.frame.height / 2 === points[1]
                ) {
                    value = '50%';
                } else {
                    value = points[1] + 'px';
                }
            } else {
                value = _.join(points, 'px ') + 'px';
            }
        } else if (
            _.indexOf(
                ['drop-shadow', 'box-shadow', 'text-shadow', 'shadow'],
                tokenCategory
            ) !== -1
        ) {
            // Get shadow
            let shadowArr = _.last(layer.style.shadows);
            let x = shadowArr.x == 0 ? 0 : shadowArr.x + 'px';
            let y = shadowArr.y == 0 ? 0 : shadowArr.y + 'px';
            let blur = shadowArr.blur == 0 ? 0 : shadowArr.blur + 'px';
            let spread = shadowArr.spread == 0 ? 0 : shadowArr.spread + 'px';
            let color =
                shadowArr.color.slice(-2) === 'ff'
                    ? shadowArr.color.substr(0, 7)
                    : hexAToRGBA(shadowArr.color);

            value = x + ' ' + y + ' ' + blur + ' ' + spread + ' ' + color;
        } else if (tokenCategory === 'inner-shadow') {
            // Get innershadow
            let shadowArr = _.last(layer.style.innerShadows);
            let x = shadowArr.x == 0 ? 0 : shadowArr.x + 'px';
            let y = shadowArr.y == 0 ? 0 : shadowArr.y + 'px';
            let blur = shadowArr.blur == 0 ? 0 : shadowArr.blur + 'px';
            let spread = shadowArr.spread == 0 ? 0 : shadowArr.spread + 'px';
            let color =
                shadowArr.color.slice(-2) === 'ff'
                    ? shadowArr.color.substr(0, 7)
                    : hexAToRGBA(shadowArr.color);

            value =
                'inset ' +
                x +
                ' ' +
                y +
                ' ' +
                blur +
                ' ' +
                spread +
                ' ' +
                color;
        } else if (
            _.indexOf(['background-gradient', 'gradient'], tokenCategory) !== -1
        ) {
            // Get gradient
            var gradient = layer.style.fills[0].gradient;

            if (gradient.gradientType === 'Radial') {
                value =
                    'radial-gradient(' +
                    gradient.sketchObject.gradientStringWithMasterAlpha(1) +
                    ')';
            } else if (gradient.gradientType === 'Linear') {
                value =
                    'linear-gradient(' +
                    gradient.sketchObject.gradientStringWithMasterAlpha(1) +
                    ')';
            }
        } else if (tokenCategory === 'border-style') {
            // Get border style
            let border = _.last(layer.style.borders);
            let borderColor = border.color.substr(0, 7);
            let borderThickness = border.thickness + 'px';

            let borderStyle = _.isEmpty(layer.style.borderOptions.dashPattern)
                ? 'solid'
                : 'dashed';

            value = borderThickness + ' ' + borderStyle + ' ' + borderColor;
        } else if (['opacity'].indexOf(tokenCategory) !== -1) {
            // Get opacity
            value = _.round(layer.style.opacity, 2);
        } else if (tokenType === 'color') {
            // Token type color
            let color = _.last(layer.style.fills).color;
            let colorFormat =
                color.slice(-2) === 'ff'
                    ? color.substr(0, 7)
                    : hexAToRGBA(color);

            value = colorFormat;
        }
    } else if (layerType === 'Text') {
        // ShapeLayers + Category match

        if (tokenCategory === 'font-style') {
            value = layer.style.fontStyle;
        } else if (tokenCategory === 'font') {
            if (tokenType === '...') {
                value = layer.style.fontFamily;
            } else if (tokenType === 'number') {
                value = layer.style.fontWeight * 100;
            }
        } else if (tokenCategory === 'font-weight') {
            value = layer.style.fontWeight * 100;
        } else if (tokenCategory === 'font-size') {
            value = layer.style.fontSize + 'px';
        } else if (tokenCategory === 'line-height') {
            value = _.round(layer.style.lineHeight / layer.style.fontSize, 2);
        } else if (tokenCategory === 'font-family') {
            value = layer.style.fontFamily;
        } else if (tokenCategory === 'text-color') {
            var color = layer.style.textColor;
            value =
                color.slice(-2) === 'ff'
                    ? color.substr(0, 7)
                    : hexAToRGBA(color);
        } else if (tokenCategory === 'text-shadow') {
            let shadowArr = layer.style.shadows[0];
            let x = shadowArr.x == 0 ? 0 : shadowArr.x + 'px';
            let y = shadowArr.y == 0 ? 0 : shadowArr.y + 'px';
            let blur = shadowArr.blur == 0 ? 0 : shadowArr.blur + 'px';
            let spread = shadowArr.spread == 0 ? 0 : shadowArr.spread + 'px';
            let color =
                shadowArr.color.slice(-2) === 'ff'
                    ? shadowArr.color.substr(0, 7)
                    : hexAToRGBA(shadowArr.color);

            value = x + ' ' + y + ' ' + blur + ' ' + spread + ' ' + color;
        } else if (
            _.indexOf(['z-index', 'time', 'media-query'], tokenCategory) !== -1
        ) {
            value = layer.text;
        }
    }

    return value;
};

export default tokenValue;
