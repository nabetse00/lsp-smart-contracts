import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import { ethers } from "hardhat";
import {
  UniversalProfile,
  UniversalProfile__factory,
  LSP6KeyManager,
  UniversalProfileV2,
  UniversalProfileV2__factory,
  LSP6KeyManagerV2,
  LSP9Vault,
  LSP9Vault__factory,
  LSP7Tester__factory,
  LSP8Tester__factory,
  LSP6KeyManagerV2__factory,
  LSP6KeyManager__factory,
  LSP1UniversalReceiverDelegateUP,
  LSP1UniversalReceiverDelegateUP__factory,
  LSP1UniversalReceiverDelegateUPV2,
  LSP1UniversalReceiverDelegateUPV2__factory,
} from "../../types";

import {
  ERC725YKeys,
  ALL_PERMISSIONS_SET,
  PERMISSIONS,
  OPERATIONS,
  INTERFACE_IDS,
} from "../../constants";

import {
  LSP5_ARRAY_KEY,
  LSP10_ARRAY_KEY,
  ARRAY_LENGTH,
  INDEX,
  TOKEN_ID,
  getMapAndArrayKeyValues,
} from "../utils/helpers";


describe("Gas cost EOA to EOA", () => {
    let accounts: SignerWithAddress[];
  let EOA1, EOA2, EOA3;


   beforeAll(async () => {
    accounts = await ethers.getSigners();
    EOA1 = accounts[0];
     EOA2 = accounts[1];
     EOA3 = accounts[2];
   });
  
   describe("LSP7-DigitalAsset", () => {
    let LSP7tokenA, LSP7tokenB, LSP7tokenC, LSP7tokenD, LSP7tokenE;

    beforeAll(async () => {
      LSP7tokenA = await new LSP7Tester__factory(EOA1).deploy(
        "TokenA",
        "TKA",
       EOA1.address
      );
      LSP7tokenB = await new LSP7Tester__factory(EOA1).deploy(
        "TokenB",
        "TKB",
        EOA1.address
      );
      LSP7tokenC = await new LSP7Tester__factory(EOA1).deploy(
        "TokenC",
        "TKC",
       EOA1.address
      );
    });
     
     describe("First Transfer", () => {
        it("Should mint 10 tokenA to EOA1 : 71,827", async () => {
          const tx = await LSP7tokenA.connect(EOA1).mint(EOA1.address, 10, true, "0x");
          const receipt = await tx.wait();
          const gasUsed = receipt.gasUsed.toNumber();
          console.log(gasUsed);
        });
       
        it("Should mint 10 tokenA to EOA1 : 37,627", async () => {
          const tx = await LSP7tokenA.connect(EOA1).mint(EOA1.address, 10, true, "0x");
          const receipt = await tx.wait();
          const gasUsed = receipt.gasUsed.toNumber();
          console.log(gasUsed);
        });
       
       it("Should mint 10 tokenB to EOA1 : 71,827", async () => {
          const tx = await LSP7tokenB.connect(EOA1).mint(EOA1.address, 10, true, "0x");
          const receipt = await tx.wait();
          const gasUsed = receipt.gasUsed.toNumber();
          console.log(gasUsed);
        });
       it("Should transfer 5 tokenA from EOA1 to EOA2  : 59,063 gas", async () => {
         const tx = await LSP7tokenA.connect(EOA1).transfer(EOA1.address, EOA2.address, "5", true, "0x");
          const receipt = await tx.wait();
          const gasUsed = receipt.gasUsed.toNumber();
          console.log(gasUsed);
       });

       it("Should transfer 1 tokenA from EOA1 to EOA2  : 41,963 gas", async () => {
         const tx = await LSP7tokenA.connect(EOA1).transfer(EOA1.address, EOA2.address, "1", true, "0x");
          const receipt = await tx.wait();
          const gasUsed = receipt.gasUsed.toNumber();
          console.log(gasUsed);
       });
       it("Should transfer remaing tokenA from EOA1 to EOA2  : 37,163 gas", async () => {
         const tx = await LSP7tokenA.connect(EOA1).transfer(EOA1.address, EOA2.address, "14", true, "0x");
          const receipt = await tx.wait();
          const gasUsed = receipt.gasUsed.toNumber();
          console.log(gasUsed);
       });

       it("Should transfer all tokenA from EOA2 to EOA3  : 54,251 gas", async () => {
         const tx = await LSP7tokenA.connect(EOA2).transfer(EOA2.address, EOA3.address, "20", true, "0x");
          const receipt = await tx.wait();
          const gasUsed = receipt.gasUsed.toNumber();
          console.log(gasUsed);
       });
     })



  });
  
  
})

describe("Gas cost getDataSingle Without URD UP to UP", () => {
    let accounts: SignerWithAddress[];
  let owner1, owner2,owner3;
  let keyManager1: LSP6KeyManager, keyManager2: LSP6KeyManager,keyManager3: LSP6KeyManager;
  let universalProfile1: UniversalProfile, universalProfile2: UniversalProfile,universalProfile3: UniversalProfile;

   beforeAll(async () => {
    accounts = await ethers.getSigners();
    owner1 = accounts[0];
     owner2 = accounts[1];
     owner3 = accounts[2];
    universalProfile1 = await new UniversalProfile__factory(owner1).deploy(
      owner1.address
    );
    universalProfile2 = await new UniversalProfile__factory(owner2).deploy(
      owner2.address
    );
     universalProfile3 = await new UniversalProfile__factory(owner3).deploy(
      owner3.address
    );

    // fund each UP with ether
    await owner1.sendTransaction({
      to: universalProfile1.address,
      value: ethers.utils.parseEther("10"),
    });

    await owner2.sendTransaction({
      to: universalProfile2.address,
      value: ethers.utils.parseEther("10"),
    });
     await owner3.sendTransaction({
      to: universalProfile3.address,
      value: ethers.utils.parseEther("10"),
    });
   });
  
   describe("LSP7-DigitalAsset", () => {
    let LSP7tokenA, LSP7tokenB, LSP7tokenC, LSP7tokenD, LSP7tokenE;

    beforeAll(async () => {
      LSP7tokenA = await new LSP7Tester__factory(owner1).deploy(
        "TokenA",
        "TKA",
        owner1.address
      );
      LSP7tokenB = await new LSP7Tester__factory(owner1).deploy(
        "TokenB",
        "TKB",
        owner1.address
      );
      LSP7tokenC = await new LSP7Tester__factory(owner1).deploy(
        "TokenC",
        "TKC",
        owner1.address
      );
    });
     
     describe("First Transfer (Initiaiting the storage)", () => {
        it("Should mint 10 tokenA to UP1 : 107,852", async () => {
        let abi = LSP7tokenA.interface.encodeFunctionData("mint", [
          universalProfile1.address,
          "10",
          false,
          "0x",
        ]);

          const tx = await universalProfile1.connect(owner1).execute(OPERATIONS.CALL,LSP7tokenA.address,0,abi);
          const receipt = await tx.wait();
          const gasUsed = receipt.gasUsed.toNumber();
          console.log(gasUsed);
        });
        
       it("Should transfer 5 tokenA from UP1 to UP2 (UP2 didn't have any token yet) : 119,462 gas", async () => {
        let abi = LSP7tokenA.interface.encodeFunctionData("transfer", [
          universalProfile1.address,
          universalProfile2.address,
          "5",
          false,
          "0x",
        ]);

          const tx = await universalProfile1.connect(owner1).execute(OPERATIONS.CALL,LSP7tokenA.address,0,abi);
          const receipt = await tx.wait();
          const gasUsed = receipt.gasUsed.toNumber();
          console.log(gasUsed);
       });
       it("Should transfer 1 tokenA from UP1 to UP2 (UP1 and UP2 both have tokenA already) : 102,362", async () => {
        let abi = LSP7tokenA.interface.encodeFunctionData("transfer", [
          universalProfile1.address,
          universalProfile2.address,
          "1",
          false,
          "0x",
        ]);

          const tx =  await universalProfile1.connect(owner1).execute(OPERATIONS.CALL,LSP7tokenA.address,0,abi);
          const receipt = await tx.wait();
          const gasUsed = receipt.gasUsed.toNumber();
          console.log(gasUsed);
       });
       it("Should transfer remaning tokenA from UP1 to UP2 (UP1 sending all the balance and UP2 has already from the token being sent) : 97,562 gas", async () => {
        let abi = LSP7tokenA.interface.encodeFunctionData("transfer", [
          universalProfile1.address,
          universalProfile2.address,
          "4",
          false,
          "0x",
        ]);

          const tx = await universalProfile1.connect(owner1).execute(OPERATIONS.CALL,LSP7tokenA.address,0,abi);
          const receipt = await tx.wait();
          const gasUsed = receipt.gasUsed.toNumber();
          console.log(gasUsed);
       });
       it("Should transfer all tokenA from UP2 to UP3 (Removing all tokens from UP2 and initiaiting the storage of UP3) : 114,662 gas", async () => {
        let abi = LSP7tokenA.interface.encodeFunctionData("transfer", [
          universalProfile2.address,
          universalProfile3.address,
          "10",
          false,
          "0x",
        ]);

          const tx = await universalProfile2.connect(owner2).execute(OPERATIONS.CALL,LSP7tokenA.address,0,abi);
          const receipt = await tx.wait();
          const gasUsed = receipt.gasUsed.toNumber();
          console.log(gasUsed);
      });
     })

     describe("Second Transfer ", () => {
        it("Should mint 10 tokenB to UP1 : 90,752", async () => {
        let abi = LSP7tokenB.interface.encodeFunctionData("mint", [
          universalProfile1.address,
          "10",
          false,
          "0x",
        ]);

          const tx =  await universalProfile1.connect(owner1).execute(OPERATIONS.CALL,LSP7tokenA.address,0,abi);
          const receipt = await tx.wait();
          const gasUsed = receipt.gasUsed.toNumber();
          console.log(gasUsed);
        });
       it("Should transfer 5 tokenB from UP1 to UP2 (UP2 didn't have any tokenB yet) : 119,462 gas", async () => {
        let abi = LSP7tokenB.interface.encodeFunctionData("transfer", [
          universalProfile1.address,
          universalProfile2.address,
          "5",
          false,
          "0x",
        ]);
        let abiExecutor = universalProfile1.interface.encodeFunctionData(
          "execute",
          [OPERATIONS.CALL, LSP7tokenB.address, 0, abi]
        );
          const tx = await universalProfile1.connect(owner1).execute(OPERATIONS.CALL,LSP7tokenA.address,0,abi);
          const receipt = await tx.wait();
          const gasUsed = receipt.gasUsed.toNumber();
          console.log(gasUsed);
       });
       it("Should transfer 1 tokenB from UP1 to UP2 (UP1 and UP2 both have tokenB already) : 102,362", async () => {
        let abi = LSP7tokenB.interface.encodeFunctionData("transfer", [
          universalProfile1.address,
          universalProfile2.address,
          "1",
          false,
          "0x",
        ]);

          const tx = await universalProfile1.connect(owner1).execute(OPERATIONS.CALL,LSP7tokenA.address,0,abi);
          const receipt = await tx.wait();
          const gasUsed = receipt.gasUsed.toNumber();
          console.log(gasUsed);
       });
       it("Should transfer remaning tokenB from UP1 to UP2 (UP1 sending all the balance and UP2 has already from the token being sent) : 97,562 gas", async () => {
        let abi = LSP7tokenB.interface.encodeFunctionData("transfer", [
          universalProfile1.address,
          universalProfile2.address,
          "4",
          false,
          "0x",
        ]);

          const tx = await universalProfile1.connect(owner1).execute(OPERATIONS.CALL,LSP7tokenA.address,0,abi);
          const receipt = await tx.wait();
          const gasUsed = receipt.gasUsed.toNumber();
          console.log(gasUsed);
       });
       it("Should transfer all tokenB from UP2 to UP3 (Removing all tokens from UP2 and initiaiting the storage of UP3) : 97,562 gas", async () => {
        let abi = LSP7tokenB.interface.encodeFunctionData("transfer", [
          universalProfile2.address,
          universalProfile3.address,
          "10",
          false,
          "0x",
        ]);

          const tx = await universalProfile2.connect(owner2).execute(OPERATIONS.CALL,LSP7tokenA.address,0,abi);
          const receipt = await tx.wait();
          const gasUsed = receipt.gasUsed.toNumber();
          console.log(gasUsed);
      });
     })

  });
  
  
})

describe("Gas cost getData Modified Without URD UP to UP", () => {
    let accounts: SignerWithAddress[];
  let owner1, owner2,owner3;
  let keyManager1: LSP6KeyManager, keyManager2: LSP6KeyManager,keyManager3: LSP6KeyManager;
  let universalProfile1: UniversalProfileV2, universalProfile2: UniversalProfileV2,universalProfile3: UniversalProfileV2;

   beforeAll(async () => {
    accounts = await ethers.getSigners();
    owner1 = accounts[0];
     owner2 = accounts[1];
     owner3 = accounts[2];
    universalProfile1 = await new UniversalProfileV2__factory(owner1).deploy(
      owner1.address
    );
    universalProfile2 = await new UniversalProfileV2__factory(owner2).deploy(
      owner2.address
    );
     universalProfile3 = await new UniversalProfileV2__factory(owner3).deploy(
      owner3.address
    );

    // fund each UP with ether
    await owner1.sendTransaction({
      to: universalProfile1.address,
      value: ethers.utils.parseEther("10"),
    });

    await owner2.sendTransaction({
      to: universalProfile2.address,
      value: ethers.utils.parseEther("10"),
    });
     await owner3.sendTransaction({
      to: universalProfile3.address,
      value: ethers.utils.parseEther("10"),
    });
   });
  
   describe("LSP7-DigitalAsset", () => {
    let LSP7tokenA, LSP7tokenB, LSP7tokenC, LSP7tokenD, LSP7tokenE;

    beforeAll(async () => {
      LSP7tokenA = await new LSP7Tester__factory(owner1).deploy(
        "TokenA",
        "TKA",
        owner1.address
      );
      LSP7tokenB = await new LSP7Tester__factory(owner1).deploy(
        "TokenB",
        "TKB",
        owner1.address
      );
      LSP7tokenC = await new LSP7Tester__factory(owner1).deploy(
        "TokenC",
        "TKC",
        owner1.address
      );
    });
     
     describe("First Transfer (Initiaiting the storage)", () => {
        it("Should mint 10 tokenA to UP1 : 104,221", async () => {
        let abi = LSP7tokenA.interface.encodeFunctionData("mint", [
          universalProfile1.address,
          "10",
          false,
          "0x",
        ]);

          const tx = await universalProfile1.connect(owner1).execute(OPERATIONS.CALL,LSP7tokenA.address,0,abi);
          const receipt = await tx.wait();
          const gasUsed = receipt.gasUsed.toNumber();
          console.log(gasUsed);
        });
       it("Should transfer 5 tokenA from UP1 to UP2 (UP2 didn't have any token yet) : 112,222 gas", async () => {
        let abi = LSP7tokenA.interface.encodeFunctionData("transfer", [
          universalProfile1.address,
          universalProfile2.address,
          "5",
          false,
          "0x",
        ]);

          const tx = await universalProfile1.connect(owner1).execute(OPERATIONS.CALL,LSP7tokenA.address,0,abi);
          const receipt = await tx.wait();
          const gasUsed = receipt.gasUsed.toNumber();
          console.log(gasUsed);
       });
       it("Should transfer 1 tokenA from UP1 to UP2 (UP1 and UP2 both have tokenA already) : 95,122", async () => {
        let abi = LSP7tokenA.interface.encodeFunctionData("transfer", [
          universalProfile1.address,
          universalProfile2.address,
          "1",
          false,
          "0x",
        ]);

          const tx =  await universalProfile1.connect(owner1).execute(OPERATIONS.CALL,LSP7tokenA.address,0,abi);
          const receipt = await tx.wait();
          const gasUsed = receipt.gasUsed.toNumber();
          console.log(gasUsed);
       });
       it("Should transfer remaning tokenA from UP1 to UP2 (UP1 sending all the balance and UP2 has already from the token being sent) : 90332 gas", async () => {
        let abi = LSP7tokenA.interface.encodeFunctionData("transfer", [
          universalProfile1.address,
          universalProfile2.address,
          "4",
          false,
          "0x",
        ]);

          const tx = await universalProfile1.connect(owner1).execute(OPERATIONS.CALL,LSP7tokenA.address,0,abi);
          const receipt = await tx.wait();
          const gasUsed = receipt.gasUsed.toNumber();
          console.log(gasUsed);
       });
       it("Should transfer all tokenA from UP2 to UP3 (Removing all tokens from UP2 and initiaiting the storage of UP3) : 107,422 gas", async () => {
        let abi = LSP7tokenA.interface.encodeFunctionData("transfer", [
          universalProfile2.address,
          universalProfile3.address,
          "10",
          false,
          "0x",
        ]);

          const tx = await universalProfile2.connect(owner2).execute(OPERATIONS.CALL,LSP7tokenA.address,0,abi);
          const receipt = await tx.wait();
          const gasUsed = receipt.gasUsed.toNumber();
          console.log(gasUsed);
      });
     })

     describe("Second Transfer ", () => {
        it("Should mint 10 tokenB to UP1 : 87,121", async () => {
        let abi = LSP7tokenB.interface.encodeFunctionData("mint", [
          universalProfile1.address,
          "10",
          false,
          "0x",
        ]);

          const tx =  await universalProfile1.connect(owner1).execute(OPERATIONS.CALL,LSP7tokenA.address,0,abi);
          const receipt = await tx.wait();
          const gasUsed = receipt.gasUsed.toNumber();
          console.log(gasUsed);
        });
       it("Should transfer 5 tokenB from UP1 to UP2 (UP2 didn't have any tokenB yet) : 112,222 gas", async () => {
        let abi = LSP7tokenB.interface.encodeFunctionData("transfer", [
          universalProfile1.address,
          universalProfile2.address,
          "5",
          false,
          "0x",
        ]);
        let abiExecutor = universalProfile1.interface.encodeFunctionData(
          "execute",
          [OPERATIONS.CALL, LSP7tokenB.address, 0, abi]
        );
          const tx = await universalProfile1.connect(owner1).execute(OPERATIONS.CALL,LSP7tokenA.address,0,abi);
          const receipt = await tx.wait();
          const gasUsed = receipt.gasUsed.toNumber();
          console.log(gasUsed);
       });
       it("Should transfer 1 tokenB from UP1 to UP2 (UP1 and UP2 both have tokenB already) : 95,122", async () => {
        let abi = LSP7tokenB.interface.encodeFunctionData("transfer", [
          universalProfile1.address,
          universalProfile2.address,
          "1",
          false,
          "0x",
        ]);

          const tx = await universalProfile1.connect(owner1).execute(OPERATIONS.CALL,LSP7tokenA.address,0,abi);
          const receipt = await tx.wait();
          const gasUsed = receipt.gasUsed.toNumber();
          console.log(gasUsed);
       });
       it("Should transfer remaning tokenB from UP1 to UP2 (UP1 sending all the balance and UP2 has already from the token being sent) : 90,322 gas", async () => {
        let abi = LSP7tokenB.interface.encodeFunctionData("transfer", [
          universalProfile1.address,
          universalProfile2.address,
          "4",
          false,
          "0x",
        ]);

          const tx = await universalProfile1.connect(owner1).execute(OPERATIONS.CALL,LSP7tokenA.address,0,abi);
          const receipt = await tx.wait();
          const gasUsed = receipt.gasUsed.toNumber();
          console.log(gasUsed);
       });
       it("Should transfer all tokenB from UP2 to UP3 (Removing all tokens from UP2 and initiaiting the storage of UP3) : 90,322 gas", async () => {
        let abi = LSP7tokenB.interface.encodeFunctionData("transfer", [
          universalProfile2.address,
          universalProfile3.address,
          "10",
          false,
          "0x",
        ]);

          const tx = await universalProfile2.connect(owner2).execute(OPERATIONS.CALL,LSP7tokenA.address,0,abi);
          const receipt = await tx.wait();
          const gasUsed = receipt.gasUsed.toNumber();
          console.log(gasUsed);
      });
     })

  });
  
  
})

describe("Gas cost getDataSingle With KM WIThout URD", () => {
    let accounts: SignerWithAddress[];
  let owner1, owner2,owner3;
  let keyManager1: LSP6KeyManager, keyManager2: LSP6KeyManager,keyManager3: LSP6KeyManager;
  let universalProfile1: UniversalProfile, universalProfile2: UniversalProfile,universalProfile3: UniversalProfile;

   beforeAll(async () => {
    accounts = await ethers.getSigners();
    owner1 = accounts[0];
     owner2 = accounts[1];
     owner3 = accounts[2];
    universalProfile1 = await new UniversalProfile__factory(owner1).deploy(
      owner1.address
    );
    universalProfile2 = await new UniversalProfile__factory(owner2).deploy(
      owner2.address
    );
     universalProfile3 = await new UniversalProfile__factory(owner3).deploy(
      owner3.address
    );
    keyManager1 = await new LSP6KeyManager__factory(owner1).deploy(
      universalProfile1.address
    );
    keyManager2 = await new LSP6KeyManager__factory(owner2).deploy(
      universalProfile2.address
    );
     keyManager3 = await new LSP6KeyManager__factory(owner3).deploy(
      universalProfile3.address
    );

    // Setting Permissions for UP1
    await universalProfile1.connect(owner1)['setData(bytes32[],bytes[])'](
      [
        // owner1 permissions
        ERC725YKeys.LSP6["AddressPermissions:Permissions"] +
          owner1.address.substring(2)
      ],
      [
        ALL_PERMISSIONS_SET
      ]
    );

    // switch account management to keyManager1
    await universalProfile1
      .connect(owner1)
      .transferOwnership(keyManager1.address);

    // Setting Permissions for UP2
    await universalProfile2.connect(owner2)['setData(bytes32[],bytes[])'](
      [
        // owner2 permission
        ERC725YKeys.LSP6["AddressPermissions:Permissions"] +
          owner2.address.substring(2)
      ],
      [
        ALL_PERMISSIONS_SET
      ]
    );

    // switch account management to keyManager2
    await universalProfile2
      .connect(owner2)
      .transferOwnership(keyManager2.address);
     
     // Setting Permissions for UP3
    await universalProfile3.connect(owner3)['setData(bytes32[],bytes[])'](
      [
        // owner2 permission
        ERC725YKeys.LSP6["AddressPermissions:Permissions"] +
          owner3.address.substring(2)
      ],
      [
        ALL_PERMISSIONS_SET
      ]
    );

    // switch account management to keyManager3
    await universalProfile3
      .connect(owner3)
      .transferOwnership(keyManager3.address);

    // fund each UP with ether
    await owner1.sendTransaction({
      to: universalProfile1.address,
      value: ethers.utils.parseEther("10"),
    });

    await owner2.sendTransaction({
      to: universalProfile2.address,
      value: ethers.utils.parseEther("10"),
    });
     await owner3.sendTransaction({
      to: universalProfile3.address,
      value: ethers.utils.parseEther("10"),
    });
   });
  
   describe("LSP7-DigitalAsset", () => {
    let LSP7tokenA, LSP7tokenB, LSP7tokenC, LSP7tokenD, LSP7tokenE;

    beforeAll(async () => {
      LSP7tokenA = await new LSP7Tester__factory(owner1).deploy(
        "TokenA",
        "TKA",
        owner1.address
      );
      LSP7tokenB = await new LSP7Tester__factory(owner1).deploy(
        "TokenB",
        "TKB",
        owner1.address
      );
      LSP7tokenC = await new LSP7Tester__factory(owner1).deploy(
        "TokenC",
        "TKC",
        owner1.address
      );
    });
     
     describe("First Transfer (Initiaiting the storage)", () => {
        it("Should mint 10 tokenA to UP1 : 151,382", async () => {
        let abi = LSP7tokenA.interface.encodeFunctionData("mint", [
          universalProfile1.address,
          "10",
          false,
          "0x",
        ]);
        let abiExecutor = universalProfile1.interface.encodeFunctionData(
          "execute",
          [OPERATIONS.CALL, LSP7tokenA.address, 0, abi]
        );
          const tx = await keyManager1.execute(abiExecutor, { from: owner1.address });
          const receipt = await tx.wait();
          const gasUsed = receipt.gasUsed.toNumber();
          console.log(gasUsed);
        });
       it("Should transfer 5 tokenA from UP1 to UP2 (UP2 didn't have any token yet) : 163,257 gas", async () => {
        let abi = LSP7tokenA.interface.encodeFunctionData("transfer", [
          universalProfile1.address,
          universalProfile2.address,
          "5",
          false,
          "0x",
        ]);
        let abiExecutor = universalProfile1.interface.encodeFunctionData(
          "execute",
          [OPERATIONS.CALL, LSP7tokenA.address, 0, abi]
        );
          const tx = await keyManager1.execute(abiExecutor, { from: owner1.address });
          const receipt = await tx.wait();
          const gasUsed = receipt.gasUsed.toNumber();
          console.log(gasUsed);
       });
       it("Should transfer 1 tokenA from UP1 to UP2 (UP1 and UP2 both have tokenA already) : 146,157", async () => {
        let abi = LSP7tokenA.interface.encodeFunctionData("transfer", [
          universalProfile1.address,
          universalProfile2.address,
          "1",
          false,
          "0x",
        ]);
        let abiExecutor = universalProfile1.interface.encodeFunctionData(
          "execute",
          [OPERATIONS.CALL, LSP7tokenA.address, 0, abi]
        );
          const tx = await keyManager1.execute(abiExecutor, { from: owner1.address });
          const receipt = await tx.wait();
          const gasUsed = receipt.gasUsed.toNumber();
          console.log(gasUsed);
       });
       it("Should transfer remaning tokenA from UP1 to UP2 (UP1 sending all the balance and UP2 has already from the token being sent) : 141,357 gas", async () => {
        let abi = LSP7tokenA.interface.encodeFunctionData("transfer", [
          universalProfile1.address,
          universalProfile2.address,
          "4",
          false,
          "0x",
        ]);
        let abiExecutor = universalProfile1.interface.encodeFunctionData(
          "execute",
          [OPERATIONS.CALL, LSP7tokenA.address, 0, abi]
        );
          const tx = await keyManager1.execute(abiExecutor, { from: owner1.address });
          const receipt = await tx.wait();
          const gasUsed = receipt.gasUsed.toNumber();
          console.log(gasUsed);
       });
       it("Should transfer all tokenA from UP2 to UP3 (Removing all tokens from UP2 and initiaiting the storage of UP3) : 158,469 gas", async () => {
        let abi = LSP7tokenA.interface.encodeFunctionData("transfer", [
          universalProfile2.address,
          universalProfile3.address,
          "10",
          false,
          "0x",
        ]);
        let abiExecutor = universalProfile2.interface.encodeFunctionData(
          "execute",
          [OPERATIONS.CALL, LSP7tokenA.address, 0, abi]
        );
          const tx = await keyManager2.execute(abiExecutor, { from: owner2.address });
          const receipt = await tx.wait();
          const gasUsed = receipt.gasUsed.toNumber();
          console.log(gasUsed);
      });
     })

     describe("Second Transfer ", () => {
        it("Should mint 10 tokenB to UP1 : 151,382", async () => {
        let abi = LSP7tokenB.interface.encodeFunctionData("mint", [
          universalProfile1.address,
          "10",
          false,
          "0x",
        ]);
        let abiExecutor = universalProfile1.interface.encodeFunctionData(
          "execute",
          [OPERATIONS.CALL, LSP7tokenB.address, 0, abi]
        );
          const tx = await keyManager1.execute(abiExecutor, { from: owner1.address });
          const receipt = await tx.wait();
          const gasUsed = receipt.gasUsed.toNumber();
          console.log(gasUsed);
        });
       it("Should transfer 5 tokenB from UP1 to UP2 (UP2 didn't have any tokenB yet) : 163,257 gas", async () => {
        let abi = LSP7tokenB.interface.encodeFunctionData("transfer", [
          universalProfile1.address,
          universalProfile2.address,
          "5",
          false,
          "0x",
        ]);
        let abiExecutor = universalProfile1.interface.encodeFunctionData(
          "execute",
          [OPERATIONS.CALL, LSP7tokenB.address, 0, abi]
        );
          const tx = await keyManager1.execute(abiExecutor, { from: owner1.address });
          const receipt = await tx.wait();
          const gasUsed = receipt.gasUsed.toNumber();
          console.log(gasUsed);
       });
       it("Should transfer 1 tokenB from UP1 to UP2 (UP1 and UP2 both have tokenB already) : 146,157", async () => {
        let abi = LSP7tokenB.interface.encodeFunctionData("transfer", [
          universalProfile1.address,
          universalProfile2.address,
          "1",
          false,
          "0x",
        ]);
        let abiExecutor = universalProfile1.interface.encodeFunctionData(
          "execute",
          [OPERATIONS.CALL, LSP7tokenB.address, 0, abi]
        );
          const tx = await keyManager1.execute(abiExecutor, { from: owner1.address });
          const receipt = await tx.wait();
          const gasUsed = receipt.gasUsed.toNumber();
          console.log(gasUsed);
       });
       it("Should transfer remaning tokenB from UP1 to UP2 (UP1 sending all the balance and UP2 has already from the token being sent) : 141,357 gas", async () => {
        let abi = LSP7tokenB.interface.encodeFunctionData("transfer", [
          universalProfile1.address,
          universalProfile2.address,
          "4",
          false,
          "0x",
        ]);
        let abiExecutor = universalProfile1.interface.encodeFunctionData(
          "execute",
          [OPERATIONS.CALL, LSP7tokenB.address, 0, abi]
        );
          const tx = await keyManager1.execute(abiExecutor, { from: owner1.address });
          const receipt = await tx.wait();
          const gasUsed = receipt.gasUsed.toNumber();
          console.log(gasUsed);
       });
       it("Should transfer all tokenB from UP2 to UP3 (Removing all tokens from UP2 and initiaiting the storage of UP3) : 158,469 gas", async () => {
        let abi = LSP7tokenB.interface.encodeFunctionData("transfer", [
          universalProfile2.address,
          universalProfile3.address,
          "10",
          false,
          "0x",
        ]);
        let abiExecutor = universalProfile2.interface.encodeFunctionData(
          "execute",
          [OPERATIONS.CALL, LSP7tokenB.address, 0, abi]
        );
          const tx = await keyManager2.execute(abiExecutor, { from: owner2.address });
          const receipt = await tx.wait();
          const gasUsed = receipt.gasUsed.toNumber();
          console.log(gasUsed);
      });
     })

  });
  
  
})

describe("Gas cost getData MODIFIED With KM WITHOUT URD", () => {
    let accounts: SignerWithAddress[];
  let owner1, owner2,owner3;
  let keyManager1: LSP6KeyManagerV2, keyManager2: LSP6KeyManagerV2,keyManager3: LSP6KeyManagerV2;
  let universalProfile1: UniversalProfileV2, universalProfile2: UniversalProfileV2,universalProfile3: UniversalProfileV2;

   beforeAll(async () => {
    accounts = await ethers.getSigners();
    owner1 = accounts[0];
     owner2 = accounts[1];
     owner3 = accounts[2];
    universalProfile1 = await new UniversalProfileV2__factory(owner1).deploy(
      owner1.address
    );
    universalProfile2 = await new UniversalProfileV2__factory(owner2).deploy(
      owner2.address
    );
     universalProfile3 = await new UniversalProfileV2__factory(owner3).deploy(
      owner3.address
    );
    keyManager1 = await new LSP6KeyManagerV2__factory(owner1).deploy(
      universalProfile1.address
    );
    keyManager2 = await new LSP6KeyManagerV2__factory(owner2).deploy(
      universalProfile2.address
    );
     keyManager3 = await new LSP6KeyManagerV2__factory(owner3).deploy(
      universalProfile3.address
    );

    // Setting Permissions for UP1
    await universalProfile1.connect(owner1)['setData(bytes32[],bytes[])'](
      [
        // owner1 permissions
        ERC725YKeys.LSP6["AddressPermissions:Permissions"] +
          owner1.address.substring(2)
      ],
      [
        ALL_PERMISSIONS_SET
      ]
    );

    // switch account management to keyManager1
    await universalProfile1
      .connect(owner1)
      .transferOwnership(keyManager1.address);

    // Setting Permissions for UP2
    await universalProfile2.connect(owner2)['setData(bytes32[],bytes[])'](
      [
        // owner2 permission
        ERC725YKeys.LSP6["AddressPermissions:Permissions"] +
          owner2.address.substring(2)
      ],
      [
        ALL_PERMISSIONS_SET
      ]
    );

    // switch account management to keyManager2
    await universalProfile2
      .connect(owner2)
      .transferOwnership(keyManager2.address);
     
     // Setting Permissions for UP3
    await universalProfile3.connect(owner3)['setData(bytes32[],bytes[])'](
      [
        // owner2 permission
        ERC725YKeys.LSP6["AddressPermissions:Permissions"] +
          owner3.address.substring(2)
      ],
      [
        ALL_PERMISSIONS_SET
      ]
    );

    // switch account management to keyManager3
    await universalProfile3
      .connect(owner3)
      .transferOwnership(keyManager3.address);

    // fund each UP with ether
    await owner1.sendTransaction({
      to: universalProfile1.address,
      value: ethers.utils.parseEther("10"),
    });

    await owner2.sendTransaction({
      to: universalProfile2.address,
      value: ethers.utils.parseEther("10"),
    });
     await owner3.sendTransaction({
      to: universalProfile3.address,
      value: ethers.utils.parseEther("10"),
    });
   });
  
   describe("LSP7-DigitalAsset", () => {
    let LSP7tokenA, LSP7tokenB, LSP7tokenC, LSP7tokenD, LSP7tokenE;

    beforeAll(async () => {
      LSP7tokenA = await new LSP7Tester__factory(owner1).deploy(
        "TokenA",
        "TKA",
        owner1.address
      );
      LSP7tokenB = await new LSP7Tester__factory(owner1).deploy(
        "TokenB",
        "TKB",
        owner1.address
      );
      LSP7tokenC = await new LSP7Tester__factory(owner1).deploy(
        "TokenC",
        "TKC",
        owner1.address
      );
    });
     
     describe("First Transfer (Initiaiting the storage)", () => {
        it("Should mint 10 tokenA to UP1 : 138,733", async () => {
        let abi = LSP7tokenA.interface.encodeFunctionData("mint", [
          universalProfile1.address,
          "10",
          false,
          "0x",
        ]);
        let abiExecutor = universalProfile1.interface.encodeFunctionData(
          "execute",
          [OPERATIONS.CALL, LSP7tokenA.address, 0, abi]
        );
          const tx = await keyManager1.execute(abiExecutor, { from: owner1.address });
          const receipt = await tx.wait();
          const gasUsed = receipt.gasUsed.toNumber();
          console.log(gasUsed);
        });
       it("Should transfer 5 tokenA from UP1 to UP2 (UP2 didn't have any token yet) : 146,999 gas", async () => {
        let abi = LSP7tokenA.interface.encodeFunctionData("transfer", [
          universalProfile1.address,
          universalProfile2.address,
          "5",
          false,
          "0x",
        ]);
        let abiExecutor = universalProfile1.interface.encodeFunctionData(
          "execute",
          [OPERATIONS.CALL, LSP7tokenA.address, 0, abi]
        );
          const tx = await keyManager1.execute(abiExecutor, { from: owner1.address });
          const receipt = await tx.wait();
          const gasUsed = receipt.gasUsed.toNumber();
          console.log(gasUsed);
       });
       it("Should transfer 1 tokenA from UP1 to UP2 (UP1 and UP2 both have tokenA already) : 129,899", async () => {
        let abi = LSP7tokenA.interface.encodeFunctionData("transfer", [
          universalProfile1.address,
          universalProfile2.address,
          "1",
          false,
          "0x",
        ]);
        let abiExecutor = universalProfile1.interface.encodeFunctionData(
          "execute",
          [OPERATIONS.CALL, LSP7tokenA.address, 0, abi]
        );
          const tx = await keyManager1.execute(abiExecutor, { from: owner1.address });
          const receipt = await tx.wait();
          const gasUsed = receipt.gasUsed.toNumber();
          console.log(gasUsed);
       });
       it("Should transfer remaning tokenA from UP1 to UP2 (UP1 sending all the balance and UP2 has already from the token being sent) : 125,099 gas", async () => {
        let abi = LSP7tokenA.interface.encodeFunctionData("transfer", [
          universalProfile1.address,
          universalProfile2.address,
          "4",
          false,
          "0x",
        ]);
        let abiExecutor = universalProfile1.interface.encodeFunctionData(
          "execute",
          [OPERATIONS.CALL, LSP7tokenA.address, 0, abi]
        );
          const tx = await keyManager1.execute(abiExecutor, { from: owner1.address });
          const receipt = await tx.wait();
          const gasUsed = receipt.gasUsed.toNumber();
          console.log(gasUsed);
       });
       it("Should transfer all tokenA from UP2 to UP3 (Removing all tokens from UP2 and initiaiting the storage of UP3) : 142,199 gas", async () => {
        let abi = LSP7tokenA.interface.encodeFunctionData("transfer", [
          universalProfile2.address,
          universalProfile3.address,
          "10",
          false,
          "0x",
        ]);
        let abiExecutor = universalProfile2.interface.encodeFunctionData(
          "execute",
          [OPERATIONS.CALL, LSP7tokenA.address, 0, abi]
        );
          const tx = await keyManager2.execute(abiExecutor, { from: owner2.address });
          const receipt = await tx.wait();
          const gasUsed = receipt.gasUsed.toNumber();
          console.log(gasUsed);
      });
     })

     describe("Second Transfer ", () => {
        it("Should mint 10 tokenB to UP1 : 138,733", async () => {
        let abi = LSP7tokenB.interface.encodeFunctionData("mint", [
          universalProfile1.address,
          "10",
          false,
          "0x",
        ]);
        let abiExecutor = universalProfile1.interface.encodeFunctionData(
          "execute",
          [OPERATIONS.CALL, LSP7tokenB.address, 0, abi]
        );
          const tx = await keyManager1.execute(abiExecutor, { from: owner1.address });
          const receipt = await tx.wait();
          const gasUsed = receipt.gasUsed.toNumber();
          console.log(gasUsed);
        });
       it("Should transfer 5 tokenB from UP1 to UP2 (UP2 didn't have any tokenB yet) : 146,999 gas", async () => {
        let abi = LSP7tokenB.interface.encodeFunctionData("transfer", [
          universalProfile1.address,
          universalProfile2.address,
          "5",
          false,
          "0x",
        ]);
        let abiExecutor = universalProfile1.interface.encodeFunctionData(
          "execute",
          [OPERATIONS.CALL, LSP7tokenB.address, 0, abi]
        );
          const tx = await keyManager1.execute(abiExecutor, { from: owner1.address });
          const receipt = await tx.wait();
          const gasUsed = receipt.gasUsed.toNumber();
          console.log(gasUsed);
       });
       it("Should transfer 1 tokenB from UP1 to UP2 (UP1 and UP2 both have tokenB already) : 129899", async () => {
        let abi = LSP7tokenB.interface.encodeFunctionData("transfer", [
          universalProfile1.address,
          universalProfile2.address,
          "1",
          false,
          "0x",
        ]);
        let abiExecutor = universalProfile1.interface.encodeFunctionData(
          "execute",
          [OPERATIONS.CALL, LSP7tokenB.address, 0, abi]
        );
          const tx = await keyManager1.execute(abiExecutor, { from: owner1.address });
          const receipt = await tx.wait();
          const gasUsed = receipt.gasUsed.toNumber();
          console.log(gasUsed);
       });
       it("Should transfer remaning tokenB from UP1 to UP2 (UP1 sending all the balance and UP2 has already from the token being sent) : 125,009 gas", async () => {
        let abi = LSP7tokenB.interface.encodeFunctionData("transfer", [
          universalProfile1.address,
          universalProfile2.address,
          "4",
          false,
          "0x",
        ]);
        let abiExecutor = universalProfile1.interface.encodeFunctionData(
          "execute",
          [OPERATIONS.CALL, LSP7tokenB.address, 0, abi]
        );
          const tx = await keyManager1.execute(abiExecutor, { from: owner1.address });
          const receipt = await tx.wait();
          const gasUsed = receipt.gasUsed.toNumber();
          console.log(gasUsed);
       });
       it("Should transfer all tokenB from UP2 to UP3 (Removing all tokens from UP2 and initiaiting the storage of UP3) : 142,199 gas", async () => {
        let abi = LSP7tokenB.interface.encodeFunctionData("transfer", [
          universalProfile2.address,
          universalProfile3.address,
          "10",
          false,
          "0x",
        ]);
        let abiExecutor = universalProfile2.interface.encodeFunctionData(
          "execute",
          [OPERATIONS.CALL, LSP7tokenB.address, 0, abi]
        );
          const tx = await keyManager2.execute(abiExecutor, { from: owner2.address });
          const receipt = await tx.wait();
          const gasUsed = receipt.gasUsed.toNumber();
          console.log(gasUsed);
      });
     })

  });
  
  
})


describe("Gas cost getDataSingle WITH URD", () => {
    let accounts: SignerWithAddress[];
  let owner1, owner2,owner3;
  let keyManager1: LSP6KeyManager, keyManager2: LSP6KeyManager,keyManager3: LSP6KeyManager;
  let universalReceiverDelegate: LSP1UniversalReceiverDelegateUP;
  let universalProfile1: UniversalProfile, universalProfile2: UniversalProfile,universalProfile3: UniversalProfile;

   beforeAll(async () => {
    accounts = await ethers.getSigners();
    owner1 = accounts[0];
     owner2 = accounts[1];
     owner3 = accounts[2];
    universalProfile1 = await new UniversalProfile__factory(owner1).deploy(
      owner1.address
    );
    universalProfile2 = await new UniversalProfile__factory(owner2).deploy(
      owner2.address
    );
     universalProfile3 = await new UniversalProfile__factory(owner3).deploy(
      owner3.address
    );
    keyManager1 = await new LSP6KeyManager__factory(owner1).deploy(
      universalProfile1.address
    );
    keyManager2 = await new LSP6KeyManager__factory(owner2).deploy(
      universalProfile2.address
    );
     keyManager3 = await new LSP6KeyManager__factory(owner3).deploy(
      universalProfile3.address
    );
    universalReceiverDelegate =
      await new LSP1UniversalReceiverDelegateUP__factory(owner1).deploy();

    // Setting Permissions for UP1
    await universalProfile1.connect(owner1).setData(
      [
        // owner1 permissions
        ERC725YKeys.LSP6["AddressPermissions:Permissions"] +
          owner1.address.substring(2),
        // set the URD key
        ERC725YKeys.LSP0["LSP1UniversalReceiverDelegate"],
        // set URD permissions
        ERC725YKeys.LSP6["AddressPermissions:Permissions"] +
          universalReceiverDelegate.address.substring(2),
      ],
      [
        ALL_PERMISSIONS_SET,
        universalReceiverDelegate.address,
        ethers.utils.hexZeroPad(PERMISSIONS.SETDATA, 32),
      ]
    );

    // switch account management to keyManager1
    await universalProfile1
      .connect(owner1)
      .transferOwnership(keyManager1.address);

    // Setting Permissions for UP2
    await universalProfile2.connect(owner2).setData(
      [
        // owner2 permission
        ERC725YKeys.LSP6["AddressPermissions:Permissions"] +
          owner2.address.substring(2),
        // set the URD Key
        ERC725YKeys.LSP0["LSP1UniversalReceiverDelegate"],
        // set URD permissions
        ERC725YKeys.LSP6["AddressPermissions:Permissions"] +
          universalReceiverDelegate.address.substring(2),
      ],
      [
        ALL_PERMISSIONS_SET,
        universalReceiverDelegate.address,
        ethers.utils.hexZeroPad(PERMISSIONS.SETDATA, 32),
      ]
    );

    // switch account management to keyManager2
    await universalProfile2
      .connect(owner2)
      .transferOwnership(keyManager2.address);
     
     // Setting Permissions for UP3
    await universalProfile3.connect(owner3).setData(
      [
        // owner2 permission
        ERC725YKeys.LSP6["AddressPermissions:Permissions"] +
          owner3.address.substring(2),
        // set the URD Key
        ERC725YKeys.LSP0["LSP1UniversalReceiverDelegate"],
        // set URD permissions
        ERC725YKeys.LSP6["AddressPermissions:Permissions"] +
          universalReceiverDelegate.address.substring(2),
      ],
      [
        ALL_PERMISSIONS_SET,
        universalReceiverDelegate.address,
        ethers.utils.hexZeroPad(PERMISSIONS.SETDATA, 32),
      ]
    );

    // switch account management to keyManager3
    await universalProfile3
      .connect(owner3)
      .transferOwnership(keyManager3.address);

    // fund each UP with ether
    await owner1.sendTransaction({
      to: universalProfile1.address,
      value: ethers.utils.parseEther("10"),
    });

    await owner2.sendTransaction({
      to: universalProfile2.address,
      value: ethers.utils.parseEther("10"),
    });
     await owner3.sendTransaction({
      to: universalProfile3.address,
      value: ethers.utils.parseEther("10"),
    });
   });
  
   describe("LSP7-DigitalAsset", () => {
    let LSP7tokenA, LSP7tokenB, LSP7tokenC, LSP7tokenD, LSP7tokenE;

    beforeAll(async () => {
      LSP7tokenA = await new LSP7Tester__factory(owner1).deploy(
        "TokenA",
        "TKA",
        owner1.address
      );
      LSP7tokenB = await new LSP7Tester__factory(owner1).deploy(
        "TokenB",
        "TKB",
        owner1.address
      );
      LSP7tokenC = await new LSP7Tester__factory(owner1).deploy(
        "TokenC",
        "TKC",
        owner1.address
      );
    });
     
     describe("First Transfer (Initiaiting the storage)", () => {
        it("Should mint 10 tokenA to UP1 : 310,041 gas", async () => {
        let abi = LSP7tokenA.interface.encodeFunctionData("mint", [
          universalProfile1.address,
          "10",
          false,
          "0x",
        ]);
        let abiExecutor = universalProfile1.interface.encodeFunctionData(
          "execute",
          [OPERATIONS.CALL, LSP7tokenA.address, 0, abi]
        );
          const tx = await keyManager1.execute(abiExecutor, { from: owner1.address });
          const receipt = await tx.wait();
          const gasUsed = receipt.gasUsed.toNumber();
          console.log(gasUsed);
        });
       it("Should transfer 5 tokenA from UP1 to UP2 (UP2 didn't have any token yet) : 347,842 gas", async () => {
        let abi = LSP7tokenA.interface.encodeFunctionData("transfer", [
          universalProfile1.address,
          universalProfile2.address,
          "5",
          false,
          "0x",
        ]);
        let abiExecutor = universalProfile1.interface.encodeFunctionData(
          "execute",
          [OPERATIONS.CALL, LSP7tokenA.address, 0, abi]
        );
          const tx = await keyManager1.execute(abiExecutor, { from: owner1.address });
          const receipt = await tx.wait();
          const gasUsed = receipt.gasUsed.toNumber();
          console.log(gasUsed);
       });
       it("Should transfer 1 tokenA from UP1 to UP2 (UP1 and UP2 both have tokenA already) : 194,622", async () => {
        let abi = LSP7tokenA.interface.encodeFunctionData("transfer", [
          universalProfile1.address,
          universalProfile2.address,
          "1",
          false,
          "0x",
        ]);
        let abiExecutor = universalProfile1.interface.encodeFunctionData(
          "execute",
          [OPERATIONS.CALL, LSP7tokenA.address, 0, abi]
        );
          const tx = await keyManager1.execute(abiExecutor, { from: owner1.address });
          const receipt = await tx.wait();
          const gasUsed = receipt.gasUsed.toNumber();
          console.log(gasUsed);
       });
       it("Should transfer remaning tokenA from UP1 to UP2 (UP1 sending all the balance and UP2 has already from the token being sent) : 262,660 gas", async () => {
        let abi = LSP7tokenA.interface.encodeFunctionData("transfer", [
          universalProfile1.address,
          universalProfile2.address,
          "4",
          false,
          "0x",
        ]);
        let abiExecutor = universalProfile1.interface.encodeFunctionData(
          "execute",
          [OPERATIONS.CALL, LSP7tokenA.address, 0, abi]
        );
          const tx = await keyManager1.execute(abiExecutor, { from: owner1.address });
          const receipt = await tx.wait();
          const gasUsed = receipt.gasUsed.toNumber();
          console.log(gasUsed);
       });
       it("Should transfer all tokenA from UP2 to UP3 (Removing all tokens from UP2 and initiaiting the storage of UP3) : 415,880 gas", async () => {
        let abi = LSP7tokenA.interface.encodeFunctionData("transfer", [
          universalProfile2.address,
          universalProfile3.address,
          "10",
          false,
          "0x",
        ]);
        let abiExecutor = universalProfile2.interface.encodeFunctionData(
          "execute",
          [OPERATIONS.CALL, LSP7tokenA.address, 0, abi]
        );
          const tx = await keyManager2.execute(abiExecutor, { from: owner2.address });
          const receipt = await tx.wait();
          const gasUsed = receipt.gasUsed.toNumber();
          console.log(gasUsed);
      });
     })

     describe("Second Transfer ", () => {
        it("Should mint 10 tokenB to UP1 : 290,706", async () => {
        let abi = LSP7tokenB.interface.encodeFunctionData("mint", [
          universalProfile1.address,
          "10",
          false,
          "0x",
        ]);
        let abiExecutor = universalProfile1.interface.encodeFunctionData(
          "execute",
          [OPERATIONS.CALL, LSP7tokenB.address, 0, abi]
        );
          const tx = await keyManager1.execute(abiExecutor, { from: owner1.address });
          const receipt = await tx.wait();
          const gasUsed = receipt.gasUsed.toNumber();
          console.log(gasUsed);
        });
       it("Should transfer 5 tokenB from UP1 to UP2 (UP2 didn't have any tokenB yet) : 328,507 gas", async () => {
        let abi = LSP7tokenB.interface.encodeFunctionData("transfer", [
          universalProfile1.address,
          universalProfile2.address,
          "5",
          false,
          "0x",
        ]);
        let abiExecutor = universalProfile1.interface.encodeFunctionData(
          "execute",
          [OPERATIONS.CALL, LSP7tokenB.address, 0, abi]
        );
          const tx = await keyManager1.execute(abiExecutor, { from: owner1.address });
          const receipt = await tx.wait();
          const gasUsed = receipt.gasUsed.toNumber();
          console.log(gasUsed);
       });
       it("Should transfer 1 tokenB from UP1 to UP2 (UP1 and UP2 both have tokenB already) : 194,622", async () => {
        let abi = LSP7tokenB.interface.encodeFunctionData("transfer", [
          universalProfile1.address,
          universalProfile2.address,
          "1",
          false,
          "0x",
        ]);
        let abiExecutor = universalProfile1.interface.encodeFunctionData(
          "execute",
          [OPERATIONS.CALL, LSP7tokenB.address, 0, abi]
        );
          const tx = await keyManager1.execute(abiExecutor, { from: owner1.address });
          const receipt = await tx.wait();
          const gasUsed = receipt.gasUsed.toNumber();
          console.log(gasUsed);
       });
       it("Should transfer remaning tokenB from UP1 to UP2 (UP1 sending all the balance and UP2 has already from the token being sent) : 262,660 gas", async () => {
        let abi = LSP7tokenB.interface.encodeFunctionData("transfer", [
          universalProfile1.address,
          universalProfile2.address,
          "4",
          false,
          "0x",
        ]);
        let abiExecutor = universalProfile1.interface.encodeFunctionData(
          "execute",
          [OPERATIONS.CALL, LSP7tokenB.address, 0, abi]
        );
          const tx = await keyManager1.execute(abiExecutor, { from: owner1.address });
          const receipt = await tx.wait();
          const gasUsed = receipt.gasUsed.toNumber();
          console.log(gasUsed);
       });
       it("Should transfer all tokenB from UP2 to UP3 (Removing all tokens from UP2 and initiaiting the storage of UP3) : 379,445 gas", async () => {
        let abi = LSP7tokenB.interface.encodeFunctionData("transfer", [
          universalProfile2.address,
          universalProfile3.address,
          "10",
          false,
          "0x",
        ]);
        let abiExecutor = universalProfile2.interface.encodeFunctionData(
          "execute",
          [OPERATIONS.CALL, LSP7tokenB.address, 0, abi]
        );
          const tx = await keyManager2.execute(abiExecutor, { from: owner2.address });
          const receipt = await tx.wait();
          const gasUsed = receipt.gasUsed.toNumber();
          console.log(gasUsed);
      });
     })

  });
  
  
})

describe("Gas cost getData MODIFIED WITH URD", () => {
    let accounts: SignerWithAddress[];
  let owner1, owner2,owner3;
  let keyManager1: LSP6KeyManagerV2, keyManager2: LSP6KeyManagerV2,keyManager3: LSP6KeyManagerV2;
  let universalReceiverDelegate: LSP1UniversalReceiverDelegateUPV2;
  let universalProfile1: UniversalProfileV2, universalProfile2: UniversalProfileV2,universalProfile3: UniversalProfileV2;

   beforeAll(async () => {
    accounts = await ethers.getSigners();
    owner1 = accounts[0];
     owner2 = accounts[1];
     owner3 = accounts[2];
    universalProfile1 = await new UniversalProfileV2__factory(owner1).deploy(
      owner1.address
    );
    universalProfile2 = await new UniversalProfileV2__factory(owner2).deploy(
      owner2.address
    );
     universalProfile3 = await new UniversalProfileV2__factory(owner3).deploy(
      owner3.address
    );
    keyManager1 = await new LSP6KeyManagerV2__factory(owner1).deploy(
      universalProfile1.address
    );
    keyManager2 = await new LSP6KeyManagerV2__factory(owner2).deploy(
      universalProfile2.address
    );
     keyManager3 = await new LSP6KeyManagerV2__factory(owner3).deploy(
      universalProfile3.address
    );
    universalReceiverDelegate =
      await new LSP1UniversalReceiverDelegateUPV2__factory(owner1).deploy();

    // Setting Permissions for UP1
    await universalProfile1.connect(owner1)['setData(bytes32[],bytes[])'](
      [
        // owner1 permissions
        ERC725YKeys.LSP6["AddressPermissions:Permissions"] +
          owner1.address.substring(2),
        // set the URD key
        ERC725YKeys.LSP0["LSP1UniversalReceiverDelegate"],
        // set URD permissions
        ERC725YKeys.LSP6["AddressPermissions:Permissions"] +
          universalReceiverDelegate.address.substring(2),
      ],
      [
        ALL_PERMISSIONS_SET,
        universalReceiverDelegate.address,
        ethers.utils.hexZeroPad(PERMISSIONS.SETDATA, 32),
      ]
    );

    // switch account management to keyManager1
    await universalProfile1
      .connect(owner1)
      .transferOwnership(keyManager1.address);

    // Setting Permissions for UP2
    await universalProfile2.connect(owner2)['setData(bytes32[],bytes[])'](
      [
        // owner2 permission
        ERC725YKeys.LSP6["AddressPermissions:Permissions"] +
          owner2.address.substring(2),
        // set the URD Key
        ERC725YKeys.LSP0["LSP1UniversalReceiverDelegate"],
        // set URD permissions
        ERC725YKeys.LSP6["AddressPermissions:Permissions"] +
          universalReceiverDelegate.address.substring(2),
      ],
      [
        ALL_PERMISSIONS_SET,
        universalReceiverDelegate.address,
        ethers.utils.hexZeroPad(PERMISSIONS.SETDATA, 32),
      ]
    );

    // switch account management to keyManager2
    await universalProfile2
      .connect(owner2)
      .transferOwnership(keyManager2.address);
     
     // Setting Permissions for UP3
    await universalProfile3.connect(owner3)['setData(bytes32[],bytes[])'](
      [
        // owner2 permission
        ERC725YKeys.LSP6["AddressPermissions:Permissions"] +
          owner3.address.substring(2),
        // set the URD Key
        ERC725YKeys.LSP0["LSP1UniversalReceiverDelegate"],
        // set URD permissions
        ERC725YKeys.LSP6["AddressPermissions:Permissions"] +
          universalReceiverDelegate.address.substring(2),
      ],
      [
        ALL_PERMISSIONS_SET,
        universalReceiverDelegate.address,
        ethers.utils.hexZeroPad(PERMISSIONS.SETDATA, 32),
      ]
    );

    // switch account management to keyManager3
    await universalProfile3
      .connect(owner3)
      .transferOwnership(keyManager3.address);

    // fund each UP with ether
    await owner1.sendTransaction({
      to: universalProfile1.address,
      value: ethers.utils.parseEther("10"),
    });

    await owner2.sendTransaction({
      to: universalProfile2.address,
      value: ethers.utils.parseEther("10"),
    });
     await owner3.sendTransaction({
      to: universalProfile3.address,
      value: ethers.utils.parseEther("10"),
    });
   });
  
   describe("LSP7-DigitalAsset", () => {
    let LSP7tokenA, LSP7tokenB, LSP7tokenC, LSP7tokenD, LSP7tokenE;

    beforeAll(async () => {
      LSP7tokenA = await new LSP7Tester__factory(owner1).deploy(
        "TokenA",
        "TKA",
        owner1.address
      );
      LSP7tokenB = await new LSP7Tester__factory(owner1).deploy(
        "TokenB",
        "TKB",
        owner1.address
      );
      LSP7tokenC = await new LSP7Tester__factory(owner1).deploy(
        "TokenC",
        "TKC",
        owner1.address
      );
    });
     
     describe("First Transfer (Initiaiting the storage)", () => {
        it("Should mint 10 tokenA to UP1 : 288,533", async () => {
        let abi = LSP7tokenA.interface.encodeFunctionData("mint", [
          universalProfile1.address,
          "10",
          false,
          "0x",
        ]);
        let abiExecutor = universalProfile1.interface.encodeFunctionData(
          "execute",
          [OPERATIONS.CALL, LSP7tokenA.address, 0, abi]
        );
          const tx = await keyManager1.execute(abiExecutor, { from: owner1.address });
          const receipt = await tx.wait();
          const gasUsed = receipt.gasUsed.toNumber();
          console.log(gasUsed);
        });
       it("Should transfer 5 tokenA from UP1 to UP2 (UP2 didn't have any token yet) : 320,251 gas", async () => {
        let abi = LSP7tokenA.interface.encodeFunctionData("transfer", [
          universalProfile1.address,
          universalProfile2.address,
          "5",
          false,
          "0x",
        ]);
        let abiExecutor = universalProfile1.interface.encodeFunctionData(
          "execute",
          [OPERATIONS.CALL, LSP7tokenA.address, 0, abi]
        );
          const tx = await keyManager1.execute(abiExecutor, { from: owner1.address });
          const receipt = await tx.wait();
          const gasUsed = receipt.gasUsed.toNumber();
          console.log(gasUsed);
       });
       it("Should transfer 1 tokenA from UP1 to UP2 (UP1 and UP2 both have tokenA already) : 173,404", async () => {
        let abi = LSP7tokenA.interface.encodeFunctionData("transfer", [
          universalProfile1.address,
          universalProfile2.address,
          "1",
          false,
          "0x",
        ]);
        let abiExecutor = universalProfile1.interface.encodeFunctionData(
          "execute",
          [OPERATIONS.CALL, LSP7tokenA.address, 0, abi]
        );
          const tx = await keyManager1.execute(abiExecutor, { from: owner1.address });
          const receipt = await tx.wait();
          const gasUsed = receipt.gasUsed.toNumber();
          console.log(gasUsed);
       });
       it("Should transfer remaning tokenA from UP1 to UP2 (UP1 sending all the balance and UP2 has already from the token being sent) : 231,114 gas", async () => {
        let abi = LSP7tokenA.interface.encodeFunctionData("transfer", [
          universalProfile1.address,
          universalProfile2.address,
          "4",
          false,
          "0x",
        ]);
        let abiExecutor = universalProfile1.interface.encodeFunctionData(
          "execute",
          [OPERATIONS.CALL, LSP7tokenA.address, 0, abi]
        );
          const tx = await keyManager1.execute(abiExecutor, { from: owner1.address });
          const receipt = await tx.wait();
          const gasUsed = receipt.gasUsed.toNumber();
          console.log(gasUsed);
       });
       it("Should transfer all tokenA from UP2 to UP3 (Removing all tokens from UP2 and initiaiting the storage of UP3) : 379,961 gas", async () => {
        let abi = LSP7tokenA.interface.encodeFunctionData("transfer", [
          universalProfile2.address,
          universalProfile3.address,
          "10",
          false,
          "0x",
        ]);
        let abiExecutor = universalProfile2.interface.encodeFunctionData(
          "execute",
          [OPERATIONS.CALL, LSP7tokenA.address, 0, abi]
        );
          const tx = await keyManager2.execute(abiExecutor, { from: owner2.address });
          const receipt = await tx.wait();
          const gasUsed = receipt.gasUsed.toNumber();
          console.log(gasUsed);
      });
     })

     describe("Second Transfer ", () => {
        it("Should mint 10 tokenB to UP1 : 269,185", async () => {
        let abi = LSP7tokenB.interface.encodeFunctionData("mint", [
          universalProfile1.address,
          "10",
          false,
          "0x",
        ]);
        let abiExecutor = universalProfile1.interface.encodeFunctionData(
          "execute",
          [OPERATIONS.CALL, LSP7tokenB.address, 0, abi]
        );
          const tx = await keyManager1.execute(abiExecutor, { from: owner1.address });
          const receipt = await tx.wait();
          const gasUsed = receipt.gasUsed.toNumber();
          console.log(gasUsed);
        });
       it("Should transfer 5 tokenB from UP1 to UP2 (UP2 didn't have any tokenB yet) : 300,903 gas", async () => {
        let abi = LSP7tokenB.interface.encodeFunctionData("transfer", [
          universalProfile1.address,
          universalProfile2.address,
          "5",
          false,
          "0x",
        ]);
        let abiExecutor = universalProfile1.interface.encodeFunctionData(
          "execute",
          [OPERATIONS.CALL, LSP7tokenB.address, 0, abi]
        );
          const tx = await keyManager1.execute(abiExecutor, { from: owner1.address });
          const receipt = await tx.wait();
          const gasUsed = receipt.gasUsed.toNumber();
          console.log(gasUsed);
       });
       it("Should transfer 1 tokenB from UP1 to UP2 (UP1 and UP2 both have tokenB already) : 173,392", async () => {
        let abi = LSP7tokenB.interface.encodeFunctionData("transfer", [
          universalProfile1.address,
          universalProfile2.address,
          "1",
          false,
          "0x",
        ]);
        let abiExecutor = universalProfile1.interface.encodeFunctionData(
          "execute",
          [OPERATIONS.CALL, LSP7tokenB.address, 0, abi]
        );
          const tx = await keyManager1.execute(abiExecutor, { from: owner1.address });
          const receipt = await tx.wait();
          const gasUsed = receipt.gasUsed.toNumber();
          console.log(gasUsed);
       });
       it("Should transfer remaning tokenB from UP1 to UP2 (UP1 sending all the balance and UP2 has already from the token being sent) : 231,102 gas", async () => {
        let abi = LSP7tokenB.interface.encodeFunctionData("transfer", [
          universalProfile1.address,
          universalProfile2.address,
          "4",
          false,
          "0x",
        ]);
        let abiExecutor = universalProfile1.interface.encodeFunctionData(
          "execute",
          [OPERATIONS.CALL, LSP7tokenB.address, 0, abi]
        );
          const tx = await keyManager1.execute(abiExecutor, { from: owner1.address });
          const receipt = await tx.wait();
          const gasUsed = receipt.gasUsed.toNumber();
          console.log(gasUsed);
       });
       it("Should transfer all tokenB from UP2 to UP3 (Removing all tokens from UP2 and initiaiting the storage of UP3) : 343,513 gas", async () => {
        let abi = LSP7tokenB.interface.encodeFunctionData("transfer", [
          universalProfile2.address,
          universalProfile3.address,
          "10",
          false,
          "0x",
        ]);
        let abiExecutor = universalProfile2.interface.encodeFunctionData(
          "execute",
          [OPERATIONS.CALL, LSP7tokenB.address, 0, abi]
        );
          const tx = await keyManager2.execute(abiExecutor, { from: owner2.address });
          const receipt = await tx.wait();
          const gasUsed = receipt.gasUsed.toNumber();
          console.log(gasUsed);
      });
     })

  });
  
  
})





