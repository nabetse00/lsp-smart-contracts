// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.4;

interface IReverseVerification {
    function checkPermissions(address controller, bytes calldata callData)
        external
        returns (bytes4);
}
