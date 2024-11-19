import { getUserUniqueKey } from '../../../support/emailUtils';
import { readExcelFile } from '../../../support/excelReader';
import config from '../../../fixtures/config.json';
import SurveyResponses from '../../../fixtures/Survey_Response.json'; // Import the survey questions

describe('Survey submit by users and verify the Reports generated', () => {
    it('Survey submit by users and verify the Reports generated', () => {
        const filePath = config.surveyUsers;
        const surveyData = SurveyResponses.questions;

        readExcelFile(filePath).then(jsonData => {
            // Step 1: Get the number of users
            const totalUsers = jsonData.length;
            cy.log(`Total number of users: ${totalUsers}`);

            // Step 2: Loop through all users in the Excel file
            jsonData.forEach((user) => {
                const email = user.Email; // Assuming 'Email' is the column for emails
                const EXPECTED_SUBJECT = `TestAutomationSupport wants to know your opinion`;

                // Fetch the User Unique Key using the email from the current user
                getUserUniqueKey(EXPECTED_SUBJECT, email, "Test").then((UserUniqueKey) => {
                    cy.log('UserUniqueKey for', email, 'is:', UserUniqueKey);

                    // Step 3: Pass the surveyData object values in order to saveSurveyResponseOrSubmit
                    cy.saveSurveyResponseOrSubmit(UserUniqueKey, [
                        surveyData.RatingScaleQuestion[0],
                        surveyData.YesOrNoQuestion[0],
                        surveyData.SmileyQuestion[0],
                        surveyData.RecommendationRating[0],
                        surveyData.NumericalQuestion[0],
                        surveyData.MultipleChoiceQuestion[0]
                     ]);
                 });
             });

            // Step 4: Prepare highest ratings to pass to the function
            const highestRatings = {
                RatingScale: surveyData.RatingScaleQuestion[1],    
                YesOrNo: surveyData.YesOrNoQuestion[1],            
                Smiley: surveyData.SmileyQuestion[1],              
                Recommendation: surveyData.RecommendationRating[1], 
                MultipleChoice: surveyData.MultipleChoiceQuestion[1], 
                Numerical: surveyData.NumericalQuestion[1]         
            };

            // Step 5: Call the new function to calculate and log scores
            cy.individualQuestionScoreByAllUsers(jsonData, surveyData, highestRatings);
        });
    });
});
