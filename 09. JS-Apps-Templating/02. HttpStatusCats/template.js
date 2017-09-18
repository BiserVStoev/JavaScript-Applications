$(() => {
    const templates = {};
    const context = {
        cats: []
    };

    context.cats = window.cats;

    const catsList = $('#allCats');

    loadTemplates();

    async function loadTemplates() {
        const [catsListData, cat] =
            await Promise.all([
                $.get('./templates/cat-list.html'),
                $.get('./templates/cat.html'),
            ]);

        Handlebars.registerPartial('cat', cat);
        templates.catsList = Handlebars.compile(catsListData);

        renderCatTemplate();

        function renderCatTemplate() {
            catsList.html(templates.catsList(context));

            attachEventHandlers();
        }

        function attachEventHandlers() {

            catsList.children().find('#infoBtn').click( (e) => {
                $(e.target)
                    .closest('.card-block')
                    .find('.status-info')
                    .toggle();
            });
        }
    }
});