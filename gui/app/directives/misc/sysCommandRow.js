"use strict";

(function() {
  angular.module("firebotApp").component("sysCommandRow", {
    bindings: {
      command: "<"
    },
    template: `
      <div style="margin-bottom: 20px">
        <div class="sys-command-row" style="cursor: pointer;" ng-init="hidePanel = true" ng-click="hidePanel = !hidePanel" ng-class="{'expanded': !hidePanel}">
          <div style="flex-basis: 25%;padding-left: 20px;">{{$ctrl.command.name}}</div>
          <div style="width: 20%">{{$ctrl.command.trigger}}</div>
          <div style="width: 20%">
            <span style="min-width: 51px; display: inline-block;" uib-tooltip="Global cooldown">
                <i class="fal fa-globe"></i> {{$ctrl.command.cooldown.global ? $ctrl.command.cooldown.global + "s" : "-" }}
            </span>
            <span uib-tooltip="User cooldown">
                <i class="fal fa-user"></i> {{$ctrl.command.cooldown.user ? $ctrl.command.cooldown.user + "s" : "-" }}
            </span>
          </div>
          <div style="width: 20%"><span style="text-transform: capitalize;">{{$ctrl.command.permission.type}}</span> <tooltip type="info" text="$ctrl.getPermissionTooltip($ctrl.command)"></tooltip></div>
          <div style="width: 20%">
            <div style="min-width: 75px">
                <span class="status-dot" ng-class="{'active': $ctrl.command.active, 'notactive': !$ctrl.command.active}"></span> {{$ctrl.command.active ? "Active" : "Disabled"}}
            </div> 
          </div>
          <div style="flex-basis:30px; flex-shrink: 0;">
            <i class="fas" ng-class="{'fa-chevron-right': hidePanel, 'fa-chevron-down': !hidePanel}"></i>
          </div>
        </div>
        <div uib-collapse="hidePanel" style="background: white;box-shadow: 3px 3px 5px -2px #dedede;">
          <div style="padding: 5px 20px 20px 20px;">
            <div class="muted" style="font-weight:bold; font-size: 12px;">DESCRIPTION</div>
            <p style="font-size: 18px">{{$ctrl.command.description}}</p>
            <div>
              <div class="muted" style="font-weight:bold; font-size: 12px;">USAGE</div>
              <p style="font-size: 15px;font-weight: 600;">{{$ctrl.command.trigger}} {{$ctrl.command.usage ? $ctrl.command.usage : ''}}</p>
            </div>
            <p class="muted" ng-if="$ctrl.command.usage">{{$ctrl.command.trigger}} {{$ctrl.command.usage}}</p>
            <div style="padding-top: 5px;" ng-if="$ctrl.command.subCommands && $ctrl.command.subCommands.length > 0">
              <div class="muted" style="font-weight:bold; font-size: 12px;padding-bottom: 5px;">SUBCOMMANDS</div>
              <div ng-repeat="subCmd in $ctrl.command.subCommands track by $index">
                <span style="font-weight: 600;">{{$ctrl.command.trigger}} {{subCmd.usage}}</span>  —  <span style="font-size: 13px;">{{subCmd.description}}</span>
                <div style="padding-left:15px;">
                <div style="display: inline-block; margin-right: 25px;">
                  <div><span class="muted" style="font-size: 10px;"><i class="fas fa-lock-alt"></i> COOLDOWNS</span></div>
                    <div>
                      <span style="min-width: 51px; display: inline-block;" uib-tooltip="Global cooldown">
                          <i class="fal fa-globe"></i> {{$ctrl.command.cooldown.global ? $ctrl.command.cooldown.global + "s" : "-" }}
                      </span>
                      <span uib-tooltip="User cooldown">
                          <i class="fal fa-user"></i> {{$ctrl.command.cooldown.user ? $ctrl.command.cooldown.user + "s" : "-" }}
                      </span>
                    </div>
                  </div>
                  <div style="display: inline-block;">
                    <div><span class="muted" style="font-size: 10px;"><i class="fas fa-lock-alt"></i> PERMISSIONS</span></div>
                    <div><span style="text-transform: capitalize;">{{subCmd.permission.type}}</span> <tooltip type="info" text="$ctrl.getPermissionTooltip(subCmd)"></tooltip></div>
                  </div>
                </div>                  
              </div>
            </div>
          </div>
        </div>
      </div>
    `,
    controller: function() {
      let $ctrl = this;

      $ctrl.$onInit = function() {};

      $ctrl.getPermissionTooltip = command => {
        let type = command.permission.type;
        switch (type) {
          case "group":
            let groups = command.permission.groups;
            if (groups == null || groups.length < 1) {
              return "Command is set to Group permissions, but no groups are selected.";
            }
            return (
              "This command is restricted to the groups: " +
              command.permission.groups.join(", ")
            );
          case "individual":
            let username = command.permission.username;
            if (username == null || username === "") {
              return "Command is set to restrict to an individual but a name has not been provided.";
            }
            return "This command is restricted to the user: " + username;
          default:
            return "This command is available to everyone";
        }
      };
    }
  });
})();
