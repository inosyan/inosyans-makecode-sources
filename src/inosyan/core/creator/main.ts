namespace inosyan_core_creator {
    import Vector3 = inosyan_core_math.Vector3
    import BuildUtil = inosyan_core_utils.BuildUtil
    import Size3 = inosyan_core_math.Size3
    import Converter = inosyan_core_utils.Converter
    import BlocksProxy = inosyan_core_utils.BlocksProxy
    import Size2 = inosyan_core_math.Size2

    /**
     * Base class used to make a creator class. / 建築用クラスを作るための基底クラスです。
     */
    export class CreatorBase {
        protected position: Vector3;
        protected children: CreatorBase[];
        protected rotDir: FourDirection;

        /**
         * @param position Start position of creation / 建築の開始位置
         * @param children Child elements / 子要素
         */
        constructor(position: Vector3, children: CreatorBase[]) {
            this.position = position;
            this.children = children;
            this.rotDir = FourDirection.Forward;
        }

        /**
         * Return the string indicated this instance. / インスタンスの内容を表す文字列を返します。
         */
        public toString(): string {
            return `CreatorBase: {position: ${this.position}}`;
        }

        /**
         * Add child element. / 子要素を追加します。
         * @param element Child element / 子要素
         */
        public addChild(element: CreatorBase): void {
            this.children.push(element);
        }

        /**
         * Start creation. / 建築を開始します。
         * @param parentPosition Parent element's position / 親要素の位置
         * @param direction Direction to create / 建築する向き
         */
        public build(parentPosition: Vector3, direction: CompassDirection): void {
            this.rotDir = Converter.convertFourDirectionFromCompass(direction);
            const delta = this.position.clone();
            delta.rotate(this.rotDir);
            this.position = parentPosition.clone().add(delta);
            this.buildContents();
            this.children.forEach(c => {
                c.build(this.position, direction);
            })
        }

        protected buildContents(): void {
        }

        protected buildFill(blockId: number, size: Size3, startPos: Vector3, fillOperation: FillOperation = FillOperation.Replace): void {
            size = size.clone().rotate(this.rotDir);
            startPos = this.getVector(startPos.x, startPos.y, startPos.z);
            startPos = this.adjustVectorBySize(startPos, size);
            BuildUtil.fill(blockId, size, startPos, fillOperation);
        }

        protected buildClone(begin: Vector3, size: Size3, destination: Vector3,
            mask: CloneMask = CloneMask.Replace, mode: CloneMode = CloneMode.Normal): void {
            size = size.clone().rotate(this.rotDir);
            begin = this.getVector(begin.x, begin.y, begin.z);
            begin = this.adjustVectorBySize(begin, size);
            destination = this.getVector(destination.x, destination.y, destination.z);
            destination = this.adjustVectorBySize(destination, size);
            BuildUtil.clone(begin, size, destination, mask, mode);
        }

        protected buildPlace(blockId: number, pos: Vector3): void {
            pos = this.getVector(pos.x, pos.y, pos.z);
            BlocksProxy.place(blockId, pos);
        }

        protected buildReplace(newblock: number, oldblock: number, size: Size3, startPos: Vector3): void {
            size = size.clone().rotate(this.rotDir);
            startPos = this.getVector(startPos.x, startPos.y, startPos.z);
            startPos = this.adjustVectorBySize(startPos, size);
            BuildUtil.replace(newblock, oldblock, size, startPos);
        }

        protected buildDrawPlane(startPos: Vector3, direction: SixDirection, size: Size2,
            patternBlock: number[], patternData: number[][], ignoreBlocks: number[]): void {
            startPos = this.getVector(startPos.x, startPos.y, startPos.z);
            startPos = this.adjustVectorBySize2(startPos, size, direction);
            patternData = this.adjustPatternData(patternData, direction);
            direction = this.adjustDrawPlaneDirection(direction);
            size = this.adjustDrawPlaneSize(size, direction);
            BuildUtil.drawPlane(startPos, direction, size, patternBlock, patternData, ignoreBlocks);
        }

        protected getVector(x: number, y: number, z: number): Vector3 {
            return this.position.clone().add(new Vector3(x, y, z).rotate(this.rotDir));
        }

        private adjustVectorBySize(pos: Vector3, size: Size3): Vector3 {
            switch (this.rotDir) {
                case FourDirection.Forward: return pos;
                case FourDirection.Back: return pos.addValue(-size.width + 1, 0, -size.depth + 1);
                case FourDirection.Right: return pos.addValue(-size.width + 1, 0, 0);
                case FourDirection.Left: return pos.addValue(0, 0, -size.depth + 1);
            }
            return pos;
        }

        private adjustVectorBySize2(pos: Vector3, size: Size2, direction: SixDirection): Vector3 {
            if (direction !== SixDirection.Up && direction != SixDirection.Down) return pos;
            let size3: Size3;
            switch (direction) {
                case SixDirection.Up:
                    switch (this.rotDir) {
                        case FourDirection.Forward:
                            return pos;
                        case FourDirection.Right:
                        case FourDirection.Left:
                            size3 = new Size3(size.height, 1, size.width);
                            break;
                        case FourDirection.Back:
                        default:
                            size3 = new Size3(size.width, 1, size.height);
                            break;
                    }
                    break;
                case SixDirection.Down:
                default:
                    switch (this.rotDir) {
                        case FourDirection.Forward:
                            return pos;
                        case FourDirection.Right:
                            return pos.addValue(0, 0, -size.width + 1);
                        case FourDirection.Left:
                            return pos.addValue(size.height - 1, 0, 0);
                        case FourDirection.Back:
                        default:
                            size3 = new Size3(-size.width + 2, 1, size.height);
                            break;
                    }
                    break;
            }
            return this.adjustVectorBySize(pos, size3);
        }

        private adjustDrawPlaneSize(size: Size2, direction: SixDirection): Size2 {
            if (direction !== SixDirection.Up && direction != SixDirection.Down) return size;
            if (this.rotDir === FourDirection.Forward || this.rotDir === FourDirection.Back) return size;
            return new Size2(size.height, size.width);
        }

        private adjustPatternData(patternData: number[][], direction: SixDirection): number[][] {
            if (this.rotDir === FourDirection.Forward) return patternData;
            const cntY = patternData.length;
            const cntX = cntY > 0 ? patternData[0].length : 0;
            switch (direction) {
                case SixDirection.Up:
                    return this.adjustPatternDataUp(cntX, cntY, patternData);
                case SixDirection.Down:
                    return this.adjustPatternDataDown(cntX, cntY, patternData);
            }
            return patternData;
        }

        private adjustPatternDataUp(cntX: number, cntY: number, patternData: number[][]): number[][] {
            const ret: number[][] = [];
            switch (this.rotDir) {
                case FourDirection.Back: this.adjustPatternDataMirrorXMirrorY(cntX, cntY, patternData, ret); break;
                case FourDirection.Left: this.adjustPatternDataSwapXYMirrorX(cntX, cntY, patternData, ret); break;
                case FourDirection.Right: this.adjustPatternDataSwapXYMirrorY(cntX, cntY, patternData, ret); break;
            }
            return ret;
        }

        private adjustPatternDataDown(cntX: number, cntY: number, patternData: number[][]): number[][] {
            const ret: number[][] = [];
            switch (this.rotDir) {
                case FourDirection.Back: this.adjustPatternDataMirrorXMirrorY(cntX, cntY, patternData, ret); break;
                case FourDirection.Left: this.adjustPatternDataSwapXYMirrorY(cntX, cntY, patternData, ret); break;
                case FourDirection.Right: this.adjustPatternDataSwapXYMirrorX(cntX, cntY, patternData, ret); break;
            }
            return ret;
        }

        private adjustPatternDataMirrorXMirrorY(cntX: number, cntY: number, patternData: number[][], ret: number[][]) {
            for (let i = cntY - 1; i >= 0; i--) {
                const line: number[] = [];
                for (let j = cntX - 1; j >= 0; j--) {
                    line.push(patternData[i][j]);
                }
                ret.push(line);
            }
        }

        private adjustPatternDataSwapXYMirrorX(cntX: number, cntY: number, patternData: number[][], ret: number[][]) {
            for (let j = cntX - 1; j >= 0; j--) {
                const line: number[] = [];
                for (let i = 0; i < cntY; i++) {
                    line.push(patternData[i][j]);
                }
                ret.push(line);
            }
        }

        private adjustPatternDataSwapXYMirrorY(cntX: number, cntY: number, patternData: number[][], ret: number[][]) {
            for (let j = 0; j < cntX; j++) {
                const line: number[] = [];
                for (let i = cntY - 1; i >= 0; i--) {
                    line.push(patternData[i][j]);
                }
                ret.push(line);
            }
        }

        private adjustDrawPlaneDirection(direction: SixDirection): SixDirection {
            switch (direction) {
                case SixDirection.Up:
                case SixDirection.Down:
                    return direction;
            }
            switch (this.rotDir) {
                case FourDirection.Forward:
                    return direction;
                case FourDirection.Back:
                    switch (direction) {
                        case SixDirection.Back:
                            return SixDirection.Forward;
                        case SixDirection.Forward:
                            return SixDirection.Back;
                        case SixDirection.Left:
                            return SixDirection.Right;
                        case SixDirection.Right:
                            return SixDirection.Left;
                    }
                case FourDirection.Left:
                    switch (direction) {
                        case SixDirection.Back:
                            return SixDirection.Left;
                        case SixDirection.Forward:
                            return SixDirection.Right;
                        case SixDirection.Left:
                            return SixDirection.Forward;
                        case SixDirection.Right:
                            return SixDirection.Back;
                    }
                case FourDirection.Right:
                    switch (direction) {
                        case SixDirection.Back:
                            return SixDirection.Right;
                        case SixDirection.Forward:
                            return SixDirection.Left;
                        case SixDirection.Left:
                            return SixDirection.Back;
                        case SixDirection.Right:
                            return SixDirection.Forward;
                    }
            }
            return direction;
        }
    }
}
