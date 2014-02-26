(function () {

/* jshint node: true, strict: true */
"use strict";

    /**
     * A Javascript-only version of jQuery's extend() API. Useful for cloning objects.
     *
     * @see http://stackoverflow.com/questions/11197247/javascript-equivalent-of-jquerys-extend-method
     */
    exports.extend = function () {
        for (var i = 1; i < arguments.length; i++)
            for (var key in arguments[i])
                if (arguments[i].hasOwnProperty(key))
                    arguments[0][key] = arguments[i][key];
        return arguments[0];
    };

}).call(this);
