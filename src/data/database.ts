import SQLite from 'react-native-sqlite-storage';
import { PdaMeterBookDtoHolder } from './holders';

SQLite.DEBUG(true);
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
    db.executeSql('SELECT 1 FROM Version LIMIT 1')
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
        downloaded boolean
      ); `,
    ).catch((error) => {
      this.errorCB(error);
    });

    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS BookDatas( 
        billMonth INTEGER, 
        custId INTEGER,
        readTimes INTEGER,
        terminalFiles INTEGER,
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
            `INSERT INTO Books VALUES(${item.item.billMonth}, ${item.item.bookId}, '${item.item.bookCode}', '${item.item.bookName}', ${item.item.readCycle}, '${item.item.remark}', ${item.item.readingNumber}, ${item.item.totalNumber}, false)`,
          ).catch((err) => {
            this.errorCB(err);
          });
        });
      })
      .catch((err) => {
        this.errorCB(err);
      });
  };
}

const db = new DataBase();
db.ensure();

export default db;
