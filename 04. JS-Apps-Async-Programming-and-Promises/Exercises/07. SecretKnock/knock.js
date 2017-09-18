function knock() {
    const baseUrl = "https://baas.kinvey.com/appdata/kid_BJXTsSi-e/knock?query=";
    let authentication = "Basic " + btoa("guest:guest");
    let message = "Knock Knock.";
    $('#knock-btn').click(call);
    function call() {
        $.ajax({
            method: "GET",
            url: baseUrl + message,
            headers: {
                "Authorization": authentication,
                "Content-Type": "application.json"
            }
        }).then((info)=> {
            $('.msg-container').text(message + '\n' + info.answer);
            message = info.message;
        }).catch(function() {  $('.msg-container').text("Finished") }
        )
    }

    call()

}