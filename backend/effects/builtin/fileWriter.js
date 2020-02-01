"use strict";

const { settings } = require("../../common/settings-access");
const resourceTokenManager = require("../../resourceTokenManager");
const fileWriterProcessor = require("../../common/handlers/fileWriterProcessor");

const { ControlKind, InputEvent } = require('../../interactive/constants/MixplayConstants');
const effectModels = require("../models/effectModels");
const { EffectDependency, EffectTrigger } = effectModels;

/**
 * The File Writer effect
 */
const fileWriter = {
    /**
   * The definition of the Effect
   */
    definition: {
        id: "firebot:filewriter",
        name: "Write To File",
        description: "Write or delete some text in a file.",
        tags: ["Built in"],
        dependencies: [],
        triggers: effectModels.buildEffectTriggersObject(
            [ControlKind.BUTTON, ControlKind.TEXTBOX],
            [InputEvent.MOUSEDOWN, InputEvent.KEYDOWN, InputEvent.SUBMIT],
            EffectTrigger.ALL
        )
    },
    /**
   * Global settings that will be available in the Settings tab
   */
    globalSettings: {},
    /**
   * The HTML template for the Options view (ie options when effect is added to something such as a button.
   * You can alternatively supply a url to a html file via optionTemplateUrl
   */
    optionsTemplate: `
        <eos-container header="File">
            <file-chooser model="effect.filepath" options="{ filters: [ {name:'Text',extensions:['txt']} ]}"></file-chooser>
        </eos-container>

        <eos-container header="Write Mode" pad-top="true">
            <div class="controls-fb-inline" style="padding-bottom: 5px;">
                <label class="control-fb control--radio">Replace
                    <input type="radio" ng-model="effect.writeMode" value="replace"/> 
                    <div class="control__indicator"></div>
                </label>
                <label class="control-fb control--radio">Append
                    <input type="radio" ng-model="effect.writeMode" value="append"/>
                    <div class="control__indicator"></div>
                </label>
                <label class="control-fb control--radio">Delete Line
                    <input type="radio" ng-model="effect.writeMode" value="delete"/>
                    <div class="control__indicator"></div>
                </label>
                <label class="control-fb control--radio">Delete All
                    <input type="radio" ng-model="effect.writeMode" value="delete-all"/>
                    <div class="control__indicator"></div>
                </label>
            </div>
        </eos-container>

        <eos-container header="Text or Line Number(s)" pad-top="true" ng-if="effect.writeMode === 'replace' || effect.writeMode === 'append' || effect.writeMode === 'delete'">
            <input ng-model="effect.text" type="text" class="form-control" id="chat-text-setting" placeholder="Enter text" replace-variables>
        </eos-container>
    `,
    /**
   * The controller for the front end Options
   * Port over from effectHelperService.js
   */
    optionsController: ($scope) => {
        if ($scope.effect.writeMode == null) {
            $scope.effect.writeMode = "replace";
        }
    },
    /**
   * When the effect is triggered by something
   * Used to validate fields in the option template.
   */
    optionsValidator: effect => {
        let errors = [];
        if (effect.filepath == null || effect.filepath === "") {
            errors.push("Please select a text file to write to.");
        }
        return errors;
    },
    /**
   * When the effect is triggered by something
   */
    onTriggerEvent: event => {
        return new Promise(resolve => {
            // What should this do when triggered.
            fileWriterProcessor.run(event.effect, event.trigger);
            resolve(true);
        });
    }
};

module.exports = fileWriter;
