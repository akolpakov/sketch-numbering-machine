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

        // get numbers to replace

        var namesToReplace = getNamesToReplaces(selectedArtboards);
        var replaceDict = generateReplaceDictionary(namesToReplace);

        // replace text

        for(var i = 0; i < replaceDict.length; i++) {
            var replaceDictPage = replaceDict[i];
            //showMessage("Generate page #" + currentNumber);
            appendArtboards(tempPage, replaceArtboards(selectedArtboards, replaceDictPage));
        }

        //showMessage("Export");

        var exportName = 'Numbering machine [FROM ' + SETTINGS_NUMBER_FROM + '; STEP ' + SETTINGS_NUMBER_STEP + '; AMOUNT ' + SETTINGS_NUMBER_AMOUNT +']';

        pageToPDF(tempPage, exportName);

    } catch(e) {
        createErrorBox(e);
    }

    context.document.documentData().removePage(tempPage);

    showMessage("Done");
}

// Get Artboard structure

function getNamesToReplaces(selectedArtboards) {
    var toReplace = [];
    var re = new RegExp('^' + SETTINGS_NAME_TO_REPLACE + '(-\\d+)?$', 'i');

    for(var i = 0; i < selectedArtboards.count(); i++) {
        var artboard = selectedArtboards[i];

        var child, childrenLoop = artboard.children().objectEnumerator();
        while (child = childrenLoop.nextObject()) {
            if (child.isMemberOfClass(MSTextLayer)) {
                var layerName = child.name();
                if(layerName.match(re)) {
                    var layerId = layerName.replace('nm', '').replace('-', '');
                    if (!layerId) {
                        layerId = 1;
                    }
                    if(toReplace.indexOf(layerId) < 0) {
                        toReplace.push(layerId);
                    }
                }
            }
        }
    }
    return toReplace;
}


// Generate replace dictionary

function generateReplaceDictionary(namesToReplaces) {

    // order

    namesToReplaces.sort(function(a,b) {return a-b});

    // calculate functions

    var numberCalculation;

    if(SETTINGS_NUMBER_DIRECTION == NUMBER_DIRECTION_DRILL) {
        numberCalculation = function(i_page, i_layer) {
            return SETTINGS_NUMBER_FROM + i_page * SETTINGS_NUMBER_STEP + i_layer * SETTINGS_NUMBER_AMOUNT;
        }
    } else {
        numberCalculation = function(i_page, i_layer) {
            return SETTINGS_NUMBER_FROM + i_page * namesToReplaces.length * SETTINGS_NUMBER_STEP + i_layer * SETTINGS_NUMBER_STEP;
        }
    }

    // generate

    var replaceDict = [];
    var prefix = SETTINGS_NAME_TO_REPLACE.toLowerCase();

    for(var i_page = 0; i_page < SETTINGS_NUMBER_AMOUNT; i_page++) {
        var page = {};
        for(var i_layer = 0; i_layer < namesToReplaces.length; i_layer++) {
            var name = namesToReplaces[i_layer];
            var number = numberCalculation(i_page, i_layer);
            page[prefix + '-' + name] = number;
            if(name == 1) {
                page[prefix] = number;
            }
        }
        replaceDict.push(page);
    }

    return replaceDict;
}

// Replace placeholders in artboard

function replaceArtboards(selectedArtboards, replaceDict) {
    var replacedArtboards = NSMutableArray.array();

    var replacementFound = false;

    for(var i = 0; i < selectedArtboards.count(); i++) {
        var artboard = selectedArtboards[i].copy();

        var child, childrenLoop = artboard.children().objectEnumerator();
        while (child = childrenLoop.nextObject()) {
            if (child.isMemberOfClass(MSTextLayer)) {
                var name = child.name().toLowerCase();
                var number = replaceDict[name];
                if(number) {
                    child.setStringValue(generateNextNumber(number));
                    replacementFound = true;
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

    // padding

    var pad_size = SETTINGS_PAD_SIZE;

    if(SETTINGS_ALGORITHM != '') {
        pad_size = pad_size - 1;      // We expect check digit
    }

    if(next_number.length < pad_size) {
        next_number = new Array(pad_size - next_number.length + 1).join(SETTINGS_PAD_STRING) + next_number;
    }

    // template

    next_number = SETTINGS_TEMPLATE.replace(SETTINGS_PLACEHOLDER, next_number);

    // check digit algorithm

    if(SETTINGS_ALGORITHM == ALGHORITHM_DAMM) {
        var number_for_checksum = next_number.replace(/[^0-9]/g, '');
        next_number += calculate_damm_digit(number_for_checksum);
    }

    if (CUSTOM_NUMBER_PROCESSING) {
        next_number = CUSTOM_NUMBER_PROCESSING(next_number)
    }

    // return

    return next_number;
}


// Export to PDF

function pageToPDF(page, exportName) {
    var pageArray = [page];
    MSPDFBookExporter.exportPages_defaultFilename(pageArray, exportName + ".pdf");
}
