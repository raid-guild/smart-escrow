// SPDX-License-Identifier: MIT
// solhint-disable

import "../interfaces/ISmartInvoice.sol";

pragma solidity ^0.8.0;

contract MockSmartInvoice is ISmartInvoice {
    address private invoiceToken;

    constructor(address _token) {
        invoiceToken = _token;
    }

    function init(
        address,
        address,
        uint8,
        address,
        address,
        uint256[] calldata,
        uint256, // exact termination date in seconds since epoch
        uint256,
        bytes32,
        address
    ) external override {}

    function release() external override {}

    function release(uint256 _milestone) external override {}

    function releaseTokens(address _token) external override {}

    function withdraw() external override {}

    function withdrawTokens(address _token) external override {}

    function lock(bytes32 _details) external payable override {}

    function resolve(
        uint256 _clientAward,
        uint256 _providerAward,
        bytes32 _details
    ) external override {}

    function token() external view override returns (address) {
        return invoiceToken;
    }

    function provider() external view override returns (address) {
        return msg.sender;
    }
}
