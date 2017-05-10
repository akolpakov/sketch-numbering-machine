var SETTINGS_HELP_URL = 'https://github.com/akolpakov/sketch-numbering-machine';

var SETTINGS_NAME_TO_REPLACE = 'NM';
var SETTINGS_PLACEHOLDER = '[*]';


// Dialog

var SETTINGS_DIALOG_OPEN_IN_ADVANCE = false;


// Constants

var ALGHORITHM_DAMM = 'Damm Algorithm';
var ALGORITHMS = ['', ALGHORITHM_DAMM];

var NUMBER_DIRECTION_DIRECT = 'NM-1 -> NM-2 -> NM-3';
var NUMBER_DIRECTION_DRILL = 'NM-1 -> NM-1 -> ... -> NM-1 -> NM-2 ...';
var NUMBER_DIRECTIONS = [NUMBER_DIRECTION_DIRECT, NUMBER_DIRECTION_DRILL];


// Defaults

var SETTINGS_TEMPLATE = '[*]';
var SETTINGS_PAD_STRING = '0';
var SETTINGS_ALGORITHM = null;
var SETTINGS_PAD_SIZE = 6;

var SETTINGS_NUMBER_FROM = 100;
var SETTINGS_NUMBER_STEP = 1;
var SETTINGS_NUMBER_AMOUNT = 10;
var SETTINGS_NUMBER_DIRECTION = NUMBER_DIRECTION_DIRECT;

var CUSTOM_NUMBER_PROCESSING = function(number) {
    return number.substring(0, 3) + '-' + number.substring(3, 6);
};