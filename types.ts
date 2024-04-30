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
  receipts: Receipt[];
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

export interface Receipt {
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
  crossSize: string;
  arrangementAddOnItems: ArrangementAddOnItem[];
  programs: number;
  storage: number;
  totalDue: number;
  decor: Decor;
  notes: string;
  discount: number;
  outstandingBalance: number;
  receipts: Receipt[];
  created: Date;
  tombstoneId: string;
  tombstone: Tombstone;
  updatedBy: string;
  paidUp: boolean;
  coffinId: string;
  coffin: Coffin;
  graveNo?: string;
  additionalItems: AdditionalItems[];
}

export interface AddOn {
  id: string;
  name: string;
  price: number;
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

export interface ArrangementAddOnItem {
  name: string;
  qty: number;
  price: number;
}

interface AdditionalItems {
  description: string;
  amount: number;
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
  email: string;
}

interface Address {
  street: string;
  city: string;
}
