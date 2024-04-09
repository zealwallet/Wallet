pragma solidity 0.8.21;

/**
 * @title EIP1271
 * @dev Abstract contract for the EIP1271 standard.
 */
abstract contract EIP1271 {
    bytes4 internal constant EIP1271_MAGICVALUE_BYTES32 = 0x1626ba7e;
    bytes4 internal constant EIP1271_MAGICVALUE_BYTES = 0x20c13b0b;

    /**
     * @dev Verifies the validity of a signature for a given hash.
     * @param _hash The hash to be verified.
     * @param _signature The signature to be checked.
     * @return magicValue A boolean indicating whether the signature is valid or not.
     */
    function isValidSignature(bytes32 _hash, bytes memory _signature)
        external
        view
        virtual
        returns (bytes4 magicValue);

    /**
     * @dev Verifies the validity of a signature.
     * @param _data The data to be verified.
     * @param _signature The signature to be verified.
     * @return magicValue A boolean indicating whether the signature is valid or not.
     */
    function isValidSignature(bytes memory _data, bytes memory _signature)
        external
        view
        virtual
        returns (bytes4 magicValue);
}
