#!/bin/sh
if [ ! -d "remotedev-server" ] ; then
    git clone https://github.com/somq/remotedev-server.git
    cd remotedev-server && npm i && node bin/remotedev.js --hostname=localhost --port=8000 --wsEngine=ws --logLevel=3
else
    cd remotedev-server && node bin/remotedev.js --hostname=localhost --port=8000 --wsEngine=ws --logLevel=3
fi
