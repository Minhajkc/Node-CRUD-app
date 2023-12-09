// const http = require('http');
// const fs = require('fs');

// http.createServer((req, res) => {
//     if (req.url === '/') {
//         fs.readFile('index.html', 'utf-8', (err, data) => {
//             if (err) {
//                 // Handle the error by sending an appropriate response
//                 res.writeHead(500, { 'Content-Type': 'text/plain' });
//                 res.end('Internal Server Error');
//                 console.error(`Error reading index.html: ${err}`);
//             } else {
//                 // Send the content of index.html
//                 res.writeHead(200, { 'Content-Type': 'text/html' });
//                 res.end(data);
//             }
//         });
//     } else if (req.url === '/form?') {
//         fs.readFile('form.html', 'utf-8', (err, data) => {
//             if (err) {
//                 // Handle the error by sending an appropriate response
//                 res.writeHead(500, { 'Content-Type': 'text/plain' });
//                 res.end('Internal Server Error');
//                 console.error(`Error reading form.html: ${err}`);
//             } else {
//                 // Send the content of form.html
//                 res.writeHead(200, { 'Content-Type': 'text/html' });
//                 res.end(data);
//             }
//         });
//     } else {
//         // Handle other paths
//         res.writeHead(404, { 'Content-Type': 'text/plain' });
//         res.end('Not Found');
//     }
// }).listen(4000);
