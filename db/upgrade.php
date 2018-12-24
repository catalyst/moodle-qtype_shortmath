<?php
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
 * @package    qtype
 * @subpackage shortmath
 * @author     André Storhaug <andr3.storhaug@gmail.com>
 * @copyright  2018 NTNU
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();

function xmldb_qtype_shortmath_upgrade($oldversion) {
    global $DB;

    $dbman = $DB->get_manager();
    $result = true;

    if ($oldversion < 2018101500) {
        // Define field usecase to be removed from question_shortmath.
        $table = new xmldb_table('qtype_shortmath');
        $field1 = new xmldb_field('answers');
        $field2 = new xmldb_field('usehint');
        $field3 = new xmldb_field('studentshowalternate');

        // Delete fields.
        if ($dbman->field_exists($table, $field1)) {
            $dbman->drop_field($table, $field1);
        }
        if ($dbman->field_exists($table, $field2)) {
            $dbman->drop_field($table, $field2);
        }
        if ($dbman->field_exists($table, $field3)) {
            $dbman->drop_field($table, $field3);
        }

        // Rename table
        if ($dbman->table_exists($table)) {
            $dbman->rename_table($table, "qtype_shortmath_options");
        }

        // Savepoint reached.
        upgrade_plugin_savepoint(true, 2018101500, 'qtype', 'shortmath');
    }

    return true;
}
