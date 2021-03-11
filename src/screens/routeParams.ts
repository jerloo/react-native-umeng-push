import { MobileFileDto, PdaReadDataDto } from '../../apiclient/src/models';

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
    custId: number;
    title: string;
  };
  Camera: {
    callback: (result: MobileFileDto) => void;
  };
  Payment: {
    custId: number;
    custCode: string;
  };
  PaymentCollect: {};
  PaymentSubtotal: {};
};
