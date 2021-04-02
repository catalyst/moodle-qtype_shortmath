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
 * @author     Sushanth Kotyan <sushanthkotian.s@gmail.com>
 * @copyright  2020 NTNU
 */

import Ajax from "core/ajax";
import notification from "core/notification";
import Ajax from "../../../../lib/amd/build/ajax.min.js";
/**
 * @module qtype_shortmath/editor-manager
 */
// import * as Str from "core/str";

export const initialize = (editorPath, pluginSettingsPath) => {
    document.querySelectorAll(".edit-template, .delete-template").forEach(element => {

    });
    // $('.edit-template, .delete-template').each((index, element) => {
    //     $(element).tooltip({
    //         container: element.parentElement
    //     });
    // });

    document.querySelectorAll(".text-truncate").forEach(element => {
        if (element.offsetWidth < element.scrollWidth) {
            // If the element overflows its parent, show
            // a popover (???) when you hover over
            // the element
        }
    });

    // $('.text-truncate').each((index, element) => {
    //     let $ele = $(element);
    //     if (element.offsetWidth < element.scrollWidth) {
    //         $ele.popover({
    //             container: element,
    //             delay: {
    //                 show: 0,
    //                 delay: 300
    //             },
    //             placement: 'top',
    //             trigger: 'hover'
    //         });
    //     } else {
    //         $ele.attr('title', '');
    //     }
    // });


    document.querySelectorAll(".edit-template").forEach(element => {
        element.addEventListener("click", event => {
            event.preventDefault();
            const form = event.target.closest(".template-box").querySelector("form");
            form.setAttribute("action", editorPath);
            form.setAttribute("method", "post");
            form.submit();
        });
    });

    document.querySelectorAll(".delete-template").forEach(deleteButton => {
        deleteButton.addEventListener("click", event => {
            event.preventDefault();

            const form = event.target.closest(".template-box").querySelector("form");
            const templateId = form.querySelector(`input[name="templateId"]`).value;
            const templateName = form.querySelector(`input[name="templateName"]`).value;

            // title, question, saveLabel, saveCallback, cancelCallback
            notification.saveCancel(`Delete Template <b>${templateName}</b>`,
                `Delete Template <b>${templateName}</b> from database?`,
                "Delete", () => {
                // TODO: Clear notifications
                //
                Ajax.call([{
                    methodname: "qtype_shortmath_delete_template",
                    args: { questionid: templateId },
                    done: response => {
                        XD(response);
                        XD("wejfoiewjfewoije");
                    },
                    fail: notification.exception
                }]);
            });
        });
    });

    // $('.delete-template').click(event => {
    //     event.preventDefault();

    //     let $templateBox = $(event.target).closest('.template-box');
    //     let $form = $templateBox.find('form');
    //     let id = $form.find('input[name="templateId"]').val();

    //     notification.confirm('Delete Template',
    //         `Delete<b>&nbsp;${$form.find('input[name="templateName"]').val()}&nbsp;</b>from database?`,
    //         'OK', 'Cancel', () => {
    //             // Clear notifications
    //             $('.alert').alert('close');

    //             $.post(actionPath,
    //                 {
    //                     'id': id,
    //                     'type': 'delete'
    //                 }
    //             ).done(message => {
    //                 if (message > 0) {
    //                     notification.addNotification({
    //                         message: "Template deleted!",
    //                         type: "success"
    //                     });
    //                     $templateBox.remove();
    //                 } else {
    //                     notification.addNotification({
    //                         message: "Something went wrong!",
    //                         type: "error"
    //                     });
    //                 }
    //             }).fail((jqXHR, textStatus, errorThrown) => {
    //                 notification.addNotification({
    //                     message: textStatus + ': ' + errorThrown,
    //                     type: "error"
    //                 });
    //             });
    //         });
    // });

    document.querySelector("#back").addEventListener("click", event => {
        event.preventDefault();
        window.location.replace(pluginSettingsPath);
    });

    document.querySelector("#createTemplates").addEventListener("click", event => {
        event.preventDefault();
        window.location.replace(editorPath);
    });

    // $('#' + $.escapeSelector('back')).click(event => {
    //     event.preventDefault();
    //     window.location.replace(pluginSettingsPath);
    // });

    // $('#' + $.escapeSelector('createTemplates')).click(event => {
    //     event.preventDefault();
    //     window.location.replace(editorPath);
    // });
};
