
var ID = {
    error: {
        text: "errormessage",
        layer: "error",
    },
}

var SETTINGS = {
    url: "https://mapall.space/heatmap/json.php"
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
    requestSpaceData(id, period, showSpaceData);
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
    document.getElementById(ID.error.text).children[0].innerHTML = escapeHTML(message);
    document.getElementById(ID.error.text).children[1].innerHTML = "Error, look into console.";
    document.getElementById(ID.error.layer).style = "display: inline;";
}


window.addEventListener("load", function() {
    loadSpaceDataFromParameters();
});
