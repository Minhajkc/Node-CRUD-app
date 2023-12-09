const http = require('http');
const fs = require('fs');
const querystring = require('querystring');
const { log } = require('console');
const { v4: uuidv4 } = require('uuid');
const url = require('url');

const uniqueId = uuidv4();




const jsonFile = fs.readFileSync('file.json', 'utf-8');
let jsonData = JSON.parse(jsonFile);
const htmlData = fs.readFileSync('temp.html', 'utf-8');
const updatefile = fs.readFileSync('update.html','utf-8');
const formpage = fs.readFileSync('form.html','utf-8')


const called = jsonData.map((item) => {
    let output = htmlData.replace('{{%name}}', item.name);
    output = output.replace('{{%phone}}', item.phone);
    output = output.replace('{{%age}}', item.age); 
    output = output.replace('{{%email}}', item.email);
    output = output.replace('{{%id}}', item.id);
    output = output.replace('{{%idd}}', item.id);
    return output;
});

const server = http.createServer((request, response) => {
    if (request.url === '/') {
        fs.readFile('./index.html', 'utf-8', (error, data) => {
            if (error) {
                response.writeHead(500, { 'Content-Type': 'text/plain' });
                response.end(error);
                console.error(`Error reading index.html: ${error}`);
            } else {
                response.writeHead(200, { 'Content-Type': 'text/html' });
               
                let replacedHtml = data.replace('{{%content}}', called.join(','));
                response.end(replacedHtml);
            }
        });
    } else if (request.url === '/form?') {
        let form = fs.readFileSync('./form.html', 'utf-8');
        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.end(form);


    } else if (request.url === '/homemy?') {

        fs.readFile('./index.html', 'utf-8', (error, data) => {
            if (error) {
                response.writeHead(500, { 'Content-Type': 'text/plain' });
                response.end(error);
                console.error(`Error reading index.html: ${error}`);
            } else {
                response.writeHead(200, { 'Content-Type': 'text/html' });
                
                let replacedHtml = data.replace('{{%content}}', called.join(','));
                response.end(replacedHtml);
            }
        });
        
                
       
      
       
    } else if (request.method === 'POST' && request.url === '/submit') {
        
        let formData = '';

        request.on('data', (chunk) => {
            formData += chunk.toString();
            console.log(formData);

        });

        request.on('end', () => {
            
            const parsedData = querystring.parse(formData);
            let newarry =[]
           

            newarry = jsonData
            


            const leength = jsonData.length
            parsedData.id = uniqueId

            newarry.push(parsedData)
        
        
            console.log(parsedData);
            fs.writeFileSync('file.json',JSON.stringify(newarry),'utf-8')

            
            response.writeHead(200, { 'Content-Type': 'text/html' });
           
            response.end(formpage)        });
    }


    else if (request.method === 'GET' && request.url.startsWith('/edit?')) {
       
        const parsedUrl = url.parse(request.url, true);
        const entryId = parsedUrl.query.id;
    
        if (entryId) {
            
            const jsonFilePath = 'file.json';
            fs.readFile(jsonFilePath, 'utf-8', (readError, data) => {
                if (readError) {
                    response.writeHead(500, { 'Content-Type': 'text/plain' });
                    response.end('Internal Server Error');
                    console.error(`Error reading JSON file: ${readError}`);
                } else {
                    
                    const jsonData = JSON.parse(data);
    
                   
                    const selectedEntry = jsonData.find(entry => entry.id === entryId);
    
                    if (selectedEntry) {
                       
                        const editForm = updatefile.replace('{{%name}}', selectedEntry.name)
                            .replace('{{%phone}}', selectedEntry.phone)
                            .replace('{{%age}}', selectedEntry.age)
                            .replace('{{%email}}', selectedEntry.email)
                            .replace('{{%id}}', selectedEntry.id);
                            formindex = editForm
    
                        response.writeHead(200, { 'Content-Type': 'text/html' });
                        response.end(editForm);
                    } else {
                        response.writeHead(404, { 'Content-Type': 'text/plain' });
                        response.end('Entry not found');
                    }
                }
            });
        } 
        
        
        else {
            response.writeHead(400, { 'Content-Type': 'text/plain' });
            response.end('Bad Request: Missing or invalid ID');
        }
    }



    

 else if (request.method === 'POST' && request.url === '/dltt') {
    let formData = '';

    request.on('data', (chunk) => {
        formData += chunk.toString();
    });

    request.on('end', () => {
        
        const parsedData = querystring.parse(formData);

        
        const entryId = parsedData.id;

        if (entryId) {
           
            const jsonFilePath = 'file.json';
            fs.readFile(jsonFilePath, 'utf-8', (readError, data) => {
                if (readError) {
                    response.writeHead(500, { 'Content-Type': 'text/plain' });
                    response.end('Internal Server Error');
                    console.error(`Error reading JSON file: ${readError}`);
                } else {
                    
                    const jsonData = JSON.parse(data);

                   
                    const updatedJsonData = jsonData.filter(entry => entry.id !== entryId);

                    const updatedJsonString = JSON.stringify(updatedJsonData, null, 2);

                   
                    fs.writeFile('file.json', updatedJsonString, 'utf-8', (writeError) => {
                        if (writeError) {
                            response.writeHead(500, { 'Content-Type': 'text/plain' });
                            response.end('Internal Server Error');
                            console.error(`Error writing to JSON file: ${writeError}`);
                        } else {
                            response.writeHead(200, { 'Content-Type': 'text/plain' });
                            response.end('Entry deleted successfully');
                        }
                    });
                }
            });
        } else {
            response.writeHead(400, { 'Content-Type': 'text/plain' });
            response.end('Bad Request: Missing or invalid ID');
        }
    });
}





else if (request.url === '/update' && request.method === 'POST') {
    let formData = '';

    request.on('data', (chunk) => {
        formData += chunk.toString();
    });

    request.on('end', () => {
      
        const parsedData = querystring.parse(formData);

        
        const entryId = parsedData.id;

        if (entryId) {
            
            const jsonFilePath = 'file.json';
            fs.readFile(jsonFilePath, 'utf-8', (readError, data) => {
                if (readError) {
                    response.writeHead(500, { 'Content-Type': 'text/plain' });
                    response.end('Internal Server Error');
                    console.error(`Error reading JSON file: ${readError}`);
                } else {
                    
                    const jsonData = JSON.parse(data);

                    
                    const selectedEntryIndex = jsonData.findIndex(entry => entry.id === entryId);

                    if (selectedEntryIndex !== -1) {
                       
                        jsonData[selectedEntryIndex] = {
                            ...jsonData[selectedEntryIndex],
                            name: parsedData.name,
                            phone: parsedData.phone,
                            age: parsedData.age,
                            email: parsedData.email,
                        };

                        
                        const updatedJsonString = JSON.stringify(jsonData, null, 2);

                       
                        fs.writeFile('file.json', updatedJsonString, 'utf-8', (writeError) => {
                            if (writeError) {
                                response.writeHead(500, { 'Content-Type': 'text/plain' });
                                response.end('Internal Server Error');
                                console.error(`Error writing to JSON file: ${writeError}`);
                            } else {
                                response.writeHead(200, { 'Content-Type': 'text/plain' });
                                response.end('Entry updated successfully');
                            }
                        });
                    } else {
                        response.writeHead(404, { 'Content-Type': 'text/plain' });
                        response.end('Entry not found');
                    }
                }
            });
        } else {
            response.writeHead(400, { 'Content-Type': 'text/plain' });
            response.end('Bad Request: Missing or invalid ID');
        }
    });
}
 
    
    else {
        response.writeHead(404, { 'Content-Type': 'text/plain' });
        response.end('Not Found');
    }
});

const PORT = 6080;
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});
