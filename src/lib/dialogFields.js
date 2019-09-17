import _ from 'lodash'

export const dialogAlert = (title, desc = "Choose which format you want to export tokens.") => {

  let alert = COSAlertWindow.new();

  alert.setIcon(NSImage.alloc().initByReferencingFile(context.plugin.urlForResourceNamed("icon.png").path()));
  alert.setMessageText(title);
  alert.setInformativeText(desc);
  alert.addButtonWithTitle("Ok");
  alert.addButtonWithTitle("Cancel");

  return alert;

}

export const fieldLabel = (pos, title, viewWidth, viewHeight) => {

  let label = NSTextField.alloc().initWithFrame(NSMakeRect(0,viewHeight - pos,viewWidth,35));
  label.setBezeled(false);
  label.setDrawsBackground(false);
  label.setEditable(false);
  label.setSelectable(false);
  label.setStringValue(title);

  return label;

}

export const fieldSelect = (pos, values, viewWidth, viewHeight, namingSelect = false) => {

  let select = NSPopUpButton.alloc().initWithFrame(NSMakeRect(0, viewHeight - pos, viewWidth, 22));

  if(namingSelect){ 

    const layerNames = values.map(layer => layer.name);
    const sliceArr = layerNames[0].split('/');

    let kebabCase = _.kebabCase(sliceArr);
    let camelCase = _.camelCase(_.join(sliceArr, '-'));

    select.addItemWithTitle(kebabCase);
    select.addItemWithTitle(camelCase);

    if(sliceArr.length > 1){

      _.forEach(sliceArr,function (slice) {
        select.addItemWithTitle(slice.toLowerCase().replace(/ /g, ''));
      });

    }

  }else{

    _.forEach(values, function(value) {
      select.addItemWithTitle(value);
    });

  }
  

  select.selectItemAtIndex(0);

  return select;

}


export const fieldCheckbox = (pos, label, viewWidth, viewHeight, state = false) => {

  let checkbox = NSButton.alloc().initWithFrame(NSMakeRect(0, viewHeight - pos, viewWidth, 20));

  let initState = state ? NSOnState : NSOffState;

  checkbox.setButtonType(NSSwitchButton);
  checkbox.setBezelStyle(0);
  checkbox.setTitle(label);
  checkbox.setState(initState);

  return checkbox;

}