import {
  MobileFileDto,
  PdaCustListDto,
  PdaReadDataDto,
} from '../../apiclient/src/models';

export type MainStackParamList = {
  Home: {};
  Profile: {};
  EditName: {};
  EditPhone: {};
  EditPassword: {};
  Books: {};
  ReadingCollect: {};
  Search: {};
  Arrearages: {};
  NewRead: {
    data: PdaReadDataDto;
  };
  BookTask: {
    bookId: number;
    title: string;
  };
  BookTaskSort: {
    bookId: number;
    title: string;
  };
  CustDetails: {
    data: PdaReadDataDto & PdaCustListDto;
  };
  Camera: {
    callback: (result: MobileFileDto) => void;
  };
  Payment: {
    custId: number;
    custCode: string;
    deposit: number;
  };
  PaymentCollect: {};
  PaymentSubtotal: {};
};
