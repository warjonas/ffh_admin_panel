import { Receipt } from '@prisma/client';

export interface Arrangement {
  id: string;
  invoiceNo: string;
  deceased: Deceased;
  dateOfFuneralService: string;
  familyReps: FamilyRep[];
  deliveryAddress: string;
  DeliveryTime: string;
  church: Church;
  grave: Grave;
  graveTime: string;
  minister: Minister;
  createdBy: string;
  digger?: number;
  crossSize: string;
  doves: number;
  liveStreaming: number;
  programs: number;
  familyCar: number;
  bus: number;
  storage: number;
  decor: Decor;
  notes: string;
  afterHour: number;
  doctor: number;
  cremationDoctor: number;
  wreaths: number;
  totalDue: number;
  outstandingBalance: number;
  receipts: Receipt[];
  created: Date;
  tombstoneId: string;
  tombstone: Tombstone;
  updatedBy: string;
  paidUp: boolean;
  coffinId: string;
  coffin: Coffin;
  additionalItems: AdditionalItems[];
}

interface AdditionalItems {
  description: string;
  amount: number;
}

export interface Tombstone {
  id: string;
  type: string;
  tombstoneName: string;
  price: number;
}

export interface Coffin {
  id: string;
  coffinName: string;
  price: number;
}

export interface Grave {
  id: string;
  graveName: string;
  price: number;
}

export interface User {
  full_name: string;
  email: string;
  username: string;
  last_login: string;
  role: string;
}

interface Decor {
  candle: DecorItem;
  photo: DecorItem;
  glass: DecorItem;
  banner: DecorItem;
}

interface DecorItem {
  qty: number;
  price: number;
}

interface Church {
  churchName: string;
  Address: Address;
  time: string;
}

interface Minister {
  firstName: string;
  lastName: string;
  phoneNo: string;
}

interface FamilyRep {
  firstName: string;
  lastName: string;
  relationship: string;
  phoneNo: string;
}

export interface Deceased {
  id: string;
  ffhMemberNo: string;
  lastName: string;
  firstNames: string;
  idNumber: string;
  dateOfBirth: string;
  dateOfDeath: Date;
  removalDate: Date;
  removalFrom: Address;
  deathCertificateRecipient: string;
  dateOfFuneralService: Date;
  updatedBy: string;
  arrangement: Arrangement;
  removal: Removal;
}

export interface Removal {
  id: string;
  invoiceNo: string;
  byUndertaker: string;
  deathRegistration: number;
  doctorsFees: number;
  storageFee: number;
  storage: number;
  copyFee: number;
  adminFees: number;
  totalDue: number;
  receipts: RemovalReceipt[];
  scheduledBy: string;

  created: Date;
  updatedBy: string;
  updated: Date;
  dateRequested: Date;
  graveFee: number;
  gravediggerCost: number;
  copies: number;
  outstandingBalance: number;
  deceased: Deceased;
}

export interface RemovalReceipt {
  id: string;
  receiptNo: string;
  date: Date;
  issuedBy: string;
  methodOfPayment: string;
  receivedAmount: number;
  outstandingBalance: number;
  receivedFrom: string;

  invoiceId: Removal | Arrangement;
  removal?: Removal;
  arrangement?: Arrangement;
}

interface Address {
  street: string;
  city: string;
}
