const express = require('express');
const exphbs = require('express-handlebars');

const bodyParser = require('body-parser'); // для обмена данными
const mongoose = require('mongoose'); // подключили mongoose

const multer = require('multer'); //для передачи файлов
const gm = require('gm');// для конвертации изображений

const { TheVideoConverter } = require('@the-/video-converter') 


const app = express();

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(express.static(__dirname + "/public")); // подключаем статические файлы
app.use(bodyParser.urlencoded({ extended: false })); // настраиваем bodyparser

const userModel = require(__dirname + "/models/user.js"); // указываем на модель с информацинй о пользователе
const portfolioModel = require(__dirname + "/models/portfolio.js"); // указываем на модель с портфолио
const clientsModel = require(__dirname + "/models/clients.js"); // указываем на модель с клиентами


var storageConfig = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "uploads");
	},
	filename: (req, file, cb) => {
		//let ext = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
		cb(null, file.originalname);
	}
});

app.use(multer({storage: storageConfig}).single("filedata")); // поле обзываем в соответствием с настройками multer























//routing
app.get('/', function (request, response) {
	//console.log(__dirname);
	response.render('index', {layout: false}); // иначе будет искать layout!
})

app.post('/mailer', function (request, response){
	if(!request.body) return response.sendStatus(400);

	var nodemailer = require('nodemailer');
	var email;
	var password;

	userModel.findOne({}, function(err, data){
		if (err){
			return response.sendStatus(400);
		}

		email = data.email;
		password = data.password;
		
		var transporter = nodemailer.createTransport({
		  service: 'gmail',
		  auth: {
		    user: email,
		    pass: password
		  }
		});

		console.log(email, password);

		var mailOptions = {
		  from: 'Фотограф<' + email + '>',
		  to: email,
		  subject: 'Заявка',
		  text:  'Имя клиента: ' + request.body.name + '\nТел: ' + request.body.phone
		};
		console.log(request.body.name, request.body.phone);

		process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; // чтобы избежать ошибки с сертификатом

		transporter.sendMail(mailOptions, function(error, info){
		  if (error) {
		    console.log(error);
		  } else {
		    console.log('Email sent: ' + info.response);
		    response.send("Письмо успешно отправленно!");
		  }
		});

	});

})

app.post('/updateuser', function(request, response){
	if(!request.body) return response.sendStatus(400);

	var name = request.body.name;
	var phone = request.body.phone;
	var vk = request.body.vk;
	var email = request.body.email;
	var password = request.body.password;
	var about = request.body.about;

	//userModel.deleteMany({},function (){});

	/*const User = new userModel({name: name, phone: phone, vk: vk, about: about});
	
	User.save(function(err, data){
		if(err) return console.log;

		response.send(User);

	});*/


	userModel.findOne({}, function(err, data){
		if (err){
			console.log(err);
			return response.sendStatus(400);
		}

		if (data){
			userModel.findOneAndUpdate({}, {name: name, phone: phone, vk: vk, email: email, password: password, about: about}, {new: true}, function(err, data){
		        if(err) return console.log(err); 
		        response.send(data);
		    });

		}else{
			const User = new userModel({name: name, phone: phone, vk: vk, email: email, password: password, about: about});

			User.save(function(err, data){
				if(err) return console.log;
				response.send(User);
			});

		}	
	
	});


});

app.get('/getuser', function(request, response){

	userModel.findOne({}, function(err, data){
		if (err){
			return response.sendStatus(400);
		}

		response.send(data);
	});
});



app.post('/editabout', function(request, response){
	if(!request.body) return response.sendStatus(400);

	var text = request.body.text;

	aboutModel.updateOne({}, {$set: { text: text } }, {strict: false, new: true}, function(err, price){
		if (err){
			console.log(err);
			return response.sendStatus(400);
		}
		response.send("ok");

	});
});

app.get('/about', function(request, response){
	aboutModel.findOne({}, function(err, text){
		if (err){
			console.log(err);
			return response.sendStatus(400);
		}
		response.send(text);
	});
})

app.post('/uploadphoto', function(request, response){
	let filedata = request.file;
	
	let path = '';

	if (request.body.photo == 'photo__big') {
		path = 'public/img/about_me/about_me_photo.png';
	} else if (request.body.photo == 'photo__small') {
		path = 'public/img/about_me/about_me_photo_mobile.png';
	} else if (request.body.photo == 'bg__intro'){ //ok
		path = 'public/img/intro/intro_mobile.jpg';
	} else if (request.body.photo == 'bg__advantage'){ // ok
		path = 'public/img/advantages/advantages-pic.png';
	} else if (request.body.photo == 'bg__feedback'){ // ok
		path = 'public/img/price/camera.jpg';
	} else if (request.body.photo == 'bg__profolio'){ //
		path = 'public/img/player/portfolio_pic.png';
	}
	
	gm(request.file.path)
		.write(path, function(err){
			if (err) {
				console.log(err)
			}else{
				console.log("Convertion completed");
				response.send("Файл загружен");
			}
		});

	if(!filedata){
		response.send("Ошибка при загрузке файла")
	}
})

app.post('/uploadintro', function(request, response){
	 
	async function tryExample() {
	  const converter = new TheVideoConverter()
	  await converter.convertIntoMP4(request.file.path, 'public/video/intro.mp4')
	  response.send('convertion completed');
	}
	 
	tryExample().catch((err) => console.error(err))

});






app.post('/uploadportfolio', function(request, response){
	let filedata = request.file;
	let src = request.body.src;
	let path = 'public/img/portfolio/'

	const Portfolio = new portfolioModel({src: src});

	Portfolio.save(function(err, data){
		if(err) return console.log;

		gm(request.file.path)
			.write(path + Portfolio._id + '.png', function(err){
				if (err) {
					console.log(err)
				}else{
					console.log("Convertion completed");
					response.send(Portfolio);
				}
			});

		if(!filedata){
			response.send("Ошибка при загрузке файла")
		}
	});

})

app.get('/getportfolio', function(request, response){
	portfolioModel.find({}, function(err, data){
		if (err){
			return response.sendStatus(400);
		}

		response.send(data);
	});
})

app.delete("/deleteportfolio/:id", function(req, res){
         
    const id = req.params.id;

    portfolioModel.findByIdAndDelete(id, function(err, user){
                
        if(err) return console.log(err);
        res.send(user);
    });
});







app.post('/uploadclient', function(request, response){
	let filedata = request.file;
	let href = request.body.href;
	let path = 'public/img/clients/'

	const Clients = new clientsModel({href: href});

	Clients.save(function(err, data){
		if(err) return console.log;

		gm(request.file.path)
			.write(path + Clients._id + '.png', function(err){
				if (err) {
					console.log(err)
				}else{
					console.log("Convertion completed");
					response.send(Clients);
				}
			});

		if(!filedata){
			response.send("Ошибка при загрузке файла")
		}
	});

})

app.get('/getclients', function(request, response){
	clientsModel.find({}, function(err, data){
		if (err){
			return response.sendStatus(400);
		}

		response.send(data);
	});
})

app.delete("/deleteclient/:id", function(req, res){
         
    const id = req.params.id;

    clientsModel.findByIdAndDelete(id, function(err, data){
                
        if(err) return console.log(err);
        res.send(data);
    });
});





app.post('/uploadlogo', function(request, response){
	let filedata = request.file;
	let youtube = request.body.youtube;
	let path = 'public/img/logo/logo.png';

	gm(request.file.path)
		.write(path, function(err){
			if (err) {
				console.log(err)
			}else{
				console.log("Convertion completed");
				
				userModel.findOneAndUpdate({}, {youtube: youtube}, {strict: false, new: true}, function(err, data){
			        if(err) return console.log(err); 
			        response.send(data);

			    });

			}
		});

	if(!filedata){
		response.send("Ошибка при загрузке файла")
	}


})




mongoose.connect("mongodb://localhost:27017/photodb", {useNewUrlParser: true}, function(err){
	if (err) return console.log(err);

	/*const About = new aboutModel({text: 'text'});
	
	About.save(function(err, data){
		//if(err) return console.log;
		//response.send(data);

		aboutModel.find({}, function(err, text){
			if (err){
				console.log(err);
				return response.sendStatus(400);
			}
			console.log(text)

		});
	});*/
/*
	aboutModel.find({}, function(err, text){
		if (err){
			console.log(err);
			return response.sendStatus(400);
		}
		console.log(text)

	});
	*/
//const About = new aboutModel({text: 'text'});
/*
portfolioModel.deleteMany({}, function(){
	/*portfolioModel.findMany({}, function(err, text){
		if (err){
			console.log(err);
			return response.sendStatus(400);
		}
		console.log(text)

	});*/
/*})*/


	app.listen(3000, function(){
		console.log("Сервер ожидает подключения...");
	});
});