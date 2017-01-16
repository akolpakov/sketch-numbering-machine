@import 'config.js'

function createDialog() {

    var dialogHeight = 200;
    var dialogWidth = 400;

    function textField(rect) {
        rect.origin.y = dialogHeight - rect.origin.y - rect.size.height;
        return NSTextField.alloc().initWithFrame(rect);
    }

    function createLabel(text, rect) {
        var label = textField(rect);
        label.stringValue = text;
        label.editable = false;
        label.borderd = false;
        label.bezeled = false;
        //label.setAlignment(1);
        label.useSingleLineMode = true;
        label.drawsBackground = false;
        return label;
    }

    function createInput(view, label, val, label_rect, rect) {
        var field = textField(rect);
        field.stringValue = val;

        view.addSubview(createLabel(label, label_rect));
        view.addSubview(field);

        return field;
    }

    var alert = NSAlert.alloc().init();
    alert.setMessageText('To generate PDF, please select params');
    alert.addButtonWithTitle('Generate');
    alert.addButtonWithTitle('Cancel');
    alert.addButtonWithTitle('Help');

    var view = NSView.alloc().initWithFrame(NSMakeRect(0, 0, dialogWidth, dialogHeight));

    view.addSubview(createLabel(
        "On the selected artboards, text layers with name \"" + SETTINGS_NAME_TO_REPLACE + "\" will be replaced with number in format which you define in \"Template\" field\nFor more information see \"https:\/\/github.com/akolpakov/sketch-numbering-machine\"",
        NSMakeRect(0, 0, dialogWidth, 80)
    ));

    var template = createInput(
        view,
        "Template\n [*] - placeholder",
        SETTINGS_TEMPLATE,
        NSMakeRect(0, 80, 150, 40),
        NSMakeRect(160, 70, 200, 25)
    );

    var pad_size = createInput(
        view,
        "Pad size",
        SETTINGS_PAD_SIZE,
        NSMakeRect(0, 103, 150, 25),
        NSMakeRect(160, 100, 200, 25)
    );

    var number_from = createInput(
        view,
        "Number from",
        SETTINGS_NUMBER_FROM,
        NSMakeRect(0, 133, 150, 25),
        NSMakeRect(160, 130, 200, 25)
    );

    var number_to = createInput(
        view,
        "Number to",
        SETTINGS_NUMBER_TO,
        NSMakeRect(0, 163, 150, 25),
        NSMakeRect(160, 160, 200, 25)
    );

    var number_step = createInput(
        view,
        "Step",
        SETTINGS_NUMBER_STEP,
        NSMakeRect(0, 193, 150, 25),
        NSMakeRect(160, 190, 200, 25)
    );

    alert.setAccessoryView(view);

    var responseCode = alert.runModal();

    // if help button is pressed

    if(responseCode == 1002) {
        var url = NSURL.URLWithString(SETTINGS_HELP_URL);
        NSWorkspace.sharedWorkspace().openURL(url)
    }

    // return

    return [
        responseCode,
        template.stringValue(),
        pad_size.integerValue(),
        number_from.integerValue(),
        number_to.integerValue(),
        number_step.integerValue()
    ];
}

function createErrorBox(text) {
    var alert = NSAlert.alloc().init();
    alert.setMessageText(text);
    alert.addButtonWithTitle('Ok');
    return alert.runModal();
}