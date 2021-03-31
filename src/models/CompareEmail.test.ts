import { CompareEmails } from './CompareEmail';


describe('Compare Email class', () => {

    test('should method isError of class CompareEmail return FALSE if first email is equals to second email', () => {
        const comparEmail = new CompareEmails('a@aa.aa', 'a@aa.aa', false)
        const result = comparEmail.isError()
        expect(result).toBe(false)
    })

    test('should method isError of class CompareEmail return TRUE if first email is different as second email', () => {
        const comparEmail = new CompareEmails('b@aa.aa', 'a@aa.aa', false)
        const result = comparEmail.isError()
        expect(result).toBe(true)
    })

    test('should method isError of class CompareEmail return TRUE if first email is empty', () => {
        const comparEmail = new CompareEmails('', 'aa@aa.pl', false)
        const result = comparEmail.isError()
        expect(result).toBe(true)
    })

    test('should method isError of class CompareEmail return TRUE if second email is empty', () => {
        const comparEmail = new CompareEmails('aa@aa.pl', '', false)
        const result = comparEmail.isError()
        expect(result).toBe(true)
    })

    test('should method isError of class CompareEmail return TRUE if both email is empty', () => {
        const comparEmail = new CompareEmails('', '', false)
        const result = comparEmail.isError()
        expect(result).toBeTruthy()
    })
});



