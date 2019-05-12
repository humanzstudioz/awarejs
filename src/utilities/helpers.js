module.exports = {

    getObjProp: function(obj, dotNotationStr = '', defaultVal = null) {
        var args = dotNotationStr.split('.');

        for (var i = 0; i < args.length; i++) {
            if (! obj || ! obj.hasOwnProperty(args[i])) {
                return defaultVal;
            }
            obj = obj[args[i]];
        }

        return obj;
    },

}