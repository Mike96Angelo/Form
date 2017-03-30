function username(key, value, validation) {
    if (valid) {
        //check if username is available
        myAPI.availableUsername({
                username: value
            },
            function (err, res) {
                validation.callback({
                    valid: (true | false),
                    inputValue: (String),
                    value: (String),
                    message: (String)
                });
            }
        );
    }

    validation.valid = (null | true | false);
    // null  => means that we are waiting a server to validate our value
    //          call the callback method when we have an answer
    // true  => means that the value is valid
    // false => means that the value is invalid
    // defaults to taking the return value or true
    validation.inputValue = (String);
    // this will set the value of the input tag
    // defaults to the value of the input tag
    validation.value = (String);
    // this is the value that will be set in the payload
    // defaults to the value of the input tag
    validation.message = (String);
    // this is a message to give the user infomation about the validity
    // of the value they inputted.
    // defaults to an empty string
}
