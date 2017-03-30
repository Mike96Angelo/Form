var Generator = require('generate-js');
var Validation = require('./Validation');
var formSerialize = require('form-serialize');
var EventEmitter = require('events')
    .EventEmitter;

var Form = Generator.generateFrom(
    EventEmitter,
    function Form(options) {
        var _ = this;
        EventEmitter.call(_);

        _.defineProperties(options);
        _.inputListener = _._inputListener();
        _.submitListener = _._submitListener();
        _.submitted = 'not-sent';
        _.formElement = null;
        _.reset();
    }
);

Form.definePrototype({
    valid: {
        get: function get() {
            var _ = this;

            var valid = true;

            for (var key in _.fields) {
                if (_.fields.hasOwnProperty(key)) {
                    var validFeild = _.validations[key] ?
                        _.validations[key].valid :
                        null;
                    if (validFeild === false) {
                        valid = false;
                    } else if (valid && validFeild === null) {
                        valid = null;
                    }
                }
            }

            return valid;
        }
    },
    _applyValidation: function _applyValidation(validation, selfCalling) {
        var _ = this;

        _.submitted = 'not-sent';

        var key = validation.key;

        if (_.validations[key] === validation) {
            if (validation.inputValue !== void(0)) {
                _.inputs[key] = validation.inputValue;
            }

            if (validation.value !== void(0)) {
                _.outputs[key] = validation.value;
            } else {
                _.outputs[key] = _.inputs[key];
            }

            if (!selfCalling) {
                _.emit('validation', [validation]);
            }
        } else {
            validation.destroy();
        }
    },
    _validate: function _validate(key, selfCalling) {
        var _ = this;

        if (!_.fields[key]) return;

        if (_.validations[key]) {
            _.validations[key].destroy();
            _.validations[key] = null;
        }

        var validation = new Validation(_, key, _.inputs[key]);

        _.validations[key] = validation;

        _.fields[key](validation);

        _._applyValidation(validation, selfCalling);

        return validation.valid;
    },
    validate: function validate(key) {
        var _ = this;

        var valid = true;

        if (key) {
            valid = _._validate(key);
        } else {
            for (key in _.fields) {
                if (_.fields.hasOwnProperty(key)) {
                    var validFeild = _._validate(key, true);
                    if (valid !== false && validFeild === false) {
                        valid = false;
                    } else if (valid && validFeild === null) {
                        valid = null;
                    }
                }
                _.emit('validation', _.validations);
            }
        }

        return valid;
    },
    fill: function fill(data) {
        var _ = this;

        var validations = [];

        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                if (_.fields[key]) {
                    _.inputs[key] = data[key];
                    _._validate(key, true);

                    validations.push(_.validations[key]);
                }
            }
        }

        _.emit('validation', validations);

        return _;
    },

    serialize: function serialize(form) {
        var _ = this;

        _.inputs = formSerialize(form, {
            hash: true
        });

        _.validate();

        return _;
    },

    submit: function submit(callback) {
        var _ = this;

        if (_.formElement) {
            _.serialize(_.formElement);
        }

        var valid = _.valid;

        if (valid) {
            _.submitted = 'sent';
            _.action(JSON.parse(JSON.stringify(_.outputs)), function (err, res) {
                _.submitted = 'succeeded';

                if (err) {
                    _.submitted = 'failed';
                }

                callback(err, res);
            });
        } else {
            _.submitted = 'failed';
            callback(_.validations, null);
        }

        return valid;
    },

    reset: function reset() {
        var _ = this;

        _.inputs = {};
        _.outputs = {};
        _.validations = {};

        if (_.formElement) {
            _.formElement.reset();
        }
    },


    _inputListener: function _inputListener() {
        var _ = this;

        return function EVENTS_INPUT(evt) {
            var input = evt.target;

            if (input.form) {
                _.serialize(input.form);
            }
        };
    },

    _submitListener: function _submitListener() {
        var _ = this;

        return function EVENTS_SUBMIT(evt) {
            evt.preventDefault();

            var form = evt.target;

            _.serialize(form);

            _.submit(function (err) {
                if (err) {
                    if (_.error) {
                        _.error(err);
                    }
                } else {
                    form.reset();
                }
            });

            return false;
        };
    },

    bind: function bind(form) {
        var _ = this;

        _.unbind(_.formElement);

        _.formElement = form;

        form.addEventListener('submit', _.submitListener, false);
        form.addEventListener('input', _.inputListener, false);
        form.addEventListener('keydown', _.inputListener, false);
    },

    unbind: function unbind(form) {
        var _ = this;

        if (_.formElement === null || form !== _.formElement) return;

        _.formElement = null;

        form.removeEventListener('submit', _.submitListener, false);
        form.removeEventListener('input', _.inputListener, false);
        form.removeEventListener('keydown', _.inputListener, false);
    },
});

module.exports = Form;
