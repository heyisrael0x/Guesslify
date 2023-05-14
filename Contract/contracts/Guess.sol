// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";

error Guess__NotEnoughEthEntered();
error Guess__NotOwner();
error Guess__FundYourWalletPlease();
error Guess__WalletFundFailedSendEnough();
error Guess__YouLostTheGameAlready();
error Guess__PleaseStartANewGameYouLostTheGameAlready();
error Guess__NoBalanceToWithdraw();
error Guess__GameFundFailedSendEnough();
error Guess_GameGotNoMoney();
error Guess_GameStartedAlready();
error Guess__GameHasStartedYouCannotChecktheLuckyNumber();
error Guess__BalanceNotUpToAmount();
error Guess__ThereIsAnActivePlayerYouCannotWithdraw();

contract Guess is VRFConsumerBaseV2 {
    /* Type declarations */
    enum playerGameState {
        GAMEENDED,
        GAMESTARTED
    }

    /* state variables */
    VRFCoordinatorV2Interface private immutable i_vrfCoordintor;
    bytes32 private immutable i_gasLane;
    uint64 private immutable i_subscriptionId;
    uint32 private immutable i_callbackGasLimit;
    uint16 private REQUEST_CONFIRMATIONS = 3;
    uint32 private NUMWORDS = 1;
    address private owner;

    /* Game variables */
    uint256 private immutable i_leastEthToSend;
    uint256 private immutable i_randomNumberRange;
    // uint256 private i_luckyNumber;
    uint256 private i_numberOfTrials;
    uint256 private gameBalance;
    // uint256 public i_luckyNumber;
    // address payable[] private gamers;

    /* Events */
    event RequestRaffleWinner(uint256 indexed requestId);
    event GameFunded(address indexed owner, uint256 indexed amountOwnerFunded);
    event GamerWalletFunded(
        address indexed gamer,
        uint256 indexed amountGamerFunded
    );
    event WalletFundsWithdrawn(
        address indexed gamer,
        uint256 indexed amountWithdrawn
    );

    /* Mapping */
    mapping(address => uint256) public gamersWalletBalance;
    // mapping(address => uint256) public gameBalance;
    mapping(address => uint256) private callCount;
    mapping(address => uint256) private startGameValue;
    mapping(address => uint256) private i_luckyNumber;
    mapping(uint256 => address) private requestIdToAddress;
    mapping(address => playerGameState) private gameState;
    mapping(address => uint256) private numberofTrialsUsed;

    /* Array */
    address[] private activeGamers;

    // address[] public allTimeWinners;
    // address[] public allTimeLosers;

    constructor(
        address vrfCoordinatorV2,
        bytes32 gasLane,
        uint64 subscriptionId,
        uint32 callbackGasLimit,
        uint64 leastEthToSend,
        uint256 randomNumberRange,
        uint256 numberOfTrials
    ) payable VRFConsumerBaseV2(vrfCoordinatorV2) {
        if (msg.value <= 0) {
            revert Guess__GameFundFailedSendEnough();
        }
        i_vrfCoordintor = VRFCoordinatorV2Interface(vrfCoordinatorV2);
        i_gasLane = gasLane;
        i_subscriptionId = subscriptionId;
        i_callbackGasLimit = callbackGasLimit;
        i_leastEthToSend = leastEthToSend;
        owner = msg.sender;
        i_randomNumberRange = randomNumberRange;
        i_numberOfTrials = numberOfTrials;
        gameBalance += msg.value;
        // numberofTrialsUsed[address(0x0)] = numberOfTrials;
    }

    function DonateToGame() public payable {
        gameBalance += msg.value;
        emit GameFunded(msg.sender, msg.value);
    }

    function withdrawGameBalance() public {
        if (msg.sender != owner) {
            revert Guess__NotOwner();
        }
        if (activeGamers.length > 0) {
            revert Guess__ThereIsAnActivePlayerYouCannotWithdraw();
        }
        payable(msg.sender).transfer(gameBalance);
    }

    function fundGameWallet() public payable {
        if (msg.value <= 0) {
            revert Guess__WalletFundFailedSendEnough();
        }
        gamersWalletBalance[msg.sender] += msg.value;

        emit GamerWalletFunded(msg.sender, msg.value);
    }

    function withdrawWalletFunds(uint256 amount) public {
        if (gamersWalletBalance[msg.sender] <= 0) {
            revert Guess__NoBalanceToWithdraw();
        }
        if (amount > gamersWalletBalance[msg.sender]) {
            revert Guess__BalanceNotUpToAmount();
        }
        // uint256 amountToWithdraw = gamersWalletBalance[msg.sender];
        gamersWalletBalance[msg.sender] = 0;
        payable(msg.sender).transfer(amount);

        emit WalletFundsWithdrawn(msg.sender, amount);
    }

    function startGame(bytes calldata /* performData */) external payable {
        if (msg.value < i_leastEthToSend) {
            revert Guess__NotEnoughEthEntered();
        }
        if (msg.value > gamersWalletBalance[msg.sender]) {
            revert Guess__FundYourWalletPlease();
        }
        if (gameBalance == 0 || gameBalance < msg.value * 2) {
            revert Guess_GameGotNoMoney();
        }
        if (gameState[msg.sender] == playerGameState.GAMESTARTED) {
            revert Guess_GameStartedAlready();
        }
        activeGamers.push(msg.sender);
        numberofTrialsUsed[msg.sender] = i_numberOfTrials;
        gameState[msg.sender] = playerGameState.GAMESTARTED;
        gamersWalletBalance[msg.sender] -= msg.value;
        gameBalance += msg.value;
        startGameValue[msg.sender] += msg.value;

        uint256 requestId = i_vrfCoordintor.requestRandomWords(
            i_gasLane,
            i_subscriptionId,
            REQUEST_CONFIRMATIONS,
            i_callbackGasLimit,
            NUMWORDS
        );
        requestIdToAddress[requestId] = msg.sender;
        emit RequestRaffleWinner(requestId);
    }

    function fulfillRandomWords(
        uint256 requestId,
        uint256[] memory randomWords
    ) internal virtual override {
        address requester = requestIdToAddress[requestId];
        uint256 luckyNumber = randomWords[0] % i_randomNumberRange;
        i_luckyNumber[requester] = luckyNumber + 1;
    }

    function verifyRandomNumber(uint256 randomNumber) public returns (bool) {
        if (gameState[msg.sender] == playerGameState.GAMEENDED) {
            revert Guess__PleaseStartANewGameYouLostTheGameAlready();
        } else {
            callCount[msg.sender]++;
            numberofTrialsUsed[msg.sender]--;
            bool isCorrect = (randomNumber == i_luckyNumber[msg.sender]);
            if (isCorrect) {
                gameState[msg.sender] = playerGameState.GAMEENDED;
                uint256 value = startGameValue[msg.sender];
                startGameValue[msg.sender] = 0;
                callCount[msg.sender] = 0;
                for (uint i = 0; i < activeGamers.length; i++) {
                    if (activeGamers[i] == msg.sender) {
                        delete activeGamers[i];
                        break;
                    }
                }
                // allTimeWinners.push(msg.sender);
                gamersWalletBalance[msg.sender] += (value * 2);
                gameBalance -= (value * 2);
            } else if (!isCorrect) {
                if (callCount[msg.sender] == i_numberOfTrials) {
                    gameState[msg.sender] = playerGameState.GAMEENDED;
                    uint256 value = startGameValue[msg.sender];
                    startGameValue[msg.sender] = 0;
                    callCount[msg.sender] = 0;
                    // allTimeLosers.push(msg.sender);
                    gamersWalletBalance[msg.sender] += ((value) / 2);
                    gameBalance -= ((value) / 2);
                }
            }
            return isCorrect;
        }
    }

    // this functions get called if someone
    // sends money to this contract outside of it!!!
    receive() external payable {
        DonateToGame();
    }

    fallback() external payable {
        DonateToGame();
    }

    // view/pure functions

    function getOwner() public view returns (address) {
        return owner;
    }

    function getGamersWalletBalance() public view returns (uint256) {
        return gamersWalletBalance[msg.sender];
    }

    function getLuckyNumber() public view returns (uint256) {
        if (gameState[msg.sender] == playerGameState.GAMESTARTED) {
            revert Guess__GameHasStartedYouCannotChecktheLuckyNumber();
        }
        return i_luckyNumber[msg.sender];
    }

    function getGameBalance() public view returns (uint256) {
        return gameBalance;
    }

    function getNumberOfTrials() public view returns (uint256) {
        return i_numberOfTrials;
    }

    function getCallCount() public view returns (uint256) {
        return callCount[msg.sender];
    }

    function getMyGameState() public view returns (playerGameState) {
        return gameState[msg.sender];
    }

    function getNumberOfTrialsUsed() public view returns (uint256) {
        return numberofTrialsUsed[msg.sender];
    }

    function getstartGameValue() public view returns (uint256) {
        return startGameValue[msg.sender];
    }
}
