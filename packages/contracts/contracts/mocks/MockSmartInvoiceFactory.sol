// SPDX-License-Identifier: MIT
// solhint-disable

import "../interfaces/ISmartInvoiceFactory.sol";
import "./MockSmartInvoice.sol";

pragma solidity ^0.8.0;

contract MockSmartInvoiceFactory is ISmartInvoiceFactory {
    function create(
        address,
        address,
        uint8,
        address,
        address _token,
        uint256[] calldata,
        uint256,
        bytes32
    ) external override returns (address) {
        return address(new MockSmartInvoice(_token));
    }

    function createDeterministic(
        address,
        address,
        uint8,
        address,
        address,
        uint256[] calldata,
        uint256,
        bytes32,
        bytes32
    ) external override returns (address) {}

    function predictDeterministicAddress(bytes32)
        external
        override
        returns (address)
    {}
}
