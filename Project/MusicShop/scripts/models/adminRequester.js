let adminRequester = (() => {
    const kinveyBaseUrl = "https://baas.kinvey.com/";
    const kinveyAppKey = "kid_BJG32qqK-";

    // Creates request object to kinvey
    function makeRequest(method, module, endpoint) {
        return req = {
            method,
            url: kinveyBaseUrl + module + '/' + kinveyAppKey + '/' + endpoint,
            headers: {
                'Authorization': 'Basic ' + btoa(kinveyAppKey + ':' + sessionStorage.getItem('master-secret'))
            }
        };
    }

    // Function to return GET promise
    function get (module, endpoint) {
        return $.ajax(makeRequest('GET', module, endpoint));
    }

    // Function to return POST promise
    function post (module, endpoint, data) {
        let req = makeRequest('POST', module, endpoint);
        req.dataType = 'json';
        req.contentType = 'application/json';
        req.data = JSON.stringify(data);
        return $.ajax(req);
    }

    // Function to return PUT promise
    function update (module, endpoint, data) {
        let req = makeRequest('PUT', module, endpoint);
        req.dataType = 'json';
        req.contentType = 'application/json';
        req.data = JSON.stringify(data);
        return $.ajax(req);
    }

    // Function to return DELETE promise
    function remove (module, endpoint) {
        return $.ajax(makeRequest('DELETE', module, endpoint));
    }

    return {
        get,
        post,
        update,
        remove
    }
})();