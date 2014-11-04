    function postContactToGoogle() {
        var name = $('#name').val();
        var email = $('#email').val();
        var message = $('#message').val();
     
        $.ajax({
            url: "https://docs.google.com/forms/d/1Oe0SscekS8WhMFbH7QaOvm5w1y4ltjqBzsOLfGrnq4E/formResponse",
            data: { "entry_794999449": email, 
                    "entry_885349681": name, 
                    "entry_2007256758": message },
            type: "POST",
            dataType: "xml",
            statusCode: {
                0: function () {
                     console.log('Status code: 0');
                },
                200: function () {
                     console.log('Status code: 200');
                }
            }
        });
    }
