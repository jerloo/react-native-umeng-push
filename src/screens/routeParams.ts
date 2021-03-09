import { PdaReadDataDto } from '../../apiclient/src/models';

export type MainStackParamList = {
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
    callback: (uri: string) => void;
  };
};
