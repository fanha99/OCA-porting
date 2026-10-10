from odoo.tests.common import TransactionCase


class AccountUsabilityTest(TransactionCase):
    def test_tag_accounts(self):
        tag = self.env["account.account.tag"].create(
            {"name": "Test Tag", "applicability": "accounts"}
        )
        account = self.env["account.account"].create(
            {"code": "100199", "name": "Test Account", "tag_ids": [(4, tag.id)]}
        )
        account_2 = self.env["account.account"].create(
            {"code": "200099", "name": "Test Account 2"}
        )

        self.assertIn(account, tag.account_ids)
        self.assertNotIn(account_2, tag.account_ids)

        tag.account_ids = [(4, account_2.id)]
        self.assertIn(tag, account_2.tag_ids)

    def test_tax_group_taxes(self):
        tax_group = self.env["account.tax.group"].create({"name": "Test Tax Group"})
        tax = self.env["account.tax"].create(
            {"name": "Test Tax", "amount": 10, "tax_group_id": tax_group.id}
        )

        self.assertEqual(tax_group.tax_ids, tax)

    def test_settings_related_fields(self):
        company = self.env.company
        settings = self.env["res.config.settings"].create(
            {
                "anglo_saxon_accounting": True,
                "fiscalyear_last_day": 30,
                "fiscalyear_last_month": "6",
            }
        )
        settings.execute()

        self.assertTrue(company.anglo_saxon_accounting)
        self.assertEqual(company.fiscalyear_last_day, 30)
        self.assertEqual(company.fiscalyear_last_month, "6")
