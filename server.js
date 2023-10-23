const axios = require('axios');
const express = require('express');
const { hostname } = require('os');
const fs = require('fs').promises;
const path = require('path');
const port = process.env.PORT || 5000;
const app = express();
const cheerio = require('cheerio');

const base = 'https://www.warframe.com/droptables';

let prevtimestamp = 1697308200; // Initialize the prevtimestamp date

const totalData = []; // Initialize an array to store the data

// Function to fetch HTML code of the droptables website
async function fetchHTMLContent() {
  try {
    const response = await axios.get(base);
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Function to parse HTML and extract data
function parseDate(html) {
  const $ = cheerio.load(html);
  const dateText = $('p:first-child').text().trim();
  const dateObject = new Date(dateText);
  const newTimestamp = Math.floor(dateObject.getTime() / 1000); // Convert to Unix newTimestamp in seconds

  if (newTimestamp !== prevtimestamp) {
    // Timestamps are not the same, update prevtimestamp and print "updated tables"
    prevtimestamp = newTimestamp;
    console.log(`updated tables : ${newTimestamp}`);
  } else {
    console.log(`no change : ${prevtimestamp}`);
  }

  return newTimestamp; // Return the newTimestamp value
}


// function parseId(html) {
//   const $ = cheerio.load(html);
//   const resData = [];

//   // $('table').each((index, tableElement) => {
//   //   const id = $(tableElement).prevAll('h3').first().attr('id');
//   //   const currentTable = {
//   //     id: id,
//   //     data: [],
//   //   };
//   $('h3#missionRewards').next('table').each((index, tableElement) => {
//     const currentTable = {
//       data: [],
//     };
    
//     $(tableElement).find('tr').each((i, trElement) => {
//       const row = [];
//       $(trElement).find('th, td').each((j, cellElement) => {
//         const cellText = $(cellElement).text().trim();
        
//         if (cellText) {
//           if (j === 0) {
//             row.push(cellText);
//           } else {
//             const lastCell = row[row.length - 1];
//             row[row.length - 1] = lastCell + ' : ' + cellText;
//           }
//         }
//       });

//       currentTable.data.push(row);
//     });

//     resData.push(currentTable);
//   });

//   return resData;
// }
// Function to parse the first table after <h3 id="missionRewards">Missions:</h3
// function parseId(html) {
//   const $ = cheerio.load(html);
//   const resData = [];

//   const tableElement = $('h3#missionRewards').next('table');

//   const currentTable = {
//     data: [],
//   };

//   let subtable = [];
//   $(tableElement).find('tr').each((i, trElement) => {
//     const row = [];
//     $(trElement).find('th, td').each((j, cellElement) => {
//       const cellText = $(cellElement).text().trim();

//       if (cellText) {
//         if (j === 0) {
//           row.push(cellText);
//         } else {
//           const lastCell = row[row.length - 1];
//           row[row.length - 1] = lastCell + ' : ' + cellText;
//         }
//       }
//     });

//     if (trElement.attribs.class === 'blank-row') {
//       // Start a new subtable when a blank row is encountered
//       if (subtable.length > 0) {
//         currentTable.data.push(subtable);
//         subtable = [];
//       }
//     } else {
//       // Add the row to the current subtable
//       subtable.push(row);
//     }
//   });

//   // Add the last subtable if it exists
//   if (subtable.length > 0) {
//     currentTable.data.push(subtable);
//   }

//   resData.push(currentTable);

//   return resData;
// }
// Function to parse the first table after <h3 id="missionRewards">Missions:</h3> with subtables
// Function to parse the first table after <h3 id="missionRewards">Missions:</h3> with subtables
function parseId(html) {
  const $ = cheerio.load(html);
  const resData = [];

  const planetNames = [
    "Mercury", "Venus", "Earth", "Lua", "Mars", "Deimos", "Phobos", "Ceres", "Jupiter",
    "Europa", "Saturn", "Uranus", "Neptune", "Pluto", "Sedna", "Eris", "Kuva Fortress", "Void", "Zariman"
  ];

  // Select the first table after the missionRewards header
  const tableElement = $('h3#missionRewards').next('table');

  const currentTable = {
    data: [],
  };

  let currentSubtable = null;

  $(tableElement).find('tr').each((i, trElement) => {
    const $tr = $(trElement);

    if ($tr.hasClass('blank-row')) {
      // If it's a blank row, start a new subtable
      if (currentSubtable) {
        currentTable.data.push(currentSubtable);
      }

      const missionName = $tr.find('th[colspan="2"]').text().trim();

      // Check if part of missionName is a planet name
      const includesPlanetName = planetNames.some(planetName => missionName.includes(planetName));

      if (includesPlanetName) {
        currentSubtable = {
          mission: missionName,
          data: [],
        };
      }
    } else if (currentSubtable) {
      const row = [];
      $tr.find('th, td').each((j, cellElement) => {
        const cellText = $(cellElement).text().trim();
        if (cellText) {
          row.push(cellText);
        }
      });

      if (row.length > 0) {
        currentSubtable.data.push(row);
      }
    }
  });

  if (currentSubtable) {
    currentTable.data.push(currentSubtable);
  }

  resData.push(currentTable);

  return resData;
}


app.get('/fetch', async (req, res, next) => {
  try {
    const html = await fetchHTMLContent();
    // const newTimestamp = parseDate(html); // Get the newTimestamp value from parseDate
    const rData = parseId(html);
    totalData.push(...rData); // Add the resData to totalData
    res.json({totalData}); // Return the newTimestamp and data
  } catch (error) {
    next(error);
  }
});

// Error handling middleware (should be at the end)
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json('Error fetching data');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`http://${hostname}:${port}`);
});


//! v1
// const axios = require('axios');
// const express = require('express');
// const { hostname } = require('os');
// const fs = require('fs').promises;
// const path = require('path');
// const port = process.env.PORT || 5000;
// const app = express();
// const cheerio = require('cheerio');
// const { log } = require('console');

// const base = 'https://www.warframe.com/droptables';

// let prevtimestamp = 1697308200; // Initialize the prevtimestamp date

// const totalData = []; // Initialize an array to store the data

// // Function to fetch HTML code of the droptables website
// async function fetchHTMLContent() {
//   try {
//     const response = await axios.get(base);
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// }

// // Function to parse HTML and extract data
// function parseDate(html) {
//     const $ = cheerio.load(html);
//     const dateText =  $('p:first-child').text().trim();
//     const dateObject = new Date(dateText);
//     const newTimestamp = Math.floor(dateObject.getTime() / 1000); // Convert to Unix newTimestamp in seconds
  
//     if (newTimestamp !== prevtimestamp) {
//       // Timestamps are not the same, update prevtimestamp and print "updated tables"
//       prevtimestamp = newTimestamp;
//       console.log(`updated tables : ${newTimestamp}`);
//     } else {
//       console.log(`no change : ${prevtimestamp}`);
//     }
//   }
  
//   function missionRewards(html) {
//     const resData = []; // Initialize an array to store the data
  
//     const $ = cheerio.load(html);
//     const tables = $('h3#missionrewards  table'); // Select tables following the "missionrewards" h3 tag
  
//     tables.each((index, tableElement) => {
//       const id = $(tableElement).prevAll('h3').first().attr('id');
//       const currentTable = {
//         id:id,
//         data: [],
//       };
  
//       $(tableElement).find('tr').each((i, trElement) => {
//         const row = [];
//         $(trElement).find('th, td').each((j, cellElement) => {
//           const cellText = $(cellElement).text().trim();
          
//           if (cellText) {
//             if (j === 0) {
//               row.push(cellText);
//             } else {
//               const lastCell = row[row.length - 1];
//               row[row.length - 1] = lastCell + ' : ' + cellText;
//             }
//           }
//         });
  
//         currentTable.data.push(row);
//       });
      
//       resData.push(currentTable);
//     });
  
//     return resData;
//   }

// app.get('/fetch', async (req, res, next) => {
//   try {
//     const html = await fetchHTMLContent();
    
//     //  parseDate(html);
//     const resData = missionRewards(html);
//     totalData.push(...resData); // Add the resData to totalData
//     res.json(totalData); // Return the data
//   } catch (error) {
//     next(error);
//   }
// });


// // Error handling middleware (should be at the end)
// app.use((err, req, res, next) => {
//   console.error('Error:', err);
//   res.status(500).json('Error fetching data');
// });

// // Start the server
// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
//   console.log(`http://${hostname}:${port}`);
// });
