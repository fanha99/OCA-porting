import {Notebook} from "@web/core/notebook/notebook";
import {onWillDestroy} from "@odoo/owl";

export class ReconcileFormNotebook extends Notebook {
    setup() {
        super.setup(...arguments);
        const onPageNavigate = this.onPageNavigate.bind(this);
        this.env.bus.addEventListener("RECONCILE_PAGE_NAVIGATE", onPageNavigate);

        onWillDestroy(() => {
            this.env.bus.removeEventListener("RECONCILE_PAGE_NAVIGATE", onPageNavigate);
        });
    }
    async activatePage(pageIndex) {
        await super.activatePage(...arguments);
        const page = this.pages().find((e) => e[0] === pageIndex);
        if (page && page[1].name === "manual" && this.state.currentPage === pageIndex) {
            this.selectCounterpartLine();
        }
    }
    /**
     * When the manual page is opened from its tab, the liquidity line is not
     * the one to edit: select the first counterpart line instead.
     */
    selectCounterpartLine() {
        const record = this.env.model?.root;
        const lines = record?.data.reconcile_data_info?.data;
        if (!lines || !("manual_reference" in record.data)) {
            return;
        }
        const current = lines.find(
            (line) => line.reference === record.data.manual_reference
        );
        if (current && current.kind !== "liquidity") {
            return;
        }
        const counterpart = lines.find((line) => line.kind !== "liquidity");
        if (counterpart) {
            record.update({manual_reference: counterpart.reference});
        }
    }
    onPageNavigate(ev) {
        for (const page of this.pages()) {
            if (
                ev.detail.detail.name === page[1].name &&
                this.state.currentPage !== page[0]
            ) {
                ev.preventDefault();
                ev.detail.detail.originalEv.preventDefault();
                this.state.currentPage = page[0];
                return;
            }
        }
    }
}
