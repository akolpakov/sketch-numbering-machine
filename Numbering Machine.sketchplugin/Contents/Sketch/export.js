@import 'dialog.js'
@import 'config.js'
@import 'numbers/damm.js'

function onRun(context) {

    var showMessage = context.document.showMessage;

    //showMessage("Start Numbering Machine");

    // check selected dashboard

    var selection = context.selection;

    if (selection.count() <= 0) {
        createErrorBox("Please select artboards to proceed");
        return;
    }

    // get settings

    var dialogResult = createDialog(SETTINGS_DIALOG_OPEN_IN_ADVANCE);

    if (!dialogResult) {
        showMessage("Cancelled");
        return;
    }

    // get selected artboards

    var selectionLoop = selection.objectEnumerator();
    var selectedArtboards = NSMutableArray.array();

    var layer;
    while (layer = selectionLoop.nextObject()) {
        if (layer.isMemberOfClass(MSArtboardGroup)) {
            selectedArtboards.addObject(layer);
        } else {
            createErrorBox("Only artboards allowed to proceed PDF export");
            return;
        }
    }

    detachSymbols(selectedArtboards);

    //showMessage("Selected " + selectedArtboards.count() + " artboards");

    // create temporary page

    var tempPage = MSPage.new();
    tempPage.setName("Numbering Machine");
    context.document.documentData().addPage(tempPage);

    try {

        // replace text

        var currentNumber = SETTINGS_NUMBER_FROM;

        for(var i = 0; i < SETTINGS_NUMBER_AMOUNT; i++) {
            //showMessage("Generate page #" + currentNumber);
            appendArtboards(tempPage, replaceArtboards(selectedArtboards, currentNumber));
            currentNumber += SETTINGS_NUMBER_STEP;
        }

        //showMessage("Export");

        var exportName = 'Numbering machine [' + generateNextNumber(SETTINGS_NUMBER_FROM) + ' - ' + generateNextNumber(currentNumber - SETTINGS_NUMBER_STEP) + ']';

        pageToPDF(tempPage, exportName);

    } catch(e) {
        createErrorBox(e);
    }

    context.document.documentData().removePage(tempPage);

    showMessage("Done");
}


// Replace placeholders in artboard

function replaceArtboards(selectedArtboards, currentNumber) {
    var replacedArtboards = NSMutableArray.array();

    var replacementFound = false;

    for(var i = 0; i < selectedArtboards.count(); i++) {
        var artboard = selectedArtboards[i].copy();

        var child, childrenLoop = artboard.children().objectEnumerator();
        while (child = childrenLoop.nextObject()) {
            if (child.isMemberOfClass(MSTextLayer)) {
                if(child.name() == SETTINGS_NAME_TO_REPLACE || child.name() == SETTINGS_NAME_TO_REPLACE + '-1') {
                    child.setStringValue(generateNextNumber(currentNumber));
                    replacementFound = true;
                }
                for(var j = 1; j < SETTINGS_NUMBER_FROM_EXTRA_COUNT; j++) {
                    if(SETTINGS_NUMBER_FROM_EXTRA[j]) {
                        if (child.name() == SETTINGS_NAME_TO_REPLACE + '-' + (j+1)) {
                            child.setStringValue(generateNextNumber(currentNumber + SETTINGS_NUMBER_FROM_EXTRA[j] - SETTINGS_NUMBER_FROM));
                            replacementFound = true;
                        }
                    }
                }
            }
        }

        replacedArtboards.addObject(artboard);
    }

    if(!replacementFound) {
        throw "Layer with name \"" + SETTINGS_NAME_TO_REPLACE + "\" should be presented on the artboards. Please read the manual.";
    }

    return replacedArtboards;
}


// Append artboards

function appendArtboards(page, artboards) {

    var page_artboards = page.artboards();
    var x = 0;
    var y = 0;
    var distance = 100;

    if (page_artboards.count() > 0) {
        var last_artboard = page_artboards[page_artboards.count()-1];
        x = last_artboard.frame().x() + last_artboard.frame().width() + distance;
    }

    for(var i = 0; i < artboards.count(); i++) {
        var artboard = artboards[i];
        artboard.frame().setX(x);
        artboard.frame().setY(y);

        x += artboard.frame().width() + distance;
    }

    page.addLayers(artboards);
}


function detachSymbols(artboards) {
    for(var i = 0; i < artboards.count(); i++) {
        var artboard = artboards[i];

        var child, childrenLoop = artboard.children().objectEnumerator();
        while (child = childrenLoop.nextObject()) {
            if (child.isMemberOfClass(MSSymbolInstance)) {
                findAndDetachFromSymbol(child)
            }
        }
    }
}

// Detach symbols

function findAndDetachFromSymbol(layer) {
    if (layer.isMemberOfClass(MSSymbolInstance)) {
        layer = layer.detachByReplacingWithGroup();
        var innerLayer, layerChildrenLoop = layer.children().objectEnumerator();
        while (innerLayer = layerChildrenLoop.nextObject()) {
            findAndDetachFromSymbol(innerLayer);
        }
    }
}


// Generate Next number

function generateNextNumber(number) {

    var next_number = number.toString();

    // check digit algorithm

    if(SETTINGS_ALGORITHM == ALGHORITHM_DAMM) {
        next_number = calculate_damm(next_number);
    }

    // padding

    if(next_number.length < SETTINGS_PAD_SIZE) {
        next_number = new Array(SETTINGS_PAD_SIZE - next_number.length + 1).join(SETTINGS_PAD_STRING) + next_number;
    }

    // return

    return SETTINGS_TEMPLATE.replace(SETTINGS_PLACEHOLDER, next_number);
}


// Export to PDF

function pageToPDF(page, exportName) {
    var pageArray = [page];
    MSPDFBookExporter.exportPages_defaultFilename(pageArray, exportName + ".pdf");
}
