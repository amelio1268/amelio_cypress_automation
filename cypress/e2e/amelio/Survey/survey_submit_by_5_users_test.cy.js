import { getUserUniqueKey } from '../../../support/emailUtils';
import { readExcelFile } from '../../../support/excelReader';
import config from '../../../fixtures/config.json';
import SurveyResponses from '../../../fixtures/Survey_Response.json'; // Import the survey responses
import SurveyQuestionsCategories from '../../../fixtures/survey_all_categories_questions.json'; // Import the survey Questions in Categories, SubCategories

describe('Survey submit by users and verify the Reports generated', () => {
    it('Survey submit by users and verify the Reports generated', () => {
        // RatingScale
        //YesOrNo

        const questionType = "RatingScale";
        const filePath = config.surveyUsers;
        const surveyResponses = SurveyResponses.questions;
        const SurveyQuestionsCategoriesList = SurveyQuestionsCategories.questions;
        // Step 5: Prepare positive responses for each question type
        const positiveResponses = {
            RatingScale: surveyResponses.RatingScaleQuestion.positiveResponses,
            YesOrNo: surveyResponses.YesOrNoQuestion.positiveResponses,
            Smiley: surveyResponses.SmileyQuestion.positiveResponses,
            Numerical: surveyResponses.NumericalQuestion.positiveResponses,
            MultipleChoice: surveyResponses.MultipleChoiceQuestion.positiveResponses,
            Checkboxes: surveyResponses.CheckboxesQuestion.positiveResponses,
            PlainText: surveyResponses.PlainTextQuestion.positiveResponses
        };

        readExcelFile(filePath).then(allUsers => {
            // Step 1: Get the number of users
            const totalUsers = allUsers.length;
            cy.log(`Total number of users: ${totalUsers}`);

        //     // Step 2: Loop through all users in the Excel file
        //     allUsers.forEach((user) => {
        //         const email = user.Email; // Assuming 'Email' is the column for emails
        //         const EXPECTED_SUBJECT = `TestAutomationSupport wants to know your opinion`;

        //         // Fetch the User Unique Key using the email from the current user
        //         getUserUniqueKey(EXPECTED_SUBJECT, email, "Test").then((UserUniqueKey) => {
        //             cy.log('UserUniqueKey for', email, 'is:', UserUniqueKey);

        //             // Step 3: Pass the surveyResponses object values in order to saveSurveyResponseOrSubmit
        //             cy.saveSurveyResponseOrSubmit(UserUniqueKey, [
        //                 surveyResponses.RatingScaleQuestion[0],
        //                 surveyResponses.YesOrNoQuestion[0],
        //                 surveyResponses.SmileyQuestion[0],
        //                 surveyResponses.RecommendationRating[0],
        //                 surveyResponses.NumericalQuestion[0]
        //              ]);
        //          });
        //      });

            // Step 4: Prepare highest ratings to pass to the function
            const highestRatings = {
                RatingScale: surveyResponses.RatingScaleQuestion.highestRating,
                YesOrNo: surveyResponses.YesOrNoQuestion.highestRating,
                Smiley: surveyResponses.SmileyQuestion.highestRating,
                Numerical: surveyResponses.NumericalQuestion.highestRating,
                MultipleChoice: surveyResponses.MultipleChoiceQuestion.highestRating,
                Checkboxes: surveyResponses.CheckboxesQuestion.highestRating,
                PlainText: surveyResponses.PlainTextQuestion.highestRating
            };

            // Step 5: Call the internal calculation function to calculate and log scores
            cy.individualQuestionScoreByAllUsers(allUsers, positiveResponses, highestRatings, questionType,"f7fa56c3a7ca447fb6676d1ad0a8b0ed", SurveyQuestionsCategoriesList);
        });
     });
});
