var sys = require("sys"), 
http = require("http"),
url = require("url"),
path = require("path"),
qs = require("querystring"),
fs = require("fs");

myPort = 8765;

if (!String.prototype.supplant) {
    String.prototype.supplant = function (o) {
        return this.replace(/{([^{}]*)}/g,
            function (a, b) {
                var r = o[b];
                return typeof r === 'string' || typeof r === 'number' ? r : a;
            }
        );
    };
}



http.createServer(function(request, response) {
		      var uri = url.parse(request.url).pathname;
		      uri = qs.unescape(uri)
		      //sys.puts(uri);
		      //sys.puts(process.cwd());
		      var filename = path.join(process.cwd(), uri);
		      path.exists(filename, function(exists) {
    				      if(!exists) {
    					  response.writeHead(404, {"Content-Type": "text/plain"});
    					  response.write("404 Not Found " + filename + "\n");
    					  response.end();
    					  return;
    				      }
				      fs.stat(filename, function(err,stats) {
						  if (stats.isDirectory()) {
    						      response.writeHead(200, {"Content-Type": "text/html"});
						      fns = fs.readdirSync(filename);
						      fns.sort()
						      response.write("<html><body>\n");
						      if (uri != "/") uri += "/";
						      fns.forEach(function(item) {
								      param = {
									 base: uri, fn: item 
								      };
								      // sys.puts ("uri " + uri +  ",item " + item);
								      response.write(
									  '<a href=\"{base}{fn}\">{fn}</a><br>\n'.supplant(param));
						      });
						      response.write("</body></html>");
    						      response.end();
    						      return;
						  } 
					      });
				      //sys.puts("Still rockin"); 
				      //TBD is there some kind of wierd bug here - shouldnt this be nested?
    				      fs.readFile(filename, "binary", function(err, file) {
    						      if(err) {
    							  response.writeHead(500, {"Content-Type": "text/plain"});
    							  response.write(err + "\n");
    							  response.end();
    							  return;
    						      }
						      sys.puts("serving: " + filename)
    						      response.writeHead(200);
    						      response.write(file, "binary");
    						      response.end();
    						  });
				  });
		  }).listen(myPort);
sys.puts("Server running at http://localhost:/" + myPort);
