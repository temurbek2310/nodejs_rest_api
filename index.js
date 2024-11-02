const http = require('http');
const { v4 } = require('uuid');
const getBodyData = require('./util')

let books = [
    {
        id: 1,
        title: 'Book 1',
        pages: 200,
        author: 'Writer 1'
    }
]

const server = http.createServer(async (req, res) => {
    if (req.url === '/books' && req.method === 'GET') {
        res.writeHead(200, {
            'Content-Type': 'application/json charset=UTF-8'
        })
        const resp = {
            status: 'success',
            books
        }
        res.end(JSON.stringify(resp));
    } else if (req.url === '/books' && req.method === 'POST') {
        const data = await getBodyData(req);
        const { title, pages, author } = JSON.parse(data);
        const newBook = {
            id: v4(),
            title,
            pages,
            author
        }
        books.push(newBook);
        const resp = {
            status: 'created',
            book: newBook
        }
        res.writeHead(200, {
            'Content-Type': 'application/json charset=UTF-8'
        })
        res.end(JSON.stringify(resp));
    } else if (req.url.match(/\/books\/\w+/) === '/books/:id' && req.method === 'GET') {
        const id = req.url.split('/').pop();
        const book = find(b => b.id === id)
        res.writeHead(200, {
            'Content-Type': 'application/json charset=UTF-8'
        })
        const resp = {
            status: 'get',
            book
        }
        res.end(JSON.stringify(resp));
    } else if (req.url.match(/\/books\/\w+/) && req.method === 'PUT') {
        const id = req.url.split('/').pop();
        const data = await getBodyData(req);
        const { title, pages, author } = JSON.parse(data);
        const idx = books.findIndex(b => b.id === id);
        const changeBook = {
            id: books[idx].id,
            title: title || books[idx].title,
            pages: pages || books[idx].pages,
            author: author || books[idx].author
        }
        books[idx] = changeBook;
        const resp = {
            status: 'edited',
            book: changeBook
        }
        res.writeHead(200, {
            'Content-Type': 'application/json charset=UTF-8'
        })
        res.end(JSON.stringify(resp));
    } else if (req.url.match(/\/books\/\w+/) && req.method === 'DELETE') {
        const id = req.url.split('/').pop();
        books = books.filter(b => b.id !== id);
        res.writeHead(200, {
            'Content-Type': 'application/json charset=UTF-8'
        })
        const resp = {
            status: 'deleted'
        }
        res.end(JSON.stringify(resp));
    }
})


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));