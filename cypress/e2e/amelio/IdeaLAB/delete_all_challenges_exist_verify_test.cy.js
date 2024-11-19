describe('Get and Delete Challenges', () => {
    it('should get and delete all challenges', () => {
        // Get challenges
        cy.getChallengeList().then(({ challenges }) => {
            // Check if there are any challenges to delete
            if (challenges.length === 0) {
                cy.log('No challenges to delete.');
                return; // Exit if there are no challenges
            }

            // Delete each challenge and collect the promises
            const deletePromises = challenges.map((challenge) => {
                const suggestionId = challenge.suggestionId; // Extract suggestionId
                return cy.deleteChallenge(suggestionId).then(() => suggestionId); // Return the suggestionId after deletion
            });

            // Wait for all delete promises to resolve
            return Cypress.Promise.all(deletePromises).then((deletedIds) => {
                // Log all deleted suggestion IDs
                cy.log('Challenge deleted successfully');
            });
        });
    });
});

