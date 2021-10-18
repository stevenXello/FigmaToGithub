//modifying the data to make the files downloadable
function saveData(blob, fileName) {
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    var url = window.URL.createObjectURL(blob);
    a.href = url;

    //changing the naming convention from Figma to CDN (ex: Ic Chevron/Left --> ic-chevron-left)
    let lowerCase = fileName.toLowerCase();
    let removeSlash = lowerCase.replace("/", "-");
    let finalName = removeSlash.replace(" ", "-");

    a.download = finalName;
    a.click();
    window.URL.revokeObjectURL(url);
}

//downloading the SVG
function xhrSend(dataUrl, fileName) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", dataUrl);
    xhr.responseType = "blob";

    //function to get the data we have stored in saveData
    xhr.onload = function () {
        saveData(this.response, fileName);
    };
    xhr.send();
}

function downloadSvg() {
    //fetching all the data in the figma file
    fetch("https://api.figma.com/v1/files/okaUF7nASVsb3MeQSytmIo", {
        method: "get",
        mode: "cors",
        headers: {
            "X-FIGMA-TOKEN": "220989-5a1ba0db-d6ed-487c-b242-39d93cae59ec",
        },
    })
        .then((response) => response.json())
        .then((data) => {
            //looping through each icon in the figma file fetched above
            for (const property in data.components) {
                //saving the icon name in order to send to xhrSend function
                let fileName = data.components[`${property}`].name;
                //fetching the SVG signature of each file
                fetch(`https://api.figma.com/v1/images/okaUF7nASVsb3MeQSytmIo?ids=${property}&format=svg`, {
                    method: "get",
                    mode: "cors",
                    headers: {
                        "X-FIGMA-TOKEN": "220989-5a1ba0db-d6ed-487c-b242-39d93cae59ec",
                    },
                })
                    .then((response) => response.json())
                    .then((data) => {
                        //saving the actual icon URL and sending it to xhrSend
                        let myData = data.images[`${property}`];
                        xhrSend(myData, fileName);
                    });
            }
        });
}
