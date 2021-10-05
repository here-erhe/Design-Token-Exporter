import sketch from 'sketch'
import _ from 'lodash'

import values from './lib/values'
import formatObject from './lib/formatObject'
import varNaming from './lib/varNaming'

import {dialogAlert,fieldLabel, fieldSelect} from './lib/dialogFields'

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

  let alert = dialogAlert("Export Spacing Variables");

  // Creating the view
  let viewWidth = 300;
  let viewHeight = 225;

  let view = NSView.alloc().initWithFrame(NSMakeRect(0, 0, viewWidth, viewHeight));
  alert.addAccessoryView(view);

  //Dropdown: File format

  view.addSubview(fieldLabel(35, 'File format:', viewWidth, viewHeight));

  let names = ["SCSS","Less","CSS","JSON","JavaScript Object","JavaScript Variables"];
  dropdownFileType = fieldSelect(45, names, viewWidth, viewHeight)

  view.addSubview(dropdownFileType);

  //Dropdown: Dimension 

  view.addSubview(fieldLabel(90, 'Dimension:', viewWidth, viewHeight));

  let types = [ "Width", "Height"];
  dropdownFormat = fieldSelect(100, types, viewWidth, viewHeight)
  view.addSubview(dropdownFormat);

  //Dropdown: Units 

  view.addSubview(fieldLabel(145, 'Units:', viewWidth, viewHeight));

  let units = [ "Absolute (px)", "Relative (rem)"];
  dropdownUnits = fieldSelect(155, units, viewWidth, viewHeight)
  view.addSubview(dropdownUnits);

  //Dropdown: Naming

  view.addSubview(fieldLabel(200, 'Naming:', viewWidth, viewHeight));

  dropdownNames = fieldSelect(210, selectedLayers, viewWidth, viewHeight, true)
  view.addSubview(dropdownNames);


  return alert.runModal();

}

/**
 * 
 * Export exportTextstyles
 * 
 */
const exportTextstyles = (selectedLayers, type, format, naming, units) => {

  const selectedCount = selectedLayers.length;

  let fileTypes = NSArray.arrayWithArray([values[type].filetype]);

  let savePanel = NSSavePanel.savePanel()
  //savePanel.setCanChooseDirectories(true)
  //savePanel.setCanCreateDirectories(true)
  savePanel.setAllowedFileTypes(fileTypes)

  savePanel.setNameFieldStringValue('spacing.' + values[type].filetype)
  savePanel.setPrompt("Save Spacing Variables");

  if (savePanel.runModal() && selectedCount !== 0) {

    let variables = {}
    
    _.forEach(selectedLayers, function (layer) {

      
        let layerName = varNaming(layer, naming);

        let side =  format == 'Width' ? layer.frame.width : layer.frame.height;
        let space = units == 'Absolute (px)' ? side + 'px' : side / 16 + 'rem';
        
        variables[layerName]  = space;
        

    })

    let file = NSString.stringWithString(formatObject(variables, type, 'spacing')); 
    let file_path = savePanel.URL().path();
    file.writeToFile_atomically_encoding_error(file_path, true, NSUTF8StringEncoding, null);

    sketch.UI.message('Spacing Variables Exported!');

   }

}

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
  const exportFormat = dropdownFormat.titleOfSelectedItem();
  const exportNaming = dropdownNames.indexOfSelectedItem();
  const exportUnits = dropdownUnits.titleOfSelectedItem();



    if(dialog == "1000"){
      exportTextstyles(selectedLayers, exportType, exportFormat, exportNaming, exportUnits);
    }

  }else{
    sketch.UI.alert('Select layers','Please select shape layers first.');
  }

}