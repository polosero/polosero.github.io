window.addEventListener('load', function() {
    XHR(
        'GET',
        '/pub/chars'
    ).then(response => {
        const list = document.getElementById('char-list');
        for (const char of response) {
            if (char.id === 1) continue;  // NOTE: Testovič je undercover
            list.innerHTML += `<li>
                <span class="char">${e(char.name)}</span>
                <span class="user">${e(char.nick)}</span>
                <span class="race">${e(char.race)}</span>
            </li>`;
        }
    }).catch(console.error);
});


const URL_BASE = 'https://polosero.pythonanywhere.com';
function XHR(method, endpoint) {
    if (!endpoint.startsWith('/'))
        throw new Error('endpoint must start with /');
    const request = new XMLHttpRequest();
    request.timeout = 5000;
    let formData;
    return new Promise((resolve, reject) => {
        request.addEventListener("load", response => {
            if (request.readyState !== XMLHttpRequest.DONE)
                return;
            if (request.status >= 200 && request.status < 300) {
                resolve(JSON.parse(request.responseText));
            } else if (request.status === 401) {
                console.log('login needed');
                reject('Unauthorized');
            } else if (response.status === 405) {
                reject('Method not allowed');
            } else {
                try {
                    reject(JSON.parse(request.responseText));
                } catch (e) {
                    reject(request.responseText);
                }
            }
        });
        request.addEventListener('error', err => {
            console.error(err);
        });
        request.addEventListener('timeout', () => {
            console.error('request timeout');
        });
        request.open(method, URL_BASE + (endpoint || ''));
        request.send(formData);
    });
}


var _tagsToReplace = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;'
};
function _replaceTag(tag) {
    return _tagsToReplace[tag] || tag;
}
function e(str) {
    if (typeof str === 'number')
        return str;
    return String(str).replace(/[&<>]/g, _replaceTag);
}
