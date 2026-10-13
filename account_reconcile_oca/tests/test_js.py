# Copyright 2025 Dixmit
# License AGPL-3.0 or later (https://www.gnu.org/licenses/agpl).
import odoo

from odoo.addons.web.tests.test_js import HootCommon, unit_test_error_checker


@odoo.tests.tagged("post_install", "-at_install")
class TestAccountReconcileOCAJS(HootCommon):
    """Test Account Reconcile OCA JS code"""

    @odoo.tests.no_retry
    def test_automation_oca(self):
        # Since 20.0, `WebSuite.test_unit_desktop` is a cross-module test that
        # cannot be called from a subclass: run the suite of this module only.
        module_filter = f"&id={self._generate_hash('@account_reconcile_oca')}"
        self.browser_js(
            "/web/tests?&headless&loglevel=2&preset=desktop&timeout=15000"
            + module_filter,
            "",
            "",
            login="admin",
            timeout=1800,
            success_signal="[HOOT] Test suite succeeded",
            error_checker=unit_test_error_checker,
        )
