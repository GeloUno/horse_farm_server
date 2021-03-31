import { CompareElementsEnum } from "./CompareElementsEnum";

export const toStringUserFrom = (isUserFromSoclialMedia: boolean): string => {
    return (isUserFromSoclialMedia) ? (" user social media ") : (" user manula ")
}

export const toStringMessageServerErrorCompare = (compareElements: CompareElementsEnum, firstCompare: string, secondCompare: string, userFrom: string): string => {

    return `FIEREBASE ERROR: ${compareElements} from body is no equals with Firebase/MongoDB user ${firstCompare} <-> ${secondCompare}` + userFrom;
}