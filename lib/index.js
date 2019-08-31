'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _reduxActions = require('redux-actions');

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// handles situation where a logout is dispatched while an authentication is in progress

exports.default = function (app) {
  var _reducer, _handleActions;

  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var debug = (0, _debug2.default)('reducer:authentication');
  debug('instantiate');

  var defaults = {
    isError: 'isError',
    isLoading: 'isLoading', // s/b compatible with feathers-reduxify-service::getServicesStatus
    isSignedIn: 'isSignedIn',
    user: 'user',
    token: 'token',
    PENDING: 'PENDING',
    FULFILLED: 'FULFILLED',
    REJECTED: 'REJECTED',
    isUserAuthorized: function isUserAuthorized() {
      return (/* user */true
      );
    },
    assign: {
      verifyExpires: undefined,
      verifyToken: undefined,
      resetExpires: undefined,
      resetToken: undefined
    }
  };
  var opts = Object.assign({}, defaults, options);

  var reducer = (_reducer = {}, _defineProperty(_reducer, 'SERVICES_AUTHENTICATION_AUTHENTICATE_' + opts.PENDING, function undefined(state, action) {
    var _extends2;

    debug('redux:SERVICES_AUTHENTICATION_AUTHENTICATE_' + opts.PENDING, action);
    return _extends({}, state, (_extends2 = {}, _defineProperty(_extends2, opts.isError, null), _defineProperty(_extends2, opts.isLoading, true), _defineProperty(_extends2, opts.isSignedIn, false), _defineProperty(_extends2, opts.user, null), _defineProperty(_extends2, opts.token, null), _defineProperty(_extends2, 'ignorePendingAuth', false), _extends2));
  }), _defineProperty(_reducer, 'SERVICES_AUTHENTICATION_AUTHENTICATE_' + opts.FULFILLED, function undefined(state, action) {
    var _extends5;

    debug('redux:SERVICES_AUTHENTICATION_AUTHENTICATE_' + opts.FULFILLED, action);
    var user = action.payload.user;

    if (state.ignorePendingAuth) {
      var _extends3;

      // A logout was dispatched between the authentication being started and completed
      app.logout();

      return _extends({}, state, (_extends3 = {}, _defineProperty(_extends3, opts.isError, null), _defineProperty(_extends3, opts.isLoading, false), _defineProperty(_extends3, opts.isSignedIn, false), _defineProperty(_extends3, opts.data, null), _defineProperty(_extends3, opts.token, null), _defineProperty(_extends3, 'ignorePendingAuth', false), _extends3));
    }

    if (!opts.isUserAuthorized(user)) {
      var _extends4;

      // feathers authenticated the user but the app is rejecting
      app.logout();

      return _extends({}, state, (_extends4 = {}, _defineProperty(_extends4, opts.isError, new Error('User is not verified.')), _defineProperty(_extends4, opts.isLoading, false), _defineProperty(_extends4, opts.isSignedIn, false), _defineProperty(_extends4, opts.data, null), _defineProperty(_extends4, opts.token, null), _defineProperty(_extends4, 'ignorePendingAuth', false), _extends4));
    }

    return _extends({}, state, (_extends5 = {}, _defineProperty(_extends5, opts.isError, null), _defineProperty(_extends5, opts.isLoading, false), _defineProperty(_extends5, opts.isSignedIn, true), _defineProperty(_extends5, opts.user, user), _defineProperty(_extends5, opts.token, action.payload[opts.token]), _defineProperty(_extends5, 'ignorePendingAuth', false), _extends5));
  }), _defineProperty(_reducer, 'SERVICES_AUTHENTICATION_AUTHENTICATE_' + opts.REJECTED, function undefined(state, action) {
    var _extends6;

    debug('redux:SERVICES_AUTHENTICATION_AUTHENTICATE_' + opts.REJECTED, action);
    return _extends({}, state, (_extends6 = {}, _defineProperty(_extends6, opts.isError, action.payload), _defineProperty(_extends6, opts.isLoading, false), _defineProperty(_extends6, opts.isSignedIn, false), _defineProperty(_extends6, opts.data, null), _defineProperty(_extends6, opts.token, null), _defineProperty(_extends6, 'ignorePendingAuth', false), _extends6));
  }), _defineProperty(_reducer, 'SERVICES_AUTHENTICATION_LOGOUT', function SERVICES_AUTHENTICATION_LOGOUT(state, action) {
    var _extends7;

    debug('redux:SERVICES_AUTHENTICATION_LOGOUT', action);
    app.logout();

    return _extends({}, state, (_extends7 = {}, _defineProperty(_extends7, opts.isError, null), _defineProperty(_extends7, opts.isLoading, null), _defineProperty(_extends7, opts.isSignedIn, false), _defineProperty(_extends7, opts.user, null), _defineProperty(_extends7, opts.token, null), _defineProperty(_extends7, 'ignorePendingAuth', state.isLoading), _extends7));
  }), _defineProperty(_reducer, 'SERVICES_AUTHENTICATION_USER', function SERVICES_AUTHENTICATION_USER(state, action) {
    var _extends8;

    debug('redux:SERVICES_AUTHENTICATION_USER', action);

    var user = state[opts.user];
    if (user) {
      user = _extends({}, user, action.payload);
    }

    return _extends({}, state, (_extends8 = {}, _defineProperty(_extends8, opts.isError, null), _defineProperty(_extends8, opts.isLoading, null), _defineProperty(_extends8, opts.isSignedIn, false), _defineProperty(_extends8, opts.user, user), _defineProperty(_extends8, 'ignorePendingAuth', false), _extends8));
  }), _reducer);

  // ACTION TYPES

  var AUTHENTICATE = 'SERVICES_AUTHENTICATION_AUTHENTICATE';
  var LOGOUT = 'SERVICES_AUTHENTICATION_LOGOUT';
  var USER = 'SERVICES_AUTHENTICATION_USER';

  return {
    // ACTION CREATORS
    // Note: action.payload in reducer will have the value of .data below
    authenticate: (0, _reduxActions.createAction)(AUTHENTICATE, function (p) {
      return {
        promise: app.authenticate(p),
        data: undefined
      };
    }),
    logout: (0, _reduxActions.createAction)(LOGOUT),
    user: (0, _reduxActions.createAction)(USER),

    // REDUCER
    reducer: (0, _reduxActions.handleActions)(reducer, (_handleActions = {}, _defineProperty(_handleActions, opts.isError, null), _defineProperty(_handleActions, opts.isLoading, false), _defineProperty(_handleActions, opts.isSignedIn, false), _defineProperty(_handleActions, opts.user, null), _defineProperty(_handleActions, 'ignorePendingAuth', false), _handleActions))
  };
};