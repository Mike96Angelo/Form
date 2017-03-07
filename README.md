# Check Form

[![GitHub release](https://img.shields.io/github/release/Mike96angelo/Form.svg?maxAge=21600)](https://github.com/Mike96Angelo/Form/releases)
[![npm version](https://img.shields.io/npm/v/check-form.svg?maxAge=21600)](https://www.npmjs.com/package/check-form)
[![npm downloads](https://img.shields.io/npm/dm/check-form.svg?maxAge=604800)](https://npm-stat.com/charts.html?package=check-form&from=2017-03-01)
[![npm downloads](https://img.shields.io/npm/dt/check-form.svg?maxAge=604800)](https://npm-stat.com/charts.html?package=check-form&from=2017-03-01)

Simple yet powerful way to build and validate HTML forms.

### Install:
```
$ npm install check-form
```
# What Check Form Looks Like

* [Docs](docs/check-form.md)
* [JSFiddle](https://jsfiddle.net/fypyk2jp/4/)

### app.html:

```html
<form id="signup">
    <div class="row">
        <label for="given_name">Given Name</label>
        <input id="given_name" name="given_name" />
    </div>
    <div class="row">
        <label for="surname">Surname</label>
        <input id="surname" name="surname" />
    </div>
    <div class="row">
        <label for="email">Email</label>
        <input id="email" name="email" />
    </div>
    <div class="row">
        <label for="username">Username</label>
        <input id="username" name="username" />
    </div>
    <div class="row">
        <label for="password">Password</label>
        <input id="password" name="password" />
    </div>
    <div class="row">
        <button type="submit" name="submit">Signup</button>
    </div>
</form>
```

### app.js:

```JavaScript
var Form = require('check-form');

var EMAIL = /^[A-Za-z][A-Za-z0-9]{2,}[@][A-Za-z0-9\-]+[.][A-Za-z0-9]{2,}$/;

function validName(key, value, callback) {
    value = value ? value.trim() : '';
    var valid = /^[A-Za-z][A-Za-z\-]{2,}$/.test(value);

    callback({
        valid: valid,
        value: value,
        reason: valid ? '' : key + ' must not contain non-letter characters.'
    });
}

var signupForm = new Form({
    fields: {
        given_name: validName,
        surname: validName,
        email: function (key, value, callback) {
            value = value ? value.trim() : '';
            var valid = EMAIL.test(value);

            callback({
                valid: valid,
                value: value,
                reason: valid ? '' : 'invalid email.'
            });
        },
        username: function (key, value, callback) {
            value = value ? value.trim() : '';
            var valid = /^[A-Za-z][A-Za-z0-9]{2,}$/.test(value);
            if (valid) {
                //check if username is available
                myAPI.availableUsername(
                    {
                        username: value
                    },
                    function (err, res) {
                        valid = err ? false : res.available;
                        callback({
                            valid: valid,
                            value: value,
                            reason: err ?
                            'something went wrong try again later.' :
                            res.available ?
                            '' : 'username unavailable.'
                        });
                    }
                )
            } else {
                callback({
                    valid: valid,
                    value: value,
                    reason: value.length < 3 ?
                    'username must be at least 3 characters.' :
                    valid ?
                    '' : 'username must not contain special characters.'
                });
            }
        },
        password: function (key, value, callback) {
            var valid = value.length >= 6;

            callback({
                valid: valid,
                value: value,
                reason: valid ?
                '' : 'password must be at least 6 characters.'
            });
        }
    },
    action: function (data, callback) {
        // do something with data
        console.log('data', data);
        // callback( error, success )
    },
    error: function (validation) {
        // do something with validation
        console.log('validation', validation);
        // {
        //     <field-name>: {
        //         valid: <Boolean>,
        //         value: <input-value>,
        //         reason: <error-message>
        //     },
        //     ...
        // }
    }
});

// signupForm.validate(callback)
// signupForm.submit(callback)
// signupForm.bind(formElement)
// signupForm.unbind(formElement)
```
