const express = require('express');
const session = require('cookie-session');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 8099;
const app = express();

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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req,res) => {
	console.log(req.session);
	if (!req.session.authenticated) {    
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
			req.session.authenticated = true;        
			req.session.username = req.body.name;	 		
		}
	});
	res.redirect('/');
});

app.get('/create' , (req ,res)=>{
    res.status(200).render('create');
});

app.post('/create',(req, res)=>{
    var name = entities.encode(req.body.name);
    var inv_type = entities.encode(req.body.inv_type);
    var quantity = entities.encode(req.body.quantity);
    var street = entities.encode(req.body.street);
    var building = entities.encode(req.body.building);
	var country = entities.encode(req.body.country);
	var zipcode = entities.encode(req.body.zipcode);
	var latitude = entities.encode(req.body.latitude);
	var longitude = entities.encode(req.body.longitude);
    Material.addMaterial({
        name:name,inv_type:inv_type,quantityy:quantity,street:street,building:building,country:country,zipcode:zipcode,latitude:latitude,longitude:longitude
    } , (err , material)=>{
        if(err)
        { res.render('404', {
            msg:'Please fill required details!'
        })}
        var obj = material;
        res.redirect('/inventory');  
    });
});



app.get('/logout', (req,res) => {
	req.session = null;   
	res.redirect('/');
});

app.listen(PORT);
