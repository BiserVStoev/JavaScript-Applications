function getInfo() {
    let stopID = $('#stopId').val();

    let url = `https://judgetests.firebaseio.com/businfo/` + stopID + '.json';
    $.get(url).then(loadSuccess).catch(loadError);

    function loadError() {
        $('#buses').empty();
        $('#stopName').empty();
        $('#stopName').text('Error');
    }

    function loadSuccess(data) {
        let buses = data['buses'];
        $('#buses').empty();
        $('#stopName').text(data.name);
        for(let bus in buses){
            let li = $('<li>');
            li.text(`Bus ${bus} arrives in ${buses[bus]} minutes`);
            $('#buses').append(li);
        }
    }
}