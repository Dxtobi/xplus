import { json } from '@sveltejs/kit';
import { PAY_SECR } from '$env/static/private';
import { Transaction } from '$lib/server/db/models/index.js';
import { PUBLIC_BASE_URL } from '$env/static/public';

export async function POST({ request, locals }) {
    // console.log(locals.user)
const { amount: baseAmount, email } = await request.json();

if (!baseAmount || typeof baseAmount !== 'number' || baseAmount <= 0) {
	return json({ error: 'A valid amount is required.' }, { status: 400 });
}

// 1. Securely calculate the final amount on the server
const fee = baseAmount * 0.1;
const totalAmount = baseAmount + fee;
const amountInKobo = Math.round(totalAmount * 100);


// 2. Create a new transaction record in your database
const newTransaction = new Transaction({
	userId: locals.user._id,
	type: 'deposit', // Or 'campaign_payment', etc.
	amount: totalAmount, // Store the final amount in Naira
	currency: 'NGN',
	status: 'pending',
	description: `Payment of ₦ ${totalAmount.toFixed(2)}`,
	paymentMethod: 'paystack',
	metadata: {
		base_amount: baseAmount,
		service_fee: fee
	}
});

try {
	await newTransaction.save();
} catch (dbError) {
	console.error('Database Error:', dbError);
	return json({ error: 'Failed to create transaction record' }, { status: 500 });
}

// 3. Initialize Paystack payment
try {
	const paystackResponse = await fetch('https://api.paystack.co/transaction/initialize', {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${PAY_SECR}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			amount: amountInKobo,
			email:locals.user.email,
			// Crucial Step: Pass your internal transaction ID to Paystack
			reference: newTransaction._id.toString(),
			callback_url:`${PUBLIC_BASE_URL}/dashboard`,
			metadata: {
				internal_transaction_id: newTransaction._id.toString()
			}
		})
	});

	const data = await paystackResponse.json();

	if (data.status) {
		// Update your transaction with the external ID from Paystack
		newTransaction.externalTransactionId = data.data.reference;
		await newTransaction.save();
		
		return json({ authorization_url: data.data.authorization_url });
	} else {
		// If Paystack fails, mark the transaction as failed
		newTransaction.status = 'failed';
		await newTransaction.save();
		console.error('Paystack API Error:', data.message);
		return json({ error: 'Payment gateway failed to initialize' }, { status: 500 });
	}
} catch (error) {
	console.error('Server Error:', error);
	// Mark transaction as failed if there's a server error
	newTransaction.status = 'failed';
	await newTransaction.save();
	return json({ error: 'An internal server error occurred' }, { status: 500 });
}
}