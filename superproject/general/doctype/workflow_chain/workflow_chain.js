// Copyright (c) 2025, FaceNet and contributors
// For license information, please see license.txt

frappe.ui.form.on("Workflow Chain", {
	refresh(frm) {
        const core_modules = [
            'Automation', 'Social', 'Contacts', 'Printing', 'Integrations',
            'Desk', 'Geo', 'Custom', 'Email', 'Workflow', 'Website', 'Core'
        ];

        frm.set_query('start_chain', function() {
            return {
                filters: [
                    ['module', 'not in', core_modules]
                ]
            };
        })

        frm.set_query('end_chain', function() {
            return {
                filters: [
                    ['module', 'not in', core_modules]
                ]
            };
        })
	},

    end_chain: async function(frm) {
        if (frm.doc.start_chain) frm.set_value("chain_name", frm.doc.start_chain.toLowerCase() || null)
        if (!frm.doc.end_chain) return
        let res = await frappe.xcall(
            "superproject.general.doctype.workflow_chain.workflow_chain.get_mapping_fields", 
            {start_chain: frm.doc.start_chain, end_chain: frm.doc.end_chain}
        )
        frm.clear_table("items")
        res.forEach(row => {
            let new_row = frm.add_child("items");
            new_row.start_field = row.start_field;
            new_row.end_field = row.end_field;
        });

        frm.refresh_field("items");        
    }
});
