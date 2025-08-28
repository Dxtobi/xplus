import { json } from '@sveltejs/kit';
import { User } from '$lib/server/db/models/index'; // Your Mongoose User model
import { PAY_SECR } from '$env/static/private';

export async function POST({ request, locals }) {
	const user = locals.user; // Assuming user is populated from hooks
	if (!user) {
		return json({ message: 'Authentication required' }, { status: 401 });
	}

	const { bankCode, accountNumber } = await request.json();
	
	if (!bankCode || !accountNumber) {
		return json({ message: 'Bank code and account number are required' }, { status: 400 });
	}

	try {
		// 1. Call Paystack to create a transfer recipient
		const paystackResponse = await fetch('https://api.paystack.co/transferrecipient', {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${PAY_SECR}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				type: 'nuban',
				name: user.name, // Or a more specific name
				account_number: accountNumber,
				bank_code: bankCode,
				currency: 'NGN'
			})
		});

		const data = await paystackResponse.json();

		if (!data.status) {
			return json({ message: data.message || 'Failed to verify account details with Paystack.' }, { status: 400 });
		}

		const recipient = data.data;

		// 2. Save the recipient details to your User model
		await User.findByIdAndUpdate(user.id, {
			paystackRecipientCode: recipient.recipient_code,
			bankName: recipient.details.bank_name,
			accountNumberLast4: recipient.details.account_number.slice(-4)
		});

		return json({
			message: 'Bank account added successfully!',
			recipientCode: recipient.recipient_code,
			bankName: recipient.details.bank_name,
			accountNumberLast4: recipient.details.account_number.slice(-4)
		});

	} catch (error) {
		console.error('Add Recipient Error:', error);
		return json({ message: 'An internal server error occurred.' }, { status: 500 });
	}
}