// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.4;

import {LSP6KeyManager} from "../../LSP6KeyManager/LSP6KeyManager.sol";

contract KeyManagerReversePermissionFail is LSP6KeyManager {
    constructor(address _account) LSP6KeyManager(_account) {}

    function checkPermissions(address controller, bytes calldata callData)
        external
        override
        returns (bytes4)
    {
        _verifyPermissions(controller, callData);
        return 0xdeadbeef;
    }
}
