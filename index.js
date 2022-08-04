
function onSuccess(json) {
    var spaces = document.getElementById("spaces");
    var value = spaces.value;
    spaces.innerHTML = "";
    // from https://attacomsian.com/blog/javascript-iterate-objects
    for (const space in json) {
        if (json.hasOwnProperty(space)) {
            addSpace(space);
        }
    }
    spaces.value = value;
    showImage();
}

var xmlhttp = new XMLHttpRequest();

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
xmlhttp.open("GET", "https://directory.spaceapi.io/", true);
xmlhttp.send();

console.log("loading...");

function addSpace(space) {
    var select = document.getElementById("spaces");
    var option = document.createElement("option");
    option.value = option.innerText = space;
    select.appendChild(option);
}

function showImage() {
    // get params
    var params = new URLSearchParams();
    params.set("id", document.getElementById("spaces").value);
    params.set("period", document.getElementById("period").value);
    params.set("day", document.getElementById("day").value);
    // construct url
    var url = "24h.svg?" + params.toString();
    if (document.location.protocol != "file:") {
        // absolute URL
        url = document.location.href.replace(/index\.html$/, "") + url;
    }
    // fill UI
    document.getElementById("mapimg").src = url;
    document.getElementById("favicon").href = url;
    document.getElementById("mapobj").data = url;
    document.getElementById("mapcode").innerText = document.getElementById("map").innerHTML;
}

function escapeHTML(str){
    // from https://stackoverflow.com/a/22706073
    return new Option(str).innerHTML;
}

