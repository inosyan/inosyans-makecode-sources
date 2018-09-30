namespace inosyan_core_math {
    /**
     * Indicates size by width and height. / 幅と高さで大きさを表します。
     */
    export class Size2 {
        /** Width value / 幅の値 */
        public width: number;
        /** Height value / 高さの値 */
        public height: number;

        /**
         * @param width Width value / 幅の値
         * @param height Height value / 高さの値
         */
        constructor(width: number, height: number) {
            this.width = width;
            this.height = height;
        }

        /**
         * Return the string indicated this instance. / インスタンスの内容を表す文字列を返します。
         */
        public toString(): string {
            return `size2:${this.width} ${this.height}`;
        }

        /**
         * Return the copy of instance. / インスタンスの複製を返します。
         */
        public clone(): Size2 {
            return new Size2(this.width, this.height);
        }
    }

    /**
     * Indicates size by width, height and depth. / 幅と高さと奥行きで大きさを表します。
     */
    export class Size3 {
        /** Width value / 幅の値 */
        public width: number;
        /** Height value / 高さの値 */
        public height: number;
        /** Depth value / 奥行きの値 */
        public depth: number;

        /**
         * @param width Width value / 幅の値
         * @param height Height value / 高さの値
         * @param depth Depth value / 奥行きの値
         */
        constructor(width: number, height: number, depth: number) {
            this.width = width;
            this.height = height;
            this.depth = depth;
        }

        /**
         * Return the string indicated this instance. / インスタンスの内容を表す文字列を返します。
         */
        public toString(): string {
            return `size3:${this.width} ${this.height} ${this.depth}`;
        }

        /**
         * Return the copy of instance. / インスタンスの複製を返します。
         */
        public clone(): Size3 {
            return new Size3(this.width, this.height, this.depth);
        }

        /**
         * Rotate specify the direction Forward/Back/Left/Right. / 前後左右の向きを指定して回転させます。
         * @param direction Forward/Back/Left/Right / 前後左右の向き
         */
        public rotate(direction: FourDirection): Size3 {
            switch (direction) {
                case FourDirection.Right:
                case FourDirection.Left:
                    const tmp = this.width;
                    this.width = this.depth;
                    this.depth = tmp;
                    break;
            }
            return this;
        }
    }

    /**
     * Indicates coodinate by X, Y and Z. / XYZで座標を表します。
     */
    export class Vector3 {
        /** X value X座標の値 */
        public x: number;
        /** Y value Y座標の値 */
        public y: number;
        /** Z value Z座標の値 */
        public z: number;
        /** Whether is absolute position of world or not. / ワールドの絶対座標かどうか */
        public isWorld: boolean;

        /**
         * @param x X value / X座標の値
         * @param y Y value / Y座標の値
         * @param z Z value / Z座標の値
         * @param isWorld Whether is absolute position of world or not. / ワールドの絶対座標かどうか
         */
        constructor(x: number = 0, y: number = 0, z: number = 0, isWorld: boolean = false) {
            this.x = x;
            this.y = y;
            this.z = z;
            this.isWorld = isWorld;
        }

        /**
         * Return the string indicated this instance. / インスタンスの内容を表す文字列を返します。
         */
        public toString(): string {
            return `vector3:${this.x} ${this.y} ${this.z}`;
        }

        /**
         * Add value / 値を加算します。
         * @param v value to be added / 加算する値
         */
        public add(v: Vector3): Vector3 {
            this.x += v.x;
            this.y += v.y;
            this.z += v.z;
            return this;
        }

        /**
         * Subtract value / 値を減算します。
         * @param v value to be subtracted / 減算する値
         */
        public subtract(v: Vector3): Vector3 {
            this.x -= v.x;
            this.y -= v.y;
            this.z -= v.z;
            return this;
        }

        /**
         * Add value / 値を加算します。
         * @param size value to be added / 加算する値
         */
        public addSize(size: Size3): Vector3 {
            this.x += size.width - 1;
            this.y += size.height - 1;
            this.z += size.depth - 1;
            return this;
        }

        /**
         * Add value / 値を加算します。
         * @param x X value to be added / 加算するXの値
         * @param y Y value to be added / 加算するYの値
         * @param z Z value to be added / 加算するZの値
         */
        public addValue(x: number = 0, y: number = 0, z: number = 0): Vector3 {
            this.x += x;
            this.y += y;
            this.z += z;
            return this;
        }

        /**
         * Return the copy of instance. / インスタンスの複製を返す
         */
        public clone(): Vector3 {
            return new Vector3(this.x, this.y, this.z, this.isWorld);
        }

        /**
         * Return position / ポジションを返します。
         */
        public toPosition(): Position {
            if (this.isWorld)
                return positions.createWorld(this.x, this.y, this.z);
            else
                return positions.create(this.x, this.y, this.z);
        }

        /**
         * Set position / ポジションの値をセットします。
         * @param value Position value / ポジションの値
         * @param isWorld Whether is absolute position of world or not. / ワールドの絶対座標かどうか
         */
        public setPosition(value: Position, isWorld: boolean = true): Vector3 {
            this.x = value.getValue(Axis.X);
            this.y = value.getValue(Axis.Y);
            this.z = value.getValue(Axis.Z);
            this.isWorld = isWorld;
            return this;
        }

        /**
         * Rotate specify the direction Forward/Back/Left/Right. / 前後左右の向きを指定して回転させます。
         * @param direction Forward/Back/Left/Right / 前後左右の向き
         */
        public rotate(direction: FourDirection): Vector3 {
            switch (direction) {
                case FourDirection.Forward: break;
                case FourDirection.Back:
                    this.x *= -1;
                    this.z *= -1;
                    break;
                case FourDirection.Right:
                    let tmp = this.x;
                    this.x = -this.z;
                    this.z = tmp;
                    break;
                case FourDirection.Left:
                    tmp = this.x;
                    this.x = this.z;
                    this.z = -tmp;
                    break;
            }
            return this;
        }
    }
}
