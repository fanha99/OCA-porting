import {
    BadgesMany2oneField,
    badgesMany2oneField,
} from "@web/views/fields/badges_many2one/badges_many2one_field";
import {registry} from "@web/core/registry";

// Since 20.0 the many2one badges field can deselect its value by itself
// (`canDeselect`), but only when the field is not required. This widget keeps
// its historical behaviour: clicking the selected badge always clears the field.
export class FieldSelectionBadgeUncheck extends BadgesMany2oneField {}

export const FieldSelectionBadgeUncheckField = {
    ...badgesMany2oneField,
    component: FieldSelectionBadgeUncheck,
    supportedTypes: ["many2one"],
    extractProps(fieldInfo, dynamicInfo) {
        return {
            ...badgesMany2oneField.extractProps(fieldInfo, dynamicInfo),
            canDeselect: true,
        };
    },
};
registry
    .category("fields")
    .add("selection_badge_uncheck", FieldSelectionBadgeUncheckField);
