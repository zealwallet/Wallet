pragma solidity 0.8.21;

import {Factory} from "./Factory.sol";
import {FactoryErrors} from "./FactoryErrors.sol";
import {SignerProxy} from "./SignerProxy.sol";

contract FactoryRef is Factory {
    struct signerData {
        uint256 x;
        uint256 y;
        address signer;
    }

    mapping(bytes32 => signerData) public recoveryData;

    constructor(address _deploymentRouter) Factory(_deploymentRouter) {}

    function _checkCaller(bytes32 _recoveryId, uint256 _x, uint256 _y) internal override returns (bytes32) {
        bytes32 salt = keccak256(abi.encodePacked(_recoveryId, _x, _y));
        address signer = _getAddress(IMPLEMENTATION_SIGNER, address(this), type(SignerProxy).creationCode, salt);

        if (recoveryData[_recoveryId].signer != address(0)) revert FactoryErrors.SignerExist();
        recoveryData[_recoveryId] = signerData(_x, _y, signer);

        address safe = _getSafeAddress(signer, _recoveryId, _x, _y);

        if (msg.sender == safe) {
            return salt;
        } else {
            revert FactoryErrors.SaltDoesNotMatchSafe();
        }
    }
}
