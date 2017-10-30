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
		{ value: 'Corner Suites', label: 'Corner Suites' },
		{ value: 'Dining Room Chairs', label: 'Dining Room Chairs' },
		{ value: 'Period Designs and Carved Furniture', label: 'Period Designs and Carved Furniture' },
		{ value: 'Fabric Couches', label: 'Fabric Couches' },
		{ value: 'Leather Couches', label: 'Leather Couches' },
		{ value: 'Occasional Chairs and Ottomans', label: 'Occasional Chairs and Ottomans' },
		{ value: 'Headboards', label: 'Headboards' },
		{ value: 'Bar Stools', label: 'Bar Stools' },
		{ value: 'Just leaving a message', label: 'Just leaving a message' },
		{ value: 'A Question', label: 'I\'ve got a question' }
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
	var enquiry = this;
	var mailjet = require('node-mailjet').connect('f8d3d1d74c95250bb2119063b3697082','8304b30da4245632c878bf48f1d65d92');
	var message = "this is a test";
	//send email notification to stakeholders
	var request = mailjet.post("send").request(
	{
		"FromName": enquiry.name.first+" "+enquiry.name.last,
		"FromEmail": "system@pioneerdesigns.co.za",
		"Subject": "New Enquiry From " + enquiry.name.first + " " + enquiry.name.last + " about " + enquiry.enquiryType,
		//"Text-part": enquiry.name.first + " " + enquiry.name.last +" says,\n" + enquiry.message.html,
		"Html-part": enquiry.name.first+" "+enquiry.name.last+" enquired about "+enquiry.enquiryType +",<br/><br/>"
					+ "Phone:" + enquiry.phone + "<br/>" +
					+ "Message:<br/>" + enquiry.message.html,
		"Recipients":
		[
			{
				"Email": "info@pioneerdesigns.co.za"
			}
		]
		}, function(err, res)
		{
			if(err)
			{
				console.log('email send error: %s', err);
				if(callback)
					callback(err);
				return;
			}
			console.log('email sent to [info@pioneerdesigns.co.za].');
			//send email to user/client as well.
			var msg = "<p>Hi " + enquiry.name.first+",<br/>We've received your enquiry about " + enquiry.enquiryType
						" and one of our consultants will get back to you soon.</p><br/><br/>";
				msg += "<h3>Your message was:</h3><br/><i>" + enquiry.message.html + "</i><br/><br/>";
				msg += "<h3>Thank you!</h3><br/><br/>Kindest Regards,<br/>Pioneer Designs Team.";
			request = mailjet.post("send").request(
			{
				"FromName": "Pioneer Designs",
				"FromEmail": "system@pioneerdesigns.co.za",
				"Subject": "Enquiry Receipt",
				//"Text-part": msg,
				"Html-part": msg,
				"Recipients":
				[
					{
						"Email": enquiry.email
					}
				]
			}, function(err, res)
			{
				if(err)
				{
					console.log('could not send email to [%s]: %s', enquiry.email, err);
				}else
				{
					console.log('email successfully sent to [%s] ', enquiry.email);
				}
				if(callback)
					callback(err);
			});
		}
	);

	/*if (typeof callback !== 'function')
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
		to: 'casperndlovu42@gmail.com',//'info@pioneerdesigns.co.za',
		from: {
			name: 'Pioneer Designs Website',
			email: 'info@pioneerdesigns.co.za',
		},
		subject: 'New Enquiry from ' + enquiry.name,
		enquiry: enquiry,
		brand: brand,
	}, callback);*/
};

Enquiry.defaultSort = '-createdAt';
Enquiry.defaultColumns = 'name, email, enquiryType, createdAt';
Enquiry.register();