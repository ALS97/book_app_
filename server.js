'use strict'

const express = require('express');
const superagent = require('superagent');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({extended:true}));
app.use(express.static('./public'));
app.set('view engine', 'ejs');

app.get('/', (req , res) => {
    res.render('pages/index');
});

app.post('/searches', createSearch);
// app.get('/badthing', (request,response) => {
//     throw new Error('WTF???');
//   });

function createSearch(req, res) {
    let url = 'https://www.googleapis.com/books/v1/volumes?';
    console.log('body:', req.body);
    console.log('data:', req.body.search);

    if(req.body.search[1] === 'title'){ url += `intitle:${req.body.search[0]}`;}
    if(req.body.search[1] === 'author'){ url += `inauthor:${req.body.search[0]}`;}
    let queryObject = {
        q:`${req.body.searchby}: ${req.body.search}`,
    };
    console.log(queryObject)
    superagent.get(url)
    .query(queryObject)
    .then(data => {
        let books = data.body.items.map(book => new Book(book));
        console.log(books);
        res.status(200).render('pages/search-results', {books: books});
        // console.log('google books data:', data);
        // res.json(data.text);
    }).catch(error => {console.log( 'error occured during new search',error)});
    
};
function Book(data){
    let url = 'https://i.imgur.com/J5LVHEL.jpg';
    this.title = data.volumeInfo.title || 'no title available'; 
    this.author = data.volumeInfo.authors;
    let tempLink = data.volumeInfo.imageLinks ? data.volumeInfo.imageLinks.thumbnail : url;
    this.description = data.volumeInfo.description;
    this.amount = data.saleInfo.listPrice ? data.saleInfo.listPrice.amount : ' Unknown.';

    if (tempLink.slice(5) === 'https') {
        console.log(secure);
    } else{
         tempLink ='https'+tempLink.slice(4, tempLink.length) 
    }
    this.image = tempLink;
  }
 
   // Error Handler
   app.use( (err,request,response,next) => {
    console.error(err);
    response.status(500).send(err.message);
  });
    // 404 Handler
    app.use('*', (request, response) => {
        console.log(request);
        response.status(404).send(`Can't Find ${request.pathname}`);
      });
  
app.listen(PORT, () => {
    console.log(`listening on port: ${PORT}`);
});
