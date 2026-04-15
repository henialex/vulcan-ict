$(document).ready(function(){
    
    (function($) {
        "use strict";

    var API_URL = "http://localhost:3001/api/contact";
    
    jQuery.validator.addMethod('answercheck', function (value, element) {
        return this.optional(element) || /^\bcat\b$/.test(value)
    }, "type the correct answer -_-");

    // validate contactForm form
    $(function() {
        $('#contactForm').validate({
            rules: {
                name: {
                    required: true,
                    minlength: 2
                },
                subject: {
                    required: false,
                    minlength: 4
                },
                email: {
                    required: true,
                    email: true
                },
                message: {
                    required: true,
                    minlength: 5
                }
            },
            messages: {
                name: {
                    required: "come on, you have a name, don't you?",
                    minlength: "your name must consist of at least 2 characters"
                },
                subject: {
                    minlength: "your subject must consist of at least 4 characters"
                },
                email: {
                    required: "no email, no message"
                },
                message: {
                    required: "um...yea, you have to write something to send this form.",
                    minlength: "thats all? really?"
                }
            },
            submitHandler: function(form) {
                var payload = {
                    name: $('#name').val(),
                    email: $('#email').val(),
                    subject: $('#subject').val(),
                    message: $('#message').val()
                };

                fetch(API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(payload)
                }).then(function(res){
                    if(!res.ok) throw new Error('Request failed');
                    return res.json().catch(function(){ return {}; });
                }).then(function(){
                    $('#contactForm :input').attr('disabled', 'disabled');
                    $('#contactForm').fadeTo( "slow", 1, function() {
                        $(this).find(':input').attr('disabled', 'disabled');
                        $(this).find('label').css('cursor','default');
                        $('#success').fadeIn()
                        $('.modal').modal('hide');
                        $('#success').modal('show');
                    })
                }).catch(function(){
                    $('#contactForm').fadeTo( "slow", 1, function() {
                        $('#error').fadeIn()
                        $('.modal').modal('hide');
                        $('#error').modal('show');
                    })
                });
            }
        })
    })
        
 })(jQuery)
})