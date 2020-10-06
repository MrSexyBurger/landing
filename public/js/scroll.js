$( document ).ready(function() {

	var $menu_cont = $('.menu__container');
	var $menu = $('.menu');


	//скролл вверх
	$('.up__adaptive').on('click', function(){
		$('html, body').animate({scrollTop: 0}, 2000);
 		
	})

	//скролл до якоря с закрытием мобильного меню
	$(".sliding-link").click(function(e) {
	    e.preventDefault();
	    var aid = $(this).attr("href");
	    $('html, body').animate({scrollTop: $(aid).offset().top}, 1000);
	    $menu_cont.css('background-color', 'rgba(0,0,0,0.0)');
		$menu.css('left', '-220px');
		setTimeout(function (){
			$menu_cont.removeClass('active');	
		}, 1000);
	});



	// анимация при скролле
	
	$(window).scroll(function(){	
		showBlocks();
	})


	function showBlocks(){
		if ( isDivVisible('.intro__container') ) {
			$('.intro__container').css('opacity', '1');
		}

		if ( isDivVisible('.about-me__container') ) {
			$('.about-me__container').css('opacity', '1');
		}

		if ( isDivVisible('.advantages__container') ) {
			$('.advantages__container').css('opacity', '1');
			

			$( ".advantages__i:nth-child(2)" ).css('transform', 'scale(' + 1 + ')');
			$( ".advantages__i:nth-child(5)" ).css('transform', 'scale(' + 1 + ')');

			$( ".advantages__i:nth-child(1)" ).css('right', '0');
			$( ".advantages__i:nth-child(4)" ).css('right', '0');

			$( ".advantages__i:nth-child(3)" ).css('left', '0');
			$( ".advantages__i:nth-child(6)" ).css('left', '0');

			$( '.advantages__itms__adaptive').children().each(function(index){
				var that = this;
				setTimeout(function(){

					if (index%2!=0){
						$(that).css('left', '0');
					} else {
						$(that).css('right', '0');
					}

				} , 200 * index);
			});
			
		}

		if ( isDivVisible('.feedback__container') ) {
			$('.feedback__container').css('opacity', '1');
		}

		if ( isDivVisible('.portfolio__container') ) {
			$('.portfolio__container').css('opacity', '1');

			$( '.portfolio__itm').each(function(index){
				var that = this;
				setTimeout(function(){
					$(that).css('transform', 'scale(' + 1 + ')');
				} , 200 * index);
			});

		}

		if ( isDivVisible('.clients__container') ) {
			$('.clients__container').css('opacity', '1');
		}

	}


	function isDivVisible(elem){
		var $window = $(window)

		var viewport_top = $window.scrollTop();
		var viewport_height = $window.height()
		var viewport_bottom = viewport_top + viewport_height;

		var $elem = $(elem);
		var top = $elem.offset().top;
		var height = $elem.height();
		var bottom = top + height;

		return (top >= viewport_top && top < viewport_bottom) ||
		(bottom > viewport_top && bottom <= viewport_bottom) ||
		(height > viewport_height && top <= viewport_top && bottom >= viewport_bottom);
	}

	setTimeout(showBlocks, 100);

});