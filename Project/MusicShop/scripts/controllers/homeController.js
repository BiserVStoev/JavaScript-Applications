let homeController = (() => {
    function getHomePage(ctx) {
        ctx.isLoggedIn = authenticator.isAuth();
        ctx.isAdmin = authenticator.isAdmin();
        ctx.username = sessionStorage.getItem("username");
        ctx.userId = sessionStorage.getItem("userId");
        ctx.loadPartials({
            header: './templates/common/header.hbs',
            footer: './templates/common/footer.hbs'
        }).then(function()  {
            this.partial('./templates/home.hbs');
        })
    }

    return {
        getHomePage
    }
})();

