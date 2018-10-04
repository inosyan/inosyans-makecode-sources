/**
 * Movie Camera / ムービーカメラ
 */
//% weight=1 color=#967851 icon="\uf033"
namespace inosyan_moviecamera {
    import Vector3 = inosyan_core_math.Vector3;

    let targetPos: Vector3 = undefined;
    let startPos: Vector3 = undefined;
    let endPos: Vector3 = undefined;

    const PI = 3.14159265358;

    const checkTargetPos = (): boolean => {
        if (!targetPos) {
            player.say("Please execute 'settarget' at first");
            return false;
        }
        return true;
    }

    const checkTargetAndStartEndPos = (): boolean => {
        if (!checkTargetPos) return false;
        if (!startPos) {
            player.say("Please execute 'setstart' at first");
            return false;
        }
        if (!endPos) {
            player.say("Please execute 'setend' at first");
            return false;
        }
        return true;
    }

    /**
     * Set the target position from the player's position. / 現在プレイヤーが立っている位置をターゲットの位置にセットします。
     */
    //% block
    export function setTarget() {
        targetPos = new Vector3().setPosition(player.position());
        player.say(`Set target to ${targetPos}`);
    }

    /**
     * Show the current target position. / 現在のターゲットの位置を表示する。
     */
    //% block
    export function getTarget() {
        if (!targetPos) return;
        player.say(`Target is ${targetPos}`);
    }

    /**
     * Adjust the target position. / ターゲットの位置を調整する。
     * @param x Adjust value for X axis / X軸の調整量
     * @param y Adjust value for Y axis / Y軸の調整量
     * @param z Adjust value for Z axis / Z軸の調整量
     */
    //% block
    export function adjustTarget(x: number, y: number, z: number) {
        if (!targetPos) return;
        targetPos.addValue(x, y, z);
        player.say(`Target is ${targetPos}`);
    }

    /**
     * Set the start position from the player's position. / 現在プレイヤーが立っている位置を開始位置にセットします。
     */
    //% block
    export function setStart() {
        startPos = new Vector3().setPosition(player.position());
        player.say(`Set start to ${startPos}`);
    }

    /**
     * Show the current start position. / 現在の開始位置を表示する。
     */
    //% block
    export function getStart() {
        if (!startPos) return;
        player.say(`Start is ${startPos}`);
    }

    /**
     * Adjust the start position. / 開始位置を調整する。
     * @param x Adjust value for X axis / X軸の調整量
     * @param y Adjust value for Y axis / Y軸の調整量
     * @param z Adjust value for Z axis / Z軸の調整量
     */
    //% block
    export function adjustStart(x: number, y: number, z: number) {
        if (!startPos) return;
        startPos.addValue(x, y, z);
        player.say(`Start is ${startPos}`);
    }

    /**
     * Set the end position from the player's position. / 現在プレイヤーが立っている位置を終了位置にセットします。
     */
    //% block
    export function setEnd() {
        endPos = new Vector3().setPosition(player.position());
        player.say(`Set end to ${endPos}`);
    }

    /**
     * Show the current end position. / 現在の終了位置を表示する。
     */
    //% block
    export function getEnd() {
        if (!endPos) return;
        player.say(`End is ${endPos}`);
    }

    /**
     * Adjust the end position. / 終了位置を調整する。
     * @param x Adjust value for X axis / X軸の調整量
     * @param y Adjust value for Y axis / Y軸の調整量
     * @param z Adjust value for Z axis / Z軸の調整量
     */
    //% block
    export function adjustEnd(x: number, y: number, z: number) {
        if (!endPos) return;
        endPos.addValue(x, y, z);
        player.say(`End is ${endPos}`);
    }

    /**
     * Rotate around the target. / ターゲットの周りを回転します。
     * @param frameCount Frame count during move / 動く間のフレーム数
     * @param degree Rotation value / 回転する角度
     */
    //% block
    export function orbit(frameCount: number, degree: number) {
        if (!checkTargetPos()) return;
        const ADJUST_Y = 2;
        const cp = targetPos;
        let ppos = new Vector3().setPosition(player.position());
        const px = ppos.x;
        const py = ppos.y;
        const pz = ppos.z;
        const cx = cp.x;
        const cy = cp.y - ADJUST_Y;
        const cz = cp.z;
        const dist = Math.sqrt(Math.pow(cx - px, 2) + Math.pow(cz - pz, 2));
        const startRad = Math.atan2(cx - px, cz - pz);
        for (let i = 0; i <= frameCount; i++) {
            const rate = i / frameCount;
            const deg = degree * rate;
            const rad = deg / 180 * 3.14159265358 + startRad;
            const x = adjust(cx - Math.sin(rad) * dist);
            const y = py;
            const z = adjust(cz - Math.cos(rad) * dist);
            player.execute(`teleport ${x} ${y} ${z} facing ${cx} ${cy} ${cz}`);
        }
    }

    /**
     * Looking around from the player's position. / プレイヤーを中心に周りを見渡します。
     * @param frameCount Frame count during move / 動く間のフレーム数
     * @param degree Rotation value / 回転する角度
     */
    //% block
    export function around(frameCount: number, degree: number) {
        if (!checkTargetPos()) return;
        const tp = targetPos;
        const ppos = new Vector3().setPosition(player.position());
        const cx = ppos.x;
        const cy = ppos.y;
        const cz = ppos.z;
        const tx = tp.x;
        const ty = tp.y;
        const tz = tp.z;
        const startRad = Math.atan2(cx - tx, cz - tz);
        let startDeg = startRad / PI * 180;
        startDeg = -startDeg - 180;
        const lenY = ty - cy;
        const lenX = Math.sqrt(Math.pow(tx - cx, 2) + Math.pow(tz - cz, 2));
        const xRotRad = -Math.atan2(lenY, lenX);
        const xRot = xRotRad / PI * 180;
        for (let i = 0; i <= frameCount; i++) {
            const rate = i / frameCount;
            const yRot = degree * rate + startDeg;
            player.execute(`teleport ${cx} ${cy} ${cz} ${yRot} ${xRot}`);
        }
    }

    /**
     * Moving on a straight line while look at the target. / ターゲットを見ながら直線上を動きます。
     * @param frameCount Frame count during move / 動く間のフレーム数
     */
    //% block
    export function dolly(frameCount: number) {
        dollyImpl(frameCount, 0);
    }

    /**
     * Fixed position on the timeline / 固定する時間軸上の位置
     */
    export enum FixPosition {
        None = 0,
        Start,
        Middle,
        End,
    }

    /**
     * Fixed position on the timeline / 固定する時間軸上の位置
     */
    //% blockId="inosyanMovieCameraFixPosition"
    //% block
    export function fixPosition(value: FixPosition): number {
        return value;
    }

    /**
     * Moving on a straight line with the direction of camera fixed./ カメラの向きを固定して直線上を動きます。
     * @param frameCount Frame count during move / 動く間のフレーム数
     * @param fixPosition Fixed position on the timeline / 固定する時間軸上の位置
     */
    //% block="fix dolly frame %frameCount %fixPosition=inosyanMovieCameraFixPosition"
    export function fixDolly(frameCount: number, fixPosition: number) {
        dollyImpl(frameCount, fixPosition);
    }

    const adjust = (num: number): number => {
        num = Math.round(num * 100) / 100;
        if (num % 1 === 0) num += 0.00001;
        return num;
    }

    const getMiddlePos = (rate: number): Vector3 => {
        const sp = startPos;
        const ep = endPos;
        return new Vector3(
            (ep.x - sp.x) * rate + sp.x,
            (ep.y - sp.y) * rate + sp.y,
            (ep.z - sp.z) * rate + sp.z
        );
    }

    const getYRot = (middlePos: Vector3): number => {
        const tp = targetPos;
        const mp = middlePos;
        const lenX = tp.x - mp.x;
        const lenZ = tp.z - mp.z;
        const rad = Math.atan2(lenZ, lenX);
        return -90 + rad / PI * 180;
    }

    const getXRot = (middlePos: Vector3): number => {
        const tp = targetPos;
        const mp = middlePos;
        const lenX = Math.sqrt(Math.pow(tp.x - mp.x, 2)
            + Math.pow(tp.z - mp.z, 2));
        const lenY = tp.y - mp.y;
        const rad = Math.atan2(lenY, lenX);
        return -rad / PI * 180;
    }

    const dollyImpl = (frameCount: number, fixPosition: FixPosition) => {
        const adjust = (num: number): number => {
            num = Math.round(num * 100) / 100;
            if (num % 1 === 0) num += 0.0001;
            return num;
        }
        if (!frameCount) frameCount = 10;
        if (!checkTargetAndStartEndPos()) return;
        let fixXRot = 0;
        let fixYRot = 0;
        const isFix = fixPosition !== FixPosition.None;
        if (isFix) {
            let fixPositionRate = 0;
            switch (fixPosition) {
                case FixPosition.Start: fixPositionRate = 0; break;
                case FixPosition.Middle: fixPositionRate = 0.5; break;
                default: fixPositionRate = 1; break;
            }
            const mp = getMiddlePos(fixPositionRate);
            fixYRot = getYRot(mp);
            fixXRot = getXRot(mp);
        }
        for (let i = 0; i <= frameCount; i++) {
            const rate = i / frameCount;
            const mp = getMiddlePos(rate);
            const yRot = adjust(isFix ? fixYRot : getYRot(mp));
            const xRot = adjust(isFix ? fixXRot : getXRot(mp));
            const x = adjust(mp.x);
            const y = adjust(mp.y);
            const z = adjust(mp.z);
            player.execute(`teleport ${x} ${y} ${z} ${yRot} ${xRot}`);
        }
    }
}
