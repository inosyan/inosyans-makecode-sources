namespace inosyan_blockcleaner {
    import CreatorBase = inosyan_core_creator.CreatorBase
    import Vector3 = inosyan_core_math.Vector3
    import PlayerProxy = inosyan_core_utils.PlayerProxy
    import Size3 = inosyan_core_math.Size3

    /**
     * Parameter for ClearAll class. / ClearAllクラスで使用するパラメーター
     */
    export class ClearAllParameter {
        public clearWidth: number;
        public clearDepth: number;
        public clearHeight: number;
        public fillGround: FillGround;
        public includeTorch: boolean;

        constructor(clearWidth: number = 9, clearDepth: number = 9, clearHeight: number = 9, fillGround: FillGround = FillGround.None, includeTorch: boolean = false) {
            this.clearWidth = clearWidth;
            this.clearDepth = clearDepth;
            this.clearHeight = clearHeight;
            this.fillGround = fillGround;
            this.includeTorch = includeTorch;
        }

        public validate(): void {
            if (this.clearWidth < 1) this.clearWidth = 1;
            if (this.clearDepth < 1) this.clearDepth = 1;
            if (this.clearHeight < 1) this.clearHeight = 1;
        }
    }

    /**
     * Clear all blocks in front of player. / プレイヤーの前のブロックをすべて消すます。
     */
    export class ClearAll {
        private root: CreatorBase;

        constructor(parameter: ClearAllParameter) {
            parameter.validate();
            this.root = new CreatorBase(new Vector3(0, 0, - Math.ceil(parameter.clearDepth / 2) - 1), [
                new ClearTask(parameter)
            ]);
        }

        public clear(): void {
            const playerDir = PlayerProxy.getDirection();
            const playerPos = PlayerProxy.position();
            this.root.build(playerPos, playerDir);
        }
    }

    class ClearTask extends CreatorBase {
        private parameter: ClearAllParameter;

        constructor(parameter: ClearAllParameter) {
            super(new Vector3(), []);
            this.parameter = parameter;
        }

        public buildContents(): void {
            const para = this.parameter;
            const minX = - Math.floor(para.clearWidth / 2);
            const minZ = - Math.floor(para.clearDepth / 2) + (para.includeTorch ? 1 : 0);
            super.buildFill(Block.Air, new Size3(para.clearWidth, para.clearHeight, para.clearDepth),
                new Vector3(minX, 0, minZ));
            if (para.fillGround === FillGround.None) return;
            const globalY = this.getVector(0, 0, 0).toPosition().toWorld().getValue(Axis.Y);
            const underGroundH = Math.min(globalY, para.clearHeight);
            if (para.fillGround === FillGround.WithAir) {
                super.buildFill(Block.Air, new Size3(para.clearWidth, para.clearHeight, para.clearDepth),
                new Vector3(minX, -underGroundH, minZ));
                return;
            }
            let orgP = new Vector3(0, -underGroundH, Math.ceil(para.clearDepth / 2) + 1);
            const size = new Size3(1, underGroundH, 1);
            const startP = new Vector3(minX, -underGroundH, minZ);
            let isFirst = true;
            while (size.width < para.clearWidth || size.depth < para.clearDepth) {
                const added = new Size3(0, 0, 0);
                for (let z = 0; z < 2; z++) {
                    added.width = 0;
                    const deltaD = z * size.depth;
                    const s = size.clone();
                    if (deltaD + s.depth > para.clearDepth) s.depth = para.clearDepth - deltaD;
                    for (let x = 0; x < 2; x++) {
                        const deltaW = x * size.width;
                        if (deltaW + s.width > para.clearWidth) s.width = para.clearWidth - deltaW;
                        const destP = new Vector3(startP.x + added.width, startP.y, startP.z + added.depth);
                        added.width += s.width;
                        if (!isFirst && z === 0 && x === 0) continue;
                        super.buildClone(orgP, s, destP);
                    }
                    added.depth += s.depth;
                }
                size.width *= 2;
                size.depth *= 2;
                orgP = startP;
                isFirst = false;
            }
        }
    }
}

/**
 * Clear / クリアー
 */
//% weight=1 color=#967851 icon="\uf033"
namespace inosyan_blockcleaner {
    import Size3 = inosyan_core_math.Size3
    import PlayerProxy = inosyan_core_utils.PlayerProxy

    function divideNumbers(digit: number, paramCount: number, combinedNumber?: number): number[] {
        if (!combinedNumber) combinedNumber = 0;
        const ret: number[] = [];
        let denomi = 1;
        for (let i = 0; i < paramCount; i++) {
            const modNum = denomi * (10 ** digit);
            const val = Math.floor((combinedNumber % modNum) / denomi);
            ret.push(val);
            denomi = modNum;
        }
        return ret;
    }

    function combineNumbers(dividedNumbers: number[], digit: number): number {
        let ret = 0;
        dividedNumbers.forEach((v, idx) => {
            ret += v * (10 ** digit);
        })
        return ret;
    }

    function getSize3(sizeWDH?: number): Size3 {
        const ret = new Size3(0, 0, 0);
        const digitList = divideNumbers(2, 3, sizeWDH);
        ret.width = digitList[2];
        ret.depth = digitList[1];
        ret.height = digitList[0];
        return ret;
    }


    /**
     * he number composed of 2 digit width, depth, height. / 幅,奥行き,高さを2桁ずつ組み合わせた数字
     * @param width Width value / 幅の値
     * @param depth Depth value / 奥行きの値
     * @param height Height value / 高さの値
     */
    //%blockId="inosyanBlockCleanerSizeWDH"
    //%block="Clear size Width: %width Depth: %depth Height: %height"
    export function getSizeWDH(width: number, depth: number, height: number): number {
        return combineNumbers([height, depth, width], 2);
    }

    export enum FillGround {
        None = 0,
        WithPlayersPlatform,
        WithAir,
    }

    /**
     * The number composed of 1 digit optoins. / 1桁ずつのオプションを組み合わせた数字 
     * @param fillGround 1st digit: Fill ground / 1桁目: 地面を埋めるかどうか 
     */
    //%blockId="inosyanBlockCleanerOption"
    //%block="Clear option Fill Ground: %fillGround Include torch: %includeTorch"
    export function getOption(fillGround: FillGround, includeTorch: boolean): number {
        return combineNumbers([(includeTorch ? 1 : 0), fillGround], 1)
    }

	/**
	 * Clear all blocks in front of player. / プレイヤーの前のブロックをすべて消します。
	 * You can specify the direction to clear by putting a torch in front of player. / たいまつをプレイヤーの前に置いてクリアする方向を指定できます。
	 * @param sizeWDH The number composed of 2 digit width, depth, height. / 幅,奥行き,高さを2桁ずつ組み合わせた数字 (e.g. 070503 means width: 7, depth: 5, height: 3)
	 * @param option The number composed of 1 digit optoins. / 1桁ずつのオプションを組み合わせた数字 
     * 1st digit: Fill ground / 1桁目: 地面を埋めるかどうか (0: Do not fill / 埋めない, 1: Fill with player's platform / プレイヤーの足元のブロックで埋める, 2: Fill with Air / 空気で埋める). 
     * 2nd digit: Include torch to the range / 2桁目: トーチを範囲に含めるかどうか (0: Do not include / 含めない, 1: Include / 含める). 
     * (e.g. 10 means include torch and dont'fill ground / 例えば 10 はトーチを範囲に含め、地面を埋めないことを表します)
	 */
    //% block="clear %sizeWDH=inosyanBlockCleanerSizeWDH %option=inosyanBlockCleanerOption"
    export function clearBlocks(sizeWDH?: number, option?: number): void {
        const param = new ClearAllParameter();
        const size = getSize3(sizeWDH);
        if (size.width > 0) param.clearWidth = size.width;
        if (size.depth > 0) param.clearDepth = size.depth;
        if (size.height > 0) param.clearHeight = size.height;
        const optionList = divideNumbers(1, 2, option);
        param.fillGround = optionList[0];
        param.includeTorch = optionList[1] === 1;
        new ClearAll(param).clear();
    }

    /**
     * Place a block under the player. It is useful when you want to place a torch in the air. プレイヤーの足元に一つブロックを置きます。空中にたいまつを置きたいときなどに便利です。
     */
    //%block
    export function placeBlockUnderFoot(): void {
        const pos = PlayerProxy.position().addValue(0, -1, 0);
        blocks.place(Block.Dirt, pos.toPosition());
    }
}
