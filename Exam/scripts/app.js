const templates = {};

(() => {

    loadTemplates();

    function loadTemplates() {
        Promise.all([
            $.get('./templates/catalogPost.hbs'),
            $.get('./templates/detailedPostInfo.hbs')
        ]).then(function ([catalogPostTemplate, detailedPostInfTemplate]) {
            templates.catalogPost = Handlebars.compile(catalogPostTemplate);
            templates.detailedPostInfo = Handlebars.compile(detailedPostInfTemplate);
        });
    }

    $('#loginForm').submit(loginUser);
    $('#registerForm').submit(registerUser);
    $('#profile').find('a').click(logoutUser);
    $('#editPostForm').submit(editPostPost);
    let navItems = $('#menu').find('a');
    $(navItems[0]).click(() => {
        showView('Catalog');
        loadCatalog();
    });

    $(navItems[2]).click(() => {
        showView('MyPosts');
        loadMyPosts();
    });

    $(navItems[1]).click(() => {
        showView('Submit');
    });

    $('#submitForm').submit(createPost);
})();

function editPostPost(ev) {
    ev.preventDefault();
    let form = $('#editPostForm');
    let url = form.find('.edit-url').val();
    let title = form.find('.edit-title').val();
    let imageUrl = form.find('.edit-image').val();
    let description = form.find('.edit-description').val();

    if(!url.trim().startsWith('http') ){
        showError('Url must start with http');

        return;
    }

    if(title.trim() === ''){
        showError('Title cannot be emtpy');

        return;
    }

    let postId = form.find('#editPostId').val();
    let author = sessionStorage.getItem('username');
    kinveyService.editPost(postId, author, title, description, url, imageUrl)
        .then(function (successData) {
            form.find('.edit-url').val('');
            form.find('.edit-title').val('');
            form.find('.edit-image').val('');
            form.find('.edit-description').val('');
            form.find('#editPostId').val('');
            showInfo(`Post ${title} successfully updated`);
            showView('Catalog')
        })
        .catch(handleError);

    loadCatalog();
}

function createPost(ev) {
    ev.preventDefault();
    let inputs = $('#submitForm').find('input');
    let url = $(inputs[0]);
    let title = $(inputs[1]);
    let image = $(inputs[2]);
    let comment = $('#submitForm').find('textarea');
    let username = sessionStorage.getItem('username');

    if(!url.val().trim().startsWith('http') ){
        showError('Url must start with http');

        return;
    }

    if(title.val().trim() === ''){
        showError('Title cannot be emtpy');

        return;
    }

    kinveyService.createPost(username, url.val(), title.val(), image.val(), comment.val())
        .then((createdData) => {
            loadCatalog();
            showInfo('Post created.');
            url.val('');
            title.val('');
            image.val('');
            comment.val('');

        }).catch(handleError)

}

if(sessionStorage.getItem('authtoken') === null){
    userLoggedOut();
} else {
    userLoggedIn();
}

function loadMyPosts() {
    let username = sessionStorage.getItem('username');
    kinveyService.loadCurrentUserPosts(username).then((myPosts) => {
        displayMyPosts(myPosts);
    }).catch(handleError)
}


function loadCatalog() {
    kinveyService.loadCatalog()
        .then((catalogData) =>{
            displayCatalog(catalogData);
        }).catch(handleError)

}

function displayMyPosts(catalogData) {
    let catalogContainer = $('#viewMyPosts').find('.posts');
    catalogContainer.empty();

    let counter = 0;
    for (let post of catalogData) {
        counter++;
        post.counter = counter;
        let submittedTime = calcTime(post['_kmd']['ect']);
        post.submittedTime = submittedTime;
        let isOwner = sessionStorage.getItem('username') === post['author'];
        post.isOwner = true;
        catalogContainer.append(templates.catalogPost(post));
        $(`.catalogPost` + counter).find('.commentsLink').click(() => {
            loadComments(post['_id']);
        });

        $(`.catalogPost` + counter).find('.deleteLink').click(() => {
            deletePost(post['_id']);
        });

        $(`.catalogPost` + counter).find('.editLink').click(() => {
            editPost(post['_id']);
        });
    }

    if (counter === 0){
        let noData = $('<p>No posts in database</p>');
        catalogContainer.append(noData);
    }

    showView('MyPosts');
}

function editPost(postId) {
    kinveyService.loadSpecificPost(postId)
        .then(function (postData) {
            let form = $('#editPostForm');
            form.find('.edit-url').val(postData.url);
            form.find('.edit-title').val(postData.title);
            form.find('.edit-image').val(postData.imageUrl);
            form.find('.edit-description').val(postData.description);
            form.find('#editPostId').val(postId);
            showView('Edit');
        })
        .catch(handleError);
}

function displayCatalog(catalogData) {
    let catalogContainer = $('#viewCatalog').find('.posts');
    catalogContainer.empty();

    let counter = 0;
    for (let post of catalogData) {
        counter++;
        post.counter = counter;
        let submittedTime = calcTime(post['_kmd']['ect']);
        post.submittedTime = submittedTime;
        let isOwner = sessionStorage.getItem('username') === post['author'];
        post.isOwner = isOwner;
        catalogContainer.append(templates.catalogPost(post));
        $(`.catalogPost` + counter).find('.commentsLink').click(() => {
            loadComments(post['_id']);
        });

        if(isOwner){
            $(`.catalogPost` + counter).find('.deleteLink').click(() => {
                deletePost(post['_id']);
            });
            $(`.catalogPost` + counter).find('.editLink').click(() => {
                editPost(post['_id']);
            });
        }
    }

    if (counter === 0){
        let noData = $('<p>No posts in database</p>');
        catalogContainer.append(noData);
    }

    showView('Catalog')
}

function loadComments(postId) {
    kinveyService.loadSpecificPost(postId)
        .then((postData) => {
            displayDetailedPost(postData);
        }).catch(handleError)
}

function displayDetailedPost(post) {
    showView('Comments');
    let detailedViewContainer = $('#viewComments');
    let postDiv = $(detailedViewContainer.find('.post')[0]);
    postDiv.empty();

    let postHasDescription = post['description'] !== undefined && post.hasOwnProperty('description') && post['description'] !== "";

    post.postHasDescription = postHasDescription;
    if(!postHasDescription){
        post.description = 'No decription';
    }
    let isOwner = sessionStorage.getItem('username') === post['author'];
    post.isOwner = isOwner;

    postDiv.append(templates.detailedPostInfo(post));

    if(isOwner){
        $($(`#viewComments .post`)[0]).find('.deleteLink').click(() => {
            deletePost(post['_id']);
        });

        $(`#viewComments .post`).find('.editLink').click(() => {
            editPost(post['_id']);
        });
    }

    $('#btnPostComment').click((ev) => {
        ev.preventDefault();
        addNewComment(post['_id']);
    });

    loadCurrentPostComments(post['_id']);

}

function addNewComment(postId) {
    let author = sessionStorage.getItem('username');
    let content = $('#commentContent');
    kinveyService.addComment(author, content.val(), postId)
        .then(function (createdData) {
            kinveyService.loadSpecificPost(createdData.postId)
                .then(function (postData) {
                    showInfo('Comment added successfully!');
                    displayDetailedPost(postData);
                });
        })
        .catch(handleError);
}

function loadCurrentPostComments(postId) {
    kinveyService.loadComments(postId)
        .then((comments) => {
            displayCurrentComments(comments)
        })
        .catch(handleError);
}

function displayCurrentComments(comments) {
    let detailedViewContainer = $('#viewComments');
    let postInfo = $(detailedViewContainer.find('.post')[0]);
    let newCommentDiv = $(detailedViewContainer.find('.post')[1]);
    postInfo.detach();
    newCommentDiv.detach();
    detailedViewContainer.empty();
    detailedViewContainer.append(postInfo);
    detailedViewContainer.append(newCommentDiv);
    for (let comment of comments) {
        let article = $('<article class="post post-content">');
        let paragraph = $(`<p></p>`).text(`${comment['content']}`);
        article.append(paragraph);
        let deleteBtn = $('<a href="#" class="deleteLink">delete</a>');
        deleteBtn.click(() => {
                deleteComment(comment['_id'], comment['postId']);
        });

        let submitted = calcTime(comment['_kmd']['ect']);

        let infoDiv = $(`<div class="info"></div>`).text(`${'submitted ' + submitted + " ago by " + comment['author']} |`);

        if(sessionStorage.getItem('username') === comment['author']){
            infoDiv.append(deleteBtn);
        }

        article.append(infoDiv);

        detailedViewContainer.append(article);
    }

    if(comments.length === 0){
        detailedViewContainer.append($('<p>No comments yet.</p>'))
    }
}

function deleteComment(commentId, postId) {
    kinveyService.deleteComment(commentId)
        .then((deletedInfo) => {
            kinveyService.loadSpecificPost(postId)
                .then(function (postData) {
                    showInfo('Comment deleted.');
                    displayDetailedPost(postData);
                });
        }).catch(handleError);
}

function deletePost(id) {
    kinveyService.deletePost(id)
        .then(() => {
            showInfo('Post deleted');
            loadCatalog();
        }).catch(handleError);
}


function calcTime(dateIsoFormat) {
    let diff = new Date - (new Date(dateIsoFormat));
    diff = Math.floor(diff / 60000);
    if (diff < 1) return 'less than a minute';
    if (diff < 60) return diff + ' minute' + pluralize(diff);
    diff = Math.floor(diff / 60);
    if (diff < 24) return diff + ' hour' + pluralize(diff);
    diff = Math.floor(diff / 24);
    if (diff < 30) return diff + ' day' + pluralize(diff);
    diff = Math.floor(diff / 30);
    if (diff < 12) return diff + ' month' + pluralize(diff);
    diff = Math.floor(diff / 12);
    return diff + ' year' + pluralize(diff);
    function pluralize(value) {
        if (value !== 1) return 's';
        else return '';
    }
}


function userLoggedOut() {
    $('#menu').hide();
    let profile = $('#profile');
    profile.hide();

    showView('Welcome');
}

function userLoggedIn() {
    let username = sessionStorage.getItem('username');
    let profile = $('#profile');
    profile.find('span').text(username);
    profile.show();
    showView('Catalog');
    loadCatalog()
}

function showView(viewName) {
    $('section').hide();
    $('#view' + viewName).show();
}

function loginUser(ev) {
    ev.preventDefault();
    let loginForm = $('#loginForm').find('input');
    let loginUsername = $(loginForm[0]);
    let loginPassword = $(loginForm[1]);

    let usernameVal = loginUsername.val();
    let passVal = loginPassword.val();

    auth.login(usernameVal, passVal)
        .then((userInfo) => {
            saveSession(userInfo);
            loginUsername.val('');
            loginPassword.val('');
            showInfo('Login successful.');
        }).catch(handleError);
}

function registerUser(ev) {
    ev.preventDefault();
    let registerForm = $('#registerForm').find('input');
    let registerUsername = $(registerForm[0]);
    let registerPassword = $(registerForm[1]);
    let registerConfirmPassword = $(registerForm[2]);


    let usernameVal = registerUsername.val();
    let passVal = registerPassword.val();
    let confirmPassVal = registerConfirmPassword.val();
    let usernameRegex = /^[a-zA-Z]{3,}$/g;

    if(!usernameVal.match(usernameRegex)){
        showError('Username must be at least 3 symbols long and can contain only english alphabet letters');

        return;
    }

    let passwordRegex = /^[a-zA-Z0-9]{6,}$/g;

    if(!passVal.match(passwordRegex)){
        showError("Passwords must be at least 6 symbols long and should contain only digits and english alphabet letters");

        return;
    }

    if(!confirmPassVal.match(passwordRegex)){
        showError("Passwords must be at least 6 symbols long and should contain only digits and english alphabet letters");

        return;
    }

    if(passVal !== confirmPassVal){
        showError("Passwords must match");

        return;
    }

    auth.register(usernameVal, passVal)
        .then((userInfo) => {
            saveSession(userInfo);
            registerUsername.val("");
            registerPassword.val("");
            registerConfirmPassword.val("");
            showInfo('User registration successful.');
        }).catch(handleError);
}

function logoutUser() {
    auth.logout()
        .then(() => {
            sessionStorage.clear();
            showInfo('Logout successful.');
            userLoggedOut();
        }).catch(handleError);
}

function saveSession(userInfo) {
    let userAuth = userInfo._kmd.authtoken;
    sessionStorage.setItem('authtoken', userAuth);
    let userId = userInfo._id;
    sessionStorage.setItem('userId', userId);
    let username = userInfo.username;
    sessionStorage.setItem('username', username);
    userLoggedIn();
}

function handleError(reason) {
    showError(reason.responseJSON.description);
}

function showError(message) {
    let errorBox = $('#errorBox');
    errorBox.find('span').text(message);
    errorBox.show();
    setTimeout(() => errorBox.fadeOut(), 3000);
}

function showInfo(message) {
    let infoBox = $('#infoBox');
    infoBox.find('span').text(message);
    infoBox.show();
    setTimeout(() => infoBox.fadeOut(), 3000);
}

$(document).on({
    ajaxStart: () => $("#loadingBox").show(),
    ajaxStop: () => $('#loadingBox').fadeOut()
});