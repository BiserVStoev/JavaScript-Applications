function attachEvents() {
    $('#btnLoadTowns').click(getTowns);
    
    function getTowns() {
        Promise.all([
            $.get('./templates/town-partial.html'),
            $.get('./templates/town-list.html')])
                .then(renderTowns).catch();

        function renderTowns([townTemplate, townListTemplate]) {
            Handlebars.registerPartial('townPartial', townTemplate);

            let townsTemplate = Handlebars.compile(townListTemplate);

            let context = {
                towns: []
            };
            let input = $('#towns').val();
            let towns = input.split(', ');
            for (let currTown of towns) {
                context.towns.push({name: currTown});
            }

            let container = $('#root');
            container.html(townsTemplate(context));
        }
    }
}