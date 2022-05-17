# Market Block

## Development

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