import { toStringMessageServerErrorCompare, toStringUserFrom } from './user';
import { CompareElementsEnum } from './CompareElementsEnum';


describe('user Shared functions toStringUserFrom', () => {
    test('should toStringUserFrom return "user social media"', () => {
        const userFrom = toStringUserFrom(true);
        expect(userFrom).toBe(" user social media ")
    });

    test('should toStringUserFrom return " user manula "', () => {
        const userFrom = toStringUserFrom(false);
        expect(userFrom).toBe(" user manula ")
    });

});

describe('toStringMessageServerErrorCompare functions', () => {
    test('should toStringMessageServerErrorCompare for email return FIEREBASE ERROR: email from body is no equals with Firebase/MongoDB user marek@gmail.com <-> romek@gmail.com facebook', () => {
        const messageErrorServer = toStringMessageServerErrorCompare(CompareElementsEnum.EMAIL, 'marek@gmail.com', 'romek@gmail.com', ' facebook');
        expect(messageErrorServer).toBe("FIEREBASE ERROR: email from body is no equals with Firebase/MongoDB user marek@gmail.com <-> romek@gmail.com facebook")
    });

    test('should toStringMessageServerErrorCompare for id return FIEREBASE ERROR: id from body is no equals with Firebase/MongoDB user 1111-1111 <-> 2222-2222 googl ', () => {
        const messageErrorServer = toStringMessageServerErrorCompare(CompareElementsEnum.ID, '1111-1111', '2222-2222', ' google');
        expect(messageErrorServer).toBe("FIEREBASE ERROR: id from body is no equals with Firebase/MongoDB user 1111-1111 <-> 2222-2222 google")
    });


});
