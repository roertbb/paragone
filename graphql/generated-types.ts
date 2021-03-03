export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Receipt = {
  __typename?: 'Receipt';
  username: Scalars['String'];
  filename: Scalars['String'];
  price?: Maybe<Scalars['Float']>;
};

export type Query = {
  __typename?: 'Query';
  getUploadUrl?: Maybe<Scalars['String']>;
  receipts?: Maybe<Array<Maybe<Receipt>>>;
};

export type Mutation = {
  __typename?: 'Mutation';
  receiptProcessed?: Maybe<Receipt>;
};


export type MutationReceiptProcessedArgs = {
  username: Scalars['String'];
  filename: Scalars['String'];
  price?: Maybe<Scalars['Float']>;
};

export type Subscription = {
  __typename?: 'Subscription';
  onReceiptProcessed?: Maybe<Receipt>;
};


export type SubscriptionOnReceiptProcessedArgs = {
  username: Scalars['String'];
};
