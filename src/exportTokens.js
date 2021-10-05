import sketch from 'sketch'
import _ from 'lodash'

import values from './lib/values'
import formatObject from './lib/formatObject'

import tokenValue from './lib/tokenValue'

import {dialogAlert,fieldLabel, fieldSelect} from './lib/dialogFields'


let dropdownFileType;

/**
 * 
 * Dialog
 * 
 */
const dialogBox = (selectedLayers) => {

  let alert = dialogAlert(
    "Export Design Tokens", 
    "Choose tokens file format. Layers naming format is type/category/name (e.g. Color/Background-Color/Primary-red)."
    );

  // Creating the view
  
  let viewWidth = 300;
  let viewHeight = 60;


  let view = NSView.alloc().initWithFrame(NSMakeRect(0, 0, viewWidth, viewHeight));
  alert.addAccessoryView(view);

  //Dropdown: File format

  view.addSubview(fieldLabel(35, 'File format:', viewWidth, viewHeight));

  let names = ["YAML","JSON"];
  dropdownFileType = fieldSelect(45, names, viewWidth, viewHeight)

  view.addSubview(dropdownFileType);


  return alert.runModal();

}

/**
 * 
 * Export exportColors
 * 
 */
const exportTokens = (selectedLayers, type) => {


  const selectedCount = selectedLayers.length;

  if (selectedCount !== 0) {

    let variables = {}

    _.forEach(selectedLayers, function (layer) {

      let layerNameArr = layer.name.split('/');


      if(_.size(layerNameArr) > 2){
        // Notice layer if it contains type/category/name

        let value = tokenValue(layer);

        if(value !== ""){

          let tokenType = layerNameArr[0];
          let tokenCategory = _.kebabCase(layerNameArr[1]);
          let tokenName = _.snakeCase(layerNameArr[2]);

          let newObj =  {
            "value" : value,
            "type" : tokenType,
            "category" : tokenCategory
          };

          variables[tokenName]  = newObj;

        }
      }



    })
    
    if(_.size(variables) == 0){
      sketch.UI.alert('Select layers or artboard','Select one artboard or multiple layers');
    }else{


      let fileTypes = NSArray.arrayWithArray([values[type].filetype]);
      let savePanel = NSSavePanel.savePanel()

      savePanel.setAllowedFileTypes(fileTypes)

      savePanel.setNameFieldStringValue('tokens.' + values[type].filetype)
      savePanel.setPrompt("Save Tokens");

      savePanel.runModal();


      let file = NSString.stringWithString(formatObject(variables, type, 'props'));
      let file_path = savePanel.URL().path();
      file.writeToFile_atomically_encoding_error(file_path, true, NSUTF8StringEncoding, null);

      sketch.UI.message('Design Tokens Exported!');
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

  let selected = [];

  selected = doc.selectedLayers.layers;
  
  const selectedCount = _.size(selected);

  if (selectedCount !== 0) {

  if(selected[0].type === "Artboard"){ 
    // Select artboard layers
    selected = selected[0].layers;
  }

  const selectedLayers = _.reverse(selected);

  const dialog = dialogBox(selectedLayers);
  const exportType = dropdownFileType.titleOfSelectedItem();



    if(dialog == "1000"){
      exportTokens(selectedLayers, exportType);
    }

  }else{
    sketch.UI.alert('Select tokens','Please select layers or artboard first.');
  }

}