import sketch from 'sketch'
import _ from 'lodash'

import values from './lib/values'
import varNaming from './lib/varNaming'

import {dialogAlert,fieldLabel, fieldSelect} from './lib/dialogFields'

let dropdownFileType;
let dropdownUnits;
let dropdownNames;

/**
 * 
 * Dialog
 * 
 */
const dialogBox = (selectedLayers) => {

  let alert = dialogAlert("Export Text Styles");

  // Creating the view
  let viewWidth = 300;
  let viewHeight = 180;

  let view = NSView.alloc().initWithFrame(NSMakeRect(0, 0, viewWidth, viewHeight));
  alert.addAccessoryView(view);

  //Dropdown: File format

  view.addSubview(fieldLabel(35, 'File format:', viewWidth, viewHeight));

  let names = ["CSS","JSON","JavaScript Object"];
  dropdownFileType = fieldSelect(45, names, viewWidth, viewHeight)

  view.addSubview(dropdownFileType);

  //Dropdown: Select units 

  view.addSubview(fieldLabel(90, 'Units:', viewWidth, viewHeight));

  let units = [ "Absolute (px)", "Relative (em/rem)"];
  dropdownUnits = fieldSelect(100, units, viewWidth, viewHeight)
  view.addSubview(dropdownUnits);
  
  //Dropdown: Naming
 
  view.addSubview(fieldLabel(145, 'Naming:', viewWidth, viewHeight));

  dropdownNames = fieldSelect(155, selectedLayers, viewWidth, viewHeight, true)
  view.addSubview(dropdownNames);


  return alert.runModal();

}

/**
 * 
 * Export exportTextstyles
 * 
 */
const exportTextstyles = (selectedLayers, type, units, naming) => {


  const selectedCount = selectedLayers.length;

  let fileTypes = NSArray.arrayWithArray([values[type].filetype, nil]);

  let savePanel = NSSavePanel.savePanel()
  savePanel.setCanChooseDirectories(true)
  savePanel.setCanCreateDirectories(true)
  savePanel.setAllowedFileTypes(fileTypes)

  savePanel.setNameFieldStringValue('textstyles.' + values[type].filetype)
  savePanel.setPrompt("Save Text Styles");

  if (savePanel.runModal() && selectedCount !== 0) {

    
    let texts = '';

    if(type == 'JSON'){
      texts = {}
    }else if(type == 'JavaScript Object'){
      texts = 'const textStyles = {\n';
    }else{
      texts = '';
    }

    _.forEach(selectedLayers, function (layer) {

      
        let layerName = varNaming(layer, naming);

        let fontFamily = layer.style.fontFamily;
        let fontSize = units == 'Absolute (px)' ? layer.style.fontSize + 'px' : layer.style.fontSize / 16 + 'rem';
        let fontWeight = layer.style.fontWeight * 100;
        let lineHeight = units == 'Absolute (px)' ? _.round(layer.style.lineHeight, 2) + 'px' : _.round(layer.style.lineHeight / layer.style.fontSize, 2);
        let letterSpacing = layer.style.kerning == null ? 'normal' :  units == 'Absolute (px)' ? _.round(layer.style.kerning, 2) + 'px' : _.round(layer.style.kerning / layer.style.fontSize, 2) + 'em';
        let textTransform = layer.style.textTransform;

        
        // JSON
        if(type == 'JSON'){
        texts[layerName] = {
            fontFamily: fontFamily,
            fontSize: fontSize,
            fontWeight: fontWeight,
            lineHeight: lineHeight,
            letterSpacing: letterSpacing,
            textTransform: textTransform
        };
        
      }else if(type == 'JavaScript Object'){
        // JS Object

        texts = texts.concat('\t"' + layerName + '": {\n');
          texts = texts.concat('\t\tfontFamily: "' + fontFamily +'",\n');
          texts = texts.concat('\t\tfontSize: "' + fontSize +'",\n');
          texts = texts.concat('\t\tfontWeight: ' + fontWeight +',\n');
          texts = texts.concat('\t\tlineHeight: "' + lineHeight + '",\n');
          texts = texts.concat('\t\tletterSpacing: "' + letterSpacing + '",\n');
          texts = texts.concat('\t\ttextTransform: "' + textTransform + '",\n');
        texts = texts.concat( '\t},\n');
 
        
      }else if(type == 'CSS'){
        // CSS

        texts = texts.concat('.' + layerName + '{\n');
          texts = texts.concat('\tfont-family: "' + fontFamily +'";\n');
          texts = texts.concat('\tfont-size: ' + fontSize +';\n');
          texts = texts.concat('\tfont-weight: ' + fontWeight +';\n');
          texts = texts.concat('\tline-height: ' + lineHeight + ';\n');
          texts = texts.concat('\tletter-spacing: ' + letterSpacing + ';\n');
          texts = texts.concat('\ttext-transform: ' + textTransform + ';\n');
        texts = texts.concat( '}\n');
      }

    })

    let file = '';

    if(type == 'JSON'){
      let jsonObj = { "textstyles": texts };
      file = NSString.stringWithString(JSON.stringify(jsonObj, null, "\t"));
    }else if(type == 'JavaScript Object'){
      texts = texts.concat('}');
      file = NSString.stringWithString(texts);
    }else{
      file = NSString.stringWithString(texts);
    }

    let file_path = savePanel.URL().path();
    file.writeToFile_atomically_encoding_error(file_path, true, NSUTF8StringEncoding, null);

    sketch.UI.message('Text Styles Exported!');
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
  const exportUnits = dropdownUnits.titleOfSelectedItem();
  const exportNaming = dropdownNames.indexOfSelectedItem();


    if(dialog == "1000"){
      exportTextstyles(selectedLayers, exportType, exportUnits, exportNaming);
    }

  }else{
    sketch.UI.alert('Select layers','Please select text layers first.');
  }

}