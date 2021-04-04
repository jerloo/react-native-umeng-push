import { makeAutoObservable, runInAction } from 'mobx';
import center from '.';
import { ReadingMonthDto } from '../../apiclient/src/models';
import { getBillMonth } from '../utils/billMonthUtils';
import { getSession, UserSession } from '../utils/sesstionUtils';
import { PdaMeterBookDtoHolder } from './holders';

export default class MeterState {
  books: PdaMeterBookDtoHolder[] = [];
  localBillMonth?: ReadingMonthDto | null;
  remoteBillMonth?: ReadingMonthDto | null;
  userSession?: UserSession | null;
  loading: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  async getLocalSession() {
    const session = await getSession();
    runInAction(() => {
      this.userSession = session || undefined;
    });
  }

  async fetchUserInfo() {
    this.loading = true;
    const userInfo = await center.getUserInfo();
    runInAction(() => {
      this.userSession = {
        tenantName: this.userSession?.tenantName || '',
        password: this.userSession?.password || '',
        autoLogin: this.userSession?.autoLogin || false,
        userInfo: userInfo,
      };
      this.loading = false;
    });
  }

  async getLocalBillMonth() {
    const localBillMonth = await getBillMonth(this.userSession?.userInfo.id);
    runInAction(() => {
      this.localBillMonth = localBillMonth;
    });
  }

  async fetchBillMonth() {
    const remoteBillMonth = await center.getReadingMonth();
    runInAction(() => {
      this.remoteBillMonth = remoteBillMonth;
    });
  }

  async getLocalBooks() {
    const localBooks = await center.getBookList();
    runInAction(() => {
      this.books = localBooks;
    });
  }
}
