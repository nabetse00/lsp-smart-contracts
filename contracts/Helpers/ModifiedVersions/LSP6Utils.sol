// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

// constants
import "./LSP6Constants.sol";
import "./ERC725Y.sol";

// libraries
import "../../LSP2ERC725YJSONSchema/LSP2Utils.sol";

library LSP6Utils {
    using LSP2Utils for bytes12;

    function getPermissionsFor(ERC725YV2 _account, address _address)
        internal
        view
        returns (bytes32)
    {
        bytes memory permissions = _account.getData(
            LSP2Utils.generateBytes20MappingWithGroupingKey(
                _LSP6_ADDRESS_PERMISSIONS_MAP_KEY_PREFIX,
                bytes20(_address)
            )
        );

        if (bytes32(permissions) == bytes32(0)) {
            revert(
                "LSP6Utils:getPermissionsFor: no permissions set for this address"
            );
        }

        return bytes32(permissions);
    }

    function getAllowedAddressesFor(ERC725YV2 _account, address _address)
        internal
        view
        returns (bytes memory)
    {
        return
            _account.getData(
                LSP2Utils.generateBytes20MappingWithGroupingKey(
                    _LSP6_ADDRESS_ALLOWEDADDRESSES_MAP_KEY_PREFIX,
                    bytes20(_address)
                )
            );
    }

    function getAllowedFunctionsFor(ERC725YV2 _account, address _address)
        internal
        view
        returns (bytes memory)
    {
        return
            _account.getData(
                LSP2Utils.generateBytes20MappingWithGroupingKey(
                    _LSP6_ADDRESS_ALLOWEDFUNCTIONS_MAP_KEY_PREFIX,
                    bytes20(_address)
                )
            );
    }
}
