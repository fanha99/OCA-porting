import {ListController} from "@web/views/list/list_controller";

export class ReconcileMoveLineController extends ListController {
    /**
     * The record being reconciled and the name of its field that receives the
     * selected counterpart, provided by the `account_reconcile_oca_match` widget.
     */
    get parentRecord() {
        return this.env.reconcileParent.record;
    }
    get parentField() {
        return this.env.reconcileParent.field;
    }
    async openRecord(record) {
        // Selecting a counterpart updates the parent record, which re-renders
        // the whole reconcile form and reloads this list. Keep the scroll
        // position of the right panel so the user stays where they were (the
        // current page is preserved by ReconcileMoveLineModel).
        const scroller = document.querySelector(".o_account_reconcile_oca_info");
        const scrollTop = scroller ? scroller.scrollTop : null;
        var data = {};
        data[this.parentField] = {
            id: record.resId,
            display_name: record.display_name,
        };
        await this.parentRecord.update(data);
        if (scroller && scrollTop !== null) {
            // The update re-renders the form asynchronously, so restore the
            // scroll across the next couple of frames to make sure it sticks
            // once the DOM has been patched.
            const restore = () => {
                scroller.scrollTop = scrollTop;
            };
            restore();
            requestAnimationFrame(() => {
                restore();
                requestAnimationFrame(restore);
            });
        }
    }
    async clickAddAll() {
        const parentRecord = this.parentRecord;
        await parentRecord.save();
        await this.model.orm.call(parentRecord.resModel, "add_multiple_lines", [
            parentRecord.resIds,
            this.model.root.domain,
        ]);
        await parentRecord.load();
        parentRecord.model.notify();
    }
}
