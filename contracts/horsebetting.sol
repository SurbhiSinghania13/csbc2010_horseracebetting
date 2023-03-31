pragma solidity ^0.8.0;

contract HorseRacingBetting {
    address payable public owner;
    uint public minimumBet;
    uint public raceTime;
    uint public raceLength;
    mapping(address => Bet) public bets;
    uint256 public currentTime ;
   

    struct Bet {
        uint horse;
        uint amount;
    }

    constructor(uint _minimumBet, uint _raceTime, uint _raceLength) {
        owner = payable(msg.sender);
        minimumBet = _minimumBet;
        raceTime = _raceTime;
        raceLength = _raceLength;
         
    }

    function placeBet(uint horse) public payable {
 currentTime  = block.timestamp;
        require(block.timestamp < raceTime, "Race has already started");
        require(msg.value >= minimumBet, "Bet amount is less than the minimum bet amount");
        require(horse >= 1 && horse <= 10, "Invalid horse number");

        bets[msg.sender].horse = horse;
        bets[msg.sender].amount = msg.value;
    }

    function changeMinimumBet(uint newMinimumBet) public {
        require(msg.sender == owner, "Only the contract owner can change the minimum bet amount");
        minimumBet = newMinimumBet;
    }

    function cancelBet() public {
        require(block.timestamp < raceTime, "Race has already started");
        require(bets[msg.sender].amount > 0, "User has not placed a bet");

        uint refundAmount = bets[msg.sender].amount;

        delete bets[msg.sender];

        payable(msg.sender).transfer(refundAmount);
    }

    function getMyBet() public view returns (uint, uint) {
        require(bets[msg.sender].amount > 0, "User has not placed a bet");

        return (bets[msg.sender].amount, bets[msg.sender].horse);
    }

    function getWinningHorse() public view returns (uint) {
        require(block.timestamp >= raceTime + raceLength, "Race has not ended yet");

        return uint(keccak256(abi.encodePacked(block.timestamp))) % 10 + 1;
    }

    function distributePrizes() public {
        require(msg.sender == owner, "Only the contract owner can distribute prizes");
        require(block.timestamp >= raceTime + raceLength, "Race has not ended yet");

        uint winningHorse = getWinningHorse();
        uint totalBetsOnWinningHorse = 0;
        uint totalAmountWon = 0;

        for (uint i = 0; i < 10; i++) {
            address[] memory winners = getWinners(i + 1);

            if (i + 1 == winningHorse) {
                for (uint j = 0; j < winners.length; j++) {
                    totalBetsOnWinningHorse += bets[winners[j]].amount;
                }
            } else {
                for (uint j = 0; j < winners.length; j++) {
                    delete bets[winners[j]];
                }
            }
        }

        uint ownerFee = (totalBetsOnWinningHorse * 10) / 100;
        uint totalAmountAfterFee = totalBetsOnWinningHorse - ownerFee;
        for (uint i = 0; i < 10; i++) {
            address[] memory winners = getWinners(i + 1);

            for (uint j = 0; j < winners.length; j++) {
                if (i + 1 == winningHorse) {
                    uint individualShare = (bets[winners[j]].amount * totalAmountAfterFee) / totalBetsOnWinningHorse;
                    payable(winners[j]).transfer(individualShare);
                } else {
                    payable(winners[j]).transfer(0);
                }
            }
        }

        owner.transfer(ownerFee);
    }
    function getWinners(uint horse) public view returns (address[] memory) {
        address[] memory winners = new address[](10);
        uint count = 0;

        for (uint i = 0; i < 10; i++) {
            if (bets[address(uint160(i + 1))].horse == horse) {
                winners[count] = address(uint160(i + 1));
                count++;
            }
        }

        address[] memory actualWinners = new address[](count);

        for (uint i = 0; i < count; i++) {
            actualWinners[i] = winners[i];
        }

        return actualWinners;
    }

}