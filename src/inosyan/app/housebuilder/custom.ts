namespace inosyan_housebuilder {
    import CreatorBase = inosyan_core_creator.CreatorBase
    import Vector3 = inosyan_core_math.Vector3
    import PlayerProxy = inosyan_core_utils.PlayerProxy
    import Size3 = inosyan_core_math.Size3
    import Size2 = inosyan_core_math.Size2
    import AgentProxy = inosyan_core_utils.AgentProxy
    import BlocksProxy = inosyan_core_utils.BlocksProxy
    import BuildUtil = inosyan_core_utils.BuildUtil

    /**
     * Parameter for ClearAll class. / ClearAllクラスで使用するパラメーター
     */
    export class ClearAllParameter {
        public clearWidth: number;
        public clearDepth: number;
        public clearHeight: number;
        public fillGround: boolean;

        constructor(clearWidth: number = 9, clearDepth: number = 9, clearHeight: number = 9, fillGround: boolean = true) {
            this.clearWidth = clearWidth;
            this.clearDepth = clearDepth;
            this.clearHeight = clearHeight;
            this.fillGround = fillGround;
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
            const minZ = - Math.floor(para.clearDepth / 2);
            super.buildFill(Block.Air, new Size3(para.clearWidth, para.clearHeight, para.clearDepth),
                new Vector3(minX, 0, minZ));
            if (!para.fillGround) return;
            const globalY = this.getVector(0, 0, 0).toPosition().toWorld().getValue(Axis.Y);
            const underGroundH = Math.min(globalY, para.clearHeight);
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

    /**
     * Parameter for HouseCreator class. / HouseCreatorクラスで使用するパラメーター
     */
    export class HouseCreatorParameter {
        public floorWidth: number;
        public floorDepth: number;
        public wallHeight: number;
        public inwardOpenDoor: boolean;
        public houseType: HouseType;
        public withoutFurniture: boolean;

        constructor(floorWidth: number = 7, floorDepth: number = 7, wallHeight: number = 3, inwardOpenDoor: boolean = false,
            houseType: HouseType = HouseType.WoodenDark, withoutFurniture: boolean = false) {
            this.floorWidth = floorWidth;
            this.floorDepth = floorDepth;
            this.wallHeight = wallHeight;
            this.inwardOpenDoor = inwardOpenDoor;
            this.houseType = houseType;
            this.withoutFurniture = withoutFurniture;
        }

        public validate(): void {
            if (this.floorWidth < 5) this.floorWidth = 5;
            if (this.floorDepth < 5) this.floorDepth = 5;
            if (this.wallHeight < 3) this.wallHeight = 3;
            if (this.houseType <= HouseType.Min) this.houseType = HouseType.Min + 1;
            if (this.houseType >= HouseType.Max) this.houseType = HouseType.Max - 1;
        }
    }

    /**
     * Type of house / 家のタイプ
     */
    export enum HouseType {
        Min,
        WoodenDark,
        WoodenLight,
        Stone,
        Quartz,
        Brick,
        Sand,
        DarkOak,
        Oak,
        Max,
    }

    /**
     * Build a house / 家を建てる
     */
    export class HouseCreator {
        private root: CreatorBase;

        constructor(parameter: HouseCreatorParameter) {
            parameter.validate();
            this.root = new CreatorBase(new Vector3(0, 0, - Math.ceil(parameter.floorDepth / 2) - 2), [
                new Prepare(parameter),
                new FloorWallRoof(parameter),
                new DoorHoleAndWindow(parameter),
                new StepRoof(parameter),
                new BuildDoor(parameter),
            ]);
        }

        public build(): void {
            const playerDir = PlayerProxy.getDirection();
            const playerPos = PlayerProxy.position();
            this.root.build(playerPos, playerDir);
        }
    }

    interface IBlockIdData {
        wall: number;
        roof: number;
        roofStair: number;
        door: number;
        pressurePlate: number;
        button: number;
        floorPattern: number[];
    }

    class HouseCreatorBase extends CreatorBase {
        protected parameter: HouseCreatorParameter;
        protected floorMinX: number;
        protected floorMaxX: number;
        protected floorMinZ: number;
        protected floorMaxZ: number;
        protected blockIds: IBlockIdData;

        constructor(parameter: HouseCreatorParameter) {
            super(new Vector3(), []);
            this.parameter = parameter;
            this.floorMinX = - Math.floor(parameter.floorWidth / 2);
            this.floorMaxX = this.floorMinX + parameter.floorWidth - 1;
            this.floorMinZ = - Math.floor(parameter.floorDepth / 2);
            this.floorMaxZ = this.floorMinZ + parameter.floorDepth - 1;
            this.blockIds = this.initBlockIds();
        }

        private initBlockIds(): IBlockIdData {
            switch (this.parameter.houseType) {
                case HouseType.Min:
                case HouseType.WoodenDark:
                    return {
                        wall: Block.PlanksSpruce,
                        roof: Block.PlanksDarkOak,
                        roofStair: Block.DarkOakWoodStairs,
                        door: Item.DarkOakDoor,
                        pressurePlate: Block.SprucePressurePlate,
                        button: Block.DarkOakButton,
                        floorPattern: [Block.PlanksSpruce, Block.PlanksDarkOak],
                    };
                case HouseType.WoodenLight:
                    return {
                        wall: Block.PlanksOak,
                        roof: Block.PlanksSpruce,
                        roofStair: Block.SpruceWoodStairs,
                        door: Item.SpruceDoor,
                        pressurePlate: Block.WoodenPressurePlate,
                        button: Block.SpruceButton,
                        floorPattern: [Block.PlanksOak, Block.PlanksSpruce],
                    };
                case HouseType.Stone:
                    return {
                        wall: Block.StoneBricks,
                        roof: Block.StoneBricks,
                        roofStair: Block.StoneBrickStairs,
                        door: Item.SpruceDoor,
                        pressurePlate: Block.StonePressurePlate,
                        button: Block.SpruceButton,
                        floorPattern: [Block.StoneBricks, Block.ChiseledStoneBricks],
                    }
                case HouseType.Quartz:
                    return {
                        wall: Block.BlockOfQuartz,
                        roof: Block.BlockOfQuartz,
                        roofStair: Block.QuartzStairs,
                        door: Item.IronDoor,
                        pressurePlate: Block.WeightedPressurePlateHeavy,
                        button: Block.StoneButton,
                        floorPattern: [Block.ChiseledQuartzBlock, Block.PillarQuartzBlock],
                    }
                case HouseType.Brick:
                    return {
                        wall: Block.Bricks,
                        roof: Block.RedSandstone,
                        roofStair: Block.RedSandstoneStairs,
                        door: Item.JungleDoor,
                        pressurePlate: Block.JunglePressurePlate,
                        button: Block.JungleButton,
                        floorPattern: [Block.PlanksBirch, Block.PlanksJungle],
                    }
                case HouseType.Sand:
                    return {
                        wall: Block.SmoothSandstone,
                        roof: Block.Sandstone,
                        roofStair: Block.SandstoneStairs,
                        door: Item.AcaciaDoor,
                        pressurePlate: Block.AcaciaPressurePlate,
                        button: Block.AcaciaButton,
                        floorPattern: [Block.Sandstone, Block.RedSandstone],
                    }
                case HouseType.DarkOak:
                    return {
                        wall: Block.LogDarkOak,
                        roof: Block.PlanksDarkOak,
                        roofStair: Block.DarkOakWoodStairs,
                        door: Item.DarkOakDoor,
                        pressurePlate: Block.DarkOakPressurePlate,
                        button: Block.DarkOakButton,
                        floorPattern: [Block.LogOak, Block.LogDarkOak],
                    }
                case HouseType.Oak:
                case HouseType.Max:
                    return {
                        wall: Block.LogOak,
                        roof: Block.PlanksSpruce,
                        roofStair: Block.SpruceWoodStairs,
                        door: Item.OakDoor,
                        pressurePlate: Block.WoodenPressurePlate,
                        button: Block.WoodenButton,
                        floorPattern: [Block.StrippedBirchWood, Block.LogOak],
                    }
            }
        }


        protected clearBlocks(): void {
            this.buildFill(Block.Air, new Size3(this.parameter.floorWidth + 4, this.getTop(), this.parameter.floorDepth + 2),
                new Vector3(this.floorMinX - 2, 0, this.floorMinZ - 1));
        }

        protected createSnowTent(): void {
            this.snowTentCommon(Block.Dirt);
        }

        protected destroySnowTent(): void {
            this.snowTentCommon(Block.Air);
        }

        private getTop(): number {
            return this.parameter.wallHeight + Math.ceil(this.parameter.floorWidth / 2) + 1;
        }
        private snowTentCommon(blockId: number): void {
            this.buildFill(blockId, new Size3(this.parameter.floorWidth + 4, 1, this.parameter.floorDepth + 2),
                new Vector3(this.floorMinX - 2, this.getTop(), this.floorMinZ - 1));
        }
    }

    enum SlotIds {
        RoofStair = 1,
        Door,
        Button,
        ItemFrame,
        Bed,
        Chest,
    }

    class BlockSlot {
        public bid: number;
        public slot: number;
        public number: number;
        constructor(bid: number, slot: number, number: number) {
            this.bid = bid;
            this.slot = slot;
            this.number = number;
        }
    }

    class Prepare extends HouseCreatorBase {
        public buildContents(): void {
            const para = this.parameter;
            // Clear blocks
            this.clearBlocks();
            // Create tent (avoiding snow)
            this.createSnowTent();
            // Agent reset
            AgentProxy.teleportAndTurn(this.getVector(0, 0, 0), this.rotDir);
            // Waste all
            this.buildClone(new Vector3(-2, -2, -2), new Size3(5, 2, 5), new Vector3(-2, 2, -2), CloneMask.Replace, CloneMode.Move);
            agent.dropAll(SixDirection.Down);
            agent.dropAll(SixDirection.Down); // for waiting
            this.buildClone(new Vector3(-2, 3, -2), new Size3(5, 1, 5), new Vector3(-2, -1, -2), CloneMask.Replace, CloneMode.Move);
            this.buildClone(new Vector3(-2, 2, -2), new Size3(5, 1, 5), new Vector3(-2, -2, -2), CloneMask.Replace, CloneMode.Move);
            // Collect items into agent's slots
            const blocks = [
                new BlockSlot(this.blockIds.roofStair, SlotIds.RoofStair, 4),
                new BlockSlot(this.blockIds.door, SlotIds.Door, 1),
                new BlockSlot(this.blockIds.button, SlotIds.Button, 1),
            ];
            if (!this.parameter.withoutFurniture) {
                blocks.push(new BlockSlot(Item.ItemFrame, SlotIds.ItemFrame, 1));
                blocks.push(new BlockSlot(Item.Bed, SlotIds.Bed, 1));
                blocks.push(new BlockSlot(Block.Chest, SlotIds.Chest, 2));
            }
            let isForward = false;
            blocks.forEach(b => {
                const duplicateNum = b.number;
                for (let i = 0; i < duplicateNum; i++) {
                    this.buildPlace(b.bid, new Vector3(0, 0, isForward ? 0 : -1));
                    agent.destroy(isForward ? SixDirection.Back : SixDirection.Forward);
                    agent.move(isForward ? SixDirection.Back : SixDirection.Forward, 1);
                    agent.setSlot(b.slot);
                    agent.collect(b.bid);
                    isForward = !isForward;
                }
            });
            if (isForward) {
                agent.move(SixDirection.Back, 1);
            }

            // Prepare Step Roof
            // Put dummy for upward stairs
            this.buildPlace(Block.Dirt, new Vector3(1, 2, 0));
            this.buildPlace(Block.Dirt, new Vector3(-1, 2, 0));
            agent.setSlot(SlotIds.RoofStair);
            agent.turn(TurnDirection.Right);
            for (let i = 0; i < 2; i++) {
                // put upward stairs
                agent.move(SixDirection.Forward, 1);
                agent.place(SixDirection.Up);
                agent.move(SixDirection.Back, 1);
                // put normal stairs
                agent.place(SixDirection.Forward);
                agent.turn(TurnDirection.Right);
                if (i === 0) {
                    agent.turn(TurnDirection.Right);
                }
            }
            // remove dummy
            this.buildPlace(Block.Air, new Vector3(1, 2, 0));
            this.buildPlace(Block.Air, new Vector3(-1, 2, 0));
        }
    }

    class FloorWallRoof extends HouseCreatorBase {
        public buildContents(): void {
            const para = this.parameter;
            const wallBlock = this.blockIds.wall;
            const roofBlock = this.blockIds.roof;
            const patternData =
                [
                    [0, 1],
                    [1, 0],
                ];
            this.buildDrawPlane(new Vector3(this.floorMinX, -1, this.floorMinZ), SixDirection.Up,
                new Size2(para.floorWidth, para.floorDepth), this.blockIds.floorPattern, patternData, []);
            // Front Wall
            super.buildFill(wallBlock, new Size3(para.floorWidth, para.wallHeight, 1), new Vector3(this.floorMinX, 0, this.floorMaxZ));
            // Rear Wall
            super.buildFill(wallBlock, new Size3(para.floorWidth, para.wallHeight, 1), new Vector3(this.floorMinX, 0, this.floorMinZ));
            // Left Wall
            super.buildFill(wallBlock, new Size3(1, para.wallHeight, para.floorDepth), new Vector3(this.floorMinX, 0, this.floorMinZ));
            // Right Wall
            super.buildFill(wallBlock, new Size3(1, para.wallHeight, para.floorDepth), new Vector3(this.floorMaxX, 0, this.floorMinZ));
            // Torch
            for (let z = this.floorMinZ + 1; z <= this.floorMaxZ - 1; z += 2) {
                super.buildPlace(Block.Torch, new Vector3(this.floorMinX, para.wallHeight, z));
                super.buildPlace(Block.Torch, new Vector3(this.floorMaxX, para.wallHeight, z));
            }
            // Triangle Wall
            let wallY = para.wallHeight;
            let wallW = para.floorWidth;
            const sizeRoof = new Size3(1, 1, para.floorDepth - 2);
            let initialAdd = false;
            while (wallW > 0) {
                const size = new Size3(wallW, 1, 1);
                const halfWall = Math.floor(wallW / 2);
                if (!initialAdd) {
                    super.buildFill(wallBlock, size, new Vector3(- halfWall, wallY, this.floorMaxZ));
                    super.buildFill(wallBlock, size, new Vector3(- halfWall, wallY, this.floorMinZ));
                }
                super.buildFill(wallBlock, size, new Vector3(- halfWall, wallY + 1, this.floorMaxZ));
                super.buildFill(wallBlock, size, new Vector3(- halfWall, wallY + 1, this.floorMinZ));
                // Roof
                const roofS = sizeRoof.clone();
                let roofZ = this.floorMinZ + 1;
                if (!initialAdd) {
                    roofS.depth += 2;
                    roofZ -= 1;
                }
                super.buildFill(roofBlock, roofS, new Vector3(- halfWall - 1, wallY, roofZ));
                super.buildFill(roofBlock, roofS, new Vector3(- halfWall + wallW, wallY, roofZ));
                initialAdd = true;
                wallW -= 2;
                wallY += 1;
            }
            // Roof top
            sizeRoof.width = para.floorWidth % 2 === 0 ? 2 : 1;
            sizeRoof.depth += 4;
            super.buildFill(roofBlock, sizeRoof, new Vector3(para.floorWidth % 2 - 1, wallY, this.floorMinZ - 1));
        }
    }

    class DoorHoleAndWindow extends HouseCreatorBase {
        public buildContents(): void {
            const para = this.parameter;
            // Lid a door hole
            super.buildFill(Block.Air, new Size3(1, 2, 1), new Vector3(0, 0, this.floorMaxZ));
            // Place a window
            super.buildFill(Block.GlassPane, new Size3(para.floorWidth - 4, para.wallHeight, 1), new Vector3(this.floorMinX + 2, 0, this.floorMinZ));
            super.buildFill(Block.GlassPane, new Size3(1, para.wallHeight - 2, para.floorDepth - 4), new Vector3(this.floorMinX, 1, this.floorMinZ + 2));
            super.buildFill(Block.GlassPane, new Size3(1, para.wallHeight - 2, para.floorDepth - 4), new Vector3(this.floorMaxX, 1, this.floorMinZ + 2));
        }
    }

    class StepRoof extends HouseCreatorBase {
        public buildContents(): void {
            this.copyRoof(false);
            this.copyRoof(true);
            this.copyUpwarStairs(false);
            this.copyUpwarStairs(true);
            // Destroy org
            BlocksProxy.place(Block.Air, this.getVector(-1, 1, 0));
            BlocksProxy.place(Block.Air, this.getVector(1, 1, 0));
            BlocksProxy.place(Block.Air, this.getVector(-1, 0, 0));
            BlocksProxy.place(Block.Air, this.getVector(1, 0, 0));
        }

        private copyRoof(isRight: boolean): void {
            const para = this.parameter;
            const p = new Vector3(isRight ? -1 : 1, 0, 0);
            let z = this.floorMinZ - 1;
            let x = isRight ? this.floorMaxX + 2 : this.floorMinX - 2;
            let y = para.wallHeight;
            let size = new Size3(1, 1, 1);
            while (z <= this.floorMaxZ + 1) {
                const p2 = new Vector3(x, y, z);
                super.buildClone(p, size, p2);
                z += 1;
            }
            const p1 = new Vector3(x, y, this.floorMinZ - 1);
            size = new Size3(1, 1, para.floorDepth + 2);
            x = x + (isRight ? - 1 : 1);
            y += 1;
            const isOdd = para.floorWidth % 2 === 1;
            while (isRight ? (isOdd ? x > 0 : x >= 0) : x < 0) {
                super.buildClone(p1, size, new Vector3(x, y, this.floorMinZ - 1));
                x = x + (isRight ? - 1 : 1);
                y += 1;
            }
        }

        private copyUpwarStairs(isRight: boolean): void {
            const para = this.parameter;
            const p = new Vector3(isRight ? 1 : -1, 1, 0);
            [this.floorMinZ - 1, this.floorMaxZ + 1].forEach(z => {
                let x = isRight ? this.floorMaxX + 1 : this.floorMinX - 1;
                let y = para.wallHeight;
                let size = new Size3(1, 1, 1);
                const isOdd = para.floorWidth % 2 === 1;
                while (isRight ? (isOdd ? x > 0 : x >= 0) : x < 0) {
                    const p2 = new Vector3(x, y, z);
                    super.buildClone(p, size, p2);
                    x = x + (isRight ? - 1 : 1);
                    y += 1;
                }
            });
        }
    }

    class BuildDoor extends HouseCreatorBase {
        public buildContents(): void {
            // Door
            agent.setSlot(SlotIds.Door);
            if (this.parameter.inwardOpenDoor) {
                agent.move(SixDirection.Back, this.floorMaxZ + 1);
            } else {
                agent.turn(TurnDirection.Right);
                agent.turn(TurnDirection.Right);
                agent.move(SixDirection.Forward, this.floorMaxZ - 1);
            }
            agent.place(SixDirection.Forward);
            if (!this.parameter.inwardOpenDoor) {
                agent.turn(TurnDirection.Right);
                agent.turn(TurnDirection.Right);
            }
            // Pressure plate
            this.buildPlace(this.blockIds.pressurePlate, new Vector3(0, 0, this.floorMaxZ - 1));
            // Button
            agent.setSlot(SlotIds.Button);
            AgentProxy.teleport(this.getVector(-1, 0, this.floorMaxZ + 1));
            agent.move(SixDirection.Up, 1);
            agent.place(SixDirection.Forward);
            if (!this.parameter.withoutFurniture) {
                // Bed
                agent.setSlot(SlotIds.Bed);
                AgentProxy.teleport(this.getVector(this.floorMinX + 1, 0, this.floorMinZ + 3));
                agent.place(SixDirection.Forward);
                // Chest
                agent.setSlot(SlotIds.Chest);
                AgentProxy.teleport(this.getVector(this.floorMaxX - 2, 0, this.floorMinZ + 1));
                agent.turn(TurnDirection.Right);
                agent.place(SixDirection.Forward);
                agent.move(SixDirection.Right, 1);
                agent.place(SixDirection.Forward);
                // Item frame
                agent.turn(TurnDirection.Right);
                agent.setSlot(SlotIds.ItemFrame);
                AgentProxy.teleport(this.getVector(0, 0, this.floorMaxZ - 1));
                agent.move(SixDirection.Up, 2);
                agent.place(SixDirection.Forward);
                // Crafting table
                this.buildPlace(Block.CraftingTable, new Vector3(this.floorMinX + 1, 0, this.floorMaxZ - 1));
            }
            // Finish
            this.destroySnowTent();
            agent.teleportToPlayer();
        }
    }
}

/**
 * House builder / ハウスビルダー
 */
//% weight=1 color=#967851 icon="\uf033"
namespace inosyan_housebuilder {
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
	 * Build a house / 家を建てる
	 * You can specify the direction to build by putting a torch in front of player. / たいまつをプレイヤーの前に置いて建てる方向を指定できます。
	 * @param houseType Appearance of the house / 家の見た目 (1: Wooden Dark, 2: Wooden Light, 3: Stone, 4: Quartz, 5: Brick, 6: Sand, 7: DarkOak, 8: Oak)
	 * @param sizeWDH The number composed of 2 digit width, depth, height. / 幅,奥行き,高さを2桁ずつ組み合わせた数字 (e.g. 070503 means width: 7, depth: 5, height: 3)
	 * @param option The number composed of 1 digit options. / 1桁ずつのオプションを組み合わせた数字
	 * 1st digit: Inward open door / 1桁目: ドアの開き方  (0: Outward / 外開き, 1: Inward / 内開き)
	 * 2nd digit: Without furniture / 家具を置かないかどうか (0: With / 置く, 1: Without / 置かない)
	 * (e.g. 10 means that the house has outward door and no furniture / 例えば 10 はその家が外開きのドアで、家具がないことを表します)
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
	 * Clear all blocks in front of player. / プレイヤーの前のブロックをすべて消します。
	 * You can specify the direction to clear by putting a torch in front of player. / たいまつをプレイヤーの前に置いてクリアする方向を指定できます。
	 * @param sizeWDH The number composed of 2 digit width, depth, height. / 幅,奥行き,高さを2桁ずつ組み合わせた数字 (e.g. 070503 means width: 7, depth: 5, height: 3)
	 * @param option The number composed of 1 digit optoins. / 1桁ずつのオプションを組み合わせた数字 
     * 1st digit: Fill ground / 1桁目: 地面を埋めるかどうか (0: Do not fill / 埋めない, 1: Fill / 埋める). 
     * (e.g. 1 means Fill ground / 例えば 1 は地面を埋めることを表します)
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
}
