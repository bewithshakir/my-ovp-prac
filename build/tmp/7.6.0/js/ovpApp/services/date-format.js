'use strict';

(function () {
    'use strict';

    dateFormat.$inject = ["moment"];
    angular.module('ovpApp.services.dateFormat', ['angularMoment']).factory('dateFormat', dateFormat);

    // Based on date formatting rules from the UX team. See end of this file for the
    //   details of those rules, as taken from http://ux.twcable.com/design/dates/
    //
    // Usage:
    //
    //   dateFormat.absolute(new Date()) // prints as absolute date
    //   dateFormat.absolute.standard(new Date()) // same result as previous example
    //   dateFormat.absolute.short(new Date()) // shorter absolute date
    //   dateFormat.absolute.expanded(new Date()) // longer absolute date
    //
    //   dateFormat.relative(new Date()) // prints the date relative to now
    //   dateFormat.relative.standard(new Date()) // same as previous example
    //   dateFormat.relative.short(new Date()) // shorter relative date
    //
    //   All of the absolute and relative dates have variants that append "at [time]". eg:
    //      dateFormat.absolute.atTime(new Date())
    //      dateFormat.absolute.short.atTime(newDate())
    //      dateFormat.relative.atTime(new Date())
    //      dateFormat.relative.short.atTime(new Date())
    //
    //  dateFormat.runTime(numSeconds)
    //  dateFormat.runTime.standard(numSeconds) // same as previous example
    //  dateFormat.runTime.short(numSeconds) // shorter runtime

    /* @ngInject */
    function dateFormat(moment) {
        var service = {
            relative: relative,
            absolute: absolute,
            timeOfDay: timeOfDay,
            runtime: runtime,
            elapsedAndDuration: elapsedAndDuration,
            hhmm: hhmm,
            hhmmss: hhmmss,
            remaining: remaining
        };

        createVariants(service.relative, ['standard', 'short', 'expanded', 'tiny'], true);
        createVariants(service.absolute, ['standard', 'short', 'expanded', 'tiny'], true);
        createVariants(service.runtime, ['standard', 'short']);

        return service;

        ////////////////

        function createVariants(mainFunction, variants, doAtTimeSuffix) {
            if (doAtTimeSuffix) {
                mainFunction.atTime = function (date) {
                    return mainFunction(date) + atTime(date);
                };
            }
            variants.forEach(function (variant) {
                mainFunction[variant] = function (date) {
                    return mainFunction(date, variant);
                };
                if (doAtTimeSuffix) {
                    mainFunction[variant].atTime = function (date) {
                        return mainFunction[variant](date) + atTime(date);
                    };
                }
            });
        }

        function atTime(date) {
            var dateMoment = moment(date);
            return dateMoment.isValid() ? ' at ' + timeOfDay(date) : '';
        }

        function relative(date) {
            var variant = arguments.length <= 1 || arguments[1] === undefined ? 'standard' : arguments[1];

            var now = moment();
            var then = moment(date);
            if (now.clone().subtract(1, 'day').isSame(then, 'day')) {
                return 'Yesterday';
            } else if (now.isSame(then, 'day')) {
                if (variant == 'tiny') {
                    return 'Today';
                } else {
                    if (then - now > 0) {
                        return 'Later today';
                    } else {
                        return 'Earlier today';
                    }
                }
            } else if (now.clone().add(1, 'day').isSame(then, 'day')) {
                return 'Tomorrow';
            } else {
                return absolute(date, variant);
            }
        }

        function absolute(date) {
            var variant = arguments.length <= 1 || arguments[1] === undefined ? 'standard' : arguments[1];

            if (variant == 'short') {
                return absoluteShort(date);
            } else if (variant == 'expanded') {
                return absoluteExpanded(date);
            } else if (variant == 'tiny') {
                return absoluteTiny(date);
            } else {
                return absoluteStandard(date);
            }
        }

        function absoluteStandard(date) {
            var now = moment();
            var then = moment(date);
            if (then.isBefore(now.subtract(1, 'year'))) {
                return then.format('M/DD/YY');
            } else {
                return then.format('MMM D, YYYY');
            }
        }

        function absoluteShort(date) {
            var now = moment();
            var then = moment(date);
            if (then.isBefore(now.subtract(1, 'year'))) {
                return then.format('M/DD/YY');
            } else {
                return then.format('ddd M/DD');
            }
        }

        function absoluteTiny(date) {
            var now = moment();
            var then = moment(date);
            if (then.isBefore(now.subtract(1, 'year'))) {
                return then.format('M/DD/YY');
            } else {
                return then.format('ddd');
            }
        }

        function absoluteExpanded(date) {
            var now = moment();
            var then = moment(date);
            if (then.isBefore(now.subtract(1, 'year'))) {
                return then.format('M/D/YY');
            } else {
                return then.format('dddd, MMM Do');
            }
        }

        function timeOfDay(date) {
            return moment(date).format('h:mm a');
        }

        function runtime(seconds) {
            var variant = arguments.length <= 1 || arguments[1] === undefined ? 'standard' : arguments[1];

            seconds = Math.max(1, Math.round(seconds / 60)) * 60;
            var val = '';
            var duration = moment.duration(seconds, 'seconds');
            var hours = duration.hours();
            if (hours > 0) {
                val += hours + ' hour' + (hours != 1 ? 's ' : ' ');
            }
            var minutes = duration.minutes();
            var minuteString = '' + minutes;
            minuteString = minutes.length == 1 ? '0' + minuteString : minuteString;
            if (minutes > 0 || hours === 0) {
                val += minuteString + ' minute' + (minutes != 1 ? 's' : '');
            }

            if (variant == 'short') {
                var re = /minutes?/gi;
                val = val.replace(re, 'min');
                re = /hours?/gi;
                val = val.replace(re, 'hr');
            }

            return val;
        }

        function elapsedAndDuration(elapsedSec, durationSec) {
            return eadFormat(elapsedSec) + ' / ' + eadFormat(durationSec);
        }

        function hhmm(seconds) {
            return '' + eadFormat(seconds);
        }

        function hhmmss(seconds) {
            var minutes = Math.floor(seconds / 60);
            var hours = Math.floor(minutes / 60);
            seconds = Math.round(seconds % 60);

            minutes %= 60;
            if (minutes < 10) {
                minutes = '0' + minutes;
            }
            if (seconds < 10) {
                seconds = '0' + seconds;
            }
            return hours + ':' + minutes + ':' + seconds;
        }

        function eadFormat(seconds) {
            var minutes = Math.floor(seconds / 60);
            var hours = Math.floor(minutes / 60);

            minutes %= 60;
            if (minutes < 10) {
                minutes = '0' + minutes;
            }
            return hours + ':' + minutes;
        }

        function remaining() {
            return 'not implemented';
        }
    }

    // Date formatting rules from the UX team
    //
    // source: http://ux.twcable.com/design/dates/ (as of september 24, 2015)
    //
    // **Relative dates**
    // ------------------
    //
    // Use relative dates when a general understanding of sequence is sufficient to communicate meaning. Use absolute
    // date when precision is needed, for example in logging or supporting an exact understanding of an event sequence.
    //
    // **Past events**
    // Time of event                     Displayed value
    // --------------------------------------------------------
    // Within the last few seconds       Just now
    // Within the same calendar date     Earlier today *
    // 1 day ago (by date, not hours)    Yesterday
    // > 1 day ago                       Use absolute datestamp, i.e. Wed 8/03
    //
    // **Future events**
    // Time of event                     Displayed value
    // Within the next few seconds       On now
    // In the next 30 minutes            Up next
    // In the same calendar date         Later today *
    // In 1 day (by date, not hours)     Tomorrow
    // In > 1 day                        Use absolute datestamp, i.e. Wed 8/03
    //
    // * If screen real estate is at a premium, you may drop the “Earlier/Later” and just use “Today”.
    //
    //
    // **Absolute dates**
    // ------------------
    //
    // Below are several format alternatives for displaying date and time information at several levels of granularity.
    // These should be used when absolute datestamps are considered necessary, or just make more sense than relative
    // dates.
    //
    // Granularity                                             Value
    // --------------------------------------------------------------------------
    // Standard                                                Aug 3, 2009
    // Short (leading zero in day)                             Wed 8/03
    // Expanded                                                Wednesday, Aug 3rd
    // > 1 calendar year ago (leading zero in day and year)    8/03/09
    //
    // **Date at Time**
    // ----------------
    //
    // If an exact time of day is necessary to provide clarity or differentiation for the customer, use the time of day
    // in conjunction with the Relative or Absolute date formats.
    //
    // - Tomorrow at 5:00 pm
    // - Tomorrow at 3:00 pm
    // - Tomorrow at 1:00 pm
    // - Later today at 2:00 pm
    // - Earlier today at 11:00 am
    // - Yesterday at 1:00 pm
    // - Wednesday, Aug 3rd at 1:00 pm
    // - Wed 8/03 at 1:00 pm
    //
    // **Time formats**
    // ----------------
    //
    // Listed below are example formats for indicating time.
    //
    // **Time of day**
    // 12-hour clock, no leading zeros.
    //
    // - 12:52 pm
    // - 2:05 am
    //
    // **Runtime and recording length**
    // Use plural hours and minutes when necessary.
    //
    // - 1 minute
    // - 59 minutes
    // - 1 hour
    // - 1 hour 1 minute
    // - 1 hour 59 minutes
    // - 2 hours
    //
    // If space is limited, it’s okay to use “hr” and “min” instead, but try to avoid it.
    //
    // - 1 min
    // - 59 min
    // - 1 hr
    // - 1 hr 1 min
    // - 1 hr 59 min
    // - 2 hr
    //
    // **Time elapsed / duration**
    // No leading zeros.
    //
    // - 0:01 / 0:59
    // - 1:59 / 12:05
    //
    // **Time remaining**
    // Use plural forms when necessary.
    //
    // - 13 seconds left
    // - 12 minutes left
    // - 1 hour 36 minutes left
    // - 2 hours 1 minute left
})();
//# sourceMappingURL=../../maps-babel/ovpApp/services/date-format.js.map
