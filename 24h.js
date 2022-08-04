
var ID = {
    error: {
        text: "errormessage",
        layer: "error",
    },
    day: "day"
}

var SETTINGS = {
    url: "https://mapall.space/heatmap/json.php",
    language: {
        default: "en"
    },
}

var DAY_ID_TO_API = {
    "Mo": "Monday", 
    "Tu": "Tuesday",
    "We": "Wednesday",
    "Th": "Thursday",
    "Fr": "Friday",
    "Sa": "Saturday",
    "Su": "Sunday"
}

var DATE_TO_DAY_ID = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

var DAY_ID_TO_LANG_TO_TEXT = {
    "en" : {"Mo": "MO", "Tu": "TU", "We": "WE", "Th": "TH", "Fr": "FR", "Sa": "SA", "Su": "SU"},
    "de" : {"Mo": "MO", "Tu": "DI", "We": "MI", "Th": "DO", "Fr": "FR", "Sa": "SA", "Su": "SO"},
}

var INDEX_TO_ID = [];
for (var i = 0; i < 24; i++) {
    INDEX_TO_ID.push((i < 10 ? "0" : "") + i + "00");
}

/* Get the name of the day by id.
 * from https://stackoverflow.com/a/8199791
 */
function getDayName(id) {
    var userLang = navigator.language || navigator.userLanguage;
    var lang = userLang.split("-")[0];
    var translations = DAY_ID_TO_LANG_TO_TEXT[lang] || DAY_ID_TO_LANG_TO_TEXT[SETTINGS.language.default];
    return translations[id] || id;
}

/* Request data from a space given by id and period.
 * see https://github.com/zeno4ever/map-all-spaces
 *
 * onSuccess(JSON)
 * onError(XMLHttpRequest, err|null)
 */
function requestSpaceData(id, period, onSuccess, onError) {
    var onErr = onError || defaultOnError;
    // request data
    // from https://www.w3schools.com/js/js_json_http.asp
    var xmlhttp = new XMLHttpRequest();

    // check parameter
    if (!["week", "month", "year", "everything"].includes(period)) {
        onErr(xmlhttp, new Error("the period parameter should be 'week', 'month', 'year' or 'everything' but it is " + JSON.stringify(period)));
        return;
    }
    if (!id) {
        onErr(xmlhttp, new Error("Set the id parameter to a hackspace from https://directory.spaceapi.io/"));
        return; 
    }

    // create url
    var params = new URLSearchParams();
    params.set("id", id);
    params.set("period", period);
    var url = SETTINGS.url + "?" + params.toString();

    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
            if (this.status == 200) {
                try {
                    var myArr = JSON.parse(this.responseText);
                    onSuccess(myArr);
                } catch(err) {
                    onErr(xmlhttp, err);
                }
            } else {
                onErr(xmlhttp, null);
            }
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();    
}

function loadSpaceDataFromParameters() {
    var params = new URLSearchParams(window.location.search);
    var id = params.get("id");
    var period = params.get("period");
    requestSpaceData(id, period, showSpaceDataForToday);
    document.title = id;
}

function escapeHTML(str){
    // from https://stackoverflow.com/a/22706073
    return new Option(str).innerHTML;
}

/* default error function for a request
 */
function defaultOnError(req, err) {
    if (err) {
        reportError(err.message);
    } else {
        reportError("request failed")
    }
}

/* Report an error to the user.
 *
 */
function reportError(message) {
    console.log(message);
    addErrorMessage("Error, look into console.");
    addErrorMessage(message);
    document.getElementById(ID.error.layer).style = "display: inline;";
}

/* Add an error message for the user.
 * Do not add message twice.
 *
 */
function addErrorMessage(message) {
    var children = document.getElementById(ID.error.text).children;
    var html = escapeHTML(message);
    var i = 0;
    while (children.length > i && children[i].innerHTML != "error\n") {
        if (html == children[i].innerHTML) {
            return;
        }
        i++;
    }
    if (children.length > i) {
        children[i].innerHTML = html;
    }
}


function showSpaceDataForToday(data) {
    console.log("received data", data);
    var today = DATE_TO_DAY_ID[new Date().getDay()];
    console.log("It is " + today);
    showSpaceDataFor(data.data, today);
}

/* Show the space data for a specific day.
 *
 */
function showSpaceDataFor(allData, day) {
    var data = allData[DAY_ID_TO_API[day]];
    console.log("Show data for " + day, data, allData);
    for (var i = 0; i < 24; i++) {
        var id = INDEX_TO_ID[i];
        var value = parseFloat(data[i] + "");
        showHeat(id, value);
    }
    changeDay = function () {
        var nextDay = DATE_TO_DAY_ID[(DATE_TO_DAY_ID.indexOf(day) + 1) % DATE_TO_DAY_ID.length];
        showSpaceDataFor(allData, nextDay);
    }
    document.getElementById(ID.day).children[0].innerHTML = escapeHTML(getDayName(day));
}

/* Change the day by clicking the middle.
 *
 */
function changeDay() {
    // Will be replaced.
}

/* Show the heat for an element with an id and a value
 * 0 <= value <= 1  
 */
function showHeat(id, value) {
    var element = document.getElementById(id);
    var green = Math.ceil(255 * value);
    var color = "rgb(" + (255 - green) + ", " + green + ", 0)";
    element.style.fill = color;
    element.style.fillOpacity = 1;
//    console.log("showHeat", id, color, element);
}

window.addEventListener("load", function() {
    try {
        loadSpaceDataFromParameters();
    } catch (err) {
        reportError(err.message);
    }
});

