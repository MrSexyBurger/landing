$( document ).ready(function() {

		// открытие и закрытие окна формы

		var btn = $('.edit__btn');
		var close_btn = $('.user__edit__close-btn');
		var edit_container = $('.user__edit__container');


		btn.on('click', function(){
			edit_container.addClass('active');
			$('.portfolio__edit__container').removeClass('active');
			$('.clients__edit__container').removeClass('active');
			$('.logo__edit__container').removeClass('active');
		})

		close_btn.on('click', function(){
			edit_container.removeClass('active');
		});

		//переключение между формами

		var categories = $('.user__edit__categories');
		var cat_btn = $("button" , categories);
		var all__forms = $("form" , edit_container);

		all__forms.css('opacity', '0').css('display', 'none');
		all__forms.eq(0).css('opacity', '1').css('display', 'flex'); // активируем 1ю форму при запуске!!!!!!!!!!

		cat_btn.on('click', function(){
			cat_btn.removeClass('active');

			$(this).addClass('active');
			var index = cat_btn.index($(this));
			
			all__forms.css('opacity', '0');
			

			setTimeout(function(){
				all__forms.css('display', 'none');
				all__forms.eq(index).css('display', 'flex');

				if (index == 0){
					$('.user__edit__underline').css('left', '0px').css('width', '40px');
				} else if (index == 1){
					$('.user__edit__underline').css('left', '50px').css('width', '40px');
				} else if (index == 2){
					$('.user__edit__underline').css('left', '100px').css('width', '44px');
				} else if (index == 3){
					$('.user__edit__underline').css('left', '156px').css('width', '30px');
				}
				
			}, 300);


			setTimeout(function(){
				all__forms.eq(index).css('opacity', '1');
			}, 350);



		});
		



		//////////////////////////////////////////
		///////////////////ИНФО///////////////////
		//////////////////////////////////////////

		var form_info = $(".user__info__form");

		//отправка информации через ajax

		$(':submit', form_info).on('click', function(){
			event.preventDefault();
			
			var name = $("input[name='name']", form_info).val();
			var phone = $("input[name='phone']", form_info).val();
			var vk = $("input[name='vk']", form_info).val();
			var about = $("textarea", form_info).val();
			var email = $("input[name='email']", form_info).val();
			var password = $("input[name='password']", form_info).val();
			
			$.post('/updateuser', {name: name, phone: phone, vk: vk, about: about, password: password, email: email})
	            .done(function(data){
	                $('.about-me__text').html(data.about);
					$('.about-me__text__adaptive').html(data.about);
					$('.intro-name__top').html(data.name);
					$('.intro-name__top__adaptive').html(data.name);
					$('.footer-name').html('–&ensp;' + data.name + '&ensp;–');
					$('.footer-name__adaptive').html('–&ensp;' + data.name + '&ensp;–');
					$('.call').html(numTransform(data.phone)).attr('href', data.phone);
					$('.phone__big').attr('href', "tel: " + data.phone);
					$('.vk__link').attr('href', data.vk);
	            })
	            .fail(function(){
	                console.log('Не удалось отправить сообщение');
	            })
			
		});

		//получние данных через ajax

		function getUserInfo(){
			$.get('/getuser')
			.done(function(data){
	         	fillPage(data.name, data.phone, data.vk, data.about, data.youtube);
				fillForm(data.name, data.phone, data.vk, data.about, data.password, data.email);
	        })
	        .fail(function(){
	            console.log('Не удалось отправить сообщение');
	        })
		}

		getUserInfo();

		// заполнение формы;

		function fillForm(name, phone, vk, about,  password, email){
			$("input[name='name']", form_info).val(name);
			$('.intro-name__top__adaptive').html(name);
			$('.footer-name').html('–&ensp;' + name + '&ensp;–');
			$('.footer-name__adaptive').html('–&ensp;' + name + '&ensp;–');
			$("input[name='phone']", form_info).val(phone);
			$("input[name='vk']", form_info).val(vk);
			$("input[name='email']", form_info).val(email);
			$("input[name='password']", form_info).val(password);
			$("textarea", form_info).val(about);
		}

		// заполнить страницу данными о пользователе

		function fillPage(name, phone, vk, about, youtube){
			$('.about-me__text').html(about);
			$('.about-me__text__adaptive').html(about);
			$('.intro-name__top').html(name);
			$('.footer-name').html('–&ensp;' + name + '&ensp;–');
			$('.footer-name__adaptive').html('–&ensp;' + name + '&ensp;–');
			$('.call').html(numTransform(phone)).attr('href', "tel: " + phone);
			$('.call__adaptive').attr('href', "tel: " + phone);
			$('.phone__big').attr('href', "tel: " + phone);
			$('.vk__link').attr('href', vk);
			$('.watch-more').attr('href', youtube);
			$('.watch-more__adaptive').attr('href', youtube);				 
		}

		//преобразование номера

		function numTransform(phone){
			var separator = '-';
			var position1 = 2;
			var position2 = 6;
			var position3 = 10;
			var position4 = 13;
			var output = [phone.slice(0, position1), separator, phone.slice(position1)].join('');
			output = [output.slice(0, position2), separator, output.slice(position2)].join('');
			output = [output.slice(0, position3), separator, output.slice(position3)].join('');
			output = [output.slice(0, position4), separator, output.slice(position4)].join('');
			return output;
		}



		//////////////////////////////////////////
		///////////////////ФОТО///////////////////
		//////////////////////////////////////////

		var form_photo = $('.user__photo__form');
		var about_img = $('.about-me__img');
		var about_img_ad = $('.about-me__img__adaptive');

		//изменение высоты блока с фото

		$(window).resize(function(){
			changePhotoSize();
		});

		function changePhotoSize(){
			about_img.css('height', $('.about-me__img').css('width'));
		}

		changePhotoSize();


		// превью

		$("input[name='filedata']", form_photo).change(function(){
			readURL(this);
		})

		function readURL(input){
			if (input.files && input.files[0]) {
				var reader = new FileReader();

				reader.onload = function(e) {
					$('.photo__preview').css('background-image', 'url(' + e.target.result + ')');
				}

				reader.readAsDataURL(input.files[0]);
			}
		}


		// ajax для фото


		$(':submit', form_photo).on('click', function(){
			event.preventDefault();
			
			var fd = new FormData();
			var file = $("input[name='filedata']", form_photo)[0].files[0];
			var photo = $("input:radio[name ='photo']:checked").val(); // определили какое фото менять

			fd.append("filedata", file);
			fd.append("photo", photo);
			
			$.ajax({
				url: "uploadphoto",
			    type: "POST",
			    data: fd,
			    contentType: false,
			    processData: false,
			    async: false,
			    beforeSend:function(){
	           		$('.inprogress').css('display', 'block');
	            },
			    success: function (result) {
			        about_img.css('background-image', 'url(../img/about_me/about_me_photo.png?a=' + new Date().getTime());
			        about_img_ad.css('background-image', 'url(../img/about_me/about_me_photo_mobile.png?a=' + new Date().getTime());
			        $('.inprogress').css('display', 'none');         
			    }
			});
			
		});




		//////////////////////////////////////////
		//////////////////ИНТРО///////////////////
		//////////////////////////////////////////


		var form_intro = $('.user__intro__form');
		var video = $('#preview__video').get(0);

		$(':submit', form_intro).on('click', function(){
			event.preventDefault();
			
			var fd = new FormData();
			var file = $("input[name='filedata']", form_intro)[0].files[0];

			fd.append("filedata", file);
			
			$.ajax({
				url: "uploadintro",
			    type: "POST",
			    data: fd,
			    contentType: false,
			    processData: false,
			    beforeSend:function(){
	           		$('.inprogress').css('display', 'block');
	            },
			    success: function (data) {
					reloadVideo();
					$('.inprogress').css('display', 'none');
			    }
			});
			
		});

		
		function reloadVideo(){
			$('.video').attr('src', 'video/intro.mp4?a=' + new Date().getTime());
		}


		function initVideoPreview(){
			var buttons = $('button' , '.intro__preview__controls');
			
			buttons.on('click', function(){
				var id = $(this).attr('id')

				if (id == 'play'){
					video.play();
				} else if (id == 'pause') {
					video.pause();
				} else if (id == 'stop') {
					video.pause();
					video.currentTime = 0;
				}
				
			})

		}

		$("input[name='filedata']", form_intro).change(function(){
			updateVideoURL(this);
		})

		function updateVideoURL(input){
			var fileInput = input;
			var fileUrl = window.URL.createObjectURL(fileInput.files[0]);
			$('#preview__video').attr("src", fileUrl);
			getPlaybackTime()
		}

		function getPlaybackTime(){
			var duration;
			video.oncanplay = function() {
    			duration = Math.floor(this.duration);
			};
			video.ontimeupdate = function(){
				var time = Math.floor(this.currentTime);
				animateProgressbar(getProcent(time, duration));
			}
		}

		function getProcent(time,duration){
			var procent = Math.floor(100 / (duration / time));
			return procent;
		}

		function calcTime(procent ,duration){
			var time = Math.floor(( duration / 100 ) * procent);
			return time;
		}

		function animateProgressbar(procent){
			$('.progressbar__filler').css('width', procent * 2.5);
		}

		$('.progressbar').click(function (e) { //Offset mouse Position
			var duration = video.duration;
	        var posX = $(this).offset().left;
	        var procent = (e.pageX - posX)/2.5;
	        $('.progressbar__filler').css('width', procent + '%');
	        video.currentTime = calcTime(procent, duration);          
	    });

		initVideoPreview();
		reloadVideo();
	
		//////////////////////////////////////////
		////////////////Бэкграунд/////////////////
		//////////////////////////////////////////

		var form_bg = $('.user__bg__form');
		
		// превью	

		$("input[name='filedata']", form_bg).change(function(){
			readBgURL(this);
		})
		
		function readBgURL(input){
			
			if (input.files && input.files[0]) {
				var reader = new FileReader();

				reader.onload = function(e) {
					$('.bg__preview').css('background-image', 'url(' + e.target.result + ')');
				}

				reader.readAsDataURL(input.files[0]);
			}
		}


		// ajax для бэкграунда


		$(':submit', form_bg).on('click', function(){
			event.preventDefault();
			
			var fd = new FormData();
			var file = $("input[name='filedata']", form_bg)[0].files[0];
			var bg = $("input:radio[name ='bg']:checked").val(); // определили какое фото менять

			fd.append("filedata", file);
			fd.append("photo", bg);
			
			$.ajax({
				url: "uploadphoto",
			    type: "POST",
			    data: fd,
			    contentType: false,
			    processData: false,
			    beforeSend:function(){
	           		$('.inprogress').css('display', 'block');
	            },
			    success: function (result) {
			    	updateBg(bg);
			    	$('.inprogress').css('display', 'none');      
			    }
			});

			function updateBg(bg){	
				if (bg == 'bg__intro'){
					$('.intro-adaptive').css('background-image', 'url(../img/intro/intro_mobile.jpg?a=' + new Date().getTime());
				} else if (bg == 'bg__advantage'){
					$('.advantages').css('background-image', 'url(../img/advantages/advantages-pic.png?a=' + new Date().getTime());
				} else if (bg == 'bg__feedback') {
					$('#price').css('background-image', 'url(../img/price/camera.jpg?a=' + new Date().getTime());
					$('#price-adaptive').css('background-image', 'url(../img/price/camera.jpg?a=' + new Date().getTime());
				} else if (bg == 'bg__profolio') {
					$('#portfolio').css('background-image', 'url(../img/player/portfolio_pic.png?a=' + new Date().getTime());
				}
			}
			
		});

});