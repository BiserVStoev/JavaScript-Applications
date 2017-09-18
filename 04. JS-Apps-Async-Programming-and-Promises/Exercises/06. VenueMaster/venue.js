function attachEvents() {
    const baseUrl = 'https://baas.kinvey.com/';
    const base64 = btoa("guest:pass");
    const authHeaders = {"Authorization": "Basic " + base64, "Content-Type": 'application/json'};

    let btnList = $('#getVenues');
    btnList.click(getVenues);
    function getVenues() {
        let venueDate = $('#venueDate').val();
        let postObj = {
            method: "POST",
            url: baseUrl + `rpc/kid_BJ_Ke8hZg/custom/calendar?query=${venueDate}`,
            headers: authHeaders
        };
        $.ajax(postObj).then(successLoad).catch();

        function successLoad(data) {
            $('#venue-info').empty();

            for (let i = 0; i < data.length; i++) {

                $.ajax({
                    method: "GET",
                    url: baseUrl + `appdata/kid_BJ_Ke8hZg/venues/${data[i]}`,
                    headers: authHeaders,
                    success: function (result) {
                        let html = `<div class="venue" id="${result._id}">
  <span class="venue-name"><input class="info${i}" type="button" value="More info">${result.name}</span>
  <div class="venue-details" style="display: none;">
    <table>
      <tr><th>Ticket Price</th><th>Quantity</th><th></th></tr>
      <tr>
        <td class="venue-price">${result.price} lv</td>
        <td><select class="quantity">
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select></td>
        <td><input class="purchase" type="button" value="Purchase"></td>
      </tr>
    </table>
    <span class="head">Venue description:</span>
    <p class="description">${result.description}</p>
    <p class="description">Starting time: ${result.startingHour}</p>
  </div>
</div>
`;
                        $('#venue-info').append(html);
                        $('.info' + i).on('click', function () {

                            if ($(this).parent().parent().find('.venue-details').css('display') == 'block') {
                                $(this).parent().parent().find('.venue-details').css('display', 'none');
                            }
                            else {
                                $(this).parent().parent().find('.venue-details').css('display', 'block');
                                let btnPurchase = $(this).parent().parent().find('.venue-details table .purchase');
                                btnPurchase.on('click', function () {
                                    let quantityElements = $(this).parent().parent().find(`.venue-details table tr .purchase`);
                                    let quantity = $(quantityElements.prevObject['0'].cells['1'].lastChild).val();
                                    $('#venue-info').empty();
                                    let newHtml = `<span class="head">Confirm purchase</span>
<div class="purchase-info">
  <span>${result.name}</span>
  <span>${quantity} x ${result.price}</span>
  <span>Total: ${quantity * result.price} lv</span>
  <input type="button" value="Confirm" id="confirmMovie">
</div>
`;
                                    $('#venue-info').append(newHtml);
                                    $(function () {
                                        $('#confirmMovie').on('click',function () {
                                            $.ajax({
                                                method: "POST",
                                                url: baseUrl + `rpc/kid_BJ_Ke8hZg/custom/purchase?venue=${result._id}&qty=${quantity}`,
                                                headers: authHeaders
                                            }).then((resultData) => {
                                                $('#venue-info').empty();
                                                $('#venue-info').append(`You may print this page as your ticket`);
                                                $('#venue-info').append(resultData.html);
                                            }).catch();
                                        })
                                    })
                                });

                            }
                        });

                    }
                })
            }
        }
    }

}