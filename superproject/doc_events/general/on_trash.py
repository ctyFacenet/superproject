import frappe

def remove_from_display(doc, method):
    display = frappe.get_single("Display")
    print(doc.name, doc.module, doc.doctype)

    display.items = [
        i for i in display.items
        if not (
            i.link_to == doc.name
            and i.module == doc.module
            and i.type == doc.doctype
        )
    ]

    display.save(ignore_permissions=True)