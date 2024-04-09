pragma solidity 0.8.21;

import "@openzeppelin/contracts/access/Ownable.sol";

interface ISafe {
    function enableModule(address _module) external;
    function setFallbackHandler(address _handler) external;
}

// Interface for the Factory contract.
interface IFactory {
    // Declares a function to deploy a new signer instance.
    // @param _hash: A unique identifier for the signer.
    // @param _x: X-coordinate of the public key.
    // @param _y: Y-coordinate of the public key.
    // @return bool: Returns true if deployment is successful.
    function deploy(bytes32 _hash, uint256 _x, uint256 _y) external returns (bool);
    function getSafeReference() external view returns (address);
}

/// @title DeploymentRouter
contract DeploymentRouter {
    // Immutable address of the Factory contract.
    address public immutable factoryProxy;

    // events
    event SafeModuleSet(address indexed _module, uint256 _version);

    // Constructor to set the Factory contract's address.
    // @param _factory: The address of the Factory contract.
    constructor(address _factoryProxy) {
        factoryProxy = _factoryProxy;
    }

    function setupSafe(bytes32 _hash, uint256 _x, uint256 _y) public returns (bool) {
        // Deploys a new signer instance.
        _setupSafe();
        return _deploySigner(_hash, _x, _y);
    }

    // Function to deploy a signer through the Factory contract.
    // This allows external contracts or addresses to request signer deployments.
    // @param _hash: A unique identifier for the signer.
    // @param _x: X-coordinate of the public key.
    // @param _y: Y-coordinate of the public key.
    // @return bool: Returns true if deployment is successful.
    function _deploySigner(bytes32 _hash, uint256 _x, uint256 _y) internal returns (bool) {
        // Calls the deploy function of the Factory contract.
        // Enables the modules.
        return IFactory(factoryProxy).deploy(_hash, _x, _y);
    }

    function _setupSafe() internal {
        address safeModule = IFactory(factoryProxy).getSafeReference();
        ISafe(address(this)).enableModule(safeModule);
        ISafe(address(this)).setFallbackHandler(safeModule);
    }
}
