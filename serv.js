const express = require('express');
const cheerio = require('cheerio');

const app = express();
const port = 5000; // You can change the port as needed

// Your HTML content
const html = `<h3 id="missionRewards">Missions:</h3>
    <table>
    <tr>
    <th colspan="2">Mercury/Apollodorus (Survival)</th>
</tr>
<tr>
    <th colspan="2">Rotation A</th>
</tr>
<tr>
    <td>2,000 Credits Cache</td>
    <td>Common (50.00%)</td>
</tr>
<tr>
    <td>100 Endo</td>
    <td>Common (50.00%)</td>
</tr>
<tr>
    <th colspan="2">Rotation B</th>
</tr>
<tr>
    <td>Parry</td>
    <td>Rare (7.69%)</td>
</tr>
<tr>
    <td>Steel Fiber</td>
    <td>Rare (7.69%)</td>
</tr>

<tr>
    <th colspan="2">Rotation C</th>
</tr>
<tr>
    <td>Arrow Mutation</td>
    <td>Rare (3.76%)</td>
</tr>
<tr>
    <td>Rifle Ammo Mutation</td>
    <td>Rare (3.76%)</td>
</tr>

<tr class="blank-row">
    <td class="blank-row" colspan="2"></td>
</tr>
<tr>
    <th colspan="2">Mercury/Apollodorus (Survival)</th>
</tr>
<tr>
    <th colspan="2">Rotation A</th>
</tr>
<tr>
    <td>2,000 Credits Cache</td>
    <td>Common (50.00%)</td>
</tr>
<tr>
    <td>100 Endo</td>
    <td>Common (50.00%)</td>
</tr>
<tr>
    <th colspan="2">Rotation B</th>
</tr>
<tr>
    <td>Parry</td>
    <td>Rare (7.69%)</td>
</tr>
<tr>
    <td>Steel Fiber</td>
    <td>Rare (7.69%)</td>
</tr>

<tr>
    <th colspan="2">Rotation C</th>
</tr>
<tr>
    <td>Arrow Mutation</td>
    <td>Rare (3.76%)</td>
</tr>
<tr>
    <td>Rifle Ammo Mutation</td>
    <td>Rare (3.76%)</td>
</tr>

<tr class="blank-row">
    <td class="blank-row" colspan="2"></td>
</tr>
<tr>
    <th colspan="2">Mercury/Apollodorus (Survival)</th>
</tr>
<tr>
    <th colspan="2">Rotation A</th>
</tr>
<tr>
    <td>2,000 Credits Cache</td>
    <td>Common (50.00%)</td>
</tr>
<tr>
    <td>100 Endo</td>
    <td>Common (50.00%)</td>
</tr>
<tr>
    <th colspan="2">Rotation B</th>
</tr>
<tr>
    <td>Parry</td>
    <td>Rare (7.69%)</td>
</tr>
<tr>
    <td>Steel Fiber</td>
    <td>Rare (7.69%)</td>
</tr>

<tr>
    <th colspan="2">Rotation C</th>
</tr>
<tr>
    <td>Arrow Mutation</td>
    <td>Rare (3.76%)</td>
</tr>
<tr>
    <td>Rifle Ammo Mutation</td>
    <td>Rare (3.76%)</td>
</tr>

<tr class="blank-row">
    <td class="blank-row" colspan="2"></td>
</tr>

    </table>`;

// app.get('/parse', (req, res) => {
//     // Load the HTML into Cheerio
//     const $ = cheerio.load(html);

//     // Function to parse tables and subtables
//     function parseTables() {
//         const data = [];
//         let currentTable = null;
//         let currentSubtable = null;

//         $('tr').each(function () {
//             const th = $(this).find('th');
//             const td = $(this).find('td');

//             if (th.length === 2) {
//                 // This is a heading row for a new table or subtable
//                 if (currentTable) {
//                     data.push(currentTable);
//                 }
//                 currentTable = {
//                     heading: th.eq(1).text(),
//                     subtables: [],
//                 };
//             } else if (td.length === 2 && currentTable) {
//                 // This is an element row within the current table
//                 const element = {
//                     name: td.eq(0).text(),
//                     rarity: td.eq(1).text(),
//                 };
//                 if (currentSubtable) {
//                     currentSubtable.elements.push(element);
//                 } else {
//                     currentTable.elements.push(element);
//                 }
//             } else if (th.length === 1 && currentTable) {
//                 // This is a heading row for a new subtable within the current table
//                 currentSubtable = {
//                     heading: th.text(),
//                     elements: [],
//                 };
//                 currentTable.subtables.push(currentSubtable);
//             } else {
//                 // Handle any other cases as needed
//             }
//         });

//         // Push the last table
//         if (currentTable) {
//             data.push(currentTable);
//         }

//         return data;
//     }

//     const result = parseTables();
//     res.json(result);
// });
app.get('/parse', (req, res) => {
    // Load the HTML into Cheerio
    const $ = cheerio.load(html);

    // Function to parse tables and subtables
    function parseTables() {
        const data = [];
        let currentTable = null;
        let currentSubtable = null;

        $('tr').each(function () {
            const th = $(this).find('th');
            const td = $(this).find('td');

            if (th.length === 2) {
                // This is a heading row for a new table or subtable
                if (currentTable) {
                    console.log(currentTable);
                    data.push(currentTable);
                }
                currentTable = {
                    heading: th.eq(1).text(),
                    subtables: [],
                };
            } else if (td.length === 2 && currentTable) {
                // This is an element row within the current table
                const element = {
                    name: td.eq(0).text(),
                    rarity: td.eq(1).text(),
                };
                if (currentSubtable) {
                    console.log(element);
                    currentSubtable.elements.push(element);
                } else {
                    currentTable.elements.push(element);
                }
            } else if (th.length === 1 && currentTable) {
                // This is a heading row for a new subtable within the current table
                currentSubtable = {
                    heading: th.text(),
                    elements: [],
                };
                currentTable.subtables.push(currentSubtable);
            } else {
                // Handle any other cases as needed
            }
        });

        // Push the last table
        if (currentTable) {
            console.log(currentTable);
            data.push(currentTable);
        }

        return data;
    }

    const result = parseTables();
    res.json(result);
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});


// const axios = require('axios');
// const express = require('express');
// const { hostname } = require('os');
// const fs = require('fs').promises;
// const path = require('path');
// const port = process.env.PORT || 5000;
// const app = express();
// const cheerio = require('cheerio');

// const base = 'https://www.warframe.com/droptables';

// const resData = []; // Initialize an array to store the data

// // Function to fetch HTML content
// async function fetchHTMLContent() {
//   try {
//     const response = await axios.get(base);
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// }

// // Function to parse HTML and extract data
// function parseHTML(html) {
//   const $ = cheerio.load(html);
//   const tables = [];
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

//       tables.push(currentTable);
//     }
//   });

//   return tables;
// }

// // Route to fetch and return data
// app.get('/fetch', async (req, res, next) => {
//   try {
//     const html = await fetchHTMLContent();
//     const tables = parseHTML(html);
//     resData.push(...tables); // Add the tables to resData
//     res.json(resData); // Return the data
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
