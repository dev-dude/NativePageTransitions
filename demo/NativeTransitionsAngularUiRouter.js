'use strict';

angular.module('nativeTransitionsModule', []);

// A service to allow the native transitions from angular js with ui router states
// TODO: Promise on the load of nativepagetransitions. Will add demo
// Tested with Android only at this time. 

// Handle the state.$go change on the menu item (li item) in your app (root.menuPanel). No need to pass it into here. 
// Emit event $openCloseMenuPanel from your app to open or close the menu panel. ex: $rootScope.$emit('$openCloseMenuPanel').

angular.module('nativeTransitionsModule')
    .service('NativeTransitions', ['$window', '$state', '$rootScope', '$timeout',

        function ($window, $state, $rootScope, $timeout) {
            var operateDrawer = function(action, origin) {
                if (action === 'open') {
                    // State of a blank state and empty controller. Idea is to load really fast to clear out the current webview's contents. This should probably be in java to hide the body (display none).
                    $state.go('root.blank');
                    $timeout(function() {
                        // State of your menu Panel
                        $state.go('root.menuPanel');
                    },10);
                }
                $window.plugins.nativepagetransitions.drawer({
                        'action': action,
                        'origin': origin,
                        'duration': 350,
                        'href': ''
                    },
                    function () {
                        if (action === 'open') {
                            $timeout(function() {
                                $rootScope.isMenuBinded = true;
                            },10);
                        }
                        console.log('------------------- drawer transition finished');
                    },
                    function (msg) {
                        alert('error: ' + msg);
                    });
            }
            return {
                operateDrawer: operateDrawer
            };

        }]).run([
        '$rootScope',
        'NativeTransitions',
        function ($rootScope, NativeTransitions) {
            $rootScope.isMenuBinded = false;

            // Emit event $openCloseMenuPanel from your app to open or close the menu panel. ex: $rootScope.$emit('$openCloseMenuPanel').
            $rootScope.$on('$openCloseMenuPanel', function (ev, data) {
                if (!$rootScope.menuOpen) {
                    $rootScope.menuOpen = true;
                    NativeTransitions.operateDrawer('open', 'left');
                } else {
                    $rootScope.menuOpen = false;
                }
            });

            $rootScope.$on('$stateChangeSuccess', function () {
                if ($rootScope.isMenuBinded) {
                    $rootScope.isMenuBinded = false;
                    setTimeout(function() {
                        NativeTransitions.operateDrawer('close', 'left');
                    },100);
                }
            });


        }
    ]);