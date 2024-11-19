// In support/commands.js
const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');
//import pdfjsLib from 'pdfjs-dist/es5/build/pdf';


// Function to get headers for API requests
const getHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjUwMDQ3Nzg1QjgyM0JBOTVFMjhEMkQ2RTBGNDRDQTFFRUM4QjgxODVSUzI1NiIsInR5cCI6ImF0K2p3dCIsIng1dCI6IlVBUjNoYmdqdXBYaWpTMXVEMFRLSHV5TGdZVSJ9.eyJuYmYiOjE3MzE1NzIyNDYsImV4cCI6MTczMjg2ODI0NiwiaXNzIjoiaHR0cHM6Ly90ZXN0bG9naW4uYW1lbGlvLmNvIiwiYXVkIjoiYXBpIiwiY2xpZW50X2lkIjoicmVhY3QiLCJzdWIiOiI2NmZiYThlNjc4MzVlZTFiYjFmODEyZTEiLCJhdXRoX3RpbWUiOjE3Mjk2NjEyMDAsImlkcCI6ImxvY2FsIiwicm9sZSI6IlVzZXIiLCJ1c2VyX2lkIjoiNmM5MTY4N2ItN2JkMC00ZDIzLTg3NDQtMjdjMzBiODU4MWMyIiwiY29tcGFueV9pZCI6IjQ3NTFlZDcxLWI1N2MtNDlhZi05NzRiLTZjNTk3ZWNlOTA2NSIsInByb3ZpZGVyIjoiIiwic2lkIjoiRUM0MzMzRUY1OUMzQTVDOUJBQUM2QUUxMDk4Mjc5NjIiLCJpYXQiOjE3MzE1NzIyNDYsInNjb3BlIjpbIm9wZW5pZCIsInByb2ZpbGUiLCJhcGkiLCJyb2xlcyJdLCJhbXIiOlsicHdkIl19.VetMTo_z21vwnwPXZs67IJ2Ey6BgRRDR-qWVog3V8G-4dgBmcRneq1-tlxgVbz-YOk93xruwRAnxFIkV_UN3f8BFR97wphvB54XCXkpnsW3_M_660I2jI81byegov1IkVm4FTKXRL5IoSIQAvoZapqn0laBUzvveQ_V5vXwPDxq_8ANyjzDZDnnGjfJVkBxZQDMLfbEgbMAvrP5sGRWq_gk3cO3zZGZsjv6qsL_O7cMYwcX_tXnUW450gFDn362nl4lYt5CCVrvqihpZR1hrbclq6lz4pRKnSuCFQSThr1OeMhYCsDCCeK-TIwv9D7d1Mm8q3n78AUFfaMV2HqmNIA',
    'X-CSRFToken': 'YourCSRFToken' // Update with your actual CSRF token if needed
});


// Login module
Cypress.Commands.add('test_env_login', () => {
    cy.visit('https://stage.amelio.co/');
    cy.wait(18000);
    cy.get('input[name="Username"]').type(Cypress.env('username'));
    cy.get('input[name="Password"]').type(Cypress.env('password'));
    cy.get('button[type="submit"]').click();
    cy.wait(16000);
  }); 
  
  


//Create a challenge
Cypress.Commands.add('createChallenge', (options = {}) => {

    const titles = { en: `Challenge for ${options.dept.departmentName}` }; // Custom title for each department

    // Create the challenge payload
    const payload = {
        suggestionId: '', // Optional, can be empty for new challenges
        suggestionFromUserId: '8933e965-0f61-48a6-a757-1f66d98d5ad0', // Replace with appropriate user ID
        defaultAudienceType: '1',
        titles,
        subjectTitles: { en: "<p>Quality less</p>" },
        suggestionIdeaFor: '1',
        suggestionGroupModel: [], // Populate if necessary
        departmentId: options.dept.departmentID, // Ensure department ID is correct
        isAdmin: false,
        status: false,
        labelIds: [],
        labelModels: null,
        suggestionGroupModel: [
            {
              "filterGroupId": options.dept.departmentID,
              "groupType": "0",
              
            }
          ],
        //suggestionToDepartmentList: ["628543ec-c5df-4a3b-969d-7a317c6fa74a"],
        suggestionToTeams: [{ attributeType: 0, attributeId: ["628543ec-c5df-4a3b-969d-7a317c6fa74a"] }],
        startDate: new Date().toISOString(),
        isEndDate: false,
        addVolunteer: true,
        ideasCount: 0,
        timezone: "Asia/Calcutta",
        isPublish: true,
        launchNow: true,
        createdDate: new Date().toISOString(),
        companyId: "2c282df3-3c32-4a5e-9cdd-91ece434462f",
        sendMail: false
    };

    return cy.request({
        method: 'POST',
        url: 'https://stageapi.amelio.co/api/Challenge/saveUpdateChallenge/false',
        headers: getHeaders(),
        body: payload
    }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.success).to.be.true;

        return response.body.methodResult.suggestionId; // Return the suggestionId
    });
});
Cypress.Commands.add('fetchDepartmentsAndCreateExcel', () => {
    const filePath = path.join(Cypress.config('fixturesFolder'), 'C__Users_QA-lead_Downloads_amelio_cypress_automation_cypress_downloads_departments.xlsx');

    // Use Cypress's task to handle file operations
    cy.task('deleteFile', filePath).then(() => {
        // Fetch departments from API
        return cy.request({
            method: 'GET',
            url: 'https://stageapi.amelio.co/api/UserAdmin/GetCompanyDepartments',
            headers: getHeaders(), // Ensure you have a function to get your headers
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.success).to.be.true;

            const departments = response.body.methodResults.map(department => ({
                id: department.departmentId,
                name: department.titles.en,
            }));

            // Create a new workbook and add department data
            const newWorkbook = XLSX.utils.book_new();
            const newWorksheet = XLSX.utils.json_to_sheet(departments);
            XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, 'Departments');
            XLSX.writeFile(newWorkbook, filePath);

            cy.log(`Created new Excel file with departments at ${filePath}`);
        });
    });
});



// In your Cypress support file (e.g., support/index.js), add the following task
Cypress.Commands.add('deleteFile', (filePath) => {
    return new Promise((resolve, reject) => {
        fs.unlink(filePath, (err) => {
            if (err && err.code !== 'ENOENT') {
                reject(err); // Reject on error, unless the file doesn't exist
            }
            resolve(); // Resolve if file was deleted or didn't exist
        });
    });
});

// Get all challenges
Cypress.Commands.add('getChallengeList', (pageNo = 1, pageSize = 100) => {
    const url = 'https://stageapi.amelio.co/api/Challenge/GetChallengeList';

    const today = new Date();
    const past30Days = new Date(today);
    past30Days.setDate(today.getDate() - 30);

    const requestBody = {
        SortBy: "CreatedDate",
        SortOrder: "Descending",
        filterFromDate: past30Days.toISOString(),
        filterToDate: today.toISOString(),
        pageNo: pageNo,
        pageSize: pageSize,
        searchByTitle: ""
    };

    return cy.request({
        method: 'POST',
        url: url,
        headers: getHeaders(),
        body: requestBody
    }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.success).to.be.true;

        // Return an object containing both the challenges and total records
        return {
            totalRecords: response.body.totalRecords,
            challenges: response.body.methodResults || [] // Return the challenges or an empty array
        };
    });
});


// Delete a challenge by ID
Cypress.Commands.add('deleteChallenge', (suggestionId) => {
    const deleteUrl = 'https://stageapi.amelio.co/api/Challenge/DeleteChallenge';
    const payload = {
        suggestionId: suggestionId,
        deleteAll: false
    };

    return cy.request({
        method: 'POST',
        url: deleteUrl,
        headers: getHeaders(),
        body: payload,
        failOnStatusCode: false // Prevent Cypress from failing the test on 404
    }).then((response) => {
        if (response.status === 200) {
            cy.log(`Successfully deleted challenge with ID: ${suggestionId}`);
        } else {
            cy.log(`Failed to delete challenge with ID: ${suggestionId}: ${response.status} - ${response.statusText}`);
        }
    });
});


// Cypress.Commands.add('fetchSurveyDataAllQuestionIdsTestFinal', (userUniqueKey) => {
//     const apiUrl = 'https://testapi.amelio.co/api/Survey/GetSurveyAndQuestionByUserUniqueKey/';
    
//     const headers = getHeaders();
//     const payload = {
//         userUniqueKey: userUniqueKey
//     };

//     return cy.request({
//         method: 'POST',
//         url: apiUrl,
//         headers: headers,
//         body: payload
//     }).then((response) => {
//         expect(response.status).to.eq(200);
//         expect(response.body).to.have.property('success', true);

//         // Extract question IDs from the main questionList
//         const questionIds = response.body.methodResult.questionList
//             .map(question => question.questionId)
//             .filter(id => id !== null); // Exclude any null IDs

//         // Extract questionMultipleAnswer from surveyTemporalResponseList, only keep non-empty answers
//         const questionMultipleAnswers = response.body.methodResult.surveyTemporalResponseList
//             .map(response => ({
//                 questionId: response.questionId,
//                 questionMultipleAnswer: response.questionMultipleAnswer || [] // Ensure it's an array
//             }))
//             .filter(item => item.questionMultipleAnswer.length > 0); // Keep only non-empty answers

//         // Log the question IDs
//         cy.log('Question IDs:', JSON.stringify(questionIds, null, 2));
//         cy.log('Non-empty Question Multiple Answers:', JSON.stringify(questionMultipleAnswers, null, 2));

//         // If you also want to extract IDs from nested children questions:
//         const childQuestionIds = response.body.methodResult.questionList.flatMap(question =>
//             question.children.map(child => child.questionId).filter(id => id !== null)
//         );

//         const sentSurveyId = response.body.methodResult.sentSurveyId;

//         cy.log("Sent Survey Id : " + sentSurveyId);

//         // Log the child question IDs
//         cy.log('Child Question IDs:', JSON.stringify(childQuestionIds, null, 2));

//         // Combine main and child question IDs if needed
//         const allQuestionIds = [...questionIds, sentSurveyId];

//         cy.log("This is what we are looking for:  " + allQuestionIds)

//         return cy.wrap({ allQuestionIds, questionMultipleAnswers});
//     });
// });



// Cypress.Commands.add('saveSurveyResponseOrSubmit', (userUniqueKey, questionAnswers) => {
//     return cy.fetchSurveyDataAllQuestionIdsTestFinal(userUniqueKey).then(({ allQuestionIds, questionMultipleAnswers }) => {
//         const sentSurveyId = allQuestionIds[allQuestionIds.length - 1]; // Assuming the last ID is the sentSurveyId

//         // Construct the survey response list
//         const surveyResponseList = allQuestionIds.slice(0, -1).map((questionId, index) => {
//             // Find the matching entry in questionMultipleAnswers by questionId
//             const matchingAnswer = questionMultipleAnswers.find(answer => answer.questionId === questionId);
            
//             return {
//                 importance: 0,
//                 sentSurveyId: sentSurveyId,
//                 questionId: questionId,
//                 questionMultipleAnswer: matchingAnswer ? matchingAnswer.questionMultipleAnswer : [], // Use the matched answer if found
//                 questionAnswer: String(questionAnswers[index] || "0"),
//                 otherMultipleOption: ""
//             };
            
            
//         });

//         // Build the final payload
//         const payload = {
//             surveyResponseList: surveyResponseList,
//             userUniqueKey: userUniqueKey,
//             hasEndSurveyFeature: true
//         };

//         // Log the constructed payload before sending it
//         cy.log('Payload for Survey Submission:', JSON.stringify(payload, null, 2));

//         const apiUrl = 'https://testapi.amelio.co/api/Survey/SaveSurveyResponse';
//         const headers = getHeaders();

//         return cy.request({
//             method: 'POST',
//             url: apiUrl,
//             headers: headers,
//             body: payload
//         });
        
//         });
//     });

// Cypress.Commands.add('fetchSurveyDataAllQuestionIdsTestFinal', (userUniqueKey) => {
//     const apiUrl = 'https://testapi.amelio.co/api/Survey/GetSurveyAndQuestionByUserUniqueKey/';

//     const headers = getHeaders();
//     const payload = {
//         userUniqueKey: userUniqueKey
//     };

//     return cy.request({
//         method: 'POST',
//         url: apiUrl,
//         headers: headers,
//         body: payload
//     }).then((response) => {
//         expect(response.status).to.eq(200);
//         expect(response.body).to.have.property('success', true);

//         // Extract question IDs from the main questionList
//         const questionIds = response.body.methodResult.questionList
//             .map(question => question.questionId)
//             .filter(id => id !== null); // Exclude any null IDs

//         // Extract questionMultipleAnswer from surveyTemporalResponseList, only keep non-empty answers
//         const questionMultipleAnswers = response.body.methodResult.surveyTemporalResponseList
//             .map(response => ({
//                 questionId: response.questionId,
//                 questionMultipleAnswer: response.questionMultipleAnswer || [] // Ensure it's an array
//             }))
//             .filter(item => item.questionMultipleAnswer.length > 0); // Keep only non-empty answers

//         // Log the question IDs
//         cy.log('Question IDs:', JSON.stringify(questionIds, null, 2));
//         cy.log('Non-empty Question Multiple Answers:', JSON.stringify(questionMultipleAnswers, null, 2));

//         // If you also want to extract IDs from nested children questions:
//         const childQuestionIds = response.body.methodResult.questionList.flatMap(question =>
//             question.children.map(child => child.questionId).filter(id => id !== null)
//         );

//         const sentSurveyId = response.body.methodResult.sentSurveyId;

//         cy.log("Sent Survey Id : " + sentSurveyId);

//         // Log the child question IDs
//         cy.log('Child Question IDs:', JSON.stringify(childQuestionIds, null, 2));

//         // Combine main and child question IDs if needed
//         const allQuestionIds = [...questionIds, sentSurveyId];

//         cy.log("This is what we are looking for:  " + allQuestionIds)

//         return cy.wrap({ allQuestionIds, questionMultipleAnswers });
//     });
// });

Cypress.Commands.add('fetchSurveyDataAllQuestionIdsTestFinal', (userUniqueKey) => {
    const apiUrl = 'https://testapi.amelio.co/api/Survey/GetSurveyAndQuestionByUserUniqueKey/';
    const headers = getHeaders();
    const payload = { userUniqueKey: userUniqueKey };

    return cy.request({
        method: 'POST',
        url: apiUrl,
        headers: headers,
        body: payload
    }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('success', true);

        // Extract question IDs and titles from the main questionList
        const questionDataWithTitles = response.body.methodResult.questionList
            .map(question => ({
                questionId: question.questionId,
                title: question.titles?.en || "No title"
            }))
            .filter(item => item.questionId !== null); // Exclude any null IDs    

        // Extract questionMultipleAnswer from surveyTemporalResponseList, only keep non-empty answers
        const questionMultipleAnswers = response.body.methodResult.surveyTemporalResponseList
            .map(response => ({
                questionId: response.questionId,
                questionMultipleAnswer: response.questionMultipleAnswer || [] // Ensure it's an array
            }))
            .filter(item => item.questionMultipleAnswer.length > 0); // Keep only non-empty answers

        // Log the question IDs and titles
        cy.log('Question Data (ID and Title):', JSON.stringify(questionDataWithTitles, null, 2));
        cy.log('Non-empty Question Multiple Answers:', JSON.stringify(questionMultipleAnswers, null, 2));

        // Extract IDs from nested children questions
        const childQuestionIds = response.body.methodResult.questionList.flatMap(question =>
            question.children.map(child => child.questionId).filter(id => id !== null)
        );

        const sentSurveyId = response.body.methodResult.sentSurveyId;
        cy.log("Sent Survey Id : " + sentSurveyId);

        // Log the child question IDs
        cy.log('Child Question IDs:', JSON.stringify(childQuestionIds, null, 2));

        // Combine main question data and child question IDs if needed
        const allQuestionIds = [...questionDataWithTitles.map(q => q.questionId), sentSurveyId];

        cy.log("All the question Ids in a Servey:  " + allQuestionIds);

        return cy.wrap({ allQuestionIds, questionMultipleAnswers, questionDataWithTitles });
    });
});


Cypress.Commands.add('saveSurveyResponseOrSubmit', (userUniqueKey, questionAnswers) => {
    return cy.fetchSurveyDataAllQuestionIdsTestFinal(userUniqueKey).then(({ allQuestionIds, questionMultipleAnswers, questionDataWithTitles }) => {
        const sentSurveyId = allQuestionIds[allQuestionIds.length - 1]; // Assuming the last ID is the sentSurveyId

        // Construct the survey response list
        const surveyResponseList = allQuestionIds.slice(0, -1).map((questionId, index) => {
            // Find the matching entry in questionMultipleAnswers by questionId
            const matchingAnswer = questionMultipleAnswers.find(answer => answer.questionId === questionId);
            const questionAnswer = questionAnswers[index] || "";

            return {
                importance: 0,
                sentSurveyId: sentSurveyId,
                questionId: questionId,
                questionMultipleAnswer: matchingAnswer ? matchingAnswer.questionMultipleAnswer : [], // Use the matched answer if found
                questionAnswer: questionAnswer, // Directly assign the answer from questionAnswers
                otherMultipleOption: ""
            };
        });

        // Build the final payload
        const payload = {
            surveyResponseList: surveyResponseList,
            userUniqueKey: userUniqueKey,
            hasEndSurveyFeature: true
        };

        // Log the constructed payload before sending it
        cy.log('Payload for Survey Submission:', JSON.stringify(payload, null, 2));

        const apiUrl = 'https://testapi.amelio.co/api/Survey/SaveSurveyResponse';
        const headers = getHeaders();

        return cy.request({
            method: 'POST',
            url: apiUrl,
            headers: headers,
            body: payload
        });
    });
});

// Cypress.Commands.add('individualQuestionScoreByAllUsers', (allUsers, surveyResponses, highestRatings, questionTypeToDisplay) => {
//     const totalUsers = allUsers.length;

//     // Initialize scores for each question type
//     const results = {
//         RatingScale: { totalScore: 0, count: 0 },
//         YesOrNo: { totalScore: 0, count: 0, countOneRatings: 0 }, // Add countOneRatings for YesOrNo
//         Smiley: { totalScore: 0, count: 0 },
//         Recommendation: { totalScore: 0, count: 0 },
//         MultipleChoice: { totalScore: 0, count: 0 },
//         Numerical: { totalScore: 0, count: 0 },
//         Checkboxes: { totalSelections: 0, count: 0 },
//         PlainText: { totalResponses: 0, count: 0 },
//     };

//     // Step 1: Loop through all users in the allUsers data
//     allUsers.forEach((user) => {
//         // Calculate for RatingScale
//         const ratingScaleRatings = surveyResponses.RatingScaleQuestion;
//         if (ratingScaleRatings.length > 0) {
//             const userRating = ratingScaleRatings[0]; // Assuming we take the first rating for this example
//             results.RatingScale.totalScore += userRating;
//             results.RatingScale.count++;
//         }

//         // Special case for YesOrNoQuestion
//         const yesOrNoRatings = surveyResponses.YesOrNoQuestion;
//         if (yesOrNoRatings.length > 0) {
//             const userRating = yesOrNoRatings[0];
//             results.YesOrNo.totalScore += userRating;
//             results.YesOrNo.count++;

//             // Check if the rating is 1
//             if (userRating === 1) {
//                 results.YesOrNo.countOneRatings++;
//             }
//         }

//         // Calculate for Smiley
//         const smileyRatings = surveyResponses.SmileyQuestion;
//         if (smileyRatings.length > 0) {
//             const userRating = smileyRatings[0];
//             results.Smiley.totalScore += userRating;
//             results.Smiley.count++;
//         }

//         // Calculate for Recommendation
//         const recommendationRatings = surveyResponses.RecommendationRating;
//         if (recommendationRatings.length > 0) {
//             const userRating = recommendationRatings[0];
//             results.Recommendation.totalScore += userRating;
//             results.Recommendation.count++;
//         }

//         // Calculate for Numerical
//         const numericalRatings = surveyResponses.NumericalQuestion;
//         if (numericalRatings.length > 0) {
//             const userRating = numericalRatings[0];
//             results.Numerical.totalScore += userRating;
//             results.Numerical.count++;
//         }

//         // Calculate for Checkboxes
//         const checkboxRatings = surveyResponses.CheckboxesQuestion;
//         if (checkboxRatings.length > 0) {
//             results.Checkboxes.totalSelections += checkboxRatings.length; // Assuming checkboxRatings is an array of selections
//             results.Checkboxes.count++;
//         }

//         // Calculate for PlainText
//         const plainTextResponses = surveyResponses.PlainTextQuestion;
//         if (plainTextResponses.length > 0) {
//             results.PlainText.totalResponses += plainTextResponses.length; // Assuming plainTextResponses is an array of responses
//             results.PlainText.count++;
//         }
//     });

//     // Prepare a structured log output for all question types
//     cy.log('Survey Results:');
//     cy.log('------------------------------------------------------------------------------------------------------------');

//     // Step 2: Calculate and log results for each question type
//     const questionTypesToLog = questionTypeToDisplay === 'all' ? Object.keys(results) : [questionTypeToDisplay];

//     questionTypesToLog.forEach((questionType) => {
//         const { totalScore, count, countOneRatings, totalResponses, totalSelections } = results[questionType];

//         if (questionType === 'YesOrNo') {
//             const percentageOneRatings = (countOneRatings / totalUsers) * 100;
//             cy.log(` ${questionType.padEnd(18)} -->  Percentage of users gave 1 rating: ${percentageOneRatings.toFixed(2)}% | Count of users who gave 1 rating: ${countOneRatings} | Total Users: ${totalUsers}`);
//         } else if (questionType === 'PlainText') {
//             cy.log(` ${questionType.padEnd(18)} -->  Total Responses: ${totalResponses} | Total Users: ${totalUsers}`);
//         } else if (questionType === 'Checkboxes') {
//             cy.log(` ${questionType.padEnd(18)} -->  Total Selections: ${totalSelections} | Count of responses: ${count}`);
//         } else {
//             const OMIN = count ? (totalScore / count) : 0;
//             const OMAX = highestRatings[questionType]; 

//             const performance = count ? ((OMIN - 1) / (OMAX - 1)) * 100 : 0;
//             const performanceScore = performance / 10;

//             cy.log(` ${questionType.padEnd(18)} -->  Global Score: ${OMIN.toFixed(2).padStart(10)} | OMIN: ${OMIN.toFixed(2).padStart(5)} | OMAX: ${OMAX.toFixed(2).padStart(5)} | Performance: ${performance.toFixed(2).padStart(8)} | Performance Score: ${performanceScore.toFixed(2).padStart(16)} |`);
//         }
//     });

//     cy.log('------------------------------------------------------------------------------------------------------------');
// });



// Cypress.Commands.add('individualQuestionScoreByAllUsers', (allUsers, surveyResponses, highestRatings, questionTypeToDisplay, userUniqueKey, SurveyQuestionsCategories) => {
//     const totalUsers = allUsers.length;

//     // Initialize scores for each question type
//     const results = {
//         RatingScale: { totalScore: 0, count: 0 },
//         YesOrNo: { totalScore: 0, count: 0, countOneRatings: 0 },
//         Smiley: { totalScore: 0, count: 0 },
//         MultipleChoice: { totalScore: 0, count: 0 },
//         Numerical: { totalScore: 0, count: 0 },
//         Checkboxes: { totalSelections: 0, count: 0 },
//         PlainText: { totalResponses: 0, count: 0 },
//     };

//     // Step 1: Loop through all users in the allUsers data
//     allUsers.forEach(() => {
//         // Use the same rating for all users
//         const ratingScaleRating = surveyResponses.RatingScale; // Assuming this is a single value
//         if (ratingScaleRating !== undefined) {
//             results.RatingScale.totalScore += ratingScaleRating;
//             results.RatingScale.count++;
//         }

//         const yesOrNoRating = surveyResponses.YesOrNo; // Assuming this is a single value
//         if (yesOrNoRating !== undefined) {
//             results.YesOrNo.totalScore += yesOrNoRating;
//             results.YesOrNo.count++;

//             // Check if the rating is 1
//             if (yesOrNoRating === 1) {
//                 results.YesOrNo.countOneRatings++;
//             }
//         }

//         const smileyRating = surveyResponses.Smiley; // Assuming this is a single value
//         if (smileyRating !== undefined) {
//             results.Smiley.totalScore += smileyRating;
//             results.Smiley.count++;
//         }

//         const numericalRating = surveyResponses.Numerical; // Assuming this is a single value
//         if (numericalRating !== undefined) {
//             results.Numerical.totalScore += numericalRating;
//             results.Numerical.count++;
//         }

//         const checkboxRatings = surveyResponses.Checkboxes; // Assuming this is an array
//         if (checkboxRatings && checkboxRatings.length > 0) {
//             results.Checkboxes.totalSelections += checkboxRatings.length;
//             results.Checkboxes.count++;
//         }

//         const multipleChoiceRating = surveyResponses.MultipleChoice; // Assuming this is a single value (1 to 4)
//         if (multipleChoiceRating !== undefined) {
//             results.MultipleChoice.totalScore += multipleChoiceRating;
//             results.MultipleChoice.count++;
//         }

//         const plainTextResponses = surveyResponses.PlainText; // Assuming this is an array
//         if (plainTextResponses && plainTextResponses.length > 0) {
//             results.PlainText.totalResponses += plainTextResponses.length;
//             results.PlainText.count++;
//         }
//     });

//     // Prepare a structured log output for all question types
//     cy.log('Survey Results:');
//     cy.log('------------------------------------------------------------------------------------------------------------');

//     // Step 2: Calculate and log results for each question type
//     const questionTypesToLog = questionTypeToDisplay === 'all' ? Object.keys(results) : [questionTypeToDisplay];

//     questionTypesToLog.forEach((questionType) => {
//         const { totalScore, count, countOneRatings, totalResponses, totalSelections } = results[questionType];
//         let OMIN = count ? (totalScore / count) : 0; // Calculate OMIN
//         let OMAX = highestRatings[questionType]; // Get the maximum possible rating

//         if (questionType === 'YesOrNo') {
//             const percentageOneRatings = (countOneRatings / totalUsers) * 100;
//             cy.log(` ${questionType.padEnd(18)} -->  Percentage of users gave rating: ${percentageOneRatings.toFixed(2)}% | Count of users who gave rating: ${countOneRatings} | Total Users: ${totalUsers}`);
//         } else if (questionType === 'PlainText') {
//             cy.log(` ${questionType.padEnd(18)} -->  Total Responses: ${totalResponses} | Total Users: ${totalUsers}`);
//         } else if (questionType === 'Checkboxes') {
//             cy.log(` ${questionType.padEnd(18)} -->  Total Selections: ${totalSelections} | Count of responses: ${count}`);
//         } else {
//             const performance = count ? ((OMIN - 1) / (OMAX - 1)) * 100 : 0;
//             const performanceScore = performance / 10;

//             cy.log(` ${questionType.padEnd(18)} -->  Global Score: ${OMIN.toFixed(2).padStart(10)} | OMIN: ${OMIN.toFixed(2).padStart(5)} | OMAX: ${OMAX.toFixed(2).padStart(5)} | Performance: ${performance.toFixed(2).padStart(8)} | Performance Score: ${performanceScore.toFixed(2).padStart(16)} |`);
//         }
//     });

//     cy.log('------------------------------------------------------------------------------------------------------------');
//     cy.fetchSurveyDataAllQuestionIdsTestFinal(userUniqueKey).then(({ allQuestionIds, questionMultipleAnswers, questionDataWithTitles }) => {
//         cy.log("All Question Titles:");
//         questionDataWithTitles.forEach((q, index) => {
//             cy.log(`${index + 1}. ${q.title}`); // Print titles with numbering
//         });
//     });
//   // Log categories and subcategories from SurveyQuestionsCategories
// cy.log('Individual Questions with Category and Sub-Category by each user:');
// cy.log('------------------------------------------------------------------------------------------------------------');

// // Assuming SurveyQuestionsCategories is the structure you've shown
// Object.entries(SurveyQuestionsCategories).forEach(([logCategory, data]) => {
//     // Log the question type
//     cy.log(`Question Type: ${logCategory}`);
    
//     // Add two blank lines for spacing after each question type
//     cy.log('------------------------------------------------------------------------------------------------------------');


//     // Check if data has the expected structure
//     if (data && Array.isArray(data.categories)) {
//         data.categories.forEach(category => {
//             const { category: categoryName, subcategories } = category;
//             cy.log(`  - Category: ${categoryName}`);
            
//             // Check if subcategories is an array before iterating
//             if (Array.isArray(subcategories)) {
//                 subcategories.forEach(subcategory => {
//                     cy.log(`    - Subcategory: ${subcategory}`);
//                 });
//             } else {
//                 cy.log(`    - Subcategories not available or not an array: ${JSON.stringify(subcategories)}`);
//             }

//             // Add a single blank line for spacing after each category
//             cy.log('------------------------------------------------------------------------------------------------------------');
//         });
//     } else {
//         cy.log(`  - Categories data not available or not an array: ${JSON.stringify(data)}`);
//     }

//     cy.log('------------------------------------------------------------------------------------------------------------');
//     cy.log('------------------------------------------------------------------------------------------------------------');
// });
// });

Cypress.Commands.add('individualQuestionScoreByAllUsers', (allUsers, surveyResponses, highestRatings, questionTypeToDisplay, userUniqueKey, SurveyQuestionsCategories) => {
    const totalUsers = allUsers.length;

    // Initialize scores for each question type
    const results = {
        RatingScale: { totalScore: 0, count: 0 },
        YesOrNo: { totalScore: 0, count: 0, countOneRatings: 0 },
        Smiley: { totalScore: 0, count: 0 },
        MultipleChoice: { totalScore: 0, count: 0 },
        Numerical: { totalScore: 0, count: 0 },
        Checkboxes: { totalSelections: 0, count: 0 },
        PlainText: { totalResponses: 0, count: 0 },
    };

    // Step 1: Loop through all users in the allUsers data
    allUsers.forEach(() => {
        const ratingScaleRating = surveyResponses.RatingScale;
        if (ratingScaleRating !== undefined) {
            results.RatingScale.totalScore += ratingScaleRating;
            results.RatingScale.count++;
        }

        const yesOrNoRating = surveyResponses.YesOrNo;
        if (yesOrNoRating !== undefined) {
            results.YesOrNo.totalScore += yesOrNoRating;
            results.YesOrNo.count++;
            if (yesOrNoRating === 1) {
                results.YesOrNo.countOneRatings++;
            }
        }

        const smileyRating = surveyResponses.Smiley;
        if (smileyRating !== undefined) {
            results.Smiley.totalScore += smileyRating;
            results.Smiley.count++;
        }

        const numericalRating = surveyResponses.Numerical;
        if (numericalRating !== undefined) {
            results.Numerical.totalScore += numericalRating;
            results.Numerical.count++;
        }

        const checkboxRatings = surveyResponses.Checkboxes;
        if (checkboxRatings && checkboxRatings.length > 0) {
            results.Checkboxes.totalSelections += checkboxRatings.length;
            results.Checkboxes.count++;
        }

        const multipleChoiceRating = surveyResponses.MultipleChoice;
        if (multipleChoiceRating !== undefined) {
            results.MultipleChoice.totalScore += multipleChoiceRating;
            results.MultipleChoice.count++;
        }

        const plainTextResponses = surveyResponses.PlainText;
        if (plainTextResponses && plainTextResponses.length > 0) {
            results.PlainText.totalResponses += plainTextResponses.length;
            results.PlainText.count++;
        }
    });

    cy.log('Survey Results:');
    cy.log('------------------------------------------------------------------------------------------------------------');

    const questionTypesToLog = questionTypeToDisplay === 'all' ? Object.keys(results) : [questionTypeToDisplay];
    questionTypesToLog.forEach((questionType) => {
        if (!results[questionType]) {
            cy.log(`No data available for question type: ${questionType}`);
            return; // Skip to the next question type if data is missing
        }
        const { totalScore, count, countOneRatings, totalResponses, totalSelections } = results[questionType];
        let OMIN = count ? (totalScore / count) : 0;
        let OMAX = highestRatings[questionType];

        if (questionType === 'YesOrNo') {
            const percentageOneRatings = (countOneRatings / totalUsers) * 100;
            cy.log(` ${questionType.padEnd(18)} -->  Percentage of users gave rating: ${percentageOneRatings.toFixed(2)}% | Count of users who gave rating: ${countOneRatings} | Total Users: ${totalUsers}`);
        } else if (questionType === 'PlainText') {
            cy.log(` ${questionType.padEnd(18)} -->  Total Responses: ${totalResponses} | Total Users: ${totalUsers}`);
        } else if (questionType === 'Checkboxes') {
            cy.log(` ${questionType.padEnd(18)} -->  Total Selections: ${totalSelections} | Count of responses: ${count}`);
        }else if (questionType === 'RatingScaleQuestion') {
            cy.log(` ${questionType.padEnd(18)} -->  Total Selections: ${totalSelections} | Count of responses: ${count}`);
        }else {
            const performance = count ? ((OMIN - 1) / (OMAX - 1)) * 100 : 0;
            const performanceScore = performance / 10;
            cy.log(` ${questionType.padEnd(18)} -->  Global Score: ${OMIN.toFixed(2).padStart(10)} | OMIN: ${OMIN.toFixed(5)} | OMAX: ${OMAX.toFixed(5)} | Performance: ${performance.toFixed(2).padStart(8)} | Performance Score: ${performanceScore.toFixed(2).padStart(16)} |`);
        }
    });

    cy.log('------------------------------------------------------------------------------------------------------------');

    cy.fetchSurveyDataAllQuestionIdsTestFinal(userUniqueKey).then(({ allQuestionIds, questionMultipleAnswers, questionDataWithTitles }) => {
        cy.log("All Question Titles:");
        questionDataWithTitles.forEach((q, index) => {
            cy.log(`${index + 1}. ${q.title}`);
        });
    });

    // Step 3: Log categories and subcategories from SurveyQuestionsCategories in a table format with serial numbers
    cy.log('Individual Questions with Category and Sub-Category by each user:');
    cy.log('------------------------------------------------------------------------------------------------------------');
    cy.log(`| ${'S.No'.padEnd(5)} | ${'Question Type'.padEnd(18)} | ${'Category'.padEnd(30)} | ${'Subcategory'.padEnd(30)} |`);
    cy.log('------------------------------------------------------------------------------------------------------------');

    let serialNumber = 1;
    Object.entries(SurveyQuestionsCategories).forEach(([questionType, data]) => {
        if (data && Array.isArray(data.categories)) {
            data.categories.forEach(category => {
                const { category: categoryName, subcategories } = category;
                subcategories.forEach(subcategory => {
                    cy.log(`| ${serialNumber.toString().padEnd(5)} | ${questionType.padEnd(18)} | ${categoryName.padEnd(30)} | ${subcategory.padEnd(30)} |`);
                    serialNumber++;
                });
            });
        } else {
            cy.log(`| ${serialNumber.toString().padEnd(5)} | ${questionType.padEnd(18)} | No Categories Data Available`);
            serialNumber++;
        }
        cy.log('------------------------------------------------------------------------------------------------------------');
    });

    cy.log('------------------------------------------------------------------------------------------------------------');
});

Cypress.Commands.add('extractPdfText', (pdfUrl) => {
    return cy.window().then(async (win) => {
      // Fetch PDF file from the given URL (can be local or from an external URL)
      const response = await fetch(pdfUrl);
      const arrayBuffer = await response.arrayBuffer();
  
      // Load PDF document using pdf.js
      const pdfDocument = await pdfjsLib.getDocument(arrayBuffer).promise;
      const totalPages = pdfDocument.numPages;
      const pagesText = [];
  
      // Extract text from each page
      for (let pageNumber = 1; pageNumber <= totalPages; pageNumber++) {
        const page = await pdfDocument.getPage(pageNumber);
        const content = await page.getTextContent();
        const text = content.items.map(item => item.str).join(' '); // Concatenate text
  
        pagesText.push({
          pageNumber,
          text
        });
      }
  
      return pagesText; // Return the structured text data
    });
  });