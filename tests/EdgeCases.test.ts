import { expect } from "chai"
import { ethers } from "hardhat"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import { 
    LSP1UniversalReceiverDelegateUP, 
    LSP6KeyManager, 
    LSP9Vault, 
    LSP9Vault__factory, 
    TargetContract__factory, 
    UniversalProfile, 
    UniversalProfile__factory,
    FallbackContract,
    FallbackContract__factory,
    LSP6KeyManager__factory,
} from "../types";
    
import { LSP1ImplementerReverts } from "../types/contracts/Helpers/UniversalReceivers/LSP1ImplementerReverts";
import { LSP1ImplementerReverts__factory } from "../types/factories/contracts/Helpers/UniversalReceivers/LSP1ImplementerReverts__factory";

import { LSP1Faker } from "../types/contracts/Helpers/UniversalReceivers/LSP1Faker";
import { LSP1Faker__factory } from "../types/factories/contracts/Helpers/UniversalReceivers/LSP1Faker__factory";

import { LSP1FakerFallback } from "../types/contracts/Helpers/UniversalReceivers/LSP1FakerFallback";
import { LSP1FakerFallback__factory } from "../types/factories/contracts/Helpers/UniversalReceivers/LSP1FakerFallback__factory";

import { LSP1DelegateRevert } from "../types/contracts/Helpers/UniversalReceivers/LSP1DelegateReverts.sol/LSP1DelegateRevert";
import { LSP1DelegateRevert__factory } from "../types/factories/contracts/Helpers/UniversalReceivers/LSP1DelegateReverts.sol/LSP1DelegateRevert__factory";

import { setupKeyManager, setupProfileWithKeyManagerWithURD } from "./utils/fixtures";
import { ERC725YKeys, INTERFACE_IDS, LSP1_TYPE_IDS } from "../constants";
import { LSP6TestContext } from "./utils/context";

describe("testing notification hook in `transferOwnership(...)` of LSP9Vault", () => {

    let accounts: SignerWithAddress[]
    let owner: SignerWithAddress
    let vault: LSP9Vault;

    beforeEach(async () => {
        accounts = await ethers.getSigners()
        owner = accounts[0]
        vault = await new LSP9Vault__factory(owner).deploy(owner.address)
    })

    // an EOA?
    describe("when transferring ownership to an EOA", () => {
        it("what happen?", async () => {
            const newOwner = accounts[5];

            // does not revert
            let tx = await vault.connect(owner).transferOwnership(newOwner.address)

            // emit OwnershipTransferStarted event
            expect(tx).to.emit(vault, "OwnershipTransferStarted").withArgs(
                owner.address,
                newOwner.address
            )

            // pendingOwner is now EOA address
            expect(await vault.pendingOwner()).to.equal(newOwner.address);
        })
    })

    // a random smart contract (random one)?
    describe("when transferring ownership to a random contract", () => {
        it("what happen?", async () => {
            let targetContract = await new TargetContract__factory(owner).deploy()

            // does not revert
            let tx = await vault.connect(owner).transferOwnership(targetContract.address)

            // emit OwnershipTransferStarted event
            expect(tx).to.emit(vault, "OwnershipTransferStarted").withArgs(
                owner.address,
                targetContract.address
            )

            // pending owner should be random contract address
            expect(await vault.pendingOwner()).to.equal(targetContract.address)
        });
    })

    // a Universal Profile
    describe("when transferring ownership to a universal Profile", () => {

        it("what happen?", async () => {
            let newOwner = await new UniversalProfile__factory(accounts[1]).deploy(accounts[1].address)

            let tx = await vault.connect(owner).transferOwnership(newOwner.address)

            // the pendingOwner is now the UP address
            expect(await vault.pendingOwner()).to.equal(newOwner.address)

            // emit OwnershipTransferStarted event
            expect(tx).to.emit(vault, "OwnershipTransferStarted").withArgs(
                owner.address,
                newOwner.address
            )
            
            // does emit a UniversalReceiver event on the UP newOwner
            expect(tx).to.emit(newOwner, "UniversalReceiver").withArgs(
                vault.address, //  from,
                0, //  value,
                LSP1_TYPE_IDS.LSP9_VAULTPENDINGOWNER, //  typeId,
                "0x", //  receivedData,
                "0x"    //  returnedValue
            ) 
        })

    })

    describe("when the universalReceiverDelegate(...) function (called by the `universalReceiver(...)` function) ", () => {
        it("what happen?", async () => {
            const buildLSP6Context = async (): Promise<LSP6TestContext> => {
                const accounts = await ethers.getSigners();
                const owner = accounts[0];
          
                const universalProfile = await new UniversalProfile__factory(
                  owner
                ).deploy(owner.address);
                const keyManager = await new LSP6KeyManager__factory(owner).deploy(
                  universalProfile.address
                );
          
                return { accounts, owner, universalProfile, keyManager };
              };
              
              const context = await buildLSP6Context();

              const lsp1DelegateReverts: LSP1DelegateRevert = await new LSP1DelegateRevert__factory(context.owner).deploy()

              const keysSetup = [
                ERC725YKeys.LSP1["LSP1UniversalReceiverDelegate"]
              ]

              const valuesSetup = [
                lsp1DelegateReverts.address
              ]

              await setupKeyManager(context, keysSetup, valuesSetup)

              // check lsp1DelegateRevert address is setup on the storage
              expect(await context.universalProfile["getData(bytes32)"](ERC725YKeys.LSP1["LSP1UniversalReceiverDelegate"])).to.equal(lsp1DelegateReverts.address.toLowerCase())

              // check that the owner of the UP is the keyManager
              expect(await context.universalProfile.owner()).to.equal(context.keyManager.address)

              // it reverts on the UniversalReceiverDelegate contract and bubble all the way back up
              await expect(
                vault.connect(owner).transferOwnership(context.universalProfile.address)
              ).to.be.revertedWith("LSP1Delegate: something went wrong at `universalReceiverDelegate(...)` function")
        })
    })


    // LSP1ImplementerRevert
    describe("when transferring ownership to a smart contract that implements LSP1 and reverts", () => {
        
        it("ensure contract supports LSP1 interface", async () => {
            let lsp1ThatReverts: LSP1ImplementerReverts = await new LSP1ImplementerReverts__factory(owner).deploy()
            expect(
                await lsp1ThatReverts.supportsInterface(INTERFACE_IDS.LSP1UniversalReceiver)
            ).to.be.true;
        })

        it("ensure can call universalReceiver(...) function on the contract", async () => {
            let lsp1ThatReverts: LSP1ImplementerReverts = await new LSP1ImplementerReverts__factory(owner).deploy()
            await expect(
                lsp1ThatReverts.universalReceiver("0xcafecafecafecafecafecafecafecafecafecafecafecafecafecafecafecafe", "0x")
            ).to.be.revertedWith("!")
        })
            
        it("what happen?", async () => {
            let lsp1ImplementerRevert: LSP1ImplementerReverts = await new LSP1ImplementerReverts__factory(owner).deploy()

            // it completely revert (pending owner not set, UniversalReceiver event not emitted)
            await expect(
                vault.connect(owner).transferOwnership(lsp1ImplementerRevert.address)
            ).to.be.reverted;

            // pending owner is not set then since it reverts
            expect(await vault.pendingOwner()).to.equal(ethers.constants.AddressZero)
        })
    })

    // LSP1Faker
    describe("when transferring ownership to a contract that fakes supportsInterface(LSP1) and does not contain universalReceiver(...) function", () => {
        it("what happen?", async () => {
            let lsp1Faker: LSP1Faker = await new LSP1Faker__factory(owner).deploy()

            // reverts
            await expect(
                vault.connect(owner).transferOwnership(lsp1Faker.address)
            ).to.be.reverted;

            // the pending owner is not set then since it reverts
            expect(await vault.pendingOwner()).to.equal(ethers.constants.AddressZero)
        })
    })

    // LSP1FakerFallback
    describe("when transferring ownership to a contract that fakes supportsInterface(LSP1), does not contain the universalReceiver(...) but has a fallback function", () => {

        it("what happen?", async () => {
            let lsp1FakerFallback: LSP1FakerFallback = await new LSP1FakerFallback__factory(owner).deploy()

            // it reverts, because it cannot reach the .universalReceiver(...) function, and it does not even reach the fallback function.
            // because the explicit type conversion below expect the contract to have the `.universalReceiver(...)` function.
            //
            // ILSP1UniversalReceiver(newPendingOwner).universalReceiver(
            //     _TYPEID_LSP9_VAULTPENDINGOWNER,
            //     ""
            // );
            await expect(
                vault.connect(owner).transferOwnership(lsp1FakerFallback.address)
            ).to.be.reverted;
        })
    })

    // FallbackContract
    describe("when transferring ownership to a contract that does not supports LSP1 interface and has a fallback function", () => {
        it("what happen?", async () => {
            let fallbackContract = await new FallbackContract__factory(owner).deploy()
            
            // does not revert
            let tx = await vault.connect(owner).transferOwnership(fallbackContract.address);

            // no logs emitted, even if there was some logs emitted in the fallback function of the fallbackContract
            // this means that the fallback function of the contract is not called (because contract does not supports LSP1 interface)
            expect(tx).to.emit(vault, "OwnershipTransferStarted").withArgs(
                owner.address,
                fallbackContract.address
            )

            // the pending owner is set correctly
            expect(await vault.pendingOwner()).to.equal(fallbackContract.address)
        })
    })

    // these are more edge cases
    // ----------

    describe.skip("when transferOwnership() + claimOwnership() to the same current owner", () => {

        it("test", async () => {
            let [up, km, urd] = await setupProfileWithKeyManagerWithURD(owner);

            let universalProfile = up as UniversalProfile;
            let keyManager = km as LSP6KeyManager;
            let universalReceiverDelegate = urd as LSP1UniversalReceiverDelegateUP;

            const vault = await new LSP9Vault__factory(owner).deploy(universalProfile.address)
            console.log("vault: ", vault.address)

            const [arrayLength, arrayIndex] = await universalProfile["getData(bytes32[])"]([
                ERC725YKeys.LSP10["LSP10Vaults[]"].length,
                ERC725YKeys.LSP10["LSP10Vaults[]"].index + "00000000000000000000000000000000",
            ])

            // arrayLength = bytes -> "0x0000000000000000000000000000000000000000000000000000000000000001"
            // arrayLength.length = uint256 -> 32

            console.log("arrayLength: ", arrayLength)
            console.log("arrayIndex: ", arrayIndex)

            // Key Manager -> Universal Profile -> Vault
            //  3                   2                1

            const pendingOwnerBefore = await vault.pendingOwner()
            console.log("pendingOwnerBefore: ", pendingOwnerBefore)

            const transferOwnershipPayload = vault.interface.encodeFunctionData("transferOwnership", [universalProfile.address])
            let executePayload = universalProfile.interface.encodeFunctionData("execute", [
                0, // operationType
                vault.address, // recipient
                0, // value
                transferOwnershipPayload
            ]);
            await keyManager.connect(owner).execute(executePayload)

            const pendingOwnerAfter = await vault.pendingOwner()
            console.log("pendingOwnerAfter: ", pendingOwnerAfter)
            expect(pendingOwnerAfter).to.equal(universalProfile.address)
            
            const claimOwnershipPayload = vault.interface.getSighash("claimOwnership")
            executePayload = universalProfile.interface.encodeFunctionData("execute", [
                0, // operationType
                vault.address, // recipient
                0, // value
                claimOwnershipPayload
            ]);
            await keyManager.connect(owner).execute(executePayload)

            expect(await vault.pendingOwner()).to.equal(ethers.constants.AddressZero)

            const [arrayLengthAfter, arrayIndexZero, arrayIndexOne] = await universalProfile["getData(bytes32[])"]([
                ERC725YKeys.LSP10["LSP10Vaults[]"].length,
                ERC725YKeys.LSP10["LSP10Vaults[]"].index + "00000000000000000000000000000000",
                ERC725YKeys.LSP10["LSP10Vaults[]"].index + "00000000000000000000000000000001",
            ])
            console.log("arrayLengthAfter: ", arrayLengthAfter)
            console.log("arrayIndexZero: ", arrayIndexZero)
            console.log("arrayIndexOne: ", arrayIndexOne)

            // does it emit the UniversalReceiver event on the UP contract that owns the Vault?

        })

    })
})