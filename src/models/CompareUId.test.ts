
import { CompareId } from './CompareId';

describe('CompareId User', () => {
    test('should method isError of class CompareId return FALSE if id are no equals ', () => {
        const compareId = new CompareId('1111', '2222', false);
        expect(compareId.isError()).toBeTruthy()
    });

    test('should method isError of class CompareId return FALSE if first id is empty ', () => {
        const compareId = new CompareId('', '2222', false);
        expect(compareId.isError).toBeTruthy()
    });

    test('should method isError of class CompareId return FALSE if second id is empty ', () => {
        const compareId = new CompareId('1111', '', false);
        expect(compareId.isError).toBeTruthy()
    });

    test('should method isError of class CompareId return TRUE if first is equals second id ', () => {
        const compareId = new CompareId('1111', '1111', false);
        expect(compareId.isError).toBeTruthy()
    });
});