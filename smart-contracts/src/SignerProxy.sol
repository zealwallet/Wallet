pragma solidity 0.8.21;

library proxyErrors {
    error IncorrectImplementationAddress();
}

contract SignerProxy {
    // Internal variable to store the implementation contract's address.
    address internal __implementation__;

    // Constructor sets the implementation contract's address.
    // @param _implementation: Address of the implementation contract.
    // Reverts if the provided implementation address is zero.
    constructor(address _implementation) {
        if (_implementation != address(0)) {
            __implementation__ = _implementation;
        } else {
            revert proxyErrors.IncorrectImplementationAddress();
        }
    }

    fallback() external payable {
        // solhint-disable-next-line no-inline-assembly
        assembly {
            // Load the address of the implementation contract.
            let _implementation := and(sload(0), 0xffffffffffffffffffffffffffffffffffffffff)
            // Special handling for specific function signature 0x5c60da1b keccak("implementation()").
            // If this signature is detected, return the implementation address.
            if eq(calldataload(0), 0x5c60da1b00000000000000000000000000000000000000000000000000000000) {
                mstore(0, _implementation)
                return(0, 0x20)
            }

            // Forward all other calls to the implementation contract.
            // Copy calldata to memory and perform a delegatecall.
            calldatacopy(0, 0, calldatasize())
            let success := delegatecall(gas(), _implementation, 0, calldatasize(), 0, 0)

            // Copy the returned data.
            returndatacopy(0, 0, returndatasize())

            // Revert if the delegatecall failed, otherwise return the data.
            if eq(success, 0) { revert(0, returndatasize()) }
            return(0, returndatasize())
        }
    }
}
