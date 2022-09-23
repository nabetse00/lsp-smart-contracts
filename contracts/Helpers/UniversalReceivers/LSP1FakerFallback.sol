// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

import {ILSP1UniversalReceiver} from "../../LSP1UniversalReceiver/ILSP1UniversalReceiver.sol";
import {ERC165Storage} from "@openzeppelin/contracts/utils/introspection/ERC165Storage.sol";
import {_INTERFACEID_LSP1} from "../../LSP1UniversalReceiver/LSP1Constants.sol";

/**
 * @dev sample contract used for testing
 */
contract LSP1FakerFallback is ERC165Storage {

    event Fallback(string message);
    constructor() {
        _registerInterface(_INTERFACEID_LSP1);
    }

    fallback() external payable {
        emit Fallback("fallback!");
    }
}
