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
* [JSFiddle](https://jsfiddle.net/h8fzrdd3/11/)

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

function validName(validation) {
    var value = validation.value.trim();
    var valid = /^[A-Za-z][A-Za-z\-]{2,}$/.test(value);

    validation.setValidation({
        valid: valid,
        value: value,
        message: valid ? '' : validation.key + ' must not contain non-letter characters.'
    });
}

var signupForm = new Form({
    fields: {
        given_name: validName,
        surname: validName,
        email: function (validation) {
            var value = validation.value.trim();
            var valid = EMAIL.test(value);

            validation.setValidation({
                valid: valid,
                value: value,
                message: valid ? '' : 'invalid email.'
            });
        },
        username: function (validation) {
            var value = validation.value.trim();
            var valid = /^[A-Za-z][A-Za-z0-9]{2,}$/.test(value);

            validation.setValidation({
                valid: valid,
                value: value,
                message: value.length < 3 ?
                'username must be at least 3 characters.' :
                valid ?
                '' :
                'username must not contain special characters.'
            });
        },
        password: function (validation) {
            var value = validation.value;
            var valid = value.length >= 6;

            validation.setValidation({
                valid: valid,
                value: value,
                message: valid ?
                '' : 'password must be at least 6 characters.'
            });
        }
    },
    action: function (data, callback) {
        // do something with data
        callback(/*err, res*/);
    }
});

// signupForm.fill(data) returns self
// signupForm.serialize(FormElement) returns self
// signupForm.validate([key]) returns (true|false|null)
// signupForm.submit(callback) returns (true|false|null)
// signupForm.reset() returns self
// signupForm.bind(formElement)
// signupForm.unbind(formElement)
```
