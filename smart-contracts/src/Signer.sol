pragma solidity 0.8.21;

import {FCL_WebAuthn} from "@FreshCryptoLib/FCL_Webauthn.sol";
import {Initializable} from "@openzeppelin/proxy/utils/Initializable.sol";
import {EIP1271} from "./EIP1271.sol";

library SignerErrors {
    error InvalidSignature();
}

/**
 * @title Signer
 * @dev A contract that implements the EIP1271 interface and is initialized using Initializable.
 */
contract Signer is EIP1271, Initializable {
    address private _empty_slot_ = address(0);
    uint256 public x;
    uint256 public y;

    constructor() {
        _disableInitializers();
    }

    /**
     * @dev Initializes the signer contract with the given x and y coordinates.
     * @param _x The x coordinate of the signer's public key.
     * @param _y The y coordinate of the signer's public key.
     */
    function initialize(uint256 _x, uint256 _y) external initializer {
        x = _x;
        y = _y;
    }

    // Returns the public key coordinates.
    // @return uint256[2] memory: Array containing the x and y coordinates.
    function getPublicKey() internal view returns (uint256[2] memory key) {
        return [x, y];
    }

    // @inheritdoc EIP1271
    function isValidSignature(bytes32 _hash, bytes memory _signature) external view override returns (bytes4) {
        _validate(abi.encode(_hash), _signature);
        return EIP1271_MAGICVALUE_BYTES32;
    }

    // @inheritdoc EIP1271
    function isValidSignature(bytes memory _hash, bytes memory _signature) external view override returns (bytes4) {
        _validate(_hash, _signature);
        return EIP1271_MAGICVALUE_BYTES;
    }

    function checkSignature(
        bytes calldata authenticatorData,
        bytes1 authenticatorDataFlagMask,
        bytes calldata clientData,
        bytes32 clientChallenge,
        uint256 clientChallengeDataOffset,
        uint256[2] calldata rs,
        uint256[2] calldata Q
    ) external view returns (bool) {
        return FCL_WebAuthn.checkSignature(
            authenticatorData, authenticatorDataFlagMask, clientData, clientChallenge, clientChallengeDataOffset, rs, Q
        );
    }

    // Internal function to validate a signature.
    // @param _hash: The hash to validate against.
    // @param _signature: The signature to validate.
    // Throws InvalidSignature if the signature is invalid.
    function _validate(bytes memory _hash, bytes memory _signature) private view {
        (bytes memory authenticatorData, bytes memory clientData, uint256 challengeOffset, uint256[2] memory rs) =
            abi.decode(_signature, (bytes, bytes, uint256, uint256[2]));
        if (
            !this.checkSignature(
                authenticatorData, 0x01, clientData, keccak256(_hash), challengeOffset, rs, getPublicKey()
            )
        ) revert SignerErrors.InvalidSignature();
    }
}
