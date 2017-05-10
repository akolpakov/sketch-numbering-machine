@import 'config.js'

function createDialog(advanced) {

    var alert = NSAlert.alloc().init();
    alert.setMessageText('To generate PDF, please select params');
    alert.addButtonWithTitle('Generate');
    alert.addButtonWithTitle('Cancel');
    alert.addButtonWithTitle('Help');

    var view;

    if(advanced) {
        view = createAdvancedView(alert);
    } else {
        view = createBasicView(alert);
    }

    alert.setAccessoryView(view);

    var responseCode = alert.runModal();

    // Check pressed button

    if(responseCode == 1002) {
        var url = NSURL.URLWithString(SETTINGS_HELP_URL);
        NSWorkspace.sharedWorkspace().openURL(url);
        return createDialog(advanced);
    } else if(responseCode == 1003) {
        return createDialog(!advanced);
    } else if(responseCode != 1000) {
        return false;
    }

    // verify func

    function verifyInteger(field, name) {
        if(field.integerValue() != field.stringValue().replace(/[^0-9]/g, '')) {
            createErrorBox("\"" + name + "\" should be an integer");
            return false;
        }
        return true;
    }

    function verifyGreaterThan0(field, name) {
        if(field.integerValue() <= 0) {
            createErrorBox("\"" + name + "\" should be greater than 0");
            return false;
        }
        return true;
    }

    // verify template

    if(view.nm.TEMPLATE) {
        SETTINGS_TEMPLATE = view.nm.TEMPLATE.stringValue();
        if(!SETTINGS_TEMPLATE.includes(SETTINGS_PLACEHOLDER)) {
            createErrorBox("Template has to contain placeholder \"" + SETTINGS_PLACEHOLDER + "\"");
            return false;
        }
    } else {
        SETTINGS_TEMPLATE = SETTINGS_PLACEHOLDER;
    }

    // verify pad size

    if(view.nm.PAD_SIZE) {
        SETTINGS_PAD_SIZE = view.nm.PAD_SIZE.integerValue();

        if(!verifyInteger(view.nm.PAD_SIZE, "Pad size") || !verifyGreaterThan0(view.nm.PAD_SIZE, "Pad size")) {
            return false;
        }
    } else {
        SETTINGS_PAD_SIZE = 0;
    }

    // Algorithm

    if(view.nm.ALGORITHM) {
        SETTINGS_ALGORITHM = ALGORITHMS[view.nm.ALGORITHM.indexOfSelectedItem()];
    }

    // verify start from

    SETTINGS_NUMBER_FROM = view.nm.NUMBER_FROM.integerValue();

    if(!verifyInteger(view.nm.NUMBER_FROM, "Number from") || !verifyGreaterThan0(view.nm.NUMBER_FROM, "Number from")) {
        return false;
    }

    // verify step

    if(view.nm.NUMBER_STEP) {
        SETTINGS_NUMBER_STEP = view.nm.NUMBER_STEP.integerValue();

        if(!verifyInteger(view.nm.NUMBER_STEP, "Step") || !verifyGreaterThan0(view.nm.NUMBER_STEP, "Step")) {
            return false;
        }
    }

    // verify amount

    SETTINGS_NUMBER_AMOUNT = view.nm.NUMBER_AMOUNT.integerValue();

    if(!verifyInteger(view.nm.NUMBER_AMOUNT, "Generate amount") || !verifyGreaterThan0(view.nm.NUMBER_AMOUNT, "Generate amount")) {
        return false;
    }

    // Direction

    if(view.nm.NUMBER_DIRECTION) {
        SETTINGS_NUMBER_DIRECTION = NUMBER_DIRECTIONS[view.nm.NUMBER_DIRECTION.indexOfSelectedItem()];
    }

    // return

    return true;
}

function createBasicView(alert) {
    alert.addButtonWithTitle('Advanced');

    var dialogHeight = 200;
    var dialogWidth = 400;

    function R(x, y, w, h) {
        return NSMakeRect(x, dialogHeight - y - h, w, h);
    }

    var view = NSView.alloc().initWithFrame(NSMakeRect(0, 0, dialogWidth, dialogHeight));

    createLabel(
        view,
        "On the selected artboards, text layers with name \"" + SETTINGS_NAME_TO_REPLACE + "\" will be replaced with generated number.\nSee \"Help\" for more information",
        R(0, 0, dialogWidth, 70)
    );

    var labelWidth = 120;
    var inputX = labelWidth + 10;
    var lineY = 70;

    view.nm = {};
    view.nm.NUMBER_FROM = createInput(
        view,
        "Number from",
        SETTINGS_NUMBER_FROM,
        R(0, lineY+3, labelWidth, 25),
        R(inputX, lineY, 200, 25)
    );
    lineY += 30;

    view.nm.NUMBER_AMOUNT = createInput(
        view,
        "Generate amount",
        SETTINGS_NUMBER_AMOUNT,
        R(0, lineY+3, labelWidth, 25),
        R(inputX, lineY, 200, 25)
    );

    return view;
}

function createAdvancedView(alert) {
    alert.addButtonWithTitle('Basic');

    var dialogHeight = 500;
    var dialogWidth = 400;

    function R(x, y, w, h) {
        return NSMakeRect(x, dialogHeight - y - h, w, h);
    }

    var view = NSView.alloc().initWithFrame(NSMakeRect(0, 0, dialogWidth, dialogHeight));

    createLabel(
        view,
        "On the selected artboards, text layers with name \"" + SETTINGS_NAME_TO_REPLACE + "\" will be replaced with number in format which you define in \"Template\" field.\nSee \"Help\" for more information",
        R(0, 0, dialogWidth, 70)
    );

    var labelWidth = 120;
    var inputX = labelWidth + 10;
    var lineY = 70;

    // Number format

    createLabel(
        view,
        "- - - - - - - - - - -       Number format       - - - - - - - - - - -",
        R(0, lineY, dialogWidth, 25)
    );
    lineY += 30;

    view.nm = {};
    view.nm.TEMPLATE = createInput(
        view,
        "Template",
        SETTINGS_TEMPLATE,
        R(0, lineY+3, labelWidth, 25),
        R(inputX, lineY, 200, 25)
    );
    lineY += 30;

    view.nm.PAD_SIZE = createInput(
        view,
        "Pad size",
        SETTINGS_PAD_SIZE,
        R(0, lineY+3, labelWidth, 25),
        R(inputX, lineY, 200, 25)
    );
    lineY += 30;

    view.nm.ALGORITHM = createCombobox(
        view,
        "Check digit",
        SETTINGS_ALGORITHM || '',
        R(0, lineY+3, labelWidth, 25),
        R(inputX, lineY, 200, 25),
        ALGORITHMS
    );
    lineY += 50;

    // Counter

    createLabel(
        view,
        "- - - - - - - - - -    Counter configuration    - - - - - - - - - -",
        R(0, lineY, dialogWidth, 25)
    );
    lineY += 30;

    view.nm.NUMBER_FROM = createInput(
        view,
        "Start from number",
        SETTINGS_NUMBER_FROM,
        R(0, lineY+3, labelWidth, 25),
        R(inputX, lineY, 200, 25)
    );
    lineY += 30;

    view.nm.NUMBER_STEP = createInput(
        view,
        "Step",
        SETTINGS_NUMBER_STEP,
        R(0, lineY+3, labelWidth, 25),
        R(inputX, lineY, 200, 25)
    );
    lineY += 30;

    view.nm.NUMBER_AMOUNT = createInput(
        view,
        "Generate amount",
        SETTINGS_NUMBER_AMOUNT,
        R(0, lineY+3, labelWidth, 25),
        R(inputX, lineY, 200, 25)
    );
    lineY += 30;

    view.nm.NUMBER_DIRECTION = createCombobox(
        view,
        "Numbering direction",
        SETTINGS_NUMBER_DIRECTION,
        R(0, lineY+3, labelWidth, 25),
        R(inputX, lineY, 200, 25),
        NUMBER_DIRECTIONS
    );

    return view;
}

function createLabel(view, text, rect) {
    var label = NSTextField.alloc().initWithFrame(rect);
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

    var field = NSTextField.alloc().initWithFrame(rect);
    field.stringValue = val;
    view.addSubview(field);

    return field;
}

function createCombobox(view, label, val, label_rect, rect, options) {
    createLabel(view, label, label_rect);

    var field = NSPopUpButton.alloc().initWithFrame(rect);
    field.addItemsWithTitles(options);
    view.addSubview(field);

    return field;
}

function createErrorBox(text) {
    var alert = NSAlert.alloc().init();
    alert.setMessageText(text);
    alert.addButtonWithTitle('Ok');
    return alert.runModal();
}