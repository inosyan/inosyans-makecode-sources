player.onChat("createtitle", function () {
    inosyan_app_housebuilder.createTitle()
})
player.onChat("clearall", function (sizeWDH, option) {
    inosyan_app_housebuilder.clearAll(sizeWDH, option)
})
player.onChat("buildhouse", function (houseType, sizeWDH, option) {
    inosyan_app_housebuilder.buildHouse(houseType, sizeWDH, option)
})
