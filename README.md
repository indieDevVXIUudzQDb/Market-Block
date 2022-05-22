# Market Block
##Description
Built for the L2 Rollathon. A fungible Digital Asset Market. There are two core contracts.
Fungible 

Please note this has not been audited or peer reviewed, and is not ready for production.

## Design Summary
Using Next.js for marketplace users to interact with. A rust Market contract to interact with the Casper CEP47 protocol.


## Development Instructions

```shell
# Network and Contracts
cd hardhat
npm install
cp .env.example .env
# Adjust .env values
npm run build
npm run dev
npm run deployContracts

cd ..

# Fullstack server
cd server
npm install
cp .env.example .env.local
# Adjust .env.local values
sequelize db:migrate 
npm start
```

## Credits
Wallpaper
Modified version of the below animation:
https://codepen.io/marianab/pen/XPOQaR

