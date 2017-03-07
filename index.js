var Generator = require('generate-js');
var formSerialize = require('form-serialize');

var Form = Generator.generate(function Form(options) {
    var _ = this;

    _.defineProperties(options);
    _.inputListener = _._inputListener();
    _.submitListener = _._submitListener();
    _.reset();
});

Form.definePrototype({
    valid: {
        get: function get() {
            var _ = this;

            for (var name in _.fields) {
                if (_.fields.hasOwnProperty(name)) {
                    if (!_.validation[name] || !_.validation[name].valid) {
                        return false;
                    }
                }
            }

            return true;
        }
    },
    fill: function fill(data) {
        var _ = this;

        for (var name in data) {
            if (data.hasOwnProperty(name)) {
                _.data[name] = data[name];
                _.validate(name);
            }
        }

        if (_.app) {
            _.app.render();
        }
    },

    serialize: function serialize(form) {
        var _ = this;

        _.data = formSerialize(form, {
            hash: true
        });
    },

    validate: function validate(name, callback) {
        var _ = this;
        var valid = true;
        var isAsync = false;

        function mkcb(name) {
            return function cb(validation) {
                if (cb.called) {
                    return console.error('Callback already called.');
                }

                _.validation[name] = validation;

                if (_.app) {
                    _.app.render();
                }

                cb.called = true;

                if (callback) {
                    var done = true;
                    var valid = true;
                    for (name in _.fields) {
                        if (_.fields.hasOwnProperty(name)) {
                            if (!_.validation[name]) {
                                done = false;
                                break;
                            } else if (!_.validation[name].valid) {
                                valid = false;
                            }
                        }
                    }

                    if (done) {
                        callback(valid);
                    }
                }
            };
        }

        var result;

        if (typeof name === 'string') {
            // validate data[name]
            if (_.fields && _.fields[name] && _.fields[name]) {
                field_cb = mkcb(name);

                result = _.fields[name](name, _.data[name], field_cb);

                if (result) {
                    _.validation[name] = result;
                    field_cb.called = true;
                } else {
                    isAsync = true;
                }

                valid = _.validation[name] ? _.validation[name].valid : true;
            }
        } else {
            callback = name;
            for (name in _.fields) {
                if (_.fields.hasOwnProperty(name)) {
                    field_cb = mkcb(name);

                    result = _.fields[name](name, _.data[name], field_cb);

                    if (result) {
                        _.validation[name] = result;
                        field_cb.called = true;
                    } else {
                        isAsync = true;
                    }

                    if (_.validation[name] && !_.validation[name].valid) {
                        valid = false;
                    }
                }
            }
        }

        if (!isAsync && callback) {
            callback(valid);
        }

        return valid;
    },

    submit: function submit(callback) {
        var _ = this;

        _.validate(function (valid) {

            var data = {};

            for (var name in _.validation) {
                if (_.validation.hasOwnProperty(name)) {
                    data[name] = _.validation[name].value;
                }
            }

            if (valid) {
                _.action(data, function (err, res) {
                    if (!err) {
                        _.reset();
                    }

                    if (callback) {
                        callback(err, res);
                    }
                });
            } else {
                if (_.error) {
                    _.error(_.validation);
                }

                if (callback) {
                    callback(_.validation, null);
                }
            }
        });
    },
    _inputListener: function _inputListener() {
        var _ = this;

        return function EVENTS_INPUT(evt) {
            var input = evt.target;

            if (input.form) {
                _.serialize(input.form);

                _.validate(input.name, function (valid) {});
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
                if (!err) {
                    form.reset();
                }
            });

            return false;
        };
    },

    bind: function bind(form) {
        var _ = this;

        console.log(form)

        console.log(form.addEventListener('submit', _.submitListener, false));
        console.log(form.addEventListener('input', _.inputListener, false));
        console.log(form.addEventListener('keydown', _.inputListener, false));
    },

    unbind: function unbind(form) {
        var _ = this;

        form.removeEventListener('submit', _.submitListener, false);
        form.removeEventListener('input', _.inputListener, false);
        form.removeEventListener('keydown', _.inputListener, false);
    },

    reset: function reset() {
        var _ = this;

        _.data = {};
        _.validation = {};
    }
});

module.exports = Form;
