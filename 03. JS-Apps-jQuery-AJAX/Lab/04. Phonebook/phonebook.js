$(function () {
    let btnLoad = $('#btnLoad');
    let btnAdd = $('#btnAdd');

    btnLoad.on('click',loadContacts);
    btnAdd.on('click',createContact);

    function loadContacts() {
        let getContacts = {
            method: "GET",
            url: 'https://testapp-9a23234.firebaseio.com/phonebook.json'
        };
        $.ajax(getContacts).then(loadSuccess).catch(loadError);
    }

    function loadSuccess(contacts) {
        $('#contacts').empty();
        let keys = Object.keys(contacts);
        for(let singleKey of keys){
            let contact = contacts[singleKey];
            let contactName = contact['name'];
            let contactPhone = contact['phone'];
            let text = `${contactName}: ${contactPhone} `;
            let li = $(`<li data-key="${singleKey}">`).text(text);
            let link = $(`<a href="#">[Delete]</a>`).click(deleteContact);
            li.append(link);
            $('#contacts').append(li)
        }
    }
    function loadError() {
        $('#contacts').text('Error!');
    }

    function deleteContact() {
        let contact = $(this).parent().attr('data-key');
        let deleteContact ={
            method: "DELETE",
            url: 'https://testapp-9a23234.firebaseio.com/phonebook/' + contact+'.json'
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
        let contactName = $('#txtPerson').val();
        let contactPhone = $('#txtPhone').val();
        let dataObj = {
            name: contactName,
            phone: contactPhone
        };
        let addContact ={
            method: "POST",
            url: 'https://testapp-9a23234.firebaseio.com/phonebook.json',
            data: JSON.stringify(dataObj)
        };
        $.ajax(addContact).then(createContactSuccess).catch(createContactError);
    }

    function createContactSuccess() {
        loadContacts();
    }
    function createContactError() {
        $('#contacts').text('Error!');
    }

})