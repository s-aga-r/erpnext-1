// Copyright (c) 2020, Frappe Technologies Pvt. Ltd. and contributors
// For license information, please see license.txt

frappe.ui.form.on('Twitter Settings', {
	onload: (frm) => {
		if (frm.doc.session_status == 'Expired' && frm.doc.consumer_key && frm.doc.consumer_secret){
			frappe.confirm(
				__('Session not valid, Do you want to login?'),
				() => {
					frm.trigger('login');
				},
			);
		}
		frm.dashboard.set_headline(__('For more information, {0}.', [`<a target='_blank' href='https://docs.erpnext.com/docs/user/manual/en/twitter-settings'>${__('click here')}</a>`]));
	},

	refresh: (frm) => {
		let msg, color, flag=false;

		if (frm.doc.session_status == 'Active') {
			msg = __('Session Active');
			color = 'green';
			flag = true;
		}
		else if(frm.doc.consumer_key && frm.doc.consumer_secret) {
			msg = __('Session Not Active. Save doc to login.');
			color = 'red';
			flag = true;
		}

		if (flag) {
			frm.dashboard.set_headline_alert(
				`<div class="row">
					<div class="col-xs-12">
						<span class="indicator whitespace-nowrap ${color}"><span class="hidden-xs">${msg}</span></span>
					</div>
				</div>`
			);
		}
	},

	login: (frm) => {
		if (frm.doc.consumer_key && frm.doc.consumer_secret){
			frappe.dom.freeze();
			frappe.call({
				doc: frm.doc,
				method: 'get_authorize_url',
				callback : (r) => {
					window.location.href = r.message;
				}
			}).fail(() => {
				frappe.dom.unfreeze();
			});
		}
	},

	after_save: (frm) => {
		frm.trigger('login');
	}
});
