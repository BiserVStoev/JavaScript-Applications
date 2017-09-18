let authenticator = (() => {
    function isAuth() {
        return sessionStorage.getItem('authtoken') !== null;
    }

    function isAdmin() {
        return sessionStorage.getItem("isAdmin") === true || sessionStorage.getItem("isAdmin") === 'true';
    }

    // user/login
    function login(username, password) {
        let userData = {
            username,
            password
        };

        return requester.post('user', 'login', 'basic', userData);
    }

    // user/register
    function register(name, username, email, phoneNumber, password) {
        let userData = {
            name,
            username,
            email,
            phoneNumber,
            password,
        };

        return requester.post('user', '', 'basic', userData);
    }

    // user/logout
    function logout() {
        let logoutData = {
            authtoken: sessionStorage.getItem('authtoken')
        };

        return requester.post('user', '_logout', 'kinvey', logoutData);
    }

    // saveSession in sessionStorage
    function saveSession(userInfo) {
        let userAuth = userInfo._kmd.authtoken;
        sessionStorage.setItem('authtoken', userAuth);
        let username = userInfo.username;
        sessionStorage.setItem('username', username);
        let name = userInfo.name;
        sessionStorage.setItem('name', name);
        let userId = userInfo._id;
        sessionStorage.setItem('userId', userId);
        let isAdmin = userInfo.isAdmin;
        sessionStorage.setItem('isAdmin', isAdmin);
    }

    function clearSession() {
        sessionStorage.clear();
    }

    function handleError(reason) {
        showError(reason.responseJSON.description);
    }

    function showInfo(message) {
        let infoBox = $('#infoBox');
        infoBox.text(message);
        infoBox.show();
        setTimeout(() => infoBox.fadeOut(), 3000);
    }

    function showError(message) {
        let errorBox = $('#errorBox');
        errorBox.text(message);
        errorBox.show();
        setTimeout(() => errorBox.fadeOut(), 3000);
    }

    return {
        isAuth,
        isAdmin,
        login,
        register,
        logout,
        saveSession,
        clearSession,
        handleError,
        showInfo,
        showError
    }
})();