let messagesController =  (() => {
    function getMessagesPage(ctx) {
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
            this.partial('./templates/messages/messages.hbs');
        });
    }

    function getComposeMessagePage(ctx) {
        if(!authenticator.isAuth()){
            ctx.redirect('#/login');

            return;
        }

        let recieverId = ctx.params.id.substring(1);

        ctx.recieverId = recieverId;
        ctx.isLoggedIn = authenticator.isAuth();
        ctx.isAdmin = authenticator.isAdmin();
        ctx.username = sessionStorage.getItem("username");
        ctx.userId = sessionStorage.getItem("userId");
        ctx.loadPartials({
            header: './templates/common/header.hbs',
            footer: './templates/common/footer.hbs'
        }).then(function()  {
            this.partial('./templates/messages/composeMessage.hbs');
        });
    }

    function sendMessage(ctx) {
        if(!authenticator.isAuth()){
            ctx.redirect('#/login');

            return;
        }

        let recieverId = ctx.params.id.substring(1);

        let message = {
            topic: ctx.params.topic,
            description: ctx.params.description,
            senderId: sessionStorage.getItem("userId"),
            recieverId: recieverId,
            senderName: sessionStorage.getItem("name"),
            senderUsername: sessionStorage.getItem("username"),
            datePosted: Date.now(),
            hasRecieverDeleted: false,
            hasSenderDeleted: false
        };

        ctx.recieverId = recieverId;
        ctx.isLoggedIn = authenticator.isAuth();
        ctx.isAdmin = authenticator.isAdmin();
        ctx.username = sessionStorage.getItem("username");
        ctx.userId = sessionStorage.getItem("userId");

        requester.get("user", recieverId, "kinvey")
            .then(function (userInfo) {
                message.recieverName = userInfo.name;
                message.recieverUsername = userInfo.username;

                requester.post("appdata", "messages", "kinvey", message)
                    .then(createSuccess)
                    .catch(authenticator.handleError);
            }).catch(authenticator.handleError);

        function createSuccess() {
            ctx.redirect("#/messages");
            authenticator.showInfo("Message sent!");
        }
    }

    function getRecievedMessages(ctx) {
        if(!authenticator.isAuth()){
            ctx.redirect('#/login');

            return;
        }

        ctx.isLoggedIn = authenticator.isAuth();
        ctx.isAdmin = authenticator.isAdmin();
        ctx.username = sessionStorage.getItem("username");
        ctx.userId = sessionStorage.getItem("userId");
        ctx.showingRecieved = true;

        loadSentOrRecievedMessages(ctx, "reciever");
    }

    function getSentMessages(ctx) {
        if(!authenticator.isAuth()){
            ctx.redirect('#/login');

            return;
        }

        ctx.isLoggedIn = authenticator.isAuth();
        ctx.isAdmin = authenticator.isAdmin();
        ctx.username = sessionStorage.getItem("username");
        ctx.userId = sessionStorage.getItem("userId");

        loadSentOrRecievedMessages(ctx, "sender");
    }

    function loadSentOrRecievedMessages(ctx, type) {
        let typeId = type + "Id";
        let isDeleteType = 'has' + type.charAt(0).toUpperCase() + type.slice(1) + 'Deleted';
        let endPoint = `messages?query={"${typeId}":"${sessionStorage.getItem("userId")}", "${isDeleteType}":"false"}&sort=datePosted`;
        requester.get("appdata", endPoint, "kinvey")
            .then(loadSuccess)
            .catch(authenticator.handleError);

        function loadSuccess(data) {
            ctx.messageHasPartial = true;
            if(type === 'sender'){
                type = 'reciever';
            } else {
                type = 'sender'
            }

            data.forEach(msg => {
                if(type === 'sender'){
                    msg.showingRecieved = true;
                }
                msg.combinedName = msg[type + 'Username'] + `(${msg[type + 'Name']})`;
                msg.datePosted = new Date(Number(msg.datePosted)).toDateString();
            });

            ctx.messages = data;

            ctx.loadPartials({
                    header: './templates/common/header.hbs',
                    footer: './templates/common/footer.hbs',
                    messagesTable: './templates/messages/messagesTable.hbs',
                    shortRowMessage: "./templates/messages/shortRowMessage.hbs"
                }).then(function () {
                this.partial("./templates/messages/messages.hbs");
            });
        }
    }

    function loadDetailedMessagePage(ctx) {
        if(!authenticator.isAuth()){
            ctx.redirect('#/login');

            return;
        }

        ctx.isLoggedIn = authenticator.isAuth();
        ctx.isAdmin = authenticator.isAdmin();
        ctx.username = sessionStorage.getItem("username");
        ctx.userId = sessionStorage.getItem("userId");

        let msgId = ctx.params.id.substring(1);

        requester.get('appdata', "messages/" + msgId, 'kinvey')
            .then(loadSuccess).catch(authenticator.handleError);

        function loadSuccess(msgData) {
            ctx.date = new Date(Number(msgData.datePosted)).toDateString();
            ctx.topic = msgData.topic;
            ctx.description = msgData.description;
            ctx.senderName = msgData.senderName;
            ctx.recieverName = msgData.recieverName;
            ctx.senderId = msgData.senderId;
            ctx.recieverId = msgData.recieverId;
            let remessageId = '';
            if(msgData.senderId === sessionStorage.getItem('userId')){
                remessageId = msgData.recieverId;
            } else {
                remessageId = msgData.senderId;
            }

            ctx.remessageId = remessageId;

            ctx.loadPartials({
                header: './templates/common/header.hbs',
                footer: './templates/common/footer.hbs'
            }).then(function () {
                this.partial("./templates/messages/detailedMessage.hbs");
            });
        }
    }

    function deleteSent(ctx) {
        if(!authenticator.isAuth()){
            ctx.redirect('#/login');

            return;
        }

        let msgId = ctx.params.id.substring(1);

        ctx.recieverId = msgId;
        ctx.isLoggedIn = authenticator.isAuth();
        ctx.isAdmin = authenticator.isAdmin();
        ctx.username = sessionStorage.getItem("username");
        ctx.userId = sessionStorage.getItem("userId");

        requester.get('appdata', 'messages/' + msgId, 'kinvey')
            .then(function (msgData) {
                msgData.hasSenderDeleted = true;
                requester.update('appdata', 'messages/' + msgId, 'kinvey', msgData)
                    .then(function () {
                        authenticator.showInfo("Message successfully removed!");
                        ctx.redirect('#/messages/sent');
                    })
            })
            .catch(authenticator.handleError);
    }

    function deleteRecieved(ctx) {
        if(!authenticator.isAuth()){
            ctx.redirect('#/login');

            return;
        }

        let msgId = ctx.params.id.substring(1);

        ctx.recieverId = msgId;
        ctx.isLoggedIn = authenticator.isAuth();
        ctx.isAdmin = authenticator.isAdmin();
        ctx.username = sessionStorage.getItem("username");
        ctx.userId = sessionStorage.getItem("userId");

        requester.get('appdata', 'messages/' + msgId, 'kinvey')
            .then(function (msgData) {
                msgData.hasRecieverDeleted = true;
                requester.update('appdata', 'messages/' + msgId, 'kinvey', msgData)
                    .then(function () {
                        authenticator.showInfo("Message successfully removed!");
                        ctx.redirect('#/messages/recived');
                    })
            })
            .catch(authenticator.handleError);
    }

    return {
        getMessagesPage,
        getComposeMessagePage,
        sendMessage, getSentMessages,
        getRecievedMessages,
        loadDetailedMessagePage,
        deleteRecieved,
        deleteSent
    }
})();