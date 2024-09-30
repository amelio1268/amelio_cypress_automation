// cypress/support/emailUtils.js
const TESTMAIL_API_URL = 'https://api.testmail.app/api/json';
const API_KEY = '763b1a4b-8ddc-47f8-a4a3-9e6de7a03bb9';
const NAMESPACE = 'su3q1';

export const fetchVerificationLink = (expectedSubject) => {
    return cy.request({
        method: 'GET',
        url: `${TESTMAIL_API_URL}?apikey=${API_KEY}&namespace=${NAMESPACE}&pretty=true`,
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
