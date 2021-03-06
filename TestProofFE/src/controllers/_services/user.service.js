import { authHeader } from '../_helpers';
import { useConfig } from "../../config";
import axios from 'axios';

const config = useConfig()
const serverURL = config.serverUrl

export const userService = {
    login,
    forgotPasswordToConfirmEmail,
    forgotPassword,
    logout,
    register,
    emailVerify,
    getAll,
    getById,
    update,
    updateForAdmin,
    updateMfa,
    updatePassword,
    delete: _delete,

    createLinkForSignup,
    getAllLinks,
    sendLink,
    confirmCodeBeforeSignup,

    getLastPurchasesByDate,
};

function login(username, password, confirm) {
    let info = { "username": username, "password": password }
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(info)
    };

    console.log(requestOptions)
    return fetch(`${serverURL}/signin`, requestOptions)
        .then(handleResponse)
        .then(user => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            if (user.status) {
                console.log(user.data)
                localStorage.setItem('userId', user.data.id);
                localStorage.setItem('token', user.token);
            }

            return user;
        });
}

function forgotPasswordToConfirmEmail(email) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
    };

    return fetch(`${serverURL}/forgotPasswordToConfirmEmail`, requestOptions).then(handleResponse);
}

function forgotPassword(user) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    };

    return fetch(`${serverURL}/forgotPassword`, requestOptions).then(handleResponse);;
}

function emailVerify(username, verifyCode, password) {
    const requestOptions = {
        method: 'GET'
    };

    return fetch(`${serverURL}/users/verify?username=${username}&verifyCode=${verifyCode}&password=${password}`, requestOptions).then(handleResponse);
}

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
}

function getAll() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${serverURL}/users`, requestOptions).then(handleResponse);
}

function getAllLinks() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${serverURL}/links`, requestOptions).then(handleResponse);
}

function getById(id) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${serverURL}/getUser/${id}`, requestOptions).then(handleResponse);
}

function sendLink(user) {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user)
    };

    return fetch(`${serverURL}/links/send`, requestOptions).then(handleResponse);
}

function confirmCodeBeforeSignup(code) {
    const requestOptions = {
        method: 'GET'
    };

    return fetch(`${serverURL}/confirmCodeBeforeSignup?code=${code}`, requestOptions).then(handleResponse);
}

function register(user) {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user)
    };

    return fetch(`${serverURL}/signup`, requestOptions).then(handleResponse);
}

function update(user) {
    if (user.avatarFile) {
        const formData = new FormData();
        formData.append('avatar', user.avatarFile)
        return axios.post(`${serverURL}/uploadFile`, formData).then((response) => {
            if (response.data.status) {
                const requestOptions = {
                    method: 'PUT',
                    headers: { ...authHeader(), 'content-type': 'multipart/form-data' },
                    body: JSON.stringify({...user, avatar: response.data.data})
                };
                return fetch(`${serverURL}/updateProfile`, requestOptions).then(handleResponse);
            }
        })
    } else {
    
        const requestOptions = {
            method: 'PUT',
            headers: { ...authHeader(), 'content-type': 'multipart/form-data' },
            body: JSON.stringify(user)
        };
        return fetch(`${serverURL}/updateProfile`, requestOptions).then(handleResponse);
    }
}

function updateForAdmin(user) {
    const requestOptions = {
        method: 'PUT',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    };

    return fetch(`${serverURL}/admin/users/${user.id}`, requestOptions).then(handleResponse);;
}

function updateMfa(user) {
    const requestOptions = {
        method: 'PUT',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    };

    return fetch(`${serverURL}/updateMfa/${user.id}`, requestOptions).then(handleResponse);;
}

function updatePassword(user) {
    const requestOptions = {
        method: 'PUT',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    };

    return fetch(`${serverURL}/users/updatePassword/${user.id}`, requestOptions).then(handleResponse);;
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id) {
    const requestOptions = {
        method: 'DELETE',
        headers: authHeader()
    };

    return fetch(`${serverURL}/getUser/${id}`, requestOptions).then(handleResponse);
}

/*
* LINK Manage
*/
function createLinkForSignup(selectedRole) {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectedRole)
    };

    return fetch(`${serverURL}/link/create`, requestOptions).then(handleResponse);
}

function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if (response.status === 401) {
                // auto logout if 401 response returned from api
                logout();
            }

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }

        return data;
    });
}


/*
* Get last purchases by date
*/
function getLastPurchasesByDate(userId) {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    };

    return fetch(`${serverURL}/lastPurchases/${userId}`, requestOptions).then(handleResponse);
}