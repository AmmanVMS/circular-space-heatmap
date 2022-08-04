
function onSuccess(json) {
    document.getElementById("spaces").innerHTML = "";
    // from https://attacomsian.com/blog/javascript-iterate-objects
    for (const space in json) {
        if (json.hasOwnProperty(space)) {
            addSpace(space);
        }
    }
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
    var params = new URLSearchParams();
    params.set("id", document.getElementById("spaces").value);
    params.set("period", document.getElementById("period").value);
    var url = "24h.svg?" + params.toString();
    document.getElementById("mapobject").data = url;
    document.getElementById("mapimg").src = url;
}