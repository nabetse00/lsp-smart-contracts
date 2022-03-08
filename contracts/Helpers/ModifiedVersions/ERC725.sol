// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.0;

// modules
import "./ERC725X.sol";
import "./ERC725Y.sol";

/**
 * @title ERC725 bundle
 * @author Fabian Vogelsteller <fabian@lukso.network>
 * @dev Bundles ERC725X and ERC725Y together into one smart contract
 */
contract ERC725V2 is ERC725XV2, ERC725YV2 {
    /**
     * @notice Sets the owner of the contract
     * @param _newOwner the owner of the contract
     */
    // solhint-disable no-empty-blocks
    constructor(address _newOwner) ERC725XV2(_newOwner) ERC725YV2(_newOwner) {}

    // NOTE this implementation has not by default: receive() external payable {}
}
