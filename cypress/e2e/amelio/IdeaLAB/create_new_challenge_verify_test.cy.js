describe('Create New Challenge Tests', () => {
    it('should create a new challenge successfully', () => {
        cy.createChallenge().then((suggestionId) => {
            // You can use the suggestionId for further tests or assertions if needed
            cy.log('Challenge created with suggestionId: ', suggestionId);
        });
    });
});