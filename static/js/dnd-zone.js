/*!
 * DnD Zone
 * Author: Mohammad Zahed Kamal
 * Author Url: https://zahedkamal.com
 * Git: https://github.com/zahedkamal87/dnd-zone
 * License: MIT
 */

;(function (root, factory) {
    const plugin_name = 'DnDZone';

    if (typeof define === 'function' && define.amd) {
        define([], factory(plugin_name));
    } else if (typeof exports === 'object') {
        module.exports = factory(plugin_name);
    } else {
        root[plugin_name] = factory(plugin_name);
    }
}((window || module || {}), function(plugin_name) {
    'use strict';

    const plugin = {};
    let self = null;

    const defaults = {
        beforeFilesAdded: (files) => { 
            return files;
        },
        afterFilesAdded: (files) => { 
        },
        accept: '',
        triggerChange: false
    };

    function Plugin(element, options) {
        self = this;

        plugin.name = plugin_name;
        plugin.element = element;
        plugin.defaults = defaults;
        plugin.options = options;
        plugin.settings = Object.assign({}, defaults, options);

        self.initialize();

        return plugin;
    }

    const isAcceptableFile = (file) => {
        let accept = plugin.accept;
        if (!accept) {
            return true;
        }

        accept = accept.split(",");

        let mimeType = file.type;
        let baseMimeType = mimeType.replace(/\/.*$/, "");

        for (let i = 0; i < accept.length; i++) {
            let validType = accept[i].trim();

            if (validType.charAt(0) === ".") {
                if (file.name.toLowerCase().indexOf(validType.toLowerCase(), file.name.length - validType.length) !== -1) {
                    return true;
                }
            } else if (/\/\*$/.test(validType)) {
                if (baseMimeType === validType.replace(/\/.*$/, "")) {
                    return true;
                }
            } else {
                if (mimeType === validType) {
                    return true;
                }
            }
        }

        return false;
    };

    const attachEvents = () => {
        ['drag', 'dragstart', 'dragend', 'dragover', 'dragenter', 'dragleave', 'drop'].forEach(function(event) {
            plugin.dndzone.addEventListener(event, function(e) {
                e.preventDefault();
                e.stopPropagation();
            });
        });

        ['dragover', 'dragenter'].forEach(function(event) {
            plugin.dndzone.addEventListener(event, function(e) {
                this.classList.add('dndpicker-dragging');
            });
        });

        ['dragleave', 'dragend', 'drop'].forEach(function(event) {
            plugin.dndzone.addEventListener(event, function(e) {
                this.classList.remove('dndpicker-dragging');
            });
        });

        ['drop'].forEach(function(event) {
            plugin.dndzone.addEventListener(event, function(e) {
                let files = e.dataTransfer.files;
                let dataTransfer = new DataTransfer();
                let multiple = plugin.multiple;

                Array.prototype.forEach.call(files, file => {
                    if (isAcceptableFile(file)) {
                        dataTransfer.items.add(file);
                        if (!multiple) {
                            return false;
                        }
                    }
                });

                let beforeFilesAdded = plugin.settings.beforeFilesAdded;
                let filesToBeAdded = dataTransfer.files;

                if (typeof beforeFilesAdded === 'function') {
                    filesToBeAdded = beforeFilesAdded.call(self, filesToBeAdded);
                }

                plugin.dndzone_input.files = filesToBeAdded;

                if (plugin.settings.triggerChange) {
                    plugin.dndzone_input.dispatchEvent(new Event('change'));
                }

                let afterFilesAdded = plugin.settings.afterFilesAdded;
                if (typeof afterFilesAdded === 'function') {
                    afterFilesAdded.call(self, filesToBeAdded);
                }
            });
        });

        ['click'].forEach(function(event) {
            plugin.dndzone.addEventListener(event, function(e) {
                plugin.dndzone_input.click();
            });
        });
    };

    Plugin.prototype = {
        initialize: () => {
            let dndzone = plugin.element;
            let dndzone_area = typeof(dndzone) != 'undefined' && dndzone != null ? dndzone.querySelector('.dndzone-area') : null;
            let dndzone_input = typeof(dndzone) != 'undefined' && dndzone != null ? dndzone.querySelector('.dndzone-input') : null;

            if (typeof(dndzone) != 'undefined' && dndzone != null && typeof(dndzone_area) != 'undefined' && dndzone_area != null && typeof(dndzone_input) != 'undefined' && dndzone_input != null) {
                let accept = dndzone_input.getAttribute('accept') != undefined ? dndzone_input.getAttribute('accept') : plugin.settings.accept;
                dndzone_input.setAttribute('accept', accept);
                dndzone_input.style.display = 'none';

                plugin.accept = accept;
                plugin.multiple = dndzone_input.getAttribute('multiple') ? true : false;
                plugin.dndzone = dndzone;
                plugin.dndzone_area = dndzone_area;
                plugin.dndzone_input = dndzone_input;

                attachEvents();

            } else {
                console.log('Wrong HTML structure or missing element(s). ' + plugin_name + ' cannot initialize.');
            }
        }
    };

    return Plugin;
}));