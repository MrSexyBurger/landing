$( document ).ready(function() {

		// изменяем высоту блока

		$(window).on('resize', function(){
			resizeBlocks();
		})

		function resizeBlocks(){
			var block = $('.portfolio__itms > .portfolio__itm');
			var block_adaptive = $('.portfolio__itms__adaptive > .portfolio__itm');

			var width = block.width();
			var height = width / 1.77;
			block.css('height', height + 'px');

			width = block_adaptive.width();
			height = width / 1.77;
			block_adaptive.css('height', height + 'px');
		}

		// управление сонтейнером

		var container = $('.portfolio__edit__container');
		var edit_btn = $('.portfolio__btn');
		var close_btn = $('.portfolio__edit__close-btn');

		edit_btn.on('click', function(){
			container.addClass('active');
			$('.logo__edit__container').removeClass('active');
			$('.clients__edit__container').removeClass('active');
			$('.user__edit__container').removeClass('active');
		})

		close_btn.on('click', function(){
			container.removeClass('active');
		})


		// превью
		var form = $('.portfolio__form');

		$("input[name='filedata']", form).on('change', function(){
			readURL(this);
		})
		
		function readURL(input){
			
			if (input.files && input.files[0]) {
				var reader = new FileReader();

				reader.onload = function(e) {
					$('.portfolio__preview').css('background-image', 'url(' + e.target.result + ')');
				}

				reader.readAsDataURL(input.files[0]);
			}
		}

		//ajax

		$(':submit', form).on('click', function(){
			event.preventDefault();
			
			var fd = new FormData();
			var file = $("input[name='filedata']", form)[0].files[0];
			var src = $("input[name ='src']").val();

			fd.append("filedata", file);
			fd.append('src', src);
						
			$.ajax({
				url: "uploadportfolio",
			    type: "POST",
			    data: fd,
			    contentType: false,
			    processData: false,
			    beforeSend:function(){
	           		$('.inprogress').css('display', 'block');
	            },
			    success: function (data) {
					getPortfolio();
					$('.inprogress').css('display', 'none');
			    }
			});
			
		});

		function getPortfolio(){
			$.get('/getportfolio')
				.done(function(data){
					var items = '';

					$( data ).each(function( index, value ) {

						if( $(location).attr('search') != '?admin' ){
							items += '<div class="portfolio__itm">' +
									'<div class=\"src\" hidden=\"\">' + value.src + '</div>' +
									'<div class=\"portfolio__itm__body\" style=\"background-image: url(../img/portfolio/' + value._id + '.png);\"></div>' + 
								'</div>';
							} else {
								items += '<div class="portfolio__itm">' +
									'<div class=\"src\" hidden=\"\">' + value.src + '</div>' +
									'<div class=\"portfolio__itm__body\" style=\"background-image: url(../img/portfolio/' + value._id + '.png);\"></div>' + 
									'<button id=\"' + value._id + '\" class="del_portf__btn">X</button>' +
								'</div>';
							}

						
					});
					fillItms(items);
					resizeBlocks();
				})
				.fail(function(){
					console.log('Не удалось загрузить портфолио');
				})
		}
		
		function fillItms(items){
			//добавть айтэмы на страницу
			$('.portfolio__itms').html(items);
			$('.portfolio__itms__adaptive').html(items);


			//обработчик для кнопки удалить
			$('.del_portf__btn').on('click', function(){
				delPortfolio($(this).attr('id'));
			});

			//обработчик для самих айтемов (загрузка ссылки на видео)
			$('.portfolio__itm__body').on('click', function(){
				var src = $(this).parent().find('.src').html();
				$('.player').toggleClass('active');
				$('.player__iframe').attr('src', src);
			});

			$('.player__close-btn').on('click', function(){
				$('.player').toggleClass('active');
				$('.player__iframe').attr('src', ' ');
			});
		}
		
		function delPortfolio(id){
			$.ajax({
			    url: '/deleteportfolio/'+ id,
			    type: 'DELETE',
			    success: function(result) {
			        getPortfolio();
			    }
			});
		}
		
		





getPortfolio();

});