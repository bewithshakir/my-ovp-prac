/*
 * Provides date.now information by always returning a time that considers the token expired.
 */
define(function () {
    'use strict';

    /*
     * Mock out time so that the token is always expired.
     *
     * @return {Number} Unix time in seconds
     */
    function unixTimeNow(expirationTime) {
        return expirationTime === undefined ? new Date().getTime() : expirationTime + 100000;
    }

    return {
        toString: function () { return 'OAuthTokenExpirationDateFactory'; },
        unixTimeNow: unixTimeNow
    };
});

