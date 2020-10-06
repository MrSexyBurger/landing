$( document ).ready(function() {

	//задать высоту блока в зависимости от его ширины

	$(window).on('resize', resizeBlock);

	function resizeBlock(){
		var width = $('.clients__i').width()/4.5;
		$('.clients__i').css('height', width + 'px');
	}

	resizeBlock();


	// управление сонтейнером

		var container = $('.clients__edit__container');
		var edit_btn = $('.clients__btn');
		var close_btn = $('.clients__edit__close-btn');

		edit_btn.on('click', function(){
			container.addClass('active');
			$('.portfolio__edit__container').removeClass('active');
			$('.user__edit__container').removeClass('active');
			$('.logo__edit__container').removeClass('active');
		})

		close_btn.on('click', function(){
			container.removeClass('active');
		})


		// превью
		var form = $('.clients__form');

		$("input[name='filedata']", form).on('change', function(){
			readURL(this);
		})
		
		function readURL(input){
			
			if (input.files && input.files[0]) {
				var reader = new FileReader();

				reader.onload = function(e) {
					$('.clients__preview').css('background-image', 'url(' + e.target.result + ')');
				}

				reader.readAsDataURL(input.files[0]);
			}
		}


		//ajax

		$(':submit', form).on('click', function(){
			event.preventDefault();
			
			var fd = new FormData();
			var file = $("input[name='filedata']", form)[0].files[0];
			var src = $("input[name ='href']").val();

			fd.append("filedata", file);
			fd.append('href', src);
						
			$.ajax({
				url: "uploadclient",
			    type: "POST",
			    data: fd,
			    contentType: false,
			    processData: false,
			    beforeSend:function(){
	           		$('.inprogress').css('display', 'block');
	            },
			    success: function (data) {
					getClients();
					$('.inprogress').css('display', 'none');
			    }
			});
			
		});



		function getClients(){
			$.get('/getclients')
				.done(function(data){
					var items = '';

					$( data ).each(function( index, value ) {

						if( $(location).attr('search') != '?admin' ){
							items += '<div class=\"clients__i\" style=\"background-image: url(../img/clients/' + value._id + '.png);\">' +
									'<a target=\"_blank\" rel=\"noopener noreferrer\" href=\"' + value.href +  '\" class="clients__i__link"></a>' + 
								'</div>';
						} else {
							items += '<div class=\"clients__i\" style=\"background-image: url(../img/clients/' + value._id + '.png);\">' +
									'<button id=\"' + value._id + '\" class="clients__i__del-btn">X</button>' +
									'<a target=\"_blank\" rel=\"noopener noreferrer\" href=\"' + value.href +  '\" class="clients__i__link"></a>' + 
								'</div>';
						}



						
					});
					fillItms(items);
					resizeBlock();
				})
				.fail(function(){
					console.log('Не удалось загрузить портфолио');
				})
		}

		function fillItms(items){
			//добавть айтэмы на страницу
			$('.clients__itms').html(items);
			
			//обработчик для кнопки удалить
			$('.clients__i__del-btn').on('click', function(){
				delClient($(this).attr('id'));
			});

		}


		function delClient(id){
			$.ajax({
			    url: '/deleteclient/'+ id,
			    type: 'DELETE',
			    success: function(result) {
			        getClients();
			    }
			});
		}


		getClients();

});