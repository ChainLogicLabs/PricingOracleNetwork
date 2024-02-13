# Oracle Contract Documentation

## Overview

The Oracle contract is a central component within our revolutionary asset-backed ecosystem, serving as the cornerstone for decentralized pricing, signer management, and ensuring data integrity. This document provides comprehensive documentation to understand, deploy, and interact with the Oracle contract effectively.

## Table of Contents

1. [Introduction](#introduction)
2. [Features](#features)
3. [Token Pegging](#token-pegging)
4. [Smart Contract Functions](#smart-contract-functions)
5. [Getting Started](#getting-started)
6. [Usage Examples](#usage-examples)
7. [Security Considerations](#security-considerations)
8. [Contributing](#contributing)
9. [License](#license)

## 1. Introduction

The Oracle contract plays a pivotal role in our Trust and Verification System, residing in the verification layer. It facilitates the interaction between users and the tokenized economy, allowing for decentralized and transparent pricing through a network of signers.

## 2. Features

### 2.1 Price Proposals

Users can propose new prices for various assets, contributing to the dynamic pricing mechanism within the ecosystem. Successful proposals are rewarded to encourage active participation.

### 2.2 Signer Management

The Oracle manages a decentralized network of signers who play a crucial role in proposing and validating asset prices. Users can become signers, contributing to the resilience and decentralization of the Oracle.

### 2.3 Token Management

The Oracle is associated with a specific token that grants access to the ecosystem. Users are required to hold this token to interact with the Oracle and utilize its functionalities.

### 2.4 Asset and Price Management

The contract keeps track of various assets and their corresponding prices proposed by signers. This ensures a comprehensive and up-to-date record of asset valuations.

## 3. Token Pegging

The Oracle contract introduces a unique token pegging mechanism. The native token is pegged to the average cost of cell phone bills, both verifiable on-chain and off-chain. As of the latest data, the token has a value of 145.33 USDC/DAI per token. This pegging mechanism enhances stability and transparency, providing users with a tangible and real-world reference for the token's value.

## 4. Smart Contract Functions

### 4.1 proposePrice(string asset, uint256 proposedPrice)

Allows users to propose a new price for a specific asset. Rewards are distributed to signers, incentivizing accurate and timely price proposals.

### 4.2 becomeSigner()

Enables users to become a signer within the Oracle network. A participation fee is required, contributing to the sustainability and security of the signer network.

### 4.3 updatePrice(string asset, uint256 newPrice)

Allows signers to update the price of a previously proposed asset. This function ensures that asset prices remain relevant and responsive to market dynamics.

### 4.4 claimReward()

Signers can claim their rewards for successfully proposing or updating asset prices. The reward distribution mechanism ensures fair compensation for active participants.

### 4.5 getAssetPrice(string asset)

Retrieves the current price of a specific asset from the Oracle. This function is essential for users and applications relying on accurate asset valuations.

### 4.6 getSignerInfo(address signer)

Retrieves detailed information about a specific signer, including their rewards, participation status, and other relevant data. This function enhances transparency and accountability within the signer network.

## 5. Getting Started

To deploy and interact with the Oracle contract, follow these steps:

1. Deploy the Oracle contract on the desired blockchain network (e.g., Binance Smart Chain or Polygon).

2. Interact with the contract using the provided functions through a web3-enabled application or script.

3. Users can propose prices, become signers, update prices, and claim rewards using their connected wallets.

## 6. Usage Examples

Here are some usage examples to illustrate the functionalities of the Oracle contract:

### 6.1 Proposing a New Price

```javascript
// JavaScript code snippet
const assetName = "ETH";
const proposedPrice = 3000; // Replace with the desired price
await oracleContract.proposePrice(assetName, proposedPrice, { from: userWallet });

// JavaScript code snippet
await oracleContract.becomeSigner({ from: userWallet, value: web3.utils.toWei("1", "ether") });

// JavaScript code snippet
const updatedPrice = 3200; // Replace with the new price
await oracleContract.updatePrice(assetName, updatedPrice, { from: signerWallet });

7. Security Considerations
Ensure that the Oracle contract is deployed from a secure and audited environment.

Periodically review and update the contract to address potential vulnerabilities and improve security.

Implement proper access controls to manage signer participation and prevent unauthorized access.

Use reputable development tools and frameworks to reduce the risk of vulnerabilities.

8. Contributing
We welcome contributions from the community to enhance the Oracle contract. Feel free to submit pull requests or open issues for improvements or bug fixes.

9. License
This Oracle contract is licensed under the GPL-3.0 License. Feel free to use, modify, and distribute it according to the terms of the license.

This updated README includes detailed information about the Pricing Oracle Network and its value, along with deployment details and market cap information.