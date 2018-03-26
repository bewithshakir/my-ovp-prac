(function () {
    'use strict';
    // define(function (require, exports) {
    angular.module('ovpApp.legacy.DateUtil', [])
        .factory('dateUtil', LegacyDateUtil)
        .constant('DATE_EXTENTION', ['st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th',
            'th', 'th', 'th', 'th', 'th', 'th', 'th', 'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'st'])
        .constant('DAY_NAMES', ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'])
        .constant('MONTH_NAMES', ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
            'September', 'October', 'November', 'December']);

    /**
     * Returns a formatted date string according to the provided pattern
     *
     * @param {Date} date The date
     * @param {String} format The format string. The following table describes
     * valid patterns:
     * <table>
     * <tr><th align='left'> Pattern </th><th align='left'> Description </th></tr>
     * <tr><td valign='top'> y </td><td> Year. Accepts two- or four-digit years, as in the following examples:
     *                      <ul><li> yy = 08 </li>
     *                          <li> yyyy = 2008 </li>
     *                      </ul>
     *                      </td></tr>
     * <tr><td valign='top'> m </td><td> Month in year. Examples:
     *                  <ul><li> m = 1 </li>
     *                      <li> mm = 01 </li>
     *                      <li> mmm = Jan </li>
     *                      <li> mmmm = January </li></ul>
     *                      </td></tr>
     * <tr><td valign='top'> e </td><td> Day in week. Examples:
     *                  <ul><li> e = 2 </li>
     *                      <li> ee = 02 </li>
     *                      <li> eee = Tue </li>
     *                      <li> eeee = Tuesday </li>
     *                      </ul> </td></tr>
     * <tr><td valign='top'> d </td><td> Day in month. Either one or two digits. </td></tr>
     * <tr><td valign='top'> j </td><td> Hour in day (0-23). Either one or two digits. </td></tr>
     * <tr><td valign='top'> h </td><td> Hour in day (1-12). Either one or two digits. </td></tr>
     * <tr><td valign='top'> n </td><td> Minutes in hour (one or two digits). </td></tr>
     * <tr><td valign='top'> s </td><td> Seconds in minute (one or two digits). </td></tr>
     * <tr><td valign='top'> a </td><td> AM or PM </td></tr>
     * </table>
     *
     * @return {String}
     */
    function LegacyDateUtil(DATE_EXTENTION, MONTH_NAMES, DAY_NAMES) {
        var service = {};
        service.formatDate = function (date, format) {

            return format.replace(
                /(yyyy|yy|mmmm|mmm|mm|m|eeee|eee|ee|e|dd|d|x|tttt|ttt|jj|j|hh|h|nn|n|ss|s|_|a)/gi,
            function ($1) {
                var h; // used below
                switch ($1.toLowerCase()) {
                    case 'yyyy':
                        return date.getFullYear();
                    case 'yy':
                        return date.getFullYear().toString().substring(2);
                    case 'mmmm':
                        return MONTH_NAMES[date.getMonth()];
                    case 'mmm':
                        return MONTH_NAMES[date.getMonth()].substr(0, 3);
                    case 'mm':
                        return toPaddedString(date.getMonth() + 1, 2);
                    case 'm':
                        return date.getMonth() + 1;
                    case 'eeee':
                        return DAY_NAMES[date.getDay()];
                    case 'eee':
                        return DAY_NAMES[date.getDay()].substr(0, 3);
                    case 'ee':
                        return toPaddedString(date.getDay(), 2);
                    case 'e':
                        return date.getDay();
                    case 'dd':
                        return toPaddedString(date.getDate(), 2);
                    case 'd':
                        return date.getDate();
                    case 'x':
                        return DATE_EXTENTION[ date.getDate() - 1 ];
                    case 'jj':
                        return toPaddedString(date.getHours(), 2);
                    case 'j':
                        return date.getHours();
                    case 'hh':
                        return toPaddedString(((h = date.getHours() % 12) ? h : 12), 2);
                    case 'h':
                        return ((h = date.getHours() % 12) ? h : 12);
                    case 'nn':
                        return toPaddedString(date.getMinutes(), 2);
                    case 'n':
                        return date.getMinutes();
                    case 'ss':
                        return toPaddedString(date.getSeconds(), 2);
                    case 's':
                        return date.getSeconds();
                    case '_':
                        return ' ';
                    case 'a':
                        return date.getHours() < 12 ? 'am' : 'pm';
                }
            });
        };

        /**
         * Determines if the date given is equal to today's date
         *
         * @param {Date} date
         * @return {Boolean}
         */
        service.isToday = function (referenceDate, itemDate) {
            var eodToday = referenceDate;
            eodToday.setHours(23, 59, 59, 999);

            let timeDiff = eodToday.getTime() - itemDate.getTime();
            let msInDay = 24 * 60 * 60 * 1000;

            return timeDiff > 0 && timeDiff < msInDay;
        };

        /**
         * Determines if the date given is tomorrow's date
         *
         * @param {Date} date
         * @return {Boolean}
         */
        service.isTomorrow = function (referenceDate, itemDate) {
            var eodToday = new Date(referenceDate.getTime());
            eodToday.setHours(23, 59, 59, 999);

            let eodTomorrow = new Date(referenceDate.getTime());
            let msInDay = 24 * 60 * 60 * 1000;
            eodTomorrow.setTime(eodTomorrow.getTime() + msInDay);
            eodTomorrow.setHours(23, 59, 59, 999);

            return itemDate.getTime() > eodToday.getTime() &&
                itemDate.getTime() <= eodTomorrow.getTime();
        };

        /**
         * Determines if the date given is yesterday's date
         *
         * @param {Date} date
         * @return {Boolean}
         */
        service.isYesterday = function (referenceDate, itemDate) {
            var today = new Date(referenceDate.getTime());
            today.setHours(0, 0, 0, 0);

            let bodYesterday = new Date(referenceDate.getTime());
            bodYesterday.setHours(0, 0, 0, 0);
            bodYesterday.setDate(bodYesterday.getDate() - 1);

            return itemDate.getTime() > bodYesterday.getTime() &&
                itemDate.getTime() <= today;
        };

        /**
         * @param {Date} date
         * @return {Date}
         */
        service.copy = function (date) {
            return new Date(date.getFullYear(), date.getMonth(), date.getDate(),
                date.getHours(), date.getMinutes(), date.getSeconds(),
                date.getMilliseconds());
        };

        /**
         * Returns a new Date with the added days
         *
         * @param {Date} date
         * @param {Number} days
         * @return {Date}
         */
        service.addDays = function (date, days) {
            return this.addHours(date, days * 24);
        };

        /**
         * Returns a new Date with the added hours
         *
         * @param {Date} date
         * @param {Number} hours
         * @return {Date}
         */
        service.addHours = function (date, hours) {
            return this.addMinutes(date, hours * 60);
        };

        /**
         * Returns a new Date with the added minutes
         *
         * @param {Date} date
         * @param {Number} minutes
         * @return {Date}
         */
        service.addMinutes = function (date, minutes) {
            return this.addSeconds(date, minutes * 60);
        };

        /**
         * Returns a new Date with the added seconds
         *
         * @param {Date} date
         * @param {Number} seconds
         * @return {Date}
         */
        service.addSeconds = function (date, seconds) {
            return this.addMilliseconds(date, seconds * 1000);
        };

        /**
         * Returns a new Date with the added milliseconds
         *
         * @param {Date} date
         * @param {Number} ms
         * @return {Date}
         */
        service.addMilliseconds = function (date, ms) {
            return new Date(date.getTime() + ms);
        };

        /**
         * Rounds the minutes, seconds, and milliseconds <em>down</em> to the nearest
         * half hour.
         * @param {Date} date
         * @return {Date}
         */
        service.roundHalfHour = function (date) {
            if (date.getMinutes() >= 30) {
                return new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), 30);
            } else {
                return new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours());
            }
        };

        /**
         * Rounds the minutes, seconds, and milliseconds <em>down</em> to the nearest
         * hour.
         * @param {Date} date
         * @return {Date}
         */
        service.roundHour = function (date) {
            return new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours());
        };

        /**
         * Parses a date and time string in YYYYMMDD or YYYYMMDDHHMM format.
         *
         * @param {String} dateTimeStr
         * @return {Date}
         */
        service.parseDateTime = function (dateTimeStr) {
            var year = parseInt(dateTimeStr.substr(0, 4), 10);
            var month  = parseInt(dateTimeStr.substr(4, 2), 10);
            var day = parseInt(dateTimeStr.substr(6, 2), 10);
            var hours;
            var minutes;
            if (dateTimeStr.length > 8) {
                hours = parseInt(dateTimeStr.substr(8, 2), 10);
                minutes = parseInt(dateTimeStr.substr(10, 2), 10);
            } else {
                hours = 0;
                minutes = 0;
            }
            if (isNaN(year) || isNaN(month) || isNaN(day) || isNaN(hours) || isNaN(minutes)) {
                throw new Error('Invalid date format: ' + dateTimeStr);
            }
            return new Date(year, month - 1, day, hours, minutes);
        };

        /**
         * Parses a date and time string in DAY MM/DD, HH:MM[am/pm] (12 hour) format.
         * Will dynamically figure out the year based on today's date.
         *
         * @param {String} dateTimeStr
         * @return {Date}
         */
        service.parseDateTimeFeedLiteral = function (dateTimeStr) {
            var today = new Date();
            var parsedSpace = dateTimeStr.split(' ');
            var month = parseInt(parsedSpace[1].split('/')[0], 10);
            var day = parseInt(parsedSpace[1].split('/')[1], 10);
            var time = parsedSpace[2].split(':');
            var hours = parseInt(time[0], 10) + (time[1].toLowerCase().indexOf('pm') > -1 ? 12 : 0);
            var minutes = parseInt(time[1], 10);
            var year = month < today.getMonth() + 1 ? today.getFullYear() + 1 : today.getFullYear();
            if (isNaN(year) || isNaN(month) || isNaN(day) || isNaN(hours) || isNaN(minutes)) {
                throw new Error('Invalid date format: ' + dateTimeStr);
            }
            return new Date(year, month - 1, day, hours, minutes);
        };

        /**
         * Calculates the difference in time from date1 to date2.
         *
         * Example:
          <pre>
            dateDiff(new Date(2010,3,1), new Date(2010,4,1), 'd') --> 31
            dateDiff(new Date(2010,3,1), new Date(2010,2,1), 'd') --> -28
          </pre>
         * @param {Date} date1
         * @param {Date} date2
         * @param {String} datePart (Optional) A character indicating which increment the difference
         * is calculated in. The result will be rounded down to whole units. If omitted, the
         * result is in MS. The supported date parts are:
         * <dl>
         * 		<dt>d</dt><dd>Days</dd>
         * 		<dt>h</dt><dd>Hours</dd>
         * 		<dt>n</dt><dd>Minutes</dd>
         * 		<dt>s</dt><dd>Minutes</dd>
         * 		<dt>default</dt><dd>Milliseconds</dd>
         * </dl>
         */
        service.dateDiff = function (date1, date2, datePart) {
            var msDiff = date2.getTime() - date1.getTime();
            switch (datePart){
                case 'd':
                    return Math.round(msDiff / 1000 / 60 / 60 / 24);
                case 'h':
                    return Math.round(msDiff / 1000 / 60 / 60);
                case 'n':
                    return Math.round(msDiff / 1000 / 60);
                case 's':
                    return Math.round(msDiff / 1000);
                default:
                    return msDiff;
            }
        };

        service.getTimeFromGmt = function (gmTime, gmtOffset) {
            if (!gmTime || typeof gmtOffset !== 'number' || isNaN(gmTime) || isNaN(gmtOffset)) {
                return;
            }

            // this is the timezone that the date from the server was returned as
            let serverOffsetSeconds = gmtOffset * 60 * 60;

            // this is the local timezone on the user's machine
            let localOffsetSeconds = new Date().getTimezoneOffset() * 60;

            // add the two together to get the offset for the show
            let offsetSeconds = serverOffsetSeconds + localOffsetSeconds;

            return gmTime + offsetSeconds;
        };

        service.getAirDate = function (gmTime, gmtOffset) {
            var time = this.getTimeFromGmt(gmTime, gmtOffset) * 1000;
            var airDate = new Date(time);

            return airDate;
        };

        service.getFormattedAirDate = function (airTime, gmtOffset) {
            var airDate = this.getAirDate(airTime, gmtOffset);

            return this.formatDate(airDate, 'yyyymmddjjnn');
        };


        function toPaddedString(num, length, radix) {
            var str = num.toString(radix || 10);
            while (str.length < length) {
                str = '0' + str;
            }
            return str;
        }

        return service;
    }

}());
