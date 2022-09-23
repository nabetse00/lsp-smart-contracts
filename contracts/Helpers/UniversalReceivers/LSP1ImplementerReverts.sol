// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.0;

import {ILSP1UniversalReceiver} from "../../LSP1UniversalReceiver/ILSP1UniversalReceiver.sol";
import {ERC165Storage} from "@openzeppelin/contracts/utils/introspection/ERC165Storage.sol";
import {_INTERFACEID_LSP1} from "../../LSP1UniversalReceiver/LSP1Constants.sol";

contract LSP1ImplementerReverts is ILSP1UniversalReceiver, ERC165Storage {

    constructor() {
        _registerInterface(_INTERFACEID_LSP1);
    }

    function universalReceiver(bytes32 typeId, bytes calldata data)
        external
        payable
        returns (bytes memory) {
            revert("!");
        }

}