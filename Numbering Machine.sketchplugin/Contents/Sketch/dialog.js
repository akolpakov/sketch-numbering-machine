@import 'config.js'

function createDialog() {

    var alert = NSAlert.alloc().init();
    alert.setMessageText('To generate PDF, please select params');
    alert.addButtonWithTitle('Generate');
    alert.addButtonWithTitle('Cancel');

    var view = NSView.alloc().initWithFrame(NSMakeRect(0, 0, 400, 200));

    var template = createInput(
        view,
        "Template\n [*] - placeholder",
        SETTINGS_TEMPLATE,
        NSMakeRect(0, 120, 150, 40),
        NSMakeRect(160, 130, 200, 25)
    );

    var pad_size = createInput(
        view,
        "Pad size",
        SETTINGS_PAD_SIZE,
        NSMakeRect(0, 97, 150, 25),
        NSMakeRect(160, 100, 200, 25)
    );

    var number_from = createInput(
        view,
        "Number from",
        SETTINGS_NUMBER_FROM,
        NSMakeRect(0, 67, 150, 25),
        NSMakeRect(160, 70, 200, 25)
    );

    var number_to = createInput(
        view,
        "Number to",
        SETTINGS_NUMBER_TO,
        NSMakeRect(0, 37, 150, 25),
        NSMakeRect(160, 40, 200, 25)
    );

    var number_step = createInput(
        view,
        "Step",
        SETTINGS_NUMBER_STEP,
        NSMakeRect(0, 7, 150, 25),
        NSMakeRect(160, 10, 200, 25)
    );

    alert.setAccessoryView(view);

    var responseCode = alert.runModal();

    return [
        responseCode,
        template.stringValue(),
        pad_size.integerValue(),
        number_from.integerValue(),
        number_to.integerValue(),
        number_step.integerValue()
    ];
}


function createLabel(text, rect) {
  var label = NSTextField.alloc().initWithFrame(rect);
  label.stringValue = text;
  label.editable = false;
  label.borderd = false;
  label.bezeled = false;
  label.setAlignment(1);
  label.useSingleLineMode = true;
  label.drawsBackground = false;
  return label;
}

function createInput(view, label, val, label_rect, rect) {
    var field = NSTextField.alloc().initWithFrame(rect);
    field.stringValue = val;

    view.addSubview(createLabel(label, label_rect));
    view.addSubview(field);

    return field;
}
