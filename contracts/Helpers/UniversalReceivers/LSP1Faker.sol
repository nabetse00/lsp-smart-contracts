// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;


import {ERC165Storage} from "@openzeppelin/contracts/utils/introspection/ERC165Storage.sol";
import {_INTERFACEID_LSP1} from "../../LSP1UniversalReceiver/LSP1Constants.sol";

/**
 * @dev sample contract used for testing
 */
contract LSP1Faker is ERC165Storage {

    constructor() {
        _registerInterface(_INTERFACEID_LSP1);
    }
}
