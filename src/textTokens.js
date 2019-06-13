import sketch from 'sketch'
import _ from 'lodash'

import values from './lib/values'
import formatObject from './lib/formatObject'
import varNaming from './lib/varNaming'

let dropdownFileType;
let dropdownFormat;
let dropdownNames;
let dropdownUnits;

import {dialogAlert,fieldLabel, fieldSelect} from './lib/dialogFields'


/**
 * 
 * Dialog
 * 
 */
const dialogBox = (selectedLayers) => {

  let alert = dialogAlert("Export Text Tokens");

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

  //Dropdown: Select text tokens 

  view.addSubview(fieldLabel(90, 'Select tokens:', viewWidth, viewHeight));

  let types = [ "Font Size", "Font Weight", "Font Family", "Line Height", "Letter Spacing"];
  dropdownFormat = fieldSelect(100, types, viewWidth, viewHeight)
  view.addSubview(dropdownFormat);

  //Dropdown: Select units 

  view.addSubview(fieldLabel(145, 'Units:', viewWidth, viewHeight));

  let units = [ "Absolute (px)", "Relative (em/rem)"];
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

  let fileTypes = NSArray.arrayWithArray([values[type].filetype, nil]);

  let savePanel = NSSavePanel.savePanel()
  savePanel.setCanChooseDirectories(true)
  savePanel.setCanCreateDirectories(true)
  savePanel.setAllowedFileTypes(fileTypes)

  savePanel.setNameFieldStringValue(_.camelCase(format) + '.' + values[type].filetype)
  savePanel.setPrompt("Save Text Tokens");

  if (savePanel.runModal() && selectedCount !== 0) {

    let variables = {}
    
    _.forEach(selectedLayers, function (layer) {

      
        let layerName = varNaming(layer, naming);

        let fontFamily = layer.style.fontFamily;
        let fontSize = units == 'Absolute (px)' ? layer.style.fontSize + 'px' : layer.style.fontSize / 16 + 'rem';
        let fontWeight = layer.style.fontWeight * 100;
        let lineHeight = units == 'Absolute (px)' ? _.round(layer.style.lineHeight, 2) + 'px' : _.round(layer.style.lineHeight / layer.style.fontSize, 2);
        let letterSpacing = layer.style.kerning == null ? 'normal' :  units == 'Absolute (px)' ? _.round(layer.style.kerning, 2) + 'px' : _.round(layer.style.kerning / layer.style.fontSize, 2) + 'em';
        
        if(format == 'Font Family') variables[layerName]  = fontFamily
        if(format == 'Font Size') variables[layerName]  = fontSize
        if(format == 'Font Weight') variables[layerName]  = fontWeight
        if(format == 'Line Height') variables[layerName]  = lineHeight
        if(format == 'Letter Spacing') variables[layerName]  = letterSpacing

    })

    let file = NSString.stringWithString(formatObject(variables, type, format));
    let file_path = savePanel.URL().path();
    file.writeToFile_atomically_encoding_error(file_path, true, NSUTF8StringEncoding, null);

    sketch.UI.message('Text Tokens Exported!');

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

  // Only Text layers - no shape layers
  const selectedLayers = _.filter(_.reverse(selected), ['type', 'Text']);
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
    sketch.UI.alert('Select layers','Please select text layers first.');
  }

}