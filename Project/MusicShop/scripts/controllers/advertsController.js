let advertsController = (() => {
    function getNewAdPage(ctx) {
        if(!authenticator.isAuth()){
            ctx.redirect('#/login');

            return;
        }

        ctx.isLoggedIn = authenticator.isAuth();
        ctx.isAdmin = authenticator.isAdmin();
        ctx.username = sessionStorage.getItem("username");
        ctx.userId = sessionStorage.getItem("userId");
        ctx.loadPartials({
            header: './templates/common/header.hbs',
            footer: './templates/common/footer.hbs'
        }).then(function()  {
            this.partial('./templates/newAd.hbs');
        })
    }

    function createAdvert(ctx) {
        if(!authenticator.isAuth()){
            ctx.redirect('#/login');

            return;
        }

        let title = ctx.params.title.trim();
        if(title.length < 6){
            authenticator.showError('Title must be at least 6 symbols long!');

            return;
        }

        if(title.length > 30){
            aauthenticator.showError('Title cannot be longer than 6 symbols!');

            return;
        }

        let newAd = {
            title: title,
            category: ctx.params.category,
            description: ctx.params.description,
            price: Number(ctx.params.price),
            imageUrl: ctx.params.image,
            datePublished: Date.now(),
            publisher: sessionStorage.getItem("username")
        };

        requester.post("appdata", "ads", "kinvey", newAd)
            .then(createSuccess)
            .catch(authenticator.handleError);

        function createSuccess() {
            ctx.redirect("#/viewAds");
            authenticator.showInfo("Advert created!");
        }
    }

    function loadAdverts(ctx) {
        if(!authenticator.isAuth()){
            ctx.redirect('#/login');

            return;
        }

        requester.get("appdata", "ads", "kinvey")
            .then(loadSuccess)
            .catch(authenticator.handleError);

        function loadSuccess(adverts) {
            adverts.forEach(ad => ad.isPublishedByCurrentUser = ad.publisher === sessionStorage.getItem("username"));
            ctx.adverts = adverts;
            ctx.isLoggedIn = authenticator.isAuth();
            ctx.isAdmin = authenticator.isAdmin();
            ctx.username = sessionStorage.getItem("username");
            ctx.userId = sessionStorage.getItem("userId");

            ctx.loadPartials({
                header: './templates/common/header.hbs',
                footer: './templates/common/footer.hbs',
                adBox: "./templates/viewAds/adBox.hbs",
                filterAds: './templates/filterAds.hbs'
            }).then(function () {
                this.partial("./templates/viewAds/viewAds.hbs").then(function () {
                    let advancedSearchBtn = $("#advancedSearchBtn");
                    advancedSearchBtn.click(toggleSearchFormDisplay);
                });
                    //.then(function () { $("#searchByCategory").click(() => loadAdvertsByCategory(ctx));});
            });
        }
    }

    function loadFilteredAdverts(ctx) {
        if(!authenticator.isAuth()){
            ctx.redirect('#/login');

            return;
        }

        let categoryType = ctx.params['category-type'];
        let startPrice = ctx.params['filter-start-price'];
        let endPrice = ctx.params['filter-end-price'];
        let filterName = ctx.params['filter-name'].trim().toLowerCase();

        // if(endPrice < startPrice){
        //     let buffer = endPrice;
        //     endPrice = startPrice;
        //     startPrice = buffer;
        // }
        //
        // let queries = [];
        //
        // if (startPrice !== '' && endPrice !== ''){
        //     //PRICES NOT WORKING FOR SOME REASON
        //     let greaterPriceQuery = `"price":{"$gte" : ${startPrice}}`;
        //     //queries.push(greaterPriceQuery);
        //     let lesserPriceQuery = `"price":{"$lte": ${endPrice}}`;
        //     //queries.push(lesserPriceQuery);
        // }
        //
        // let categoryTypeQuery = `"category": "${categoryType}"`;
        // if(categoryType !== "All advertisements"){
        //     queries.push(categoryTypeQuery);
        // }
        //
        // let nameQuery = `"title":{"$regex":"^${filterName}" }`;
        // queries.push(nameQuery);
        //
        // let joinedQueries = queries.join(', ');
        // let endPoint = `ads?query={${joinedQueries}}`;
        //
        // console.log(endPoint)

        requester.get("appdata", "ads", 'kinvey')
            .then(loadSuccess)
            .catch(authenticator.handleError);

        function loadSuccess(adverts) {
            adverts = adverts.filter(ad => {
                if (categoryType !== "All advertisements" && ad.category !== categoryType) {
                    return false;
                }

                let startPriceSelected = startPrice.trim() !== '';
                let endPriceSelected = endPrice.trim() !== '';

                if (startPriceSelected && endPriceSelected) {
                    if (ad.price < Number(startPrice) || ad.price > Number(endPrice)) {
                        return false;
                    }
                }

                if (startPriceSelected && ad.price < Number(startPrice)) {
                    return false;
                }

                if (endPriceSelected && ad.price > Number(endPrice)) {
                    return false;
                }

                if (filterName !== '' && ad.title.toLowerCase().indexOf(filterName) === -1) {
                    return false;
                }

                return true;
            });

            adverts.forEach(ad => ad.isPublishedByCurrentUser = ad.publisher === sessionStorage.getItem("username"));
            ctx.adverts = adverts;
            ctx.isLoggedIn = authenticator.isAuth();
            ctx.isAdmin = authenticator.isAdmin();
            ctx.username = sessionStorage.getItem("username");
            ctx.userId = sessionStorage.getItem("userId");
            ctx.loadPartials({
                header: './templates/common/header.hbs',
                footer: './templates/common/footer.hbs',
                adBox: "./templates/viewAds/adBox.hbs",
                filterAds: './templates/filterAds.hbs'
            }).then(function () {
                this.partial("./templates/viewAds/viewAds.hbs").then(function () {
                    $("#categoryBrowser").val(categoryType);
                    $("#filter-end-price").val(endPrice);
                    $("#filter-start-price").val(startPrice);
                    $("#filter-name").val(filterName);
                    let advancedSearchBtn = $("#advancedSearchBtn");
                    advancedSearchBtn.text("Hide Advanced Search");
                    $("#searchForm").show();
                    advancedSearchBtn.click(toggleSearchFormDisplay);
                });
            });
        }
    }

    function loadMyAdverts(ctx) {
        if(!authenticator.isAuth()){
            ctx.redirect('#/login');

            return;
        }

        requester.get("appdata", `ads?query={"publisher":"${sessionStorage.getItem("username")}"}`, "kinvey")
            .then(loadSuccess)
            .catch(authenticator.handleError);

        function loadSuccess(adverts) {
            ctx.adverts = adverts;
            ctx.isLoggedIn = authenticator.isAuth();
            ctx.isAdmin = authenticator.isAdmin();
            ctx.username = sessionStorage.getItem("username");
            ctx.userId = sessionStorage.getItem("userId");

            ctx.loadPartials({
                header: './templates/common/header.hbs',
                footer: './templates/common/footer.hbs',
            }).then(function () {
                this.partial("./templates/myAds/myAds.hbs");
            });
        }
    }

    function deleteAdvert(ctx) {
        if(!authenticator.isAuth()){
            ctx.redirect('#/login');

            return;
        }

        let advertID = ctx.params.id.substring(1);
        requester.remove("appdata", "ads/" + advertID, "kinvey")
            .then(deleteSuccess)
            .catch(authenticator.handleError);

        function deleteSuccess() {
            ctx.redirect("#/viewAds");
            authenticator.showInfo("Advert deleted!");
        }
    }

    function loadAdvertEditView(ctx) {
        if(!authenticator.isAuth()){
            ctx.redirect('#/login');

            return;
        }

        let advertID = ctx.params.id.substring(1);
        requester.get("appdata", "ads/" + advertID, "kinvey")
            .then(loadSuccess)
            .catch(authenticator.handleError);

        function loadSuccess(advert) {
            advert.date = new Date(Number(advert.datePublished)).toDateString();
            ctx.advert = advert;
            ctx.isLoggedIn = authenticator.isAuth();
            ctx.isAdmin = authenticator.isAdmin();
            ctx.username = sessionStorage.getItem("username");
            ctx.userId = sessionStorage.getItem("userId");

            ctx.loadPartials({
                header: './templates/common/header.hbs',
                footer: './templates/common/footer.hbs'
            }).then(function () {
                this.partial("./templates/editAd.hbs").then(function () {
                    $("#category").val(advert.category);
                });
            });
        }
    }

    function editAdvert(ctx) {
        if(!authenticator.isAuth()){
            ctx.redirect('#/login');

            return;
        }

        let advertID = ctx.params.id.substring(1);
        requester.get("appdata", "ads/" + advertID, "kinvey")
            .then(loadSuccess)
            .catch(authenticator.handleError);

        function loadSuccess(advert) {
            advert.title = ctx.params.title;
            advert.category = ctx.params.category;
            advert.description = ctx.params.description;
            advert.price = Number(ctx.params.price);
            advert.imageUrl = ctx.params.image;

            requester.update("appdata", "ads/" + advertID, "kinvey", advert)
                .then(editSuccess)
                .catch(authenticator.handleError);

            function editSuccess() {
                ctx.redirect("#/viewAds");
                authenticator.showInfo("Advert successfully edited!");
            }
        }
    }

    function loadAdDetails(ctx) {
        if(!authenticator.isAuth()){
            ctx.redirect('#/login');

            return;
        }

        let advertId = ctx.params.id.substring(1);

        requester.get("appdata", "ads/" + advertId, "kinvey")
            .then(loadSuccess)
            .catch(authenticator.handleError);

        function loadSuccess(advert) {
            advert.date = new Date(Number(advert.datePublished)).toDateString();
            ctx.advert = advert;

            ctx.isLoggedIn = authenticator.isAuth();
            ctx.isAdmin = authenticator.isAdmin();
            ctx.username = sessionStorage.getItem("username");
            ctx.userId = sessionStorage.getItem("userId");

            requester.get('appdata', `comments?query={"adId":"${advertId}"}`, 'kinvey')
                .then(function (commentsData) {
                    commentsData.forEach(c => {
                        c.datePosted = new Date(Number(c.datePosted)).toDateString();
                        c.isAuthor = c._acl.creator === sessionStorage.getItem('userId');
                    });
                    ctx.comments = commentsData;
                    ctx.loadPartials({
                        header: './templates/common/header.hbs',
                        footer: './templates/common/footer.hbs',
                        comment: './templates/comment.hbs'
                    }).then(function () {
                        this.partial("./templates/viewAdDetails.hbs")
                    })
                }).catch(authenticator.handleError);

        }
    }

    function createComment(ctx) {
        if(!authenticator.isAuth()){
            ctx.redirect('#/login');

            return;
        }

        let advertId = ctx.params.id.substring(1);
        let content = ctx.params.newComment;
        let author = sessionStorage.getItem('username');
        let datePosted = Date.now();

        let data = {
            adId: advertId,
            datePosted: datePosted,
            content: content,
            author: author,
        };

        requester.post('appdata', 'comments', 'kinvey', data)
            .then(function (respondData) {
                authenticator.showInfo('Comment successfully created!');
                ctx.redirect('#/details/:' + advertId);
            }).catch(authenticator.handleError);
    }

    function deleteComment(ctx) {
        if(!authenticator.isAuth()){
            ctx.redirect('#/login');

            return;
        }

        let commentId = ctx.params.id.substring(1);
        requester.get('appdata', 'comments/' + commentId, 'kinvey')
            .then(function (commentData) {
                let postId = commentData.adId;
                requester.remove('appdata', 'comments/' + commentId, 'kinvey')
                    .then(function (respondData) {
                        authenticator.showInfo('Comment successfully deleted!');
                        ctx.redirect('#/details/:' + postId);
                    }).catch(authenticator.handleError);
            }).catch(authenticator.handleError);
    }

    function toggleSearchFormDisplay(event) {
        let advancedSearchBtn = $(event.target);
        if (advancedSearchBtn.text().startsWith("Show")) {
            advancedSearchBtn.text("Hide Advanced Search");
            $("#searchForm").slideDown();
        } else {
            advancedSearchBtn.text("Show Advanced Search");
            $("#searchForm").slideUp();
        }
    }

    return {
        getNewAdPage,
        createAdvert,
        loadAdverts,
        loadFilteredAdverts,
        loadMyAdverts,
        loadAdvertEditView,
        deleteAdvert,
        editAdvert,
        loadAdDetails,
        createComment,
        deleteComment
    }
})();