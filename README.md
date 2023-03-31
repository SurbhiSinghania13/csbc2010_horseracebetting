# Horse Racing Betting Smart Contract
### This is a Solidity smart contract for a horse racing betting game. The contract allows users to place bets on horses, and distributes prizes to the winners after the race is complete.

## How it works

### The "horse race betting" smart contract works by allowing users to place bets on horses in a race. The contract first verifies that the bet amount is valid and then stores the bet in the contract. When the race is over, the contract retrieves the result from an oracle and distributes the winnings to the users who bet on the winning horse based on their initial bet amounts. The contract also includes a mechanism to prevent users from making multiple bets or changing their bets once the race has started.

## Contract Functions

#### constructor(uint _minimumBet, uint _raceTime, uint _raceLength): initializes the contract variables with the provided values during contract deployment.
#### placeBet(uint horse) public payable: allows users to place a bet on a horse by sending the bet amount as Ether along with the selected horse number as a parameter.
#### changeMinimumBet(uint newMinimumBet) public: allows the contract owner to change the minimum bet amount.
#### cancelBet() public: allows users to cancel their bet before the race starts and receive a refund of their bet amount.
#### getMyBet() public view returns (uint, uint): allows users to view their placed bet amount and the selected horse number.
#### getWinningHorse() public view returns (uint): returns the winning horse number by using the current time to generate a random number between 1 and 10.
#### distributePrizes() public: allows the contract owner to distribute prizes to the winners and take a commission of 10% from the total bet amount on the winning horse.
#### getWinners(uint horse) public view returns (address[] memory): returns an array of addresses who placed bets on the provided horse number.


## Test Cases

#### Minimum bet: checks if the minimum bet is set to 1 ether by default.
#### Change minimum bet: checks if the owner can change the minimum bet to 2 ether.
#### Place a bet: checks if a player can place a bet on horse number 5 with 2 ether and get the correct bet information.
#### Cancel a bet: checks if a player can cancel a bet and get their bet amount returned.
#### Determine the winning horse after the race ends: checks if the contract can determine the winning horse after the race ends.
#### Distribute prizes to the winner: checks if the owner can distribute the prizes to the winner(s) after the race ends and get the correct prize amount.
#### Return the addresses of the winners for a given horse: checks if the contract can return the addresses of the winners for a given horse.

## Usage

#### To use the smart contract, the user needs to deploy it on a blockchain network such as Ethereum using a tool like Remix or Truffle. Once deployed, users can interact with the contract functions by calling them from their Ethereum wallet software such as MetaMask.

## The process involves the following steps:

#### Deploy the contract on a blockchain network using Remix or Truffle.
#### Set the minimum bet amount, race time, and race length during contract deployment.
#### Users can place their bets on horses by sending the bet amount as Ether along with the selected horse number to the placeBet() function.
#### Users can cancel their bet and receive a refund before the race starts by calling the cancelBet() function.
#### After the race is over, the contract owner can distribute the prizes to the winners by calling the distributePrizes() function.

## Conclusion
#### The Horse Racing Betting smart contract provides a secure and transparent way to place bets on horse races. Using this contract, users can place bets on a specific horse and have the chance to win prizes if their horse wins the race. The contract enforces a minimum bet amount and allows users to cancel their bets before the race starts. After the race, the contract determines the winning horse and distributes prizes to the users who placed bets on the winning horse.

#### The contract has been thoroughly tested using various test cases to ensure that it works as intended. Developers can use this contract as a starting point to create their own betting applications on the Ethereum blockchain.
