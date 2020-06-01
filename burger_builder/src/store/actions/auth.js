import axios from 'axios';

import * as actionTypes from './actionsTypes';

export const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    };
};

export const authSuccess = (token, userId) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        idToken: token,
        userId: userId
    };
};

export const authFail = (error) => {
    return {
        type: actionTypes.AUTH_FAIL,
        error: error
    };
};

export const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("expirationDate");
    localStorage.removeItem("userId");

  return {
      type: actionTypes.AUTH_LOGOUT
  };
};

export const check_auth_timeout = (expirationTime) => {
    return dispatch => {
        setTimeout(() => {
            dispatch(logout());
        }, expirationTime * 1000);
    };
};

export const setAuthRedirectPath = (path) => {
    return {
        type: actionTypes.SET_AUTH_REDIRECT_PATH,
        path: path
    };
};

export const auth = (email, password, isSignup) => {
    return dispatch => {
        dispatch(authStart());
        const authData = {
            email: email,
            password: password,
            returnSecureToken: true
        };
        let url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBrYnKgWeBu-KcTFN6eFCg-FJdEirzY4_E';
        if (!isSignup) {
            url = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyBrYnKgWeBu-KcTFN6eFCg-FJdEirzY4_E';
        }
        axios.post(url, authData)
            .then(response => {
                const expiration_date = new Date(new Date().getTime() + response.data.expiresIn * 1000);
                localStorage.setItem("token", response.data.idToken);
                localStorage.setItem("expirationDate", expiration_date);
                localStorage.setItem("userId", response.data.localId);
                dispatch(authSuccess(response.data.idToken, response.data.localId));
                dispatch(check_auth_timeout(response.data.expiresIn));
            })
            .catch(err => {
                dispatch(authFail(err.response.data.error));
            });
    };
};

export const authCheckState = () => {
    return dispatch => {
        const token = localStorage.getItem("token");
        if (!token) {
            dispatch(logout());
        } else {
            const expirationTime = new Date(localStorage.getItem("expirationDate"));
            if (expirationTime > new Date()) {
                const userId = localStorage.getItem("userId");
                dispatch(authSuccess(token, userId));
                dispatch(check_auth_timeout((expirationTime.getTime() - new Date().getTime())/1000));
            } else {
                dispatch(logout());
            }
        }
    };
};