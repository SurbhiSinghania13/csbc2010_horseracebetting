const HorseRacingBetting = artifacts.require('HorseRacingBetting');

module.exports = async function (deployer) {
  await deployer.deploy(HorseRacingBetting);
};
