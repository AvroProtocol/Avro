// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {AvyroAccount} from "./AvyroAccount.sol";

/**
 * @title AvyroFactory
 * @notice Factory for deploying Avyro 2-of-3 threshold smart accounts via CREATE2
 */
contract AvyroFactory {
    address public immutable entryPoint;

    event AccountCreated(address indexed account, address shardA, address shardB, address shardC);

    constructor(address _entryPoint) {
        entryPoint = _entryPoint;
    }

    /**
     * @notice Create a new AvyroAccount deterministically
     */
    function createAccount(
        address shardA,
        address shardB,
        address shardC,
        bytes32 salt
    ) external returns (AvyroAccount ret) {
        address addr = getAddress(shardA, shardB, shardC, salt);
        uint256 codeSize = addr.code.length;
        if (codeSize > 0) {
            return AvyroAccount(payable(addr));
        }

        ret = new AvyroAccount{salt: salt}(entryPoint, shardA, shardB, shardC);
        emit AccountCreated(address(ret), shardA, shardB, shardC);
    }

    /**
     * @notice Calculate the counterfactual address of this account as it would be returned by createAccount()
     */
    function getAddress(
        address shardA,
        address shardB,
        address shardC,
        bytes32 salt
    ) public view returns (address) {
        bytes memory bytecode = abi.encodePacked(
            type(AvyroAccount).creationCode,
            abi.encode(entryPoint, shardA, shardB, shardC)
        );
        bytes32 hash = keccak256(
            abi.encodePacked(bytes1(0xff), address(this), salt, keccak256(bytecode))
        );
        return address(uint160(uint256(hash)));
    }
}
