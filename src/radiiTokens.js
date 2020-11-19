import sketch from 'sketch';
import _ from 'lodash';

import values from './lib/values';
import strings from './lib/strings';
import formatObject from './lib/formatObject';
import varNaming from './lib/varNaming';

import { dialogAlert, fieldLabel, fieldSelect } from './lib/dialogFields';

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
    let alert = dialogAlert('Export Radius Variables');

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

    //Dropdown: Units

    view.addSubview(fieldLabel(90, 'Units:', viewWidth, viewHeight));

    let units = ['Relative (rem)', 'Absolute (px)'];
    dropdownUnits = fieldSelect(100, units, viewWidth, viewHeight);
    view.addSubview(dropdownUnits);

    //Dropdown: Naming

    view.addSubview(fieldLabel(145, 'Naming:', viewWidth, viewHeight));

    dropdownNames = fieldSelect(
        155,
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
const exportRadiiStyles = (selectedLayers, type, naming, units) => {
    const selectedCount = selectedLayers.length;

    let fileTypes = NSArray.arrayWithArray([values[type].filetype, nil]);

    let savePanel = NSSavePanel.savePanel();
    //savePanel.setCanChooseDirectories(true)
    //savePanel.setCanCreateDirectories(true)
    savePanel.setAllowedFileTypes(fileTypes);

    savePanel.setNameFieldStringValue('radii.' + values[type].filetype);
    savePanel.setPrompt('Save Radii Variables');

    if (savePanel.runModal() && selectedCount !== 0) {
        let variables = {};

        _.forEach(selectedLayers, function (layer) {
            let layerName = varNaming(layer, naming);

            let radius = layer.points[0].cornerRadius;
            let space =
                units == 'Absolute (px)' ? radius + 'px' : radius / 16 + 'rem';

            variables[layerName] = space;
        });

        let file = NSString.stringWithString(
            formatObject(variables, type, 'radii')
        );
        let file_path = savePanel.URL().path();

        file.writeToFile_atomically_encoding_error(
            file_path,
            true,
            NSUTF8StringEncoding,
            null
        );

        sketch.UI.message('Radius Variables Exported!');
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
        const exportUnits = dropdownUnits.titleOfSelectedItem();

        console.log(exportNaming);

        if (dialog == '1000') {
            exportRadiiStyles(
                selectedLayers,
                exportType,
                exportNaming,
                exportUnits
            );
        }
    } else {
        sketch.UI.alert('Select layers', 'Please select shape layers first.');
    }
};
