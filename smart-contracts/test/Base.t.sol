pragma solidity 0.8.21;

import {Signer} from "../src/Signer.sol";
import {Factory} from "../src/Factory.sol";
import {DeploymentRouter} from "../src/DeploymentRouter.sol";
import {GnosisSafeProxyFactory} from "../src/mocks/GnosisSafeProxy.sol";
import {ProxyAdmin} from "@openzeppelin/contracts/proxy/transparent/ProxyAdmin.sol";
import {
    ITransparentUpgradeableProxy,
    TransparentUpgradeableProxy
} from "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";
import {ModuleManager} from "@safe-contracts/base/ModuleManager.sol";
import {OwnerManager} from "@safe-contracts/base/OwnerManager.sol";
import {Safe, Enum} from "@safe-contracts/Safe.sol";

import "forge-std/Test.sol";
import "forge-std/Vm.sol";

contract BaseTest is Test {
    // Safe contracts
    address constant SAFE_FACTORY = 0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2;
    address constant SAFE_SINGLETON = 0x29fcB43b46531BcA003ddC8FCB67FFE91900C762;

    // 4337 module is the same as the fallback handler
    address constant SAFE_FALLBACK = address(0);
    address constant SAFE_4337_MODULE = 0xa581c4A4DB7175302464fF3C06380BC3270b4037;

    // Signatures
    bytes4 constant SAFE_SETUP = 0xb63e800d;

    // Errors
    bytes4 constant DEPLOYMENT_ERROR = bytes4(keccak256("SaltDoesNotMatchSafe()"));
    bytes4 constant VALIDATION_ERROR = bytes4(keccak256("InvalidSignature()"));
    bytes4 constant INVALID_MESSAGE = bytes4(keccak256("InvalidClientData()"));
    bytes SAFE_ERROR = "GS000";

    address admin = address(this);

    // Misc
    uint64 constant VERSION = 1;

    // Signer implementation
    Signer signerImplementation;
    Factory factory;
    Factory factoryProxyImp;
    TransparentUpgradeableProxy factoryProxy;
    DeploymentRouter deploymentRouter;
    ProxyAdmin proxyAdmin;

    function setUp() public virtual {
        address _router = vm.computeCreateAddress(address(this), vm.getNonce(address(this)) + 3);
        factory = new Factory(_router);
        signerImplementation = new Signer();

        vm.recordLogs();
        factoryProxy = new TransparentUpgradeableProxy(
            address(factory),
            admin,
            abi.encodeWithSelector(
                factory.initialize.selector, address(signerImplementation), SAFE_4337_MODULE, VERSION
            )
        );
        Vm.Log[] memory entries = vm.getRecordedLogs();
        (, address _proxyAdmin) = abi.decode(entries[4].data, (address, address));
        proxyAdmin = ProxyAdmin(_proxyAdmin);
        deploymentRouter = new DeploymentRouter(address(factoryProxy));
        factoryProxyImp = Factory(address(factoryProxy));

        // Just etch a mock factory for the SafeProxyFactory, in case we need to do some changes to the Safe contracts for testing
        //address mockFactory = address(new GnosisSafeProxyFactory());
        //vm.etch(SAFE_FACTORY, mockFactory.code);
    }

    function _safeSetup(
        address[] memory _owners,
        address _target,
        bytes memory _data,
        address _fallbackHandler,
        address _paymentToken,
        uint256 _payment,
        address payable _paymentReceiver
    ) internal view returns (bytes memory) {
        return abi.encodeWithSelector(
            SAFE_SETUP, _owners, 1, _target, _data, _fallbackHandler, _paymentToken, _payment, _paymentReceiver
        );
    }

    function predictSignerAddress(bytes32 _recoveryId, uint256 _x, uint256 _y) internal view returns (address) {
        return factoryProxyImp.getSignerAddress(_recoveryId, _x, _y);
    }

    function safeSetup(address[] memory owners, bytes32 _recoveryId, uint256 _x, uint256 _y)
        internal
        returns (address safe)
    {
        bytes memory data =
            abi.encodeWithSelector(DeploymentRouter(deploymentRouter).setupSafe.selector, _recoveryId, _x, _y);

        bytes memory setup =
            _safeSetup(owners, address(deploymentRouter), data, SAFE_FALLBACK, address(0), 0, payable(address(0)));

        vm.recordLogs();
        safe = address(
            GnosisSafeProxyFactory(SAFE_FACTORY).createProxyWithNonce(
                SAFE_SINGLETON,
                setup, //data,
                uint256(uint160(owners[0]))
            )
        );
    }

    function setUpModule(address safe, address module) internal {
        // set up the module
        bytes memory data = abi.encodeWithSelector(ModuleManager.enableModule.selector, address(module));
        vm.prank(safe);
        (bool success, bytes memory returnData) = safe.call(data);
        require(success, string(returnData));
    }

    function addSigner(address _safe, address _signer, uint256 _threshold) internal {
        bytes memory data = abi.encodeWithSelector(OwnerManager.addOwnerWithThreshold.selector, _signer, _threshold);
        vm.prank(_safe);
        (bool success, bytes memory returnData) = _safe.call(data);
        require(success, string(returnData));
    }
}
