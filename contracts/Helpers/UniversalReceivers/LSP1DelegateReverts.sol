// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.0;

// interfaces
import {IERC725Y} from "@erc725/smart-contracts/contracts/interfaces/IERC725Y.sol";
import {
    ILSP1UniversalReceiverDelegate
} from "../../LSP1UniversalReceiver/ILSP1UniversalReceiverDelegate.sol";

// modules
import {ERC165Storage} from "@openzeppelin/contracts/utils/introspection/ERC165Storage.sol";

// constants
import {_INTERFACEID_LSP1_DELEGATE} from "../../LSP1UniversalReceiver/LSP1Constants.sol";

contract LSP1DelegateRevert is ILSP1UniversalReceiverDelegate, ERC165Storage {
    constructor() {
        _registerInterface(_INTERFACEID_LSP1_DELEGATE);
    }

    function universalReceiverDelegate(
        address caller,
        uint256 value,
        bytes32 typeId,
        bytes memory data
    ) external returns (bytes memory result) {
        revert("LSP1Delegate: something went wrong at `universalReceiverDelegate(...)` function");
    }
}
