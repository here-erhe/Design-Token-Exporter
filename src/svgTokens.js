import sketch from 'sketch';
import _ from 'lodash';

import values from './lib/values';
import strings from './lib/strings';
import formatObject from './lib/formatObject';
import varNaming from './lib/varNaming';

import { dialogAlert, fieldLabel, fieldSelect } from './lib/dialogFields';
import { parse } from 'path';

let dropdownFileType;
let dropdownFormat;
let dropdownNames;
let dropdownUnits;

/**
 *
 * Dialog
 *
 */
const dialogBox = (selectedLayers) => {
    let alert = dialogAlert('Export Color Variables');

    // Creating the view

    let viewWidth = 300;
    let viewHeight = 180;

    let view = NSView.alloc().initWithFrame(
        NSMakeRect(0, 0, viewWidth, viewHeight)
    );
    alert.addAccessoryView(view);

    //Dropdown: File format

    view.addSubview(fieldLabel(35, 'File format:', viewWidth, viewHeight));

    let names = [
        strings.values.es6Module,
        strings.values.scss,
        strings.values.less,
        strings.values.css,
        strings.values.json,
        strings.values.jsObject,
        strings.values.jsVars,
    ];
    dropdownFileType = fieldSelect(45, names, viewWidth, viewHeight);

    view.addSubview(dropdownFileType);

    //Dropdown: Naming

    view.addSubview(fieldLabel(90, 'Naming:', viewWidth, viewHeight));

    dropdownNames = fieldSelect(
        100,
        selectedLayers,
        viewWidth,
        viewHeight,
        true
    );
    view.addSubview(dropdownNames);

    return alert.runModal();
};

/**
 *
 * ExpoRadii
 *
 */
const exportSVG = (selectedLayers, type, naming) => {
    const selectedCount = selectedLayers.length;

    const options = {
        formats: 'svg',
        output: false,
        compact: true,
    };

    let openPanel = NSOpenPanel.openPanel();
    openPanel.setCanChooseFiles(false);
    openPanel.setCanChooseDirectories(true);

    openPanel.setPrompt('Choose SVG Location');

    if (openPanel.runModal() && selectedCount !== 0) {
        // let variables = {};

        _.forEach(selectedLayers, function (layer) {
            let layerName = varNaming(layer, naming);
            let svgCode = sketch.export(layer, options).toString();
            let file = NSString.stringWithString(svgCode);
            let file_path =
                openPanel.directoryURL().path() + '/' + layerName + '.svg';

            const write = file.writeToFile_atomically_encoding_error(
                file_path,
                true,
                NSUTF8StringEncoding,
                null
            );
            console.log(write);
            // parsedSvgCode = parsedSvgCode
            //     .replace(
            //         '<!-- Generator: Sketch 58 (84663) - https://sketch.com -->',
            //         ''
            //     )
            //     .replace('<desc>Created with Sketch.</desc>', '')
            //     .replace(/"/g, "'")
            //     .replace(/\n/g, '')
            //     .replace(/<\?xml.+\?>/g, '')
            //     .replace(/svg/, `svg id="${layerName}"`);

            // console.log(parsedSvgCode);

            // variables[layerName] = parsedSvgCode;
        });

        sketch.UI.message('Spacing Variables Exported!');
    }
};

/**
 *
 * Main
 *
 */
export default () => {
    const doc = sketch.getSelectedDocument();
    const selected = doc.selectedLayers.layers;

    // Only ShapePath layers - no text layers
    const selectedLayers = _.filter(_.reverse(selected), ['type', 'ShapePath']);
    const selectedCount = _.size(selectedLayers);

    if (selectedCount !== 0) {
        const dialog = dialogBox(selectedLayers);
        const exportType = dropdownFileType.titleOfSelectedItem();
        const exportNaming = dropdownNames.indexOfSelectedItem();

        if (dialog == '1000') {
            exportSVG(selectedLayers, exportType, exportNaming);
        }
    } else {
        sketch.UI.alert('Select layers', 'Please select shape layers first.');
    }
};
