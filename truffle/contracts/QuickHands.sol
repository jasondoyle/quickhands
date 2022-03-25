// SPDX-License-Identifier: MIT
// File: contracts/QuickHands.sol

pragma solidity ^0.8.7;

contract QuickHands {
    
    event RescueAttempt (
        uint indexed date,
        uint256 indexed scamTxHash,
        address victimWallet,
        address backupWallet,
        address indexed token,
        uint amount
    );

    address public owner;
    struct Profile {
        uint created; 
        address backupWallet;
        bool enrolled;
        address[] enrolledTokens; 
    }
    mapping(address => Profile) private users;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the contract owner can perform this operation");
        _;
    }

    function isEnrolled() external view returns (bool) {
        return users[msg.sender].enrolled;
    }

    function getUserProfile() external view returns (Profile memory) {
        require(users[msg.sender].enrolled, "User not enrolled");
        return users[msg.sender];
    }

    function getUserProfileByAddress(address user) external view onlyOwner returns (Profile memory) {
        require(users[user].enrolled, "User not enrolled");
        return users[user];
    }

    function enrollUser(address backupWallet) external {
        Profile memory newProfile;
        newProfile.created = block.timestamp;
        newProfile.backupWallet = backupWallet;
        newProfile.enrolled = true;
        users[msg.sender] = newProfile;
    }

    function deleteUser() external { 
        require(users[msg.sender].enrolled, "User not enrolled");
        delete users[msg.sender];
    }

    function enrollToken(address token) external {
        require(IERC20(token).allowance(
            msg.sender,
            address(this)) > 0, "Can not enroll token before spend approval"
        );
        require(users[msg.sender].enrolled, "User not enrolled");
        
        uint numAddresses = users[msg.sender].enrolledTokens.length;
        for (uint i=0; i<numAddresses; i++) {
            if (users[msg.sender].enrolledTokens[i] == token) {
                revert("This token has already been added");
            }
        }
        users[msg.sender].enrolledTokens.push(token);
    }

    function rescueToken(uint256 scamTxHash, address token, address victimWallet, uint256 amount) external onlyOwner { 
        require(IERC20(token).allowance(
            victimWallet,
            address(this)) >= amount, "Failed: Insufficient allowance"
        );

        emit RescueAttempt(
            block.timestamp, 
            scamTxHash, 
            victimWallet, 
            users[victimWallet].backupWallet,
            token, 
            amount
        );

        bool sent = IERC20(token).transferFrom(
            victimWallet,
            users[victimWallet].backupWallet,
            amount
        );

        if (!sent) { revert('Failed to transfer tokens to backup wallet'); }
    }
}

/**
 * @dev Interface of the ERC20 standard as defined in the EIP.
 * 
 * OpenZeppelin Contracts (last updated v4.5.0) (token/ERC20/IERC20.sol)
 */
interface IERC20 {
    /**
     * @dev Returns the amount of tokens in existence.
     */
    function totalSupply() external view returns (uint256);

    /**
     * @dev Returns the amount of tokens owned by `account`.
     */
    function balanceOf(address account) external view returns (uint256);

    /**
     * @dev Moves `amount` tokens from the caller's account to `to`.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transfer(address to, uint256 amount) external returns (bool);

    /**
     * @dev Returns the remaining number of tokens that `spender` will be
     * allowed to spend on behalf of `owner` through {transferFrom}. This is
     * zero by default.
     *
     * This value changes when {approve} or {transferFrom} are called.
     */
    function allowance(address owner, address spender) external view returns (uint256);

    /**
     * @dev Sets `amount` as the allowance of `spender` over the caller's tokens.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * IMPORTANT: Beware that changing an allowance with this method brings the risk
     * that someone may use both the old and the new allowance by unfortunate
     * transaction ordering. One possible solution to mitigate this race
     * condition is to first reduce the spender's allowance to 0 and set the
     * desired value afterwards:
     * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
     *
     * Emits an {Approval} event.
     */
    function approve(address spender, uint256 amount) external returns (bool);

    /**
     * @dev Moves `amount` tokens from `from` to `to` using the
     * allowance mechanism. `amount` is then deducted from the caller's
     * allowance.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external returns (bool);

    /**
     * @dev Emitted when `value` tokens are moved from one account (`from`) to
     * another (`to`).
     *
     * Note that `value` may be zero.
     */
    event Transfer(address indexed from, address indexed to, uint256 value);

    /**
     * @dev Emitted when the allowance of a `spender` for an `owner` is set by
     * a call to {approve}. `value` is the new allowance.
     */
    event Approval(address indexed owner, address indexed spender, uint256 value);
}