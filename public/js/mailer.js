$( document ).ready(function() {

	var form = $('.feedback__form');
	var form_adaptive = $('.feedback__form__adaptive');

	$(':submit', form).on('click', function () {
		event.preventDefault();

		var name = $(form).find( 'input[name = "name"]' ).val(); // берём имя
        var phone = $(form).find( 'input[name = "phone"]' ).val(); // берём номер тел
        sendMail(name, phone);
    })

	$(':submit', form_adaptive).on('click', function () {
		event.preventDefault();

		var name = $(form_adaptive).find( 'input[name = "name"]' ).val(); // берём имя
        var phone = $(form_adaptive).find( 'input[name = "phone"]' ).val(); // берём номер тел
        sendMail(name, phone);
    })

    function sendMail(name, phone){
        $.post('/mailer', {name: name, phone: phone})
            .done(function(data){
                $('.thank-you__container').addClass('active');
            })
            .fail(function(){
                console.log('Не удалось отправить сообщение');
            })
    }
    
});