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

var SETTINGS_TEMPLATE = '0001-[*]';
var SETTINGS_PAD_STRING = '0';
var SETTINGS_ALGORITHM = null;
var SETTINGS_PAD_SIZE = 4;

var SETTINGS_NUMBER_FROM = 1;
var SETTINGS_NUMBER_STEP = 1;
var SETTINGS_NUMBER_AMOUNT = 10;
var SETTINGS_NUMBER_DIRECTION = NUMBER_DIRECTION_DIRECT;

var SETTINGS_DETACH_SYMBOLS = true;     // TODO: put to settings dialog

// Custom processing

var CUSTOM_NUMBER_PROCESSING = null;   // Could place custom function to process number
