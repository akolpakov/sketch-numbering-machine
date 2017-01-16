@import 'config.js'

function createDialog() {

    var dialogHeight = 400;
    var dialogWidth = 400;

    function textField(rect) {
        rect.origin.y = dialogHeight - rect.origin.y - rect.size.height;
        return NSTextField.alloc().initWithFrame(rect);
    }

    function createLabel(view, text, rect) {
        var label = textField(rect);
        label.stringValue = text;
        label.editable = false;
        label.borderd = false;
        label.bezeled = false;
        //label.setAlignment(1);
        label.useSingleLineMode = true;
        label.drawsBackground = false;

        view.addSubview(label);

        return label;
    }

    function createInput(view, label, val, label_rect, rect) {
        createLabel(view, label, label_rect);

        var field = textField(rect);
        field.stringValue = val;
        view.addSubview(field);

        return field;
    }

    var alert = NSAlert.alloc().init();
    alert.setMessageText('To generate PDF, please select params');
    alert.addButtonWithTitle('Generate');
    alert.addButtonWithTitle('Cancel');
    alert.addButtonWithTitle('Help');

    var view = NSView.alloc().initWithFrame(NSMakeRect(0, 0, dialogWidth, dialogHeight));

    createLabel(
        view,
        "On the selected artboards, text layers with name \"" + SETTINGS_NAME_TO_REPLACE + "\" will be replaced with number in format which you define in \"Template\" field\nSee \"Help\" for more information",
        NSMakeRect(0, 0, dialogWidth, 70)
    );

    var labelWidth = 120;
    var inputX = labelWidth + 10;
    var lineY = 70;

    createLabel(
        view,
        "- - - - - - - - - - -       Number format       - - - - - - - - - - -",
        NSMakeRect(0, lineY, dialogWidth, 25)
    );
    lineY += 30;

    var template = createInput(
        view,
        "Template",
        SETTINGS_TEMPLATE,
        NSMakeRect(0, lineY+3, labelWidth, 25),
        NSMakeRect(inputX, lineY, 200, 25)
    );
    lineY += 30;

    var pad_size = createInput(
        view,
        "Pad size",
        SETTINGS_PAD_SIZE,
        NSMakeRect(0, lineY+3, labelWidth, 25),
        NSMakeRect(inputX, lineY, 200, 25)
    );
    lineY += 50;

    createLabel(
        view,
        "- - - - - - - - - -    Counter configuration    - - - - - - - - - -",
        NSMakeRect(0, lineY, dialogWidth, 25)
    );
    lineY += 30;

    var number_amount = createInput(
        view,
        "Amount",
        SETTINGS_NUMBER_AMOUNT,
        NSMakeRect(0, lineY+3, labelWidth, 25),
        NSMakeRect(inputX, lineY, 200, 25)
    );
    lineY += 30;

    var number_step = createInput(
        view,
        "Step",
        SETTINGS_NUMBER_STEP,
        NSMakeRect(0, lineY+3, labelWidth, 25),
        NSMakeRect(inputX, lineY, 200, 25)
    );
    lineY += 50;

    createLabel(
        view,
        "- - - - - - - - - - -    Initial configuration    - - - - - - - - - - -",
        NSMakeRect(0, lineY, dialogWidth, 25)
    );
    lineY += 30;

    var number_from = createInput(
        view,
        "Number from",
        SETTINGS_NUMBER_FROM,
        NSMakeRect(0, lineY+3, labelWidth, 25),
        NSMakeRect(inputX, lineY, 200, 25)
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
        number_amount.integerValue(),
        number_step.integerValue(),
        number_from.integerValue()
    ];
}

function createErrorBox(text) {
    var alert = NSAlert.alloc().init();
    alert.setMessageText(text);
    alert.addButtonWithTitle('Ok');
    return alert.runModal();
}