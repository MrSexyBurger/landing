$( document ).ready(function() {

	var admin = $(location).attr('search');

    if (admin != '?admin'){
        $('.edit__btn').attr('hidden', 'hidden');
        $('.portfolio__btn').attr('hidden', 'hidden');
        $('.clients__btn').attr('hidden', 'hidden');
        $('.logo__btn').attr('hidden', 'hidden');
    }
    
});