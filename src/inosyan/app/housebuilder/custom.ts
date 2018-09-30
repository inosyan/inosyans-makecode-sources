/**
 * inosyan's house builder
 */
//% weight=1 color=#967851 icon="\uf033"
namespace inosyan_app_housebuilder {
    import Size3 = inosyan_core_math.Size3

    function getDigitList(digit: number, paramNumber: number, value?: number): number[] {
        if (!value) value = 0;
        const ret: number[] = [];
        let denomi = 1;
        for (let i = 0; i < paramNumber; i++) {
            const modNum = denomi * (10 ** digit);
            const val = Math.floor((value % modNum) / denomi);
            ret.push(val);
            denomi = modNum;
        }
        return ret;
    }


    function getSize3(sizeWDH?: number): Size3 {
        const ret = new Size3(0, 0, 0);
        const digitList = getDigitList(2, 3, sizeWDH);
        ret.width = digitList[2];
        ret.depth = digitList[1];
        ret.height = digitList[0];
        return ret;
    }

	/**
	 * Build a house
	 * You can specify the direction to build by putting a torch in front of player.
	 * @param houseType Appearance of the house (1: Wooden Dark, 2: Wooden Light, 3: Stone, 4: Quartz, 5: Brick, 6: Sand, 7: DarkOak, 8: Oak)
	 * @param sizeWDH The number composed of 2 digit width, depth, height. (e.g. 070503 means width: 7, depth: 5, height: 3)
	 * @param option The number composed of 1 digit optoins.
	 * 1st digit: Inward open door (0: Outward, 1: Inward)
	 * 2nd digit: Without furniture (0: With, 1: Without)
	 * (e.g. 10 means Inward open door: false, Without furniture: true)
	 */
    //% block
    export function buildHouse(houseType?: number, sizeWDH?: number, option?: number): void {
        const param = new HouseCreatorParameter();
        if (houseType) param.houseType = houseType;
        const size = getSize3(sizeWDH);
        if (size.width > 0) param.floorWidth = size.width;
        if (size.depth > 0) param.floorDepth = size.depth;
        if (size.height > 0) param.wallHeight = size.height;
        const optionList = getDigitList(1, 2, option);
        const inwardOpenDoor = optionList[0];
        const withoutFurniture = optionList[1];
        param.inwardOpenDoor = inwardOpenDoor === 1;
        param.withoutFurniture = withoutFurniture === 1;
        new HouseCreator(param).build();
    }

	/**
	 * Clear all blocks in front of player.
	 * You can specify the direction to clear by putting a torch in front of player.
	 * @param sizeWDH The number composed of 2 digit width, depth, height. (e.g. 070503 means width: 7, depth: 5, height: 3)
	 * @param option The number composed of 1 digit optoins. [1st digit: Fill ground (0: Do not fill, 1: Fill)]. (e.g. 1 means Fill ground: true)
	 */
    //% block
    export function clearAll(sizeWDH?: number, option?: number): void {
        const param = new ClearAllParameter();
        const size = getSize3(sizeWDH);
        if (size.width > 0) param.clearWidth = size.width;
        if (size.depth > 0) param.clearDepth = size.depth;
        if (size.height > 0) param.clearHeight = size.height;
        const optionList = getDigitList(1, 2, option);
        const fillGround = optionList[0];
        param.fillGround = fillGround === 1;
        new ClearAll(param).clear();
    }

    export function createTitle(): void {
        new TitleCreator().build();
    }
}
