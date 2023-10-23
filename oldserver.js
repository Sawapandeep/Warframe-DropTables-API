const axios = require('axios');
const express = require('express');
const { hostname } = require('os');
const fs = require('fs').promises;
const path = require('path');
const port = process.env.PORT || 5000;
const app = express();
const cheerio = require('cheerio');

const base = 'https://www.warframe.com/droptables';

const totalData = []; // Initialize an array to store the data

// Function to fetch HTML content
async function fetchHTMLContent() {
  try {
    const response = await axios.get(base);
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Function to parse HTML and extract data
// function parseHTML(html) {
//   const $ = cheerio.load(html);
//   const resData = [];
//   $('li a[href^="#"]').each((index, anchorElement) => {
//     const href = $(anchorElement).attr('href').replace('#', '');
//     const matchingH3 = $(`h3[id="${href}"]`);

//     if (matchingH3.length > 0) {
//       const currentTable = {
//         name: matchingH3.text().trim(),
//         data: [],
//         id: href,
//       };

//       matchingH3.next('table').each((index, tableElement) => {
//         const subtable = [];
//         $(tableElement).find('tr').each((i, trElement) => {
//           const row = [];
//           $(trElement).find('th, td').each((j, cellElement) => {
//             row.push($(cellElement).text().trim());
//           });
//           subtable.push(row);
//         });
//         currentTable.data.push(subtable);
//       });

//       resData.push(currentTable);
//     }
//   });

//   return resData;
// }

// Function to parse HTML and extract all resData
// function parseHTML(html) {
//   const $ = cheerio.load(html);
//   const resData = [];

//   $('table').each((index, tableElement) => {
//     const currentTable = {
//       data: [],
//     };

//     $(tableElement).find('tr').each((i, trElement) => {
//       const row = [];
//       $(trElement).find('th, td').each((j, cellElement) => {
//         row.push($(cellElement).text().trim());
//       });
//       currentTable.data.push(row);
//     });

//     resData.push(currentTable);
//   });

//   return resData;
// }

// Function to parse HTML and extract all resData with IDs
// function parseHTML(html) {
//   const $ = cheerio.load(html);
//   const resData = [];

//   $('table').each((index, tableElement) => {
//     const id = $(tableElement).prevAll('h3').first().attr('id');
//     const currentTable = {
//       id: id,
//       data: [],
//     };

//     $(tableElement).find('tr').each((i, trElement) => {
//       const row = [];
//       $(trElement).find('th, td').each((j, cellElement) => {
//         row.push($(cellElement).text().trim());
//       });
//       currentTable.data.push(row);
//     });

//     resData.push(currentTable);
//   });

//   return resData;
// }

// Function to parse HTML and extract all resData with IDs
// function parseHTML(html) {
//   const $ = cheerio.load(html);
//   const resData = [];

//   $('table').each((index, tableElement) => {
//     const id = $(tableElement).prevAll('h3').first().attr('id');
//     const currentTable = {
//       id: id,
//       data: [],
//     };

//     $(tableElement).find('tr').each((i, trElement) => {
//       const row = [];
//       $(trElement).find('td').each((j, cellElement) => {
//         row.push($(cellElement).text().trim());
//       });

//       // Combine the two <td> elements as "first td : second td" and push it into the row
//       if (row.length === 2) {
//         row[0] = row[0] + ' : ' + row[1];
//         row.pop();
//       }

//       currentTable.data.push(row.join(', '));
//     });

//     resData.push(currentTable);
//   });

//   return resData;
// }

  // Function to parse HTML and extract all resData with IDs
function parseHTML(html) {
  const $ = cheerio.load(html);
  const resData = [];

  $('table').each((index, tableElement) => {
    const id = $(tableElement).prevAll('h3').first().attr('id');
    const currentTable = {
      id: id,
      data: [],
    };

    $(tableElement).find('tr').each((i, trElement) => {
      const row = [];
      $(trElement).find('th, td').each((j, cellElement) => {
        const cellText = $(cellElement).text().trim();
        
        if (cellText) {
          if (j === 0) {
            row.push(cellText);
          } else {
            const lastCell = row[row.length - 1];
            row[row.length - 1] = lastCell + ' : ' + cellText;
          }
        }
      });

      currentTable.data.push(row);
    });

    resData.push(currentTable);
  });

  return resData;
}

// function parseHTML(html) {
//   const $ = cheerio.load(html);
//   const resData = [];

//   $('table').each((index, tableElement) => {
//     const id = $(tableElement).prevAll('h3').first().attr('id');
//     const currentTable = {
//       id: id,
//       data: [],
//     };

//     $(tableElement).find('tr').each((i, trElement) => {
//       const row = $(trElement).find('th, td').map((j, cellElement) => $(cellElement).text().trim()).get();

 

//       currentTable.data.push(row);
//     });

//     resData.push(currentTable);
//   });

//   return resData;
// }



// Route to fetch and return data
app.get('/fetch', async (req, res, next) => {
  try {
    const html = await fetchHTMLContent();
    const resData = parseHTML(html);
    totalData.push(...resData); // Add the resData to totalData
    res.json(totalData); // Return the data
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
