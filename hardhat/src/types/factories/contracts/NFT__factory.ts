/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { NFT, NFTInterface } from "../../contracts/NFT";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "marketplaceAddress",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "ApprovalForAll",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "ids",
        type: "uint256[]",
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "values",
        type: "uint256[]",
      },
    ],
    name: "TransferBatch",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "TransferSingle",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "string",
        name: "value",
        type: "string",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
    ],
    name: "URI",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "accounts",
        type: "address[]",
      },
      {
        internalType: "uint256[]",
        name: "ids",
        type: "uint256[]",
      },
    ],
    name: "balanceOfBatch",
    outputs: [
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "tokenURI",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "createToken",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
    ],
    name: "isApprovedForAll",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256[]",
        name: "ids",
        type: "uint256[]",
      },
      {
        internalType: "uint256[]",
        name: "amounts",
        type: "uint256[]",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "safeBatchTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "setApprovalForAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "uri",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const _bytecode =
  "0x608060405260405180602001604052806000815250600390805190602001906200002b9291906200010b565b503480156200003957600080fd5b506040516200304d3803806200304d83398181016040528101906200005f9190620001d2565b6040518060400160405280601381526020017f4d61726b657420426c6f636b20546f6b656e7300000000000000000000000000815250620000a681620000ef60201b60201c565b5080600660006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050620002b1565b8060029080519060200190620001079291906200010b565b5050565b828054620001199062000232565b90600052602060002090601f0160209004810192826200013d576000855562000189565b82601f106200015857805160ff191683800117855562000189565b8280016001018555821562000189579182015b82811115620001885782518255916020019190600101906200016b565b5b5090506200019891906200019c565b5090565b5b80821115620001b75760008160009055506001016200019d565b5090565b600081519050620001cc8162000297565b92915050565b600060208284031215620001e557600080fd5b6000620001f584828501620001bb565b91505092915050565b60006200020b8262000212565b9050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b600060028204905060018216806200024b57607f821691505b6020821081141562000262576200026162000268565b5b50919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b620002a281620001fe565b8114620002ae57600080fd5b50565b612d8c80620002c16000396000f3fe608060405234801561001057600080fd5b50600436106100925760003560e01c80632eb2c2d6116100665780632eb2c2d6146101575780634e1273f414610173578063a22cb465146101a3578063e985e9c5146101bf578063f242432a146101ef57610092565b8062fdd58e1461009757806301ffc9a7146100c75780630e89341c146100f75780632168a8eb14610127575b600080fd5b6100b160048036038101906100ac9190611cf3565b61020b565b6040516100be91906124c6565b60405180910390f35b6100e160048036038101906100dc9190611d9b565b6102d4565b6040516100ee9190612329565b60405180910390f35b610111600480360381019061010c9190611e6c565b6103b6565b60405161011e9190612344565b60405180910390f35b610141600480360381019061013c9190611ded565b61049b565b60405161014e91906124c6565b60405180910390f35b610171600480360381019061016c9190611b69565b610503565b005b61018d60048036038101906101889190611d2f565b6105a4565b60405161019a91906122d0565b60405180910390f35b6101bd60048036038101906101b89190611cb7565b610755565b005b6101d960048036038101906101d49190611b2d565b61076b565b6040516101e69190612329565b60405180910390f35b61020960048036038101906102049190611c28565b6107ff565b005b60008073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff16141561027c576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610273906123a6565b60405180910390fd5b60008083815260200190815260200160002060008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905092915050565b60007fd9b67a26000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916148061039f57507f0e89341c000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916145b806103af57506103ae826108a0565b5b9050919050565b606060006004600084815260200190815260200160002080546103d890612786565b80601f016020809104026020016040519081016040528092919081815260200182805461040490612786565b80156104515780601f1061042657610100808354040283529160200191610451565b820191906000526020600020905b81548152906001019060200180831161043457829003601f168201915b50505050509050600081511161046f5761046a8361090a565b610493565b6003816040516020016104839291906121ea565b6040516020818303038152906040525b915050919050565b60006104a7600561099e565b60006104b360056109b4565b90506104c1338286866109c2565b6104cb8186610b73565b6104f8600660009054906101000a900473ffffffffffffffffffffffffffffffffffffffff166001610755565b809150509392505050565b61050b610bdf565b73ffffffffffffffffffffffffffffffffffffffff168573ffffffffffffffffffffffffffffffffffffffff16148061055157506105508561054b610bdf565b61076b565b5b610590576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161058790612406565b60405180910390fd5b61059d8585858585610be7565b5050505050565b606081518351146105ea576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016105e190612466565b60405180910390fd5b6000835167ffffffffffffffff81111561062d577f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b60405190808252806020026020018201604052801561065b5781602001602082028036833780820191505090505b50905060005b845181101561074a576106f48582815181106106a6577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b60200260200101518583815181106106e7577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b602002602001015161020b565b82828151811061072d577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b60200260200101818152505080610743906127e9565b9050610661565b508091505092915050565b610767610760610bdf565b8383610f55565b5050565b6000600160008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff16905092915050565b610807610bdf565b73ffffffffffffffffffffffffffffffffffffffff168573ffffffffffffffffffffffffffffffffffffffff16148061084d575061084c85610847610bdf565b61076b565b5b61088c576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610883906123c6565b60405180910390fd5b61089985858585856110c2565b5050505050565b60007f01ffc9a7000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916149050919050565b60606002805461091990612786565b80601f016020809104026020016040519081016040528092919081815260200182805461094590612786565b80156109925780601f1061096757610100808354040283529160200191610992565b820191906000526020600020905b81548152906001019060200180831161097557829003601f168201915b50505050509050919050565b6001816000016000828254019250508190555050565b600081600001549050919050565b600073ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff161415610a32576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610a29906124a6565b60405180910390fd5b6000610a3c610bdf565b90506000610a498561135e565b90506000610a568561135e565b9050610a6783600089858589611424565b8460008088815260200190815260200160002060008973ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254610ac6919061267a565b925050819055508673ffffffffffffffffffffffffffffffffffffffff16600073ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167fc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f628989604051610b449291906124e1565b60405180910390a4610b5b8360008985858961142c565b610b6a83600089898989611434565b50505050505050565b80600460008481526020019081526020016000209080519060200190610b9a929190611825565b50817f6bb7ff708619ba0610cba295a58592e0451dee2622938c8755667688daf3529b610bc6846103b6565b604051610bd39190612344565b60405180910390a25050565b600033905090565b8151835114610c2b576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610c2290612486565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff161415610c9b576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610c92906123e6565b60405180910390fd5b6000610ca5610bdf565b9050610cb5818787878787611424565b60005b8451811015610eb2576000858281518110610cfc577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b602002602001015190506000858381518110610d41577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b60200260200101519050600080600084815260200190815260200160002060008b73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905081811015610de2576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610dd990612426565b60405180910390fd5b81810360008085815260200190815260200160002060008c73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508160008085815260200190815260200160002060008b73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254610e97919061267a565b9250508190555050505080610eab906127e9565b9050610cb8565b508473ffffffffffffffffffffffffffffffffffffffff168673ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff167f4a39dc06d4c0dbc64b70af90fd698a233a518aa5d07e595d983b8c0526c8f7fb8787604051610f299291906122f2565b60405180910390a4610f3f81878787878761142c565b610f4d81878787878761161b565b505050505050565b8173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff161415610fc4576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610fbb90612446565b60405180910390fd5b80600160008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff0219169083151502179055508173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31836040516110b59190612329565b60405180910390a3505050565b600073ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff161415611132576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611129906123e6565b60405180910390fd5b600061113c610bdf565b905060006111498561135e565b905060006111568561135e565b9050611166838989858589611424565b600080600088815260200190815260200160002060008a73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050858110156111fd576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016111f490612426565b60405180910390fd5b85810360008089815260200190815260200160002060008b73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508560008089815260200190815260200160002060008a73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282546112b2919061267a565b925050819055508773ffffffffffffffffffffffffffffffffffffffff168973ffffffffffffffffffffffffffffffffffffffff168573ffffffffffffffffffffffffffffffffffffffff167fc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f628a8a60405161132f9291906124e1565b60405180910390a4611345848a8a86868a61142c565b611353848a8a8a8a8a611434565b505050505050505050565b60606000600167ffffffffffffffff8111156113a3577f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6040519080825280602002602001820160405280156113d15781602001602082028036833780820191505090505b509050828160008151811061140f577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b60200260200101818152505080915050919050565b505050505050565b505050505050565b6114538473ffffffffffffffffffffffffffffffffffffffff16611802565b15611613578373ffffffffffffffffffffffffffffffffffffffff1663f23a6e6187878686866040518663ffffffff1660e01b8152600401611499959493929190612276565b602060405180830381600087803b1580156114b357600080fd5b505af19250505080156114e457506040513d601f19601f820116820180604052508101906114e19190611dc4565b60015b61158a576114f06128bf565b806308c379a0141561154d5750611505612c64565b80611510575061154f565b806040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016115449190612344565b60405180910390fd5b505b6040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161158190612366565b60405180910390fd5b63f23a6e6160e01b7bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916817bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191614611611576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161160890612386565b60405180910390fd5b505b505050505050565b61163a8473ffffffffffffffffffffffffffffffffffffffff16611802565b156117fa578373ffffffffffffffffffffffffffffffffffffffff1663bc197c8187878686866040518663ffffffff1660e01b815260040161168095949392919061220e565b602060405180830381600087803b15801561169a57600080fd5b505af19250505080156116cb57506040513d601f19601f820116820180604052508101906116c89190611dc4565b60015b611771576116d76128bf565b806308c379a0141561173457506116ec612c64565b806116f75750611736565b806040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161172b9190612344565b60405180910390fd5b505b6040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161176890612366565b60405180910390fd5b63bc197c8160e01b7bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916817bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916146117f8576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016117ef90612386565b60405180910390fd5b505b505050505050565b6000808273ffffffffffffffffffffffffffffffffffffffff163b119050919050565b82805461183190612786565b90600052602060002090601f016020900481019282611853576000855561189a565b82601f1061186c57805160ff191683800117855561189a565b8280016001018555821561189a579182015b8281111561189957825182559160200191906001019061187e565b5b5090506118a791906118ab565b5090565b5b808211156118c45760008160009055506001016118ac565b5090565b60006118db6118d68461252f565b61250a565b905080838252602082019050828560208602820111156118fa57600080fd5b60005b8581101561192a57816119108882611a1c565b8452602084019350602083019250506001810190506118fd565b5050509392505050565b60006119476119428461255b565b61250a565b9050808382526020820190508285602086028201111561196657600080fd5b60005b85811015611996578161197c8882611b18565b845260208401935060208301925050600181019050611969565b5050509392505050565b60006119b36119ae84612587565b61250a565b9050828152602081018484840111156119cb57600080fd5b6119d6848285612744565b509392505050565b60006119f16119ec846125b8565b61250a565b905082815260208101848484011115611a0957600080fd5b611a14848285612744565b509392505050565b600081359050611a2b81612cfa565b92915050565b600082601f830112611a4257600080fd5b8135611a528482602086016118c8565b91505092915050565b600082601f830112611a6c57600080fd5b8135611a7c848260208601611934565b91505092915050565b600081359050611a9481612d11565b92915050565b600081359050611aa981612d28565b92915050565b600081519050611abe81612d28565b92915050565b600082601f830112611ad557600080fd5b8135611ae58482602086016119a0565b91505092915050565b600082601f830112611aff57600080fd5b8135611b0f8482602086016119de565b91505092915050565b600081359050611b2781612d3f565b92915050565b60008060408385031215611b4057600080fd5b6000611b4e85828601611a1c565b9250506020611b5f85828601611a1c565b9150509250929050565b600080600080600060a08688031215611b8157600080fd5b6000611b8f88828901611a1c565b9550506020611ba088828901611a1c565b945050604086013567ffffffffffffffff811115611bbd57600080fd5b611bc988828901611a5b565b935050606086013567ffffffffffffffff811115611be657600080fd5b611bf288828901611a5b565b925050608086013567ffffffffffffffff811115611c0f57600080fd5b611c1b88828901611ac4565b9150509295509295909350565b600080600080600060a08688031215611c4057600080fd5b6000611c4e88828901611a1c565b9550506020611c5f88828901611a1c565b9450506040611c7088828901611b18565b9350506060611c8188828901611b18565b925050608086013567ffffffffffffffff811115611c9e57600080fd5b611caa88828901611ac4565b9150509295509295909350565b60008060408385031215611cca57600080fd5b6000611cd885828601611a1c565b9250506020611ce985828601611a85565b9150509250929050565b60008060408385031215611d0657600080fd5b6000611d1485828601611a1c565b9250506020611d2585828601611b18565b9150509250929050565b60008060408385031215611d4257600080fd5b600083013567ffffffffffffffff811115611d5c57600080fd5b611d6885828601611a31565b925050602083013567ffffffffffffffff811115611d8557600080fd5b611d9185828601611a5b565b9150509250929050565b600060208284031215611dad57600080fd5b6000611dbb84828501611a9a565b91505092915050565b600060208284031215611dd657600080fd5b6000611de484828501611aaf565b91505092915050565b600080600060608486031215611e0257600080fd5b600084013567ffffffffffffffff811115611e1c57600080fd5b611e2886828701611aee565b9350506020611e3986828701611b18565b925050604084013567ffffffffffffffff811115611e5657600080fd5b611e6286828701611ac4565b9150509250925092565b600060208284031215611e7e57600080fd5b6000611e8c84828501611b18565b91505092915050565b6000611ea183836121cc565b60208301905092915050565b611eb6816126d0565b82525050565b6000611ec78261260e565b611ed1818561263c565b9350611edc836125e9565b8060005b83811015611f0d578151611ef48882611e95565b9750611eff8361262f565b925050600181019050611ee0565b5085935050505092915050565b611f23816126e2565b82525050565b6000611f3482612619565b611f3e818561264d565b9350611f4e818560208601612753565b611f57816128e1565b840191505092915050565b6000611f6d82612624565b611f77818561265e565b9350611f87818560208601612753565b611f90816128e1565b840191505092915050565b6000611fa682612624565b611fb0818561266f565b9350611fc0818560208601612753565b80840191505092915050565b60008154611fd981612786565b611fe3818661266f565b94506001821660008114611ffe576001811461200f57612042565b60ff19831686528186019350612042565b612018856125f9565b60005b8381101561203a5781548189015260018201915060208101905061201b565b838801955050505b50505092915050565b600061205860348361265e565b9150612063826128ff565b604082019050919050565b600061207b60288361265e565b91506120868261294e565b604082019050919050565b600061209e602b8361265e565b91506120a98261299d565b604082019050919050565b60006120c160298361265e565b91506120cc826129ec565b604082019050919050565b60006120e460258361265e565b91506120ef82612a3b565b604082019050919050565b600061210760328361265e565b915061211282612a8a565b604082019050919050565b600061212a602a8361265e565b915061213582612ad9565b604082019050919050565b600061214d60298361265e565b915061215882612b28565b604082019050919050565b600061217060298361265e565b915061217b82612b77565b604082019050919050565b600061219360288361265e565b915061219e82612bc6565b604082019050919050565b60006121b660218361265e565b91506121c182612c15565b604082019050919050565b6121d58161273a565b82525050565b6121e48161273a565b82525050565b60006121f68285611fcc565b91506122028284611f9b565b91508190509392505050565b600060a0820190506122236000830188611ead565b6122306020830187611ead565b81810360408301526122428186611ebc565b905081810360608301526122568185611ebc565b9050818103608083015261226a8184611f29565b90509695505050505050565b600060a08201905061228b6000830188611ead565b6122986020830187611ead565b6122a560408301866121db565b6122b260608301856121db565b81810360808301526122c48184611f29565b90509695505050505050565b600060208201905081810360008301526122ea8184611ebc565b905092915050565b6000604082019050818103600083015261230c8185611ebc565b905081810360208301526123208184611ebc565b90509392505050565b600060208201905061233e6000830184611f1a565b92915050565b6000602082019050818103600083015261235e8184611f62565b905092915050565b6000602082019050818103600083015261237f8161204b565b9050919050565b6000602082019050818103600083015261239f8161206e565b9050919050565b600060208201905081810360008301526123bf81612091565b9050919050565b600060208201905081810360008301526123df816120b4565b9050919050565b600060208201905081810360008301526123ff816120d7565b9050919050565b6000602082019050818103600083015261241f816120fa565b9050919050565b6000602082019050818103600083015261243f8161211d565b9050919050565b6000602082019050818103600083015261245f81612140565b9050919050565b6000602082019050818103600083015261247f81612163565b9050919050565b6000602082019050818103600083015261249f81612186565b9050919050565b600060208201905081810360008301526124bf816121a9565b9050919050565b60006020820190506124db60008301846121db565b92915050565b60006040820190506124f660008301856121db565b61250360208301846121db565b9392505050565b6000612514612525565b905061252082826127b8565b919050565b6000604051905090565b600067ffffffffffffffff82111561254a57612549612890565b5b602082029050602081019050919050565b600067ffffffffffffffff82111561257657612575612890565b5b602082029050602081019050919050565b600067ffffffffffffffff8211156125a2576125a1612890565b5b6125ab826128e1565b9050602081019050919050565b600067ffffffffffffffff8211156125d3576125d2612890565b5b6125dc826128e1565b9050602081019050919050565b6000819050602082019050919050565b60008190508160005260206000209050919050565b600081519050919050565b600081519050919050565b600081519050919050565b6000602082019050919050565b600082825260208201905092915050565b600082825260208201905092915050565b600082825260208201905092915050565b600081905092915050565b60006126858261273a565b91506126908361273a565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff038211156126c5576126c4612832565b5b828201905092915050565b60006126db8261271a565b9050919050565b60008115159050919050565b60007fffffffff0000000000000000000000000000000000000000000000000000000082169050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b82818337600083830152505050565b60005b83811015612771578082015181840152602081019050612756565b83811115612780576000848401525b50505050565b6000600282049050600182168061279e57607f821691505b602082108114156127b2576127b1612861565b5b50919050565b6127c1826128e1565b810181811067ffffffffffffffff821117156127e0576127df612890565b5b80604052505050565b60006127f48261273a565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff82141561282757612826612832565b5b600182019050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b600060033d11156128de5760046000803e6128db6000516128f2565b90505b90565b6000601f19601f8301169050919050565b60008160e01c9050919050565b7f455243313135353a207472616e7366657220746f206e6f6e204552433131353560008201527f526563656976657220696d706c656d656e746572000000000000000000000000602082015250565b7f455243313135353a204552433131353552656365697665722072656a6563746560008201527f6420746f6b656e73000000000000000000000000000000000000000000000000602082015250565b7f455243313135353a2062616c616e636520717565727920666f7220746865207a60008201527f65726f2061646472657373000000000000000000000000000000000000000000602082015250565b7f455243313135353a2063616c6c6572206973206e6f74206f776e6572206e6f7260008201527f20617070726f7665640000000000000000000000000000000000000000000000602082015250565b7f455243313135353a207472616e7366657220746f20746865207a65726f20616460008201527f6472657373000000000000000000000000000000000000000000000000000000602082015250565b7f455243313135353a207472616e736665722063616c6c6572206973206e6f742060008201527f6f776e6572206e6f7220617070726f7665640000000000000000000000000000602082015250565b7f455243313135353a20696e73756666696369656e742062616c616e636520666f60008201527f72207472616e7366657200000000000000000000000000000000000000000000602082015250565b7f455243313135353a2073657474696e6720617070726f76616c2073746174757360008201527f20666f722073656c660000000000000000000000000000000000000000000000602082015250565b7f455243313135353a206163636f756e747320616e6420696473206c656e67746860008201527f206d69736d617463680000000000000000000000000000000000000000000000602082015250565b7f455243313135353a2069647320616e6420616d6f756e7473206c656e6774682060008201527f6d69736d61746368000000000000000000000000000000000000000000000000602082015250565b7f455243313135353a206d696e7420746f20746865207a65726f2061646472657360008201527f7300000000000000000000000000000000000000000000000000000000000000602082015250565b600060443d1015612c7457612cf7565b612c7c612525565b60043d036004823e80513d602482011167ffffffffffffffff82111715612ca4575050612cf7565b808201805167ffffffffffffffff811115612cc25750505050612cf7565b80602083010160043d038501811115612cdf575050505050612cf7565b612cee826020018501866127b8565b82955050505050505b90565b612d03816126d0565b8114612d0e57600080fd5b50565b612d1a816126e2565b8114612d2557600080fd5b50565b612d31816126ee565b8114612d3c57600080fd5b50565b612d488161273a565b8114612d5357600080fd5b5056fea264697066735822122030e795330b1ab987190efa55735c377e394cdcf2723d47d284257a24be0900a264736f6c63430008040033";

type NFTConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: NFTConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class NFT__factory extends ContractFactory {
  constructor(...args: NFTConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    marketplaceAddress: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<NFT> {
    return super.deploy(marketplaceAddress, overrides || {}) as Promise<NFT>;
  }
  override getDeployTransaction(
    marketplaceAddress: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(marketplaceAddress, overrides || {});
  }
  override attach(address: string): NFT {
    return super.attach(address) as NFT;
  }
  override connect(signer: Signer): NFT__factory {
    return super.connect(signer) as NFT__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): NFTInterface {
    return new utils.Interface(_abi) as NFTInterface;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): NFT {
    return new Contract(address, _abi, signerOrProvider) as NFT;
  }
}
