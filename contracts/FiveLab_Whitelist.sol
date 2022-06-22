// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

import "@openzeppelin/contracts/access/Ownable.sol";

contract FiveLab_Whitelist is Ownable {
    mapping (address => bool) public isWhitelist;
    address[] public whitelist;

    constructor() {
    }

    function addWhitelist(address[] memory _whitelist) external onlyOwner {
        for (uint256 i = 0; i < _whitelist.length; i++) {
            whitelist.push(_whitelist[i]);
        }
    }
}
