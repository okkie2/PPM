function onFormSubmit(e) {
  // function onFormSubmit starts here.

  // Open the spreadsheet with evaluation responses
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheets()[0];

  // Fetch the last record plus the collumn names
  // Get the first row (labels) and the last row (values)
  var firstRowRange = sheet.getRange(1, 1, 1, sheet.getLastColumn());
  var lastRowRange = sheet.getRange(sheet.getLastRow(), 1, 1, sheet.getLastColumn());
  var labels = firstRowRange.getValues()[0];
  var values = lastRowRange.getValues()[0];
  
  // Save the email address to a seperate variable.
  // Trim the first and last two columns so only comptency informion remains
  var emailAddress = values[0];
  labels = labels.slice(1, labels.length - 2);
  values = values.slice(1, values.length - 2);

  // Store the competency info as label-value pair objects within an array.
  var dataPairObjects = [];
  for (var i = 0; i < labels.length; i++) {
    var pairObject = {
      label: labels[i],
      value: values[i]
    };
    dataPairObjects.push(pairObject);
  }

/* Here are some items to log to the console to check if all is well.
// TODO: Implement a centralised logging function. And make it conditional so that it can be turned on/off. 
    var enableLogging = true;
    function customLogger(message) {
      if (enableLogging) {
       Logger.log(message);
    }
}
  Logger.log("firstRowRange: " + firstRowRange.getValues()[0]);
  Logger.log("lastRowRange: " + lastRowRange.getValues()[0]);
  Logger.log("Email Address: " + emailAddress);
  Logger.log("Data Pair Objects:");
  dataPairObjects.forEach(obj => Logger.log(obj.label + ": " + obj.value));
*/

// Now calculate the total value for each competency. Eg. FS = 3, UX = 2,etc.

function determineCompetency(dataPairObjects, prefix) {
  for (let i = 0; i <= 7; i++) {
    const label = prefix + (i+1);
    const item = dataPairObjects.find(obj => obj.label === label);

    if (item && item.value < 4) {
      return i;
    }
  }
  return 7; // If all values are >= 4, return the highest level
}

// Define all competency prefixes
// TODO: Fetch these prefixes from the source sheet
  const competencies = ["FS", "PD", "QA", "DF", "VC", "UX", "OO", "PV", "SI", "SM", "TL", "MU"];

// Store all the calculated values per competency in a new array "competencyLevels". 
var competencyLevels = [];
competencies.forEach(prefix => {
  const level = determineCompetency(dataPairObjects, prefix);
  competencyLevels.push({ 
    competency: prefix, 
    level: level 
  });
});

// Logging the array of competency levels
// Logger.log("competencyLevels:  "+JSON.stringify(competencyLevels));

// Now we need to rotate the array so that the graph starts at the fourth competency. The rotated array will saved as "rotatedCompetencyLevels"

// Get the first three competencies and remove them from the array
var firstThree = competencyLevels.splice(0, 3);

// Add the remaining competencies to the new array
rotatedCompetencyLevels = competencyLevels.slice();

// Append the first three competencies to the end of the new array
rotatedCompetencyLevels = rotatedCompetencyLevels.concat(firstThree);

// Logging the rotated array
// Logger.log("Rotated competencyLevels: "+ JSON.stringify(rotatedCompetencyLevels));

// Now we create a new Google sheet. This is to contain the promised evaluation report with explanaition and a pretty graph. 

// The report should only be created if there is a valide email address to send it to.
if (emailAddress) {
  var newSs = SpreadsheetApp.create("Report for " + emailAddress);
  var newSheet = newSs.getSheets()[0];

// Now we set access rights for the new sheet
var spreadsheetId = newSs.getId();
Drive.Permissions.insert(
    {
      'role': 'reader',
      'type': 'anyone'
    },
    spreadsheetId,
    {
      'withLink': true
    }
  );

// Here we set the collumn display width so that the data looks nice.
newSheet.setColumnWidth(1, 35);
newSheet.setColumnWidth(2, 200);
newSheet.setColumnWidth(3, 35);
newSheet.setColumnWidth(4, 60);

// Populate the sheet with the rotated competency levels
  var competencyNames = rotatedCompetencyLevels.map(item => [item.competency]);
  var levels = rotatedCompetencyLevels.map(item => [item.level]);
  newSheet.getRange("A8:A19").setValues(competencyNames);
  newSheet.getRange("C8:C19").setValues(levels);

// Add grid lines
var gridRange = newSheet.getRange('A8:C19'); 
gridRange.setBorder(true,true,true,true,true,true,);


// Explain to the reader what's going on using inline text. 
  newSheet.getRange("A1:A1").setValues([["Dear " + emailAddress +","]]);
  newSheet.getRange("A2:A2").setValues([["Here is your competency profile."]]);
  newSheet.getRange("A3:A3").setValues([["Open this link for an in depth explanation:"]]);

// Display reference competencies
  newSheet.getRange("A4:A4").setValues([["https://drive.google.com/file/d/1E5PIbY55bATyWdTx3n2PsFw8cG79q8sl/view?usp=sharing"]]);

// Display table with outcomes
  newSheet.getRange("A7:A7").setValues([["Product manager competencies of " +emailAddress]]);
  newSheet.getRange("A31:A31").setValues([["Reference product manager competencies"]]);
  newSheet.getRange("B8:B19").setValues([["Data Fluency"],["Voice of the Customer"],["User Experience"],["Business Outcome Ownership"],["Product Vision & Roadmapping"],["Strategic Impact"],["Stakeholder Management"],["Team Leadership"],["Managing up"],["Functional Specification"],["Product Delivery"],["Quality Assurance"]]);

// Create a chart
  var chartBuilder = newSheet.newChart();
  chartBuilder
  .setChartType(Charts.ChartType.RADAR)
  .addRange(newSheet.getRange("A8:C19"))
  .setPosition(8, 5, 0, 0)
  // .setOption('title', 'Competencies ')
  .setOption('vAxis.viewWindow.min', 0)
  .setOption('areaOpacity', 0.5)
  .setOption('colors', ['blue'])
  .setOption('vAxis.viewWindow.max', 7);
  var chart = chartBuilder.build();
  newSheet.insertChart(chart);

// Display image with reference chart
  newSheet.insertImage("https://i.postimg.cc/SNpYyWJM/Screenshot-2023-11-15-at-10-09-26.png", 1, 32);

// Send email with link to the report
  var reportUrl = newSs.getUrl();
  var subject = "Your Personalized Product Management Maturity Report";
  var message = "Here is your personalized report: "+ reportUrl;
    
  MailApp.sendEmail(emailAddress, subject, message);
  } else {
    Logger.log("Failed to send email: no recipient");
  }

return;  
  // function onFormSubmit ends here.
}

