function attachEvents() {
    function displayError(err) {

    }
    let btnAdd = $('.add');
    let btnLoad = $('.load');
    btnLoad.click(loadFish);
    btnAdd.click(addFish);
    const appKey = 'kid_BJu7e5lPW';
    const appSecret = '5f625d6f40db4787a2a7802509fde30d';
    const baseUrl = 'https://baas.kinvey.com/appdata/' + appKey + '/biggestCatches';
    const userCredentials = btoa('pesho:p');
    const authHeaders = {'Authorization': 'Basic ' + userCredentials, "Content-Type":"application/json"};

    function addFish() {
        let fishData = JSON.stringify({
            angler: $('#addForm .angler').val(),
            weight: Number($('#addForm .weight').val()),
            species: $('#addForm .species').val(),
            location: $('#addForm .location').val(),
            bait: $('#addForm .bait').val(),
            captureTime: Number($('#addForm .captureTime').val())
        });
        let postObj ={
            method: "POST",
            url: baseUrl,
            data: fishData,
            headers: authHeaders

        };
        $.ajax(postObj).then(loadFish).catch();
    }
    function loadFish() {
        let getObj ={
            method: "GET",
            url: baseUrl,
            headers: authHeaders

        };

        $.ajax(getObj).then(loadSuccess).catch();

        function loadSuccess(data) {
            $('#catches').empty();
            for(let singleLine of data){
                let html =  `<div class="catch" data-id="${singleLine._id}">
                            <label>Angler</label>
                            <input type="text" class="angler" value="${singleLine.angler}"/>
                            <label>Weight</label>
                            <input type="number" class="weight" value="${singleLine.weight}"/>
                            <label>Species</label>
                            <input type="text" class="species" value="${singleLine.species}"/>
                            <label>Location</label>
                            <input type="text" class="location" value="${singleLine.location}"/>
                            <label>Bait</label>
                            <input type="text" class="bait" value="${singleLine.bait}"/>
                            <label>Capture Time</label>
                    <input type="number" class="captureTime" value="${singleLine.captureTime}"/>
                            <button class="update">Update</button>
                            <button class="delete">Delete</button>
                            </div>`;

                $('#catches').append(html);

            }
            let btnDelete = $('.delete');
            let btnUpdate = $('.update');
            btnDelete.click(deleteFish);
            btnUpdate.click(updateFish);
        }
    }
    function deleteFish() {
        let id = $(this).parent().attr('data-id');
        let deleteObj = {
            method: "DELETE",
            url: baseUrl + '/' + id,
            headers: authHeaders
        };
        $.ajax(deleteObj).then(loadFish).catch(displayError);
    }
    function updateFish() {
        let div = $(this).parent();
        let id = $(this).parent().attr('data-id');
        let angler = div.find('.angler').val();
        let weight = div.find('.weight').val();
        let species = div.find('.species').val();
        let location = div.find('.location').val();
        let bait = div.find('.bait').val();
        let captureTime = div.find('.captureTime').val();

        let fishData = JSON.stringify({
            angler: angler,
            weight: Number(weight),
            species: species,
            location: location,
            bait: bait,
            captureTime: Number(captureTime)
        });
        let updateObj ={
            method: "PUT",
            url: baseUrl + '/' + id,
            data: fishData,
            headers: authHeaders
        };
        $.ajax(updateObj).then(loadFish).catch();
    }
}