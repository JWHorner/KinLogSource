function returnToPopup() {
    chrome.action.setPopup({ popup: "popup.html" });
    location.href = 'popup.html'
}

chrome.tabs.query({ 'active': true, 'lastFocusedWindow': true }, function (tabs) {
    if (tabs[0].url.indexOf('https://kindroid.ai/') !== 0) {
        returnToPopup();
    }
});

/*chrome.tabs.query({ 'active': true, 'lastFocusedWindow': true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { type: "urlIsKindroid" }, function (response) { 
        if (!response) {
            returnToPopup();
        }
    });
});*/

// Version
document.getElementById('version').innerText = `v${chrome.runtime.getManifest().version_name}`;

document.getElementById('cancel').addEventListener('click', returnToPopup);

function view(id, kinOrGroup) {
    //alert(id + '_' + kinOrGroup);
    chrome.tabs.query({ 'active': true, 'lastFocusedWindow': true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { type: "moveToChat", id: id, kinOrGroup: kinOrGroup }, function (response) { });
    });
    chrome.action.setPopup({ popup: "popup.html" });
    window.close();
}

function deleteChat(id) {
    //alert(`deleting ${id}`);
    console.log(`1: ${id}`);
    chrome.tabs.query({ 'active': true, 'lastFocusedWindow': true }, function (tabs) {
        console.log(`2: ${id}`);
        chrome.tabs.sendMessage(tabs[0].id, { type: "deleteConversation", id: id }, function (response) {
            location.href = location.href;
        });
    });
}

function createButton(image, event, tooltip) {
    div = document.createElement('div');
    div.className = 'tooltip'
    img = document.createElement('img');
    img.setAttribute('src', image)
    img.className = 'tableButton';
    img.addEventListener('click', () => {
        event();
    });
    div.appendChild(img)
    span = document.createElement('span');
    span.className = 'tooltiptext';
    span.innerText = tooltip;
    div.appendChild(span)
    return div;
}

function download(id, fileType, name) {
    chrome.tabs.query({ 'active': true, 'lastFocusedWindow': true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { type: "downloadConversation", fileType: fileType, id: id, name: name }, function (response) { });
    });
}

chrome.tabs.query({ 'active': true, 'lastFocusedWindow': true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { type: "getConversationsMeta" }, function (response) {

        if (response) {

            // id, name, date, getChatSize(id), kinOrGroup

            const body = document.body,
                tbl = document.createElement('table');
            tbl.className = 'manageTable';

            const tr = tbl.insertRow();
            let td = tr.insertCell();
            td.className = 'manageHeaderCell';
            td.appendChild(document.createTextNode('Chat'));
            td = tr.insertCell();
            td.className = 'manageHeaderCell';
            td.appendChild(document.createTextNode('Started'));
            td = tr.insertCell();
            td.className = 'manageHeaderCell';
            td.appendChild(document.createTextNode('Size'));
            td = tr.insertCell();


            for (let i = 0; i < response.length; i++) {
                const tr = tbl.insertRow();
                let td = tr.insertCell();
                //td.appendChild(document.createTextNode(response[i][0]));
                //td = tr.insertCell();
                // Name
                td.className = 'cellPadRight';
                td.appendChild(document.createTextNode(response[i][1]));
                td = tr.insertCell();
                // Date
                td.className = 'cellPadRight';
                td.appendChild(document.createTextNode(response[i][2] ? new Date(response[i][2]).toLocaleDateString() : ''));
                td = tr.insertCell();
                // Size
                td.className = 'cellPadRight';
                td.appendChild(document.createTextNode(response[i][3]));
                td = tr.insertCell();
                // Kin or group
                //td.appendChild(document.createTextNode(response[i][4] ? response[i][4] : ''));
                //td = tr.insertCell();

                // View
                /*div = document.createElement('div');
                div.className = 'tooltip'
                img = document.createElement('img');
                img.setAttribute('src', 'images/view.png')
                img.className = 'tableButton';
                img.addEventListener('click', () => {
                    view(response[i][0], response[i][4]);
                });
                div.appendChild(img)
                span = document.createElement('span');
                span.className = 'tooltiptext';
                span.innerText = 'Switch chat';
                div.appendChild(span)
                td.appendChild(div);*/

                // View
                let evnt = function () { view(response[i][0], response[i][4]) };
                td.appendChild(createButton('images/view.png', evnt, 'Switch chat'));

                // Download text
                evnt = function () { 
                    //alert(`downloading text ${response[i][0]}`);
                    console.log(response[i][1]);
                    download(response[i][0], 'txt', response[i][1]);
                 };
                td.appendChild(createButton('images/text.png', evnt, 'Download plain text'));
                /*btn = document.createElement('img');
                btn.setAttribute('src', 'images/text.png')
                btn.className = 'tableButton';
                btn.addEventListener('click', () => {
                    // TODO: Delete function
                    alert(`downloading text ${response[i][0]}`);
                });
                td.appendChild(btn);*/

                // Download HTML
                evnt = function () { 
                    //alert(`downloading HTML ${response[i][0]}`); 
                    download(response[i][0], 'html', response[i][1]);
                };
                td.appendChild(createButton('images/html.png', evnt, 'Download HTML'));
                /*btn = document.createElement('img');
                btn.setAttribute('src', 'images/html.png')
                btn.className = 'tableButton';
                btn.addEventListener('click', () => {
                    // TODO: Delete function
                    alert(`downloading HTML ${response[i][0]}`);
                });
                td.appendChild(btn);*/

                // Download JSON
                evnt = function () { 
                    //alert(`downloading JSON ${response[i][0]}`); 
                    download(response[i][0], 'json', response[i][1]);
                };
                td.appendChild(createButton('images/json.png', evnt, 'Download JSON'));
                /*btn = document.createElement('img');
                btn.setAttribute('src', 'images/json.png')
                btn.className = 'tableButton';
                btn.addEventListener('click', () => {
                    // TODO: Delete function
                    alert(`downloading JSON ${response[i][0]}`);
                });
                td.appendChild(btn);*/

                // Delete
                evnt = function () { 
                    deleteChat(response[i][0]) 
                };
                td.appendChild(createButton('images/delete.png', evnt, 'Delete chat log'));
                /*btn = document.createElement('img');
                btn.setAttribute('src', 'images/delete.png')
                btn.className = 'tableButton';
                btn.addEventListener('click', () => {
                    // TODO: Delete function
                    alert(`deleting ${response[i][0]}`);
                });
                td.appendChild(btn);*/
            }

            document.getElementById('table').appendChild(tbl);

        }

    });
});

