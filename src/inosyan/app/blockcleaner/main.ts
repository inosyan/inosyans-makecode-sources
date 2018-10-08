player.onChat("clearblocks", function (clearSize, clearOption) {
    inosyan_blockcleaner.clearBlocks(clearSize, clearOption)
})
player.onChat("placeblockunderfoot", function () {
    inosyan_blockcleaner.placeBlockUnderFoot()
})
