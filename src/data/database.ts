import dayjs from 'dayjs';
import SQLite from 'react-native-sqlite-storage';
import {
  MobileFileDto,
  PdaReadDataDto,
  ReadingDataDto,
} from '../../apiclient/src/models';
import { l } from '../utils/logUtils';
import {
  PdaBillingInfoHolder,
  PdaCustInfoHolder,
  PdaMeterBookDtoHolder,
  PdaPayRecordHolder,
  PdaReadingRecordHolder,
} from './holders';
import { AttachmentDbItem, BookAttachmentsTotal } from './models';

SQLite.DEBUG(process.env.NODE_ENV !== 'production');
SQLite.enablePromise(true);

const database_name = 'mobile-read-app.db';

class DataBase {
  db: SQLite.SQLiteDatabase | undefined;

  ensure = () => {
    SQLite.openDatabase({
      name: database_name,
      location: 'default',
    })
      .then((DB) => {
        this.db = DB;
        l.info('Database OPEN');
        this.populateDatabase(DB);
      })
      .catch((error) => {
        l.error(error);
      });
  };

  populateDatabase = (db: SQLite.SQLiteDatabase) => {
    l.info('Database integrity check');
    db.executeSql('SELECT 1 FROM Versions LIMIT 1')
      .then(() => {
        return true;
      })
      .catch((error) => {
        l.error('Received error: ', error);
        l.error('Database not yet ready ... populating data');
        db.transaction(this.populateDB).then(() => {
          l.info('Database populated ...');
          return true;
        });
      });
  };

  closeDatabase = () => {
    if (this.db) {
      l.info('Closing database ...');
      l.info('Closing DB');
      this.db
        .close()
        .then(() => {
          l.info('Database CLOSED');
        })
        .catch((error) => {
          this.errorCB(error);
        });
    } else {
      l.info('Database was not OPENED');
    }
  };

  errorCB = (err: any) => {
    l.error('error: ', err);
    l.error('Error ' + (err.message || err));
  };

  populateDB = (tx: SQLite.Transaction) => {
    l.info('Executing CREATE stmts');

    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS Versions ( 
      version_id INTEGER PRIMARY KEY NOT NULL); `,
    ).catch((error) => {
      this.errorCB(error);
    });

    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS Books( 
        billMonth INTEGER, 
        bookId INTEGER,
        bookCode NVARCHAR(30),
        bookName NVARCHAR(30),
        readCycle INTEGER,
        readingNumber INTEGER,
        remark NVARCHAR(30),
        totalNumber INTEGER,
        downloaded boolean,
        uploadedNumber INTEGER,
        userId NVARCHAR(30)
      ); `,
    ).catch((error) => {
      this.errorCB(error);
    });

    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS BookDatas ( 
        billMonth INTEGER, 
        custId INTEGER,
        readTimes INTEGER,
        terminalFiles NVARCHAR(2048),
        oweNumber INTEGER,
        bookId INTEGER,
        bookCode NVARCHAR(30),
        bookSortIndex INTEGER,
        custCode NVARCHAR(30),
        custName NVARCHAR(100),
        custAddress NVARCHAR(100),
        custState NVARCHAR(30),
        deposit INTEGER,
        lastChange INTEGER,
        priceCode INTEGER,
        meterState NVARCHAR(30),
        barCode NVARCHAR(30),
        steelMark NVARCHAR(30),
        installLocation NVARCHAR(30),
        caliberValue INTEGER,
        rangeValue INTEGER,
        lastReading INTEGER,
        lastChildReading INTEGER,
        lastReadWater INTEGER,
        lastReadDate DATETIME,
        lastReadStateId INTEGER,
        reading INTEGER,
        childReading INTEGER,
        readWater INTEGER,
        readDate DATETIME,
        readStateId INTEGER,
        highLowState INTEGER,
        isEstimate boolean,
        readRemark NVARCHAR(30),
        recordState INTEGER,
        replaceWater INTEGER,
        avgWater INTEGER,
        highCoefficient INTEGER,
        lowCoefficient INTEGER,
        highWater INTEGER,
        lowWater INTEGER,
        dataState INTEGER,
        uploaded boolean
      ); `,
    ).catch((error) => {
      this.errorCB(error);
    });

    tx.executeSql(`CREATE TABLE IF NOT EXISTS CustInfos (
      custId INTEGER,
      custName NVARCHAR(30),
      custAddress NVARCHAR(30),
      orgName NVARCHAR(30),
      mobile NVARCHAR(30),
      population INTEGER,
      payMethod NVARCHAR(30),
      custType NVARCHAR(30),
      priceCode NVARCHAR(30),
      deposit INTEGER,
      yearTotalWater INTEGER,
      reading INTEGER,
      installLocation NVARCHAR(30),
      steelMark NVARCHAR(30),
      caliber NVARCHAR(30),
      producer NVARCHAR(30),
      replaceDate NVARCHAR(30),
      buildDate NVARCHAR(30)
    )`);

    tx.executeSql(`CREATE TABLE IF NOT EXISTS ReadingRecords (
      custId INTEGER,
      billMonth INTEGER,
      readingDate NVARCHAR(30),
      lastReading INTEGER,
      reading INTEGER,
      readWater INTEGER
    )`);

    tx.executeSql(`CREATE TABLE IF NOT EXISTS BillingInfos (
      custId INTEGER,
      billMonth INTEGER,
      billWater INTEGER,
      extendedAmount INTEGER,
      lateFee INTEGER,
      payState INTEGER
    )`);

    tx.executeSql(`CREATE TABLE IF NOT EXISTS PayRecords (
      custId INTEGER,
      payDate NVARCHAR(30),
      cashier NVARCHAR(30),
      actualMoney INTEGER,
      deposit INTEGER
    )`);

    tx.executeSql(`CREATE TABLE IF NOT EXISTS Attachments (
      bookId INTEGER,
      custId INTEGER,
      readTimes INTEGER,
      billMonth INTEGER,
      uploaded boolean,
      url NVARCHAR(30),
      fileName NVARCHAR(30),
      filePath NVARCHAR(30),
      fileSize INTEGER,
      fileSource INTEGER,
      isRemove boolean
    )`);

    l.info('Executing INSERT stmts');

    tx.executeSql('INSERT INTO Versions (version_id) VALUES (1);').catch(
      (error) => {
        this.errorCB(error);
      },
    );

    l.info('all config SQL done');
  };

  saveBooks = (holders: PdaMeterBookDtoHolder[], userId: string) => {
    this.db
      ?.transaction((tx) => {
        holders.forEach((item) => {
          tx.executeSql(
            `INSERT INTO Books ('billMonth','bookId','bookCode','bookName','readCycle','readingNumber','remark','totalNumber','downloaded','userId') 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              item.billMonth,
              item.bookId,
              item.bookCode,
              item.bookName,
              item.readCycle,
              item.readingNumber,
              item.remark,
              item.totalNumber,
              false,
              userId,
            ],
          )
            .then(() => {
              l.info(`保存抄表任务${item.bookId}`);
            })
            .catch((err) => {
              this.errorCB(err);
            });
        });
        l.info(`保存抄表任务[${holders.length}]条`);
      })
      .catch((err) => {
        this.errorCB(err);
      });
  };

  updateBooks = (holders: PdaMeterBookDtoHolder[], userId: string) => {
    this.db
      ?.transaction((tx) => {
        holders.forEach((item) => {
          tx.executeSql(
            `UPDATE Books SET billMonth = ?, 
              bookCode = ?, 
              bookName = ?,
              readCycle = ?, 
              readingNumber = ?, 
              remark = ?, 
              totalNumber = ? 
              WHERE userId = ? AND bookId = ?`,
            [
              item.billMonth,
              item.bookCode,
              item.bookName,
              item.readCycle,
              item.readingNumber,
              item.remark,
              item.totalNumber,
              userId,
              item.bookId,
            ],
          )
            .then(() => {
              l.info(`保存抄表任务${item.bookId}`);
            })
            .catch((err) => {
              this.errorCB(err);
            });
        });
        l.info(`保存抄表任务[${holders.length}]条`);
      })
      .catch((err) => {
        this.errorCB(err);
      });
  };

  saveCustInfos = (holders: PdaCustInfoHolder[]) => {
    this.db
      ?.transaction((tx) => {
        holders.forEach((item) => {
          tx.executeSql(
            `INSERT INTO CustInfos ('custId','custName','custAddress','orgName','mobile','population','payMethod','custType','priceCode','deposit','yearTotalWater','reading','installLocation','steelMark','caliber','producer','replaceDate','buildDate') 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              item.custId,
              item.custName,
              item.custAddress,
              item.orgName,
              item.mobile,
              item.population,
              item.payMethod,
              item.custType,
              item.priceCode,
              item.deposit,
              item.yearTotalWater,
              item.reading,
              item.installLocation,
              item.steelMark,
              item.caliber,
              item.producer,
              item.replaceDate,
              item.buildDate,
            ],
          )
            .then(() => {
              l.info(`保存基本信息[${holders.length}]条`);
            })
            .catch((err) => {
              this.errorCB(err);
            });
        });
      })
      .catch((err) => {
        this.errorCB(err);
      });
  };

  getCustInfoById = async (custId: number) => {
    const result = await this.db?.executeSql(
      'SELECT * FROM CustInfos WHERE custId = ?',
      [custId],
    );
    return result?.[0].rows.raw() || [];
  };

  saveReadingRecords = (holders: PdaReadingRecordHolder[]) => {
    this.db
      ?.transaction((tx) => {
        holders.forEach((item) => {
          tx.executeSql(
            `INSERT INTO ReadingRecords ('custId','billMonth','readingDate','lastReading','reading','readWater') 
            VALUES (?, ?, ?, ?, ?, ?)`,
            [
              item.custId,
              item.billMonth,
              item.readingDate,
              item.lastReading,
              item.reading,
              item.readWater,
            ],
          )
            .then(() => {
              l.info(`保存抄表信息[${holders.length}]条`);
            })
            .catch((err) => {
              this.errorCB(err);
            });
        });
      })
      .catch((err) => {
        this.errorCB(err);
      });
  };

  getReadingRecordsByCustId = async (custId: number) => {
    const result = await this.db?.executeSql(
      'SELECT * FROM ReadingRecords WHERE custId = ?',
      [custId],
    );
    return result?.[0].rows.raw() || [];
  };

  saveBillingInfos = (holders: PdaBillingInfoHolder[]) => {
    this.db
      ?.transaction((tx) => {
        holders.forEach((item) => {
          tx.executeSql(
            `INSERT INTO BillingInfos ('custId','billMonth','billWater','extendedAmount','lateFee','payState') 
            VALUES (?, ?, ?, ?, ?, ?)`,
            [
              item.custId,
              item.billMonth,
              item.billWater,
              item.extendedAmount,
              item.lateFee,
              item.payState,
            ],
          )
            .then(() => {
              l.info(`保存账单信息[${holders.length}]条`);
            })
            .catch((err) => {
              this.errorCB(err);
            });
        });
      })
      .catch((err) => {
        this.errorCB(err);
      });
  };

  getBillingInfosByCustId = async (custId: number) => {
    const result = await this.db?.executeSql(
      'SELECT * FROM BillingINfos WHERE custId = ?',
      [custId],
    );
    return result?.[0].rows.raw() || [];
  };

  savePayRecords = (holders: PdaPayRecordHolder[]) => {
    this.db
      ?.transaction((tx) => {
        holders.forEach((item) => {
          tx.executeSql(
            `INSERT INTO PayRecords ('custId','payDate','cashier','actualMoney','deposit') 
            VALUES (?, ?, ?, ?, ?)`,
            [
              item.custId,
              item.payDate,
              item.cashier,
              item.actualMoney,
              item.deposit,
            ],
          )
            .then(() => {
              l.info(`保存缴费信息[${holders.length}]条`);
            })
            .catch((err) => {
              this.errorCB(err);
            });
        });
      })
      .catch((err) => {
        this.errorCB(err);
      });
  };

  getAttachments = async (
    custId: number,
    readTimes: number,
    billMonth: number,
  ) => {
    const result = await this.db?.executeSql(
      'SELECT * FROM Attachments WHERE custId = ? AND readTimes = ? AND billMonth = ?',
      [custId, readTimes, billMonth],
    );
    return result?.[0].rows.raw() as AttachmentDbItem[];
  };

  getAttachmentsTotalByBookId = async (bookId: number) => {
    const result = await this.db?.executeSql(
      'SELECT count(1) as total, count(uploaded) as uploaded FROM Attachments WHERE bookId = ?',
      [bookId],
    );
    return result?.[0].rows.raw()[0] as BookAttachmentsTotal;
  };

  updateAttachmentsUploaded = async (
    custId: number,
    files: AttachmentDbItem[],
  ) => {
    await this.db?.transaction((tx) => {
      files.forEach((item) => {
        tx.executeSql(
          `UPDATE Attachments SET uploaded = 1, url = ?
            WHERE custId = ? AND billMonth = ? AND readTimes = ? AND filePath = ?`,
          [
            item.url,
            item.custId,
            item.billMonth,
            item.readTimes,
            item.filePath,
          ],
        );
      });
    });
    await this.db?.executeSql(
      'UPDATE Attachments SET uploaded = 1 WHERE custId = ?',
      [custId],
    );
  };

  getReadWaterTotalByBookId = async (bookId: number) => {
    const result = await this.db?.executeSql(
      'SELECT SUM(readWater) as readWater FROM BookDatas WHERE bookId = ?',
      [bookId],
    );
    return result?.[0].rows.raw()[0].readWater as number;
  };

  deleteAttachments = async (
    custId: number,
    readTimes: number,
    billMonth: number,
  ) => {
    await this.db?.executeSql(
      'DELETE FROM Attachments WHERE custId = ? AND readTimes = ? AND billMonth = ?',
      [custId, readTimes, billMonth],
    );
  };

  saveAttachments = (holders: AttachmentDbItem[]) => {
    this.db
      ?.transaction((tx) => {
        holders.forEach((item) => {
          tx.executeSql(
            `INSERT INTO Attachments ('bookId','custId','readTimes',
                'billMonth','uploaded', 'url', 'fileName', 'filePath', 'fileSize',
                'fileSource', 'isRemove') 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              item.bookId,
              item.custId,
              item.readTimes,
              item.billMonth,
              item.uploaded,
              item.url,
              item.fileName,
              item.filePath,
              item.fileSize,
              item.fileSource,
              item.isRemove,
            ],
          )
            .then(() => {
              l.info(`保存附件[${holders.length}]条`);
            })
            .catch((err) => {
              this.errorCB(err);
            });
        });
      })
      .catch((err) => {
        this.errorCB(err);
      });
  };

  getPayRecordsByCustId = async (custId: number) => {
    const result = await this.db?.executeSql(
      'SELECT * FROM PayRecords WHERE custId = ?',
      [custId],
    );
    return result?.[0].rows.raw() || [];
  };

  getBooks = async (userId: string) => {
    const result = await this.db?.executeSql(
      'SELECT * FROM Books WHERE userId = ?',
      [userId],
    );
    return result?.[0].rows.raw() || [];
  };

  getBookDataByBookIds = async (ids: number[]) => {
    const result = await this.db?.executeSql(
      `SELECT * FROM BookDatas WHERE bookId in (${ids.join(
        ',',
      )}) ORDER BY bookSortIndex ASC`,
      [],
    );
    return (result?.[0].rows.raw() as PdaReadDataDto[]) || [];
  };

  getToUploadBookDatas = async () => {
    const result = await this.db?.executeSql(
      'SELECT * FROM BookDatas WHERE recordState <> 0 AND uploaded = ? ORDER BY bookSortIndex ASC',
      [false],
    );
    return (result?.[0].rows.raw() as PdaReadDataDto[]) || [];
  };

  getToUploadAttachments = async () => {
    const result = await this.db?.executeSql(
      'SELECT * FROM Attachments WHERE uploaded = ?',
      [false],
    );
    return (result?.[0].rows.raw() as AttachmentDbItem[]) || [];
  };

  getBookDataDetails = async (
    custId: number,
    billMonth: number,
    readTimes: number,
  ) => {
    const result = await this.db?.executeSql(
      'SELECT * FROM BookDatas WHERE custId = ? AND billMonth = ? AND readTimes = ?',
      [custId, billMonth, readTimes],
    );
    const data =
      result?.[0].rows.length !== 0
        ? (result?.[0].rows.raw()[0] as PdaReadDataDto)
        : null;

    if (data === null) {
      return null;
    }
    data.terminalFiles =
      (JSON.parse(data.terminalFiles as string) as MobileFileDto[]) || [];
    return data;
  };

  saveReadData = async (items: PdaReadDataDto[]) => {
    await this.db?.transaction((tx) => {
      items.forEach((item) => {
        if (item.recordState === 0 && item.reading === 0) {
          item.reading = null;
          item.readWater = null;
        }
        tx.executeSql(
          `INSERT INTO BookDatas VALUES(
            ?,?,?,?,?,
            ?,?,?,?,?,
            ?,?,?,?,?,
            ?,?,?,?,?,
            ?,?,?,?,?,
            ?,?,?,?,?,
            ?,?,?,?,?,
            ?,?,?,?,?,
            ?,?,?)`,
          [
            item.billMonth,
            item.custId,
            item.readTimes,
            JSON.stringify(item.terminalFiles || []),
            item.oweNumber,
            item.bookId,
            item.bookCode,
            item.bookSortIndex,
            item.custCode,
            item.custName,
            item.custAddress,
            item.custState,
            item.deposit,
            item.lastChange,
            item.priceCode,
            item.meterState,
            item.barCode,
            item.steelMark,
            item.installLocation,
            item.caliberValue,
            item.rangeValue,
            item.lastReading,
            item.lastChildReading,
            item.lastReadWater,
            item.lastReadDate,
            item.lastReadStateId,
            item.reading,
            item.childReading,
            item.readWater,
            item.readDate,
            item.readStateId,
            item.highLowState,
            item.isEstimate,
            item.readRemark,
            item.recordState,
            item.replaceWater,
            item.avgWater,
            item.highCoefficient,
            item.lowCoefficient,
            item.highWater,
            item.lowWater,
            item.dataState,
            false,
          ],
        ).catch((e) => {
          l.error('插入下载测本数据失败', e);
        });
      });
    });
  };

  /**
   * 抄表录入
   * @param item 抄表数据
   */
  readData = async (item: PdaReadDataDto) => {
    await this.db
      ?.executeSql(
        `UPDATE BookDatas SET terminalFiles = ?, reading = ?, readWater = ?, 
                readDate = ?, readStateId = ?, readRemark = ?, recordState = ?, 
                uploaded = 0, lastReadDate = ?
            WHERE billMonth = ? AND custId = ? AND readTimes = ?`,
        [
          JSON.stringify(item.terminalFiles),
          item.reading,
          item.readWater,
          dayjs(item.readDate).format('YYYY-MM-DDTHH:mm:ss'),
          item.readStateId,
          item.readRemark,
          item.recordState,
          dayjs(item.lastReadDate).format('YYYY-MM-DDTHH:mm:ss'),
          item.billMonth,
          item.custId,
          item.readTimes,
        ],
      )
      .catch((e) => {
        l.error('保存抄表录入数据失败', e);
      });
  };

  updateReadData = async (items: PdaReadDataDto[]) => {
    await this.db?.transaction((tx) => {
      items.forEach((item) => {
        tx.executeSql(
          `UPDATE BookDatas SET terminalFiles = ?, 
                oweNumber = ?, 
                bookId = ?, 
                bookCode = ?, 
                bookSortIndex = ?,
                custCode = ?, 
                custName = ?,
                custAddress = ?, 
                custState = ?,
                deposit = ?, 
                lastChange = ?,
                priceCode = ?, 
                meterState = ?,
                barCode = ?, 
                steelMark = ?,
                installLocation = ?, 
                caliberValue = ?,
                rangeValue = ?, 
                lastReading = ?,
                lastChildReading = ?, 
                lastReadWater = ?,
                lastReadStateId = ?, 
                childReading = ?, 
                highLowState = ?, 
                isEstimate = ?, 
                replaceWater = ?, 
                avgWater = ?, 
                highCoefficient = ?, 
                lowCoefficient = ?, 
                highWater = ?, 
                lowWater = ?,
                reading = ?, 
                readWater = ?, 
                readDate = ?, 
                readStateId = ?, 
                readRemark = ?, 
                recordState = ?, 
                lastReadDate = ?,
                uploaded = 1
            WHERE billMonth = ? AND custId = ? AND readTimes = ?`,
          [
            JSON.stringify(item.terminalFiles),
            item.oweNumber,
            item.bookId,
            item.bookCode,
            item.bookSortIndex,
            item.custCode,
            item.custName,
            item.custAddress,
            item.custState,
            item.deposit,
            item.lastChange,
            item.priceCode,
            item.meterState,
            item.barCode,
            item.steelMark,
            item.installLocation,
            item.caliberValue,
            item.rangeValue,
            item.lastReading,
            item.lastChildReading,
            item.lastReadWater,
            item.lastReadStateId,
            item.childReading,
            item.highLowState,
            item.isEstimate,
            item.replaceWater,
            item.avgWater,
            item.highCoefficient,
            item.lowCoefficient,
            item.highWater,
            item.lowWater,
            item.reading,
            item.readWater,
            dayjs(item.readDate).format('YYYY-MM-DDTHH:mm:ss'),
            item.readStateId,
            item.readRemark,
            item.recordState,
            dayjs(item.lastReadDate).format('YYYY-MM-DDTHH:mm:ss'),
            item.billMonth,
            item.custId,
            item.readTimes,
          ],
        ).catch((e) => {
          l.error('保存抄表录入数据失败', e);
        });
      });
    });
  };

  updateReadingNumberByBookId = async (bookId: number) => {
    await this.db?.transaction((tx) => {
      tx.executeSql(
        'SELECT count(1) as count FROM BookDatas WHERE bookId = ? AND recordState <> ?',
        [bookId, 0],
        (t, result) => {
          const count = result.rows.raw()[0].count;
          l.info('coun', count);
          tx.executeSql('UPDATE Books SET readingNumber = ? WHERE bookId = ?', [
            count,
            bookId,
          ]).catch((e) => {
            l.error('更新抄表统计数据失败', e);
          });
        },
      );
    });
  };

  markBookDownloaded = async (ids: number[]) => {
    return this.db?.executeSql(
      `UPDATE Books SET downloaded = ? WHERE bookId in (${ids.join(',')})`,
      [true],
    );
  };

  markPaidAfterCashPayment = async (custId: number) => {
    return this.db?.executeSql(
      'UPDATE BookDatas SET oweNumber = 0 WHERE custId = ?',
      [custId],
    );
  };

  markBookUploaded = (ids: number[], items: ReadingDataDto[]) => {
    this.db?.transaction((tx) => {
      items.forEach((item) => {
        tx.executeSql('UPDATE BookDatas SET uploaded = ? WHERE custId = ?', [
          true,
          item.custId,
        ]);
      });
      ids.forEach((id) => {
        tx.executeSql(
          'SELECT count(1) as count FROM BookDatas WHERE bookId = ? AND uploaded = 1',
          [id],
          (t1, r1) => {
            tx.executeSql(
              'UPDATE Books SET uploadedNumber = ? WHERE bookId = ?',
              [r1.rows.raw()[0].count, id],
            );
          },
        );
      });
    });
  };

  deleteReadData = async (ids: number[]) => {
    await this.db?.executeSql(
      `DELETE FROM BookDatas WHERE bookId in (${ids.join(',')})`,
    );
  };

  getBookTotalData = async (userId: string) => {
    const result = await this.db?.executeSql(
      `SELECT sum(readingNumber) as readingNumber, sum(totalNumber) as totalNumber, 
        sum(uploadedNumber) as uploadedNumber FROM Books
        WHERE userId = ?`,
      [userId],
    );
    const items = result?.[0].rows.raw() || [
      {
        readingNumber: 0,
        totalNumber: 0,
        uploadedNumber: 0,
      },
    ];
    return {
      readingNumber: items[0].readingNumber || 0,
      totalNumber: items[0].totalNumber || 0,
      uploadedNumber: items[0].uploadedNumber || 0,
    };
  };

  deleteBooks = async (userId: string) => {
    await this.db?.executeSql('DELETE FROM Books WHERE userId = ?', [userId]);
  };

  deleteBookById = async (bookId: number) => {
    await this.db?.transaction((tx) => {
      tx.executeSql('DELETE FROM Books WHERE bookId = ?', [bookId]);
      tx.executeSql('DELETE FROM BookDatas WHERE bookId = ?', [bookId]);
    });
  };

  deleteBookByIds = async (ids: number[]) => {
    await this.db?.executeSql(
      `DELETE FROM Books WHERE bookId in (${ids.join(',')})`,
    );
  };
}

const db = new DataBase();
db.ensure();

export default db;
