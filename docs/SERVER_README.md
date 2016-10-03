# The Server

## Running

1. Make sure you have followed the main instructions to install the environment and get the test file running first.

2. Copy `server/config.template.py` to `config.py` and edit the new file to your liking. See comments in that file for more
   information on configuring the server.

3. You can then run the server with the included script:

```
./run_server.sh
```

If you want it to log events to a file instead of stdout, pass the `--log-file-prefix` argument (an option supplied by
the tornado module):

```
./run_server.sh --log-file-prefix=server.log
```

Note: this script will create the `config.py` if you forgot step 2, but you will probably still want to edit the config
sooner or later.

Once the server is running successfuly, scroll down and read the information about the webapp/client.

See [API.md](API.md) for documentation on the API.


# The webapp (client)

You have two options here.
Firstly, you can set `serve_webapp` to `True` in the server config to allow the python server to serve the webapp files.
This is the simplest option.

Secondly, if you don't want your RPi to have to handle the extra bandwidth or load, you can simply dump the files under
the `webapp` directory onto any static web server. For testing you could do something like this:

```
cd webapp
python3 -m http.server 8080
```

## Using

Navigate to your server in a browser - for example if you started the server on your local machine with the code above,
you can find it at [http://localhost:8080](http://localhost:8080).

The app hopefully will be self explanatory and easy to use.


## Tests

### Server

[Frisby.js](http://frisbyjs.com/) is used for testing the api. This is performed automatically with Travis CI on every
commit, but if you wish to test locally on your machine, you can do the following:

```
# jasmine is a cli command so should be installed globally if possible
# sudo may be required depending on your setup
npm install -g jasmine-node
npm install

# prepare
./server_setup.sh
cp tests/config.test.py config.py

# run the actual tests
jasmine-node tests/
```

### Webapp

There are various tests run using Grunt.
They can be run with:

```
npm install
grunt
```

Note that the html validation/linting tests require java installed on the system.


