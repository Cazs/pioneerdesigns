var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Enquiry Model
 * =============
 */

var Enquiry = new keystone.List('Enquiry', {
	nocreate: true,
	noedit: true,
});

Enquiry.add({
	name: { type: Types.Name, required: true },
	email: { type: Types.Email, required: true },
	phone: { type: String },
	enquiryType: { type: Types.Select, options: [
		{ value: 'message', label: 'Corner Suites' },
		{ value: 'message', label: 'Dining Room Chairs' },
		{ value: 'message', label: 'Period Designs and Carved Furniture' },
		{ value: 'message', label: 'Fabric Couches' },
		{ value: 'message', label: 'Leather Couches' },
		{ value: 'message', label: 'Occasional Chairs and Ottomans' },
		{ value: 'message', label: 'Headboards' },
		{ value: 'message', label: 'Bar Stools' },
		{ value: 'message', label: 'Just leaving a message' },
		{ value: 'question', label: 'I\'ve got a question' }
	] },
	message: { type: Types.Markdown, required: true },
	createdAt: { type: Date, default: Date.now },
});

Enquiry.schema.pre('save', function (next)
{
	this.wasNew = this.isNew;
	next();
});

Enquiry.schema.post('save', function ()
{
	if (this.wasNew)
	{
		this.sendNotificationEmail();
	}
});

Enquiry.schema.methods.sendNotificationEmail = function (callback)
{
	if (typeof callback !== 'function')
	{
		callback = function (err) 
		{
			if (err)
			{
				console.error('There was an error sending the notification email:', err);
			}
		};
	}

	if (!process.env.MAILGUN_API_KEY || !process.env.MAILGUN_DOMAIN)
	{
		console.log('Unable to send email - no mailgun credentials provided');
		return callback(new Error('could not find mailgun credentials'));
	}

	var enquiry = this;
	var brand = keystone.get('brand');

	new keystone.Email(
	{
		templateName: 'enquiry-notification',
		transport: 'mailgun',
	}).send({
		to: 'info@pioneerdesigns.co.za',
		from: {
			name: 'Pioneer Designs Website',
			email: 'info@pioneerdesigns.co.za',
		},
		subject: 'New Enquiry from ' + enquiry.name,
		enquiry: enquiry,
		brand: brand,
	}, callback);
};

Enquiry.defaultSort = '-createdAt';
Enquiry.defaultColumns = 'name, email, enquiryType, createdAt';
Enquiry.register();