"use strict";

(function() {

    angular
        .module("firebotApp")
        .factory("giveawaysService", function($q, logger, backendCommunicator,
            utilityService, objectCopyHelper, ngToast) {
            let service = {};

            service.giveaways = [];

            function updateGiveaway(giveaway) {
                const index = service.giveaways.findIndex(g => g.id === giveaway.id);
                if (index > -1) {
                    service.giveaways[index] = giveaway;
                } else {
                    service.giveaways.push(giveaway);
                }
            }

            service.loadGiveaways = async function() {
                $q.when(backendCommunicator.fireEventAsync("getGiveaways"))
                    .then(giveaways => {
                        if (giveaways) {
                            service.giveaways = Object.values(giveaways);
                        }
                    });
            };

            backendCommunicator.on("all-giveaways", giveaways => {
                if (giveaways != null) {
                    service.giveaways = Object.values(giveaways);
                }
            });

            service.getGiveaways = function() {
                return Object.values(service.giveaways);
            };

            service.getGiveaway = function(giveawayId) {
                return service.giveaways.find(g => g.id === giveawayId);
            };

            service.saveGiveaway = function(giveaway) {
                return $q.when(backendCommunicator.fireEventAsync("saveGiveaway", giveaway))
                    .then(savedGiveaway => {
                        if (savedGiveaway) {
                            updateGiveaway(giveaway);
                            return true;
                        }
                        return false;
                    });
            };

            service.saveAllGiveaways = (giveaways) => {
                service.giveaways = giveaways;
                backendCommunicator.fireEvent("saveAllGiveaways", giveaways);
            };

            service.giveawayNameExists = (name) => {
                return service.giveaways.some(g => g.name === name);
            };

            service.duplicateGiveaway = (giveawayId) => {
                const giveaway = service.giveaways.find(g => g.id === giveawayId);
                if (giveaway == null) {
                    return;
                }
                const copiedGiveaway = objectCopyHelper.copyObject("giveaway", giveaway);
                copiedGiveaway.id = null;

                while (service.giveawayNameExists(copiedGiveaway.name)) {
                    copiedGiveaway.name += " copy";
                }

                service.saveGiveaway(copiedGiveaway).then(successful => {
                    if (successful) {
                        ngToast.create({
                            className: 'success',
                            content: 'Successfully duplicated a giveaway!'
                        });
                    } else {
                        ngToast.create("Unable to duplicate giveaway.");
                    }
                });
            };

            service.deleteGiveaway = function(giveawayId) {
                service.giveaways = service.giveaways.filter(g => g.id !== giveawayId);
                backendCommunicator.fireEvent("deleteGiveaway", giveawayId);
            };

            service.showAddEditGiveawayModal = function(giveaway) {
                return new Promise(resolve => {
                    utilityService.showModal({
                        component: "addOrEditGiveawayModal",
                        size: "md",
                        resolveObj: {
                            giveaway: () => giveaway
                        },
                        closeCallback: response => {
                            resolve(response.giveaway);
                        }
                    });
                });
            };

            return service;
        });
}());