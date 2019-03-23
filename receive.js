#!/usr/bin/env node

var PORT = 7113

var http = require('http')
,   fs   = require('fs')


var server = new http.Server(serverHandleRequest)
server.listen(PORT)


function serverHandleRequest(req, res) {
	res.setHeader('Access-Control-Allow-Origin', '*')

	switch(req.method) {
		case 'POST':
		break

		default:
		case 'OPTIONS':
			res.end()
		return
	}

	var path = req.url.split('/').pop()
	,   name = decodeURIComponent(path).split('/').pop()

	try {
		var stream = fs.createWriteStream('uploadDirectory/'+ name)

	} catch(e) {
		console.log('[BAD] write '+ name +': '+ e)
		res.writeHead(500, 'Internal Server Error')
		res.end(e +'')
	}

	req.on('data', function(data) {
		stream.write(data)
	})

	req.on('end', function() {
		console.log('[OK] write '+ name)
		stream.end()
		res.end()
	})
}
