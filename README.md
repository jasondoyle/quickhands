# quickhands
 A web3 project to front run scammers of your coins. 
 
It began as an idea to figure out a way to protect a user’s tokens before their wallet got drained by a malicious contract that was signed. Without much knowledge of the blockchain and the evm, I started developing around the basic idea that if you can monitor the mempool to see what is about to happen, why can't we prevent scams? I thought I had a great idea to get my feet wet in the web3 world. The design was like this. First, enroll with QuickHands by signing in and then providing a backup wallet. Then, give the QuickHands contract unlimited spend approval so when a scam transaction is detected, your tokens are quickly sent to your backup wallet by providing more gas than the scammer to front-run the spending of your tokens.

The scam detection was originally thought to work in two ways. When manually set to armed by the user, the backend would trigger a front-running transaction anytime an enrolled token was being sent out of the user’s wallet. This would be triggered by the detection of either a IERC20.transfer() or IERC20.approve() method being called. I’m sure there are more methods that would need to be accounted for if the project were to be pursued more seriously. And, when unarmed, the user’s wallet would still being protected to an extent by watching for any transactions removing funds by a known scam address. I actually never found a good source of malicious wallet or contract addresses that was being updated regularly. 

It wasn't long before I realized this project wouldn’t go anywhere but I finished it anyways because I wanted to create a first Dapp that was a bit more sophisticated than “Hello World”. Anyways, here are the reasons in my opinion, ordered from bad to showstopper, as to why this would never be an actual solution.

1. No one wants to sign a contract with unlimited spend approval as it increases their exposure and risk of loss. 
2. As a guess, the majority of victims falling for these types of scams wouldn’t have any idea they should enroll in a security service to protect their tokens. And the more sophisticated users would refer to my first point #1. 
3. I never found a good way to collect gas money. Executing IERC20.transferFrom() from the QuickHands smart contract requires the gas to be paid by the contract, not the user. And since front-running is such a time sensitive operation, the contract could not selfishly transfer out gas money from the user’s wallet and then proceed to protect the user’s tokens. Though, at the same time, that could actually work since removing any amount from the user’s balance would cause the scammer’s transaction to fail. Then the contract could subsequently send the remaining balance to the victim’s backup wallet.
4. And for the showstopper. The native tokens of each chain (e.g., ETH on Ethereum or BNB on Binance Smart Chain) are not actual ERC20 or BEP20 compliant tokens. This one took me by surprise near the completion of the project. You can’t actually call approve() on native tokens of a chain and, therefore, rendered the entire project useless for the purposes of having an actual security solution.

Overall, I just think wallets should probably have a feature to notify users when they are about to interact with a malicious contract. 

This Dapp works as a proof of concept for front-running and generally works. But not for native tokens.

Learned a ton. Onto the next project. 
 
<p align="center">
  <img width="698" alt="tokens" src="https://user-images.githubusercontent.com/2999212/160060748-d844de28-c080-499d-ac0b-f04f4b491525.png">
  <img width="696" alt="settings" src="https://user-images.githubusercontent.com/2999212/160060605-8e2df541-3fdc-4bb4-93c7-8b91ea065e30.png">
  <img width="697" alt="events" src="https://user-images.githubusercontent.com/2999212/160060613-6d5af824-458a-42b4-8662-ca47705ba6ec.png">
 </p>
