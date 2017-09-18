function solve() {
    let nextID = 'depot';
    let currentID = '';
    function loadError() {
        $('.info').text(`Error`);
        $('#depart').prop("disabled", true);
        $('#arrive').prop('disabled',true);
    }
    function depart() {
        $('#depart').prop("disabled", true);
        $('#arrive').prop('disabled',false);
        let busStops = {
            method: "GET",
            url: 'https://judgetests.firebaseio.com/schedule/' + nextID + '.json'
        };
        $.ajax(busStops).then(loadSuccess).catch(loadError);

        function loadSuccess(data) {
            currentID = nextID;
            $('.info').text(`Next stop ${data['name']}`);
            nextID = data['next'];
        }

    }
    function arrive() {
        $('#depart').prop("disabled", false);
        $('#arrive').prop('disabled',true);
        let busStops = {
            method: "GET",
            url: 'https://judgetests.firebaseio.com/schedule/' + currentID + '.json'
        };
        $.ajax(busStops).then(arriveSuccess).catch(loadError);
        function arriveSuccess(data) {
            $('.info').text(`Arriving at ${data['name']}`);

        }
    }
    return {
        depart,
        arrive
    };
}
let result = solve();