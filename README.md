# Zilliqa Light Wallet

![Zilliqa Light Wallet](https://github.com/zilliqalight/zilliqa-light-wallet/blob/master/assets/zwlscreen.png?v=0.1.1 "Zilliqa Light Wallet")


## Introduction

This project is currently in development and it is under [Zilliqa ecosystem grant programme](https://blog.zilliqa.com/buildonzil-introducing-the-zilliqa-ecosystem-grant-programme-6ccb98892712).

Currently it supports below features on [Zilliqa Testnet v3.0](https://explorer.zilliqa.com/). To apply Testnet token, please go to [Zilliqa Gitter Channel](https://gitter.im/Zilliqa/General) to apply. We are currently using [viewblock](https://viewblock.io/zilliqa) for transactions

| Feature        | Status           |
| ------------- |:-------------:|
| Create and reset local wallet      | done |
| Create account      | done      |
| Display mnemonic | done      |
| Sign out | done      |
| Import account by private key | done      |
| Import account by mnemonic | done      |
| Import account by keystore | done      |
| Multiple account switching | done      |
| Display account balance | done      |
| Export keystore | done      |
| Send fund | done      |
| Receive fund address/QRcode | done      |
| Recent transactions history | done      |

Mainnet support will be available once it is released.

## how to install the wallet locally

Prerequisite: yarn, git, node

1. Git clone to local folder

```git clone https://github.com/zilliqalight/zilliqa-light-wallet```

2. Add dependencies and build the source

```yarn```

```yarn build```

3. Installation
Open chrome, go to `chrome://extensions/`
Turn on developer mode
Click "Load unpacked"

![Build from source](https://github.com/zilliqalight/zilliqa-light-wallet/blob/master/assets/chromeextension.png "Chrom Extension")

Locate ```zilliqa-light-wallet/build``` folder, click select
You should see plugin added to Chrome plugin bar,click to start to use it.

## Install from google store
Coming soon
