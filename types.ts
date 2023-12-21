export interface Arrangement {
  id: string;
  deceased: Deceased;
  familyReps: FamilyRep[];
  deliveryAddress: string;
  DeliveryTime: string;
  church: Church;
  cemetry: Cemetry;
  minister: Minister;

  digger?: boolean;
  crossSize: string;
  doves: boolean;
  liveStreaming: boolean;
  programs: number;
  familyCar: boolean;
  bus: boolean;
  storageDays: number;
  decor: Decor;

  totalPayable: number;
  amountPaid: number;

  tombstoneId: string;

  coffinId: string;
}

export interface Tombstone {
  id: string;
  type: string;
  tombstoneName: string;
}

export interface Coffin {
  id: string;
  coffinName: string;
  price: number;
}

interface Decor {
  candle: boolean;
  photo: boolean;
  glass: boolean;
  banner: boolean;
}

interface Church {
  churchName: string;
  Address: Address;
}

interface Cemetry {
  cemetryName: string;
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

interface Deceased {
  ffhMemberNo: string;
  lastName: string;
  firstNames: string;
  idNumber: string;
  dateOfDeath: Date;
  removalDate: Date;
  removalFrom: Address;
  deathCertificateRecipient: string;
  dateOfFuneralService: Date;
}

interface Address {
  street: string;
  city: string;
  province: string;
  zip: string;
}
