// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.6;

// modules
import "./LSP6KeyManagerInitAbstract.sol";

/**
 * @title Proxy implementation of a contract acting as a controller of an ERC725 Account, using permissions stored in the ERC725Y storage
 * @author Fabian Vogelsteller, Jean Cavallera
 * @dev all the permissions can be set on the ERC725 Account using `setData(...)` with the keys constants below
 */
contract LSP6KeyManagerInitV2 is LSP6KeyManagerInitAbstractV2 {
    /**
     * @inheritdoc LSP6KeyManagerInitAbstractV2
     */
    function initialize(address _account) public virtual override initializer {
        LSP6KeyManagerInitAbstractV2.initialize(_account);
    }
}
