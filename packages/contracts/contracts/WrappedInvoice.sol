// SPDX-License-Identifier: MIT
// solhint-disable not-rely-on-time, max-states-count

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "./interfaces/ISmartInvoice.sol";
import "./interfaces/IWrappedInvoice.sol";
import "./libraries/Percentages.sol";

contract WrappedInvoice is
    IWrappedInvoice,
    Initializable,
    Context,
    ReentrancyGuard
{
    using SafeERC20 for IERC20;

    address public parent;
    address public child;
    uint256 public splitParent;
    uint256 public splitChild;
    uint256 public splitTotal;
    address public token;
    ISmartInvoice public invoice;

    event Withdraw(address token, uint256 parentShare, uint256 childShare);

    modifier onlyRaider() {
        require(_msgSender() == parent || _msgSender() == child, "!raider");
        _;
    }

    function initLock() external initializer {}

    function init(
        address _parent,
        address _child,
        address _invoice,
        uint256[] calldata _splitRatio // for 10% => 1:9 => splitRatio must be input as [1, 9]
    ) external override initializer {
        require(_parent != address(0), "invalid parent");
        require(_child != address(0), "invalid child");
        require(_invoice != address(0), "invalid invoice");

        parent = _parent;
        child = _child;
        invoice = ISmartInvoice(_invoice);

        require(_splitRatio.length == 2, "invalid ratio");
        splitParent = _splitRatio[0];
        splitChild = _splitRatio[1];

        require(splitParent > 0 && splitChild > 0, "invalid split");
        splitTotal = splitParent + splitChild;

        token = invoice.token();

        require(invoice.provider() == address(this), "invalid invoice");
    }

    function _withdraw(address _token, uint256 _amount) internal {
        uint256 balance = IERC20(_token).balanceOf(address(this));
        require(balance >= _amount, "not enough balance");

        uint256 parentShare =
            Percentages.maxAllocation(splitChild, splitTotal, _amount);
        uint256 childShare = balance - parentShare;

        IERC20(_token).safeTransfer(parent, parentShare);
        IERC20(_token).safeTransfer(child, childShare);

        emit Withdraw(_token, parentShare, childShare);
    }

    function withdrawAll() external override nonReentrant {
        uint256 balance = IERC20(token).balanceOf(address(this));
        _withdraw(token, balance);
    }

    function withdrawAll(address _token) external override nonReentrant {
        uint256 balance = IERC20(_token).balanceOf(address(this));
        _withdraw(_token, balance);
    }

    function withdraw(uint256 _amount) external override nonReentrant {
        _withdraw(token, _amount);
    }

    function withdraw(address _token, uint256 _amount)
        external
        override
        nonReentrant
    {
        _withdraw(_token, _amount);
    }

    function _disperse(
        uint256[] calldata _amounts,
        address[] calldata _fundees,
        address _token,
        uint256 _amount
    ) internal {}

    function disperseAll(
        uint256[] calldata _amounts,
        address[] calldata _fundees
    ) external override nonReentrant onlyRaider {}

    function disperseAll(
        uint256[] calldata _amounts,
        address[] calldata _fundees,
        address _token
    ) external override nonReentrant onlyRaider {}

    function disperse(
        uint256[] calldata _amounts,
        address[] calldata _fundees,
        uint256 _amount
    ) external override nonReentrant onlyRaider {}

    function disperse(
        uint256[] calldata _amounts,
        address[] calldata _fundees,
        address _token,
        uint256 _amount
    ) external override nonReentrant onlyRaider {}

    function lock(bytes32 _details) external payable override onlyRaider {
        invoice.lock(_details);
    }
}
