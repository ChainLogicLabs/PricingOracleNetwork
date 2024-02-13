// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

// Interface for DataBank contract
interface DataBankInterface {
    function retrieveOriginalDataWithSalt(address _userAddress, bytes32 _salt) external view returns (string memory);
    function retrieveHashedDataWithSalt(address _userAddress, bytes32 _salt) external view returns (bytes32);
    function retrieveBatchUsers(bytes32 _batchId) external view returns (address[] memory);
}

// This contract allow users to become a signer for a fee and propose a price for a specific asset
// Users will be rewarded for each specific asset price proposed
// Tokens allow access for users to be able to propose specific asset prices
contract PricingOracle {

    // State Variables
    address public owner; // Owner of the contract
    address[] private multisigSigners; // Track multisigners
    string public name; // The name of this oracle token
    string public symbol; // The symbol of this oracle token
    uint8 public decimals = 6; // The decimals of this oracle token
    uint256 public totalSupply; // The total supply of this oracle token
    uint256 public constant SIGNER_FEE = 100 * (10**6); // Fixed fee in your token's smallest unit (e.g., wei or cents)
    uint256 public constant SIGNER_COOLDOWN = 24 hours; // Cooldown period for becoming a signer
    uint256 public signersCount; // Variable to keep track of the count of signers who have signed

    // Mappings
    mapping(string => uint256) public price; // Price of the token
    mapping(string => uint256) public proposedPrices; // The proposed prices
    mapping(address => mapping(address => uint256)) public allowances; // Track the allowances
    mapping(address => uint256) public balances; // Track balances
    mapping(address => bool) public isSigner; // Track signers
    mapping(string => mapping(address => bool)) public hasSigned; // Track if user has signed for an asset
    mapping(address => uint256) public lastSignerJoinTime; // The last time a signer join
    mapping(address => bool) private blacklistedAddresses; // Track blacklisted addresses
    mapping(address => address) public ownershipHistory; // Track the owners of this contract
    mapping(address => mapping(string => uint256)) public lastRewardClaimTime; // Mapping to track the last time a user claimed a reward for a specific asset

    // Locks 
    bool private _locked; // nonreentry status
    bool public contractDisabled; // Show if contract is disabled
  
    // Events
    event Approval(address indexed owner, address indexed spender, uint256 value); // Event for approval
    event Transfer(address indexed from, address indexed to, uint256 value); // Event for transfer
    event PriceUpdated(address indexed updater, string indexed asset, uint256 newPrice); // Event for price update
    event PricesUpdated(address indexed updater, string[] assets, uint256[] newPrices); // Event for prices updated
    event SignerAdded(address newSigner); // Event when signer is added
    event AddressBlocked(address indexed user); // Event when address is blocked
    event AddressUnblocked(address indexed user); // Event when address is un blocked
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner); // Event when ownership is transferred
    event RewardClaimed(address indexed recipient, string indexed asset, uint256 rewardAmount);// Add a new event for the RewardClaimed event

    // Only the owner 
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    // nonReentrant modifier
    modifier nonReentrant() {
        require(!_locked, "ReentrancyGuard: reentrant call");
        _locked = true;
        _;
        _locked = false;
    }

    // Only tokenholders modifier
    modifier onlyTokenHolders() {
    require(msg.sender != owner, "Only token holders can call this function");
    _;
    }

    // Modifier to check if address is not blacklisted
    modifier notBlacklisted() {
        require(!blacklistedAddresses[msg.sender], "You are blacklisted and cannot perform this action");
        _;
    }

    // Modifier to require contract is not disable
    modifier notDisabled() {
        require(!contractDisabled, "Contract is disabled");
        _;
    }

    // Address of the DataBank contract
    address public dataBankAddress;

    // Constructor sets the contract owner
    constructor(string memory _name, string memory _symbol, uint256 _initialSupply, address _dataBankAddress) {
        name = _name; // Name 
        symbol = _symbol; // Symbol
        totalSupply = _initialSupply * (10**6); // Initialsupply is the Total Supply
        owner = msg.sender; // The one who deploy the contract
        balances[msg.sender] = totalSupply; // The total supply is sent to the sender
        dataBankAddress = _dataBankAddress; // Address of the DataBank contract
    }

    // Oracle functions

    // Anyone can become a signer by calling this function
    // A fee will be assessed for becoming a signer
    // Users must wait for cool down period before becoming a signer again
     function becomeSigner() external notBlacklisted notDisabled returns (bool) {
        uint256 feeAmount = SIGNER_FEE;
        address sender = msg.sender;

        require(balances[sender] >= feeAmount, "Insufficient balance for the fee");
        require(block.timestamp >= lastSignerJoinTime[sender] + SIGNER_COOLDOWN, "Wait for cooldown period");

        // Transfer feeAmount tokens from the sender to the contract owner
        _transfer(sender, owner, feeAmount);

        // Add the sender to the list of signers
        isSigner[sender] = true;

        // Update the last signer join time
        lastSignerJoinTime[sender] = block.timestamp;

        emit SignerAdded(sender);
        return true;
    }

    // Signers will propose assets and prices
    // The owner will validate and verify the prices proposed and finalized the validated and verified price
    // Signer status is removed after proposing each asset and price
    function updatePrice(string memory asset, uint256 newPrice) external notBlacklisted notDisabled {
        require(newPrice > 0, "Price must be greater than zero");
        
         if (msg.sender == owner) {
            proposedPrices[asset] = newPrice;
        price[asset] = newPrice;
        hasSigned[asset][msg.sender] = true;
        isSigner[msg.sender] = false;
            
        } else {
            require(isSigner[msg.sender], "Not authorized signer");
        require(!hasSigned[asset][msg.sender], "Already signed for this price");
        require(proposedPrices[asset] != newPrice, "Price is the same as the proposed price");

        proposedPrices[asset] = newPrice;
        hasSigned[asset][msg.sender] = true;
        isSigner[msg.sender] = false;
    }

        // Increment the count of signers who have signed
        signersCount++;
        
        emit PriceUpdated(msg.sender, asset, newPrice);
    }

    // This function allows only token holders that have proposed an asset and price to claim a reward for each asset and price proposed
    // Users can only call this finction one time per asset and price
    function claimReward(string memory asset) external onlyTokenHolders notBlacklisted notDisabled {
    // Ensure that the user has signed for the specified asset
    require(hasSigned[asset][msg.sender], "You haven't signed for this asset");

    // Ensure the user hasn't claimed the reward for this asset
    require(lastRewardClaimTime[msg.sender][asset] == 0, "Reward already claimed for this asset");

    // Mint new tokens for the reward (adjust the amount as needed)
    uint256 rewardAmount = 1000 * (10**6);
    _mintTokens(msg.sender, rewardAmount);

    // Update the last reward claim time for this asset
    lastRewardClaimTime[msg.sender][asset] = block.timestamp;

    // Emit the RewardClaimed event
    emit RewardClaimed(msg.sender, asset, rewardAmount);
    }

    // Function to reset singner count
    function resetSignerCount() external onlyOwner notDisabled {
        // Reset the count of signers for the next action
            signersCount = 0;
    }

    // This function allows the owner to input multiple assets and prices (Batch Load)
    function updatePrices(string[] memory assets, uint256[] memory newPrices) external onlyOwner notBlacklisted notDisabled {
    require(assets.length > 0 && newPrices.length > 0, "Arrays length is empty");
    require(assets.length == newPrices.length, "Arrays length mismatch");

    // Signer status for the current transaction
    isSigner[msg.sender] = true;
    
    for (uint256 i = 0; i < assets.length; i++) {
        string memory asset = assets[i];
        uint256 newPrice = newPrices[i];

        require(bytes(asset).length > 0, "Asset cannot be blank");
        require(newPrice > 0, "Price must be greater than zero");
        require(!hasSigned[asset][msg.sender], "Already signed for this price");
        require(proposedPrices[asset] != newPrice, "Price is the same as the proposed price");

        proposedPrices[asset] = newPrice;
        price[asset] = newPrice;
        hasSigned[asset][msg.sender] = true;
        isSigner[msg.sender] = false;
    }

    // Increment the count of signers for the current transaction
    signersCount++;

    // Event when prices are updated
    emit PricesUpdated(msg.sender, assets, newPrices);
    }

    // Function to add signer
    function addSigner(address _newSigner) external onlyOwner notBlacklisted notDisabled {
        require(!isSigner[_newSigner], "Address is already a signer");
        multisigSigners.push(_newSigner);
        isSigner[_newSigner] = true;
        emit SignerAdded(_newSigner);
    }

    // Function to remove a signer
    function removeSigner(address _signer) external onlyOwner notBlacklisted notDisabled {
        require(isSigner[_signer], "Address is not a signer");
        isSigner[_signer] = false;
        for (uint256 i = 0; i < multisigSigners.length; i++) {
            if (multisigSigners[i] == _signer) {
                multisigSigners[i] = multisigSigners[multisigSigners.length - 1];
                multisigSigners.pop();
                break;
            }
        }
    }

    // Function to get the price and proposed price of an specific asset
    function getPrice(string memory asset) external view notBlacklisted notDisabled returns (uint256, uint256) {
    return (price[asset], proposedPrices[asset]);
    }

    // Function to retrieve original data with salt using DataBank interface
    function retrieveOriginalDataWithSalt(address _userAddress, bytes32 _salt) external view notBlacklisted notDisabled returns (string memory) {
        // Cast the DataBank contract address to the interface
        DataBankInterface dataBank = DataBankInterface(dataBankAddress);
        return dataBank.retrieveOriginalDataWithSalt(_userAddress, _salt);
    }

    // Function to retrieve hashed data with salt using DataBank interface
    function retrieveHashedDataWithSalt(address _userAddress, bytes32 _salt) external view notBlacklisted notDisabled returns (bytes32) {
        // Cast the DataBank contract address to the interface
        DataBankInterface dataBank = DataBankInterface(dataBankAddress);
        return dataBank.retrieveHashedDataWithSalt(_userAddress, _salt);
    }

    // Function to retrieve batch users using DataBank interface
    function retrieveBatchUsers(bytes32 _batchId) external view notBlacklisted notDisabled returns (address[] memory) {
        // Cast the DataBank contract address to the interface
        DataBankInterface dataBank = DataBankInterface(dataBankAddress);
        return dataBank.retrieveBatchUsers(_batchId);
    }

    // Token functions

    // Function to check the balanceOf account
    function balanceOf(address account) external notBlacklisted notDisabled view returns (uint256) {
    return balances[account];
    }

    // Function to approve spender an amount
    function approve(address spender, uint256 amount) external nonReentrant notBlacklisted notDisabled returns (bool) {
    require(amount <= balances[msg.sender], "Insufficient balance for approval");
    require(amount > 0, "Approval amount must be greater than zero");

    allowances[msg.sender][spender] = amount;
    emit Approval(msg.sender, spender, amount);
    return true;
    }

     // Function to transfer tokens
    function transfer(address to, uint256 value) external notBlacklisted notDisabled returns (bool) {
        require(to != address(0), "Invalid address");

        _transfer(msg.sender, to, value);
        return true;
    }

    // Function to transferFrom 
    // Users must have allowance
    function transferFrom(address sender, address recipient, uint256 amount) external notBlacklisted notDisabled returns (bool) {
    uint256 currentAllowance = allowances[sender][msg.sender];
    require(currentAllowance >= amount, "Allowance exceeded");

    _transfer(sender, recipient, amount);
    allowances[sender][msg.sender] -= amount;

    emit Approval(sender, msg.sender, allowances[sender][msg.sender]);

    return true;
    }

    // Internal token functions

    // This is the main internal transfer function
    function _transfer(address sender, address recipient, uint256 amount) internal notBlacklisted notDisabled {
        require(sender != address(0), "Invalid sender address");
        require(recipient != address(0), "Invalid recipient address");
        require(balances[sender] >= amount, "Insufficient balance");

        balances[sender] -= amount;
        balances[recipient] += amount;

        emit Transfer(sender, recipient, amount);
    }

    // Admin functions

    // Function to mint tokens
    function mintTokens(address account, uint256 amount) external onlyOwner nonReentrant notBlacklisted notDisabled {
        require(account != address(0), "Invalid account address");
        require(amount > 0, "Mint amount must be greater than zero");

        balances[account] += amount;
        totalSupply += amount;

        emit Transfer(address(0), account, amount); // Emit Transfer event for minting
    } 

     // Function to mint tokens
    function _mintTokens(address account, uint256 amount) internal nonReentrant notBlacklisted notDisabled {
        require(account != address(0), "Invalid account address");
        require(amount > 0, "Mint amount must be greater than zero");

        balances[account] += amount;
        totalSupply += amount;

        emit Transfer(address(0), account, amount); // Emit Transfer event for minting
    } 

    // Function to burn tokens
    function _burn(address account, uint256 amount) external onlyOwner nonReentrant notBlacklisted notDisabled {
        require(account != address(0), "Burn from the zero address");
        require(balances[account] >= amount, "Insufficient balance for burning");

        totalSupply -= amount;
        balances[account] -= amount;

        emit Transfer(account, address(0), amount);
    }

     //Function to block or blacklist and address
    function blockAddress(address user) external onlyOwner notBlacklisted nonReentrant notBlacklisted notDisabled {
    require(user != address(0), "Invalid user address");
    require(!blacklistedAddresses[user], "Address is already blacklisted");
    blacklistedAddresses[user] = true;
    emit AddressBlocked(user);
    }

    // Function to unblock and address
    function unblockAddress(address user) external onlyOwner notBlacklisted nonReentrant notBlacklisted notDisabled {
    require(user != address(0), "Invalid user address");
    require(blacklistedAddresses[user], "Address is not blacklisted");
    blacklistedAddresses[user] = false;
    emit AddressUnblocked(user);
    }

    // Function to transfer ownership
    function transferOwnership(address newOwner) external onlyOwner nonReentrant notBlacklisted notDisabled {
    require(msg.sender == owner, "Only the owner can transfer ownership");
    require(newOwner != address(0), "Invalid new owner address");
    
    owner = newOwner;

    ownershipHistory[owner] = newOwner;
    emit OwnershipTransferred(owner, newOwner);
    }

    // One Time Only Function
    function emergencyKill() external onlyOwner {
        // Disable the contract
        contractDisabled = true;
    }
}

//**DISCLAIMER**

//*ChainLogic Labs is an independent retail investor and software developer creating personal projects for research purposes.
//*The information provided here is not investment advice, and there are no guarantees of returns, profits, warranties, or any monetary outcomes.
//*All projects presented by ChainLogic Labs are their personal assets, with proof of work available on a blockchain or GitHub.
//*Participants in any project with ChainLogic Labs are considered independent and bear full responsibility for their own liabilities, losses, gains, or any other outcomes.
//*ChainLogic Labs holds no responsibility or liabilities for any losses or gains that may or may not occur while using any of its projects.
//*All projects are in the early stage and involve high risk; extreme caution is advised before investing in any platform.
//*By using this program, you agree to this disclaimer and assume full responsibility for any outcomes that may or may not occur while using this program.

// @ChainLogicLabs 2024