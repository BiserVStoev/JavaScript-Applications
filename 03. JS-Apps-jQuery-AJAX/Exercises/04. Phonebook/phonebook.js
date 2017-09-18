function attachEvents() {
    let btnLoad = $('#btnLoad');
    let btnAdd = $('#btnCreate');

    btnLoad.on('click',loadContacts);
    btnAdd.on('click',createContact);

    function loadContacts() {
        let getContacts = {
            method: "GET",
            url: 'https://phonebook-nakov.firebaseio.com/phonebook.json'
        };
        $.ajax(getContacts).then(loadSuccess).catch(loadError);
    }

    function loadSuccess(contacts) {
        $('#phonebook').empty();
        let keys = Object.keys(contacts);
        for(let singleKey of keys){
            let contact = contacts[singleKey];
            let contactName = contact['person'];
            let contactPhone = contact['phone'];
            let text = `${contactName}: ${contactPhone} `;
            let li = $(`<li data-key="${singleKey}">`).text(text);
            li.append($(`<button>[Delete]</button>`).click(deleteContact));
            $('#phonebook').append(li)
        }
    }
    function loadError() {
        $('#contacts').text('Error!');
    }

    function deleteContact() {
        console.log($(this))
        console.log($(this).parent())
        console.log($(this).parent().attr('data-key'))
        let contact = $(this).parent().attr('data-key');
        let deleteContact ={
            method: "DELETE",
            url: 'https://phonebook-nakov.firebaseio.com/phonebook/' + contact + '.json'
        };
        $.ajax(deleteContact).then(deleteSuccess).catch(deleteError);
    }

    function deleteSuccess() {
        loadContacts();
    }
    function deleteError() {
        $('#contacts').text('Error!');
    }

    function createContact() {
        let contactName = $('#person').val();
        let contactPhone = $('#phone').val();
        let dataObj = {
            person: contactName,
            phone: contactPhone
        };
        let addContact ={
            method: "POST",
            url: 'https://phonebook-nakov.firebaseio.com/phonebook.json',
            data: JSON.stringify(dataObj)
        };
        $.ajax(addContact).then(createContactSuccess).catch(createContactError);
    }

    function createContactSuccess() {
        loadContacts();
        $('#person').val('');
        $('#phone').val('');

    }
    function createContactError() {
        $('#contacts').text('Error!');
    }
}