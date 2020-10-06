$( document ).ready(function() {
	var $menu_cont = $('.menu__container');
	var $menu = $('.menu');

	$('.burger-menu').on('click', function(){
		$menu_cont.addClass('active');
		setTimeout(function (){
			$menu_cont.css('background-color', 'rgba(0,0,0,0.5)');
			$menu.css('left', '0px');		
		}, 40);

	});

	$('.menu__close-btn').on('click', function(){
		$menu_cont.css('background-color', 'rgba(0,0,0,0.0)');
		$menu.css('left', '-220px');
		setTimeout(function (){
			$menu_cont.removeClass('active');	
		}, 1000);
	});


});