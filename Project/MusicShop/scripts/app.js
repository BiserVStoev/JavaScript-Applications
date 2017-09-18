$(() => {
    const app = Sammy('#mainContainer', function () {
        this.use('Handlebars', 'hbs');

        this.get('index.html', homeController.getHomePage);
        this.get('#/home', homeController.getHomePage);

        this.get('#/register', accountController.getRegisterPage);
        this.post('#/register', accountController.getRegistered);

        this.get('#/login', accountController.getLoginPage);
        this.post('#/login', accountController.getLoggedIn);

        this.get('#/logout', accountController.logout);

        this.get('#/newAd', advertsController.getNewAdPage);
        this.post("#/newAd", advertsController.createAdvert);

        this.get("#/viewAds", advertsController.loadAdverts);
        this.post("#/viewAds/filtered", advertsController.loadFilteredAdverts);
        this.get("#/myAds", advertsController.loadMyAdverts);

        this.get("#/editAd/:id", advertsController.loadAdvertEditView);
        this.post("#/editAd/:id", advertsController.editAdvert);

        this.get("#/deleteAd/:id", advertsController.deleteAdvert);

        this.get("#/details/:id", advertsController.loadAdDetails);
        this.post('#/createComment/:id', advertsController.createComment);
        this.get('#/comments/delete/:id', advertsController.deleteComment);

        this.get("#/messages", messagesController.getMessagesPage);

        this.get("#/messages/sent", messagesController.getSentMessages);
        this.get("#/messages/received", messagesController.getRecievedMessages);
        this.get("#/messages/details/:id", messagesController.loadDetailedMessagePage);

        this.get("#/message/:id", messagesController.getComposeMessagePage);
        this.post("#/message/:id", messagesController.sendMessage);

        this.get("#/messages/deleteRecieved/:id", messagesController.deleteRecieved);
        this.get("#/messages/deleteSent/:id", messagesController.deleteSent);

        this.get("#/userProfile/:id", accountController.userProfile);
        this.get("#/editUserProfile/:id", accountController.loadEditUserProfileView);
        this.post("#/editUserProfile/:id", accountController.editUserProfile);

        this.get("#/admin", adminController.getAdminControllerSecretPage);
        this.get("#/admin/home", adminController.getAdminHomePage);

        this.get('#/admin/users', adminController.getManageUsers);
        this.get('#/admin/users/:id', adminController.getSpecificUser);
        this.get('#/admin/users/lock/:id', adminController.lockUser);
        this.get('#/admin/users/unlock/:id', adminController.unlockUser);
        this.get('#/admin/users/makeAdmin/:id', adminController.makeAdmin);
        this.get('#/admin/users/removeAdmin/:id', adminController.removeAdmin);

        this.get('#/admin/ads', adminController.getManageAds);
        this.get('#/admin/ads/:id', adminController.getManageSpecificAd);
        this.get('#/admin/ads/delete/:id', adminController.deleteAd);
    });

    app.run();
});