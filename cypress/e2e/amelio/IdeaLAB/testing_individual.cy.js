import { readExcelFile } from '../../../support/excelReader';
import config from '../../../fixtures/config.json';

describe('Login Form Tests', () => {
    const filePath = config.excelFilePath;
    let testCases = ["1"];
        

    before(() => {
        const targetDepartment = 'Department 1';
        const targetRole = 'Employee';

        return readExcelFile(filePath).then(jsonData => {
            // Step 1: Filter by department and role
            const filteredData = jsonData.filter(user => 
                user.Department === targetDepartment && user.Role === targetRole
            );

            // Step 2: Process the filtered data and populate testCases
            testCases = filteredData.map(user => ({
                username: user.Email,
                password: user.Password,

            }));
        });
    });

    // Create tests dynamically based on the testCases array
    testCases.forEach(({ username, password, expected }) => {
        it(`should handle login for ${username}`, () => {
            
        });
    });
});
