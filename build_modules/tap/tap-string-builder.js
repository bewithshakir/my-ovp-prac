/**
 * Build TAP files based on results
 */

var os = require('os'),
    util = require('util');

module.exports = {

    /**
     * Get the header TAP line
     */
    getHeader: function (length) {
        'use strict';

        return util.format('1..%d%sok %d Test was run%s', length + 1, os.EOL, length, os.EOL);
    },

    /**
     * Get a single result line formatted with line/column info
     */
    getFileLine: function (options) {
        'use strict';

        var isOkString = options.isOk ? 'ok' : 'not ok';

        return util.format(
            '%s %d %s: line %d, col %d, %s',
            isOkString,
            options.index,
            options.file,
            options.line,
            options.column,
            options.message + os.EOL
        );
    },

    /**
     * Get single line result
     */
    getLine: function (options) {
        'use strict';

        var isOkString = options.isOk ? 'ok' : 'not ok';

        return util.format('%s %d %s: %s',
            isOkString,
            options.index,
            options.file,
            options.message + os.EOL
        );
    },


    /**
     * Get the footer TAP line
     */
    getFooter: function (length) {
        'use strict';

        return util.format('#TAP meta information%s%d errors%s', os.EOL, length, os.EOL);
    },

    /**
     * Get text for an entire tap file
     */
    getTap: function (items) {
        'use strict';

        var text = this.getHeader(items.length);

        for (var i = 0; i < items.length; i++) {
            var item = items[i];

            if (item.line && item.column) {
                text += this.getFileLine({
                    isOk: item.isOk,
                    index: i,
                    file: item.file,
                    line: item.line,
                    column: item.column,
                    message: item.message
                });
            } else {
                text += this.getLine({
                    isOk: item.isOk,
                    index: i,
                    file: item.file,
                    message: item.message
                });
            }
        }

        text += this.getFooter(items.length);

        return text;
    }
};
