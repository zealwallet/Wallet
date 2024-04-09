pragma solidity 0.8.21;

import "./TestHelper.sol";
import {Safe4337Module} from "../src/mocks/MockModule.sol";

contract RouterTest is TestHelper {
    address NEW_ENTRYPOINT = address(0x998);
    address mockModule = address(new Safe4337Module(NEW_ENTRYPOINT));

    function testSafeAddressNotImpactedByNewModules(bytes32 _recoveryId, uint256 _x, uint256 _y) public {
        address signer = predictSignerAddress(_recoveryId, _x, _y);
        address predicted = factoryProxyImp.getSafeAddress(signer, _recoveryId, _x, _y);

        proxyAdmin.upgradeAndCall(
            ITransparentUpgradeableProxy(address(factoryProxy)),
            address(factory),
            abi.encodeWithSelector(factory.initialize.selector, address(signerImplementation), mockModule, VERSION + 1)
        );

        address[] memory owners = new address[](1);
        owners[0] = signer;
        address safe = safeSetup(owners, _recoveryId, _x, _y);
        assertEq(predicted, safe);
    }

    function testOwnerCanSetRouterModules(address _caller) public {
        address safeModule = factoryProxyImp.SAFE_MODULE();

        proxyAdmin.upgradeAndCall(
            ITransparentUpgradeableProxy(address(factoryProxy)),
            address(factory),
            abi.encodeWithSelector(factory.initialize.selector, address(signerImplementation), mockModule, VERSION + 1)
        );
        assertNotEq(safeModule, factoryProxyImp.SAFE_MODULE());
    }
}
