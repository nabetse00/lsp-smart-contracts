// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.0;

// modules
import "./ERC725XInitAbstract.sol";
import "./ERC725YInitAbstract.sol";

/**
 * @title Inheritable Proxy Implementation of ERC725 bundle
 * @author Fabian Vogelsteller <fabian@lukso.network>
 * @dev Bundles ERC725XInit and ERC725YInit together into one smart contract
 */
abstract contract ERC725InitAbstractV2 is
    ERC725XInitAbstractV2,
    ERC725YInitAbstractV2
{
    /**
     * @notice Sets the owner of the contract
     * @param _newOwner the owner of the contract
     */
    function initialize(address _newOwner)
        public
        virtual
        override(ERC725XInitAbstractV2, ERC725YInitAbstractV2)
        onlyInitializing
    {
        ERC725XInitAbstractV2.initialize(_newOwner);
        ERC725YInitAbstractV2.initialize(_newOwner);
    }

    // NOTE this implementation has not by default: receive() external payable {}
}
