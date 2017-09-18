let kinveyService  = (() => {

    function loadCatalog() {
        let endpoint = `posts`;

        return requester.get('appdata', endpoint, 'kinvey');
    }

    function deletePost(postId) {
        let endpoint = `posts/${postId}`;

        return requester.remove('appdata', endpoint, 'kinvey');
    }
    
    function loadCurrentUserPosts(username) {
        let endpoint = `posts?query={"author":"${username}"}`;

        return requester.get('appdata', endpoint, 'kinvey');
    }

    function loadSpecificPost(postId) {
        let endpoint = `posts/${postId}`;

        return requester.get('appdata', endpoint, 'kinvey');
    }

    function loadComments(postId) {
        let endpoint = `comments?query={"postId":"${postId}"}`;

        return requester.get('appdata', endpoint, 'kinvey');
    }

    function deleteComment(commentId) {
        let endpoint = `comments/${commentId}`;

        return requester.remove('appdata', endpoint, 'kinvey');
    }

    function createPost(author, url, title, imageUrl, description) {
        let postData = {
            author,
           url,
            title,
            imageUrl,
            description
        };

        return requester.post('appdata', 'posts', 'kinvey', postData);
    }

    function addComment(author, content, postId) {
        let commentData = {
          author,
          content,
          postId
        };

        return requester.post('appdata', 'comments', 'kinvey', commentData);
    }

    function editPost(postId, author, title, description, url, imageUrl) {
        let updatedPostObj = {
            author,
            title,
            description,
            url,
            imageUrl
        };

        console.log(updatedPostObj)

        return requester.update('appdata', `posts/${postId}`, 'kinvey', updatedPostObj)
    }

    return {
        loadCatalog,
        deletePost,
        loadCurrentUserPosts,
        loadSpecificPost,
        loadComments,
        deleteComment,
        createPost,
        addComment,
        editPost
    }
})();