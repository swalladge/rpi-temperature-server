
# Web app (client)


## Running

1. Start a static web server with the root being the `webapp` directory. For example:

```
cd webapp
python3 -m http.server 8080
```

That's it! ;)


## Using

Navigate to your server in a browser - for example if you started the server on your local machine, you can find it at
[http://localhost:8080](http://localhost:8080).

The web app is still a major work in progress, but currently you can get basic functions working. Simply enter the url
of the api server on the RPi (eg. `http://raspberrypi:8888`) into the text input and click `Update`. You can then use
the date pickers and various buttons to display stuff.



