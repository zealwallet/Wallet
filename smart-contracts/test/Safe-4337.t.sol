pragma solidity 0.8.21;

import "./TestHelper.sol";

contract Safe4337Test is TestHelper {
    address safe;
    address signer;
    uint256 x = 0x31359b08b8f26196b92b19a6548b99ed6a23917860508aa81af2d1cca6ffdc59;
    uint256 y = 0xa75a3a5ba023a8a9605ebf01d2eb3932e6b3a6341807be3de0bdcbb66ff7cddb;
    bytes32 recoveryId = 0x96ad334021ca7082ddf4cca874cdaa47ca0f255e151d1df40396614122586cdf;

    Vm.Wallet user = vm.createWallet("user");

    function setUp() public override {
        super.setUp();

        signer = predictSignerAddress(recoveryId, x, y);
        address[] memory owners = new address[](1);
        owners[0] = signer;
        safe = safeSetup(owners, recoveryId, x, y);
        addSigner(safe, user.addr, 1);
        deal(safe, 1 ether);
    }

    function testSafe4337() public {
        address receiver = address(0x12345);
        UserOperation memory userOp =
            buildUserOp(safe, 0, "", buildExecutionPayload(receiver, uint256(0.5 ether), "", Enum.Operation.Call));
        UserOperation[] memory singedOps = _signUserOp(userOp, user.privateKey);
        vm.startPrank(user.addr);
        IENTRYPOINT(ENTRYPOINT).handleOps{gas: 1e16}(singedOps, BENEFICARY);
        assertEq(address(safe).balance, 0.5 ether - 1e8);
        assertEq(receiver.balance, 0.5 ether);
    }
}
