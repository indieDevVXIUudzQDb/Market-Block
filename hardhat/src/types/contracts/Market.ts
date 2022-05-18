/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PayableOverrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type {
  FunctionFragment,
  Result,
  EventFragment,
} from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
} from "../common";

export declare namespace Market {
  export type MarketItemStruct = {
    itemId: BigNumberish;
    nftContract: string;
    tokenId: BigNumberish;
    seller: string;
    owner: string;
    price: BigNumberish;
    status: BigNumberish;
  };

  export type MarketItemStructOutput = [
    BigNumber,
    string,
    BigNumber,
    string,
    string,
    BigNumber,
    number
  ] & {
    itemId: BigNumber;
    nftContract: string;
    tokenId: BigNumber;
    seller: string;
    owner: string;
    price: BigNumber;
    status: number;
  };
}

export interface MarketInterface extends utils.Interface {
  functions: {
    "cancelMarketItem(uint256,uint256,bytes)": FunctionFragment;
    "createMarketItem(address,uint256,uint256,uint256,bytes)": FunctionFragment;
    "createMarketSale(uint256,uint256,bytes)": FunctionFragment;
    "fetchMarketItem(uint256)": FunctionFragment;
    "fetchMarketItemByTokenId(uint256)": FunctionFragment;
    "fetchMarketItems()": FunctionFragment;
    "fetchMarketItemsByStatus(uint8)": FunctionFragment;
    "fetchMarketItemsCreated()": FunctionFragment;
    "fetchMyMarketItems()": FunctionFragment;
    "getListingPrice()": FunctionFragment;
    "updateListingPrice(uint256)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "cancelMarketItem"
      | "createMarketItem"
      | "createMarketSale"
      | "fetchMarketItem"
      | "fetchMarketItemByTokenId"
      | "fetchMarketItems"
      | "fetchMarketItemsByStatus"
      | "fetchMarketItemsCreated"
      | "fetchMyMarketItems"
      | "getListingPrice"
      | "updateListingPrice"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "cancelMarketItem",
    values: [BigNumberish, BigNumberish, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "createMarketItem",
    values: [string, BigNumberish, BigNumberish, BigNumberish, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "createMarketSale",
    values: [BigNumberish, BigNumberish, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "fetchMarketItem",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "fetchMarketItemByTokenId",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "fetchMarketItems",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "fetchMarketItemsByStatus",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "fetchMarketItemsCreated",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "fetchMyMarketItems",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getListingPrice",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "updateListingPrice",
    values: [BigNumberish]
  ): string;

  decodeFunctionResult(
    functionFragment: "cancelMarketItem",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "createMarketItem",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "createMarketSale",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "fetchMarketItem",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "fetchMarketItemByTokenId",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "fetchMarketItems",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "fetchMarketItemsByStatus",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "fetchMarketItemsCreated",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "fetchMyMarketItems",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getListingPrice",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "updateListingPrice",
    data: BytesLike
  ): Result;

  events: {
    "MarketItemCreated(uint256,address,uint256,address,address,uint256,uint8)": EventFragment;
    "MarketItemStatusChange(uint256,uint8)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "MarketItemCreated"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "MarketItemStatusChange"): EventFragment;
}

export interface MarketItemCreatedEventObject {
  itemId: BigNumber;
  nftContract: string;
  tokenId: BigNumber;
  seller: string;
  owner: string;
  price: BigNumber;
  status: number;
}
export type MarketItemCreatedEvent = TypedEvent<
  [BigNumber, string, BigNumber, string, string, BigNumber, number],
  MarketItemCreatedEventObject
>;

export type MarketItemCreatedEventFilter =
  TypedEventFilter<MarketItemCreatedEvent>;

export interface MarketItemStatusChangeEventObject {
  itemId: BigNumber;
  status: number;
}
export type MarketItemStatusChangeEvent = TypedEvent<
  [BigNumber, number],
  MarketItemStatusChangeEventObject
>;

export type MarketItemStatusChangeEventFilter =
  TypedEventFilter<MarketItemStatusChangeEvent>;

export interface Market extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: MarketInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    cancelMarketItem(
      itemId: BigNumberish,
      amount: BigNumberish,
      data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    createMarketItem(
      nftContract: string,
      tokenId: BigNumberish,
      price: BigNumberish,
      amount: BigNumberish,
      data: BytesLike,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    createMarketSale(
      itemId: BigNumberish,
      amount: BigNumberish,
      data: BytesLike,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    fetchMarketItem(
      itemId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[Market.MarketItemStructOutput]>;

    fetchMarketItemByTokenId(
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[Market.MarketItemStructOutput]>;

    fetchMarketItems(
      overrides?: CallOverrides
    ): Promise<[Market.MarketItemStructOutput[]]>;

    fetchMarketItemsByStatus(
      status: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[Market.MarketItemStructOutput[]]>;

    fetchMarketItemsCreated(
      overrides?: CallOverrides
    ): Promise<[Market.MarketItemStructOutput[]]>;

    fetchMyMarketItems(
      overrides?: CallOverrides
    ): Promise<[Market.MarketItemStructOutput[]]>;

    getListingPrice(overrides?: CallOverrides): Promise<[BigNumber]>;

    updateListingPrice(
      _listingPrice: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  cancelMarketItem(
    itemId: BigNumberish,
    amount: BigNumberish,
    data: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  createMarketItem(
    nftContract: string,
    tokenId: BigNumberish,
    price: BigNumberish,
    amount: BigNumberish,
    data: BytesLike,
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  createMarketSale(
    itemId: BigNumberish,
    amount: BigNumberish,
    data: BytesLike,
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  fetchMarketItem(
    itemId: BigNumberish,
    overrides?: CallOverrides
  ): Promise<Market.MarketItemStructOutput>;

  fetchMarketItemByTokenId(
    tokenId: BigNumberish,
    overrides?: CallOverrides
  ): Promise<Market.MarketItemStructOutput>;

  fetchMarketItems(
    overrides?: CallOverrides
  ): Promise<Market.MarketItemStructOutput[]>;

  fetchMarketItemsByStatus(
    status: BigNumberish,
    overrides?: CallOverrides
  ): Promise<Market.MarketItemStructOutput[]>;

  fetchMarketItemsCreated(
    overrides?: CallOverrides
  ): Promise<Market.MarketItemStructOutput[]>;

  fetchMyMarketItems(
    overrides?: CallOverrides
  ): Promise<Market.MarketItemStructOutput[]>;

  getListingPrice(overrides?: CallOverrides): Promise<BigNumber>;

  updateListingPrice(
    _listingPrice: BigNumberish,
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    cancelMarketItem(
      itemId: BigNumberish,
      amount: BigNumberish,
      data: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    createMarketItem(
      nftContract: string,
      tokenId: BigNumberish,
      price: BigNumberish,
      amount: BigNumberish,
      data: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    createMarketSale(
      itemId: BigNumberish,
      amount: BigNumberish,
      data: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    fetchMarketItem(
      itemId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<Market.MarketItemStructOutput>;

    fetchMarketItemByTokenId(
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<Market.MarketItemStructOutput>;

    fetchMarketItems(
      overrides?: CallOverrides
    ): Promise<Market.MarketItemStructOutput[]>;

    fetchMarketItemsByStatus(
      status: BigNumberish,
      overrides?: CallOverrides
    ): Promise<Market.MarketItemStructOutput[]>;

    fetchMarketItemsCreated(
      overrides?: CallOverrides
    ): Promise<Market.MarketItemStructOutput[]>;

    fetchMyMarketItems(
      overrides?: CallOverrides
    ): Promise<Market.MarketItemStructOutput[]>;

    getListingPrice(overrides?: CallOverrides): Promise<BigNumber>;

    updateListingPrice(
      _listingPrice: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "MarketItemCreated(uint256,address,uint256,address,address,uint256,uint8)"(
      itemId?: BigNumberish | null,
      nftContract?: string | null,
      tokenId?: null,
      seller?: null,
      owner?: null,
      price?: null,
      status?: null
    ): MarketItemCreatedEventFilter;
    MarketItemCreated(
      itemId?: BigNumberish | null,
      nftContract?: string | null,
      tokenId?: null,
      seller?: null,
      owner?: null,
      price?: null,
      status?: null
    ): MarketItemCreatedEventFilter;

    "MarketItemStatusChange(uint256,uint8)"(
      itemId?: BigNumberish | null,
      status?: null
    ): MarketItemStatusChangeEventFilter;
    MarketItemStatusChange(
      itemId?: BigNumberish | null,
      status?: null
    ): MarketItemStatusChangeEventFilter;
  };

  estimateGas: {
    cancelMarketItem(
      itemId: BigNumberish,
      amount: BigNumberish,
      data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    createMarketItem(
      nftContract: string,
      tokenId: BigNumberish,
      price: BigNumberish,
      amount: BigNumberish,
      data: BytesLike,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    createMarketSale(
      itemId: BigNumberish,
      amount: BigNumberish,
      data: BytesLike,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    fetchMarketItem(
      itemId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    fetchMarketItemByTokenId(
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    fetchMarketItems(overrides?: CallOverrides): Promise<BigNumber>;

    fetchMarketItemsByStatus(
      status: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    fetchMarketItemsCreated(overrides?: CallOverrides): Promise<BigNumber>;

    fetchMyMarketItems(overrides?: CallOverrides): Promise<BigNumber>;

    getListingPrice(overrides?: CallOverrides): Promise<BigNumber>;

    updateListingPrice(
      _listingPrice: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    cancelMarketItem(
      itemId: BigNumberish,
      amount: BigNumberish,
      data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    createMarketItem(
      nftContract: string,
      tokenId: BigNumberish,
      price: BigNumberish,
      amount: BigNumberish,
      data: BytesLike,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    createMarketSale(
      itemId: BigNumberish,
      amount: BigNumberish,
      data: BytesLike,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    fetchMarketItem(
      itemId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    fetchMarketItemByTokenId(
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    fetchMarketItems(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    fetchMarketItemsByStatus(
      status: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    fetchMarketItemsCreated(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    fetchMyMarketItems(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getListingPrice(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    updateListingPrice(
      _listingPrice: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}