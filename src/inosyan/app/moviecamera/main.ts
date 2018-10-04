player.onChat("setend", function () {
    inosyan_moviecamera.setEnd()
})
player.onChat("settarget", function () {
    inosyan_moviecamera.setTarget()
})
player.onChat("adjusttarget", function (adjustTargetX, adjustTargetY, adjustTargetZ) {
    inosyan_moviecamera.adjustTarget(adjustTargetX, adjustTargetY, adjustTargetZ)
})
player.onChat("setstart", function () {
    inosyan_moviecamera.setStart()
})
player.onChat("getstart", function () {
    inosyan_moviecamera.getStart()
})
player.onChat("adjuststart", function (adjustStartX, adjustStartY, adjustStartZ) {
    inosyan_moviecamera.adjustStart(adjustStartX, adjustStartY, adjustStartZ)
})
player.onChat("gettarget", function () {
    inosyan_moviecamera.getTarget()
})
player.onChat("getend", function () {
    inosyan_moviecamera.getEnd()
})
player.onChat("adjustend", function (adjustEndX, adjustEndY, adjustEndZ) {
    inosyan_moviecamera.adjustEnd(adjustEndX, adjustEndY, adjustEndZ)
})
player.onChat("orbit", function (orbitFrameCount, orbitDegree) {
    inosyan_moviecamera.orbit(orbitFrameCount, orbitDegree)
})
player.onChat("around", function (aroundFrameCount, aroundDegree) {
    inosyan_moviecamera.around(aroundFrameCount, aroundDegree)
})
player.onChat("dolly", function (dollyFrameCount) {
    inosyan_moviecamera.dolly(dollyFrameCount)
})
player.onChat("fixdolly", function (fixDollyFrameCount, fixDollyFixPosition) {
    inosyan_moviecamera.fixDolly(fixDollyFrameCount, fixDollyFixPosition)
})
