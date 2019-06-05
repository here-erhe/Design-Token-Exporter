import sketch from 'sketch'
import _ from 'lodash'

import values from './lib/values'
import hexAToRGBA from './lib/hexAToRGBA'
import formatObject from './lib/formatObject'
import varNaming from './lib/varNaming'

import {dialogAlert,fieldLabel, fieldSelect} from './lib/dialogFields'


let dropdownFileType;
let dropdownFormat;
let dropdownNames;

/**
 * 
 * Dialog
 * 
 */
const dialogBox = (selectedLayers) => {

  let alert = dialogAlert("Export color tokens");

  // Creating the view
  
  let viewWidth = 300;
  let viewHeight = 180;

  let view = NSView.alloc().initWithFrame(NSMakeRect(0, 0, viewWidth, viewHeight));
  alert.addAccessoryView(view);

  //Dropdown: File format

  view.addSubview(fieldLabel(35, 'File format:', viewWidth, viewHeight));

  let names = ["SCSS","Less","CSS","JSON","JavaScript Object","JavaScript Variables"];
  dropdownFileType = fieldSelect(45, names, viewWidth, viewHeight)

  view.addSubview(dropdownFileType);

  //Dropdown: Color value 

  view.addSubview(fieldLabel(90, 'Color value:', viewWidth, viewHeight));

  let types = ["HEX", "RGBA"];
  dropdownFormat = fieldSelect(100, types, viewWidth, viewHeight)
  view.addSubview(dropdownFormat);

  //Dropdown: Naming
 
  view.addSubview(fieldLabel(145, 'Naming:', viewWidth, viewHeight));

  dropdownNames = fieldSelect(155, selectedLayers, viewWidth, viewHeight, true)
  view.addSubview(dropdownNames);


  return alert.runModal();

}

/**
 * 
 * Export exportColors
 * 
 */
const exportColors = (selectedLayers, type, format, naming) => {

  const selectedCount = selectedLayers.length;

  if (selectedCount !== 0) {

    let variables = {}

    _.forEach(selectedLayers, function (layer) {

      let fillArray = layer.style.fills;

      if(_.size(fillArray) != 0 && _.last(fillArray).fillType == 'Color' && _.last(fillArray).enabled){

        let colorName = varNaming(layer, naming);
        let colorFill = format == 'HEX' ? _.last(fillArray).color.substr(0, 7) : hexAToRGBA(_.last(fillArray).color);
        variables[colorName]  = colorFill
        
      }

    })
    
    if(_.size(variables) == 0){
      sketch.UI.alert('Select layers','Select shape layers with solid fill color');
    }else{

      let fileTypes = NSArray.arrayWithArray([values[type].filetype, nil]);

      let savePanel = NSSavePanel.savePanel()
      savePanel.setCanChooseDirectories(true)
      savePanel.setCanCreateDirectories(true)
      savePanel.setAllowedFileTypes(fileTypes)
    
      savePanel.setNameFieldStringValue('colors.' + values[type].filetype)
      savePanel.setPrompt("Save Color Tokens");

      savePanel.runModal();

      let file = NSString.stringWithString(formatObject(variables, type, 'colors'));
      let file_path = savePanel.URL().path();
      file.writeToFile_atomically_encoding_error(file_path, true, NSUTF8StringEncoding, null);

      sketch.UI.message('Color Tokens Exported!');
    }

    
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


    if(dialog == "1000"){
      exportColors(selectedLayers, exportType, exportFormat, exportNaming);
    }

  }else{
    sketch.UI.alert('Select layers','Please select shape layers first.');
  }

}
