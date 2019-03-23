#!/usr/bin/env node

var PORT = 7113
var DIR = 'uploadDirectory'

var http = require('http')
,   path = require('path')
,   fs   = require('fs')


fs.stat(DIR, function(e, stats) {
	if(e) fs.mkdir(DIR, function(e, r) {
		if(e) throw Error('cannot create dir '+ DIR)
		console.log('created dir', DIR)
	})
	else if(!stats.isDirectory()) {
		throw Error(DIR +' is not directory')
	}
})


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

	var name = decodeURIComponent(req.url.split('/').pop()).split('/').pop()

	try {
		var stream = fs.createWriteStream(path.resolve(DIR, name))

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
