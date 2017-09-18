function attachEvents() {
    function displayError(error) {
        $('#forecast').empty();
        $('#forecast').text("Error");
    }

    let btnSubmit = $('#submit');
    btnSubmit.click(getTown);

    function getTown() {
        let townValue = $('#location').val();
        let getTown ={
            method: "GET",
            url: 'https://judgetests.firebaseio.com/locations.json'
        };

        $.ajax(getTown).then(getForecastTown).catch(displayError);

        function getForecastTown(data) {
            let code = '';
            for(let value of data){
                if(townValue == value['name']){
                    code = value['code']
                }
            }
            let forecastTodayObj = {
                method: "GET",
                url: `https://judgetests.firebaseio.com/forecast/today/${code}.json`
            };
            let forecastTomorrowObj = {
                method: "GET",
                url: `https://judgetests.firebaseio.com/forecast/upcoming/${code}.json`
            };
            let forecastToday = $.ajax(forecastTodayObj);
            let forecastTomorrow = $.ajax(forecastTomorrowObj);
            Promise.all([forecastToday, forecastTomorrow]).then(displayForecast).catch(displayError);
        }

        function displayForecast([today, tomorrow]) {

            $('#forecast').css('display','block');
            let symbols = {
                Sunny: '&#x2600',
                PartlySunny: '&#x26C5',
                Overcast: '&#x2601',
                Rain: '&#x2614',
                Degrees: '&#176'
            };

            //Todays forecast
            let todayCondition = today.forecast.condition;
            let todaySymbol = symbols[todayCondition];
            $('#current').append($(`<span class="condition symbol">${todaySymbol}</span>`));
            let spanCondition = $('<span class="condition"></span>');
            let spanLocation = $(`<span class="forecast-data">${today.name}</span>`);
            let spanTemp = $(`<span class="forecast-data">${today.forecast.low}${'&#176'}/${today.forecast.high}${'&#176'}</span>`);
            let spanWeather = $(`<span class="forecast-data">${todayCondition}</span>`);
            spanCondition.append(spanLocation).append(spanTemp).append(spanWeather);
            $('#current').append(spanCondition);

            let symbol0 = tomorrow.forecast['0'].condition;
            let symbol1 = tomorrow.forecast['1'].condition;
            let symbol2 = tomorrow.forecast['2'].condition;
            if(symbol0 == 'Partly sunny'){
                symbol0 = 'PartlySunny'
            }
            if(symbol1 == 'Partly sunny'){
                symbol1 = 'PartlySunny'
            }
            if(symbol2 == 'Partly sunny'){
                symbol2 = 'PartlySunny'
            }

            let spanUpComing = $('<span class="upcoming"></span>');
            let spanTomorrowSymbol0 =$(`<span class="symbol">${symbols[symbol0]}</span>`);
            let spanTomorrowTemp0 = $(`<span class="forecast-data">${tomorrow.forecast['0'].low}${'&#176'}/${tomorrow.forecast['0'].high}${'&#176'}</span>`);
            let spanTomorrowWeather0 = $(`<span class="forecast-data">${tomorrow.forecast['0'].condition}</span>`);
            spanUpComing.append(spanTomorrowSymbol0).append(spanTomorrowTemp0).append(spanTomorrowWeather0);

            let spanUpComing1 = $('<span class="upcoming"></span>');
            let spanTomorrowSymbol1 =$(`<span class="symbol">${symbols[symbol1]}</span>`);
            let spanTomorrowTemp1 = $(`<span class="forecast-data">${tomorrow.forecast['1'].low}${'&#176'}/${tomorrow.forecast['1'].high}${'&#176'}</span>`);
            let spanTomorrowWeather1 = $(`<span class="forecast-data">${tomorrow.forecast['1'].condition}</span>`);
            spanUpComing1.append(spanTomorrowSymbol1).append(spanTomorrowTemp1).append(spanTomorrowWeather1);

            let spanUpComing2 = $('<span class="upcoming"></span>');
            let spanTomorrowSymbol2 =$(`<span class="symbol">${symbols[symbol2]}</span>`);
            let spanTomorrowTemp2 = $(`<span class="forecast-data">${tomorrow.forecast['2'].low}${'&#176'}/${tomorrow.forecast['2'].high}${'&#176'}</span>`);
            let spanTomorrowWeather2 = $(`<span class="forecast-data">${tomorrow.forecast['2'].condition}</span>`);
            spanUpComing2.append(spanTomorrowSymbol2).append(spanTomorrowTemp2).append(spanTomorrowWeather2);

            $('#upcoming').append(spanUpComing).append(spanUpComing1).append(spanUpComing2);

        }
    }
}