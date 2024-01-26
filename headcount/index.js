const http = require('http');
const fs = require('fs');
const url = require('url');
const path = require('path');

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    
    const { pathname, query } = parsedUrl;

    
    if (pathname === '/data' && req.method === 'GET') {
        
        // Check if 'n' query parameter is present
        if (query.n) {
            
            const fileName = `./temp/data/${query.n}.txt`;
          

            // Check if the file exists
            fs.access(fileName, fs.constants.R_OK, (err) => {
                if (err) {
                    res.writeHead(404, {'Content-Type': 'text/plain'});
                    res.end('File not found');
                } else {
                    // Check if 'm' parameter is present
                    if (query.m) {
                        const lineNumber = parseInt(query.m);

                        // Read the specified file
                        fs.readFile(fileName, 'utf8', (err, data) => {
                            if (err) {
                                res.writeHead(500, {'Content-Type': 'text/plain'});
                                res.end('Internal Server Error');
                            } else {
                                // Split the file content into lines
                                const lines = data.split('\n');
                                
                                // Check if the requested line number is valid
                                if (lineNumber >= 1 && lineNumber <= lines.length) {
                                    const response = lines[lineNumber - 1];
                                    res.writeHead(200, {'Content-Type': 'text/plain'});
                                    res.end(response);
                                } else {
                                    res.writeHead(400, {'Content-Type': 'text/plain'});
                                    res.end('Invalid line number');
                                }
                            }
                        });
                    } else {
                        // Stream the entire file if 'm' parameter is not present
                        const fileStream = fs.createReadStream(fileName);
                        res.writeHead(200, {'Content-Type': 'text/plain'});

                        fileStream.on('error', (error) => {
                            res.writeHead(500, {'Content-Type': 'text/plain'});
                            res.end('Internal Server Error');
                        });

                        fileStream.pipe(res);
                    }
                }
            });
        } else {
            res.writeHead(400, {'Content-Type': 'text/plain'});
            res.end('Parameter "n" is required');
        }
    } else {
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end('Not Found');
    }
});

const PORT = 3000;
const HOST = '127.0.0.1';

server.listen(PORT, HOST, () => {
    console.log(`Server running at http://${HOST}:${PORT}/`);
});
