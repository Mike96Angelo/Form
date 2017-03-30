var Generator = require('generate-js');

var validation = Generator.generate(function validation(form, key, value) {
    var _ = this;

    _.defineProperties({
        writable: true
    }, {
        form: form
    });

    _.defineProperties({
        key: key
    });

    _.value = value;
});

validation.definePrototype({
    validState: {
        get: function get() {
            var _ = this;

            if (_.valid) return 'valid';
            if (_.valid === null) return 'waiting';
            return 'invalid';
        }
    },
    setValidation: function setValidation(options) {
        var _ = this;

        options = options || {};

        if (options.valid !== void(0)) {
            _.valid = options.valid;
        } else {
            _.valid = true;
        }

        if (options.inputValue !== void(0)) {
            _.inputValue = options.inputValue;
        }

        if (options.value !== void(0)) {
            _.value = options.value;
        }

        if (options.message !== void(0)) {
            _.message = options.message;
        }
    },
    callback: function callback(options, force) {
        var _ = this;

        // if (!_.form) {
        //     console.warn('Cannont call callback on destroyed validation');
        //     return;
        // }

        if (_._called_ && !force) {
            console.warn('Callback has already been called');
            return;
        }

        if (!force) {
            _._called_ = true;
        }

        _.setValidation(options);

        if (_.form) {
            _.form._applyValidation(_);
        }
    },
    destroy: function destroy() {
        var _ = this;

        _.form = null;
    }
});

module.exports = validation;
