// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./FiveLab_Whitelist.sol";

contract FiveLab_Nft is ERC721, Ownable {
    uint256 private _counter = 0;
    string private _baseUriStr;
    string public contractUri;
    uint256 public QUANTITY = 100000;

    // 0: not started, 1: premint, 2: public mint
    uint256[] public price = [0, 70 ether, 100 ether];
    uint8 public step = 0;

    // whitelist contract address
    address public _whitelistContract = 0x0000000000000000000000000000000000000000;

    address public ownerAddress = 0x0000000000000000000000000000000000000000;
    address public devAddress = 0x0000000000000000000000000000000000000000;

    constructor(
        string memory baseUriStr,
        string memory contractUriStr,
        address whitelistContract
    ) ERC721("FiveLab", "FiveLab") {
        _baseUriStr = baseUriStr;
        contractUri = contractUriStr;
        _whitelistContract = whitelistContract;
    }

    function mint(uint256 _count) public payable {
        require(step > 0, "Minting not started");
        require(msg.value >= price[step] * _count, "Value below the price");
        require(_counter + _count < QUANTITY, "Total supply exceeds the limit");
        for (uint256 i = 0; i < _count; i++) {
            _safeMint(msg.sender, _counter);
        }
        _counter += _count;

        // transfer money
        uint256 ownerValue = price[step] * _count * 90 / 100;
        uint256 devValue = msg.value - ownerValue;
        _withdraw(ownerAddress, ownerValue);
        _withdraw(devAddress, devValue);
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return _baseUriStr;
    }

    function setBaseURI(string memory str) external onlyOwner {
        _baseUriStr = str;
    }

    function setContractUri(string memory str) external onlyOwner {
        contractUri = str;
    }

    function setWhitelistAddress(address addr) external onlyOwner {
        _whitelistContract = addr;
    }

    function _withdraw(address _address, uint256 _amount) private {
        (bool success, ) = _address.call{value: _amount}("");
        require(success, "Transfer failed.");
    }

    function ownedTokens(address addr_) public view returns (uint256[] memory) {
        uint256 balance = balanceOf(addr_);
        uint256[] memory ret = new uint256[](balance);
        uint256 k = 0;
        for (uint256 i = 0; i < _counter; i++) {
            if (_exists(i) && ownerOf(i) == addr_) {
                ret[k++] = i;
            }
        }
        return ret;
    }

    function totalSupply() public view returns (uint256) {
        uint256 cnt = 0;
        for (uint256 i = 0; i < _counter; i++) {
            if (_exists(i)) {
                cnt++;
            }
        }
        return cnt;
    }

    function isWhitelist(address addr) public view returns (bool) {
        return FiveLab_Whitelist(_whitelistContract).isWhitelist(addr);
    }
}
