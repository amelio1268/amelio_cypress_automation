describe('Get Challenge List', () => {
    it('should get the number of challenges', () => {
        cy.getChallengeList().then(({challenges }) => {
            cy.log('Challenges:', JSON.stringify(challenges, null, 2));
            
        });
    });
});
