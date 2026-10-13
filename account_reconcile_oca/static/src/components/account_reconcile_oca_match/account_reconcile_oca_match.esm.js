import {Component, t, useProps} from "@odoo/owl";
import {View} from "@web/views/view";
import {evaluateBooleanExpr} from "@web/core/py_js/py";
import {getFieldContext} from "@web/model/relational_model/utils";
import {registry} from "@web/core/registry";
import {standardFieldProps} from "@web/views/fields/standard_field_props";
import {useSubEnv} from "@web/owl2/utils";

export class AccountReconcileMatchWidget extends Component {
    static template = "account_reconcile_oca.ReconcileMatchWidget";
    static components = {View};
    props = useProps({
        ...standardFieldProps,
        placeholder: t.string().optional(),
        canOpen: t.boolean().optional(),
        canCreate: t.boolean().optional(),
        canWrite: t.boolean().optional(),
        canQuickCreate: t.boolean().optional(),
        canCreateEdit: t.boolean().optional(),
        domain: t.or([t.array(), t.function()]).optional(),
        decorations: t.object().optional(),
    });

    setup() {
        const widget = this;
        useSubEnv({
            // Necessary in order to avoid a loop
            config: {},
            parentController: this.env.parentController,
            // Owl 3 components only receive the props they declare, so the
            // embedded list reads the record being reconciled from the env.
            reconcileParent: {
                get record() {
                    return widget.props.record;
                },
                get field() {
                    return widget.props.name;
                },
            },
        });
    }

    getDomain() {
        let domain = this.props.domain;
        if (typeof domain === "function") {
            domain = domain();
        }
        return domain;
    }
    get listViewProperties() {
        return {
            type: "list",
            display: {
                controlPanel: {
                    // Hiding the control panel buttons
                    "top-left": false,
                    "bottom-left": true,
                    layoutActions: false,
                },
            },
            noBreadcrumbs: true,
            resModel: this.props.record.fields[this.props.name].relation,
            searchMenuTypes: ["filter"],
            domain: this.getDomain(),
            context: getFieldContext(this.props.record, this.props.name),
            // Disables selector
            allowSelectors: false,
            // We need to force the search view in order to show the right one
            searchViewId: false,
        };
    }
}

export const AccountReconcileMatchWidgetField = {
    component: AccountReconcileMatchWidget,
    supportedTypes: ["many2one"],
    extractProps({attrs, decorations, options}, dynamicInfo) {
        const hasCreatePermission = attrs.can_create
            ? evaluateBooleanExpr(attrs.can_create)
            : true;
        const hasWritePermission = attrs.can_write
            ? evaluateBooleanExpr(attrs.can_write)
            : true;
        const canCreate = options.no_create ? false : hasCreatePermission;
        return {
            placeholder: attrs.placeholder,
            canOpen: !options.no_open,
            canCreate,
            canWrite: hasWritePermission,
            canQuickCreate: canCreate && !options.no_quick_create,
            canCreateEdit: canCreate && !options.no_create_edit,
            decorations,
            domain: dynamicInfo.domain,
        };
    },
};

registry
    .category("fields")
    .add("account_reconcile_oca_match", AccountReconcileMatchWidgetField);
