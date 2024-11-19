describe('Employee Management', () => {
    before(() => {
        cy.loginAndFetchTokens(); // Fetch tokens before running tests
    });

    it('should create a challenge for a specific employee', () => {
        const employeeName = 'John Doe'; // Replace with the actual employee name

        const uniqueName = `New Challenge for ${employeeName} ${Date.now()}`;
        
        const payload = {
            addVolunteer: true,
            companyId: "2c282df3-3c32-4a5e-9cdd-91ece434462f",
            startDate: new Date().toISOString(),
            titles: {
                en: uniqueName
            },
            subjectTitles: {
                en: "<p>Challenges</p>"
            },
            isPublish: true,
            timezone: "Asia/Calcutta"
        };

        cy.request({
            method: 'POST',
            url: 'https://stageapi.amelio.co/api/Challenge/saveUpdateChallenge/false',
            headers: getHeaders(employeeName), // Use the employee name to get headers
            body: payload
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.success).to.be.true;
        });
    });
});
