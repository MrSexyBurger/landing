$( document ).ready(function() {

	// управление сонтейнером

		var container = $('.logo__edit__container');
		var edit_btn = $('.logo__btn');
		var close_btn = $('.logo__edit__close-btn');

		edit_btn.on('click', function(){
			container.addClass('active');
			$('.portfolio__edit__container').removeClass('active');
			$('.clients__edit__container').removeClass('active');
			$('.user__edit__container').removeClass('active');
		})

		close_btn.on('click', function(){
			container.removeClass('active');
		})


		// превью
		var form = $('.logo__form');

		$("input[name='filedata']", form).on('change', function(){
			readURL(this);
		})
		
		function readURL(input){
			
			if (input.files && input.files[0]) {
				var reader = new FileReader();

				reader.onload = function(e) {
					$('.logo__preview').css('background-image', 'url(' + e.target.result + ')');
				}

				reader.readAsDataURL(input.files[0]);
			}
		}


		//ajax

		$(':submit', form).on('click', function(){
			event.preventDefault();
			
			var fd = new FormData();
			var file = $("input[name='filedata']", form)[0].files[0];
			var youtube = $("input[name ='youtube']", form).val();

			fd.append("filedata", file);
			fd.append('youtube', youtube);
						
			$.ajax({
				url: "uploadlogo",
			    type: "POST",
			    data: fd,
			    contentType: false,
			    processData: false,
			    beforeSend:function(){
	           		$('.inprogress').css('display', 'block');
	            },
			    success: function (data) {
					updateLogo();
					updateChannel(data.youtube);
					$('.inprogress').css('display', 'none');
			    }
			});
			
		});


		function updateLogo(){
			$('#logo').attr( 'src', 'img/logo/logo.png?a='  + new Date().getTime() );
			$('#logo-footer').attr( 'src', 'img/logo/logo.png?a='  + new Date().getTime() );
			$('#logo-footer-adaptive').attr( 'src', 'img/logo/logo.png?a='  + new Date().getTime() );
		}

		function updateChannel(youtube){
			$('.watch-more').attr('href', youtube);
			$('.watch-more__adaptive').attr('href', youtube);
		}

		function fillForm(){
			var youtube = $('.watch-more').attr('href');
			$("input[name ='youtube']", form).val(youtube);
		}

		updateLogo();
		fillForm()
});