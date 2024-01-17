# Freelancer DAPP

## Setting up

- Create a local repository on your device and clone this repository.
- Copy and paste your smart contract address as a string for the contract address in the `freelancer.js` and `clinet.js`.

## Getting the ABI for your smart contract

- In the remix IDE for solidity, compile the code and in the compiler section on the left , you can see an option to copy the ABI.
- If you changed the name of the functions in the contract, don't forget to change the name of the functions in the client and freelancer files after cloning.
- In this format  -  `getFunction = contract.nameOfYourFunction`  or `getVariable = contract.nameOfYourVariable`

## To run the server

Open the local workshop directory on VS Code and then the run the following scripts

```javascript
npm install
```

This will install all the necessary packages listed under the dependencies in the `package.json` 

```javascript
npm run dev
```

This will start the server.
