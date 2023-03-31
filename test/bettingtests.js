const HorseRacingBetting = artifacts.require('HorseRacingBetting');
const { expect } = require('chai');

contract('HorseRacingBetting', (accounts) => {
  const owner = accounts[0];
  const player = accounts[1];
  const horseNumber = 5;
  const minimumBet = web3.utils.toWei('1', 'ether');
  const raceStartTime = Math.floor(Date.now() / 1000) + 10 * 60;
  const raceEndTime = raceStartTime + 5 * 60;

  let betting;

  beforeEach(async () => {
    betting = await HorseRacingBetting.new(minimumBet, raceStartTime, raceEndTime);
  });

  it('should have minimum bet of 1 ether', async () => {
    const actual = await betting.minimumBet();
    expect(actual.toString()).to.equal(minimumBet);
  });

  it('should change minimum bet to 2 ether', async () => {
    const expected = web3.utils.toWei('2', 'ether');
    await betting.changeMinimumBet(expected, { from: owner });
    const actual = await betting.minimumBet();
    expect(actual.toString()).to.equal(expected);
  });

  it('should place a bet on horse number 5 with 2 ether', async () => {
    const amount = web3.utils.toWei('2', 'ether');
    await betting.placeBet(horseNumber, { from: player, value: amount });
    const bet = await betting.getMyBet({ from: player });
    console.log('Bet:', bet); // add this line
    const [actualAmount, actualHorseNumber] = bet; // update this line
    expect(actualAmount.toString()).to.equal(amount);
    expect(actualHorseNumber.toNumber()).to.equal(horseNumber);
});


  it('should cancel a bet and return the amount', async () => {
    const amount = web3.utils.toWei('2', 'ether');
    await betting.placeBet(horseNumber, { from: player, value: amount });
    const expectedBalance = await web3.eth.getBalance(player);
    const tx = await betting.cancelBet({ from: player });
    const actualAmount = tx.receipt.gasUsed * web3.utils.toWei('1', 'gwei');
    const actualBalance = await web3.eth.getBalance(player);
    expect(actualAmount.toString()).to.equal(amount);
    expect(actualBalance).to.be.above(expectedBalance);
  });

  it('should determine the winning horse after the race ends', async () => {
    await new Promise((resolve) => setTimeout(resolve, raceEndTime - Date.now() / 1000 + 5));
    const expected = await betting.getWinningHorse();
    expect(expected.toNumber()).to.be.above(0);
  });

  it('should distribute prizes to the winner', async () => {
    const winningHorse = 5;
    const amount = web3.utils.toWei('1', 'ether');
    await betting.placeBet(winningHorse, { from: owner, value: amount });
    await betting.placeBet(winningHorse, { from: player, value: amount });
    await betting.placeBet(winningHorse, { from: player, value: amount });
    const expectedBalance = await web3.eth.getBalance(owner);
    await new Promise((resolve) => setTimeout(resolve, raceEndTime - Date.now() / 1000 + 5));
    await betting.distributePrizes({ from: owner });
    const actualBalance = await web3.eth.getBalance(owner);
    const expectedPrize = web3.utils.toWei('2.7', 'ether');
  const actualPrize = actualBalance.sub(expectedBalance);
  expect(actualPrize.toString()).to.equal(expectedPrize);
  });

  it('should return the addresses of the winners for a given horse', async () => {
    const horse = 5;
    const amount = web3.utils.toWei('1', 'ether');
    await betting.placeBet(horse, { from: accounts[1], value: amount });
    await betting.placeBet(horse, { from: accounts[2], value: amount });
    await betting.placeBet(horse, { from: accounts[3], value: amount });
    const winners = await betting.getWinners(horse);
    expect(winners).to.have.lengthOf(3);
    expect(winners).to.include.members([accounts[1], accounts[2], accounts[3]]);
  });

  });