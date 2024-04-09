pragma solidity 0.8.21;

import "./Base.t.sol";

contract FactoryTest is BaseTest {
    function testSignerNeedsToBeCreatedBySafe(address _caller, bytes32 _recoveryId, uint256 _x, uint256 _y) public {
        vm.assume(_caller != address(0));
        vm.assume(_x != 0);
        vm.assume(_x != 0);
        vm.startPrank(_caller);
        vm.expectRevert(DEPLOYMENT_ERROR);
        factoryProxyImp.deploy(_recoveryId, _x, _y);
        vm.stopPrank();
    }

    function testManualSafeSetupShouldFail(address _caller, bytes32 _recoveryId, uint256 _x, uint256 _y) public {
        vm.assume(_caller != address(0));
        vm.assume(_x != 0);
        vm.assume(_x != 0);

        vm.startPrank(_caller);
        address signerAddress = factoryProxyImp.getSignerAddress(_recoveryId, _x, _y);

        address safe = address(
            GnosisSafeProxyFactory(SAFE_FACTORY).createProxyWithNonce(
                SAFE_SINGLETON, "", uint256(uint160(signerAddress))
            )
        );

        bytes memory data =
            abi.encodeWithSelector(DeploymentRouter(deploymentRouter).setupSafe.selector, _recoveryId, _x, _y);

        address[] memory owners = new address[](1);
        owners[0] = signerAddress;

        vm.expectRevert(SAFE_ERROR);
        Safe(payable(safe)).setup(owners, 1, address(deploymentRouter), data, SAFE_FALLBACK, address(0), 0, payable(0));
        vm.stopPrank();
    }

    function testCreateSafeFixed() public {
        bytes32 recoveryId = 0xd8801caa3a57d8cd2079de0e99ab4720ed531fdc127f82487932ce790dbc7e55;
        uint256 x = 92598688512075832830108884898274465343728769487021052897485717107588903033723;
        uint256 y = 27083483594277071928748781300547449477432522515618657691167945786459649745569;

        address signerAddress = factoryProxyImp.getSignerAddress(recoveryId, x, y);
        bytes memory data =
            abi.encodeWithSelector(DeploymentRouter(deploymentRouter).setupSafe.selector, recoveryId, x, y);

        address[] memory owners = new address[](1);
        owners[0] = signerAddress;
        bytes memory setup =
            _safeSetup(owners, address(deploymentRouter), data, SAFE_FALLBACK, address(0), 0, payable(address(0)));

        vm.recordLogs();
        address safe = address(
            GnosisSafeProxyFactory(SAFE_FACTORY).createProxyWithNonce(
                SAFE_SINGLETON, setup, uint256(uint160(signerAddress))
            )
        );

        address predicted = factoryProxyImp.getSafeAddress(signerAddress, recoveryId, x, y);

        Signer signer = Signer(signerAddress);

        assertEq(safe, predicted);
        assert(Safe(payable(safe)).isOwner(signerAddress));
        assertEq(signer.x(), x);
        assertEq(signer.y(), y);
    }

    function testCreateSafeFluid(address _caller, bytes32 _recoveryId, uint256 _x, uint256 _y) public {
        vm.assume(_caller != address(0));
        vm.assume(_x != 0);
        vm.assume(_y != 0);

        address signerAddress = factoryProxyImp.getSignerAddress(_recoveryId, _x, _y);
        bytes memory data =
            abi.encodeWithSelector(DeploymentRouter(deploymentRouter).setupSafe.selector, _recoveryId, _x, _y);

        address[] memory owners = new address[](1);
        owners[0] = signerAddress;
        bytes memory setup =
            _safeSetup(owners, address(deploymentRouter), data, SAFE_FALLBACK, address(0), 0, payable(address(0)));

        vm.recordLogs();
        address safe = address(
            GnosisSafeProxyFactory(SAFE_FACTORY).createProxyWithNonce(
                SAFE_SINGLETON,
                setup, //data,
                uint256(uint160(signerAddress))
            )
        );

        address predicted = factoryProxyImp.getSafeAddress(signerAddress, _recoveryId, _x, _y);

        Signer signer = Signer(signerAddress);

        assertEq(safe, predicted);
        assert(Safe(payable(safe)).isOwner(signerAddress));
        assertEq(signer.x(), _x);
        assertEq(signer.y(), _y);
    }

    function testChangeImplementation() public {
        Factory newFactory = new Factory(address(deploymentRouter));
        vm.recordLogs();
        proxyAdmin.upgradeAndCall(
            ITransparentUpgradeableProxy(address(factoryProxy)),
            address(newFactory),
            abi.encodeWithSelector(
                factory.initialize.selector, address(signerImplementation), SAFE_4337_MODULE, VERSION + 1
            )
        );
        Vm.Log[] memory entries = vm.getRecordedLogs();
        (address implementation) = address(uint160(uint256(entries[0].topics[1])));
        assertEq(implementation, address(newFactory));
    }
}
