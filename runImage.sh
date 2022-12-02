#/bin/bash

docker run -d -p 8081:80 -p 17251:7251 --name client-ui  aitd/nft-client-ui:0.1.0
