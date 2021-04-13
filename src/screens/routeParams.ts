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
    cashPaid?: () => void;
  };
  Camera: {
    callback: (result: MobileFileDto) => void;
  };
  Payment: {
    data: PdaReadDataDto & PdaPaymentSubtotal;
    mode: 'pay' | 'details';
    cashPaid?: () => void;
  };
  PaymentCollect: {};
  PaymentSubtotal: {};
  LogView: {};
};
