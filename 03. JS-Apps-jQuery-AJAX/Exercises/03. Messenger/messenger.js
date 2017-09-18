function solve(){
    let btnSubmit = $('#submit');
    let btnRefresh = $('#refresh');

    btnSubmit.click(send);
    btnRefresh.click(refresh);

    function send() {
        let message = {
            author: $('#author').val(),
            content: $('#content').val(),
            timestamp: Date.now()
        };
        $.post('https://mymessenger-ec2a3.firebaseio.com/messenger.json', JSON.stringify(message)).then(refresh);
    }
    function refresh() {
        $('#messages').empty();
        $('#author').val('');
        $('#content').val('');
        $.get('https://mymessenger-ec2a3.firebaseio.com/messenger.json').then((result) => {
            let keys = Object.keys(result).sort((m1,m2) => result[m1].timestamp - result[m2].timestamp);

            for(let msg of keys){
                $('#messages').append(`${result[msg].author}: ${result[msg].content}\n`)
            }
        })
    }
}