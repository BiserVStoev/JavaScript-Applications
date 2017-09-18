let adminController = (() => {
    function getAdminControllerSecretPage(ctx) {
        if(!authenticator.isAdmin()){
            if(!authenticator.isAuth()){
                ctx.redirect('#/login');

                return;
            }

            ctx.redirect('#/home');

            return;
        }

        ctx.partial('./templates/admin/secret.hbs')
            .then(function () {
                $('.send-secret-btn').click(function (ev) {
                    let masterSecret = $('#master-secret').val();
                    sessionStorage.setItem('master-secret', masterSecret);
                });
            });
    }

    function getAdminHomePage(ctx) {
        if(!authenticator.isAdmin()){
            if(!authenticator.isAuth()){
                ctx.redirect('#/login');

                return;
            }

            ctx.redirect('#/home');

            return;
        }

        ctx.isInAdminArea = authenticator.isAdmin();
        ctx.loadPartials({
            header: './templates/common/header.hbs',
            footer: './templates/common/footer.hbs'
        }).then(function()  {
            this.partial('./templates/admin/home.hbs');
        })
    }

    function getManageUsers(ctx) {
        if(!authenticator.isAdmin()){
            if(!authenticator.isAuth()){
                ctx.redirect('#/login');

                return;
            }

            ctx.redirect('#/home');

            return;
        }

        ctx.isInAdminArea = authenticator.isAdmin();

        adminRequester.get('user', '')
            .then(function (usersData) {
                    ctx.users = usersData;
                    ctx.loadPartials({
                        header: './templates/common/header.hbs',
                        footer: './templates/common/footer.hbs'
                    }).then(function()  {
                        this.partial('./templates/admin/users.hbs');
                    })
                }
            )
            .catch(authenticator.handleError);

    }

    function getSpecificUser(ctx) {
        if(!authenticator.isAdmin()){
            if(!authenticator.isAuth()){
                ctx.redirect('#/login');

                return;
            }

            ctx.redirect('#/home');

            return;
        }

        let userId = ctx.params.id.substring(1);
        ctx.isInAdminArea = authenticator.isAdmin();
        adminRequester.get('user', userId)
            .then(function (userData) {
                ctx.user = userData;
                adminRequester.get('appdata', `ads?query={"_acl.creator":"${userId}"}`)
                    .then(function (adsCountData) {
                        ctx.user.adsCount = adsCountData.length;
                        ctx.loadPartials({
                            header: './templates/common/header.hbs',
                            footer: './templates/common/footer.hbs'
                        }).then(function()  {
                            this.partial('./templates/admin/specificUser.hbs');
                        })
                    });

            })
            .catch(authenticator.handleError);
    }

    function lockUser(ctx) {
        if(!authenticator.isAdmin()){
            if(!authenticator.isAuth()){
                ctx.redirect('#/login');

                return;
            }

            ctx.redirect('#/home');

            return;
        }

        let userId = ctx.params.id.substring(1);

        let data = {
            userId: userId,
            setLockdownStateTo: true
        };

        adminRequester.post('rpc', 'lockdown-user', data)
            .then(function (retrievedData) {
                authenticator.showInfo("User successfuly locked");
                ctx.redirect('#/admin/users/:' + userId);
            })
            .catch(authenticator.handleError);
    }

    function unlockUser(ctx) {
        if(!authenticator.isAdmin()){
            if(!authenticator.isAuth()){
                ctx.redirect('#/login');

                return;
            }

            ctx.redirect('#/home');

            return;
        }

        let userId = ctx.params.id.substring(1);

        let data = {
            userId: userId,
            setLockdownStateTo: false
        };

        adminRequester.post('rpc', 'lockdown-user', data)
            .then(function (retrievedData) {
                authenticator.showInfo("User successfuly unlocked");
                ctx.redirect('#/admin/users/:' + userId);
            })
            .catch(authenticator.handleError);
    }

    function makeAdmin(ctx) {
        if(!authenticator.isAdmin()){
            if(!authenticator.isAuth()){
                ctx.redirect('#/login');

                return;
            }

            ctx.redirect('#/home');

            return;
        }

        let userId = ctx.params.id.substring(1);
        adminRequester.get('user', userId)
            .then(function (userData) {
                userData.isAdmin = true;
                adminRequester.update('user', userId, userData)
                    .then(function () {
                        authenticator.showInfo("Successfuly granted the user admin privileges.");
                        ctx.redirect("#/admin/users/:" + userId);
                    })
            })
            .catch(authenticator.handleError);
    }

    function removeAdmin(ctx) {
        if(!authenticator.isAdmin()){
            if(!authenticator.isAuth()){
                ctx.redirect('#/login');

                return;
            }

            ctx.redirect('#/home');

            return;
        }

        let userId = ctx.params.id.substring(1);
        adminRequester.get('user', userId)
            .then(function (userData) {
                userData.isAdmin = false;
                adminRequester.update('user', userId, userData)
                    .then(function () {
                        authenticator.showInfo("Successfuly stripped the user from admin privileges.");
                        ctx.redirect("#/admin/users/:" + userId);
                    })
            })
            .catch(authenticator.handleError);
    }

    function getManageAds(ctx) {
        if(!authenticator.isAdmin()){
            if(!authenticator.isAuth()){
                ctx.redirect('#/login');

                return;
            }

            ctx.redirect('#/home');

            return;
        }

        ctx.isInAdminArea = authenticator.isAdmin();

        adminRequester.get('appdata', 'ads')
            .then(function (adsData) {
                    ctx.ads = adsData;
                    ctx.loadPartials({
                        header: './templates/common/header.hbs',
                        footer: './templates/common/footer.hbs'
                    }).then(function()  {
                        this.partial('./templates/admin/ads.hbs');
                    })
                }
            )
            .catch(authenticator.handleError);
    }

    function getManageSpecificAd(ctx) {
        if(!authenticator.isAdmin()){
            if(!authenticator.isAuth()){
                ctx.redirect('#/login');

                return;
            }

            ctx.redirect('#/home');

            return;
        }

        let adId = ctx.params.id.substring(1);
        ctx.isInAdminArea = authenticator.isAdmin();
        adminRequester.get('appdata', 'ads/' + adId)
            .then(function (adData) {
                adData.datePublished = new Date(Number(adData.datePublished)).toDateString();
                ctx.ad = adData;
                ctx.loadPartials({
                    header: './templates/common/header.hbs',
                    footer: './templates/common/footer.hbs'
                }).then(function()  {
                    this.partial('./templates/admin/specificAd.hbs');
                })

            })
            .catch(authenticator.handleError);
    }

    function deleteAd(ctx) {
        if(!authenticator.isAdmin()){
            if(!authenticator.isAuth()){
                ctx.redirect('#/login');

                return;
            }

            ctx.redirect('#/home');

            return;
        }

        let adId = ctx.params.id.substring(1);
        ctx.isInAdminArea = authenticator.isAdmin();

        adminRequester.remove('appdata', 'ads/' + adId)
            .then(function (deleteDataCount) {
                authenticator.showInfo('Ad successfully deleted!');
                ctx.redirect('#/admin/ads')

            })
            .catch(authenticator.handleError);
    }

    return {
        getAdminControllerSecretPage,
        getAdminHomePage,
        getManageUsers,
        getSpecificUser,
        lockUser,
        unlockUser,
        makeAdmin,
        removeAdmin,
        getManageAds,
        getManageSpecificAd,
        deleteAd
    }
})();