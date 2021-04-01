import {
  MobileFileDto,
  PdaCustListDto,
  PdaPaymentSubtotal,
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
    mode: 'read' | 'unread' | 'all';
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
    data: PdaReadDataDto & PdaPaymentSubtotal;
    mode: 'pay' | 'details';
  };
  PaymentCollect: {};
  PaymentSubtotal: {};
  LogView: {};
};
