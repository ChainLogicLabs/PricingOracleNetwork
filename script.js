async function connectMetamask() {
    try {
        if (window.ethereum) {
            web3 = new Web3(window.ethereum);
            await window.ethereum.enable();
            const accounts = await web3.eth.getAccounts();

            if (accounts.length > 0) {
                web3.eth.defaultAccount = accounts[0]; // Set the first account as default

                console.log('Connected:', web3.eth.defaultAccount);

                // Contract ABI and address
                const contractABI =  [{"inputs":[{"internalType":"string","name":"_name","type":"string"},{"internalType":"string","name":"_symbol","type":"string"},{"internalType":"uint256","name":"_initialSupply","type":"uint256"},{"internalType":"address","name":"_dataBankAddress","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},
                {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"}],"name":"AddressBlocked","type":"event"},
                {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"}],"name":"AddressUnblocked","type":"event"},
                {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},
                {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},
                {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"updater","type":"address"},{"indexed":true,"internalType":"string","name":"asset","type":"string"},{"indexed":false,"internalType":"uint256","name":"newPrice","type":"uint256"}],"name":"PriceUpdated","type":"event"},
                {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"updater","type":"address"},{"indexed":false,"internalType":"string[]","name":"assets","type":"string[]"},{"indexed":false,"internalType":"uint256[]","name":"newPrices","type":"uint256[]"}],"name":"PricesUpdated","type":"event"},
                {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"recipient","type":"address"},{"indexed":true,"internalType":"string","name":"asset","type":"string"},{"indexed":false,"internalType":"uint256","name":"rewardAmount","type":"uint256"}],"name":"RewardClaimed","type":"event"},
                {"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"newSigner","type":"address"}],"name":"SignerAdded","type":"event"},
                {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},
                {"inputs":[],"name":"SIGNER_COOLDOWN","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
                {"inputs":[],"name":"SIGNER_FEE","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
                {"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"_burn","outputs":[],"stateMutability":"nonpayable","type":"function"},
                {"inputs":[{"internalType":"address","name":"_newSigner","type":"address"}],"name":"addSigner","outputs":[],"stateMutability":"nonpayable","type":"function"},
                {"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"}],"name":"allowances","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
                {"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},
                {"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
                {"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"balances","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
                {"inputs":[],"name":"becomeSigner","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},
                {"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"blockAddress","outputs":[],"stateMutability":"nonpayable","type":"function"},
                {"inputs":[{"internalType":"string","name":"asset","type":"string"}],"name":"claimReward","outputs":[],"stateMutability":"nonpayable","type":"function"},
                {"inputs":[],"name":"contractDisabled","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},
                {"inputs":[],"name":"dataBankAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
                {"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},
                {"inputs":[],"name":"emergencyKill","outputs":[],"stateMutability":"nonpayable","type":"function"},
                {"inputs":[{"internalType":"string","name":"asset","type":"string"}],"name":"getPrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
                {"inputs":[{"internalType":"string","name":"","type":"string"},{"internalType":"address","name":"","type":"address"}],"name":"hasSigned","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},
                {"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"isSigner","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},
                {"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"string","name":"","type":"string"}],"name":"lastRewardClaimTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
                {"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"lastSignerJoinTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
                {"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"mintTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},
                {"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},
                {"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
                {"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"ownershipHistory","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
                {"inputs":[{"internalType":"string","name":"","type":"string"}],"name":"price","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
                {"inputs":[{"internalType":"string","name":"","type":"string"}],"name":"proposedPrices","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
                {"inputs":[{"internalType":"address","name":"_signer","type":"address"}],"name":"removeSigner","outputs":[],"stateMutability":"nonpayable","type":"function"},
                {"inputs":[],"name":"resetSignerCount","outputs":[],"stateMutability":"nonpayable","type":"function"},
                {"inputs":[{"internalType":"bytes32","name":"_batchId","type":"bytes32"}],"name":"retrieveBatchUsers","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function"},
                {"inputs":[{"internalType":"address","name":"_userAddress","type":"address"},{"internalType":"bytes32","name":"_salt","type":"bytes32"}],"name":"retrieveHashedDataWithSalt","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},
                {"inputs":[{"internalType":"address","name":"_userAddress","type":"address"},{"internalType":"bytes32","name":"_salt","type":"bytes32"}],"name":"retrieveOriginalDataWithSalt","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},
                {"inputs":[],"name":"signersCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
                {"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},
                {"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
                {"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},
                {"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},
                {"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},
                {"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"unblockAddress","outputs":[],"stateMutability":"nonpayable","type":"function"},
                {"inputs":[{"internalType":"string","name":"asset","type":"string"},{"internalType":"uint256","name":"newPrice","type":"uint256"}],"name":"updatePrice","outputs":[],"stateMutability":"nonpayable","type":"function"},
                {"inputs":[{"internalType":"string[]","name":"assets","type":"string[]"},{"internalType":"uint256[]","name":"newPrices","type":"uint256[]"}],"name":"updatePrices","outputs":[],"stateMutability":"nonpayable","type":"function"}]; // Replace with your contract ABI
                const contractAddress = '0x312c89fD2E7757Fb516300E1255018CbC0c26Ee1'; // Replace with your actual contract address

                // Create an instance of the contract
                contract = new web3.eth.Contract(contractABI, contractAddress);

                // function to initialize and update the account and balance
                updateAccountInfo();
                setInterval(() => {
                    updateAccountInfo();
                    updateBalance(web3.eth.defaultAccount);
                     }, 5000); // Update every 5 seconds (adjust as needed)

                // Display interaction element
                document.getElementById('interaction').style.display = 'block';
            } else {
                console.log('No accounts found.');
            }
        } else {
            console.log('Metamask not detected');
        }
    } catch (error) {
        console.error('Error connecting to Metamask:', error);
    }
}

function updateAccountInfo() {
  web3.eth.getAccounts().then(accounts => {
      const account = accounts[0];
      document.getElementById('account').textContent = account;
  });
}

function updateBalance(account) {
  contract.methods.balanceOf(account).call().then(balance => {
      document.getElementById('balance').textContent = balance;
  });
}

async function becomeSigner() {
  try {
      const gasLimit = 300000; // Adjust the gas limit as needed

      await contract.methods.becomeSigner().send({
          from: web3.eth.defaultAccount,
          gas: gasLimit,
      })
      .on("transactionHash", hash => console.log("Transaction Hash:", hash))
      .on("receipt", receipt => console.log("Receipt:", receipt))
      .on("error", error => console.error("Error:", error));

      //update the account info or perform other actions after becoming a signer.
      updateAccountInfo();
  } catch (error) {
      console.error('Error in becomeSigner:', error);
  }
}

function updatePrice() {
  const assetInput = document.getElementById("assetInput");
  const priceInput = document.getElementById("priceInput");

  // Validate asset starts with a capital letter
  const asset = capitalizeFirstLetter(assetInput.value);
  if (asset !== assetInput.value) {
      console.error("Asset must start with a capital letter");
      return;
  }

  // Validate price does not start with zero
  const price = priceInput.value;
  if (price.startsWith("0")) {
      console.error("Price cannot start with zero");
      return;
  }

  // Update the price and proposed price
  contract.methods.updatePrice(asset, price).send({ from: web3.eth.defaultAccount })
      .on("transactionHash", hash => {
          console.log("Transaction Hash:", hash);
          // After updating the price, fetch and display the current and proposed prices
          getPrice(asset);
          getProposedPrice(asset);
      })
      .on("receipt", receipt => console.log("Receipt:", receipt))
      .on("error", error => console.error("Error:", error));
}
  
  function capitalizeFirstLetter(value) {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }  

function claimReward() {
  const asset = document.getElementById("assetInput").value;
  contract.methods.claimReward(asset).send({ from: web3.eth.defaultAccount })
    .on("transactionHash", hash => console.log("Transaction Hash:", hash))
    .on("receipt", receipt => console.log("Receipt:", receipt))
    .on("error", error => console.error("Error:", error));
}

// Function to get the current price of an asset
async function getPrice(asset) {
  try {
      const currentPrice = await contract.methods.price(asset).call();
      console.log(`Current Price of ${asset}: ${currentPrice}`);
      // Update your UI to display the current price
      // For example, you can set the innerHTML of an element with the id 'currentPriceAsset'
      document.getElementById('currentPriceAsset').innerHTML = `Current Price of ${asset}: ${currentPrice}`;
  } catch (error) {
      console.error('Error getting price:', error);
  }
}

// Function to get the proposed price of an asset
async function getProposedPrice(asset) {
  try {
      const proposedPrice = await contract.methods.proposedPrices(asset).call();
      console.log(`Proposed Price of ${asset}: ${proposedPrice}`);
      // Update your UI to display the proposed price
      // For example, you can set the innerHTML of an element with the id 'proposedPriceAsset'
      document.getElementById('proposedPriceAsset').innerHTML = `Proposed Price of ${asset}: ${proposedPrice}`;
  } catch (error) {
      console.error('Error getting proposed price:', error);
  }
}

function transferTokens() {
    const recipientAddress = document.getElementById("recipientAddress").value;
    const transferAmount = document.getElementById("transferAmount").value;
  
    // Validate recipient address and amount before proceeding
    if (!recipientAddress || !transferAmount || isNaN(transferAmount) || parseFloat(transferAmount) <= 0) {
      console.error("Invalid input. Please enter a valid recipient address and a positive amount.");
      return;
    }
  
    contract.methods.transfer(recipientAddress, transferAmount).send({ from: web3.eth.defaultAccount })
      .on("transactionHash", hash => console.log("Transaction Hash:", hash))
      .on("receipt", receipt => console.log("Receipt:", receipt))
      .on("error", error => console.error("Error:", error));
  }

// Function to check current and proposed prices for a specific asset
function checkPrices() {
  const checkAssetInput = document.getElementById("checkAssetInput");
  const checkAsset = capitalizeFirstLetter(checkAssetInput.value);

  if (!checkAsset || checkAsset !== checkAssetInput.value) {
      console.error("Invalid input. Please enter a valid asset (starting with a capital letter).");
      return;
  }

  // Call the functions to get and display prices
  getPrice(checkAsset);
  getProposedPrice(checkAsset);
}

   // Function to get the current price of an asset
function getPrice(asset) {
  contract.methods.price(asset).call().then(currentPrice => {
      document.getElementById('currentPriceAsset').textContent = `Current Price of ${asset}: ${currentPrice}`;
  });
}

// Function to get the proposed price of an asset
function getProposedPrice(asset) {
  contract.methods.proposedPrices(asset).call().then(proposedPrice => {
      document.getElementById('proposedPriceAsset').textContent = `Proposed Price of ${asset}: ${proposedPrice}`;
  });
}