export class GeneralUtil {

    /*
    https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
    */
    public static shuffleArray(array: Array<any>) {
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            let temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
    }

    public static shuffleNumber(num: number): number {
        let numArray: number[] = num.toString(10).split('').map(Number);
        GeneralUtil.shuffleArray(numArray);
        return parseInt(numArray.join(''), 10);
    }

    public static generateRandomNumber(min: number = 5000, max: number = 99999999999999): number {
        return Math.floor((Math.random() * max) + min);
    }

    public static genUUID(): string {
        let uuid: string = '', i: number, random: number;
        for (i = 0; i < 32; i++) {
            random = Math.random() * 16 | 0;
            if (i === 8 || i === 12 || i === 16 || i === 20) {
                uuid += '-';
            }
            uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random)).toString(16);
        }
        return uuid;
    }

    public static genUUIDShort(): string {
        return GeneralUtil.genUUID().substr(0, 8);
    }

}