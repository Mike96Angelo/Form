var Form =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var Generator = __webpack_require__(1);
	var formSerialize = __webpack_require__(2);

	var Form = Generator.generate(function Form(options) {
	    var _ = this;

	    _.defineProperties(options);
	    _.inputListener = _._inputListener();
	    _.sumitListener = _._submitListener();
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
	            console.log('here');
	            alert('here');

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

	        form.addEventListener('submit', _.submitListener, false);
	        form.addEventListener('input', _.inputListener, false);
	        form.addEventListener('keydown', _.inputListener, false);
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


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * @name generate.js
	 * @author Michaelangelo Jong
	 */

	(function GeneratorScope() {
	    /**
	     * Assert Error function.
	     * @param  {Boolean} condition Whether or not to throw error.
	     * @param  {String} message    Error message.
	     */
	    function assertError(condition, message) {
	        if (!condition) {
	            throw new Error(message);
	        }
	    }

	    /**
	     * Assert TypeError function.
	     * @param  {Boolean} condition Whether or not to throw error.
	     * @param  {String} message    Error message.
	     */
	    function assertTypeError(test, type) {
	        if (typeof test !== type) {
	            throw new TypeError('Expected \'' + type +
	                '\' but instead found \'' +
	                typeof test + '\'');
	        }
	    }

	    /**
	     * Returns the name of function 'func'.
	     * @param  {Function} func Any function.
	     * @return {String}        Name of 'func'.
	     */
	    function getFunctionName(func) {
	        if (func.name !== void(0)) {
	            return func.name;
	        }
	        // Else use IE Shim
	        var funcNameMatch = func.toString()
	            .match(/function\s*([^\s]*)\s*\(/);
	        func.name = (funcNameMatch && funcNameMatch[1]) || '';
	        return func.name;
	    }

	    /**
	     * Returns true if 'obj' is an object containing only get and set functions, false otherwise.
	     * @param  {Any} obj Value to be tested.
	     * @return {Boolean} true or false.
	     */
	    function isGetSet(obj) {
	        var keys, length;
	        if (obj && typeof obj === 'object') {
	            keys = Object.getOwnPropertyNames(obj)
	                .sort();
	            length = keys.length;

	            if ((length === 1 && (keys[0] === 'get' && typeof obj.get ===
	                    'function' ||
	                    keys[0] === 'set' && typeof obj.set === 'function'
	                )) ||
	                (length === 2 && (keys[0] === 'get' && typeof obj.get ===
	                    'function' &&
	                    keys[1] === 'set' && typeof obj.set === 'function'
	                ))) {
	                return true;
	            }
	        }
	        return false;
	    }

	    /**
	     * Defines properties on 'obj'.
	     * @param  {Object} obj        An object that 'properties' will be attached to.
	     * @param  {Object} descriptor Optional object descriptor that will be applied to all attaching properties on 'properties'.
	     * @param  {Object} properties An object who's properties will be attached to 'obj'.
	     * @return {Generator}         'obj'.
	     */
	    function defineObjectProperties(obj, descriptor, properties) {
	        var setProperties = {},
	            i,
	            keys,
	            length,

	            p = properties || descriptor,
	            d = properties && descriptor;

	        properties = (p && typeof p === 'object') ? p : {};
	        descriptor = (d && typeof d === 'object') ? d : {};

	        keys = Object.getOwnPropertyNames(properties);
	        length = keys.length;

	        for (i = 0; i < length; i++) {
	            if (isGetSet(properties[keys[i]])) {
	                setProperties[keys[i]] = {
	                    configurable: !!descriptor.configurable,
	                    enumerable: !!descriptor.enumerable,
	                    get: properties[keys[i]].get,
	                    set: properties[keys[i]].set
	                };
	            } else {
	                setProperties[keys[i]] = {
	                    configurable: !!descriptor.configurable,
	                    enumerable: !!descriptor.enumerable,
	                    writable: !!descriptor.writable,
	                    value: properties[keys[i]]
	                };
	            }
	        }
	        Object.defineProperties(obj, setProperties);
	        return obj;
	    }



	    var Creation = {
	        /**
	         * Defines properties on this object.
	         * @param  {Object} descriptor Optional object descriptor that will be applied to all attaching properties.
	         * @param  {Object} properties An object who's properties will be attached to this object.
	         * @return {Object}            This object.
	         */
	        defineProperties: function defineProperties(descriptor,
	            properties) {
	            defineObjectProperties(this, descriptor,
	                properties);
	            return this;
	        },

	        /**
	         * returns the prototype of `this` Creation.
	         * @return {Object} Prototype of `this` Creation.
	         */
	        getProto: function getProto() {
	            return Object.getPrototypeOf(this);
	        },

	        /**
	         * returns the prototype of `this` super Creation.
	         * @return {Object} Prototype of `this` super Creation.
	         */
	        getSuper: function getSuper() {
	            return Object.getPrototypeOf(this.constructor.prototype);
	        }
	    };

	    var Generation = {
	        /**
	         * Returns true if 'generator' was generated by this Generator.
	         * @param  {Generator} generator A Generator.
	         * @return {Boolean}             true or false.
	         */
	        isGeneration: function isGeneration(generator) {
	            assertTypeError(generator, 'function');

	            var _ = this;

	            return _.prototype.isPrototypeOf(generator.prototype);
	        },

	        /**
	         * Returns true if 'object' was created by this Generator.
	         * @param  {Object} object An Object.
	         * @return {Boolean}       true or false.
	         */
	        isCreation: function isCreation(object) {
	            var _ = this;
	            return object instanceof _;
	        },
	        /**
	         * Generates a new generator that inherits from `this` generator.
	         * @param {Generator} ParentGenerator Generator to inherit from.
	         * @param {Function} create           Create method that gets called when creating a new instance of new generator.
	         * @return {Generator}                New Generator that inherits from 'ParentGenerator'.
	         */
	        generate: function generate(construct) {
	            assertTypeError(construct, 'function');

	            var _ = this;

	            defineObjectProperties(
	                construct, {
	                    configurable: false,
	                    enumerable: false,
	                    writable: false
	                }, {
	                    prototype: Object.create(_.prototype)
	                }
	            );

	            defineObjectProperties(
	                construct, {
	                    configurable: false,
	                    enumerable: false,
	                    writable: false
	                },
	                Generation
	            );

	            defineObjectProperties(
	                construct.prototype, {
	                    configurable: false,
	                    enumerable: false,
	                    writable: false
	                }, {
	                    constructor: construct,
	                    generator: construct,
	                }
	            );

	            return construct;
	        },

	        /**
	         * Defines shared properties for all objects created by this generator.
	         * @param  {Object} descriptor Optional object descriptor that will be applied to all attaching properties.
	         * @param  {Object} properties An object who's properties will be attached to this generator's prototype.
	         * @return {Generator}         This generator.
	         */
	        definePrototype: function definePrototype(descriptor,
	            properties) {
	            defineObjectProperties(this.prototype,
	                descriptor,
	                properties);
	            return this;
	        }
	    };

	    function Generator() {}

	    defineObjectProperties(
	        Generator, {
	            configurable: false,
	            enumerable: false,
	            writable: false
	        }, {
	            prototype: Generator.prototype
	        }
	    );

	    defineObjectProperties(
	        Generator.prototype, {
	            configurable: false,
	            enumerable: false,
	            writable: false
	        },
	        Creation
	    );

	    defineObjectProperties(
	        Generator, {
	            configurable: false,
	            enumerable: false,
	            writable: false
	        },
	        Generation
	    );

	    defineObjectProperties(
	        Generator, {
	            configurable: false,
	            enumerable: false,
	            writable: false
	        }, {
	            /**
	             * Returns true if 'generator' was generated by this Generator.
	             * @param  {Generator} generator A Generator.
	             * @return {Boolean}             true or false.
	             */
	            isGenerator: function isGenerator(generator) {
	                return this.isGeneration(generator);
	            },

	            /**
	             * Generates a new generator that inherits from `this` generator.
	             * @param {Generator} extendFrom      Constructor to inherit from.
	             * @param {Function} create           Create method that gets called when creating a new instance of new generator.
	             * @return {Generator}                New Generator that inherits from 'ParentGenerator'.
	             */
	            toGenerator: function toGenerator(extendFrom, create) {
	                console.warn(
	                    'Generator.toGenerator is depreciated please use Generator.generateFrom'
	                );
	                return this.generateFrom(extendFrom, create);
	            },

	            /**
	             * Generates a new generator that inherits from `this` generator.
	             * @param {Constructor} extendFrom    Constructor to inherit from.
	             * @param {Function} create           Create method that gets called when creating a new instance of new generator.
	             * @return {Generator}                New Generator that inherits from 'ParentGenerator'.
	             */
	            generateFrom: function generateFrom(extendFrom, create) {
	                assertTypeError(extendFrom, 'function');
	                assertTypeError(create, 'function');

	                defineObjectProperties(
	                    create, {
	                        configurable: false,
	                        enumerable: false,
	                        writable: false
	                    }, {
	                        prototype: Object.create(extendFrom.prototype),
	                    }
	                );

	                defineObjectProperties(
	                    create, {
	                        configurable: false,
	                        enumerable: false,
	                        writable: false
	                    },
	                    Generation
	                );

	                defineObjectProperties(
	                    create.prototype, {
	                        configurable: false,
	                        enumerable: false,
	                        writable: false
	                    }, {
	                        constructor: create,
	                        generator: create,
	                    }
	                );

	                defineObjectProperties(
	                    create.prototype, {
	                        configurable: false,
	                        enumerable: false,
	                        writable: false
	                    },
	                    Creation
	                );

	                return create;
	            }
	        }
	    );

	    Object.freeze(Generator);
	    Object.freeze(Generator.prototype);

	    // Exports
	    if (true) {
	        // AMD
	        !(__WEBPACK_AMD_DEFINE_RESULT__ = function () {
	            return Generator;
	        }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else if (typeof module === 'object' && typeof exports === 'object') {
	        // Node/CommonJS
	        module.exports = Generator;
	    } else {
	        // Browser global
	        window.Generator = Generator;
	    }

	}());


/***/ },
/* 2 */
/***/ function(module, exports) {

	// get successful control from form and assemble into object
	// http://www.w3.org/TR/html401/interact/forms.html#h-17.13.2

	// types which indicate a submit action and are not successful controls
	// these will be ignored
	var k_r_submitter = /^(?:submit|button|image|reset|file)$/i;

	// node names which could be successful controls
	var k_r_success_contrls = /^(?:input|select|textarea|keygen)/i;

	// Matches bracket notation.
	var brackets = /(\[[^\[\]]*\])/g;

	// serializes form fields
	// @param form MUST be an HTMLForm element
	// @param options is an optional argument to configure the serialization. Default output
	// with no options specified is a url encoded string
	//    - hash: [true | false] Configure the output type. If true, the output will
	//    be a js object.
	//    - serializer: [function] Optional serializer function to override the default one.
	//    The function takes 3 arguments (result, key, value) and should return new result
	//    hash and url encoded str serializers are provided with this module
	//    - disabled: [true | false]. If true serialize disabled fields.
	//    - empty: [true | false]. If true serialize empty fields
	function serialize(form, options) {
	    if (typeof options != 'object') {
	        options = { hash: !!options };
	    }
	    else if (options.hash === undefined) {
	        options.hash = true;
	    }

	    var result = (options.hash) ? {} : '';
	    var serializer = options.serializer || ((options.hash) ? hash_serializer : str_serialize);

	    var elements = form && form.elements ? form.elements : [];

	    //Object store each radio and set if it's empty or not
	    var radio_store = Object.create(null);

	    for (var i=0 ; i<elements.length ; ++i) {
	        var element = elements[i];

	        // ingore disabled fields
	        if ((!options.disabled && element.disabled) || !element.name) {
	            continue;
	        }
	        // ignore anyhting that is not considered a success field
	        if (!k_r_success_contrls.test(element.nodeName) ||
	            k_r_submitter.test(element.type)) {
	            continue;
	        }

	        var key = element.name;
	        var val = element.value;

	        // we can't just use element.value for checkboxes cause some browsers lie to us
	        // they say "on" for value when the box isn't checked
	        if ((element.type === 'checkbox' || element.type === 'radio') && !element.checked) {
	            val = undefined;
	        }

	        // If we want empty elements
	        if (options.empty) {
	            // for checkbox
	            if (element.type === 'checkbox' && !element.checked) {
	                val = '';
	            }

	            // for radio
	            if (element.type === 'radio') {
	                if (!radio_store[element.name] && !element.checked) {
	                    radio_store[element.name] = false;
	                }
	                else if (element.checked) {
	                    radio_store[element.name] = true;
	                }
	            }

	            // if options empty is true, continue only if its radio
	            if (!val && element.type == 'radio') {
	                continue;
	            }
	        }
	        else {
	            // value-less fields are ignored unless options.empty is true
	            if (!val) {
	                continue;
	            }
	        }

	        // multi select boxes
	        if (element.type === 'select-multiple') {
	            val = [];

	            var selectOptions = element.options;
	            var isSelectedOptions = false;
	            for (var j=0 ; j<selectOptions.length ; ++j) {
	                var option = selectOptions[j];
	                var allowedEmpty = options.empty && !option.value;
	                var hasValue = (option.value || allowedEmpty);
	                if (option.selected && hasValue) {
	                    isSelectedOptions = true;

	                    // If using a hash serializer be sure to add the
	                    // correct notation for an array in the multi-select
	                    // context. Here the name attribute on the select element
	                    // might be missing the trailing bracket pair. Both names
	                    // "foo" and "foo[]" should be arrays.
	                    if (options.hash && key.slice(key.length - 2) !== '[]') {
	                        result = serializer(result, key + '[]', option.value);
	                    }
	                    else {
	                        result = serializer(result, key, option.value);
	                    }
	                }
	            }

	            // Serialize if no selected options and options.empty is true
	            if (!isSelectedOptions && options.empty) {
	                result = serializer(result, key, '');
	            }

	            continue;
	        }

	        result = serializer(result, key, val);
	    }

	    // Check for all empty radio buttons and serialize them with key=""
	    if (options.empty) {
	        for (var key in radio_store) {
	            if (!radio_store[key]) {
	                result = serializer(result, key, '');
	            }
	        }
	    }

	    return result;
	}

	function parse_keys(string) {
	    var keys = [];
	    var prefix = /^([^\[\]]*)/;
	    var children = new RegExp(brackets);
	    var match = prefix.exec(string);

	    if (match[1]) {
	        keys.push(match[1]);
	    }

	    while ((match = children.exec(string)) !== null) {
	        keys.push(match[1]);
	    }

	    return keys;
	}

	function hash_assign(result, keys, value) {
	    if (keys.length === 0) {
	        result = value;
	        return result;
	    }

	    var key = keys.shift();
	    var between = key.match(/^\[(.+?)\]$/);

	    if (key === '[]') {
	        result = result || [];

	        if (Array.isArray(result)) {
	            result.push(hash_assign(null, keys, value));
	        }
	        else {
	            // This might be the result of bad name attributes like "[][foo]",
	            // in this case the original `result` object will already be
	            // assigned to an object literal. Rather than coerce the object to
	            // an array, or cause an exception the attribute "_values" is
	            // assigned as an array.
	            result._values = result._values || [];
	            result._values.push(hash_assign(null, keys, value));
	        }

	        return result;
	    }

	    // Key is an attribute name and can be assigned directly.
	    if (!between) {
	        result[key] = hash_assign(result[key], keys, value);
	    }
	    else {
	        var string = between[1];
	        // +var converts the variable into a number
	        // better than parseInt because it doesn't truncate away trailing
	        // letters and actually fails if whole thing is not a number
	        var index = +string;

	        // If the characters between the brackets is not a number it is an
	        // attribute name and can be assigned directly.
	        if (isNaN(index)) {
	            result = result || {};
	            result[string] = hash_assign(result[string], keys, value);
	        }
	        else {
	            result = result || [];
	            result[index] = hash_assign(result[index], keys, value);
	        }
	    }

	    return result;
	}

	// Object/hash encoding serializer.
	function hash_serializer(result, key, value) {
	    var matches = key.match(brackets);

	    // Has brackets? Use the recursive assignment function to walk the keys,
	    // construct any missing objects in the result tree and make the assignment
	    // at the end of the chain.
	    if (matches) {
	        var keys = parse_keys(key);
	        hash_assign(result, keys, value);
	    }
	    else {
	        // Non bracket notation can make assignments directly.
	        var existing = result[key];

	        // If the value has been assigned already (for instance when a radio and
	        // a checkbox have the same name attribute) convert the previous value
	        // into an array before pushing into it.
	        //
	        // NOTE: If this requirement were removed all hash creation and
	        // assignment could go through `hash_assign`.
	        if (existing) {
	            if (!Array.isArray(existing)) {
	                result[key] = [ existing ];
	            }

	            result[key].push(value);
	        }
	        else {
	            result[key] = value;
	        }
	    }

	    return result;
	}

	// urlform encoding serializer
	function str_serialize(result, key, value) {
	    // encode newlines as \r\n cause the html spec says so
	    value = value.replace(/(\r)?\n/g, '\r\n');
	    value = encodeURIComponent(value);

	    // spaces should be '+' rather than '%20'.
	    value = value.replace(/%20/g, '+');
	    return result + (result ? '&' : '') + encodeURIComponent(key) + '=' + value;
	}

	module.exports = serialize;


/***/ }
/******/ ]);