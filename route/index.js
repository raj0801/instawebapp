const fs = require("fs");
const express = require("express");
const app = express();
const cors = require("cors");
const mysql = require("mysql");
const util = require("util");
const bodyParser = require("body-parser");

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "paginationrecord",
});
const query = util.promisify(con.query).bind(con);



app.get("/", (req, res) => {
  res.send("<h1>HELLO</h1>");
});

app.get("/users", (req, res) => {
  fs.readFile("./users.json", "utf8", (err, data) => {
    if (err) {
      res.status(400).json(err);
      return;
    }
    res.status(200).json(JSON.parse(data));
  });
}); -

  app.get("/zodiac/core/system/sites", (req, res) => {
    fs.readFile("./loginJsons/siteData.json", "utf8", (err, data) => {
      if (err) {
        res.status(400).json(err);
        return;
      }
      res.status(200).json(JSON.parse(data));
    });
  });

app.get("/zodiac/core/system/message", (req, res) => {
  fs.readFile("./loginJsons/messageData.json", "utf8", (err, data) => {
    if (err) {
      res.status(400).json(err);
      return;
    }
    res.status(200).json(JSON.parse(data));
  });
});

app.get("/zodiac/core/system/russia", (req, res) => {
  fs.readFile("./loginJsons/russia.properties", "utf8", (err, data) => {
    if (err) {
      res.status(400).json(err);
      return;
    }
    let propertiesFiles = data.replace(/\./g, "_").replace(/ /g, "")
    var formattedData = propertiesFiles
      .replace(".", "_")
      .split("\n")
      .map((row) => row.split("="))
      .reduce((acc, [key, value]) => ((acc[key] = value), acc), {});

    propertiesFiles = [formattedData];

    res.status(200).json(JSON.stringify(propertiesFiles));
  });
});

app.get("/zodiac/core/system/property", (req, res) => {
  fs.readFile("./loginJsons/property.properties", "utf8", (err, data) => {
    if (err) {
      res.status(400).json(err);
      return;
    }
    let propertiesFiles = data.replace(/\./g, "_").replace(/ /g, "")
    var formattedData = propertiesFiles
      .replace(".", "_")
      .split("\n")
      .map((row) => row.split("="))
      .reduce((acc, [key, value]) => ((acc[key] = value), acc), {});

    propertiesFiles = [formattedData];
    res.status(200).json(JSON.stringify(propertiesFiles));
  });
});

app.get("/zodiac/core/system/login", (req, res) => {
  fs.readFile("./loginJsons/loginFailed.json", "utf8", (err, data) => {
    if (err) {
      res.status(400).json(err);
      return;
    }
    res.status(200).json(JSON.parse(data));
  });
});

app.post("/zodiac/core/security/login", async (req, res) => {
  const user = req.body;

  let users = [];
  fs.readFile("./users.json", (err, data) => {
    if (err) {
      res.status(400).json(err);
      return;
    }
    users = JSON.parse(data);

    var valueArr = users.map((item, i) => {
      return user.filter((e, i) => {
        return e.userName == item.userName && e.password === item.password && e.lang == item.lang && e.siteCode == item.siteCode;
      })
    })

    let ar = valueArr.map((e, i) => {
      return (e.length > 0)
    })
    const val = ar.includes(true)

    res.status(200).json(val);
  });

});

app.get("/zodiac/core/home/page-configuration", (req, res) => {
  fs.readFile("./dashboardJson/home.json", "utf8", (err, data) => {
    if (err) {
      res.status(400).json(err);
      return;
    }
    res.status(200).json(JSON.parse(data));
  });
});

app.get("/zodiac/resource/core/bundle/en-us.properties", (req, res) => {
  fs.readFile("./dashboardJson/dashboard.properties", "utf8", (err, data) => {
    if (err) {
      res.status(400).json(err);
      return;
    }
    let propertiesFiles = data.replaceAll(" ", "")
      .split("\n")
      .map((row) => row.split("="))
      .reduce((acc, [key, value]) => ((acc[key] = value), acc), {});

    res.status(200).json(JSON.stringify([propertiesFiles]));
  });
});

app.get("/zodiac/core/vessel-visit/page-configuration", (req, res) => {
  fs.readFile("../../ZodiacDeshboard/Deshboard/resources/JSON/details.json", "utf8", (err, data) => {
    if (err) {
      res.status(400).json(err);
      return;
    }
    res.status(200).json(JSON.parse(data));
  });
});

app.get("/zodiac/core/vessel-visit/page-details", (req, res) => {
  fs.readFile("../../ZodiacDeshboard/Deshboard/resources/JSON/recordDetails.json", "utf8", (err, data) => {
    if (err) {
      res.status(400).json(err);
      return;
    }
    let recordData = JSON.parse(data);

    res.status(200).json(recordData);

    const checkIfTableIsEmpty = async () => {
      try {
        const rowCountResult = await query("SELECT COUNT(*) AS count FROM recordtable");
        const rowCount = rowCountResult[0].count;
        return rowCount === 0;
      } catch (error) {
        console.error("Error checking table data:", error);
        return false;
      }
    };

    const insertDataIfEmpty = async () => {
      try {
        const isTableEmpty = await checkIfTableIsEmpty();
        if (!isTableEmpty) {
          return;
        }

        fs.readFile("./dashboardJson/dashboard.properties", "utf8", (err, data) => {
          if (err) {
            console.error("Error reading file:", err);
            return;
          }

          const propertiesFiles = data
            .replaceAll(" ", "")
            .replaceAll("\r", "")
            .split("\n")
            .map((row) => row.split("="))
            .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

          const createHeader = recordData.returnObject.columnConfig.columnValueObjects.filter((e) => e.isVisible === true);
          const columns = createHeader.map((e) => propertiesFiles[e.columnNameKey]);

          const rowConfig = recordData.returnObject.rowConfig;

          for (const { record } of rowConfig) {
            const values = record.map(({ value }) => (value === undefined ? " " : value));

            const escapedColumns = columns.map((col) => `\`${col}\``);

            const insertQuery = `INSERT INTO recordtable (${escapedColumns.join(", ")}) VALUES ('${values.join("', '")}')`;

            con.query(insertQuery, function (err, results) {
              if (err) {
                console.error('Error executing the query:', err);
                return;
              }
              console.log('All column values in recordtable:');
            });
          }
        });
      } catch (error) {
        console.error("Error inserting data:", error);
      }
    };

    insertDataIfEmpty();
  });
});

app.post("/zodiac/core/vessel-visit/tabledata", async (req, res) => {
  try {

    const filterKeyData = req.body.filterKey;
    if (filterKeyData === undefined) {
      const selectQuery = "SELECT * FROM recordtable";
      const selectedData = await query(selectQuery);
      res.status(200).json(selectedData);
    }
    else {
      let query1 = 'SELECT * FROM recordtable WHERE ';
      let conditions = [];

      filterKeyData.forEach((searchObj) => {
        const { column, value, text } = searchObj;
        if (value === 'Contains') {
          conditions.push(`${column} LIKE '%${text}%'`);
        }
        if (value === 'Exclude') {
          conditions.push(`${column} <> '${text}'`);
        }
        if (value === "Is") {
          conditions.push(`${column} = '${text}'`);
        }
        if (value === "Is Not") {
          conditions.push(`${column} <> '${text}'`);
        }
        if (value === "In List") {
          const list = text.split(',').map(item => `'${item.trim()}'`).join(',');
          conditions.push(`${column} IN (${list})`);
        }
        if (value === "From") {
          const [start, end] = text.split(',').map(item => `'${item.trim()}'`);
          conditions.push(`${column} >= ${start} AND ${column} <= ${end}`);
        }
        if (value === "Between") {
          const range = text.split(',').map(item => item.trim());
          if (range.length === 2) {
            conditions.push(`${column} BETWEEN '${range[0]}' AND '${range[1]}'`);
          }
        }
      });

      query1 += conditions.join(' AND ');

      const filterData = await query(query1);
      res.status(200).json(filterData);
    }
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(400).json({ error: "An error occurred while processing your request." });
  }
});

app.listen(5000, () => {
  console.log("Server started on port 5000");
});





