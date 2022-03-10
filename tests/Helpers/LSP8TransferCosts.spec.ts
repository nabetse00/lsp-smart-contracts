import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import { ethers } from "hardhat";
import {
  ALL_PERMISSIONS_SET,
  ERC725YKeys,
  OPERATIONS,
  PERMISSIONS,
} from "../../constants";
import {
  LSP1UniversalReceiverDelegateUP,
  LSP1UniversalReceiverDelegateUPV2,
  LSP1UniversalReceiverDelegateUPV2__factory,
  LSP1UniversalReceiverDelegateUP__factory,
  LSP6KeyManager,
  LSP6KeyManagerV2,
  LSP6KeyManagerV2__factory,
  LSP6KeyManager__factory,
  LSP8IdentifiableDigitalAsset,
  LSP8Tester,
  LSP8Tester__factory,
  UniversalProfile,
  UniversalProfileV2,
  UniversalProfileV2__factory,
  UniversalProfile__factory,
} from "../../types";

// NFTs to mint
const tokenIds = [
  ethers.utils.keccak256(ethers.utils.toUtf8Bytes("NFT nb 1")),
  ethers.utils.keccak256(ethers.utils.toUtf8Bytes("NFT nb 2")),
  ethers.utils.keccak256(ethers.utils.toUtf8Bytes("NFT nb 3")),
  ethers.utils.keccak256(ethers.utils.toUtf8Bytes("NFT nb 4")),
  ethers.utils.keccak256(ethers.utils.toUtf8Bytes("NFT nb 5")),
];

describe.skip("LSP8 - gas cost `getDataSingle(...)` with URD", () => {
  let lsp8Contract: LSP8Tester;

  let accounts: SignerWithAddress[];
  let alice: SignerWithAddress, bob: SignerWithAddress;

  let aliceUniversalProfile: UniversalProfile, aliceKeyManager: LSP6KeyManager;
  let bobUniversalProfile: UniversalProfile, bobKeyManager: LSP6KeyManager;

  let universalReceiverDelegate: LSP1UniversalReceiverDelegateUP;

  beforeEach(async () => {
    accounts = await ethers.getSigners();
    alice = accounts[1];
    bob = accounts[2];

    universalReceiverDelegate =
      await new LSP1UniversalReceiverDelegateUP__factory(accounts[0]).deploy();

    // setup Alice's Universal Profile
    aliceUniversalProfile = await new UniversalProfile__factory(alice).deploy(
      alice.address
    );
    aliceKeyManager = await new LSP6KeyManager__factory(alice).deploy(
      aliceUniversalProfile.address
    );
    await aliceUniversalProfile.connect(alice).setData(
      [
        // owner permissions
        ERC725YKeys.LSP6["AddressPermissions:Permissions"] +
          alice.address.substring(2),
        // URD key
        ERC725YKeys.LSP0["LSP1UniversalReceiverDelegate"],
        // URD permissions
        ERC725YKeys.LSP6["AddressPermissions:Permissions"] +
          universalReceiverDelegate.address.substring(2),
      ],
      [
        ALL_PERMISSIONS_SET,
        universalReceiverDelegate.address,
        ethers.utils.hexZeroPad(PERMISSIONS.SETDATA, 32),
      ]
    );
    await aliceUniversalProfile
      .connect(alice)
      .transferOwnership(aliceKeyManager.address);

    // setup Bob's Universal Profile
    bobUniversalProfile = await new UniversalProfile__factory(bob).deploy(
      bob.address
    );
    bobKeyManager = await new LSP6KeyManager__factory(bob).deploy(
      bobUniversalProfile.address
    );
    await bobUniversalProfile.connect(bob).setData(
      [
        // owner permissions
        ERC725YKeys.LSP6["AddressPermissions:Permissions"] +
          bob.address.substring(2),
        // URD key
        ERC725YKeys.LSP0["LSP1UniversalReceiverDelegate"],
        // URD permissions
        ERC725YKeys.LSP6["AddressPermissions:Permissions"] +
          universalReceiverDelegate.address.substring(2),
      ],
      [
        ALL_PERMISSIONS_SET,
        universalReceiverDelegate.address,
        ethers.utils.hexZeroPad(PERMISSIONS.SETDATA, 32),
      ]
    );
    await bobUniversalProfile
      .connect(bob)
      .transferOwnership(bobKeyManager.address);
  });

  async function runTest() {
    it("should transfer NFT from Alice to Bob", async () => {
      let nftPayload = lsp8Contract.interface.encodeFunctionData("transfer", [
        aliceUniversalProfile.address,
        bobUniversalProfile.address,
        tokenIds[0],
        false,
        "0x",
      ]);

      let upPayload = aliceUniversalProfile.interface.encodeFunctionData(
        "execute",
        [OPERATIONS.CALL, lsp8Contract.address, 0, nftPayload]
      );

      const tx = await aliceKeyManager.connect(alice).execute(upPayload);
      const receipt = await tx.wait();
      const gasUsed = receipt.gasUsed.toNumber();
      console.log(gasUsed);
    });
  }

  describe("scenario 1: alice UPDATE, bob ADD", () => {
    beforeEach(async () => {
      lsp8Contract = await new LSP8Tester__factory(accounts[0]).deploy(
        "My LSP8 NFT",
        "LSP8",
        accounts[0].address
      );

      // alice starts with 2 x NFTs in its balance
      await lsp8Contract
        .connect(accounts[0])
        .mint(aliceUniversalProfile.address, tokenIds[0], true, "0x");
      await lsp8Contract
        .connect(accounts[0])
        .mint(aliceUniversalProfile.address, tokenIds[1], true, "0x");

      // bob starts with no NFT in its balance
    });

    runTest();
  });
  describe("scenario 2: alice UPDATE, bob UPDATE", () => {
    beforeEach(async () => {
      lsp8Contract = await new LSP8Tester__factory(accounts[0]).deploy(
        "My LSP8 NFT",
        "LSP8",
        accounts[0].address
      );
      // alice starts with 2 x NFTs in its balance
      await lsp8Contract
        .connect(accounts[0])
        .mint(aliceUniversalProfile.address, tokenIds[0], true, "0x");
      await lsp8Contract
        .connect(accounts[0])
        .mint(aliceUniversalProfile.address, tokenIds[1], true, "0x");

      // bob starts with 2 x NFT in its balance
      await lsp8Contract
        .connect(accounts[0])
        .mint(bobUniversalProfile.address, tokenIds[2], true, "0x");
      await lsp8Contract
        .connect(accounts[0])
        .mint(bobUniversalProfile.address, tokenIds[3], true, "0x");
    });

    runTest();
  });
  describe("scenario 3: alice REMOVE, bob UPDATE", () => {
    beforeEach(async () => {
      lsp8Contract = await new LSP8Tester__factory(accounts[0]).deploy(
        "My LSP8 NFT",
        "LSP8",
        accounts[0].address
      );
      // alice starts with 1 x NFT in its balance
      await lsp8Contract
        .connect(accounts[0])
        .mint(aliceUniversalProfile.address, tokenIds[0], true, "0x");
      // bob starts with 1 x NFT in its balance
      await lsp8Contract
        .connect(accounts[0])
        .mint(bobUniversalProfile.address, tokenIds[1], true, "0x");
    });

    runTest();
  });
  describe("scenario 4: alice REMOVE, bob ADD", () => {
    beforeEach(async () => {
      lsp8Contract = await new LSP8Tester__factory(accounts[0]).deploy(
        "My LSP8 NFT",
        "LSP8",
        accounts[0].address
      );
      // alice starts with 1 x NFT in its balance
      await lsp8Contract
        .connect(accounts[0])
        .mint(aliceUniversalProfile.address, tokenIds[0], true, "0x");
      // bob starts with no NFT in its balance
    });

    runTest();
  });
});

describe("LSP8 - gas cost `getData(...)` (overloaded) with URD", () => {
  let lsp8Contract: LSP8Tester;

  let accounts: SignerWithAddress[];
  let alice: SignerWithAddress, bob: SignerWithAddress;

  let aliceUniversalProfile: UniversalProfileV2,
    aliceKeyManager: LSP6KeyManagerV2;
  let bobUniversalProfile: UniversalProfileV2, bobKeyManager: LSP6KeyManagerV2;

  let universalReceiverDelegate: LSP1UniversalReceiverDelegateUPV2;

  beforeEach(async () => {
    accounts = await ethers.getSigners();
    alice = accounts[1];
    bob = accounts[2];

    universalReceiverDelegate =
      await new LSP1UniversalReceiverDelegateUPV2__factory(
        accounts[0]
      ).deploy();

    // setup Alice's Universal Profile
    aliceUniversalProfile = await new UniversalProfileV2__factory(alice).deploy(
      alice.address
    );
    aliceKeyManager = await new LSP6KeyManagerV2__factory(alice).deploy(
      aliceUniversalProfile.address
    );
    await aliceUniversalProfile.connect(alice)["setData(bytes32[],bytes[])"](
      [
        // owner permissions
        ERC725YKeys.LSP6["AddressPermissions:Permissions"] +
          alice.address.substring(2),
        // URD key
        ERC725YKeys.LSP0["LSP1UniversalReceiverDelegate"],
        // URD permissions
        ERC725YKeys.LSP6["AddressPermissions:Permissions"] +
          universalReceiverDelegate.address.substring(2),
      ],
      [
        ALL_PERMISSIONS_SET,
        universalReceiverDelegate.address,
        ethers.utils.hexZeroPad(PERMISSIONS.SETDATA, 32),
      ]
    );
    await aliceUniversalProfile
      .connect(alice)
      .transferOwnership(aliceKeyManager.address);

    // setup Bob's Universal Profile
    bobUniversalProfile = await new UniversalProfileV2__factory(bob).deploy(
      bob.address
    );
    bobKeyManager = await new LSP6KeyManagerV2__factory(bob).deploy(
      bobUniversalProfile.address
    );
    await bobUniversalProfile.connect(bob)["setData(bytes32[],bytes[])"](
      [
        // owner permissions
        ERC725YKeys.LSP6["AddressPermissions:Permissions"] +
          bob.address.substring(2),
        // URD key
        ERC725YKeys.LSP0["LSP1UniversalReceiverDelegate"],
        // URD permissions
        ERC725YKeys.LSP6["AddressPermissions:Permissions"] +
          universalReceiverDelegate.address.substring(2),
      ],
      [
        ALL_PERMISSIONS_SET,
        universalReceiverDelegate.address,
        ethers.utils.hexZeroPad(PERMISSIONS.SETDATA, 32),
      ]
    );
    await bobUniversalProfile
      .connect(bob)
      .transferOwnership(bobKeyManager.address);
  });

  async function runTest() {
    it("should transfer NFT from Alice to Bob", async () => {
      let nftPayload = lsp8Contract.interface.encodeFunctionData("transfer", [
        aliceUniversalProfile.address,
        bobUniversalProfile.address,
        tokenIds[0],
        false,
        "0x",
      ]);

      let upPayload = aliceUniversalProfile.interface.encodeFunctionData(
        "execute",
        [OPERATIONS.CALL, lsp8Contract.address, 0, nftPayload]
      );

      const tx = await aliceKeyManager.connect(alice).execute(upPayload);
      const receipt = await tx.wait();
      const gasUsed = receipt.gasUsed.toNumber();
      console.log(gasUsed);
    });
  }

  describe("scenario 1: alice UPDATE, bob ADD", () => {
    beforeEach(async () => {
      lsp8Contract = await new LSP8Tester__factory(accounts[0]).deploy(
        "My LSP8 NFT",
        "LSP8",
        accounts[0].address
      );

      // alice starts with 2 x NFTs in its balance
      await lsp8Contract
        .connect(accounts[0])
        .mint(aliceUniversalProfile.address, tokenIds[0], true, "0x");
      await lsp8Contract
        .connect(accounts[0])
        .mint(aliceUniversalProfile.address, tokenIds[1], true, "0x");

      // bob starts with no NFT in its balance
    });

    runTest();
  });
  describe("scenario 2: alice UPDATE, bob UPDATE", () => {
    beforeEach(async () => {
      lsp8Contract = await new LSP8Tester__factory(accounts[0]).deploy(
        "My LSP8 NFT",
        "LSP8",
        accounts[0].address
      );
      // alice starts with 2 x NFTs in its balance
      await lsp8Contract
        .connect(accounts[0])
        .mint(aliceUniversalProfile.address, tokenIds[0], true, "0x");
      await lsp8Contract
        .connect(accounts[0])
        .mint(aliceUniversalProfile.address, tokenIds[1], true, "0x");

      // bob starts with 2 x NFT in its balance
      await lsp8Contract
        .connect(accounts[0])
        .mint(bobUniversalProfile.address, tokenIds[2], true, "0x");
      await lsp8Contract
        .connect(accounts[0])
        .mint(bobUniversalProfile.address, tokenIds[3], true, "0x");
    });

    runTest();
  });
  describe("scenario 3: alice REMOVE, bob UPDATE", () => {
    beforeEach(async () => {
      lsp8Contract = await new LSP8Tester__factory(accounts[0]).deploy(
        "My LSP8 NFT",
        "LSP8",
        accounts[0].address
      );
      // alice starts with 1 x NFT in its balance
      await lsp8Contract
        .connect(accounts[0])
        .mint(aliceUniversalProfile.address, tokenIds[0], true, "0x");
      // bob starts with 1 x NFT in its balance
      await lsp8Contract
        .connect(accounts[0])
        .mint(bobUniversalProfile.address, tokenIds[1], true, "0x");
    });

    runTest();
  });
  describe("scenario 4: alice REMOVE, bob ADD", () => {
    beforeEach(async () => {
      lsp8Contract = await new LSP8Tester__factory(accounts[0]).deploy(
        "My LSP8 NFT",
        "LSP8",
        accounts[0].address
      );
      // alice starts with 1 x NFT in its balance
      await lsp8Contract
        .connect(accounts[0])
        .mint(aliceUniversalProfile.address, tokenIds[0], true, "0x");
      // bob starts with no NFT in its balance
    });

    runTest();
  });
});
