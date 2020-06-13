// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.


/**
 * @package    qtype_shortmath
 * @author     André Storhaug <andr3.storhaug@gmail.com>
 * @copyright  2018 NTNU
 */

/**
 * @module qtype_shortmath/input
 */
define(['jquery', 'qtype_shortmath/visual-math-input'], function($, VisualMath) {
    /*return {
        initialize: function(inputname, readonly) {
            console.log("ADD CONTENTS HERE!!");
        }
    };*/

    let testInput = null;
    class EditorInput extends VisualMath.Input {

        constructor(input, parent) {
            super(input, parent);
            this.$textarea.on('blur', () => testInput = this);
        }

        change() {
            super.onEdit = ($input, field) => {
                console.log("changed ");
                $input.val(field.latex());
                $input.get(0).dispatchEvent(new Event('change')); // Event firing needs to be on a vanilla dom object.
            };
        }

    }

    class EditorControl extends VisualMath.Control {
        constructor(name, text, onClick) {
            super(name, text, onClick);
        }
        enable() {
            super.enable();
            this.$element.off('click');
            this.$element.on('click', event => {
                console.log($(':focus'));
                event.preventDefault();
                if (testInput !== null) {
                    this.onClick(testInput.field);
                    testInput.field.focus();
                }
            });

        }

    }

    class EditorControlList {

        constructor(wrapper) {
            // this.controls = [];
            this.$wrapper = $(wrapper);
            this.$wrapper.addClass('visual-math-input-wrapper');
            // this.defineDefault();
        }

        add($btnInput, $expInput) {
            let btnText = $btnInput.val().replace(/[{}\s]/g, '');
            let expText = $expInput.val().replace(/[{}\s]/g, '');
            if (btnText === '' || expText === '') {
                return;
            }

            let control;
            if (expText.replace(/[{}a-z0-9A-Z\s]/g, '') === '^') {
                let chars = btnText.split('^');
                console.log(chars[0] + ' ' + chars[1]);
                let caret = '<div class="mq-math-mode" style="cursor:pointer;font-size:100%;">';
                caret += '<span class="mq-root-block">';
                caret += '<var>x</var>';
                caret += '<span class="mq-supsub mq-non-leaf mq-sup-only">';
                caret += '<span class="mq-sup">';
                caret += '<var>y</var>';
                caret += '</span></span></span></div>';
                control = new EditorControl('caret', caret, field => field.cmd('^'));
            } else if (expText.includes('lim_')) {
                let lim = '<span class="mq-root-block">lim</span>';
                console.log('lim');
                let chars = expText.split('\\');
                console.log(chars);
                control = new EditorControl('lim', lim, field => {
                    field.cmd('\\lim').typedText('_').write(chars[1].split('_')[1])
                        .cmd('\\to').write(expText.split('to')[1]).moveToRightEnd();
                });
            } else if (expText.includes('binom')) {
                let nchoosek = '<div class="mq-math-mode" style="cursor:pointer;font-size:100%;">';
                nchoosek += '<span class="mq-root-block">';
                nchoosek += '<span class="mq-non-leaf">';
                nchoosek += '<span class="mq-paren mq-scaled" style="transform: scale(0.8, 1.5);">(</span>';
                nchoosek += '<span class="mq-non-leaf" style="margin-top:0;">';
                nchoosek += '<span class="mq-array mq-non-leaf">';
                nchoosek += '<span style="font-size: 14px;"><var>n</var></span>';
                nchoosek += '<span style="font-size: 14px;"><var>k</var></span>';
                nchoosek += '</span></span>';
                nchoosek += '<span class="mq-paren mq-scaled" style="transform: scale(0.8, 1.5);">)</span></span>';
                nchoosek += '</span></div>';
                control = new EditorControl('nchoosek', nchoosek, field => field.cmd('\\choose'));
            } else if (expText.includes('sqrt')) {
                let sqrt = '<span class="mq-root-block">&radic;</span>';
                control = new EditorControl('sqrt', sqrt, field => field.cmd('\\sqrt'));
            } else if (expText.includes('int')) {
                let int = '<span class="mq-root-block">&int;</span>';
                control = new EditorControl('int', int, field => field.cmd('\\int'));
            } else if (expText.includes('sum')) {
                let sum = '<span class="mq-root-block"><span class="mq-large-operator mq-non-leaf">&sum;</span></span>';
                control = new EditorControl('sum', sum, field => field.cmd('\\sum'));
            } else if (expText.includes('frac')) {
                let divide = '<span class="mq-root-block">/</span>';
                control = new EditorControl('divide', divide, field => field.cmd('\\frac'));
            } else if (expText.includes('pm')) {
                let plusminus = '<span class="mq-root-block">&plusmn;</span>';
                control = new EditorControl('plusminus', plusminus, field => field.cmd('\\pm'));
            } else if (expText.includes('theta')) {
                let theta = '<span class="mq-root-block">&theta;</span>';
                control = new EditorControl('theta', theta, field => field.cmd('\\theta'));
            } else if (expText.includes('pi')) {
                let pi = '<span class="mq-root-block">&pi;</span>';
                control = new EditorControl('pi', pi, field => field.cmd('\\pi'));
            } else if (expText.includes('infinity') || expText.includes('infty')) {
                let infinity = '<span class="mq-root-block">&infin;</span>';
                control = new EditorControl('infinity', infinity, field => field.cmd('\\infinity'));
            }
            control.enable();
            this.$wrapper.append(control.$element);
        }

    }

    return {
        initialize: function(inputName, readonly, btnName, expName) {
            /*$(document).ready(function() {
                $(document).click(function() {
                    if (testInput !== null) {
                        console.log('blur');
                        //this.onClick(testInput.field);
                        testInput.field.blur();
                    }
                });
            });*/
            console.log("name:  "+inputName);
            console.log("ro:  "+readonly);
            var readOnly = readonly;
            var $shortanswerInput = $('#' + $.escapeSelector(inputName));
            // Remove class "d-inline" added in shortanswer renderer class, which prevents input from being hidden.
            $shortanswerInput.removeClass('d-inline');
            var $parent = $('#' + $.escapeSelector(inputName)).parent('.answer');

            //var input = new VisualMath.Input($shortanswerInput, $parent);
            var input = new EditorInput($shortanswerInput, $parent);
            console.log("test value:  "+input.value);
            input.$input.hide();

            let editorInput = new EditorInput();
            if (!readonly) {
                /*input.onEdit = function($input, field) {
                    console.log("changed ");
                    $input.val(field.latex());
                    $input.get(0).dispatchEvent(new Event('change')); // Event firing needs to be on a vanilla dom object.
                };*/

                editorInput.change();

            } else {
                readOnly = true;
                input.disable();
            }

            if ($shortanswerInput.val()) {
                input.field.write(
                    $shortanswerInput.val()
                );
            }

            // if (!readOnly) {
                var controlsWrapper = $('#' + $.escapeSelector(inputName)).parents('.shortmath').find('.controls_wrapper');
                // var controls = new VisualMath.ControlList(controlsWrapper);
                // controls.enableAll();
            // }
            // let controlsWrapper = $('#' + $.escapeSelector(inputName)).parents('.shortmath').find('.controls_wrapper');
            controlsWrapper.addClass('visual-math-input-wrapper');

            let $btnInput = $('#' + $.escapeSelector(btnName));
            // Remove class "d-inline" added in shortanswer renderer class, which prevents input from being hidden.
            $btnInput.removeClass('d-inline');
            $parent = $('#' + $.escapeSelector(btnName)).parent('.answer');

            input = new EditorInput($btnInput, $parent);
            console.log("test value:  "+input.value);
            input.$input.hide();
            input.change();

            let $expInput = $('#' + $.escapeSelector(expName));
            // Remove class "d-inline" added in shortanswer renderer class, which prevents input from being hidden.
            $expInput.removeClass('d-inline');
            $parent = $('#' + $.escapeSelector(expName)).parent('.answer');

            input = new EditorInput($expInput, $parent);
            console.log("test value:  "+input.value);
            input.$input.hide();
            input.change();

            let $saveButton = $('#' + $.escapeSelector('save'));
            $saveButton.on('click', event => {
                event.preventDefault();
                /*if (lastFocusedInput !== null) {
                    this.onClick(lastFocusedInput.field);
                    lastFocusedInput.field.focus();
                }*/
                console.log("save");
                //console.log($expInput.val().replace(/[{}a-z0-9A-Z\s]/g, ''));
                //editorInput.save($btnInput, $expInput, controlsWrapper);
                let controls = new EditorControlList(controlsWrapper);
                controls.add($btnInput, $expInput);
            });
        }
    };
});
