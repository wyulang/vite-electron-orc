// 表
let tableName = "ttsVue"
let dbName = "ttsDb"
export default {
  createDb() {
    return new Promise((resolve, reject) => {
      let db;
      // 打开数据库，若没有则会创建
      const request = indexedDB.open(dbName, 1);
      // 数据库打开成功回调
      request.onsuccess = function (event: any) {
        db = event.target.result; // 数据库对象
        console.log("数据库打开成功");
        resolve(db);
      };
      // 数据库打开失败的回调
      request.onerror = function (event) {
        console.log("数据库打开报错");
      };
      // 数据库有更新时候的回调
      request.onupgradeneeded = function (event: any) {
        // 数据库创建或升级的时候会触发
        console.log("onupgradeneeded");
        db = event.target.result; // 数据库对象
        var objectStore;
        // 创建存储库
        objectStore = db.createObjectStore(tableName, {
          keyPath: "id", // 这是主键
          autoIncrement: true // 实现自增
        });
        // 创建索引，在后面查询数据的时候可以根据索引查
        objectStore.createIndex("style", "style", { unique: false });
        objectStore.createIndex("role", "role", { unique: false });
        objectStore.createIndex("id", "id", { unique: false });
        objectStore.createIndex("isDefault", "isDefault", { unique: false });
        objectStore.createIndex("name", "name", { unique: false });
        objectStore.createIndex("roleName", "roleName", { unique: false });
      };
    });
  },
  update(data) {
    let db = indexedDB.open(dbName, 1)
    return new Promise((success, error) => {
      db.onsuccess = () => {
        let sql = db.result.transaction([tableName], "readwrite").objectStore(tableName)
        let successCount = 0;
        data.forEach(item => {
          sql.put(item).onsuccess = e => {
            successCount++
            if (successCount == data.length) {
              success({ data: '添加成功', code: '200' })
              db.result.close()
            }
          }
        })
      }
      db.onerror = () => {
        error({ data: [], msg: '', code: '400' })
        db.result.close()
      }
    })
  },
  query() {
    let db = indexedDB.open(dbName, 1)
    return new Promise((success, error) => {
      db.onsuccess = () => {
        let result = db.result.transaction([tableName], "readwrite").objectStore(tableName).getAll();
        result.onsuccess = (e: any) => {
          success({ data: e.target?.result, code: '200' })
        }
        result.onerror = (e: any) => {
          error({ data: [], msg: '', code: '400' })
        }
      }
    })
  },
  delete(id) {
    let db = indexedDB.open(dbName, 1);
    return new Promise((success, error) => {
      db.onsuccess=(e:any)=>{
        let result = db.result.transaction([tableName], "readwrite").objectStore(tableName).delete(id);
        result.onsuccess = () => {
          success({ code: 200, msg: '删除成功', data: '' })
          db.result.close()
        }
        result.onerror = () => {
          error({ code: 300, msg: '删除失败', data: '' })
          db.result.close()
        }
      }

      db.onerror = () => {
        error({ code: 300, msg: '删除失败', data: '' })
        db.result.close()
      }
    })
  }
}