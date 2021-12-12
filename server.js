const express = require('express');
const session = require('cookie-session');
const bodyParser = require('body-parser');
const app = express();
const assert = require('assert');
const mongodb = require('mongodb');
const mongodbUrl='mongodb+srv://samsonmak:samson123@cluster0.7tdpu.mongodb.net/s381miniprj?retryWrites=true&w=majority';
const MongoClient = require('mongodb').MongoClient;
const dbName='s381miniprj';
const PORT=process.env.PORT || 8099;
app.set('view engine','ejs');

const SECRETKEY = 'login success';

const users = new Array(
	{name: 'demo', password: ''},
	{name: 'student', password: ''}
);

app.set('view engine','ejs');
app.use(session({
  name: 'loginSession',
  keys: [SECRETKEY]
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.get('/', (req,res) => {
	console.log(req.session);
	if (!req.session.authenticated) {    // user not logged in!
		res.redirect('/login');
	} else {
		res.status(200).render('inventory',{name:req.session.username});
	}
});

app.get('/login', (req,res) => {
	res.status(200).render('login',{});
});

app.post('/login', (req,res) => {
	users.forEach((user) => {
		if (user.name == req.body.name && user.password == req.body.password) {
			// correct user name + password
			// store the following name/value pairs in cookie session
			req.session.authenticated = true;        // 'authenticated': true
			req.session.username = req.body.name;	 // 'username': req.body.name		
		}
	});
	res.redirect('/');
});

app.get('/create' , (req ,res)=>{
    res.render('create');
});

app.post('/create',(req, res)=>{
	const client = new MongoClient(mongodbUrl);

	var data={
		"name":req.body.name,
		"type":req.body.inv_type,
		"quantity":req.body.quantity,
		"street":req.body.street,
		"building":req.body.building,
		"country":req.body.country,
		"zipcode":req.body.zipcode,
		"latitude":req.body.latitude,
		"longitude":req.body.longitude,
		"photo":req.body.photo
	};
    client.connect((err,db) => {
        assert.equal(null, err);
        console.log("Connected successfully to server");
        const dbo = db.db(dbName);
		delete req.body._id;
		dbo.collection('inventory').insertOne(data,function(err, collection){
			if (err) throw err;
        	console.log("Record inserted Successfully");
			res.render('/');
			client.close();
		});
	});
	return res.redirect('/');
});



app.get('/logout', (req,res) => {
	req.session = null;   // clear cookie-session
	res.redirect('/');
});

app.listen(PORT);
