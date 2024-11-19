// cypress/support/emailUtils.js
const TESTMAIL_API_URL = 'https://api.testmail.app/api/json';
const API_KEY = '4c5ce5d8-e4b4-44ae-a13e-d126f823dde9';
const NAMESPACE = '3fdhw';

export const fetchVerificationLink = (expectedSubject) => {
    return cy.request({
        method: 'GET',
        url: `${TESTMAIL_API_URL}?apikey=${API_KEY}&namespace=${NAMESPACE}&pretty=true&limit=100`,
    }).then((response) => {
        expect(response.status).to.eq(200);
        const emails = response.body.emails;

        expect(emails).to.exist;
        expect(Array.isArray(emails)).to.be.true;
        expect(emails.length).to.be.greaterThan(0);

        const email = emails.find((email) => email.subject === expectedSubject);
        expect(email).to.exist;

        const htmlContent = email.html;

        // Parse the HTML content to find the verification link
        const urlRegex = /https:\/\/u6559176\.ct\.sendgrid\.net\/ls\/click\?upn=[\w.-]+/;
        const match = htmlContent.match(urlRegex);

        expect(match).to.not.be.null;
        return match[0]; // Return the verification URL
    });
};

// export const getUserUniqueKey = (expectedSubject, emailAddress, environment) => {
//     return cy.request({
//         method: 'GET',
//         url: `${TESTMAIL_API_URL}?apikey=${API_KEY}&namespace=${NAMESPACE}&pretty=true&limit=100`,
//     }).then((response) => {
//         expect(response.status).to.eq(200);
//         const emails = response.body.emails;

//         expect(emails).to.exist;
//         expect(Array.isArray(emails)).to.be.true;
//         expect(emails.length).to.be.greaterThan(0);

//         // Find the email that matches both subject and envelope_to
//         const email = emails.find((email) => 
//             email.subject === expectedSubject && email.envelope_to === emailAddress
        
//         );
        
//         console.log('All emails:', email);

//         expect(email).to.exist;

//         const htmlContent = email.html;

//         // Determine the appropriate regex based on the environment
//         const urlRegex = environment === 'Test'
//             ? /https:\/\/testapp\.amelio\.co\/EndSurveys\/Opia-Survey\/en\/([a-f0-9]{32})/
//             : /https:\/\/stage\.amelio\.co\/EndSurveys\/Opia-Survey\/en\/([a-f0-9]{32})/;

//         // Match the URL and extract the UserUniqueKey
//         const match = htmlContent.match(urlRegex);

//         expect(match).to.not.be.null;
//         return match[1]; // Return only the UserUniqueKey
//     });
// };

export const getUserUniqueKey = (expectedSubject, emailAddress, environment) => {
    return cy.request({
        method: 'GET',
        url: `${TESTMAIL_API_URL}?apikey=${API_KEY}&namespace=${NAMESPACE}&pretty=true&limit=100`,
    }).then((response) => {
        expect(response.status).to.eq(200);
        const emails = response.body.emails;

        expect(emails).to.exist;
        expect(Array.isArray(emails)).to.be.true;
        expect(emails.length).to.be.greaterThan(0);

        // Filter emails by subject and envelope_to
        const filteredEmails = emails.filter((email) => 
            email.subject === expectedSubject && email.envelope_to === emailAddress
        );

        // Sort the filtered emails by date (latest first)
        const latestEmail = filteredEmails.sort((a, b) => b.date - a.date)[0];

        console.log('Latest email:', latestEmail);

        expect(latestEmail).to.exist;

        const htmlContent = latestEmail.html;

        // Determine the appropriate regex based on the environment
        const urlRegex = environment === 'Test'
            ? /https:\/\/testapp\.amelio\.co\/EndSurveys\/Opia-Survey\/en\/([a-f0-9]{32})/
            : /https:\/\/stage\.amelio\.co\/EndSurveys\/Opia-Survey\/en\/([a-f0-9]{32})/;

        // Match the URL and extract the UserUniqueKey
        const match = htmlContent.match(urlRegex);

        expect(match).to.not.be.null;
        return match[1]; // Return only the UserUniqueKey
    });
};



