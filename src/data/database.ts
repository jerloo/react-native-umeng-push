import SQLite from 'react-native-sqlite-storage';
import { MobileFileDto, PdaReadDataDto } from '../../apiclient/src/models';
import {
  PdaBillingInfoHolder,
  PdaCustInfoHolder,
  PdaMeterBookDtoHolder,
  PdaPayRecordHolder,
  PdaReadingRecordHolder,
} from './holders';

// SQLite.DEBUG(true);
SQLite.enablePromise(true);

const database_name = 'mobile-read-app.db';

class DataBase {
  db: SQLite.SQLiteDatabase | undefined;

  ensure = () => {
    SQLite.openDatabase({
      name: database_name,
      location: 'Shared',
    })
      .then((DB) => {
        this.db = DB;
        console.log('Database OPEN');
        this.populateDatabase(DB);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  populateDatabase = (db: SQLite.SQLiteDatabase) => {
    console.log('Database integrity check');
    db.executeSql('SELECT 1 FROM Versions LIMIT 1')
      .then(() => {
        return true;
      })
      .catch((error) => {
        console.log('Received error: ', error);
        console.log('Database not yet ready ... populating data');
        db.transaction(this.populateDB).then(() => {
          console.log('Database populated ...');
          return true;
        });
      });
  };

  closeDatabase = () => {
    if (this.db) {
      console.log('Closing database ...');
      console.log('Closing DB');
      this.db
        .close()
        .then(() => {
          console.log('Database CLOSED');
        })
        .catch((error) => {
          this.errorCB(error);
        });
    } else {
      console.log('Database was not OPENED');
    }
  };

  errorCB = (err: any) => {
    console.log('error: ', err);
    console.log('Error ' + (err.message || err));
  };

  populateDB = (tx: SQLite.Transaction) => {
    console.log('Executing CREATE stmts');

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
        uploadedNumber INTEGER
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
        custCode INTEGER,
        custName NVARCHAR(30),
        custAddress NVARCHAR(30),
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
        dataState INTEGER
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

    tx.executeSql(`CREATE TABLE IF NOT EXISTS Attaments (
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

    console.log('Executing INSERT stmts');

    tx.executeSql('INSERT INTO Versions (version_id) VALUES (1);').catch(
      (error) => {
        this.errorCB(error);
      },
    );

    console.log('all config SQL done');
  };

  saveBooks = (holders: PdaMeterBookDtoHolder[]) => {
    this.db
      ?.transaction((tx) => {
        holders.forEach((item) => {
          tx.executeSql(
            `INSERT INTO Books ('billMonth','bookId','bookCode','bookName','readCycle','readingNumber','remark','totalNumber','downloaded') 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
            ],
          )
            .then(() => {
              console.log(`保存抄表任务${item.bookId}`);
            })
            .catch((err) => {
              this.errorCB(err);
            });
        });
        console.log(`保存抄表任务[${holders.length}]条`);
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
              console.log(`保存基本信息[${holders.length}]条`);
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
              console.log(`保存抄表信息[${holders.length}]条`);
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
              console.log(`保存账单信息[${holders.length}]条`);
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
              console.log(`保存缴费信息[${holders.length}]条`);
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

  getBooks = async () => {
    const result = await this.db?.executeSql('SELECT * FROM Books', []);
    return result?.[0].rows.raw() || [];
  };

  getBookDataByBookIds = async (ids: number[]) => {
    const result = await this.db?.executeSql(
      `SELECT * FROM BookDatas WHERE bookId in (${ids.join(
        ',',
      )}) ORDER BY bookSortIndex ASC`,
      [],
    );
    return result?.[0].rows.raw() || [];
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
        tx.executeSql(
          'INSERT INTO BookDatas VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
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
          ],
        ).catch((e) => {
          console.log('插入下载测本数据失败', e);
        });
      });
    });
  };

  updateReadData = async (items: PdaReadDataDto[]) => {
    await this.db?.transaction((tx) => {
      items.forEach((item) => {
        console.log('保存报表录入', item);
        tx.executeSql(
          `UPDATE BookDatas SET terminalFiles = ?, reading = ?, readWater = ?, readDate = ?, readStateId = ?, readRemark = ?
            WHERE billMonth = ? AND custId = ? AND readTimes = ?`,
          [
            JSON.stringify(item.terminalFiles),
            item.reading,
            item.readWater,
            item.readDate,
            item.readStateId,
            item.readRemark,
            item.billMonth,
            item.custId,
            item.readTimes,
          ],
        ).catch((e) => {
          console.log('插入下载测本数据失败', e);
        });
      });
    });
  };

  markBookDownloaded = async (ids: number[]) => {
    return this.db?.executeSql(
      `UPDATE Books SET downloaded = ? WHERE bookId in (${ids.join(',')})`,
      [true],
    );
  };

  deleteReadData = async (ids: number[]) => {
    await this.db?.executeSql(
      `DELETE FROM BookDatas WHERE bookId in (${ids.join(',')})`,
    );
  };

  getBookTotalData = async () => {
    const result = await this.db?.executeSql(
      'SELECT sum(readingNumber) as readingNumber, sum(totalNumber) as totalNumber, sum(uploadedNumber) as uploadedNumber FROM Books',
      [],
    );
    const items = result?.[0].rows.raw() || [
      {
        readingNumber: 0,
        totalNumber: 0,
        uploadedNumber: 0,
      },
    ];
    console.log('totalNumbers', items[0]);
    return {
      readingNumber: items[0].readingNumber || 0,
      totalNumber: items[0].totalNumber || 0,
      uploadedNumber: items[0].uploadedNumber || 0,
    };
  };

  deleteBooks = async () => {
    await this.db?.executeSql('DELETE FROM Books');
  };
}

const db = new DataBase();
db.ensure();

export default db;
