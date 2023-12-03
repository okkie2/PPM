# Self-Evaluation Form for Product Managers

## Overview
This project provides a dynamic and user-friendly self-evaluation tool for product managers, focusing on 12 key competencies. It leverages the flexibility of Typeform for an adaptive questionnaire experience and employs Google Sheets and Google Apps Script for data management and report generation.

## Features
- **Dynamic Self-Evaluation Form**: Utilizes Typeform to present a tailored set of questions based on previous responses, reducing the need to answer all 84 questions.
- **Automated Data Processing**: Google Apps Script processes responses from Typeform, storing results in a Google Sheet.
- **Personalized Competency Reports**: Generates individual reports highlighting each product manager's competency levels.

## Workflow
1. **Questionnaire Setup**: 
   - A comprehensive list of 84 questions is maintained in a Google Sheet.
   - The Google Sheet is imported into Google Forms using the "Formbuilder Plus" plugin from Jivrus.
   - Questions are then exported from Google Forms to Typeform.
2. **Form Submission**: Product managers complete the adaptive self-evaluation form on Typeform.
3. **Data Handling and Report Generation**: 
   - The script processes the responses from Typeform, storing them in a Google Sheet.
   - Individual reports are generated for each submission, showcasing the competency profile.

## Technical Details
- The project uses Google Apps Script for automating data processing tasks.
- Integration between Google Sheets, Google Forms, and Typeform is crucial for the workflow.

## Setup and Usage
### Prerequisites
- Access to the Google Sheet with the questionnaire.
- Google Apps Script setup to run the provided script.
- "Formbuilder Plus" plugin from Jivrus for form creation.

### Installation
1. Clone the repository to your local machine.
2. Set up the questionnaire in Google Sheets and use "Formbuilder Plus" to import it into Google Forms.
3. Export the questions from Google Forms to Typeform.
4. Link Typeform to a Google Sheet for response collection.
5. Implement the Google Apps Script in the Google Sheet script editor.

### Running the Script
- The script triggers automatically upon form submission in Typeform, processing the data and generating the report.

## Contributing
We welcome contributions to enhance functionality or improve the script. Please see `CONTRIBUTING.md` for contribution guidelines.

## License
This project is licensed under the Apache 2.0 License - see `LICENSE.md` for details.

## Contact
- Joost Okkinga
- Eerste Helmersstraat 240, 1054ER, Amsterdam
- Email: joost.okkinga@gmail.com
- Phone: 06 51566504
