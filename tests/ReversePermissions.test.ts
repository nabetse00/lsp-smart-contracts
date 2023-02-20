import { ethers } from "hardhat";
import { expect } from "chai";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

// constants
import {
  ERC725YDataKeys,
  ALL_PERMISSIONS,
  PERMISSIONS,
  OPERATION_TYPES,
} from "../constants";

// setup
import { LSP6TestContext } from "./utils/context";
import { setupKeyManager } from "./utils/fixtures";

// helpers
import { combineAllowedCalls } from "./utils/helpers";
import { BigNumber } from "ethers";
import {
  LSP6KeyManager__factory,
  UniversalProfile__factory,
  KeyManagerReversePermissionFail,
  KeyManagerReversePermissionFail__factory,
} from "../types";

const buildContext = async (
  initialFunding?: BigNumber
): Promise<LSP6TestContext> => {
  const accounts = await ethers.getSigners();
  const owner = accounts[0];

  const universalProfile = await new UniversalProfile__factory(owner).deploy(
    owner.address,
    { value: initialFunding }
  );

  const keyManager = await new LSP6KeyManager__factory(owner).deploy(
    universalProfile.address
  );

  return { accounts, owner, universalProfile, keyManager, initialFunding };
};

describe("Reverse Permissions check", () => {
  let context: LSP6TestContext;
  let controllerCanTransferValue: SignerWithAddress;
  let controllerCannotTransferValue: SignerWithAddress;
  let recipient;

  before("setup", async () => {
    context = await buildContext(ethers.utils.parseEther("100"));

    controllerCanTransferValue = context.accounts[1];
    controllerCannotTransferValue = context.accounts[2];
    recipient = context.accounts[3];

    const permissionsKeys = [
      ERC725YDataKeys.LSP6["AddressPermissions:Permissions"] +
        context.owner.address.substring(2),
      ERC725YDataKeys.LSP6["AddressPermissions:Permissions"] +
        controllerCanTransferValue.address.substring(2),
      ERC725YDataKeys.LSP6["AddressPermissions:AllowedCalls"] +
        controllerCanTransferValue.address.substring(2),
      ERC725YDataKeys.LSP6["AddressPermissions:Permissions"] +
        controllerCannotTransferValue.address.substring(2),
    ];

    const permissionsValues = [
      ALL_PERMISSIONS,
      PERMISSIONS.TRANSFERVALUE,
      combineAllowedCalls(["0xffffffff"], [recipient.address], ["0xffffffff"]),
      PERMISSIONS.SETDATA,
    ];

    await setupKeyManager(context, permissionsKeys, permissionsValues);
  });

  describe("when controller is allowed to transfer value", () => {
    it("should pass when transfering value by calling the UP directly", async () => {
      const amount = ethers.utils.parseEther("1");

      await expect(() =>
        context.universalProfile
          .connect(controllerCanTransferValue)
          ["execute(uint256,address,uint256,bytes)"](
            OPERATION_TYPES.CALL,
            recipient.address,
            amount,
            "0x"
          )
      ).to.changeEtherBalances(
        [context.universalProfile.address, recipient.address],
        [
          `-${amount}`, // account balance should have gone down
          amount, // recipient balance should have gone up
        ]
      );
    });
  });

  describe("when controller is not allowed to transfer value", () => {
    it("should fail when transfering value by calling the UP directly", async () => {
      const amount = ethers.utils.parseEther("1");

      await expect(
        context.universalProfile
          .connect(controllerCannotTransferValue)
          ["execute(uint256,address,uint256,bytes)"](
            OPERATION_TYPES.CALL,
            recipient.address,
            amount,
            "0x"
          )
      )
        .to.be.revertedWithCustomError(context.keyManager, "NotAuthorised")
        .withArgs(controllerCannotTransferValue.address, "TRANSFERVALUE");
    });
  });
});

describe("Reverse Permissions check (invalid return value", () => {
  let context: LSP6TestContext;
  let controllerCanTransferValue: SignerWithAddress;
  let controllerCannotTransferValue: SignerWithAddress;
  let recipient;

  before("setup", async () => {
    const accounts = await ethers.getSigners();
    const owner = accounts[0];
    const initialFunding = ethers.utils.parseEther("100");

    const universalProfile = await new UniversalProfile__factory(owner).deploy(
      owner.address,
      { value: initialFunding }
    );

    const keyManager = await new KeyManagerReversePermissionFail__factory(
      owner
    ).deploy(universalProfile.address);

    context = { accounts, owner, universalProfile, keyManager, initialFunding };

    controllerCanTransferValue = context.accounts[1];
    controllerCannotTransferValue = context.accounts[2];
    recipient = context.accounts[3];

    const permissionsKeys = [
      ERC725YDataKeys.LSP6["AddressPermissions:Permissions"] +
        context.owner.address.substring(2),
      ERC725YDataKeys.LSP6["AddressPermissions:Permissions"] +
        controllerCanTransferValue.address.substring(2),
      ERC725YDataKeys.LSP6["AddressPermissions:AllowedCalls"] +
        controllerCanTransferValue.address.substring(2),
      ERC725YDataKeys.LSP6["AddressPermissions:Permissions"] +
        controllerCannotTransferValue.address.substring(2),
    ];

    const permissionsValues = [
      ALL_PERMISSIONS,
      PERMISSIONS.TRANSFERVALUE,
      combineAllowedCalls(["0xffffffff"], [recipient.address], ["0xffffffff"]),
      PERMISSIONS.SETDATA,
    ];

    await setupKeyManager(context, permissionsKeys, permissionsValues);
  });

  describe("when controller is allowed to transfer value", () => {
    describe("when transfering value by calling the UP directly", () => {
      it("should fail because the return value is invalid (not functions selector of `execute(uint256,address,uint256,bytes)`)", async () => {
        const amount = ethers.utils.parseEther("1");

        await expect(
          context.universalProfile
            .connect(controllerCanTransferValue)
            ["execute(uint256,address,uint256,bytes)"](
              OPERATION_TYPES.CALL,
              recipient.address,
              amount,
              "0x"
            )
        ).to.be.revertedWith("Reverse Permission Check Failed");
      });
    });
  });

  describe("when controller is not allowed to transfer value", () => {
    describe("when transfering value by calling the UP directly", () => {
      it("should revert with NotAuthorised error", async () => {
        const amount = ethers.utils.parseEther("1");

        await expect(
          context.universalProfile
            .connect(controllerCannotTransferValue)
            ["execute(uint256,address,uint256,bytes)"](
              OPERATION_TYPES.CALL,
              recipient.address,
              amount,
              "0x"
            )
        )
          .to.be.revertedWithCustomError(context.keyManager, "NotAuthorised")
          .withArgs(controllerCannotTransferValue.address, "TRANSFERVALUE");
      });
    });
  });
});
