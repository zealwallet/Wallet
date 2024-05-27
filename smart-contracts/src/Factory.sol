pragma solidity 0.8.21;

import {SignerProxy} from "./SignerProxy.sol";
import {Signer} from "./Signer.sol";
import {DeploymentRouter} from "./DeploymentRouter.sol";
import {SafeProxyFactory} from "@safe-contracts/proxies/SafeProxyFactory.sol";
import {Initializable} from "@openzeppelin/proxy/utils/Initializable.sol";
import {Safe} from "@safe-contracts/Safe.sol";
import {FactoryErrors} from "./FactoryErrors.sol";

contract Factory is Initializable {
    event NewSignerCreated(
        address indexed proxy, bytes32 indexed recoveryId, uint256 x, uint256 y, address implementation
    );
    event NewFactorySetup(address implementation, address deploymentRouter);

    address public IMPLEMENTATION_SIGNER;
    address public SAFE_MODULE;

    address public immutable DEPLOYMENT_ROUTER;
    address internal constant SAFE_FACTORY = 0x4e1DCf7AD4e460CfD30791CCC4F9c8a4f820ec67;
    address internal constant SAFE_SINGLETON = 0x29fcB43b46531BcA003ddC8FCB67FFE91900C762;

    bytes4 internal constant SAFE_SETUP = 0xb63e800d;

    constructor(address _deploymentRouter) {
        DEPLOYMENT_ROUTER = _deploymentRouter;
    }

    function initialize(address _implementation, address _safeModule, uint64 _version)
        external
        reinitializer(_version)
    {
        IMPLEMENTATION_SIGNER = _implementation;
        SAFE_MODULE = _safeModule;
        emit NewFactorySetup(_implementation, _safeModule);
    }

    function getSafeReference() public view returns (address) {
        return SAFE_MODULE;
    }

    function deploy(bytes32 _recoveryId, uint256 _x, uint256 _y) external returns (bool) {
        if (!_isContract(IMPLEMENTATION_SIGNER)) revert FactoryErrors.ImplementationNotDeployed();
        _deploy(_recoveryId, _x, _y);
        return true;
    }

    function _deploy(bytes32 _recoveryId, uint256 _x, uint256 _y) internal {
        bytes32 salt = _checkCaller(_recoveryId, _x, _y);

        address signer = address(_deploySigner(salt));

        Signer(signer).initialize(_x, _y);

        emit NewSignerCreated(signer, _recoveryId, _x, _y, IMPLEMENTATION_SIGNER);
    }

    /**
     * @dev Deploys a new SignerProxy contract using the specified implementation and salt.
     * @param salt The salt value used for contract deployment.
     * @return proxy The deployed SignerProxy contract.
     */
    function _deploySigner(bytes32 salt) internal returns (SignerProxy proxy) {
        bytes memory deploymentData =
            abi.encodePacked(type(SignerProxy).creationCode, uint256(uint160(IMPLEMENTATION_SIGNER)));

        // Deploy the account determinstically based on the salt
        assembly {
            proxy := create2(0x0, add(0x20, deploymentData), mload(deploymentData), salt)
        }
        if (address(proxy) == address(0)) {
            revert FactoryErrors.ProxyNotDeployed();
        }
    }

    /**
     * @dev Checks if the given address is a contract.
     * @param account The address to check.
     * @return A boolean value indicating whether the address is a contract or not.
     */
    function _isContract(address account) internal view returns (bool) {
        uint256 size;
        /* solhint-disable no-inline-assembly */
        /// @solidity memory-safe-assembly
        assembly {
            size := extcodesize(account)
        }
        /* solhint-enable no-inline-assembly */
        return size > 0;
    }

    function _checkCaller(bytes32 _recoveryId, uint256 _x, uint256 _y) internal virtual returns (bytes32) {
        bytes32 salt = keccak256(abi.encodePacked(_recoveryId, _x, _y));
        address signer = _getAddress(IMPLEMENTATION_SIGNER, address(this), type(SignerProxy).creationCode, salt);

        address safe = _getSafeAddress(signer, _recoveryId, _x, _y);

        if (msg.sender == safe) {
            return salt;
        } else {
            revert FactoryErrors.SaltDoesNotMatchSafe();
        }
    }

    function getSignerAddress(bytes32 _recoveryId, uint256 _x, uint256 _y) external view returns (address) {
        bytes32 salt = keccak256(abi.encodePacked(_recoveryId, _x, _y));
        return _getAddress(IMPLEMENTATION_SIGNER, address(this), type(SignerProxy).creationCode, salt);
    }

    function getSafeAddress(address _signer, bytes32 _recoveryId, uint256 _x, uint256 _y)
        external
        view
        returns (address)
    {
        return _getSafeAddress(_signer, _recoveryId, _x, _y);
    }

    function _getSafeAddress(address _signer, bytes32 _hash, uint256 _x, uint256 _y) internal view returns (address) {
        bytes memory data =
            abi.encodeWithSelector(DeploymentRouter(DEPLOYMENT_ROUTER).setupSafe.selector, _hash, _x, _y);
        bytes memory safeSetup = _safeSetup(_signer, DEPLOYMENT_ROUTER, data, address(0), address(0), 0, payable(0));

        bytes memory creationCode = SafeProxyFactory(SAFE_FACTORY).proxyCreationCode();
        bytes32 salt = keccak256(abi.encodePacked(keccak256(safeSetup), uint256(uint160(_signer))));

        return _getAddress(SAFE_SINGLETON, SAFE_FACTORY, creationCode, salt);
    }

    /**
     * @dev Retrieves the address of a deployed contract instance based on the implementation address,
     * deployer address, bytecode, and salt.
     *
     * @param _implementation The address of the contract implementation.
     * @param _deployer The address of the contract deployer.
     * @param _byteCode The bytecode of the contract.
     * @param _salt The salt used for contract deployment.
     *
     * @return The address of the deployed contract instance.
     */
    function _getAddress(address _implementation, address _deployer, bytes memory _byteCode, bytes32 _salt)
        internal
        pure
        returns (address)
    {
        bytes memory deploymentData = abi.encodePacked(_byteCode, uint256(uint160(_implementation)));
        bytes32 hash = keccak256(abi.encodePacked(bytes1(0xff), _deployer, _salt, keccak256(deploymentData)));
        return address(uint160(uint256(hash)));
    }

    /**
     * @dev Encodes the data for the setup of a Safe contract.
     */
    function _safeSetup(
        address _owner,
        address _target,
        bytes memory _data,
        address _fallbackHandler,
        address _paymentToken,
        uint256 _payment,
        address payable _paymentReceiver
    ) internal view returns (bytes memory) {
        address[] memory signers = new address[](1);
        signers[0] = _owner;
        return abi.encodeWithSelector(
            SAFE_SETUP, signers, 1, _target, _data, _fallbackHandler, _paymentToken, _payment, _paymentReceiver
        );
    }
}
