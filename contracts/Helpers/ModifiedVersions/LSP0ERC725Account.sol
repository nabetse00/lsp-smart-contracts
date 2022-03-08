// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

// modules
import "./LSP0ERC725AccountCore.sol";
import "./ERC725.sol";

/**
 * @title Implementation of ERC725Account
 * @author Fabian Vogelsteller <fabian@lukso.network>, Jean Cavallera (CJ42), Yamen Merhi (YamenMerhi)
 * @dev Bundles ERC725X and ERC725Y, ERC1271 and LSP1UniversalReceiver and allows receiving native tokens
 */
contract LSP0ERC725AccountV2 is LSP0ERC725AccountCoreV2, ERC725V2 {
    /**
     * @notice Sets the owner of the contract and register ERC725Account, ERC1271 and LSP1UniversalReceiver interfacesId
     * @param _newOwner the owner of the contract
     */
    constructor(address _newOwner) ERC725V2(_newOwner) {
        _registerInterface(_INTERFACEID_LSP0);
        _registerInterface(_INTERFACEID_ERC1271);
        _registerInterface(_INTERFACEID_LSP1);
    }
}
