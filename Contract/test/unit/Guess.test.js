const { network, getNamedAccounts, deployments, ethers } = require("hardhat");
const {
  developmentChains,
  networkConfig,
} = require("../../helper-hardhat-config");
const { assert, expect } = require("chai");

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("Guess unit test", () => {
      let guess2Win,
        vrfCoordinatorV2Mock,
        deployer,
        fundGameValue,
        fundWalletValue,
        startGameValue;
      beforeEach(async () => {
        deployer = (await getNamedAccounts()).deployer;
        await deployments.fixture(["mocks", "guess2Win"]);
        guess2Win = await ethers.getContract("Guess", deployer);
        vrfCoordinatorV2Mock = await ethers.getContract(
          "VRFCoordinatorV2Mock",
          deployer
        );
        fundGameValue = ethers.utils.parseEther("5");
        fundWalletValue = ethers.utils.parseEther("1");
        startGameValue = ethers.utils.parseEther("0.25");
      });
      describe("startGame", () => {
        it("revert if user do not send enough ETH", async () => {
          await expect(guess2Win.startGame([])).to.be.revertedWithCustomError(
            guess2Win,
            "Guess__NotEnoughEthEntered"
          );
        });
        it("revert if ETH entered is less than wallet balance", async () => {
          await expect(
            guess2Win.startGame([], { value: startGameValue })
          ).to.be.revertedWithCustomError(
            guess2Win,
            "Guess__FundYourWalletPlease"
          );
        });
        it("revert if game got no money", async () => {
          const fundWalletValueMoreThanGameMoney =
            ethers.utils.parseEther("10");
          const startGameValueMoreThanGameMoney = ethers.utils.parseEther("10");
          await guess2Win.fundGameWallet({
            value: fundWalletValueMoreThanGameMoney,
          });
          await expect(
            guess2Win.startGame([], {
              value: startGameValueMoreThanGameMoney,
            })
          ).to.be.revertedWithCustomError(guess2Win, "Guess_GameGotNoMoney");
        });
        it("revert if game has started or not ended", async () => {
          await guess2Win.fundGameWallet({ value: fundWalletValue });
          await guess2Win.startGame([], { value: startGameValue });
          await expect(
            guess2Win.startGame([], { value: startGameValue })
          ).to.be.revertedWithCustomError(
            guess2Win,
            "Guess_GameStartedAlready"
          );
        });
        it("do the money arithemetic on start game", async () => {
          await guess2Win.fundGameWallet({ value: fundWalletValue });
          const walletBalance = await guess2Win.getGamersWalletBalance();
          const gameBalance = await guess2Win.getGameBalance();
          await guess2Win.startGame([], { value: startGameValue });
          const walletBalanceAfterGame =
            await guess2Win.getGamersWalletBalance();
          const gameBalanceAfterGame = await guess2Win.getGameBalance();
          assert.equal(
            walletBalance.toString(),
            walletBalanceAfterGame.add(startGameValue).toString()
          );
          assert.equal(
            gameBalance.add(startGameValue).toString(),
            gameBalanceAfterGame.toString()
          );
        });
        it("emits an event and calls the vrf coordinator", async () => {
          await guess2Win.fundGameWallet({ value: fundWalletValue });
          const gametx = await guess2Win.startGame([], {
            value: startGameValue,
          });
          const gametxRecepit = await gametx.wait();
          const requestId = gametxRecepit.events[1].args.requestId;
          assert(requestId.toString() > "0");
        });
      });
      describe("fulfillRandomWords", () => {
        beforeEach(async () => {
          await guess2Win.fundGameWallet({ value: fundWalletValue });
          //   await guess2Win.startGame([], { value: startGameValue });
        });
        it("can only be called after startGame", async () => {
          await expect(
            vrfCoordinatorV2Mock.fulfillRandomWords(0, guess2Win.address)
          ).to.be.revertedWith("nonexistent request");
          await expect(
            vrfCoordinatorV2Mock.fulfillRandomWords(1, guess2Win.address)
          ).to.be.revertedWith("nonexistent request");
        });
        // it("get lucky number", async () => {
        //   await guess2Win.fundGameWallet({ value: fundWalletValue });
        //   const gametx = await guess2Win.startGame([], {
        //     value: startGameValue,
        //   });
        //   const gametxRecepit = await gametx.wait();
        //   const requestId = gametxRecepit.events[1].args.requestId;
        //   await vrfCoordinatorV2Mock.fulfillRandomWords(
        //     requestId,
        //     guess2Win.address
        //   );
        //   const LuckyNumber = await guess2Win.getLuckyNumber();
        //   console.log(`luckynumber is: ${LuckyNumber}`);
        // });
      });
      describe("verifyRandomNumber", () => {
        let wrongNumber;
        let luckyNumber;
        beforeEach(async () => {
          wrongNumber = "4";
          luckyNumber = "2";
          await guess2Win.fundGameWallet({ value: fundWalletValue });
        });
        it("revert if player have not called startGame function", async () => {
          await expect(
            guess2Win.verifyRandomNumber(wrongNumber)
          ).to.be.revertedWithCustomError(
            guess2Win,
            "Guess__PleaseStartANewGameYouLostTheGameAlready"
          );
        });
        it("revert if user trys to call the verify function more than numberofTrial", async () => {
          const gametx = await guess2Win.startGame([], {
            value: startGameValue,
          });
          const gametxRecepit = await gametx.wait();
          const requestId = gametxRecepit.events[1].args.requestId;
          await vrfCoordinatorV2Mock.fulfillRandomWords(
            requestId,
            guess2Win.address
          );
          const numOfTrial = await guess2Win.getNumberOfTrials();
          for (let i = 0; i < numOfTrial; i++) {
            await guess2Win.verifyRandomNumber(wrongNumber);
          }
          await expect(
            guess2Win.verifyRandomNumber(wrongNumber)
          ).to.be.revertedWithCustomError(
            guess2Win,
            "Guess__PleaseStartANewGameYouLostTheGameAlready"
          );
        });

        it("verifies the random number and return false if not correct", async () => {
          const gametx = await guess2Win.startGame([], {
            value: startGameValue,
          });
          const gametxRecepit = await gametx.wait();
          const requestId = gametxRecepit.events[1].args.requestId;
          await vrfCoordinatorV2Mock.fulfillRandomWords(
            requestId,
            guess2Win.address
          );
          const result = await guess2Win.callStatic.verifyRandomNumber(
            wrongNumber
          );
          assert.equal(result, false);
        });
        it("returns false if game lost and do the needful", async () => {
          const gametx = await guess2Win.startGame([], {
            value: startGameValue,
          });
          const gametxRecepit = await gametx.wait();
          const requestId = gametxRecepit.events[1].args.requestId;
          await vrfCoordinatorV2Mock.fulfillRandomWords(
            requestId,
            guess2Win.address
          );
          const walletBalanceAfterStartGame =
            await guess2Win.getGamersWalletBalance();
          const gameBalanceAfterStartGame = await guess2Win.getGameBalance();
          const numOfTrial = await guess2Win.getNumberOfTrials();
          for (let i = 0; i < numOfTrial; i++) {
            await guess2Win.verifyRandomNumber(wrongNumber);
          }
          const walletBalanceAfterEndGame =
            await guess2Win.getGamersWalletBalance();
          const gameBalanceAfterEndGame = await guess2Win.getGameBalance();
          const expectedGamersBalance = walletBalanceAfterStartGame.add(
            startGameValue.div(2)
          );
          const expectedGameBalance = gameBalanceAfterStartGame.sub(
            startGameValue.div(2)
          );
          const playerGameState = await guess2Win.getMyGameState();
          const callCount = await guess2Win.getCallCount();
          const startGameValueAfterTheGame =
            await guess2Win.getstartGameValue();
          assert.equal(
            walletBalanceAfterEndGame.toString(),
            expectedGamersBalance.toString()
          );
          assert.equal(
            gameBalanceAfterEndGame.toString(),
            expectedGameBalance.toString()
          );
          assert.equal(playerGameState, 0);
          assert.equal(callCount, 0);
          assert.equal(startGameValueAfterTheGame, 0);
        });
        it("verifies the random number and return true if correct", async () => {
          const gametx = await guess2Win.startGame([], {
            value: startGameValue,
          });
          const gametxRecepit = await gametx.wait();
          const requestId = gametxRecepit.events[1].args.requestId;
          await vrfCoordinatorV2Mock.fulfillRandomWords(
            requestId,
            guess2Win.address
          );
          const result = await guess2Win.callStatic.verifyRandomNumber(
            luckyNumber
          );
          assert.equal(result, true);
        });
        it("sends the money to the winner balance and do the needful", async () => {
          const gametx = await guess2Win.startGame([], {
            value: startGameValue,
          });
          const gametxRecepit = await gametx.wait();
          const requestId = gametxRecepit.events[1].args.requestId;
          await vrfCoordinatorV2Mock.fulfillRandomWords(
            requestId,
            guess2Win.address
          );
          const walletBalanceAfterStartGame =
            await guess2Win.getGamersWalletBalance();
          const gameBalanceAfterStartGame = await guess2Win.getGameBalance();
          await guess2Win.verifyRandomNumber(luckyNumber);
          const walletBalanceAfterEndGame =
            await guess2Win.getGamersWalletBalance();
          const gameBalanceAfterEndGame = await guess2Win.getGameBalance();
          const expectedGamersBalance = walletBalanceAfterStartGame.add(
            startGameValue.mul(2)
          );
          const expectedGameBalance = gameBalanceAfterStartGame.sub(
            startGameValue.mul(2)
          );
          const playerGameState = await guess2Win.getMyGameState();
          const callCount = await guess2Win.getCallCount();
          const startGameValueAfterTheGame =
            await guess2Win.getstartGameValue();
          assert.equal(
            walletBalanceAfterEndGame.toString(),
            expectedGamersBalance.toString()
          );
          assert.equal(
            gameBalanceAfterEndGame.toString(),
            expectedGameBalance.toString()
          );
          assert.equal(playerGameState, 0);
          assert.equal(callCount, 0);
          assert.equal(startGameValueAfterTheGame, 0);
        });
      });
      describe("getLuckyNumber", () => {
        it("revert if the game has started", async () => {
          await guess2Win.fundGameWallet({ value: fundWalletValue });
          const gametx = await guess2Win.startGame([], {
            value: startGameValue,
          });
          const gametxRecepit = await gametx.wait();
          const requestId = gametxRecepit.events[1].args.requestId;
          await vrfCoordinatorV2Mock.fulfillRandomWords(
            requestId,
            guess2Win.address
          );
          await expect(
            guess2Win.getLuckyNumber()
          ).to.be.revertedWithCustomError(
            guess2Win,
            "Guess__GameHasStartedYouCannotChecktheLuckyNumber"
          );
        });
      });
    });
