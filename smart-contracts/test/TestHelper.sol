pragma solidity 0.8.21;

import "./Base.t.sol";

struct UserOperation {
    address sender;
    uint256 nonce;
    bytes initCode;
    bytes callData;
    uint256 callGasLimit;
    uint256 verificationGasLimit;
    uint256 preVerificationGas;
    uint256 maxFeePerGas;
    uint256 maxPriorityFeePerGas;
    bytes paymasterAndData;
    bytes signature;
}

interface IENTRYPOINT {
    function getUserOpHash(UserOperation calldata userOp) external view returns (bytes32);
    function handleOps(UserOperation[] calldata userOps, address payable beneficiary) external;
}

interface ISM {
    function SUPPORTED_ENTRYPOINT() external view returns (address);
    function getOperationHash(UserOperation calldata userOp) external view returns (bytes32 operationHash);
}

contract TestHelper is BaseTest {
    address immutable ENTRYPOINT;
    address payable constant BENEFICARY = payable(address(11111111));

    bytes32 private constant SAFE_OP_TYPEHASH = 0x84aa190356f56b8c87825f54884392a9907c23ee0f8e1ea86336b763faf021bd;

    constructor() {
        ENTRYPOINT = ISM(SAFE_4337_MODULE).SUPPORTED_ENTRYPOINT();
    }

    UserOperation public userOpBase = UserOperation({
        sender: address(0),
        nonce: 0,
        initCode: new bytes(0),
        callData: new bytes(0),
        callGasLimit: 10000000,
        verificationGasLimit: 20000000,
        preVerificationGas: 20000000,
        maxFeePerGas: 2,
        maxPriorityFeePerGas: 1,
        paymasterAndData: new bytes(0),
        signature: new bytes(0)
    });

    function getSender(UserOperation calldata userOp) internal pure returns (address) {
        address data;
        assembly {
            data := calldataload(userOp)
        }
        return address(uint160(data));
    }

    function gasPrice(UserOperation calldata userOp) internal view returns (uint256) {
        unchecked {
            uint256 maxFeePerGas = userOp.maxFeePerGas;
            uint256 maxPriorityFeePerGas = userOp.maxPriorityFeePerGas;
            if (maxFeePerGas == maxPriorityFeePerGas) {
                return maxFeePerGas;
            }
            return min(maxFeePerGas, maxPriorityFeePerGas + block.basefee);
        }
    }

    function min(uint256 a, uint256 b) internal pure returns (uint256) {
        return a < b ? a : b;
    }

    function buildUserOp(address sender, uint256 nonce, bytes memory initCode, bytes memory callData)
        public
        view
        returns (UserOperation memory userOp)
    {
        userOp = userOpBase;
        userOp.sender = sender;
        userOp.nonce = nonce;
        userOp.initCode = initCode;
        userOp.callData = callData;
    }

    function buildExecutionPayload(address to, uint256 value, bytes memory data, Enum.Operation operation)
        internal
        pure
        returns (bytes memory)
    {
        return abi.encodeWithSignature("executeUserOp(address,uint256,bytes,uint8)", to, value, data, operation);
    }

    function _signUserOp(UserOperation memory userOp, uint256 signer) internal returns (UserOperation[] memory) {
        bytes32 opHash = IENTRYPOINT(ENTRYPOINT).getUserOpHash(userOp);

        uint48 validAfter = uint48(0);
        uint48 validUntil = uint48(0);
        bytes memory signature = abi.encodePacked(validAfter, validUntil, "");
        userOp.signature = signature;
        bytes32 message = ISM(SAFE_4337_MODULE).getOperationHash(userOp);

        (uint8 v, bytes32 r, bytes32 s) = vm.sign(signer, message);
        signature = abi.encodePacked(r, s, v);
        userOp.signature = abi.encodePacked(validAfter, validUntil, signature);

        UserOperation[] memory userOpArray = new UserOperation[](1);
        userOpArray[0] = userOp;

        return userOpArray;
    }
}
